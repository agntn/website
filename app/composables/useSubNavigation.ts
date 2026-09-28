import type { ContentNavigationItem } from "@nuxt/content";
import { LIBRARIES } from "../utils/libraries";

const NAV_ICONS: Record<string, string> = {
  "/about": "i-lucide-book-open",
  "/about/shape": "i-lucide-shapes",
  "/about/surfaces": "i-lucide-plug",
  "/about/conventions": "i-lucide-wrench",
  "/about/security": "i-lucide-shield-alert",
  "/libraries": "i-lucide-library",
  ...Object.fromEntries(LIBRARIES.map((library) => [library.to, library.icon])),
};

function withIcons(items: readonly ContentNavigationItem[]): ContentNavigationItem[] {
  return items.map((item) => ({
    ...item,
    icon: NAV_ICONS[item.path] ?? item.icon,
    /** Leaf pages match exactly, so /about is not highlighted together with /about/shape. */
    exact: !item.children?.length,
    children: item.children ? withIcons(item.children) : item.children,
  }));
}

/**
 * The navigation with this site's icons. Both sections are also the header's areas, so the sidebar
 * holds all of them and there is no tab row.
 *
 * @returns {object} `sidebarNavigation`, which the mobile menu shows as well.
 */
export function useSubNavigation() {
  const navigation = inject<Ref<ContentNavigationItem[]>>("navigation");
  const sidebarNavigation = computed(() => withIcons(navigation?.value ?? []));
  return { sidebarNavigation };
}
