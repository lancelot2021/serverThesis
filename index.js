require('dotenv').config({path: __dirname + '/.dotEnv'});
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 80;
const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(path.join(__dirname + '/public')));
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try{
        await mongoose.connect(process.env.DB_CON, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
    }catch (e){
        console.log(e);
    }
}

start()
