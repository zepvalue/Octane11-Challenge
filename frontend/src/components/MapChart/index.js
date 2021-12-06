import React, { memo, useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";
import worldMap from "./WorldMap.json";

const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range(["#ffedea", "#ff5233"]);

const MapChart = ({ setMapCountry }) => {
  const [data, setData] = useState([]);
  const [country, setCountry] = useState("");

  useEffect(() => {
    csv(`/data.csv`).then((data) => {
      setData(data);
    });
  }, []);

  return (
    <div>
      <h1>{country}</h1>
      <ComposableMap
        data-tip=""
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 120,
        }}
      >
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        {data.length > 0 && (
          <Geographies geography={worldMap}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = data.find((s) => s.ISO3 === geo.properties.ISO_A3);
                const { NAME } = geo.properties;

                return (
                  <Geography
                    onMouseEnter={() => {
                      setCountry(NAME);
                    }}
                    onMouseDown={() => {
                      setMapCountry(NAME.toLowerCase());
                    }}
                    style={{
                      hover: {
                        fill: "#F53",
                        outline: "none",
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "none",
                      },
                    }}
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? colorScale(d["visits"]) : "#F5F4F6"}
                  />
                );
              })
            }
          </Geographies>
        )}
      </ComposableMap>
    </div>
  );
};

export default memo(MapChart);
