import { createAsyncThunk } from "@reduxjs/toolkit";
import { MarkCount, ModelCount, Stock } from "../types";
import { HOST_NAME } from "../constants";

export const fetchMarks = createAsyncThunk(
  "stock/fetchMarks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${HOST_NAME}/api/marks`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error);
      }
      return (await response.json()) as MarkCount[];
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);

export const fetchModels = createAsyncThunk(
  "stock/fetchModels",
  async (mark: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${HOST_NAME}/api/models?mark=${mark}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error);
      }
      return (await response.json()) as ModelCount[];
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);

export const fetchData = createAsyncThunk(
  "stock/fetchData",
  async (
    { mark, models }: { mark: string; models: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${HOST_NAME}/api/stock?mark=${mark}&models=${models.join(",")}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error);
      }
      return (await response.json()) as Stock[];
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);
