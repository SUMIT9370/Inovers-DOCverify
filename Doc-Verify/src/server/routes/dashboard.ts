import express from 'express';
import { auth } from '../middleware/auth';
import {
  getDashboardStats,
  getVerificationHistory,
  getPendingDocuments,
} from '../controllers/dashboardController';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/stats', getDashboardStats);
router.get('/history', getVerificationHistory);
router.get('/pending', getPendingDocuments);

export default router;