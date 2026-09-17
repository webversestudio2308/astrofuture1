import { BirthData, ChatMessage } from "../types";
import { saveStoredBirthData } from "./birthStore";
import { setHasPaidKundali } from "./paymentStore";

const SYNC_CODE_STORAGE_KEY = "astro_current_sync_code";
const CHAT_MESSAGES_STORAGE_KEY = "astro_chat_messages_v1";
export const SESSION_RESTORED_EVENT = "astro_session_restored";

export interface SyncSessionData {
  accessCode: string;
  birthData: BirthData | null;
  messages: ChatMessage[];
  hasPaidKundali: boolean;
  updatedAt: number;
}

export const getStoredSyncCode = (): string => {
  try {
    return localStorage.getItem(SYNC_CODE_STORAGE_KEY) || "";
  } catch {
    return "";
  }
};

export const setStoredSyncCode = (code: string): void => {
  try {
    if (code) {
      localStorage.setItem(SYNC_CODE_STORAGE_KEY, code.toUpperCase());
    } else {
      localStorage.removeItem(SYNC_CODE_STORAGE_KEY);
    }
  } catch (e) {
    console.error("Failed to store sync code", e);
  }
};

export const getStoredChatMessages = (): ChatMessage[] | null => {
  try {
    const raw = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load chat messages", e);
  }
  return null;
};

export const saveStoredChatMessages = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save chat messages", e);
  }
};

/**
 * Saves current user state (birth data, chat history, payment status) to backend
 * and returns the generated / updated Access Code
 */
export const saveSessionToServer = async (payload: {
  birthData: BirthData;
  messages: ChatMessage[];
  hasPaidKundali: boolean;
  existingCode?: string;
}): Promise<{ success: boolean; accessCode?: string; error?: string }> => {
  try {
    const accessCode = payload.existingCode || getStoredSyncCode() || undefined;

    const res = await fetch("/api/sync/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessCode,
        birthData: payload.birthData,
        messages: payload.messages,
        hasPaidKundali: payload.hasPaidKundali,
      }),
    });

    const data = await res.json();
    if (data.success && data.accessCode) {
      setStoredSyncCode(data.accessCode);
      return { success: true, accessCode: data.accessCode };
    }
    return { success: false, error: data.error || "Failed to save session" };
  } catch (e: any) {
    console.error("Error saving session to server", e);
    return { success: false, error: e?.message || "Network error while saving session" };
  }
};

/**
 * Loads session by Access Code and updates local state across the application
 */
export const loadSessionFromServer = async (
  code: string
): Promise<{ success: boolean; session?: SyncSessionData; error?: string }> => {
  try {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, error: "Please enter a valid code" };
    }

    const res = await fetch(`/api/sync/get/${encodeURIComponent(cleanCode)}`);
    const data = await res.json();

    if (!res.ok || !data.success || !data.session) {
      return {
        success: false,
        error: data.error || "Session not found for this code",
      };
    }

    const session: SyncSessionData = data.session;

    // Persist restored state locally
    if (session.birthData) {
      saveStoredBirthData(session.birthData);
    }
    if (session.messages && Array.isArray(session.messages)) {
      saveStoredChatMessages(session.messages);
    }
    if (session.hasPaidKundali) {
      setHasPaidKundali(true);
    }
    setStoredSyncCode(session.accessCode || cleanCode);

    // Dispatch app-wide event for reactive re-render
    window.dispatchEvent(
      new CustomEvent(SESSION_RESTORED_EVENT, { detail: { session } })
    );

    return { success: true, session };
  } catch (e: any) {
    console.error("Error loading session from server", e);
    return { success: false, error: e?.message || "Network error while retrieving session" };
  }
};
