import {
  navIntents,
  type NavIntentMap,
} from '@react-internal/event-bus';
import {
  joinPath,
  resolveTemplate,
  type NavPayload,
} from '@react-internal/url';

const EMPTY_MAP: NavIntentMap = new Map();

let currentMap: NavIntentMap = EMPTY_MAP;
const listeners = new Set<() => void>();

// The host broadcasts the registry's intent map on `nav:intents` once
// shell navigation is wired up. The bus replays buffered events to late
// subscribers (NFEventRegistry buffers per-stream), so remote MFEs that
// import this module after the broadcast still receive the snapshot — the
// microtask delivery just means the first render sees the empty map and a
// follow-up render publishes the real hrefs.
navIntents.on((map) => {
  currentMap = map;
  for (const listener of listeners) listener();
});

export const subscribeNavIntents = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getNavIntents = (): NavIntentMap => currentMap;

export const resolveIntent = (
  intent: string,
  params?: NavPayload,
): string | undefined => {
  const entry = currentMap.get(intent);
  if (!entry) return undefined;
  try {
    return joinPath(entry.basePath, resolveTemplate(entry.path, params ?? {}));
  } catch {
    return undefined;
  }
};
