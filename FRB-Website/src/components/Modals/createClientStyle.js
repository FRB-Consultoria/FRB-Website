import styled from "styled-components";

export const CreateClient = styled.div`
  .createClient {
    width: 90%;
    max-width: 660px;
    max-height: 92vh;
    overflow: auto;
    padding: 32px 24px;
    > div { width: 100%; }
  }
  @media (min-width: 768px) {
    .createClient { padding: 44px 40px; }
  }
`;
