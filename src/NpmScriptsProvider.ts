import {
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  ThemeIcon,
  EventEmitter,
  Event,
} from "vscode";
import { readFileSync } from "fs";
import * as path from "path";

export class NpmScriptsProvider implements TreeDataProvider<Script> {
  private _onDidChangeTreeData = new EventEmitter<Script | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(item: Script): TreeItem {
    return item;
  }

  getChildren(item?: Script): Script[] {
    return item ? [] : this.getScripts();
  }

  private getScripts(): Script[] {
    const packageJsonPath = path.join(this.workspaceRoot, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    return Object.entries<string>(packageJson.scripts).map<Script>(
      ([label, script]) =>
        new Script(label, script, TreeItemCollapsibleState.None)
    );
  }
}

class Script extends TreeItem {
  constructor(
    public readonly label: string,
    private script: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.script}`;
    this.description = this.script;
    this.command = {
      title: "Run NPM script",
      command: "npm-scripts-nvm.runNpmScript",
      arguments: [this.label],
    };
  }

  iconPath = new ThemeIcon("debug-start");
}
