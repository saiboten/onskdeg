import React, { useState } from "react";
import { StyledInput } from "../common/StyledInput";
import { P } from "../common/P";
import { Button } from "../common/Button";
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
    <div className="text-left text-[1.5rem]">
      {edit ? (
        <StyledInput
          value={value}
          autoFocus
          onBlur={() => storeData(fieldName, value, setEdit)}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <P
            style={{
              marginRight: "1rem",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              wordBreak: "break-word",
              hyphens: "auto",
              flex: "1",
            }}
          >
            {value && children}
          </P>
          <Button
            onClick={() => setEdit(true)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <Edit className="h-20 w-20 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
};
