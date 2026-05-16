from sentence_transformers import SentenceTransformer

# Initialize model lazily to save memory on import
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def get_embeddings(texts: list[str]):
    """
    Generate embeddings for given texts using SentenceTransformers.
    """
    if not texts:
        return []
    model = get_model()
    embeddings = model.encode(texts)
    return embeddings
