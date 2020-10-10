import React, { useState, useMemo } from 'react';
import { Form, Card, Row, Col, Nav } from 'react-bootstrap';
import DaySelector from '../DaySelector';
import HourSelector from '../HourSelector';

function WeekdayInput(): JSX.Element {
  return (
    <Form.Group>
      <Row>
        <Col>
          <DaySelector />
        </Col>
        <Col>
          <HourSelector />
        </Col>
      </Row>
    </Form.Group>
  );
}

function HoursInput(): JSX.Element {
  return (
    <>
      <Form.Group>
        <Form.Control type="text" placeholder="Enter number of hours" />
      </Form.Group>
      <Form.Group controlId="pauseDay">
        <Form.Label>Pause Day (optional)</Form.Label>
        <DaySelector optional />
      </Form.Group>
    </>
  );
}

function MinutesInput(): JSX.Element {
  return (
    <>
      <Form.Group>
        <Form.Control type="text" placeholder="Enter number of minutes" />
      </Form.Group>
      <Form.Group controlId="pauseDay">
        <Form.Label>Pause Day (optional)</Form.Label>
        <DaySelector optional />
      </Form.Group>
    </>
  );
}

export default function HostingInfo(): JSX.Element {
  const [hostTimerMode, setHostTimerMode] = useState('none');
  const [disableQuickhost, setDisableQuickhost] = useState(false);
  const [disableClientStart, setDisableClientStart] = useState(true);
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
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setDisableClientStart(!ev.target.checked)
            }
          />
        </Form.Group>
        {TimerComp != null && <TimerComp />}
        <Form.Group>
          <Form.Check
            type="checkbox"
            id="enable-quickhost"
            label="Enable quickhost"
            checked={!disableQuickhost}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setDisableQuickhost(!ev.target.checked)
            }
          />
        </Form.Group>
        {hostTimerMode !== 'none' && (
          <Form.Group>
            <Form.Control
              disabled={disableQuickhost}
              type="text"
              placeholder="Enter amount of turns a player can miss in a row"
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
