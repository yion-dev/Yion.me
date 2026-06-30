"use client";
import { getPing } from "@/_lib/api";
import { useEffect, useState } from "react";

const weatherCodeMap: Record<number, string> = {
    0: "clear skies",
    1: "mostly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "foggy",
    48: "foggy",
    51: "light drizzle",
    61: "light rain",
    63: "rain",
    65: "heavy rain",
    71: "light snow",
    80: "rain showers",
    95: "thunderstorm",
};

export default function VisitorInfo() {
    const [location, setLocation] = useState<string>("");
    const [ping, setPing] = useState<string>("");
    const [weather, setWeather] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [time, setTime] = useState<string>("");

    const handleFetch = async () => {
        setLoading(true);
        try {
            const geoRes = await fetch("https://ipapi.co/json/");
            const geo = await geoRes.json();
            const ms = await getPing();
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,weather_code`
            );
            const weatherData = await weatherRes.json();
            const temp = Math.round(weatherData.current.temperature_2m);
            const desc = weatherCodeMap[weatherData.current.weather_code] || "unknown";

            setLocation(`${geo.city}, ${geo.country_name}`);
            setPing(`${ms}ms`);
            setWeather(`${temp}°C, ${desc}`);
        } catch (e) {
            setLocation("404, xxx");
            setPing("xxms");
            setWeather("--°C, unknown");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetch();
        const tick = () => setTime(new Date().toLocaleTimeString());
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col w-full h-full justify-end gap-2 ps-4 font-mono text-sm">
            <h4 className="text-zinc-500">$ visitor info</h4>
            <div className="flex flex-col">
                <p>
                    &gt; location:{" "}
                    {loading ? (
                        <span className="inline-block h-4 w-32 bg-zinc-700 rounded animate-pulse align-middle" />
                    ) : (
                        location
                    )}
                </p>
                <p>
                    &gt; ping:{" "}
                    {loading ? (
                        <span className="inline-block h-4 w-16 bg-zinc-700 rounded animate-pulse align-middle" />
                    ) : (
                        ping
                    )}
                </p>
                <p>
                    &gt; weather:{" "}
                    {loading ? (
                        <span className="inline-block h-4 w-38 bg-zinc-700 rounded animate-pulse align-middle" />
                    ) : (
                        weather
                    )}
                </p>
                <p>&gt; local time: {time}</p>

            </div>
        </div>
    );
}