import fs from 'fs';
import path from 'path';
import { currentDir } from './current-dir.js';

const cd = async (cdPath) => {
  const nextDir = path.resolve(currentDir.value, cdPath);
  await fs.promises.readdir(nextDir);
  currentDir.value = nextDir;
}

const ls = async () => {
  const dir = await fs.promises.readdir(currentDir.value, {withFileTypes: true});
  console.log(dir);
  console.table(dir.map(it => ({
    name: it.name,
    type: it.isDirectory() ? 'directory' : 'file' 
  })).sort((a, b) => {
    if(a.type > b.type) {
      return 1;
    } else if (a.type < b.type) {
      return -1;
    } else {
      return (a.name > b.name) * 2 - 1
    }
  }));

}

export { cd, ls };
