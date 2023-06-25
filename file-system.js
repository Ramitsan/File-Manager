import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let currentDir = process.env['HOME'];

const cd = async (cdPath) => {
  const nextDir = path.resolve(currentDir, cdPath);
  await fs.promises.readdir(nextDir);
  currentDir = nextDir;
  console.log(currentDir, cdPath);
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

// Read file and print it's content in console (should be done using Readable stream)
const readAndPrintFile = async (filePath) => {
  return new Promise((res, rej) => {
    const resolvedFilePath = path.resolve(currentDir, filePath);
    const readStream = fs.createReadStream(resolvedFilePath, 'utf-8');
    let data = '';
    readStream.on('data', chunk => process.stdout.write(data += chunk));
    readStream.on('error', (err) => {rej(err)});
    readStream.on('end', () => {res()});
  }  
  )
}

//Create empty file in current working directory
const createEmptyFile = async (newFileName) => {
  // The w flag ensures that the file is created if does not already exist. 
  // If the file already exists, fs.open() overwrites it and removes all its content.
  const resolvedNewFileName = path.resolve(currentDir, newFileName);
  return fs.promises.open(resolvedNewFileName, 'w');  
}

// Rename file (content should remain unchanged)
const renameFile = async (pathToFile, newFilename) => {
  const resolvedPathToFile = path.resolve(currentDir, pathToFile);
  const resolvedNewFilename = path.resolve(currentDir, newFilename);
  return fs.promises.rename(resolvedPathToFile, resolvedNewFilename);
}

// Copy file (should be done using Readable and Writable streams)
const copyFile = async (pathToFile, pathToNewDirectory) => {
  return new Promise ((res, rej) => {
    try {
      const resolvedPathToFile = path.resolve(currentDir, pathToFile);
      const resolvedPathToNewDirectory = path.resolve(currentDir, pathToNewDirectory);
    
      const readStream = fs.createReadStream(resolvedPathToFile, 'utf8');
      const writeStream = fs.createWriteStream(resolvedPathToNewDirectory);
    
      readStream.on('data', (chunk) => {
        writeStream.write(chunk);
      });
      readStream.on('error', (err) => {rej(err)});
      readStream.on('end', () => {res()});
      writeStream.on('error', (err) => {rej(err)});
    }
    catch(err) {
      rej(err);
    }    
  })  
}

//Move file (same as copy but initial file is deleted, copying part should be done using Readable and Writable streams)
const moveFile = async (pathToFile, pathToNewDirectory) => {
  return new Promise ((res, rej) => {
    try {
      const resolvedPathToFile = path.resolve(currentDir, pathToFile);
      const resolvedPathToNewDirectory = path.resolve(currentDir, pathToNewDirectory);
    
      const readStream = fs.createReadStream(resolvedPathToFile);
      const writeStream = fs.createWriteStream(resolvedPathToNewDirectory);
    
      readStream.on('close', () => {
        fs.promises.unlink(resolvedPathToFile).catch((err) => {rej(err)});   
      });
    
      readStream.pipe(writeStream);
      readStream.on('error', (err) => {rej(err)});
      readStream.on('end', () => {res()});
      writeStream.on('error', (err) => {rej(err)});
    }
    catch(err) {
      rej(err);
    }   
  })  
}

// Delete file
const deleteFile = async (pathToFile) => {
  const resolvedPathToFile = path.resolve(currentDir, pathToFile);
  return fs.promises.unlink(resolvedPathToFile);
}

export { cd, ls, readAndPrintFile, createEmptyFile, renameFile, copyFile, moveFile, deleteFile };