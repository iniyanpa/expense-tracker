import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global variables
let allTransactions = [];
let pieChart = null;
let barChart = null;

// Navigation
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetPage = btn.dataset.page;
        
        // Update active button
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active page
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(`${targetPage}-page`).classList.add('active');
        
        // Load dashboard data if switching to dashboard
        if (targetPage === 'dashboard') {
            loadTransactions();
        }
    });
});

// Form submission
const form = document.getElementById("expenseForm");
const statusDiv = document.getElementById("status");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const account = document.getElementById("account").value;
    const income = Number(document.getElementById("income").value);
    const expense = Number(document.getElementById("expense").value);
    const type = document.getElementById("type").value;
    const remarks = document.getElementById("remarks").value;

    // Validation
    if (!date || !account || !type) {
        showStatus("Please fill all mandatory fields", "error");
        return;
    }

    // Calculate total
    const total = income - expense;

    try {
        await addDoc(collection(db, "transactions"), {
            date: date,
            account: account,
            income: income,
            expense: expense,
            type: type,
            total: total,
            remarks: remarks || "",
            createdAt: serverTimestamp()
        });

        showStatus("Transaction saved successfully!", "success");
        form.reset();
        
        // Set default values
        document.getElementById("income").value = "0";
        document.getElementById("expense").value = "0";

    } catch (error) {
        showStatus("Error: " + error.message, "error");
    }
});

// Show status message
function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status show ${type}`;
    
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 5000);
}

// Load transactions from Firebase
async function loadTransactions() {
    try {
        const q = query(
            collection(db, "transactions"),
            orderBy("date", "desc")
        );

        const querySnapshot = await getDocs(q);
        allTransactions = [];

        querySnapshot.forEach(doc => {
            allTransactions.push(doc.data());
        });

        displayTransactions(allTransactions);
        calculateSummary(allTransactions);
        createCharts(allTransactions);
        
    } catch (error) {
        console.error("Error loading transactions:", error);
    }
}

// Display transactions in table
function displayTransactions(transactions) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    if (transactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-gray);">No transactions found</td></tr>';
        return;
    }

    transactions.forEach(txn => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${txn.date}</td>
            <td>${txn.account}</td>
            <td style="color: var(--success); font-weight: 600;">₹${txn.income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td style="color: var(--danger); font-weight: 600;">₹${txn.expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td>${txn.type}</td>
            <td style="font-weight: 600;">₹${txn.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td>${txn.remarks}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Calculate summary
function calculateSummary(transactions) {
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(txn => {
        totalBalance += txn.total;
        totalIncome += txn.income;
        totalExpense += txn.expense;
    });

    document.getElementById("totalBalance").textContent = 
        `₹${totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById("totalIncome").textContent = 
        `₹${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById("totalExpense").textContent = 
        `₹${totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

// Create charts
function createCharts(transactions) {
    createExpensePieChart(transactions);
    createMonthlyChart(transactions);
}

// Create expense pie chart
function createExpensePieChart(transactions) {
    const categoryTotals = {};

    transactions.forEach(txn => {
        if (txn.expense > 0) {
            if (!categoryTotals[txn.type]) {
                categoryTotals[txn.type] = 0;
            }
            categoryTotals[txn.type] += txn.expense;
        }
    });

    // Sort by value and take top 10
    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const labels = sortedCategories.map(item => item[0]);
    const data = sortedCategories.map(item => item[1]);

    // Destroy existing chart
    if (pieChart) {
        pieChart.destroy();
    }

    const ctx = document.getElementById("expensePieChart");
    pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#29378c', '#29baed', '#dc3545', '#28a745', '#ffc107',
                    '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#17a2b8'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Cinzel',
                            size: 11
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                        }
                    }
                }
            }
        }
    });
}

// Create monthly bar chart
function createMonthlyChart(transactions) {
    const monthlyTotals = {};

    transactions.forEach(txn => {
        const month = txn.date.substring(0, 7); // YYYY-MM
        if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
        }
        monthlyTotals[month] += txn.expense;
    });

    // Sort by month
    const sortedMonths = Object.keys(monthlyTotals).sort();
    const labels = sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        const date = new Date(year, monthNum - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    const data = sortedMonths.map(month => monthlyTotals[month]);

    // Destroy existing chart
    if (barChart) {
        barChart.destroy();
    }

    const ctx = document.getElementById("monthlyChart");
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Expense',
                data: data,
                backgroundColor: 'rgba(41, 55, 140, 0.8)',
                borderColor: '#29378c',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y || 0;
                            return `Expense: ₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
}

// Filters
const accountFilter = document.getElementById("accountFilter");
const typeFilter = document.getElementById("typeFilter");

accountFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);

function applyFilters() {
    const accountValue = accountFilter.value;
    const typeValue = typeFilter.value;

    let filtered = allTransactions;

    if (accountValue) {
        filtered = filtered.filter(txn => txn.account === accountValue);
    }

    if (typeValue) {
        filtered = filtered.filter(txn => txn.type === typeValue);
    }

    displayTransactions(filtered);
    calculateSummary(filtered);
    createCharts(filtered);
}

// Set default date to today
document.getElementById("date").valueAsDate = new Date();
