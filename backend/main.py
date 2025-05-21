from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.services.pdf_service import PDFService
import os

app = FastAPI()

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 上传目录（绝对路径，确保在backend/upload下）
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, 'upload')
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 挂载静态文件服务，供前端访问markdown、图片、附件等
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...), lang: str = Form('zh'), conflict_strategy: str = Form('ask')):
    file_bytes = await file.read()
    pdf_service = PDFService()
    # 保存PDF到唯一目录，返回状态
    dir_path, pdf_path, status = pdf_service.save_pdf(UPLOAD_DIR, file_bytes, file.filename, conflict_strategy=conflict_strategy)
    if status == 'conflict':
        return {"status": "conflict", "message": "文件已存在，需选择保留、覆盖或新建。"}
    # mineru分析并存储markdown、图片、附件
    md_path, img_dir, assets_dir = pdf_service.analyze_and_store(pdf_path, dir_path, lang=lang)
    # 返回markdown和图片、附件信息
    img_files = os.listdir(img_dir) if os.path.exists(img_dir) else []
    asset_files = os.listdir(assets_dir) if os.path.exists(assets_dir) else []
    return {
        "status": status,
        "filename": file.filename,
        "dir": os.path.basename(dir_path),
        "markdown": f"/static/{os.path.basename(dir_path)}/content.md",
        "images": [f"/static/{os.path.basename(dir_path)}/img/{img}" for img in img_files],
        "assets": [f"/static/{os.path.basename(dir_path)}/assets/{att}" for att in asset_files]
    }

@app.get("/api/files")
async def list_files():
    files = []
    for d in os.listdir(UPLOAD_DIR):
        dir_path = os.path.join(UPLOAD_DIR, d)
        if os.path.isdir(dir_path):
            pdfs = [f for f in os.listdir(dir_path) if f.lower().endswith('.pdf')]
            if pdfs:
                files.append({
                    "name": pdfs[0],
                    "dir": d
                })
    return files
