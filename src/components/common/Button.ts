import styled from "styled-components";

const BorderStyles = `
  border: 2px solid ${(props: any) => props.theme.secondary};
  padding: 7px 14px;
  background: transparent;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  color: white;
  max-width: 300px;
  min-height: 48px;
  margin-bottom: 16px;
  cursor: pointer;
`;

export const BorderButton = styled.button`
  ${BorderStyles}
`;

export const BorderInput = styled.input`
  ${BorderStyles}
`;

export const ButtonNavigation = styled.button`
  background-color: ${(props) => props.theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
  font-weight: 600;
  font-family: "Exo 2", sans-serif;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -ms-user-select: none;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 18px;
  border: 0 none;
  border-radius: 3px;
  font-size: 13px;
  height: 40px;
  line-height: 40px;
  text-decoration: none;
  cursor: pointer;
`;

export const Button = styled.button`
  background-color: ${(props) => props.theme.secondary};
  display: inline-block;
  color: ${(props) => props.theme.text};
  font-weight: 600;
  font-family: "Exo 2", sans-serif;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 18px;
  border: 0 none;
  border-radius: 3px;
  font-size: 13px;
  line-height: 40px;
  text-decoration: none;
  cursor: pointer;
`;

export default {
  BorderButton,
  BorderInput,
};
