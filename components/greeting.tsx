"use client"

export function Greeting({ name }: { name: string }) {
    const hour = new Date().getHours()

    const timeGreeting =
        hour < 12 ? "Good morning" :
            hour < 17 ? "Good afternoon" :
                "Good evening"

    return (
        <h1 className="text-semibold text-2xl">
            {timeGreeting}, {name}!👋🏼
        </h1>
    )
}
