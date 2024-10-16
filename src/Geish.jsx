import { useState } from 'react'
import Calendar from './Calendar'
import { NUMBER_OF_DAYS_OFF, NUMBER_OF_DAYS_WORK } from './Global'

import "./styles.css";

function getAllAgazat() {
    let geish = new Date(2025, 7, 20, 0, 0, 0)

    let firstAgaza = new Date(2024, 9, 12, 0, 0, 0)
    let agazat = [firstAgaza]
    while (firstAgaza < geish) {
        let nextAgaza = new Date(firstAgaza)
        nextAgaza.setDate(nextAgaza.getDate() + NUMBER_OF_DAYS_OFF)
        nextAgaza.setDate(nextAgaza.getDate() + NUMBER_OF_DAYS_WORK)

        agazat.push(nextAgaza)
        firstAgaza = nextAgaza
        // Last day of all geish
        if (firstAgaza.getMonth() == 7 && firstAgaza.getDate() >= 15) {
            break
        }
    }

    return agazat
}

function renderAgazat(agazat) {
    let output = [];
    for(let i = 0; i < agazat.length; i++) {
        let agazaEnd = new Date(agazat[i])
        agazaEnd.setDate(agazaEnd.getDate() + NUMBER_OF_DAYS_OFF)
        let passed = agazat[i] < new Date()
        output.push(<tr><td>{i + 1}</td><td>{renderDate(agazat[i])}</td><td>{renderDate(agazaEnd)}</td><td>{(passed) ? '✅' : '❌'}</td></tr>)
    }
    return output
}

function renderDate(date)
{
    return `${date.getFullYear()} / ${date.getMonth() + 1} / ${date.getDate()}`
}

function TimerTable({ months, days, hours, minutes, seconds, agazat }) {
    return (<table className="timer-table">
        <tr>
            <th>Months</th>
            <th>Days</th>
            <th>Hours</th>
            <th>Minutes</th>
            <th>Seconds</th>
            <th>Agazat</th>
        </tr>
        <tr>
            <td>{months}</td>
            <td>{days}</td>
            <td>{hours}</td>
            <td>{minutes}</td>
            <td>{seconds}</td>
            <td>{agazat}</td>
        </tr>
    </table>)
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
        let end = new Date(agazatArray[i])
        end.setDate(end.getDate() + NUMBER_OF_DAYS_OFF)
        allAgazat.push([start, end])
    }

    const countNumberOfAgazat = (allAgazat) => {
        let count = 0
        for (let i = 0; i < allAgazat.length; i++) {
            let start = allAgazat[i][0]
            let end = allAgazat[i][1]
            // Count the number of days between start and end that did not pass yet
            let now = new Date()
            if (start > now) {
            count += (end - start) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
            }
            else if (start < now && end > now) {
            count += (end - now) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
            }
        }
        return Math.ceil(count); // Round up to the nearest whole number
    }

    let numberOfAgazat = countNumberOfAgazat(allAgazat)

    let agazatTable = renderAgazat(agazatArray)


    // Render the Geish component
    return (
        <div className="main-container">
            <div className="geish-container">
                <div className="timer-box">
                    <div className="timer-header">Hanet ya Seifff</div>
                    <TimerTable
                        months={month}
                        days={days}
                        hours={hours}
                        minutes={minutes}
                        seconds={seconds}
                        agazat={agazat}
                    />
                    <table className="stat-table">
                        <tr>
                            <th>Vacations remaining</th>
                            <th>Geish Days</th>
                        </tr>
                        <tr>
                            <td>{numberOfAgazat}</td>
                            <td>{days - numberOfAgazat}</td>
                        </tr>
                    </table>
                    <table className="agazat-table">
                        <tr>
                            <th>Agaza Count</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Passed?</th>
                        </tr>
                        {agazatTable}
                    </table>
                </div>
            </div>
            <div className="calendar-container">
                <Calendar allAgazat={allAgazat}></Calendar>
            </div>
        </div>
    )
}