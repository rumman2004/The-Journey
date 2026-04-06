const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Memories API
export const memoriesAPI = {
  getMemories: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/memories?${queryString}`);
    return response.json();
  },

  getMyHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/memories/my/history`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getMemory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`);
    return response.json();
  },

  createMemory: async (memoryData) => {
    const response = await fetch(`${API_BASE_URL}/memories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(memoryData)
    });
    return response.json();
  },

  updateMemory: async (id, memoryData) => {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(memoryData)
    });
    return response.json();
  },

  deleteMemory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  likeMemory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/memories/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  addComment: async (id, content) => {
    const response = await fetch(`${API_BASE_URL}/memories/${id}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    return response.json();
  }
};

// Photos API
export const photosAPI = {
  getPhotos: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/photos?${queryString}`);
    return response.json();
  },

  getPhoto: async (id) => {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`);
    return response.json();
  },

  uploadPhotos: async (files, metadata = {}) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('photos', file);
    });

    // Add metadata
    Object.keys(metadata).forEach(key => {
      if (Array.isArray(metadata[key])) {
        formData.append(key, metadata[key].join(','));
      } else {
        formData.append(key, metadata[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/photos/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return response.json();
  },

  updatePhoto: async (id, photoData) => {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(photoData)
    });
    return response.json();
  },

  deletePhoto: async (id) => {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  likePhoto: async (id) => {
    const response = await fetch(`${API_BASE_URL}/photos/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Users API
export const usersAPI = {
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },

  updateUser: async (id, userData) => {
    const isFormData = userData instanceof FormData;
    const headers = getAuthHeaders();
    if (isFormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers,
      body: isFormData ? userData : JSON.stringify(userData)
    });
    return response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getUserMemories: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/memories`);
    return response.json();
  },

  getUserPhotos: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/photos`);
    return response.json();
  }
};

// Journeys API
export const journeyAPI = {
  getJourneyEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/journeys`);
    return response.json();
  },

  createJourneyEvent: async (eventData, file) => {
    let response;
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      Object.keys(eventData).forEach(key => formData.append(key, eventData[key]));
      
      response = await fetch(`${API_BASE_URL}/journeys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
    } else {
      response = await fetch(`${API_BASE_URL}/journeys`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData)
      });
    }
    return response.json();
  },

  updateJourneyEvent: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/journeys/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData)
    });
    return response.json();
  },

  deleteJourneyEvent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/journeys/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};