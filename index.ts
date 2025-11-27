import express, { Express, Request, Response } from 'express';
import * as database from './config/database';
import dotenv from 'dotenv';
import Task from './model/task.model';
dotenv.config();

database.connect();


const app: Express = express();
const port: number | String  = process.env.PORT || 3000;



app.get('/tasks', async (req: Request, res: Response) => {
    const tasks= await Task.find({
        deleted: false
    });
    console.log(tasks);
    res.json( tasks);
});
app.get('/task/detail/:id', async (req: Request, res: Response) => {
    const id= req.params.id;
    const task= await Task.findById(id);
    console.log(task);
    res.json( task);    
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});