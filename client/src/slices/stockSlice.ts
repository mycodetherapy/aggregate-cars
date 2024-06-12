import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Stock, MarkCount, ModelCount } from "../types";
import { fetchMarks, fetchModels, fetchData } from "../api/api";

interface StockState {
  data: Stock[];
  marks: MarkCount[];
  models: ModelCount[];
  selectedMark: string;
  selectedModels: string[];
  page: number;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: StockState = {
  data: [],
  marks: [],
  models: [],
  selectedMark: "",
  selectedModels: [],
  page: 1,
  status: "idle",
  error: null,
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setSelectedMark(state, action: PayloadAction<string>) {
      state.selectedMark = action.payload;
      state.selectedModels = [];
      state.page = 1;
      state.status = "loading";
      state.error = null;
    },
    setSelectedModels(state, action: PayloadAction<string[]>) {
      state.selectedModels = action.payload;
      state.page = 1;
      state.status = "loading";
      state.error = null;
    },
    removeModel(state, action: PayloadAction<string>) {
      state.selectedModels = state.selectedModels.filter(
        (model) => model !== action.payload
      );
      state.page = 1;
      state.status = "loading";
      state.error = null;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMarks.fulfilled, (state, action) => {
        state.status = "idle";
        state.marks = action.payload;
        if (action.payload.length > 0) {
          state.selectedMark = action.payload[0].mark;
        }
      })
      .addCase(fetchMarks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchModels.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.status = "idle";
        state.models = action.payload;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedMark, setSelectedModels, removeModel, setPage } =
  stockSlice.actions;

export default stockSlice.reducer;
