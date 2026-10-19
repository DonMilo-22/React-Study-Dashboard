import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Circle, Download, Plus, Timer, Trash2 } from "lucide-react";

const seed = [
  { id: 1, title: "Review OSI model", subject: "Networks", due: "2026-10-01", done: false },
  { id: 2, title: "Finish SQL practice", subject: "Databases", due: "2026-10-03", done: true }
];

export default function App() {
  const [tasks,setTasks] = useState(() => JSON.parse(localStorage.getItem("study-tasks") || "null") || seed);
  const [filter,setFilter] = useState("all");
  const [query,setQuery] = useState("");
  const [form,setForm] = useState({title:"",subject:"",due:""});
  const [focusSeconds,setFocusSeconds] = useState(25 * 60);
  const [timerRunning,setTimerRunning] = useState(false);
  useEffect(() => localStorage.setItem("study-tasks", JSON.stringify(tasks)), [tasks]);
  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => setFocusSeconds(seconds => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);
  useEffect(() => { if (focusSeconds === 0) setTimerRunning(false); }, [focusSeconds]);
  const visible = useMemo(() => tasks
    .filter(t => filter === "all" || (filter === "done" ? t.done : filter === "today" ? (!t.done && t.due === new Date().toLocaleDateString("en-CA")) : filter === "week" ? (!t.done && t.due && t.due >= new Date().toLocaleDateString("en-CA") && t.due <= new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-CA")) : filter === "overdue" ? (!t.done && t.due && t.due < new Date().toLocaleDateString("en-CA")) : !t.done))
    .filter(t => (t.title + " " + t.subject).toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a,b) => (a.due || "9999-12-31").localeCompare(b.due || "9999-12-31")), [tasks,filter,query]);
  const done = tasks.filter(t => t.done).length;
  const progress = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  const today = new Date().toLocaleDateString("en-CA");
  const nextWeek = new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-CA");
  const dueSoon = tasks.filter(t => !t.done && t.due && t.due >= today && t.due <= nextWeek).length;
  const overdue = tasks.filter(t => !t.done && t.due && t.due < today).length;
  const undated = tasks.filter(t => !t.done && !t.due).length;
  const timerDisplay = `${String(Math.floor(focusSeconds / 60)).padStart(2, "0")}:${String(focusSeconds % 60).padStart(2, "0")}`;

  function exportCsv() {
    const escape = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = ["title,subject,due,done", ...tasks.map(t =>
      [t.title, t.subject, t.due, t.done ? "yes" : "no"].map(escape).join(",")
    )].join("\n");
    const url = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8;"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = "study-assignments.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function add(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.subject.trim()) return;
    setTasks([...tasks, {id: Date.now(), ...form, done:false}]);
    setForm({title:"",subject:"",due:""});
  }

  return <main className="shell">
    <header><div><span className="eyebrow">LOCAL STUDY SPACE</span><h1>Study Dashboard</h1><p>One calm place for the work that actually matters.</p></div><BookOpen size={36}/></header>
    <section className="stats">
      <article><strong>{tasks.length}</strong><span>Total tasks</span></article>
      <article><strong>{tasks.length-done}</strong><span>Pending</span></article>
      <article><strong>{progress}%</strong><span>Completed</span></article>
      <article><strong>{dueSoon}</strong><span>Due in 7 days</span></article>
      <article><strong>{overdue}</strong><span>Overdue</span></article>
      <article><strong>{undated}</strong><span>Undated</span></article>
    </section>
    <div className="progress"><span style={{width: progress + "%"}} /></div>
    <p className="progress-label">{done} of {tasks.length} assignments completed</p>
    <section className="card focus-timer" aria-label="Focus timer">
      <h2><Timer size={18}/> Focus session</h2>
      <p className="timer-display" role="timer" aria-live="polite">{timerDisplay}</p>
      <p>Work in a short, distraction-free block.</p>
      <div className="timer-actions">
        <button onClick={() => { if (focusSeconds === 0) setFocusSeconds(25 * 60); setTimerRunning(true); }} disabled={timerRunning}>Start 25 min</button>
        <button onClick={() => setTimerRunning(false)} disabled={!timerRunning}>Pause</button>
        <button onClick={() => { setTimerRunning(false); setFocusSeconds(25 * 60); }}>Reset</button>
      </div>
    </section>
    <section className="grid">
      <form onSubmit={add} className="card form">
        <h2><Plus size={18}/> Add assignment</h2>
        <input placeholder="What do you need to do?" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <input placeholder="Subject" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/>
        <input type="date" value={form.due} onChange={e=>setForm({...form,due:e.target.value})}/>
        <button>Add task</button>
      </form>
      <section className="card">
        <div className="toolbar"><h2>Assignments</h2><div>{["all","pending","today","week","overdue","done"].map(f=><button className={filter===f?"active":""} onClick={()=>setFilter(f)} key={f}>{f}</button>)}<button onClick={exportCsv}><Download size={14}/> Export CSV</button>{done > 0 && <button onClick={()=>setTasks(tasks.filter(t=>!t.done))}>Clear completed</button>}</div></div>
        <input aria-label="Search assignments" placeholder="Search assignments..." value={query} onChange={e=>setQuery(e.target.value)} />
        <div className="tasks">
          {visible.length === 0 && <p className="empty">Nothing here. Tiny victory unlocked.</p>}
          {visible.map(t => <article className={"task " + (t.done ? "done" : "")} key={t.id}>
            <button className="icon" onClick={()=>setTasks(tasks.map(x=>x.id===t.id?{...x,done:!x.done}:x))}>{t.done?<CheckCircle2/>:<Circle/>}</button>
            <div><strong>{t.title}</strong><p>{t.subject}{t.due ? " · Due " + t.due : ""}{!t.done && t.due && t.due < new Date().toLocaleDateString("en-CA") ? " · ⚠ Overdue" : ""}</p></div>
            <button className="icon" onClick={()=>setTasks(tasks.filter(x=>x.id!==t.id))}><Trash2 size={18}/></button>
          </article>)}
        </div>
      </section>
    </section>
  </main>;
}