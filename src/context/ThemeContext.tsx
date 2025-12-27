// src/context/ThemeContext.tsx
import { createContext, useState, useContext, type ReactNode, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  // Update document class on theme change
  useEffect(() => {
    document.documentElement.classList.remove(theme === "light" ? "dark" : "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
