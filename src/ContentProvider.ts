import { Uri, ExtensionContext, Extension } from "vscode";
import { join } from "path";

export default class ContentProvider {
	getContent(context: ExtensionContext, content?: string | undefined) {
		const vendorsPathOnDisk = Uri.file(
			join(context.extensionPath, 'public', 'build', 'vendors.bundle.js')
		);
		const vendorsUri = vendorsPathOnDisk.with({ scheme: 'vscode-resource' });
		const scriptPathOnDisk = Uri.file(
			join(context.extensionPath, 'public', 'build', 'app.bundle.js')
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
										</div>
									</div>
								</div>
							</div>
							<script nonce="${nonce}" src="${scriptUri}"></script>
						</body>
						</html>`;
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