import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import documentService from '../services/documentService';
import socketService from '../services/socket';
import RichTextEditor from './RichTextEditor';
import { Form, Button, Container, Alert, Modal, Badge, InputGroup } from 'react-bootstrap';
import { FaUsers, FaShare, FaHistory, FaSave } from 'react-icons/fa';

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [versionHistory, setVersionHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchDocument();
      fetchVersionHistory();
    } else {
      setLoading(false);
    }

    // Connect to socket
    socketService.connect();

    // Join document room if editing
    if (id) {
      socketService.joinDocument(id);
    }

    // Listen for changes
    socketService.onReceiveChanges((changes) => {
      if (changes.documentId === id) {
        setContent(changes.content);
      }
    });

    // Auto-save every 30 seconds
    const autoSaveInterval = setInterval(autoSave, 30000);

    return () => {
      if (id) {
        socketService.leaveDocument(id);
      }
      socketService.disconnect();
      clearInterval(autoSaveInterval);
    };
  }, [id]);

  const fetchDocument = async () => {
    try {
      const data = await documentService.getDocument(id);
      setDocument(data);
      setTitle(data.title);
      setContent(data.content);
      setIsPublic(data.isPublic);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching document');
    } finally {
      setLoading(false);
    }
  };

  const fetchVersionHistory = async () => {
    if (!id) return;
    try {
      setLoadingHistory(true);
      const history = await documentService.getVersionHistory(id);
      setVersionHistory(history);
    } catch (err) {
      console.error('Error fetching version history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const autoSave = async () => {
    if (id && content) {
      try {
        setSaving(true);
        await documentService.updateDocument(id, { content });
        setLastSaved(new Date());
      } catch (err) {
        console.error('Auto-save failed:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const documentData = {
        title,
        content,
        isPublic
      };

      if (id) {
        await documentService.updateDocument(id, documentData);
      } else {
        await documentService.createDocument(documentData);
      }

      navigate('/documents');
    } catch (err) {
      setError(err.message || 'Error saving document');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);

    // Emit changes to other users
    if (id) {
      socketService.sendDocumentChange(id, {
        content: newContent
      });
    }
  };

  const handleShare = async () => {
    try {
      await documentService.addCollaborator(id, collaboratorEmail);
      setShowShareModal(false);
      setCollaboratorEmail('');
      // Refresh document data to show updated collaborators
      fetchDocument();
    } catch (err) {
      setError(err.message || 'Error sharing document');
    }
  };

  const handleRestoreVersion = async (version) => {
    if (!id) return;
    try {
      await documentService.restoreVersion(id, version);
      await fetchDocument();
      await fetchVersionHistory();
    } catch (err) {
      setError(err.message || 'Error restoring version');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container fluid className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{id ? 'Edit Document' : 'Create New Document'}</h2>
        <div className="d-flex gap-2 align-items-center">
          {saving && <Badge bg="info">Saving...</Badge>}
          {lastSaved && (
            <Badge bg="success">
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </Badge>
          )}
          {id && (
            <>
              <Button variant="outline-primary" onClick={() => setShowShareModal(true)}>
                <FaShare /> Share
              </Button>
              <Button variant="outline-secondary" onClick={() => setShowHistoryModal(true)}>
                <FaHistory /> History
              </Button>
            </>
          )}
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            <FaSave /> {id ? 'Update' : 'Create'} Document
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <RichTextEditor
            value={content}
            onChange={handleContentChange}
            height={600}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Make document public"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </Form.Group>
      </Form>

      {/* Share Modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Share Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Collaborator Email</Form.Label>
            <InputGroup>
              <Form.Control
                type="email"
                value={collaboratorEmail}
                onChange={(e) => setCollaboratorEmail(e.target.value)}
                placeholder="Enter email address"
              />
              <Button variant="primary" onClick={handleShare}>
                Add Collaborator
              </Button>
            </InputGroup>
          </Form.Group>
          {document?.collaborators && document.collaborators.length > 0 && (
            <div className="mt-3">
              <h6>Current Collaborators:</h6>
              <ul className="list-unstyled">
                {document.collaborators.map((collaborator) => (
                  <li key={collaborator._id}>
                    <FaUsers className="me-2" />
                    {collaborator.username}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* History Modal */}
      <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Version History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingHistory ? (
            <div className="text-center">Loading history...</div>
          ) : versionHistory.length > 0 ? (
            <div className="list-group">
              {versionHistory.map((version) => (
                <div key={version.version} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Version {version.version}</h6>
                      <small className="text-muted">
                        {new Date(version.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleRestoreVersion(version.version)}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No version history available</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DocumentEditor; 