import { io } from 'socket.io-client';
import config from '../config';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(config.SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
      if (error === 'Authentication error') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinDocument(documentId) {
    if (this.socket) {
      this.socket.emit('join-document', documentId);
    }
  }

  leaveDocument(documentId) {
    if (this.socket) {
      this.socket.emit('leave-document', documentId);
    }
  }

  sendDocumentChange(documentId, changes) {
    if (this.socket) {
      this.socket.emit('document-change', {
        documentId,
        changes
      });
    }
  }

  onReceiveChanges(callback) {
    if (this.socket) {
      this.socket.on('receive-changes', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }
}

export default new SocketService(); 