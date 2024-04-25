import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { currentDir } from './current-dir.js';

const calculateHash = async (pathToFile) => {
  const resolvedFilePath = path.resolve(currentDir.value, pathToFile);
  const data = await fs.promises.readFile(resolvedFilePath);
  const hash = createHash('sha256').update(data).digest('hex');
  console.log(hash);
};

export { calculateHash };