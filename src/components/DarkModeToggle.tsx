
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DarkModeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // on mount, sync theme with localStorage if any
    const theme = localStorage.getItem("theme");
    setIsDark(theme === "dark");
    if (theme) {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, []);

  const handleToggle = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button
      onClick={handleToggle}
      variant="outline"
      size="sm"
      className={className}
      title="Toggle Dark Mode"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="ml-2">{isDark ? "Mode Terang" : "Mode Gelap"}</span>
    </Button>
  );
};
