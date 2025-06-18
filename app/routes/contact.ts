import express from 'express'
import { identifyContact } from '@/controllers/contactController'

const contactRouter = express.Router()

contactRouter.post('/identify', identifyContact)

export default contactRouter