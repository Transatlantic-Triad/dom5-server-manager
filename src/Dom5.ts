import ChildProcess from 'child_process';
import path from 'path';
import { EventEmitter } from 'events';

const executableName = (() => {
  const { platform, arch } = process;
  try {
    switch (platform) {
      case 'darwin':
        if (arch !== 'x64') {
          throw new Error(`UNSUPPORTED ARCH: ${platform}-${arch}`);
        }
        return 'dom5_mac';
      case 'freebsd':
      case 'linux':
      case 'openbsd':
        switch (arch) {
          case 'arm':
            return 'dom5_arm';
          case 'x64':
            return 'dom5_amd64';
          case 'ia32':
            return 'dom5_x86';
          default:
            throw new Error(`UNSUPPORTED ARCH: ${platform}-${arch}`);
        }
      case 'win32':
        return 'Dominions5.exe';
      default:
        throw new Error(`UNSUPPORTED PLATFORM: ${platform}-${arch}`);
    }
  } catch (err) {
    console.error(err);
    return process.exit(-1);
  }
})();

const dom5version = (() => {
  const execPath = path.join(process.cwd(), 'dom5_files', executableName);
  const { status, error, stdout, stderr } = ChildProcess.spawnSync(
    execPath,
    ['--textonly', '--nosteam', '--version'],
    {
      cwd: path.join(process.cwd(), 'dom5_files'),
      timeout: 10000,
      encoding: 'utf-8',
      windowsHide: process.env.NODE_ENV === 'production',
      env: {
        ...process.env,
        DOM5_CONF: path.join(process.cwd(), 'dom5_home'),
      },
    },
  );
  if (error) {
    if ((error as typeof error & { code?: string }).code === 'ENOENT') {
      Object.assign(error, {
        message: `Could not find file: "${execPath}"`,
      });
    }
    console.error(error);
    process.exit((error as typeof error & { errno?: number }).errno || -1);
  }
  if (status !== 0) {
    console.error(stderr);
    const err = new Error('Non-zero exit code when checking version');
    console.error(err);
    process.exit(status || -1);
  }
  const version = stdout
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((s) => s.trim())
    .join(' ')
    .trim();
  return `${version} (${process.platform}-${process.arch})`;
})();

export type Dom5Options = {
  gameName: string;
  port?: number;
  hostInterval?: number;
  firstHostTimeout?: number;
  quickHost?: boolean;
  maxHoldUps?: number;
  nationSel?: boolean;
  clientStart?: boolean;
  statusHtml?: boolean;
};

export type Dom5MapOptions = {
  name: string;
  riverpart?: number;
  bridges?: number;
  extraislands?: number;
  seapart?: number;
  mountpart?: number;
  forestpart?: number;
  farmpart?: number;
  wastepart?: number;
  swamppart?: number;
  cavepart?: number;
  cavecluster?: number;
  kelppart?: number;
  gorgepart?: number;
  mapsize?: [number, number];
  mapprov?: number;
  mapscol?: [number, number, number, number];
  mapdscol?: [number, number, number, number];
  mapccol?: [number, number, number, number];
  mapbcol?: [number, number, number, number];
  mapsbcol?: [number, number, number, number];
  mapbtopcol?: [number, number, number, number];
  mapnoise?: number;
  mapdirt?: number;
  mapdirtcol?: number;
  mapdirtsize?: number;
  borderwidth?: number;
  hills?: number;
  rugedness?: number;
  seasize?: number;
  mapnospr?: boolean;
  vwrap?: boolean;
  nohwrap?: boolean;
  mapbunch?: number;
};

function spawnDom5(
  options: readonly Readonly<
    [
      string,
      (
        | string
        | boolean
        | readonly (string | number)[]
        | number
        | null
        | undefined
      ),
    ]
  >[],
) {
  const args = ['--textonly', '--nosteam'];
  for (const [key, val] of options) {
    if (key.length > 0 && val != null && val !== false) {
      args.push(`${key.length > 1 ? '--' : '-'}${key}`);
      if (typeof val === 'string' || typeof val === 'number') {
        args.push(String(val));
      } else if (Array.isArray(val)) {
        args.push(...val.map(String));
      }
    }
  }
  return ChildProcess.spawn(
    path.join(process.cwd(), 'dom5_files', executableName),
    args,
    {
      cwd: path.join(process.cwd(), 'dom5_files'),
      windowsHide: process.env.NODE_ENV === 'production',
      env: {
        ...process.env,
        DOM5_CONF: path.join(process.cwd(), 'dom5_home'),
      },
    },
  );
}

function ObjectToArray(
  options: Readonly<
    Partial<
      Record<
        string,
        string | boolean | readonly (string | number)[] | number | null
      >
    >
  >,
) {
  return Object.keys(options).map((key) => {
    return [key, options[key as keyof typeof options]] as const;
  });
}

export class Dom5Server extends EventEmitter {
  options: Dom5Options;

  constructor(options: Dom5Options) {
    super();
    this.options = options;
  }

  initNewGame() {
    console.log(this.options);
  }
  startServer() {
    console.log(this.options);
  }

  static generateMap({ name, ...options }: Dom5MapOptions) {
    try {
      const childProcess = spawnDom5(
        ObjectToArray({
          makemap: name,
          ...options,
        }),
      );
      return new Promise((_resolve, _reject) => {
        let fulfilled = false;
        const resolve = (val: unknown) => {
          if (!fulfilled) {
            fulfilled = true;
            _resolve(val);
          }
        };
        const reject = (err: Error) => {
          if (!fulfilled) {
            fulfilled = true;
            _reject(err);
          }
        };
        const buffer: string[] = [];
        function writeToBuffer(data: string) {
          buffer.push(data);
        }
        childProcess.stdout.on('data', writeToBuffer);
        childProcess.stderr.on('data', writeToBuffer);
        childProcess.once('error', (err) => {
          if (childProcess.exitCode != null && !childProcess.killed) {
            childProcess.kill('SIGKILL');
          }
          reject(err);
        });
        childProcess.once('exit', (exitCode, signal) => {
          if (signal !== null) {
            return reject(new Error(`Process killed with signal: ${signal}`));
          }
          if (exitCode !== 0) {
            return reject(
              new Error(`Process killed non-zero exit code: ${exitCode}`),
            );
          }
          return resolve(buffer.join(''));
        });
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export const VERSION = dom5version;
export const EXECUTABLE = executableName;
