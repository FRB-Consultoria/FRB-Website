import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

html, body, figure, img, div, section, article, input, button,span, textarea, p, h1, h2, h3, h4, h5, h6, a, ul, li, ol, footer, aside, form, header, label, select, option{
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    list-style: none;
    font-family: 'Inter', sans-serif;
    text-decoration: none; 
  } 

body{
    font-family: 'Inter', sans-serif;
}

button{  
    cursor: pointer;        
    border: none;        
    background: transparent;    
}

a{  color: unset;        
    text-decoration: none; 
    font-weight: 700;
} 


:root {
    --color-primary-1: #134777;
    --color-primary-2: #0070BA;
    --color-primary-3: #04ADE0;
    --color-secondary: #05162B;

    --color-grey-0: #000000;
    --color-grey-05: #00000005;
    --color-grey-1: #FFFFFF;
    --color-grey-2: #F8F8F8;


    --color-negative: #E60000;
    --color-warning:#FFCD07;
    --color-sucess:#319A20;
    --color-sucess:#155BCB;

    --title-1: 48px;
    --title-2: 36px;
    --title-3: 24px;
    --title-4: 18px;
    --text: 16px;
    --text-2: 14px;
    --text-3: 12px;

    --regular: 400;
    --semi-bold: 600;
    --bold: 700;

    --radius-1: 4px;
    --radius-2: 8px;
}
`

