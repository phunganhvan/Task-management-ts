"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../../../model/task.model"));
const pagination_1 = __importDefault(require("../../../helpers/pagination"));
const search_1 = require("../../../helpers/search");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = String(req.query.status);
    }
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = String(req.query.sortKey);
        const sortValue = Number(req.query.sortValue);
        sort[sortKey] = sortValue === -1 ? -1 : 1;
    }
    const initPagination = {
        currentPage: 1,
        limitItems: 3,
    };
    const countTasks = yield task_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.default)(initPagination, req.query, countTasks);
    const objSearch = (0, search_1.searchHelper)(req.query);
    if (req.query.keyword && objSearch.regex instanceof RegExp) {
        find.title = objSearch.regex;
    }
    const tasks = yield task_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip((_a = objectPagination.skip) !== null && _a !== void 0 ? _a : 0);
    console.log(tasks);
    res.json(tasks);
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const task = yield task_model_1.default.findById(id);
    res.json(task);
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { status } = req.body;
        yield task_model_1.default.updateOne({ _id: id }, { status: status });
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            message: "Không tồn tại"
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids, key, value } = req.body;
        console.log(ids, key, value);
        let Keys;
        (function (Keys) {
            Keys["STATUS"] = "status";
            Keys["DELETE"] = "delete";
        })(Keys || (Keys = {}));
        switch (key) {
            case Keys.STATUS:
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { status: value });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                });
                break;
            case Keys.DELETE:
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { deleted: true });
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
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            message: "Không tồn tại"
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = new task_model_1.default(req.body);
        const data = yield record.save();
        res.json({
            code: 200,
            message: "Tạo thành công",
            data: data
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            message: "Lỗi!!!"
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, req.body);
        res.json({
            code: 200,
            message: "Cập nhật thành công!"
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            message: "Lỗi!!!"
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        });
        res.json({
            code: 200,
            message: "Xóa thành công"
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            message: "Lỗi!!!"
        });
    }
});
exports.deleteTask = deleteTask;
