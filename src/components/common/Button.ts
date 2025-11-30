import styled from "styled-components";

export const BorderButton = styled.button`
  border: 2px solid ${(props) => props.theme.secondary};
  padding: 7px 14px;
  background: transparent;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  color: ${(props) => props.theme.text};
  max-width: 300px;
  min-height: 48px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
`;

export const BorderInput = styled.input`
  border: 2px solid ${(props) => props.theme.secondary};
  padding: 7px 14px;
  background: transparent;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  color: ${(props) => props.theme.text};
  max-width: 300px;
  min-height: 48px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
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

export const DangerButton = styled.button`
  border: 2px solid ${(props) => props.theme.negative};
  background-color: ${(props) => props.theme.negative};
  padding: 7px 14px;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  color: ${(props) => props.theme.white};
  max-width: 300px;
  min-height: 48px;
  margin-bottom: 16px;
  cursor: pointer;
  font-weight: 600;
  font-family: "Exo 2", sans-serif;
  transition: all 0.2s ease;

  &:hover {
    background-color: transparent;
    color: ${(props) => props.theme.negative};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default {
  BorderButton,
  BorderInput,
};
