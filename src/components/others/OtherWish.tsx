import React from 'react';
import Linkify from 'react-linkify';
import firebase from '../firebase/firebase';
import Icon from '../common/Icon';
import ListRow, { LeftSection } from '../common/ListRow';
import styled from 'styled-components';

import './otherwish.css';
import { Wish, Purchase } from '../../types/types';
import { ImageWrapper } from '../common/Image';
import { StyledActionButtonsAnimated, StyledActionButtons } from '../common/IconButton';

const storageRef = firebase.storage().ref();

const debug = require('debug')('OtherWish');

interface P {
  purchase: Purchase;
  wishInfo: Wish;
  canDelete: boolean;
  deleteSuggestion: () => void;
  onClick: Function;
};

interface S {
  image: string;
}

class OtherWish extends React.Component<P, S> {
  constructor(props: any) {
    super(props);

    this.state = {
      image: '',
    };

    if (props.wishInfo.image) {
      storageRef.child(props.wishInfo.image).getDownloadURL().then((url) => {
        debug('url: ', url);
        this.setState({
          image: url,
        });
      });
    }
  }

  render() {
    const {
      wishInfo, onClick, purchase
    } = this.props;
    const { image } = this.state;

    const imageTag = wishInfo.image
      ? (<img className="other-wish__image" alt="Awesome" src={image} />) : '';

    const item = purchase.checked
      ? (
        <del>{wishInfo.name}</del>
      )
      : wishInfo.name;
    const linkifyed = (
      <Linkify className="other-wish__linkify">{item}</Linkify>
    );
    const checkedByElem = purchase.checked
      ? (
        <div className="smallspace">Tatt</div>) : '';

    const ActionButtonsContainer = styled.div`
      display: flex;
      justify-content: flex-end;
    `;

    return (
      <ListRow>
        <LeftSection>
          <ImageWrapper>{imageTag}</ImageWrapper>
          {linkifyed}
        </LeftSection>
        <StyledActionButtons>
          {checkedByElem}
          <Icon type="button" name={purchase.checked ? 'shopping-cart' : 'shopping-cart'} onClick={() => onClick(wishInfo.id)} />
        </StyledActionButtons>
      </ListRow>
    );
  }
}

export default OtherWish;
