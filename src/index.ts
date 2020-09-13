import { Dom5Server, VERSION } from '@/Dom5';

console.log('Generating map using:', VERSION);

Dom5Server.generateMap({
  name: 'test',
}).then(console.log, console.error);
