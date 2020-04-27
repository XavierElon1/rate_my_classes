import styled, {css} from 'react-emotion';

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

export const H3 = styled('h3')`
  font-size: 30px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: "white";
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
`;

export const H4 = styled('h4')`
  font-size: 20px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: "white";
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
`;
export const paper = css`
  padding: 30px;
  text-align: "center";
  background-color: #212121 !important;
  color: white !important;
`;
