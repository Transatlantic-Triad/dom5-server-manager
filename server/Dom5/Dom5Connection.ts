// eslint-disable-next-line max-classes-per-file
import { Socket } from 'net';
import { EventEmitter } from 'events';
// Protocol:
// header 2b: 'fH'
// size 4b<LE>
// Payload: <size>

const MAX_PAYLOAD_SIZE = 4096;

class SocketClosedError extends Error {}

function socketData(socket: Socket): Promise<void> {
  if (socket.destroyed) {
    return Promise.reject(
      new SocketClosedError('Tried to consume from empty socket'),
    );
  }
  return new Promise((resolve, reject) => {
    let onData: () => void;
    const onClose = () => {
      socket.off('close', onClose);
      socket.off('data', onData);
      reject(new SocketClosedError('Socket closed while consuming.'));
    };
    onData = () => {
      socket.off('close', onClose);
      socket.off('data', onData);
      resolve();
    };
    socket.on('close', onClose);
    socket.on('data', onData);
  });
}

class Reader extends EventEmitter {
  private socket: Socket;
  private dataListener: (chunk: Buffer) => void;
  private closeListener: () => void;
  private buffers: Buffer[] = [];
  constructor(socket: Socket) {
    super();
    this.closeListener = () => {
      this.close();
    };
    this.dataListener = (chunk) => {
      this.buffers.push(chunk);
    };
    this.socket = socket
      .on('close', this.closeListener)
      .on('data', this.dataListener);
    this.startParse();
  }

  async consume(bytes: number): Promise<Buffer> {
    if (bytes <= 0) {
      throw new RangeError('Expected to consume more than 0 bytes');
    }
    let bufPointer = 0;
    // We will fill this buffer with data before returning
    // unsafe is okay
    const retBuf = Buffer.allocUnsafe(bytes);
    while (bufPointer < retBuf.length) {
      const [curBuf] = this.buffers;
      if (!curBuf) {
        // eslint-disable-next-line no-await-in-loop
        await socketData(this.socket);
      } else if (bufPointer + curBuf.length > retBuf.length) {
        curBuf.copy(retBuf, bufPointer, 0, retBuf.length - bufPointer);
        this.buffers[0] = curBuf.subarray(retBuf.length - bufPointer);
        bufPointer = retBuf.length;
      } else {
        this.buffers.unshift();
        curBuf.copy(retBuf, bufPointer);
        bufPointer += curBuf.length;
      }
    }
    return retBuf;
  }

  private async parseMessage(): Promise<void> {
    const flags = (await this.consume(1))[0];
    const size = (await this.consume(4)).readInt32LE();
    if (size === 0) {
      throw new Error('Got message of size 0, seems nonsensical');
    }
    const messageId = (await this.consume(1))?.[0];
    if (messageId === 0x0c) {
      // Goodbye
      
    }
  }

  private async startParse(): Promise<void> {
    try {
      const byte = await this.consume(1);
      if (!byte) return;
      const OP = byte[0];
      if (OP === 0x65) {
        // Single byte alive check
        // ignore, and parse next.
        this.startParse();
        return;
      }
      if (OP === 0x66) {
        await this.parseMessage();
        this.startParse();
        return;
      }
      throw new Error(`Unknown OP code: 0x${OP.toString(16)}`);
    } catch (err) {
      if (err instanceof SocketClosedError) {
        return;
      }
      throw err;
    }
  }

  public close() {
    this.removeAllListeners();
    this.setMaxListeners(0);
    this.socket.off('close', this.closeListener);
    this.socket.off('data', this.dataListener);
  }
}

export default function probeServerForInfo(
  port: number,
  host: string = 'localhost',
): Promise<unknown> {
  const socket = new Socket();
  const promise = new Promise((_resolve, _reject) => {
    let fulfilled = false;
    const reader = new Reader(socket);
    const resolve: typeof _resolve = (value) => {
      if (!fulfilled) {
        reader.close();
        fulfilled = true;
        _resolve(value);
      }
    };
    const reject: typeof _reject = (reason) => {
      if (!fulfilled) {
        reader.close();
        fulfilled = true;
        _reject(reason);
      }
    };
    reader.on('error', (err) => {
      if (!socket.destroyed) {
        socket.destroy(err);
      }
      reject(err);
    });
    reader.on('payload', (payload: Buffer) => {
      console.log(payload);
    });
    socket.once('connect', () => {
      console.log('CONNECTED!!');
      const buf = Buffer.alloc(13, undefined, 'binary');
      buf.writeUInt8(0x66, 0); // ascii f
      buf.writeUInt8(0x48, 1); // ascii H

      buf.writeUInt32LE(0x07, 2); // Payload length
      buf.writeUInt8(0x3d, 6); // ascii =
      buf.writeUInt8(0x1e, 7);
      buf.writeUInt8(0x02, 8);
      buf.writeUInt8(0x11, 9);
      buf.writeUInt8(0x45, 10); // ascii E
      buf.writeUInt8(0x05, 11);
      buf.writeUInt8(0x00, 12);
      socket.write(buf);
    });
    socket.once('close', (hadErr) => {
      console.log(`Socket closed${hadErr ? 'due to error' : ''}`);
    });
    socket.once('error', (err) => {
      reject(err);
    });
  }).finally(() => {
    if (!socket.destroyed) {
      socket.destroy();
    }
  });
  socket.connect({
    port,
    host,
  });
  return promise;
}
