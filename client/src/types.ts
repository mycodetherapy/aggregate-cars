import { AutocompleteGetTagProps } from "@mui/material";
export interface Stock {
  _id: string;
  mark: string;
  model: string;
  engine: {
    power: number;
    volume: number;
    transmission: string;
    fuel: string;
  };
  drive: string;
  equipmentName: string;
  price: number;
  createdAt: string;
}

export interface ModelCount {
  model: string;
  count: number;
}

export interface MarkCount {
  mark: string;
  count: number;
}

export interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}
