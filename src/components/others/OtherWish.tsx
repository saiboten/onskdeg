import React, { useEffect, useState } from "react";
import firebase from "../firebase/firebase";
import Icon from "../common/Icon";
import ListRow, { LeftSection } from "../common/ListRow";
import styled from "styled-components";

import { Wish, Purchase } from "../../types/types";
import { ImageWrapper } from "../common/Image";
import {
  StyledActionButtonsAnimated,
  StyledActionButtons,
  NeutralIconButton,
  NegativeIconButton,
} from "../common/IconButton";
import { ReactComponent as LinkIcon } from "../images/link.svg";
import { UnstyledLink } from "../common/Link";
import { usePurchase } from "../../hooks/usePurchase";
import { mutate } from "swr";
import { StyledNotification } from "../common/StyledNotification";

const StyledLinkIcon = styled(LinkIcon)`
  fill: #fff;
  height: 32px;
  width: 32px;
`;

const StyledLink = styled.a`
  padding: 0 0.5rem;
  transform: translateY(3px);
`;

interface P {
  // purchase: Purchase;
  wishInfo: Wish;
  user: string;
  myUid: string;
}

interface S {
  image: string;
}

const OtherWish = ({ wishInfo, user, myUid }: P) => {
  const [feedback, setFeedback] = useState("");
  const { purchase } = usePurchase(wishInfo?.id);
  const [confirm, setConfirm] = useState(false);

  const item = purchase?.checked ? <del>{wishInfo.name}</del> : wishInfo.name;

  async function handleBuyItem() {
    const purchaseRef = firebase
      .firestore()
      .collection("purchase")
      .doc(wishInfo.id);

    const purchaseData = await purchaseRef.get();

    const isChecked = purchaseData.exists && purchaseData.data()?.checked;

    await purchaseRef.set({
      checked: isChecked ? false : true,
      checkedBy: myUid,
    });

    if (isChecked) {
      setFeedback(`Du solgte ${wishInfo.name}`);
    } else {
      setFeedback(`Du kjøpte ${wishInfo.name}`);
    }

    setTimeout(() => {
      setFeedback("");
    }, 3000);

    mutate(["purchase", wishInfo.id]);
  }

  async function handleDeleteItem() {
    const wishRef = firebase.firestore().collection("wishes").doc(user);

    const wishesData = await wishRef.get();

    const existingWishes: Wish[] = wishesData.data()?.wishes;

    wishRef.update({
      wishes: existingWishes.filter((w) => w.id !== wishInfo.id),
    });

    mutate(["wishes", user]);
  }

  const wishSuggestedByMe = wishInfo.suggestedBy === myUid;

  return (
    <ListRow>
      <StyledNotification active={feedback !== ""} text={feedback} />
      <LeftSection>
        <UnstyledLink
          to={`/${wishSuggestedByMe ? "wish" : "other"}/${user}/${wishInfo.id}`}
        >
          {item} {wishInfo.price && `(${wishInfo.price})`}
        </UnstyledLink>
      </LeftSection>
      <StyledActionButtons>
        {wishInfo.link && (
          <StyledLink href={wishInfo.link} target="_blank">
            <StyledLinkIcon />
          </StyledLink>
        )}

        {confirm ? (
          <div style={{ transform: "translateX(8rem)" }}>
            <StyledActionButtonsAnimated>
              <NeutralIconButton
                type="button"
                name="x"
                onClick={() => setConfirm(false)}
              />
              <NegativeIconButton
                type="button"
                name="check"
                onClick={handleDeleteItem}
              />
            </StyledActionButtonsAnimated>
          </div>
        ) : (
          <div></div>
        )}

        {wishSuggestedByMe && (
          <Icon
            type="button"
            name={"trash-2"}
            onClick={() => setConfirm(true)}
          />
        )}

        <Icon type="button" name={"shopping-cart"} onClick={handleBuyItem} />
      </StyledActionButtons>
    </ListRow>
  );
};

export default OtherWish;
