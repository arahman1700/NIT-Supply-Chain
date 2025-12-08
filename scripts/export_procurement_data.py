#!/usr/bin/env python3
"""
Export Procurement Data from Smartsheet to JSON
This script fetches data from Smartsheet and exports it as JSON files
for use in the Procurement Dashboard.
"""

import os
import json
from datetime import datetime
from collections import defaultdict

try:
    import smartsheet
except ImportError:
    print("Installing smartsheet-python-sdk...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'smartsheet-python-sdk'])
    import smartsheet

# Configuration
TOKEN = os.environ.get('SMARTSHEET_ACCESS_TOKEN', 'M54czWuhesCxLxjayIjZ84RX1r7bVPXivdF5z')
PR_SHEET_ID = 7610099599101828  # PR to PO report
VENDOR_SHEET_ID = 1185309157969796  # Vendor Evaluation Log 2025

# Output directory
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_cell_value(row, col_map, col_name):
    """Get cell value by column name"""
    col_id = col_map.get(col_name)
    if not col_id:
        return None
    for cell in row.cells:
        if cell.column_id == col_id:
            return cell.value
    return None

def export_pr_data(client):
    """Export PR to PO data"""
    print("📥 Fetching PR to PO data...")
    sheet = client.Sheets.get_sheet(PR_SHEET_ID)

    # Create column map
    col_map = {col.title: col.id for col in sheet.columns}

    # Process rows
    pr_data = []
    monthly_stats = defaultdict(lambda: {'approved': 0, 'returned': 0})
    status_counts = defaultdict(int)

    current_year = datetime.now().year

    for row in sheet.rows:
        pr_status = get_cell_value(row, col_map, 'PR Status')
        pr_date = get_cell_value(row, col_map, 'PR Submission Date')
        pr_approved_date = get_cell_value(row, col_map, 'PR Approved Date')
        pr_return_date = get_cell_value(row, col_map, 'PR Return Date')
        pr_to_po_days = get_cell_value(row, col_map, 'PR to PO in days')

        # Count by status
        if pr_status:
            status_counts[pr_status] += 1

        # Parse date and get year/month
        if pr_approved_date:
            try:
                if isinstance(pr_approved_date, str):
                    date_obj = datetime.strptime(pr_approved_date[:10], '%Y-%m-%d')
                else:
                    date_obj = pr_approved_date

                year = date_obj.year
                month = date_obj.month

                if year == current_year:
                    monthly_stats[month]['approved'] += 1

                    # Check if returned
                    if pr_return_date:
                        monthly_stats[month]['returned'] += 1

                        # Calculate return days
                        if isinstance(pr_return_date, str):
                            return_date = datetime.strptime(pr_return_date[:10], '%Y-%m-%d')
                        else:
                            return_date = pr_return_date

                        days_to_return = (return_date - date_obj).days if return_date > date_obj else 0

            except Exception as e:
                pass

        # Store row data
        pr_data.append({
            'pr_num': get_cell_value(row, col_map, 'Pr Num'),
            'project': get_cell_value(row, col_map, 'Project Name'),
            'description': get_cell_value(row, col_map, 'Description'),
            'status': pr_status,
            'submission_date': str(pr_date)[:10] if pr_date else None,
            'approved_date': str(pr_approved_date)[:10] if pr_approved_date else None,
            'return_date': str(pr_return_date)[:10] if pr_return_date else None,
            'vendor': get_cell_value(row, col_map, 'Vendor Name'),
            'pr_value': get_cell_value(row, col_map, 'PR Value'),
            'po_value': get_cell_value(row, col_map, 'PO Value'),
            'pr_to_po_days': pr_to_po_days
        })

    # Build monthly arrays for charts
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    monthly_approved = [monthly_stats[i+1]['approved'] for i in range(12)]
    monthly_returned = [monthly_stats[i+1]['returned'] for i in range(12)]

    # Calculate return rates
    monthly_return_rate = []
    for i in range(12):
        approved = monthly_stats[i+1]['approved']
        returned = monthly_stats[i+1]['returned']
        rate = round((returned / approved * 100), 1) if approved > 0 else 0
        monthly_return_rate.append(rate)

    # Summary stats
    total_approved = sum(monthly_approved)
    total_returned = sum(monthly_returned)

    result = {
        'last_updated': datetime.now().isoformat(),
        'summary': {
            'total_prs': len(pr_data),
            'total_approved_2025': total_approved,
            'total_returned_2025': total_returned,
            'return_rate_2025': round((total_returned / total_approved * 100), 1) if total_approved > 0 else 0,
            'status_breakdown': dict(status_counts)
        },
        'monthly': {
            'labels': months,
            'approved': monthly_approved,
            'returned': monthly_returned,
            'return_rate': monthly_return_rate
        },
        'all_prs': pr_data  # All PRs for filtering
    }

    # Save to file
    output_file = os.path.join(OUTPUT_DIR, 'pr_data.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"✅ PR data exported to {output_file}")
    print(f"   Total PRs: {len(pr_data)}")
    print(f"   2025 Approved: {total_approved}")
    print(f"   2025 Returned: {total_returned}")

    return result

def export_vendor_data(client):
    """Export Vendor Evaluation data with attachments"""
    print("\n📥 Fetching Vendor Evaluation data...")
    sheet = client.Sheets.get_sheet(VENDOR_SHEET_ID, include='attachments')

    # Create column map
    col_map = {col.title: col.id for col in sheet.columns}

    # Process rows
    vendors = []
    score_distribution = {'below_20': 0, '20_40': 0, '40_60': 0, '60_70': 0, 'above_70': 0}
    total_score = 0
    evaluated_count = 0

    for row in sheet.rows:
        vendor_name = get_cell_value(row, col_map, 'Vendor Name')
        category = get_cell_value(row, col_map, 'Vendor Category')
        avg_percent = get_cell_value(row, col_map, 'Average %')

        if not vendor_name:
            continue

        score = float(avg_percent) if avg_percent else 0

        # Get attachments
        attachments = []
        if hasattr(row, 'attachments') and row.attachments:
            for att in row.attachments:
                attachments.append({
                    'id': att.id,
                    'name': att.name,
                    'mime_type': getattr(att, 'mime_type', 'application/octet-stream'),
                    'size': getattr(att, 'size_in_kb', 0)
                })

        # Score distribution
        if score == 0:
            pass  # Not evaluated
        elif score < 20:
            score_distribution['below_20'] += 1
            evaluated_count += 1
            total_score += score
        elif score < 40:
            score_distribution['20_40'] += 1
            evaluated_count += 1
            total_score += score
        elif score < 60:
            score_distribution['40_60'] += 1
            evaluated_count += 1
            total_score += score
        elif score < 70:
            score_distribution['60_70'] += 1
            evaluated_count += 1
            total_score += score
        else:
            score_distribution['above_70'] += 1
            evaluated_count += 1
            total_score += score

        vendors.append({
            'name': vendor_name,
            'category': category,
            'score': round(score, 1),
            'attachments': attachments,
            'row_id': row.id
        })

    # Sort by score descending
    vendors.sort(key=lambda x: x['score'], reverse=True)

    # Calculate stats
    pending_count = len([v for v in vendors if v['score'] == 0])
    completed_count = evaluated_count
    avg_score = round(total_score / evaluated_count, 1) if evaluated_count > 0 else 0

    result = {
        'last_updated': datetime.now().isoformat(),
        'summary': {
            'total_vendors': len(vendors),
            'evaluations_requested': len(vendors),
            'evaluations_done': completed_count,
            'evaluations_pending': pending_count,
            'average_score': avg_score,
            'completion_rate': round((completed_count / len(vendors) * 100), 1) if vendors else 0
        },
        'score_distribution': score_distribution,
        'vendors': vendors
    }

    # Save to file
    output_file = os.path.join(OUTPUT_DIR, 'vendor_data.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"✅ Vendor data exported to {output_file}")
    print(f"   Total Vendors: {len(vendors)}")
    print(f"   Evaluations Done: {completed_count}")
    print(f"   Average Score: {avg_score}%")

    return result

def main():
    print("=" * 60)
    print("📊 Exporting Procurement Data from Smartsheet")
    print("=" * 60)

    client = smartsheet.Smartsheet(TOKEN)

    # Export both datasets
    export_pr_data(client)
    export_vendor_data(client)

    print("\n" + "=" * 60)
    print("✅ All data exported successfully!")
    print("=" * 60)

if __name__ == '__main__':
    main()
