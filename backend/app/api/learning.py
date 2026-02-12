from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
# from google.cloud import firestore # access via Model or CRUD
from app.api.auth import get_current_user
from app.models.user import UserBase
from app.graph.workflow import app_graph
from app.crud.learning import learning_path, topic_progress
from app.crud.psychometric import psychometric_profile
from app.crud.content import static_content, topic_quiz
from app.models.enums import TopicStatus
from datetime import datetime
from app.data.static_content import TOPIC_DATA # Local fallback

router = APIRouter()

class QuizResultItem(BaseModel):
    questionId: int
    question: str
    selectedOption: str
    correctOption: str
    isCorrect: bool

class PathGenerationRequest(BaseModel):
    language: str
    level: str
    quizResults: List[QuizResultItem]
    availableTopics: List[Dict[str, Any]] # Expecting {id, title, status} objects

class PathResponse(BaseModel):
    language: str
    level: str
    orderedTopics: List[Dict[str, Any]]

@router.post("/generate_path", response_model=PathResponse)
def generate_learning_path(request: PathGenerationRequest, current_user: UserBase = Depends(get_current_user)):
    user_email = current_user.email
    
    # Path ID using composite key for top-level collection
    path_id = f"{user_email}_{request.language}_{request.level}"
    
    # 1. Check if path exists (Overwrite as per previous logic)
    
    # 2. Extract topic titles for the agent
    topic_titles = [t['title'] for t in request.availableTopics]
    
    # 3. Call Agent
    # agent = SkillIdentifierAgent()
    quiz_results_dict = [r.dict() for r in request.quizResults]
    
    # ordered_titles = agent.process(quiz_results_dict, topic_titles)
    
    graph_input = {
        "payload": {
            "quiz_results": quiz_results_dict,
            "available_topics": topic_titles
        },
        "user_email": user_email,
        "user_profile": {}, # Not strictly needed for skill node but good practice
        "messages": []
    }
    
    result = app_graph.invoke(graph_input)
    ordered_titles = result.get("payload", {}).get("ordered_titles", topic_titles)
    
    # 4. Reconstruct full topic objects
    topic_map = {t['title']: t for t in request.availableTopics}
    ordered_topics = []
    seen_titles = set()
    
    for title in ordered_titles:
        if title in topic_map:
            ordered_topics.append(topic_map[title])
            seen_titles.add(title)
            
    for t in request.availableTopics:
        if t['title'] not in seen_titles:
            ordered_topics.append(t)
            
    # 5. Save to DB via CRUD
    path_data = {
        "user_id": user_email, # Link to user
        "language": request.language,
        "level": request.level,
        "orderedTopics": ordered_topics,
        "updatedAt": datetime.utcnow().isoformat()
    }

    learning_path.create(path_data, id=path_id) # loose typing
    
    return PathResponse(
        language=request.language,
        level=request.level,
        orderedTopics=ordered_topics
    )

@router.get("/path/{language}", response_model=Optional[PathResponse])
def get_learning_path(language: str, level: str, current_user: UserBase = Depends(get_current_user)):
    print(f"DEBUG: get_learning_path called for {current_user.email}, {language}, {level}")
    user_email = current_user.email
    path_id = f"{user_email}_{language}_{level}"
    
    print(f"DEBUG: Fetching path_doc for {path_id}")
    path_doc = learning_path.get(path_id)
    print(f"DEBUG: path_doc found: {bool(path_doc)}")
    
    if path_doc:
        topics = path_doc.get("orderedTopics", [])
        print(f"DEBUG: Found {len(topics)} topics")
        
        # Fetch statuses
        for topic in topics:
            # We must use the same ID logic as the frontend/quiz submission
            # Quiz submission uses topic_id from URL, which seems to be "1", "2" etc.
            # stored in topic['id']
            
            raw_id = topic.get("id")
            if raw_id:
                t_id = str(raw_id)
            else:
                t_id = topic.get("title") 
                
            # Use Unique ID for progress
            unique_t_id = f"{language}_{t_id}"
            progress = topic_progress.get_progress(user_email, unique_t_id)
            if progress:
                topic["status"] = progress.get("status", TopicStatus.NOT_ATTEMPTED)
            else:
                topic["status"] = TopicStatus.NOT_ATTEMPTED
                
        return PathResponse(
            language=path_doc.get("language"),
            level=path_doc.get("level"),
            orderedTopics=topics
        )
    else:
        return None

@router.delete("/path/{language}")
async def reset_learning_path(language: str, level: str, current_user: UserBase = Depends(get_current_user)):
    user_email = current_user.email
    path_id = f"{user_email}_{language}_{level}"
    
    if learning_path.get(path_id):
        learning_path.remove(path_id)
        return {"message": "Path deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Path not found")

@router.get("/dashboard/summary")
async def get_dashboard_summary(current_user: UserBase = Depends(get_current_user)):
    # Dynamic Progress Calculation
    # 1. Get total topics count (Estimate from static content)
    total_topics = 0
    for lang in TOPIC_DATA:
        total_topics += len(TOPIC_DATA[lang])
    
    if total_topics == 0: total_topics = 30 # Fallback 15 python + 15 java

    # 2. Get user's mastered topics
    # We need to query topic_progress for this user. 
    # Since topic_progress is a collection, we can query by user_id and status.
    # But crud might not have count method exposed directly.
    # Let's use direct firestore for efficiency or add method to crud.
    from app.db.firestore import get_db
    db = get_db()
    progress_ref = db.collection("topicProgress") # CamelCase to match CRUD
    
    # Simple query should work now if we check for both Enum/String
    # But let's stick to the robust iteration since we know data is there.
    all_progress_query = progress_ref.where("user_id", "==", current_user.email)
    docs = list(all_progress_query.stream())
    
    mastered_count = 0
    for d in docs:
        data = d.to_dict()
        status = data.get("status")
        if status == "MASTERED" or status == TopicStatus.MASTERED or status == "TopicStatus.MASTERED":
            mastered_count += 1
            
    progress_percent = int((mastered_count / total_topics) * 100) if total_topics > 0 else 0
    
    # Dynamic Rank Logic
    xp = current_user.xp
    if xp < 100: rank = "Novice"
    elif xp < 500: rank = "Apprentice"
    elif xp < 1000: rank = "Adept"
    elif xp < 2000: rank = "Expert"
    else: rank = "Master"

    
    # 3. Get Recent Activities (unified feed from all platform features)
    from app.crud.activity import activity as activity_crud
    
    activities_data = activity_crud.get_recent_activities(current_user.email, limit=6)
    
    # Format activities for frontend with icons and colors
    recent_activities = []
    for activity in activities_data:
        activity_type = activity.get("activity_type", "")
        title = activity.get("title", "Unknown Activity")
        timestamp = activity.get("timestamp", "")
        
        # Determine icon and color based on activity type
        if activity_type == "TOPIC_COMPLETED":
            icon = "✅"
            color = "bg-green-500"
        elif activity_type == "TOPIC_PRACTICING":
            icon = "📚"
            color = "bg-orange-500"
        elif activity_type == "TOPIC_STARTED":
            icon = "🚀"
            color = "bg-purple-500"
        elif activity_type == "COMPETITIVE_SOLVED":
            icon = "💻"
            color = "bg-blue-500"
        elif activity_type == "INTERVIEW_COMPLETED":
            icon = "🎤"
            color = "bg-pink-500"
        elif activity_type == "DIAGNOSTIC_TAKEN":
            icon = "🧠"
            color = "bg-indigo-500"
        else:
            icon = "📝"
            color = "bg-gray-500"
        
        # Calculate time ago
        from datetime import datetime
        try:
            updated_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            now = datetime.utcnow()
            delta = now - updated_time.replace(tzinfo=None)
            
            if delta.days > 0:
                time_ago = f"{delta.days} day{'s' if delta.days > 1 else ''} ago"
            elif delta.seconds >= 3600:
                hours = delta.seconds // 3600
                time_ago = f"{hours} hour{'s' if hours > 1 else ''} ago"
            else:
                minutes = delta.seconds // 60
                time_ago = f"{minutes} minute{'s' if minutes > 1 else ''} ago" if minutes > 0 else "Just now"
        except:
            time_ago = "Recently"
        
        recent_activities.append({
            "title": title,
            "time": time_ago,
            "icon": icon,
            "color": color
        })

    return {
        "user_name": current_user.name,
        "progress_percent": progress_percent,
        "current_topic": "Python Basics", # Could be dynamic based on last active
        "selected_language": "Python", # Could be dynamic
        "xp": xp,
        "streak": current_user.streak_count,
        "rank": rank,
        "mastered_topics": mastered_count,
        "recent_activities": recent_activities
    }

# from app.agents.content_generation_agent import ContentGenerationAgent
# from app.agents.evaluator_agent import EvaluatorAgent

class QuizSubmission(BaseModel):
    submission: List[Dict[str, Any]]
    totalQuestions: int

@router.get("/topic/{language}/{topic_id}")
async def get_topic_details(language: str, topic_id: str, current_user: UserBase = Depends(get_current_user)):
    user_email = current_user.email
    
    # 1. Fetch Topic State using Unique ID
    unique_topic_id = f"{language}_{topic_id}"
    progress = topic_progress.get_progress(user_email, unique_topic_id)
    # Check simple ID as legacy fallback? No, let's enforce separation.
    
    status = progress.get("status", TopicStatus.NOT_ATTEMPTED) if progress else TopicStatus.NOT_ATTEMPTED
        
    print(f"Topic {topic_id} ({language}) status for {user_email}: {status}")

    # 2. Fetch Static Content from Firestore
    content_id = f"{language}_{topic_id}"
    topic_data_doc = static_content.get(content_id)
    
    # 3. Local Fallback if DB is empty
    if not topic_data_doc and language in TOPIC_DATA and topic_id in TOPIC_DATA[language]:
        topic_data_doc = TOPIC_DATA[language][topic_id]

    if topic_data_doc:
        static_text = topic_data_doc.get("content", f"Content for {topic_id} coming soon.")
        examples = topic_data_doc.get("examples", [])
        practice_problem = topic_data_doc.get("practice_problem", "")
        static_quiz = topic_data_doc.get("quiz", [])
        topic_title = topic_data_doc.get("title", topic_id)
    else:
        # Fallback if DB is empty (should not happen if seeded, but for safety)
        static_text = f"Content not found in database for {topic_id}."
        examples = []
        practice_problem = ""
        static_quiz = []
        topic_title = topic_id

    ai_content = None
    content_to_show = static_text # Default

    # 3. Logic Flow
    if status == TopicStatus.WEAK:
        # Fetch psychometric profile
        user_profile_doc = psychometric_profile.get_by_user(user_email)
        user_profile = user_profile_doc if user_profile_doc else {}
        
        try:
            graph_input = {
                "payload": {
                     "topic_id": topic_id,
                     "language": language,
                     "level": "Intermediate", 
                },
                "user_profile": user_profile,
                "user_email": user_email,
                "messages": []
            }
            result_graph = app_graph.invoke(graph_input)
            ai_content = result_graph.get("payload", {}).get("content", "")
            
            content_to_show = ai_content
        except Exception as e:
            if "AI_QUOTA_EXCEEDED" in str(e):
                warning_banner = """
# 🛑 Daily AI Quota Exceeded

**You have reached your daily AI usage limit.** 
We cannot generate a personalized lesson for you right now. Below is the standard lesson context. 
The Code Examples and Quiz are still available!

---

"""
                content_to_show = warning_banner + static_text
            else:
                print(f"Content generation failed: {e}")
                content_to_show = static_text  
    elif status == TopicStatus.MASTERED:
        content_to_show = static_text

    return {
        "topic_id": topic_title,
        "language": language,
        "status": status,
        "content": content_to_show,
        "examples": examples,
        "practice_problem": practice_problem,
        "is_ai_generated": status == TopicStatus.WEAK,
        "quiz": static_quiz, 
        "mastered": status == TopicStatus.MASTERED
    }

@router.post("/topic/{language}/{topic_id}/submit")
async def submit_topic_quiz(
    language: str, 
    topic_id: str, 
    submission: QuizSubmission, 
    current_user: UserBase = Depends(get_current_user)
):
    user_email = current_user.email
    
    # 1. Evaluate
    graph_input = {
        "payload": {
            "submission": submission.submission,
            "total_questions": submission.totalQuestions
        },
        "user_email": user_email,
        "user_profile": {},
        "messages": []
    }
    
    graph_result = app_graph.invoke(graph_input)
    result = graph_result.get("payload", {})
    
    print(f"DEBUG: Graph result for {topic_id}: {result}")
    
    # 2. Update DB via CRUD
    new_status_str = result.get("status", "NOT_ATTEMPTED")
    try:
        new_status = TopicStatus(new_status_str)
    except ValueError:
        new_status = TopicStatus.NOT_ATTEMPTED 
    
    unique_topic_id = f"{language}_{topic_id}"
    curr_progress = topic_progress.get_progress(user_email, unique_topic_id)
    attempts = curr_progress.get("attempts", 0) + 1 if curr_progress else 1
    
    doc_id = f"{user_email}_{unique_topic_id}"
    update_data = {
        "user_id": user_email,
        "topic_id": unique_topic_id, 
        "status": new_status,

        "last_score": result.get("score"),
        "attempts": attempts,
        "updatedAt": datetime.utcnow().isoformat()
    }
    
    print(f"DEBUG: Attempting to save progress: {update_data}")

    # Determine if create or update
    if curr_progress:
        topic_progress.update(doc_id, update_data)
        print("DEBUG: Updated existing progress doc")
    else:
        topic_progress.create(update_data, id=doc_id) # loose typing
        print("DEBUG: Created new progress doc")
    
    # --- GAMIFICATION UPDATE ---
    from app.crud.user import user as user_crud
    
    # Calculate XP
    # Base XP = Score (percentage 0-100)
    quiz_score = result.get("score_percent", 0) # Agent returns "score" usually as %? 
    # Wait, evaluator agent returns "score": 66.666
    
    xp_to_award = int(result.get("score", 0))
    
    # Mastery Bonus
    if new_status == TopicStatus.MASTERED:
        xp_to_award += 50
        
    user_crud.update_gamification_stats(user_email, xp_gained=xp_to_award)
    # ---------------------------
    
    # --- ACTIVITY LOGGING ---
    from app.crud.activity import activity as activity_crud
    
    # Determine activity type and title based on status
    topic_name = unique_topic_id.replace("_", " ")
    
    if new_status == TopicStatus.MASTERED:
        activity_type = "TOPIC_COMPLETED"
        activity_title = f'Completed "{topic_name}"'
    elif new_status == TopicStatus.WEAK:
        activity_type = "TOPIC_PRACTICING"
        activity_title = f'Practicing "{topic_name}"'
    else:
        activity_type = "TOPIC_STARTED"
        activity_title = f'Started "{topic_name}"'
    
    # Log the activity
    activity_crud.log_activity(
        user_id=user_email,
        activity_type=activity_type,
        title=activity_title,
        metadata={
            "topic_id": unique_topic_id,
            "language": language,
            "score": result.get("score", 0),
            "status": new_status.value
        }
    )

    return {
        "status": result["status"],
        "score": result["score"],
        "message": "Quiz evaluated successfully"
    }
