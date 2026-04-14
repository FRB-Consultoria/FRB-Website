import styled, { css } from "styled-components";

export const Main = styled.main`
  --portal-primary: #123b7d;
  --portal-primary-dark: #0e2d5c;
  --portal-accent: #eef4ff;
  --portal-border: rgba(18, 59, 125, 0.1);
  --portal-text: #10233f;
  --portal-muted: #5c6b80;
  --portal-success: #157347;
  --portal-warning: #a15c00;
  --portal-danger: #b42318;

  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(18, 59, 125, 0.09), transparent 28%),
    linear-gradient(180deg, #f7f9fc 0%, #eef3f9 100%);
  display: grid;
  grid-template-columns: 330px 1fr;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  * {
    box-sizing: border-box;
  }

  button,
  input,
  select {
    font-family: "Nunito", sans-serif;
  }

  ${css`
    .sidebar,
    .content,
    .rootList,
    .treeScroll,
    .tableWrap,
    .payloadBox,
    .personGrid,
    .exclusionCardGrid {
      scrollbar-width: thin;
      scrollbar-color: var(--portal-primary) rgba(18, 59, 125, 0.08);
    }

    .sidebar::-webkit-scrollbar,
    .content::-webkit-scrollbar,
    .rootList::-webkit-scrollbar,
    .treeScroll::-webkit-scrollbar,
    .tableWrap::-webkit-scrollbar,
    .payloadBox::-webkit-scrollbar,
    .personGrid::-webkit-scrollbar,
    .exclusionCardGrid::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    .sidebar::-webkit-scrollbar-track,
    .content::-webkit-scrollbar-track,
    .rootList::-webkit-scrollbar-track,
    .treeScroll::-webkit-scrollbar-track,
    .tableWrap::-webkit-scrollbar-track,
    .payloadBox::-webkit-scrollbar-track,
    .personGrid::-webkit-scrollbar-track,
    .exclusionCardGrid::-webkit-scrollbar-track {
      background: rgba(18, 59, 125, 0.08);
      border-radius: 999px;
    }

    .sidebar::-webkit-scrollbar-thumb,
    .content::-webkit-scrollbar-thumb,
    .rootList::-webkit-scrollbar-thumb,
    .treeScroll::-webkit-scrollbar-thumb,
    .tableWrap::-webkit-scrollbar-thumb,
    .payloadBox::-webkit-scrollbar-thumb,
    .personGrid::-webkit-scrollbar-thumb,
    .exclusionCardGrid::-webkit-scrollbar-thumb {
      background: linear-gradient(
        180deg,
        var(--portal-primary) 0%,
        var(--portal-primary-dark) 100%
      );
      border-radius: 999px;
      border: 2px solid rgba(255, 255, 255, 0);
      background-clip: padding-box;
    }

    .sidebar::-webkit-scrollbar-thumb:hover,
    .content::-webkit-scrollbar-thumb:hover,
    .rootList::-webkit-scrollbar-thumb:hover,
    .treeScroll::-webkit-scrollbar-thumb:hover,
    .tableWrap::-webkit-scrollbar-thumb:hover,
    .payloadBox::-webkit-scrollbar-thumb:hover,
    .personGrid::-webkit-scrollbar-thumb:hover,
    .exclusionCardGrid::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #184894 0%, #0b2347 100%);
    }

    .sidebar::-webkit-scrollbar-corner,
    .content::-webkit-scrollbar-corner,
    .rootList::-webkit-scrollbar-corner,
    .treeScroll::-webkit-scrollbar-corner,
    .tableWrap::-webkit-scrollbar-corner,
    .payloadBox::-webkit-scrollbar-corner,
    .personGrid::-webkit-scrollbar-corner,
    .exclusionCardGrid::-webkit-scrollbar-corner {
      background: transparent;
    }
  `}

  .sidebar {
    background: linear-gradient(
      180deg,
      var(--portal-primary-dark) 0%,
      var(--portal-primary) 100%
    );
    color: #fff;
    padding: 26px 22px;
    position: sticky;
    top: 0;
    overflow: auto;
    box-shadow: 10px 0 40px rgba(14, 45, 92, 0.18);

    @media (max-width: 1200px) {
      position: relative;
      height: auto;
    }
  }

  .logoBox {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 22px;
  }

  .logo {
    width: min(190px, 80%);
    object-fit: contain;
  }

  .sideTitle {
    text-align: center;
    margin-bottom: 24px;
  }

  .sideTitle h2 {
    margin: 0 0 4px;
    font-size: 1.5rem;
    font-weight: 900;
  }

  .sideTitle p {
    margin: 0;
    opacity: 0.82;
    font-size: 0.95rem;
  }

  .sideSection {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 22px;
    padding: 16px;
    margin-bottom: 14px;
    backdrop-filter: blur(8px);
  }

  .sectionTitle {
    font-size: 0.88rem;
    font-weight: 800;
    margin-bottom: 12px;
    opacity: 0.92;
    letter-spacing: 0.02em;
  }

  .tabBar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .tabBtn {
    border: 0;
    border-radius: 14px;
    padding: 12px 10px;
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
    font-weight: 800;
    cursor: pointer;
    transition: 0.18s ease;
  }

  .tabBtn:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.15);
  }

  .tabBtn.active {
    background: #fff;
    color: var(--portal-primary);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  }

  .field {
    display: grid;
    gap: 7px;
    margin-bottom: 12px;
  }

  .field label {
    font-size: 0.88rem;
    font-weight: 700;
    opacity: 0.95;
  }

  .field input,
  .field select {
    width: 100%;
    min-height: 46px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 14px;
    padding: 0 14px;
    background: rgba(255, 255, 255, 0.16);
    color: #fff;
    outline: none;
  }

  .field input::placeholder {
    color: rgba(255, 255, 255, 0.72);
  }

  .field select option {
    color: #111;
  }

  .primaryBtn,
  .ghostBtn,
  .outlineBtn,
  .dangerBtn,
  .smallBtn,
  .smallGhostBtn {
    min-height: 46px;
    border-radius: 14px;
    border: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 800;
    transition: 0.18s ease;
    width: 100%;
  }

  .primaryBtn {
    background: #fff;
    color: var(--portal-primary);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.14);
  }

  .primaryBtn:hover {
    transform: translateY(-1px);
  }

  .ghostBtn {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.14);
  }

  .ghostBtn:hover {
    background: rgba(255, 255, 255, 0.16);
  }

  .outlineBtn {
    background: #fff;
    color: var(--portal-primary);
    border: 1px solid var(--portal-border);
  }

  .outlineBtn:hover {
    transform: translateY(-1px);
  }

  .dangerBtn {
    background: #fff2f2;
    color: var(--portal-danger);
    border: 1px solid rgba(180, 35, 24, 0.12);
  }

  .smallBtn,
  .smallGhostBtn {
    min-height: 38px;
    padding: 0 14px;
    font-size: 0.88rem;
  }

  .smallBtn {
    background: var(--portal-primary);
    color: #fff;
  }

  .smallGhostBtn {
    background: #fff;
    color: var(--portal-primary);
    border: 1px solid var(--portal-border);
  }

  .content {
    padding: 28px;
    overflow: auto;
    min-width: 0;
    min-height: 0;

    @media (max-width: 768px) {
      padding: 18px;
    }
  }

  .contentTopbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 22px;
    flex-wrap: wrap;
  }

  .pageTitle h1 {
    margin: 0;
    color: var(--portal-text);
    font-size: clamp(1.6rem, 2vw, 2rem);
    font-weight: 900;
  }

  .pageTitle p {
    margin: 6px 0 0;
    color: var(--portal-muted);
    font-size: 0.96rem;
    line-height: 1.45;
    max-width: 920px;
  }

  .statsRow {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .metaChip {
    min-width: 150px;
    border-radius: 18px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid var(--portal-border);
    box-shadow: 0 14px 34px rgba(16, 35, 63, 0.06);
    display: grid;
    gap: 4px;
  }

  .metaChip span {
    font-size: 0.82rem;
    color: var(--portal-muted);
    font-weight: 700;
  }

  .metaChip strong {
    color: var(--portal-text);
    font-size: 1.25rem;
    font-weight: 900;
  }

  .workspace {
    display: grid;
    gap: 18px;
    min-width: 0;
    min-height: 0;
  }

  .treeLayout {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 18px;
    min-height: calc(100vh - 170px);
    min-width: 0;
    align-items: stretch;

    @media (max-width: 1280px) {
      grid-template-columns: 1fr;
      min-height: auto;
    }
  }

  .panel {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 28px;
    border: 1px solid var(--portal-border);
    box-shadow: 0 20px 50px rgba(16, 35, 63, 0.06);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }

  .panelHeader {
    padding: 18px 20px;
    border-bottom: 1px solid rgba(18, 59, 125, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  .panelHeader h3 {
    margin: 0;
    color: var(--portal-text);
    font-size: 1.04rem;
    font-weight: 900;
  }

  .panelHeader p {
    margin: 4px 0 0;
    color: var(--portal-muted);
    font-size: 0.9rem;
  }

  .panelBody {
    padding: 18px 20px 22px;
    min-width: 0;
    min-height: 0;
    flex: 1;
    overflow: hidden;
  }

  .rootList {
    display: grid;
    gap: 12px;
    max-height: calc(100vh - 280px);
    overflow: auto;
    padding-right: 6px;
    min-width: 0;

    @media (max-width: 1280px) {
      max-height: 520px;
    }

    @media (max-width: 768px) {
      max-height: 420px;
    }
  }

  .rootItem {
    border: 1px solid rgba(18, 59, 125, 0.08);
    border-radius: 18px;
    padding: 14px;
    background: #fff;
    cursor: pointer;
    transition: 0.18s ease;
    display: grid;
    gap: 10px;
  }

  .rootItem:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(18, 59, 125, 0.08);
  }

  .rootItem.active {
    border-color: rgba(18, 59, 125, 0.26);
    background: var(--portal-accent);
    box-shadow: 0 16px 30px rgba(18, 59, 125, 0.11);
  }

  .rootItemTop {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .rootItemName {
    color: var(--portal-text);
    font-size: 0.97rem;
    font-weight: 900;
    line-height: 1.35;
  }

  .rootItemSub {
    color: var(--portal-muted);
    font-size: 0.82rem;
    margin-top: 4px;
    display: grid;
    gap: 2px;
  }

  .rootItemFooter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .chip {
    min-height: 30px;
    border-radius: 999px;
    padding: 0 11px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    font-weight: 800;
    line-height: 1;
    border: 1px solid transparent;
  }

  .chip.default {
    background: rgba(18, 59, 125, 0.07);
    color: var(--portal-primary);
    border-color: rgba(18, 59, 125, 0.09);
  }

  .chip.warning {
    background: rgba(255, 183, 77, 0.15);
    color: var(--portal-warning);
    border-color: rgba(161, 92, 0, 0.12);
  }

  .chip.success {
    background: rgba(34, 197, 94, 0.12);
    color: var(--portal-success);
    border-color: rgba(21, 115, 71, 0.12);
  }

  .chip.danger {
    background: rgba(244, 67, 54, 0.1);
    color: var(--portal-danger);
    border-color: rgba(180, 35, 24, 0.12);
  }

  .detailEmpty {
    min-height: 400px;
    display: grid;
    place-items: center;
    color: var(--portal-muted);
    text-align: center;
    padding: 30px;
  }

  .treeScroll {
    display: grid;
    gap: 18px;
    max-height: calc(100vh - 280px);
    overflow: auto;
    padding-right: 6px;
    min-width: 0;

    @media (max-width: 1280px) {
      max-height: none;
      overflow: visible;
      padding-right: 0;
    }
  }

  .rootTreeLine {
    position: relative;
    padding-left: 26px;
  }

  .rootTreeLine::before {
    content: "";
    position: absolute;
    left: 10px;
    top: 16px;
    bottom: -6px;
    width: 2px;
    background: rgba(18, 59, 125, 0.12);
  }

  .rootTreeLine::after {
    content: "";
    position: absolute;
    left: 2px;
    top: 10px;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: var(--portal-primary);
    box-shadow: 0 0 0 6px rgba(18, 59, 125, 0.08);
  }

  .dependentsGrid {
    display: grid;
    gap: 14px;
    padding-left: 26px;
    position: relative;
  }

  .dependentsGrid::before {
    content: "";
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(18, 59, 125, 0.1);
  }

  .dependentLine {
    position: relative;
    padding-left: 20px;
  }

  .dependentLine::before {
    content: "";
    position: absolute;
    left: 0;
    top: 28px;
    width: 18px;
    height: 2px;
    background: rgba(18, 59, 125, 0.1);
  }

  .personCard {
    border-radius: 24px;
    border: 1px solid rgba(18, 59, 125, 0.08);
    background: #fff;
    overflow: hidden;
    box-shadow: 0 16px 30px rgba(16, 35, 63, 0.04);
    min-width: 0;
  }

  .personHeader {
    padding: 18px 18px 14px;
    border-bottom: 1px solid rgba(18, 59, 125, 0.06);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }

  .personHeader h4 {
    margin: 0;
    color: var(--portal-text);
    font-size: 1.03rem;
    font-weight: 900;
  }

  .personHeader p {
    margin: 6px 0 0;
    color: var(--portal-muted);
    font-size: 0.9rem;
  }

  .personHeaderRight {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .personBody {
    padding: 18px;
    display: grid;
    gap: 16px;
    min-width: 0;
  }

  .personGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(220px, 1fr));
    gap: 12px;
    min-width: 0;
    overflow-x: auto;
    padding-bottom: 4px;

    @media (max-width: 1180px) {
      grid-template-columns: repeat(2, minmax(220px, 1fr));
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      overflow-x: visible;
      padding-bottom: 0;
    }
  }

  .infoBox {
    border-radius: 16px;
    background: #f8fbff;
    border: 1px solid rgba(18, 59, 125, 0.06);
    padding: 12px 14px;
    min-height: 86px;
    display: grid;
    align-content: start;
    gap: 8px;
    min-width: 0;
  }

  .infoBoxTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .infoBox span {
    color: var(--portal-muted);
    font-size: 0.77rem;
    font-weight: 800;
    letter-spacing: 0.01em;
    line-height: 1.25;
  }

  .valueText {
    color: var(--portal-text);
    font-size: 0.94rem;
    word-break: break-word;
    line-height: 1.45;
  }

  .copyMiniBtn {
    width: 30px;
    height: 30px;
    min-width: 30px;
    border-radius: 10px;
    border: 1px solid rgba(18, 59, 125, 0.12);
    background: #fff;
    color: var(--portal-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.18s ease;
  }

  .copyMiniBtn:hover {
    transform: translateY(-1px);
    background: var(--portal-accent);
  }

  .copyMiniBtn.copied {
    background: rgba(34, 197, 94, 0.12);
    color: var(--portal-success);
    border-color: rgba(21, 115, 71, 0.16);
  }

  .actionsBlock {
    display: grid;
    gap: 12px;
    border-top: 1px solid rgba(18, 59, 125, 0.06);
    padding-top: 16px;
  }

  .cardInputsGrid {
    display: grid;
    gap: 14px;
  }

  .cardTypeBlock {
    display: grid;
    gap: 8px;
  }

  .cardTypeBlock label {
    color: var(--portal-text);
    font-size: 0.84rem;
    font-weight: 800;
  }

  .inputActionRow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;

    @media (max-width: 820px) {
      grid-template-columns: 1fr;
    }
  }

  .inputActionRow input {
    min-height: 46px;
    border-radius: 14px;
    border: 1px solid rgba(18, 59, 125, 0.14);
    background: #fff;
    padding: 0 14px;
    outline: none;
    color: var(--portal-text);
    min-width: 0;
  }

  .secondaryLineBtn {
    width: fit-content;
  }

  .missingCardBox {
    border-radius: 16px;
    border: 1px dashed rgba(18, 59, 125, 0.16);
    background: rgba(18, 59, 125, 0.03);
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .missingCardInfo {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .missingBadge {
    min-height: 34px;
    border-radius: 999px;
    padding: 0 12px;
    background: rgba(244, 67, 54, 0.1);
    color: var(--portal-danger);
    border: 1px solid rgba(180, 35, 24, 0.12);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    font-weight: 800;
  }

  .actionButtons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .actionInlineBtn {
    width: auto;
  }

  .historySection {
    border-top: 1px solid rgba(18, 59, 125, 0.06);
    padding-top: 16px;
    display: grid;
    gap: 10px;
  }

  .historyTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .historyTitle h5 {
    margin: 0;
    color: var(--portal-text);
    font-size: 0.96rem;
    font-weight: 900;
  }

  .historyList {
    display: grid;
    gap: 10px;
  }

  .eventCard {
    border-radius: 16px;
    border: 1px solid rgba(18, 59, 125, 0.08);
    background: #fcfdff;
    padding: 12px 14px;
    display: grid;
    gap: 6px;
  }

  .eventCardTop {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }

  .eventCard strong {
    color: var(--portal-text);
    font-size: 0.92rem;
  }

  .eventCard small {
    color: var(--portal-muted);
    font-size: 0.78rem;
    line-height: 1.4;
  }

  .eventCard p {
    margin: 0;
    color: #4b5666;
    font-size: 0.86rem;
    line-height: 1.45;
  }

  .payloadBox {
    border-radius: 14px;
    background: #f4f7fb;
    border: 1px solid rgba(18, 59, 125, 0.06);
    padding: 10px;
    overflow: auto;
    max-height: 260px;
    font-size: 0.78rem;
    color: #334155;
  }

  .mono {
    font-family: "Courier New", Courier, monospace;
  }

  .sectionDivider {
    height: 1px;
    background: rgba(18, 59, 125, 0.08);
    margin: 4px 0;
  }

  .mutedText {
    color: var(--portal-muted);
    font-size: 0.9rem;
  }

  .emptyState {
    min-height: 180px;
    border: 1px dashed rgba(18, 59, 125, 0.16);
    border-radius: 22px;
    background: rgba(18, 59, 125, 0.03);
    display: grid;
    place-items: center;
    color: var(--portal-muted);
    padding: 20px;
    text-align: center;
  }

  .exclusionCardGrid {
    display: grid;
    gap: 16px;
    max-height: calc(100vh - 280px);
    overflow: auto;
    padding-right: 6px;

    @media (max-width: 1280px) {
      max-height: none;
      overflow: visible;
      padding-right: 0;
    }
  }

  .exclusionCard {
    border-radius: 24px;
    border: 1px solid rgba(18, 59, 125, 0.08);
    background: #fff;
    overflow: hidden;
    box-shadow: 0 18px 34px rgba(16, 35, 63, 0.05);
  }

  .exclusionHeader {
    padding: 18px;
    border-bottom: 1px solid rgba(18, 59, 125, 0.06);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }

  .exclusionHeaderLeft {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    min-width: 0;
  }

  .exclusionIconWrap {
    width: 46px;
    height: 46px;
    min-width: 46px;
    border-radius: 14px;
    background: rgba(18, 59, 125, 0.08);
    color: var(--portal-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
  }

  .exclusionHeader h4 {
    margin: 0;
    color: var(--portal-text);
    font-size: 1.02rem;
    font-weight: 900;
  }

  .exclusionHeader p {
    margin: 6px 0 0;
    color: var(--portal-muted);
    font-size: 0.9rem;
    line-height: 1.45;
  }

  .exclusionHeaderRight {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .exclusionBody {
    padding: 18px;
    display: grid;
    gap: 16px;
  }

  .exclusionInfoGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(180px, 1fr));
    gap: 12px;

    @media (max-width: 1100px) {
      grid-template-columns: repeat(2, minmax(180px, 1fr));
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .miniInfo {
    border-radius: 16px;
    background: #f8fbff;
    border: 1px solid rgba(18, 59, 125, 0.06);
    padding: 12px 14px;
    display: grid;
    gap: 8px;
  }

  .miniInfo span {
    color: var(--portal-muted);
    font-size: 0.76rem;
    font-weight: 800;
    line-height: 1.25;
  }

  .miniInfo strong {
    color: var(--portal-text);
    font-size: 0.93rem;
    line-height: 1.4;
    word-break: break-word;
  }

  .impactedSection {
    border-top: 1px solid rgba(18, 59, 125, 0.06);
    padding-top: 16px;
    display: grid;
    gap: 10px;
  }

  .impactedSectionTop h5 {
    margin: 0;
    color: var(--portal-text);
    font-size: 0.95rem;
    font-weight: 900;
  }

  .dependentsPills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .dependentPill {
    min-width: 220px;
    border-radius: 16px;
    background: #f7faff;
    border: 1px solid rgba(18, 59, 125, 0.08);
    padding: 10px 12px;
    display: grid;
    gap: 4px;
  }

  .dependentPillTitle {
    color: var(--portal-text);
    font-size: 0.9rem;
    font-weight: 900;
    line-height: 1.35;
  }

  .dependentPillMeta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    color: var(--portal-muted);
    font-size: 0.78rem;
    line-height: 1.35;
  }

  .exclusionActions {
    border-top: 1px solid rgba(18, 59, 125, 0.06);
    padding-top: 16px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .paginationBar {
    margin-top: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .pageBtn {
    min-height: 42px;
    border: 1px solid var(--portal-border);
    border-radius: 14px;
    background: #fff;
    color: var(--portal-primary);
    padding: 0 14px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .pageBtn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .pageInfo {
    color: var(--portal-muted);
    font-weight: 800;
  }

  .companyModalOverlay,
  .confirmModalOverlay {
    position: fixed;
    inset: 0;
    z-index: 3000;
    background: rgba(7, 18, 38, 0.4);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
  }

  .companyModalCard,
  .confirmModalCard {
    width: min(96vw, 520px);
    border-radius: 28px;
    background: #fff;
    border: 1px solid rgba(18, 59, 125, 0.08);
    box-shadow: 0 30px 80px rgba(16, 35, 63, 0.22);
    overflow: hidden;
  }

  .companyModalHeader,
  .confirmModalHeader {
    padding: 20px 22px;
    border-bottom: 1px solid rgba(18, 59, 125, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .companyModalHeader h3,
  .confirmModalHeader h3 {
    margin: 0;
    color: var(--portal-text);
    font-size: 1.14rem;
    font-weight: 900;
  }

  .companyModalBody,
  .confirmModalBody {
    padding: 20px 22px 24px;
  }

  .confirmModalBody p {
    margin: 0;
    color: var(--portal-text);
    font-size: 1rem;
    line-height: 1.6;
  }

  .companyFormField {
    display: grid;
    gap: 8px;
    margin-bottom: 16px;
  }

  .companyFormField label {
    color: var(--portal-text);
    font-size: 0.92rem;
    font-weight: 800;
  }

  .companyFormField select {
    min-height: 48px;
    border-radius: 16px;
    border: 1px solid rgba(18, 59, 125, 0.14);
    background: #fff;
    padding: 0 14px;
    outline: none;
    color: var(--portal-text);
  }

  .companyModalActions,
  .confirmModalActions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }

  .confirmModalActions {
    margin-top: 22px;
  }

  .confirmActionBtn {
    width: auto;
    min-width: 180px;
  }

  .confirmCloseBtn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgba(18, 59, 125, 0.1);
    background: #f8fbff;
    color: var(--portal-primary);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: 0.18s ease;
    flex-shrink: 0;
  }

  .confirmCloseBtn:hover {
    background: #eef4ff;
    transform: translateY(-1px);
  }

  .confirmCloseBtn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }

  .companyHint {
    margin-top: 14px;
    color: var(--portal-muted);
    font-size: 0.9rem;
    line-height: 1.45;
  }


  .globalTopbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  /* ── Notification Bell ── */

  .notificationBellWrap {
    position: relative;
  }

  .bellBtn {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    border: 1px solid var(--portal-border);
    background: rgba(255, 255, 255, 0.95);
    color: var(--portal-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: 0.18s ease;
    position: relative;
    box-shadow: 0 8px 20px rgba(16, 35, 63, 0.06);
  }

  .bellBtn:hover {
    transform: translateY(-1px);
    background: var(--portal-accent);
  }

  .bellBadge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 20px;
    height: 20px;
    border-radius: 999px;
    background: var(--portal-danger);
    color: #fff;
    font-size: 0.68rem;
    font-weight: 900;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    line-height: 1;
    border: 2px solid #fff;
  }

  .notifDropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: min(92vw, 400px);
    max-height: 500px;
    border-radius: 22px;
    background: #fff;
    border: 1px solid var(--portal-border);
    box-shadow: 0 24px 60px rgba(16, 35, 63, 0.18);
    z-index: 2000;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .notifDropdownHeader {
    padding: 16px 18px;
    border-bottom: 1px solid rgba(18, 59, 125, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-shrink: 0;
  }

  .notifDropdownTitle {
    color: var(--portal-text);
    font-size: 1rem;
    font-weight: 900;
  }

  .notifMarkAllBtn {
    border: 0;
    background: none;
    color: var(--portal-primary);
    font-size: 0.8rem;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 8px;
    transition: 0.18s ease;
  }

  .notifMarkAllBtn:hover {
    background: var(--portal-accent);
  }

  .notifDropdownBody {
    overflow-y: auto;
    flex: 1;
    max-height: 420px;
    scrollbar-width: thin;
    scrollbar-color: var(--portal-primary) rgba(18, 59, 125, 0.08);
  }

  .notifItem {
    padding: 14px 18px;
    border-bottom: 1px solid rgba(18, 59, 125, 0.05);
    cursor: pointer;
    transition: 0.12s ease;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .notifItem:hover {
    background: rgba(18, 59, 125, 0.03);
  }

  .notifItem.unread {
    background: rgba(18, 59, 125, 0.04);
    border-left: 3px solid var(--portal-primary);
  }

  .notifItemContent {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 4px;
  }

  .notifItemTitle {
    color: var(--portal-text);
    font-size: 0.88rem;
    font-weight: 800;
    line-height: 1.35;
  }

  .notifItemMessage {
    color: var(--portal-muted);
    font-size: 0.82rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .notifItemTime {
    color: rgba(92, 107, 128, 0.7);
    font-size: 0.74rem;
    font-weight: 700;
  }

  .notifReadBtn {
    width: 30px;
    height: 30px;
    min-width: 30px;
    border-radius: 10px;
    border: 1px solid rgba(18, 59, 125, 0.1);
    background: #fff;
    color: var(--portal-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.18s ease;
    flex-shrink: 0;
  }

  .notifReadBtn:hover {
    background: var(--portal-accent);
    transform: translateY(-1px);
  }

  .notifEmpty {
    padding: 30px;
    text-align: center;
    color: var(--portal-muted);
    font-size: 0.9rem;
  }

  /* ── Integration panel ── */

  .integrationKeyBox {
    display: grid;
    gap: 10px;
  }

  .integrationKeyRow {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 10px 14px;
  }

  .integrationKeyValue {
    flex: 1;
    font-size: 0.78rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
    word-break: break-all;
    line-height: 1.4;
    font-family: "Nunito", sans-serif;
  }

  .integrationMiniBtn {
    width: 34px;
    height: 34px;
    min-width: 34px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.18s ease;
  }

  .integrationMiniBtn:hover {
    background: rgba(255, 255, 255, 0.16);
  }

  .integrationActions {
    display: grid;
    gap: 8px;
  }

  .integrationMeta {
    margin-top: 8px;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.6);
  }

  /* ── Loader dots ── */

  .loaderDots {
    display: inline-flex;
    gap: 6px;
    margin-bottom: 10px;
  }

  .loaderDots span {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--portal-primary);
    animation: dotPulse 1.2s ease-in-out infinite;
  }

  .loaderDots span:nth-child(2) {
    animation-delay: 0.15s;
  }

  .loaderDots span:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes dotPulse {
    0%, 80%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    40% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* ── Spinning icon (rotate key) ── */

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .spinning {
    animation: spin 0.8s linear infinite;
  }

  /* ── Consistent fonts — remove .mono de CPF e valores ── */
  /* Agora todos os textos usam font-family padrão Nunito */

  .valueText,
  .miniInfo strong,
  .eventCard small span,
  .rootItemSub span {
    font-family: "Nunito", sans-serif;
  }

  /* ── Exclusion family tree layout ── */

  .exclusionFamilyCard {
    border-radius: 24px;
    border: 1px solid rgba(18, 59, 125, 0.08);
    background: #fff;
    overflow: hidden;
    box-shadow: 0 18px 34px rgba(16, 35, 63, 0.05);
  }

  .exclusionTreeRoot {
    position: relative;
    padding-left: 24px;
  }

  .exclusionTreeRoot::before {
    content: "";
    position: absolute;
    left: 10px;
    top: 24px;
    bottom: -6px;
    width: 2px;
    background: rgba(18, 59, 125, 0.12);
  }

  .exclusionTreeRoot::after {
    content: "";
    position: absolute;
    left: 2px;
    top: 18px;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: var(--portal-primary);
    box-shadow: 0 0 0 5px rgba(18, 59, 125, 0.08);
  }

  .exclusionTreeDivider {
    padding: 10px 18px;
    font-size: 0.84rem;
    font-weight: 800;
    color: var(--portal-muted);
    border-top: 1px solid rgba(18, 59, 125, 0.06);
    display: flex;
    align-items: center;
  }

  .exclusionTreeDependents {
    padding: 0 18px 18px;
    display: grid;
    gap: 12px;
    padding-left: 42px;
    position: relative;
  }

  .exclusionTreeDependents::before {
    content: "";
    position: absolute;
    left: 28px;
    top: 0;
    bottom: 12px;
    width: 2px;
    background: rgba(18, 59, 125, 0.1);
  }

  .exclusionTreeDepLine {
    position: relative;
    padding-left: 18px;
  }

  .exclusionTreeDepLine::before {
    content: "";
    position: absolute;
    left: -14px;
    top: 24px;
    width: 16px;
    height: 2px;
    background: rgba(18, 59, 125, 0.1);
  }

  /* ── Exclusion person card (usado dentro da árvore) ── */

  .exclusionPersonCard {
    border-radius: 20px;
    border: 1px solid rgba(18, 59, 125, 0.08);
    background: #fcfdff;
    padding: 16px;
    display: grid;
    gap: 14px;
  }

  .exclusionPersonHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .exclusionPersonLeft {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
  }

  .exclusionPersonName {
    margin: 0;
    color: var(--portal-text);
    font-size: 0.98rem;
    font-weight: 900;
  }

  .exclusionPersonRelation {
    margin: 4px 0 0;
    color: var(--portal-muted);
    font-size: 0.85rem;
  }

  .exclusionPersonGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(140px, 1fr));
    gap: 10px;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, minmax(140px, 1fr));
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .exclusionPersonActions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    border-top: 1px solid rgba(18, 59, 125, 0.06);
    padding-top: 12px;
  }

  /* ── Disabled button state ── */

  .smallBtn:disabled,
  .smallGhostBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  .colorLegend {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    padding: 12px 18px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid var(--portal-border);
    border-radius: 16px;
    margin-bottom: 14px;
    box-shadow: 0 8px 20px rgba(16, 35, 63, 0.04);
  }
 
  .legendTitle {
    font-size: 0.82rem;
    font-weight: 900;
    color: var(--portal-text);
  }
 
  .legendItem {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--portal-muted);
  }
 
  .legendDot {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    flex-shrink: 0;
  }
 
  .legendDotGreen {
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
  }
 
  .legendDotYellow {
    background: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
  }
 
  .legendDotRed {
    background: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }
 
  /* ── PONTO 3 + 7: Cards coloridos na lista lateral ── */
 
  .rootItem.familyGreen {
    border-left: 4px solid #22c55e;
    background: rgba(34, 197, 94, 0.03);
  }
 
  .rootItem.familyYellow {
    border-left: 4px solid #f59e0b;
    background: rgba(245, 158, 11, 0.03);
  }
 
  .rootItem.familyRed {
    border-left: 4px solid #ef4444;
    background: rgba(239, 68, 68, 0.03);
  }
 
  .rootItem.familyGreen.active {
    border-left-color: #16a34a;
    background: rgba(34, 197, 94, 0.08);
  }
 
  .rootItem.familyYellow.active {
    border-left-color: #d97706;
    background: rgba(245, 158, 11, 0.08);
  }
 
  .rootItem.familyRed.active {
    border-left-color: #dc2626;
    background: rgba(239, 68, 68, 0.08);
  }
 
  /* ── PONTO 3: Borda do painel direito baseada na família ── */
 
  .panel.panelBorder_green {
    border-color: rgba(34, 197, 94, 0.3);
    box-shadow: 0 20px 50px rgba(34, 197, 94, 0.08);
  }
 
  .panel.panelBorder_yellow {
    border-color: rgba(245, 158, 11, 0.3);
    box-shadow: 0 20px 50px rgba(245, 158, 11, 0.08);
  }
 
  .panel.panelBorder_red {
    border-color: rgba(239, 68, 68, 0.3);
    box-shadow: 0 20px 50px rgba(239, 68, 68, 0.08);
  }
 
  /* ── PONTO 3: Alerta de pendência no painel ── */
 
  .familyPendingAlert {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 12px;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.2);
    color: var(--portal-warning);
    font-size: 0.82rem;
    font-weight: 800;
    flex-shrink: 0;
  }
 
  /* ── PONTO 6: Exclusão resolvida ── */
 
  .exclusionPersonCard.exclusionResolved {
    background: rgba(34, 197, 94, 0.04);
    border-color: rgba(34, 197, 94, 0.2);
  }
 
  .exclusionIconWrap.exclusionIconResolved {
    background: rgba(239, 68, 68, 0.1);
    color: var(--portal-danger);
  }
 
  /* PONTO 6: Botão vermelho bloqueado */
  .dangerBtnFull {
    min-height: 38px;
    padding: 0 14px;
    font-size: 0.85rem;
    border-radius: 14px;
    border: 1px solid rgba(180, 35, 24, 0.2);
    background: rgba(244, 67, 54, 0.1);
    color: var(--portal-danger);
    font-weight: 800;
    cursor: not-allowed;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    opacity: 0.85;
  }
 
  /* ── PONTO 7: Cards de exclusão coloridos ── */
 
  .exclusionFamilyCard.familyGreen {
    border-left: 4px solid #22c55e;
    background: rgba(34, 197, 94, 0.02);
  }
 
  .exclusionFamilyCard.familyYellow {
    border-left: 4px solid #f59e0b;
    background: rgba(245, 158, 11, 0.02);
  }
 
  .exclusionFamilyCard.familyRed {
    border-left: 4px solid #ef4444;
    background: rgba(239, 68, 68, 0.02);
  }
  @keyframes highlightBlink {
    0% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0); background: transparent; }
    15% { box-shadow: 0 0 0 6px rgba(250, 204, 21, 0.4); background: rgba(250, 204, 21, 0.12); }
    30% { box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.15); background: rgba(250, 204, 21, 0.04); }
    45% { box-shadow: 0 0 0 6px rgba(250, 204, 21, 0.4); background: rgba(250, 204, 21, 0.12); }
    60% { box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.15); background: rgba(250, 204, 21, 0.04); }
    75% { box-shadow: 0 0 0 6px rgba(250, 204, 21, 0.35); background: rgba(250, 204, 21, 0.1); }
    100% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0); background: transparent; }
  }
 
  .highlight-blink {
    animation: highlightBlink 3s ease-out;
    border-radius: 16px;
  }
 
  /* ── Item #8: Family color classes para a lista lateral ── */
 
  .rootItem.familyGreen {
    border-left: 4px solid #22c55e;
  }
 
  .rootItem.familyYellow {
    border-left: 4px solid #f59e0b;
  }
 
  .rootItem.familyRed {
    border-left: 4px solid #ef4444;
  }
 
  /* ── Painel direito: borda colorida conforme status família ── */
 
  .panel.panelBorder_green {
    border-color: rgba(34, 197, 94, 0.3);
  }
 
  .panel.panelBorder_yellow {
    border-color: rgba(245, 158, 11, 0.3);
  }
 
  .panel.panelBorder_red {
    border-color: rgba(239, 68, 68, 0.3);
  }
 
  /* ── Family pending alert ── */
 
  .familyPendingAlert {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 10px;
    background: #FEF3C7;
    color: #92400E;
    font-size: 0.82rem;
    font-weight: 800;
  }
 
  /* ── Color Legend ── */
 
  .colorLegend {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 10px 16px;
    background: rgba(18, 59, 125, 0.03);
    border-radius: 14px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
 
  .legendTitle {
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--portal-muted);
  }
 
  .legendItem {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: var(--portal-text);
    font-weight: 600;
  }
 
  .legendDot {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    display: inline-block;
  }
 
  .legendDotGreen { background: #22c55e; }
  .legendDotYellow { background: #f59e0b; }
  .legendDotRed { background: #ef4444; }
 
  /* ── Exclusion resolved state ── */
 
  .exclusionPersonCard.exclusionResolved {
    opacity: 0.6;
  
  }
 
  /* ── Danger button full width ── */
 
  .dangerBtnFull {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 12px;
    border: 1px solid rgba(185, 28, 28, 0.2);
    background: rgba(185, 28, 28, 0.08);
    color: #b91c1c;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    transition: 0.18s ease;
  }
 
  .dangerBtnFull:hover {
    background: rgba(185, 28, 28, 0.14);
  }
 
  /* ── Exclusion icon wrap ── */
 
  .exclusionIconWrap {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 12px;
    background: rgba(18, 59, 125, 0.08);
    color: var(--portal-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }
 
  /* ── Exclusion card grid ── */
 
  .exclusionCardGrid {
    display: grid;
    gap: 20px;
  }
   .familyCompleteAlert {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 12px;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.22);
    color: var(--portal-success);
    font-size: 0.82rem;
    font-weight: 800;
    flex-shrink: 0;
  }
 
  /* Override familyPendingAlert para suportar lista de razões (multi-linha) */
  .familyPendingAlert {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 10px 14px;
    border-radius: 12px;
    background: #FEF3C7;
    border: 1px solid rgba(245, 158, 11, 0.25);
    color: #92400E;
    font-size: 0.82rem;
    font-weight: 800;
    flex-shrink: 0;
    max-width: 280px;
  }
 
`;