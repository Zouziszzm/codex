"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useEffect } from "react";

interface EditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export default function NocturneEditor({
  initialContent,
  onChange,
  editable = true,
}: EditorProps) {
  // Initialize the editor with robust content validation
  const editor = useCreateBlockNote({
    initialContent: (() => {
      if (
        !initialContent ||
        initialContent === "[]" ||
        initialContent === "{}"
      ) {
        return undefined; // Let BlockNote start with a fresh document
      }
      try {
        const parsed = JSON.parse(initialContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
        return undefined;
      } catch (e) {
        console.error("Malformed editor content:", e);
        return undefined;
      }
    })(),
  });

  // Listen for changes and propagate to parent
  useEffect(() => {
    if (editor && editable) {
      const handleEditorChange = () => {
        onChange(JSON.stringify(editor.document));
      };

      // BlockNote uses a specific subscription model for changes
      const unsubscribe = editor.onChange(handleEditorChange);
      return () => unsubscribe();
    }
  }, [editor, onChange, editable]);

  return (
    <MantineProvider defaultColorScheme="light">
      <div className="min-h-[500px] w-full bg-white rounded-lg py-4">
        <BlockNoteView
          editor={editor}
          editable={editable}
          theme="light"
          className="min-h-[400px]"
        />
      </div>
    </MantineProvider>
  );
}
