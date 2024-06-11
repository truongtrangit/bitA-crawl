import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  TextField,
  CircularProgress,
  Container,
  Typography,
  Box,
} from "@mui/material";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setSearchKeyword] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    console.log("Fetching products...");
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL, {
          params: {
            page,
            limit: rowsPerPage,
            query: keyword,
          },
          headers: {
            Authorization: API_KEY,
          },
        });
        setProducts(response?.data?.data);
        setTotalProducts(response?.data?.paging?.total);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, page, rowsPerPage]);

  const handleSearch = (event) => {
    setSearchKeyword(event.target.value);
    setPage(0);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Container>
      <Typography className="text-center" variant="h4" component="h1">
        Product List
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={keyword}
        onChange={handleSearch}
      />
      {loading ? (
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="75vh"
      >
        <CircularProgress />
      </Box>
      ) : (
        <Grid container spacing={4} style={{ marginTop: 5 }}>
          {products?.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </Grid>
      )}
      <Pagination
        productsPerPage={rowsPerPage}
        totalProducts={totalProducts}
        onPageChange={handlePageChange}
        page={page}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default ProductList;
