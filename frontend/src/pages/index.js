import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.min.css";
import Chart from "../components/chart/index.js";
import VisitsTable from "../components/VisitsTable/index.js";

// styles
const pageStyles = {
  color: "#232129",
  display: "flex",
  flexDirection: "column",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 1000,
};

const IndexPage = () => {
  const [ip, setIp] = useState("");
  const [visits, setVisits] = useState([]);
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const deviceInfo = window.navigator.userAgent;

  const columns = useMemo(() => [
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
  ]);

  const fetchFilteredRes = async (date) => {
    const formattedDate = format(date, "MM-dd-yyyy");
    setLoading(true);

    const res = await axios.get(
      `http://127.0.0.1:5000/api/visits/show?date=${formattedDate}`
    );

    setVisits(res.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    axios.get("https://api.db-ip.com/v2/free/self").then((response) => {
      setIp(response.data.ipAddress);

      axios.post("http://127.0.0.1:5000/api/visit", {
        ip_address: response.data.ipAddress,
        last_access: format(startDate, "MM-dd-yyyy"),
      });
    });

    axios.get("http://127.0.0.1:5000/api/visits/show").then((res) => {
      setLoading(true);
      setVisits(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <main style={pageStyles}>
      <title>Visits Tracker</title>
      <div>
        <h1 style={headingStyles}>{`Today is : ${format(
          startDate,
          "EEEE,MMMM do, yyyy hh:mm a"
        )}`}</h1>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div>
          <p>Pick a date to filter the table: </p>
        </div>
        <div style={{ padding: "10px" }}>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              fetchFilteredRes(date);
            }}
          />
        </div>
      </div>

      <div>
        <p>
          Your ip address: <b>{ip}</b>
        </p>
      </div>
      <div>You are using : {deviceInfo}</div>
      <div>
        <VisitsTable visits={visits} loading={loading} />
      </div>

      <Chart />
    </main>
  );
};

export default IndexPage;
