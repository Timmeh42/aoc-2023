module.exports = function (input) {
    const lines = input.trim().split('\n');
    const height = lines.length;
    const width = lines[0].length;

    const findPaths = (sx, sy, seen = new Set()) => {
        let dx = 1;
        let dy = 0;
        let x = sx;
        let y = sy;
        let nexts = [];
        let paths = [];
        while (true) {
            seen.add(x + y * width);
            nexts = [];
            for (let n = 0; n < 4; n++) {
                [dx, dy] = [-dy, dx];
                const nx = x + dx;
                const ny = y + dy;
                const key = nx + ny * width;
                if (seen.has(key) || nx < 0 || ny < 0 || nx >= width || ny >= height) {
                    continue;
                }
                const char = lines[ny][nx];
                if (
                    char === '#' ||
                    (char === '<' && dx === 1) ||
                    (char === '>' && dx === -1) ||
                    (char === '^' && dy === 1) ||
                    (char === 'v' && dy === -1)
                ) {
                    continue;
                }
                nexts.push([nx, ny]);
            }
            if (nexts.length === 0) {
                if (y === height - 1) {
                    paths = [seen.size - 1];
                }
                break;
            }
            if (nexts.length === 1) {
                [x, y] = nexts.pop();
            }
            if (nexts.length > 1) {
                for (const [nx, ny] of nexts) {
                    paths.push(...findPaths(nx, ny, new Set(seen)));
                }
                break;
            }
        }
        return paths;
    }
    const part1 = Math.max(...findPaths(1, 0));

    const nodes = new Map();
    const startNode = { x: 1, y: 0, key: 1, edges: new Set() };
    nodes.set(1, startNode)
    const endKey = width - 2 + (height - 1) * width;
    const endNode = { x: width - 2, y: height - 1, key: endKey, edges: new Set() };
    nodes.set(endKey, endNode);

    const edges = new Map();
    const traverseNode = (node) => {
        let dx = 1;
        let dy = 0;
        for (let n = 0; n < 4; n++) {
            [dx, dy] = [-dy, dx];
            const char = lines[node.y + dy][node.x + dx];
            if (char === '#') continue;
            const edgeKey = node.x + dx + (node.y + dy) * width;
            if (edges.has(edgeKey) === false) {
                traverseEdge(node, node.x + dx, node.y + dy);
            }
        }

    }

    const traverseEdge = (fromNode, sx, sy) => {
        let x = sx;
        let y = sy;
        let prevX = fromNode.x;
        let prevY = fromNode.y;
        let length = 1;
        while (true) {
            let dx = 1;
            let dy = 0;
            for (let n = 0; n < 4; n++) {
                [dx, dy] = [-dy, dx];
                let nx = x + dx;
                let ny = y + dy;
                const char = lines[ny][nx];
                if (
                    char === '#' ||
                    (nx === prevX && ny === prevY)
                ) {
                    continue;
                }
                if (char === '.' && ny !== height - 1) {
                    prevX = x;
                    prevY = y;
                    x = nx;
                    y = ny;
                    length++;
                    continue;
                } else {
                    if (ny === height - 1) {
                        nx = x;
                        ny = y;
                        length--;
                    }
                    // hit an arrow
                    length++;
                    const startKey = sx + sy * width;
                    const endKey = nx + ny * width;
                    const edge = {
                        x1: sx,
                        y1: sy,
                        x2: nx,
                        y2: ny,
                        startKey,
                        endKey,
                        length,
                        node1: fromNode,
                        node2: null,
                    };
                    edges.set(startKey, edge);
                    edges.set(endKey, edge);
                    fromNode.edges.add(edge);

                    nx += dx;
                    ny += dy;
                    const nodeKey = nx + ny * width;
                    if (nodes.has(nodeKey) === false) {
                        const node = { x: nx, y: ny, key: nodeKey, edges: new Set() };
                        node.edges.add(edge);
                        edge.node2 = node;
                        nodes.set(nodeKey, node)
                        traverseNode(node);
                    } else {
                        edge.node2 = nodes.get(nodeKey);
                        nodes.get(nodeKey).edges.add(edge);
                    }
                    return;
                }
            }
        }
    }

    traverseEdge(nodes.get(1), 1, 1);

    let longestPath = 0;

    const findNodePaths = (node, length = 0, seen = new Set()) => {
        seen.add(node);
        for (const edge of node.edges) {
            const nextNode = edge.node1 === node ? edge.node2 : edge.node1;
            const newLength = length + edge.length + 1
            if (nextNode === endNode) {
                if (longestPath < newLength) {
                    longestPath = newLength;
                }
            }
            if (seen.has(nextNode) === false) {
                findNodePaths(nextNode, newLength, new Set(seen));
            }
        }

    }
    findNodePaths(startNode);

    const part2 = longestPath;
    return [part1, part2];
}