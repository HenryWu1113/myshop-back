import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    require: [true, '缺少使用者欄位']
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: 'products',
          require: [true, '缺少商品欄位']
        },
        quantity: {
          type: Number,
          min: [0, '價格不得為 0'],
          required: [true, '缺少數量欄位']
        }
      }
    ]
  },
  usercellphone: {
    type: String,
    require: [true, '缺少手機號碼欄位'],
    validate: {
      validator(value) {
        return validator.isMobilePhone(value.toString(), 'zh-TW')
      },
      message: '手機號碼格式錯誤'
    }
  },
  cellphone: {
    type: String,
    require: [true, '缺少手機號碼欄位'],
    validate: {
      validator(value) {
        return validator.isMobilePhone(value.toString(), 'zh-TW')
      },
      message: '手機號碼格式錯誤'
    }
  },
  address: {
    type: String,
    require: [true, '缺少地址欄位']
  },
  name: {
    type: String,
    require: [true, '缺少收件人欄位']
  },
  state: {
    // 0 = 未付款
    // 1 = 訂單成立
    // 2 = 取消訂單
    type: Number,
    require: [true, '缺少訂單狀態'],
    default: 0
  },
  date: {
    type: Date,
    default: Date.now()

  },
  deadline: {
    type: Date,
    default: Date.now() + 259200000 // 3天
  }
}, { versionKey: false })

export default mongoose.model('orders', schema)