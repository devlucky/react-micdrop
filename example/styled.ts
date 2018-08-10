import styled, {injectGlobal} from 'styled-components';

injectGlobal`
  body {
    font-family: Helvetica;
    background-color: #D8D1F5;
  }

  * {
    box-sizing: content-box;
  }
`;

export const AppWrapper = styled.div`

`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 20px;
`;

export const VisualisationsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const Visualisation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Audio = styled.audio`
  margin-bottom: 20px;
`;