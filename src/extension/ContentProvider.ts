import * as vscode from "vscode";
import { Uri, ExtensionContext, WorkspaceConfiguration } from 'vscode';
import * as cheerio from 'cheerio';
import { join } from "path";
import * as fs from 'fs';

export default class ContentProvider {
	public getContent(context: ExtensionContext, content?: string | undefined) {
		const plugins = this.getPlugins();
		const vendorsPathOnDisk = Uri.file(
			join(context.extensionPath, 'out', 'ui', 'vendors.bundle.js')
		);
		const vendorsUri = vendorsPathOnDisk.with({ scheme: 'vscode-resource' });
		const scriptPathOnDisk = Uri.file(
			join(context.extensionPath, 'out', 'ui', 'app.bundle.js')
		);
		const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
		const nonce = getNonce();
	
		return `<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="UTF-8">
	
							<!--
							Use a content security policy to only allow loading images from https or from our extension directory,
							and only allow scripts that have a specific nonce.
							-->
							<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data: vscode-resource: https:; style-src 'unsafe-inline' vscode-resource: https:; script-src 'nonce-${nonce}' 'unsafe-eval' https:; font-src 'self' data: 'unsafe-inline' vscode-resource: https:;">
	
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>GrapesJS</title>
							<script nonce="${nonce}" src="${vendorsUri}"></script>
							<script nonce="${nonce}">
								window.plugins = ${JSON.stringify(plugins)}
							</script>
						</head>
						<body>
							<div id="root">
								
								<div class="editor-row">
									<div class="editor-canvas">
										<div id="gjs">
											${content || "<h1>Hello World Component!</h1>"}
										</div>
									</div>
									<div class="panel__right">
										<div class="panel__switcher"></div>
										<div class="panel__content">
											<div class="layers-container"></div>
											<div class="styles-container" style="display: none;"></div>
											<div class="traits-container" style="display: none;"></div>
											<div class="blocks-container" style="display: none;"></div>
										</div>
										<div class="panel__basic-actions"></div>
									</div>
								</div>
							</div>
							<script nonce="${nonce}" src="${scriptUri}"></script>
						</body>
						</html>`;
	}

	public getPlugins() {
		if (vscode.workspace.workspaceFolders) {
			const pluginsFolderPath: string = vscode.workspace.getConfiguration().get('grapes.pluginsFolder') || './';
			const workspaceFolderPath = vscode.workspace.workspaceFolders[0].uri.fsPath

			if (workspaceFolderPath) {
				const srcPath = join(workspaceFolderPath, pluginsFolderPath)
				const pluginsFolders = this._getDirectories(srcPath)
				const pluginsConfig = pluginsFolders.map(folder => this._getPluginConfig(join(srcPath, folder)))
				
				return pluginsConfig.map((config, i) => {
					if (config) {
						return this._loadPlugin(join(srcPath, pluginsFolders[i]), config)
					}
				}).filter(Boolean)
			} 
		}
	}

	public exportMockup(html: string, css: string) { 
		let mockup;

		if (this._isHeadInHtml(html)) {
			mockup = html;
		} else {
			mockup = `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title></title>
				</head>
				<body>${html}</body>
			</html>`
		}
		
		return this._addCssInHtml(mockup, css);
	}

	private _isHeadInHtml(html: string) {
		const $ = cheerio.load(html);

		return $('head').length > 0;
	}

	private _addCssInHtml(html: string, css: string) {
		const $ = cheerio.load(html);

		$('head').append(`<style>${css}</style>`);

		return $.html();
	}

	private _getDirectories(srcPath: string) {
		return fs.readdirSync(srcPath).filter(file => fs.statSync(join(srcPath, file)).isDirectory())
	}

	private _getPluginConfig(srcPath: string) {
		if (fs.existsSync(join(srcPath, 'package.json'))) {
			try {
				const contentConfig = fs.readFileSync(join(srcPath, 'package.json')).toString('utf8')
				const jsonConfig = JSON.parse(contentConfig)

				return Object.assign(getNestedObject(jsonConfig, ['vscode', 'grapesjs']), {
					name: jsonConfig.name || ''
				});
			} catch(err) {
				vscode.window.showErrorMessage(err.message || err)
			}
		}
	}

	private _loadPlugin(srcPath: string, config: { lib: string, name: string, options?: any }) {
		const { lib, name, options } = config;
		const path = join(srcPath, lib);

		if (fs.existsSync(path)) {
			return { 
				content: fs.readFileSync(path, 'utf8'), 
				options: options || {}, 
				name 
			}
		}
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function getNestedObject(nestedObj: any, pathArr: Array<string>) {
	return pathArr.reduce((obj, key) =>
			(obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}