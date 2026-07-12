import { apiFetch } from './api.js';

export async function getNotifications() {
  return apiFetch('/notifications');
}

export async function markNotificationAsRead(id) {
  return apiFetch(`/notifications/${id}/read`, {
    method: 'PATCH',
  });
}
