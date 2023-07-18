import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../path/to/store';
import { Notification, NotificationTableState } from './types';

const ITEMS_PER_PAGE = 10; // Number of items to display per page

const initialState: NotificationTableState = {
  tableItems: [],
  originalTableItems: [],
  isFetching: false,
  error: null,
  currentPage: 1,
  searchQuery: '',
  toBeFitFilter: [],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTableItems: (state, action: PayloadAction<Notification[]>) => {
      state.tableItems = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setToBeFitFilter: (state, action: PayloadAction<string[]>) => {
      state.toBeFitFilter = action.payload;
    },
  },
});

export const { setCurrentPage, setTableItems, setSearchQuery, setToBeFitFilter } = tableSlice.actions;

export const updateTableItems = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState().table;
  const { originalTableItems, currentPage, searchQuery, toBeFitFilter } = state;

  let filteredItems = originalTableItems;
  if (searchQuery) {
    filteredItems = filteredItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (toBeFitFilter.length > 0) {
    filteredItems = filteredItems.filter(item => toBeFitFilter.includes(item.toBeFit));
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const updatedItems = filteredItems.slice(startIndex, endIndex);

  dispatch(setTableItems(updatedItems));
};

export const selectTableItems = (state: RootState) => state.table.tableItems;
export const selectIsFetching = (state: RootState) => state.table.isFetching;
export const selectError = (state: RootState) => state.table.error;
export const selectCurrentPage = (state: RootState) => state.table.currentPage;
export const selectSearchQuery = (state: RootState) => state.table.searchQuery;
export const selectToBeFitFilter = (state: RootState) => state.table.toBeFitFilter;

export default tableSlice.reducer;
