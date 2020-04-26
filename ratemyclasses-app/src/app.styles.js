import { injectGlobal } from "emotion";
import { css, keyframes } from "react-emotion";
// import styled from "react-emotion";

injectGlobal`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-touch-callout: none;   
  }

  html, body, button {
    /* width: 100%;
    height: 100vh; */
    font-family: LucidaGrande;
    /* font-family: 'Quicksand', 'M PLUS Rounded 1c'; */
    font-size: 16px;
    color: black;
    background: white;
    /* background: rgba(10,20,100,1); */
    /* overflow: hidden; */
  }

  input, textarea {
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }
`;
