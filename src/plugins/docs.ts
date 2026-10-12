const DOCS_BASE = "https://sing-box.sagernet.org/configuration"
// The Sudoku protocol is not part of upstream sing-box; its docs live in the
// sudoku-sing-box fork.
const SUDOKU_DOC = "https://github.com/SUDOKU-ASCII/sudoku-sing-box"

export function inboundDoc(type: string): string {
  if (type === "sudoku") return SUDOKU_DOC
  return `${DOCS_BASE}/inbound/${type}/`
}

export function outboundDoc(type: string): string {
  if (type === "sudoku") return SUDOKU_DOC
  return `${DOCS_BASE}/outbound/${type}/`
}

export function serviceDoc(type: string): string {
  return `${DOCS_BASE}/service/${type}/`
}

export function endpointDoc(type: string): string {
  const slug = type === "warp" ? "wireguard" : type
  return `${DOCS_BASE}/endpoint/${slug}/`
}

export const LOG_DOC = `${DOCS_BASE}/log/`
export const NTP_DOC = `${DOCS_BASE}/ntp/`
export const EXPERIMENTAL_DOC = `${DOCS_BASE}/experimental/`
export const CACHE_FILE_DOC = `${DOCS_BASE}/experimental/cache-file/`
export const CLASH_API_DOC = `${DOCS_BASE}/experimental/clash-api/`
export const V2RAY_API_DOC = `${DOCS_BASE}/experimental/v2ray-api/`
export const TLS_DOC = `${DOCS_BASE}/shared/tls/`
export const DNS_SERVER_DOC = `${DOCS_BASE}/dns/server/`
export const DNS_RULE_DOC = `${DOCS_BASE}/dns/rule/`
export const ROUTE_RULE_DOC = `${DOCS_BASE}/route/rule/`
export const RULESET_DOC = `${DOCS_BASE}/rule-set/`
