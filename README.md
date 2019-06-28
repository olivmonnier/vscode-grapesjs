<h1 align="center">GrapesJS Editor into VS Code</h1>
<p>
  <img src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/vscode-%5E1.35.0-blue.svg" />
  <a href="https://github.com/olivmonnier/vscode-grapesjs#readme">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/olivmonnier/vscode-grapesjs/graphs/commit-activity">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" target="_blank" />
  </a>
  <a href="https://github.com/olivmonnier/vscode-grapesjs/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
</p>

Web Builder Framework which helps building HTML templates, faster and easily into VS Code.

<p alig="center"><img src="https://github.com/olivmonnier/vscode-grapesjs/blob/master/screen.PNG"/></p>

## Getting started

- Install the [vscode-grapesjs]() extension in VS Code
- After opening a `html` file, click on the link "Toggle Grapesjs panel" or press <kbd>ctrl</kbd>+<kbd>shift</kbd>+<kbd>P</kbd> / <kbd>command</kbd>+<kbd>shift</kbd>+<kbd>P</kbd> and search the command `Toggle Grapesjs panel`

## VS Code settings

| Property | Default | Description |
| -------- | ------- | ----------- |
| `grapesjs.delay` | 1500 | Delay to wait before render after a document change. |
| `grapesjs.pluginsFolder` | "./" | Path to your Grapesjs plugins folder. |

## How to add grapesjs plugins

- Clone this repository `git clone https://github.com/artf/grapesjs-plugin-boilerplate.git YOUR-PLUGIN-NAME` in your plugins folder (`./` by default)
- In `package.json` declare your plugin and add your config:

```json5
{
  ...
  "vscode": {
    "grapesjs": { // or just true if there's no configuration
      "lib": "./index.js", // (optional) use main property if it's the same path, also an url http(s) worked
      "options": { 
        ... // (optional) options to use in your plugin
      }
    }
  }
}
```

## Author

👤 **olivmonnier**

* Github: [@olivmonnier](https://github.com/olivmonnier)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/olivmonnier/vscode-grapesjs/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [olivmonnier](https://github.com/olivmonnier).<br />
This project is [MIT](https://github.com/olivmonnier/vscode-grapesjs/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
