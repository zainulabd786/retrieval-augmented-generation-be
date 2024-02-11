import express from 'express';
import { index } from '../controllers'; 
import validate from '../middlewares/routeValidators';
import { invalidPayloadError } from '../middlewares';

const router = express.Router();

router.post('/:id', validate("index"), invalidPayloadError, index);

export default router;