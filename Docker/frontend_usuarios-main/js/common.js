export const API_COOP     = 'http://127.0.0.1:8002/api';
export const API_USUARIOS = 'http://127.0.0.1:8001/api';

export const $ = (sel, ctx = document) => ctx.querySelector(sel);

export function setMsg(el, text, kind = 'ok') {
  if (!el) return;
  el.textContent = text;
  el.classList.remove('ok','good','bad');
  el.classList.add(kind);
}

export function getToken() {
  const qs = new URLSearchParams(location.hash.slice(1));
  let t = qs.get('token') || localStorage.getItem('token') || '';
  if (qs.get('token')) localStorage.setItem('token', t);
  return t;
}

async function handleJsonResponse(r) {

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(data?.msg || data?.message || ('HTTP ' + r.status));
    e.status = r.status;
    e.body = data;
    throw e;
  }
  return data;
}

export async function getJSON(url, token) {
  const r = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
  return handleJsonResponse(r);
}

export async function postJSON(url, payload, token) {
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(payload ?? {})
  });
  return handleJsonResponse(r);
}

export async function putJSON(url, payload, token) {
  const r = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(payload ?? {})
  });
  return handleJsonResponse(r);
}

export async function postFile(url, formData, token) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: formData
  });
  return handleJsonResponse(r);
}

export function mountTopbar(){ /* noop */ }

console.log('common.js loaded v=clean6', { API_COOP, API_USUARIOS });