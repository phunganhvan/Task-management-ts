import Task from '../../../model/task.model';
import { Request, Response } from 'express';
import paginationHelper from '../../../helpers/pagination';
import { searchHelper } from '../../../helpers/search';
export const index = async (req: Request, res: Response) => {
    // ---------------- FIND ----------------
    interface Find {
        deleted: boolean;
        status?: string;
        title?: RegExp;
    }

    const find: Find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = String(req.query.status);
    }

    // ---------------- SORT ----------------
    const sort: Record<string, 1 | -1> = {};

    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = String(req.query.sortKey);
        const sortValue = Number(req.query.sortValue);

        // bảo đảm sortValue đúng kiểu 1 | -1
        sort[sortKey] = sortValue === -1 ? -1 : 1;
    }

    // ---------------- PAGINATION ----------------
    const initPagination = {
        currentPage: 1,
        limitItems: 3,
    };

    const countTasks = await Task.countDocuments(find);

    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    );

    // ---------------- SEARCH ----------------
    const objSearch = searchHelper(req.query);

    if (req.query.keyword && objSearch.regex instanceof RegExp) {
        find.title = objSearch.regex;
    }

    // ---------------- QUERY DB ----------------
    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip ?? 0);

    console.log(tasks);
    res.json(tasks);
};
// chi tiết sản phẩm
// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    // console.log(task);
    res.json(task);
}
//chỉnh sửa 1 công việc
//  [PATCH] api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const { status }: { status: string } = req.body;

        await Task.updateOne(
            { _id: id },
            { status: status }
        );

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        });
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: "Không tồn tại"
        });
    }
};


// [PATCH] /api/v1/tasks/change-multi 
// chỉnh sửa nhiều công việc

export const changeMulti = async (
    req: Request,
    res: Response
) => {
    try {
        const { ids, key, value } = req.body;
        console.log(ids, key, value);
        switch (key) {
            case "status":
                await Task.updateMany(
                    { _id: { $in: ids } },
                    { status: value }
                );

                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                });
                break;

            case "delete":
                await Task.updateMany(
                    { _id: { $in: ids } },
                    { deleted: true }
                );

                res.json({
                    code: 200,
                    message: "Xóa thành công"
                });
                break;

            default:
                res.status(400).json({
                    code: 400,
                    message: "Không tồn tại"
                });
                break;
        }
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: "Không tồn tại"
        });
    }
};

// [POST]  /api/v1/tasks/create
// tạo mới công việc
// Khai báo type cho req.user (Express không có sẵn)


export const create = async (req: Request, res: Response) => {
    try {

        // Tạo bản ghi
        const record = new Task(req.body);
        const data = await record.save();

        res.json({
            code: 200,
            message: "Tạo thành công",
            data: data
        });
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: "Lỗi!!!"
        });
    }
};

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;

        await Task.updateOne(
            { _id: id },
            req.body
        );

        res.json({
            code: 200,
            message: "Cập nhật thành công!"
        });
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: "Lỗi!!!"
        });
    }
};