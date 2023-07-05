import React, { useState, useEffect } from "react";
import "./App.css";
import { CChart } from "@coreui/react-chartjs";

function App() {
  const [item, setItem] = useState("");
  const [expense, setExpense] = useState("");
  const [date, setDate] = useState("");
  const [localStorageData, setLocalStorageData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [error, setError] = useState(false);
  const defaultYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [yearsSet, setYearsSet] = useState(new Set()); // Initialize yearsSet as an empty Set

  useEffect(() => {
    loadDataFromLocalStorage();
  }, [selectedYear]);

  const loadDataFromLocalStorage = () => {
    const data = [];
    const yearsSet = new Set();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      const parsedValue = JSON.parse(value);
      data.push({ key, value: parsedValue });
      const year = new Date(parsedValue.date).getFullYear();
      yearsSet.add(year);
    }
    setLocalStorageData(data);

    const expensesByMonth = Array(12).fill(0);

    data.forEach((item) => {
      const { expense, date } = item.value;
      const itemYear = new Date(date).getFullYear();
      if (itemYear === selectedYear) {
        const month = new Date(date).getMonth();
        expensesByMonth[month] += parseInt(expense);
      }
    });

    setExpenseData(expensesByMonth);
    setYearsSet(yearsSet);
  };

  const addToLocalStorage = () => {
    if (item.length === 0 || expense <= 0 || date === "") {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 500);
      return;
    }
    const randomKey = Math.random().toString();
    const newItem = { item, expense, date };
    localStorage.setItem(randomKey, JSON.stringify(newItem));
    loadDataFromLocalStorage();
    setItem("");
    setExpense("");
    setDate("");
  };

  const deleteFromLocalStorage = (key) => {
    localStorage.removeItem(key);
    loadDataFromLocalStorage();
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    loadDataFromLocalStorage();
  };

  const formatDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  };

  const monthNames = [
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
  ];

  return (
    <div className="App">
      <div className="card">
        <h2 className="card-title">Expense Tracker</h2>
        <div className="card-body">
          <label htmlFor="itemInput" className="label">
            Enter expense name:
          </label>
          <input
            id="itemInput"
            className="input"
            value={item}
            onChange={(event) => setItem(event.target.value)}
          />
          <label htmlFor="expenseInput" className="label">
            Enter the value of expense:
          </label>
          <input
            id="expenseInput"
            className="input"
            type="number"
            value={expense}
            onChange={(event) => setExpense(event.target.value)}
          />
          <label htmlFor="dateInput" className="label">
            Select date:
          </label>
          <input
            id="dateInput"
            type="date"
            className="input"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          {error && <p className="error">*Invalid data</p>}
          <div className="button-container">
            <button className="button" onClick={addToLocalStorage}>
              Add to LocalStorage
            </button>
            <button className="button" onClick={clearLocalStorage}>
              Clear Data
            </button>
          </div>
        </div>
      </div>
      <div className="toggle-container">
        <label htmlFor="yearToggle" className="label">
          Select year:
        </label>
        <select
          id="yearToggle"
          className="input"
          value={selectedYear}
          onChange={(event) => setSelectedYear(Number(event.target.value))}
        >
          {[...yearsSet].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <CChart
        className="chartui"
        type="bar"
        data={{
          labels: monthNames,
          datasets: [
            {
              label: selectedYear,
              backgroundColor: "#7986f8",
              data: expenseData,
            },
          ],
        }}
      />
      <div className="items-container">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">SNO</th>
              <th className="table-cell">Date</th>
              <th className="table-cell">Item</th>
              <th className="table-cell">Expense</th>
              <th className="table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {localStorageData.length > 0 &&
              localStorageData.map((item, index) => (
                <tr key={item.key} className="table-row">
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{formatDate(item.value.date)}</td>
                  <td className="table-cell">{item.value.item}</td>
                  <td className="table-cell">{item.value.expense} rupees</td>
                  <td className="table-cell">
                    <button
                      className="delete-button"
                      onClick={() => deleteFromLocalStorage(item.key)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
