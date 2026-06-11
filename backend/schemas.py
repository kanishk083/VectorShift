from pydantic import BaseModel
from typing import List


class NodeSchema(BaseModel):
    id: str


class EdgeSchema(BaseModel):
    source: str
    target: str


class ParseRequest(BaseModel):
    nodes: List[NodeSchema]
    edges: List[EdgeSchema]


class ParseResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
