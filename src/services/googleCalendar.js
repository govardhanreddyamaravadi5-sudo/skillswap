/**
 * googleCalendar.js
 *
 * Uses the Google OAuth 2.0 Token (implicit) flow to request a Calendar
 * access token, then calls the Google Calendar API to create an event
 * with a Google Meet conference link attached.
 *
 * Prerequisites:
 *  - The same Client ID used for Sign-In.
 *  - "Google Calendar API" must be ENABLED in the Google Cloud project.
 *    (APIs & Services → Library → search "Google Calendar API" → Enable)
 */

const GOOGLE_CLIENT_ID =
  "740681688634-3du8gjcoentkvnnvkp9sqp75r2aig5gv.apps.googleusercontent.com";

const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";

let tokenClient = null;
let cachedAccessToken = null;

/**
 * Initialise (or return) the OAuth2 token client.
 * This must be called after the GSI script has loaded.
 */
function getTokenClient() {
  if (!window.google?.accounts?.oauth2) {
    throw new Error(
      "Google Identity Services not loaded. Check your internet connection."
    );
  }

  if (!tokenClient) {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: CALENDAR_SCOPE,
      callback: () => {}, // will be overridden per-request
    });
  }

  return tokenClient;
}

/**
 * Request (or reuse) an OAuth2 access token that has Calendar scope.
 * Returns a Promise<string> that resolves to the access token.
 */
function requestAccessToken() {
  return new Promise((resolve, reject) => {
    const client = getTokenClient();

    client.callback = (tokenResponse) => {
      if (tokenResponse.error) {
        reject(new Error(tokenResponse.error_description || tokenResponse.error));
      } else {
        cachedAccessToken = tokenResponse.access_token;
        resolve(tokenResponse.access_token);
      }
    };

    if (cachedAccessToken) {
      // Reuse the cached token (valid for ~1 hour)
      resolve(cachedAccessToken);
    } else {
      // Prompt the consent popup
      client.requestAccessToken({ prompt: "consent" });
    }
  });
}

/**
 * createMeetSession(sessionDetails)
 *
 * Creates a Google Calendar event with a Meet conference and returns the
 * Google Meet URL.
 *
 * @param {object} details
 * @param {string} details.title       - Event title
 * @param {string} details.person      - Name of the other person (added to description)
 * @param {string} details.date        - ISO date string "YYYY-MM-DD"
 * @param {string} details.time        - "HH:MM" (24-hour)
 * @param {number} [details.durationMinutes=60] - Session length in minutes
 *
 * @returns {Promise<{meetLink: string, eventId: string, calendarLink: string}>}
 */
export async function createMeetSession(details) {
  const accessToken = await requestAccessToken();

  const { title, person, date, time, durationMinutes = 60 } = details;

  // Build start/end datetime
  const startDateTime = new Date(`${date}T${time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);

  const toIso = (d) => d.toISOString();

  const event = {
    summary: `SkillSwap: ${title}`,
    description: `SkillSwap session${person ? ` with ${person}` : ""}.\n\nScheduled via SkillSwap – the peer-to-peer skill sharing platform.`,
    start: {
      dateTime: toIso(startDateTime),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: toIso(endDateTime),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    conferenceData: {
      createRequest: {
        requestId: `skillswap-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    // Token may have expired — clear it so the next call re-authenticates
    cachedAccessToken = null;
    throw new Error(
      err.error?.message ||
        "Failed to create Google Calendar event. Make sure the Calendar API is enabled."
    );
  }

  const data = await response.json();
  const meetLink =
    data.hangoutLink ||
    data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ||
    null;

  return {
    meetLink,
    eventId: data.id,
    calendarLink: data.htmlLink,
  };
}

/**
 * Clears the cached access token (e.g. after sign-out).
 */
export function clearCalendarToken() {
  cachedAccessToken = null;
  tokenClient = null;
}
