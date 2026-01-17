// src/context/ThemeContext.tsx
import { useAuthStore } from "@/core/store/auth";
import { createContext, useState, useContext, type ReactNode, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const userTheme = useAuthStore((s) => s.employeeData?.user?.preferredTheme);
  const setPreferredTheme = useAuthStore((s) => s.setPreferredTheme);

  // Initialize theme from store if available, otherwise default to light
  const [theme, setThemeState] = useState<Theme>(userTheme ?? "light");

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);          // Update local state
    setPreferredTheme(newTheme);      // Save to Zustand store
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Update document class on theme change
  useEffect(() => {
    document.documentElement.classList.remove(theme === "light" ? "dark" : "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Sync with store if userTheme changes (like after login)
  useEffect(() => {
    if (userTheme && userTheme !== theme) {
      setThemeState(userTheme);
    }
  }, [userTheme]);

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

