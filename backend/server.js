import express from 'express'

import dotenv from 'dotenv'




dotenv.config()





const app=express()
const port=process.env.PORT



//Server listen
app.listen(port,()=>{
    console.log(`App is listening to the port ${port}`)
})