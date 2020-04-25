import {css} from 'react-emotion';

export const body = css`
  * {
    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }
  }
  height: 100%;
  font-family: "Roboto";
  margin: 0;
  padding-top: 0.1px;
`;

export const wrapper = css`
  width: 100%;
  margin: 0 auto;
  float: none;
  background-color: #fff;
`;

export const row = css`
  display: flex;
  flex-flow: row wrap;
  flex: 0 1 auto;
  padding: 5px 10px;
  margin-bottom: 35px;
`;

export const col = css`
  flex: 0 0 92%;
  margin: auto 4%;
  @media only screen and (min-width: 480px) {
    margin-left: 4%;
    margin-right: 0%;
    text-align: center;
  }
`;
