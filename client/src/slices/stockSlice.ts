import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Stock, MarkCount, ModelCount } from "../types";

interface StockState {
  data: Stock[];
  marks: MarkCount[];
  models: ModelCount[];
  selectedMark: string;
  selectedModels: string[];
  page: number;
  status: "idle" | "loading" | "failed";
}

const initialState: StockState = {
  data: [],
  marks: [],
  models: [],
  selectedMark: "",
  selectedModels: [],
  page: 1,
  status: "idle",
};

export const fetchMarks = createAsyncThunk("stock/fetchMarks", async () => {
  const response = await fetch("http://localhost:5000/api/marks");
  return (await response.json()) as MarkCount[];
});

export const fetchModels = createAsyncThunk(
  "stock/fetchModels",
  async (mark: string) => {
    const response = await fetch(
      `http://localhost:5000/api/models?mark=${mark}`
    );
    return (await response.json()) as ModelCount[];
  }
);

export const fetchData = createAsyncThunk(
  "stock/fetchData",
  async ({ mark, models }: { mark: string; models: string[] }) => {
    const response = await fetch(
      `http://localhost:5000/api/stock?mark=${mark}&models=${models.join(",")}`
    );
    return (await response.json()) as Stock[];
  }
);

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setSelectedMark(state, action: PayloadAction<string>) {
      state.selectedMark = action.payload;
      state.selectedModels = [];
      state.page = 1;
    },
    setSelectedModels(state, action: PayloadAction<string[]>) {
      state.selectedModels = action.payload;
      state.page = 1;
    },
    removeModel(state, action: PayloadAction<string>) {
      state.selectedModels = state.selectedModels.filter(
        (model) => model !== action.payload
      );
      state.page = 1;
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
      .addCase(fetchMarks.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchModels.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.status = "idle";
        state.models = action.payload;
      })
      .addCase(fetchModels.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setSelectedMark, setSelectedModels, removeModel, setPage } =
  stockSlice.actions;

export default stockSlice.reducer;
