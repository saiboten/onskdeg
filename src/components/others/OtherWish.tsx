import { useState } from "react";
import firebase from "../firebase/firebase";
import Icon from "../common/Icon";
import ListRow, { LeftSection } from "../common/ListRow";
import styled, { useTheme } from "styled-components";
import { Wish, Purchase } from "../../types/types";
import {
  StyledActionButtonsAnimated,
  StyledActionButtons,
  NeutralIconButton,
  NegativeIconButton,
} from "../common/IconButton";
import { UnstyledLink } from "../common/Link";
import { usePurchase } from "../../hooks/usePurchase";
import { mutate } from "swr";
import { StyledNotification } from "../common/StyledNotification";
import { format } from "date-fns";
import { StyledLink, StyledLinkIcon } from "../common/StyledLink";
import { useSettings } from "../../hooks/useSettings";

interface P {
  // purchase: Purchase;
  wishInfo: Wish;
  user: string;
  myUid: string;
}

const StyledDate = styled.div`
  position: absolute;
  font-size: 1rem;
  top: 3px;
  transform: rotate(-45deg) translateY(-2rem) translateX(-4rem);
`;

const OtherWish = ({ wishInfo, user, myUid }: P) => {
  const themeContext = useTheme();

  const [feedback, setFeedback] = useState("");
  const { purchase } = usePurchase(wishInfo?.id);
  const [confirm, setConfirm] = useState(false);
  const { settings } = useSettings(myUid, true);

  const item = purchase?.checked ? <del>{wishInfo.name}</del> : wishInfo.name;

  async function handleBuyItem() {
    const purchaseRef = firebase
      .firestore()
      .collection("purchase")
      .doc(wishInfo.id);

    const purchaseData = await purchaseRef.get();

    const isChecked = purchaseData.exists && purchaseData.data()?.checked;

    const newPurchase: Purchase = {
      checked: isChecked ? false : true,
      checkedBy: myUid,
      date: firebase.firestore.Timestamp.now(),
      wishId: wishInfo.id,
      wishOwner: user,
    };

    await purchaseRef.set(newPurchase);

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
    await firebase.firestore().collection("wish").doc(wishInfo.id).delete();
    mutate(["wish", user]);
  }

  const wishSuggestedByMe = wishInfo.suggestedBy === myUid;

  if (settings?.hideGifts && purchase?.checked) {
    return null;
  }

  return (
    <ListRow>
      <StyledNotification active={feedback !== ""} text={feedback} />
      <LeftSection>
        {wishInfo.date && (
          <StyledDate>
            {format(wishInfo.date.toDate(), "dd.MM.yyyy")}
          </StyledDate>
        )}
        <UnstyledLink
          to={`/${wishSuggestedByMe ? "wish" : "other"}/${user}/${wishInfo.id}`}
        >
          {item} {wishInfo.price ? `(${wishInfo.price})` : ""}
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
            color={themeContext.text}
            type="button"
            name={"trash-2"}
            onClick={() => setConfirm(true)}
          />
        )}

        <Icon
          color={themeContext.text}
          type="button"
          name="shopping-cart"
          onClick={handleBuyItem}
        />
      </StyledActionButtons>
    </ListRow>
  );
};

export default OtherWish;
