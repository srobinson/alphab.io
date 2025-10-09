"use client";

import { Bell, Mail, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useContactDrawer } from "@/contexts/contact-drawer-context";
import { ContactDrawerForm } from "./contact-drawer-form";

export function ContactDrawer() {
  const { isOpen, mode, source, closeContactDrawer } = useContactDrawer();
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Manage focus when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element (but avoid storing header elements)
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && !activeElement.closest("header")) {
        previousActiveElement.current = activeElement;
      }

      // Focus on the close button after a short delay to ensure it's rendered
      setTimeout(() => {
        const closeButton = drawerRef.current?.querySelector(
          '[aria-label="Close contact drawer"]'
        ) as HTMLElement;
        closeButton?.focus();
      }, 100);
    } else if (
      previousActiveElement.current &&
      previousActiveElement.current !== document.activeElement
    ) {
      // Restore focus to the previously focused element when drawer closes
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeContactDrawer();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, closeContactDrawer]);

  if (!mode || !source) return null;

  const getDrawerContent = () => {
    if (mode === "contact") {
      return {
        icon: <Mail className="w-8 h-8 text-neon-blue" />,
        title: "LET'S CONNECT",
        titleClass: "gradient-text-blue-purple-pink",
        description: "Have a project in mind or want to explore AI possibilities? Let's talk.",
        iconContainer: "bg-neon-blue/10 border-neon-blue/20",
      };
    } else {
      return {
        icon: <Bell className="w-8 h-8 text-neon-yellow" />,
        title: "JOIN THE INNOVATION JOURNEY",
        titleClass: "gradient-text-yellow-red-pink",
        description: "Get exclusive AI insights and updates delivered to your inbox.",
        iconContainer: "bg-neon-yellow/10 border-neon-yellow/20",
      };
    }
  };

  const { icon, title, titleClass, description, iconContainer } = getDrawerContent();

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeContactDrawer()}>
      <DrawerContent
        ref={drawerRef}
        className={`
        bg-gradient-to-br from-black/98 via-gray-900/95 to-black/98
        border-2 border-cyber-border backdrop-blur-2xl
        h-[95vh] max-h-[95vh] overflow-hidden
        inset-x-0 bottom-0
        rounded-t-none
        shadow-2xl shadow-neon-blue/60
        mx-auto max-w-7xl
        relative
      `}
      >
        {/* Custom Header with Close Button */}
        <div className="relative items-center justify-between p-10 border-b border-cyber-border/50 backdrop-blur-sm bg-black/20">
          <div className="flex items-center gap-8">
            <div
              className={`hidden sm:flex relative p-6 rounded-2xl ${iconContainer} shadow-lg backdrop-blur-sm`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              <div className="relative">{icon}</div>
            </div>
            <div className="space-y-3">
              <DrawerTitle
                className={`text-4xl md:text-5xl font-black ${titleClass} mb-0 leading-tight`}
              >
                {title}
              </DrawerTitle>
              <DrawerDescription className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                {description}
              </DrawerDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeContactDrawer}
            className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 rounded-full w-14 h-14 transition-all duration-300 hover:scale-110 backdrop-blur-sm bg-black/20 border border-cyber-border/30"
            aria-label="Close contact drawer"
          >
            <X className="h-8 w-8" />
          </Button>
        </div>

        {/* Form Content - Full Height with Better Spacing */}
        <div className="relative flex-1 overflow-y-auto">
          <ContactDrawerForm mode={mode} source={source} onSuccess={closeContactDrawer} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
