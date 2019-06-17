import { keyBlockCode, typeBlockCode, commandName } from './config';

export default (editor, opts = {}) => {
  let timedInterval;
  const comps = editor.DomComponents;
  const { toolbarBtnBlockCode } = opts;

  comps.addType('default', {
    model: {
      defaults: {
        editable: true
      },
      init() {
        this.listenTo(this, `change:${keyBlockCode}`, this.onBlockCodeChange);
        const initialCode = this.get(keyBlockCode) || '';
        !this.components().length && this.components(initialCode);
        const toolbar = this.get('toolbar');
        const id = 'block-code';

        toolbar.unshift({
          id,
          command: commandName,
          label: `<svg viewBox="0 0 24 24">
            <path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"></path>
          </svg>`,
          ...toolbarBtnBlockCode
        });
      },
      onBlockCodeChange() {
        this.components(this.get(keyBlockCode))
      }
    },

    view: {
      events: {
        dblClick: 'onActive'
      },

      init() {
        this.listenTo(this.model.components(), 'add remove reset', this.onComponentsChange);
        this.onComponentsChange();
      },

      onComponentsChange() {
        timedInterval && clearInterval(timedInterval);
        timedInterval = setTimeout(() => {
          const { model } = this;
          const content = model.get(keyBlockCode) || '';
          let droppable = 1;

          // Avoid rendering codes with scripts
          if (content.indexOf('<script') >= 0) {
            this.el.innerHTML = opts.placeholderScript;
            droppable = 0;
          }

          model.set({ droppable });
        }, 0);
      },

      onActive() {
        const target = this.model;
        this.em.get('Commands').run(commandName, { target });
      },
    }
  })

  comps.addType(typeBlockCode, {
    extend: 'default'
  })
}