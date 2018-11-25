import React, { useEffect } from 'react';
import Container from '../common/container/Container';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../../state/reducers';
import spinnerWhileLoading from '../common/spinnerWhileLoading';
import { User, Wish } from '../../types/types';
import styled from 'styled-components';
import { setWishes } from '../../state/actions/wish';
import Loading from '../common/Loading';
import firebase from '../firebase/firebase';

const StyledTitle = styled.div`
`;

const StyledDescription = styled.div`
`;

const StyledLink = styled.div`
`;

const StyledWishComplete = styled.div`

`;

function YourWishDetails({ wish, user, updateWishStore }: { wish: Wish, user: User, updateWishStore: Function}) {
    useEffect(() => {
        const firebaseRef = firebase.database().ref(`wishes/${user.uid}/wishes`);

        firebaseRef.on('value', (snapshot: any) => {
            updateWishStore(snapshot.val());
        });

        return () => {
            firebaseRef.off();
        }
    }, [])

    if(wish == null) {
        return <Loading />
    }

    return (
    <Container>
        <StyledTitle>{wish.name}</StyledTitle>
        <StyledDescription>
            <div>Beskrivelse</div>
            <div>Viktig at de er blå.</div>
        </StyledDescription>
        <StyledLink>https://testlink.no/bla</StyledLink>
        <StyledWishComplete>
            <button type="text">Jeg har oppfylt ønsket</button>
        </StyledWishComplete>
    </Container>);
}
  
  const OthersWishListWrapper = connect(
    ({ wish, user }: { wish: any, user: User}, ownProps: any ) => {
        console.log(wish[user.uid]);
        return {
          wish: wish[user.uid] ? wish[user.uid].filter((w: Wish) => w.id === ownProps.match.params.wishid).reduce((w: Wish) => w) : [],
          user,
        };
      },
    (dispatch: Dispatch, ownProps: any) => ({
        updateWishStore: (newData: Array<Wish>) => {
            dispatch(setWishes(newData));
          },
      }))(YourWishDetails);
  
  export default OthersWishListWrapper;