import http from "node:http";
import { exec } from "node:child_process";
import { randomBytes } from "node:crypto";
import { URL } from "node:url";
import { google } from "googleapis";
import { loadGoogleOnlyConfig } from "./config.js";
import { saveTokens } from "./drive.js";

function openBrowser(url: string): Promise<void> {
  const platform = process.platform;
  const command =
    platform === "win32"
      ? `start "" "${url}"`
      : platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;

  return new Promise((resolve) => {
    exec(command, (error) => {
      if (error) {
        console.log(`Could not open browser automatically. Open this URL manually:\n${url}`);
      }
      resolve();
    });
  });
}

export async function runGoogleDriveAuthFlow(): Promise<void> {
  const cfg = loadGoogleOnlyConfig();

  const state = randomBytes(12).toString("hex");
  const server = http.createServer();

  const authResult = await new Promise<{
    code: string;
    redirectUri: string;
  }>((resolve, reject) => {
    server.on("request", (req, res) => {
      if (!req.url) {
        return;
      }
      const url = new URL(req.url, "http://127.0.0.1");
      if (url.pathname !== "/oauth2callback") {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }
      const returnedState = url.searchParams.get("state");
      const error = url.searchParams.get("error");
      const code = url.searchParams.get("code");

      if (returnedState !== state) {
        res.statusCode = 400;
        res.end("Invalid OAuth state.");
        reject(new Error("OAuth state mismatch. Please retry."));
        server.close();
        return;
      }

      if (error) {
        res.statusCode = 400;
        res.end(`OAuth error: ${error}`);
        if (error === "access_denied") {
          reject(
            new Error(
              "Google returned access_denied. If your app is in Testing mode, add your Gmail as a Test User on the OAuth consent screen.",
            ),
          );
        } else {
          reject(new Error(`OAuth callback returned error: ${error}`));
        }
        server.close();
        return;
      }

      if (!code) {
        res.statusCode = 400;
        res.end("Missing authorization code.");
        reject(new Error("OAuth callback missing authorization code."));
        server.close();
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end(
        "Authorization successful. You can close this tab and return to the terminal.",
      );
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not determine local callback address."));
      } else {
        resolve({
          code,
          redirectUri: `http://127.0.0.1:${address.port}/oauth2callback`,
        });
      }
      server.close();
    });

    server.on("error", (err) => reject(err));
    server.listen(0, "127.0.0.1", async () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Failed to bind local callback server."));
        server.close();
        return;
      }

      const redirectUri = `http://127.0.0.1:${address.port}/oauth2callback`;
      const oauth2 = new google.auth.OAuth2(
        cfg.googleOAuthClientId,
        cfg.googleOAuthClientSecret,
        redirectUri,
      );
      const authUrl = oauth2.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: cfg.driveScopes,
        state,
      });
      console.log("Opening browser for Google OAuth consent...");
      console.log(authUrl);
      await openBrowser(authUrl);
    });
  });

  try {
    const oauth2 = new google.auth.OAuth2(
      cfg.googleOAuthClientId,
      cfg.googleOAuthClientSecret,
      authResult.redirectUri,
    );
    const tokenResponse = await oauth2.getToken(authResult.code);
    const tokens = tokenResponse.tokens;

    if (!tokens.refresh_token) {
      throw new Error(
        "No refresh_token returned. Ensure access_type=offline and prompt=consent are used, then retry.",
      );
    }

    saveTokens(cfg.gdriveTokensPath, {
      refresh_token: tokens.refresh_token,
      scope: tokens.scope ?? undefined,
      token_type: tokens.token_type ?? undefined,
    });
    console.log(`Saved Google Drive tokens to ${cfg.gdriveTokensPath}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("invalid_client")) {
      throw new Error(
        "Google returned invalid_client. Verify GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET belong to the same GCP project and are correct.",
      );
    }
    throw error;
  }
}
