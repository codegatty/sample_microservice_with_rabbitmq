console.log("hello this is users microservice")

const express = require('express');
const app = express();

app.use(express.json());

const rabbitMq=require("amqplib/callback_api");

app.get('/users',(req,res)=>{
    const data={id:1,
    name:"jhon cena",
    age:20}

    rabbitMq.connect("amqp://localhost",(err,conn)=>{
        if (err) {
            console.error("Error connecting to RabbitMQ:", err);
            return;
        }
    conn.createChannel((err,channel)=>{

        if (err) {
            console.error("Error creating channel:", err);
            return;
        }
        const queue="user_msg_queue";
        const msg=JSON.stringify(data)
        channel.assertQueue(queue,{durable:false});
        channel.sendToQueue(queue,Buffer.from(msg));
    })
    });
    console.log("message queue created successfully")
    res.send("message form users service");
});
app.listen(5001,()=>{
    console.log("server is running on port 5001");
});