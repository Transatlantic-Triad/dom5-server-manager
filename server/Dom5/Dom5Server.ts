import { Dom5Options, Dom5MapOptions, transformOptions } from './options';
import spawnDom5, { runDom5AsPromise } from './spawner';
import { BaseConfig, ObjectToArray } from './utils';
import Dom5ServerEmitter from './Dom5EventEmitter';

type CP = typeof spawnDom5 extends (...args: any[]) => infer T ? T : never;

export default class Dom5Server extends Dom5ServerEmitter {
  private options: Dom5Options;
  public childProcess: CP | null = null;
  private bufindex: number = 0;
  private outputbuffer: ['stdout' | 'stderr', string][];
  private outputbuffercache: ['stdout' | 'stderr', string][] | null = null;
  private _crashed = false;
  private std: {
    err: string | null;
    out: string | null;
  } = {
    err: null,
    out: null,
  };

  /**
   * If the server isn't running, is that because it crashed
   */
  get crashed() {
    return this._crashed;
  }

  /**
   * Is the server currently running
   */
  isRunning(): this is this & { childProcess: CP } {
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

  getOutputBuffer(
    type?: 'stderr' | 'stdout',
  ): readonly Readonly<['stderr' | 'stdout', string]>[] {
    if (!this.outputbuffercache) {
      this.outputbuffercache = [];
      for (
        let i = this.getStartIndex();
        i !== this.bufindex;
        i = (i + 1) % this.outputbuffer.length
      ) {
        if (type == null || type === this.outputbuffer[i][0])
          this.outputbuffercache.push(this.outputbuffer[i]);
      }
    }
    return type == null
      ? this.outputbuffercache
      : this.outputbuffercache.filter(([buf]) => buf === type);
  }

  private addChunk(buf: 'out' | 'err', chunk: Buffer) {
    const chunkStr = chunk.toString('utf-8');
    const [first, ...lines] = chunkStr.replace(/\r\n/g, '\n').split('\n');
    const last = lines.pop();
    const { std } = this;
    const bufname = `std${buf}` as 'stdout' | 'stderr';
    if (std[buf] == null) std[buf] = first;
    else std[buf] += first;
    if (last != null) {
      this.outputbuffercache = null;
      let cur = this.outputbuffer[this.bufindex] ?? new Array(2);
      cur[0] = bufname;
      cur[1] = std[buf] as string;
      this.bufindex = (this.bufindex + 1) % this.outputbuffer.length;
      this.emit('line', std[buf] as string, bufname);
      lines.forEach((line) => {
        cur = this.outputbuffer[this.bufindex] ?? new Array(2);
        cur[0] = bufname;
        cur[1] = std[buf] as string;
        this.bufindex = (this.bufindex + 1) % this.outputbuffer.length;
        this.emit('line', line as string, bufname);
      });
      std[buf] = last === '' ? null : last;
    }
  }

  start(config?: BaseConfig) {
    if (this.isRunning()) {
      throw new Error('Cannot start server, server already running.');
    }
    this._crashed = false;
    const childProcess = spawnDom5(
      [
        ['statusdump', true],
        ['tcpserver', true],
        ...transformOptions(this.options),
      ],
      config,
    );
    this.childProcess = childProcess;
    let exited = false;
    childProcess.once('exit', (code, signal) => {
      exited = true;
      try {
        const { std } = this;
        if (std.out != null && std.out !== '') {
          this.outputbuffer[this.bufindex] = ['stdout', std.out];
          this.bufindex = (this.bufindex + 1) % this.outputbuffer.length;
          this.emit('line', std.out, 'stdout');
          std.out = null;
        }
        if (std.err != null && std.err !== '') {
          this.outputbuffer[this.bufindex] = ['stderr', std.err];
          this.bufindex = (this.bufindex + 1) % this.outputbuffer.length;
          this.emit('line', std.err, 'stderr');
          std.err = null;
        }
        if (code !== 0 && signal !== 'SIGKILL') {
          this._crashed = true;
        }
      } finally {
        this.childProcess = null;
        this.emit('exit', code, signal);
      }
    });
    childProcess.on('error', (err) => {
      try {
        this.emit('childerror', err);
      } finally {
        if (
          !exited &&
          (childProcess.exitCode != null || childProcess.signalCode != null)
        ) {
          childProcess.emit(
            'exit',
            childProcess.exitCode != null ? childProcess.exitCode : null,
            childProcess.signalCode,
          );
        }
      }
    });
    childProcess.stdout.on('data', (chunk: Buffer) =>
      this.addChunk('out', chunk),
    );
    childProcess.stderr.on('data', (chunk: Buffer) =>
      this.addChunk('err', chunk),
    );
  }

  stop(): Promise<NodeJS.Signals | null> {
    if (!this.isRunning()) {
      return Promise.reject(
        new Error('Cannot stop server, server not running.'),
      );
    }
    const { childProcess } = this;
    return new Promise((resolve) => {
      let timeout: NodeJS.Timeout | null = setTimeout(() => {
        timeout = null;
        childProcess.kill('SIGKILL');
      }, 30000);
      childProcess.kill('SIGTERM');
      childProcess.prependOnceListener('exit', (exitCode, signalCode) => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        resolve(signalCode);
      });
    });
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
