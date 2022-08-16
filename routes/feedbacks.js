import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'

import {
  createFeedback,
  getAllFeedback
} from '../controllers/feedbacks.js'

const router = express.Router()

router.post('/', content('application/json'), auth.jwt, createFeedback)
router.get('/all', auth.jwt, admin, getAllFeedback)

export default router
