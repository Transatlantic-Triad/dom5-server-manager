import { getVersion } from '../Dom5';
import { getConfig } from '../Dom5/utils';

export class Manager {
  private _version: string | null = null;
  getVersion() {
    if (this._version == null) this._version = getVersion();
    return this._version;
  }
  getConfig = getConfig;
}

export default new Manager();
