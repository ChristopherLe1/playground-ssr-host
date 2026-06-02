import { Component, Type, inject } from '@angular/core';
import { Routes } from '@angular/router';

import { LOAD_REMOTE_MODULE, LoadRemoteModule } from './load-remote-module.token';
import { Home } from './home/home';

/**
 * Resolves a federated module through the platform-specific loader.
 *
 * The loader is captured synchronously (so we stay inside the injection
 * context) and the actual call is deferred onto a microtask. The server loader
 * throws *synchronously* when the federation runtime is not yet initialised;
 * deferring turns that throw into a catchable rejection, so the `.catch(...)`
 * fallbacks below can swap in a placeholder instead of taking down the render.
 *
 * Usage (when adding a remote):
 *   loadComponent: () =>
 *     loadRemote('my-remote', './Component')
 *       .then((m) => m as Type<unknown>)
 *       .catch(() => RemoteUnavailable),
 */
export function loadRemote(remoteName: string, exposedModule: string): Promise<unknown> {
  const load: LoadRemoteModule = inject(LOAD_REMOTE_MODULE);
  return Promise.resolve().then(() => load(remoteName, exposedModule));
}

@Component({ template: '' })
export class RemoteUnavailable {}

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Home,
  },
  // Add federated remote routes here. Example:
  // {
  //   path: 'my-feature',
  //   loadComponent: () =>
  //     loadRemote('my-remote', './Component')
  //       .then((m) => m as Type<unknown>)
  //       .catch(() => RemoteUnavailable),
  // },
];
