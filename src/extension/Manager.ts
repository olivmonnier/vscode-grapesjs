import * as vscode from "vscode";
import ContentProvider from './ContentProvider';
import { debounced } from './utils';

const contentProvider = new ContentProvider();

export default class GrapesEditorManager {
	public static currentPanel: GrapesEditorManager | undefined;
	public static viewFocus = 'grapesViewFocus';
	public static viewType = 'grapes.editor';
	private readonly _panel: vscode.WebviewPanel;
	private _activeEditor: vscode.TextEditor | undefined;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(context: vscode.ExtensionContext) {
		if (GrapesEditorManager.currentPanel) {
			GrapesEditorManager.currentPanel._panel.reveal(vscode.ViewColumn.Two)
		} else {
			const panel = vscode.window.createWebviewPanel(
				GrapesEditorManager.viewType,
				'Grapes Editor',
				vscode.ViewColumn.Two,
				{
					enableScripts: true,
					retainContextWhenHidden: true
				}
			);
			
			GrapesEditorManager.currentPanel = new GrapesEditorManager(panel, context);
		}
	}

	public static revive(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
		GrapesEditorManager.currentPanel = new GrapesEditorManager(panel, context);
	}

	private onChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
		const { document } = event;

		if (this.isAcceptableLaguage(document.languageId)) {
			const content = document.getText();

			this._panel.webview.postMessage({
				command: 'change',
				content
			})
		}
	}

	private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
		const activeContent = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.getText() : '';
		this._panel = panel;
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
		this._panel.onDidChangeViewState(({ webviewPanel }) => {
			this.setWebviewActiveContext(webviewPanel.active);
		});
		this._panel.webview.html = contentProvider.getContent(context, activeContent);
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch(message.command) {
					case 'export':
						const { html, css } = message.content;

						vscode.workspace.openTextDocument({
							language: "html",
							content: contentProvider.exportMockup(html, css)
						})
						.then(doc => vscode.window.showTextDocument(doc))
						return;
				}
			},
			null,
			this._disposables
		)

		this.setWebviewActiveContext(true);

		if (vscode.window.activeTextEditor) {
			this._activeEditor = vscode.window.activeTextEditor;
		}

		vscode.window.onDidChangeActiveTextEditor(activeEditor => {
			if (activeEditor && this.isAcceptableLaguage(activeEditor.document.languageId)) {
				this._activeEditor = activeEditor
			}
		});

		vscode.workspace.onDidChangeTextDocument(() => {
			this._panel.webview.postMessage({
				command: 'loading'
			});
		});

		vscode.workspace.onDidChangeTextDocument(debounced(1500, this.onChangeTextDocument.bind(this)));
	}

	public dispose() {
		GrapesEditorManager.currentPanel = undefined;
		this._panel.dispose();
		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	public isAcceptableLaguage(languageId: string) {
		return (languageId === 'html' || languageId === 'plaintext')
	}

	public setWebviewActiveContext(value: boolean) {
    vscode.commands.executeCommand('setContext', GrapesEditorManager.viewFocus, value);
	}
}