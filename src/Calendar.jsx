
import React, { useState } from 'react';
import './Calendar.css';

const daysIDidNotGet = [
  new Date(2025, 0, 5, 0, 0, 0),
  new Date(2025, 1, 2, 0, 0, 0),
  new Date(2025, 2, 2, 0, 0, 0),
  new Date(2025, 2, 3, 0, 0, 0),
  new Date(2025, 2, 4, 0, 0, 0),
]

const specialDays = [
  new Date(2025, 1, 5, 0 ,0 ,0),
  new Date(2025, 1, 6, 0 ,0 ,0),
  new Date(2025, 1, 7, 0 ,0 ,0),
  new Date(2025, 1, 8, 0 ,0 ,0),
  new Date(2025, 1, 13, 0 ,0 ,0),
  new Date(2025, 1, 14, 0 ,0 ,0),
  new Date(2025, 1, 15, 0 ,0 ,0),
  new Date(2025, 1, 16, 0 ,0 ,0),
  new Date(2025, 1, 17, 0 ,0 ,0),
  new Date(2025, 1, 18, 0 ,0 ,0),
  new Date(2025, 1, 19, 0 ,0 ,0),
  new Date(2025, 2, 12, 0 ,0 ,0),
  new Date(2025, 2, 13, 0 ,0 ,0),
  new Date(2025, 2, 14, 0 ,0 ,0),
  new Date(2025, 2, 15, 0 ,0 ,0),
  new Date(2025, 2, 19, 0 ,0 ,0),
  new Date(2025, 2, 20, 0 ,0 ,0),
  new Date(2025, 2, 21, 0 ,0 ,0),
  new Date(2025, 2, 22, 0 ,0 ,0),
]

function isDateIDidnotGet(day, month, year) {
  for (let i = 0; i < daysIDidNotGet.length; i++) {
      if (daysIDidNotGet[i].getDate() === day &&
          daysIDidNotGet[i].getMonth() === month &&
          daysIDidNotGet[i].getFullYear() === year)
      {
          return true
      }
  }
  return false
}

function isASpecialDay(day, month, year) {
  for (let i = 0; i < specialDays.length; i++) {
    if (specialDays[i].getDate() === day &&
        specialDays[i].getMonth() === month &&
        specialDays[i].getFullYear() === year)
    {
        return true
    }
}
return false
}

// Calendar Component
export default function Calendar({ allAgazat }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper function to get the number of days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper function to get the first day of the month (0 = Sunday, 1 = Monday, ...)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Function to handle changing the month
  const changeMonth = (direction) => {
    let newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isAgaza = (day, month, year) => {
      for (const agaza in allAgazat) {
          let start = allAgazat[agaza][0];
          let end = allAgazat[agaza][1];
          // Check if the day is within the range of the agaza
          let theDay = new Date(year, month, day);
          if (theDay >= start && theDay <= end) {
              return true;
          }
        }
      return false;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

  const daysArray = Array.from({ length: daysInMonth }, (v, i) => i + 1);
  const emptyDaysArray = Array.from({ length: firstDayOfMonth }, (v, i) => '');

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <h2>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>
      <div className="calendar-body">
        <div className="calendar-days-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar-days-grid">
          {emptyDaysArray.map((empty, index) => (
            <div key={`empty-${index}`} className="empty-day"></div>
          ))}
          {daysArray.map((day, index) => {
              let style = 'day';
              if (day === new Date().getDate()
                  && currentMonth === new Date().getMonth()
                   && currentYear === new Date().getFullYear()) {
                  style += ' current-day';
              }
              else if (isDateIDidnotGet(day, currentMonth, currentYear)) {
                  style += ' not-get-day';
              }
              else if (isASpecialDay(day, currentMonth, currentYear)) {
                style += ' special-day';
              }
              else if (isAgaza(day, currentMonth, currentYear)) {
                  style += ' agaza-day';
                }
              else if (day === 20 && currentMonth === 7 && currentYear === 2025) {
                  style += ' geish-end-day';
              }

              return <div key={index} className={style}>{day}</div>
            }
          )}
        </div>
      </div>

      <div className="calendar-footer">
        <p>
            <span style={{'color': 'blue'}}>* Today</span>
          <br />
            <span style={{'color': 'violet'}}>* Agazat</span>
          <br />
            <span style={{'color': 'red', "backgroundColor": "lime"}}>* Geish End</span>
          <br />
            <span style={{'color': 'red', 'backgroundColor':"yellow"}}>* Special Day</span>
          <br />
            <span style={{'color': 'lime', 'backgroundColor':"#a90000a0"}}>* Days I didn't get</span>
        </p>
      </div>
    </div>
  );
}