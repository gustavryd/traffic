const { Graph } = require('./dijkstra.js');

// Example 1: Simple graph
console.log('=== Example 1: Simple Graph ===\n');

const vertices1 = [
  { id: 'A' },
  { id: 'B' },
  { id: 'C' },
  { id: 'D' },
  { id: 'E' }
];

const edges1 = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'E', weight: 3 },
  { from: 'C', to: 'D', weight: 2 },
  { from: 'C', to: 'B', weight: 1 },
  { from: 'D', to: 'E', weight: 3 },
  { from: 'D', to: 'B', weight: 4 }
];

const graph1 = new Graph(vertices1, edges1);

// Find shortest path from A to E
const result1 = graph1.dijkstra('A', 'E');
console.log('Shortest path from A to E:');
console.log('Distance:', result1.distance);
console.log('Path:', result1.path.join(' -> '));
console.log();

// Find shortest paths from A to all other vertices
const allPaths1 = graph1.dijkstraAll('A');
console.log('All shortest paths from A:');
for (let vertex in allPaths1.paths) {
  console.log(`To ${vertex}: distance = ${allPaths1.distances[vertex]}, path = ${allPaths1.paths[vertex].join(' -> ')}`);
}

console.log('\n=== Example 2: City Road Network ===\n');

// Example 2: More realistic city road network
const vertices2 = [
  { id: 'Home' },
  { id: 'Work' },
  { id: 'Gym' },
  { id: 'Store' },
  { id: 'Park' },
  { id: 'School' }
];

const edges2 = [
  { from: 'Home', to: 'Work', weight: 10 },
  { from: 'Home', to: 'Store', weight: 5 },
  { from: 'Store', to: 'Work', weight: 3 },
  { from: 'Store', to: 'Gym', weight: 4 },
  { from: 'Gym', to: 'Work', weight: 2 },
  { from: 'Work', to: 'Park', weight: 6 },
  { from: 'Park', to: 'School', weight: 3 },
  { from: 'Gym', to: 'School', weight: 8 },
  { from: 'Home', to: 'Park', weight: 15 }
];

const graph2 = new Graph(vertices2, edges2);

// Find quickest route from Home to School
const result2 = graph2.dijkstra('Home', 'School');
console.log('Quickest route from Home to School:');
console.log('Total distance/time:', result2.distance);
console.log('Route:', result2.path.join(' -> '));
console.log();

// Find quickest route from Home to Work
const result3 = graph2.dijkstra('Home', 'Work');
console.log('Quickest route from Home to Work:');
console.log('Total distance/time:', result3.distance);
console.log('Route:', result3.path.join(' -> '));

console.log('\n=== Example 3: Disconnected Graph ===\n');

// Example 3: Graph with unreachable vertices
const vertices3 = [
  { id: 'A' },
  { id: 'B' },
  { id: 'C' },
  { id: 'D' }
];

const edges3 = [
  { from: 'A', to: 'B', weight: 1 },
  { from: 'C', to: 'D', weight: 1 }
];

const graph3 = new Graph(vertices3, edges3);

const result4 = graph3.dijkstra('A', 'D');
console.log('Path from A to D (disconnected):');
console.log('Distance:', result4.distance); // Will be Infinity
console.log('Path:', result4.path.length > 0 ? result4.path.join(' -> ') : 'No path exists');
