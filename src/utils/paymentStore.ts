import { useState, useEffect } from "react";

const PAYMENT_STORAGE_KEY = "astro_kundali_paid_v1";
const PAYMENT_EVENT_NAME = "astro_kundali_payment_changed";

/**
 * Checks if the user has completed the ₹51 Dakshina / payment for the 20-page Kundali
 */
export const getHasPaidKundali = (): boolean => {
  try {
    return localStorage.getItem(PAYMENT_STORAGE_KEY) === "true";
  } catch (e) {
    console.error("Failed to read payment status from storage", e);
    return false;
  }
};

/**
 * Saves payment status to localStorage and notifies all components across the app
 */
export const setHasPaidKundali = (hasPaid: boolean): void => {
  try {
    if (hasPaid) {
      localStorage.setItem(PAYMENT_STORAGE_KEY, "true");
    } else {
      localStorage.removeItem(PAYMENT_STORAGE_KEY);
    }
    // Dispatch event to synchronize all open components and tabs
    window.dispatchEvent(new CustomEvent(PAYMENT_EVENT_NAME, { detail: { hasPaid } }));
  } catch (e) {
    console.error("Failed to save payment status to storage", e);
  }
};

/**
 * Custom React hook providing reactive payment state across the whole application
 */
export const useKundaliPayment = () => {
  const [hasPaid, setHasPaidState] = useState<boolean>(() => getHasPaidKundali());

  useEffect(() => {
    const handlePaymentChange = (event: any) => {
      if (event?.detail?.hasPaid !== undefined) {
        setHasPaidState(Boolean(event.detail.hasPaid));
      } else {
        setHasPaidState(getHasPaidKundali());
      }
    };

    window.addEventListener(PAYMENT_EVENT_NAME, handlePaymentChange);
    window.addEventListener("storage", handlePaymentChange);

    return () => {
      window.removeEventListener(PAYMENT_EVENT_NAME, handlePaymentChange);
      window.removeEventListener("storage", handlePaymentChange);
    };
  }, []);

  const markAsPaid = () => {
    setHasPaidKundali(true);
    setHasPaidState(true);
  };

  const resetPayment = () => {
    setHasPaidKundali(false);
    setHasPaidState(false);
  };

  return {
    hasPaid,
    markAsPaid,
    resetPayment,
  };
};
