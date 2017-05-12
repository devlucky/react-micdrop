import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 20px;
`;

Wrapper.displayName = 'StoryContainerWrapper';

export const Audio = styled.audio`
  margin-bottom: 20px;
`;