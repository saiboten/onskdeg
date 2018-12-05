import React, { useEffect, useState } from 'react';
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
import { WishState } from '../../state/reducers/types';

const StyledWrapper = styled.div`
    text-align: left;
    padding: 0 10px;
`;

const StyledTitle = styled.div`
    font-size: 24px;
`;

const StyledDescription = styled.div`
`;

const StyledLink = styled.div`
`;

const StyledWishComplete = styled.div`

`;

function YourWishDetails({ wish, user, updateWishStore }: { wish: Wish, user: User, updateWishStore: Function }) {

    const [description, setDescription] = useState(wish.description);
    const [editDescription, setToggleEditDescription] = useState(false);

    useEffect(() => {
        const firebaseRef = firebase.database().ref(`wishes/${user.uid}/wishes`);

        firebaseRef.on('value', (snapshot: any) => {
            updateWishStore(snapshot.val());
        });

        return () => {
            firebaseRef.off();
        }
    }, [])

    if (wish == null) {
        return <Loading />
    }

    return (
        <Container>
            <StyledWrapper>
                <StyledTitle>{wish.image}{wish.name}</StyledTitle>
                <StyledDescription>
                    <div>Beskrivelse</div>
                    {editDescription ?
                    <div>
                        <input value={description} onBlur={() => setToggleEditDescription(false)} onChange={e => setDescription(e.target.value)} />
                    </div>
                    :
                    <div onClick={() => setToggleEditDescription(true)}>{wish.description ? wish.description : 'Legg til beskrivelse'}</div>
                }
                </StyledDescription>
                <StyledLink>{wish.link}</StyledLink>
                <StyledWishComplete>
                    <button type="text">Jeg har oppfylt ønsket</button>
                </StyledWishComplete>
            </StyledWrapper>
        </Container>);
}

const OthersWishListWrapper = connect(
    ({ wish, user }: { wish: any, user: User }, ownProps: any) => {
        console.log(wish.wishes[user.uid]);
        return {
            wish: wish.wishes[user.uid] ? wish.wishes[user.uid].filter((w: Wish) => w.id === ownProps.match.params.wishid).reduce((w: Wish) => w) : [],
            user,
        };
    },
    (dispatch: Dispatch, ownProps: any) => ({
        updateWishStore: (newData: Array<Wish>) => {
            dispatch(setWishes(newData));
        },
    }))(YourWishDetails);

export default OthersWishListWrapper;