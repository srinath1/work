const express=require('express')
require('dotenv').config()
const dbConfig=require('./config/dbConfig')
const usersRoute=require('./routes/usersRoute')
const projectsRoute=require('./routes/projectsRoute')
const tasksRoute=require('./routes/tasksRoute')
const notificationsRoute=require('./routes/notificationsRoute')
const app=express()
app.use(express.json())
const port=process.env.PORT ||5000

app.use('/api/users',usersRoute)
app.use('/api/projects',projectsRoute)
app.use('/api/tasks',tasksRoute)
app.use('/api/notifications',notificationsRoute)
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}
app.listen(port,()=>{

   console.log(` Node server listening at  port ${port}`)

})