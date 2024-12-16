import React, { useState, useEffect } from 'react';
import { getTotal, getTotalWithCategory } from '../services/analyzeService';
import { getCategory as getIncomeCategory } from '../services/incomeService';
import { getCategory as getExpenseCategory } from '../services/expenseService';

import Chart from 'react-google-charts';

const Home = () => {
  const [data, setData] = useState({ incomeTotal: 0, expenseTotal: 0 });
  const [mostValuedExpense, setMostValuedExpense] = useState({ category: "", amount: 0 });
  const [mostValuedIncome, setMostValuedIncome] = useState({ category: "", amount: 0 });
  const [incomesWithCategory, setIncomesWithCategory] = useState([]);
  const [expensesWithCategory, setExpensesWithCategory] = useState([]);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      const result = await getTotal();
      setData({
        incomeTotal: result?.data?.total_income,
        expenseTotal: result?.data?.total_expense
      });
    };
    fetchDataFromApi();
  }, []);

  useEffect(() => {
    const fetchTotalWithCategory = async () => {
      const result = await getTotalWithCategory();
  
      const expenses = result?.data?.expenses || {};
      const incomes = result?.data?.incomes || {};
  
      // Check if expenses or incomes are not empty before proceeding with Object.entries
      setExpensesWithCategory(await Promise.all(Object.entries(expenses).map(async ([categoryId, amount]) => {
        const category = await getExpenseCategory(categoryId);
        const categoryName = category.data ? category.data.name : "?";
        return { categoryId, amount, category: categoryName };
      })));
  
      setIncomesWithCategory(await Promise.all(Object.entries(incomes).map(async ([categoryId, amount]) => {
        const category = await getIncomeCategory(categoryId);
        const categoryName = category.data ? category.data.name : "?";
        return { categoryId, amount, category: categoryName };
      })));
  
      if (Object.keys(expenses).length > 0) {
        const mostValuedExpenseCategory = Object.keys(expenses).reduce((maxKey, currentKey) => {
          return expenses[currentKey] > expenses[maxKey] ? currentKey : maxKey;
        }, Object.keys(expenses)[0]);
  
        const mostValuedExpenseAmount = expenses[mostValuedExpenseCategory];
        const expenseCategory = await getExpenseCategory(mostValuedExpenseCategory);
        const expenseCategoryName = expenseCategory.data ? expenseCategory.data.name : "?";
        setMostValuedExpense({ category: expenseCategoryName, amount: mostValuedExpenseAmount });
      }
  
      if (Object.keys(incomes).length > 0) {
        const mostValuedIncomeCategory = Object.keys(incomes).reduce((maxKey, currentKey) => {
          return incomes[currentKey] > incomes[maxKey] ? currentKey : maxKey;
        }, Object.keys(incomes)[0]);
  
        const mostValuedIncomeAmount = incomes[mostValuedIncomeCategory];
        const incomeCategory = await getIncomeCategory(mostValuedIncomeCategory);
        const incomeCategoryName = incomeCategory.data ? incomeCategory.data.name : "?";
        setMostValuedIncome({ category: incomeCategoryName, amount: mostValuedIncomeAmount });
      }
    };
  
    fetchTotalWithCategory();
  }, []);  

  const totalIncome = data.incomeTotal;
  const totalExpense = data.expenseTotal;

  const chartData = [
    ['Kategori', 'Miktar'],
    ['Gelir', totalIncome],
    ['Gider', totalExpense],
  ];

  const incomeWithCategoryData = [
    ['Kategori', 'Miktar'],
    ...incomesWithCategory.map((income) => [income.category, income.amount])
  ];

  const expenseWithCategoryData = [
    ['Kategori', 'Miktar'],
    ...expensesWithCategory.map((expense) => [expense.category, expense.amount])
  ];

  const canfleChartdata = [
    ["Kategori", "Miktar", { role: "style" }],
    [mostValuedIncome.category || 'Loading...', mostValuedIncome.amount, "green"],
    [mostValuedExpense.category || 'Loading...', mostValuedExpense.amount, "red"],
  ];

  const options = {
    pieSliceText: 'percentage',
    is3D: true,
    slices: {
      0: { offset: 0.1 },
      1: { offset: 0.1 },
    },
    theme: 'maximized',
    chartArea: {
      width: '80%',
      height: '80%',
    },
    legend: {
      position: 'bottom',
      alignment: 'center',
    },
    fontSize: 12,
    pieSliceTextStyle: {
      color: 'white',
      fontSize: 14,
    },
    tooltip: { trigger: 'none' }
  };

  return (
    <div className="home-container">
      <h1 className="page-title">Gelir & Gider Analizi</h1>
      <div className="charts-container">
        <div className="chart-box">
          <Chart
            chartType="PieChart"
            data={chartData}
            options={options}
            width="100%"
            height="300px"
          />
        </div>
        <div className="chart-box">
          <Chart
            chartType="ColumnChart"
            data={canfleChartdata}
            options={options}
            width="100%"
            height="300px"
          />
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h2 className="section-title">Kategorilere Göre Gelir Analizi</h2>
          <Chart
            chartType="PieChart"
            data={incomeWithCategoryData}
            options={options}
            width="100%"
            height="300px"
          />
        </div>

        <div className="chart-section">
          <h2 className="section-title">Kategorilere Göre Gider Analizi</h2>
          <Chart
            chartType="PieChart"
            data={expenseWithCategoryData}
            options={options}
            width="100%"
            height="300px"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
