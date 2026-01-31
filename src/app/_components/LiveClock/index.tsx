"use client";

import { useEffect, useState, memo } from "react";

const LiveClock = memo(() => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60_000); // atualiza a cada minuto

        return () => clearInterval(interval);
    }, []);

    const greeting = now.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const time = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <p className="text-[30px] text-muted-foreground capitalize">
            {greeting} · {time}
        </p>
    );
});

LiveClock.displayName = "LiveClock";

export default LiveClock;
