import users from '../models/users.js'
import products from '../models/products.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  const password = req.body.password
  if (!password) {
    return res.status(400).send({ success: false, message: '缺少密碼欄位' })
  }
  if (password.length < 4) {
    return res.status(400).send({ success: false, message: '密碼必須 4 個字以上' })
  }
  if (password.length > 20) {
    return res.status(400).send({ success: false, message: '密碼必須 20 個字以下' })
  }
  if (!password.match(/^[A-Za-z0-9]+$/)) {
    return res.status(400).send({ success: false, message: '密碼格式錯誤' })
  }
  req.body.password = bcrypt.hashSync(password, 10)
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號或是 Email 重複' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).send({
      success: true,
      message: '登入成功',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        nickname: req.user.nickname,
        avatar: req.user.avatar,
        cart: req.user.cart.length,
        likes: req.user.likes,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// likes: req.user.likes
export const getUser = (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        nickname: req.user.nickname,
        avatar: req.user.avatar,
        cart: req.user.cart.length,
        likes: req.user.likes,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const addCart = async (req, res) => {
  try {
    // 驗證商品
    const result = await products.findById(req.body.product)
    // 沒找到或已下架
    if (!result || !result.sell) {
      return res.status(404).send({ success: false, message: '商品不存在' })
    }
    // 找購物車有沒有這個商品
    const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
    if (idx > -1) {
      req.user.cart[idx].quantity += req.body.quantity
    } else {
      req.user.cart.push({
        product: req.body.product,
        quantity: req.body.quantity
      })
    }
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.cart.length })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const editCart = async (req, res) => {
  try {
    if (req.body.quantity <= 0) {
      const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      req.user.cart.splice(idx, 1)
      await req.user.save()
    } else {
      const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      req.user.cart[idx].quantity = req.body.quantity
      await req.user.save()
    }
    res.status(200).send({ success: true, message: '', result: req.user.cart.length })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(200).send({ seccess: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const addLike = async (req, res) => {
  try {
    const result = await products.findById(req.body.product)
    if (!result || !result.sell) {
      return res.status(404).send({ success: false, message: '商品不存在' })
    }

    const idx = req.user.likes.findIndex(item => item.product.toString() === req.body.product)
    if (idx > -1) {
      return res.status(400).send({ success: false, message: '已在收藏中' })
    }

    req.user.likes.push({ product: req.body.product })
    await req.user.save()
    res.status(200).send({ success: true, message: '加入收藏成功', result: req.user.likes })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getLikes = async (req, res) => {
  try {
    const result = await users.findById(req.user._id).populate('likes.product')
    res.status(200).send({ success: true, message: '', result: result.likes })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteLike = async (req, res) => {
  try {
    const idx = req.user.likes.findIndex(item => item.product.toString() === req.body.product)
    if (idx === -1) {
      return res.status(400).send({ success: false, message: '未加入收藏，無法刪除' })
    }
    req.user.likes.splice(idx, 1)
    req.user.save()
    res.status(200).send({ success: true, message: '取消收藏', result: req.user.likes })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
