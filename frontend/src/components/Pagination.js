import React from "react";
import TablePagination from "@mui/material/TablePagination";

const Pagination = ({
  productsPerPage,
  totalProducts,
  onPageChange,
  page,
  handleChangeRowsPerPage,
}) => {
  return (
    <TablePagination
      size="large"
      component="div"
      count={totalProducts}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={productsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[10, 20, 30]}
    />
  );
};

export default Pagination;
