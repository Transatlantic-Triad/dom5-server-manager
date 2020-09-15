import chalk from 'chalk';
import { Dom5Options, Dom5MapOptions, transformOptions } from './options';
import spawnDom5, { runDom5AsPromise } from './spawner';
import { ObjectToArray } from './utils';
import Dom5ServerEmitter from './Dom5EventEmitter';

type CP = typeof spawnDom5 extends (...args: any[]) => infer T ? T : never;

export default class Dom5Server extends Dom5ServerEmitter {
  private options: Dom5Options;
  private childProcess: CP | null = null;
  private bufindex: number = 0;
  private outputbuffer: ['stdout' | 'stderr', 'string'][];
  private _crashed = false;

  /**
   * If the server isn't running, is that because it crashed
   */
  get crashed() {
    return this._crashed;
  }

  /**
   * Is the server currently running
   */
  get running() {
    return this.childProcess != null;
  }

  constructor(options: Dom5Options, buflen = 500) {
    super();
    if (!options.gameName.match(/^[a-z0-9_-]+$/i)) {
      throw new Error(
        'Invalid gameName. Please only use alphanumerical characters, underscores, and hyphens',
      );
    }
    this.options = options;
    this.outputbuffer = new Array(buflen);
  }

  private getStartIndex() {
    for (let i = 0; i < this.outputbuffer.length; i++) {
      const index = (i + this.bufindex + 1) % this.outputbuffer.length;
      if (this.outputbuffer[index] != null) return index;
    }
    return this.bufindex;
  }

  startServer() {
    if (this.running) {
      throw new Error('Cannot start server, server already running.');
    }
    this._crashed = false;
    const childProcess = spawnDom5([
      ['statusdump', true],
      ['tcpserver', true],
      ...transformOptions(this.options),
    ]);
    // this.childProcess = childProcess;
    childProcess.once('exit', (code, signal) => {
      if (code !== 0 && signal !== 'SIGKILL') {
        this._crashed = true;
      }
      this.emit('exit', code, signal);
      this.childProcess = null;
    });
    childProcess.on('error', (err) => {
      this.emit('error', err);
    });
    childProcess.stdout.on('data', (chunk: Buffer) =>
      process.stdout.write(chunk.toString('utf-8')),
    );
    childProcess.stderr.on('data', (chunk: Buffer) =>
      process.stderr.write(chalk.red(chunk.toString('utf-8'))),
    );
  }

  static generateMap({ name, ...options }: Dom5MapOptions) {
    return runDom5AsPromise(
      ObjectToArray({
        makemap: name,
        ...options,
      }),
      0,
    );
  }
}
