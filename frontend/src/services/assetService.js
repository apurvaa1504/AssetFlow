import { apiFetch } from './api.js';

export async function getAssets() {
  return apiFetch('/assets');
}

export async function createAsset(data) {
  return apiFetch('/assets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

