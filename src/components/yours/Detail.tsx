import React, { useState } from "react";
import { StyledInput } from "../common/StyledInput";
import styled from "styled-components";
import { Container } from "../common/Container";
import { P } from "../common/P";
import { Button } from "../common/Button";

interface DetailInput {
  fieldName: string;
  initialValue: string;
  storeData: (
    field: string,
    value: string,
    setEdit: (status: boolean) => void
  ) => void;
}

const StyledWrapper = styled.div`
  text-align: left;
  font-size: 1.5rem;
`;

export default function Detail({
  fieldName,
  initialValue,
  storeData,
}: DetailInput) {
  const [value, setValue] = useState(initialValue);
  const [edit, setEdit] = useState(false);

  return (
    <StyledWrapper>
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
            }}
          >
            {value ? value : "Klikk her for å legge til"}
          </P>
          <Button onClick={() => setEdit(true)}>Endre</Button>
        </div>
      )}
    </StyledWrapper>
  );
}
