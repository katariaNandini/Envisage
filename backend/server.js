const express=require('express');
const app=express();
const port=process.env.PORT||5002;


console.log('starting server');

app.get('/',(req,res)=>{
    console.log('get request/');
    res.send('this is the backend server');
});

app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`);
});

