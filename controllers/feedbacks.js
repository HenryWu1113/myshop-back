import feedbacks from '../models/feedbacks.js'
import users from '../models/users.js'

export const createFeedback = async (req, res) => {
  try {
    let result = users.findById(req.user._id)
    result = await (await feedbacks.create({ user: req.user._id, comment: req.body.comment })).populate('user')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllFeedback = async (req, res) => {
  try {
    const result = await feedbacks.find().populate('user').sort({ date: -1 })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
