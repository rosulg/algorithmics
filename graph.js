async function generate_gnp_graph(numberOfNodes, probabilityOfEdgeCreation, directed) {
    // const n = Math.pow(2, i);
    // const p = 2 * i / n;
    return await jsnx.genGnpRandomGraph(numberOfNodes, probabilityOfEdgeCreation, directed);
}

function drawGraph(G, bestScoreNode, bestScoreNodeColor) {
    const drawConfig = {
        element: '#app-canvas',
        withLabels: true,
        edgeStyle: {
            'stroke-width': 1
        },
        nodeStyle: {
            fill: function(d) {
                // Color the best node score here.
                if (d.node === bestScoreNode) {
                    return bestScoreNodeColor;
                }
                return d.data.color;
            }
        },
        labelStyle: {fill: 'white'},
    };
    jsnx.draw(G, drawConfig);
}

async function main() {
    const graph = await generate_gnp_graph(10, 1/2, false);
    // eigenvector centrality (also called eigencentrality) is a measure of the influence of a node in a network.
    const degreeCentrality = jsnx.eigenvectorCentrality(graph);
    // closeness centrality (or closeness) of a node is a measure of centrality in a network,
    // calculated as the sum of the length of the shortest paths between the node and all other nodes in the graph.
    // Thus the more central a node is, the closer it is to all other nodes.
    const closenessCentrality = jsnx.edgeBetweennessCentrality(graph);

    // returns an array where each element is node and it's score
    const scores = graph.nodes().map(node => {
        let score = degreeCentrality.get(node);
        // Add up the edge betweenness centrality for all nodes from "this" node
        graph.nodes().forEach(n => {
            // Add betweeness, if undefined add 0.
            score += closenessCentrality.get([node, n]) || 0;
        });

        return { score, node };
    });

    // Sort scores descending
    scores.sort((a, b) => b.score - a.score);
    console.log(scores, 'scores')

    // Largest score is then the first element
    const bestScore = scores[0];

    drawGraph(graph, bestScore.node, 'limegreen');

}

// When browser has loaded the site...
window.onload = async () => {
    await main();
};


