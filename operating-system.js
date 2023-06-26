import os from 'os';

const osCommands = {
  '--EOL': () => {
    return os.EOL;
  },
  '--cpus': () => {
    return os.cpus();
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