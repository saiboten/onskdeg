import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin: 10px auto;
  border: 1px solid black;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  max-width: 900px;
`;

class Container extends React.PureComponent {
  render() {
    const { children } = this.props;

    return (
      <StyledContainer>
        {children}
      </StyledContainer>
    );
  }
}

export default Container;
