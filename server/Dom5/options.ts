import { CommandOptions } from './spawner';

const days = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export type Day = keyof typeof days;

const teamTypes = {
  pretender: 1,
  disciple: 2,
};

export type TeamType = keyof typeof teamTypes;

const eras = {
  early: 1,
  middle: 2,
  late: 3,
};

export type Era = keyof typeof eras;

const eventRarities = {
  common: 1,
  rare: 2,
};

export type EventRarity = keyof typeof eventRarities;

const aiLevels = {
  easy: 1,
  normal: 2,
  difficult: 3,
  mighty: 4,
  master: 5,
  impossible: 6,
};

export type AILevel = keyof typeof aiLevels;

export type Dom5Options = {
  /** Name of the save-game file */
  gameName: string;
  /** Host the game on this port */
  port: number;
  /** Filename of map. E.g. eye.map */
  mapfile: string;
  /** New game created in this era */
  era: Era;
  /** Host on day and hour (0-23) */
  hosttime?: {
    day: Day;
    /** Accepted values 0-23 */
    hour: number;
  };
  /** Set host interval in minutes */
  hostminutes?: number;
  /** Set host interval in hours */
  hosthours?: number;
  /** Stop timer on this day */
  pauseday?: Day;
  /** Hours until first host (default = full host interval) */
  timeleft?: number;
  /** Don't host just because all turns are done */
  noquickhost?: boolean;
  /** Quickhost disregards players that have stalled last this amount of turns */
  maxholdups?: number;
  /** No nation selection when resuming a network game */
  nonationsel?: boolean;
  /** Clients cannot start the game during Choose Participants */
  noclientstart?: boolean;
  /** Game is created after this many minutes */
  uploadtime?: number;
  /** Game is created if this many players join */
  uploadmaxp?: number;
  /** List of closed nations (accepted values 5-249) */
  closed?: number[];
  /** List of nations controlled by easy AI (accepted values 5-249) */
  easyai?: number[];
  /** List of nations controlled by normal AI (accepted values 5-249) */
  normai?: number[];
  /** List of nations controlled by difficult AI (accepted values 5-249) */
  diffai?: number[];
  /** List of nations controlled by mighty AI (accepted values 5-249) */
  mightyai?: number[];
  /** List of nations controlled by master AI (accepted values 5-249) */
  masterai?: number[];
  /** List of nations controlled by impossible AI (accepted values 5-249) */
  impai?: number[];
  /** List of nation team memberships */
  teams?: {
    nation: number;
    team: number;
    type: TeamType;
  }[];
  /** Don't download mods from game server automatically */
  nodownloadmods?: boolean;
  /** Disallow download/upload turns using the master password */
  nomaster?: boolean;
  /** Research difficulty 0 to 4 (default 2) */
  research?: number;
  /** No random start research */
  norandres?: boolean;
  /** Size of Hall of Fame 5-15 (default 10) */
  hofsize?: number;
  /** Global Enchantment slots 3-9 (default 5) */
  globals?: number;
  /** Strength of Independents 0-9 (default 5) */
  indepstr?: number;
  /** Magic site frequency 0-75 (default 40) */
  magicsites?: number;
  /** Random event rarity */
  eventrarity?: EventRarity;
  /** Money multiple 50-300 (default 100) */
  richness?: number;
  /** Resource multiple 50-300 (default 100) */
  resources?: number;
  /** Unit recruitment point multiple 50-300 (default 100) */
  recruitment?: number;
  /** Supply multiple 50-300 (default 100) */
  supplies?: number;
  /** Master password. E.g. masterblaster */
  masterpass?: string;
  /** Number of starting provinces (1-9) */
  startprov?: number;
  /** Enable commander renaming */
  renaming?: boolean;
  /** Enable score graphs during play */
  scoregraphs?: boolean;
  /** No info at all on other nations */
  nonationinfo?: boolean;
  /** Turns off cheat detection */
  nocheatdet?: boolean;
  /** Disable all mods */
  nomods?: boolean;
  /** List of filenames of mods to enable */
  enablemods?: string[];
  /** Players can create more than one artifact per turn */
  noartrest?: boolean;
  /** Disciple game, multiple players on same team */
  teamgame?: boolean;
  /** Clustered start positions for team game */
  clustered?: boolean;
  /** Disable all story events */
  nostoryevents?: boolean;
  /** Enable some story events */
  storyevents?: boolean;
  /** Enable all story events */
  allstoryevents?: boolean;
  /** AI level for human players who quit (default normal) */
  newailvl?: AILevel;
  /** Disable become AI controlled */
  nonewai?: boolean;
  /** Set whether upnp is used for automatic portfortarding */
  useUpnp?: boolean;
};

export type Dom5MapOptions = {
  /** Filename of the map */
  name: string;
  /** 0-1000, 0=no rivers (default 50) */
  riverpart?: number;
  /** Bridge chance 0-100, 0=no bridges (default 60) */
  bridges?: number;
  /** Chance of extra islands 0-100, (default 0) */
  extraislands?: number;
  /** Percent of map that is below water level (default 30) */
  seapart?: number;
  /** Percent of map that is mountains (default 20) */
  mountpart?: number;
  /** Percent of lands that are forests (default 20) */
  forestpart?: number;
  /** Percent of lands that are farm lands (default 15) */
  farmpart?: number;
  /** Percent of lands that are wastes (default 10) */
  wastepart?: number;
  /** Percent of lands that are swamps (default 10) */
  swamppart?: number;
  /** Percent of lands that are caves (default 3) */
  cavepart?: number;
  /** Percent of caves that are clusters (default 20) */
  cavecluster?: number;
  /** Percent of seas that are kelp forests (default 25) */
  kelppart?: number;
  /** Percent of deeps seas that are gorges (default 25) */
  gorgepart?: number;
  /** Set width and height of random map (default 3000 2000) */
  mapsize?: [number, number];
  /** Set number of provinces (default 150) */
  mapprov?: number;
  /** [R, G, B, A] Sea color 0-255 (default [54, 54, 130, 255]) */
  mapscol?: [number, number, number, number];
  /** [R, G, B, A] Deep Sea color 0-255 (default depending on mapscol) */
  mapdscol?: [number, number, number, number];
  /** [R, G, B, A] Coast color 0-255 (default depending on mapscol) */
  mapccol?: [number, number, number, number];
  /** [R, G, B, A] Ground border color 0-255 */
  mapbcol?: [number, number, number, number];
  /** [R, G, B, A] Sea border color 0-255 */
  mapsbcol?: [number, number, number, number];
  /** [R, G, B, A] Top border color 0-255 */
  mapbtopcol?: [number, number, number, number];
  /** Ground color noise 0-255 (default 15) */
  mapnoise?: number;
  /** Amount of dirt blobs (default 100) */
  mapdirt?: number;
  /** Color variance of dirt blobs (default 5) */
  mapdirtcol?: number;
  /** Size of dirt blobs (default 100) */
  mapdirtsize?: number;
  /** Border width 0-500 (default 100) */
  borderwidth?: number;
  /** Number of Hills/Craters (default 150) */
  hills?: number;
  /** Rugedness 0-100 (default 30) */
  rugedness?: number;
  /** Sea size, 100=normal land size (default 350) */
  seasize?: number;
  /** Don't draw any sprites on the map */
  mapnospr?: boolean;
  /** Make map wrap north/south */
  vwrap?: boolean;
  /** Make map not wrap east/west */
  nohwrap?: boolean;
  /** When making a bunch, make this many maps (default 12) */
  mapbunch?: number;
};

type Mutable<T> = { -readonly [P in keyof T]: T[P] };
type NonPartial<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Dom5Options we're using internally but the executable don't understand.
 */
const nonExecOptions: readonly (keyof Dom5Options)[] = ['useUpnp'];

export function transformOptions(options: Dom5Options): CommandOptions {
  const parsed: Mutable<CommandOptions> = [];
  let gameName: string | null = null;
  for (const rawKey in options) {
    if (
      Object.prototype.hasOwnProperty.call(options, rawKey) &&
      options[rawKey as keyof Dom5Options] != null
    ) {
      // We have made sure that options[key] is there and not undefined
      // we can treat it as fully populated.
      const fullOpts = options as NonPartial<Dom5Options>;
      const key = rawKey as keyof Dom5Options;
      switch (key) {
        case 'era':
          parsed.push([key, eras[fullOpts[key]]]);
          break;
        case 'eventrarity':
          parsed.push([key, eventRarities[fullOpts[key]]]);
          break;
        case 'newailvl':
          parsed.push([key, aiLevels[fullOpts[key]]]);
          break;
        case 'hosttime':
          parsed.push([key, [days[fullOpts[key].day], fullOpts[key].hour]]);
          break;
        case 'teams':
          fullOpts[key].forEach((team) => {
            parsed.push([key, [team.nation, team.team, teamTypes[team.type]]]);
          });
          break;
        case 'mapfile':
          if (fullOpts[key].endsWith('.map')) parsed.push([key, fullOpts[key]]);
          else parsed.push([key, `${fullOpts[key]}.map`]);
          break;
        case 'enablemods':
          fullOpts[key].forEach((entry: string | number) => {
            parsed.push(['enablemod', entry]);
          });
          break;
        case 'gameName':
          gameName = fullOpts[key];
          break;
        default: {
          if (nonExecOptions.includes(key)) break;
          const val: string | number | boolean | number[] | string[] =
            fullOpts[key];
          if (Array.isArray(val)) {
            val.forEach((entry: string | number) => {
              parsed.push([key, entry]);
            });
          } else {
            parsed.push([key, val]);
          }
        }
      }
    }
  }
  if (gameName) {
    parsed.push(gameName);
  }
  return parsed;
}
