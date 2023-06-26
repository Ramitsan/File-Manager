import fs from 'fs';
import path from 'path';

let currentDir = process.env['HOME'];

const cd = async (cdPath) => {
  const nextDir = path.resolve(currentDir, cdPath);
  await fs.promises.readdir(nextDir);
  currentDir = nextDir;
  // console.log(currentDir, cdPath);
  console.log('You are currently in:', currentDir);
}

const ls = async () => {
  const dir = await fs.promises.readdir(currentDir, {withFileTypes: true});
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

export { currentDir, cd, ls };
