import { useState } from 'react'
import "./styles.css";

function getAllAgazat() {
    let now = new Date()
    let geish = new Date(2025, 7, 20, 0, 0, 0)

    let firstAgaza = new Date(2024, 9, 12, 0, 0, 0)
    let agazat = [firstAgaza]
    while (firstAgaza < geish) {
        let nextAgaza = new Date(firstAgaza)
        nextAgaza.setDate(nextAgaza.getDate() + 6) // 6 days of agaza
        nextAgaza.setDate(nextAgaza.getDate() + 22)

        agazat.push(nextAgaza)
        firstAgaza = nextAgaza
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
        agazaEnd.setDate(agazaEnd.getDate() + 6)
        let passed = agazat[i] < new Date()
        output.push(<tr><td>{i + 1}</td><td>{renderDate(agazat[i])}</td><td>{renderDate(agazaEnd)}</td><td>{(passed) ? '✅' : '❌'}</td></tr>)
    }
    return output
}

function renderDate(date)
{
    return `${date.getFullYear()} / ${date.getMonth() + 1} / ${date.getDate()}`
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
    let agazatArr = getAllAgazat()
    let agazatTable = renderAgazat(agazatArr)


    // Render the Geish component
    return (
        <div>
            <div className="timer-box">
                <div className="timer-header">Hanet ya Seifff</div>
                <table className="timer-table">
                    <tr>
                        <th>Months</th>
                        <th>Days</th>
                        <th>Hours</th>
                        <th>Minutes</th>
                        <th>Seconds</th>
                        <th>Agazat</th>
                    </tr>
                    <tr>
                        <td>{month}</td>
                        <td>{days}</td>
                        <td>{hours}</td>
                        <td>{minutes}</td>
                        <td>{seconds}</td>
                        <td>{agazat}</td>
                    </tr>
                </table>

                <table className="stat-table">
                    <tr>
                        <th>Vacations remaining</th>
                        <th>Geish Days</th>
                    </tr>
                    <tr>
                        <td>{agazat * 7}</td>
                        <td>{agazat * 21}</td>
                    </tr>
                </table>

                <table className="agazat-table">
                    <tr>
                        <th>Agaza Count</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Passed?</th>
                    </tr>
                    {/* Render all the rest of the table here*/}
                    {agazatTable}

                </table>
            </div>
        </div>
    )
}