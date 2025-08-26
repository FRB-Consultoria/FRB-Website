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
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySucess } from "../../Toastfy";

export const Invoicinguser = () => {
  const { user, navigate, spinner } = useContext(UserContext);
  const { createDocument, document, subinvoices, spinnerPost, clients } = useContext(AdminContext);

  const [selectedMonth, setSelectedMonth] = useState({
    month: "Jan",
    year: new Date().getFullYear().toString()
  });

  const [showFiles, setShowFiles] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [monthsStatus, setMonthsStatus] = useState([]);
  const [viewMode, setViewMode] = useState("send");
  const [selectedButton, setSelectedButton] = useState("send");
  const [sendingFiles, setSendingFiles] = useState(false);
  const [clientLogo, setClientLogo] = useState("");
  const [logoLoaded, setLogoLoaded] = useState(false);

  const fileInputRefs = useRef({});
const PT_BR_MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const PT_BR_MONTHS_LOWER = PT_BR_MONTHS.map(m => m.toLowerCase());
  // 1) Gera array de anos: [2024, 2025] e libera o próximo quando data >= 1 de dez do ano anterior
  const generateAllowedYears = () => {
    let baseYears = [2024, 2025];
    let lastYear = 2025;
    const now = new Date();

    while (true) {
      // Verifica se hoje >= 1 de dezembro do lastYear
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

  // 2) Guarda esses anos liberados no estado
  const [allowedYears, setAllowedYears] = useState([]);

  useEffect(() => {
    if (user.user_level !== "invoicinguser") navigate("/");
  }, [user, navigate]);

  // 3) Preenche allowedYears no primeiro render
  useEffect(() => {
    setAllowedYears(generateAllowedYears());
  }, []);

  useEffect(() => {
    const filterDocs = () => {
      const filtered = Array.isArray(document)
        ? document.filter(
            (doc) =>
              doc.month === selectedMonth.month &&
              doc.year === selectedMonth.year &&
              doc.client_id === user.client_id
          )
        : [];
      setFilteredDocuments(filtered);
    };

    filterDocs();
    setUploadedFiles({});
  }, [document, selectedMonth, user.client_id]);

 useEffect(() => {
  const statusForMonths = generateMonths();
  setMonthsStatus(statusForMonths);
}, [document, uploadedFiles, subinvoices, selectedMonth]); 


  useEffect(() => {
    if (clients && user) {
      const client = clients.find((c) => c.id === user.client_id);
      if (client) {
        setClientLogo(client.logo);
      }
    }
  }, [clients, user]);

  const handleMonthClick = useCallback((month, year) => {
    setSelectedMonth({ month, year });
  }, []);

  // Troca de ano, mas só se esse ano estiver em allowedYears
  const handleYearChange = useCallback((newYear) => {
    setSelectedMonth((prev) => ({ ...prev, year: newYear }));
  }, []);

 const generateMonths = () => {
  return PT_BR_MONTHS.map((month) => ({
    name: month,
    status: getStatus(month),
  }));
};

  const getStatus = (month) => {
   if (!Array.isArray(document)) return "-";


    const today = new Date();
    const currentMonthLower = PT_BR_MONTHS_LOWER[today.getMonth()]; // mês atual 0..11
    const currentYear = String(today.getFullYear());
    const selectedMonthLower = month.toLowerCase();

    const docsForMonth = document.filter(
      (doc) =>
        doc.month.toLowerCase() === selectedMonthLower &&
        doc.year === selectedMonth.year &&
        doc.client_id === user.client_id
    );
    const hasCompleted = docsForMonth.some((doc) => doc.status === "completed");
    const hasInProgress = docsForMonth.some(
      (doc) => doc.status === "in_progress"
    );

    if (hasCompleted) return "completed";
    if (hasInProgress) return "in_progress";

     if (selectedMonthLower === currentMonthLower && selectedMonth.year === currentYear) {
    const subinvoicesForClient = subinvoices.filter((sub) => sub.client_id === user.client_id);
    const uploadedForMonth = subinvoicesForClient.filter((sub) => uploadedFiles[sub.id]?.length > 0);
    const missingSubinvoices = subinvoicesForClient.length - uploadedForMonth.length;

      if (missingSubinvoices > 0) {
        return `pending (${missingSubinvoices})`;
      }
      return "pending";
    }

    return "-";
  };

  const StatusIcon = ({ status }) => {
    if (typeof status === "string" && status.startsWith("pending")) {
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
    if (!getStatus(selectedMonth.month).startsWith("pending")) {
      notifyError("Você só pode anexar arquivos de status Pendente (Vermelho)");
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
      [subinvoiceId]: prevFiles[subinvoiceId].filter(
        (_, index) => index !== fileIndex
      )
    }));
  };

  const openFileDialog = (subinvoiceId) => {
    if (!getStatus(selectedMonth.month).startsWith("pending")) {
      notifyError("Você só pode anexar arquivos de status Pendente (Vermelho)");
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
    if (!getStatus(selectedMonth.month).startsWith("pending")) {
      notifyError("Você só pode anexar arquivos de status Pendente (Vermelho)");
      return;
    }

    setSendingFiles(true);

    const allSubinvoiceIds = Object.keys(uploadedFiles);
    const allFilePromises = [];

    const allSubinvoicesFilled = subinvoices
      .filter((sub) => sub.client_id === user.client_id)
      .every((subinvoice) => uploadedFiles[subinvoice.id]?.length > 0);

    if (!allSubinvoicesFilled) {
      notifyError("Todas as faturas devem ser anexadas antes de enviar.");
      setSendingFiles(false);
      return;
    }

    let isFirstDocument = true;

    allSubinvoiceIds.forEach((subinvoiceId) => {
      const files = uploadedFiles[subinvoiceId];
      files.forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("status", "in_progress");
        formData.append("user_id", user.id);
        formData.append("client_id", user.client_id);
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
      setSendingFiles(false);
    }
  };

  const handleDownloadAllSend = async () => {
    const zip = new JSZip();

    const inProgressDocs = filteredDocuments.filter(
      (doc) =>
        doc.status === "in_progress" &&
        doc.client_id === user.client_id &&
        doc.month === selectedMonth.month &&
        doc.year === selectedMonth.year
    );

    const fetchPromises = inProgressDocs.map(async (doc) => {
      const response = await fetch(doc.file);
      const blob = await response.blob();
      const fileName = decodeURIComponent(
        new URL(doc.file).pathname.split("/").pop()
      );
      zip.file(fileName, blob);
    });

    await Promise.all(fetchPromises);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(
        content,
        `${selectedMonth.month}_${selectedMonth.year}_faturas_anexadas.zip`
      );
    });
  };

  const handleDownloadAllReceive = async () => {
    const zip = new JSZip();
    const docs = filteredDocuments.filter(
      (doc) => doc.status === "completed" && doc.client_id === user.client_id
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

  const filteredSubinvoices = subinvoices?.filter(
    (sub) => sub.client_id === user.client_id
  ) || [];
  const hasDocumentsInProgress = filteredDocuments.some(
    (doc) => doc.status === "in_progress"
  );
  const hasDocumentsCompleted = filteredDocuments.some(
    (doc) => doc.status === "completed"
  );

  // Lógica dos botões de ano:
  const currentYearNumber = Number(selectedMonth.year);
  const prevYearNumber = currentYearNumber - 1;
  const nextYearNumber = currentYearNumber + 1;

  // Aparece se 'allowedYears' tiver esse ano
  const showPrevYearButton = allowedYears.includes(prevYearNumber);
  const showNextYearButton = allowedYears.includes(nextYearNumber);

  return (
    <Main>
      <div className="positionHeader">
        <div className="imgLogoPosition">
          <img
            className="imgLogo"
            src={FRB}
            alt="Logo da empresa"
            onLoad={() => setLogoLoaded(true)}
          />
        </div>
        <div className="positionsButtons">
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
        </div>
      </div>

      {viewMode === "send" ? (
        <div className="dashboardright">
          <div className="doc">
            <p className="pDoc">Enviar Faturamento</p>
            {clientLogo && (
              <img className="client-logo" src={clientLogo} alt="Logo da empresa" />
            )}
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

          {/* Seletor de Ano e Mes */}
          <div className="positionMonths">
            <div className="year">
              {/* Botão Ano Anterior */}
              {showPrevYearButton && (
                <button
                  onClick={() => handleYearChange(prevYearNumber.toString())}
                >
                  &lt; Ano Anterior
                </button>
              )}

              <h3>{selectedMonth.year}</h3>

              {/* Botão Ano Seguinte */}
              {showNextYearButton && (
                <button
                  onClick={() => handleYearChange(nextYearNumber.toString())}
                >
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
          {/* Fim Seletor de Ano e Mes */}

          <div className="monthSelectContainer">
            <p className="monthSelect">
              {selectedMonth.month} / {selectedMonth.year}
            </p>
            {hasDocumentsInProgress && (
              <button className="buttonDownloadAll" onClick={handleDownloadAllSend}>
                Baixar Todos
              </button>
            )}
          </div>
          {spinner || sendingFiles || !logoLoaded ? (
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
                        getSubinvoiceDocumentsInProgress(sub.id).length}
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
                        {getSubinvoiceDocumentsInProgress(sub.id)?.map(
                          (doc, index) => (
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
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              {viewMode === "send" && (
                <button className="buttonShip" onClick={handleSendAllInvoices}>
                  {spinnerPost ? (
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
        <div className="dashboardright">
          <div className="doc">
            <p className="pDoc">Faturas Recebidas</p>
            {clientLogo && (
              <img className="client-logo" src={clientLogo} alt="Logo da empresa" />
            )}
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

          {/* Seletor de Ano e Mes */}
          <div className="positionMonths">
            <div className="year">
              {/* Botão Ano Anterior */}
              {showPrevYearButton && (
                <button
                  onClick={() => handleYearChange(prevYearNumber.toString())}
                >
                  &lt; Ano Anterior
                </button>
              )}

              <h3>{selectedMonth.year}</h3>

              {/* Botão Ano Seguinte */}
              {showNextYearButton && (
                <button
                  onClick={() => handleYearChange(nextYearNumber.toString())}
                >
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
          {/* Fim Seletor de Ano e Mes */}

          <div className="monthSelectContainer">
            <p className="monthSelect">
              {selectedMonth.month} / {selectedMonth.year}
            </p>
            {hasDocumentsCompleted && (
              <button className="buttonDownloadAll" onClick={handleDownloadAllReceive}>
                Baixar Todos
              </button>
            )}
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
                        {sub.sub_cnpj} - Apólice {sub.apolice}{" "}
                      </p>
                      <FaPaperclip /> {getSubinvoiceDocumentsCompleted(sub.id).length}
                    </div>
                  </div>
                  {showFiles === sub.id && (
                    <div className="uploaded-files">
                      <ul>
                        {getSubinvoiceDocumentsCompleted(sub.id).map(
                          (doc, index) => (
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
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </Main>
  );
};
