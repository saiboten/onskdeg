import styled from "styled-components";
import { Link } from "react-router-dom";
import ListRow from "../common/ListRow";
import { Trash2 } from "lucide-react";
import { useTheme } from "styled-components";

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
const AddedUserLink = ({ el, deleteMe }: Props) => {
  const theme = useTheme();
  return (
    <ListRow>
      <NameLink to={`/other/${el.uid}`}>{el.name}</NameLink>
      <button
        type="button"
        className="added-user-link__delete smallspace button"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center' }}
        onClick={() => deleteMe(el.email)}
      >
        <Trash2 size={24} color={theme.text} />
      </button>
    </ListRow>
  );
};

export default AddedUserLink;
