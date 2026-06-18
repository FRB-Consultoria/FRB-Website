// src/pages/BillingOrganization/utils/computeAnalytics.js
// Computa todas as analytics descritivas e preditivas a partir dos vidasRows.
// Resultado é armazenado no BillingSnapshot e usado pelo BillingDashboard.

/** Parseia "DD/MM/YYYY" → Date */
const parseBR = (str) => {
  if (!str) return null;
  const s = String(str).trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  return null;
};

/** Anos entre duas datas */
const yearsDiff = (d, now = new Date()) =>
  (now - d) / (365.25 * 24 * 3600 * 1000);

/** Faixa etária */
const ageRange = (age) => {
  if (age < 25)  return "<25";
  if (age < 35)  return "25-34";
  if (age < 45)  return "35-44";
  if (age < 55)  return "45-54";
  return "55+";
};

const AGE_ORDER = ["<25", "25-34", "35-44", "45-54", "55+"];

/** Normaliza parentesco para TIT/CONJ/FILH */
const normParent = (p) => {
  const u = String(p ?? "").trim().toUpperCase();
  if (u === "TIT") return "TIT";
  if (u === "CONJ") return "CONJ";
  if (u === "FILH" || u === "DEP") return "FILH";
  return "FILH"; // default dependente
};

// ──────────────────────────────────────────────────────────────────

export function computeAnalytics(vidasRows, totalValue = 0) {
  if (!vidasRows?.length) return null;

  const now   = new Date();
  const thisY = now.getFullYear();

  // ── Separa titulares ────────────────────────────────────────────
  const titulares = vidasRows.filter(r => normParent(r.parentesco) === "TIT");
  const totalTitulares    = titulares.length;
  const totalBeneficiarios = vidasRows.length;

  // ── 1. Pirâmide etária ─────────────────────────────────────────
  const pyramid = {};
  AGE_ORDER.forEach(r => { pyramid[r] = { male: 0, female: 0 }; });

  let sumAge = 0, ageCount = 0;

  titulares.forEach(row => {
    const bd = parseBR(row.dataNascimento);
    if (!bd) return;
    const age = Math.floor(yearsDiff(bd, now));
    if (age < 0 || age > 120) return;
    sumAge += age; ageCount++;
    const rng = ageRange(age);
    const sex = row.sexo === "MAS" ? "male" : "female";
    pyramid[rng][sex]++;
  });

  const avgAge = ageCount > 0 ? +(sumAge / ageCount).toFixed(1) : null;

  // Para o gráfico: male negativo (vai à esquerda), female positivo (vai à direita)
  const agePyramid = [...AGE_ORDER].reverse().map(range => ({
    range,
    male:       -(pyramid[range].male),
    female:      pyramid[range].female,
    totalMale:   pyramid[range].male,
    totalFemale: pyramid[range].female,
    total:       pyramid[range].male + pyramid[range].female,
  }));

  // ── Helper: normalização de label de CC ────────────────────────
  // Problema: na Base CC, alguns titulares têm centroCusto="" e codigoCC="XXXXXXXXXX".
  // Outros titulares do MESMO CC têm centroCusto="NOME DO CC" + o mesmo código.
  // Sem normalização, os dois grupos ficam como entradas separadas.
  //
  // codeToName: mapa código → primeiro nome encontrado para aquele código.
  // resolveCC:  dada uma linha, retorna sempre o nome textual; se não tiver nome,
  //             resolve o código via codeToName; só usa o código como último recurso.
  const codeToName = {};
  vidasRows.forEach(row => {
    const cc  = (row.centroCusto || "").trim();
    const cod = (row.codigoCC    || "").trim();
    if (cod && cc && !codeToName[cod]) codeToName[cod] = cc;
  });

  const resolveCC = (centroCusto, codigoCC) => {
    const cc  = (centroCusto || "").trim();
    const cod = (codigoCC    || "").trim();
    if (cc)  return cc;
    if (cod) return codeToName[cod] || cod;
    return null;
  };

  // ── 2. Custo por CC ────────────────────────────────────────────
  // Apenas TITULARES possuem CC — dependentes ficam com CC em branco e
  // não devem aparecer no gráfico (distorceriam o total com "Sem CC").
  const ccMap = {};
  vidasRows.forEach(row => {
    const label = resolveCC(row.centroCusto, row.codigoCC);
    if (!label) return;               // pula linhas sem CC (dependentes)
    const cod = (row.codigoCC || "").trim();
    if (!ccMap[label]) ccMap[label] = { name: label, codigoCC: cod, total: 0, titulares: 0, vidas: 0 };
    ccMap[label].total  += (row.valor || 0);
    ccMap[label].vidas  += 1;
    if (normParent(row.parentesco) === "TIT") ccMap[label].titulares++;
  });

  const costByCC = Object.values(ccMap)
    .map(cc => ({
      name:       cc.name,
      codigoCC:   cc.codigoCC,
      total:      +cc.total.toFixed(2),
      titulares:  cc.titulares,
      vidas:      cc.vidas,
      avgPerLife: cc.vidas > 0 ? +(cc.total / cc.vidas).toFixed(2) : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 20);

  // ── 3. Composição familiar por CC ──────────────────────────────
  // Só titulares têm CC — filtramos dependentes sem CC.
  const famMap = {};
  vidasRows.forEach(row => {
    const label = resolveCC(row.centroCusto, row.codigoCC);
    if (!label) return;               // pula dependentes sem CC
    if (!famMap[label]) famMap[label] = { cc: label, TIT: 0, CONJ: 0, FILH: 0 };
    famMap[label][normParent(row.parentesco)]++;
  });

  const familyComp = Object.values(famMap)
    .map(c => {
      const total = c.TIT + c.CONJ + c.FILH;
      return {
        cc:          c.cc,
        titular:     c.TIT,
        conjuge:     c.CONJ,
        filho:       c.FILH,
        total,
        pctTitular:  total > 0 ? +(c.TIT  / total * 100).toFixed(1) : 0,
        pctConjuge:  total > 0 ? +(c.CONJ / total * 100).toFixed(1) : 0,
        pctFilho:    total > 0 ? +(c.FILH / total * 100).toFixed(1) : 0,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

  // Totais globais de composição
  const compTotal = { TIT: 0, CONJ: 0, FILH: 0 };
  vidasRows.forEach(r => { compTotal[normParent(r.parentesco)]++; });
  const compositionTotal = {
    titular: compTotal.TIT,
    conjuge: compTotal.CONJ,
    filho:   compTotal.FILH,
    pctTitular: +( compTotal.TIT  / totalBeneficiarios * 100).toFixed(1),
    pctConjuge: +( compTotal.CONJ / totalBeneficiarios * 100).toFixed(1),
    pctFilho:   +( compTotal.FILH / totalBeneficiarios * 100).toFixed(1),
  };

  // ── 4. Desligados ainda ativos ─────────────────────────────────
  const dismissedRows = vidasRows.filter(r => {
    const cc  = (r.centroCusto || "").toUpperCase();
    const cod = (r.codigoCC    || "").toUpperCase();
    return cc.includes("DESLIGADO") || cod.includes("DESLIGADO");
  });
  const dismissedCost = dismissedRows.reduce((s, r) => s + (r.valor || 0), 0);
  const dismissed = {
    count: dismissedRows.length,
    cost:  +dismissedCost.toFixed(2),
    pct:   totalValue > 0 ? +(dismissedCost / totalValue * 100).toFixed(1) : 0,
  };

  // ── 5. Curva de crescimento ────────────────────────────────────
  const growthMap = {};
  titulares.forEach(row => {
    const d = parseBR(row.dataInicio);
    if (!d) return;
    const yr = d.getFullYear();
    if (yr < 1990 || yr > thisY) return;
    growthMap[yr] = (growthMap[yr] || 0) + 1;
  });

  let cumulative = 0;
  const growthByYear = Object.keys(growthMap).map(Number).sort()
    .map(yr => {
      cumulative += growthMap[yr];
      return { year: String(yr), count: growthMap[yr], cumulative };
    });

  // ── 7. Tempo de permanência (cohort) ──────────────────────────
  const TENURE = [
    { group: "< 1 ano",   min: 0,   max: 1   },
    { group: "1–3 anos",  min: 1,   max: 3   },
    { group: "3–5 anos",  min: 3,   max: 5   },
    { group: "5–10 anos", min: 5,   max: 10  },
    { group: "10+ anos",  min: 10,  max: 9999 },
  ].map(g => ({ ...g, count: 0 }));

  titulares.forEach(row => {
    const d = parseBR(row.dataInicio);
    if (!d) return;
    const yrs = yearsDiff(d, now);
    const g   = TENURE.find(t => yrs >= t.min && yrs < t.max);
    if (g) g.count++;
  });

  const tenureTotal = TENURE.reduce((s, g) => s + g.count, 0);
  const tenureGroups = TENURE.map(g => ({
    group: g.group,
    count: g.count,
    pct:   tenureTotal > 0 ? +(g.count / tenureTotal * 100).toFixed(1) : 0,
  }));

  // ── 6. Risco de envelhecimento ─────────────────────────────────
  const c4554 = pyramid["45-54"].male + pyramid["45-54"].female;
  const c3544 = pyramid["35-44"].male + pyramid["35-44"].female;
  const c55p  = pyramid["55+"].male   + pyramid["55+"].female;
  const agingRisk = {
    current45to54:     c4554,
    willBe45to54in10y: c3544,
    current55plus:     c55p,
    avgAge,
    projectionPct: c4554 > 0
      ? +(( c3544 / c4554 - 1) * 100).toFixed(1)
      : 0,
    riskChart: [
      { label: "45-54 hoje",             value: c4554,  fill: "#f97316" },
      { label: "35-44 hoje (45-54 em 10a)", value: c3544, fill: "#fb923c" },
      { label: "55+ hoje",               value: c55p,  fill: "#ef4444" },
    ],
  };

  // ── 8. Distribuição por plano (simulador) ──────────────────────
  const planMap = {};
  vidasRows.forEach(row => {
    const plan = (row.plano || "SEM PLANO").trim().toUpperCase();
    if (!planMap[plan]) planMap[plan] = { count: 0, totalCost: 0 };
    planMap[plan].count++;
    planMap[plan].totalCost += (row.valor || 0);
  });

  const planDist = {};
  Object.entries(planMap).forEach(([plan, d]) => {
    planDist[plan] = {
      count:     d.count,
      totalCost: +d.totalCost.toFixed(2),
      avgCost:   d.count > 0 ? +(d.totalCost / d.count).toFixed(4) : 0,
    };
  });

  // ── Avg dependentes por titular ─────────────────────────────────
  const avgDependents = totalTitulares > 0
    ? +( (totalBeneficiarios - totalTitulares) / totalTitulares).toFixed(2)
    : 0;

  // ── 9. Razão de dependentes por CC ─────────────────────────────
  // Monta mapa certif → label-normalizado a partir dos titulares (só eles têm CC).
  // Isso permite associar os dependentes ao CC do seu titular com o nome correto.
  const certifToCC = {};
  vidasRows.forEach(row => {
    const label = resolveCC(row.centroCusto, row.codigoCC);
    if (label) certifToCC[row.certGrupo] = label;
  });

  const depRatioMap = {};
  vidasRows.forEach(row => {
    const cc = resolveCC(row.centroCusto, row.codigoCC) || certifToCC[row.certGrupo] || null;
    if (!cc) return;
    if (!depRatioMap[cc]) depRatioMap[cc] = { cc, titulares: 0, conjuges: 0, filhos: 0 };
    const p = normParent(row.parentesco);
    if (p === "TIT")  depRatioMap[cc].titulares++;
    if (p === "CONJ") depRatioMap[cc].conjuges++;
    if (p === "FILH") depRatioMap[cc].filhos++;
  });

  const depRatioByCC = Object.values(depRatioMap)
    .map(d => ({
      cc:          d.cc,
      titulares:   d.titulares,
      conjuges:    d.conjuges,
      filhos:      d.filhos,
      dependentes: d.conjuges + d.filhos,
      totalVidas:  d.titulares + d.conjuges + d.filhos,
      ratio:       d.titulares > 0 ? +((d.conjuges + d.filhos) / d.titulares).toFixed(2) : 0,
    }))
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 15);

  // ── 10. Movimentação por CC (IM/IR vs CM/CR) ────────────────────
  // Usa o mesmo resolveCC para garantir que código e nome do mesmo CC se agrupem.
  const movCCMap = {};
  vidasRows.forEach(row => {
    const cc = resolveCC(row.centroCusto, row.codigoCC) || certifToCC[row.certGrupo] || null;
    if (!cc) return;
    const mov = (row.tipoLancamento || "").toUpperCase();
    if (!["IM", "IR", "CM", "CR"].includes(mov)) return;
    if (!movCCMap[cc]) movCCMap[cc] = { cc, inclusoes: 0, cancelamentos: 0 };
    if (mov === "IM" || mov === "IR") movCCMap[cc].inclusoes++;
    if (mov === "CM" || mov === "CR") movCCMap[cc].cancelamentos++;
  });

  const movByCC = Object.values(movCCMap)
    .map(m => ({
      cc:            m.cc,
      inclusoes:     m.inclusoes,
      cancelamentos: m.cancelamentos,
      total:         m.inclusoes + m.cancelamentos,
      saldo:         m.inclusoes - m.cancelamentos, // positivo = crescendo, negativo = perdendo vidas
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

  return {
    agePyramid,
    costByCC,
    familyComp,
    compositionTotal,
    dismissed,
    growthByYear,
    tenureGroups,
    agingRisk,
    planDist,
    avgAge,
    avgDependents,
    totalTitulares,
    totalBeneficiarios,
    depRatioByCC,
    movByCC,
  };
}
