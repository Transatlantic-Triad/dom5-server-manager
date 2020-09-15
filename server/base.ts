import dotenv from 'dotenv';
import next from 'next';

if (process.env.NODE_ENV == null) process.env.NODE_ENV = 'development';
if (
  process.env.NODE_ENV !== 'development' &&
  process.env.NODE_ENV !== 'production'
) {
  console.warn(`NODE_ENV set to unsupported value: ${process.env.NODE_ENV}`);
}

function loadEnv(envs: (string | null)[]) {
  const fullEnvs: (string | null)[] = [...envs];
  if (
    !fullEnvs.includes(null) &&
    !(fullEnvs as (string | null | undefined)[]).includes(undefined)
  ) {
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

const app = next({
  dev: process.env.NODE_ENV === 'development',
  dir: './site',
});

export default function start(init: (nextApp: typeof app) => void) {
  app
    .prepare()
    .then(() => init(app))
    .catch((err) => {
      console.error(err);
      process.exit(-1);
    });
}
