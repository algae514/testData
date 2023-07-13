import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface TableState {
  tableItems: string[];
  originalTableItems: string[];
  isFetching: boolean;
  error: string | null;
}

const initialState: TableState = {
  tableItems: [],
  originalTableItems: [],
  isFetching: false,
  error: null,
};

export const fetchTableData = createAsyncThunk('table/fetchTableData', async () => {
  try {
    const response = await axios.get('YOUR_API_ENDPOINT');
    return response.data.items;
  } catch (error) {
    throw new Error('Error fetching table items');
  }
});

export const filterTableItems = createAsyncThunk(
  'table/filterTableItems',
  (value: string, { getState, dispatch }) => {
    const { originalTableItems } = getState().table as TableState;

    const filteredItems = originalTableItems.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    dispatch(setTableItems(filteredItems));

    return filteredItems;
  }
);

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setTableItems: (state, action: PayloadAction<string[]>) => {
      state.tableItems = action.payload;
    },
    resetFilter: (state) => {
      state.tableItems = [...state.originalTableItems];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchTableData.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.tableItems = action.payload;
        state.originalTableItems = action.payload;
        state.isFetching = false;
      })
      .addCase(fetchTableData.rejected, (state) => {
        state.isFetching = false;
        state.error = 'Error fetching table items';
      });
  },
});

export const { setTableItems, resetFilter } = tableSlice.actions;

export default tableSlice.reducer;
