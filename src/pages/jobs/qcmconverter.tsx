import React, { useState } from "react";

const QcmConverter: React.FC = () => {
  const [rawText, setRawText] = useState("");
  const [jsonOutput, setJsonOutput] = useState<unknown[]>([]);

  function parseQCMString(qcmString: string) {
    const questions = [];
    const qcmBlocks = qcmString.trim().split(/\n{2,}/); // split by double newlines
    let id = 1;

    for (const block of qcmBlocks) {
      const lines = block
        .trim()
        .split("\n")
        .map((line) => line.trim());
      const titleMatch = lines[0].match(/\*\*(.*?)\*\*/);
      const titre = titleMatch ? titleMatch[1] : `QCM ${id}`;
      const questionText = lines.find(
        (line) => !line.startsWith("**") && !line.startsWith("Correct answer:")
      );

      const optionsMap: Record<string, string> = {};
      for (const line of lines) {
        const match = line.match(/^([A-D])\)\s+(.*)$/);
        if (match) {
          const [, letter, text] = match;
          optionsMap[letter] = text;
        }
      }

      const correctLetterMatch = block.match(/Correct answer:\s+([A-D])\)/i);
      const correctLetter = correctLetterMatch?.[1];
      const options = ["A", "B", "C", "D"].map((l) => optionsMap[l] ?? "");

      if (questionText) {
        questions.push({
          id: id++,
          titre,
          question: questionText,
          options,
          correctAnswer: correctLetter
            ? "ABCD".indexOf(correctLetter)
            : undefined,
        });
      }
    }

    return questions;
  }

  const handleConvert = () => {
    const parsed = parseQCMString(rawText);
    setJsonOutput(parsed);
    console.log(JSON.stringify(parsed, null, 2));
  };

  return (
    <div>
      <h2>QCM Text to JSON Converter</h2>
      <textarea
        rows={20}
        cols={80}
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste your QCMs here..."
      />
      <br />
      <button onClick={handleConvert}>Convert</button>
      <pre>{JSON.stringify(jsonOutput, null, 2)}</pre>
    </div>
  );
};

export default QcmConverter;
