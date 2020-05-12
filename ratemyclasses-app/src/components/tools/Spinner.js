import React from 'react';
import styled, {keyframes} from 'react-emotion';
import loading from './img/loading.png';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Image = styled('img')`
  animation: ${spin} 0.7s infinite linear;
  background-image: url("./img/loading.png");
  width: 100px;
  margin: 4em 1em;
`;

const Spinner = () => <Image src={loading} alt='loading indicator' />;

export default Spinner;
