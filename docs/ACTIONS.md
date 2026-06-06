# Actions & How to Use OS-PCF

Welcome to the Open Source Patient Copilot Framework (OS-PCF). This guide explains exactly how you interact with the framework using an Agentic AI (like Antigravity, Cursor, or Windsurf).

The beauty of this framework is that you do very little typing. The AI does the heavy lifting. You act as the "Director," dropping files into folders and giving the AI commands.

## Setup & First Run

1. **Open the Folder:** Open this entire repository folder (`OpenSourceHealthProject`) inside your AI-enabled IDE.
2. **The Initialization Command:** Open the AI chat window and paste the following prompt to kickstart the copilot:
   > *"Read the `README.md` and `.agentrules`. I am initializing my Patient Copilot. Please create a `baseline_profile.md` template for me to fill out, and verify that the directory structure is ready."*
3. **Fill the Baseline:** Manually fill out the `baseline_profile.md` with your basic demographic info, allergies, and known chronic conditions.

## Core Actions (How to use the Copilot)

Here are the primary ways you will interact with the system on a day-to-day basis:

### Action 1: Ingesting Clinical Documents
When you get a new lab report, discharge summary, or doctor's note from your patient portal:
1. Save the file (PDF, TXT, or Image) into `/raw/clinical/`.
2. Tell the AI:
   > *"I just uploaded `[filename]` to `/raw/clinical/`. Please parse it, extract the key findings, translate any medical jargon into plain English, and update my `/wiki/dashboard.md` and any relevant condition files."*

### Action 2: Verifying the Standard of Care (Safety Check)
When your doctor prescribes a new medication or proposes a new treatment plan, you want to verify it against established medical guidelines (without relying on a generic web search).
1. Tell the AI:
   > *"I was just prescribed [Medication Name] for [Condition]. Use your research skills (PubMed, OpenFDA, or clinical guidelines) to fetch the current standard of care. Write a verification report in `/wiki/advocacy/treatment_verification.md` comparing my doctor's plan against the guidelines."*

### Action 3: Lifestyle & Diet Optimization
If you receive a new diagnosis (e.g., Hypertension) and want to know how to adjust your daily life safely:
1. Tell the AI:
   > *"Based on my current active conditions and medications listed in my dashboard, synthesize a safe diet and lifestyle plan. Make sure to explicitly check for any food-drug interactions (e.g., grapefruit with statins). Save this to `/wiki/lifestyle/diet_plan.md`."*

### Action 4: Navigating Insurance
When you receive an Explanation of Benefits (EOB), a medical bill, or a dense insurance policy booklet:
1. Drop the PDF into `/raw/financial/`.
2. Tell the AI:
   > *"I uploaded my new health insurance policy to `/raw/financial/`. I need an MRI for my knee. Please read the policy and tell me if prior authorization is required, what my copay should be, and draft a message to my doctor's billing department to initiate the process in `/wiki/advocacy/`."*

### Action 5: Health Check & Linting (Quarterly Review)
Medical data gets stale, and different doctors might prescribe conflicting things over time. 
1. Every few months, tell the AI:
   > *"Perform a full linting and health check on my `/wiki/`. Look for any contradictions between my current medications, highlight any stale diagnoses that haven't been checked recently, and flag any missing cross-references. Do not delete anything, just provide me a report of anomalies."*

---

## Pro-Tips
* **Be Specific:** The more specific you are with your filenames in `/raw/`, the easier it is for the AI to navigate. (e.g., use `2024-03-15_Cardio_Lab_Results.pdf` instead of `doc1.pdf`).
* **Graph View:** If you use this repository with Obsidian, open the "Graph View" to see a visual web of how your medications connect to your conditions!
