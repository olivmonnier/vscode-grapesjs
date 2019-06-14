import "../../../node_modules/grapesjs/dist/css/grapes.min.css";
import "../css/styles.css";

import grapesjs from 'grapesjs';
import config from './config';

const editor = grapesjs.init(config);

editor.on('update', function() {
	document.body.classList.remove('loading');
});

window.addEventListener('message', event => {
	const message = event.data;

	switch (message.command) {
		case 'callExport':
			editor.runCommand('call-vscode-export');
			return;
		case 'change':
			editor.setComponents(message.content);
			return;
		case 'loading':
			document.body.classList.add('loading');
			return;
	}
});