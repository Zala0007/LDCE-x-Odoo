"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";

type Category = { name: string; value: number; color: string };
type Day = { date: string; total: number };

export function BudgetCharts({ categories, days }: { categories: Category[]; days: Day[] }) {
  const nonZero = categories.filter((item) => item.value > 0);
  return <div className="budget-chart-grid">
    <section className="chart-card"><div><p className="eyebrow">Where it goes</p><h2>Category breakdown</h2></div>{nonZero.length ? <div className="pie-layout"><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={nonZero} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>{nonZero.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => formatCurrency(Number(value))} /></PieChart></ResponsiveContainer></div><div className="chart-legend">{categories.map((item) => <span key={item.name}><i style={{ background: item.color }} /><b>{item.name}</b><em>{formatCurrency(item.value)}</em></span>)}</div></div> : <p className="chart-empty">Add stops and activities to see your cost mix.</p>}</section>
    <section className="chart-card"><div><p className="eyebrow">Day by day</p><h2>Daily estimate</h2></div><div className="bar-chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={days} margin={{ top: 10, right: 4, left: -14, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e2d8" /><XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7974" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: "#6b7974" }} axisLine={false} tickLine={false} /><Tooltip formatter={(value) => formatCurrency(Number(value))} /><Bar dataKey="total" fill="#1e5948" radius={[7,7,0,0]} maxBarSize={38} /></BarChart></ResponsiveContainer></div></section>
  </div>;
}
