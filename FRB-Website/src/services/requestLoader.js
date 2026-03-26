let pendingRequests = 0;
const listeners = new Set();

const emit = () => {
  listeners.forEach((listener) => {
    try {
      listener(pendingRequests);
    } catch (error) {
      console.error("requestLoader listener error:", error);
    }
  });
};

export const requestLoader = {
  subscribe(listener) {
    listeners.add(listener);
    listener(pendingRequests);
    return () => listeners.delete(listener);
  },

  start() {
    pendingRequests += 1;
    emit();
  },

  stop() {
    pendingRequests = Math.max(0, pendingRequests - 1);
    emit();
  },

  reset() {
    pendingRequests = 0;
    emit();
  },

  getCount() {
    return pendingRequests;
  },
};