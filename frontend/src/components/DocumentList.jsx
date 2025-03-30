import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import documentService from '../services/documentService';
import { Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getAllDocuments();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.deleteDocument(id);
        setDocuments(documents.filter(doc => doc._id !== id));
      } catch (err) {
        setError(err.message || 'Error deleting document');
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Documents</h2>
        <Link to="/documents/new">
          <Button variant="primary">Create New Document</Button>
        </Link>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        {documents.map((doc) => (
          <Col key={doc._id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{doc.title}</Card.Title>
                <Card.Text>
                  Created by: {doc.owner.username}
                  <br />
                  Last modified: {new Date(doc.lastModified).toLocaleDateString()}
                  <br />
                  {doc.isPublic ? 'Public' : 'Private'}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Link to={`/documents/${doc._id}`}>
                    <Button variant="outline-primary" size="sm">
                      Open
                    </Button>
                  </Link>
                  {doc.owner._id === localStorage.getItem('userId') && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(doc._id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {documents.length === 0 && !error && (
        <div className="text-center mt-5">
          <p>No documents found. Create your first document!</p>
        </div>
      )}
    </Container>
  );
};

export default DocumentList; 