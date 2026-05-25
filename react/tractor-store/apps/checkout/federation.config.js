import { withNativeFederation, shareAll } from '@softarc/native-federation/config';

export default withNativeFederation({
  name: '@tractor-store/checkout',

  exposes: {
    'mfe-cart': './src/features/cart/bootstrap.tsx',
    'mfe-checkout': './src/features/checkout/bootstrap.tsx',
    'mfe-thanks': './src/features/thanks/bootstrap.tsx',
    'mfe-mini-cart': './src/features/mini-cart/bootstrap.tsx',
    'mfe-add-to-cart': './src/features/add-to-cart/bootstrap.tsx',
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
    '@internal/event-bus',
    '@internal/federation',
    '@internal/mfe-runtime',
    '@internal/navigation',
    '@internal/ui',
    '@internal/url',
  ],
});
