// frontend/src/lib/api.js                                                     // file path + purpose: API helpers

/** CONSTANTS *****************************************************************************************************************/

// Get the raw API base from Vite env or default to local Django API                    //
const RAW_API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";      // read env, fallback to dev URL

// Normalize base by stripping trailing slashes to avoid accidental '//' in URLs        //
const API_BASE = RAW_API_BASE.replace(/\/+$/, "");                                      // ensure consistent base URL

// Storage keys for tokens in localStorage                                              //
const ACCESS_KEY = "gp_access";                                                         // key for access token
const REFRESH_KEY = "gp_refresh";                                                       // key for refresh token

/** TOKEN STORAGE ************************************************************************************************************/

// Read the current access token from localStorage                                      //
export function getAccessToken() {                                                      // export function to callers
  return localStorage.getItem(ACCESS_KEY);                                              // returns token string or null
}                                                                                       // end getAccessToken

// Read the current refresh token from localStorage                                     //
export function getRefreshToken() {                                                     // export function to callers
  return localStorage.getItem(REFRESH_KEY);                                             // returns token string or null
}                                                                                       // end getRefreshToken

// Persist tokens to localStorage                                                       //
export function setTokens(tokens) {                                                     // tokens: { access?, refresh? }
  if (tokens?.access) localStorage.setItem(ACCESS_KEY, tokens.access);                  // save access if provided
  if (tokens?.refresh) localStorage.setItem(REFRESH_KEY, tokens.refresh);               // save refresh if provided
}                                                                                       // end setTokens

// Clear tokens from localStorage (logout or refresh failure)                           //
export function clearTokens() {                                                         // export function
  localStorage.removeItem(ACCESS_KEY);                                                  // remove access
  localStorage.removeItem(REFRESH_KEY);                                                 // remove refresh
}                                                                                       // end clearTokens

/** SINGLE-FLIGHT REFRESH ****************************************************************************************************/

// Track a single in-flight refresh so multiple 401s don’t trigger parallel refresh calls //
let _refreshing = null;                                                                  // null or Promise<string|null>

// Attempt to refresh the access token using the stored refresh token                     //
async function refreshAccessToken() {                                                    // returns new access string or null
  if (_refreshing) return _refreshing;                                                   // reuse existing refresh attempt
  const refresh = getRefreshToken();                                                     // read refresh token from storage
  if (!refresh) return null;                                                             // cannot refresh without token

  // Create a single shared async operation                                               //
  _refreshing = (async () => {                                                           // assign promise to tracker
    const r = await fetch(`${API_BASE}/auth/token/refresh/`, {                           // hit SimpleJWT refresh endpoint
      method: "POST",                                                                     // HTTP method
      headers: { "Content-Type": "application/json", "Accept": "application/json" },      // JSON headers
      body: JSON.stringify({ refresh }),                                                  // send refresh token
    });                                                                                   // end fetch
    if (!r.ok) return null;                                                               // refresh failed (expired/invalid)
    const data = await r.json();                                                          // parse JSON response
    const newAccess = data?.access || null;                                               // extract new access token
    if (newAccess) setTokens({ access: newAccess });                                      // persist new access token
    return newAccess;                                                                     // return fresh access or null
  })();                                                                                   // immediately invoke

  try {                                                                                   // protect finalization
    return await _refreshing;                                                             // resolve to access or null
  } finally {                                                                             // always runs
    _refreshing = null;                                                                    // clear tracker for future 401s
  }                                                                                       // end finally
}                                                                                         // end refreshAccessToken

/** CORE FETCH WRAPPER *******************************************************************************************************/

// Generic API call that auto-attaches Authorization and retries once after a 401         //
export async function api(path, options = {}) {                                           // path can be '/x' or 'x'
  const method = options.method ?? "GET";                                                  // default method is GET

  // Build a safe absolute URL                                                             //
  const urlPath = path.startsWith("/") ? path : `/${path}`;                               // ensure leading slash
  const url = `${API_BASE}${urlPath}`;                                                    // final absolute URL

  // Start with common headers                                                              //
  const headers = { Accept: "application/json", ...(options.headers || {}) };             // prefer JSON responses

  // Prepare body and content-type handling                                                //
  let body = options.body;                                                                 // raw body from caller
  const isFormData = (typeof FormData !== "undefined") && (body instanceof FormData);     // detect FormData payload
  const shouldJson = body !== undefined && !isFormData && typeof body !== "string";       // plain object → JSON

  if (shouldJson) {                                                                        // if we got a plain object
    headers["Content-Type"] = "application/json";                                          // set JSON content type
    body = JSON.stringify(body);                                                           // serialize to string
  } else if (typeof body === "string") {                                                   // if caller passed a string
    headers["Content-Type"] = headers["Content-Type"] || "application/json";               // default to JSON if unset
  }                                                                                        // if FormData, let browser set boundary

  // Attach Authorization if we already have an access token                                //
  const access = getAccessToken();                                                          // read stored access token
  if (access) headers["Authorization"] = `Bearer ${access}`;                                // add Bearer header

  // First attempt                                                                          //
  const res = await fetch(url, { method, headers, body });                                  // perform request
  if (res.status !== 401) return res;                                                       // return if not unauthorized

  // On 401, try a single refresh                                                            //
  const newAccess = await refreshAccessToken();                                              // attempt to refresh access
  if (!newAccess) {                                                                          // if refresh failed
    clearTokens();                                                                           // clear stale tokens
    return res;                                                                              // return original 401
  }                                                                                          // else we have a new token

  // Retry once with the fresh access token                                                   //
  const retryHeaders = { ...headers, Authorization: `Bearer ${newAccess}` };                 // override Authorization
  return fetch(url, { method, headers: retryHeaders, body });                                // return retried promise
}                                                                                            // end api

/** AUTH HELPERS **************************************************************************************************************/

// Login: exchange username/password for tokens and persist them                            //
export async function login(username, password) {                                           // export function
  const r = await fetch(`${API_BASE}/auth/token/`, {                                        // SimpleJWT token endpoint
    method: "POST",                                                                          // HTTP method
    headers: { "Content-Type": "application/json", "Accept": "application/json" },           // JSON headers
    body: JSON.stringify({ username, password }),                                            // credentials payload
  });                                                                                        // end fetch
  if (!r.ok) throw new Error("Invalid credentials");                                         // bubble up auth errors
  const tokens = await r.json();                                                             // parse tokens JSON
  setTokens(tokens);                                                                         // persist access + refresh
  return tokens;                                                                             // return tokens to caller
}                                                                                            // end login

// Logout: clear stored tokens                                                               //
export function logout() {                                                                   // export function
  clearTokens();                                                                             // remove access/refresh
}                                                                                            // end logout

// me: fetch the current user with Authorization header                                      //
export async function me() {                                                                 // export function
  const r = await api("/auth/me/");                                                          // GET /api/auth/me/
  if (!r.ok) throw new Error("Not authorized");                                              // convert non-2xx to error
  return r.json();                                                                           // return parsed JSON
}                                                                                            // end me

// register: create a user account                                                            //
export async function register({ username, email, password }) {                               // export function
  const r = await fetch(`${API_BASE}/auth/register/`, {                                      // POST /api/auth/register/
    method: "POST",                                                                          // HTTP method
    headers: { "Content-Type": "application/json", "Accept": "application/json" },           // JSON headers
    body: JSON.stringify({ username, email, password }),                                     // registration payload
  });                                                                                        // end fetch
  if (!r.ok) throw new Error("Registration failed");                                         // bubble up errors
  return r.json();                                                                           // return server response
}                                                                                            // end register

/** PROFILE HELPERS ***********************************************************************************************************/

// profileGet: fetch the current user's profile                                             //
export async function profileGet() {                                                         // export function
  const r = await api("/profile/me/");                                                       // GET /api/profile/me/
  if (!r.ok) throw new Error("Failed to load profile");                                      // handle non-2xx
  return r.json();                                                                           // return parsed JSON
}                                                                                            // end profileGet

// profileUpdate: update current user's profile (partial allowed)                            //
export async function profileUpdate(payload) {                                               // payload: { role?, display_name?, bio? }
  const r = await api("/profile/me/", { method: "PUT", body: payload });                     // PUT /api/profile/me/
  if (!r.ok) throw new Error("Failed to save profile");                                      // handle validation/auth errors
  return r.json();                                                                           // return updated profile JSON
}                                                                                            // end profileUpdate


