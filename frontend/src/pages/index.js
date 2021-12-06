import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.min.css";
import MapChart from "../components/MapChart";
import VisitsTable from "../components/VisitsTable";

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
  const [country, setCountry] = useState("");

  const deviceInfo = window.navigator.userAgent;

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
      setCountry(response.data.countryName);

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
  }, [startDate]);

  return (
    <main style={pageStyles}>
      <title>Visits Tracker</title>
      <div>
        Connected from {country}
        <MapChart />
      </div>
      <div>
        <h1 style={headingStyles}>{`Today is ${format(
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
    </main>
  );
};

export default IndexPage;
