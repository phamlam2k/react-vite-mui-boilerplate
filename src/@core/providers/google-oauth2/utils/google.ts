export interface SignInWithGoogleProps {
  clientId: string;
  redirectUri?: string;
  scope?: string;
  state?: string;
}

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
export default function signInWithGoogle({
  clientId,
  redirectUri,
  scope = "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly",
  state = "pass-through value",
}: SignInWithGoogleProps) {
  const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  const form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);

  const params = {
    client_id: clientId,
    response_type: "token",
    scope,
    include_granted_scopes: "true",
    state,
  };

  if (redirectUri) {
    (params as Record<string, string>)["redirect_uri"] = redirectUri;
  }

  for (const p in params) {
    const input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p as keyof typeof params]);
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
