import { argv, env } from 'process';
import { spawnSync } from 'child_process';

const setenv = {
  NODE_ENV: 'production',
};

spawnSync(argv[2], argv.slice(3), {
  env: { ...env, ...setenv },
  stdio: 'inherit',
});
