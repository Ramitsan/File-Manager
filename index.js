import { cd, ls, readAndPrintFile, createEmptyFile, renameFile, copyFile, moveFile, deleteFile } from './file-system.js';

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
console.log(args);
const commands = {
  cd: (params) => {
    const cdPath = params[0];
    cd(cdPath);
  },
  ls: (params) => {
    ls();
  }, 

  cat: (params) => {
    readAndPrintFile(params);    
  },

  add: (params) => {
    createEmptyFile(params);    
  },  
  
  rn: (params) => {
    const pathToFile = params.split(' ')[0];
    const newFilename = params.split(' ')[1];
    renameFile(pathToFile, newFilename);
  },

  cp: (params) => {
    const pathToFile = params.split(' ')[0];
    const pathToNewDirectory = params.split(' ')[1];

    copyFile(pathToFile, pathToNewDirectory);
  },

  mv: (params) => {
    const pathToFile = params.split(' ')[0];
    const pathToNewDirectory = params.split(' ')[1];

    moveFile(pathToFile, pathToNewDirectory);
  },

  rm: (params) => {
    deleteFile(params);
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

console.log(splitParams('xfojgfidpj'));
console.log(splitParams('xfoj gfidpj'));
console.log(splitParams('\'xfoj\' \'gfidpj\''));
console.log(splitParams('\'xf oj\' \'gfi dpj\''));

process.stdin.on('data', (data) => {
  console.log(data.toString().split(/[ \n\r]/));
  // const commandList = data.toString().split(/[ \n\r]/).filter(it => it);
  const commandList = splitParams(data.toString()).filter(it => it);


  const command = commandList[0];
  const params = commandList.slice(1);

  // console.log('++', command, '++');
  // console.log('--', params, '--');

  const commandHandler = commands[command];
  if (commandHandler) {
    commandHandler(params);
  } else {
    console.log('unknown command')
  }
});


process.on('SIGINT', () => {
  console.log('close');
  process.exit();
})

// console.log(process.env);