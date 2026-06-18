import styled from "styled-components";

export const PageWrapper = styled.main`
  min-height: 100vh;
  width: 100%;
  background: #05162B;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(4, 173, 224, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -150px;
    left: -100px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(19, 71, 119, 0.3) 0%, transparent 70%);
    pointer-events: none;
  }
`;

export const BrandSide = styled.div`
  display: none;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 56px;
  position: relative;
  z-index: 1;

  @media (min-width: 900px) {
    display: flex;
  }
`;

export const BrandLogo = styled.img`
  height: 38px;
  object-fit: contain;
  align-self: flex-start;
`;

export const BrandContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const BrandTitle = styled.h1`
  font-family: "Nunito", sans-serif;
  font-size: 42px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;

  span {
    color: #04ADE0;
  }
`;

export const BrandSub = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
  max-width: 380px;
`;

export const BrandFeatures = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
`;

export const BrandFeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);

  &::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #04ADE0;
    flex-shrink: 0;
  }
`;

export const BrandBack = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;

  &:hover {
    color: #04ADE0;
  }

  svg {
    font-size: 16px;
  }
`;

export const Divider = styled.div`
  width: 1px;
  background: rgba(4, 173, 224, 0.12);
  align-self: stretch;

  @media (max-width: 899px) {
    display: none;
  }
`;

export const FormSide = styled.div`
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  position: relative;
  z-index: 1;

  @media (min-width: 900px) {
    flex: 0 0 480px;
    padding: 48px 56px;
  }
`;

export const MobileLogo = styled.img`
  height: 34px;
  object-fit: contain;
  margin-bottom: 40px;

  @media (min-width: 900px) {
    display: none;
  }
`;

export const FormCard = styled.div`
  width: 100%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(4, 173, 224, 0.15);
  border-radius: 20px;
  padding: 40px 36px;
  backdrop-filter: blur(12px);

  @media (max-width: 400px) {
    padding: 32px 24px;
  }
`;

export const FormTitle = styled.h2`
  font-family: "Nunito", sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 6px;
`;

export const FormSub = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 32px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
`;

export const FieldLabel = styled.label`
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.3px;
`;

export const FieldInput = styled.input`
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0 44px 0 16px;
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &:focus {
    border-color: #04ADE0;
    box-shadow: 0 0 0 3px rgba(4, 173, 224, 0.12);
    background: rgba(4, 173, 224, 0.04);
  }
`;

export const EyeButton = styled.button`
  position: absolute;
  right: 14px;
  bottom: 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.35);
  font-size: 18px;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #04ADE0;
  }
`;

export const ErrorText = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #ff6b6b;
  margin-top: 2px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #0070BA 0%, #04ADE0 100%);
  border: none;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: opacity 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;

  &:hover {
    opacity: 0.92;
    box-shadow: 0 8px 24px rgba(4, 173, 224, 0.25);
  }

  &:active {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const MobileBackLink = styled.button`
  margin-top: 28px;
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #04ADE0;
  }

  @media (min-width: 900px) {
    display: none;
  }
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 24px;
  background: #0d2744;
  border-radius: 16px;

  h2 {
    font-family: "Nunito", sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: white;
    margin-bottom: 4px;
  }
`;

export const ModalButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #0070BA 0%, #04ADE0 100%);
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.88;
  }
`;

export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "380px",
    backgroundColor: "#0d2744",
    border: "1px solid rgba(4,173,224,0.2)",
    borderRadius: "16px",
    padding: "0",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9999,
  },
};
