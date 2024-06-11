import React, { useState, useEffect } from "react";
import { Box, SelectChangeEvent } from "@mui/material";
import { MarkPanel } from "../src/components/MarkPanel/MarkPanel";
import { ModelSelect } from "../src/components/ModelSelect/ModelSelect";
import { StockTable } from "./components/StockTable/StockTable";
import { Stock, MarkCount, ModelCount } from "./types";

const App: React.FC = () => {
  const [data, setData] = useState<Stock[]>([]);
  const [marks, setMarks] = useState<MarkCount[]>([]);
  const [models, setModels] = useState<ModelCount[]>([]);
  const [selectedMark, setSelectedMark] = useState<string>("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(20);

  useEffect(() => {
    fetchMarks();
  }, []);

  useEffect(() => {
    if (selectedMark) {
      fetchModels(selectedMark);
      fetchData(selectedMark, selectedModels);
    }
  }, [selectedMark, selectedModels]);

  const fetchMarks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/marks");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData: MarkCount[] = await response.json();
      setMarks(jsonData);
      if (jsonData.length > 0) {
        setSelectedMark(jsonData[0].mark);
      }
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const fetchModels = async (mark: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/models?mark=${mark}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData: ModelCount[] = await response.json();
      setModels(jsonData);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const fetchData = async (mark: string, models: string[]) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/stock?mark=${mark}&models=${models.join(
          ","
        )}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData: Stock[] = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMarkClick = (mark: string) => {
    setSelectedMark(mark);
    setSelectedModels([]);
  };

  const handleModelChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedModels(event.target.value as string[]);
    //setSelectedModels(value);
  };

  const handleDeleteModel = (model: string) => {
    setSelectedModels((prevSelectedModels) =>
      prevSelectedModels.filter((m) => m !== model)
    );
  };

  const filteredData = data.filter(
    (item) => selectedModels.length === 0 || selectedModels.includes(item.model)
  );

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  return (
    <div>
      <MarkPanel
        marks={marks}
        selectedMark={selectedMark}
        onMarkClick={handleMarkClick}
      />
      <ModelSelect
        models={models}
        selectedModels={selectedModels}
        onModelChange={handleModelChange}
        onDeleteModel={handleDeleteModel}
      />
      <StockTable
        data={filteredData}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
      />
    </div>
  );
};
export default App;
