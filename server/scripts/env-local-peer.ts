import { argv, env } from 'process';
import { spawnSync} from 'child_process';

const setenv = {
  LOCAL_PEER: 'true'
}

spawnSync(argv[2], argv.slice(3), {
  env: { ...env, ...setenv },
  stdio: 'inherit'
})
