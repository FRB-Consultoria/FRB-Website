import { createGlobalStyle } from "styled-components";

export const Animations = createGlobalStyle`
.slideLeft{
    animation: slideLeft 2s;
}

.slideRight{
    animation: slideRight 2s;
}

.slideDown{
    animation: slideDown 2s;
}

.opacity{
    animation: opacity 3s;
}

.opacity-2{
    animation: opacity 1s;
}

.scale{
    animation: scale 4s;
}

.spinner{
  font-size: 18px;
  animation: snipper 0.8s linear infinite;
}

 @keyframes slideLeft {
    0% {
      transform: translateX(600px);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

 @keyframes slideRight {
    0% {
      transform: translateX(-600px);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

 @keyframes slideDown {
    0% {
      transform: translatey(-200px);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes opacity {
    0% {
        opacity: 0;
        transform: matrix(-100%);
    }
    100% {
        opacity: 1;
        transform: matrix(0);
    }
  }

  @keyframes scale {
    0% {
        opacity: 0;
        scale:0;
    }
    100% {
        opacity: 1;
        scale: 1;
    }
  }

  @keyframes snipper {
    0% {
      transform: rotate(-1turn);
    }
  }
`