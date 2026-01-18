import CalendarView from "./components/CalendarView";
import "./App.css";

export default function App() {
  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header">
          <img src="/Screenshot_From_2026-01-18_15-39-57-removebg-preview.png" alt="..." style={{width:'300px'}}/>
          <p className="app-subtitle">
            Upcoming competitive programming contests
          </p>
        </header>

        <div className="app-card">
          <CalendarView />
        </div>

        <footer className="app-footer">
          © {new Date().getFullYear()} Contest Manager
        </footer>
      </div>
    </div>
  );
}
