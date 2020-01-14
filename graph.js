// Global variables
this.graph;

async function generateGraph(numberOfNodes, probabilityOfEdgeCreation, directed) {
    return await jsnx.genGnpRandomGraph(numberOfNodes, probabilityOfEdgeCreation, directed);
}

function drawGraph(graph, result) {
    const drawConfig = {
        element: '#app-canvas',
        withLabels: true,
        weighted: true,
        edgeStyle: {
            'stroke-width': 3,
            fill: function (d) {
                if (result && d.edge.toString() === result.centralEdge.key) {
                    return 'red'
                }
                return d.data.color;
            },
        },
        nodeAttr: {
            id: function (d) {
                return 'node-' + d.node; // assign unique ID
            }
        },
        nodeStyle: {
            fill: function (d) {
                if (result && result.scores) {
                    return colorOfNode(d.node, result.scores);
                }
                return d.data.color;
            },
        },

        labelStyle: {
            fill: 'white'
        },
    };
    jsnx.draw(graph, drawConfig, true);
}


function calculateResult(graph) {
    let degreeCentrality = jsnx.eigenvectorCentrality(graph, { maxIter: 1000, weight: null });

    // closeness centrality (or closeness) of a node is a measure of centrality in a network,
    // calculated as the sum of the length of the shortest paths between the node and all other nodes in the graph.
    // Thus the more central a node is, the closer it is to all other nodes.
    // https://www.hindawi.com/journals/ijcom/2014/241723/
    // High centrality scores indicate that a vertex lies on a considerable fraction of shortest paths connecting pairs of vertices.
    const betweennessCentraility = jsnx.betweennessCentrality(graph, {
        k: graph.nodes().length,
        normalized: true,
        weight: null,
        endpoints: false
    });

    // Edge betweenness centrality
    // https://link.springer.com/referenceworkentry/10.1007%2F978-1-4419-9863-7_874
    const edgeBetweennessCentrality = jsnx.edgeBetweennessCentrality(graph, { normalized: true, weight: null });

    const centralEdge = {
        key: null,
        score: 0,
    };

    // returns an array where each element is node and it's score
    const scores = graph.nodes().map(node => {
        let score = degreeCentrality.get(node) + betweennessCentraility.get(node);

        // Add up the edge betweenness centrality for all nodes from "this" node
        graph.nodes().forEach(n => {
            // Add edge betweeness, if undefined add 0.
            const key = [node, n];
            const edgeScore = edgeBetweennessCentrality.get(key) || 0;
            if (edgeScore > centralEdge.score) {
                centralEdge.score = edgeScore;
                centralEdge.key = key.toString();
            }
            score += edgeScore;
        });

        return {score, node};
    });


    // Sort scores descending
    scores.sort((a, b) => b.score - a.score);

    return {scores, centralEdge};
}

async function generate() {
    const edgeProbability = +document.getElementById('edgeProbability').value / 100;
    const numberOfNodes = +document.getElementById('numberOfNodes').value;
    const directed = document.getElementById('directed').checked;
    if (edgeProbability && numberOfNodes && !isNaN(edgeProbability) && !isNaN(numberOfNodes)) {
        await generateAndDraw(numberOfNodes, edgeProbability, directed);
    } else {
        alert('Wrong input')
    }
}

async function generateAndDraw(numberOfNodes, edgeProbability, directed) {
    const graph = await generateGraph(numberOfNodes, edgeProbability, directed);
    draw(graph);
}

function draw(graph) {
    try {
        this.graph = graph;
        const result = calculateResult(graph);

        drawGraph(graph, result);
        paintColorPalette(result.scores);
    } catch(error) {
        console.log(error);
        alert(error && error.message ? error.message : 'An error occurred');
    }
}

function directed() {
    const value = document.getElementById('directed').checked;
    const toggledValue = !value;
    document.getElementById('directed').checked = toggledValue;

    // Set class and innerHTML for the button
    const button = document.getElementById('directionButton');
    button.textContent = toggledValue.toString().toUpperCase();
    button.className = toggledValue ? 'btn btn-success' : 'btn btn-danger';
}

function deleteNode() {
    const element = document.getElementById('deleteNode').value;
    const node = +element;
    if (element && this.graph.nodes().indexOf(node) !== -1) {
        try {
            const element = document.getElementById('node-' + node);
            this.graph.removeNode(+element.id.split('-')[1]);
            draw(this.graph);
        } catch (error) {
            console.log(error, 'error');
            alert(error && error.message ? error.message : 'An error occurred');
        }
    } else {
        alert('Node does not exist')
    }
}

function addNode() {
    const nextNodeNumber = this.graph.nodes().length;
    this.graph.addNode(nextNodeNumber);
    draw(this.graph);
}

function addEdge() {
    const edgeFrom = document.getElementById('edgeFrom').value;
    const edgeTo = document.getElementById('edgeTo').value;
    if (edgeFrom && edgeTo) {
        this.graph.addEdge(+edgeFrom, +edgeTo);
        draw(this.graph);
    } else {
        alert('Wrong input')
    }
}

// ----- Helpers ------

//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

// Draw the color palette on sidebar
function paintColorPalette(scores) {
    const html = scores.slice(0, 10).map(score => {
        const color = colorOfNode(score.node, scores);
        return `<div class="color-palette" style="background-color: ${color}"><strong>${score.node}</strong></div>`;
    });
    document.getElementById('palette').innerHTML = html.join('');
}

// Get the color of the node based on score
function colorOfNode(node, scores) {
    let score = 0;

    const bestScore = scores[0].score;
    const result = scores.find(score => score.node === node);
    if (result) {
        score = result.score;
    }
    const normalizedScore = score / bestScore;
    let rgb = `rgba(50, 120, ${Math.round(255 * normalizedScore)});`;
    if (normalizedScore === 1) {
        rgb = `rgba(0, ${Math.round(255 * normalizedScore)}, 0);`;
    }
    const color = rgb2hex(rgb);
    return color;
}

// Switch between tabs in html
function switchTabs(tabId) {
    const tabIds = ['options', 'additionalOptions'];
    tabIds.forEach(id => {
        if (id !== tabId) {
            document.getElementById(id).setAttribute('hidden', '');
            document.getElementById(id + 'Button').className = 'btn btn-light';
        } else {
            document.getElementById(id).removeAttribute('hidden');
            document.getElementById(id + 'Button').className = 'btn btn-primary';
        }
    });
}
