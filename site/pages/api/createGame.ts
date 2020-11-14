import wrapApi from '../../utils/wrapApi';

export default wrapApi(({ dom5Manager, method, body }) => {
  if (method !== 'POST') {
    const err: Error & { statusCode?: number } = new Error('Något gick fel');
    err.statusCode = 405;
    throw err;
  }
  dom5Manager.spawnGame(body);
});
