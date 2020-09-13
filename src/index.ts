import { Dom5Server, VERSION } from '@/Dom5';

console.log('Generating map using:', VERSION);

(async () => {
  // Async context where you can use await <3
  //console.log(
  //  await Dom5Server.generateMap({
  //    name: 'test',
  //  }),
  //);
  const serv = new Dom5Server({
    gameName: 'love_you_echo',
  });
  console.log(await serv.initNewGame({ mapfile: 'test.map' }));
})().catch((err) => {
  console.error(err);
  if (err.output) console.error(err.output);
  process.exitCode = -1;
});
