import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import type { Era } from '../../../../server/Dom5/options';

export type States = {
  gameName: string;
  setGameName: Dispatch<SetStateAction<string>>;
  port: string;
  setPort: Dispatch<SetStateAction<string>>;
  useUpnp: boolean;
  setUseUpnp: Dispatch<SetStateAction<boolean>>;
  era: Era;
  setEra: Dispatch<SetStateAction<Era>>;
  mapFile: string;
  setMapFile: Dispatch<SetStateAction<string>>;
};

export type Config = {
  gameName: string;
  port: number;
  useUpnp: boolean;
  era: Era;
  mapfile: string;
};

export default function useHostingInfoHooks(): {
  states: States;
  getConfig: () => Config;
} {
  const [gameName, setGameName] = useState('');
  const [port, setPort] = useState('');
  const [useUpnp, setUseUpnp] = useState(true);
  const [era, setEra] = useState<Era>('early');
  const [mapFile, setMapFile] = useState('');
  const getConfig = useCallback<() => Config>(() => {
    if (!gameName.match(/^[a-z0-9_-]+$/i)) {
      throw new Error(
        'Invalid game name! Only alphanumeric characters, underscore and hyphens are allowed',
      );
    }
    const portNum = Number(port);
    if (!port.match(/^\d+$/) || portNum < 1 || portNum > 65535) {
      throw new RangeError('port needs to be an integer between 1 and 65535');
    }
    return {
      gameName,
      port: portNum,
      useUpnp,
      era,
      mapfile: mapFile,
    };
  }, [gameName, port, useUpnp, era, mapFile]);
  return {
    getConfig,
    states: {
      gameName,
      setGameName,
      port,
      setPort,
      useUpnp,
      setUseUpnp,
      era,
      setEra,
      mapFile,
      setMapFile,
    },
  };
}
