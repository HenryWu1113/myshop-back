import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema({
  account: {
    type: String,
    require: [true, '缺少帳號欄位'],
    minlength: [4, '帳號不得低於 4 個字'],
    maxlength: [20, '帳號不得高於 20 個字'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  password: {
    type: String,
    require: [true, '缺少密碼欄位']
  },
  tokens: {
    type: [String]
  },
  email: {
    type: String,
    require: [true, '缺少信箱欄位'],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value)
      },
      message: '信箱格式錯誤'
    }
  },
  nickname: {
    type: String,
    require: [true, '暱稱不得為空'],
    minlength: [1, '暱稱需 1 個字以上'],
    maxlength: [10, '暱稱需 10 個字以下']
  },
  avatar: {
    type: String,
    default: 'https://www.loudegg.com/wp-content/uploads/2020/10/Mickey-Mouse.jpg'
  },
  cart: {
    type: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: 'products',
          require: [true, '缺少商品欄位']
        },
        quantity: {
          type: Number,
          min: [0, '商品數量不能小於0'],
          require: [true, '缺少商品數量']
        }
      }
    ]
  },
  likes: {
    type: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: 'products',
          require: [true, '缺少商品欄位']
        }
        // ,
        // like: {
        //   type: Boolen,
        //   require: [true, '需要加入收藏']
        // }
      }
    ]
  },
  role: {
    // 0 = 使用者
    // 1 = 管理員
    type: Number,
    default: 0
  }
}, { versionkey: false })

export default mongoose.model('users', schema)
