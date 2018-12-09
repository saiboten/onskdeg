import React, { useEffect, useState } from 'react';
import Container from '../common/container/Container';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { User, Wish } from '../../types/types';
import styled from 'styled-components';
import { setWishes, storeWishDescription as storeWishDescriptionAction } from '../../state/actions/wish';
import Loading from '../common/Loading';
import firebase from '../firebase/firebase';

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

function YourWishDetails({ wish, user, updateWishStore, storeWishDescription }: { wish: Wish, user: User, updateWishStore: Function, storeWishDescription: (description: string) => void }) {

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

    const { name, description: wishDescription, image, link } = wish;
    
    const [description, setDescription] = useState(wishDescription);
    const [editDescription, setToggleEditDescription] = useState(false);

    const storeDescription = () => {
        storeWishDescription(description);
        setToggleEditDescription(false);
    };

    return (
        <Container>
            <StyledWrapper>
                <StyledTitle>{image}{name}</StyledTitle>
                <StyledDescription>
                    <div>Beskrivelse</div>
                    {editDescription ?
                    <div>
                        <input value={description} onBlur={storeDescription} onChange={e => setDescription(e.target.value)} />
                    </div>
                    :
                    <div onClick={() => setToggleEditDescription(true)}>{description ? description : 'Legg til beskrivelse'}</div>
                }
                </StyledDescription>
                <StyledLink>{link}</StyledLink>
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
            wish: wish.wishes[user.uid] ? wish.wishes[user.uid].filter((w: Wish) => w.id === ownProps.match.params.wishid).reduce((w: Wish) => w) : undefined,
            user,
        };
    },
    (dispatch: Dispatch, ownProps: any) => ({
        updateWishStore: (newData: Array<Wish>) => {
            dispatch(setWishes(newData));
        },
        storeWishDescription: (description: string) => {
            const { match: { params: { wishid }} } = ownProps;
            dispatch(storeWishDescriptionAction({wishid, description}));
        },
    }))(YourWishDetails);

export default OthersWishListWrapper;