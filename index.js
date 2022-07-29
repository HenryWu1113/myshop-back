import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import './passport/passport.js'
import usersRouter from './routes/users.js'

mongoose.connect(process.env.DB_URL)

const app = express()

app.use(cors({
  origin(origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed'), false)
    }
  }
}))

app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求被拒' })
})

// 把 post 的 body 處理成 json 的格式
app.use(express.json())
// 如果 json 的格式不符
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求格式錯誤' })
})


app.use('/users', usersRouter)

app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('Server is running')
})