import { useCallback } from "react";
import { authService } from "../services/api";

// Replace this with your real Google OAuth Client ID from
// https://console.cloud.google.com/  (APIs & Services → Credentials)
const GOOGLE_CLIENT_ID =
  "740681688634-3du8gjcoentkvnnvkp9sqp75r2aig5gv.apps.googleusercontent.com";

/**
 * Decodes a Google JWT credential (id_token) to extract basic profile fields.
 * This avoids an extra HTTP round-trip to the token-info endpoint.
 */
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * useGoogleAuth
 *
 * Returns `triggerGoogleLogin(onSuccess, onError)`:
 *  - Shows the Google One-Tap / popup sign-in dialog.
 *  - On success, decodes the credential and POST-s it to /api/auth/google.
 *  - Calls onSuccess(userData) or onError(error) accordingly.
 */
export function useGoogleAuth() {
  const triggerGoogleLogin = useCallback((onSuccess, onError) => {
    if (!window.google) {
      onError?.(new Error("Google Identity Services is not loaded yet. Check your internet connection and try again."));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const profile = parseJwt(response.credential);
          if (!profile) throw new Error("Failed to decode Google credential.");

          // Send the user info to our backend
          const userData = await authService.googleLogin({
            email: profile.email,
            name: profile.name,
            googleId: profile.sub,
            avatar: profile.picture,
          });

          onSuccess?.(userData);
        } catch (err) {
          onError?.(err);
        }
      },
      // Use a popup so users aren't redirected away from the page
      ux_mode: "popup",
    });

    // Prompt the Google One Tap / popup dialog
    window.google.accounts.id.prompt((notification) => {
      if (
        notification.isNotDisplayed() ||
        notification.isSkippedMoment()
      ) {
        // One Tap was suppressed (e.g. already dismissed recently).
        // Fall back to a normal popup button flow.
        window.google.accounts.id.renderButton(
          document.getElementById("__google_btn_fallback__") || document.createElement("div"),
          { theme: "outline", size: "large" }
        );
      }
    });
  }, []);

  return { triggerGoogleLogin };
}
