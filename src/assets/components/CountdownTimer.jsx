import { useState, useEffect } from 'react'

const CountdownTimer = ({ eventDate }) => {
    const [timeLeft, setTimeLeft] = useState(null)

    useEffect(() => {
        const target = new Date(eventDate)
        target.setHours(0, 0, 0, 0)

        const calculate = () => {
            const now = new Date()
            const diff = target - now
            if (diff <= 0) { setTimeLeft(null); return }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            })
        }

        calculate()
        const interval = setInterval(calculate, 1000)
        return () => clearInterval(interval)
    }, [eventDate])

    if (!timeLeft) return null

    return (
        <div className="text-center my-4">
            <p className="text-gray-400 text-xs mb-3 tracking-widest uppercase">Counting Down to the Big Day</p>
            <div className="flex justify-center gap-6">
                {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Mins', value: timeLeft.minutes },
                    { label: 'Secs', value: timeLeft.seconds },
                ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                        <div className="text-3xl font-bold" style={{ color: '#5A3E36', minWidth: '48px' }}>
                            {String(value).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CountdownTimer
