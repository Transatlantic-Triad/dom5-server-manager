import ChildProcess from 'child_process';
import path from 'path';

export type BaseConfig = {
  /** Name of executable (default autodetect based on platform) */
  EXEC_NAME: string;
  /** Directory of executable (default `{process.cwd()}/dom5_files`) */
  EXEC_DIR: string;
  /** CWD for Dom5 subprocess (default `{EXEC_DIR}`) */
  CWD: string;
  /** Value for DOM5_DATA env-var (default `{EXEC_DIR}/data`) */
  DOM5_DATA: string;
  /** Value for DOM5_MAPS env-var (default `{DOM5_DATA}/../maps`) */
  DOM5_MAPS: string;
  /** Value for DOM5_CONF env-var (default `{process.cwd()}/dom5_home`) */
  DOM5_CONF: string;
  /** Value for DOM5_SAVE env-var (default `{DOM5_CONF}/savedgames`) */
  DOM5_SAVE: string;
  /** Value for DOM5_LOCALMAPS env-var (default `{DOM5_CONF}/maps`) */
  DOM5_LOCALMAPS: string;
  /** Value for DOM5_MODS env-var (default `{DOM5_CONF}/mods`) */
  DOM5_MODS: string;
};

const BASE_CONFIG: BaseConfig = {
  EXEC_NAME: '',
  EXEC_DIR: '',
  CWD: '',
  DOM5_DATA: '',
  DOM5_MAPS: '',
  DOM5_CONF: '',
  DOM5_SAVE: '',
  DOM5_LOCALMAPS: '',
  DOM5_MODS: '',
};

function autodetectExecutable() {
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
}

export function configure(opts: Partial<BaseConfig>) {
  BASE_CONFIG.EXEC_NAME = opts.EXEC_NAME || autodetectExecutable();
  BASE_CONFIG.EXEC_DIR =
    opts.EXEC_DIR || path.join(process.cwd(), 'dom5_files');
  BASE_CONFIG.CWD = opts.CWD || BASE_CONFIG.EXEC_DIR;
  BASE_CONFIG.DOM5_DATA =
    opts.DOM5_DATA || path.join(BASE_CONFIG.EXEC_DIR, 'data');
  BASE_CONFIG.DOM5_MAPS =
    opts.DOM5_MAPS || path.join(BASE_CONFIG.DOM5_DATA, '..', 'data');
  BASE_CONFIG.DOM5_CONF =
    opts.DOM5_CONF || path.join(process.cwd(), 'dom5_home');
  BASE_CONFIG.DOM5_SAVE =
    opts.DOM5_SAVE || path.join(BASE_CONFIG.DOM5_CONF, 'savedgames');
  BASE_CONFIG.DOM5_LOCALMAPS =
    opts.DOM5_LOCALMAPS || path.join(BASE_CONFIG.DOM5_CONF, 'maps');
}
configure({}); // Init the config

export function getConfig(
  overrides?: Partial<BaseConfig>,
): Readonly<BaseConfig> {
  if (!overrides) return BASE_CONFIG;
  return {
    EXEC_NAME: overrides.EXEC_NAME || BASE_CONFIG.EXEC_NAME,
    EXEC_DIR: overrides.EXEC_DIR || BASE_CONFIG.EXEC_DIR,
    CWD: overrides.CWD || BASE_CONFIG.CWD,
    DOM5_DATA: overrides.DOM5_DATA || BASE_CONFIG.DOM5_DATA,
    DOM5_MAPS: overrides.DOM5_MAPS || BASE_CONFIG.DOM5_MAPS,
    DOM5_CONF: overrides.DOM5_CONF || BASE_CONFIG.DOM5_CONF,
    DOM5_SAVE: overrides.DOM5_SAVE || BASE_CONFIG.DOM5_SAVE,
    DOM5_LOCALMAPS: overrides.DOM5_LOCALMAPS || BASE_CONFIG.DOM5_LOCALMAPS,
    DOM5_MODS: overrides.DOM5_MODS || BASE_CONFIG.DOM5_MODS,
  };
}

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

export function getVersion(config?: Partial<BaseConfig>) {
  const {
    EXEC_DIR,
    EXEC_NAME,
    CWD: cwd,
    DOM5_DATA,
    DOM5_MAPS,
    DOM5_CONF,
    DOM5_SAVE,
    DOM5_LOCALMAPS,
    DOM5_MODS,
  } = getConfig(config);
  const execPath = path.join(EXEC_DIR, EXEC_NAME);
  const { status, error, stdout, stderr } = ChildProcess.spawnSync(
    execPath,
    ['--textonly', '--nosteam', '--version'],
    {
      cwd,
      timeout: 10000,
      encoding: 'utf-8',
      windowsHide: process.env.NODE_ENV === 'production',
      env: {
        ...process.env,
        DOM5_DATA,
        DOM5_MAPS,
        DOM5_CONF,
        DOM5_SAVE,
        DOM5_LOCALMAPS,
        DOM5_MODS,
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
}
