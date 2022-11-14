import Editor from "@monaco-editor/react";

export const CodeEditor = ({ code, setCode }: { code: string, setCode: (code: string) => void }) => {
    return (
        <Editor
            defaultLanguage="python"
            defaultValue={code}
            onChange={(value) => setCode(value || "")}
            theme="light"
        />
    );
}