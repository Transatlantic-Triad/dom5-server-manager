import React from 'react';
import { Form, Card, Row, Col, OverlayTrigger, Popover } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import HelpCircleIcon from 'mdi-react/HelpCircleIcon';
import type { States } from './hooks/useBasicInfoHooks';
import type { Era } from '../../../server/Dom5/options';
import useApiData from '../../hooks/useApiData';

const UPnPTooltip = (
  props: Omit<React.ComponentProps<typeof Popover>, 'id'>,
) => (
  <Popover {...props} id="upnp-popover">
    <Popover.Title as="h3">What is UPnP?</Popover.Title>
    <Popover.Content>
      UPnP is a technique to automate port-forwarding. It requires a compatible
      router to function, but if available, will remove the need for manual
      configuration of ports when behind a home router (NAT).
    </Popover.Content>
  </Popover>
);

export default function Index({
  gameName,
  setGameName,
  port,
  setPort,
  useUpnp,
  setUseUpnp,
  era,
  setEra,
  mapFile,
  setMapFile,
}: States): JSX.Element {
  const { data, isLoading, error } = useApiData('maps');
  return (
    <Card className="my-2">
      <Card.Header>
        <Card.Title>Basic Game Info</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form.Group controlId="gameName">
          <Form.Label>Game Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter game name"
            value={gameName}
            onChange={(ev) =>
              setGameName(ev.target.value.replace(/[^a-z0-9_-]/gi, ''))
            }
          />
          <Form.Text>
            Only alphanumeric characters, underscores, and hyphens are allowed.
          </Form.Text>
        </Form.Group>
        <Row>
          <Col>
            <Form.Group controlId="gamePort">
              <Form.Label>Designate Port</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter port number"
                value={port}
                onChange={(ev) =>
                  setPort(ev.target.value.replace(/[^0-9]/g, ''))
                }
                onBlur={(ev: React.FocusEvent<HTMLInputElement>) =>
                  ev.target.value &&
                  setPort(
                    Math.min(
                      Math.max(
                        1,
                        Number(ev.target.value.replace(/[^0-9]/g, '')),
                      ),
                      65535,
                    ).toFixed(0),
                  )
                }
              />
              <Form.Text>Enter a port number between 1 and 65535</Form.Text>
            </Form.Group>
          </Col>
          <Col sm="3" lg="2">
            <Form.Group controlId="gamePort">
              <Form.Label>
                UPnP
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={UPnPTooltip}
                >
                  <HelpCircleIcon />
                </OverlayTrigger>
              </Form.Label>
              <div>
                <Switch
                  value={useUpnp}
                  onChange={(el, val) => setUseUpnp(val || false)}
                />
              </div>
              <Form.Text>auto port-forwarding</Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="eraSelect">
          <Form.Label>Choose Era</Form.Label>
          <Form.Control
            as="select"
            value={era}
            onChange={(ev) => setEra(ev.target.value as Era)}
          >
            <option value="early">Early</option>
            <option value="middle">Middle</option>
            <option value="late">Late</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="mapSelect">
          <Form.Label>Choose Map</Form.Label>
          <Form.Control
            as="select"
            value={mapFile}
            onChange={(ev) => setMapFile(ev.target.value)}
            disabled={data == null || isLoading || error != null}
          >
            {isLoading && <option>Loading...</option>}
            {!isLoading && error != null && <option>ERROR!</option>}
            {data != null &&
              error == null &&
              !isLoading &&
              data.map((map) => <option value={map}>{map}</option>)}
          </Form.Control>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}
