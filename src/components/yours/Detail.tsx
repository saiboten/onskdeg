import React, { useState } from "react";
import { StyledInput } from "../common/StyledInput";
import styled from "styled-components";
import Container from "../common/Container";

interface DetailInput {
  fieldName: string;
  initialValue: string;
  storeData: (
    field: string,
    value: string,
    setEdit: (status: boolean) => void
  ) => void;
}

const StyledTextInput = styled.button`
  outline: none;
  border: none;
  background: transparent;
  color: inherit;
  font-size: inherit;
`;

export default function Detail({
  fieldName,
  initialValue,
  storeData,
}: DetailInput) {
  const [value, setValue] = useState(initialValue);
  const [edit, setEdit] = useState(false);

  return (
    <Container>
      {edit ? (
        <div>
          <StyledInput
            value={value}
            autoFocus
            onBlur={() => storeData(fieldName, value, setEdit)}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      ) : (
        <StyledTextInput onClick={() => setEdit(true)}>
          {value ? value : "Klikk her for å legge til"}
        </StyledTextInput>
      )}
    </Container>
  );
}
