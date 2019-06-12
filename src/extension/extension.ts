import * as vscode from 'vscode';
import Manager from './Manager';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('grapes.showPanel', () => {
			Manager.createOrShow(context)
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('grapes.test', () => {
			console.log('test')
		})
	);

	if (vscode.window.registerWebviewPanelSerializer) {
		vscode.window.registerWebviewPanelSerializer(Manager.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				Manager.revive(webviewPanel, context);
			}
		});
	}
}

export function deactivate() {};