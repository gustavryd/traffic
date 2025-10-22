const { Graph } = require('./dijkstra.js');

// Test runner
let testsPassed = 0;
let testsFailed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
    testsPassed++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
    testsFailed++;
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertArrayEquals(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}: expected [${expected}], got [${actual}]`);
  }
}

console.log('Running Dijkstra\'s Algorithm Tests...\n');

// Test 1: Basic shortest path
test('finds shortest path in simple graph', () => {
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
  const graph = new Graph(vertices, edges);
  const result = graph.dijkstra('A', 'B');
  
  assertEquals(result.distance, 3, 'Distance should be 3');
  assertArrayEquals(result.path, ['A', 'C', 'B'], 'Path should be A->C->B');
});

// Test 2: Direct path is shortest
test('finds direct path when it is shortest', () => {
  const vertices = [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' }
  ];
  const edges = [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'C', to: 'B', weight: 2 }
  ];
  const graph = new Graph(vertices, edges);
  const result = graph.dijkstra('A', 'B');
  
  assertEquals(result.distance, 1, 'Distance should be 1');
  assertArrayEquals(result.path, ['A', 'B'], 'Path should be A->B');
});

// Test 3: Single vertex path
test('handles single vertex path', () => {
  const vertices = [
    { id: 'A' },
    { id: 'B' }
  ];
  const edges = [];
  const graph = new Graph(vertices, edges);
  const result = graph.dijkstra('A', 'A');
  
  assertEquals(result.distance, 0, 'Distance should be 0');
  assertArrayEquals(result.path, ['A'], 'Path should be [A]');
});

// Test 4: Disconnected graph
test('handles disconnected graph', () => {
  const vertices = [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' }
  ];
  const edges = [
    { from: 'A', to: 'B', weight: 1 }
  ];
  const graph = new Graph(vertices, edges);
  const result = graph.dijkstra('A', 'C');
  
  assertEquals(result.distance, Infinity, 'Distance should be Infinity');
  assertArrayEquals(result.path, [], 'Path should be empty');
});

// Test 5: Complex graph with multiple paths
test('finds optimal path in complex graph', () => {
  const vertices = [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' },
    { id: 'E' }
  ];
  const edges = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'E', weight: 3 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'B', weight: 1 },
    { from: 'D', to: 'E', weight: 3 }
  ];
  const graph = new Graph(vertices, edges);
  const result = graph.dijkstra('A', 'E');
  
  assertEquals(result.distance, 6, 'Distance should be 6');
  assertArrayEquals(result.path, ['A', 'C', 'B', 'E'], 'Path should be A->C->B->E');
});

// Test 6: Graph with zero weight edges
test('handles zero weight edges', () => {
  const vertices = [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' }
  ];
  const edges = [
    { from: 'A', to: 'B', weight: 0 },
    { from: 'B', to: 'C', weight: 1 }
  ];
  const graph = new Graph(vertices, edges);
  const result = graph.dijkstra('A', 'C');
  
  assertEquals(result.distance, 1, 'Distance should be 1');
  assertArrayEquals(result.path, ['A', 'B', 'C'], 'Path should be A->B->C');
});

// Test 7: DijkstraAll - paths to all vertices
test('finds paths to all vertices from source', () => {
  const vertices = [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' }
  ];
  const edges = [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 1 }
  ];
  const graph = new Graph(vertices, edges);
  const result = graph.dijkstraAll('A');
  
  assertEquals(result.distances['B'], 1, 'Distance to B should be 1');
  assertEquals(result.distances['C'], 3, 'Distance to C should be 3');
  assertEquals(result.distances['D'], 4, 'Distance to D should be 4');
  assertArrayEquals(result.paths['D'], ['A', 'B', 'C', 'D'], 'Path to D should be A->B->C->D');
});

// Test 8: Large weights
test('handles large weights correctly', () => {
  const vertices = [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' }
  ];
  const edges = [
    { from: 'A', to: 'B', weight: 1000000 },
    { from: 'A', to: 'C', weight: 400000 },
    { from: 'C', to: 'B', weight: 500000 }
  ];
  const graph = new Graph(vertices, edges);
  const result = graph.dijkstra('A', 'B');
  
  assertEquals(result.distance, 900000, 'Distance should be 900000');
  assertArrayEquals(result.path, ['A', 'C', 'B'], 'Path should use intermediate vertex');
});

// Test 9: Multiple edges with same weight
test('handles multiple paths with same weight', () => {
  const vertices = [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' }
  ];
  const edges = [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 1 },
    { from: 'C', to: 'D', weight: 1 }
  ];
  const graph = new Graph(vertices, edges);
  const result = graph.dijkstra('A', 'D');
  
  assertEquals(result.distance, 2, 'Distance should be 2');
  // Either path is valid, so we just check the distance
});

// Test 10: String IDs with special characters
test('handles string IDs with various characters', () => {
  const vertices = [
    { id: 'node-1' },
    { id: 'node_2' },
    { id: 'node 3' }
  ];
  const edges = [
    { from: 'node-1', to: 'node_2', weight: 1 },
    { from: 'node_2', to: 'node 3', weight: 2 }
  ];
  const graph = new Graph(vertices, edges);
  const result = graph.dijkstra('node-1', 'node 3');
  
  assertEquals(result.distance, 3, 'Distance should be 3');
  assertArrayEquals(result.path, ['node-1', 'node_2', 'node 3'], 'Path should handle special characters');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log('='.repeat(50));

if (testsFailed === 0) {
  console.log('\n✓ All tests passed!');
} else {
  console.log('\n✗ Some tests failed.');
  process.exit(1);
}
