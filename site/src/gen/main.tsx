import "./tokens.css";
import { createRoot } from "react-dom/client";
import { HomePage } from "./home/home-page";

createRoot(document.getElementById("root") as HTMLElement).render(<HomePage />);
