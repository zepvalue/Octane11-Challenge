import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import { format, compareAsc } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.min.css";
import { StaticQuery } from "gatsby";

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};

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

const IndexPage = () => {
  const [ip, setIp] = useState("");
  const [visits, setVisits] = useState({});
  const today = new Date();
  const [startDate, setStartDate] = useState(today);

  const fetchFilteredRes = (date) => {
    const formattedDate = format(date, "MM-dd-yyyy");
    console.log(
      "🚀 ~ file: index.js ~ line 55 ~ fetchFilteredRes ~ formattedDate",
      formattedDate
    );

    axios
      .get(`http://127.0.0.1:5000/api/visits/show?date=${formattedDate}`)
      .then((res) => {
        console.log("CALLED FROM THE CALENDAR ", res);
        setVisits(res.data);
      });
  };

  useEffect(() => {
    axios.get("https://api.db-ip.com/v2/free/self").then((response) => {
      setIp(response.data.ipAddress);

      axios.post("http://127.0.0.1:5000/api/visit", {
        ip_address: response.data.ipAddress,
        last_access: format(startDate, "MM-dd-yyyy"),
      });
    });

    axios.get("http://127.0.0.1:5000/api/visits/show").then((res) => {
      setVisits(res.data);
    });
  }, []);

  return (
    <main style={pageStyles}>
      <title>Home Page</title>
      <span>
        <h1 style={headingStyles}>{`Today is : ${format(
          startDate,
          "EEEE,MMMM do, yyyy hh:mm a"
        )}`}</h1>
      </span>

      <div>
        <p>Pick a date to filter the table</p>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            fetchFilteredRes(date);
          }}
        />
      </div>

      <div> {`Your ip address: ${ip}`}</div>
      <div>
        <DataTable title="Visits" columns={columns} data={visits} />
      </div>
    </main>
  );
};

export default IndexPage;
