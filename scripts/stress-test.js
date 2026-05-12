/**
 * k6 — carga leve no endpoint de feed (público, com queries ao DB).
 *
 * Pré-requisito: https://k6.io/docs/getting-started/installation/
 *
 * Uso:
 *   k6 run scripts/stress-test.js
 *   BASE_URL=https://SEU_DOMINIO.vercel.app k6 run scripts/stress-test.js
 *
 * Nota: não existe handler em GET /api/feed sozinho; o padrão abaixo usa
 * /api/feed/influencers (lista de notícias publicadas). Sobrescreva com:
 *   k6 run -e FEED_PATH=/api/feed/trending scripts/stress-test.js
 */

import http from "k6/http";
import { check, sleep } from "k6";

const base = (__ENV.BASE_URL || "https://REPLACE_ME.example.com").replace(/\/$/, "");
const feedPath = __ENV.FEED_PATH || "/api/feed/influencers?limit=20";

export const options = {
  vus: 20,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<8000"],
  },
};

export default function () {
  const url = `${base}${feedPath.startsWith("/") ? feedPath : `/${feedPath}`}`;
  const res = http.get(url, {
    headers: { Accept: "application/json" },
  });
  check(res, {
    "status 200": (r) => r.status === 200,
  });
  sleep(0.05);
}

export function setup() {
  if (base.includes("REPLACE_ME")) {
    console.warn(
      "\n[k6] Defina BASE_URL, ex.: BASE_URL=https://futtwitter.vercel.app k6 run scripts/stress-test.js\n",
    );
  }
  return { base };
}
