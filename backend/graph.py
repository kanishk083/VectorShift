from typing import Set, Dict, List
from dataclasses import dataclass


@dataclass
class Graph:
    node_ids: Set[str]
    adjacency: Dict[str, List[str]]
    in_degrees: Dict[str, int]
    edge_count: int


def build_graph(nodes: List[dict], edges: List[dict]) -> Graph:
    """
    Transform raw node/edge lists into an internal Graph representation.

    Responsibilities:
      - Extract node IDs from the payload
      - Validate that every edge source/target references an existing node
      - Deduplicate parallel edges (same source+target)
      - Build adjacency list and in-degree map

    The payload comes from the frontend and may contain extra fields
    (type, position, data on nodes; type, animated, markerEnd on edges).
    Only 'id', 'source', and 'target' are consumed.
    """
    node_ids: Set[str] = {n["id"] for n in nodes}

    # Validate that every referenced node exists in the pipeline
    for edge in edges:
        if edge["source"] not in node_ids:
            raise ValueError(
                f"Edge source '{edge['source']}' not found in pipeline nodes"
            )
        if edge["target"] not in node_ids:
            raise ValueError(
                f"Edge target '{edge['target']}' not found in pipeline nodes"
            )

    # Build data structures
    adjacency: Dict[str, List[str]] = {nid: [] for nid in node_ids}
    in_degrees: Dict[str, int] = {nid: 0 for nid in node_ids}

    # Deduplicate edges — parallel edges between the same nodes
    # don't change the graph structure for DAG purposes
    unique_edges: Set[tuple] = set()
    for edge in edges:
        unique_edges.add((edge["source"], edge["target"]))

    for source, target in unique_edges:
        adjacency[source].append(target)
        in_degrees[target] += 1

    return Graph(
        node_ids=node_ids,
        adjacency=adjacency,
        in_degrees=in_degrees,
        edge_count=len(unique_edges),
    )
