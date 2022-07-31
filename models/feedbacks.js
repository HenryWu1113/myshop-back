import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    require: [true, '缺少使用者欄位']
  },
  comment: {
    type: String,
    require: [true, '缺少回饋內容欄位'],
    minlength: [1, '回饋內容至少 1 個字'],
    maxlength: [500, '回饋內容最多 500 個字']
  },
  date: {
    type: Date,
    default: Date.now()
  }
}, { versionkey: false })

export default mongoose.model('feedbacks', schema)
