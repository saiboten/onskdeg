import React, { useState } from "react";
import { StyledInput } from "../common/StyledInput";
import styled from "styled-components";
import { Container } from "../common/Container";
import { P } from "../common/P";

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
`;

const StyledTextInput = styled.button`
  outline: none;
  border: 1px solid;
  border-radius: 1rem;
  padding: 1rem 2.5rem;
  background: transparent;
  color: inherit;
  font-size: inherit;
  cursor: pointer;
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
        <>
          <P>{value ? value : "Klikk her for å legge til"}</P>
          <StyledTextInput onClick={() => setEdit(true)}>Endre</StyledTextInput>
        </>
      )}
    </StyledWrapper>
  );
}
