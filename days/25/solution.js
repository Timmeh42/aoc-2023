module.exports = function (input) {
    const lines = input.trim().split('\n').map((line) => line.match(/\w+/g));

    const nodes = new Map();
    const edges = [];
    for (const line of lines) {
        const mainKey = line[0];
        let node = nodes.get(mainKey);
        if (node === undefined) {
            node = { key: mainKey, neighbours: [], size: 1 };
            nodes.set(mainKey, node);
        }

        for (const neighbourKey of line.slice(1)) {
            let neighbour = nodes.get(neighbourKey);
            if (neighbour === undefined) {
                neighbour = { key: neighbourKey, neighbours: [], size: 1 };
                nodes.set(neighbourKey, neighbour);
            }
            edges.push([node, neighbour]);
        }
    }

    let minMinCut = Infinity;
    let part1 = 0;

    while (true) {
        const [newMinCut, lastNodes] = mincut(new Set(nodes.values()), [...edges]);
        if (minMinCut > newMinCut) {
            minMinCut = newMinCut;
            part1 = [...lastNodes.values()].reduce((mul, n) => mul * n.size, 1);
            console.log(newMinCut, part1);
            if (newMinCut === 3) break;
        }
    }
    
    return [part1]
}

function mincut(nodes, edges) {
    edges.sort(() => Math.random() - 0.5);
    while (nodes.size > 2) {
        const contraction = edges.pop();
        const otherEdges = edges.filter((edge) => edge.includes(contraction[0]) && edge.includes(contraction[1]));
        edges = edges.filter((edge) => otherEdges.includes(edge) === false);
        const newNode = { size: contraction[0].size + contraction[1].size };
        nodes.add(newNode);
        for (let e = 0; e < edges.length; e++) {
            const edge = edges[e];
            if (edge[0] === contraction[0] || edge[0] === contraction[1]) {
                edges[e] = [newNode, edge[1]];
            }
            if (edge[1] === contraction[0] || edge[1] === contraction[1]) {
                edges[e] = [edge[0], newNode];
            }
        }
        nodes.delete(contraction[0]);
        nodes.delete(contraction[1]);
    }
    return [edges.length, nodes];
}