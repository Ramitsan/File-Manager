import fs from 'fs';
import path from 'path';
import { currentDir } from './current-dir.js';

// Read file and print it's content in console (should be done using Readable stream)
const readAndPrintFile = async (filePath) => {
  return new Promise((res, rej) => {
    const resolvedFilePath = path.resolve(currentDir.value, filePath);
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
  const resolvedNewFileName = path.resolve(currentDir.value, newFileName);
  let result;
  try {
    result = await fs.promises.open(resolvedNewFileName, 'w'); 
  }  
  finally {
    await result?.close();
  }
  return result;
}

// Rename file (content should remain unchanged)
const renameFile = async (pathToFile, newFilename) => {
  const resolvedPathToFile = path.resolve(currentDir.value, pathToFile);
  const resolvedNewFilename = path.resolve(currentDir.value, newFilename);
  return fs.promises.rename(resolvedPathToFile, resolvedNewFilename);
}

// Copy file (should be done using Readable and Writable streams)
const copyFile = async (pathToFile, pathToNewDirectory) => {
  return new Promise ((res, rej) => {
    try {
      const resolvedPathToFile = path.resolve(currentDir.value, pathToFile);
      const resolvedPathToNewDirectory = path.resolve(currentDir.value, pathToNewDirectory);
    
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
      const resolvedPathToFile = path.resolve(currentDir.value, pathToFile);
      const resolvedPathToNewDirectory = path.resolve(currentDir.value, pathToNewDirectory);
    
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
  const resolvedPathToFile = path.resolve(currentDir.value, pathToFile);
  return fs.promises.unlink(resolvedPathToFile);
}

export { readAndPrintFile, createEmptyFile, renameFile, copyFile, moveFile, deleteFile };