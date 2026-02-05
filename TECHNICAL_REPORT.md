# NESMA Supply Chain Management Portal
## Technical Documentation Report

**Document Version:** 1.0
**Date:** February 2026
**Prepared by:** Development Team

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Frontend Libraries & Tools](#3-frontend-libraries--tools)
4. [Design System](#4-design-system)
5. [SmartSheet Integration](#5-smartsheet-integration)
6. [Data Architecture](#6-data-architecture)
7. [File Structure](#7-file-structure)
8. [Deployment & Automation](#8-deployment--automation)

---

## 1. Project Overview

### 1.1 Description
NESMA Supply Chain Management Portal is a comprehensive dashboard system for managing procurement, logistics, warehouse operations, and facility management. The system provides real-time KPI tracking, SLA compliance monitoring, and data visualization.

### 1.2 Live URL
```
https://arahman1700.github.io/NIT-Supply-Chain/
```

### 1.3 Key Features
- Real-time data synchronization from SmartSheet
- Interactive dashboards with filtering capabilities
- PDF and Excel export functionality
- SLA compliance tracking with traffic light indicators
- Mobile-responsive design
- Dark/Light theme support

---

## 2. Technology Stack

### 2.1 Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| HTML5 | Structure | - |
| CSS3 | Styling | - |
| JavaScript (ES6+) | Logic & Interactivity | - |
| Tailwind CSS | Utility-first CSS framework | CDN (Latest) |

### 2.2 Backend/Data Processing

| Technology | Purpose |
|------------|---------|
| Python 3.11 | Data sync scripts |
| SmartSheet API | Data source |
| GitHub Actions | Automated sync |
| GitHub Pages | Static hosting |

---

## 3. Frontend Libraries & Tools

### 3.1 CSS Framework

#### Tailwind CSS (CDN)
```html
<script src="https://cdn.tailwindcss.com"></script>
```
- **Purpose:** Utility-first CSS framework for rapid UI development
- **Usage:** Grid layouts, spacing, colors, responsive design
- **Source:** cdn.tailwindcss.com

#### Custom Theme (nesma-theme.css)
- **Size:** 65.7 KB (2,641 lines)
- **Location:** `/assets/nesma-theme.css`
- **Features:**
  - CSS Custom Properties (variables)
  - Component styles (cards, badges, modals)
  - SLA indicator colors
  - Responsive breakpoints
  - Glass-morphism effects
  - Animation keyframes

### 3.2 JavaScript Libraries

#### Chart.js
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```
- **Purpose:** Data visualization (charts, graphs)
- **Used in:** All dashboard pages
- **Chart Types:** Line, Bar, Doughnut, Pie

#### SheetJS (xlsx)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```
- **Purpose:** Excel file generation and parsing
- **Features:** Export data to .xlsx format

#### jsPDF
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```
- **Purpose:** PDF document generation
- **Features:** Export reports to PDF format

#### html2canvas
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```
- **Purpose:** Convert HTML elements to images
- **Usage:** Screenshot functionality for PDF export

#### nesma-utils.js (Custom)
- **Size:** 31.6 KB
- **Location:** `/assets/nesma-utils.js`
- **Features:**
  - NesmaTheme class (theme toggling)
  - Particle effects system
  - Utility functions
  - Mobile detection

### 3.3 Fonts

#### Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

| Font | Purpose | Weights |
|------|---------|---------|
| **Inter** | English text | 300-700 |
| **Cairo** | Arabic text | 300-900 |

### 3.4 Library Usage by Page

| Page | Tailwind | Chart.js | xlsx | jsPDF | html2canvas |
|------|:--------:|:--------:|:----:|:-----:|:-----------:|
| index.html | ✅ | ❌ | ❌ | ❌ | ❌ |
| procurement_dashboard.html | ✅ | ✅ | ✅ | ✅ | ✅ |
| transport_dashboard.html | ✅ | ✅ | ✅ | ✅ | ✅ |
| warehouse_dashboard.html | ✅ | ✅ | ✅ | ✅ | ✅ |
| facility_dashboard.html | ✅ | ✅ | ✅ | ✅ | ✅ |
| assets_dashboard.html | ✅ | ✅ | ✅ | ✅ | ✅ |
| lease_dashboard.html | ✅ | ✅ | ✅ | ✅ | ✅ |
| sla_requirements.html | ✅ | ❌ | ❌ | ❌ | ❌ |
| monthly_report.html | ✅ | ❌ | ❌ | ❌ | ❌ |
| report_viewer.html | ✅ | ❌ | ✅ | ❌ | ❌ |

---

## 4. Design System

### 4.1 Color Palette

#### Primary Colors
```css
:root {
    --nesma-primary: #2E3192;    /* Navy Blue */
    --nesma-secondary: #80D1E9;  /* Cyan */
    --nesma-navy: #0E2841;       /* Dark Navy */
    --nesma-dark-blue: #203366;  /* Medium Blue */
}
```

#### Status Colors
```css
/* SLA Status Indicators */
.sla-green  { background: #10b981; }  /* ≥95% - Meeting target */
.sla-yellow { background: #fbbf24; }  /* 85-94% - Warning */
.sla-red    { background: #ef4444; }  /* <85% - Below target */

/* Badge Colors */
.badge-success { background: rgba(16, 185, 129, 0.2); color: #10b981; }
.badge-warning { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
.badge-danger  { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
```

### 4.2 Typography Scale
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### 4.3 Spacing System
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### 4.4 Responsive Breakpoints
```css
/* Mobile First Approach */
@media (max-width: 480px)  { /* Small phones */ }
@media (max-width: 768px)  { /* Tablets */ }
@media (min-width: 769px)  { /* Desktop */ }
@media (min-width: 1024px) { /* Large screens */ }
@media (min-width: 1280px) { /* Extra large */ }
```

### 4.5 Visual Effects

#### Glass-morphism
```css
.glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
}
```

#### Gradients
```css
/* Background Gradient */
background: linear-gradient(135deg,
    #0E2841 0%,
    #203366 40%,
    #2E3192 70%,
    #3B2060 100%
);

/* Icon Gradients */
.logistics-gradient { background: linear-gradient(135deg, #92A185, #6B7C60); }
.procurement-gradient { background: linear-gradient(135deg, #2E3192, #5B2D8E); }
.warehouse-gradient { background: linear-gradient(135deg, #DEC18C, #B08F55); }
.facility-gradient { background: linear-gradient(135deg, #AD8082, #7D5658); }
```

---

## 5. SmartSheet Integration

### 5.1 Overview
The system pulls data from SmartSheet using their REST API. Data synchronization is automated through GitHub Actions and runs on a scheduled basis.

### 5.2 SmartSheet Sheets Configuration

| Sheet Name | Sheet ID | Purpose |
|------------|----------|---------|
| Job Orders Tracking | 2606397737881476 | SLA/Transportation/Payments |
| PR to PO Report | 2967308268949380 | Procurement data |

### 5.3 API Authentication
```python
# Environment variable required
SMARTSHEET_TOKEN = os.environ.get('SMARTSHEET_TOKEN')

# API Headers
headers = {
    'Authorization': f'Bearer {SMARTSHEET_TOKEN}',
    'Content-Type': 'application/json'
}
```

### 5.4 API Endpoint
```
GET https://api.smartsheet.com/2.0/sheets/{sheet_id}
```

### 5.5 Data Flow Architecture

```
┌─────────────────┐
│   SmartSheet    │
│   (Cloud)       │
└────────┬────────┘
         │ API Call
         ▼
┌─────────────────┐
│  Python Scripts │
│  (sync_*.py)    │
└────────┬────────┘
         │ Process & Calculate KPIs
         ▼
┌─────────────────┐
│   JSON Files    │
│   (data/*.json) │
└────────┬────────┘
         │ Fetch via JavaScript
         ▼
┌─────────────────┐
│   Dashboards    │
│   (*.html)      │
└─────────────────┘
```

### 5.6 Sync Scripts

#### sync_smartsheet.py
- **Purpose:** Main SLA/Transportation/Payments sync
- **Output:** `data.js`, `transportation_full_data.json`, `payments_full_data.json`

#### sync_procurement.py
- **Purpose:** PR to PO data sync
- **Output:** `data/pr_data.json`

#### sync_logistics.py
- **Purpose:** Logistics and transportation data
- **Output:** `data/transport_data.json`

### 5.7 Column Mappings

#### Job Orders Sheet Columns
```python
JOB_ORDERS_COLUMNS = {
    '#': 'id',
    'Job Order No.': 'job_order_no',
    'Job Order Date': 'job_order_date',
    'Requesting Project': 'project',
    'Requester Name': 'requester',
    'Type of Equipment': 'equipment_type',
    'Requested Job Date': 'requested_date',
    'Job Performed By Logistics': 'performed',
    'Job Completion Date': 'completion_date',
    'Completion Time (Days)': 'completion_days',
    'Supplier': 'supplier',
    'Cost (Excluding VAT)': 'cost',
    'Invoice Applicable': 'invoice_applicable',
    'Invoice Received': 'invoice_received',
    'Invoice Receive Time (Days)': 'invoice_receive_days',
    'Payment Status': 'payment_status',
    'Payment Cycle (Days)': 'payment_cycle_days',
    'Comments': 'comments'
}
```

#### PR to PO Sheet Columns
```python
PR_COLUMNS = {
    'Pr Num': 'pr_num',
    'Project Name': 'project',
    'PR Status': 'status',
    'PR Submission Date': 'submission_date',
    'PR Approved Date': 'approved_date',
    'PR Return Date': 'return_date',
    'PR Value': 'pr_value',
    'Po Num': 'po_num',
    'Vendor Name': 'vendor',
    'PO Value': 'po_value',
    'PR to PO in days': 'pr_to_po_days'
}
```

### 5.8 KPI Calculations

#### SLA KPIs
```python
# On-time rate (completed within 3 days)
on_time = sum(1 for t in completion_times if t <= 3)
on_time_rate = (on_time / len(completion_times) * 100)

# Average duration
avg_duration = sum(completion_times) / len(completion_times)

# Status breakdown
done = sum(1 for o in orders if o.get('performed') == 'Yes')
in_progress = sum(1 for o in orders if o.get('performed') == 'Yes' and not o.get('completion_date'))
```

#### Procurement KPIs
```python
# Return rate
return_rate = (returned_count / approved_count) * 100

# Average PR to PO cycle time
avg_pr_to_po = sum(valid_days) / len(valid_days)

# Within target (30 days)
within_30_days = len([d for d in valid_days if d <= 30])
```

---

## 6. Data Architecture

### 6.1 JSON Data Files

| File | Size | Records | Description |
|------|------|---------|-------------|
| pr_data.json | 4.8 MB | 6,738 PRs | Procurement records |
| warehouse_data.json | 2.5 MB | ~10,000 | Inventory data |
| transport_data.json | 707 KB | ~2,000 | Logistics records |
| assets_data.json | 708 KB | 2,000+ | Equipment tracking |
| facility_data.json | 490 KB | - | Accommodation data |
| vendor_data.json | 21.9 KB | 45 | Vendor evaluations |
| tarshid_data.json | 5.5 KB | - | Tarshid projects |
| lease_data.json | 17.5 KB | 22 | Lease contracts |
| scrap_data.json | 128 KB | - | Scrap/disposal records |
| project_completion_data.json | 8.3 KB | - | Project tracking |

### 6.2 Data Structure Example

#### pr_data.json
```json
{
  "last_updated": "2026-02-02T13:28:41",
  "summary": {
    "total_prs": 6738,
    "total_approved": 5219,
    "total_returned": 767,
    "avg_pr_to_po_days": 47.5
  },
  "monthly": {
    "2025-01": { "approved": 191, "returned": 26, "rejected": 21 }
  },
  "filters": {
    "projects": ["Project A", "Project B"],
    "vendors": ["Vendor 1", "Vendor 2"],
    "years": ["2025", "2024", "2023"]
  },
  "records": [
    {
      "pr_num": "PR-001",
      "project": "Project A",
      "vendor": "Vendor 1",
      "status": "APPROVED",
      "pr_value": 50000,
      "pr_to_po_days": 15
    }
  ]
}
```

---

## 7. File Structure

```
NIT-Supply-Chain/
├── index.html                          # Main portal (entry point)
├── procurement_dashboard.html          # PR Analysis & Vendor Evaluation
├── transport_dashboard.html            # Logistics & Transportation
├── warehouse_dashboard.html            # Inventory Management
├── facility_dashboard.html             # Accommodation & Maintenance
├── assets_dashboard.html               # Equipment Tracking
├── lease_dashboard.html                # Lease Management
├── sla_requirements.html               # SLA Documentation
├── monthly_report.html                 # Monthly Report Viewer
├── report_viewer.html                  # Report Utility
│
├── assets/
│   ├── nesma-theme.css                 # Main CSS theme (65.7 KB)
│   ├── nesma-utils.js                  # JavaScript utilities (31.6 KB)
│   ├── logo-white.svg                  # NESMA logo (SVG)
│   ├── nit-logo-white.svg              # NIT logo (SVG)
│   ├── nit-supply-chain-logo.png       # Hero logo (256 KB)
│   └── nit-logistics-icon.png          # Logistics icon (777 KB)
│
├── data/
│   ├── pr_data.json                    # Procurement data
│   ├── warehouse_data.json             # Inventory data
│   ├── transport_data.json             # Logistics data
│   ├── assets_data.json                # Equipment data
│   ├── facility_data.json              # Facility data
│   ├── vendor_data.json                # Vendor data
│   ├── lease_data.json                 # Lease contracts
│   └── ...
│
├── scripts/
│   ├── export_procurement_data.py      # Manual export script
│   └── export_warehouse_data.py        # Manual export script
│
├── sync_smartsheet.py                  # Main sync script
├── sync_smartsheet_data.py             # PR sync script
├── sync_logistics.py                   # Logistics sync
├── sync_procurement.py                 # Procurement sync
├── sync_sla.py                         # SLA sync
│
├── .github/
│   └── workflows/
│       ├── deploy.yml                  # GitHub Pages deployment
│       ├── sync.yml                    # Main sync workflow
│       ├── update-procurement-data.yml # Procurement auto-sync
│       └── update-warehouse-data.yml   # Warehouse auto-sync
│
├── attachments/
│   └── vendor_evaluations/             # 45 vendor PDF files
│
├── reports/
│   ├── slides/                         # 29 JPG presentation slides
│   └── *.xlsx                          # Excel reports
│
├── CLAUDE.md                           # Development guide
└── README.md                           # Project documentation
```

---

## 8. Deployment & Automation

### 8.1 Hosting
- **Platform:** GitHub Pages
- **URL:** https://arahman1700.github.io/NIT-Supply-Chain/
- **Branch:** main (auto-deploy)

### 8.2 GitHub Actions Workflows

#### Sync Workflow (sync.yml)
- **Schedule:** Every 4 hours (`0 */4 * * *`)
- **Trigger:** Manual or scheduled
- **Actions:**
  1. Checkout repository
  2. Setup Python 3.11
  3. Install dependencies (requests)
  4. Run sync_sla.py
  5. Run sync_logistics.py
  6. Run sync_procurement.py
  7. Commit and push changes

#### Procurement Update (update-procurement-data.yml)
- **Schedule:** Every 6 hours (`0 */6 * * *`)
- **Output:** `data/pr_data.json`

#### Warehouse Update (update-warehouse-data.yml)
- **Schedule:** Every 6 hours
- **Output:** `data/warehouse_data.json`

### 8.3 Required Secrets
```
SMARTSHEET_TOKEN    # SmartSheet API access token
SMARTSHEET_ACCESS_TOKEN  # Alternative token name
```

### 8.4 Manual Sync Command
```bash
# Set environment variable
export SMARTSHEET_TOKEN="your_token_here"

# Run sync scripts
python sync_smartsheet.py
python sync_procurement.py
python sync_logistics.py
```

---

## Appendix A: CDN Sources

| Library | CDN URL |
|---------|---------|
| Tailwind CSS | `https://cdn.tailwindcss.com` |
| Chart.js | `https://cdn.jsdelivr.net/npm/chart.js` |
| SheetJS | `https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js` |
| jsPDF | `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js` |
| html2canvas | `https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js` |
| Google Fonts | `https://fonts.googleapis.com/css2?family=Cairo&family=Inter` |

---

## Appendix B: Browser Support

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Requires -webkit- prefixes |
| Edge | 90+ | Full support |
| iOS Safari | 14+ | backdrop-filter disabled on mobile |

---

## Appendix C: Setup Instructions

### Local Development
```bash
# Clone repository
git clone https://github.com/arahman1700/NIT-Supply-Chain.git
cd NIT-Supply-Chain

# Start local server
python -m http.server 8000

# Open in browser
open http://localhost:8000
```

### SmartSheet API Setup
1. Login to SmartSheet
2. Go to Account > Personal Settings > API Access
3. Generate new access token
4. Add token to GitHub Secrets as `SMARTSHEET_TOKEN`

---

**End of Document**
