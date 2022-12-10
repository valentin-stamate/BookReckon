import express = require("express");
import {config} from "dotenv";
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import {Middleware} from "./middleware/middleware";
import {initModels} from "./database/models";
import { UserController } from "./controller/user.controller";
import { BookController } from "./controller/book.controller";
import {UserService} from "./service/user.service";
import {importBookDataset} from "./service/import.dataset.service";

config();
const env = process.env;

const app = express();
const port = env.PORT || 8080;
const host = `http://localhost:${port}`

initModels()
    .then(() => {
        console.log('Database connection successfully initialized');
    }).then(() => {
        console.log("Dataset of books was inserted in DB.")
        return importBookDataset();
})
    .catch(err => {
        console.log(err);
    });

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/

app.set('json spaces', 4);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Handle logs in console during development
app.use(morgan('dev'));
app.use(cors({origin: '*'}));

// Handle security and origin in production
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

/************************************************************************************
 *                               Register all REST routes
 ***********************************************************************************/

app.get('/api/user/login', Middleware.visitorMiddleware, UserController.loginUser);
app.get('/api/user/signup', Middleware.visitorMiddleware, UserController.signupUser);

app.get(`/api/user/info`, Middleware.userMiddleware, UserController.getUserInfo);

app.get('/book/:bookId', BookController.getBook);

/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/
app.use(Middleware.errorHandler);

app.listen(port, () => {
    console.log(`Server started at ${host}`);
});