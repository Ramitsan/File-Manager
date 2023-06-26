import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

import path from 'path';
import { currentDir } from './current-dir.js';

const compress = async (filePath, archivePath) => {
  const resolvedFilePath = path.resolve(currentDir.value, filePath);
  const resolvedArchivePath = path.resolve(currentDir.value, archivePath);

  const source = createReadStream(resolvedFilePath);
  const dest = createWriteStream(resolvedArchivePath);
  await pipeline(source, createBrotliCompress(), dest);
};

const decompress = async (archivePath, filePath) => {
  const resolvedArchivePath = path.resolve(currentDir.value, archivePath);
  const resolvedFilePath = path.resolve(currentDir.value, filePath);  

  const source = createReadStream(resolvedArchivePath);
  const dest = createWriteStream(resolvedFilePath);

  await pipeline(source, createBrotliDecompress(), dest);
};

export { compress, decompress };



