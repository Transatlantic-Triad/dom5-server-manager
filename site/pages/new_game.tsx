import React, { useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import BasicInfo from '../components/gameEditor/BasicInfo';
import HostingInfo from '../components/gameEditor/HostingInfo';
import useHostingInfoHooks from '../components/gameEditor/hooks/useHostingInfoHooks';
import useBasicInfoHooks from '../components/gameEditor/hooks/useBasicInfoHooks';

export default function Index(): JSX.Element {
  const {
    states: basicInfoStates,
    getConfig: getBasicConfig,
  } = useBasicInfoHooks();
  const {
    states: hostingInfoStates,
    getConfig: getHostingConfig,
  } = useHostingInfoHooks();
  const getConfig = useCallback(
    () => ({
      ...getBasicConfig(),
      ...getHostingConfig(),
    }),
    [getBasicConfig, getHostingConfig],
  );
  return (
    <Form>
      <BasicInfo {...basicInfoStates} />
      <HostingInfo {...hostingInfoStates} />
      <Button onClick={() => console.log(getConfig())}>
        Generate config (check JS console)
      </Button>
    </Form>
  );
}
