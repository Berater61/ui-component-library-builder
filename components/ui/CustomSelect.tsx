"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

export function CustomSelect({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value]
  );

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function commit(index: number) {
    const next = options[index];
    if (next) {
      onChange(next.value);
      setActiveIndex(index);
      setOpen(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => Math.min(options.length - 1, current + 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => Math.max(0, current - 1));
    }

    if (event.key === "Home") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(options.length - 1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) {
        commit(activeIndex);
      } else {
        setOpen(true);
      }
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div className="relative grid gap-1 text-sm font-medium" ref={rootRef}>
      <span id={`${id}-label`}>{label}</span>
      <button
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        aria-controls={`${id}-listbox`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label ${id}-button`}
        className="focus-ring flex min-h-11 w-full items-center justify-between rounded-md border px-3 py-3 text-left"
        id={`${id}-button`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
        type="button"
      >
        <span>{selectedOption?.label ?? "Auswählen"}</span>
        <span aria-hidden="true" className="text-xs">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open ? (
        <ul
          aria-labelledby={`${id}-label`}
          className="absolute top-full z-30 mt-1 max-h-72 w-full overflow-auto rounded-md border p-1 shadow-lg"
          id={`${id}-listbox`}
          role="listbox"
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            const active = index === activeIndex;
            return (
              <li
                aria-selected={selected}
                className="cursor-pointer rounded px-3 py-2 text-sm"
                id={`${id}-option-${index}`}
                key={option.value}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                role="option"
                style={{
                  background: selected ? "var(--primary)" : active ? "var(--surface-muted)" : "transparent",
                  color: selected ? "var(--background)" : "var(--foreground)"
                }}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
