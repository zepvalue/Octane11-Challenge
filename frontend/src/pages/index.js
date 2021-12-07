import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.min.css";
import MapChart from "../components/MapChart";
import VisitsTable from "../components/VisitsTable";
import ReactTooltip from "react-tooltip";

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
  const [content, setContent] = useState("");

  const [startDate, setStartDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [currentCountry, setCurrentCountry] = useState("");
  const [mapCountry, setMapCountry] = useState("None");
  const apiURL = process.env.GATSBY_API_URL;
  console.log("🚀 ~ file: index.js ~ line 34 ~ IndexPage ~ apiURL", apiURL);

  const fetchFilteredRes = async (date) => {
    const formattedDate = format(date, "MM-dd-yyyy");
    setLoading(true);

    const res = await axios.get(`${apiURL}/visits/show?date=${formattedDate}`);

    setVisits(res.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    axios.get("https://api.db-ip.com/v2/free/self").then((response) => {
      setIp(response.data.ipAddress);
      setCurrentCountry(response.data.countryName);

      axios.post(`${apiURL}/visit`, {
        ip_address: response.data.ipAddress,
        country: response.data.countryName.toLowerCase(),
        last_access: format(startDate, "MM-dd-yyyy"),
      });
    });
  }, []);

  useEffect(() => {
    axios.get(`${apiURL}/visits/show`).then((res) => {
      setLoading(true);
      setVisits(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${apiURL}/visits/show?country=${mapCountry}`)
      .then((res) => setVisits(res.data));

    setLoading(false);
  }, [mapCountry]);

  return (
    <main style={pageStyles}>
      <title>Visits Tracker</title>

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
          <p>Pick a date to filter the visits by date: </p>
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
        Connected from <b>{currentCountry}</b>
        <p>
          Your ip address: <b>{ip}</b>
        </p>
      </div>
      <div>
        <VisitsTable visits={visits} loading={loading} />
      </div>
      <div>
        <MapChart setMapCountry={setMapCountry} setContent={setContent} />
        <ReactTooltip>{content}</ReactTooltip>
      </div>
    </main>
  );
};

export default IndexPage;
