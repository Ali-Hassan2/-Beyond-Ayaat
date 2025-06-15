const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app  = express();
const connectdb = require('./Config/db');
const morgan = require('morgan');
const colors = require('colors');

dotenv.config();
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.get('/',(req,res)=>{
    res.send("Hello g");
})


const startServer = async ()=>{
    return new Promise((resolve,reject)=>{
        try {
            connectdb();
            const server = app.listen(port,()=>{
                console.log(colors.bgBlack.green(`The Server is running at port: ${port}`));

                resolve(server);
            })
        } catch (error) {
            cconsole.log(colors.bgBlack.red("There is an error while starting the server"));

            reject(error);
        }
    })
}

startServer();