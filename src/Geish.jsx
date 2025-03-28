import { useState } from 'react'
import Calendar from './Calendar'
import { NUMBER_OF_DAYS_OFF, NUMBER_OF_DAYS_WORK } from './Global'
import { isASpecialDay, specialDays, daysIDidNotGet } from './Calendar'

import "./styles.css";

function getAllAgazatStart() {
    let geish = new Date(2025, 7, 20, 0, 0, 0)
    let firstAgaza = new Date(2024, 9, 12, 0, 0, 0)
    let agazat = []
    let index = 0;
    while (firstAgaza < geish) {
        if (index === 1) {
            firstAgaza.setDate(firstAgaza.getDate() + 1)
        }
        else if (index === 4) {
            firstAgaza = (new Date(2025, 1, 13, 0, 0, 0))
        }
        else if (index === 5) {
            firstAgaza = new Date(2025, 3, 7, 0, 0, 0)
        }
        // Last day of all geish
        if (firstAgaza.getMonth() >= 8 && firstAgaza.getDate() >= 1 && firstAgaza.getFullYear() >= 2025) {
            break
        }
        agazat.push(new Date(firstAgaza))
        firstAgaza.setDate(firstAgaza.getDate() + NUMBER_OF_DAYS_OFF)
        firstAgaza.setDate(firstAgaza.getDate() + NUMBER_OF_DAYS_WORK)
        index += 1
    }
    return agazat
}

function renderDate(date)
{
    return `${date.getFullYear()} / ${date.getMonth() + 1} / ${date.getDate()}`
}

function renderAgazat(agazatStartEndPair) {
    let output = []
    const geishEnd = new Date(2025, 7, 20, 0, 0, 0)
    for (let i = 0; i < agazatStartEndPair.length; i++) {
        let start = agazatStartEndPair[i][0]
        let end = agazatStartEndPair[i][1]
        let passed = start < new Date()
        let remainingAfter = Math.floor((geishEnd - end) / (1000 * 60 * 60 * 24))
        let agazaCount = i + 1
        let passedText = (passed) ? '✅' : '❌'
        output.push(
            <tr key={i}>
                <td>{agazaCount}</td>
                <td>{renderDate(start)}</td>
                <td>{renderDate(end)}</td>
                <td>{passedText}</td>
                <td>{remainingAfter}</td>
            </tr>)
    }
    return output
}


function TimerTable({ months, weeks, days, hours, minutes, seconds, agazat, timeUntilNextAgaza }) {
    return (<table className="timer-table">
        <tr>
            <th>In Months</th>
            <th>In Weeks</th>
            <th>In Days</th>
            <th>Hours</th>
            <th>Minutes</th>
            <th>Seconds</th>
            <th>Agazat</th>
            <th>Time until next agaza</th>
        </tr>
        <tr>
            <td>{months}</td>
            <td>{weeks}</td>
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

function insideAgaza(agazatStartEndPair) {
    let now = new Date()
    for (let i = 0; i < agazatStartEndPair.length; i++) {
        let start = agazatStartEndPair[i][0]
        let end = agazatStartEndPair[i][1]
        if (start < now && end > now)
            return true
    }
    return false
}

function getTotalAgazaDaysCount(agazatStartEndPair) {
    let count = 0
    for (let i = 0; i < agazatStartEndPair.length; i++) {
        let start = agazatStartEndPair[i][0]
        let end = agazatStartEndPair[i][1]
        count += Math.floor((end - start) / (1000 * 60 * 60 * 24))
    }

    count += specialDays.length
    return count
}

function getRemainingAgazaDaysCount(agazatStartEndPair) {
    let count = 0
    let today = new Date()
    for (let i = 0; i < agazatStartEndPair.length; i++) {
        let start = agazatStartEndPair[i][0]
        let end = agazatStartEndPair[i][1]

        // A full agaza
        if (start > today)
        {
            count += Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
            console.log("Count1: ", count)
        }
        else if (end > today) // from end to today
        {
            count += Math.floor((end - today) / (1000 * 60 * 60 * 24)) + 1
            console.log("Count2: ", count)
        }
    }
    let i = 0
    for (i = 0; i < specialDays.length; i++) {
        let date = specialDays[i]
        if (date > today)
            break
    }
    count += specialDays.length - i + 1
    return count
}

function getTotalGeishDays(agazatStartEndPair) {
    let geishStart = new Date(2024, 9, 4, 0, 0, 0)
    let geishEnd = new Date(2025, 7, 20, 0, 0, 0)

    return Math.floor((geishEnd - geishStart) / (1000 * 60 * 60 * 24)) - getTotalAgazaDaysCount(agazatStartEndPair)
}

function getRemainingGeishDays(agazatStartEndPair) {
    // Is Today an agaza day / special day?
    const today = new Date()
    let isAgazaDay = false
    if (isASpecialDay(today.getDate(), today.getMonth(), today.getFullYear()) || insideAgaza(agazatStartEndPair))
        isAgazaDay = true

    let startCountDate = today
    if (isAgazaDay)
    {
        for (let i = 0; i < agazatStartEndPair.length; i++) {
            let start = agazatStartEndPair[i][0]
            let end = agazatStartEndPair[i][1]
            if (start < today && end > today) {
                startCountDate = end
                break
            }
        }
    }
    let geishEnd = new Date(2025, 7, 20, 0, 0, 0)
    return Math.floor((geishEnd - startCountDate) / (1000 * 60 * 60 * 24)) - getRemainingAgazaDaysCount(agazatStartEndPair)
}

function getAgazatStartEndPair(agazatStart)
{
    let agazatStartEndPair = []
    for (let i = 0; i < agazatStart.length; i++) {
        let start = agazatStart[i]
        let end = new Date(start)
        end.setDate(end.getDate() + NUMBER_OF_DAYS_OFF)
        agazatStartEndPair.push([start, end])
    }
    return agazatStartEndPair
}

export default function Geish() {
    let [month, setMonth] = useState(0)
    let [weeks, setWeeks] = useState(0)
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
        setWeeks(Math.floor(distance / (1000 * 60 * 60 * 24 * 7)))
        setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000))
        setAgazat(Math.floor(days / 28))
    }

    // Update the distance every second
    setInterval(calculateDistance, 1000)


    let agazatArrayStart = getAllAgazatStart()
    let agazatStartEndPair = getAgazatStartEndPair(agazatArrayStart)
    let agazatTable = renderAgazat(agazatStartEndPair)

    let lastPassedAgaza = getLastPassedAgaza(agazatStartEndPair)
    let geishDays = getRemainingGeishDays(agazatStartEndPair);

    let timeUntilNextAgaza = Math.floor((lastPassedAgaza - new Date()) / (1000 * 60 * 60 * 24))

    let today = new Date()
    if (insideAgaza(agazatStartEndPair))
        timeUntilNextAgaza = "In Agaza :))"
    else if (isASpecialDay(today.getDate(), today.getMonth(), today.getFullYear()))
        timeUntilNextAgaza = "SPECIAL DAY"
    let remainingVacations = getRemainingAgazaDaysCount(agazatStartEndPair)

    // Render the Geish component
    return (
        <div className="main-container">
            <div className="geish-container">
                <div className="timer-box">
                    <div className="timer-header">Hanet ya Sayofa 🎸</div>
                    <TimerTable
                        months={month}
                        weeks={weeks}
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
                            <td>{remainingVacations}</td>
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
                <Calendar allAgazat={agazatStartEndPair}></Calendar>
            </div>
        </div>
    )
}