import styled from "styled-components";

export const Main = styled.main`
  /* estilos existentes */
  background-color: var(--color-primary-1);
  width: 100%;
  height: 100 max-content;
  display: flex;
  flex-direction: column;
  align-items: center;

  .imglogo {
    width: 160px;
  }
  .positionIconBack {
    display: flex;
    width: 100%;
    max-width: 1440px;
    padding: 30px;
  }
  .imgIconBack {
    width: 45px;
    height: 40px;
    cursor: pointer;
  }
  .positionLogo {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .positionElipse {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 30px;
  }
  .elipse {
    width: 400px;
    height: 400px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgb(0 112 186 / 31%);
  }
  .elipse2 {
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background-color: rgb(0 181 239 / 44%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .elipse3 {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: rgb(170 223 249 / 33%);
  }
  .boxLogin {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    gap: 20px;
    padding: 30px;
    height: max-content;
    background-color: var(--color-white-1);
    border-radius: 10px;
    width: 90%;

    .inputPosition {
    display: flex;
    flex-direction: column;
    gap: 32px;
    }
  }
  .textLogin {
    color: var(--color-primary-1);
    font-weight: 500;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  label {
    color: var(--color-primary-1);
  }
  input {
    margin-top: 0;
  }

  .textFooter {
    font-family: "Nunito", sans-serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--color-white-1);
   width: 55%;
   
   text-align: left;
  }
 .this{
  display:flex;
  align-items: center;
  justify-content: center;
 }
  .positionEye {
    position: relative;
    svg {
      position: absolute;
      right: 20px;
      bottom: 15px;
      cursor: pointer;
    }
  }
  @media (min-width: 768px) {
    
    min-height: 100vh;
    .reverse {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      gap: 64px;
      max-width: 1440px;
      width: 100%;
    }
    .textFooter {
      width: 50%;
    }

    .positionElipse {
      width: 50%;
    }
    .elipse {
      width: 500px;
      height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .elipse2 {
      width: 450px;
      height: 450px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .elipse3 {
      width: 400px;
      height: 400px;
    }
    .boxLogin {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      gap: 50px;
      position: relative;
      bottom: 30px;

      height: 450px;
      background-color: var(--color-white-1);
      border-radius: 10px;
    }
    .inputPosition {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 100%;
    }
    /* min-width: 905px; */
  }
  
  .textLogin {
    font-size: 24px;
  }
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: var(--color-primary-2);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  h2{
    font-family: "Nunito", sans-serif;
    color: white;
  }
`;

export const ModalButton = styled.button`
  background-color: var(--color-primary-1);
  color: white;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  font-family: "Nunito", sans-serif;
  &:hover {
    background-color: var(--color-primary-3);
  }
`;

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '400px',
    backgroundColor: 'var(--color-white-1)',
    borderRadius: '10px',
    padding: '20px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};
