import ReactDOM from "react-dom/client";
import isPropValid from "@emotion/is-prop-valid";
import { StyleSheetManager } from "styled-components";
import App from "./App";

// styled-components v6 forwards all props to the DOM; keep v5 behaviour of
// only passing through valid HTML attributes to plain elements.
const shouldForwardProp = (propName: string, target: unknown) =>
  typeof target === "string" ? isPropValid(propName) : true;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <StyleSheetManager shouldForwardProp={shouldForwardProp}>
    <App />
  </StyleSheetManager>
);
