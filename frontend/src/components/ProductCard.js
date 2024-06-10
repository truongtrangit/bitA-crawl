import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  Rating,
  Divider,
  Tooltip,
} from "@mui/material";

const ProductCard = ({ product }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card variant="outlined">
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          title={product.name}
        />
        <Box display="flex" justifyContent="center" mt={1} ml={1} mr={1}>
          <Grid container spacing={1}>
            {product.thumbnails.map((thumbnail, index) => (
              <Grid item key={index}>
                <CardMedia
                  component="img"
                  height="40"
                  image={thumbnail}
                  title={product.name}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <CardContent>
          <Tooltip
            title={
              <Typography sx={{ fontSize: 16 }}>{product.name}</Typography>
            }
            arrow
          >
            <Typography
              variant="body1"
              component="div"
              noWrap
              sx={{ fontSize: 18 }}
            >
              {product.name}
            </Typography>
          </Tooltip>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={1}
          >
            <Typography variant="body2" color="text.primary" fontWeight="bold">
              {product.price.toLocaleString()} VND
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              {product.originalPrice.toLocaleString()} VND
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={1}
          >
            <Typography variant="body2" color="text.secondary">
              Giảm giá: {product.discountPercentage}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.sold}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Rating value={product.stars} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              {product.address}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductCard;
