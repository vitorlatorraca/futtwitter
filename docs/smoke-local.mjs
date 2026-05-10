// End-to-end smoke test against localhost dev server.
// Runs the actual signup/login/me flow with a cookie jar (like a browser).
//
// Usage:
//   node docs/smoke-local.mjs

const BASE = process.env.BASE_URL || "http://127.0.0.1:5000";
const stamp = Date.now();
const EMAIL = `smoke-${stamp}@local.test`;
const HANDLE = `smoke_${stamp}`;
const STRONG = "Senha@12345";
const WEAK = "senha@123"; // missing uppercase — backend will reject

// Tiny cookie jar: pulls Set-Cookie from each response and replays Cookie on the next.
const jar = new Map();
function takeCookies(res) {
  const headers = res.headers.getSetCookie?.() ?? [];
  for (const raw of headers) {
    const [pair] = raw.split(";");
    const [name, value] = pair.split("=");
    if (name && value !== undefined) jar.set(name.trim(), value.trim());
  }
}
function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function call(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(jar.size > 0 ? { Cookie: cookieHeader() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  takeCookies(res);
  const text = await res.text();
  // Parse as JSON when possible; preserve `null` as JS null (not the string "null").
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }
  return { status: res.status, body: parsed };
}

function ok(label, ...rest) {
  console.log(`✅ ${label}`, ...rest);
}
function fail(label, ...rest) {
  console.log(`❌ ${label}`, ...rest);
  process.exitCode = 1;
}

console.log(`\nSmoke test → ${BASE}`);
console.log(`Identity: ${EMAIL} / @${HANDLE}\n`);

// 1. Health
let res = await call("GET", "/api/health");
res.status === 200 && res.body?.ok ? ok("/api/health → 200 OK") : fail("/api/health", res);

// 2. /me unauth
res = await call("GET", "/api/auth/me");
res.status === 200 && res.body === null ? ok("/api/auth/me unauth → null") : fail("/api/auth/me unauth", res);

// 3. Register with WEAK password — should 400 with helpful Zod message
res = await call("POST", "/api/auth/register", {
  name: "Smoke",
  email: `weak-${stamp}@local.test`,
  password: WEAK,
  handle: `weak_${stamp}`,
  teamId: "corinthians",
});
if (res.status === 400) {
  const msg = typeof res.body?.message === "string" ? res.body.message : "";
  if (msg.includes("maiúscula") || msg.includes("[")) {
    ok("Weak password → 400 with Zod payload", `(message length ${msg.length})`);
  } else {
    fail("Weak password → 400 but message unexpected", msg);
  }
} else {
  fail(`Weak password expected 400, got ${res.status}`, res.body);
}

// 4. Register with STRONG password — should 200 + session cookie
res = await call("POST", "/api/auth/register", {
  name: "Smoke",
  email: EMAIL,
  password: STRONG,
  handle: HANDLE,
  teamId: "corinthians",
});
if (res.status === 200 && res.body?.id) {
  ok("Strong password register → 200", `id=${res.body.id}`);
  if (jar.has("connect.sid")) ok("Session cookie set");
  else fail("No session cookie after register");
} else {
  fail(`Register expected 200, got ${res.status}`, res.body);
}

// 5. /me after register — should return the user
res = await call("GET", "/api/auth/me");
if (res.status === 200 && res.body?.handle === HANDLE) {
  ok(`/api/auth/me authed → ${res.body.handle}`);
} else {
  fail("/me after register did not return user", res);
}

// 6. Logout
res = await call("POST", "/api/auth/logout", {});
res.status === 200 ? ok("Logout → 200") : fail("Logout", res);

// 7. /me after logout — should be null again
res = await call("GET", "/api/auth/me");
res.body === null ? ok("/me after logout → null") : fail("/me after logout", res);

// 8. Re-login
res = await call("POST", "/api/auth/login", { email: EMAIL, password: STRONG });
if (res.status === 200 && res.body?.id) {
  ok("Login → 200");
} else {
  fail(`Login expected 200, got ${res.status}`, res.body);
}

// 9. /me after login
res = await call("GET", "/api/auth/me");
res.status === 200 && res.body?.handle === HANDLE
  ? ok("/me after login → user present")
  : fail("/me after login", res);

// 10. Duplicate email
res = await call("POST", "/api/auth/register", {
  name: "Dup",
  email: EMAIL,
  password: STRONG,
  handle: `dup_${stamp}`,
  teamId: "corinthians",
});
res.status === 400 && res.body?.message?.includes("Email")
  ? ok("Duplicate email → 400")
  : fail("Duplicate email", res);

console.log(
  process.exitCode === 1
    ? "\n❌ Smoke test FAILED\n"
    : "\n✅ All smoke tests PASSED\n"
);
