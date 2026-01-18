import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../services/api";
import "./CalendarView.css";

export default function CalendarView() {
  const [contests, setContests] = useState([]);
  const [offsetDays, setOffsetDays] = useState(0); // ⬅️ days offset

  useEffect(() => {
    api.get("/contests/upcoming").then(res => {
      setContests(res.data);
    });
  }, []);

  // Group contests by LOCAL date
  const grouped = {};
  contests.forEach(c => {
    const key = dayjs(c.startTime).local().format("YYYY-MM-DD");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });

  // ✅ ALWAYS include today
  const baseDay = dayjs().startOf("day").add(offsetDays, "day");

  const days = Array.from({ length: 7 }, (_, i) =>
    baseDay.add(i, "day")
  );

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => setOffsetDays(d => d - 7)}>
          ← Prev
        </button>

        <h2 className="calendar-title">
          {days[0].format("DD MMM")} –{" "}
          {days[6].format("DD MMM")}
        </h2>

        <button onClick={() => setOffsetDays(d => d + 7)}>
          Next →
        </button>
      </div>

      <div className="calendar-grid">
        {days.map(day => {
          const key = day.format("YYYY-MM-DD");
          const isToday = day.isSame(dayjs(), "day");

          return (
            <div
              key={key}
              className={`calendar-cell ${
                isToday ? "today" : ""
              }`}
            >
              <div className="calendar-date">
                <span>{day.format("ddd")}</span>
                <strong>{day.format("DD")}</strong>
              </div>

              <div className="calendar-events">
                {(grouped[key] || []).map(c => (
                  <a
                    key={c._id}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`event-card ${c.platform.toLowerCase()}`}
                  >
                    <span className="event-title">
                      {c.name}
                    </span>

                    {/* ✅ correct single conversion */}
                    <span className="event-time">
                      {dayjs(c.startTime)
                        .local()
                        .format("HH:mm")}
                    </span>
                  </a>
                ))}

                {(!grouped[key] ||
                  grouped[key].length === 0) && (
                  <span className="no-events">
                    No contests
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
