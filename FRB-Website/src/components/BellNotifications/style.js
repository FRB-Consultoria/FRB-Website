import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;

  .bell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.14);
    transition: 0.18s ease;
    border: 0;
    cursor: pointer;
  }

  .bell:hover {
    background: rgba(255, 255, 255, 0.22);
    transform: translateY(-1px);
  }

  .bell svg {
    font-size: 24px;
    color: white;
  }

  .badge {
    position: absolute;
    top: 6px;
    right: 6px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: #facc15;
    color: #111827;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 56px;
  width: 380px;
  max-width: min(92vw, 380px);
  background: white;
  border-radius: 18px;
  border: 1px solid #e9edf5;
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.14);
  overflow: hidden;
  z-index: 999;
`;

export const HeaderRow = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;

  .title {
    font-weight: 900;
    color: #123b7d;
    font-size: 15px;
  }

  .subtitle {
    margin-top: 4px;
    color: #64748b;
    font-size: 12px;
  }
`;

export const TopActions = styled.div`
  .refreshBtn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid #e6ecf5;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.16s ease;
  }

  .refreshBtn:hover {
    background: #f8fbff;
    transform: translateY(-1px);
  }

  .refreshBtn svg {
    color: #123b7d;
    font-size: 16px;
  }
`;

export const EmptyState = styled.div`
  padding: 18px 16px;
  color: #64748b;
  font-size: 14px;
`;

export const Item = styled.button`
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border: 0;
  border-bottom: 1px solid #f2f5f9;
  background: #fff;
  cursor: pointer;
  transition: 0.14s ease;
  display: grid;
  gap: 6px;

  &.unread {
    background: rgba(0, 112, 186, 0.06);
  }

  &:hover {
    background: rgba(19, 71, 119, 0.07);
  }

  .itemTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  strong {
    color: #123b7d;
    font-size: 14px;
    display: block;
    font-weight: 900;
  }

  p {
    color: #3f4b5b;
    font-size: 13px;
    margin: 0;
    line-height: 1.45;
  }

  small {
    color: #7c8796;
    font-size: 11px;
  }

  .readTag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 24px;
    padding: 0 8px;
    border-radius: 999px;
    background: #eef4ff;
    color: #123b7d;
    font-size: 11px;
    font-weight: 800;
    white-space: nowrap;
  }

  .unreadTag {
    background: #fff3cd;
    color: #9a6700;
  }
`;