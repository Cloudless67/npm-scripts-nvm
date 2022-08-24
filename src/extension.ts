import * as vscode from "vscode";
import { accessSync } from "fs";
import { NpmScriptsProvider } from "./NpmScriptsProvider";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : "";

  const pathExists = (p: string) => {
    try {
      accessSync(path.join(rootPath, p));
    } catch {
      return false;
    }
    return true;
  };

  const buildScriptText = (script: string) => {
    const scripts = [];

    if (pathExists(".nvmrc")) {
      scripts.push("nvm use");
    }

    if (pathExists("yarn.lock")) {
      scripts.push(`yarn ${script}`);
    } else {
      scripts.push(`npm run ${script}`);
    }

    return scripts.join(" && ");
  };

  vscode.commands.executeCommand(
    "setContext",
    "workspaceHasPackageJSON",
    pathExists("package.json")
  );

  const npmScriptsProvider = new NpmScriptsProvider(rootPath);

  vscode.window.createTreeView("npm-scripts-nvm.npmScripts", {
    treeDataProvider: npmScriptsProvider,
  });

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "npm-scripts-nvm.runNpmScript",
      (script: string) => {
        const terminal = vscode.window.createTerminal(script);
        terminal.show();
        terminal.sendText(buildScriptText(script));
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "npm-scripts-nvm.refreshScripts",
      npmScriptsProvider.refresh.bind(npmScriptsProvider)
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
