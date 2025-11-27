interface PaginationObject {
  currentPage: number;
  limitItems: number;
  skip?: number;
  totalPage?: number;
  [key: string]: any; // Allows additional dynamic properties if needed
}

interface Query {
  page?: string | number;
  limit?: string | number;
  [key: string]: any;
}

const paginationHelper = (
  objectPagination: PaginationObject,
  query: Query,
  countRecords: number
) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page as string, 10);
  }
  if (query.limit) {
    objectPagination.limitItems = parseInt(query.limit as string, 10);
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;
  objectPagination.totalPage = Math.ceil(
    countRecords / objectPagination.limitItems
  );
  console.log(objectPagination.totalPage);
  if (objectPagination.currentPage > objectPagination.totalPage) {
    objectPagination.currentPage = 1;
    // url.searchParams.set("page", 1);
  }
  return objectPagination;
};

export default paginationHelper;