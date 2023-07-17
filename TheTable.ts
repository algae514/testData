import React, { useState } from 'react';
import { useTableContext } from '../../state/TableContext';
import ACLScrollTable from '../AclScrollTable/AclScrollTable';

const NotificationTable: React.FC = () => {
  const { tableItems, isFetching, error, fetchTableData, filterTable, resetFilter } =
    useTableContext();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value) {
      filterTable(value);
    } else {
      resetFilter();
    }
  };

  return (
    <div>
      <input type="text" value={searchValue} onChange={(e) => handleSearch(e.target.value)} />
      {isFetching ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ACLScrollTable items={tableItems} />
      )}
    </div>
  );
};

export default NotificationTable;
