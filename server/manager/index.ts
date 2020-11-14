import type BetterSqlite3 from 'better-sqlite3';
import Dom5Server, { Dom5Options, getVersion } from '../Dom5';
import { getConfig } from '../Dom5/utils';

import db from '../db';

function validateSchema() {
  db.exec(`CREATE TABLE IF NOT EXISTS games(
    id integer PRIMARY KEY,
    name text NOT NULL,
    config text NOT NULL,
    game_active BOOLEAN NOT NULL CHECK (game_active IN (0,1)) DEFAULT 0
  );`);
}

export class Manager {
  private _version: string | null = null;
  private addGameStatement: BetterSqlite3.Statement<any[]>;
  private games: Dom5Server[] = [];

  constructor() {
    validateSchema();
    this.addGameStatement = db.prepare(`
      INSERT INTO games (name, config, game_active) VALUES (?,?,?);
    `);
    const read = db.prepare(`SELECT * FROM games;`);
    for (const gameRow of read.iterate()) {
      const game = new Dom5Server(JSON.parse(gameRow.config));
      this.games.push(game);
      console.log(gameRow);
      if (gameRow.game_active === 1) {
        game.on('childerror', (err) => console.error(err));
        game.on('exit', (...args) => console.log(args, game.getOutputBuffer()));
        game.start().then(
          () => console.log('started'),
          (err) => console.error(err),
        );
      }
    }
  }

  spawnGame(options: Dom5Options) {
    this.addGameStatement.run(options.gameName, JSON.stringify(options), 1);
    const game = new Dom5Server(options);
    this.games.push(game);
    game.start();
  }

  getVersion() {
    if (this._version == null) this._version = getVersion();
    return this._version;
  }
  getConfig = getConfig;
}

export default new Manager();
