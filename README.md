# GrapesJS Editor into VS Code

## Getting started

- Install the [vscode-grapesjs]() extension in VS Code
- After opening a `html` file, click on the link "Toggle Grapesjs panel" or press <kbd>ctrl</kbd>+<kbd>shift</kbd>+<kbd>P</kbd> / <kbd>command</kbd>+<kbd>shift</kbd>+<kbd>P</kbd> and search the command `Toggle Grapesjs panel`

## VS Code settings

| Property | Default | Description |
| -------- | ------- | ----------- |
| `grapesjs.delay` | 1500 | Delay to wait before render after a document change. |
| `grapesjs.pluginsFolder` | "./" | Path to your Grapesjs plugins folder. |

## How to add plugins grapesjs

- Clone this repository `git clone https://github.com/artf/grapesjs-plugin-boilerplate.git YOUR-PLUGIN-NAME` in your plugins folder (`./` by default)
- Declare your plugin for use in it and add your config in `package.json`:

```json
{
  ...
  "vscode": {
    "grapesjs": { // or just true if there is no config
      "lib": "./index.js", // (optional) use main property if it's the same 
      "options": { 
        ... // (optional) config to use in your plugin
      }
    }
  }
}
```

## License

vscode-grapesjs is [MIT licensed](https://github.com/olivmonnier/vscode-grapesjs/blob/master/LICENSE)