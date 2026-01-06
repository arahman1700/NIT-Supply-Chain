#!/usr/bin/env python3
"""
Warehouse Data Export Script
Processes Excel files and exports to JSON for dashboard consumption.
"""

import pandas as pd
import json
from datetime import datetime
import os
import sys

# File paths
SURPLUS_FILE = '/Users/a.rahman/Library/Caches/Spark Mail/messagesData/1/70920/MATERIALS IUSSANCE from Surplus.xlsx'
STORE_FILE = '/Users/a.rahman/Desktop/NIT/Amr/Invintory update till 2-12-2025/Asir Modon-2 Store Movment Materials.xlsx'
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'warehouse_data.json')

def clean_value(val):
    """Clean and normalize values"""
    if pd.isna(val):
        return None
    if isinstance(val, str):
        val = val.strip()
        if val in ['0', '', 'NaN', 'nan']:
            return None
    return val

def clean_numeric(val):
    """Clean numeric values"""
    if pd.isna(val):
        return 0
    try:
        return float(val)
    except:
        return 0

def parse_date(date_val):
    """Parse various date formats"""
    if pd.isna(date_val):
        return None
    if isinstance(date_val, datetime):
        return date_val.strftime('%Y-%m-%d')
    if isinstance(date_val, str):
        date_val = date_val.strip()
        # Try different formats
        for fmt in ['%d/%m/%Y', '%Y-%m-%d', '%Y-%m-%d %H:%M:%S']:
            try:
                return datetime.strptime(date_val.split()[0] if ' ' in date_val else date_val, fmt).strftime('%Y-%m-%d')
            except:
                continue
    return None

def process_surplus_transfers():
    """Process surplus materials transfer file"""
    print("Processing Surplus Transfers...")

    # Read with header row at index 0
    df = pd.read_excel(SURPLUS_FILE, sheet_name='OCT 25', header=0)

    # Clean column names
    df.columns = ['id', 'Description', 'Qty', 'Store', 'Unit', 'From Project', 'To Project', 'date', 'Remark']

    # Filter out empty rows
    df = df.dropna(subset=['Description'])

    transfers = []
    monthly_data = {}

    for idx, row in df.iterrows():
        date_str = parse_date(row.get('date'))

        qty_val = clean_numeric(row.get('Qty', 0))

        transfer = {
            'id': int(idx) + 1,
            'description': clean_value(row.get('Description', '')),
            'qty': int(qty_val),
            'unit': clean_value(row.get('Unit', '')),
            'store': clean_value(row.get('Store', '')),
            'from_project': clean_value(row.get('From Project', '')),
            'to_project': clean_value(row.get('To Project', '')),
            'date': date_str,
            'remark': clean_value(row.get('Remark', '')) or 'Pending'
        }
        transfers.append(transfer)

        # Aggregate by month
        if date_str:
            month_key = date_str[:7]  # YYYY-MM
            if month_key not in monthly_data:
                monthly_data[month_key] = {'count': 0, 'quantity': 0}
            monthly_data[month_key]['count'] += 1
            monthly_data[month_key]['quantity'] += transfer['qty']

    # Get unique values for filters
    stores = sorted(list(set(t['store'] for t in transfers if t['store'])))
    from_projects = sorted(list(set(t['from_project'] for t in transfers if t['from_project'])))
    to_projects = sorted(list(set(t['to_project'] for t in transfers if t['to_project'])))
    units = sorted(list(set(t['unit'] for t in transfers if t['unit'])))

    # Sort monthly data
    sorted_months = sorted(monthly_data.keys())
    month_labels = []
    month_counts = []
    month_quantities = []

    for m in sorted_months:
        month_labels.append(datetime.strptime(m, '%Y-%m').strftime('%b %Y'))
        month_counts.append(monthly_data[m]['count'])
        month_quantities.append(monthly_data[m]['quantity'])

    # Top materials by quantity
    material_qty = {}
    for t in transfers:
        desc = t['description']
        if desc:
            material_qty[desc] = material_qty.get(desc, 0) + t['qty']

    top_materials = sorted(material_qty.items(), key=lambda x: x[1], reverse=True)[:10]

    # Transfers by store
    store_counts = {}
    for t in transfers:
        store = t['store']
        if store:
            store_counts[store] = store_counts.get(store, 0) + 1

    confirmed_count = len([t for t in transfers if t['remark'] == 'Confirmed'])

    return {
        'summary': {
            'total_transfers': len(transfers),
            'total_quantity': sum(t['qty'] for t in transfers),
            'unique_materials': len(material_qty),
            'active_stores': len(stores),
            'confirmed_count': confirmed_count,
            'pending_count': len(transfers) - confirmed_count
        },
        'monthly': {
            'labels': month_labels,
            'counts': month_counts,
            'quantities': month_quantities
        },
        'top_materials': {
            'labels': [m[0][:30] + '...' if len(m[0]) > 30 else m[0] for m in top_materials],
            'quantities': [m[1] for m in top_materials]
        },
        'by_store': {
            'labels': list(store_counts.keys()),
            'counts': list(store_counts.values())
        },
        'filters': {
            'stores': stores,
            'from_projects': from_projects,
            'to_projects': to_projects,
            'units': units
        },
        'transfers': transfers
    }

def process_inventory():
    """Process Asir Modon-2 inventory summary"""
    print("Processing Inventory Summary...")

    # Read Summary sheet with correct header
    df = pd.read_excel(STORE_FILE, sheet_name='Sammary', header=0)

    # Skip empty rows at start
    df = df.dropna(subset=['MATERIALS DESCRIPTION'])
    df = df[df['S/N'].notna()]

    materials = []

    for idx, row in df.iterrows():
        received = clean_numeric(row.get('Total Received', 0))
        issued = clean_numeric(row.get('Total Issued', 0))
        balance = clean_numeric(row.get('Balance', 0))

        # Determine status
        if balance < 0:
            status = 'critical'
        elif balance == 0:
            status = 'zero'
        elif received > 0 and balance < received * 0.2:
            status = 'low'
        else:
            status = 'normal'

        location = clean_value(row.get('LOCATION', ''))
        sub_location = clean_value(row.get('Sup Location', ''))

        # Skip items with location = '0' or numeric only
        if location and str(location) in ['0', '0.0']:
            location = None
        if sub_location and str(sub_location) in ['0', '0.0']:
            sub_location = None

        material = {
            'id': int(clean_numeric(row.get('S/N', 0))) or len(materials) + 1,
            'project': clean_value(row.get('Project Name', '')),
            'item_code': str(clean_value(row.get('ITEM CODE', '')) or ''),
            'description': clean_value(row.get('MATERIALS DESCRIPTION', '')),
            'size': str(clean_value(row.get('Size', '')) or ''),
            'unit': clean_value(row.get('Unit', '')),
            'location': location,
            'sub_location': sub_location,
            'received': int(received),
            'issued': int(issued),
            'balance': int(balance),
            'status': status
        }
        materials.append(material)

    # Filter to only items with actual location (active inventory)
    active_materials = [m for m in materials if m['location']]

    # If no active materials with location, use all materials
    if not active_materials:
        print("  Warning: No materials with location found, using all materials")
        active_materials = materials

    # Get unique values for filters
    locations = sorted(list(set(m['location'] for m in active_materials if m['location'])))
    sub_locations = sorted(list(set(m['sub_location'] for m in active_materials if m['sub_location'])))
    units = sorted(list(set(m['unit'] for m in active_materials if m['unit'])))

    # Summary statistics
    total_received = sum(m['received'] for m in active_materials)
    total_issued = sum(m['issued'] for m in active_materials)
    total_balance = sum(m['balance'] for m in active_materials)

    critical_items = [m for m in active_materials if m['status'] == 'critical']
    low_items = [m for m in active_materials if m['status'] == 'low']
    zero_items = [m for m in active_materials if m['status'] == 'zero']
    normal_items = [m for m in active_materials if m['status'] == 'normal']

    # Top materials by balance
    top_balance = sorted([m for m in active_materials if m['balance'] > 0], key=lambda x: x['balance'], reverse=True)[:10]

    # By location
    location_data = {}
    for m in active_materials:
        loc = m['location'] or 'Unknown'
        if loc not in location_data:
            location_data[loc] = {'count': 0, 'balance': 0}
        location_data[loc]['count'] += 1
        location_data[loc]['balance'] += m['balance']

    # By sub-location
    sub_location_data = {}
    for m in active_materials:
        loc = m['sub_location'] or 'Unknown'
        if loc not in sub_location_data:
            sub_location_data[loc] = {'count': 0, 'balance': 0}
        sub_location_data[loc]['count'] += 1
        sub_location_data[loc]['balance'] += m['balance']

    return {
        'summary': {
            'total_materials': len(active_materials),
            'total_received': total_received,
            'total_issued': total_issued,
            'total_balance': total_balance,
            'critical_count': len(critical_items),
            'low_count': len(low_items),
            'zero_count': len(zero_items),
            'normal_count': len(normal_items)
        },
        'top_balance': {
            'labels': [m['description'][:25] + '...' if len(m['description'] or '') > 25 else (m['description'] or 'N/A') for m in top_balance],
            'values': [m['balance'] for m in top_balance]
        },
        'by_location': {
            'labels': list(location_data.keys()),
            'counts': [location_data[k]['count'] for k in location_data],
            'balances': [location_data[k]['balance'] for k in location_data]
        },
        'by_sub_location': {
            'labels': list(sub_location_data.keys()),
            'counts': [sub_location_data[k]['count'] for k in sub_location_data],
            'balances': [sub_location_data[k]['balance'] for k in sub_location_data]
        },
        'status_distribution': {
            'labels': ['Critical', 'Low Stock', 'Zero Stock', 'Normal'],
            'counts': [len(critical_items), len(low_items), len(zero_items), len(normal_items)]
        },
        'filters': {
            'locations': locations,
            'sub_locations': sub_locations,
            'units': units
        },
        'materials': active_materials,
        'critical_items': critical_items
    }

def process_movements():
    """Process daily issuance data"""
    print("Processing Stock Movements...")

    df = pd.read_excel(STORE_FILE, sheet_name='Issued Materials', header=0)

    # Filter out header rows
    df = df.dropna(subset=['MATERIALS DESCRIPTION'])
    df = df[df['S/N'].notna()]

    # Get date columns (datetime objects)
    date_columns = [col for col in df.columns if isinstance(col, datetime)]

    daily_data = {}
    material_issued = {}

    for idx, row in df.iterrows():
        description = clean_value(row.get('MATERIALS DESCRIPTION', ''))
        if not description:
            continue

        total_issued = 0

        for date_col in date_columns:
            qty = clean_numeric(row.get(date_col, 0))
            if qty > 0:
                date_str = date_col.strftime('%Y-%m-%d')
                if date_str not in daily_data:
                    daily_data[date_str] = 0
                daily_data[date_str] += qty
                total_issued += qty

        if total_issued > 0:
            material_issued[description] = material_issued.get(description, 0) + total_issued

    # Sort by date
    sorted_dates = sorted(daily_data.keys())

    # Top materials by issuance
    top_issued = sorted(material_issued.items(), key=lambda x: x[1], reverse=True)[:10]

    # Weekly aggregation
    weekly_data = {}
    for date_str, qty in daily_data.items():
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        week_start = date_obj - pd.Timedelta(days=date_obj.weekday())
        week_key = week_start.strftime('%Y-%m-%d')
        weekly_data[week_key] = weekly_data.get(week_key, 0) + qty

    sorted_weeks = sorted(weekly_data.keys())

    total_issued_qty = sum(daily_data.values())
    active_days = len(daily_data)

    return {
        'summary': {
            'total_issued_items': len(material_issued),
            'total_issued_quantity': int(total_issued_qty),
            'active_days': active_days,
            'avg_daily_issuance': round(total_issued_qty / active_days, 1) if active_days else 0
        },
        'daily': {
            'labels': [datetime.strptime(d, '%Y-%m-%d').strftime('%b %d') for d in sorted_dates],
            'dates': sorted_dates,
            'quantities': [daily_data[d] for d in sorted_dates]
        },
        'weekly': {
            'labels': [datetime.strptime(w, '%Y-%m-%d').strftime('Week of %b %d') for w in sorted_weeks],
            'quantities': [weekly_data[w] for w in sorted_weeks]
        },
        'top_materials': {
            'labels': [m[0][:25] + '...' if len(m[0]) > 25 else m[0] for m in top_issued],
            'quantities': [int(m[1]) for m in top_issued]
        }
    }

def main():
    """Main export function"""
    print("=" * 60)
    print("Warehouse Data Export")
    print("=" * 60)

    # Check files exist
    if not os.path.exists(SURPLUS_FILE):
        print(f"WARNING: Surplus file not found: {SURPLUS_FILE}")
        surplus_data = None
    else:
        surplus_data = process_surplus_transfers()

    if not os.path.exists(STORE_FILE):
        print(f"WARNING: Store file not found: {STORE_FILE}")
        inventory_data = None
        movements_data = None
    else:
        inventory_data = process_inventory()
        movements_data = process_movements()

    # Combine all data
    output = {
        'last_updated': datetime.now().isoformat(),
        'surplus_transfers': surplus_data,
        'inventory': inventory_data,
        'movements': movements_data
    }

    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    # Write JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\nExport complete: {OUTPUT_FILE}")
    print(f"File size: {os.path.getsize(OUTPUT_FILE) / 1024:.1f} KB")

    # Print summary
    if surplus_data:
        print(f"\nSurplus Transfers: {surplus_data['summary']['total_transfers']} records")
        print(f"  - Total Qty: {surplus_data['summary']['total_quantity']}")
        print(f"  - Confirmed: {surplus_data['summary']['confirmed_count']}")
    if inventory_data:
        print(f"\nInventory Items: {inventory_data['summary']['total_materials']} materials")
        print(f"  - Received: {inventory_data['summary']['total_received']}")
        print(f"  - Issued: {inventory_data['summary']['total_issued']}")
        print(f"  - Balance: {inventory_data['summary']['total_balance']}")
        print(f"  - Critical: {inventory_data['summary']['critical_count']}")
    if movements_data:
        print(f"\nMovements: {movements_data['summary']['active_days']} days tracked")
        print(f"  - Total Issued: {movements_data['summary']['total_issued_quantity']}")

if __name__ == '__main__':
    main()
