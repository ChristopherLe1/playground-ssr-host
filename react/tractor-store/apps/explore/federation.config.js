import { withNativeFederation, shareAll } from '@softarc/native-federation/config';

export default withNativeFederation({
  name: '@tractor-store/explore',

  exposes: {
    'mfe-home': './src/features/home/bootstrap.tsx',
    'mfe-header': './src/features/header/bootstrap.tsx',
    'mfe-footer': './src/features/footer/bootstrap.tsx',
    'mfe-recommendations': './src/features/recommendations/bootstrap.tsx',
    'mfe-category': './src/features/category/bootstrap.tsx',
    'mfe-stores': './src/features/stores/bootstrap.tsx',
    'mfe-store-picker': './src/features/store-picker/bootstrap.tsx',
    'nav-contribution': './src/core/nav-contribution.ts',
  },

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
    // instead of federation-bundling them as npm packages.
    '@internal/event-bus',
    '@internal/federation',
    '@internal/mfe-runtime',
    '@internal/navigation',
    '@internal/ui',
    '@internal/url',
  ],
});
