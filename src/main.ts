import "./style.css";
import * as d3 from "d3";

import { scatterplot } from "./scatterplot";
import { Int32, Table, Utf8 } from "apache-arrow";
import { db } from "./duckdb";
// import parquet from "./weather.parquet?url";
import { ConsoleLogger } from "@duckdb/duckdb-wasm";

const app = document.querySelector("#app")!;

// Create the chart. The specific code here makes some assumptions that may not hold for you.
const scatter = scatterplot();
scatter.getdata()






// const locations: Table<{ location: Utf8 }> = await conn.query(`
// SELECT DISTINCT location
// FROM weather.parquet`);

// // Create a select element for the locations.
// const select = d3.select(app).append("select");
// for (const location of locations) {
//   select.append("option").text(location.location);
// }

// select.on("change", () => {
//   const location = select.property("value");
//   update(location);
// });

// Update the chart with the first location.


// Add the chart to the DOM.
app.appendChild(scatter.element);


