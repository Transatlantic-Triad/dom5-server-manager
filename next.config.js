const dotenv = require('dotenv');
const path = require('path');

function loadEnv(envs) {
  const fullEnvs = [...envs];
  if (!fullEnvs.includes(null) && !fullEnvs.includes(undefined)) {
    fullEnvs.push(null);
  }
  for (const env of fullEnvs) {
    if (env == null) {
      dotenv.config({ path: '.env.local' });
    } else {
      dotenv.config({ path: `.env.${env}.local` });
    }
  }
  for (const env of fullEnvs) {
    if (env == null) {
      dotenv.config({ path: '.env' });
    } else {
      dotenv.config({ path: `.env.${env}` });
    }
  }
}

if (process.env.DEPLOY_ENV == null) process.env.DEPLOY_ENV = 'localdev';
loadEnv([process.env.DEPLOY_ENV, process.env.NODE_ENV]);

const nextEnv = require('next-env');

const withNextEnv = nextEnv();

module.exports = withNextEnv({
  sassOptions: {
    includePaths: [path.join(__dirname, 'site', 'styles')],
  },
});
