// import { injectGlobal } from "emotion";
import {css, keyframes} from 'react-emotion';
// import styled from "react-emotion";

export const App = css`
  text-align: center;
`;

export const AppLogo = css`
  height: 40vmin;
  pointer-events: none;
`;

export const AppHeader = css`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

export const AppLink = css`
  color: #61dafb;
`;

export const AppLogoSpin = keyframes`
    from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
