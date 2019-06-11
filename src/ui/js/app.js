import "../../../node_modules/grapesjs/dist/css/grapes.min.css";
import "../css/styles.css";

import grapesjs from 'grapesjs';
import config from './config';

const editor = grapesjs.init(config);

window.addEventListener('message', event => {
	const message = event.data;

	switch (message.command) {
		case 'change':
			editor.setComponents(message.content);
			document.body.classList.remove('loading');
			return;
		case 'loading':
			document.body.classList.add('loading');
			return;
	}
})