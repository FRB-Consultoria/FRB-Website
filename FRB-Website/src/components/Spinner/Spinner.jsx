import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: ${({ small }) => (small ? '20px' : '100px')};
  height: ${({ small }) => (small ? '20px' : '100px')};
  animation: ${spin} 1s linear infinite;
  position: ${({ small }) => (small ? 'relative' : 'absolute')};
  top: ${({ small }) => (small ? 'initial' : '50%')};
  left: ${({ small }) => (small ? 'initial' : '50%')};
`;

export const Spinner = ({ small }) => <SpinnerWrapper small={small} />;
