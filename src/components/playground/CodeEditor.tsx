'use client'

import { useRef } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'light' | 'dark'
  readOnly?: boolean
}

export function CodeEditor({ 
  value, 
  onChange, 
  language = 'javascript',
  theme = 'dark',
  readOnly = false 
}: CodeEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Configure Monaco Editor for JavaScript/TypeScript
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      typeRoots: ['node_modules/@types']
    })

    // Add Kiren runtime API definitions
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`
      declare const console: {
        log(...args: any[]): void;
        time(label?: string): void;
        timeEnd(label?: string): void;
        error(...args: any[]): void;
        warn(...args: any[]): void;
      };
      
      declare const setTimeout: (callback: () => void, delay: number) => number;
      declare const clearTimeout: (id: number) => void;
      declare const setInterval: (callback: () => void, delay: number) => number;
      declare const clearInterval: (id: number) => void;
      
      declare const fetch: (url: string, options?: any) => Promise<Response>;
      
      declare const fs: {
        readFile(path: string): string;
        writeFile(path: string, content: string): void;
        exists(path: string): boolean;
        mkdir(path: string): void;
      };
      
      declare const process: {
        env: Record<string, string>;
        argv: string[];
        cwd(): string;
        exit(code?: number): void;
      };
      
      declare const http: {
        createServer(): {
          get(path: string, handler: () => any): void;
          post(path: string, handler: () => any): void;
          listen(port: number): void;
        };
      };
    `, 'kiren-runtime.d.ts')

    // Set editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderLineHighlight: 'line',
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly,
      cursorStyle: 'line',
      matchBrackets: 'always',
      theme: theme === 'dark' ? 'vs-dark' : 'vs'
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={value}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace'
        }}
      />
    </div>
  )
}