import news from '../models/news.js'

export const createNews = async (req, res) => {
  try {
    const result = await news.create({
      title: req.body.title,
      content: req.body.content,
      shownews: req.body.shownews
    })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const editNews = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      content: req.body.content,
      shownews: req.body.shownews
    }
    const result = await news.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', result })
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

export const getOneNews = async (req, res) => {
  try {
    const result = await news.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getNews = async (req, res) => {
  try {
    const result = await news.find({ shownews: true }).sort({ date: -1 })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllNews = async (req, res) => {
  try {
    const result = await news.find().sort({ date: -1 })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}