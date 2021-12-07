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
  padding: 90,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const filtersStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

const infoStyles = {
  display: "flex",
  flexDirection: "column",
};

const datePickerStyles = {
  display: "flex",
  flexDirection: "row",
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

  const fetchFilteredRes = async (date) => {
    const formattedDate = format(date, "MM-dd-yyyy");
    setLoading(true);
    const res = await axios.get(`${apiURL}/visits/show?date=${formattedDate}`);
    setVisits(res.data);
    setLoading(false);
  };

  const fetchInitialVisits = () => {
    axios.get(`${apiURL}/visits/show`).then((res) => {
      setLoading(true);
      setVisits(res.data);
      setLoading(false);
    });
  };

  //FIXME Turn some useEffect in custom hooks
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
    fetchInitialVisits();
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
      <div classNames="filters" style={filtersStyle}>
        <div classNames="info" style={infoStyles}>
          <h2>{`Today is ${format(
            startDate,
            "EEEE,MMMM do, yyyy hh:mm a"
          )}`}</h2>
          <div style={datePickerStyles}>
            <p>Pick a date: </p>
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
            <div>
              Connected from <b>{currentCountry}</b>
              <p>
                Your ip address: <b>{ip}</b>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              fetchInitialVisits();
            }}
          >
            reset filters
          </button>
        </div>
        <div>
          <MapChart setMapCountry={setMapCountry} setContent={setContent} />
          <ReactTooltip>{content}</ReactTooltip>
        </div>
      </div>
      <div>
        <VisitsTable visits={visits} loading={loading} />
      </div>
    </main>
  );
};

export default IndexPage;
