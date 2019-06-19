import * as vscode from 'vscode';
import * as fs from 'fs';
import { join } from "path";
import { getNestedObject } from './utils';

export default class PluginsManager {
  public static getAll() {
    if (vscode.workspace.workspaceFolders) {
			const pluginsFolderPath: string = vscode.workspace.getConfiguration().get('grapesjs.pluginsFolder') || './';
			const workspaceFolderPath = vscode.workspace.workspaceFolders[0].uri.fsPath

			if (workspaceFolderPath) {
				const srcPath = join(workspaceFolderPath, pluginsFolderPath)
				const pluginsFolders = this._getDirectories(srcPath)
				const pluginsConfig = pluginsFolders.map(folder => this._getConfig(join(srcPath, folder)))
				
				return pluginsConfig.map((config, i) => {
					if (config) {
						return this._loadPlugin(join(srcPath, pluginsFolders[i]), config)
					}
				}).filter(Boolean)
			} 
		}
  }

  private static _getDirectories(srcPath: string) {
		return fs.readdirSync(srcPath).filter(file => fs.statSync(join(srcPath, file)).isDirectory())
	}

	private static _getConfig(srcPath: string) {
		if (fs.existsSync(join(srcPath, 'package.json'))) {
			try {
				const contentConfig = fs.readFileSync(join(srcPath, 'package.json')).toString('utf8')
				const jsonConfig = JSON.parse(contentConfig)

				return Object.assign(getNestedObject(jsonConfig, ['vscode', 'grapesjs']), {
					name: jsonConfig.name || ''
				});
			} catch(err) {
				vscode.window.showErrorMessage(err.message || err)
			}
		}
	}

	private static _loadPlugin(srcPath: string, config: { lib: string, name: string, options?: any }) {
		const { lib, name, options } = config;
		const path = join(srcPath, lib);

		if (fs.existsSync(path)) {
			return { 
				content: fs.readFileSync(path, 'utf8'), 
				options: options || {}, 
				name 
			}
		}
	}
}