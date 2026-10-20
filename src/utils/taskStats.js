export function getTaskStats(tasks = []) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.done).length;
  const pending = total - completed;
  const today = new Date().toLocaleDateString("en-CA");
  const overdue = tasks.filter(task => !task.done && task.due && task.due < today).length;
  return { total, completed, pending, overdue, completionPercent: total ? Math.round(completed / total * 100) : 0 };
}
