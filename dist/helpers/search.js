"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHelper = void 0;
const searchHelper = (query) => {
    const objSearch = {
        keyword: "",
        regex: ""
    };
    if (query.keyword) {
        objSearch.keyword = String(query.keyword);
        objSearch.regex = new RegExp(objSearch.keyword, "i");
    }
    return objSearch;
};
exports.searchHelper = searchHelper;
