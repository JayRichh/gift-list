"use client";

import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

import { memo, useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";

import { cn } from "~/utils/cn";

// Dynamically import Monaco editor with no SSR
const Editor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.default), {
  ssr: false,
});

// Initialize Monaco only once at the module level
let monacoInitialized = false;

const initializeMonaco = async () => {
  if (monacoInitialized) return;

  const { loader } = await import("@monaco-editor/react");
  const monaco = await loader.init();

  // Configure TypeScript/JavaScript defaults
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.React,
    jsxFactory: "React.createElement",
    reactNamespace: "React",
    allowNonTsExtensions: true,
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  });

  // Add custom component completions
  monaco.languages.registerCompletionItemProvider("typescript", {
    provideCompletionItems: (model, position) => {
      const wordInfo = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: wordInfo.startColumn,
        endColumn: wordInfo.endColumn,
      };

      const suggestions = [
        {
          label: "Slider",
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: "Slider",
          detail: "UI Component",
          documentation: "A slider input component",
          range,
        },
        {
          label: "Button",
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: "Button",
          detail: "UI Component",
          documentation: "A button component",
          range,
        },
      ];

      return { suggestions };
    },
  });

  monacoInitialized = true;
};

interface CodeHighlightProps {
  code: string;
  language: string;
  maxHeight?: number;
}

const CodeHighlight = memo(({ code, language, maxHeight = 800 }: CodeHighlightProps) => {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeMonaco();
  }, []);

  const handleEditorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    // Adjust editor height to content with configurable max height
    const updateHeight = () => {
      const contentHeight = Math.min(editor.getContentHeight(), maxHeight);
      const container = editor.getContainerDomNode();
      container.style.height = `${contentHeight}px`;
      editor.layout();
    };

    editor.onDidContentSizeChange(updateHeight);
    updateHeight();

    // Handle scroll events
    editor.onDidScrollChange((_e) => {
      if (containerRef.current) {
        const scrollTop = editor.getScrollTop();
        const scrollHeight = editor.getScrollHeight();
        const clientHeight = editor.getLayoutInfo().height;

        // Enable parent scroll when at editor boundaries
        containerRef.current.style.overflowY =
          scrollTop <= 0 || scrollTop >= scrollHeight - clientHeight ? "visible" : "hidden";
      }
    });
  };

  if (!mounted) {
    return (
      <div className="flex h-20 items-center justify-center text-sm text-foreground/60">
        Loading editor...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-md">
      <Editor
        height="auto"
        defaultValue={code}
        defaultLanguage={language === "typescript" ? "typescript" : "javascript"}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: "visible",
            horizontal: "hidden",
            useShadows: true,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 10,
          },
          overviewRulerLanes: 0,
          fontSize: 14,
          lineHeight: 20,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "none",
          contextmenu: false,
          folding: false,
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          glyphMargin: false,
          guides: { indentation: false },
          domReadOnly: true,
          wordWrap: "on",
        }}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex h-20 items-center justify-center text-sm text-foreground/60">
            Loading editor...
          </div>
        }
      />
    </div>
  );
});

CodeHighlight.displayName = "CodeHighlight";

interface CodePreviewProps {
  code: string;
  language?: string;
  title?: string;
  preview?: React.ReactNode;
  className?: string;
  maxHeight?: number;
}

export function CodePreview({
  code,
  language = "typescript",
  title,
  preview,
  className,
  maxHeight,
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async () => {
    if (!mounted) return;
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border-2 border-border/50",
        "bg-background/40 backdrop-blur-md",
        "shadow-lg shadow-black/5",
        className
      )}
    >
      {preview && <div className="p-6 border-b-2 border-border/50">{preview}</div>}

      <div className="relative">
        {title && (
          <div className="absolute top-0 right-0 px-4 py-2 text-sm font-medium text-foreground/60">
            {title}
          </div>
        )}
        <div className="relative">
          <CodeHighlight code={code} language={language} maxHeight={maxHeight} />

          {mounted && (
            <button
              onClick={handleCopy}
              className={cn(
                "absolute bottom-2 right-2 z-10",
                "px-3 py-1.5 rounded-lg",
                "text-md font-medium",
                "bg-white/10 hover:bg-white/20",
                "text-white hover:text-white",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-white/20",
                "border border-white/10",
                "shadow-sm shadow-black/10"
              )}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface CodePopoverProps {
  code: string;
  language?: string;
  children: React.ReactNode;
}

export function CodePopover({ code, language = "typescript", children }: CodePopoverProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div className="group relative">
      {children}
      <div
        className={cn(
          "absolute z-50 w-max max-w-2xl",
          "opacity-0 pointer-events-none",
          "group-hover:opacity-100 group-hover:pointer-events-auto",
          "transition-opacity duration-200",
          "top-full left-0 mt-2"
        )}
      >
        <div
          className={cn(
            "overflow-hidden rounded-xl",
            "bg-[#1E1E1E]",
            "border-2 border-white/10",
            "shadow-xl shadow-black/20"
          )}
        >
          <CodeHighlight code={code} language={language} />
        </div>
      </div>
    </div>
  );
}
