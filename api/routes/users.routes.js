import { Router } from 'express';
import {
  createUsers,
  deleteUsersById,
  getUsers,
  getUsersById,
  updateUsersById,
} from '../controllers/users.controllers.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUsersById);
router.post('/', createUsers);
router.put('/:id', updateUsersById);
router.delete('/:id', deleteUsersById);

export default router;
