import styled, { css } from "styled-components";

export const StyledHeading = styled.h2`
  font-size: 2.5em;
  ${({ primary }) =>
    primary &&
    css`
      background: #0052cc; // TODO: import from theme file
      font-size: 2em;
      font-weight: bolder;

      &:hover {
        background: red;
      }
    `};
`;

// you can extend styled-components
export const OrangeHeading = styled(StyledHeading)`
  color: orange;
`;

export const GrayHeading = styled(StyledHeading)`
  color: gray;
  text-align: center;
  font-size: 16px;
  margin: 10px 0;
`;
