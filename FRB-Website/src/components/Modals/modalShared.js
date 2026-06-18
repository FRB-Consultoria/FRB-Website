import styled from "styled-components";

export const ModalTitle = styled.h3`
  font-family: "Nunito", sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 24px;
`;

export const ModalSubTitle = styled.h4`
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  margin: 24px 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(4, 173, 224, 0.15);
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldLabel = styled.label`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
`;

export const FieldInput = styled.input`
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0 14px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder { color: rgba(255, 255, 255, 0.2); }

  &:focus {
    border-color: #04ADE0;
    box-shadow: 0 0 0 3px rgba(4, 173, 224, 0.1);
  }
`;

export const FieldSelect = styled.select`
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0 14px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  color: #ffffff;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;

  option { background: #0d2744; color: #ffffff; }

  &:focus {
    border-color: #04ADE0;
    box-shadow: 0 0 0 3px rgba(4, 173, 224, 0.1);
  }
`;

export const FieldError = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  color: #ff6b6b;
`;

export const ModalPrimaryBtn = styled.button`
  height: 44px;
  padding: 0 24px;
  background: linear-gradient(135deg, #0070BA 0%, #04ADE0 100%);
  border: none;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: opacity 0.2s, box-shadow 0.2s;
  width: 100%;
  margin-top: 8px;

  &:hover {
    opacity: 0.88;
    box-shadow: 0 6px 20px rgba(4, 173, 224, 0.25);
  }
`;

export const ModalGhostBtn = styled.button`
  height: 44px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  width: 100%;
  margin-top: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(255, 255, 255, 0.22);
  }
`;

export const ModalDangerBtn = styled.button`
  height: 44px;
  padding: 0 24px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #ef4444;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  margin-top: 8px;

  &:hover { background: rgba(239, 68, 68, 0.22); }
`;

export const BtnRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;

  & > * { flex: 1; margin-top: 0; }
`;

export const UserList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
`;

export const UserItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  transition: background 0.15s;

  &:hover { background: rgba(4, 173, 224, 0.05); }

  h4 {
    font-family: "Nunito", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    flex: 1;
  }
`;

export const UserItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const UserSmallBtn = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  border: none;

  &.edit {
    background: rgba(4, 173, 224, 0.12);
    color: #04ADE0;
    &:hover { background: rgba(4, 173, 224, 0.22); }
  }
  &.active {
    background: rgba(49, 154, 32, 0.15);
    color: #4ade80;
    &:hover { background: rgba(49, 154, 32, 0.25); }
  }
  &.deactive {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    &:hover { background: rgba(239, 68, 68, 0.2); }
  }
  &.sub {
    background: rgba(124, 58, 237, 0.12);
    color: #a78bfa;
    &:hover { background: rgba(124, 58, 237, 0.22); }
  }
`;

export const UserCloseBtn = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.08);
  border: none;
  color: rgba(239, 68, 68, 0.6);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;

  &:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
`;

export const PowerBiLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  background: rgba(243, 185, 0, 0.1);
  border: 1px solid rgba(243, 185, 0, 0.25);
  border-radius: 8px;
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #f3b900;
  text-decoration: none;
  transition: background 0.2s;

  &:hover { background: rgba(243, 185, 0, 0.18); }
`;

export const ConfirmText = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 8px;

  strong { color: #ffffff; }
`;
