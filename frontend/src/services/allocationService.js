import { apiFetch } from './api.js';

export async function getMyAllocations() {
  return apiFetch('/allocations/my');
}

export async function getDepartmentAllocations() {
  return apiFetch('/allocations/department');
}
