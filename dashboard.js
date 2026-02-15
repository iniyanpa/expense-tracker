import { firebaseConfig } from './firebase-config.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const tableBody = document.getElementById("tableBody");

const totalBalanceElement = document.getElementById("totalBalance");

const totalIncomeElement = document.getElementById("totalIncome");

const totalExpenseElement = document.getElementById("totalExpense");

let allTransactions = [];

async function loadTransactions() {

    const q = query(
        collection(db, "transactions"),
        orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);

    allTransactions = [];

    querySnapshot.forEach(doc => {

        allTransactions.push(doc.data());

    });

    displayTransactions();

    calculateSummary();

    createExpensePieChart();

    createMonthlyChart();
}

function displayTransactions() {

    tableBody.innerHTML = "";

    allTransactions.forEach(txn => {

        const row = `
        <tr>
        <td>${txn.date}</td>
        <td>${txn.account}</td>
        <td>${txn.income}</td>
        <td>${txn.expense}</td>
        <td>${txn.type}</td>
        <td>${txn.total}</td>
        <td>${txn.remarks}</td>
        </tr>
        `;

        tableBody.innerHTML += row;
    });
}

function calculateSummary() {

    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    allTransactions.forEach(txn => {

        totalBalance += txn.total;
        totalIncome += txn.income;
        totalExpense += txn.expense;

    });

    totalBalanceElement.innerText = totalBalance;
    totalIncomeElement.innerText = totalIncome;
    totalExpenseElement.innerText = totalExpense;
}

function createExpensePieChart() {

    const categoryTotals = {};

    allTransactions.forEach(txn => {

        if (!categoryTotals[txn.type]) {

            categoryTotals[txn.type] = 0;
        }

        categoryTotals[txn.type] += txn.expense;

    });

    new Chart(document.getElementById("expensePieChart"), {

        type: 'pie',

        data: {

            labels: Object.keys(categoryTotals),

            datasets: [{
                data: Object.values(categoryTotals)
            }]
        }
    });
}

function createMonthlyChart() {

    const monthlyTotals = {};

    allTransactions.forEach(txn => {

        const month = txn.date.substring(0,7);

        if (!monthlyTotals[month]) {

            monthlyTotals[month] = 0;
        }

        monthlyTotals[month] += txn.expense;
    });

    new Chart(document.getElementById("monthlyChart"), {

        type: 'bar',

        data: {

            labels: Object.keys(monthlyTotals),

            datasets: [{
                label: "Monthly Expense",
                data: Object.values(monthlyTotals)
            }]
        }
    });
}

loadTransactions();
