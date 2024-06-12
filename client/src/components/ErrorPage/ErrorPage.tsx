import React from "react";
import { Box, Typography } from "@mui/material";

interface ErrorProps {
  message: string;
}

export const ErrorPage: React.FC<ErrorProps> = ({ message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h6" color="error">
        {message}
      </Typography>
    </Box>
  );
};
