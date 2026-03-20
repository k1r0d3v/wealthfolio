import { SolidBar } from "@/components/solid-bar";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { cn } from "@/lib/utils";
import {
  Icons,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@wealthfolio/ui";
import { motion } from "motion/react";
import React, { useCallback, useId, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { type NavigationProps, isPathActive } from "./app-navigation";

interface MobileNavBarProps {
  navigation: NavigationProps;
}

export function MobileNavBar({ navigation }: MobileNavBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addonsSheetOpen, setAddonsSheetOpen] = useState(false);
  const { triggerHaptic } = useHapticFeedback();
  const uniqueId = useId();

  const containerClassName = "pointer-events-none fixed inset-x-0 bottom-0 z-50";

  const handleNavigation = useCallback(
    (href: string, isActive: boolean) => {
      if (isActive) return;
      triggerHaptic();
      navigate(href);
    },
    [triggerHaptic, navigate],
  );

  const renderIcon = useCallback((icon?: React.ReactNode) => {
    if (!icon) return <Icons.ArrowRight className="size-6" />;
    if (React.isValidElement<{ className?: string }>(icon)) {
      return icon.props.className ? icon : React.cloneElement(icon, { className: "size-6" });
    }
    if (typeof icon === "function") {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="size-6" />;
    }
    return <span className="size-6">{icon}</span>;
  }, []);

  const primaryItems = navigation?.primary ?? [];
  const secondaryItems = navigation?.secondary ?? [];
  const addonItems = navigation?.addons ?? [];

  const searchItem = {
    title: "Search",
    href: "#search",
    icon: <Icons.Search2 className="size-6" />,
  };

  const visibleItems = [primaryItems[0], primaryItems[1], searchItem].filter(Boolean);
  const menuItems = [...primaryItems.slice(2), ...secondaryItems];
  const hasMenu = menuItems.length > 0 || addonItems.length > 0;
  const hasAddons = addonItems.length > 0;
  const columnCount = visibleItems.length + (hasMenu ? 1 : 0);

  return (
    <div className={containerClassName}>
      <div className="flex justify-center pb-[max(var(--mobile-nav-gap),env(safe-area-inset-bottom))]">
        <SolidBar
          className={cn("pointer-events-auto w-full px-5 flex items-center" )} // , "h-[var(--mobile-nav-ui-height)]"
        >
          <nav
            aria-label="Primary navigation"
            className={cn("grid place-items-center gap-1 h-full")}
            style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
          >
            {visibleItems.map((item) => {
              const isActive = isPathActive(location.pathname, item.href);
              const isSearch = item.href === "#search";
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={(e) => {
                    if (isSearch) {
                      e.preventDefault();
                      triggerHaptic();
                      const event = new KeyboardEvent("keydown", {
                        key: "k", code: "KeyK", keyCode: 75, which: 75,
                        metaKey: true, ctrlKey: true, bubbles: true, cancelable: true,
                      });
                      document.dispatchEvent(event);
                    } else {
                      handleNavigation(item.href, isActive);
                    }
                  }}
                  aria-label={item.title}
                  className="mt-1 mb-1 text-foreground relative z-10 flex h-12 w-full items-center justify-center rounded-full transition-colors"
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId={`mobile-nav-indicator-${uniqueId}`}
                      className="absolute inset-0 -z-10 rounded-full bg-black/5 shadow-sm dark:bg-white/10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="[&_path[opacity]]:hidden relative flex size-6 shrink-0 items-center justify-center outline-none" aria-hidden="true">
                    {renderIcon(item.icon)}
                  </span>
                </Link>
              );
            })}

            {hasMenu && (
              <>
                <button
                  onClick={() => { triggerHaptic(); setMobileMenuOpen(true); }}
                  aria-label="More options"
                  className="mt-1 mb-1 text-foreground relative z-10 flex h-12 w-full items-center justify-center rounded-full transition-colors"
                >
                  {(menuItems.some((item) => isPathActive(location.pathname, item.href)) ||
                    addonItems.some((item) => isPathActive(location.pathname, item.href))) && (
                    <motion.div
                      layoutId={`mobile-nav-indicator-${uniqueId}`}
                      className="absolute inset-0 -z-10 rounded-full bg-black/5 shadow-sm dark:bg-white/10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="[&_path[opacity]]:hidden relative flex size-6 shrink-0 items-center justify-center outline-none" aria-hidden="true">
                    <Icons.DotsThree className="size-6" />
                  </span>
                </button>

                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetContent
                    side="bottom"
                    className="mx-auto flex w-full max-w-screen-sm flex-col overflow-hidden rounded-t-3xl border-none px-0 pb-6 pt-4"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <SheetHeader className="px-6 pb-2">
                      <SheetTitle>More Options</SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col gap-1 px-2">
                      {menuItems.map((item, index) => {
                        const isActive = isPathActive(location.pathname, item.href);
                        return (
                          <React.Fragment key={item.href}>
                            <SheetClose asChild>
                              <Link
                                to={item.href}
                                onClick={() => handleNavigation(item.href, isActive)}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                  "flex w-full items-center gap-3 rounded-xl px-4 py-4 text-base transition-colors",
                                  isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-accent hover:text-accent-foreground text-foreground",
                                )}
                              >
                                <span className="[&_path[opacity]]:hidden text-muted-foreground flex size-5 shrink-0 items-center justify-center">
                                  {renderIcon(item.icon)}
                                </span>
                                <span className="truncate text-left font-medium">{item.title}</span>
                              </Link>
                            </SheetClose>
                            {index < menuItems.length - 1 && (
                              <div className="mx-4 h-px" style={{ backgroundColor: 'var(--border)' }} />
                            )}
                          </React.Fragment>
                        );
                      })}

                      {hasAddons && (
                        <>
                          <div className="mx-4 h-px" style={{ backgroundColor: 'var(--border)' }} />
                          <SheetClose asChild>
                            <button
                              onClick={() => {
                                triggerHaptic();
                                setAddonsSheetOpen(true);
                              }}
                              className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-base text-foreground transition-colors hover:bg-muted"
                            >
                              <span className="text-muted-foreground flex size-5 shrink-0 items-center justify-center">
                                <Icons.Addons className="size-5" />
                              </span>
                              <span className="truncate text-left font-medium">Add-ons</span>
                            </button>
                          </SheetClose>
                        </>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </nav>
        </SolidBar>
      </div>

      <Sheet open={addonsSheetOpen} onOpenChange={setAddonsSheetOpen}>
        <SheetContent side="bottom" className="px-4 pb-8">
          <SheetHeader>
            <SheetTitle>Add-ons</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-2">
            {addonItems.map((item) => {
              const isActive = isPathActive(location.pathname, item.href);
              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => handleNavigation(item.href, isActive)}
                    className={cn(
                      "flex h-12 items-center gap-3 rounded-lg px-4 transition-colors",
                      isActive ? "bg-secondary" : "hover:bg-secondary/50",
                    )}
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center">
                      {renderIcon(item.icon)}
                    </span>
                    <span className="text-base font-medium">{item.title}</span>
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
