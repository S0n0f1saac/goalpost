// frontend/src/lib/api.js                       // central API helper for the frontend

const API_BASE = import.meta.env.VITE_API_BASE   // read API base from env at build time
  || 'http://127.0.0.1:8000/api';                // fallback to local Django API during dev

const ACCESS_KEY = 'gp_access';                  // localStorage key for access token
const REFRESH_KEY = 'gp_refresh';                // localStorage key for refresh token

export function getAccessToken() {               // read the access token from storage
  return localStorage.getItem(ACCESS_KEY);       // return string or null
}

export function getRefreshToken() {              // read the refresh token from storage
  return localStorage.getItem(REFRESH_KEY);      // return string or null
}

export function setTokens(tokens) {              // persist tokens to storage
  if (tokens?.access)                            // if access provided
    localStorage.setItem(ACCESS_KEY, tokens.access); // store access token
  if (tokens?.refresh)                           // if refresh provided
    localStorage.setItem(REFRESH_KEY, tokens.refresh); // store refresh token
}

export function clearTokens() {                  // remove tokens from storage (logout)
  localStorage.removeItem(ACCESS_KEY);           // delete access token
  localStorage.removeItem(REFRESH_KEY);          // delete refresh token
}

export async function api(path, options = {}) {  // generic fetch wrapper that adds JWT
  const method = options.method ?? 'GET';        // default method is GET
  const body = options.body ?                    // serialize body to JSON if provided
    JSON.stringify(options.body) : undefined;    // undefined means no body sent
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }; // base headers
  const access = getAccessToken();               // get current access token
  if (access) headers['Authorization'] = `Bearer ${access}`; // attach Authorization header if present

  const res = await fetch(`${API_BASE}${path}`,  // perform the request to API
    { method, headers, body });                  // pass method/headers/body to fetch

  if (res.status !== 401) return res;            // if not unauthorized, return response as-is

  const refresh = getRefreshToken();             // read stored refresh token
  if (!refresh) {                                // if no refresh token available
    clearTokens();                               // nuke any stale tokens
    return res;                                  // return original 401 to caller
  }

  const rr = await fetch(`${API_BASE}/auth/token/refresh/`, // attempt token refresh
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh }) }); // send refresh payload

  if (!rr.ok) {                                  // if refresh failed (expired/invalid)
    clearTokens();                               // clear tokens to force re-login
    return res;                                  // return original 401
  }

  const data = await rr.json();                  // parse refresh response JSON
  setTokens({ access: data.access });            // store new access token
  const retryHeaders = { ...headers, Authorization: `Bearer ${data.access}` }; // update auth header

  return fetch(`${API_BASE}${path}`,             // retry the original request once
    { method, headers: retryHeaders, body });    // send with fresh access token
}

export async function login(username, password) { // helper to perform login
  const r = await fetch(`${API_BASE}/auth/token/`, // call token endpoint
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }); // send creds
  if (!r.ok) throw new Error('Invalid credentials'); // throw on bad login
  const tokens = await r.json();                  // parse tokens JSON
  setTokens(tokens);                              // save access + refresh
  return tokens;                                  // return to caller if needed
}

export function logout() {                        // logout helper
  clearTokens();                                  // remove tokens from storage
}

export async function me() {                      // helper to call /auth/me
  const r = await api('/auth/me/');               // use wrapper so JWT auto-attaches
  if (!r.ok) throw new Error('Not authorized');   // bubble up if 401/403/etc.
  return r.json();                                // return parsed JSON user
}

export async function register({ username, email, password }) { // helper to register
  const r = await fetch(`${API_BASE}/auth/register/`,           // call register endpoint
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }) }); // payload
  if (!r.ok) throw new Error('Registration failed'); // throw if backend rejects
  return r.json();                                   // return backend response
}
