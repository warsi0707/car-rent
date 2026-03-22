import express from 'express'
import { imageUpload } from '../controller/uploader.controller.js'
import upload from '../utils/ImageUploader.js'

const UploaderRoutes = express.Router()

UploaderRoutes.post("/images", upload.array("images", 10), imageUpload)

export default UploaderRoutes