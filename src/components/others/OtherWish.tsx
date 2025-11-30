import { useState } from "react";
import firebase from "../firebase/firebase";
import { Trash2, ShoppingCart, X, Check } from "lucide-react";
import styled, { useTheme } from "styled-components";
import { Wish, Purchase } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { usePurchase } from "../../hooks/usePurchase";
import { mutate } from "swr";
import { StyledNotification } from "../common/StyledNotification";
import { format } from "date-fns";
import { StyledLink, StyledLinkIcon } from "../common/StyledLink";
import { useSettings } from "../../hooks/useSettings";

interface P {
  wishInfo: Wish;
  user: string;
  myUid: string;
}

const WishCard = styled.div<{ $isTaken: boolean }>`
  position: relative;
  border: 2px solid ${(props) => props.theme.secondary};
  border-radius: 8px;
  padding: 1.6rem;
  margin-bottom: 1.6rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: ${(props) => props.theme.primary};
  opacity: ${(props) => (props.$isTaken ? 0.7 : 1)};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const WishHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const WishTitle = styled.h3<{ $isTaken: boolean }>`
  margin: 0;
  font-size: 1.8rem;
  color: ${(props) => props.theme.text};
  text-decoration: ${(props) => (props.$isTaken ? "line-through" : "none")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StarIcon = styled.span`
  font-size: 1.8rem;
  color: #FFD700;
`;

const WishDate = styled.div`
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
  white-space: nowrap;
  margin-left: 1rem;
`;

const ImageContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  position: relative;
`;

const WishImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background: ${(props) => props.theme.primary};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text};
  font-size: 1.4rem;
`;

const WishDescription = styled.p`
  color: ${(props) => props.theme.text};
  font-size: 1.4rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  word-wrap: break-word;
`;

const WishPrice = styled.div`
  color: ${(props) => props.theme.secondary};
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.div<{ $isTaken: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: ${(props) =>
    props.$isTaken ? props.theme.negative : props.theme.secondary};
  color: ${(props) => props.theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  z-index: 1;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${(props) => props.theme.secondary};
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButtonStyled = styled.button<{ $variant?: 'neutral' | 'negative' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => 
    props.$variant === 'negative' ? props.theme.negative :
    props.$variant === 'neutral' ? props.theme.contrast : 'transparent'
  };
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 4px;
  color: white;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const OtherWish = ({ wishInfo, user, myUid }: P) => {
  const themeContext = useTheme();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState("");
  const { purchase } = usePurchase(wishInfo?.id);
  const [confirm, setConfirm] = useState(false);
  const { settings } = useSettings(myUid, true);

  const isTaken = purchase?.checked ?? false;

  async function handleBuyItem(e: React.MouseEvent) {
    e.stopPropagation();
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

  async function handleDeleteItem(e: React.MouseEvent) {
    e.stopPropagation();
    await firebase.firestore().collection("wish").doc(wishInfo.id).delete();
    mutate(["wish", user]);
  }

  const wishSuggestedByMe = wishInfo.suggestedBy === myUid;

  if (settings?.hideGifts && purchase?.checked) {
    return null;
  }

  const handleCardClick = () => {
    navigate(`/${wishSuggestedByMe ? "wish" : "other"}/${user}/${wishInfo.id}`);
  };

  return (
    <>
      {feedback && <StyledNotification active={feedback !== ""} text={feedback} />}
      <WishCard $isTaken={isTaken} onClick={handleCardClick}>
        {isTaken && <StatusBadge $isTaken={true}>Kjøpt</StatusBadge>}
      
      <WishHeader>
        <WishTitle $isTaken={isTaken}>
          {wishInfo.favorite && <StarIcon>★</StarIcon>}
          {wishInfo.name}
        </WishTitle>
        {wishInfo.date && (
          <WishDate>
            {format(wishInfo.date.toDate(), "dd.MM.yyyy")}
          </WishDate>
        )}
      </WishHeader>

      {wishInfo.price && <WishPrice>Kr {wishInfo.price},-</WishPrice>}

      <ImageContainer>
        {wishInfo.image ? (
          <WishImage src={wishInfo.image} alt={wishInfo.name} />
        ) : (
          <ImagePlaceholder>Ingen bilde</ImagePlaceholder>
        )}
      </ImageContainer>

      {wishInfo.description && (
        <WishDescription>{wishInfo.description}</WishDescription>
      )}

      <ActionBar onClick={(e) => e.stopPropagation()}>
        {wishInfo.link && (
          <StyledLink href={wishInfo.link} target="_blank">
            <StyledLinkIcon />
          </StyledLink>
        )}

        {confirm ? (
          <ConfirmButtons>
            <IconButtonStyled
              $variant="neutral"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirm(false);
              }}
            >
              <X size={24} />
            </IconButtonStyled>
            <IconButtonStyled
              $variant="negative"
              type="button"
              onClick={handleDeleteItem}
            >
              <Check size={24} />
            </IconButtonStyled>
          </ConfirmButtons>
        ) : (
          wishSuggestedByMe && (
            <button
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center' }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirm(true);
              }}
            >
              <Trash2 size={24} color={themeContext.text} />
            </button>
          )
        )}

        <button
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center' }}
          type="button"
          onClick={handleBuyItem}
        >
          <ShoppingCart size={24} color={themeContext.text} />
        </button>
      </ActionBar>
    </WishCard>
    </>
  );
};

export default OtherWish;
