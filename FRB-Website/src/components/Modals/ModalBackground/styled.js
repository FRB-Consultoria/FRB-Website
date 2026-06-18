import styled from "styled-components";

export const ModalBackgroundStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  padding: 16px;

  .modal {
    background: #0d2744;
    border: 1px solid rgba(4, 173, 224, 0.18);
    border-radius: 16px;
    padding: 32px;
    position: relative;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;

    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-thumb {
      background: rgba(4, 173, 224, 0.3);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track { background: transparent; }

    .close {
      position: absolute;
      top: 16px;
      right: 20px;
      font-size: 20px;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      line-height: 1;
      transition: color 0.2s;
      font-weight: 400;
      &:hover { color: #04ADE0; }
    }

    /* Tamanhos por contexto */
    &.createCompany { max-width: 520px; }
    &.editCompany   { max-width: 760px; }
    &.removeCompany { max-width: 420px; }
    &.createClient  { max-width: 960px; }
    &.editClient    { max-width: 960px; }
    &.removeClient  { max-width: 400px; }
    &.createSub     { max-width: 480px; }

    @media (max-width: 600px) { padding: 24px 18px; }
  }
`;
