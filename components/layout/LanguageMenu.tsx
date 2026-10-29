"use client";

import { useState } from "react";
import { Check, Languages } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { iconButtonClass } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils/cn";

// UI only for now: translations are not wired up yet.
const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];

export function LanguageMenu() {
  const [current, setCurrent] = useState("en");

  return (
    <Dropdown label="Change language" trigger={<Languages aria-hidden />} triggerClassName={iconButtonClass} panelClassName="w-48">
      {(close) => (
        <ul>
          {languages.map((language) => (
            <li key={language.code}>
              <button
                type="button"
                onClick={() => {
                  setCurrent(language.code);
                  close();
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-label hover:bg-surface-muted",
                  current === language.code ? "text-primary-600" : "text-body",
                )}
              >
                {language.label}
                {current === language.code && <Check className="size-4" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}
