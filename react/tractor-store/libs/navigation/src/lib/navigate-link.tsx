import {
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { navigateTo } from '@react-internal/event-bus';
import type { NavPayload } from '@react-internal/url';
import {
  getNavIntents,
  resolveIntent,
  subscribeNavIntents,
} from './nav-resolver';

export interface NavigateLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick' | 'href'> {
  readonly intent: string;
  readonly params?: NavPayload;
  readonly children?: ReactNode;
}

/**
 * Cross-MFE navigation link. Resolves the intent + params to a concrete href
 * from a snapshot of the `nav:intents` channel so the anchor is focusable,
 * screen-reader-announced as a link, and supports modifier-click /
 * right-click → "Copy link address". On plain left-click we preventDefault
 * and emit `nav:navigate`; the host's NavRegistry drives the SPA router.
 */
export function NavigateLink({
  intent,
  params,
  children,
  ...rest
}: NavigateLinkProps) {
  // Re-render when the host (re)publishes the intent map. Without the
  // subscription, the first render sees an empty map and the href would
  // stick at "#".
  useSyncExternalStore(subscribeNavIntents, getNavIntents, getNavIntents);

  const href = resolveIntent(intent, params) ?? '#';
  const onClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateTo.emit({ id: intent, payload: params ?? {} });
  };
  return (
    <a {...rest} href={href} onClick={onClick}>
      {children}
    </a>
  );
}
