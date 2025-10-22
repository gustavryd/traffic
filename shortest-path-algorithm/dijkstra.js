/**
 * Dijkstra's Algorithm - Finds the shortest path in a weighted graph
 * 
 * Graph structure:
 * - vertices: Array of objects with { id: string }
 * - edges: Array of objects with { from: string, to: string, weight: number }
 */

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return this.values.length === 0;
  }
}

class Graph {
  constructor(vertices, edges) {
    this.adjacencyList = {};
    
    // Initialize adjacency list with all vertices
    vertices.forEach(vertex => {
      this.adjacencyList[vertex.id] = [];
    });
    
    // Add edges to adjacency list
    edges.forEach(edge => {
      this.adjacencyList[edge.from].push({
        node: edge.to,
        weight: edge.weight
      });
    });
  }

  /**
   * Find the shortest path from start to end vertex using Dijkstra's algorithm
   * @param {string} start - Starting vertex id
   * @param {string} end - Ending vertex id
   * @returns {Object} Object containing the shortest distance and the path
   */
  dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();
    const path = [];

    // Initialize distances and previous
    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        pq.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
      }
      previous[vertex] = null;
    }

    while (!pq.isEmpty()) {
      const { val: current } = pq.dequeue();

      // If we reached the end, build the path
      if (current === end) {
        let temp = end;
        while (temp) {
          path.push(temp);
          temp = previous[temp];
        }
        break;
      }

      // Check all neighbors
      if (current && this.adjacencyList[current]) {
        for (let neighbor of this.adjacencyList[current]) {
          const candidate = distances[current] + neighbor.weight;
          
          if (candidate < distances[neighbor.node]) {
            distances[neighbor.node] = candidate;
            previous[neighbor.node] = current;
            pq.enqueue(neighbor.node, candidate);
          }
        }
      }
    }

    return {
      distance: distances[end],
      path: path.reverse()
    };
  }

  /**
   * Find the shortest path from a start vertex to all other vertices
   * @param {string} start - Starting vertex id
   * @returns {Object} Object containing distances and paths to all vertices
   */
  dijkstraAll(start) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();

    // Initialize distances and previous
    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        pq.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
      }
      previous[vertex] = null;
    }

    while (!pq.isEmpty()) {
      const { val: current } = pq.dequeue();

      // Check all neighbors
      if (current && this.adjacencyList[current]) {
        for (let neighbor of this.adjacencyList[current]) {
          const candidate = distances[current] + neighbor.weight;
          
          if (candidate < distances[neighbor.node]) {
            distances[neighbor.node] = candidate;
            previous[neighbor.node] = current;
            pq.enqueue(neighbor.node, candidate);
          }
        }
      }
    }

    // Build paths for all reachable vertices
    const paths = {};
    for (let vertex in this.adjacencyList) {
      if (vertex !== start && distances[vertex] !== Infinity) {
        const path = [];
        let temp = vertex;
        while (temp) {
          path.push(temp);
          temp = previous[temp];
        }
        paths[vertex] = path.reverse();
      }
    }

    return {
      distances,
      paths
    };
  }
}

module.exports = { Graph, PriorityQueue };
