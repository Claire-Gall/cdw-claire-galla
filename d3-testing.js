window.onload = () => {
  console.log("d3-testing.js loaded");

  const interactionData = [
    { timestamp: "2025-07-15T10:05:00Z", user: "participant-1" },
    { timestamp: "2025-07-15T10:10:00Z", user: "participant-2" },
    { timestamp: "2025-07-15T10:15:30Z", user: "participant-3" },
    { timestamp: "2025-07-15T10:20:00Z", user: "participant-4" },
  ];

  interactionData.forEach(d => {
    d.time = new Date(d.timestamp);
  });

  const container = d3.select("#d3-container-1");
  if (container.empty()) {
    console.error("Timeline container not found.");
    return;
  }

  container.selectAll("svg").remove();

  const fullWidth = container.node().clientWidth;
  const fullHeight = 250;
  const margin = { top: 20, right: 40, bottom: 40, left: 40 };
  const width = fullWidth - margin.left - margin.right;
  const height = fullHeight - margin.top - margin.bottom;

  const svg = container.append("svg")
    .attr("width", fullWidth)
    .attr("height", fullHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Glow effect
  svg.append("defs").html(`
    <filter id="glow">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  `);

  const xScale = d3.scaleTime()
    .domain(d3.extent(interactionData, d => d.time))
    .range([0, width]);

  // Timeline line
  svg.append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", height / 2)
    .attr("y2", height / 2)
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2);

  // Animated light beams
  const lightBeams = svg.selectAll("line.beam")
    .data(interactionData)
    .enter()
    .append("line")
    .attr("class", "beam")
    .attr("x1", d => xScale(d.time))
    .attr("x2", d => xScale(d.time))
    .attr("y1", height / 2 - 10)
    .attr("y2", height / 2 - 60)
    .attr("stroke", "rgba(173, 216, 230, 0.6)") // light blue
    .attr("stroke-width", 2)
    .attr("stroke-linecap", "round")
    .attr("opacity", 0)
    .attr("filter", "url(#glow)");

  function animateBeams() {
    lightBeams
      .transition()
      .duration(1000)
      .delay((d, i) => i * 300)
      .attr("opacity", 1)
      .transition()
      .duration(1000)
      .attr("opacity", 0)
      .on("end", animateBeams);
  }
  animateBeams();

  // Interaction nodes
  const nodes = svg.selectAll("circle")
    .data(interactionData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.time))
    .attr("cy", height / 2)
    .attr("r", 6)
    .attr("fill", "#4682B4")
    .attr("filter", "url(#glow)");

  nodes.append("title")
    .text(d => `${d.user} @ ${d.time.toLocaleTimeString()}`);

  const xAxis = d3.axisBottom(xScale)
    .ticks(d3.timeMinute.every(5))
    .tickFormat(d3.timeFormat("%H:%M"));

  svg.append("g")
    .attr("transform", `translate(0, ${height / 2 + 30})`)
    .call(xAxis);
};