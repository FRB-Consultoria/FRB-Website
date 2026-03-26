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
`;