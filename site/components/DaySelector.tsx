import React from 'react';
import { Form } from 'react-bootstrap';
import { Day } from '../../server/Dom5/options';

type RequiredProps = {
  optional?: false;
  value?: Day;
  onChange?: (
    ev: React.ChangeEvent<HTMLSelectElement & { value: Day }>,
  ) => void | boolean;
};

type OptionalProps = {
  optional: true;
  value?: Day | 'none';
  onChange?: (
    ev: React.ChangeEvent<HTMLSelectElement & { value: Day | 'none' }>,
  ) => void | boolean;
};

function DaySelector(props: RequiredProps): JSX.Element;
function DaySelector(props: OptionalProps): JSX.Element;
function DaySelector({
  optional = false,
  value,
  onChange,
}: OptionalProps | RequiredProps): JSX.Element {
  return (
    <Form.Control as="select" value={value} onChange={onChange}>
      {optional && <option value="none">None</option>}
      <option value="monday">Monday</option>
      <option value="tuesday">Tuesday</option>
      <option value="wednesday">Wednesday</option>
      <option value="thursday">Thursday</option>
      <option value="friday">Friday</option>
      <option value="saturday">Saturday</option>
      <option value="sunday">Sunday</option>
    </Form.Control>
  );
}

export default DaySelector;
