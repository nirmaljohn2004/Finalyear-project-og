from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from pydantic import BaseModel
from google.cloud import firestore
from app.db.firestore import get_db

ModelType = TypeVar("ModelType", bound=BaseModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, collection_name: str):
        self.collection_name = collection_name

    @property
    def db(self) -> firestore.Client: # type: ignore
        return get_db()
    
    @property
    def collection(self):
        return self.db.collection(self.collection_name)

    def get(self, id: str) -> Optional[Dict[str, Any]]:
        doc = self.collection.document(id).get()
        if doc.exists:
            return doc.to_dict()
        return None

    def get_multi(self, limit: int = 100) -> List[Dict[str, Any]]:
        docs = self.collection.limit(limit).stream()
        return [doc.to_dict() for doc in docs]

    def create(self, obj_in: Union[CreateSchemaType, Dict[str, Any]], id: Optional[str] = None) -> Dict[str, Any]:
        if isinstance(obj_in, dict):
            obj_in_data = obj_in
        else:
            obj_in_data = obj_in.dict()
            
        if id:
            self.collection.document(id).set(obj_in_data)
        else:
            self.collection.add(obj_in_data)
        return obj_in_data

    def update(self, id: str, obj_in: Union[UpdateSchemaType, Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        doc_ref = self.collection.document(id)
        if doc_ref.get().exists:
            doc_ref.update(update_data)
            return doc_ref.get().to_dict()
        return None

    def remove(self, id: str) -> None:
        self.collection.document(id).delete()
