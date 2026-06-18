import styled from "styled-components";

export const PageWrapper = styled.main`
  min-height: 100vh;
  width: 100%;
  background: #05162B;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: "";
    position: fixed;
    top: -200px;
    right: -200px;
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(4, 173, 224, 0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1320px;
  padding: 0 24px;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    padding: 0 40px;
  }
`;

/* ── Topbar ── */
export const Topbar = styled.header`
  width: 100%;
  border-bottom: 1px solid rgba(4, 173, 224, 0.1);
  background: rgba(5, 22, 43, 0.85);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const TopbarInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TopbarLogo = styled.img`
  height: 32px;
  object-fit: contain;
`;

export const TopbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;

  &:hover {
    color: #04ADE0;
  }
`;

/* ── Hero / Greeting ── */
export const HeroSection = styled.section`
  padding: 40px 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const HeroGreeting = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HeroTitle = styled.h1`
  font-family: "Nunito", sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;

  span {
    color: #04ADE0;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

export const HeroSub = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
`;

export const ReminderButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  background: linear-gradient(135deg, #0070BA 0%, #04ADE0 100%);
  border: none;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: opacity 0.2s, box-shadow 0.2s;
  white-space: nowrap;

  &:hover {
    opacity: 0.88;
    box-shadow: 0 6px 20px rgba(4, 173, 224, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ── Toolbar (search + add) ── */
export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const SectionTitle = styled.h2`
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
`;

export const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 14px;
    color: rgba(255, 255, 255, 0.35);
    font-size: 16px;
    pointer-events: none;
  }
`;

export const SearchInput = styled.input`
  height: 42px;
  width: 260px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0 16px 0 40px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &:focus {
    border-color: #04ADE0;
    box-shadow: 0 0 0 3px rgba(4, 173, 224, 0.1);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  background: rgba(4, 173, 224, 0.12);
  border: 1px solid rgba(4, 173, 224, 0.3);
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #04ADE0;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  white-space: nowrap;

  svg {
    font-size: 16px;
  }

  &:hover {
    background: rgba(4, 173, 224, 0.2);
    border-color: #04ADE0;
  }
`;

/* ── Table ── */
export const TableCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(4, 173, 224, 0.1);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 40px;
`;

export const TableHead = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.2fr 100px;
  padding: 14px 24px;
  background: rgba(4, 173, 224, 0.06);
  border-bottom: 1px solid rgba(4, 173, 224, 0.1);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TableHeadCell = styled.span`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.2fr 100px;
  padding: 16px 24px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(4, 173, 224, 0.04);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 16px;
  }
`;

export const TableCell = styled.div`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    &::before {
      content: attr(data-label) ": ";
      font-size: 11px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.35);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-right: 4px;
    }
    white-space: normal;
  }
`;

export const UsersBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  background: rgba(4, 173, 224, 0.15);
  border: 1px solid rgba(4, 173, 224, 0.25);
  border-radius: 20px;
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #04ADE0;
`;

export const ActionCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-size: 15px;

  &.edit {
    background: rgba(4, 173, 224, 0.1);
    color: #04ADE0;
    &:hover {
      background: rgba(4, 173, 224, 0.22);
    }
  }

  &.delete {
    background: rgba(239, 68, 68, 0.08);
    color: rgba(239, 68, 68, 0.7);
    &:hover {
      background: rgba(239, 68, 68, 0.18);
      color: #ef4444;
    }
  }
`;

export const EmptyState = styled.div`
  padding: 64px 24px;
  text-align: center;

  p {
    font-family: "Nunito", sans-serif;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.3);
  }
`;
