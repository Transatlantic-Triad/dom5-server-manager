import Sqlite3 from 'better-sqlite3';

const db = new Sqlite3('dom5data.db', { verbose: console.log });
export default db;
