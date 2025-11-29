import styled from "styled-components";
import { Link } from "react-router-dom";
import ListRow from "../common/ListRow";
import { GoldIconButton } from "../common/IconButton";

interface NewUser {
  name: string;
  email: string | null;
  uid: string;
}

const NameLink = styled(Link)`
  text-decoration: none;
  color: white;
  height: 100%;
  display: flex;
  align-items: center;
  &:visited {
    color: white;
  }
`;

interface Props {
  el: NewUser;
  deleteMe: (email: string | null) => void;
}
const AddedUserLink = ({ el, deleteMe }: Props) => (
  <ListRow>
    <NameLink to={`/other/${el.uid}`}>{el.name}</NameLink>
    <GoldIconButton
      type="button"
      name="trash-2"
      className="added-user-link__delete smallspace button"
      onClick={() => deleteMe(el.email)}
    ></GoldIconButton>
  </ListRow>
);

export default AddedUserLink;
