import express from 'express'

const AddOnRouter = express.Router()

import { AuthRequire } from '../middleware/AuthMiddleware.js'
import { createAddOn, deleteAddOn, getAddons } from '../controller/addons.controller.js'

AddOnRouter.post("/create", AuthRequire, createAddOn)
AddOnRouter.get("/", getAddons)
AddOnRouter.delete("/:id", AuthRequire, deleteAddOn)
AddOnRouter.patch("/update/:id", AuthRequire, createAddOn) // Reusing create for update since the fields are same. It will check if the id is present then it will update otherwise it will create new add-on

//Public routes
AddOnRouter.get("/public", getAddons)

export default AddOnRouter