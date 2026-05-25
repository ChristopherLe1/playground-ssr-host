import { defineChannel } from './event-bus-setup';

export interface NavigatePayload {
  readonly id: string;
  readonly payload?: Readonly<Record<string, string>>;
}

export const navigateTo = defineChannel<NavigatePayload>('nav:navigate');
