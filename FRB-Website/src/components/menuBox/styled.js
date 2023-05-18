import styled from "styled-components";

export const MenuStyle = styled.div`

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    
    width: 40%;
    height: max-content;
    
    background-color: var(--color-grey-1);
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.5);
    border-radius: 4px;

    div{
        flex-direction:column;
        align-items: flex-start;

        width: 100%;
        height: 100%;

        margin-top: 32px;
    }

    .close{
        position: absolute;
        right: 24px;
        top: 16px;
        font-size: 20px;
    }
    .menu{
        position: absolute;
        left: 16px;
        top: 20px;
    }


`