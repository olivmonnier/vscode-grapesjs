import loadComponents from './components';
import loadCommands from './commands';

export default (editor, opts = {}) => {
  const options = { ...{
    // Object to extend the default component's toolbar button for the code, eg. `{ label: '</>', attributes: { title: 'Open custom code' } }`
    // Pass a falsy value to avoid adding the button
    toolbarBtnCustomCode: {},

    modalTitle: 'Insert your code',

    // Additional options for the code viewer, eg. `{ theme: 'hopscotch', readOnly: 0 }`
    codeViewOptions: {},

    // Label for the default save button
    buttonLabel: 'Save',

    placeholderScript: `<div style="pointer-events: none; padding: 10px;">
      <svg viewBox="0 0 24 24" style="height: 30px; vertical-align: middle;">
        <path d="M13 14h-2v-4h2m0 8h-2v-2h2M1 21h22L12 2 1 21z"></path>
        </svg>
      Custom code with <i>&lt;script&gt;</i> can't be rendered on the canvas
    </div>`
  }, ...opts };

  loadComponents(editor, options);

  loadCommands(editor, options);
}