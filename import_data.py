import pandas as pd
import json

# Read the Excel file
df = pd.read_excel('/mnt/user-data/uploads/Expense_tracker.csv')

# Clean the data - remove unnamed columns
df = df[['DATE', 'ACCOUNT', 'INCOME', 'EXPENSE', 'EXPENSE TYPE', 'TOTAL', 'REMARKS']]

# Remove rows with all NaN values
df = df.dropna(how='all')

# Fill NaN values
df['INCOME'] = df['INCOME'].fillna(0)
df['EXPENSE'] = df['EXPENSE'].fillna(0)
df['TOTAL'] = df['TOTAL'].fillna(0)
df['REMARKS'] = df['REMARKS'].fillna('')

# Convert date to string format
df['DATE'] = pd.to_datetime(df['DATE']).dt.strftime('%Y-%m-%d')

# Rename columns to match Firebase structure
df.columns = ['date', 'account', 'income', 'expense', 'type', 'total', 'remarks']

# Convert to list of dictionaries
transactions = df.to_dict('records')

# Save as JSON file for manual import
with open('/home/claude/transactions_import.json', 'w') as f:
    json.dump(transactions, f, indent=2)

print(f"Successfully processed {len(transactions)} transactions")
print(f"Data saved to transactions_import.json")
print("\nFirst 3 transactions:")
for i, txn in enumerate(transactions[:3]):
    print(f"\nTransaction {i+1}:")
    print(json.dumps(txn, indent=2))
