import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let currentDir = process.env['HOME'];


const cd = (cdPath) => {
  currentDir = path.resolve(currentDir, cdPath);
  console.log(currentDir, cdPath);
}

const ls = async () => {
  const dir = await fs.promises.readdir(currentDir);
  console.log(dir);
}

// Read file and print it's content in console (should be done using Readable stream)
const readAndPrintFile = (filePath) => {
  const readStream = fs.createReadStream(filePath, 'utf-8');
  let data = '';
  readStream.on('data', chunk => process.stdout.write(data += chunk));
}

//Create empty file in current working directory
const createEmptyFile = (newFileName) => {
  // The w flag ensures that the file is created if does not already exist. 
  // If the file already exists, fs.open() overwrites it and removes all its content.
  fs.promises.open(newFileName, 'w');  
}

// Rename file (content should remain unchanged)
const renameFile = (pathToFile, newFilename) => {
  fs.promises.rename(pathToFile, newFilename);
}

// Copy file (should be done using Readable and Writable streams)
const copyFile = (pathToFile, pathToNewDirectory) => {
  const readStream = fs.createReadStream(pathToFile, 'utf8');
  const writeStream = fs.createWriteStream(pathToNewDirectory);

  readStream.on('data', (chunk) => {
    writeStream.write(chunk);
  });
}

//Move file (same as copy but initial file is deleted, copying part should be done using Readable and Writable streams)
const moveFile = (pathToFile, pathToNewDirectory) => {
  const readStream = fs.createReadStream(pathToFile);
  const writeStream = fs.createWriteStream(pathToNewDirectory);

  readStream.on('close', () => {
    fs.promises.unlink(pathToFile);    
  });

  readStream.pipe(writeStream);
}

// Delete file
const deleteFile = (pathToFile) => {
  fs.promises.unlink(pathToFile);
}

export { cd, ls, readAndPrintFile, createEmptyFile, renameFile, copyFile, moveFile, deleteFile };