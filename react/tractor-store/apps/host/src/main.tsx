import { initFederation } from '@softarc/native-federation-orchestrator';
import {
  useShimImportMap,
  consoleLogger,
  globalThisStorageEntry,
} from '@softarc/native-federation-orchestrator/options';
import { setupNfRegistry } from '@internal/event-bus';

// Global CSS reset / design tokens are loaded via <link> from the CDN
// (see apps/host/public/index.html), so they paint before the JS bootstrap.
setupNfRegistry({ force: true });

let showErrors = false;
Promise.all([
  fetch('./env.config.json').then((r) => r.json()),
  fetch('./federation.manifest.json').then((r) => r.json()),
])
  .then(async ([env, manifest]) => {
    showErrors = !env.production;
    const nf = await initFederation(manifest, {
      ...useShimImportMap({ shimMode: true }),
      logger: consoleLogger,
      storage: globalThisStorageEntry,
      hostRemoteEntry: './remoteEntry.json',
      logLevel: 'debug',
    });
    const { bootstrap } = await import('./app/bootstrap');
    await bootstrap(nf, env, manifest);
  })
  .catch((err) => {
    console.error('Failed to load app!');
    if (showErrors) console.error(err);
  });
