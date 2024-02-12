import express from 'express';
import { upload, prompt } from '../controllers/chat'; 
import multer from 'multer';
import { tempDirectory } from '../utils/constants';
import validate from '../middlewares/routeValidators/chat';
import { invalidPayloadError } from '../middlewares';

const router = express.Router();

router.post('/upload', multer({ dest: tempDirectory }).array('files'), upload);
router.post('/prompt', validate("prompt"), invalidPayloadError, prompt);

export default router;