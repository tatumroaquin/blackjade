import { argv, env } from 'process';
import { spawnSync} from 'child_process';

const setenv = {
  LOCAL_PEER: 'false'
}

spawnSync(argv[2], argv.slice(3), {
  env: { ...env, ...setenv },
  stdio: 'inherit'
})
