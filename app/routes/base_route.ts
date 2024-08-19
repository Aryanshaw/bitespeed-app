import { getTest } from '@/controllers/test_controller';
import express from 'express';

const router = express.Router();

// define your routes here
router.get('/', getTest)

export default router;
