import styled from "styled-components";
export const Main = styled.main`
nav{
  display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top:100px;
}
height: 100vh;
width: 100vw;
background-color: var(--color-primary-1);
display: flex;
flex-direction: column;
gap: 20px;
section{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    p{
color: var(--color-white-1);
font-size:20px;
    }
}
article{
  padding: 20px;
    background-color:var(--color-white-1);
    margin: 0 auto;
    border-radius:10px;
    margin-bottom:10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    svg{
      font-size: 24px;
      position: relative;
      top: 3px;
    }
    
    
}

`