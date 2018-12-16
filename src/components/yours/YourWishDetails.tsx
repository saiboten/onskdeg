import React, { useEffect, useState } from 'react';
import Container from '../common/container/Container';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { User, Wish } from '../../types/types';
import styled from 'styled-components';
import { setWishes, storeWishDetails as storeWishDetailsAction } from '../../state/actions/wish';
import Loading from '../common/Loading';
import firebase from '../firebase/firebase';
import Detail from './Detail';
import { StyledLabel } from '../common/Label';

const StyledWrapper = styled.div`
    text-align: left;
    padding: 0 10px;
`;

const StyledTitle = styled.div`
    font-size: 24px;
`;

const StyledDescription = styled.div`
    font-size: 16px;
`;

const StyledLink = styled.div`
    font-size: 16px;
`;

const StyledWishComplete = styled.div`

`;

function YourWishDetails({ wish, user, updateWishStore, storeWishDetails }: { wish: Wish, user: User, updateWishStore: Function, storeWishDetails: (updatedWish: Wish) => void }) {

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

    const { name: initialName, description: wishDescription, image, link } = wish;

    const [name, setName] = useState(initialName);
    const [editName, setEditName] = useState(false);

    const storeData = (field: string, newData: string, toggle: (hm: boolean) => void) => {
        storeWishDetails({
            ...wish,
            [field]: newData
        });
        toggle(false);
    };

    return (
        <Container>
            <StyledWrapper>
                <StyledTitle>{image}
                    <Detail fieldName="name" storeData={storeData} initialValue={name} />
                </StyledTitle>
                <StyledDescription>
                    <StyledLabel>Beskrivelse</StyledLabel>
                    <Detail fieldName="description" storeData={storeData} initialValue={wishDescription} />
                </StyledDescription>
                <StyledLink>
                    <StyledLabel>Link</StyledLabel>
                    <Detail fieldName="link" storeData={storeData} initialValue={link} />
                </StyledLink>
                {/* <StyledWishComplete>
                    <button type="text">Jeg har oppfylt ønsket</button>
                </StyledWishComplete> */}
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
        storeWishDetails: (updatedWish: Wish) => {
            const { match: { params: { wishid } } } = ownProps;
            dispatch(storeWishDetailsAction({ wishid, updatedWish }));
        },
    }))(YourWishDetails);

export default OthersWishListWrapper;