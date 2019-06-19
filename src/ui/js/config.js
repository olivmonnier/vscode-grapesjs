import editBlock from './plugins/editBlock';

const vscode = acquireVsCodeApi();

export default {
  // Indicate where to init the editor. You can also pass an HTMLElement
	container: '#gjs',
	// Get the content for the canvas directly from the element
	// As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
	fromElement: true,
	// Size of the editor
	height: '100%',
	width: 'auto',
	plugins: initPlugins(window.plugins),
	pluginsOpts: initPluginsOptions(window.pluginsOptions),
	// Disable the storage manager for the moment
	storageManager: { type: null },
	// Avoid any default panel
	panels: {
		defaults: [
			{
				id: 'layers',
				el: '.panel__right',
				resizable: {
					maxDim: 600,
					minDim: 250,
					tc: 0, // Top handler
					cl: 1, // Left handler
					cr: 0, // Right handler
					bc: 0, // Bottom handler
					// Being a flex child we need to change `flex-basis` property
					// instead of the `width` (default)
					keyWidth: 'flex-basis'
				}
			},
			{
				id: 'panel-switcher',
				el: '.panel__switcher',
				buttons: [
					{
						id: 'show-layers',
						className: 'fa fa-bars',
						active: true,
						command: 'show-layers',
						togglable: false
					},
					{
						id: 'show-styles',
						className: 'fa fa-paint-brush',
						active: false,
						command: 'show-styles',
						togglable: false
					},
					{
						id: 'show-traits',
						className: 'fa fa-cog',
						active: false,
						command: 'show-traits',
						togglable: false
					},
					{
						id: 'show-blocks',
						className: 'fa fa-th-large',
						active: false,
						command: 'show-blocks',
						togglable: false
					}
				]
			},
			{
				id: 'basic-actions',
				el: '.panel__basic-actions',
				buttons: []
			}
		]
	},
	layerManager: {
		appendTo: '.layers-container'
	},
	selectorManager: {
		appendTo: '.styles-container'
	},
	styleManager: {
		appendTo: '.styles-container',
		sectors: [
			{
				name: 'General',
				open: false,
				buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
			},
			{
				name: 'Layout',
				open: false,
				buildProps: ['width', 'height', 'max-width', 'max-height', 'min-width', 'min-height', 'margin', 'padding'],
			},
			{
				name: 'Typography',
				open: false,
				buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow'],
				properties: [{
					property: 'text-align',
					list: [
						{ value: 'left', className: 'fa fa-align-left' },
						{ value: 'center', className: 'fa fa-align-center' },
						{ value: 'right', className: 'fa fa-align-right' },
						{ value: 'justify', className: 'fa fa-align-justify' },
					],
				}]
			},
			{
				name: 'Decorations',
				open: false,
				buildProps: ['border-radius-c', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
			},
			{
				name: 'Extra',
				open: false,
				buildProps: ['transition', 'perspective', 'transform'],
			}
		]
	},
	traitManager: {
		appendTo: '.traits-container',
	},
	blockManager: {
		appendTo: '.blocks-container'
	},
	commands: {
		defaults: [
			{
				id: 'show-layers',
				run(editor) {
					const lmEl = editor.getContainer().closest('.editor-row').querySelector('.layers-container');
					lmEl.style.display = '';
				},
				stop(editor) {
					const lmEl = editor.getContainer().closest('.editor-row').querySelector('.layers-container');
					lmEl.style.display = 'none';
				}
			},
			{
				id: 'show-styles',
				run(editor) {
					const smEl = editor.getContainer().closest('.editor-row').querySelector('.styles-container');
					smEl.style.display = '';
				},
				stop(editor) {
					const smEl = editor.getContainer().closest('.editor-row').querySelector('.styles-container');
					smEl.style.display = 'none';
				}
			},
			{
				id: 'show-traits',
				run(editor) {
					const trEl = editor.getContainer().closest('.editor-row').querySelector('.traits-container');
					trEl.style.display = '';
				},
				stop(editor) {
					const trEl = editor.getContainer().closest('.editor-row').querySelector('.traits-container');
					trEl.style.display = 'none';
				}
			},
			{
				id: 'show-blocks',
				run(editor) {
					const trEl = editor.getContainer().closest('.editor-row').querySelector('.blocks-container');
					trEl.style.display = '';
				},
				stop(editor) {
					const trEl = editor.getContainer().closest('.editor-row').querySelector('.blocks-container');
					trEl.style.display = 'none';
				}
			},
			{
				id: 'call-vscode-export',
				run(editor) {
					vscode.postMessage({
						command: 'export',
						content: { html: editor.getHtml(), css: editor.getCss() }
					})
				}
			}
		]
	}
}

function initPlugins(plugins) {
	return [].concat(
		plugins,
		[editBlock]
	)
}

function initPluginsOptions(plugins) {
	return plugins.reduce((acc, curr) => {
		acc[curr.name] = curr.options;
		return acc
	}, {})
}