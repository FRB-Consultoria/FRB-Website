import styled from "styled-components";

export const EditClient = styled.div`
  .editClient {
    width: 90%;
    max-width: 660px;
    max-height: 92vh;
    overflow: auto;
    padding: 32px 24px;

    > div {
      width: 100%;
    }
  }

  @media (min-width: 768px) {
    .editClient {
      padding: 44px 40px;
    }
  }
`;
