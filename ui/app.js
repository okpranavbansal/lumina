let currentTab = "diet";
let manifest = null;
let dietData = null;
let reportsData = {};

async function init() {
  try {
    const manifestRes = await fetch("data/manifest.json");
    manifest = await manifestRes.json();

    const dietRes = await fetch("data/diet.json");
    dietData = await dietRes.json();

    // Initialize Theme
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    applyTheme(savedTheme);

    setupEventListeners();
    render();
  } catch (err) {
    console.error("Initialization failed:", err);
    document.getElementById("content-area").innerHTML = "Failed to load data.";
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const toggleBtnText = theme === "dark" ? "Light Mode" : "Dark Mode";
  const toggleBtnIcon = theme === "dark" ? "☀️" : "🌙";

  const sidebarBtn = document.getElementById("theme-toggle");
  if (sidebarBtn) {
    sidebarBtn.querySelector(".theme-icon").textContent = toggleBtnIcon;
    sidebarBtn.querySelector(".theme-text").textContent = toggleBtnText;
  }
  const topBtn = document.getElementById("theme-toggle-top");
  if (topBtn) {
    topBtn.textContent = toggleBtnIcon;
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
}

function setupEventListeners() {
  const tabs = document.querySelectorAll(".nav-tab, .mobile-tab");
  tabs.forEach((tab) => {
    tab.setAttribute("aria-pressed", tab.classList.contains("active"));
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      // Update UI for both sidebar and mobile bottom tabs
      tabs.forEach((t) => {
        if (t.getAttribute("data-tab") === targetTab) {
          t.classList.add("active");
          t.setAttribute("aria-pressed", "true");
        } else {
          t.classList.remove("active");
          t.setAttribute("aria-pressed", "false");
        }
      });

      // Update State
      currentTab = targetTab;
      render();
      window.scrollTo(0, 0);
    });
  });

  // Theme Toggle Listeners
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
  const themeToggleTop = document.getElementById("theme-toggle-top");
  if (themeToggleTop) {
    themeToggleTop.addEventListener("click", toggleTheme);
  }
}

async function getReport(index) {
  const reportInfo = manifest.reports[index];
  if (!reportsData[reportInfo.date]) {
    const res = await fetch(`data/reports/${reportInfo.file}`);
    reportsData[reportInfo.date] = await res.json();
  }
  return reportsData[reportInfo.date];
}

function section(title, body, lead = "") {
  return `
    <section class="section">
      <div class="section-title">${title}</div>
      ${lead ? `<p class="section-lede">${lead}</p>` : ""}
      ${body}
    </section>
  `;
}

function statusCard(item) {
  const text = item.explain || item.text || item.note || item.benefit || "";
  return `
    <article class="summary-card card-${item.status || "ok"}">
      ${item.status ? `<div class="card-status status-${item.status}">${item.status}</div>` : ""}
      <div class="card-title">${item.title}</div>
      ${text ? `<p>${text}</p>` : ""}
      ${item.hindi ? `<p class="hindi-note">${item.hindi}</p>` : ""}
    </article>
  `;
}

function simpleCard({
  icon = "",
  title = "",
  kicker = "",
  body = "",
  badgeText = "",
  badgeTone = "monitor",
}) {
  return `
    <article class="lifestyle-card">
      ${badgeText ? `<span class="badge badge-${badgeTone} card-badge">${badgeText}</span>` : ""}
      ${icon ? `<div class="card-icon">${icon}</div>` : ""}
      <div class="card-title">${title}</div>
      ${kicker ? `<div class="card-kicker">${kicker}</div>` : ""}
      ${body ? `<p>${body}</p>` : ""}
    </article>
  `;
}

function cardGrid(cards, className = "") {
  return `<div class="card-grid ${className}">${cards.join("")}</div>`;
}

function simpleTable(headers, rows, className = "") {
  return `
    <div class="table-wrap">
      <table class="marker-table ${className}">
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.join("")}</tbody>
      </table>
    </div>
  `;
}

function renderHungerCheck() {
  if (!dietData.hungerCheck) return "";

  return section(
    "🍽️ Always Hungry Plan",
    `
      <div class="safety-warning">
        <strong>First check:</strong> sudden hunger with shaking, sweating, weakness, confusion, or fast heartbeat can be low sugar on insulin. Check glucose before treating it as normal appetite.
      </div>
      ${cardGrid(
        dietData.hungerCheck.map((item) =>
          simpleCard({
            title: item.title,
            kicker: item.when,
            body: item.action,
            badgeText: item.badge,
            badgeTone: item.tone || "monitor",
          }),
        ),
        "summary-grid",
      )}
    `,
    "Use this before giving extra food. It prevents both low-sugar panic and hidden overeating.",
  );
}

function renderQuickPacifiers() {
  if (!dietData.quickPacifiers || !dietData.behavioralHacks) return "";

  return section(
    "👶 Quick Pacifiers & Behavioral Hacks",
    `
      <div class="simple-guide-grid">
        <!-- PACIFIERS -->
        <div class="sg-column sg-eat">
          <h3 class="sg-header sg-header-eat" style="background: linear-gradient(135deg, #0284c7, #0369a1);">👶 Instant Pacifiers (Zero Prep)</h3>
          <ul class="sg-list">
            ${dietData.quickPacifiers
              .map(
                (item) => `
              <li>
                <div class="sg-emoji">${item.emoji}</div>
                <div>
                  <strong>${item.name} <span class="badge badge-ok" style="font-size: 9px; margin-left: 5px;">${item.prep}</span></strong>
                  <p>${item.detail}</p>
                </div>
              </li>
            `,
              )
              .join("")}
          </ul>
        </div>
        <!-- HACKS -->
        <div class="sg-column sg-monitor" style="border-color: var(--monitor-border);">
          <h3 class="sg-header" style="background: linear-gradient(135deg, #d97706, #b45309);">⏱️ Family Behavioral Hacks</h3>
          <ul class="sg-list">
            ${dietData.behavioralHacks
              .map(
                (item) => `
              <li>
                <div class="sg-emoji">${item.emoji}</div>
                <div>
                  <strong>${item.title}</strong>
                  <p>${item.detail}</p>
                </div>
              </li>
            `,
              )
              .join("")}
          </ul>
        </div>
      </div>
    `,
    "When he sticks on like a baby to eat immediately, use these fast-acting, low-calorie, high-satisfaction choices to pacify him without spiking sugar.",
  );
}

function renderHungerSnacks() {
  if (!dietData.hungerSnacks) return "";

  return section(
    "🥣 Practical Hunger Snacks",
    `
      ${dietData.snackRules ? cardGrid(dietData.snackRules.map(statusCard), "summary-grid") : ""}
      ${simpleTable(
        ["Snack", "Portion", "Best time", "Why it works", "Panlipase note"],
        dietData.hungerSnacks.map(
          (s) => `
            <tr>
              <td><strong>${s.name}</strong><br><span class="badge badge-${s.tone || "ok"}">${s.tag}</span></td>
              <td>${s.portion}</td>
              <td>${s.when}</td>
              <td style="font-size:13px;"><strong>Allopathy:</strong> ${s.allopathy}<br><strong>Ayurveda:</strong> ${s.ayurveda}<br><span class="hindi-note">${s.caution}</span></td>
              <td style="font-size:13px;">${s.panlipase}</td>
            </tr>
          `,
        ),
        "snack-table",
      )}
    `,
    "These are measured mini-snacks, not unlimited eating. Rotate them so digestion stays calm.",
  );
}

function renderFruitsGuide() {
  if (!dietData.fruitsGuide) return "";

  return section(
    "🍎 Fruits Guide",
    `
      <div class="simple-guide-grid">
        <div class="sg-column sg-eat">
          <h3 class="sg-header sg-header-eat">✅ Safe Fruits</h3>
          <ul class="sg-list">
            ${dietData.fruitsGuide.eatable
              .map(
                (item) => `
              <li>
                <div class="sg-emoji">${item.emoji}</div>
                <div><strong>${item.name}</strong><p>${item.reason}</p></div>
              </li>
            `,
              )
              .join("")}
          </ul>
        </div>
        <div class="sg-column sg-avoid">
          <h3 class="sg-header sg-header-avoid">❌ Avoid</h3>
          <ul class="sg-list">
            ${dietData.fruitsGuide.nonEatable
              .map(
                (item) => `
              <li>
                <div class="sg-emoji">${item.emoji}</div>
                <div><strong>${item.name}</strong><p>${item.reason}</p></div>
              </li>
            `,
              )
              .join("")}
          </ul>
        </div>
      </div>
    `,
    "Fruit is food, not a free snack. Use one small whole-fruit portion only, and avoid juice.",
  );
}

function renderMythBusters() {
  if (!dietData.mythBusters) return "";

  const cards = dietData.mythBusters.map(
    (item) => `
    <article class="lifestyle-card" style="border-left: 4px solid var(--attention); padding: 15px; position: relative;">
      <span class="badge badge-monitor" style="position: absolute; top: 8px; right: 8px; font-size: 10px;">${item.category}</span>
      <div style="font-weight: 700; color: #C62828; margin-bottom: 8px; font-size: 14px; padding-right: 80px;">❌ Myth: ${item.myth}</div>
      <div style="font-weight: 600; color: #2E7D32; margin-bottom: 8px; font-size: 14px;">✅ Fact: ${item.fact}</div>
      <p style="font-size: 13px; margin: 0; color: var(--slate); font-style: italic;">👉 ${item.hindi}</p>
    </article>
  `,
  );

  return section(
    "🚫 Diabetes & Health Myth-Busters",
    cardGrid(cards),
    "Common patient myths and wrong beliefs about medications, food, fruits, pulses, and herbs debunked with clinical facts.",
  );
}
function renderClinicalProtocols() {
  if (!dietData.fastingHyperglycemiaProtocol || !dietData.integrativeProtocols)
    return "";

  const fhp = dietData.fastingHyperglycemiaProtocol;
  const ip = dietData.integrativeProtocols;

  return `
    <div class="section">
      <div class="section-title">⚕️ Clinical Optimization Protocols</div>
      
      <!-- PROTOCOLS SIDE-BY-SIDE GRID -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px; margin-bottom:30px;">
        
        <!-- FASTING HYPERGLYCEMIA CARD -->
        <article class="recipe-card" style="padding: 24px; border-left: 5px solid var(--attention); background: var(--attention-bg);">
          <div class="recipe-title" style="color: var(--attention); font-size:16px; margin-bottom:6px;">📈 ${fhp.title}</div>
          <p style="font-size:13px; color: var(--text-secondary); margin-bottom:15px; font-style:italic;">${fhp.description}</p>
          <ul style="list-style: none; padding: 0;">
            ${fhp.steps
              .map(
                (step) => `
              <li style="margin-bottom:12px; font-size:13px; border-bottom: 1px solid var(--border); padding-bottom:10px;">
                <strong style="color: var(--text-primary); display:block; margin-bottom:4px;">${step.title}</strong>
                <span style="color: var(--text-secondary);">${step.detail}</span>
              </li>
            `,
              )
              .join("")}
          </ul>
        </article>

        <!-- INTEGRATIVE ALLOPATHY + AYURVEDA CARD -->
        <article class="recipe-card" style="padding: 24px; border-left: 5px solid var(--ok); background: var(--ok-bg);">
          <div class="recipe-title" style="color: var(--ok); font-size:16px; margin-bottom:6px;">🌿 ${ip.title}</div>
          <p style="font-size:13px; color: var(--text-secondary); margin-bottom:15px; font-style:italic;">${ip.description}</p>
          <ul style="list-style: none; padding: 0;">
            ${ip.protocols
              .map(
                (p) => `
              <li style="margin-bottom:12px; font-size:13px; border-bottom: 1px solid var(--border); padding-bottom:10px;">
                <strong style="color: var(--text-primary); display:block; margin-bottom:4px;">🔄 ${p.name}</strong>
                <span style="color: var(--text-secondary); display:block; margin-bottom:4px;">${p.rationale}</span>
                <span class="hindi-note" style="margin-top:4px; font-size:12px; font-weight:600; padding:4px 8px; border-radius:4px; display:inline-block; border-left: 2px solid var(--attention); background: var(--attention-bg); color: var(--attention);">${p.warning}</span>
              </li>
            `,
              )
              .join("")}
          </ul>
        </article>

      </div>
    </div>
  `;
}

async function render() {
  const content = document.getElementById("content-area");

  // Trigger CSS transition reflow
  content.style.animation = "none";
  content.offsetHeight; // Reflow
  content.style.animation = "";

  content.innerHTML = ""; // Clear existing

  if (currentTab === "diet") {
    renderDietChart(content);
  } else if (currentTab === "categories") {
    renderCategories(content);
  } else if (currentTab === "guidelines") {
    renderGuidelines(content);
  } else if (currentTab === "reports") {
    await renderReports(content);
  }
}

function renderDietChart(container) {
  let html = `
    <section class="care-brief">
      <div>
        <div class="eyebrow">Use this first</div>
        <h2>Today’s simple plan</h2>
        <p>Keep meals regular, keep portions measured, take medicines exactly as prescribed, and make every tea break smoke-free if possible.</p>
      </div>
      <ul class="focus-list" aria-label="Today's focus">
        <li><strong>Meals:</strong> fixed timing, no skipped meals</li>
        <li><strong>Sugar:</strong> monitor fasting and symptoms</li>
        <li><strong>Pancreas:</strong> low-oil food, Panlipase with first bite</li>
        <li><strong>Smoking:</strong> replace one cigarette break with water or walk</li>
      </ul>
    </section>

    ${dietData.conditionSummary ? section("🧭 Current Snapshot", cardGrid(dietData.conditionSummary.map(statusCard), "summary-grid")) : ""}

    ${dietData.safetyFirst ? section("⚕️ Safety First", cardGrid(dietData.safetyFirst.map(statusCard), "summary-grid")) : ""}

    ${section(
      "📅 Daily Schedule",
      `
      <div class="meal-day">
        <div class="meal-rows">
          ${dietData.schedule
            .map(
              (item) => `
            <div class="meal-row ${item.label.startsWith("✨") ? "meal-row-new" : ""}">
              <div class="meal-time">${item.time}<br>${item.label}</div>
              <div class="meal-food">${item.food}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      `,
      "This is the main daily checklist. Keep it boring and consistent; the details below are only for clarification.",
    )}

    ${renderHungerCheck()}

    ${renderQuickPacifiers()}

    ${renderMythBusters()}

    ${
      dietData.simpleAnswers
        ? section(
            "🧾 Simple Answers",
            cardGrid(
              dietData.simpleAnswers.map((a) =>
                simpleCard({
                  title: a.question,
                  body: a.answer,
                }),
              ),
            ),
          )
        : ""
    }

    ${
      dietData.priorityPlan
        ? section(
            "🎯 4-Week Priority Plan",
            `
        <div class="priority-timeline">
          ${dietData.priorityPlan
            .map(
              (p) => `
            <div class="priority-card priority-${p.priority === "🔴" ? "red" : p.priority === "🟡" ? "yellow" : p.priority === "🟢" ? "green" : "blue"}">
              <div class="priority-header">
                <span class="priority-dot">${p.priority}</span>
                <strong>${p.week}</strong>
                <span class="priority-start">${p.start}</span>
              </div>
              <div class="priority-body">${p.items}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      `,
          )
        : ""
    }

    ${
      dietData.smokingCessationPlan
        ? section(
            "🚭 Smoking Quit Plan",
            `
        <div class="safety-warning">
          <strong>Most important lifestyle treatment:</strong> Chain smoking makes diabetes harder to control and multiplies heart, lung, circulation, and cancer risk. Food helps, but quitting tobacco gives the biggest protection.
        </div>
        ${cardGrid(
          dietData.smokingCessationPlan.map((s) =>
            simpleCard({
              title: s.title,
              kicker: `Step ${s.step}`,
              body: `${s.note}<br><span class="hindi-note">${s.hindi}</span>`,
              badgeText: `Step ${s.step}`,
              badgeTone: "attention",
            }),
          ),
        )}
      `,
          )
        : ""
    }

    ${
      dietData.goals
        ? section(
            "🎯 Primary Goals",
            `
        <ul class="clean-list">
          ${dietData.goals.map((g) => `<li>${g}</li>`).join("")}
        </ul>
      `,
          )
        : ""
    }

    <div class="disclaimer">
      This dashboard is a family-friendly guide, not a prescription. Keep all diabetes, BP, liver, and smoking-cessation medication decisions with the treating doctor, especially because insulin and Daparyl M can change sugar levels quickly.
    </div>
  `;
  container.innerHTML = html;
}

function renderCategories(container) {
  let html = `
    <!-- FATHER-FRIENDLY SIMPLE GUIDE -->
    ${
      dietData.simpleGuide
        ? `
    <div class="section">
      <div class="section-title">🌟 Simple Guide: What to Eat & What to Avoid</div>
      <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 30px; font-size: 15px; border: 2px solid #E2E8F0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <p style="margin-bottom: 20px; color: var(--slate); text-align: center; font-weight: 500;">
          <em>This list is custom-made to be safe for <strong>Diabetes</strong>, <strong>Fatty Liver</strong>, <strong>Prostate</strong>, <strong>Digestion</strong>, and <strong>Smoking Recovery</strong> all at once.</em>
        </p>
        <div class="simple-guide-grid">
          <!-- EATABLES -->
          <div class="sg-column sg-eat">
            <h3 class="sg-header sg-header-eat">✅ Safe to Eat</h3>
            <ul class="sg-list">
              ${dietData.simpleGuide.eatables
                .map(
                  (item) => `
                <li>
                  <div class="sg-emoji">${item.emoji}</div>
                  <div>
                    <strong>${item.item}</strong>
                    <p>${item.reason}</p>
                  </div>
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
          <!-- AVOIDABLES -->
          <div class="sg-column sg-avoid">
            <h3 class="sg-header sg-header-avoid">❌ Strictly Avoid</h3>
            <ul class="sg-list">
              ${dietData.simpleGuide.avoidables
                .map(
                  (item) => `
                <li>
                  <div class="sg-emoji">${item.emoji}</div>
                  <div>
                    <strong>${item.item}</strong>
                    <p>${item.reason}</p>
                  </div>
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
        </div>
      </div>
    </div>
    `
        : ""
    }

    ${renderHungerSnacks()}

    <!-- DALS & LEGUMES -->
    <div class="section">
      <div class="section-title">🥣 Best Dals & Legumes</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:15px; margin-bottom: 30px;">
        ${dietData.dalsAndLegumes
          .map(
            (dal) => `
          <div class="lifestyle-card">
            <div style="font-size:28px; margin-bottom:8px;">${dal.emoji}</div>
            <div style="font-weight:700; font-size:16px; color:var(--navy); margin-bottom:5px;">${dal.name}</div>
            <div style="font-size:13px; color:var(--slate); margin-bottom:8px;">${dal.benefit}</div>
            <div style="font-size:12px; color:var(--info); font-weight:600;">Best for: ${dal.bestFor}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>

    <!-- GRAINS -->
    ${
      dietData.grainGuide
        ? `
    <div class="section">
      <div class="section-title">🌾 Grains & Roti Choices</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:15px; margin-bottom: 30px;">
        ${dietData.grainGuide
          .map(
            (grain) => `
          <div class="lifestyle-card">
            <div style="font-size:28px; margin-bottom:8px;">${grain.emoji}</div>
            <div style="font-weight:700; font-size:16px; color:var(--navy); margin-bottom:5px;">${grain.name}</div>
            <div style="font-size:13px; color:var(--slate); margin-bottom:8px;">${grain.benefit}</div>
            <div style="font-size:12px; color:var(--info); font-weight:600;">How: ${grain.how}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <!-- VEGETABLES CATEGORIES -->
    <div class="section">
      <div class="section-title">🥦 Healing Vegetables</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
        ${dietData.vegetableCategories
          .map(
            (cat) => `
          <div class="recipe-card" style="padding: 15px;">
            <div class="recipe-title" style="font-size:15px; border-bottom: 1px solid var(--border); padding-bottom:8px; margin-bottom:10px;">${cat.category}</div>
            <ul style="list-style: none; padding: 0;">
              ${cat.items
                .map(
                  (v) => `
                <li style="margin-bottom:10px; font-size:13px;">
                  <strong style="color:var(--navy); display:block;">${v.name}</strong>
                  <span style="color:var(--slate); font-style:italic;">${v.reason}</span>
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>

    ${renderFruitsGuide()}

    <!-- PROTECTIVE DRINKS -->
    ${
      dietData.protectiveDrinks
        ? `
    <div class="section">
      <div class="section-title">🥤 Protective Drinks</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
        ${dietData.protectiveDrinks
          .map(
            (d) => `
          <div class="drink-card">
            <div style="font-size:28px; margin-bottom:8px;">${d.emoji}</div>
            <div style="font-weight:700; font-size:15px; margin-bottom:4px; color:var(--navy);">${d.name}</div>
            <div style="font-size:12px; color:var(--info); margin-bottom:6px; font-weight:600;">${d.when}</div>
            <div style="font-size:13px; color:var(--slate);">${d.note}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }
    <!-- LIVER PROTOCOL -->
    ${
      dietData.liverProtocol
        ? `
    <div class="section">
      <div class="section-title">🌿 Clinician-Review Liver Protocol</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:12px;">
        ${dietData.liverProtocol
          .map(
            (p) => `
          <div class="lifestyle-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div style="font-weight:700; font-size:15px; color:var(--navy);">${p.item}</div>
              <span class="badge badge-monitor" style="font-size:10px;">${p.phase}</span>
            </div>
            <div style="font-size:13px; color:var(--slate);">${p.note}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }
    <!-- LIVER HEALING FOODS -->
    ${
      dietData.liverHealingFoods
        ? `
    <div class="section">
      <div class="section-title">🥑 Liver Healing Foods</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:15px;">
        ${dietData.liverHealingFoods
          .map(
            (f) => `
          <div class="lifestyle-card">
            <div style="font-size:28px; margin-bottom:8px;">${f.emoji}</div>
            <div style="font-weight:700; font-size:15px; margin-bottom:4px; color:var(--navy);">${f.name}</div>
            <div style="font-size:12px; color:var(--info); margin-bottom:6px; font-weight:600;">${f.how}</div>
            <div style="font-size:13px; color:var(--slate);">${f.evidence}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <!-- SPICE PROTOCOL -->
    ${
      dietData.spiceProtocol
        ? `
    <div class="section">
      <div class="section-title">🌶️ Food-Level Spice Support</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:15px;">
        ${dietData.spiceProtocol
          .map(
            (s) => `
          <div class="lifestyle-card" style="position:relative;">
            <div style="position:absolute; top:8px; right:8px;">
              <span class="badge badge-monitor" style="font-size:10px;">${s.compound}</span>
            </div>
            <div style="font-weight:700; font-size:15px; margin-bottom:4px; color:var(--navy);">${s.spice}</div>
            <div style="font-size:12px; color:var(--info); margin-bottom:6px; font-weight:600;">Action: ${s.action}</div>
            <div style="font-size:13px; color:var(--slate);">${s.usage}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <!-- RECIPES -->
    <div class="section">
      <div class="section-title">🍳 Recipes</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:15px;">
        ${
          dietData.recipes
            ? dietData.recipes
                .map(
                  (recipe) => `
          <div class="recipe-card">
            <div class="recipe-title">${recipe.title}</div>
            <div class="recipe-details">${recipe.details}</div>
            <ul class="recipe-ingredients">
              ${recipe.ingredients.map((ing) => `<li>${ing}</li>`).join("")}
            </ul>
          </div>
        `,
                )
                .join("")
            : ""
        }
      </div>
    </div>

    <!-- WEEKLY CHECKLIST -->
    ${
      dietData.weeklyChecklist
        ? `
    <div class="section">
      <div class="section-title">✅ Weekly Checklist</div>
      <div class="checklist-table-wrap">
        <table class="checklist-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Haldi food-level</th>
              <th>Amla / Pudina Water</th>
              <th>Fruit Portion</th>
              <th>Cruciferous</th>
              <th>Raw Salad</th>
              <th>Omega-3 (Nuts)</th>
              <th>Karela Sabzi</th>
            </tr>
          </thead>
          <tbody>
            ${dietData.weeklyChecklist
              .map(
                (row) => `
              <tr>
                <td><strong>${row.day}</strong></td>
                ${row.items.map((item) => `<td class="checklist-cell">${item.startsWith("—") ? '<span style="color:var(--slate);">—</span>' : `<span class="check-item">☐ ${item}</span>`}</td>`).join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
    `
        : ""
    }
  `;
  container.innerHTML = html;
}

function renderGuidelines(container) {
  let html = `
    <!-- DIETARY PRECAUTIONS -->
    <div class="section">
      <div class="section-title">⚠️ Dietary Precautions</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:15px;">
        ${
          dietData.precautions
            ? dietData.precautions
                .map(
                  (p) => `
          <div class="lifestyle-card">
            <div style="font-size:28px; margin-bottom:8px;">${p.icon}</div>
            <div style="font-weight:700; font-size:15px; margin-bottom:10px; color:var(--navy);">${p.title}</div>
            <ul style="list-style: none; padding: 0;">
              ${p.rules
                .map(
                  (rule) => `
                <li style="padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 13px; display: flex; align-items: flex-start; gap: 8px;">
                  <span style="color: var(--attention);">•</span>
                  <span style="color:var(--slate);">${rule}</span>
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
        `,
                )
                .join("")
            : ""
        }
      </div>
    </div>

    <!-- STRICT AVOIDANCES -->
    ${
      dietData.avoidFoods
        ? `
    <div class="section">
      <div class="section-title">❌ Strictly Avoid</div>
      <table class="marker-table">
        <thead>
          <tr><th>❌ Avoid</th><th>Reason (Allopathy)</th><th>Reason (Ayurveda)</th></tr>
        </thead>
        <tbody>
          ${dietData.avoidFoods
            .map(
              (a) => `
            <tr>
              <td><strong>${a.item}</strong></td>
              <td style="font-size:13px; color:#C62828;">${a.allopathy}</td>
              <td style="font-size:13px; color:var(--slate);">${a.ayurveda}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    `
        : ""
    }

    <!-- MEDICATIONS -->
    ${
      dietData.medications
        ? `
    <div class="section">
      <div class="section-title">💊 Current Medications</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:15px;">
        ${dietData.medications
          .map(
            (m) => `
          <div class="lifestyle-card">
            <div style="font-size:28px; margin-bottom:8px;">${m.icon}</div>
            <div style="font-weight:700; font-size:15px; margin-bottom:4px; color:var(--navy);">${m.name}</div>
            <div style="font-size:13px; color:var(--slate);">${m.purpose}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <!-- SAFETY NOTES -->
    ${
      dietData.safetyNotes
        ? `
    <div class="section">
      <div class="section-title">🛡️ Medication Safety</div>
      <div class="safety-warning">
        <strong>⚠️ Interaction Alert:</strong> Giloy, Karela, Kutki, Ashwagandha, high-dose cinnamon, and turmeric/curcumin supplements may affect sugar or liver safety. Do not self-start them with Huminsulin + Daparyl M.
      </div>
      <table class="marker-table">
        <thead>
          <tr><th>Item</th><th>Huminsulin</th><th>Daparyl M</th><th>Panlipase</th></tr>
        </thead>
        <tbody>
          ${dietData.safetyNotes
            .map(
              (s) => `
            <tr>
              <td><strong>${s.item}</strong></td>
              <td>${s.insulin}</td>
              <td>${s.daparylM}</td>
              <td>${s.panlipase}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    `
        : ""
    }

    ${renderClinicalProtocols()}

    <!-- LIFESTYLE -->
    <div class="section">
      <div class="section-title">🚶 Lifestyle Rules</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
        ${dietData.lifestyle
          .map(
            (item) => `
          <div class="lifestyle-card">
            <div style="font-size:24px; margin-bottom:8px;">${item.emoji}</div>
            <div style="font-weight:600; font-size:15px; margin-bottom:5px; color:var(--navy);">${item.title}</div>
            <div style="font-size:13px; color:var(--slate);">${item.note}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>

    <!-- GLOSSARY -->
    ${
      dietData.glossary
        ? `
    <div class="section">
      <div class="section-title">📘 Simple Hindi Glossary</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:15px;">
        ${dietData.glossary
          .map(
            (g) => `
          <div class="lifestyle-card">
            <div style="font-weight:700; font-size:15px; color:var(--navy); margin-bottom:4px;">${g.term}</div>
            <div style="font-size:13px; color:var(--info); font-weight:600; margin-bottom:6px;">${g.hindi}</div>
            <div style="font-size:13px; color:var(--slate);">${g.meaning}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <!-- SOURCES -->
    ${
      dietData.webCheckedSources
        ? `
    <div class="section">
      <div class="section-title">🔎 Web-Checked Medical Sources</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:15px;">
        ${dietData.webCheckedSources
          .map(
            (src) => `
          <div class="lifestyle-card">
            <div style="font-weight:700; font-size:15px; color:var(--navy); margin-bottom:4px;">${src.topic}</div>
            <div style="font-size:13px; color:var(--slate); margin-bottom:8px;">${src.takeaway}</div>
            <a href="${src.url}" target="_blank" rel="noopener noreferrer" style="font-size:12px; color:var(--info); font-weight:700;">${src.source}</a>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }
  `;
  container.innerHTML = html;
}

async function renderReports(container) {
  let html = "";

  // Render all reports from manifest
  for (let i = 0; i < manifest.reports.length; i++) {
    const report = await getReport(i);
    html += `
      <div class="section">
        <div class="section-title">📊 Report: ${report.label}</div>
        <p style="margin-bottom:20px; color:var(--slate); font-size:14px;">${report.summary}</p>
        <div class="summary-grid" style="margin-bottom:20px;">
          ${report.keyMarkers
            .map(
              (m) => `
            <div class="summary-card card-${m.status}">
              <div class="card-status status-${m.status}">${m.status}</div>
              <div class="card-title" style="font-weight:600; font-size:12px;">${m.title}</div>
              <div class="card-value status-${m.status}" style="font-size:18px;">${m.value}</div>
            </div>
          `,
            )
            .join("")}
        </div>

        ${report.sections
          .map(
            (s) => `
          <div style="margin-bottom:30px;">
            <div style="font-weight:700; font-size:15px; margin-bottom:10px;">${s.icon} ${s.title}</div>
            ${
              s.type === "table"
                ? `
              <div class="checklist-table-wrap">
                <table class="marker-table">
                  <thead><tr>${s.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
                  <tbody>
                    ${s.rows
                      .map(
                        (row) => `
                      <tr>
                        <td>${row[0]}</td>
                        <td style="font-family: 'DM Mono', monospace; font-weight:600;">${row[1]}</td>
                        <td style="font-size:12px;">${row[2]}</td>
                        <td><span class="badge badge-${row[3]}">${row[3]}</span></td>
                      </tr>
                    `,
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `
                : s.type === "list"
                  ? `
              <ul style="list-style: none; padding: 0;">
                ${s.items
                  .map(
                    (item) => `
                  <li style="padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; display: flex; align-items: flex-start; gap: 8px;">
                    <span style="color: var(--attention);">•</span>
                    <span>${item}</span>
                  </li>
                `,
                  )
                  .join("")}
              </ul>
            `
                  : ""
            }
            ${s.note ? `<p class="section-note">${s.note}</p>` : ""}
          </div>
        `,
          )
          .join("")}

        ${
          report.targets
            ? `
          <div style="margin-bottom:30px;">
            <div style="font-weight:700; font-size:15px; margin-bottom:10px;">🎯 Recovery Targets</div>
            ${simpleTable(
              ["Marker", "Current", "3 months", "6 months"],
              report.targets.map(
                (t) => `
                <tr>
                  <td><strong>${t.marker}</strong></td>
                  <td>${t.current}</td>
                  <td>${t.target3}</td>
                  <td>${t.target6}</td>
                </tr>
              `,
              ),
            )}
          </div>
        `
            : ""
        }
      </div>
      <hr style="border: 0; border-top: 1px solid var(--border); margin: 40px 0;">
    `;
  }

  // Pending Tests
  if (dietData.pendingTests) {
    html += `
      <div class="section">
        <div class="section-title">🧪 Pending Tests</div>
        <table class="marker-table">
          <thead><tr><th>Test</th><th>Order</th><th>Reveals</th></tr></thead>
          <tbody>
            ${dietData.pendingTests
              .map(
                (t) => `
              <tr>
                <td><strong>${t.test}</strong></td>
                <td><span class="badge badge-monitor">${t.orderedBy}</span></td>
                <td style="font-size:13px;">${t.reveals}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  container.innerHTML = html;
}

init();
