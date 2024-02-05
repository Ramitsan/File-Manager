import os from 'os';

const osCommands = {
  '--EOL': () => {
    return `EOL: ${JSON.stringify(os.EOL)}`;
  },
  '--cpus': () => {
    const cpusAmount = `Overall amount: ${os.cpus().length}${os.EOL}`;
    const cpusData = os.cpus().map((item) => {
        const model = item.model; 
        const speed = item.speed / 1000 + 'GHz';
      return `${model} ${speed}`;
    }).join(os.EOL);  

    return  `${cpusAmount}${cpusData}`;
  },
  '--homedir': () => {
    return os.homedir();
  },
  '--username': () => {
    return os.userInfo().username;
  },
  '--architecture': () => {
    return os.arch();
  }
}

export const _os = async (command) => {
  const commandHandler = osCommands[command];
  if (commandHandler) {
    const result = commandHandler(command);
    console.log(result);
  } else {
    throw new Error();
  }
}