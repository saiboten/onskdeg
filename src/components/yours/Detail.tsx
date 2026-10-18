import React, { useState } from "react";
import { StyledInput } from "../common/StyledInput";
import { IconButton } from "../common/Button";
import { SquarePen as Edit } from "lucide-react";

interface DetailInput {
  fieldName: string;
  initialValue: string | number;
  storeData: (
    field: string,
    value: string | number,
    setEdit: (status: boolean) => void
  ) => void;
  children?: React.ReactNode;
}

export const Detail: React.FC<DetailInput> = ({
  children,
  fieldName,
  initialValue,
  storeData,
}) => {
  const [value, setValue] = useState(initialValue);
  const [edit, setEdit] = useState(false);

  return (
    <div className="text-left">
      {edit ? (
        <StyledInput
          value={value}
          autoFocus
          onBlur={() => storeData(fieldName, value, setEdit)}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <div className="flex min-h-40 items-center gap-12">
          <div className="min-w-0 flex-1 wrap-break-word hyphens-auto">
            {value ? (
              children
            ) : (
              <span className="opacity-50">Ikke satt</span>
            )}
          </div>
          <IconButton
            className="bg-secondary text-text hover:scale-105"
            aria-label="Rediger"
            onClick={() => setEdit(true)}
          >
            <Edit size={18} />
          </IconButton>
        </div>
      )}
    </div>
  );
};
