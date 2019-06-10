import {
  commandName,
  keyBlockCode
} from './config';

export default (editor, opts = {}) => {
  const cmd = editor.Commands;
  const { modalTitle, codeViewOptions } = opts;
  const appendToContent = (target, content) => {
    if (content instanceof HTMLElement) {
        target.appendChild(content);
    } else if (content) {
        target.insertAdjacentHTML('beforeend', content);
    }
  }

  cmd.add(commandName, {
    run(editor, sender, opts = {}) {
      this.editor = editor;
      this.options = opts;
      this.target = opts.target || editor.getSelected();

      const target = this.target;

      if (target && target.get('editable')) {
        this.showBlockCode(target)
      }
    },

    stop(editor) {
      editor.Modal.close();
    },

    showBlockCode(target) {
      const { editor, options } = this;
      const title = options.title || modalTitle;
      const content = this.getContent();

      let htmlContent = document.createElement('div')
      htmlContent.innerHTML = target.toHTML()
      htmlContent = htmlContent.firstChild.innerHTML

      editor.Modal
        .open({ title, content })
        .getModel()
        .once('change:open', () => editor.stopCommand(this.id));
      this.getCodeViewer().setContent(htmlContent);
    },

    /**
     * Custom pre-content. Can be a simple string or an HTMLElement
     */
    getPreContent() {},

    /**
     * Custom post-content. Can be a simple string or an HTMLElement
     */
    getPostContent() {},

    /**
     * Get all the content for the custom code
     * @return {HTMLElement}
     */
    getContent() {
      const { editor } = this;
      const content = document.createElement('div');
      const codeViewer = this.getCodeViewer();
      const pfx = editor.getConfig('stylePrefix');
      content.className = `${pfx}custom-code`;
      appendToContent(content, this.getPreContent());
      content.appendChild(codeViewer.getElement());
      appendToContent(content, this.getPostContent());
      appendToContent(content, this.getContentActions());
      codeViewer.refresh();
      setTimeout(()=> codeViewer.focus(), 0);

      return content;
    },

    getContentActions() {
      const { editor } = this;
      const btn = document.createElement('button');
      const pfx = editor.getConfig('stylePrefix');
      btn.innerHTML = opts.buttonLabel;
      btn.className = `${pfx}btn-prim ${pfx}btn-import__edit-block`;
      btn.onclick = () => this.handleSave();

      return btn;
    },

    handleSave() {
      const { editor, target } = this;
      const code = this.getCodeViewer().getContent();
      target.set(keyBlockCode, code);
      editor.Modal.close();
    },

    getCodeViewer() {
      const { editor } = this;

      if (!this.codeViewer) {
        this.codeViewer = editor.CodeManager.createViewer({
          codeName: 'htmlmixed',
          theme: 'hopscotch',
          readOnly: 0,
          ...codeViewOptions
        })
      }

      return this.codeViewer;
    }
  })
}