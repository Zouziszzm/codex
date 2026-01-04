import { invoke as tauriInvoke } from "@tauri-apps/api/core";

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}

/**
 * A safe wrapper around Tauri's invoke that prevents errors when running in a browser environment.
 */
export async function safeInvoke<T>(
  cmd: string,
  args?: Record<string, unknown>
): Promise<T | null> {
  // Check if we're in a Tauri environment
  const isTauri =
    typeof window !== "undefined" && window.__TAURI_INTERNALS__ !== undefined;

  if (!isTauri) {
    console.warn(
      `[Tauri] safeInvoke: Skipping command "${cmd}" - Not in a Tauri environment.`
    );
    return null;
  }

  try {
    return await tauriInvoke<T>(cmd, args);
  } catch (error) {
    console.error(`[Tauri] safeInvoke error for command "${cmd}":`, error);
    throw error;
  }
}
