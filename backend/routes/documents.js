const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Document = require('../models/Document');
const { documentValidation } = require('../middleware/validator');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Create a new document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Document created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, documentValidation, async (req, res) => {
  try {
    const { title, content = '', isPublic = false } = req.body;
    const document = new Document({
      title,
      content,
      isPublic,
      owner: req.userId
    });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error creating document' });
  }
});

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents for the authenticated user
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { owner: req.userId },
        { collaborators: req.userId },
        { isPublic: true }
      ]
    }).populate('owner', 'username');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Get a single document by ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.userId },
        { collaborators: req.userId },
        { isPublic: true }
      ]
    }).populate('owner', 'username');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document' });
  }
});

/**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     summary: Update a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.put('/:id', verifyToken, documentValidation, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const { title, content, isPublic } = req.body;
    if (title) document.title = title;
    if (content !== undefined) document.content = content;
    if (isPublic !== undefined) document.isPublic = isPublic;

    await document.save();
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error updating document' });
  }
});

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document' });
  }
});

/**
 * @swagger
 * /api/documents/{id}/collaborators:
 *   post:
 *     summary: Add a collaborator to a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Collaborator added successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.post('/:id/collaborators', verifyToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const { userId } = req.body;
    if (!document.collaborators.includes(userId)) {
      document.collaborators.push(userId);
      await document.save();
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error adding collaborator' });
  }
});

/**
 * @swagger
 * /api/documents/{id}/versions:
 *   get:
 *     summary: Get document version history
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Version history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.get('/:id/versions', verifyToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.userId },
        { collaborators: req.userId }
      ]
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const versionHistory = document.getVersionHistory();
    res.json(versionHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching version history' });
  }
});

/**
 * @swagger
 * /api/documents/{id}/versions/{version}:
 *   post:
 *     summary: Restore a specific version of a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: version
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Version restored successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document or version not found
 */
router.post('/:id/versions/:version', verifyToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const versionNumber = parseInt(req.params.version);
    const restored = await document.restoreVersion(versionNumber);

    if (!restored) {
      return res.status(404).json({ message: 'Version not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error restoring version' });
  }
});

module.exports = router; 