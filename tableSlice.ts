import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

interface Notification {
  id: number;
  title: string;
  message: string;
}

interface NotificationTableState {
  tableItems: Notification[];
  originalTableItems: Notification[];
  isFetching: boolean;
  error: string | null;
}

interface NotificationTableServiceDataAPIResp {
  items: Notification[];
}

export const fetchTableData = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>('table/fetchTableData', async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<NotificationTableServiceDataAPIResp> = await axios.get(
      'YOUR_API_ENDPOINT'
    );
    return response.data.items;
  } catch (error) {
    return rejectWithValue('Error fetching table items');
  }
});

export const filterTableItems = createAsyncThunk<
  Notification[],
  string,
  { getState: () => { table: NotificationTableState } }
>('table/filterTableItems', (value, { getState, dispatch }) => {
  const { originalTableItems } = getState().table;

  const filteredItems = originalTableItems.filter((item) =>
    item.title.toLowerCase().includes(value.toLowerCase())
  );

  dispatch(setTableItems(filteredItems));

  return filteredItems;
});

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    tableItems: [],
    originalTableItems: [],
    isFetching: false,
    error: null,
  } as NotificationTableState,
  reducers: {
    setTableItems: (state, action: PayloadAction<Notification[]>) => {
      state.tableItems = action.payload;
    },
    resetFilter: (state) => {
      state.tableItems = state.originalTableItems;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        state.tableItems = action.payload;
        state.originalTableItems = action.payload;
        state.isFetching = false;
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTableItems, resetFilter } = tableSlice.actions;

export default tableSlice.reducer;
