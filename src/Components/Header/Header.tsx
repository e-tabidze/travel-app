import React from "react";
import { Box, ScopedCssBaseline } from "@mui/material";

const Header = () => {
  return (
    <ScopedCssBaseline>
      <Box
        sx={{
          backgroundColor: "#425F57",
          color: "#fff",
          height: "50px",
          display: "flex",
          alignItems: "center ",
          padding: "20px",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        <Box>Travel App</Box>
      </Box>
    </ScopedCssBaseline>
  );
};

export default Header;
