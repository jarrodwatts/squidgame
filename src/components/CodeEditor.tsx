import React, { ReactElement, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-terminal";

interface Props {
  language: string;
  setCode: (code: string) => void;
  defaultText: string;
}

export default function CodeEditor({
  language,
  setCode,
  defaultText,
}: Props): ReactElement {
  return (
    <AceEditor
      style={{ width: "100%" }}
      fontSize={16}
      mode={language}
      defaultValue={defaultText}
      theme="terminal"
      onChange={(e) => setCode(e)}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
    />
  );
}
