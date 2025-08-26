import styled from "styled-components";

export const CreateSub = styled.div`
  .CreateSub {
    width: 100%;
    max-width: 740px;
    height: 800px;
    padding: 32px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    overflow: auto;

    h2 {
      text-align: center;
      margin-bottom: 24px;
      color: var(--color-primary-2);
      font-size: 24px;
    }

    p {
      color: var(--color-primary-2);
      margin-bottom: 10px;
    }

    div {
      width: 100%;
      display: flex;
      flex-direction: column;
      

      form {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;

        label {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary-2);
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 400px;

          input {
            margin-top: 8px;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }

          .error {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 4px;
          }
        }

        .buttonContainer {
          display: flex;
          width: 100%;
          justify-content: center;
          margin-top: 20px;
        }
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          padding: 8px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 8px;
        }
      }
    }
  }

  @media (min-width: 768px) {
    .CreateSub {
      width: 80%;
      padding: 64px 32px;

      form {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 32px;

        label {
          width: 48%;
        }

        .buttonContainer {
          width: 100%;
          justify-content: flex-end;
        }
      }
    }
  }
`;
