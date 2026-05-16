import faiss
import numpy as np

class FAISSVectorStore:
    def __init__(self, dimension=384):
        self.dimension = dimension
        self.index = faiss.IndexFlatL2(dimension)
        self.chunks = []
        self.metadata = []

    def add_texts(self, texts: list[str], embeddings, meta: list[dict] = None):
        if len(texts) == 0:
            return
            
        embeddings_np = np.array(embeddings).astype('float32')
        self.index.add(embeddings_np)
        
        self.chunks.extend(texts)
        if meta:
            self.metadata.extend(meta)
        else:
            self.metadata.extend([{} for _ in texts])

    def search(self, query_embedding, k=5):
        if self.index.ntotal == 0:
            return []
            
        query_np = np.array([query_embedding]).astype('float32')
        distances, indices = self.index.search(query_np, k)
        
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx != -1 and idx < len(self.chunks):
                results.append({
                    "text": self.chunks[idx],
                    "metadata": self.metadata[idx],
                    "distance": float(dist)
                })
        return results
