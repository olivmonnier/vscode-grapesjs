import { Uri, ExtensionContext } from 'vscode';
import * as cheerio from 'cheerio';
import { join } from "path";
import PluginsManager from './PluginsManager';
import { getNonce } from './utils';

export default class ContentProvider {
	public static getContent(context: ExtensionContext, content?: string | undefined) {
		const plugins = PluginsManager.getAll() || [];
		const pluginsFiles = plugins.map(plugin => {
			if (plugin) {
				const path = Uri.file(plugin.path)
				return path.with({ scheme: 'vscode-resource' })
			}
		}).filter(Boolean);
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
							${pluginsFiles.map(plugin => `<script nonce="${nonce}" src="${plugin ? plugin : ''}"></script>`).join('')}
							<script nonce="${nonce}">
								window.plugins = ${JSON.stringify(plugins.map(plugin => plugin ? plugin.name : ''))}
								window.pluginsOptions = ${JSON.stringify(plugins.map(plugin => plugin ? { options: plugin.options, name: plugin.name } : {}))}
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

	public static exportMockup(html: string, css: string) { 
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

	private static _isHeadInHtml(html: string) {
		const $ = cheerio.load(html);

		return $('head').length > 0;
	}

	private static _addCssInHtml(html: string, css: string) {
		const $ = cheerio.load(html);

		$('head').append(`<style>${css}</style>`);

		return $.html();
	}
}