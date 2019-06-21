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
				buildProps: ['width', 'flex-width', 'height', 'max-width', 'max-height', 'min-width', 'min-height', 'margin', 'padding'],
				properties: [{
					id: 'flex-width',
					type: 'integer',
					name: 'Width',
					units: ['px', '%'],
					property: 'flex-basis',
					toRequire: 1,
				},{
					property: 'margin',
					properties:[
						{ name: 'Top', property: 'margin-top'},
						{ name: 'Right', property: 'margin-right'},
						{ name: 'Bottom', property: 'margin-bottom'},
						{ name: 'Left', property: 'margin-left'}
					],
				},{
					property  : 'padding',
					properties:[
						{ name: 'Top', property: 'padding-top'},
						{ name: 'Right', property: 'padding-right'},
						{ name: 'Bottom', property: 'padding-bottom'},
						{ name: 'Left', property: 'padding-left'}
					],
				}],
			},
			{
				name: 'Typography',
				open: false,
				buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
				properties:[
					{ name: 'Font', property: 'font-family'},
					{ name: 'Weight', property: 'font-weight'},
					{ name:  'Font color', property: 'color'},
					{
						property: 'text-align',
						type: 'radio',
						defaults: 'left',
						list: [
							{ value : 'left',  name : 'Left',    className: 'fa fa-align-left'},
							{ value : 'center',  name : 'Center',  className: 'fa fa-align-center' },
							{ value : 'right',   name : 'Right',   className: 'fa fa-align-right'},
							{ value : 'justify', name : 'Justify',   className: 'fa fa-align-justify'}
						],
					},{
						property: 'text-decoration',
						type: 'radio',
						defaults: 'none',
						list: [
							{ value: 'none', name: 'None', className: 'fa fa-times'},
							{ value: 'underline', name: 'underline', className: 'fa fa-underline' },
							{ value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough'}
						],
					},{
						property: 'text-shadow',
						properties: [
							{ name: 'X position', property: 'text-shadow-h'},
							{ name: 'Y position', property: 'text-shadow-v'},
							{ name: 'Blur', property: 'text-shadow-blur'},
							{ name: 'Color', property: 'text-shadow-color'}
						],
				}]
			},
			{
				name: 'Decorations',
				open: false,
				buildProps: ['opacity', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
				properties: [{
					type: 'slider',
					property: 'opacity',
					defaults: 1,
					step: 0.01,
					max: 1,
					min:0,
				},{
					property: 'border-radius',
					properties  : [
						{ name: 'Top', property: 'border-top-left-radius'},
						{ name: 'Right', property: 'border-top-right-radius'},
						{ name: 'Bottom', property: 'border-bottom-left-radius'},
						{ name: 'Left', property: 'border-bottom-right-radius'}
					],
				},{
					property: 'box-shadow',
					properties: [
						{ name: 'X position', property: 'box-shadow-h'},
						{ name: 'Y position', property: 'box-shadow-v'},
						{ name: 'Blur', property: 'box-shadow-blur'},
						{ name: 'Spread', property: 'box-shadow-spread'},
						{ name: 'Color', property: 'box-shadow-color'},
						{ name: 'Shadow type', property: 'box-shadow-type'}
					],
				},{
					property: 'background',
					properties: [
						{ name: 'Image', property: 'background-image'},
						{ name: 'Repeat', property:   'background-repeat'},
						{ name: 'Position', property: 'background-position'},
						{ name: 'Attachment', property: 'background-attachment'},
						{ name: 'Size', property: 'background-size'}
					],
				}]
			},
			{
				name: 'Extra',
				open: false,
				buildProps: ['transition', 'perspective', 'transform'],
				properties: [{
					property: 'transition',
					properties:[
						{ name: 'Property', property: 'transition-property'},
						{ name: 'Duration', property: 'transition-duration'},
						{ name: 'Easing', property: 'transition-timing-function'}
					],
				},{
					property: 'transform',
					properties:[
						{ name: 'Rotate X', property: 'transform-rotate-x'},
						{ name: 'Rotate Y', property: 'transform-rotate-y'},
						{ name: 'Rotate Z', property: 'transform-rotate-z'},
						{ name: 'Scale X', property: 'transform-scale-x'},
						{ name: 'Scale Y', property: 'transform-scale-y'},
						{ name: 'Scale Z', property: 'transform-scale-z'}
					],
				}]
			},
			{
				name: 'Flex',
				open: false,
				properties: [{
					name: 'Flex Container',
					property: 'display',
					type: 'select',
					defaults: 'block',
					list: [
						{ value: 'block', name: 'Disable'},
						{ value: 'flex', name: 'Enable'}
					]
				},{
					name: 'Flex Parent',
					property: 'label-parent-flex',
					type: 'integer'
				},{
					name: 'Direction',
					property: 'flex-direction',
					type: 'select',
					defaults  : 'row',
					list: [{
						value   : 'row',
						name    : 'Row',
						title   : 'Row'
					},{
						value   : 'row-reverse',
						name    : 'Row reverse',
						title   : 'Row reverse'
					},{
						value   : 'column',
						name    : 'Column',
						title   : 'Column'
					},{
						value   : 'column-reverse',
						name    : 'Column reverse',
						title   : 'Column reverse'
					}],
				},{
					name      : 'Justify',
					property  : 'justify-content',
					type    : 'select',
					defaults  : 'flex-start',
					list    : [{
						value   : 'flex-start',
						name    : 'Start',
						title   : 'Start'
					},{
						value   : 'flex-end',
						name    : 'End',
						title    : 'End'
					},{
						value   : 'space-between',
						name: 'Space between',
						title    : 'Space between'
					},{
						value   : 'space-around',
						name: 'Space around',
						title    : 'Space around'
					},{
						value   : 'center',
						name: 'Center',
						title    : 'Center'
					}],
				},{
					name      : 'Align',
					property  : 'align-items',
					type    : 'select',
					defaults  : 'center',
					list    : [{
						value   : 'flex-start',
						name: 'Start',
						title    : 'Start'
					},{
						value   : 'flex-end',
						name: 'End',
						title    : 'End'
					},{
						value   : 'stretch',
						name: 'Stretch',
						title    : 'Stretch'
					},{
						value   : 'center',
						name: 'Center',
						title    : 'Center'
					}],
				},{
					name: 'Flex Children',
					property: 'label-parent-flex',
					type: 'integer',
				},{
					name:     'Order',
					property:   'order',
					type:     'integer',
					defaults :  0,
					min: 0
				},{
					name    : 'Flex',
					property  : 'flex',
					type    : 'composite',
					properties  : [{
						name:     'Grow',
						property:   'flex-grow',
						type:     'integer',
						defaults :  0,
						min: 0
					},{
						name:     'Shrink',
						property:   'flex-shrink',
						type:     'integer',
						defaults :  0,
						min: 0
					},{
						name:     'Basis',
						property:   'flex-basis',
						type:     'integer',
						units:    ['px','%',''],
						unit: '',
						defaults :  'auto',
					}],
				},{
					name      : 'Align',
					property  : 'align-self',
					type      : 'select',
					defaults  : 'auto',
					list    : [{
						value   : 'auto',
						name    : 'Auto',
					},{
						value   : 'flex-start',
						name: 'Start',
						title    : 'Start'
					},{
						value   : 'flex-end',
						name: 'End',
						title    : 'End'
					},{
						value   : 'stretch',
						name: 'Stretch',
						title    : 'Stretch'
					},{
						value   : 'center',
						name: 'Center',
						title    : 'Center'
					}]
				}]
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