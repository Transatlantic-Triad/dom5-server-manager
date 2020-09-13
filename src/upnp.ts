// Awaiting https://github.com/DefinitelyTyped/DefinitelyTyped/pull/47551

/* import {
  createClient,
  Client,
  NewPortMappingOpts,
  DeletePortMappingOpts,
  GetMappingOpts,
  Mapping,
  Device,
} from 'nat-upnp';

function promiseCb<T>(): ((err: Error | null, res?: T | null) => void) & {
  promise: Promise<T>;
};
function promiseCb<T>(
  allowNull: false,
): ((err: Error | null, res?: T | null) => void) & {
  promise: Promise<T>;
};
function promiseCb<T>(
  allowNull: true,
): ((err: Error | null, res?: T | null) => void) & {
  promise: Promise<T | null | void>;
};
function promiseCb<T>(
  allowNull?: boolean,
): ((err: Error | null, res?: T | null) => void) & {
  promise: Promise<T | null | void>;
} {
  let resolve: (value?: T | PromiseLike<T | null | void> | null) => void;
  let reject: (err: Error) => void;
  const promise = new Promise<T | void | null>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  const cb = (err: Error | null, res?: T | null) => {
    if (err || (!allowNull && res == null))
      reject(err || new Error('Invalid callback response. Got null response.'));
    else resolve(res);
  };
  cb.promise = promise;
  return cb;
}

function voidPromiseCb(): ((err: Error | null) => void) & {
  promise: Promise<void>;
} {
  let resolve: () => void;
  let reject: (err: Error) => void;
  const promise = new Promise<void>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  const cb = (err: Error | null) => {
    if (err) reject(err);
    else resolve();
  };
  cb.promise = promise;
  return cb;
}

export default class UpnpClient {
  private _client: Client;
  private _closed: boolean;

  get closed() {
    return this._closed;
  }

  constructor() {
    this._client = createClient();
    this._closed = false;
  }

  portMapping(opts: NewPortMappingOpts): Promise<void> {
    if (this._closed)
      return Promise.reject(new Error('Client already closed.'));
    const cb = voidPromiseCb();
    this._client.portMapping(opts, cb);
    return cb.promise;
  }

  portUnmapping(opts: DeletePortMappingOpts): Promise<void> {
    if (this._closed)
      return Promise.reject(new Error('Client already closed.'));
    const cb = voidPromiseCb();
    this._client.portUnmapping(opts, cb);
    return cb.promise;
  }

  getMappings(opts?: GetMappingOpts): Promise<Mapping[]> {
    if (this._closed)
      return Promise.reject(new Error('Client already closed.'));
    const cb = promiseCb<Mapping[]>();
    if (opts) this._client.getMappings(opts, cb);
    else this._client.getMappings(cb);
    return cb.promise;
  }

  externalIp(): Promise<string> {
    if (this._closed)
      return Promise.reject(new Error('Client already closed.'));
    const cb = promiseCb<string>();
    this._client.externalIp(cb);
    return cb.promise;
  }

  findGateway(): Promise<Device> {
    if (this._closed)
      return Promise.reject(new Error('Client already closed.'));
    const cb = promiseCb<Device>();
    this._client.findGateway(cb);
    return cb.promise;
  }

  close(): void {
    if (this._closed) throw new Error('Client already closed.');
    return this._client.close();
  }
} */
