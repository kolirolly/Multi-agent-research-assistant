from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
import uuid
from datetime import datetime
import json

from models.research import SessionLocal, ResearchJob
from workflow.graph import graph

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ResearchRequest(BaseModel):
    query: str

import asyncio

async def run_research_background(job_id: str, query: str):
    def update_job_status(status, sub_questions=None, sources=None, report=None, error=None):
        db = SessionLocal()
        try:
            job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
            if not job:
                return
            job.status = status
            if sub_questions is not None:
                job.sub_questions = json.dumps(sub_questions)
            if sources is not None:
                job.sources = json.dumps(sources)
            if report is not None:
                job.report = report
            if status == 'completed' or error:
                from datetime import timezone
                job.completed_at = datetime.now(timezone.utc)
            if error:
                job.report = f"Error: {error}"
            db.commit()
        finally:
            db.close()

    await asyncio.to_thread(update_job_status, 'processing')

    initial_state = {
        "job_id": job_id,
        "query": query,
        "sub_questions": [],
        "sources": [],
        "report": ""
    }

    try:
        final_state = await graph.ainvoke(initial_state)
        await asyncio.to_thread(update_job_status, 'completed', 
                                final_state.get('sub_questions', []),
                                final_state.get('sources', []),
                                final_state.get('report', ''))
    except Exception as e:
        print(f"Error in background task: {e}")
        await asyncio.to_thread(update_job_status, 'failed', error=str(e))
        from api.websocket import manager
        await manager.send_message(job_id, {"event": "research_failed", "error": str(e)})

@router.post("/research")
async def start_research(request: ResearchRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    job_id = str(uuid.uuid4())
    
    new_job = ResearchJob(
        id=job_id,
        query=request.query,
        status='started'
    )
    db.add(new_job)
    db.commit()
    
    background_tasks.add_task(run_research_background, job_id, request.query)
    
    return {"job_id": job_id, "status": "started"}

@router.get("/research/{job_id}")
async def get_research(job_id: str, db: Session = Depends(get_db)):
    job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return {
        "job_id": job.id,
        "status": job.status,
        "query": job.query,
        "report": job.report,
        "sources": json.loads(job.sources) if job.sources else [],
        "sub_questions": json.loads(job.sub_questions) if job.sub_questions else []
    }
