from collections import deque
from graph import Graph


def is_dag(graph: Graph) -> bool:
    """
    Determine whether a directed graph is acyclic using Kahn's algorithm.

    Kahn's algorithm performs a topological sort via iterative dequeue
    of zero-in-degree nodes. If all nodes are processed, the graph is
    acyclic (DAG). If some remain, a cycle exists.

    Complexity: O(V + E) time, O(V) space (queue + in-degree map).
    
    Uses an iterative queue (collections.deque), so no recursion limit
    concerns for deep linear chains.

    Self-loops, disconnected graphs, and parallel edges are all handled
    naturally by the algorithm.
    """
    in_degrees = dict(graph.in_degrees)
    queue = deque([nid for nid, deg in in_degrees.items() if deg == 0])
    processed = 0

    while queue:
        node = queue.popleft()
        processed += 1

        for neighbor in graph.adjacency[node]:
            in_degrees[neighbor] -= 1
            if in_degrees[neighbor] == 0:
                queue.append(neighbor)

    return processed == len(graph.node_ids)
