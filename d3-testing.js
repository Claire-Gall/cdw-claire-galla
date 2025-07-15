// d3-testing.js

const interactionData = [
  { timestamp: "2025-07-15T10:05:00Z", user: "guest_1" },
  { timestamp: "2025-07-15T10:10:00Z", user: "guest_2" },
  { timestamp: "2025-07-15T10:15:30Z", user: "guest_3" },
  { timestamp: "2025-07-15T10:20:00Z", user: "guest_1" },
];

// Parse timestamps into JavaScript Date objects
interactionData.forEach(d => {
  d.time = new Date(d.timestamp);
});

// Select the container and define dimensions
const container = d3.select("#d3-container-1");
const width = container.node().clientWidth;
const height = 250;
const margin = { top: 20, right: 30, bottom: 40, left: 40 };

// Create SVG with responsive settings
const svg = container.append("svg")
  .attr("width", "100%")
  .attr("height", height)
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet");

// Define xScale for time
const xScale = d3.scaleTime()
  .domain(d3.extent(interactionData, d => d.time))
  .range([margin.left, width - margin.right]);

// Draw timeline line
svg.append("line")
  .attr("x1", xScale.range()[0])
  .attr("x2", xScale.range()[1])
  .attr("y1", height / 2)
  .attr("y2", height / 2)
  .attr("stroke", "#999")
  .attr("stroke-width", 2);

// Draw interaction nodes
const circles = svg.selectAll("circle")
  .data(interactionData)
  .enter()
  .append("circle")
  .attr("class", "node")
  .attr("cx", d => xScale(d.time))
  .attr("cy", height / 2)
  .attr("r", 6);

// Add tooltips
circles.append("title")
  .text(d => `${d.user} @ ${d.time.toLocaleTimeString()}`);

// Draw x-axis
const xAxis = d3.axisBottom(xScale)
  .ticks(d3.timeMinute.every(5))
  .tickFormat(d3.timeFormat("%H:%M"));

svg.append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0, ${height / 2 + 30})`)
  .call(xAxis);