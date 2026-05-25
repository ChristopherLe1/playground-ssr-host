import { createElement } from 'react';
import {
  createBrowserRouter,
  redirect,
  type RouteObject,
} from 'react-router-dom';
import type {
  FederationManifest,
  NativeFederationResult,
} from '@softarc/native-federation-orchestrator';
import { navigateTo } from '@internal/event-bus';
import { setSliceIndex } from '@internal/federation';
import { setIntentResolver } from '@internal/navigation';
import { loadContributions, type LoadedContribution } from './load-contributions';
import { NavRegistry } from './nav-registry';
import { buildRemoteRoutes } from './remote-routes';

const buildSliceIndex = (
  loaded: readonly LoadedContribution[],
): Map<string, string> => {
  const index = new Map<string, string>();
  for (const { remoteName, contribution } of loaded) {
    for (const intent of contribution.intents) {
      if (typeof intent.element === 'string') {
        index.set(intent.element, remoteName);
      }
    }
    for (const tag of contribution.chromeElements ?? []) {
      index.set(tag, remoteName);
    }
  }
  return index;
};

export type ShellRouter = ReturnType<typeof createBrowserRouter>;

export interface SetupShellNavigationResult {
  readonly router: ShellRouter;
  readonly registry: NavRegistry;
}

export interface SetupShellNavigationDeps {
  readonly nf: NativeFederationResult;
  readonly manifest: FederationManifest;
  readonly fallbackRedirect?: string;
}

export const setupShellNavigation = async ({
  nf,
  manifest,
  fallbackRedirect = '/explore',
}: SetupShellNavigationDeps): Promise<SetupShellNavigationResult> => {
  const loaded = await loadContributions(nf, manifest);

  const remoteRoutes = buildRemoteRoutes(loaded);

  const empty = remoteRoutes.length === 0;
  const emptyElement = createElement(
    'p',
    { role: 'alert', style: { padding: '4rem', textAlign: 'center' } },
    'No remotes are reachable. Start explore, decide, and checkout, then refresh.',
  );

  const routes: RouteObject[] = [
    ...remoteRoutes,
    {
      path: '*',
      element: empty ? emptyElement : undefined,
      loader: empty ? undefined : () => redirect(fallbackRedirect),
    },
  ];

  const router = createBrowserRouter(routes);

  const registry = new NavRegistry((url) => router.navigate(url));
  for (const { contribution } of loaded) {
    registry.register(contribution);
  }

  setIntentResolver((id, payload) => {
    // NavigateLink renders an href from this resolver during render. Missing
    // params should not crash the tree — let the click-time `navigate()`
    // surface the diagnostic instead.
    try {
      return registry.resolve(id, payload ?? {});
    } catch {
      return undefined;
    }
  });
  setSliceIndex(buildSliceIndex(loaded));

  navigateTo.on(({ id, payload }) => {
    void registry.navigate(id, payload).catch((err) => {
      console.error(`[nav] navigation to intent "${id}" failed`, err);
    });
  });

  return { router, registry };
};
