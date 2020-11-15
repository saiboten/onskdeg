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
} from "../common/IconButton";
import { Link } from "react-router-dom";
import { UnstyledLink } from "../common/Link";
import { usePurchase } from "../../hooks/usePurchase";
import { mutate } from "swr";
import { StyledNotification } from "../common/StyledNotification";

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

  return (
    <ListRow>
      <StyledNotification active={feedback !== ""} text={feedback} />
      <LeftSection>
        <UnstyledLink to={`/other/${user}/${wishInfo.id}`}>{item}</UnstyledLink>
      </LeftSection>
      <StyledActionButtons>
        <Icon type="button" name={"shopping-cart"} onClick={handleBuyItem} />
      </StyledActionButtons>
    </ListRow>
  );
};

export default OtherWish;
