const API_BASE = '/api';

const getHeaders = (isMultipart = false) => {
  const headers = {};
  const token = localStorage.getItem('stark_admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || errorData.message || `Request failed with status ${response.status}`;
    if (response.status === 401) {
      // Clear token on unauthorized response
      localStorage.removeItem('stark_admin_token');
      localStorage.removeItem('stark_admin_user');
    }
    throw new Error(message);
  }
  return response.json();
};

export const api = {
  // Public APIs
  getPortfolio: () => fetch(`${API_BASE}/portfolio`).then(handleResponse),
  getHero: () => fetch(`${API_BASE}/hero`).then(handleResponse),
  getTechnologies: () => fetch(`${API_BASE}/technologies`).then(handleResponse),
  getProjects: (params = '') => fetch(`${API_BASE}/projects${params}`).then(handleResponse),
  getServices: () => fetch(`${API_BASE}/services`).then(handleResponse),
  getAbout: () => fetch(`${API_BASE}/about`).then(handleResponse),
  getTestimonials: () => fetch(`${API_BASE}/testimonials`).then(handleResponse),
  getSettings: () => fetch(`${API_BASE}/settings`).then(handleResponse),
  getProcess: () => fetch(`${API_BASE}/process`).then(handleResponse),
  submitContact: (data) =>
    fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Admin Auth APIs
  login: (email, password) =>
    fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),

  logout: () =>
    fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      headers: getHeaders(),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/admin/me`, {
      headers: getHeaders(),
    }).then(handleResponse),

  changePassword: (passwords) =>
    fetch(`${API_BASE}/admin/password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(passwords),
    }).then(handleResponse),

  // Admin CMS APIs
  getOverview: () =>
    fetch(`${API_BASE}/admin/overview`, {
      headers: getHeaders(),
    }).then(handleResponse),

  uploadImage: (formData) =>
    fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    }).then(handleResponse),

  uploadFile: (formData) =>
    fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    }).then(handleResponse),

  uploadMultipleFiles: (formData) =>
    fetch(`${API_BASE}/admin/upload-multiple`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    }).then(handleResponse),

  // Hero
  getAdminHero: () =>
    fetch(`${API_BASE}/admin/hero`, {
      headers: getHeaders(),
    }).then(handleResponse),

  updateHero: (data) =>
    fetch(`${API_BASE}/admin/hero`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Stats
  getAdminStats: () => fetch(`${API_BASE}/admin/stats`, { headers: getHeaders() }).then(handleResponse),
  createStat: (data) =>
    fetch(`${API_BASE}/admin/stats`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateStat: (id, data) =>
    fetch(`${API_BASE}/admin/stats/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteStat: (id) =>
    fetch(`${API_BASE}/admin/stats/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // Tech Ecosystem & Technologies
  getTechEcosystem: () => fetch(`${API_BASE}/tech-ecosystem`).then(handleResponse),
  getAdminTechEcosystem: () =>
    fetch(`${API_BASE}/admin/tech-ecosystem`, { headers: getHeaders() }).then(handleResponse),
  updateAdminTechEcosystem: (data) =>
    fetch(`${API_BASE}/admin/tech-ecosystem`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  getAdminTechnologies: () =>
    fetch(`${API_BASE}/admin/technologies`, { headers: getHeaders() }).then(handleResponse),
  createTechnology: (data) =>
    fetch(`${API_BASE}/admin/technologies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateTechnology: (id, data) =>
    fetch(`${API_BASE}/admin/technologies/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteTechnology: (id) =>
    fetch(`${API_BASE}/admin/technologies/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // Process / How I Build
  getAdminProcess: () =>
    fetch(`${API_BASE}/admin/process`, { headers: getHeaders() }).then(handleResponse),
  updateAdminProcessSettings: (data) =>
    fetch(`${API_BASE}/admin/process/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  createAdminProcessStep: (data) =>
    fetch(`${API_BASE}/admin/process/steps`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateAdminProcessStep: (id, data) =>
    fetch(`${API_BASE}/admin/process/steps/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteAdminProcessStep: (id) =>
    fetch(`${API_BASE}/admin/process/steps/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // Projects
  getAdminProjects: () =>
    fetch(`${API_BASE}/admin/projects`, { headers: getHeaders() }).then(handleResponse),
  createProject: (data) =>
    fetch(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateProject: (id, data) =>
    fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteProject: (id) =>
    fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // Services
  getAdminServices: () =>
    fetch(`${API_BASE}/admin/services`, { headers: getHeaders() }).then(handleResponse),
  createService: (data) =>
    fetch(`${API_BASE}/admin/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateService: (id, data) =>
    fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteService: (id) =>
    fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // About, Skills & Experiences
  getAdminAbout: () =>
    fetch(`${API_BASE}/admin/about`, { headers: getHeaders() }).then(handleResponse),
  updateAdminAbout: (data) =>
    fetch(`${API_BASE}/admin/about`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  createSkill: (data) =>
    fetch(`${API_BASE}/admin/skills`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateSkill: (id, data) =>
    fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteSkill: (id) =>
    fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  createExperience: (data) =>
    fetch(`${API_BASE}/admin/experiences`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateExperience: (id, data) =>
    fetch(`${API_BASE}/admin/experiences/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteExperience: (id) =>
    fetch(`${API_BASE}/admin/experiences/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // Testimonials
  getAdminTestimonials: () =>
    fetch(`${API_BASE}/admin/testimonials`, { headers: getHeaders() }).then(handleResponse),
  createTestimonial: (data) =>
    fetch(`${API_BASE}/admin/testimonials`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateTestimonial: (id, data) =>
    fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteTestimonial: (id) =>
    fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // Messages
  getAdminMessages: () =>
    fetch(`${API_BASE}/admin/messages`, { headers: getHeaders() }).then(handleResponse),
  markMessageRead: (id, isRead) =>
    fetch(`${API_BASE}/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ isRead }),
    }).then(handleResponse),
  deleteMessage: (id) =>
    fetch(`${API_BASE}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // Settings
  getAdminSettings: () =>
    fetch(`${API_BASE}/admin/settings`, { headers: getHeaders() }).then(handleResponse),
  updateAdminSettings: (data) =>
    fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
};

export default api;
