/**
 * Serialises token refresh.
 *
 * When a token expires, every in-flight request fails with 401 at once. Without
 * this each would start its own refresh: the server would see a burst of
 * refreshes, and with single-use refresh tokens all but the first would be
 * rejected — logging the user out during an ordinary refresh.
 *
 * The first caller runs the work; the rest await the same promise.
 */
let inFlight: Promise<boolean> | null = null;

export const refreshMutex = {
  /** True if a refresh is running, so a caller can wait rather than start one. */
  isLocked(): boolean {
    return inFlight !== null;
  },

  /** Resolves with the outcome of whichever refresh is or was running. */
  async run(work: () => Promise<boolean>): Promise<boolean> {
    if (inFlight) {
      return inFlight;
    }

    inFlight = work().finally(() => {
      inFlight = null;
    });

    return inFlight;
  },

  /** Waits for an in-flight refresh without starting one. */
  async wait(): Promise<boolean> {
    return inFlight ?? Promise.resolve(false);
  },
};
