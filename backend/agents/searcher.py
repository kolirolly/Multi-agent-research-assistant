from duckduckgo_search import DDGS
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import time
from rag.embeddings import get_embeddings
from rag.vectorstore import FAISSVectorStore

async def fetch_url(session, url):
    try:
        async with session.get(url, timeout=5) as response:
            if response.status == 200:
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                # Remove scripts and styles
                for script in soup(["script", "style"]):
                    script.extract()
                text = soup.get_text(separator=' ', strip=True)
                return url, text
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
    return url, None

def chunk_text(text, chunk_size=1000, overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

async def search_web(state):
    # 1. Search DDG
    def do_search(questions):
        with DDGS() as ddgs:
            results = []
            for question in questions:
                try:
                    for r in ddgs.text(question, max_results=3):
                        results.append(r)
                    time.sleep(1.5) # Prevent rate limiting
                except Exception as e:
                    print(f"Search error for {question}: {e}")
            return results

    raw_results = await asyncio.to_thread(do_search, state.get('sub_questions', []))
    
    unique_urls = list({r.get('href') for r in raw_results if r.get('href')})
    unique_urls = unique_urls[:10] # Limit to 10 unique urls to prevent overload

    # 2. Fetch URLs
    fetched_texts = {}
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in unique_urls]
        responses = await asyncio.gather(*tasks)
        for url, text in responses:
            if text and len(text) > 100:
                fetched_texts[url] = text

    # If scraping fails for all, fallback to DDG snippets
    if not fetched_texts:
        state['sources'] = raw_results
        return state

    # 3. Chunk & Store in FAISS
    chunks = []
    metadata = []
    for url, text in fetched_texts.items():
        url_chunks = chunk_text(text)
        for c in url_chunks:
            chunks.append(c)
            metadata.append({"url": url})

    # Embed and index
    embeddings = await asyncio.to_thread(get_embeddings, chunks)
    
    vector_store = FAISSVectorStore()
    vector_store.add_texts(chunks, embeddings, metadata)

    # 4. Query FAISS
    query = state['query']
    query_embed = (await asyncio.to_thread(get_embeddings, [query]))[0]
    
    top_results = vector_store.search(query_embed, k=15)
    
    # Format sources for synthesizer
    sources = []
    for res in top_results:
        sources.append({
            "title": "Extracted Context",
            "body": res['text'],
            "href": res['metadata']['url']
        })

    state['sources'] = sources
    return state
