import styled from "styled-components";

export const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: 1rem 2rem;
  border: 2px solid ${(props) => props.theme.secondary};
  background: ${(props) => props.$active ? props.theme.secondary : 'transparent'};
  color: ${(props) => props.theme.text};
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.6rem;
  font-weight: ${(props) => props.$active ? '600' : '400'};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
