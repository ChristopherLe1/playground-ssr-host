import type { NFEventRegistry } from "@softarc/native-federation-orchestrator/registry";

declare global {
  interface Window {
    __NF_REGISTRY__: NFEventRegistry;
  }
}

export const NOOP_UNSUBSCRIBE = (): void => {
  // No-op: returned when there is no event bus to subscribe to.
};

export interface ChannelHandle<TPayload> {
  emit(payload: TPayload): void;
  on(handler: (payload: TPayload) => void): () => void;
}

export const defineChannel = <TPayload>(
  name: string,
): ChannelHandle<TPayload> => {
  const bus = (window as { __NF_REGISTRY__?: NFEventRegistry }).__NF_REGISTRY__;
  if (!bus)
    throw new Error("tried to open a channel on non-existent eventbus.");
  return Object.freeze({
    name,
    emit: (payload: TPayload) => bus.emit<TPayload>(name, payload),
    on: (handler: (payload: TPayload) => void) => {
      if (!bus) return NOOP_UNSUBSCRIBE;
      return bus.on<TPayload>(name, (payload) => handler(payload.data));
    },
  });
};
