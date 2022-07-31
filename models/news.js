import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, '缺少標題欄位']
  },
  content: {
    type: String,
    require: [true, '缺少消息內容欄位']
  },
  date: {
    type: Date,
    default: Date.now()
  },
  shownews: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('news', schema)
