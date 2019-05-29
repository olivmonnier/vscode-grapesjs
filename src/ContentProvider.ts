import { Uri, ExtensionContext, Extension } from "vscode";
import { join } from "path";

export default class ContentProvider {
	getContent(context: ExtensionContext, content?: string | undefined) {
		const scriptPathOnDisk1 = Uri.file(
			join(context.extensionPath, 'public', 'js', 'grapes.min.js')
		);
		const scriptUri1 = scriptPathOnDisk1.with({ scheme: 'vscode-resource' });
		const scriptPathOnDisk2 = Uri.file(
			join(context.extensionPath, 'public', 'js', 'app.js')
		);
		const scriptUri2 = scriptPathOnDisk2.with({ scheme: 'vscode-resource' });
	
		const stylePathOnDisk1 = Uri.file(
			join(context.extensionPath, 'public', 'css', 'grapes.min.css')
		)
		const styleUri1 = stylePathOnDisk1.with({ scheme: 'vscode-resource' });
		const stylePathOnDisk2 = Uri.file(
			join(context.extensionPath, 'public', 'css', 'styles.css')
		)
		const styleUri2 = stylePathOnDisk2.with({ scheme: 'vscode-resource' });
	
		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();
	
		return `<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="UTF-8">
	
							<!--
							Use a content security policy to only allow loading images from https or from our extension directory,
							and only allow scripts that have a specific nonce.
							-->
							<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; style-src 'unsafe-inline' vscode-resource: https:; script-src 'nonce-${nonce}' 'unsafe-eval' https:; font-src vscode-resource: https:;">
	
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>Cat Coding</title>
							<link rel="stylesheet" href="${styleUri1}">
							<link rel="stylesheet" href="${styleUri2}">
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
	
							<script nonce="${nonce}" src="${scriptUri1}"></script>
							<script nonce="${nonce}" src="${scriptUri2}"></script>
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