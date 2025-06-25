"use client";

import { useEffect, useState, RefObject } from "react";

interface UseSplitTextOptions {
  splitBy?: "words" | "chars";
}

export function useSplitText<T extends HTMLElement>(
  text: string,
  ref: RefObject<T | null>,
  options: UseSplitTextOptions = { splitBy: "words" }
) {
  const [words, setWords] = useState<string[]>([]);
  const [chars, setChars] = useState<string[]>([]);

  useEffect(() => {
    if (!text) return;

    if (options.splitBy === "words") {
      setWords(text.split(" "));
    } else {
      setChars(text.split(""));
    }
  }, [text, options.splitBy]);

  return {
    words,
    chars,
    splitBy: options.splitBy,
  };
}
