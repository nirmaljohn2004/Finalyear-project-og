import chromadb
from chromadb.utils import embedding_functions
from app.data.static_content import TOPIC_DATA
import os

class RAGSystem:
    def __init__(self):
        # Persist data to 'chroma_db' folder in backend root
        self.persist_directory = "chroma_db"
        
        # Use a lightweight local embedding model
        # 'all-MiniLM-L6-v2' is standard for speed/quality balance
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        self.client = chromadb.PersistentClient(path=self.persist_directory)
        
        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="course_content",
            embedding_function=self.embedding_fn
        )
        
        # Check if empty, if so, ingest
        if self.collection.count() == 0:
            print("RAG: Collection empty. Ingesting static content...")
            self.ingest_static_content()
        else:
            print(f"RAG: Loaded {self.collection.count()} documents from persistence.")

    def ingest_static_content(self):
        """
        Reads TOPIC_DATA from static_content.py and adds to ChromaDB.
        """
        documents = []
        metadatas = []
        ids = []
        
        for lang, topics in TOPIC_DATA.items():
            for topic_id, data in topics.items():
                title = data.get("title", "Unknown")
                content = data.get("content", "")
                
                # Chunking strategy: 
                # Ideally split by headers, but for now entire topic content is small enough (~500 words)
                # to be a single chunk or maybe 2. 
                # Let's just use the full content as one chunk per topic for simplicity.
                # If content is huge, we should split it.
                
                # Main Content Chunk
                documents.append(content)
                metadatas.append({"topic": title, "language": lang, "type": "concept"})
                ids.append(f"{lang}_{topic_id}_content")
                
                # Examples Chunk
                examples = data.get("examples", [])
                for i, ex in enumerate(examples):
                    documents.append(f"Example for {title}:\n{ex}")
                    metadatas.append({"topic": title, "language": lang, "type": "example"})
                    ids.append(f"{lang}_{topic_id}_example_{i}")
        
        if documents:
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            print(f"RAG: Successfully ingested {len(documents)} chunks.")

    def query_context(self, query: str, n_results: int = 2) -> str:
        """
        Retrieves top similar chunks and formats them as a string.
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        # Results structure: {'documents': [[...]], 'metadatas': [[...]], ...}
        docs = results.get('documents', [[]])[0]
        metas = results.get('metadatas', [[]])[0]
        
        context_parts = []
        for i, doc in enumerate(docs):
            meta = metas[i] if i < len(metas) else {}
            topic = meta.get('topic', 'General')
            context_parts.append(f"--- Context (Topic: {topic}) ---\n{doc}\n")
            
        return "\n".join(context_parts)

# Singleton instance
rag_system = RAGSystem()
