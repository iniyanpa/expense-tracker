# Modern Expense Tracker

A beautiful, modern expense tracking application built with Firebase and vanilla JavaScript, featuring a custom design system with IBM Plex Sans, Cinzel, and Oswald fonts.

## Design System

- **Primary Color**: #29378c (Deep Blue)
- **Secondary Color**: #29baed (Sky Blue)
- **Heading Font**: IBM Plex Sans
- **Subheading Font**: Cinzel Italic
- **Title Font**: Oswald
- **Body Text Font**: Cinzel

## Features

✨ **Modern UI/UX**
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Responsive design for all devices
- Custom color scheme with gradient cards

📊 **Dashboard Analytics**
- Real-time summary cards (Total Balance, Income, Expense)
- Expense breakdown by category (Doughnut chart)
- Monthly expense trends (Bar chart)
- Advanced filtering by account and type

💰 **Transaction Management**
- Easy transaction entry form
- Multiple account support
- Comprehensive expense categories
- Detailed transaction history

🔥 **Firebase Integration**
- Real-time database synchronization
- Secure cloud storage
- Automatic timestamps
- Scalable architecture

## Project Structure

```
expense-tracker/
├── index.html              # Main HTML file with all pages
├── styles.css              # Complete styling with design system
├── app.js                  # Main application logic
├── firebase-config.js      # Firebase configuration
├── import_data.py          # Python script to convert Excel to JSON
├── firebase_import.js      # Node.js script for batch import
├── transactions_import.json # Converted transaction data (2035 records)
└── README.md              # This file
```

## Setup Instructions

### 1. Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase account
- Node.js (for data import)
- Python 3 (already used for conversion)

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing "expense-tracker-f3f2f"
3. Enable Firestore Database:
   - Go to Build > Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose your region

4. Set up Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{document=**} {
      allow read, write: if true; // For development only
      // For production, implement proper authentication
    }
  }
}
```

### 3. Import Existing Data to Firebase

The Excel file has been converted to JSON (`transactions_import.json`) with 2,035 transactions.

#### Option A: Using Firebase Console (Manual - for small datasets)

1. Go to Firebase Console > Firestore Database
2. Create a new collection called "transactions"
3. Manually add documents (not recommended for 2000+ records)

#### Option B: Using Firebase Admin SDK (Recommended)

1. **Download Service Account Key**:
   - Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project directory

2. **Install Dependencies**:
```bash
npm install firebase-admin
```

3. **Run Import Script**:
```bash
node firebase_import.js
```

This will batch-import all 2,035 transactions to your Firebase database.

#### Option C: Using Firestore REST API (Alternative)

You can also use the Firestore REST API or other import tools like:
- Firebase CLI with batch imports
- Firestore data import/export tools
- Custom Python script with firebase-admin library

### 4. Deploy the Application

#### Option 1: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Deploy
firebase deploy
```

#### Option 2: Local Development

Simply open `index.html` in a web browser. The app will work if:
- Firebase configuration is correct
- CORS is properly configured
- You're using a local server (recommended)

Use a local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# VS Code
# Use Live Server extension
```

Then visit: `http://localhost:8000`

### 5. Configuration

Update `firebase-config.js` if using a different Firebase project:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## Usage Guide

### Adding Transactions

1. Navigate to "Add Transaction" page
2. Fill in the form:
   - **Date**: Transaction date (defaults to today)
   - **Account**: Select from dropdown
   - **Income**: Amount received (₹)
   - **Expense**: Amount spent (₹)
   - **Expense Type**: Category of expense/income
   - **Remarks**: Optional notes
3. Click "Save Transaction"

### Viewing Dashboard

1. Click "Dashboard" in navigation
2. View summary cards at the top
3. Analyze charts:
   - **Expense by Category**: Top 10 expense categories
   - **Monthly Expenses**: Expense trends over time
4. Use filters to:
   - Filter by specific account
   - Filter by transaction type
5. Browse transaction history in the table

### Filters

- **Account Filter**: Show transactions from specific account
- **Type Filter**: Show transactions of specific type
- Both filters can be combined
- Reset by selecting "All"

## Data Structure

Each transaction in Firebase has the following structure:

```javascript
{
  date: "2025-04-01",          // Date in YYYY-MM-DD format
  account: "CANARA BANK",      // Account name
  income: 72181.37,            // Income amount
  expense: 0.00,               // Expense amount
  type: "INITIAL BALANCE",     // Transaction type/category
  total: 72181.37,             // Running total (income - expense)
  remarks: "",                 // Optional notes
  createdAt: Timestamp         // Auto-generated by Firebase
}
```

## Supported Accounts

- CANARA BANK
- ICICI SAVINGS
- HDFC
- SBI
- ICICI CURRENT
- KVB
- ZAGGLE
- PAV CNB
- PAV IOB

## Supported Transaction Types

### Income Types
- SALARY
- INCOME OTHERS
- RENT - IN
- INITIAL BALANCE

### Expense Types
- RENT - OUT
- HOUSEHOLD EXPENSE
- MEDICAL
- FUEL & TRAVEL
- MISC
- ONLINE PURCHASE
- CLOTHINGS
- FOOD ORDERS
- TEA & SNACKS
- BANK CHARGES
- CREDIT CARD PAYMENT
- VEHICLE SERVICE
- MOBILE & INTERNET
- EXPENSE CLAIMABLE
- INSURANCE
- SIP

### Transfer Types
- SELF TRANSFER - IN
- SELF TRANSFER - OUT
- HAND LOAN
- HL EMI
- PL EMI
- LOAN

## Customization

### Changing Colors

Edit `styles.css`:

```css
:root {
    --primary: #29378c;    /* Your primary color */
    --secondary: #29baed;  /* Your secondary color */
}
```

### Adding New Account Types

Edit both `index.html` sections:
- Add Transaction form select
- Dashboard filter select

### Adding New Expense Types

Edit both `index.html` sections:
- Add Transaction form select
- Dashboard filter select

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Security Considerations

⚠️ **Important**: The current configuration allows public read/write access to Firestore.

For production use:
1. Implement Firebase Authentication
2. Update security rules to restrict access
3. Add user-based data isolation
4. Enable App Check for additional security

Example production rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Performance Optimization

- Transactions are ordered by date (descending)
- Charts show top 10 categories to prevent clutter
- Filters work on already-loaded data (no extra queries)
- Batch imports handle 500 documents at a time

## Troubleshooting

### Charts not displaying
- Check Chart.js CDN is loading
- Ensure there are transactions in the database
- Check browser console for errors

### Transactions not saving
- Verify Firebase configuration
- Check Firestore security rules
- Ensure all required fields are filled

### Import failing
- Verify `transactions_import.json` exists
- Check Firebase Admin SDK credentials
- Ensure batch size doesn't exceed 500

## Data Migration Summary

✅ Successfully converted 2,035 transactions from Excel to Firebase-ready JSON format

- Original file: `Expense_tracker.csv` (Excel format)
- Converted to: `transactions_import.json`
- Date range: April 2025 onwards
- All accounts and categories preserved
- Ready for batch import to Firebase

## Future Enhancements

- 📱 Mobile app version
- 🔐 User authentication
- 📈 Budget tracking
- 🎯 Savings goals
- 📊 Advanced analytics
- 💾 Export to Excel/PDF
- 🔔 Expense notifications
- 📅 Recurring transactions

## Support

For issues or questions:
1. Check Firebase Console for errors
2. Review browser console logs
3. Verify all files are properly uploaded
4. Ensure Firebase configuration is correct

## License

This project is provided as-is for personal use.

---

**Built with ❤️ using Firebase, Chart.js, and vanilla JavaScript**
