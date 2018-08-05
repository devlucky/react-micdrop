//@ts-ignore
import {
  CanvasHTMLAttributes,
  ClassAttributes,
} from 'react';
//@ts-ignore
import {StyledComponentClass} from 'styled-components';
import styled from 'styled-components';

export const BarsCanvas = styled.canvas`
  border: 2px solid blue;
  border-radius: 3px;
`;

BarsCanvas.displayName = 'BarsCanvas';
