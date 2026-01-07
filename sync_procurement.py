#!/usr/bin/env python3
"""
Sync Procurement (PR to PO) data from Smartsheet
Sheet: PR to PO Report 25th Dec-2025
"""

import os
import json
import requests
from datetime import datetime
from collections import Counter

# Configuration
SMARTSHEET_TOKEN = os.environ.get(
    "SMARTSHEET_TOKEN", "r6WG6zpLw2TR84F54tZCCzMtqjkTlTbuWDiws"
)
PR_TO_PO_SHEET_ID = 5789339180027780  # PR to PO Report 25th Dec-2025

# Column mappings
COLUMN_MAPPINGS = {
    "S.No": "serial_no",
    "Project Name": "project",
    "PR Num": "pr_num",
    "Description": "description",
    "PR Status": "status",
    "PR Closed": "pr_closed",
    "PR Submission Date": "submission_date",
    "Pending With": "pending_with",
    "Pending Since": "pending_since",
    "PR Approved Date": "approved_date",
    "PR Return Date": "return_date",
    "PR Reject Date": "reject_date",
    "PR Note": "pr_note",
    "PR Value": "pr_value",
    "PO Num": "po_num",
    "Revision Num": "revision_num",
    "PO Type": "po_type",
    "Vendor Name": "vendor",
    "Currency Code": "currency",
    "PO Value": "po_value",
    "PO Status": "po_status",
    "PO Approved Date": "po_approved_date",
    "Saving Amount": "saving_amount",
    "PR to PO in days": "pr_to_po_days",
    "Agent": "agent",
}


def get_sheet_data(sheet_id):
    """Fetch data from Smartsheet API"""
    headers = {
        "Authorization": f"Bearer {SMARTSHEET_TOKEN}",
        "Content-Type": "application/json",
    }

    url = f"https://api.smartsheet.com/2.0/sheets/{sheet_id}"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


def process_sheet(sheet_data):
    """Process sheet data into dashboard format"""
    # Build column mapping
    col_map = {}
    for col in sheet_data.get("columns", []):
        if col["title"] in COLUMN_MAPPINGS:
            col_map[col["id"]] = COLUMN_MAPPINGS[col["title"]]

    # Extract PRs
    prs = []
    for row in sheet_data.get("rows", []):
        pr = {}

        for cell in row.get("cells", []):
            col_id = cell.get("columnId")
            value = cell.get("value") or cell.get("displayValue")

            if col_id in col_map and value is not None:
                pr[col_map[col_id]] = value

        # Only add if has PR number
        if pr.get("pr_num"):
            prs.append(pr)

    return prs


def safe_float(value):
    """Safely convert value to float"""
    if value is None:
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    try:
        # Remove currency symbols, commas, spaces
        cleaned = (
            str(value)
            .replace(",", "")
            .replace(" ", "")
            .replace("SAR", "")
            .replace("USD", "")
        )
        return float(cleaned) if cleaned else 0.0
    except:
        return 0.0


def calculate_statistics(all_prs):
    """Calculate KPIs and statistics from PR data"""
    current_year = datetime.now().year

    # Status counts
    status_breakdown = Counter(
        pr.get("status", "UNKNOWN") for pr in all_prs if pr.get("status")
    )

    # Filter PRs by year
    def get_year(pr):
        date_str = pr.get("submission_date") or pr.get("approved_date")
        if date_str:
            try:
                return int(str(date_str)[:4])
            except:
                pass
        return None

    prs_current_year = [pr for pr in all_prs if get_year(pr) == current_year]
    prs_2025 = [pr for pr in all_prs if get_year(pr) == 2025]

    # Current year stats
    approved_current = len(
        [p for p in prs_current_year if p.get("status") == "APPROVED"]
    )
    returned_current = len(
        [p for p in prs_current_year if p.get("status") == "RETURNED"]
    )
    rejected_current = len(
        [p for p in prs_current_year if p.get("status") == "REJECTED"]
    )

    # 2025 stats (for compatibility)
    approved_2025 = len([p for p in prs_2025 if p.get("status") == "APPROVED"])
    returned_2025 = len([p for p in prs_2025 if p.get("status") == "RETURNED"])

    # Monthly breakdown for 2025 (most recent complete year)
    monthly_approved = [0] * 12
    monthly_returned = [0] * 12
    monthly_rejected = [0] * 12

    for pr in prs_2025:
        date_str = pr.get("submission_date") or pr.get("approved_date")
        if date_str:
            try:
                month = int(str(date_str)[5:7]) - 1  # 0-indexed
                if 0 <= month < 12:
                    status = pr.get("status")
                    if status == "APPROVED":
                        monthly_approved[month] += 1
                    elif status == "RETURNED":
                        monthly_returned[month] += 1
                    elif status == "REJECTED":
                        monthly_rejected[month] += 1
            except:
                pass

    # Calculate return rates
    monthly_return_rate = []
    for i in range(12):
        total = monthly_approved[i] + monthly_returned[i]
        if total > 0:
            rate = round((monthly_returned[i] / total) * 100, 1)
        else:
            rate = 0
        monthly_return_rate.append(rate)

    # PR to PO statistics
    valid_days = [
        pr["pr_to_po_days"]
        for pr in all_prs
        if pr.get("pr_to_po_days") and isinstance(pr["pr_to_po_days"], (int, float))
    ]

    avg_pr_to_po = round(sum(valid_days) / len(valid_days), 1) if valid_days else 0
    within_30_days = len([d for d in valid_days if d <= 30])
    after_30_days = len([d for d in valid_days if d > 30])

    # Total values
    total_pr_value = sum(safe_float(pr.get("pr_value")) for pr in all_prs)
    total_po_value = sum(safe_float(pr.get("po_value")) for pr in all_prs)
    total_savings = sum(safe_float(pr.get("saving_amount")) for pr in all_prs)

    # Projects list
    projects = sorted(set(pr.get("project") for pr in all_prs if pr.get("project")))

    # Vendors list
    vendors = sorted(set(pr.get("vendor") for pr in all_prs if pr.get("vendor")))

    # Agents list
    agents = sorted(set(pr.get("agent") for pr in all_prs if pr.get("agent")))

    # Status list
    statuses = sorted(set(pr.get("status") for pr in all_prs if pr.get("status")))

    # Years extraction
    years = sorted(
        [y for y in set(get_year(pr) for pr in all_prs) if y is not None], reverse=True
    )

    # Top projects by PR count
    project_counts = Counter(pr.get("project") for pr in all_prs if pr.get("project"))
    top_projects = dict(project_counts.most_common(15))

    # Top vendors by PO value
    vendor_values = {}
    for pr in all_prs:
        vendor = pr.get("vendor")
        if vendor:
            vendor_values[vendor] = vendor_values.get(vendor, 0) + safe_float(
                pr.get("po_value")
            )
    top_vendors = dict(
        sorted(vendor_values.items(), key=lambda x: x[1], reverse=True)[:15]
    )

    # Agent performance
    agent_stats = {}
    for pr in all_prs:
        agent = pr.get("agent")
        if agent:
            if agent not in agent_stats:
                agent_stats[agent] = {
                    "total": 0,
                    "approved": 0,
                    "returned": 0,
                    "rejected": 0,
                }
            agent_stats[agent]["total"] += 1
            status = pr.get("status")
            if status == "APPROVED":
                agent_stats[agent]["approved"] += 1
            elif status == "RETURNED":
                agent_stats[agent]["returned"] += 1
            elif status == "REJECTED":
                agent_stats[agent]["rejected"] += 1

    return {
        "summary": {
            "total_prs": len(all_prs),
            "total_approved": dict(status_breakdown).get("APPROVED", 0),
            "total_returned": dict(status_breakdown).get("RETURNED", 0),
            "total_rejected": dict(status_breakdown).get("REJECTED", 0),
            "total_in_process": dict(status_breakdown).get("IN PROCESS", 0),
            "total_incomplete": dict(status_breakdown).get("INCOMPLETE", 0),
            "total_approved_2025": approved_2025,
            "total_returned_2025": returned_2025,
            "return_rate_2025": round((returned_2025 / approved_2025 * 100), 1)
            if approved_2025 > 0
            else 0,
            "status_breakdown": dict(status_breakdown),
            "avg_pr_to_po_days": avg_pr_to_po,
            "within_30_days": within_30_days,
            "after_30_days": after_30_days,
            "total_with_po": len([pr for pr in all_prs if pr.get("po_num")]),
            "total_pr_value": round(total_pr_value, 2),
            "total_po_value": round(total_po_value, 2),
            "total_savings": round(total_savings, 2),
        },
        "monthly": {
            "labels": [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            "approved": monthly_approved,
            "returned": monthly_returned,
            "rejected": monthly_rejected,
            "return_rate": monthly_return_rate,
        },
        "filters": {
            "projects": projects,
            "vendors": vendors,
            "agents": agents,
            "statuses": statuses,
            "years": [str(y) for y in years],
        },
        "charts": {"top_projects": top_projects, "top_vendors": top_vendors},
        "agent_stats": agent_stats,
    }


def format_pr_for_output(pr):
    """Format PR record for JSON output"""
    return {
        "pr_num": pr.get("pr_num"),
        "project": pr.get("project", ""),
        "description": pr.get("description", ""),
        "status": pr.get("status", ""),
        "submission_date": str(pr.get("submission_date", ""))
        if pr.get("submission_date")
        else None,
        "approved_date": str(pr.get("approved_date", ""))
        if pr.get("approved_date")
        else None,
        "return_date": str(pr.get("return_date", ""))
        if pr.get("return_date")
        else None,
        "reject_date": str(pr.get("reject_date", ""))
        if pr.get("reject_date")
        else None,
        "vendor": pr.get("vendor"),
        "pr_value": safe_float(pr.get("pr_value")),
        "po_num": pr.get("po_num"),
        "po_value": safe_float(pr.get("po_value")),
        "po_status": pr.get("po_status", ""),
        "pr_to_po_days": pr.get("pr_to_po_days"),
        "pr_note": pr.get("pr_note", ""),
        "pending_with": pr.get("pending_with", ""),
        "pending_since": str(pr.get("pending_since", ""))
        if pr.get("pending_since")
        else None,
        "agent": pr.get("agent", ""),
        "currency": pr.get("currency", "SAR"),
        "saving_amount": safe_float(pr.get("saving_amount")),
    }


def main():
    print(f"=== Procurement Data Sync ===")
    print(f"Started at: {datetime.now()}")
    print(f"Sheet ID: {PR_TO_PO_SHEET_ID}")

    try:
        # Fetch data from Smartsheet
        print("\nFetching data from Smartsheet...")
        sheet_data = get_sheet_data(PR_TO_PO_SHEET_ID)
        print(f"Sheet name: {sheet_data.get('name')}")

        # Process data
        print("\nProcessing PR data...")
        all_prs = process_sheet(sheet_data)
        print(f"Total PRs found: {len(all_prs)}")

        # Calculate statistics
        print("\nCalculating statistics...")
        stats = calculate_statistics(all_prs)

        # Format PRs for output
        formatted_prs = [format_pr_for_output(pr) for pr in all_prs]

        # Create output data
        output_data = {
            "last_updated": datetime.now().isoformat(),
            "source_sheet": sheet_data.get("name"),
            "source_sheet_id": PR_TO_PO_SHEET_ID,
            **stats,
            "all_prs": formatted_prs,
        }

        # Save to JSON
        output_path = "data/pr_data.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)

        print(f"\n=== Sync Complete ===")
        print(f"Data saved to: {output_path}")
        print(f"\nSummary:")
        print(f"  - Total PRs: {stats['summary']['total_prs']}")
        print(f"  - Approved: {stats['summary']['total_approved']}")
        print(f"  - Returned: {stats['summary']['total_returned']}")
        print(f"  - Rejected: {stats['summary']['total_rejected']}")
        print(f"  - In Process: {stats['summary']['total_in_process']}")
        print(f"  - Avg PR to PO: {stats['summary']['avg_pr_to_po_days']} days")
        print(f"  - Total PR Value: {stats['summary']['total_pr_value']:,.2f}")
        print(f"  - Total PO Value: {stats['summary']['total_po_value']:,.2f}")
        print(f"  - Total Savings: {stats['summary']['total_savings']:,.2f}")

        return True

    except Exception as e:
        print(f"\nError: {e}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
