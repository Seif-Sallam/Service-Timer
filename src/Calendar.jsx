
import React, { useState } from 'react';
import './Calendar.css';

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
        </p>
      </div>
    </div>
  );
}