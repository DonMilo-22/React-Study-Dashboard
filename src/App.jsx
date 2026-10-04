import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";

const seed = [
  { id: 1, title: "Review OSI model", subject: "Networks", due: "2026-10-01", done: false },
  { id: 2, title: "Finish SQL practice", subject: "Databases", due: "2026-10-03", done: true }
];

export default function App() {
  const [tasks,setTasks] = useState(() => JSON.parse(localStorage.getItem("study-tasks") || "null") || seed);
  const [filter,setFilter] = useState("all");
  const [form,setForm] = useState({title:"",subject:"",due:""});
  useEffect(() => localStorage.setItem("study-tasks", JSON.stringify(tasks)), [tasks]);
  const visible = useMemo(() => tasks
    .filter(t => filter === "all" || (filter === "done" ? t.done : !t.done))
    .sort((a,b) => (a.due || "9999-12-31").localeCompare(b.due || "9999-12-31")), [tasks,filter]);
  const done = tasks.filter(t => t.done).length;
  const progress = tasks.length ? Math.round(done / tasks.length * 100) : 0;

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
    </section>
    <div className="progress"><span style={{width: progress + "%"}} /></div>
    <section className="grid">
      <form onSubmit={add} className="card form">
        <h2><Plus size={18}/> Add assignment</h2>
        <input placeholder="What do you need to do?" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <input placeholder="Subject" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/>
        <input type="date" value={form.due} onChange={e=>setForm({...form,due:e.target.value})}/>
        <button>Add task</button>
      </form>
      <section className="card">
        <div className="toolbar"><h2>Assignments</h2><div>{["all","pending","done"].map(f=><button className={filter===f?"active":""} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div></div>
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