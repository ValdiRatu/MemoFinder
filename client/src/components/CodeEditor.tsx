import Editor from "@monaco-editor/react";
import { useData } from "../contexts/DataContext";

export const CodeEditor = () => {
    const { code, setCode } = useData();

    return (
        <Editor
            defaultLanguage="python"
            defaultValue={code}
            onChange={(value) => setCode(value || "")}
            theme="light"
            options={{
                scrollBeyondLastLine: false
            }}
        />
    );
}