import os
from dotenv import load_dotenv
load_dotenv()
from groq import Groq

class LLMService:
    def __init__(self):
        # We handle case where API key is not yet set
        api_key = os.getenv('GROQ_API_KEY', 'gsk_placeholder')
        self.client = Groq(api_key=api_key)
        self.model = 'llama-3.3-70b-versatile'  # Best quality
    
    async def generate(self, prompt: str, model=None) -> str:
        try:
            response = self.client.chat.completions.create(
                model=model or self.model,
                messages=[{'role': 'user', 'content': prompt}],
                temperature=0.7,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            raise e
