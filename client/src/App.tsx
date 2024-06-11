import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import { fetchMarks, fetchModels, fetchData } from "./slices/stockSlice";
import { MarkPanel } from "./components/MarkPanel/MarkPanel";
import { ModelSelect } from "./components/ModelSelect/ModelSelect";
import { StockTable } from "./components/StockTable/StockTable";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMark, selectedModels } = useSelector(
    (state: RootState) => state.stock
  );
  const [page, setPage] = useState(1);
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
    setPage(newPage);
  };

  return (
    <div>
      <MarkPanel />
      <ModelSelect />
      <StockTable
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
      />
    </div>
  );
};

export default App;
