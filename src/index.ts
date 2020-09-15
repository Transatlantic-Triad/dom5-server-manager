import Dom5Server, { getVersion } from './Dom5';

console.log('Loaded:', getVersion());

(async () => {
  // Async context where you can use await <3
  // await Dom5Server.generateMap({
  //  name: 'test',
  // });
  const serv = new Dom5Server({
    gameName: 'love_you_echo',
    port: 9999,
    era: 'middle',
    mapfile: 'test',
  });
  serv.startServer();
})().catch((err) => {
  console.error(err);
  if (err.output) console.error(err.output);
  process.exitCode = -1;
});
