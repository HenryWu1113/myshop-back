import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [1, '商品名稱必須超過 1 個字以上'],
    maxlength: [20, '商品名稱不能超過 20 個字'],
    required: [true, '商品名稱不能為空'],
    unique: [true, '商品名稱不能重複']
  },
  price: {
    type: Number,
    min: [0, '價格不得為 0'],
    require: [true, '缺少價錢欄位']
  },
  description: {
    type: String
  },
  image: {
    type: String,
    require: [true, '缺少圖片欄位']
  },
  sell: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, '缺少分類欄位'],
    enum: {
      values: ['芒果', '香蕉', '火龍果'],
      message: '商品分類錯誤'
    }
  }

}, { versionkey: false })