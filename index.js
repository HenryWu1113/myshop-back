import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import usersRouter from './routes/users.js'

const app = express()


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