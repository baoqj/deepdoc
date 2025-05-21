import os
import re
import shutil
import uuid
import urllib.request
import argostranslate.package
import argostranslate.translate
from magic_pdf.data.data_reader_writer import FileBasedDataWriter, FileBasedDataReader
from magic_pdf.data.dataset import PymuDocDataset, SupportedPdfParseMethod
from magic_pdf.model.doc_analyze_by_custom_model import doc_analyze

class PDFService:
    def __init__(self):
        # 初始化翻译模型
        self._init_translation_models()
        
    def _init_translation_models(self):
        """初始化翻译模型"""
        try:
            # 检查是否已安装模型
            installed_languages = argostranslate.translate.get_installed_languages()
            if len(installed_languages) == 0:
                print("Warning: No translation models found. Please install models manually.")
        except Exception as e:
            print(f"Warning: Failed to initialize translation models: {str(e)}")

    def _translate_text(self, text: str, target_lang: str) -> str:
        """翻译文本到目标语言"""
        try:
            installed_languages = argostranslate.translate.get_installed_languages()
            
            # 根据目标语言设置翻译方向
            if target_lang == 'zh':
                from_lang = next(lang for lang in installed_languages if lang.code == "en")
                to_lang = next(lang for lang in installed_languages if lang.code == "zh")
            elif target_lang == 'en':
                from_lang = next(lang for lang in installed_languages if lang.code == "zh")
                to_lang = next(lang for lang in installed_languages if lang.code == "en")
            else:
                return text  # 不支持的语言直接返回原文
                
            # 创建翻译器并翻译
            translation = from_lang.get_translation(to_lang)
            return translation.translate(text)
        except Exception as e:
            print(f"Warning: Translation failed: {str(e)}")
            return text  # 翻译失败时返回原文

    def safe_dirname(self, filename):
        # 转小写，去扩展名，空格->下划线，去除特殊字符，仅保留字母数字下划线
        name, _ = os.path.splitext(filename)
        name = name.lower().replace(' ', '_')
        name = re.sub(r'[^a-z0-9_]', '', name)
        return name

    def get_unique_dir(self, base_dir, filename):
        name = self.safe_dirname(filename)
        dir_path = os.path.join(base_dir, name)
        idx = 1
        while os.path.exists(dir_path):
            # 检查目录下是否有同名pdf
            pdfs = [f for f in os.listdir(dir_path) if f.lower().endswith('.pdf')]
            if filename in pdfs:
                return dir_path, 'conflict'  # 冲突
            dir_path = os.path.join(base_dir, f"{name}_{idx:03d}")
            idx += 1
        os.makedirs(dir_path, exist_ok=True)
        return dir_path, 'new'

    def save_pdf(self, upload_dir, file: bytes, filename: str, conflict_strategy='ask'):
        dir_path, status = self.get_unique_dir(upload_dir, filename)
        if status == 'conflict':
            if conflict_strategy == 'keep':
                # 保留原文件，直接返回目录和pdf路径
                pdf_path = os.path.join(dir_path, filename)
                return dir_path, pdf_path, 'keep'
            elif conflict_strategy == 'overwrite':
                # 覆盖，清空目录
                for f in os.listdir(dir_path):
                    fp = os.path.join(dir_path, f)
                    if os.path.isfile(fp):
                        os.remove(fp)
                    elif os.path.isdir(fp):
                        shutil.rmtree(fp)
                pdf_path = os.path.join(dir_path, filename)
                with open(pdf_path, 'wb') as f:
                    f.write(file)
                return dir_path, pdf_path, 'overwrite'
            elif conflict_strategy == 'new':
                # 新建新目录
                idx = 1
                name = self.safe_dirname(filename)
                while True:
                    new_dir = os.path.join(upload_dir, f"{name}_{idx:03d}")
                    if not os.path.exists(new_dir):
                        os.makedirs(new_dir, exist_ok=True)
                        pdf_path = os.path.join(new_dir, filename)
                        with open(pdf_path, 'wb') as f:
                            f.write(file)
                        return new_dir, pdf_path, 'new'
                    idx += 1
            else:
                # 默认返回冲突状态
                return dir_path, os.path.join(dir_path, filename), 'conflict'
        else:
            pdf_path = os.path.join(dir_path, filename)
            with open(pdf_path, 'wb') as f:
                f.write(file)
            return dir_path, pdf_path, 'new'

    def analyze_and_store(self, pdf_path, out_dir, lang='zh'):
        # 参考 magic_pdf 底层用法
        name_without_suff = os.path.splitext(os.path.basename(pdf_path))[0]
        local_image_dir = os.path.join(out_dir, 'img')
        local_md_dir = out_dir
        image_dir = os.path.basename(local_image_dir)
        os.makedirs(local_image_dir, exist_ok=True)
        image_writer = FileBasedDataWriter(local_image_dir)
        md_writer = FileBasedDataWriter(local_md_dir)
        # 读取pdf字节
        reader1 = FileBasedDataReader("")
        pdf_bytes = reader1.read(pdf_path)
        # 创建数据集实例
        ds = PymuDocDataset(pdf_bytes)
        # 推理
        if ds.classify() == SupportedPdfParseMethod.OCR:
            ds.apply(doc_analyze, ocr=True).pipe_ocr_mode(image_writer).dump_md(
                md_writer, f"{name_without_suff}.md", image_dir
            )
        else:
            ds.apply(doc_analyze, ocr=False).pipe_txt_mode(image_writer).dump_md(
                md_writer, f"{name_without_suff}.md", image_dir
            )
        md_path = os.path.join(local_md_dir, f"{name_without_suff}.md")
        # 翻译markdown内容（可选）
        if lang in ('zh', 'en') and md_path and os.path.exists(md_path):
            with open(md_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            # 使用新的翻译方法
            lines_trans = [self._translate_text(line, lang) if line.strip() else line for line in lines]
            with open(md_path, 'w', encoding='utf-8') as f:
                f.writelines(lines_trans)
        img_dir = local_image_dir
        assets_dir = os.path.join(out_dir, 'assets')
        os.makedirs(assets_dir, exist_ok=True)
        return md_path, img_dir, assets_dir

    def analyze_pdf(self, file_path: str):
        """分析PDF文件并返回结果"""
        try:
            # 使用magic-pdf分析PDF
            result = self.analyzer.analyze(file_path)
            
            return {
                "title": result.get("title", ""),
                "author": result.get("author", ""),
                "summary": result.get("summary", ""),
                "keywords": result.get("keywords", []),
                "sections": result.get("sections", [])
            }
        except Exception as e:
            return {"error": str(e)}

    def extract_text(self, file_path: str) -> str:
        """提取PDF文本内容"""
        try:
            return self.analyzer.extract_text(file_path)
        except Exception as e:
            return f"Error extracting text: {str(e)}"
