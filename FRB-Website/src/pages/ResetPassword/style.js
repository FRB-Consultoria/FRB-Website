import styled from "styled-components";
export const Main = styled.main`
display: flex;
flex-direction: column;
align-items: center;
gap: 16px;
width: 100%;
height: 100vh;

  .imgLogo{
    width: 160px;
    height: 90px;
  }
  .positionHeader {
    padding: 15px;
    width: 100%;
    max-width: 1440px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .iconBack {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
  .positionText{
    width: 100%;
    max-width: 1440px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;

    p{
      width: 80%;
      max-width: 400px;
    }
  }

  form{
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    padding: 32px;
    gap: 40px;
    background-color: var(--color-white-2);
    border-radius: var(--radius-2);

    .positionEye {
    position: relative;
    svg {
      position: absolute;
      right: 20px;
      bottom: 15px;
      cursor: pointer;
    }
  }
  }

  @media (min-width: 768px) {
    
    
  }
`