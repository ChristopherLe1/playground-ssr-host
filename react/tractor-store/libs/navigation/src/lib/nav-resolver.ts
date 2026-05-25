import type { NavPayload } from '@internal/url';

export type IntentResolver = (
  intent: string,
  params?: NavPayload,
) => string | undefined;

declare global {
  interface Window {
    __NF_NAV_RESOLVER__?: IntentResolver;
  }
}

// Set by the host during shell bootstrap. In standalone-fragment mode the
// resolver is undefined; `resolveIntent` returns undefined and `NavigateLink`
// falls back to href="#". The link is still focusable and announces as a
// link; clicks emit the intent (a no-op without a host listening).
export const setIntentResolver = (resolver: IntentResolver): void => {
  window.__NF_NAV_RESOLVER__ = resolver;
};

export const resolveIntent = (
  intent: string,
  params?: NavPayload,
): string | undefined => window.__NF_NAV_RESOLVER__?.(intent, params);
