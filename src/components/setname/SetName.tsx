import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setName as setNameAction } from '../../state/actions/user';

const SetNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  height: 100%;
`;

function submit(e: React.FormEvent<HTMLFormElement>, setTheName: (thename: string) => void, name: string) {
  e.preventDefault();
  setTheName(name);
}

export function SetNameFunc({ setTheName }: { setTheName: (name: string) => void}) {
  const [name, setName] = useState('');

  return (
    <SetNameContainer>
      <form onSubmit={(e) => submit(e, setTheName, name)}>
        <label htmlFor="name">Velg navn</label>
        <input type="text" id="name" value={name} onChange={(e: any) => setName(e.target.value)} />
        <input type="submit" value="OK" />
      </form>

    </SetNameContainer>);
}

export default connect(null,
  dispatch => ({
    setTheName(name: string) {
      dispatch(setNameAction(name));
    }
  }))(SetNameFunc);