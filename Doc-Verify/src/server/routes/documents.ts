import express from 'express';
import { auth, checkUserType } from '../middleware/auth';
import {
  upload,
  uploadDocument,
  uploadBulkDocuments,
  verifyDocument,
} from '../controllers/documentController';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Document upload routes (restricted to university and government)
router.post(
  '/upload',
  checkUserType(['university', 'government']),
  upload.single('file'),
  uploadDocument
);

router.post(
  '/upload/bulk',
  checkUserType(['university', 'government']),
  uploadBulkDocuments
);

// Document verification routes (accessible to all authenticated users)
router.post('/verify/:documentId', verifyDocument);

export default router;