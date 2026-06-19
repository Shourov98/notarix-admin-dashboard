import { useEffect } from "react";
import { subscribe } from "../services/socketClient";

/**
 * Subscribe to a socket.io event for the lifetime of the component.
 * Returns nothing; pass a stable handler to avoid extra subscribe/unsubscribe churn.
 */
export const useSocket = (event, handler) => {
  useEffect(() => {
    if (!event || typeof handler !== "function") {
      return undefined;
    }
    const unsubscribe = subscribe(event, handler);
    return unsubscribe;
  }, [event, handler]);
};
