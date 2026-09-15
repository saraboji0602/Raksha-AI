# RAKSHA-AI Backend — FastAPI + PostgreSQL/PostGIS

Statutory Decision Support Platform for Multi-Hazard Assessment, Safe Haven Selection, and Resilient Relocation.

---

## 🏛️ System Architecture

```
[ FRONTEND (React 19 + TypeScript + Vite) ]
                     ↓ (HTTP / REST API with resilient fallback)
[ BACKEND (FastAPI + Pydantic v2) ]
                     ↓
[ INGESTION & DATA QUALITY PIPELINE ]
                     ↓ (SQLAlchemy 2.0 ORM + GeoAlchemy2)
[ DATABASE (PostgreSQL 16 + PostGIS Spatial Engine) ]
                     ↓ (Deterministic Multi-Hazard Analytics)
[ CENTRAL RISK & DECISION INTELLIGENCE ENGINE ]
```

---

## 🔄 End-to-End Decision Flow

```
DATASETS / API ADAPTERS
        ↓
DATA VALIDATION (Quality Engine)
        ↓
POSTGRESQL / POSTGIS
        ↓
HAZARD + EXPOSURE + VULNERABILITY + RESILIENCE
        ↓
CENTRAL RISK ENGINE (Decomposed & Explainable)
        ↓
DUAL PRIORITIZATION (Emergency Urgency + Long-Term Relocation)
        ↓
PROTECT / ADAPT / PARTIAL RELOCATION / FULL RELOCATION
        ↓
SAFE-SITE MATCHING + CARRYING CAPACITY ALLOCATION
        ↓
EXISTING FRONTEND DASHBOARD
```

---

## 🧠 Central Risk Engine Formulation

Risk calculation is deterministic, physics-grounded, and configurable:

$$\text{Composite Risk} = \frac{H \cdot w_h + E \cdot w_e + V \cdot w_v + I_{\text{frag}} \cdot w_i + T_{\text{hist}} \cdot w_t + (100 - R) \cdot w_r}{\sum w}$$

- **Hazard ($H$)**: Multiplied by compound hazard synergy factor ($\times 1.22$ to $\times 1.35$) for simultaneous surges/rain/scarp retreat.
- **Exposure ($E$)**: Population situated within the active hazard envelope.
- **Vulnerability ($V$)**: Kutcha housing proportion, elderly/infants, and drinking well salinization.
- **Resilience ($R$)**: Seawall elevation, shelter proximity, and evacuation causeway robustness.

---

## 📂 Dataset Architecture (`backend/data/`)

```
backend/data/
├── raw/         # Staged raw payloads uploaded through API
├── processed/   # Normalized and quality-audited records
├── sample/      # Small deterministic test datasets (Demo / Synthetic)
│   ├── sample_flood_zones.geojson
│   ├── sample_rainfall_stations.csv
│   ├── sample_river_gauges.json
│   ├── sample_habitations.geojson
│   ├── sample_infrastructure.csv
│   └── sample_safe_sites.json
└── metadata/    # Provenance and statutory audit records
```

---

## 📡 API Endpoints Overview

| Method | Path | Summary | Classification |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Backend & database health check | DEMO / SYNTHETIC DATA |
| `GET` | `/api/habitations` | List prioritized vulnerable habitations | DEMO / SYNTHETIC DATA |
| `GET` | `/api/habitations/{id}` | Detailed Digital Twin profile & micro-zones | DEMO / SYNTHETIC DATA |
| `GET` | `/api/risk/habitations` | Explainable decomposed risk for all settlements | DEMO / SYNTHETIC DATA |
| `GET` | `/api/risk/habitations/{id}` | Deep risk breakdown, physics why & contributors | DEMO / SYNTHETIC DATA |
| `GET` | `/api/risk/micro-zones/{id}` | Granular micro-zone risk & evacuation access | DEMO / SYNTHETIC DATA |
| `GET` | `/api/priorities` | Dual prioritization matrix (Emergency + Relocation) | DEMO / SYNTHETIC DATA |
| `GET` | `/api/priorities/{id}` | Single settlement urgency & priority scores | DEMO / SYNTHETIC DATA |
| `GET` | `/api/decisions/{id}` | Protect vs Adapt vs Relocate decision analysis | DEMO / SYNTHETIC DATA |
| `GET` | `/api/safe-sites` | Candidate safe resettlement havens | DEMO / SYNTHETIC DATA |
| `GET` | `/api/safe-sites/{id}/suitability` | Haven suitability, carrying capacity & filters | DEMO / SYNTHETIC DATA |
| `POST` | `/api/scenarios/run` | 5-Policy what-if simulation & 10yr damage curves | DEMO / SYNTHETIC DATA |
| `GET` | `/api/data-quality` | System-wide quality & provenance summary | AUDIT METRICS |
| `POST` | `/api/risk/recalculate` | Event-triggered dynamic recalculation | RECALCULATION |
| `POST` | `/api/datasets/validate` | Pre-ingestion validation & quality report | STATUTORY VALIDATOR |
| `POST` | `/api/datasets/ingest` | Full ingestion into catalog & spatial tables | INGESTION PIPELINE |
| `GET` | `/api/datasets` | List registered dataset catalog | PROVENANCE CATALOG |

---

## 🧪 Running Automated Tests

```bash
cd backend
python -m pytest -v -p no:cacheprovider
```

**Test Suite Coverage (37 Tests Total)**:
- Phase 1 Baseline Habitations & Safe Sites APIs
- Phase 2 CSV & GeoJSON Validation, Quality Engine, and Ingestion
- Phase 3 Central Risk Engine, Compound Hazard Synergy, Micro-Zone Breakdown, Dual Prioritization, Decision Analysis, Safe Site Hard Filters, and What-If Scenario Simulators.

---

> [!NOTE]
> All sample datasets and demo outputs are explicitly classified as `DEMO / SYNTHETIC DATA` to adhere to statutory truth-in-data mandates.
