export const CATEGORY_COLORS = [
  { id: "slate", bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-700", ring: "ring-slate-500/20" },
  { id: "red", bg: "bg-red-100", border: "border-red-200", text: "text-red-700", ring: "ring-red-500/20" },
  { id: "orange", bg: "bg-orange-100", border: "border-orange-200", text: "text-orange-700", ring: "ring-orange-500/20" },
  { id: "amber", bg: "bg-amber-100", border: "border-amber-200", text: "text-amber-700", ring: "ring-amber-500/20" },
  { id: "yellow", bg: "bg-yellow-100", border: "border-yellow-200", text: "text-yellow-700", ring: "ring-yellow-500/20" },
  { id: "lime", bg: "bg-lime-100", border: "border-lime-200", text: "text-lime-700", ring: "ring-lime-500/20" },
  { id: "green", bg: "bg-green-100", border: "border-green-200", text: "text-green-700", ring: "ring-green-500/20" },
  { id: "emerald", bg: "bg-emerald-100", border: "border-emerald-200", text: "text-emerald-700", ring: "ring-emerald-500/20" },
  { id: "teal", bg: "bg-teal-100", border: "border-teal-200", text: "text-teal-700", ring: "ring-teal-500/20" },
  { id: "cyan", bg: "bg-cyan-100", border: "border-cyan-200", text: "text-cyan-700", ring: "ring-cyan-500/20" },
  { id: "sky", bg: "bg-sky-100", border: "border-sky-200", text: "text-sky-700", ring: "ring-sky-500/20" },
  { id: "blue", bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-700", ring: "ring-blue-500/20" },
  { id: "indigo", bg: "bg-indigo-100", border: "border-indigo-200", text: "text-indigo-700", ring: "ring-indigo-500/20" },
  { id: "violet", bg: "bg-violet-100", border: "border-violet-200", text: "text-violet-700", ring: "ring-violet-500/20" },
  { id: "purple", bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-700", ring: "ring-purple-500/20" },
  { id: "fuchsia", bg: "bg-fuchsia-100", border: "border-fuchsia-200", text: "text-fuchsia-700", ring: "ring-fuchsia-500/20" },
  { id: "pink", bg: "bg-pink-100", border: "border-pink-200", text: "text-pink-700", ring: "ring-pink-500/20" },
  { id: "rose", bg: "bg-rose-100", border: "border-rose-200", text: "text-rose-700", ring: "ring-rose-500/20" },
];

export function getCategoryColor(id: string) {
  const color = CATEGORY_COLORS.find(c => c.id === id);
  return color || CATEGORY_COLORS[0]; // fallback to slate
}
