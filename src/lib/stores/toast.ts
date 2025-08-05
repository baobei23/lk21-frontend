import { writable } from "svelte/store";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function addToast(toast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast,
    };

    update((toasts) => [...toasts, newToast]);

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }

  function removeToast(id: string) {
    update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  function clearAll() {
    update(() => []);
  }

  // Convenience methods
  function success(title: string, message?: string, options?: Partial<Toast>) {
    return addToast({ type: "success", title, message, ...options });
  }

  function error(title: string, message?: string, options?: Partial<Toast>) {
    return addToast({
      type: "error",
      title,
      message,
      duration: 7000,
      ...options,
    });
  }

  function warning(title: string, message?: string, options?: Partial<Toast>) {
    return addToast({ type: "warning", title, message, ...options });
  }

  function info(title: string, message?: string, options?: Partial<Toast>) {
    return addToast({ type: "info", title, message, ...options });
  }

  return {
    subscribe,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };
}

export const toast = createToastStore();
