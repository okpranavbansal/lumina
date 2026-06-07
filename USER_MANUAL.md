# Lumina: User Manual

Welcome to the Lumina Autonomous Patient Dossier System.

> [!WARNING]
> **Disclaimer:** This system is for organizing and synthesizing personal health records. LLMs are prone to hallucinations and should **never** be used as a substitute for professional medical advice, diagnosis, or treatment.

## 🏛️ The Core Paradigm: The Compounding Artifact

Most people's experience with AI and medical documents looks like RAG (Retrieval-Augmented Generation): you upload a file, ask a question, and get an answer. Nothing is built up. The AI rediscovers knowledge from scratch on every question.

This system is different. Lumina is a **Deterministic State Machine**. Instead of retrieving from raw documents at query time, the AI **incrementally builds and maintains a persistent wiki**. 

When you drop a new lab report or doctor's note into the `/raw` folder, the AI reads it, extracts key medical information, and integrates it into the existing `/wiki`—updating chronic conditions, revising timelines, and strengthening the evolving synthesis. 

## 🧱 The Architecture

Lumina is **IDE Agnostic** and **Future-Proof**. The intelligence lives in the `/.ai` folder, not locked into a specific editor.

- **`/.ai/`**: The Eternal Brain. Contains the strict logic for how the AI must behave, including Anti-Hallucination and Provenance rules.
- **`/raw/`**: Your immutable ground truth. Drop Lab report PDFs and clinical notes here. The AI reads from here but **never** modifies it.
- **`/wiki/`**: The structured Knowledge Graph. The AI maintains this entirely.
- **`/ui/`**: The dashboard frontend. The AI compiles its knowledge into `/ui/data/diet.json` after every operation.

## ⚙️ How to Use It

This workspace is fully pre-configured. There are no prompts you need to copy/paste.

1. Open this repository in an Agentic IDE (Cursor, Windsurf, Cline, etc.). The IDE will automatically detect the pointer file (e.g. `.cursorrules`) and read the `/.ai/` logic.
2. Drop a medical PDF into `/raw/`.
3. Open your AI Chat and simply say: **"I added a new lab report. Ingest it."**
4. The AI will do the rest, safely cross-referencing against your baseline and updating the UI dashboard.
