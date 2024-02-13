const mongoose=require('mongoose')
mongoose.connect(process.env.mongo_url)
const connection=mongoose.connection

connection.on('connected',()=>{
    console.log('Mongodb connected successfully')
})
connection.on('err',(err)=>{
    console.log('Mongodb  couldnt connect successfully')
})
module.exports=mongoose