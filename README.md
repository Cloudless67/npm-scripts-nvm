# npm-scripts-nvm README

**Extension to run npm scripts with NVM**

## Installation
Install through VS Code extensions. Search for `NPM Scripts NVM`

## Features

- Add NPM Scripts view in explorer view
  - It's similar to builtin NPM Scripts view, but applies necessary node version before running
  - It executes `nvm use` if there is `.nvmrc` file in root directory
  - You can hide builtin NPM Scripts view by right clicking on it
- Currently supports NPM and Yarn
- For multi-repo workspaces provides tree view with set of commands for each project
