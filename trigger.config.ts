import type { TriggerConfig } from '@trigger.dev/sdk/v3';

export const config: TriggerConfig = {
  project: 'proj_gvzufybtsolqvrrqdcte',
  logLevel: 'log',
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 2,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 15000,
      factor: 2,
      randomize: true,
    },
  },
};
