declare module 'react-markdown' {
  import React from 'react';

  export interface ReactMarkdownOptions {
    children: string;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    components?: Record<string, React.ComponentType<any>>;
    className?: string;
  }

  const ReactMarkdown: React.FC<ReactMarkdownOptions>;

  export default ReactMarkdown;
}

declare module 'remark-gfm' {
  const remarkGfm: any;
  export default remarkGfm;
}

declare module 'rehype-raw' {
  const rehypeRaw: any;
  export default rehypeRaw;
}

declare module 'rehype-sanitize' {
  const rehypeSanitize: any;
  export default rehypeSanitize;
}

declare module 'react-syntax-highlighter' {
  import { CSSProperties } from 'react';

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    children: string;
    className?: string;
    PreTag?: string;
    [key: string]: any;
  }

  export const Prism: React.ComponentType<SyntaxHighlighterProps>;
  export const Light: React.ComponentType<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const vscDarkPlus: any;
  const dracula: any;
  const atomDark: any;
  const materialDark: any;
  const materialLight: any;
  const nord: any;
  const okaidia: any;
  const prism: any;
  const solarizedlight: any;
  const tomorrow: any;

  export {
    vscDarkPlus,
    dracula,
    atomDark,
    materialDark,
    materialLight,
    nord,
    okaidia,
    prism,
    solarizedlight,
    tomorrow
  };
}
