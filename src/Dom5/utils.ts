import ChildProcess from 'child_process';
import path from 'path';

export function ObjectToArray(
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

export const executableName = (() => {
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

export const version = (() => {
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

  return `${stdout
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((s) => s.trim())
    .join(' ')
    .trim()} (${process.platform}-${process.arch})`;
})();
