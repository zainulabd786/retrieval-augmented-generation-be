import express from 'express';
import { upload } from '../controllers/chat'; 
import multer from 'multer';
import { tempDirectory } from '../utils/constants';
// import validate from '../middlewares/routeValidators/chat';
// import { invalidPayloadError } from '../middlewares';

const router = express.Router();

router.post('/upload', multer({ dest: tempDirectory }).array('files'), upload);

export default router;