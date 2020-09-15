import { getVersion } from '../Dom5';

export class Manager {
  private _version: string | null = null;
  getVersion() {
    if (this._version == null) this._version = getVersion();
    return this._version;
  }
}

export default new Manager();
