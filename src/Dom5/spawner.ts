import ChildProcess from 'child_process';
import path from 'path';

import { executableName } from './utils';

export type CommandOptions = readonly Readonly<
  | [
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
  | string
>[];

export default function spawnDom5(options: CommandOptions) {
  const args = ['--textonly', '--nosound', '--nosteam', '--nocrashbox'];
  for (const arg of options) {
    if (typeof arg === 'string') {
      args.push(arg);
    } else {
      const [key, val] = arg;
      if (key.length > 0 && val != null && val !== false) {
        args.push(`${key.length > 1 ? '--' : '-'}${key}`);
        if (typeof val === 'string' || typeof val === 'number') {
          args.push(String(val));
        } else if (Array.isArray(val)) {
          args.push(...val.map(String));
        }
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
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
}

/**
 * Run the dom5 executable and await the output as a promise
 * @param options Arguments to run
 * @param timeout If no output is generated for this amount of ms, abort. (default = 10000ms)
 */
export function runDom5AsPromise(
  options: CommandOptions,
  timeout: number = 10000,
): Promise<string> & { abort(): void } {
  try {
    const childProcess = spawnDom5(options);
    const promise = new Promise<string>((_resolve, _reject) => {
      let timer: NodeJS.Timeout | null = null;
      let fulfilled = false;
      const resolve = (val: string | PromiseLike<string>) => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (!fulfilled) {
          fulfilled = true;
          _resolve(val);
        }
      };
      const reject = (err: Error) => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (!fulfilled) {
          fulfilled = true;
          _reject(err);
        }
      };
      const timeoutFunc = () => {
        reject(new Error(`Execution stalled, no output for ${timeout}ms`));
        if (childProcess.exitCode == null && childProcess.signalCode == null) {
          childProcess.kill('SIGKILL');
        }
      };
      if (timeout > 0) {
        timer = setTimeout(timeoutFunc, timeout);
      }
      const buffer: Buffer[] = [];
      function writeToBuffer(data: Buffer) {
        if (timer) {
          clearTimeout(timer);
          timer = setTimeout(timeoutFunc, timeout);
        }
        buffer.push(data);
      }
      childProcess.stdout.on('data', writeToBuffer);
      childProcess.stderr.on('data', writeToBuffer);
      childProcess.once('error', (err) => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (childProcess.exitCode != null && !childProcess.killed) {
          childProcess.kill('SIGKILL');
        }
        // eslint-disable-next-line no-param-reassign
        (err as Error & { output: string }).output = buffer.join('');
        reject(err);
      });
      childProcess.once('exit', (exitCode, signal) => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        if (signal !== null) {
          const err = new Error(`Process killed with signal: ${signal}`);
          (err as Error & { output: string }).output = buffer.join('');
          return reject(err);
        }
        if (exitCode !== 0) {
          const err = new Error(
            `Process killed non-zero exit code: ${exitCode}`,
          );
          (err as Error & { output: string }).output = buffer.join('');
          return reject(err);
        }
        return resolve(buffer.join(''));
      });
    });
    (promise as Promise<string> & { abort(): void }).abort = () => {
      if (childProcess.exitCode != null && !childProcess.killed) {
        childProcess.kill('SIGKILL');
      }
    };
    return promise as Promise<string> & { abort(): void };
  } catch (err) {
    const promise = Promise.reject(err);
    (promise as Promise<never> & { abort(): void }).abort = () => {};
    return promise as Promise<never> & { abort(): void };
  }
}
