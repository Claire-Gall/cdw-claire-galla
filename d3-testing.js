// Sample interaction data
const interactionData = [
  { timestamp: "2025-07-15T10:05:00Z", user: "guest_1" },
  { timestamp: "2025-07-15T10:10:00Z", user: "guest_2" },
  { timestamp: "2025-07-15T10:15:30Z", user: "guest_3" },
  { timestamp: "2025-07-15T10:20:00Z", user: "guest_1" },
];

// Parse timestamps into Date objects
interactionData.forEach(d => {
  d.time = new Date(d.timestamp);
});

// Define container and dimensions
const container = d3.select("#d3-container-1");

// Remove any existing SVGs (for hot reloads or re-renders)
container.selectAll("svg").remove();

// Responsive full-width dimensions
const fullWidth = container.node().clientWidth;
const fullHeight = 250;
const margin = { top: 20, right: 40, bottom: 40, left: 40 };
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;

// Create SVG
const svg = container.append("svg")
  .attr("width", fullWidth)
  .attr("height", fullHeight)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Define xScale for time
const xScale = d3.scaleTime()
  .domain(d3.extent(interactionData, d => d.time))
  .range([0, width]);

// Draw timeline base line
svg.append("line")
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", height / 2)
  .attr("y2", height / 2)
  .attr("stroke", "#ccc")
  .attr("stroke-width", 2);

// Draw interaction circles
const nodes = svg.selectAll("circle")
  .data(interactionData)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.time))
  .attr("cy", height / 2)
  .attr("r", 6)
  .attr("fill", "#4682B4");

// Add simple tooltip (title)
nodes.append("title")
  .text(d => `${d.user} @ ${d.time.toLocaleTimeString()}`);

// Draw x-axis below the line
const xAxis = d3.axisBottom(xScale)
  .ticks(d3.timeMinute.every(5))
  .tickFormat(d3.timeFormat("%H:%M"));

svg.append("g")
  .attr("transform", `translate(0, ${height / 2 + 30})`)
  .call(xAxis);