import type { NavContribution } from '@internal/navigation';
import {
  type NavPayload,
  appendQueryString,
  joinPath,
  resolveTemplate,
  splitIntentParams,
} from '@internal/url';

export interface NavBarEntry {
  readonly source: string;
  readonly intentId: string;
  readonly label: string;
  readonly path: string;
  readonly order: number;
}

interface ResolvedIntent {
  readonly basePath: string;
  readonly path: string;
}

export type NavNavigator = (url: string) => Promise<unknown>;

/**
 * Holds nav contributions from one or more MFEs and turns abstract intents
 * (e.g. `'cart.overview'` + `{ uuid }`) into concrete URLs. Navigation itself
 * is delegated to an injected `NavNavigator` so the registry stays free of
 * any router dependency and can be unit-tested.
 */
export class NavRegistry {
  private readonly contributions = new Map<string, NavContribution>();
  private readonly intents = new Map<string, ResolvedIntent>();

  constructor(private readonly navigator: NavNavigator) {}

  register(contribution: NavContribution): void {
    this.contributions.set(contribution.source, contribution);
    for (const intent of contribution.intents) {
      this.intents.set(intent.id, {
        basePath: contribution.basePath,
        path: intent.path,
      });
    }
  }

  async navigate(id: string, payload: NavPayload = {}): Promise<boolean> {
    let url: string | undefined;
    try {
      url = this.resolve(id, payload);
    } catch (err) {
      console.error(
        `[nav] cannot navigate to intent "${id}":`,
        err instanceof Error ? err.message : err,
      );
      return false;
    }
    if (!url) {
      console.error(`[nav] cannot navigate to unknown intent "${id}"`);
      return false;
    }
    await this.navigator(url);
    return true;
  }

  getNavBar(): readonly NavBarEntry[] {
    const entries: NavBarEntry[] = [];
    for (const contribution of this.contributions.values()) {
      for (const entry of contribution.navBar ?? []) {
        const intent = contribution.intents.find(
          (i) => i.id === entry.intentId,
        );
        if (!intent) continue;
        entries.push({
          source: contribution.source,
          intentId: entry.intentId,
          label: entry.label,
          path: joinPath(contribution.basePath, intent.path),
          order: entry.order ?? Number.MAX_SAFE_INTEGER,
        });
      }
    }
    entries.sort((a, b) => a.order - b.order);
    return entries;
  }

  resolve(id: string, payload: NavPayload): string | undefined {
    const intent = this.intents.get(id);
    if (!intent) return undefined;
    // resolveTemplate throws a descriptive error when a required path param
    // is missing; let it propagate so navigate() can log the actionable
    // reason instead of collapsing every failure into "undefined".
    const path = joinPath(
      intent.basePath,
      resolveTemplate(intent.path, payload),
    );
    const consumed = new Set(splitIntentParams(intent.path));
    const queryParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (!consumed.has(key)) queryParams[key] = value;
    }
    return appendQueryString(path, queryParams);
  }
}
