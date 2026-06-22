import type { SubLink } from "./sublink";

export interface MenuItem {
  id: string;
  title: string;
  href?: string;
  icon: React.ElementType;
  subLinks?: SubLink[];
}
