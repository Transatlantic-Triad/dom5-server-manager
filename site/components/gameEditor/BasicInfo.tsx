import React from 'react';
import { Form, Card } from 'react-bootstrap';

export default function Index(): JSX.Element {
  return (
    <Card className="my-2">
      <Card.Header>
        <Card.Title>Basic Game Info</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form.Group controlId="gameName">
          <Form.Label>Game Name</Form.Label>
          <Form.Control type="text" placeholder="Enter game name" />
        </Form.Group>
        <Form.Group controlId="gamePort">
          <Form.Label>Designate Port</Form.Label>
          <Form.Control type="text" placeholder="Enter port number" />
        </Form.Group>
        <Form.Group controlId="eraSelect">
          <Form.Label>Choose Era</Form.Label>
          <Form.Control as="select">
            <option value="early">Early</option>
            <option value="middle">Middle</option>
            <option value="late">Late</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="mapSelect">
          <Form.Label>Choose Map</Form.Label>
          <Form.Control as="select">
            <option value="test1map">test1map</option>
            <option value="test2map">test2map</option>
            <option value="test3map">test3map</option>
          </Form.Control>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}
