import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import {
  fetchMarks,
  fetchModels,
  fetchData,
  setPage,
} from "./slices/stockSlice";
import { MarkPanel } from "./components/MarkPanel/MarkPanel";
import { ModelSelect } from "./components/ModelSelect/ModelSelect";
import { StockTable } from "./components/StockTable/StockTable";
import Box from "@mui/material/Box";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMark, selectedModels, page } = useSelector(
    (state: RootState) => state.stock
  );
  const rowsPerPage = 20;

  useEffect(() => {
    dispatch(fetchMarks());
  }, [dispatch]);

  useEffect(() => {
    if (selectedMark) {
      dispatch(fetchModels(selectedMark));
      dispatch(fetchData({ mark: selectedMark, models: selectedModels }));
    }
  }, [selectedMark, selectedModels, dispatch]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    dispatch(setPage(newPage));
  };

  return (
    <Box sx={{ padding: "6px" }}>
      <MarkPanel />
      <ModelSelect />
      <StockTable
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
      />
    </Box>
  );
};

export default App;
