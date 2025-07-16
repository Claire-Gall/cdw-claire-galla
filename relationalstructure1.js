var graphSketch3 = function () {
    const width = 800;
    const height = 400;

    Promise.all([
        d3.csv('nodes.csv'),
        d3.csv('edges.csv')
    ]).then(function ([nodesData, edgesData]) {
        console.log('Loaded nodes:', nodesData);
        console.log('Loaded edges:', edgesData);

        // Process nodes
        const nodes = nodesData.map(d => ({
            id: d.id,
            name: d.name,
            role: d.role,
            age: +d.age,
            department: d.department,
            friends: +d.friends,
            size: +d.size || 20,
            color: d.color || '#3264a8'
        }));

        // Create fake movement data (3 time steps, random positions)
        nodes.forEach(node => {
            node.movement = [
                { x: Math.random() * width, y: Math.random() * height },
                { x: Math.random() * width, y: Math.random() * height },
                { x: Math.random() * width, y: Math.random() * height }
            ];
        });

        // Process edges and group by time step (assuming edgesData has 'time' column)
        const links = edgesData.map(d => ({
            source: d.participant,
            target: d.object,
            relationship: d.relationship,
            course: d.course || '',
            since: d.since ? +d.since : null,
            strength: +d.strength,
            type: d.type,
            department: d.department || '',
            time: d.time ? +d.time : 0  // Default time 0 if missing
        }));

        // Group links by time step
        const maxTimeStep = 0; // matches movement length above
        const linksByTime = [];
        for (let t = 0; t <= maxTimeStep; t++) {
            linksByTime[t] = links.filter(l => l.time === t);
        }

        createGraph(nodes, linksByTime, maxTimeStep);
    }).catch(function (error) {
        console.error('Error loading CSV files:', error);
        const fallbackNodes = [
            { id: 'Error', name: 'CSV Load Error', role: 'error', age: 0, department: 'Error', friends: 0, size: 20, color: '#ff0000' }
        ];
        const fallbackLinks = [];
        createGraph(fallbackNodes, [fallbackLinks], 0);
    });

    function createGraph(nodes, linksByTime, maxTimeStep) {
        // Setup SVG and zoom
        const svg = d3.select('#d3-container-2')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#f0f0f0');

        const g = svg.append('g');

        g.append('defs').append('marker')
            .attr('id', 'arrowhead-3')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 50)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 4)
            .attr('markerHeight', 4)
            .append('path')
            .attr('d', 'M 0,-4 L 8,0 L 0,4')
            .attr('fill', '#666');

        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        svg.append('text')
            .attr('x', 10)
            .attr('y', 20)
            .attr('font-size', '12px')
            .attr('fill', '#666')
            .text('Use mouse wheel to zoom, drag to pan');

        // Create simulation (with empty links, updated dynamically)
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink([]).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(d => d.role === 'professor' ? -400 : -200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => d.size + 5));

        // Group for links and nodes
        const linkGroup = g.append('g').attr('class', 'links');
        const nodeGroup = g.append('g').attr('class', 'nodes');
        const labelGroup = g.append('g').attr('class', 'labels');

        // Create nodes
        const node = nodeGroup.selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', d => d.size)
            .attr('fill', d => d.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .call(drag(simulation));

        // Create labels
        const label = labelGroup.selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('font-size', 16)
            .attr('fill', '#fff')
            .text(d => d.id);

        // Tooltip setup
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('opacity', 0);

        node.on('mouseover', function (event, d) {
            link.style('stroke-opacity', l =>
                l.source.id === d.id || l.target.id === d.id ? 1 : 0.1
            );
            showTooltip(event, d);
        })
            .on('mouseout', function () {
                link.style('stroke-opacity', 0.6);
                hideTooltip();
            })
            .on('click', function (event, d) {
                console.log('Clicked on:', d.name, 'Role:', d.role, 'Department:', d.department);
            });

        function showTooltip(event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);

            tooltip.html(`
                <strong>${d.name}</strong><br/>
                Role: ${d.role}<br/> 
                Department: ${d.department}<br/> 
                Age: ${d.age}<br/> 
                Friends: ${d.friends}
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        }

        function hideTooltip() {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        }

        // Current links selection, will be updated dynamically
        let link = linkGroup.selectAll('line');

        // Update graph for a given time step
        function updateGraphAtTime(timeStep) {
            // Fix nodes position based on movement at this time
            nodes.forEach(n => {
                if (n.movement && n.movement[timeStep]) {
                    n.fx = n.movement[timeStep].x;
                    n.fy = n.movement[timeStep].y;
                } else {
                    n.fx = null;
                    n.fy = null;
                }
            });

            // Update links for this time step
            const currentLinks = linksByTime[timeStep] || [];

            // DATA JOIN for links
            link = linkGroup.selectAll('line').data(currentLinks, d => d.source + '-' + d.target);

            // EXIT old links
            link.exit().remove();

            // ENTER new links
            const linkEnter = link.enter().append('line')
                .attr('stroke', '#888')
                .attr('stroke-width', 2)
                .attr('marker-end', d => d.type === 'directed' ? 'url(#arrowhead-3)' : null);

            // MERGE enter + update
            link = linkEnter.merge(link);

            // Update simulation's links and restart
            simulation.force('link').links(currentLinks);
            simulation.alpha(1).restart();
        }

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        // Drag behavior
        function drag(sim) {
            function dragstarted(event, d) {
                if (!event.active) sim.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) sim.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }

        // Add slider UI dynamically if it doesn't exist in your HTML
        if (!document.getElementById('timeSlider')) {
            d3.select('#d3-container-2').append('input')
                .attr('type', 'range')
                .attr('min', 0)
                .attr('max', maxTimeStep)
                .attr('value', 10)
                .attr('step', 10)
                .attr('id', 'timeSlider')
                .style('width', '100%')
                .style('margin-top', '10px');
            d3.select('#d3-container-2').append('label')
                .attr('for', 'timeSlider')
                .attr('id', 'timeLabel')
                .text('Time Step: 0');
        }

        const slider = d3.select('#timeSlider');
        const timeLabel = d3.select('#timeLabel');

        slider.on('input', function () {
            const t = +this.value;
            timeLabel.text('Time Step: ' + t);
            updateGraphAtTime(t);
        });

        // Initialize at time 0
        updateGraphAtTime(0);
    }
};

graphSketch3();