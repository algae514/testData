import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../path/to/store';
import { fetchTableData, filterTableItems, resetFilter } from '../path/to/tableSlice';

interface TableContextData {
  tableItems: string[];
  isFetching: boolean;
  error: string | null;
  fetchTableData: () => void;
  filterTable: (value: string) => void;
  resetFilter: () => void;
}

const TableContext = createContext<TableContextData | undefined>(undefined);

export const useTableContext = (): TableContextData => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};

export const TableProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tableItems, isFetching, error } = useSelector((state: RootState) => state.table);

  const fetchTableDataAction = () => {
    dispatch(fetchTableData());
  };

  const filterTableAction = (value: string) => {
    dispatch(filterTableItems(value));
  };

  const resetFilterAction = () => {
    dispatch(resetFilter());
  };

  useEffect(() => {
    fetchTableDataAction();
  }, []);

  const contextValue: TableContextData = {
    tableItems,
    isFetching,
    error,
    fetchTableData: fetchTableDataAction,
    filterTable: filterTableAction,
    resetFilter: resetFilterAction,
  };

  return <TableContext.Provider value={contextValue}>{children}</TableContext.Provider>;
};
