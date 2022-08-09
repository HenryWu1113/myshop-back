import express from 'express'
import admin from '../middleware/admin.js'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import {
  createOrder,
  getMyOrders,
  getAllOrders
} from '../controllers/orders.js'

const router = express.Router()

router.post('/', content('application/json'), auth.jwt, createOrder)
router.get('/', auth.jwt, getMyOrders)
router.get('/all', auth.jwt, admin, getAllOrders)

export default router
