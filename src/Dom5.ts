import childProcess from 'child_process';
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
  const { status, error, stdout, stderr } = childProcess.spawnSync(
    execPath,
    ['--textonly', '--version'],
    {
      cwd: path.join(process.cwd(), 'dom5_files'),
      timeout: 10000,
      encoding: 'utf-8',
      windowsHide: true,
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
    .split('\r\n')
    .map((s) => s.trim())
    .join(' ')
    .split('\n')
    .map((s) => s.trim())
    .join(' ')
    .trim();
  return `${version} (${process.platform}-${process.arch})`;
})();

export type Dom5Options = {
  status?: boolean;
};

export class Dom5Server extends EventEmitter {
  options: Dom5Options;

  constructor(options: Dom5Options) {
    super();
    this.options = options;
  }
}

export const VERSION = dom5version;
export const EXECUTABLE = executableName;
