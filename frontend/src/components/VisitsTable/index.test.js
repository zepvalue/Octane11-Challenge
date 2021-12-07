import React from "react";
import { render, fireEvent } from "@testing-library/react";
import data from "../../../../data/VisitsMock.json";
import VisitsTable from "../VisitsTable/index";

/* props of the component in different states */

const loading = false;
const visits = data;

it("should display a table with a list of visits", () => {
  const component = <VisitsTable loading={false} visits={visits} />;
  const { container } = render(component);
  const mapCountry = container.querySelector("country-map");
  console.log(
    "🚀 ~ file: index.test.js ~ line 15 ~ it ~ mapCountry",
    mapCountry
  );
});
