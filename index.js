import { readAndPrintFile, createEmptyFile, renameFile, copyFile, moveFile, deleteFile } from './file-system.js';
import {cd, ls} from './navigation.js';
import { calculateHash } from './hash-calculation.js';
import { compress, decompress } from './compress-and-decompress.js';
import { currentDir } from './current-dir.js';

const parseArgs = () => {
  const args = {};
  process.argv.forEach((it, index) => {
    if (it.startsWith('--')) {
      const [key, value] = it.split('=');
      args[key] = value;
    }
  })
  return args;
};

const args = parseArgs();
const username = args['--username'];
const startMessage = `Welcome to the File Manager, ${username}!`;
const finalMessage = `Thank you for using File Manager, ${username}, goodbye!`
console.log(startMessage);

const showCurrentDir = () => {
   console.log('You are currently in:', currentDir.value);
}

showCurrentDir();

const checkParams = (params, length) => {
  if(params.length !== length) { 
    console.log('Invalid input');
    return false;
  } 
  return true;
}

const commands = {
  cd: async (params) => {
    if(!checkParams(params, 1)) {
      return;
    };
    const cdPath = params[0];
    await cd(cdPath);
  },

  up: async (params) => {
    if(!checkParams(params, 0)) {
      return;
    };
    await cd('..');
  },

  ls: async (params) => {
    if(!checkParams(params, 0)) {
      return;
    };
    await ls();
  }, 

  cat: async (params) => {
    if(!checkParams(params, 1)) {
      return;
    };
    await readAndPrintFile(params[0]);    
  },

  add: async (params) => {
    if(!checkParams(params, 1)) {
      return;
    };
    await createEmptyFile(params[0]);    
  },  
  
  rn: async (params) => {
    if(!checkParams(params, 2)) {
      return;
    };
    const pathToFile = params[0];
    const newFilename = params[1];
    await renameFile(pathToFile, newFilename);
  },

  cp: async (params) => {
    if(!checkParams(params, 2)) {
      return;
    };
    const pathToFile = params[0];
    const pathToNewDirectory = params[1];

    await copyFile(pathToFile, pathToNewDirectory);
  },

  mv: async (params) => {
    if(!checkParams(params, 2)) {
      return;
    };
    const pathToFile = params[0];
    const pathToNewDirectory = params[1];

    await moveFile(pathToFile, pathToNewDirectory);
  },

  rm: async (params) => {
    if(!checkParams(params, 1)) {
      return;
    };
    await deleteFile(params[0]);
  },

  hash: async (params) => {
    if(!checkParams(params, 1)) {
      return;
    };
    await calculateHash(params[0]);
  },

  compress: async (params) => {
    if(!checkParams(params, 2)) {
      return;
    };
    const filePath = params[0];
    const archivePath = params[1];

    await compress(filePath, archivePath);
  },

  decompress: async (params) => {
    if(!checkParams(params, 2)) {
      return;
    };
    const archivePath = params[0];
    const filePath = params[1];  

    await decompress(archivePath, filePath);
  },

  '.exit': async () => {
    console.log(finalMessage);
    process.exit();
  }
}

const splitParams = (params) => {
  const result = [];
  let counter = false;
  let value = '';
  params.split('').forEach(it => {
    if(it == '\'') {
      counter = !counter;
    } else if(((/[ \n\r]/).test(it)) && (counter == false)) {
      result.push(value);
      value = '';
    } else {
      value += it;
    }
  })
  if(value) {
    result.push(value);
  }
  return result;
}

process.stdin.on('data', async (data) => {
  // console.log(data.toString().split(/[ \n\r]/));
  const commandList = splitParams(data.toString()).filter(it => it);

  const command = commandList[0];
  const params = commandList.slice(1);

  // console.log('++', command, '++');
  // console.log('--', params, '--');

  const commandHandler = commands[command];
  if (commandHandler) {
    try {
      await commandHandler(params);
    } 
    catch(err) {
      console.log('Operation failed');
    }
    finally {
      showCurrentDir();
    }
    
  } else {
    console.log('Invalid input');
    showCurrentDir();
  }  
});

process.on('SIGINT', () => {
  console.log(finalMessage);
  process.exit();
})
