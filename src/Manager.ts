import * as vscode from "vscode";
import { debounced } from './utils';

export default class Manager {
	private activeEditor: vscode.TextEditor | undefined;
	private panel: vscode.WebviewPanel;

	constructor(panel: vscode.WebviewPanel) {
		this.panel = panel;

		vscode.window.onDidChangeActiveTextEditor(activeEditor => {
			if (activeEditor && this.isAcceptableLaguage(activeEditor.document.languageId)) {
				this.activeEditor = activeEditor
			}
		});

		vscode.workspace.onDidChangeTextDocument(debounced(1500, this.onChangeTextDocument.bind(this)));
	}

	private onChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
		const { document } = event;
		if (this.activeEditor && this.isAcceptableLaguage(document.languageId)) {
			const content = this.activeEditor.document.getText();
			this.panel.webview.postMessage({
				command: 'change',
				content
			})
		}
	}

	isAcceptableLaguage(languageId: string) {
		return (languageId === 'html' || languageId === 'plaintext')
	}
}