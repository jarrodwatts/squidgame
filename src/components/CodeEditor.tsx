import React, { ReactElement, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
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
  console.log(defaultText);
  return (
    <AceEditor
      style={{ width: "100%" }}
      fontSize={16}
      mode={language}
      value={defaultText}
      theme="terminal"
      onChange={(e) => setCode(e)}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
    />
  );
}
