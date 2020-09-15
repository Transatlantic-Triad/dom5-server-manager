import wrapApi from '../../utils/wrapApi';

export default wrapApi(({ dom5Manager }) => {
  return {
    v: dom5Manager.getVersion(),
  };
});
