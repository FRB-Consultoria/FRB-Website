import styled from "styled-components";

export const Main = styled.main`
  display: flex;
  height: 100vh;
  position: relative;

  p {
    font-family: 'Nunito', sans-serif;
  }

  color: var(--color-white-1);

  .container {
    width: 100%;
    max-width: 1440px;
  }

  .imgLogoPosition {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .imgLogo {
    width: 150px;
    margin-top: 45px;
  }

  .positionHeader {
    width: 300px;
    background-color: var(--color-primary-1);
  }

  .dashboardright {
    width: 100%;
    padding: 30px;
    border-bottom-left-radius: 70px;
    border-top-left-radius: 70px;
    box-shadow: 0 0 0 50px var(--color-primary-1);
    color: black;
    flex-grow: 1;
    overflow-x:hidden;
  }

  .positionIconButton {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;
    transition: background-color 0.3s, color 0.3s;
    cursor: pointer;

    svg {
      font-size: 40px;
    }

    &.selected {
      background-color: #065e99;
      color: black;

      svg {
        color: black;
      }
    }

    &:hover {
      background-color: var(--color-primary-2);
      color: black;

      svg {
        color: black;
      }
    }
  }

  .positionsButtons {
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 50px;
    align-items: flex-start;
    padding-left: 50px;

    button {
      color: white;
      font-size: 14px;
      font-family: 'Nunito', sans-serif;
      background: none;
      border: none;
      cursor: pointer;
    }
  }

  .doc {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
.client-logo{
width: 150px;

}
    .pDoc {
      font-size: 22px;
      font-weight: bold;
    }
  }

  .positionPending {
    margin-top: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;

    .red {
      color: #FF4136;
    }

    .yellow {
      color: #FFDC00;
    }

    .green {
      color: #2ECC40;
    }
  }

  .positionMonths {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .year {
      display: flex;
      gap: 30px;
      width: 100%;
      align-items: center;

      h3 {
        margin-top: 35px;
        font-family: 'Nunito', sans-serif;
      }
    }

    .months {
      display: flex;
      gap: 15px;
      width: 100%;
      flex-wrap: wrap;
    }

    .status-dot.red {
      background-color: #FF4136;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 21px;
      height: 21px;
      font-size: 14px;
      cursor: pointer;
      padding: 3px;
      font-family: Nunito, sans-serif;
    }

    .status-dot.yellow {
      background-color: #FFDC00; 
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 21px;
      height: 21px;
      cursor: pointer;
      color: #FFDC00;
      padding: 3px;
    }

    .status-dot.green {
      background-color: #2ECC40; 
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 15px;
      height: 15px;
      cursor: pointer;
      padding: 3px;
    }

    .month {
      display: flex;
      align-items: center;
      margin-right: 20px;
      flex-direction: column;
      cursor: pointer;
      padding: 10px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
border-radius:10px;
      span {
        font-size: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      p {
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
      }
    }

    .month.selected {
      border-color: var(--color-primary-1); /* Adiciona borda de destaque */
      background-color: rgba(0, 0, 0, 0.1); /* Muda a cor de fundo para destacar */
      transform: scale(1.1); /* Aumenta o tamanho do mês */
    }

    .month.selected .status-dot {
      transform: scale(1.7); 
    }
  }

  .monthSelect {
    font-weight: bold;
    width: 100%;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .monthSelectContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-top: solid 1px black;
    margin-top:10px;
  }

  .buttonDownloadAll {
    background-color: var(--color-primary-1);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-family: 'Nunito', sans-serif;
    cursor: pointer;
    white-space: nowrap;
  }

  .positionFature {
    width: 100%;
    display: flex;
    color: var(--color-primary-1);
    flex-direction: column;
    gap: 10px;
    
  }

  .positionDoneClip {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 100px;

    .positionDone {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      font-family: 'Nunito', sans-serif;

      svg {
        color: #2ECC40; 
      }
    }

    .positionConclip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;

      svg {
        font-size: 23px;
      }

      button {
        font-size: 16px;
        color: var(--color-primary-1);
        font-family: 'Nunito', sans-serif;
      }
    }
  }

  .display-flex {
    display: flex;
    gap: 10px;
    width: 100%;

    svg {
      font-size: 23px;
    }
  }

  .buttonShip {
    background-color: var(--color-primary-1);
    font-family: Nunito, sans-serif;
    width: 15%;
    color: white;
    border-radius: 10px;
    height: 30px;
    margin-left: auto;
  }

  .subinvoice-container {
    border-top: 1px solid #ddd;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .subinvoice-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 10px 0;
    flex-wrap: nowrap;
    gap: 10px;

    svg {
      font-size: 22px;
    }
  }

  .left-content {
    display: flex;
    align-items: center;
    gap: 10px;

    svg{
      font-size:16px;
    }
  }

  .right-content {
    display: flex;
    align-items: center;
    gap: 5px;

    button{
      font-size:16px;
      font-family: Nunito, sans-serif;
    }
  }

  .subinvoice-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
  }

  .uploaded-files {
    margin-left: 20px;
    border-left: 2px solid #ddd;
    padding-left: 10px;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;

      svg{
        cursor: pointer;
      }
    }

    .file-link {
      color: var(--color-primary-1);
      text-decoration: none;
    }

    .file-name {
      color: var(--color-primary-1);
      font-size:14px;
      cursor: pointer;
    }
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    .dashboardright {
      overflow-x:hidden;
      
     
    }
    .positionHeader, .dashboardright {
      width: 100%;
      
     
    }

    .positionsButtons {
      width: 100%;
      padding: 40px;
      display: flex;

align-items: center;
      button {
        font-size: 12px;
      }
    }

    .doc {
      .pDoc {
        font-size: 18px;
      }
    }

    .positionPending {
      margin-top: 50px;

      span {
        font-size: 14px;
      }

      p {
        font-size: 14px;
      }
    }

    .positionMonths {
      .year {
        h3 {
          font-size: 18px;
        }
      }

      .months {
        flex-wrap: wrap;
        gap: 10px;
      }

      .month {
        span {
          font-size: 20px;
        }

        p {
          font-size: 14px;
        }
      }
    }

    .monthSelect {
      font-size: 14px;
      padding: 20px 0;
    }

    .positionFature {
      gap: 5px;
    }

    .buttonShip {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .positionHeader {
      width: 100%;
      order: 1;
    }

    .dashboardright {
      overflow-x:hidden;
      order: 2;
    }

    .positionsButtons {
      
      align-items: center;
      
      justify-content: center;
      gap: 10px;
    }

    .doc {
      .pDoc {
        font-size: 16px;
      }
    }

    .positionPending {
      span {
        font-size: 12px;
      }

      p {
        font-size: 12px;
      }
    }

    .positionMonths {
      .year {
        h3 {
          font-size: 16px;
        }
      }

      .months {
        gap: 5px;
      }

      .month {
        span {
          font-size: 18px;
        }

        p {
          font-size: 12px;
        }
      }
    }

    .monthSelect {
      font-size: 12px;
      padding: 10px 0;
    }

    .positionFature {
      gap: 5px;
    }

    .buttonShip {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .imgLogo {
      width: 100px;
    }

    .positionsButtons {
      button {
        font-size: 10px;
      }
    }

    .doc {
      .pDoc {
        font-size: 14px;
      }
    }

    .positionPending {
      span {
        font-size: 10px;
      }

      p {
        font-size: 10px;
      }
    }

    .positionMonths {
      .year {
        h3 {
          font-size: 14px;
        }
      }

      .months {
        gap: 3px;
      }

      .month {
        span {
          font-size: 16px;
        }

        p {
          font-size: 10px;
        }
      }
    }

    .monthSelect {
      font-size: 10px;
      padding: 5px 0;
    }

    .positionFature {
      gap: 2px;
    }

    .buttonShip {
      width: 100%;
    }
  }
  .positionSpinner{
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    .spinner{
    border: 8px solid rgba(0, 0, 0, 0.1);
  border-left-color: #09f;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  }
  }
`;
