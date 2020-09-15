import { EventEmitter } from 'events';

export default class Dom5EventEmitter extends EventEmitter {
  addListener(event: 'error', listener: (err: Error) => void): this;
  addListener(
    event: 'exit',
    listener: (code: number | null, signal: NodeJS.Signals | null) => void,
  ): this;
  addListener(event: string, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  emit(event: 'error', err: Error): boolean;
  emit(
    event: 'exit',
    code: number | null,
    signal: NodeJS.Signals | null,
  ): boolean;
  emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  on(event: 'error', listener: (err: Error) => void): this;
  on(
    event: 'exit',
    listener: (code: number | null, signal: NodeJS.Signals | null) => void,
  ): this;
  on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  once(event: 'error', listener: (err: Error) => void): this;
  once(
    event: 'exit',
    listener: (code: number | null, signal: NodeJS.Signals | null) => void,
  ): this;
  once(event: string, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  prependListener(event: 'error', listener: (err: Error) => void): this;
  prependListener(
    event: 'exit',
    listener: (code: number | null, signal: NodeJS.Signals | null) => void,
  ): this;
  prependListener(event: string, listener: (...args: any[]) => void): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(event: 'error', listener: (err: Error) => void): this;
  prependOnceListener(
    event: 'exit',
    listener: (code: number | null, signal: NodeJS.Signals | null) => void,
  ): this;
  prependOnceListener(event: string, listener: (...args: any[]) => void): this {
    return super.prependOnceListener(event, listener);
  }
}
