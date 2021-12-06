import React from "react";
import DataTable from "react-data-table-component";

const paginationPerPage = 5;
const paginationRowsPerPageOptions = [5, 15, 25, 50];

const columns = [
  {
    id: 1,
    name: "visit_id",
    selector: (row) => row.visit_id,
    sortable: true,
    reorder: true,
  },
  {
    id: 2,
    name: "ip_address",
    selector: (row) => row.ip_address,
    sortable: true,
    reorder: true,
  },
  {
    id: 3,
    name: "last_access",
    selector: (row) => row.last_access,
    sortable: true,
    right: true,
    reorder: true,
  },
];

const VisitsTable = ({ visits, loading }) => (
  <div>
    <DataTable
      title="Visits"
      columns={columns}
      data={visits}
      progressPending={loading}
      pagination
      paginationPerPage={paginationPerPage}
      paginationRowsPerPageOptions={paginationRowsPerPageOptions}
    />
  </div>
);

export default VisitsTable;
