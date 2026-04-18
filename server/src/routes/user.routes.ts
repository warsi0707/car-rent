import express from 'express'
import { AuthRequire } from '../middleware/AuthMiddleware.js'
import { listUsers, banUser, unbanUser } from '../controller/user.controller.js'

const UserRouter = express.Router()

UserRouter.get('/', AuthRequire, listUsers)
UserRouter.post('/ban/:id', AuthRequire, banUser)
UserRouter.post('/unban/:id', AuthRequire, unbanUser)

export default UserRouter
