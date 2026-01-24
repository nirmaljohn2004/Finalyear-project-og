import sys
import os

# Add backend to path (assuming scripts/ is inside backend/)
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Need to ensure env vars are loaded if config needs them, but usually they are defaults or in .env
# We might need to load .env if not auto loaded
from app.core.config import settings

from app.data.static_content import TOPIC_DATA
from app.crud.content import static_content
from pydantic import BaseModel

class ContentSchema(BaseModel):
    title: str = ""
    content: str = ""
    examples: list = []
    practice_problem: str = ""
    quiz: list = []
    language: str = ""

def seed():
    print(f"Seeding Static Content to Firestore Project: {settings.FIRESTORE_PROJECT_ID}")
    count = 0
    for language, topics in TOPIC_DATA.items():
        for topic_id, data in topics.items():
            # ID: {language}_{topic_id}
            doc_id = f"{language}_{topic_id}"
            print(f"Seeding {doc_id}...")
            
            # Prepare data
            data_to_save = data.copy()
            data_to_save["language"] = language
            # Ensure title exists (topic_id key is usually ID, title is inside)
            if "title" not in data_to_save:
                data_to_save["title"] = topic_id

            # Create/Update
            # Using loose schema mapping
            static_content.create(ContentSchema(**data_to_save), id=doc_id)
            count += 1
            
    print(f"Seeding Complete. {count} documents verified.")

if __name__ == "__main__":
    seed()
