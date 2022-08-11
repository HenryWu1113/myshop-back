import express from 'express'
import admin from '../middleware/admin.js'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import {
  createOrder,
  getMyOrder,
  getMyOrders,
  getAllOrders,
  changeOrder
} from '../controllers/orders.js'

const router = express.Router()

// 路由順序有差
router.post('/', content('application/json'), auth.jwt, createOrder)
router.get('/', auth.jwt, getMyOrders)
router.get('/all', auth.jwt, admin, getAllOrders)
router.get('/:id', auth.jwt, getMyOrder)
router.patch('/:id', content('application/json'), auth.jwt, admin, changeOrder)

export default router
