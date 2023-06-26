import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

import path from 'path';
import { currentDir } from './navigation.js';

const compress = async (filePath, archivePath) => {
  const resolvedFilePath = path.resolve(currentDir, filePath);
  const resolvedArchivePath = path.resolve(currentDir, archivePath);

  const source = createReadStream(resolvedFilePath);
  const dest = createWriteStream(resolvedArchivePath);
  await pipeline(source, createBrotliCompress(), dest);
};

const decompress = async (archivePath, filePath) => {
  const resolvedArchivePath = path.resolve(currentDir, archivePath);
  const resolvedFilePath = path.resolve(currentDir, filePath);  

  const source = createReadStream(resolvedArchivePath);
  const dest = createWriteStream(resolvedFilePath);

  await pipeline(source, createBrotliDecompress(), dest);
};

export { compress, decompress };



