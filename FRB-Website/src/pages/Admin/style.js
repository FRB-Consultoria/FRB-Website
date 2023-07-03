import styled from "styled-components";
export const Main = styled.main`
  background-image: url("src/assets/img/BackgroundDashboard.webp");
  background-size: cover;
  background-position: center;
  background-color: var(--color-primary-1);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: max-content;
  min-height: 100vh;
  width: 100%;

  .container {
    width: 100%;
    max-width: 1440px;
  }
  .imgLogo {
    width: 160px;
    height: 90;
  }
  .positionHeader {
    padding: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .iconBack {
    width: 39px;
    height: 36px;
    cursor: pointer;
  }
  .iconLup {
    height: 15px;
    width: 15px;
  }
  p {
    color: var(--color-white-1);
  }
  .nameClient {
    font-size: 18px;
    font-weight: 500;
  }
  .positionNameClient {
    width: 100%;
    height: 100px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1),
      inset 0px 4px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 30px;
  }
  .positionIntro {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 30px;
  }
  .positionLayout {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .iconPositionAdd {
    display: flex;
    gap: 16px;
    align-items: center;
    img {
      cursor: pointer;
    }
  }

  .positionInput {
    position: relative;
    input {
      height: 45px;
      width: 100%;
      padding: 16px;
      font-size: 16px;
      background-color: transparent;
      border-bottom: 1px solid var(--color-grey-0);
      color: var(--color-white-1);
      ::placeholder {
        color: var(--color-white-1);
      }
    }
    .iconLup {
      font-size: 25px;
      position: absolute;
      right: 20px;
      top: 20%;
      color: var(--color-white-1);
    }
  }
  section {
    overflow-x: scroll;
    padding: 0px 0px 0px 30px;
  }
  .positionOption {
    width: 100%;
    display: flex;
    border-left: 2px solid var(--color-white-1);
    padding: 0 16px;
    p,
    span {
      width: max-content;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
    }

    svg {
      color: var(--color-white-1);
      font-size: 18px;
      cursor: pointer;
    }
  }
  .positionBussines {
    display: flex;

    justify-content: space-between;
    width: 589px;
    padding: 10px 32px;
  }
  .positionEditTrash {
    display: flex;
    gap: 30px;
  }
  li {
    margin-top: 20px;
    border-bottom: 2px solid var(--color-white-1);
    padding: 10px;
  }
  ul {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  @media (min-width: 768px) {
    .positionBussines {
      display: flex;
      width: 100%;
      justify-content: space-between;
      gap: 20px;
    }
    section {
      overflow-x: auto;
      padding: 20px;
    }
  }
  .positionInput {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    input {
      width: 35%;
    }
  }
  .positionOption {
    width: 100%;
    display: flex;
    border-left: 2px solid var(--color-white-1);
    padding: 0 16px;
    p,
    span {
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
