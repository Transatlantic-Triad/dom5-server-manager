import React from 'react';
import { Form } from 'react-bootstrap';
import BasicInfo from '../components/gameEditor/BasicInfo';
import HostingInfo from '../components/gameEditor/HostingInfo';

export default function Index(): JSX.Element {
  return (
    <Form>
      <BasicInfo />
      <HostingInfo />
    </Form>
  );
}
