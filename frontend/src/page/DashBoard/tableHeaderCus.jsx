import React from "react";

const TableHeaderCus = ({ thContent }) => {
  return (
    <thead>
      <tr>
        {thContent.map((head) => (
          <th key={head.field}>{head.name}</th>
        ))}
      </tr>
    </thead>
  );
};
export default TableHeaderCus;
