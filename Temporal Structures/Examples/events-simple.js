// d3-events-foundation.js
// This script creates a D3.js timeline with major hurricanes hitting the US in the last 10 years

(function() {
  // Set up the SVG container
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create SVG element
  const svg = d3.select('#d3-container-1')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Major hurricanes hitting the US in the last 12 events
  const events = [
    { date: new Date('2018-09-14'), name: 'Hurricane Florence', category: 'major', location: 'Carolinas', fatalities: 53, damage: '$24B' },
    { date: new Date('2018-10-10'), name: 'Hurricane Michael', category: 'catastrophic', location: 'Florida Panhandle', fatalities: 74, damage: '$25.5B' },
    { date: new Date('2019-09-01'), name: 'Hurricane Dorian', category: 'major', location: 'Southeast', fatalities: 84, damage: '$5.1B' },
    { date: new Date('2020-08-27'), name: 'Hurricane Laura', category: 'major', location: 'Louisiana', fatalities: 77, damage: '$19B' },
    { date: new Date('2020-10-09'), name: 'Hurricane Delta', category: 'major', location: 'Louisiana', fatalities: 5, damage: '$3B' },
    { date: new Date('2021-08-29'), name: 'Hurricane Ida', category: 'catastrophic', location: 'Louisiana/Northeast', fatalities: 115, damage: '$75B' },
    { date: new Date('2022-09-28'), name: 'Hurricane Ian', category: 'catastrophic', location: 'Florida', fatalities: 161, damage: '$112.9B' },
    { date: new Date('2023-08-30'), name: 'Hurricane Idalia', category: 'major', location: 'Florida', fatalities: 12, damage: '$3.6B' },
    { date: new Date('2023-10-25'), name: 'Hurricane Otis', category: 'catastrophic', location: 'Mexico/Acapulco', fatalities: 52, damage: '$16B' },
    { date: new Date('2024-07-08'), name: 'Hurricane Beryl', category: 'catastrophic', location: 'Caribbean/Texas', fatalities: 11, damage: '$2.8B' },
    { date: new Date('2024-09-16'), name: 'Hurricane Helene', category: 'major', location: 'Southeast', fatalities: 126, damage: '$9.5B' },
    { date: new Date('2024-10-10'), name: 'Hurricane Milton', category: 'catastrophic', location: 'Florida', fatalities: 18, damage: '$8.5B' }
  ];

  // Create time scale
  const timeScale = d3.scaleTime()
    .domain(d3.extent(events, d => d.date))
    .range([0, width]);

  // Create y scale for event positioning
  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height - 50, 50]);

  // Create color scale for hurricane categories
  const colorScale = d3.scaleOrdinal()
    .domain(['major', 'catastrophic'])
    .range(['#ff6b6b', '#8b0000']);

  // Create x-axis (time axis)
  const xAxis = d3.axisBottom(timeScale)
    .tickFormat(d3.timeFormat('%b %Y'))
    .tickSize(-height + 100);

  // Add x-axis to SVG
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height - 50})`)
    .call(xAxis)
    .selectAll('line')
    .attr('stroke', '#e0e0e0')
    .attr('stroke-dasharray', '2,2');

  // Style the axis
  svg.select('.x-axis')
    .selectAll('text')
    .style('font-size', '12px')
    .style('fill', '#666');

  // Add axis title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('fill', '#333')
    .text('Major Hurricanes (2018-2024)');

  // Add events as circles with size based on damage
  const eventCircles = svg.selectAll('.event-circle')
    .data(events)
    .enter()
    .append('circle')
    .attr('class', 'event-circle')
    .attr('cx', d => timeScale(d.date))
    .attr('cy', (d, i) => height - 100 - (i * 25)) // Y increases over time (earlier events at bottom)
    .attr('r', d => {
      // Size based on damage amount
      const damage = parseFloat(d.damage.replace(/[^0-9.]/g, ''));
      if (damage > 50) return 12; // Catastrophic
      if (damage > 10) return 10; // Major
      return 8; // Minor
    })
    .attr('fill', d => colorScale(d.category))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .style('opacity', 0.8)
    .on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', d => {
          const damage = parseFloat(d.damage.replace(/[^0-9.]/g, ''));
          if (damage > 50) return 16;
          if (damage > 10) return 14;
          return 12;
        })
        .style('opacity', 1);
      
      // Show tooltip
      showTooltip(event, d);
    })
    .on('mouseout', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', d => {
          const damage = parseFloat(d.damage.replace(/[^0-9.]/g, ''));
          if (damage > 50) return 12;
          if (damage > 10) return 10;
          return 8;
        })
        .style('opacity', 0.8);
      
      // Hide tooltip
      hideTooltip();
    })
    .on('click', function(event, d) {
      console.log('Hurricane clicked:', d);
      // Add click functionality here
    });

  // Add event labels
  svg.selectAll('.event-label')
    .data(events)
    .enter()
    .append('text')
    .attr('class', 'event-label')
    .attr('x', d => timeScale(d.date))
    .attr('y', (d, i) => height - 100 - (i * 25) - 15) // Labels above each event
    .attr('text-anchor', 'middle')
    .style('font-size', '10px')
    .style('fill', '#333')
    .style('pointer-events', 'none')
    .text(d => d.name);

  // Create tooltip
  const tooltip = d3.select('#d3-container-1')
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(0, 0, 0, 0.9)')
    .style('color', 'white')
    .style('padding', '10px 15px')
    .style('border-radius', '6px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('transition', 'opacity 0.2s')
    .style('max-width', '200px');

  function showTooltip(event, d) {
    tooltip.transition()
      .duration(200)
      .style('opacity', 1);
    
    tooltip.html(`
      <strong>${d.name}</strong><br>
      Date: ${d3.timeFormat('%B %d, %Y')(d.date)}<br>
      Location: ${d.location}<br>
      Category: ${d.category}<br>
      Fatalities: ${d.fatalities}<br>
      Damage: ${d.damage}
    `)
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 10) + 'px');
  }

  function hideTooltip() {
    tooltip.transition()
      .duration(200)
      .style('opacity', 0);
  }

  // Add legend
  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(20, 20)`);

  const legendItems = legend.selectAll('.legend-item')
    .data(['major', 'catastrophic'])
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(0, ${i * 20})`);

  legendItems.append('circle')
    .attr('r', 6)
    .attr('fill', d => colorScale(d))
    .attr('stroke', '#fff')
    .attr('stroke-width', 1);

  legendItems.append('text')
    .attr('x', 15)
    .attr('y', 4)
    .style('font-size', '12px')
    .style('fill', '#333')
    .text(d => d.charAt(0).toUpperCase() + d.slice(1));

  // Add subtitle about climate change
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('fill', '#666')
    .style('font-style', 'italic')
    .text('Increasing frequency and intensity linked to climate change');

  console.log('D3.js hurricane timeline loaded successfully!');
})(); 