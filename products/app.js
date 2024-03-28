console.log("hello this is products microservice")

const express = require('express');
const axios=require("axios")
const app = express();

app.use(express.json());

const rabbitMq=require("amqplib/callback_api");

app.get('/products',async(req,res)=>{
    rabbitMq.connect("amqp://localhost",(err,connection)=>{
        if (err) {
            console.error("Error connecting to RabbitMQ:", err);
            return;
        }
        connection.createChannel((err,channel)=>{
            const queue = "user_msg_queue";
            channel.assertQueue(queue, {durable: false});
            channel.consume(queue, (msg)=>{
                console.log(" [x] Received %s", msg.content.toString());
                res.send("message form products service"+msg.content.toString());
            }, {noAck: true});

        })
    });


    // try{
    // const userData=await axios.get("http://localhost:5001/users");
    // console.log(userData);
    // res.send("message form products service"+userData.data);
    // }catch(err){
    //     console.log("unable to connec to user microservice")
    //     res.status(404).send("failed to fetch data form users")
    // }
   
});

app.listen(5002,()=>{
    console.log("server is running on port 5002");
});