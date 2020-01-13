async function generate_gnp_graph(numberOfNodes, probabilityOfEdgeCreation, directed) {
    return await jsnx.genGnpRandomGraph(numberOfNodes, probabilityOfEdgeCreation, directed);
}

function drawGraph(G, scores) {
    const drawConfig = {
        element: '#app-canvas',
        withLabels: true,
        edgeStyle: {
            'stroke-width': 1
        },
        nodeStyle: {
            fill: function(d) {
                return colorOfNode(d.node, scores);
            }
        },
        labelStyle: {fill: 'white'},
    };
    jsnx.draw(G, drawConfig);
}

async function drawAndCalculate(n, p, directed) {
    const graph = await generate_gnp_graph(n, p, directed);
    // eigenvector centrality (also called eigencentrality) is a measure of the influence of a node in a network.
    const degreeCentrality = jsnx.eigenvectorCentrality(graph);
    // closeness centrality (or closeness) of a node is a measure of centrality in a network,
    // calculated as the sum of the length of the shortest paths between the node and all other nodes in the graph.
    // Thus the more central a node is, the closer it is to all other nodes.
    const closenessCentrality = jsnx.edgeBetweennessCentrality(graph);

    // returns an array where each element is node and it's score
    this.scores = graph.nodes().map(node => {
        let score = degreeCentrality.get(node);
        // Add up the edge betweenness centrality for all nodes from "this" node
        graph.nodes().forEach(n => {
            // Add betweeness, if undefined add 0.
            score += closenessCentrality.get([node, n]) || 0;
        });

        return { score, node };
    });

    // Sort scores descending
    this.scores.sort((a, b) => b.score - a.score);

    paintColorPalette();
    drawGraph(graph, this.scores);
}

function generate() {
    const edgeProbability = +document.getElementById('edgeProbability').value / 100;
    const numberOfNodes = +document.getElementById('numberOfNodes').value;
    if (!isNaN(edgeProbability) && !isNaN(numberOfNodes)) {
        drawAndCalculate(numberOfNodes, edgeProbability, true);
    } else {
        alert('Wrong input')
    }
}

// ----- Helpers ------

//Function to convert hex format to a rgb color
function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

// Draw the color palette on sidebar
function paintColorPalette() {
     const html = this.scores.slice(0, 10).map(score => {
        const color = colorOfNode(score.node, this.scores);
        return `<div class="color-palette" style="background-color: ${color}"><strong>${score.node}</strong></div>`;
    });
     document.getElementById('palette').innerHTML = html.join('');
}

function colorOfNode(node, scores) {
    const bestScore = scores[0].score;
    const score = scores.find(score => score.node === node).score;
    const normalizedScore = score / bestScore;
    let rgb = `rgba(50, 120, ${Math.round(255 * normalizedScore)});`;
    if (normalizedScore === 1) {
        rgb = `rgba(0, ${Math.round(255 * normalizedScore)}, 0);`;
    }
    const color = rgb2hex(rgb);
    return color;
}


