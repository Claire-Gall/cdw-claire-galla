const width = 400, height = 400, radius = Math.min(width, height) / 2;

const svg = d3.select("#d3-container-0")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

const arc = d3.arc()
  .innerRadius(radius * 0.5)
  .outerRadius(radius * 0.9);

const pie = d3.pie()
  .value(d => d.value)
  .sort(null);

d3.csv("Sand_and_Gravel_Deposits.csv").then(data => {
  data.forEach(d => d.value = +d.value); // Ensure 'value' is numeric

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range(d3.schemeCategory10);

  const arcs = svg.selectAll("path")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.label))
    .attr("stroke", "#fff")
    .attr("stroke-width", "2px")
    .append("title") // Simple tooltip
    .text(d => `${d.data.label}: ${d.data.value}`);
}).catch(error => {
  console.error("Error loading or parsing CSV:", error);
});