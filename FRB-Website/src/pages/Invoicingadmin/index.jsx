import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { Main } from "./style";
import { AiOutlineCheck, AiOutlineDelete } from "react-icons/ai";
import { UserContext } from "../../contexts/userContext/userContext";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { GrStatusGoodSmall } from "react-icons/gr";
import { IoIosArrowDown, IoIosArrowUp, IoIosAdd, IoMdDownload } from "react-icons/io";
import { FaFolder, FaFolderOpen, FaPaperclip } from "react-icons/fa";
import { RiMailSendLine } from "react-icons/ri";
import FRB from "../../assets/img/logoBranca.webp";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { notifyError, notifySucess } from "../../Toastfy";

export const Invoicingadmin = () => {
  const { user, navigate, spinner } = useContext(UserContext);
  const { createDocument, document, subinvoices, clients, spinnerPost } = useContext(AdminContext);

  // Estado que controla o mês e o ano selecionados
  const [selectedMonth, setSelectedMonth] = useState({
    month: "Jan",
    year: new Date().getFullYear().toString()
  });

  const [showFiles, setShowFiles] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [monthsStatus, setMonthsStatus] = useState([]);
  const [viewMode, setViewMode] = useState("receive");
  const [selectedButton, setSelectedButton] = useState("receive");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRefs = useRef({});

  /**
   * 1) Gera o array de anos permitidos, começando em [2024, 2025].
   *    Se a data de hoje for >= dez/2025, adiciona 2026,
   *    se >= dez/2026, adiciona 2027, etc.
   */
  const generateAllowedYears = () => {
    let baseYears = [2024, 2025];
    let lastYear = 2025;
    const now = new Date(); // data de hoje

    // Enquanto hoje for >= 1 de dezembro do 'lastYear', adicionamos (lastYear + 1)
    while (true) {
      const checkDate = new Date(lastYear, 11, 1); // 11 = dezembro (0-based)
      if (now >= checkDate) {
        lastYear++;
        baseYears.push(lastYear);
      } else {
        break;
      }
    }
    return baseYears;
  };

  // Armazena os anos liberados (2024, 2025, e futuros se estiver em dezembro do anterior)
  const [allowedYears, setAllowedYears] = useState([]);

  useEffect(() => {
    if (!user.perm_faturamento_admin) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    // Calcula os anos permitidos assim que carrega ou caso queira recálculo
    setAllowedYears(generateAllowedYears());
  }, []);

  useEffect(() => {
    const filterDocs = () => {
      const filtered = Array.isArray(document)
        ? document.filter(
            (doc) =>
              doc.month === selectedMonth.month &&
              doc.year === selectedMonth.year &&
              doc.client_id === selectedClient
          )
        : [];
      setFilteredDocuments(filtered);
    };

    filterDocs();
    setUploadedFiles({});
  }, [document, selectedMonth, selectedClient]);

  useEffect(() => {
    const statusForMonths = generateMonths();
    setMonthsStatus(statusForMonths);
  }, [document, uploadedFiles, subinvoices, selectedClient]);

  // Clique para trocar mês
  const handleMonthClick = useCallback((month, year) => {
    setSelectedMonth({ month, year });
  }, []);

  // Troca de ano, mas só se esse ano estiver em allowedYears
  const handleYearChange = useCallback((newYear) => {
    setSelectedMonth((prev) => ({ ...prev, year: newYear }));
  }, []);

  // Gera array de meses e status
  const generateMonths = () => {
    const monthsArray = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    return monthsArray.map((month) => ({
      name: month,
      status: getStatus(month)
    }));
  };

  const getStatus = (month) => {
    if (!document || !selectedClient) return "-";

    const today = new Date();
    const currentMonth = today
      .toLocaleString("default", { month: "short" })
      .toLowerCase()
      .replace(".", "");
    const currentYear = today.getFullYear().toString();
    const selectedMonthLower = month.toLowerCase();

    const docsForMonth = document.filter(
      (doc) =>
        doc.month.toLowerCase() === selectedMonthLower &&
        doc.year === selectedMonth.year &&
        doc.client_id === selectedClient
    );
    const hasCompleted = docsForMonth.some((doc) => doc.status === "completed");
    const hasInProgress = docsForMonth.some((doc) => doc.status === "in_progress");

    if (hasCompleted) return "completed";
    if (hasInProgress) return "in_progress";

    if (
      selectedMonthLower === currentMonth &&
      selectedMonth.year === currentYear
    ) {
      const subinvoicesForClient = subinvoices.filter(
        (sub) => sub.client_id === selectedClient
      );
      if (subinvoicesForClient.length > 0) {
        const missingSubinvoices =
          subinvoicesForClient.length - docsForMonth.length;
        if (missingSubinvoices > 0) {
          return `pending (${missingSubinvoices})`;
        }
      }
    }

    return "-";
  };

  const StatusIcon = ({ status }) => {
    if (status.startsWith("pending")) {
      const count = status.match(/\((\d+)\)/);
      return <span className="status-dot red">{count ? count[1] : ""}</span>;
    }
    switch (status) {
      case "completed":
        return <AiOutlineCheck className="status-dot green" />;
      case "in_progress":
        return (
          <span className="status-dot yellow">
            <GrStatusGoodSmall />
          </span>
        );
      case "-":
        return <span className="status-dot">-</span>;
      default:
        return <GrStatusGoodSmall />;
    }
  };

  const handleFileUpload = (event, subinvoiceId) => {
    if (!getStatus(selectedMonth.month).startsWith("in_progress")) {
      notifyError("Você só pode anexar arquivos de status Em andamento (Amarelo)");
      return;
    }

    const files = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [subinvoiceId]: [...(prevFiles[subinvoiceId] || []), ...files]
    }));
  };

  const handleRemoveFile = (subinvoiceId, fileIndex) => {
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [subinvoiceId]: prevFiles[subinvoiceId].filter((_, index) => index !== fileIndex)
    }));
  };

  const openFileDialog = (subinvoiceId) => {
    if (!getStatus(selectedMonth.month).startsWith("in_progress")) {
      notifyError("Você só pode anexar arquivos de status Em andamento (Amarelo)");
      return;
    }
    fileInputRefs.current[subinvoiceId].click();
  };

  const handleToggleFiles = (subinvoiceId) => {
    setShowFiles((prevShowFiles) => {
      const newShowFiles = prevShowFiles === subinvoiceId ? null : subinvoiceId;
      return newShowFiles;
    });
  };

  const handleSendAllInvoices = async () => {
    if (!getStatus(selectedMonth.month).startsWith("in_progress")) {
      notifyError("Você só pode anexar arquivos de status Em andamento (Amarelo)");
      return;
    }

    const allSubinvoiceIds = Object.keys(uploadedFiles);
    const allFilePromises = [];

    const allSubinvoicesFilled = subinvoices
      .filter((sub) => sub.client_id === selectedClient)
      .every((subinvoice) => uploadedFiles[subinvoice.id]?.length > 0);

    if (!allSubinvoicesFilled) {
      notifyError("Todas as faturas devem ser anexadas antes de enviar.");
      return;
    }

    setIsUploading(true); // Iniciando o spinner
    let isFirstDocument = true;
    allSubinvoiceIds.forEach((subinvoiceId) => {
      const files = uploadedFiles[subinvoiceId];
      files.forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("status", "completed");
        formData.append("user_id", user.id);
        formData.append("client_id", selectedClient);
        formData.append("subinvoice_id", subinvoiceId);
        formData.append("month", selectedMonth.month);
        formData.append("year", selectedMonth.year);
        formData.append("ship", isFirstDocument ? true : false);

        allFilePromises.push(createDocument(formData, "upload"));
        isFirstDocument = false;
      });
    });

    try {
      await Promise.all(allFilePromises);
      notifySucess("Todas as faturas foram enviadas com sucesso!");
      setUploadedFiles({});
    } catch (error) {
      console.error("Erro ao enviar todas as faturas:", error);
      notifyError("Erro ao enviar todas as faturas.");
    } finally {
      setIsUploading(false); // Parando o spinner
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    // Se for "send", baixa as completed; se "receive", baixa as in_progress
    const docs = filteredDocuments.filter(
      (doc) => doc.status === (viewMode === "send" ? "completed" : "in_progress")
    );

    const fetchPromises = docs.map(async (doc) => {
      const response = await fetch(doc.file);
      const blob = await response.blob();
      const fileName = decodeURIComponent(
        new URL(doc.file).pathname.split("/").pop()
      );
      zip.file(fileName, blob);
    });

    await Promise.all(fetchPromises);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${selectedMonth.month}_${selectedMonth.year}_faturas.zip`);
    });
  };

  const getSubinvoiceDocuments = (subinvoiceId) => {
    return (
      filteredDocuments?.filter(
        (doc) =>
          doc.subinvoice_id === subinvoiceId &&
          doc.month === selectedMonth.month &&
          doc.year === selectedMonth.year
      ) || []
    );
  };

  const getSubinvoiceDocumentsInProgress = (subinvoiceId) => {
    return (
      filteredDocuments?.filter(
        (doc) =>
          doc.subinvoice_id === subinvoiceId &&
          doc.month === selectedMonth.month &&
          doc.year === selectedMonth.year &&
          doc.status === "in_progress"
      ) || []
    );
  };

  const getSubinvoiceDocumentsCompleted = (subinvoiceId) => {
    return (
      filteredDocuments?.filter(
        (doc) =>
          doc.subinvoice_id === subinvoiceId &&
          doc.month === selectedMonth.month &&
          doc.year === selectedMonth.year &&
          doc.status === "completed"
      ) || []
    );
  };

  const handleClientChange = (event) => {
    const clientId = event.target.value;
    setSelectedClient(clientId);
  };

  // Precisamos descobrir se o "Botão Ano Anterior" e "Botão Ano Seguinte" devem aparecer
  const currentYearNumber = Number(selectedMonth.year);
  const prevYearNumber = currentYearNumber - 1;
  const nextYearNumber = currentYearNumber + 1;

  // Aparece se 'allowedYears' contiver esse ano anterior
  const showPrevYearButton = allowedYears.includes(prevYearNumber);
  // Aparece se 'allowedYears' contiver esse próximo ano
  const showNextYearButton = allowedYears.includes(nextYearNumber);

  const filteredSubinvoices = subinvoices?.filter(
    (sub) => sub.client_id === selectedClient
  ) || [];
  const hasDocumentsInProgress = filteredDocuments.some(
    (doc) => doc.status === "in_progress"
  );
  const hasDocumentsCompleted = filteredDocuments.some(
    (doc) => doc.status === "completed"
  );

  return (
    <Main>
      <div className="positionHeader">
        <div className="imgLogoPosition">
          <img className="imgLogo" src={FRB} alt="Logo da empresa" />
        </div>
        <div className="positionsButtons">
          <div
            className={`positionIconButton ${
              selectedButton === "receive" ? "selected" : ""
            }`}
            onClick={() => {
              setViewMode("receive");
              setSelectedButton("receive");
            }}
          >
            <IoMdDownload />
            <button>Faturas Recebidas</button>
          </div>
          <div
            className={`positionIconButton ${
              selectedButton === "send" ? "selected" : ""
            }`}
            onClick={() => {
              setViewMode("send");
              setSelectedButton("send");
            }}
          >
            <RiMailSendLine />
            <button>Enviar Faturamento</button>
          </div>
        </div>
      </div>

      <div className="dashboardright">
        {viewMode === "send" ? (
          <div>
            <div className="doc">
              <p className="pDoc">Enviar Faturamento</p>
            </div>
            <div className="positionPending">
              <span className="red">
                <GrStatusGoodSmall />
              </span>
              <p>Pendente </p>
              <span className="yellow">
                <GrStatusGoodSmall />
              </span>
              <p>Em andamento</p>
              <span className="green">
                <GrStatusGoodSmall />
              </span>
              <p>Concluido</p>
            </div>

            {/* Seletor de ANO */}
            <div className="positionMonths">
              <div className="year">

                {/* Botão ANO ANTERIOR: só aparece se showPrevYearButton for true */}
                {showPrevYearButton && (
                  <button onClick={() => handleYearChange(prevYearNumber.toString())}>
                    &lt; Ano Anterior
                  </button>
                )}

                <h3>{selectedMonth.year}</h3>

                {/* Botão ANO SEGUINTE: só aparece se showNextYearButton for true */}
                {showNextYearButton && (
                  <button onClick={() => handleYearChange(nextYearNumber.toString())}>
                    Ano Seguinte &gt;
                  </button>
                )}

                <div className="months">
                  {monthsStatus.map((month) => (
                    <div
                      key={month.name}
                      className={`month ${
                        selectedMonth.month === month.name ? "selected" : ""
                      }`}
                      onClick={() => handleMonthClick(month.name, selectedMonth.year)}
                    >
                      <p>{month.name}</p>
                      <StatusIcon status={month.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Fim do seletor de ANO */}

            <div className="monthSelectContainer">
              <p className="monthSelect">
                {selectedMonth.month} / {selectedMonth.year}
              </p>
              {selectedClient && hasDocumentsCompleted && (
                <button className="buttonDownloadAll" onClick={handleDownloadAll}>
                  Baixar Todos
                </button>
              )}
            </div>
            <div className="clientSelectContainer">
              <label htmlFor="clientSelect">Selecione a Empresa:</label>
              <select id="clientSelect" onChange={handleClientChange}>
                <option value="">Selecione uma empresa</option>
                {clients &&
                  clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name}
                    </option>
                  ))}
              </select>
            </div>
            {spinner || isUploading ? (
              <div className="positionSpinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="positionFature">
                {filteredSubinvoices.map((sub) => (
                  <div key={sub.id} className="subinvoice-container">
                    <div
                      className="subinvoice-header"
                      onClick={() => handleToggleFiles(sub.id)}
                    >
                      <div className="left-content">
                        {showFiles === sub.id ? <FaFolderOpen /> : <FaFolder />}
                        <p className="subinvoice-text">
                          Sub {sub.sub_number} {sub.name} - {sub.sub_unity} - CNPJ{" "}
                          {sub.sub_cnpj} - Apólice {sub.apolice}
                        </p>
                        <FaPaperclip />{" "}
                        {(uploadedFiles[sub.id]?.length || 0) +
                          getSubinvoiceDocumentsCompleted(sub.id).length}
                      </div>
                      {viewMode === "send" && (
                        <div className="right-content">
                          <IoIosAdd />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openFileDialog(sub.id);
                            }}
                          >
                            Adicionar
                          </button>
                          <input
                            id={`fileInput-${sub.id}`}
                            type="file"
                            ref={(el) => (fileInputRefs.current[sub.id] = el)}
                            style={{ display: "none" }}
                            onChange={(event) => handleFileUpload(event, sub.id)}
                            multiple
                          />
                        </div>
                      )}
                    </div>
                    {showFiles === sub.id && (
                      <div className="uploaded-files">
                        <ul>
                          {viewMode === "send" &&
                            uploadedFiles[sub.id]?.map((file, index) => (
                              <li key={index} className="file-item">
                                <span className="file-name">{file.name}</span>
                                <AiOutlineDelete
                                  onClick={() => handleRemoveFile(sub.id, index)}
                                />
                              </li>
                            ))}
                          {getSubinvoiceDocumentsCompleted(sub.id)?.map((doc, index) => (
                            <li key={index} className="file-item">
                              <a
                                href={doc.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="file-link"
                              >
                                {decodeURIComponent(
                                  new URL(doc.file).pathname.split("/").pop()
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
                {viewMode === "send" && (
                  <button className="buttonShip" onClick={handleSendAllInvoices}>
                    {spinnerPost || isUploading ? (
                      <div className="positionSpinner">
                        <div className="spinner"></div>
                      </div>
                    ) : (
                      "Enviar Fatura(s)"
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="doc">
              <p className="pDoc">Faturas Recebidas</p>
            </div>
            <div className="positionPending">
              <span className="red">
                <GrStatusGoodSmall />
              </span>
              <p>Pendente </p>
              <span className="yellow">
                <GrStatusGoodSmall />
              </span>
              <p>Em andamento</p>
              <span className="green">
                <GrStatusGoodSmall />
              </span>
              <p>Concluido</p>
            </div>

            {/* Seletor de ANO */}
            <div className="positionMonths">
              <div className="year">
                {showPrevYearButton && (
                  <button onClick={() => handleYearChange(prevYearNumber.toString())}>
                    &lt; Ano Anterior
                  </button>
                )}

                <h3>{selectedMonth.year}</h3>

                {showNextYearButton && (
                  <button onClick={() => handleYearChange(nextYearNumber.toString())}>
                    Ano Seguinte &gt;
                  </button>
                )}

                <div className="months">
                  {monthsStatus.map((month) => (
                    <div
                      key={month.name}
                      className={`month ${
                        selectedMonth.month === month.name ? "selected" : ""
                      }`}
                      onClick={() => handleMonthClick(month.name, selectedMonth.year)}
                    >
                      <p>{month.name}</p>
                      <StatusIcon status={month.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Fim do seletor de ANO */}

            <div className="monthSelectContainer">
              <p className="monthSelect">
                {selectedMonth.month} / {selectedMonth.year}
              </p>
              {selectedClient && hasDocumentsInProgress && (
                <button className="buttonDownloadAll" onClick={handleDownloadAll}>
                  Baixar Todos
                </button>
              )}
            </div>
            <div className="clientSelectContainer">
              <label htmlFor="clientSelect">Selecione a Empresa:</label>
              <select id="clientSelect" onChange={handleClientChange}>
                <option value="">Selecione uma empresa</option>
                {clients &&
                  clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_name}
                    </option>
                  ))}
              </select>
            </div>
            {spinner ? (
              <div className="positionSpinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="positionFature">
                {filteredSubinvoices.map((sub) => (
                  <div key={sub.id} className="subinvoice-container">
                    <div
                      className="subinvoice-header"
                      onClick={() => handleToggleFiles(sub.id)}
                    >
                      <div className="left-content">
                        {showFiles === sub.id ? <FaFolderOpen /> : <FaFolder />}
                        <p className="subinvoice-text">
                          Sub {sub.sub_number} {sub.name} - {sub.sub_unity} - CNPJ{" "}
                          {sub.sub_cnpj} - Apólice {sub.apolice}
                        </p>
                        <FaPaperclip />{" "}
                        {getSubinvoiceDocumentsInProgress(sub.id).length}
                      </div>
                    </div>
                    {showFiles === sub.id && (
                      <div className="uploaded-files">
                        <ul>
                          {getSubinvoiceDocumentsInProgress(sub.id).map((doc, index) => (
                            <li key={index} className="file-item">
                              <a
                                href={doc.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="file-link"
                              >
                                {decodeURIComponent(
                                  new URL(doc.file).pathname.split("/").pop()
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </Main>
  );
};
