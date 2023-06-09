import styled from "styled-components";

export const HeaderStyle = styled.header`

width: 100%;
height: 100px;

display: flex;
align-items: center;
justify-content: center;
position: fixed;
top: 0;
left: 0;
z-index: 2;

img{
    cursor: pointer;
}

.container{
    width: 1440px;
    height: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 32px;
    .imgLogo{
        width: 160px;
        height: 90;
    }
    svg{
        width: 30px;
        height: 30px;
    }
}


`