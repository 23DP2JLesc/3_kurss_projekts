import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check for saved preference or default to dark
    const saved = localStorage.getItem("motoparts_theme");
    const prefersDark = saved ? saved === "dark" : true;
    setIsDark(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("motoparts_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("motoparts_theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full border border-border hover:border-primary flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};

export default DarkModeToggle;
