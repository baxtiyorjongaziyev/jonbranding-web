# OISHA-OS — SELF-IMPROVING SYSTEM ARCHITECTURE

## MAQSAD
Oisha-OS o'zini o'zi tahlil qilib, kamchiliklarni topib, AI agentlar yordamida avtomatik tuzatib boradigan **avtonom rivojlantirish tizimi** bo'lishi.

---

## 1. SELF-AUDIT MODULES (O'ZINI TEKSHIRISH MODULLARI)

### 1.1 Code Health Scanner
```python
# src/self_improvement/code_auditor.py
class CodeAuditor:
    def scan(self) -> AuditReport:
        return AuditReport(
            complexity=self._cyclomatic_complexity(),
            duplicates=self._find_duplicates(),
            dead_code=self._find_unused(),
            security=self._security_patterns(),
            performance=self._perf_anti_patterns(),
            test_coverage=self._coverage_gaps(),
            deps=self._outdated_deps()
        )
```

### 1.2 Runtime Telemetry Analyzer
```python
# src/self_improvement/telemetry_analyzer.py
class TelemetryAnalyzer:
    def analyze(self, window_hours=24) -> TelemetryReport:
        return TelemetryReport(
            error_rates=self._error_patterns(),
            latency_p95=self._latency_distribution(),
            memory_leaks=self._memory_growth(),
            cpu_spikes=self._cpu_anomalies(),
            failed_jobs=self._cron_failures(),
            api_quotas=self._quota_usage()
        )
```

### 1.3 Business Logic Validator
```python
# src/self_improvement/business_validator.py
class BusinessValidator:
    def validate(self) -> BusinessReport:
        return BusinessReport(
            lead_conversion=self._conversion_funnel(),
            pipeline_stuck=self._stuck_deals(),
            calendar_sync=self._calendar_gaps(),
            amocrm_sync=self._crm_drift(),
            kpi_accuracy=self._kpi_drift(),
            revenue_leaks=self._unbilled_work()
        )
```

### 1.4 Architecture Drift Detector
```python
# src/self_improvement/arch_drift.py
class ArchDriftDetector:
    def detect(self) -> DriftReport:
        return DriftReport(
            circular_deps=self._circular_imports(),
            god_classes=self._large_modules(),
            interface_violations=self._broken_contracts(),
            config_drift=self._env_vs_prod(),
            schema_drift=self._db_vs_models()
        )
```

---

## 2. IMPROVEMENT PROPOSAL ENGINE (TAKLIF MOTORI)

### 2.1 Gap → Task Converter
```python
# src/self_improvement/proposal_engine.py
class ProposalEngine:
    def generate_tasks(self, reports: List[Report]) -> List[ImprovementTask]:
        tasks = []
        for report in reports:
            for finding in report.findings:
                tasks.append(ImprovementTask(
                    id=f"IMP-{finding.category}-{hash(finding)}",
                    title=finding.title,
                    description=finding.description,
                    impact=finding.impact_score,      # 1-10
                    effort=finding.effort_estimate,   # hours
                    risk=finding.risk_level,          # low/med/high
                    category=finding.category,        # code/perf/sec/biz/arch
                    acceptance_criteria=finding.fix_verification,
                    suggested_approach=finding.suggested_fix,
                    dependencies=[],
                    status="proposed"
                ))
        return self._prioritize(tasks)
    
    def _prioritize(self, tasks) -> List[ImprovementTask]:
        # ICE scoring: Impact * Confidence / Effort
        for t in tasks:
            t.ice_score = (t.impact * t.confidence) / max(t.effort, 0.5)
        return sorted(tasks, key=lambda x: x.ice_score, reverse=True)
```

### 2.2 Auto-Generated Task Examples
```json
{
  "id": "IMP-PERF-001",
  "title": "Telegram message fetch N+1 query in analyze_private_chats",
  "category": "performance",
  "impact": 8,
  "effort": 2,
  "risk": "low",
  "description": "get_dialogs + iter_messages per chat = 25 API calls. Batch with GetMessagesRequest",
  "acceptance": "API latency < 2s for 25 chats",
  "suggested_fix": "Use client.get_messages with multiple entity IDs in single request"
}
```

---

## 3. AI AGENT ORCHESTRATOR (AI AGENT BOSHQARUVCHISI)

### 3.1 Agent Registry
```python
# src/self_improvement/agent_orchestrator.py
class AgentOrchestrator:
    AGENTS = {
        "code_fixed["refactorer", "tester", "security", "perf", "documenter", "architect"]
    }
    
    def assign(self, task: ImprovementTask) -> AgentPlan:
        agent = self._select_agent(task.category)
        return AgentPlan(
            task_id=task.id,
            agent=agent,
            context=self._build_context(task),
            steps=self._decompose(task),
            validation=self._build_validation(task)
        )
```

### 3.2 Agent Specializations
| Agent | Vazifasi | Tools |
|-------|----------|-------|
| **refactorer** | Kod tozalash, DRY, SOLID | AST, rope, libcst |
| **tester** | Test yozish, coverage | pytest, hypothesis |
| **security** | Vuln scan, secrets, deps | bandit, safety, semgrep |
| **perf** | Profiling, query opt, caching | py-spy, sqlalchemy, redis |
| **documenter** | Docstring, README, ADR | pdoc, mkdocs |
| **architect** | Modul ajratish, interface | dependency-graph, plantuml |

---

## 4. EXECUTION PIPELINE (BAJARISH KONVEYERI)

### 4.1 Autonomous Loop
```python
# src/self_improvement/autonomous_loop.py
class AutonomousImprover:
    async def run_cycle(self):
        # 1. AUDIT
        reports = await self.audit_all()
        
        # 2. PROPOSE
        tasks = self.engine.generate_tasks(reports)
        
        # 3. FILTER (human approval for high-risk)
        approved = self._filter_approval(tasks)
        
        # 4. EXECUTE
        for task in approved[:3]:  # max 3 parallel
            result = await self.execute_task(task)
            self._record_result(task, result)
        
        # 5. VERIFY
        verified = await self.verify_fixes()
        
        # 6. LEARN
        self._update_knowledge_base(verified)
        
        # 7. SCHEDULE NEXT
        await self.schedule_next_cycle()
```

### 4.2 Safety Gates
```python
SAFETY_RULES = {
    "max_parallel_tasks": 3,
    "require_human_approval": ["security", "arch", "data_migration"],
    "auto_rollback_on": ["test_failure", "perf_regression", "error_spike"],
    "max_daily_changes": 10,
    "protected_paths": ["src/main.py", "src/auth*", "migrations/"],
    "canary_deployment": True
}
```

---

## 5. KNOWLEDGE BASE (BILIMLAR BAZASI)

### 5.1 Vector Memory
```python
# src/self_improvement/knowledge.py
class KnowledgeBase:
    def __init__(self):
        self.vector_store = ChromaDB("oisha_knowledge")
    
    def store_learning(self, task: ImprovementTask, result: TaskResult):
        doc = f"""
        Task: {task.title}
        Category: {task.category}
        Approach: {task.suggested_approach}
        Result: {result.status}
        Lessons: {result.lessons_learned}
        Code_changes: {result.files_changed}
        """
        self.vector_store.add(doc, metadata={
            "category": task.category,
            "success": result.status == "success",
            "date": datetime.now().isoformat()
        })
    
    def query_similar(self, problem: str, k=5) -> List[Learning]:
        return self.vector_store.similarity_search(problem, k=k)
```

### 5.2 Pattern Library (Avtomatik o'sib boradi)
- **Fixed patterns**: "N+1 query → batch request"
- **Anti-patterns**: "Sync HTTP in async handler → httpx.AsyncClient"
- **Security fixes**: "Hardcoded secret → env var + secret manager"
- **Perf fixes**: "No index → CREATE INDEX CONCURRENTLY"

---

## 6. INTEGRATION POINTS (OISHA-OS GA ULASH)

### 6.1 Telegram Command
```
/improve status          # Oxirgi audit natijasi
/improve propose         # Yangi takliflar ro'yxati  
/improve run IMP-XXX     # Bitta taskni bajarish
/improve approve IMP-XXX # Riskli taskga ruxsat
/improve learn           # Bilimlar bazasini ko'rsat
```

### 6.2 Scheduled Jobs (Cron)
```yaml
# .github/workflows/self-improve.yml
schedule:
  - cron: "0 3 * * *"      # Har kuni 03:00 audit
  - cron: "0 4 * * 1"      # Har dushanba 04:00 major cycle
```

### 6.3 Webhook for External Triggers
```python
@app.post("/webhook/improve-trigger")
async def improve_trigger(event: TriggerEvent):
    if event.type == "deploy_failed":
        return await autonomous_improver.emergency_fix(event.error)
    if event.type == "perf_alert":
        return await autonomous_improver.perf_investigation(event.metric)
```

---

## 7. MVP ROADMAP (4 HAFTA)

### HAFTA 1: Foundation
- [ ] `CodeAuditor` - static analysis (complexity, duplicates, dead code)
- [ ] `TelemetryAnalyzer` - error rates, latency, memory
- [ ] `ProposalEngine` - findings → ICE prioritized tasks
- [ ] Knowledge base schema + ChromaDB setup

### HAFTA 2: Agents
- [ ] `AgentOrchestrator` - task decomposition, context building
- [ ] `RefactorerAgent` - AST-based safe refactors
- [ ] `TesterAgent` - pytest generation for uncovered code
- [ ] Safety gates + rollback mechanism

### HAFTA 3: Business Logic
- [ ] `BusinessValidator` - conversion, pipeline, CRM drift
- [ ] `ArchDriftDetector` - circular deps, god classes
- [ ] Telegram slash commands integration
- [ ] Canary deployment + monitoring

### HAFTA 4: Autonomy
- [ ] Full autonomous loop (audit→propose→execute→verify→learn)
- [ ] Scheduled cron jobs
- [ ] Webhook triggers (deploy fail, perf alert)
- [ ] Dashboard: /improve dashboard (real-time)

---

## 8. AI AGENTLARGA TOPSHIRIQ LAR (SENGA YORDAM)

### Siz (Human) qilishingiz kerak:
1. **Config sozlash**: `.env` da `SELF_IMPROVE_ENABLED=true`
2. **Approval**: Riskli tasklar (`security`, `arch`, `data_migration`) uchun `/improve approve`
3. **Ko'rsatmalar**: "Bu pattern yoqmadi", "Shu yerda xato bor" deb feedback berish
4. **Strategic**: Qaysi kategoriya ustuvor (perf vs security vs features)

### AI Agentlar (Avtomatik) qilishi:
1. **Kod o'qish** → muammo topish → task yaratish
2. **Test yozish** → coverage oshirish
3. **Refactor** → DRY, SOLID, type hints
4. **Security scan** → vuln tuzatish
5. **Perf profiling** → bottleneck olib tashlash
6. **Doc yozish** → docstring, README, ADR
6. **Bilim saqlash** → keyingi marta tezroq hal qilish

---

## 9. METRICS (MUVAFFAQIYAT KO'RSATKICHLARI)

| Metric | Target | Current |
|--------|--------|---------|
| Code complexity (avg) | < 10 | ~15 |
| Test coverage | > 80% | ~30% |
| Security vulns (high) | 0 | 3-5 |
| Deploy failure rate | < 5% | ~15% |
| Mean time to fix (MTTF) | < 2h | ~1 day |
| Auto-fixed issues/week | > 10 | 0 |
| Knowledge base size | > 500 patterns | 0 |

---

## 10. STARTER COMMANDS (BOSHLASH UCHUN)

```bash
# 1. Modul tuzilishi yaratish
mkdir -p src/self_improvement/{auditors,agents,knowledge,orchestrator}

# 2. Dependencies
pip install libcst bandit safety semgrep py-spy chromadb hypothesis

# 3. Birinchi audit
python -m src.self_improvement.auditors.code_auditor

# 4. Telegram command register
# src/telegram_commands/improve.py ga qo'shish

# 5. Systemd timer
# /etc/systemd/system/oisha-improve.timer yaratish
```

---

## XULOSA

**Oisha-OS o'zini o'zi rivojlantirishi uchun kerak:**
1. **Audit modullari** (kod, telemetriya, biznes, arxitektura)
2. **Proposal engine** (ICE scoring, prioritization)
3. **AI agent orchestrator** (6 xuslashtirilgan agent)
4. **Safety gates** (approval, rollback, canary)
5. **Knowledge base** (vector memory, pattern library)
6. **Integration** (Telegram, cron, webhook)
7. **MVP 4 hafta** → production-ready self-improving system

**Birinchi qadam**: `src/self_improvement/` paketini yaratib, `CodeAuditor` va `TelemetryAnalyzer` ni implement qilamiz. Keyin `ProposalEngine` va bir `RefactorerAgent` bilan test cycle ochamiz.

Tayyormi? Boshlaymizmi?