import React from 'react';
import { Form } from 'react-bootstrap';

export type Hour =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23';

type RequiredProps = {
  optional?: false;
  value?: Hour;
  onChange?: (
    ev: React.ChangeEvent<HTMLSelectElement & { value: Hour }>,
  ) => void | boolean;
};

type OptionalProps = {
  optional: true;
  value?: Hour | 'none';
  onChange?: (
    ev: React.ChangeEvent<HTMLSelectElement & { value: Hour | 'none' }>,
  ) => void | boolean;
};

function HourSelector(props: RequiredProps): JSX.Element;
function HourSelector(props: OptionalProps): JSX.Element;
function HourSelector({
  optional = false,
  value,
  onChange,
}: OptionalProps | RequiredProps): JSX.Element {
  return (
    <Form.Control as="select" value={value} onChange={onChange}>
      {optional && <option value="none">None</option>}
      <option value="0">00:00</option>
      <option value="1">01:00</option>
      <option value="2">02:00</option>
      <option value="3">03:00</option>
      <option value="4">04:00</option>
      <option value="5">05:00</option>
      <option value="6">06:00</option>
      <option value="7">07:00</option>
      <option value="8">08:00</option>
      <option value="9">09:00</option>
      <option value="10">10:00</option>
      <option value="11">11:00</option>
      <option value="12">12:00</option>
      <option value="13">13:00</option>
      <option value="14">14:00</option>
      <option value="15">15:00</option>
      <option value="16">16:00</option>
      <option value="17">17:00</option>
      <option value="18">18:00</option>
      <option value="19">19:00</option>
      <option value="20">20:00</option>
      <option value="21">21:00</option>
      <option value="22">22:00</option>
      <option value="23">23:00</option>
    </Form.Control>
  );
}

export default HourSelector;
