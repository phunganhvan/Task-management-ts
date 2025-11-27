export interface SearchQuery {
  keyword: string;
  regex: RegExp | "";
}

export const searchHelper = (query: Record<string, any>): SearchQuery => {
  const objSearch: SearchQuery = {
    keyword: "",
    regex: ""
  };

  if (query.keyword) {
    objSearch.keyword = String(query.keyword);
    objSearch.regex = new RegExp(objSearch.keyword, "i");
  }

  return objSearch;
};
