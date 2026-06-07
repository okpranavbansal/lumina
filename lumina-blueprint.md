# Lumina: The Master Bootstrapper

A blueprint for automatically generating an IDE-Agnostic, Zero-Hallucination, Autonomous Personal Health Knowledge Graph using Multi-Agent LLMs.

> **Instruction for the Human:** 
> Create a new, empty folder. Place this single file (`lumina-blueprint.md`) inside it. Open the folder in an Agentic IDE (Cursor, Windsurf, Cline, Copilot) and paste the **Initialization Prompt** at the very bottom of this document into the AI chat.

---

## 🏛️ The Core Paradigm: The Compounding Artifact
Most people's experience with AI and medical documents looks like RAG: you upload a file, ask a question, and get an answer. The AI rediscovers knowledge from scratch every time.

Lumina is a **Deterministic State Machine**. Instead of retrieving from raw documents at query time, the AI incrementally builds and maintains a persistent wiki (GraphRAG). The knowledge is compiled once and kept current. 

## 🛡️ The Architecture (Set and Forget)
To ensure this system survives IDE updates, scaling, and LLM context limits, it uses a strict architecture:
1. **The Agnosticism Angle (`/.ai/`):** IDE-specific rules (`.cursorrules`, etc.) are fragile. Lumina puts all intelligence in a central `/.ai/` folder, and uses 2-line "pointer" files in the root.
2. **The Scalability Angle:** The AI uses Hierarchical Graph Traversal. It reads `/wiki/index.md` first, then selectively reads only relevant files. It never reads the whole directory.
3. **The Multi-Agent Angle:** The Orchestrator acts as multiple agents (Data Extractor, Researcher, Clinical Synthesizer) routing data through `/wiki/research_cache/` and `/wiki/labs_and_metrics/`.
4. **The Medical Safety Angle:** Hallucinations are mathematically forbidden. Every bullet point the AI writes must end with a `[Source: raw/filename.pdf]` citation. All PII must be redacted locally.

---

## 🤖 INSTRUCTIONS FOR THE AI (BOOTSTRAP PROTOCOL)

When the user gives you the Initialization Prompt, you MUST autonomously generate the following directory structure and populate the files with the exact contents described below. Do not ask for permission between files; execute the entire build in one go.

### 1. Create Directories
Create the following directories in the root:
- `.ai`
- `raw`
- `wiki`
- `wiki/conditions`
- `wiki/timeline`
- `wiki/labs_and_metrics`
- `wiki/research_cache`
- `ui/data`

### 2. The Eternal Brain (`/.ai/`)

**Create `.ai/orchestrator.md`:**
```markdown
# Lumina AI Orchestrator

You are the Lumina Agentic Orchestrator. Your primary role is to maintain the Patient Dossier (the `/wiki` directory) as a compounding, immutable knowledge graph.

## The Hierarchical Graph Traversal (Context Protection)
You must protect your context window. You are FORBIDDEN from reading the entire `/wiki` directory or doing a global search across all files.
When asked to answer a query or ingest a document:
1. ALWAYS read `/wiki/index.md` first.
2. Identify the 1-3 specific files mentioned in the index that are relevant to your task.
3. Read ONLY those specific files.

## The Multi-Agent Workflow Loops

When new data is added or a query is asked, execute the following workflow phases:

### Phase 1: Ingestion (Data Agent)
Trigger: User drops a new file into `/raw`.
Action: Read the raw file. Redact any PII (Name, SSN) locally in your context. Extract structured data points (measurements, diagnoses).

### Phase 2: Enrichment (Research Agent)
Trigger: A new diagnosis or medication is found.
Action: Autonomously search medical literature or guidelines. Save these clinical context notes into `/wiki/research_cache/`.

### Phase 3: Synthesis & Graphing (Clinical Reasoning Agent)
Trigger: Data is extracted and researched.
Action: 
- Read `/wiki/index.md` to find relevant files.
- Update longitudinal lab tables in `/wiki/labs_and_metrics/`.
- Update/Create files in `/wiki/conditions/` and `/wiki/timeline/`. **(Mandatory: All new files here MUST have YAML frontmatter, e.g., `type: condition`, `status: active`).**
- Update `/wiki/baseline_profile.md` if core metrics change.
- Create bidirectional WikiLinks (`[[Topic]]`).
- Append entry to `/wiki/action_log.md`.

### Phase 4: Rule Auto-Updating (Governance Agent)
Trigger: Medical science changes (e.g., new standard-of-care guidelines discovered in Phase 2).
Action: Update `/.ai/schema-diet.json` or this Orchestrator file to reflect new thresholds.

### Phase 5: Dashboard Compile
Trigger: Automatic at the end of ANY modification to `/wiki`.
Action: Read updated `/wiki` state -> Generate JSON -> Validate against `/.ai/schema-diet.json` -> Save to `/ui/data/diet.json`.

## Mandatory Directives
- **Read Safety Protocol:** You MUST adhere to `/.ai/safety-protocol.md` at all times. Provenance is absolute.
```

**Create `.ai/safety-protocol.md`:**
```markdown
# Safety, Privacy & Provenance Protocol

This document outlines the STRICT rules you must follow when modifying the `wiki` directory. 
As an AI managing a health dossier, hallucination and privacy breaches are catastrophic.

## 1. Privacy First (Anonymization)
- You are operating on a local-first basis. 
- When reading from `/raw/`, you MUST automatically redact PII (Name, Address, SSN, Contact Info) in your working memory before synthesizing it into the `/wiki/`.

## 2. The Rule of Provenance
Every single medical claim, data point, or diagnosis you write into the `wiki` MUST be directly traceable to a raw file.
- When writing a bullet point or table entry in the `wiki`, you MUST append a citation block: e.g., `(Source: [[raw/lab-2024.pdf]])`.
- If you are summarizing an existing wiki page, cite that page: e.g., `(Source: [[wiki/conditions/diabetes.md]])`.

## 3. No Interpolation
- You are strictly forbidden from guessing, interpolating, or assuming medical data.
- If a user asks "What is my blood pressure?" and it is not in the raw records, you must output: `[UNKNOWN: No blood pressure data found in raw records.]`

## 4. Web Research Constraints
- You may use web search to look up standard medical guidelines, drug interactions, or clinical trials. This research must be saved to `/wiki/research_cache/`.
- You may NOT use web search to diagnose the patient based on symptoms.
- Web research added to the wiki must be tagged: `(Source: Web Research - [URL])`.

## 5. Immutable Raw Layer
- You may READ from the `raw/` directory. You are FORBIDDEN from modifying or deleting files in it.
```

**Create `.ai/schema-diet.json`:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Diet and Dashboard Schema",
  "type": "object",
  "properties": {
    "goals": { "type": "array", "items": { "type": "string" } },
    "conditionSummary": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "status": { "type": "string", "enum": ["attention", "monitor", "ok"] },
          "explain": { "type": "string" }
        },
        "required": ["title", "status", "explain"]
      }
    },
    "safetyFirst": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "status": { "type": "string", "enum": ["attention"] },
          "text": { "type": "string" }
        },
        "required": ["title", "status", "text"]
      }
    },
    "medications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "purpose": { "type": "string" },
          "icon": { "type": "string" }
        },
        "required": ["name", "purpose", "icon"]
      }
    },
    "schedule": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "time": { "type": "string" },
          "label": { "type": "string" },
          "food": { "type": "string" }
        },
        "required": ["time", "label", "food"]
      }
    },
    "customModules": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "type": { "type": "string", "enum": ["cardGrid", "list", "table"] },
          "description": { "type": "string" },
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": { "type": "string" },
                "body": { "type": "string" },
                "badgeText": { "type": "string" },
                "badgeTone": { "type": "string", "enum": ["ok", "monitor", "attention"] }
              },
              "required": ["title", "body"]
            }
          }
        },
        "required": ["title", "type", "description", "items"]
      }
    }
  },
  "required": ["goals", "conditionSummary", "safetyFirst", "medications", "schedule", "customModules"]
}
```

### 3. The Universal Pointers
Create ALL of the following files in the root directory. Each file must contain exactly the same two lines:
*Contents for all pointers:*
`You are the Lumina Agent. Your core instructions, schemas, and safety guidelines are located in the .ai/ directory. You MUST read .ai/orchestrator.md and .ai/safety-protocol.md before taking any action in this workspace.`

*Files to create:*
- `.cursorrules`
- `.windsurfrules`
- `.clinerules`
- `CLAUDE.md`
- `copilot-instructions.md`

### 4. The Knowledge Graph Initialization

**Create `wiki/index.md`:**
```markdown
# Lumina Patient Dossier Index

This file is the central catalog of the wiki. The Lumina AI uses this index to navigate records without overloading its context window.

## Core Profiles
- [[baseline_profile.md]]: Patient demographics, chronic conditions, and baseline metrics.
- [[action_log.md]]: AI modification log.

## Conditions
*(The AI will populate condition-specific files in `conditions/`)*

## Timeline
*(The AI will populate chronological logs in `timeline/`)*

## Labs & Metrics
*(The AI will populate longitudinal tables in `labs_and_metrics/`)*
```

**Create `wiki/baseline_profile.md`:**
```markdown
# Baseline Profile

This file serves as the anchor for the patient's medical history. The AI cross-references all new data against this baseline.

## Demographics
- **Name:** [Patient Name]
- **DOB:** [YYYY-MM-DD]

## Chronic Conditions
*(To be populated by AI from raw documents)*

## Baseline Metrics
*(To be populated by AI from raw documents)*
```

**Create `wiki/action_log.md`:**
```markdown
# AI Action Log

An append-only log of modifications made by the Lumina AI.

## [YYYY-MM-DD] System Initialization
- Instantiated the .ai brain directory and wiki foundation.
```

---

## ⚡ Initialization Prompt

**Human:** Copy and paste the text below into your AI chat to bootstrap your workspace.

> **Prompt:** "Read the `lumina-blueprint.md` file carefully. I want you to execute the 'BOOTSTRAP PROTOCOL'. Automatically generate the directories and write all the files exactly as they are defined in the blueprint. Do not ask for permission between files, just build the entire set-and-forget architecture."
