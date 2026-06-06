# Autonomous Patient Dossier System (Original Philosophy)

*Note: This is the original philosophical blueprint that inspired the OS-PCF framework. It outlines the transition from simple RAG to an autonomous, compounding knowledge graph.*

A blueprint for building a self-updating, personal medical knowledge graph using Multi-Agent LLMs.

This is a foundational architecture document. It is designed to be provided to your preferred agentic IDE or AI workflow orchestrator (e.g., Antigravity, Cursor, Windsurf, Claude Code, GitHub Copilot, or multi-agent frameworks like AutoGen/LangGraph). Its goal is to set the overarching rules, agent roles, and data structures so the AI can build, maintain, and autonomously enrich a comprehensive medical dossier for you. **Drop this into your workspace, and the AI should know exactly how to operate.**

> **Disclaimer:** This system is for organizing and synthesizing personal health records. LLMs are prone to hallucinations and should **never** be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers regarding your medical conditions and before making any health-related decisions based on the outputs of this dossier.

## The Core Paradigm Shift: From RAG to Autonomous Dossier

Most medical interactions with LLMs use basic Retrieval-Augmented Generation (RAG): you upload a lab report, ask a question, and the LLM answers based on that single document. It forgets the context immediately.

This architecture is different. Instead of a passive question-answer tool, this system uses **Autonomous Multi-Agent Orchestration** to maintain a **Personal Health Knowledge Graph (PHKG)**. 

When you drop a new lab report or image into the system, the AI doesn't just index it. It triggers an autonomous workflow:
1. It extracts key biomarkers, medical context, and findings from the raw documents.
2. It compares them against your historical baseline profile.
3. It autonomously researches the web or medical literature databases for the latest clinical guidelines regarding any abnormal values.
4. It updates the internal system rules if medical consensus has changed.
5. It synthesizes a new state of your health, updating longitudinal tables and flagging potential correlations.

The result is a living, compounding, and self-enriching medical dossier. The system does the tedious bookkeeping, research, and cross-referencing. You provide the raw data and review the generated insights.

## System Architecture

The workspace is divided strictly into two main domains: The Raw Data Layer (`/raw`) and The Patient State & Governance Layer (`/wiki`).

### 1. The Raw Data Layer (`/raw`)
Your immutable ground truth. 
- **Contents**: Lab report PDFs, clinical visit summaries, wearable data exports (CSV), medical imaging (X-rays, dermatoscope photos).
- **Rule**: The AI reads from this directory to ingest new data but **never** modifies or deletes anything in here.

### 2. The Patient State & Governance Layer (`/wiki`)
The structured Knowledge Graph and "brain" of the system, managed exclusively by the AI. This directory holds everything the AI synthesizes, learns, and builds.
- **`baseline_profile.md`**: The anchor of the system. Contains known genetic predispositions, chronic conditions, baseline metrics (normal resting HR, average BP), and family history. Every inference the AI makes is grounded against this baseline.
- **IDE-Agnostic AI Rule Files (`.agentrules`)**: The master schema that embeds directly into the AI's system prompt. It dictates how the AI should format tables, how to link files, and what thresholds trigger an alert.
- **`research_cache/`**: A sub-directory where the AI saves summaries of clinical guidelines, FDA drug label updates, or PubMed abstracts it has autonomously fetched.
- **`conditions/`**: Individual markdown files for specific health issues.
- **`timeline/`**: Chronological logs of symptoms and doctor visits.
- **`labs_and_metrics/`**: Auto-updating markdown tables tracking biomarkers longitudinally.

## The Multi-Agent Workflow (Operations)

When new data is added to the `/raw` folder or a new query is asked, the system executes the following agentic loop to update the `/wiki`:

### Phase 1: Ingestion & Extraction (Data Agent)
You drop a new MRI report into `/raw`. The Data Agent reads the document, translates dense clinical jargon into plain English, and extracts structured data points (measurements, diagnoses, medications).

### Phase 2: Enrichment & Research (Research Agent)
If a new diagnosis is found, the Research Agent autonomously searches the web, clinical trials, or medical databases. It fetches the standard-of-care protocols, common contraindications, and dietary guidelines, saving this context into `/wiki/research_cache/`.

### Phase 3: Synthesis & Graphing (Clinical Reasoning Agent)
The Reasoning Agent takes the extracted data and the new research, and updates the knowledge graph within the `/wiki`. It updates longitudinal tables, creates bidirectional markdown links, and generates alerts for contraindications against the `baseline_profile.md`.

### Phase 4: Rule Auto-Updating (Governance Agent)
If the Research Agent discovers that the clinical threshold for a metric has changed according to new guidelines, the Governance Agent **automatically updates the IDE-specific rule file** to reflect this new threshold.

### Phase 5: Human-in-the-Loop Audit (Linting)
Because this is medical data, the AI logs every change. You periodically review this log. You maintain final editorial control over the knowledge graph.
