import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import { setPage } from "./slices/stockSlice";
import { MarkPanel } from "./components/MarkPanel/MarkPanel";
import { ModelSelect } from "./components/ModelSelect/ModelSelect";
import { StockTable } from "./components/StockTable/StockTable";
import Box from "@mui/material/Box";
import { Loading } from "./components/Loading/Loading";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import { fetchData, fetchMarks, fetchModels } from "./api/api";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMark, selectedModels, page, status, error } = useSelector(
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
    window.scrollTo(0, 0);
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <ErrorPage message={error || "Ошибка загрузки данных"} />;
  }

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
