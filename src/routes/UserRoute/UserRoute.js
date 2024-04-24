import { Router } from 'express';
import {
  CreateUser,
  DeleteUsers,
  ReadUser,
  ReadUsers,
  UpdateUsers,
} from '../../controllers/UserController.js';

const router = Router();

router.post('/create/user', CreateUser);
router.get('/list/user/:id', ReadUser);
router.get('/list/users', ReadUsers);
router.put('/update/user/:id', UpdateUsers);
router.delete('/delete/user/:id', DeleteUsers);

export { router as RouterUser };
