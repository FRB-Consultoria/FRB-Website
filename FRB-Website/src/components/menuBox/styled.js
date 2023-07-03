import styled from "styled-components";

export const MenuStyle = styled.div`

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 0;
    right: 0;
    
    
    width: 40%;
    
    
    background-color: var(--color-white-1);
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.5);
    border-radius: 4px;

    div{
        flex-direction:column;
        align-items: flex-start;

        width: 100%;
        height: 100%;

        
    }

    .close{
        position: absolute;
        right: 24px;
        top: 16px;
        font-size: 20px;
    }
   

   


`
