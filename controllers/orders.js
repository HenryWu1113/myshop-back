import users from '../models/users.js'
import orders from '../models/orders.js'

export const createOrder = async (req, res) => {
  try {
    if (req.user.cart.length === 0) {
      return res.status(400).send({ seccess: false, message: '購物車為空' })
    }
    let result = await users.findById(req.user._id, 'cart').populate('cart.product')
    const canCheckout = result.cart.every(item => item.product.sell)
    if (!canCheckout) {
      return res.status(400).send({ seccess: false, message: '購物車有已下架商品' })
    }
    result = await orders.create({
      user: req.user._id,
      products: req.user.cart,
      receiver: req.body.receiver,
      cellphone: req.body.cellphone,
      address: req.body.address
    })
    req.user.cart = []
    await req.user.save({ validateBeforeSave: false })
    return res.status(200).send({ seccess: true, message: '', result: result._id })
  } catch (error) {
    return res.status(500).send({ seccess: false, message: '伺服器錯誤' })
  }
}

export const getMyOrder = async (req, res) => {
  try {
    const result = await orders.findById(req.params.id)
    console.log(result);
    res.status(200).send({ success: true, message: '', result: result })
  } catch (error) {
    return res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id }).populate('products.product')
    return res.status(200).send({ seccess: true, message: '', result: result })
  } catch (error) {
    return res.status(500).send({ seccess: false, message: '伺服器錯誤' })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const result = await orders.find().populate('products.product').populate('user', 'nickname')
    return res.status(200).send({ seccess: true, message: '', result: result })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ seccess: false, message: '伺服器錯誤' })
  }
}