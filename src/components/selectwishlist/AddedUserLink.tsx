import { Link } from "react-router-dom";
import ListRow from "../common/ListRow";
import { Trash2 } from "lucide-react";

interface NewUser {
  name: string;
  email: string | null;
  uid: string;
}

interface Props {
  el: NewUser;
  deleteMe: (email: string | null) => void;
}
const AddedUserLink = ({ el, deleteMe }: Props) => {
  return (
    <ListRow>
      <Link
        className="flex h-full items-center text-white no-underline"
        to={`/other/${el.uid}`}
      >
        {el.name}
      </Link>
      <button
        type="button"
        className="added-user-link__delete smallspace button"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => deleteMe(el.email)}
      >
        <Trash2 size={24} className="text-text" />
      </button>
    </ListRow>
  );
};

export default AddedUserLink;
