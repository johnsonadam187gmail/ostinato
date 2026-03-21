/// <reference types="vite/client" />
/// <reference lib="webworker" />

declare module '*.svg' {
  const content: string;
  export default content;
}
