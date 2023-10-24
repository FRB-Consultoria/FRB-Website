import styled from "styled-components";

export const FooterStyle = styled.footer`
.gapPolitic{
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.imgLogo{
    width: 160px;
        height: 90;
}
width: 100%;
height: max-content;
background-color: var(--color-secondary);
color: var(--color-white-1);
position: relative;
svg{

    cursor: pointer;
  }
  .footerBox {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 32px;
    h3 {
      margin: 16px 0;
    }
    a {
      font-weight: 500;
    }
    .about {
      display: flex;
      flex-direction: column;
      gap: 16px;
      h3{
        margin: 16px 0 0 0;
      }
      a {
        font-weight: 400px;
        width: 200px;
      }
    }
  }
  .icons {
    display: flex;
    width: 100%;
    flex-direction: row;
    gap: 16px;
    padding: 8px;
    margin-bottom: 100px;
    svg {
      width: 24px;
      height: 24px;
    }
  }
  img {
    position: absolute;
    bottom: 32px;
    right: 32px;
  }

  @media (min-width: 768px) {
    display: flex;
    justify-content: center;
    padding-bottom: 16px;
    .footerBox {
      max-width: 1440px;
      flex-direction: row;
      justify-content: space-around;
    }
  }
`;
