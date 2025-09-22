import { toast } from "react-hot-toast";
import { TAdminResponse } from "../lib/types/common";

export function showNotification(type: string, message: string) {
  if (type === "success") {
    toast.success(message, {
      duration: 2000,
      position: "top-center",
    });
  } else if (type === "error") {
    toast.error(message, {
      duration: 2000,
      position: "top-center",
    });
  }
}

// Function to store admin credentials in localStorage
export const storeAdminCredentials = (adminData: TAdminResponse["result"]) => {
  try {
    localStorage.setItem("adminData", JSON.stringify(adminData));
  } catch (error) {
    console.error("Failed to store admin data in localStorage", error);
  }
};
export const storeAdminToken = (token: string) => {
  try {
    localStorage.setItem("token", JSON.stringify(token));
  } catch (error) {
    console.error("Failed to store admin data in localStorage", error);
  }
};

// Function to clear admin credentials from localStorage
export const clearAdminCredentials = () => {
  try {
    localStorage.removeItem("adminData");
  } catch (error) {
    console.error("Failed to clear admin data from localStorage", error);
  }
};

export const getStoredAdminCredentials = (): TAdminResponse["result"] | null => {
  try {
    const storedData = localStorage.getItem("adminData");
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Failed to retrieve admin data from localStorage", error);
    return null;
  }
};

export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value.toString().trim().length === 0;
}
export function sanitizeValue(value: any): number {
  return isEmpty(value) ? 0 : isNaN(value) ? 0 : Number(value);
}

export const debouncer = function (func: (e: any, value: string) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, e: any, value: string) {
    const context = this;
    const later = function () {
      timeout = null;
      func.apply(context, [e, value]);
    };
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
};
export function simpleDebounce<T extends any[]>(func: (...args: T) => void, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}
