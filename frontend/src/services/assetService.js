import { apiFetch } from './api.js';

export async function getAssets() {
  return apiFetch('/assets');
}
