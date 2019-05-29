import * as path from 'path';
import * as vscode from 'vscode';
import ContentProvider from './ContentProvider';

export function activate(context: vscode.ExtensionContext) {
	const contentProvider = new ContentProvider();
	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	let disposable = vscode.commands.registerCommand('grapes.showPanel', () => {
		if (currentPanel) {
			currentPanel.reveal(vscode.ViewColumn.Two)
		} else {
			currentPanel = vscode.window.createWebviewPanel(
				'grapes',
				'Grapes',
				vscode.ViewColumn.Two,
				{
					enableScripts: true,
					retainContextWhenHidden: true
				}
			)
		}

		currentPanel.webview.html = contentProvider.getContent(context);

		currentPanel.webview.onDidReceiveMessage(
			message => {

			},
			undefined,
			context.subscriptions
		);

		currentPanel.onDidDispose(
			() => {
				currentPanel = undefined;
			},
			null,
			context.subscriptions
		);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {};