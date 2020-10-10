import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import type { Day } from '../../../../server/Dom5/options';
import type { Hour } from '../../HourSelector';

export type States = {
  hostTimerMode: string;
  setHostTimerMode: Dispatch<SetStateAction<string>>;
  disableQuickhost: boolean;
  setDisableQuickhost: Dispatch<SetStateAction<boolean>>;
  disableClientStart: boolean;
  setDisableClientStart: Dispatch<SetStateAction<boolean>>;
  hostDay: Day;
  setHostDay: Dispatch<SetStateAction<Day>>;
  hostHour: Hour;
  setHostHour: Dispatch<SetStateAction<Hour>>;
  hours: string;
  setHours: Dispatch<SetStateAction<string>>;
  minutes: string;
  setMinutes: Dispatch<SetStateAction<string>>;
  pauseDay: Day | 'none';
  setPauseDay: Dispatch<SetStateAction<Day | 'none'>>;
  maxHoldUps: string;
  setMaxHoldUps: Dispatch<SetStateAction<string>>;
};

export type Config = {
  noclientstart: boolean;
  noquickhost: boolean;
  hosttime?: {
    day: Day;
    hour: number;
  };
  hosthours?: number;
  hostminutes?: number;
  pauseday?: Day;
  maxholdups?: number;
};

export default function useHostingInfoHooks(): {
  states: States;
  getConfig: () => Config;
} {
  const [hostTimerMode, setHostTimerMode] = useState('none');
  const [disableQuickhost, setDisableQuickhost] = useState(false);
  const [disableClientStart, setDisableClientStart] = useState(true);
  const [hostDay, setHostDay] = useState<Day>('monday');
  const [hostHour, setHostHour] = useState<Hour>('0');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [pauseDay, setPauseDay] = useState<Day | 'none'>('none');
  const [maxHoldUps, setMaxHoldUps] = useState('');
  const getConfig = useCallback<() => Config>(() => {
    switch (hostTimerMode) {
      case 'weekday': {
        const hour = Number(hostHour);
        let maxholdups: number | undefined;
        if (maxHoldUps !== '') {
          maxholdups = Number(maxHoldUps);
          if (!maxHoldUps.match(/^\d+$/) || maxholdups <= 0) {
            throw new TypeError(
              'maxHoldUps needs to be an integer between 0-23.',
            );
          }
        }
        return {
          noclientstart: disableClientStart,
          noquickhost: disableQuickhost,
          hosttime: {
            day: hostDay,
            hour,
          },
          maxholdups,
        };
      }
      case 'hours': {
        const hosthours = Number(hours);
        if (!hours.match(/^\d+$/) || hosthours <= 0) {
          throw new RangeError('hours needs to be a positive integer.');
        }
        let maxholdups: number | undefined;
        if (maxHoldUps !== '') {
          maxholdups = Number(maxHoldUps);
          if (!maxHoldUps.match(/^\d+$/) || maxholdups <= 0) {
            throw new TypeError(
              'maxHoldUps needs to be an integer between 0-23.',
            );
          }
        }
        return {
          noclientstart: disableClientStart,
          noquickhost: disableQuickhost,
          pauseday: pauseDay !== 'none' ? pauseDay : undefined,
          hosthours,
          maxholdups,
        };
      }
      case 'minutes': {
        const hostminutes = Number(minutes);
        if (!minutes.match(/^\d+$/) || hostminutes <= 0) {
          throw new RangeError('minutes needs to be a positive integer.');
        }
        let maxholdups: number | undefined;
        if (maxHoldUps !== '') {
          maxholdups = Number(maxHoldUps);
          if (!maxHoldUps.match(/^\d+$/) || maxholdups <= 0) {
            throw new TypeError(
              'maxHoldUps needs to be an integer between 0-23.',
            );
          }
        }
        return {
          noclientstart: disableClientStart,
          noquickhost: disableQuickhost,
          pauseday: pauseDay !== 'none' ? pauseDay : undefined,
          hostminutes,
          maxholdups,
        };
      }
      default:
        return {
          noclientstart: disableClientStart,
          noquickhost: disableQuickhost,
        };
    }
  }, [
    hostTimerMode,
    disableClientStart,
    disableQuickhost,
    hostHour,
    maxHoldUps,
    hostDay,
    hours,
    pauseDay,
    minutes,
  ]);
  return {
    getConfig,
    states: {
      hostTimerMode,
      setHostTimerMode,
      disableQuickhost,
      setDisableQuickhost,
      disableClientStart,
      setDisableClientStart,
      hostDay,
      setHostDay,
      hostHour,
      setHostHour,
      hours,
      setHours,
      minutes,
      setMinutes,
      pauseDay,
      setPauseDay,
      maxHoldUps,
      setMaxHoldUps,
    },
  };
}
