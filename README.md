# NESMA Supply Chain Management Portal

A comprehensive dashboard system for managing supply chain operations including logistics, procurement, and warehouse management.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

## Overview

This portal provides real-time dashboards for:
- **Logistics** - Transportation, equipment tracking, and invoicing
- **Procurement** - Purchase request analysis and vendor evaluation
- **Warehouse** - Inventory and stock management

## Project Structure

```
nesma-dashboard-v02/
├── index.html                    # Main portal entry
├── portal.html                   # Alternative portal
├── logistics_portal.html         # Logistics department portal
├── transportation_dashboard.html # Transportation dashboard
├── payments_dashboard.html       # Payments & invoicing dashboard
├── sla_dashboard.html           # SLA performance dashboard
├── procurement_dashboard.html    # Procurement dashboard
├── warehouse_dashboard.html      # Warehouse dashboard
│
├── js/                          # JavaScript modules
│   ├── core/                    # Core functionality
│   │   ├── config.js            # Application configuration
│   │   └── translations.js      # Multi-language support
│   ├── components/              # Reusable components
│   │   ├── DataService.js       # Data fetching & caching
│   │   ├── ChartManager.js      # Chart management
│   │   ├── FilterManager.js     # Filter management
│   │   ├── TableManager.js      # Table & pagination
│   │   └── UIComponents.js      # UI component library
│   ├── pages/                   # Page-specific scripts
│   └── utils/                   # Utility functions
│       └── helpers.js           # Common helpers
│
├── css/                         # Stylesheets
│   ├── base/                    # Base styles
│   ├── components/              # Component styles
│   └── pages/                   # Page-specific styles
│
├── assets/                      # Static assets
│   ├── nesma-theme.css          # Main theme
│   ├── logo-white.svg           # Logo (white)
│   ├── logo.png                 # Logo (color)
│   └── nit-logistics.png        # NIT Logistics logo
│
├── data/                        # Data files
│   ├── pr_data.json             # Procurement data
│   ├── vendor_data.json         # Vendor evaluation data
│   └── warehouse_data.json      # Warehouse data
│
├── scripts/                     # Python scripts
│   ├── export_procurement_data.py
│   └── export_warehouse_data.py
│
├── attachments/                 # Document attachments
│   └── vendor_evaluations/      # Vendor evaluation PDFs
│
└── .github/                     # GitHub configuration
    └── workflows/               # GitHub Actions
        ├── deploy.yml           # Deploy to GitHub Pages
        ├── sync.yml             # Smartsheet sync
        └── update-procurement-data.yml
```

## Features

### Core Features
- Interactive filters with real-time updates
- Dynamic charts (Chart.js)
- Responsive design (TailwindCSS)
- Multi-language support (English/Arabic)
- Data export (CSV)
- Pagination for large datasets

### Dashboards

#### Transportation Dashboard
- Transport order tracking
- Equipment utilization
- Supplier analysis
- Monthly trends

#### Payments Dashboard
- Invoice management
- Payment cycle analysis
- Supplier distribution
- Project cost tracking

#### Procurement Dashboard
- PR analysis (Approved/Returned)
- Vendor evaluation scores
- Return rate monitoring
- Monthly trends

#### Warehouse Dashboard
- Inventory levels
- Material transfers
- Stock alerts
- Value tracking

## Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| TailwindCSS | Styling |
| Chart.js | Visualizations |
| Vanilla JS | Functionality |
| Python | Data scripts |
| GitHub Actions | CI/CD |

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/arahman1700/nesma-sla-dashboard.git
cd nesma-sla-dashboard
```

2. Start a local server:
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx serve
```

3. Open in browser:
```
http://localhost:8000
```

## Configuration

### config.js
Edit `js/core/config.js` to modify:
- API endpoints
- Theme colors
- Pagination settings
- Feature flags

### Data Sources
Data files in `/data/` are updated via:
- Manual updates
- Smartsheet sync (automated)
- Python export scripts

## Deployment

The project is deployed to GitHub Pages automatically via GitHub Actions.

**Live URL:** https://arahman1700.github.io/nesma-sla-dashboard/

### Manual Deploy
```bash
git add .
git commit -m "Update dashboard"
git push origin main
```

## Adding New Dashboards

1. Create new HTML file using existing templates
2. Add page-specific JS in `js/pages/`
3. Import required components:
```html
<script src="js/core/config.js"></script>
<script src="js/core/translations.js"></script>
<script src="js/utils/helpers.js"></script>
<script src="js/components/DataService.js"></script>
<script src="js/components/ChartManager.js"></script>
<script src="js/components/FilterManager.js"></script>
<script src="js/components/TableManager.js"></script>
<script src="js/components/UIComponents.js"></script>
```

3. Update portal navigation
4. Add data source if needed

## API Integration

### Smartsheet
The system can sync with Smartsheet via API:
- Configure API key in GitHub Secrets
- Workflow runs on schedule or manually

### Adding New Data Sources
1. Add endpoint in `js/core/config.js`
2. Create fetch method in `DataService.js`
3. Update dashboard to use new data

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

## Version History

- **v2.0.0** - Modular architecture, component system
- **v1.5.0** - Added warehouse dashboard
- **v1.0.0** - Initial release

## License

Proprietary - NESMA Infrastructure & Technology

## Contact

For support or inquiries:
- **Department:** Supply Chain Management
- **Company:** NESMA Infrastructure & Technology
