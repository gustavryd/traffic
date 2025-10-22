# Shortest Path Algorithm (Dijkstra's Algorithm)

A JavaScript implementation of Dijkstra's algorithm for finding the shortest path in a weighted graph. This implementation supports graphs with string-based vertex IDs and weighted edges.

## Features

- **Efficient pathfinding**: Uses Dijkstra's algorithm with a priority queue
- **Flexible graph structure**: Accepts vertices with string IDs and weighted edges
- **Two modes of operation**:
  - Find shortest path between two specific vertices
  - Find shortest paths from one vertex to all other vertices
- **Handles edge cases**: Disconnected graphs, zero-weight edges, and unreachable vertices
- **Well-tested**: Comprehensive test suite included

## Graph Structure

The algorithm expects graph data in the following format:

### Vertices
An array of objects with an `id` property:
```javascript
const vertices = [
  { id: 'A' },
  { id: 'B' },
  { id: 'C' }
];
```

### Edges
An array of objects with `from`, `to`, and `weight` properties:
```javascript
const edges = [
  { from: 'A', to: 'B', weight: 5 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'C', to: 'B', weight: 1 }
];
```

**Note**: This implementation creates a directed graph. If you need an undirected graph, add edges in both directions.

## Usage

### Basic Example

```javascript
const { Graph } = require('./dijkstra.js');

// Define your graph
const vertices = [
  { id: 'A' },
  { id: 'B' },
  { id: 'C' }
];

const edges = [
  { from: 'A', to: 'B', weight: 5 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'C', to: 'B', weight: 1 }
];

// Create graph instance
const graph = new Graph(vertices, edges);

// Find shortest path from A to B
const result = graph.dijkstra('A', 'B');

console.log('Distance:', result.distance); // 3
console.log('Path:', result.path); // ['A', 'C', 'B']
```

### Finding Paths to All Vertices

```javascript
// Find shortest paths from A to all other vertices
const allPaths = graph.dijkstraAll('A');

console.log('Distances:', allPaths.distances);
// { A: 0, B: 3, C: 2 }

console.log('Paths:', allPaths.paths);
// { B: ['A', 'C', 'B'], C: ['A', 'C'] }
```

## API Reference

### `Graph` Class

#### Constructor

```javascript
new Graph(vertices, edges)
```

**Parameters:**
- `vertices` (Array): Array of vertex objects with `id` property
- `edges` (Array): Array of edge objects with `from`, `to`, and `weight` properties

#### Methods

##### `dijkstra(start, end)`

Finds the shortest path between two vertices.

**Parameters:**
- `start` (string): Starting vertex ID
- `end` (string): Ending vertex ID

**Returns:**
```javascript
{
  distance: number,  // Total weight of the shortest path (Infinity if no path exists)
  path: string[]     // Array of vertex IDs representing the path (empty if no path exists)
}
```

##### `dijkstraAll(start)`

Finds shortest paths from a starting vertex to all reachable vertices.

**Parameters:**
- `start` (string): Starting vertex ID

**Returns:**
```javascript
{
  distances: Object,  // Map of vertex ID to distance from start
  paths: Object       // Map of vertex ID to path array (only includes reachable vertices)
}
```

## Running the Examples

Run the provided examples to see the algorithm in action:

```bash
node example.js
```

This will demonstrate:
1. Simple graph pathfinding
2. Real-world city road network example
3. Handling disconnected graphs

## Running Tests

Run the comprehensive test suite:

```bash
node test.js
```

The test suite covers:
- Basic shortest path finding
- Direct vs. indirect paths
- Single vertex paths
- Disconnected graphs
- Complex graphs with multiple paths
- Zero-weight edges
- Large weights
- String IDs with special characters
- Paths to all vertices

## Time Complexity

- **Time**: O((V + E) log V) where V is the number of vertices and E is the number of edges
- **Space**: O(V) for storing distances and paths

## Use Cases

This algorithm is ideal for:
- **Navigation systems**: Finding the shortest route between locations
- **Network routing**: Determining optimal packet routes
- **Game development**: AI pathfinding in games
- **Supply chain**: Optimizing delivery routes
- **Social networks**: Finding shortest connection paths

## Limitations

- **Non-negative weights only**: Dijkstra's algorithm requires all edge weights to be non-negative. For graphs with negative weights, use Bellman-Ford algorithm instead.
- **Directed graphs**: The current implementation treats the graph as directed. For undirected graphs, add edges in both directions.

## License

This is free and unencumbered software released into the public domain.
