import React, { useEffect, useState } from "react";
import { inputStyle } from "../common/StyledInput";
import { IconButton } from "../common/Button";
import { Check, Pencil, X } from "lucide-react";
import { cn } from "../../util/cn";

interface DetailInput {
  fieldName: string;
  initialValue: string | number;
  storeData: (
    field: string,
    value: string | number,
    setEdit: (status: boolean) => void,
  ) => void;
  label?: string;
  multiline?: boolean;
  type?: "text" | "number" | "url";
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}

/** A value that turns into an input when clicked. */
export const Detail: React.FC<DetailInput> = ({
  children,
  fieldName,
  initialValue,
  storeData,
  label,
  multiline,
  type = "text",
  placeholder,
  className,
}) => {
  const [value, setValue] = useState(initialValue);
  const [edit, setEdit] = useState(false);

  // Follow outside changes (e.g. AI fill-in) while not editing.
  useEffect(() => {
    if (!edit) setValue(initialValue);
  }, [initialValue, edit]);

  const save = () => {
    if (value === initialValue) {
      setEdit(false);
      return;
    }
    storeData(fieldName, value, setEdit);
  };
  const cancel = () => {
    setValue(initialValue);
    setEdit(false);
  };

  const keepFocus = (e: React.MouseEvent) => e.preventDefault();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") cancel();
    if (e.key === "Enter" && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      save();
    }
  };

  return (
    <div className={cn("text-left", className)}>
      {label && (
        <div className="mb-2 text-[1.3rem] font-semibold tracking-[0.02em] uppercase opacity-60">
          {label}
        </div>
      )}
      {edit ? (
        <div className="flex items-start gap-6">
          {multiline ? (
            <textarea
              className={cn(inputStyle, "h-auto min-h-120 resize-y py-10")}
              value={value}
              autoFocus
              placeholder={placeholder}
              onBlur={save}
              onKeyDown={onKeyDown}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : (
            <input
              className={inputStyle}
              type={type}
              inputMode={type === "number" ? "numeric" : undefined}
              value={value}
              autoFocus
              placeholder={placeholder}
              onBlur={save}
              onKeyDown={onKeyDown}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
          <IconButton
            className="h-48 w-48 bg-secondary hover:scale-100"
            aria-label="Lagre"
            onMouseDown={keepFocus}
            onClick={save}
          >
            <Check size={20} />
          </IconButton>
          <IconButton
            className="h-48 w-48 hover:scale-100"
            aria-label="Avbryt"
            onMouseDown={keepFocus}
            onClick={cancel}
          >
            <X size={20} />
          </IconButton>
        </div>
      ) : (
        <div className="group flex min-h-36 items-start gap-8">
          <div className="min-w-0 flex-1 self-center wrap-break-word hyphens-auto">
            {value ? (
              children
            ) : (
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-0 font-sans text-[1.5rem] text-text italic opacity-50 hover:opacity-80"
                onClick={() => setEdit(true)}
              >
                {placeholder ?? "Legg til"}
              </button>
            )}
          </div>
          <IconButton
            className="opacity-50 group-hover:opacity-100 hover:scale-100 focus-visible:opacity-100"
            aria-label={label ? `Rediger ${label.toLowerCase()}` : "Rediger"}
            title="Rediger"
            onClick={() => setEdit(true)}
          >
            <Pencil size={18} />
          </IconButton>
        </div>
      )}
    </div>
  );
};
