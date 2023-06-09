import {
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  ThemeIcon,
  EventEmitter,
  WorkspaceFolder,
} from "vscode";
import { readFileSync } from "fs";
import * as path from "path";

export class NpmScriptsProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new EventEmitter<Script | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private workspaceFolders?: readonly WorkspaceFolder[]) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(item: TreeItem): TreeItem {
    return item;
  }

  getChildren(item?: TreeItem): TreeItem[] {
    if(item) {
      return this.getScripts(item.label as string)
    } else {
      const projects = this.getProjects();
      return projects.length === 1
        ? this.getScripts(projects[0].label as string)
        : projects;
    } 
  }

  private getProjects(): TreeItem[] {
    return this.workspaceFolders?.map(
      (workspaceRoot) =>
        new TreeItem(workspaceRoot.name, TreeItemCollapsibleState.Collapsed,)
    ) ?? [];
  }

  private getScripts(folderName: string): Script[] {
    return (
      this.workspaceFolders?.reduce<Script[]>((scripts, workspaceRoot) => {
        if (folderName !== workspaceRoot.name) return scripts;
        const packageJsonPath = path.join(
          workspaceRoot.uri.fsPath,
          "package.json"
        );
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

        return scripts.concat(
          Object.entries<string>(packageJson.scripts).map(
            ([label, script]) =>
              new Script(
                label,
                workspaceRoot.uri.fsPath,
                script,
                TreeItemCollapsibleState.None
              )
          )
        );
      }, []) ?? []
    );
  }
}

class Script extends TreeItem {
  constructor(
    public readonly label: string,
    private path: string,
    private script: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.script}`;
    this.description = this.script;
    this.command = {
      title: "Run NPM script",
      command: "npm-scripts-nvm.runNpmScript",
      arguments: [this.path, this.label],
    };
  }

  iconPath = new ThemeIcon("debug-start");
}
