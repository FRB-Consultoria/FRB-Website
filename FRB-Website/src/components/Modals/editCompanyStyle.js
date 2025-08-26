import styled from "styled-components";

export const EditCompany = styled.div`
  .editCompany {
    width: 90%;
    max-width: 940px;
    height: 70%;
    overflow: auto;
    padding: 32px 16px;
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--color-primary-1);
      border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    div {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 32px;
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        label {
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary-2);
          input {
            margin: 0;
          }
        }
        button {
          background-color: var(--color-primary-1);
          margin-top: 16px;
        }
      }
      div {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
        color: var(--color-primary-2);
      }
      ul {
        width: 100%;
        min-height: 243px;
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow-y: auto;
        overflow-y:hidden;
        border-radius: var(--radius-1);
        padding: 16px;
        gap: 16px;
        background-color: var(--color-white-1);
        box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.5);
        &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--color-primary-1);
      border-radius: 5px;
      
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
        li {
          min-width: 90%;
          height: max-content;
          padding: 16px;
          position: relative;
          background-color: var(--color-white-1);
          /* border: 1px solid var(--color-grey-0); */
          display: flex;
          flex-direction: column;
          gap: 32px;
          border-radius: var(--radius-1);
          text-align: left;
          border-bottom: 4px solid var(--color-primary-1);
          box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 4px;
          div {
            display: flex;
            flex-direction: column;
            align-items: center;
            button {
              background-color: var(--color-primary-1);
              width:65%;
              border-radius:4px
            }
            .deactive {
              background-color: var(--color-negative);
            }
            .active {
              background-color: var(--color-green);
            }
          }
        }
      }
    }
  }
  @media (min-width: 768px) {
    .editCompany {
      width: 80%;
      padding: 64px 32px;
      div {
        form {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          label {
            min-width: 30%;
            width: 30%;
          }
          button {
            width: 30%;
          }
        }
      }
      .positionClient {
        width: 100%;
        height: max-content;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        h3 {
          width: max-content;
        }
        button {
          width: 30%;
        }
        .powerbi-button {
          display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
height: 45px;
background: var(--color-secondary);
color: var(--color-white-1);
border-radius: var(--radius-1);
font-size:14px;
transition: 1s;
font-family: 'Roboto', sans-serif;
font-weight:400;
:hover{
    filter: contrast(130%);
}

          img {
            margin-right: 10px;
            width: 20px;
            height: 20px;
          }
        }
      }
      .clientList {
        li {
          min-width: 40%;
        }
      }
    }
  }
`;
