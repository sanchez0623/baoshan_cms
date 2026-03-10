import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const SESSION_COOKIE_NAME = "baoshan_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = {
  email: string;
  exp: number;
};

function getSessionSecret() {
  return (
    process.env.CMS_SESSION_SECRET?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    [
      process.env.MYSQL_HOST,
      process.env.MYSQL_PORT,
      process.env.MYSQL_USER,
      process.env.MYSQL_PASSWORD,
      process.env.MYSQL_DATABASE,
    ]
      .filter(Boolean)
      .join(":") ||
    "baoshan-cms-dev-secret"
  );
}

function toBase64Url(input: string | ArrayBuffer) {
  const bytes =
    typeof input === "string"
      ? encoder.encode(input)
      : new Uint8Array(input);

  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return decoder.decode(bytes);
}

async function importSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function signValue(value: string) {
  const key = await importSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(signature);
}

export async function createSessionToken(email: string) {
  const payload = toBase64Url(
    JSON.stringify({
      email,
      exp: Date.now() + SESSION_MAX_AGE * 1000,
    } satisfies SessionPayload)
  );

  const signature = await signValue(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token?: string | null) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = await signValue(payload);
  if (signature !== expected) return null;

  try {
    const decoded = JSON.parse(fromBase64Url(payload)) as SessionPayload;
    if (!decoded.email || decoded.exp <= Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE_NAME, token, getCookieOptions(SESSION_MAX_AGE));
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", getCookieOptions(0));
}

export async function getCurrentAdminSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function getAdminSessionFromRequest(request: NextRequest) {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}
