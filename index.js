import path from 'path';

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

  },
  ls: (params) => {

  }
}

process.stdin.on('data', (data) => {
  const command = data.toString().split(' ')[0];
  const params = data.toString().slice(command.length);
  console.log(command, params);
  const commandHandler = commands[command];
  if(commandHandler) {
    commandHandler(params);
  } else {
    console.log('unknown command')
  }
});


process.on('SIGINT', () => {
  console.log('close');
  process.exit();
})