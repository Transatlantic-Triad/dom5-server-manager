import React, { useMemo } from 'react';
import { Form, Card, Row, Col, Nav } from 'react-bootstrap';
import DaySelector from '../DaySelector';
import HourSelector from '../HourSelector';
import type { States } from './hooks/useHostingInfoHooks';

function WeekdayInput({
  hostDay,
  setHostDay,
  hostHour,
  setHostHour,
}: States): JSX.Element {
  return (
    <Form.Group>
      <Row>
        <Col>
          <DaySelector
            value={hostDay}
            onChange={({ target: { value } }) => setHostDay(value)}
          />
        </Col>
        <Col>
          <HourSelector
            value={hostHour}
            onChange={({ target: { value } }) => setHostHour(value)}
          />
        </Col>
      </Row>
    </Form.Group>
  );
}

function HoursInput({
  hours,
  setHours,
  pauseDay,
  setPauseDay,
}: States): JSX.Element {
  return (
    <>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Enter number of hours"
          value={hours}
          onChange={({ target: { value } }) =>
            setHours(value.replace(/[^0-9]/g, ''))
          }
        />
      </Form.Group>
      <Form.Group controlId="pauseDay">
        <Form.Label>Pause Day (optional)</Form.Label>
        <DaySelector
          optional
          value={pauseDay}
          onChange={({ target: { value } }) => setPauseDay(value)}
        />
      </Form.Group>
    </>
  );
}

function MinutesInput({
  minutes,
  setMinutes,
  pauseDay,
  setPauseDay,
}: States): JSX.Element {
  return (
    <>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Enter number of minutes"
          value={minutes}
          onChange={({ target: { value } }) =>
            setMinutes(value.replace(/[^0-9]/g, ''))
          }
        />
      </Form.Group>
      <Form.Group controlId="pauseDay">
        <Form.Label>Pause Day (optional)</Form.Label>
        <DaySelector
          optional
          value={pauseDay}
          onChange={({ target: { value } }) => setPauseDay(value)}
        />
      </Form.Group>
    </>
  );
}

export default function HostingInfo(props: States): JSX.Element {
  const {
    hostTimerMode,
    setHostTimerMode,
    disableQuickhost,
    setDisableQuickhost,
    disableClientStart,
    setDisableClientStart,
    maxHoldUps,
    setMaxHoldUps,
  } = props;
  const TimerComp = useMemo(() => {
    switch (hostTimerMode) {
      case 'weekday':
        return WeekdayInput;
      case 'hours':
        return HoursInput;
      case 'minutes':
        return MinutesInput;
      default:
        return null;
    }
  }, [hostTimerMode]);
  return (
    <Card className="my-2">
      <Card.Header>
        <Card.Title>Hosting Info</Card.Title>
        <Nav
          variant="tabs"
          activeKey={hostTimerMode}
          onSelect={setHostTimerMode}
        >
          <Nav.Item>
            <Nav.Link eventKey="none">No Timer</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="weekday">Weekday</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="hours">Hours</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="minutes">Minutes</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        <Form.Group>
          <Form.Check
            type="checkbox"
            id="enable-clientstart"
            label="Allow clients to start the game"
            checked={!disableClientStart}
            onChange={({
              target: { checked },
            }: React.ChangeEvent<HTMLInputElement>) =>
              setDisableClientStart(!checked)
            }
          />
        </Form.Group>
        {TimerComp != null && <TimerComp {...props} />}
        <Form.Group>
          <Form.Check
            type="checkbox"
            id="enable-quickhost"
            label="Enable quickhost"
            checked={!disableQuickhost}
            onChange={({
              target: { checked },
            }: React.ChangeEvent<HTMLInputElement>) =>
              setDisableQuickhost(!checked)
            }
          />
        </Form.Group>
        {hostTimerMode !== 'none' && (
          <Form.Group>
            <Form.Control
              disabled={disableQuickhost}
              type="text"
              placeholder="Enter amount of turns a player can miss in a row"
              value={maxHoldUps}
              onChange={({ target: { value } }) =>
                setMaxHoldUps(value.replace(/[^0-9]/g, ''))
              }
            />
            <Form.Text>
              If a player misses this many turns, allow quickhosting without
              them
            </Form.Text>
          </Form.Group>
        )}
      </Card.Body>
    </Card>
  );
}
