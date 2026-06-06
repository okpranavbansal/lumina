# Open Source Patient Copilot Framework (OS-PCF)

An open-source blueprint and framework for building a self-updating, highly secure, AI-powered Patient Copilot.

This framework shifts personal healthcare management from passive RAG (Retrieval-Augmented Generation) to an **Active Patient Copilot**. It doesn't just index your documents; it actively cross-references your clinical data against standard-of-care guidelines, insurance constraints, and dietary requirements.

## The Core Problem
Healthcare navigation is incredibly complex. Patients face:
1. **Health Literacy & Jargon:** Dense clinical notes that are hard to understand.
2. **Financial Toxicity:** Complex insurance policies, prior authorizations, and hidden costs.
3. **Fragmentation:** Data scattered across multiple providers and portals.
4. **Safety & Standard of Care:** Unsure if a prescribed treatment aligns with modern, established guidelines.

## The Solution: OS-PCF Architecture

This framework divides your workspace into an immutable data layer and an active AI reasoning layer. Provide this entire folder structure to an Agentic IDE (like Cursor, Windsurf, or Antigravity) and it will become your dedicated Patient Advocate.

### 1. The Immutable Data Layer (`/raw`)
Your ground truth. The AI reads from here but **never** edits or deletes files here.
*   **`/raw/clinical/`**: Lab report PDFs, clinical visit summaries, wearable data exports, medical imaging.
*   **`/raw/financial/`**: Insurance policy PDFs, Explanation of Benefits (EOBs), and medical bills.

### 2. The Patient State & Advocacy Layer (`/wiki`)
The structured Knowledge Graph managed exclusively by the AI.
*   **`dashboard.md`**: The central "Face Sheet" (active conditions, current medications, critical vitals). The AI keeps this updated on every ingestion.
*   **`/wiki/conditions/`**: Individual files for specific diagnoses (e.g., `hypertension.md`).
*   **`/wiki/timeline/`**: A chronological log of symptoms, doctor visits, and interventions.
*   **`/wiki/lifestyle/`**: AI-generated diet and exercise plans that automatically check for food-drug interactions based on your current medications.
*   **`/wiki/advocacy/`**: The output folder where the AI drafts insurance appeal letters, messages to providers, and Standard of Care verification reports.

### 3. The Copilot Brain (`.agentrules`)
The master instruction set. This file is embedded in the root directory and explicitly instructs the AI on *how* to operate. It mandates that the AI must always cite sources, never delete raw data, and actively check for contradictions.

## Active Workflows (What the AI actually does)

When you drop a new lab report or insurance policy into `/raw`, the system executes:

1.  **Ingestion & Translation:** Converts clinical jargon into plain English and updates the `dashboard.md`.
2.  **Standard of Care Verification:** The AI autonomously searches medical databases (PubMed, clinical guidelines) to verify that a new prescription or diagnosis aligns with established medical consensus. Output is saved to `/wiki/advocacy/treatment_verification.md`.
3.  **Diet & Lifestyle Synthesis:** Checks for new food-drug interactions and updates your `/wiki/lifestyle/` plans accordingly.
4.  **Insurance Feasibility:** Cross-references proposed treatments against your policies in `/raw/financial/` to flag potential out-of-pocket costs.
5.  **Medical Linting:** Continuously scans the entire `/wiki` for conflicting diagnoses, interacting medications, or stale claims, logging them for human review.

## Privacy & Security First
*   **Local-First / Private Repo:** Keep this repository local or in a strictly private, encrypted Git repo.
*   **Zero Data Retention:** Ensure your AI provider has a zero-data-retention policy so your Protected Health Information (PHI) is not used for model training. Where possible, use local open-weight models.

## How to Deploy
1. Clone or download this repository structure.
2. Drop your medical files into the appropriate `/raw/clinical/` and `/raw/financial/` folders.
3. Open the repository in your Agentic IDE or point your CLI AI agent at this folder.
4. Prompt the AI: *"Read the `.agentrules`. Scan the `/raw` directories and build my initial `/wiki/dashboard.md`."*
