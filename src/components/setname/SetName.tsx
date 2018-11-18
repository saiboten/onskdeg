import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setNameAndEmail as setNameAction } from '../../state/actions/user';
import { User } from '../../types/types';

const SetNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  height: 100%;
`;

function submit(e: React.FormEvent<HTMLFormElement>, setTheName: (thename: string, email: string) => void, name: string, email: string) {
  e.preventDefault();
  setTheName(name, email);
}

export function SetNameFunc({ setTheName, user }: { setTheName: (name: string) => void, user: User }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user.email);

  return (
    <SetNameContainer>
      <form onSubmit={(e) => submit(e, setTheName, name, email)}>
        <label htmlFor="name">Velg navn</label>
        <input type="text" id="name" value={name} onChange={(e: any) => setName(e.target.value)} />
        <label htmlFor="email">Epost</label>
        <input disabled={!(user.email === null || user.email === '')} type="text" id="email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <input type="submit" value="OK" />
      </form>

    </SetNameContainer>);
}

export default connect(({ user }: { user: User }) => ({
  user
}),
  dispatch => ({
    setTheName(name: string, email?: string) {
      dispatch(setNameAction(name, email));
    }
  }))(SetNameFunc);