/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_BASE_URL: string;
  }
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
 
declare module '*.css' {
  const content: { [key: string]: string };
  export default content;
} 