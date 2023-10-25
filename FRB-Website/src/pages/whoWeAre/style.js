import styled from "styled-components";

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: max-content;

  p {
    line-height: 1.2;
    font-size: 14px;
  }

  .firstSection {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
    min-height: 300px;
    height: 100%;
  }

  .observer {
    width: 100%;
    height: 100%;
  }

  .handsImg {
    width: 100%;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;

    div {
      width: 100%;
      height: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
.visionValue{
  background-color:#c7d7f9;
  padding:20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  .boxColor{
    background-color:#add8e6;
    border-radius:100px;
  padding:20px 20px 20px 0px;

  }
  .pVision{
    font-family: "Nunito", sans-serif;
    font-weight:bold;
    font-size:26px;
    text-align: center;
    margin: 0 auto;
    
  }
    
  div{
    display: flex;
    align-items: center;
justify-content: space-between;
p{
  width: 70%;
  font-family: "Nunito", sans-serif;
  
  
}
    img{
      width: 25%;
      background-color:#ffffff;
      border-radius:50%;
      padding: 5px;
    }
  }
  span{
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0 auto;
    img{
      width: 70px;
      height: 70px;
    }
  }
}
  .whyFRB {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    padding: 16px;
    width: 100%;
    height: max-content;
    height: 80%;
    div {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 16px;

      p {
        text-align: center;
      }
    }
  }

  .fatherImg {
    width: 100%;
    height: 160px;
    background-color: lightblue;
    margin-top: 64px;
    position: relative;

    div {
      width: 100%;
      height: 190px;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
    }

    img {
      width: 320px;
      height: 100%;
    }

    p {
      width: 40%;
      font-weight: 700;
      font-size: 12px;
      position: absolute;
      bottom: 90px;
      right: 0px;
      z-index: 2;
      font-family: "Nunito", sans-serif;
    }
  }

  .cardList {
    width: 100%;
    height: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    margin: 32px 0;

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 32px;
      padding: 16px;
      width: 90%;
      height: 370px;
      border: 1px solid black;
      border-radius: var(--radius-2);
      box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.5);
      text-align: center;
      img {
        max-width: 150px;
        max-height: 150px;
      }

      h3 {
        font-size: 24px;
        width: 80%;
        color: var(--color-primary-1);
      }
    }

    li:hover {
      transition: 0.2s;
      box-shadow: 0px 12px 12px rgba(0, 0, 0, 0.9);
      transform: translatey(-16px);
    }
  }
  .positionH4P {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 100%;
    background-color: var(--color-primary-1);
    padding: 20px;
    h4 {
      color: var(--color-white-1);
    }
    p {
      font-family: "Nunito", sans-serif;
      font-size: 16px;
      font-weight: 400;

      color: var(--color-white-1);
    }
  }
  h4 {
    font-family: "Nunito", sans-serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--color-primary-1);
    width: 100%;
    text-align: center;
    border-top: 1px solid var(--color-primary-1);
  }

  .positionCard {
    height: 100%;
    min-height: 350px;
    img {
      width: 100%;
      height: 250px;
      object-fit: cover;
    }
    .positionText {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      width: 100%;
    }
    .imgCard {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .purple {
      color: var(--color-purple);
      font-size: 17;
    }
    .article {
      font-weight: 300;
    }
  }
  .values {
    background-color: var(--color-primary-1);
    color: var(--color-white-1);

    margin-top: 20px;
  }
  
  @media (min-width: 768px) {
    .invert {
      display: flex;
      flex-direction: row-reverse;
    }
    section {
      max-width: 1440px;
    }
    .slider {
      height: 800px;
      .slides {
        .navigation-manual,
        .navigation-auto {
          margin-top: 750px;
        }
      }
    }
    .whyFRB {
      height: 300px;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      h3 {
        font-size: 48px;
        width: 50%;
        text-align: center;
      }

      div {
        height: 80%;
        align-items: center;
        justify-content: space-around;
        gap: 16px;
        width: 50%;
        p {
          width: 70%;
        }
        border-left: 2px solid var(--color-primary-3);
      }
    }
    .fatherImg {
      height: 300px;
      display: flex;
      justify-content: center;

      div {
        max-width: 1440px;
        height: 300px;
        position: relative;
        img {
          height: 380px;
          width: 600px;
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1;
        }
        p {
          font-size: 25px;
          bottom: 180px;
        }
      }
    }
    .positionH4P {
      display: flex;
      flex-direction: row;

      p {
        font-size: 19px;
        padding: 30px;
        text-align: center;
      }
      .separete {
        border-right: 1px solid var(--color-white-1);
      }
      .width {
        width: 100%;
      }
    }
    .cardList {
      flex-direction: row;
      flex-wrap: wrap;
      li {
        max-width: 30%;
      }
    }
    .visionValue{
      max-width: 100%;
      .pVision{
        font-size:36px;
      }
      .boxColor{
        padding-left:20px;
        
        img{
        width: 15%;
        padding: 20px;
      }
      p{
        font-size:24px;
        margin-right:10%;
      }
      }
      span{
        img{
          width: 120px;
          height: 120px;
        }
      }
    }
    
    .positionCard {
      display: flex;
      width: 100%;
      height: 400px;
      .purple {
        font-size: 23px;
      }
      .article {
        font-size: 19px;
        width: 100%;
      }

      .positionText {
        width: 100%;

        gap: 0;
        display: flex;
      }
      p {
        padding: 20px;
      }
    }
    /* .positionH4P{
      display: flex;
      h4{
        border: transparent;
        border-right:1px solid var(--color-primary-1);
        border-bottom:1px solid var(--color-primary-1)
      }
      p{
width: 50%;
      }
    } */
    
  }
`;
