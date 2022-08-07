import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import {
  register,
  login,
  logout,
  extend,
  getUser,
  addCart,
  editCart,
  getCart,
  addLike,
  getLikes,
  deleteLike
} from '../controllers/users.js'

const router = express.Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.post('/extend', content('application/json'), auth.jwt, extend)
router.get('/', auth.jwt, getUser)
router.post('/cart', content('application/json'), auth.jwt, addCart)
router.patch('/cart', content('application/json'), auth.jwt, editCart)
router.get('/cart', auth.jwt, getCart)
router.post('/likes', content('application/json'), auth.jwt, addLike)
router.get('/likes', auth.jwt, getLikes)
router.patch('/likes', content('application/json'), auth.jwt, deleteLike)

export default router
