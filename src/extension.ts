import * as path from 'path';
import * as vscode from 'vscode';
import ContentProvider from './ContentProvider';
import Manager from './Manager';

export function activate(context: vscode.ExtensionContext) {
	let currentPanel: vscode.WebviewPanel | undefined = undefined;
	const contentProvider = new ContentProvider();
	const disposable = vscode.commands.registerCommand('grapes.showPanel', () => {
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
		const content = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.getText() : '';
		currentPanel.webview.html = contentProvider.getContent(context, content);

		const manager = new Manager(currentPanel);

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