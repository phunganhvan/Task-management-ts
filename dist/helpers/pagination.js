"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelper = (objectPagination, query, countRecords) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page, 10);
    }
    if (query.limit) {
        objectPagination.limitItems = parseInt(query.limit, 10);
    }
    objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limitItems;
    objectPagination.totalPage = Math.ceil(countRecords / objectPagination.limitItems);
    console.log(objectPagination.totalPage);
    if (objectPagination.currentPage > objectPagination.totalPage) {
        objectPagination.currentPage = 1;
    }
    return objectPagination;
};
exports.default = paginationHelper;
