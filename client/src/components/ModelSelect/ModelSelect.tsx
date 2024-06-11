import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import { ModelCount } from "../../types";

interface ModelSelectProps {
  models: ModelCount[];
  selectedModels: string[];
  onModelChange: (event: SelectChangeEvent<string[]>) => void;
  onDeleteModel: (model: string) => void;
}

export const ModelSelect: React.FC<ModelSelectProps> = ({
  models,
  selectedModels,
  onModelChange,
  onDeleteModel,
}) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 300 }}>
      <InputLabel>Выберите модели</InputLabel>
      <Select
        sx={{
          "& .MuiSelect-select": {
            padding: "0px 6px",
            minHeight: 3,
          },
          "&.MuiInputBase-root": {
            minHeight: "40px",
          },
        }}
        multiple
        value={selectedModels}
        onChange={onModelChange}
        MenuProps={{
          PaperProps: {
            sx: {
              "&.MuiPaper-root": {
                top: "144px !important",
              },
              "&.MuiSelect-select": {
                padding: "0px !important",
              },
            },
          },
        }}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {(selected as string[]).map((value) => (
              <Chip
                key={value}
                label={value}
                onMouseDown={(event) => event.stopPropagation()}
                onDelete={() => onDeleteModel(value)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        )}
      >
        {models.map((modelCount) => (
          <MenuItem key={modelCount.model} value={modelCount.model}>
            {modelCount.model} ({modelCount.count})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
