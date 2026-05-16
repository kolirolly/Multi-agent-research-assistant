from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict, Any

from agents.planner import plan_research
from agents.searcher import search_web
from agents.synthesizer import synthesize_report
from api.websocket import manager

class ResearchState(TypedDict):
    job_id: str
    query: str
    sub_questions: List[str]
    sources: List[Dict[str, Any]]
    report: str

async def planner_node(state: ResearchState):
    await manager.send_message(state['job_id'], {"event": "agent_started", "agent": "Planner", "message": "Planning research strategy..."})
    new_state = await plan_research(state)
    await manager.send_message(state['job_id'], {"event": "agent_completed", "agent": "Planner", "message": f"Generated {len(new_state.get('sub_questions', []))} sub-questions."})
    return new_state

async def searcher_node(state: ResearchState):
    await manager.send_message(state['job_id'], {"event": "agent_started", "agent": "Searcher", "message": "Searching the web..."})
    new_state = await search_web(state)
    await manager.send_message(state['job_id'], {"event": "agent_completed", "agent": "Searcher", "message": f"Found {len(new_state.get('sources', []))} sources."})
    return new_state

async def synthesizer_node(state: ResearchState):
    await manager.send_message(state['job_id'], {"event": "agent_started", "agent": "Synthesizer", "message": "Synthesizing report..."})
    new_state = await synthesize_report(state)
    await manager.send_message(state['job_id'], {"event": "agent_completed", "agent": "Synthesizer", "message": "Report generation complete."})
    await manager.send_message(state['job_id'], {"event": "research_completed", "report": new_state.get('report')})
    return new_state

def create_research_graph():
    workflow = StateGraph(ResearchState)
    
    workflow.add_node("planner", planner_node)
    workflow.add_node("searcher", searcher_node)
    workflow.add_node("synthesizer", synthesizer_node)
    
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "searcher")
    workflow.add_edge("searcher", "synthesizer")
    workflow.add_edge("synthesizer", END)
    
    return workflow.compile()

graph = create_research_graph()
