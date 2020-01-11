import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  background-color: #262626;
  min-height:100%;
  font-size: 62.5%;
}

body {
  box-sizing: border-box;
  margin: 0;
  font-family: "Exo 2", sans-serif;
  font-weight: 400;
  line-height: 1.7;
  color: white;
  min-height:100%;
}

#root {
  text-align: center;
  height: 100vh;
}

input, textarea {
  font-family: 'Exo 2', sans-serif;
  font-size: 1rem;
}

`;
