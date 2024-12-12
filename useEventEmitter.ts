import { create } from "zustand";

type EventCallback = (...args: any[]) => void;

interface EventEmitterStore {
  listeners: Record<string, EventCallback[]>;
  on: (event: string, callback: EventCallback) => void;
  off: (event: string, callback: EventCallback) => void;
  emit: (event: string, ...args: any[]) => void;
}

export const useEventEmitter = create<EventEmitterStore>((set, get) => ({
  listeners: {},

  on: (event, callback) => {
    const { listeners } = get();
    set({
      listeners: {
        ...listeners,
        [event]: [...(listeners[event] || []), callback],
      },
    });
  },

  off: (event, callback) => {
    const { listeners } = get();
    set({
      listeners: {
        ...listeners,
        [event]: (listeners[event] || []).filter((cb) => cb !== callback),
      },
    });
  },

  emit: (event, ...args) => {
    const { listeners } = get();
    (listeners[event] || []).forEach((callback) => callback(...args));
  },
}));
