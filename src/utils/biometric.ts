import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const KEY_ENABLED = "lc_bio_enabled";
const KEY_CREDS = "lc_bio_creds";
const KEY_DISMISSED = "lc_bio_dismissed";

export async function isBiometricAvailable() {
  try {
    const hw = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return hw && enrolled;
  } catch {
    return false;
  }
}

export async function isBiometricEnabled() {
  try {
    return (await SecureStore.getItemAsync(KEY_ENABLED)) === "1";
  } catch {
    return false;
  }
}

export async function wasPromptDismissed() {
  try {
    return (await SecureStore.getItemAsync(KEY_DISMISSED)) === "1";
  } catch {
    return false;
  }
}

export async function markPromptDismissed() {
  try {
    await SecureStore.setItemAsync(KEY_DISMISSED, "1");
  } catch {}
}

export async function enableBiometric(
  username: string,
  password: string
) {
  await SecureStore.setItemAsync(
    KEY_CREDS,
    JSON.stringify({ username, password })
  );
  await SecureStore.setItemAsync(KEY_ENABLED, "1");
}

export async function disableBiometric() {
  try {
    await SecureStore.deleteItemAsync(KEY_CREDS);
    await SecureStore.deleteItemAsync(KEY_ENABLED);
    await SecureStore.deleteItemAsync(KEY_DISMISSED);
  } catch {}
}

/** Prompts Face ID / fingerprint and returns saved credentials on success. */
export async function authenticateAndGetCredentials(): Promise<
  { username: string; password: string } | null
> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Log in to LightCalls",
    cancelLabel: "Cancel",
    disableDeviceFallback: false,
  });
  if (!result.success) return null;
  const raw = await SecureStore.getItemAsync(KEY_CREDS);
  return raw ? JSON.parse(raw) : null;
}

/** Quick check used before offering the "enable" prompt. */
export async function shouldOfferBiometric() {
  if (!(await isBiometricAvailable())) return false;
  if (await isBiometricEnabled()) return false;
  if (await wasPromptDismissed()) return false;
  return true;
}

/** Confirms the user can pass Face ID / fingerprint before we save anything. */
export async function confirmBiometric() {
  try {
    const r = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirm to enable biometric login",
    });
    return r.success;
  } catch {
    return false;
  }
}
