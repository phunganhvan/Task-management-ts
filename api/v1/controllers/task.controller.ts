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
    console.log(task);
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
