import * as vscode from "vscode";

export default class Manager {
	private activeEditor: vscode.TextEditor | undefined;
	private panel: vscode.WebviewPanel;

	constructor(panel: vscode.WebviewPanel) {
		this.panel = panel;

		vscode.window.onDidChangeActiveTextEditor(activeEditor => {
			if (activeEditor && activeEditor.document.languageId === "html") {
				this.activeEditor = activeEditor
			}
		});

		vscode.workspace.onDidChangeTextDocument(({ document }) => {
			if (this.activeEditor && this.isAcceptableLaguage(document.languageId)) {
				const content = this.activeEditor.document.getText();
				this.panel.webview.postMessage({
					command: 'change',
					content
				})
			}
		});
	}

	isAcceptableLaguage(languageId: string) {
		return (languageId === 'html')
	}
}