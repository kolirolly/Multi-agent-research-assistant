from llm_service import LLMService

llm = LLMService()

async def plan_research(state):
    prompt = f"""Break this research query into 3-5 specific sub-questions:
    Query: {state['query']}
    
    Respond with only the sub-questions, one per line."""
    
    response = await llm.generate(prompt, model='llama-3.1-8b-instant')
    state['sub_questions'] = [q.strip() for q in response.strip().split('\n') if q.strip()]
    return state
