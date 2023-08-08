import { accessSync } from "fs";
import * as path from "path";

export const pathExists = (p: string, rootPath: string) => {
  try {
    accessSync(path.join(rootPath, p));
  } catch {
    return false;
  }
  return true;
};

export const buildScriptText = (script: string, rootPath: string) => {
  const scripts = ["source ~/.zshrc"];

  if (pathExists(".nvmrc", rootPath)) {
    scripts.push("nvm use");
  }

  if (pathExists("yarn.lock", rootPath)) {
    scripts.push(`yarn ${script}`);
  } else {
    scripts.push(`npm run ${script}`);
  }

  return scripts.join(" && ");
};
