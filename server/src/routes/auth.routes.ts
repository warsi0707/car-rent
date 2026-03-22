import express from 'express'
import { adminLogout, adminSignin, adminSignup, createAdmin } from '../controller/auth.controller.js';
import { AuthRequire } from '../middleware/AuthMiddleware.js';

const AuthRouter = express.Router()


AuthRouter.post("/signup", adminSignup)
AuthRouter.post("/signin", adminSignin)
AuthRouter.post("/signout", AuthRequire, adminLogout)
AuthRouter.post("/create-admin", createAdmin)


export default AuthRouter;