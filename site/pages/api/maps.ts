import { promisify } from 'util';
import { readdir as orgReaddir } from 'fs';
import wrapApi from '../../utils/wrapApi';

const readdir = promisify(orgReaddir);

export default wrapApi(async ({ dom5Manager }) => {
  const { DOM5_MAPS, DOM5_LOCALMAPS } = dom5Manager.getConfig();
  const maps: string[] = [];
  maps.push(
    ...(await readdir(DOM5_MAPS)).filter((file) => file.endsWith('.map')),
  );
  maps.push(
    ...(await readdir(DOM5_LOCALMAPS)).filter(
      (file) => file.endsWith('.map') && !maps.includes(file),
    ),
  );
  return maps;
});
