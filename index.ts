import express, { Express, Request, Response } from 'express';
import * as database from './config/database';
import dotenv from 'dotenv';
import Task from './model/task.model';
import mainV1Routes from './api/v1/routes/index.route';
dotenv.config();

database.connect();


const app: Express = express();
const port: number | String  = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mainV1Routes(app);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});