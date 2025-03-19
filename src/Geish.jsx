import { useState } from 'react'
import Calendar from './Calendar'
import { NUMBER_OF_DAYS_OFF, NUMBER_OF_DAYS_WORK } from './Global'

import "./styles.css";

function getAllAgazat() {
    let geish = new Date(2025, 7, 20, 0, 0, 0)
    let firstAgaza = new Date(2024, 9, 12, 0, 0, 0)
    let agazat = [firstAgaza]
    let index = 0;
    while (firstAgaza < geish) {
        if (index === 4) {
            let today = new Date(2025, 1, 13, 0, 0, 0)
            agazat.push(today)
        }
        let nextAgaza = new Date(firstAgaza)
        nextAgaza.setDate(nextAgaza.getDate() + NUMBER_OF_DAYS_OFF)
        nextAgaza.setDate(nextAgaza.getDate() + NUMBER_OF_DAYS_WORK)
        if (index === 1)
            nextAgaza.setDate(nextAgaza.getDate() + 1)

        agazat.push(nextAgaza)
        firstAgaza = nextAgaza
        // Last day of all geish
        if (firstAgaza.getMonth() >= 6 && firstAgaza.getDate() >= 1 && firstAgaza.getFullYear() >= 2025) {
            break
        }
        index += 1
    }

    return agazat
}

function renderAgazat(agazat) {
    let output = [];
    let geishEnd = new Date(2025, 7, 20, 0, 0, 0)
    for(let i = 0; i < agazat.length; i++) {
        let agazaEnd = new Date(agazat[i])
        agazaEnd.setDate(agazaEnd.getDate() + NUMBER_OF_DAYS_OFF)
        let passed = agazat[i] < new Date()
        let remainingAfter = Math.floor((geishEnd - agazaEnd) / (1000 * 60 * 60 * 24))
        output.push(<tr><td>{(i === 6) ? "7?" : i + 1}</td><td>{renderDate(agazat[i])}</td><td>{renderDate(agazaEnd)}</td><td>{(passed) ? '✅' : '❌'}</td><td>{remainingAfter}</td></tr>)
    }
    return output
}

function renderDate(date)
{
    return `${date.getFullYear()} / ${date.getMonth() + 1} / ${date.getDate()}`
}

function TimerTable({ months, days, hours, minutes, seconds, agazat, timeUntilNextAgaza }) {
    return (<table className="timer-table">
        <tr>
            <th>Months</th>
            <th>Days</th>
            <th>Hours</th>
            <th>Minutes</th>
            <th>Seconds</th>
            <th>Agazat</th>
            <th>Time until next agaza</th>
        </tr>
        <tr>
            <td>{months}</td>
            <td>{days}</td>
            <td>{hours}</td>
            <td>{minutes}</td>
            <td>{seconds}</td>
            <td>{agazat}</td>
            <td>{timeUntilNextAgaza}</td>
        </tr>
    </table>)
}

function getLastPassedAgaza(agazat) {
    let lastPassedAgaza = agazat[0]
    for (let i = 0; i < agazat.length; i++) {
        if (agazat[i] < new Date())
        {
            continue
        }
        else
        {
            lastPassedAgaza = agazat[i]
            break
        }
    }
    return lastPassedAgaza
}

function insideAgaza(allAgazat) {
    let now = new Date()
    for (let i = 0; i < allAgazat.length; i++) {
        let start = allAgazat[i][0]
        let end = allAgazat[i][1]
        if (start < now && end > now)
            return true
    }
    return false
}

export default function Geish() {
    let [month, setMonth] = useState(0)
    let [days, setDays] = useState(0)
    let [hours, setHours] = useState(0)
    let [minutes, setMinutes] = useState(0)
    let [seconds, setSeconds] = useState(0)
    let [agazat, setAgazat] = useState(0)
    // Calculate the distance between two dates in days, hours, minutes, and seconds
    let calculateDistance = () => {
        let now = new Date()
        let geish = new Date(2025, 7, 20, 0, 0, 0)
        let distance = geish - now

        setMonth(Math.floor(distance / (1000 * 60 * 60 * 24 * 30)))
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)))
        setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000))
        setAgazat(Math.floor(days / 28))
    }

    // Update the distance every second
    setInterval(calculateDistance, 1000)

    let agazatArray = getAllAgazat()
    let allAgazat = []
    for (let i = 0; i < agazatArray.length; i++) {
        let start = agazatArray[i]
        if (i === 1)
            start.setDate(start.getDate() + 1)
        let end = new Date(start)
        end = new Date(end.setDate(end.getDate() + NUMBER_OF_DAYS_OFF))
        allAgazat.push([start, end])
    }

    let agazatDaysCount = agazat * 7
    let agazatTable = renderAgazat(agazatArray)

    let lastPassedAgaza = getLastPassedAgaza(agazatArray)
    let geishDays = days - (agazatDaysCount);

    let timeUntilNextAgaza = Math.floor((lastPassedAgaza - new Date()) / (1000 * 60 * 60 * 24))
    if (insideAgaza(allAgazat))
        timeUntilNextAgaza = "In Agaza :))"

    // Render the Geish component
    return (
        <div className="main-container">
            <div className="geish-container">
                <div className="timer-box">
                    <div className="timer-header">Hanet ya Sayofa</div>
                    <TimerTable
                        months={month}
                        days={days}
                        hours={hours}
                        minutes={minutes}
                        seconds={seconds}
                        agazat={agazat}
                        timeUntilNextAgaza={timeUntilNextAgaza}
                    />
                    <table className="stat-table">
                        <tr>
                            <th>Vacations remaining</th>
                            <th>Geish Days</th>
                        </tr>
                        <tr>
                            <td>{agazatDaysCount}</td>
                            <td>{geishDays}</td>
                        </tr>
                    </table>
                    <table className="agazat-table">
                        <tr>
                            <th>Agaza Count</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Passed?</th>
                            <th>Days Left</th>
                        </tr>
                        {agazatTable}
                    </table>
                    <div style={{textAlign:'left', fontSize: '12px'}}>
                        <ul>
                            <li>The dates are very much approximate, and the actual dates may vary by a few days.</li>
                            <li>The dates are based on the current situation and the current rules, and they may change in the future.</li>
                            <li>I may change my unit entirely which will change the rules of the agazat.</li>
                            <li>It is calculated based on the day: 20th of August 2025</li>
                            <li>The "?" means I am not sure if I will get this Agaza or not.</li>
                        </ul>
                    </div>

                </div>
            </div>
            <div className="calendar-container">
                <Calendar allAgazat={allAgazat}></Calendar>
            </div>
        </div>
    )
}