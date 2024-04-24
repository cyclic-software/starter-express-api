import { Router } from 'express';
import {
  CreateProfile,
  DeleteProfile,
  GetProfile,
  UpdateProfile,
} from '../../controllers/ProfileController.js';
const router = Router();

router.post('/create/profile', CreateProfile);
router.get('/list/profiles/:id', GetProfile);
router.put('/update/profile/:id', UpdateProfile);
router.delete('/delete/profile/:id', DeleteProfile);

export { router as RouterProfile };
