import * as vscode from "vscode";
import { NpmScriptsProvider } from "./NpmScriptsProvider";
import { buildScriptText, pathExists } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : "";

  vscode.commands.executeCommand(
    "setContext",
    "workspaceHasPackageJSON",
    pathExists("package.json", rootPath)
  );

  const npmScriptsProvider = new NpmScriptsProvider(vscode.workspace.workspaceFolders);

  vscode.window.createTreeView("npm-scripts-nvm.npmScripts", {
    treeDataProvider: npmScriptsProvider,
  });

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "npm-scripts-nvm.runNpmScript",
      (rootPath, script) => {
        vscode.tasks.executeTask(
          new vscode.Task(
            { type: "shell" },
            vscode.TaskScope.Global,
            script,
            'npm',
            new vscode.ShellExecution(buildScriptText(script, rootPath), {
              cwd: rootPath,
            })
          )
        );
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
