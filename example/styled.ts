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
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const MicDropWrapper = styled.div`
  display: inline-block;
  border: 2px solid #ccc;
  border-radius: 3px;
  line-height: 0;
`;