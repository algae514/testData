import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../path/to/store';
import { updateCurrentPage, updateTableItems, setSearchQuery, setToBeFitFilter } from '../path/to/tableSlice';
import { TableContextData } from './types';

export const TableContext = React.createContext<TableContextData | undefined>(undefined);

export const TableProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();

  const tableItems = useSelector(selectTableItems);
  const isFetching = useSelector(selectIsFetching);
  const error = useSelector(selectError);
  const currentPage = useSelector(selectCurrentPage);
  const searchQuery = useSelector(selectSearchQuery);
  const toBeFitFilter = useSelector(selectToBeFitFilter);

  useEffect(() => {
    dispatch(updateTableItems());
  }, [currentPage, dispatch, searchQuery, toBeFitFilter]);

  const fetchTableData = () => {
    // Fetch data logic
  };

  const filterTable = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const resetFilter = () => {
    dispatch(setSearchQuery(''));
    dispatch(setToBeFitFilter([]));
  };

  const updateCurrentPage = (newPage: number) => {
    dispatch(updateCurrentPage(newPage));
  };

  const updateToBeFitFilter = (filter: string[]) => {
    dispatch(setToBeFitFilter(filter));
  };

  const contextValue: TableContextData = {
    tableItems,
    isFetching,
    error,
    currentPage,
    searchQuery,
    toBeFitFilter,
    fetchTableData,
    filterTable,
    resetFilter,
    updateCurrentPage,
    updateToBeFitFilter,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};
