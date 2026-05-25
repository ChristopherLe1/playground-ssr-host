import { withNativeFederation, shareAll } from '@softarc/native-federation/config';

export default withNativeFederation({
  name: 'host',

  shared: {
    ...shareAll(
      {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
      },
      {
        overrides: {
          react: {
            singleton: true,
            strictVersion: true,
            requiredVersion: 'auto',
            includeSecondaries: { keepAll: true },
          },
          'react-dom': {
            singleton: true,
            strictVersion: true,
            requiredVersion: 'auto',
            includeSecondaries: { keepAll: true },
          },
        },
      },
    ),
  },

  features: {
    ignoreUnusedDeps: true,
  },

  skip: [
    'react-dom/server',
    'react-dom/server.node',
    'react-dom/server.browser',
    'react-dom/test-utils',
    // Workspace libs ship TS source — inline them into the consuming app
    // instead of federation-bundling them as npm packages. Cross-MFE state
    // still flows through window.__NF_REGISTRY__ keyed by channel name.
    '@internal/event-bus',
    '@internal/federation',
    '@internal/navigation',
    '@internal/ui',
    '@internal/url',
  ],
});
