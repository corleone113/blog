import express from 'express';
import login from './login';
import manage from './manage';

const router = express.Router();

router.use('/', login);
router.use('/manage', manage);

export default router;