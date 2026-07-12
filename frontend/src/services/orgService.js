import { apiFetch } from './api.js';

// ---- Departments ----
export async function getDepartments() {
  return apiFetch('/departments');
}

export async function createDepartment(data) {
  return apiFetch('/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDepartment(id, data) {
  return apiFetch(`/departments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ---- Categories ----
export async function getCategories() {
  return apiFetch('/categories');
}

export async function createCategory(data) {
  return apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---- Employee Directory ----
export async function getUsers() {
  return apiFetch('/users');
}

export async function promoteUser(id, role) {
  return apiFetch(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}