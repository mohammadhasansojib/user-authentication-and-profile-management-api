import express from "express";
import User from "../controllers/user.controller"

let router = express.Router();

router.post('/auth/register', User.register);
router.post('/auth/login', User.login);

router.post('/auth/refresh', User.refresh);

router.get('/users/me', User.getMe);
router.put('/users/me', User.updateMe);

router.post('/auth/logout', User.logout);

router.post('/auth/forget-password', User.forgetPass);
router.post('/auth/reset-password', User.resetPass);

export default router;