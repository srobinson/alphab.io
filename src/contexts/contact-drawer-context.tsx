"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

export type ContactDrawerMode = "contact" | "newsletter";

export interface ContactDrawerConfig {
  mode: ContactDrawerMode;
  source: string;
}

interface ContactDrawerContextType {
  isOpen: boolean;
  mode: ContactDrawerMode | null;
  source: string | null;
  openContactDrawer: (config: ContactDrawerConfig) => void;
  closeContactDrawer: () => void;
}

const ContactDrawerContext = createContext<ContactDrawerContextType | undefined>(undefined);

export function ContactDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ContactDrawerMode | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const openContactDrawer = (config: ContactDrawerConfig) => {
    setMode(config.mode);
    setSource(config.source);
    setIsOpen(true);
  };

  const closeContactDrawer = () => {
    setIsOpen(false);
    setMode(null);
    setSource(null);
  };

  return (
    <ContactDrawerContext.Provider
      value={{
        isOpen,
        mode,
        source,
        openContactDrawer,
        closeContactDrawer,
      }}
    >
      {children}
    </ContactDrawerContext.Provider>
  );
}

export function useContactDrawer() {
  const context = useContext(ContactDrawerContext);
  if (context === undefined) {
    throw new Error("useContactDrawer must be used within a ContactDrawerProvider");
  }
  return context;
}
