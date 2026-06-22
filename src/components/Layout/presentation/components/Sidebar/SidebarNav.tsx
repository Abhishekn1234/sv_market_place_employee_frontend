import type { MenuItem } from "../../../domain/entities/menuitem";
import SidebarNavItem from "./SidebarNavItem";



interface Props {
  menuItems: MenuItem[];
  mini: boolean;
  expanded: string | null;
  unreadCount: number;
  toggleMenu: (id: string) => void;
  handleLogout: () => void;
  setMobileOpen: (open: boolean) => void;
}

export default function SidebarNav({
  menuItems,
  mini,
  expanded,
  unreadCount,
  toggleMenu,
  handleLogout,
  setMobileOpen,
}: Props) {
  return (
    <nav className="flex-1 overflow-y-auto py-4">
      <ul className="space-y-1 px-1">
        {menuItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            mini={mini}
            expanded={expanded}
            unreadCount={unreadCount}
            toggleMenu={toggleMenu}
            handleLogout={handleLogout}
            setMobileOpen={setMobileOpen}
          />
        ))}
      </ul>
    </nav>
  );
}