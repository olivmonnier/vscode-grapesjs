import * as vscode from 'vscode';
import ContentProvider from './ContentProvider';

let timerId: NodeJS.Timeout;

export default class GrapesEditorManager {
  public static currentPanel: GrapesEditorManager | undefined;
  public static viewFocus = 'grapesjsViewFocus';
  public static viewType = 'grapesjs.editor';
  private readonly _panel: vscode.WebviewPanel;
  private _activeEditor: vscode.TextEditor | undefined;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(context: vscode.ExtensionContext) {
    if (GrapesEditorManager.currentPanel) {
      const activeEditor = vscode.window.activeTextEditor;
      const activeContent =
        activeEditor &&
        GrapesEditorManager.isAcceptableLaguage(activeEditor.document.languageId)
          ? activeEditor.document.getText()
          : '';
      const { _panel } = GrapesEditorManager.currentPanel;

      _panel.reveal(vscode.ViewColumn.Two);
      _panel.webview.postMessage({
        command: 'loading'
      });

      if (timerId) clearTimeout(timerId);

      timerId = setTimeout(() => {
        _panel.webview.postMessage({
          command: 'change',
          content: activeContent
        });
      }, 300);
    } else {
      const panel = vscode.window.createWebviewPanel(
        GrapesEditorManager.viewType,
        'Grapesjs Editor',
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      GrapesEditorManager.currentPanel = new GrapesEditorManager(panel, context);
    }
  }

  public static exportContent() {
    if (GrapesEditorManager.currentPanel) {
      GrapesEditorManager.currentPanel._panel.webview.postMessage({
        command: 'callExport'
      });
    }
  }

  public static revive(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    GrapesEditorManager.currentPanel = new GrapesEditorManager(panel, context);
  }

  public static isAcceptableLaguage(languageId: string) {
    return languageId === 'html';
  }

  private onChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
    const { document, contentChanges } = event;

    if (
      this._activeEditor &&
      GrapesEditorManager.isAcceptableLaguage(document.languageId) &&
      contentChanges.length > 0
    ) {
      const content = document.getText();

      this._panel.webview.postMessage({
        command: 'change',
        content
      });
    }
  }

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration();
    const delay: number = config.get('grapesjs.delay') || 0;
    const activeEditor = vscode.window.activeTextEditor;
    const activeContent =
      activeEditor &&
      GrapesEditorManager.isAcceptableLaguage(activeEditor.document.languageId)
        ? activeEditor.document.getText()
        : '';
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.onDidChangeViewState(({ webviewPanel }) => {
      this.setWebviewActiveContext(webviewPanel.active);
    });
    this._panel.webview.html = ContentProvider.getContent(context, activeContent);
    this._panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'export':
            const { html, css } = message.content;

            vscode.workspace
              .openTextDocument({
                language: 'html',
                content: ContentProvider.exportMockup(html, css)
              })
              .then(doc =>
                vscode.window.showTextDocument(doc, {
                  preserveFocus: true
                })
              );
            return;
        }
      },
      null,
      this._disposables
    );

    this.setWebviewActiveContext(true);

    if (activeEditor) {
      this._activeEditor = activeEditor;
    }

    vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
      const { document, contentChanges } = event;

      if (
        this._activeEditor &&
        GrapesEditorManager.isAcceptableLaguage(document.languageId) &&
        contentChanges.length > 0
      ) {
        this._panel.webview.postMessage({
          command: 'loading'
        });

        if (timerId) clearTimeout(timerId);

        timerId = setTimeout(() => {
          this.onChangeTextDocument(event);
        }, delay);
      }
    });
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

  public setWebviewActiveContext(value: boolean) {
    vscode.commands.executeCommand('setContext', GrapesEditorManager.viewFocus, value);
  }
}
