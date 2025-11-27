import Task from '../../../model/task.model';
import { Request, Response } from 'express';
export const index = async (req: Request, res: Response) => {
    interface Find {
        deleted: boolean;
        status?: string;
    }
    const find:Find= {
        deleted: false,
    };
    if(req.query.status){
        find.status= req.query.status.toString();
    }

    const tasks= await Task.find(find);
    console.log(tasks);
    res.json( tasks);
}
// chi tiết sản phẩm
// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id= req.params.id;
    const task= await Task.findById(id);
    console.log(task);
    res.json( task);    
}
//chỉnh sửa 1 công việc
//  [PATCH] api/v1/tasks/change-status/:id

