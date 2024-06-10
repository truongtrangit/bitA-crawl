import React from "react";
import "./App.css";
import ProductList from "./components/ProductList";
import { Container } from "@mui/material";

function App() {
  return (
    <Container style={{ marginTop: 20 }}>
      <ProductList />
    </Container>
  );
}

export default App;
