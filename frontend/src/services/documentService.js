import api from './api';

const documentService = {
  // Create a new document
  createDocument: async (documentData) => {
    try {
      const response = await api.post('/documents', documentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error creating document' };
    }
  },

  // Get all documents
  getAllDocuments: async () => {
    try {
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching documents' };
    }
  },

  // Get a single document
  getDocument: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching document' };
    }
  },

  // Update a document
  updateDocument: async (id, documentData) => {
    try {
      const response = await api.put(`/documents/${id}`, documentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating document' };
    }
  },

  // Delete a document
  deleteDocument: async (id) => {
    try {
      const response = await api.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting document' };
    }
  },

  // Add a collaborator
  addCollaborator: async (documentId, userId) => {
    try {
      const response = await api.post(`/documents/${documentId}/collaborators`, { userId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error adding collaborator' };
    }
  },

  // Get document version history
  getVersionHistory: async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}/versions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching version history' };
    }
  },

  // Restore a specific version
  restoreVersion: async (documentId, version) => {
    try {
      const response = await api.post(`/documents/${documentId}/versions/${version}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error restoring version' };
    }
  }
};

export default documentService; 