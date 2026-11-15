import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

type AdminRequest = IncomingMessage & {
  body?: unknown;
};

type AdminResponse = ServerResponse & {
  status: (code: number) => AdminResponse;
  json: (body: unknown) => void;
};

const COOKIE_NAME = "green-garden-admin-session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !sessionSecret || sessionSecret.length < 32) {
    return null;
  }

  return { username, password, sessionSecret };
}

function equalSecret(actual: string, expected: string) {
  const actualHash = createHash("sha256").update(actual).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash);
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function hasValidSession(request: AdminRequest, secret: string) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return false;

  const sessionCookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  const token = sessionCookie?.slice(COOKIE_NAME.length + 1);
  if (!token) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  try {
    if (!equalSecret(signature, sign(payload, secret))) return false;
    const session: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );
    return (
      typeof session === "object" &&
      session !== null &&
      "expiresAt" in session &&
      typeof session.expiresAt === "number" &&
      session.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}

export function hasValidAdminSession(request: IncomingMessage) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return Boolean(
    secret && secret.length >= 32 && hasValidSession(request, secret)
  );
}

function writeSessionCookie(response: AdminResponse, token: string) {
  const secure = process.env.VERCEL ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}${secure}`
  );
}

function clearSessionCookie(response: AdminResponse) {
  const secure = process.env.VERCEL ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${secure}`
  );
}

export function isSameOriginRequest(request: IncomingMessage) {
  const origin = request.headers.origin;
  const forwardedHost = request.headers["x-forwarded-host"];
  const host = (
    Array.isArray(forwardedHost)
      ? forwardedHost[0]
      : forwardedHost?.split(",")[0]
  )?.trim() ?? request.headers.host;
  if (!origin || !host) return false;

  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

export default function handler(request: AdminRequest, response: AdminResponse) {
  response.setHeader("Cache-Control", "no-store");
  const config = getConfig();

  if (!config) {
    return response.status(503).json({
      error:
        "Admin chưa được cấu hình. Hãy thiết lập các Environment Variables trên Vercel.",
    });
  }

  if (request.method === "GET") {
    return response.status(200).json({
      authenticated: hasValidSession(request, config.sessionSecret),
    });
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Phương thức không được hỗ trợ." });
  }

  if (!isSameOriginRequest(request)) {
    return response.status(403).json({ error: "Yêu cầu không hợp lệ." });
  }

  const body =
    typeof request.body === "object" && request.body !== null
      ? (request.body as Record<string, unknown>)
      : null;

  if (body?.action === "logout") {
    clearSessionCookie(response);
    return response.status(200).json({ authenticated: false });
  }

  if (body?.action !== "login") {
    return response.status(400).json({ error: "Yêu cầu đăng nhập không hợp lệ." });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (
    !equalSecret(username.toLowerCase(), config.username.trim().toLowerCase()) ||
    !equalSecret(password, config.password)
  ) {
    return response
      .status(401)
      .json({ error: "Tên đăng nhập hoặc mật khẩu không đúng." });
  }

  const payload = Buffer.from(
    JSON.stringify({ expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000 })
  ).toString("base64url");
  writeSessionCookie(
    response,
    `${payload}.${sign(payload, config.sessionSecret)}`
  );
  return response.status(200).json({ authenticated: true });
}
