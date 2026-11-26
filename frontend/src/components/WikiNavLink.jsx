import { NavLink } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function WikiNavLink() {
  return <NavLink to="/wiki" aria-label="Wiki y tutorial" title="Wiki y tutorial" className={({ isActive }) => isActive ? "activo" : ""}><BookOpen aria-hidden="true" /><span>Wiki y tutorial</span></NavLink>;
}
