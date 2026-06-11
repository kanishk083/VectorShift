from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import ParseRequest, ParseResponse
from graph import build_graph
from dag import is_dag

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(request: ParseRequest) -> ParseResponse:
    """
    Analyze a pipeline and return node/edge counts and DAG status.

    The request body contains the full React Flow node and edge objects.
    Only node IDs and edge endpoints are used for analysis.
    """
    try:
        graph = build_graph(
            [n.model_dump() for n in request.nodes],
            [e.model_dump() for e in request.edges],
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return ParseResponse(
        num_nodes=len(graph.node_ids),
        num_edges=graph.edge_count,
        is_dag=is_dag(graph),
    )
