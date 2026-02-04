import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../services/api";
import "./CalendarView.css";

export default function CalendarView() {
  const [contests, setContests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [offsetDays, setOffsetDays] = useState(0); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contestsRes, questionsRes] = await Promise.all([
        api.get("/contests/upcoming"),
        api.get("/questions/all")
      ]);
      setContests(contestsRes.data);
      setQuestions(questionsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleQuestion = (id) => {
    setQuestions(prev => prev.map(q => 
      q._id === id ? { ...q, isCompleted: !q.isCompleted } : q
    ));
    api.patch(`/questions/${id}/toggle`).catch(() => fetchData());
  };

  // Grouping Data
  const groupedContests = {};
  contests.forEach(c => {
    const key = dayjs(c.startTime).local().format("YYYY-MM-DD");
    if (!groupedContests[key]) groupedContests[key] = [];
    groupedContests[key].push(c);
  });

  const groupedQuestions = {};
  questions.forEach(q => {
    if (!groupedQuestions[q.assignedDate]) groupedQuestions[q.assignedDate] = [];
    groupedQuestions[q.assignedDate].push(q);
  });

  const baseDay = dayjs().startOf("day").add(offsetDays, "day");
  const days = Array.from({ length: 7 }, (_, i) => baseDay.add(i, "day"));

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <button className="nav-btn" onClick={() => setOffsetDays(d => d - 7)}>← Prev Week</button>
        <h2 className="calendar-title">
          {days[0].format("MMM DD")} – {days[6].format("MMM DD, YYYY")}
        </h2>
        <button className="nav-btn" onClick={() => setOffsetDays(d => d + 7)}>Next Week →</button>
      </div>

      {/* Grid */}
      <div className="calendar-grid">
        {days.map(day => {
          const dateKey = day.format("YYYY-MM-DD");
          const isToday = day.isSame(dayjs(), "day");
          const todaysContests = groupedContests[dateKey] || [];
          const todaysQuestions = groupedQuestions[dateKey] || [];
          const isFreeDay = todaysContests.length === 0 && todaysQuestions.length === 0;

          return (
            <div key={dateKey} className={`calendar-cell ${isToday ? "today" : ""}`}>
              
              {/* Cell Header */}
              <div className="cell-header">
                <span className="day-name">{day.format("ddd")}</span>
                <span className="day-number">{day.format("D")}</span>
              </div>

              {/* Contests */}
              <div className="contest-list">
                {todaysContests.map(c => (
                  <a
                    key={c._id}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`contest-card ${c.platform.toLowerCase()}`}
                    title={c.name}
                  >
                    <span className="time-badge">
                      {dayjs(c.startTime).local().format("HH:mm")}
                    </span>
                    <span className="contest-name">{c.platform}</span>
                  </a>
                ))}
              </div>

              {/* Questions */}
              <div className="questions-section">
                {todaysQuestions.length > 0 && <div className="section-label">Daily Tasks</div>}
                
                {todaysQuestions.map(q => (
                  <div key={q._id} className={`q-item ${q.isCompleted ? "completed" : ""}`}>
                    <input 
                      type="checkbox" 
                      className="q-checkbox"
                      checked={q.isCompleted} 
                      onChange={() => toggleQuestion(q._id)}
                    />
                    <a href={q.url} target="_blank" rel="noreferrer" className="q-link">
                      {q.title}
                    </a>
                  </div>
                ))}
                
                {isFreeDay && (
                  <div className="free-day">
                    <span>☕</span>
                    <span>Rest Day</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}