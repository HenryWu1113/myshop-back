import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import {
  createNews,
  editNews,
  getOneNews,
  getNews,
  getAllNews
} from '../controllers/news.js'

const router = express.Router()

// 路由順序有差
router.post('/', content('application/json'), auth.jwt, admin, createNews)
router.get('/', getNews)
router.get('/all', auth.jwt, admin, getAllNews)
router.get('/:id', getOneNews)
router.patch('/:id', content('application/json'), auth.jwt, admin, editNews)

export default router