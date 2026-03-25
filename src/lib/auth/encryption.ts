/**
 * Standard AES-GCM encryption/decryption using Web Crypto API.
 * This is used to protect sensitive data in IndexedDB.
 */

const ALGORITHM = "AES-GCM";
const KEY_NAME = "honsharing-v1-storage-key";

// A deterministic salt for key derivation. In a real app, this might be user-specific.
const SALT = new TextEncoder().encode("honsharing-deterministic-salt-2026");

async function getKey(): Promise<CryptoKey> {
  // Use a fixed secret for derivation as requested ("fixed app secret").
  // In production, this could be from an environment variable or sessionStorage.
  const secret = "honsharing-internal-app-secret-v1";
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: SALT,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptText(text: string): Promise<string> {
  if (!text) return text;
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded
  );

  // Combine IV and ciphertext for storage: [iv (12 bytes) | ciphertext]
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  // Return as Base64 string
  return btoa(String.fromCharCode(...combined));
}

export async function decryptText(encryptedBase64: string): Promise<string> {
  if (!encryptedBase64) return encryptedBase64;
  
  try {
    const combined = new Uint8Array(
      atob(encryptedBase64)
        .split("")
        .map((c) => c.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const key = await getKey();

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.warn("[Encryption] Decryption failed or data is not encrypted:", err);
    // Fallback: if decryption fails (e.g. data is plain text), return as-is
    return encryptedBase64;
  }
}
