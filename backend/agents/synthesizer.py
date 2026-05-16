from llm_service import LLMService

llm = LLMService()

async def synthesize_report(state):
    sources_text = '\n'.join([f"[{i+1}] {s.get('title', '')}: {s.get('body', '')}\nURL: {s.get('href', '')}" 
                               for i, s in enumerate(state.get('sources', []))])
    
    prompt = f"""Create a comprehensive research report on: {state['query']}

Sources:
{sources_text}

Format the report with markdown, use headers, and include citations [1], [2], etc.
Ensure the report is detailed and synthesizes the provided sources effectively.
Include a "References" section at the end with the URLs.
"""
    
    state['report'] = await llm.generate(prompt, model='llama-3.3-70b-versatile')
    return state
