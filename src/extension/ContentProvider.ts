import { Uri, ExtensionContext } from 'vscode';
import * as cheerio from 'cheerio';
import { join } from 'path';
import PluginsManager from './PluginsManager';
import { getNonce } from './utils';

export default class ContentProvider {
  public static getContent(context: ExtensionContext, content?: string | undefined) {
    const plugins = PluginsManager.getAll();
    const pluginsFiles = plugins.map(({ path }) => {
      return Uri.file(path || '').with({ scheme: 'vscode-resource' });
    });
    const vendorsUri = Uri.file(
      join(context.extensionPath, '/out/ui/vendors.bundle.js')
    ).with({ scheme: 'vscode-resource' });
    const scriptUri = Uri.file(join(context.extensionPath, '/out/ui/app.bundle.js')).with({
      scheme: 'vscode-resource'
    });

    const nonce = getNonce();

    return `<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="UTF-8">
	
							<!--
							Use a content security policy to only allow loading images from https or from our extension directory,
							and only allow scripts that have a specific nonce.
							-->
							<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data: vscode-resource: https: http:; style-src 'unsafe-inline' vscode-resource: https: http:; script-src 'nonce-${nonce}' 'unsafe-eval' https: http:; font-src 'self' data: 'unsafe-inline' vscode-resource: https: http:;">
	
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>GrapesJS</title>
							<script nonce="${nonce}" src="${vendorsUri}"></script>
							${pluginsFiles
                .map(
                  plugin =>
                    `<script nonce="${nonce}" src="${plugin ? plugin : ''}"></script>`
                )
                .join('')}
							<script nonce="${nonce}">
								window.plugins = ${JSON.stringify(plugins.map(plugin => (plugin ? plugin.name : '')))}
								window.pluginsOptions = ${JSON.stringify(
                  plugins.map(plugin =>
                    plugin ? { options: plugin.options, name: plugin.name } : {}
                  )
                )}
							</script>
						</head>
						<body>
							<div id="root">								
								<div class="editor-row">
									<div class="editor-canvas">
										<div id="gjs">
											${content || this.getTemplate()}
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
			</html>`;
    }

    return this._addCssInHtml(mockup, css);
  }

  private static getTemplate() {
    return `<!DOCTYPE html>
		<html>
			<head>
				<link href="https://fonts.googleapis.com/css?family=Signika&display=swap" rel="stylesheet">
				<style>
					html, body {
						margin: 0;
						padding: 0;
						height: 100%;
					}
					body {
						position: relative;
						font-family: Arial, Helvetica, sans-serif;
						background: linear-gradient(#101452 10%, #131862 55%, #546bab);
					}
					.jumbotron {
						margin: 0;
						padding: 50px;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						border-radius: 25%;
						color: #fff;
					}
					.jumbotron h1 {
						font-family: 'Signika', sans-serif;
						text-transform: uppercase;
						text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff0080, 0 0 30px #ff0080, 0 0 40px #ff0080;
					}
					.text-center {
						text-align: center;
					}
				</style>
			</head>
			<body>
				<div class="jumbotron">
					<h1 class="text-center">Ready to Build <br/>with GrapesJS&nbsp;!!!</h1>
				</div>
			</body>
		</html>`;
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
