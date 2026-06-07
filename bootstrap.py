#!/usr/bin/env python3
import os
import sys
import json
import shutil

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 bootstrap.py <target_directory>")
        sys.exit(1)

    target_dir = sys.argv[1]
    
    if not os.path.exists(target_dir):
        print(f"Error: Target directory '{target_dir}' does not exist.")
        sys.exit(1)

    directories = [
        ".ai",
        "raw",
        "wiki",
        "wiki/conditions",
        "wiki/timeline",
        "wiki/labs_and_metrics",
        "wiki/research_cache",
        "ui",
        "ui/data"
    ]

    files = {}

    # Universal Pointers
    pointer_content = "You are the Lumina Agent. Your core instructions, schemas, and safety guidelines are located in the .ai/ directory. You MUST read .ai/orchestrator.md, .ai/safety-protocol.md, and .ai/patient-constraints.md before taking any action in this workspace.\n"
    
    for pointer in [".cursorrules", ".windsurfrules", ".clinerules", "CLAUDE.md", "copilot-instructions.md"]:
        files[pointer] = pointer_content

    # .ai/orchestrator.md
    files[".ai/orchestrator.md"] = """# Lumina AI Orchestrator

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
- **Patient Constraints:** You MUST respect all hyper-personalized medical boundaries defined in `/.ai/patient-constraints.md`.
"""

    # .ai/safety-protocol.md
    files[".ai/safety-protocol.md"] = """# Safety, Privacy & Provenance Protocol

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
"""

    # .ai/patient-constraints.md
    files[".ai/patient-constraints.md"] = """# Hyper-Personalized Medical Constraints

This file acts as a hard boundary for the AI. You MUST obey these rules, even if general medical knowledge suggests otherwise.

## Current Patient Constraints
- *(The user will document specific allergies, medication contraindications, and lifestyle limits here)*
- Example: "Patient takes SGLT2 inhibitors. Do not recommend fasting or ultra-low-carb diets due to ketoacidosis risk."
- Example: "Patient is allergic to Penicillin."
"""

    # .ai/schema-diet.json
    schema_content = {
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
    files[".ai/schema-diet.json"] = json.dumps(schema_content, indent=2) + "\n"

    # wiki/index.md
    files["wiki/index.md"] = """# Lumina Patient Dossier Index

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
"""

    # wiki/baseline_profile.md
    files["wiki/baseline_profile.md"] = """# Baseline Profile

This file serves as the anchor for the patient's medical history. The AI cross-references all new data against this baseline.

## Demographics
- **Name:** [Patient Name]
- **DOB:** [YYYY-MM-DD]

## Chronic Conditions
*(To be populated by AI from raw documents)*

## Baseline Metrics
*(To be populated by AI from raw documents)*
"""

    # wiki/action_log.md
    files["wiki/action_log.md"] = """# AI Action Log

An append-only log of modifications made by the Lumina AI.

## [YYYY-MM-DD] System Initialization
- Instantiated the .ai brain directory and wiki foundation.
"""

    print(f"Bootstrapping Lumina architecture into: {target_dir}")
    
    for d in directories:
        dir_path = os.path.join(target_dir, d)
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
            print(f"Created directory: {dir_path}")

    for file_path, content in files.items():
        full_path = os.path.join(target_dir, file_path)
        if not os.path.exists(full_path):
            with open(full_path, "w") as f:
                f.write(content)
            print(f"Created file: {full_path}")
        else:
            print(f"Skipped existing file: {full_path}")

    # Copy UI Dashboard files
    script_dir = os.path.dirname(os.path.abspath(__file__))
    ui_source_dir = os.path.join(script_dir, "ui")
    ui_target_dir = os.path.join(target_dir, "ui")
    
    for ui_file in ["index.html", "app.js", "style.css"]:
        src = os.path.join(ui_source_dir, ui_file)
        dst = os.path.join(ui_target_dir, ui_file)
        if os.path.exists(src):
            if not os.path.exists(dst):
                shutil.copy2(src, dst)
                print(f"Copied UI file: {dst}")
            else:
                print(f"Skipped existing UI file: {dst}")
        else:
            print(f"Warning: Source UI file {src} not found!")

    print("Bootstrap complete!")

if __name__ == "__main__":
    main()
