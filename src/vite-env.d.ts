/// <reference types="vite/client" />

interface Document {
  startViewTransition?(callback: () => Promise<void> | void): void;
}
