import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controllers.js';

const routerAuth = Router();

routerAuth.post('/register', register);

routerAuth.post('/login', login);

routerAuth.post('/logout', logout);

export default routerAuth;
