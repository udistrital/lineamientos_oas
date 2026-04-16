const svg = document.getElementById("diagramSvg");
const viewport = document.getElementById("viewport");
const bgFxLayer = document.getElementById("bgFxLayer");
const teamsLayer = document.getElementById("teamsLayer");
const linksLayer = document.getElementById("linksLayer");
const frontNodesLayer = document.getElementById("frontNodesLayer");
const canvasWrapper = document.getElementById("canvasWrapper");
const toast = document.getElementById("toast");
const zoomLabel = document.getElementById("zoomLabel");
const logoInput = document.getElementById("logoInput");
const stateFileInput = document.getElementById("stateFileInput");
const inlineEditor = document.getElementById("inlineEditor");
const nodeContextMenu = document.getElementById("nodeContextMenu");
const menuEditNode = document.getElementById("menuEditNode");
const menuIncreaseFont = document.getElementById("menuIncreaseFont");
const menuReduceFont = document.getElementById("menuReduceFont");
const menuColorNode = document.getElementById("menuColorNode");
const menuColorPalette = document.getElementById("menuColorPalette");

const state = {
  nodes: [],
  links: [],
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  manualConnect: false,
  connectFromId: null,
  selectedNodeId: null,
  selectedLinkId: null,
  draggingNodeId: null,
  draggingLink: null,
  resizingNode: null,
  draggingCanvas: false,
  dragPointerStart: { x: 0, y: 0 },
  dragNodeStart: { x: 0, y: 0 },
  dragOffset: { x: 0, y: 0 },
  cursorWorld: { x: 1200, y: 700 },
  logoUrl: null,
  renderQueued: false,
  linksRenderQueued: false,
  persistTimer: null,
  contextMenuNodeId: null,
  colorTargetNodeId: null,
  historyPast: [],
  historyFuture: [],
  lastHistoryKey: "",
  isRestoringHistory: false,
  clipboard: null
};

let idSeed = 1;
const createId = (prefix) => `${prefix}-${idSeed++}`;

const NODE_SIZE = {
  team: { w: 360, h: 220 },
  person: { w: 210, h: 56 },
  function: { w: 190, h: 44 },
  comment: { w: 240, h: 110 },
  logo: { w: 180, h: 180 }
};
const MIN_NODE_SIZE = {
  team: { w: 120, h: 80 },
  person: { w: 80, h: 28 },
  function: { w: 72, h: 24 },
  comment: { w: 100, h: 50 },
  logo: { w: 90, h: 90 }
};
const PERSON_COLORS = ["#65d80f", "#ff4db8", "#ff3b30", "#22d3ee", "#f59e0b", "#a78bfa", "#10b981", "#f97316"];
const FUNCTION_COLORS = ["#39b9ff", "#34d399", "#a78bfa", "#f97316", "#60a5fa", "#22d3ee"];
const STORAGE_KEY = "oati_organigrama_state_v1";
const DEFAULT_PROJECT_FILENAME = "project-state.json";
const HISTORY_LIMIT = 80;

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1800);
}

function applyViewportTransform() {
  viewport.setAttribute("transform", `translate(${state.offsetX},${state.offsetY}) scale(${state.scale})`);
  zoomLabel.textContent = `${Math.round(state.scale * 100)}%`;
}

function setInteracting(active) {
  svg.classList.toggle("interacting", active);
}

function schedulePersist() {
  if (state.persistTimer) {
    window.clearTimeout(state.persistTimer);
  }
  state.persistTimer = window.setTimeout(() => {
    state.persistTimer = null;
    saveState();
  }, 220);
}

function closeInlineEditor(applyChange = false) {
  if (!inlineEditor || !inlineEditor.dataset.nodeId) return;
  const nodeId = inlineEditor.dataset.nodeId;
  const node = state.nodes.find((item) => item.id === nodeId);
  if (applyChange && node) {
    const nextValue = inlineEditor.value.trim();
    if (nextValue) {
      node.label = nextValue;
      render();
      schedulePersist();
    }
  }
  inlineEditor.dataset.nodeId = "";
  inlineEditor.classList.add("hidden");
}

function openInlineEditor(node, event) {
  if (!inlineEditor) return;
  inlineEditor.dataset.nodeId = node.id;
  inlineEditor.value = node.label || "";
  const rect = canvasWrapper.getBoundingClientRect();
  const x = Math.max(8, Math.min(rect.width - 350, event.clientX - rect.left + 8));
  const y = Math.max(8, Math.min(rect.height - 42, event.clientY - rect.top - 6));
  inlineEditor.style.left = `${x}px`;
  inlineEditor.style.top = `${y}px`;
  inlineEditor.classList.remove("hidden");
  inlineEditor.focus();
  inlineEditor.select();
}

function hideContextMenu() {
  state.contextMenuNodeId = null;
  nodeContextMenu.classList.add("hidden");
}

function showContextMenu(node, event) {
  const rect = canvasWrapper.getBoundingClientRect();
  const x = Math.max(8, Math.min(rect.width - 180, event.clientX - rect.left + 4));
  const y = Math.max(8, Math.min(rect.height - 90, event.clientY - rect.top + 4));
  nodeContextMenu.style.left = `${x}px`;
  nodeContextMenu.style.top = `${y}px`;
  state.contextMenuNodeId = node.id;
  nodeContextMenu.classList.remove("hidden");
}

function collectNodeCascadeIds(rootId) {
  const ids = new Set([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    state.nodes.forEach((node) => {
      if (node.parentId && ids.has(node.parentId) && !ids.has(node.id)) {
        ids.add(node.id);
        changed = true;
      }
    });
  }
  return ids;
}

function deleteSelectedNode() {
  if (!state.selectedNodeId) return false;
  const selected = state.nodes.find((node) => node.id === state.selectedNodeId);
  if (!selected) return false;
  if (selected.type === "logo") {
    showToast("El logo central no se elimina.");
    return false;
  }

  const idsToDelete = collectNodeCascadeIds(selected.id);
  const prevNodeCount = state.nodes.length;
  state.nodes = state.nodes.filter((node) => !idsToDelete.has(node.id));
  state.links = state.links.filter((link) => !idsToDelete.has(link.from) && !idsToDelete.has(link.to));
  state.selectedLinkId = null;
  state.selectedNodeId = null;

  if (state.nodes.length !== prevNodeCount) {
    render();
    schedulePersist();
    showToast("Elemento eliminado");
    return true;
  }
  return false;
}

function toWorldPoint(clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const inverse = viewport.getScreenCTM().inverse();
  return pt.matrixTransform(inverse);
}

function toSvgPoint(clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const inverse = svg.getScreenCTM().inverse();
  return pt.matrixTransform(inverse);
}

function updateCursorWorldFromEvent(event) {
  state.cursorWorld = toWorldPoint(event.clientX, event.clientY);
}

function nodeCenter(node) {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
}

function nodeBorderAnchor(node, towards) {
  const center = nodeCenter(node);
  const dx = towards.x - center.x;
  const dy = towards.y - center.y;
  if (dx === 0 && dy === 0) return center;

  if (node.type === "logo") {
    const radius = node.w / 2;
    const len = Math.hypot(dx, dy) || 1;
    return {
      x: center.x + (dx / len) * radius,
      y: center.y + (dy / len) * radius
    };
  }

  const halfW = node.w / 2;
  const halfH = node.h / 2;
  const sx = Math.abs(dx) / halfW;
  const sy = Math.abs(dy) / halfH;
  const scale = 1 / Math.max(sx || 0.0001, sy || 0.0001);
  return {
    x: center.x + dx * scale,
    y: center.y + dy * scale
  };
}

function linkGeometry(link) {
  const from = state.nodes.find((n) => n.id === link.from);
  const to = state.nodes.find((n) => n.id === link.to);
  if (!from || !to) return null;

  const roughTo = nodeCenter(to);
  const a = nodeBorderAnchor(from, roughTo);
  const b = nodeBorderAnchor(to, a);
  const controlX = (a.x + b.x) / 2 + (link.controlDx || 0);
  const controlY1 = a.y + (link.controlDy || 0);
  const controlY2 = b.y + (link.controlDy || 0);
  return { a, b, controlX, controlY1, controlY2 };
}

function linkStrokeColor(link) {
  const from = state.nodes.find((n) => n.id === link.from);
  const to = state.nodes.find((n) => n.id === link.to);
  if (!from || !to) return "#0b63ff";
  return from.type === "team" || to.type === "team" ? "#111111" : "#0b63ff";
}

function scaledFontSize(node, base, min, max) {
  const native = NODE_SIZE[node.type] || { w: node.w, h: node.h };
  const ratio = Math.min(node.w / native.w, node.h / native.h);
  const scaled = Math.round(base * ratio);
  return Math.max(min, Math.min(max, scaled));
}

function readableFontSize(node, base, min, max, padding = 14) {
  const scaled = scaledFontSize(node, base, min, max);
  const fontScale = Number(node.fontScale) || 1;
  const boosted = scaled * fontScale;
  // Permite que "Agrandar fuente" sea visible sin romper limites razonables.
  return Math.max(min, Math.min(max * 3, Math.round(boosted)));
}

function wrapTextLines(rawText, maxCharsPerLine, maxLines) {
  const text = (rawText || "").trim();
  if (!text) return [""];
  const safeMaxChars = Math.max(2, maxCharsPerLine);
  const safeMaxLines = Math.max(1, maxLines);

  const normalized = text.replace(/\r/g, "");
  const paragraphs = normalized.split("\n").map((p) => p.trim()).filter((p) => p.length > 0);
  const source = paragraphs.length ? paragraphs : [normalized];
  const output = [];

  const pushTokenWithWrap = (token) => {
    if (output.length === 0) output.push("");
    if (token.length > safeMaxChars) {
      for (let i = 0; i < token.length; i += safeMaxChars) {
        const chunk = token.slice(i, i + safeMaxChars);
        if (!output[output.length - 1]) {
          output[output.length - 1] = chunk;
        } else {
          output.push(chunk);
        }
      }
      return;
    }

    const current = output[output.length - 1];
    const candidate = current ? `${current} ${token}` : token;
    if (candidate.length <= safeMaxChars || !current) {
      output[output.length - 1] = candidate;
    } else {
      output.push(token);
    }
  };

  source.forEach((paragraph, idx) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    words.forEach(pushTokenWithWrap);
    if (idx < source.length - 1) {
      output.push("");
    }
  });

  const compact = output.filter((line) => line.length > 0);
  if (compact.length <= safeMaxLines) return compact;
  const trimmed = compact.slice(0, safeMaxLines);
  const last = trimmed[trimmed.length - 1];
  const base = last.slice(0, Math.max(1, safeMaxChars - 1));
  trimmed[trimmed.length - 1] = `${base}...`;
  return trimmed;
}

function canConnect(fromNode, toNode) {
  if (!fromNode || !toNode || fromNode.id === toNode.id) return false;
  if (fromNode.type === "person" && toNode.type === "person") return false;
  return true;
}

function createLink(from, to) {
  return {
    id: createId("link"),
    from,
    to,
    controlDx: 0,
    controlDy: 0
  };
}

function sanitizeLoadedLink(raw) {
  return {
    id: raw.id || createId("link"),
    from: raw.from,
    to: raw.to,
    controlDx: Number(raw.controlDx) || 0,
    controlDy: Number(raw.controlDy) || 0
  };
}

function saveState() {
  try {
    const payload = serializeState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    recordHistorySnapshot(payload);
  } catch (error) {
    console.error("No se pudo guardar el estado:", error);
  }
}

function serializeState() {
  return {
    version: 1,
    idSeed,
    scale: state.scale,
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    logoUrl: state.logoUrl || null,
    nodes: state.nodes,
    links: state.links
  };
}

function snapshotKey(payload) {
  return JSON.stringify(payload);
}

function recordHistorySnapshot(payload = serializeState()) {
  if (state.isRestoringHistory) return;
  const key = snapshotKey(payload);
  if (key === state.lastHistoryKey) return;
  state.historyPast.push(payload);
  if (state.historyPast.length > HISTORY_LIMIT) {
    state.historyPast.shift();
  }
  state.historyFuture = [];
  state.lastHistoryKey = key;
}

function applyImportedState(parsed) {
  if (!parsed || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.links)) return false;
  state.nodes = parsed.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      x: Number(node.x) || 0,
      y: Number(node.y) || 0,
      w: Number(node.w) || (NODE_SIZE[node.type]?.w || 160),
      h: Number(node.h) || (NODE_SIZE[node.type]?.h || 80),
      label: node.label || "",
      parentId: node.parentId || null,
      fill: node.fill || null,
      stroke: node.stroke || null,
      textColor: node.textColor || null,
      accent: node.accent || null,
      fontScale: Number(node.fontScale) || 1
  }));
  state.links = parsed.links.map(sanitizeLoadedLink);
  state.scale = Number(parsed.scale) || 1;
  state.offsetX = Number(parsed.offsetX) || 0;
  state.offsetY = Number(parsed.offsetY) || 0;
  state.logoUrl = parsed.logoUrl || null;
  idSeed = Math.max(Number(parsed.idSeed) || 1, idSeed);
  state.selectedNodeId = null;
  state.selectedLinkId = null;
  state.colorTargetNodeId = null;
  return true;
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    return applyImportedState(JSON.parse(raw));
  } catch (error) {
    console.error("No se pudo cargar el estado:", error);
    return false;
  }
}

async function tryLoadBundledStateFile() {
  try {
    const response = await fetch(`./${DEFAULT_PROJECT_FILENAME}`, { cache: "no-store" });
    if (!response.ok) return false;
    const parsed = await response.json();
    return applyImportedState(parsed);
  } catch {
    return false;
  }
}

function downloadProjectState() {
  const content = JSON.stringify(serializeState(), null, 2);
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = DEFAULT_PROJECT_FILENAME;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("Proyecto exportado a JSON");
}

function importProjectStateFromText(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    if (!applyImportedState(parsed)) {
      showToast("Archivo JSON invalido");
      return false;
    }
    render();
    saveState();
    showToast("Proyecto cargado");
    return true;
  } catch {
    showToast("No se pudo leer el JSON");
    return false;
  }
}

function buildNodeClipboard(rootId) {
  const ids = collectNodeCascadeIds(rootId);
  const idSet = new Set(Array.from(ids));
  const nodes = state.nodes.filter((node) => idSet.has(node.id));
  if (nodes.length === 0) return null;
  const minX = Math.min(...nodes.map((n) => n.x));
  const minY = Math.min(...nodes.map((n) => n.y));
  const links = state.links.filter((link) => idSet.has(link.from) && idSet.has(link.to));
  return {
    kind: "nodes",
    rootId,
    minX,
    minY,
    nodes: nodes.map((n) => ({ ...n })),
    links: links.map((l) => ({ ...l }))
  };
}

function pasteClipboardAtCursor() {
  if (!state.clipboard) return false;

  if (state.clipboard.kind === "link") {
    const src = state.clipboard.link;
    if (!state.nodes.some((n) => n.id === src.from) || !state.nodes.some((n) => n.id === src.to)) return false;
    const link = createLink(src.from, src.to);
    link.controlDx = (src.controlDx || 0) + 20;
    link.controlDy = (src.controlDy || 0) + 20;
    state.links.push(link);
    state.selectedNodeId = null;
    state.selectedLinkId = link.id;
    render();
    schedulePersist();
    return true;
  }

  if (state.clipboard.kind !== "nodes") return false;
  const clip = state.clipboard;
  const idMap = new Map();
  const newNodes = [];
  const baseX = state.cursorWorld.x;
  const baseY = state.cursorWorld.y;

  clip.nodes.forEach((node) => {
    const newId = createId(node.type || "node");
    idMap.set(node.id, newId);
    newNodes.push({
      ...node,
      id: newId,
      x: Math.round(baseX + (node.x - clip.minX)),
      y: Math.round(baseY + (node.y - clip.minY))
    });
  });

  newNodes.forEach((node) => {
    if (!node.parentId) return;
    if (idMap.has(node.parentId)) {
      node.parentId = idMap.get(node.parentId);
    } else if (!state.nodes.some((n) => n.id === node.parentId)) {
      node.parentId = null;
    }
  });

  const newLinks = clip.links
    .map((link) => {
      const from = idMap.get(link.from);
      const to = idMap.get(link.to);
      if (!from || !to) return null;
      const created = createLink(from, to);
      created.controlDx = link.controlDx || 0;
      created.controlDy = link.controlDy || 0;
      return created;
    })
    .filter(Boolean);

  state.nodes.push(...newNodes);
  state.links.push(...newLinks);
  state.selectedNodeId = idMap.get(clip.rootId) || newNodes[0]?.id || null;
  state.selectedLinkId = null;
  render();
  schedulePersist();
  return true;
}

function undoHistory() {
  if (state.historyPast.length <= 1) return false;
  const current = state.historyPast.pop();
  if (current) state.historyFuture.push(current);
  const previous = state.historyPast[state.historyPast.length - 1];
  if (!previous) return false;
  state.isRestoringHistory = true;
  const ok = applyImportedState(previous);
  render();
  saveState();
  state.isRestoringHistory = false;
  state.lastHistoryKey = snapshotKey(previous);
  return ok;
}

function redoHistory() {
  if (state.historyFuture.length === 0) return false;
  const next = state.historyFuture.pop();
  if (!next) return false;
  state.isRestoringHistory = true;
  const ok = applyImportedState(next);
  render();
  saveState();
  state.isRestoringHistory = false;
  state.historyPast.push(next);
  state.lastHistoryKey = snapshotKey(next);
  return ok;
}

function getNodeGroup(nodeId) {
  return teamsLayer.querySelector(`g[data-id="${nodeId}"]`) || frontNodesLayer.querySelector(`g[data-id="${nodeId}"]`);
}

function previewDraggedNode(node) {
  const group = getNodeGroup(node.id);
  if (!group) return;
  const dx = node.x - state.dragNodeStart.x;
  const dy = node.y - state.dragNodeStart.y;
  group.setAttribute("transform", `translate(${dx}, ${dy})`);
}

function spawnPosition(type) {
  const size = NODE_SIZE[type] || { w: 160, h: 80 };
  return {
    x: Math.round(state.cursorWorld.x - size.w / 2),
    y: Math.round(state.cursorWorld.y - size.h / 2)
  };
}

function nearestNodeOfType(type, fromPoint) {
  const candidates = state.nodes.filter((node) => node.type === type);
  if (candidates.length === 0) return null;
  let best = candidates[0];
  let bestDist = Number.POSITIVE_INFINITY;
  candidates.forEach((node) => {
    const c = nodeCenter(node);
    const dist = (c.x - fromPoint.x) ** 2 + (c.y - fromPoint.y) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = node;
    }
  });
  return best;
}

function createNode(type, x, y, label, parentId = null, options = {}) {
  const size = NODE_SIZE[type];
  state.nodes.push({
    id: createId(type),
    type,
    x,
    y,
    w: options.w || size.w,
    h: options.h || size.h,
    label,
    parentId,
    fill: options.fill || null,
    stroke: options.stroke || null,
    textColor: options.textColor || null,
    accent: options.accent || null,
    fontScale: Number(options.fontScale) || 1
  });
}

function seedData() {
  createNode("logo", 1640, 980, "OATI", null, { w: 240, h: 240 });

  const teams = [
    {
      title: "PRIMER NIVEL",
      x: 70,
      y: 80,
      w: 980,
      h: 520,
      people: [
        { name: "Lucy", functions: ["UDAPP", "Accesos usuarios"], accent: "#65d80f" },
        { name: "Patricia", functions: ["Atencion primer nivel", "Tuleap"], accent: "#ff4db8" },
        { name: "Lyda", functions: ["SGA", "SGA v2"], accent: "#ff3b30" }
      ],
      comment: "Resoluciones, cumplidos DVE y CPS, Argo"
    },
    {
      title: "INFRAESTRUCTURA Y SEGURIDAD",
      x: 70,
      y: 650,
      w: 1160,
      h: 610,
      people: [
        { name: "Ludwing", functions: ["Nube local (OATI)", "Nube publica (AWS)", "DevOps"], accent: "#84cc16" },
        { name: "Jaime", functions: ["Gestion seguridad informatica", "Carpetas compartidas", "Accesos infraestructura"], accent: "#64748b" },
        { name: "Alex", functions: ["Permisos y accesos", "VPNs"], accent: "#06b6d4" }
      ]
    },
    {
      title: "BASES DE DATOS",
      x: 70,
      y: 1290,
      w: 1160,
      h: 520,
      people: [
        { name: "J.F. Parra", functions: ["Sistema gestion financiera"], accent: "#fb923c" },
        { name: "Francisco", functions: ["Base de datos", "Documentacion"], accent: "#1d4ed8" },
        { name: "Andres", functions: ["Pruebas de rendimiento"], accent: "#0ea5a0" }
      ]
    },
    {
      title: "INFRAESTRUCTURA DE RED",
      x: 70,
      y: 1840,
      w: 1160,
      h: 520,
      people: [
        { name: "Raul", functions: ["Comunicaciones unificadas", "OpenSource", "VoIP"], accent: "#8b5e24" },
        { name: "Diana UDNET", functions: ["Networking", "WLAN", "SDN"], accent: "#f472b6" }
      ]
    },
    {
      title: "GESTION Y APOYO OATI",
      x: 1280,
      y: 80,
      w: 1080,
      h: 610,
      people: [
        { name: "Kevin", functions: ["Auditoria", "Calidad", "Contratacion"], accent: "#c4b5fd" },
        { name: "Nubia", functions: ["Planeacion", "MSPI", "Carpetas compartidas"], accent: "#f59e0b" },
        { name: "Jeison", functions: ["Arquitectura institucional", "Pagina web OATI (TI)"], accent: "#84cc16" },
        { name: "Toño", functions: ["Analisis requerimientos", "Documentacion"], accent: "#facc15" }
      ]
    },
    {
      title: "SEGUNDO NIVEL ADMINISTRATIVA",
      x: 2480,
      y: 80,
      w: 1040,
      h: 1060,
      people: [
        { name: "Cristian Alape", functions: ["Concurso Docente", "Jano - Hoja de vida", "Kyron - puntos docentes"], accent: "#f87171" },
        { name: "Juana", functions: ["Voto", "OpenEva Cuotas partes", "Tike", "Sisfo"], accent: "#c4b5fd" },
        { name: "Cristian Laguna", functions: ["Argo", "Cumplidos CPS", "Cumplidos DVE", "Novedades", "Modulo resoluciones"], accent: "#84cc16" },
        { name: "Violeth", functions: ["Agora", "Arka 1", "Iris", "Registros y cotizaciones"], accent: "#a855f7" }
      ]
    },
    {
      title: "ANALITICA Y REPORTES",
      x: 1280,
      y: 1460,
      w: 980,
      h: 900,
      people: [
        { name: "Juan", functions: ["Metabase", "Knowage", "Bodega de datos", "Generacion reportes"], accent: "#fbbf24" },
        { name: "Jairo", functions: ["Activos informacion", "Propiedad social DPS", "Snies", "Jovenes a la E"], accent: "#f97316" }
      ]
    },
    {
      title: "CORE",
      x: 2320,
      y: 1280,
      w: 1200,
      h: 520,
      people: [
        { name: "Julian", functions: ["Firma digital", "Autenticacion", "Catalogo", "Notificaciones", "Verificacion archivos"], accent: "#2563eb" },
        { name: "Jhon", functions: ["ChatBot", "WSO2", "IA"], accent: "#ef4444" }
      ]
    },
    {
      title: "SEGUNDO NIVEL ACADEMICA",
      x: 2320,
      y: 1820,
      w: 1200,
      h: 540,
      people: [
        { name: "Milton", functions: ["SGA", "APOYO"], accent: "#8b5e24" },
        { name: "Braian", functions: ["Admisiones", "Docentes", "Ingresos y recibos"], accent: "#64748b" },
        { name: "Alvaro", functions: ["Paz y salvos", "SGA v2"], accent: "#2563eb" },
        { name: "Steven", functions: ["Calendario", "Syllabus", "Observatorio", "Polux"], accent: "#a855f7" }
      ]
    }
  ];

  teams.forEach((teamDef, teamIndex) => {
    createNode("team", teamDef.x, teamDef.y, teamDef.title, null, {
      w: teamDef.w,
      h: teamDef.h
    });
    const teamId = state.nodes[state.nodes.length - 1].id;

    const baseY = teamDef.y + 78;
    teamDef.people.forEach((personDef, personIndex) => {
      const personY = baseY + personIndex * 96;
      createNode("person", teamDef.x + 22, personY, personDef.name, teamId, {
        accent: personDef.accent || PERSON_COLORS[(teamIndex + personIndex) % PERSON_COLORS.length]
      });
      const personId = state.nodes[state.nodes.length - 1].id;

      personDef.functions.forEach((fn, fnIndex) => {
        const col = Math.floor(fnIndex / 3);
        const row = fnIndex % 3;
        createNode(
          "function",
          teamDef.x + Math.min(teamDef.w - 240, 420 + col * 230),
          personY - 20 + row * 34,
          fn,
          personId,
          {
            fill: FUNCTION_COLORS[(personIndex + fnIndex + teamIndex) % FUNCTION_COLORS.length]
          }
        );
      });
    });

    if (teamDef.comment) {
      createNode("comment", teamDef.x + teamDef.w - 250, teamDef.y + 34, teamDef.comment, null, {
        w: 220,
        h: 125
      });
    }
  });

  createNode("comment", 1600, 920, "Oficina Asesora de Tecnologias de Informacion", null, {
    w: 360,
    h: 130
  });
}

function regenerateAutoLinks() {
  state.links = [];
  state.selectedLinkId = null;
  state.nodes.forEach((node) => {
    if (node.type === "person" && node.parentId) {
      state.links.push(createLink(node.parentId, node.id));
    }
    if (node.type === "function" && node.parentId) {
      state.links.push(createLink(node.parentId, node.id));
    }
  });
  const logo = state.nodes.find((n) => n.type === "logo");
  const teams = state.nodes.filter((n) => n.type === "team");
  if (logo) {
    teams.forEach((team) => state.links.push(createLink(logo.id, team.id)));
  }
  render();
  schedulePersist();
  showToast("Conexiones automaticas creadas");
}

function clearLinks() {
  state.links = [];
  state.selectedLinkId = null;
  render();
  schedulePersist();
}

function drawLinks() {
  const fragment = document.createDocumentFragment();

  state.links.forEach((link) => {
    const geometry = linkGeometry(link);
    if (!geometry) return;
    const { a, b, controlX, controlY1, controlY2 } = geometry;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${a.x} ${a.y} C ${controlX} ${controlY1}, ${controlX} ${controlY2}, ${b.x} ${b.y}`);
    path.setAttribute("class", "link-line");
    path.setAttribute("stroke", linkStrokeColor(link));
    path.setAttribute("stroke-width", "4");
    path.setAttribute("fill", "none");
    if (link.id === state.selectedLinkId) {
      path.classList.add("link-line-selected");
    }
    path.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.stopPropagation();
      const p = toWorldPoint(event.clientX, event.clientY);
      state.selectedNodeId = null;
      state.selectedLinkId = link.id;
      state.draggingLink = {
        id: link.id,
        startX: p.x,
        startY: p.y,
        startDx: link.controlDx || 0,
        startDy: link.controlDy || 0
      };
      if (path.setPointerCapture) path.setPointerCapture(event.pointerId);
      setInteracting(true);
      scheduleLinksRender();
    });
    fragment.appendChild(path);
  });

  linksLayer.replaceChildren(fragment);
}

function editableText(node, x, y, color = "#0f172a", anchor = "middle", size = 16, weight = 700) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("fill", color);
  text.setAttribute("font-size", String(size));
  text.setAttribute("font-weight", String(weight));
  text.setAttribute("text-anchor", anchor);
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("paint-order", "stroke");
  text.setAttribute("stroke", "transparent");
  text.setAttribute("stroke-width", "0");
  return text;
}

function setTextContent(
  textEl,
  label,
  fontSize,
  anchor = "middle",
  multiline = false,
  maxWidth = 200,
  maxHeight = 40,
  verticalAlign = "middle"
) {
  textEl.textContent = "";
  if (!multiline) {
    textEl.textContent = label;
    return;
  }

  const maxCharsPerLine = Math.max(2, Math.floor(maxWidth / Math.max(4, fontSize * 0.58)));
  const lineHeight = Math.round(fontSize * 1.14);
  const maxLines = Math.max(1, Math.floor(maxHeight / Math.max(1, lineHeight)));
  const lines = wrapTextLines(label, maxCharsPerLine, maxLines);
  const offset = verticalAlign === "top" ? 0 : -((lines.length - 1) * lineHeight) / 2;
  const x = textEl.getAttribute("x") || "0";
  textEl.setAttribute("dominant-baseline", verticalAlign === "top" ? "hanging" : "middle");

  lines.forEach((line, idx) => {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspan.setAttribute("x", x);
    tspan.setAttribute("dy", idx === 0 ? String(offset) : String(lineHeight));
    if (anchor === "start") tspan.setAttribute("text-anchor", "start");
    tspan.textContent = line;
    textEl.appendChild(tspan);
  });
}

function addResizeHandles(group, node) {
  const corners = [
    { key: "nw", x: node.x, y: node.y, cls: "handle-nw" },
    { key: "ne", x: node.x + node.w, y: node.y, cls: "handle-ne" },
    { key: "sw", x: node.x, y: node.y + node.h, cls: "handle-sw" },
    { key: "se", x: node.x + node.w, y: node.y + node.h, cls: "handle-se" }
  ];

  corners.forEach((corner) => {
    const handle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    handle.setAttribute("cx", String(corner.x));
    handle.setAttribute("cy", String(corner.y));
    handle.setAttribute("r", "7");
    handle.setAttribute("class", `resize-handle ${corner.cls}`);
    handle.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      const p = toWorldPoint(event.clientX, event.clientY);
      state.resizingNode = {
        id: node.id,
        corner: corner.key,
        startPointerX: p.x,
        startPointerY: p.y,
        startX: node.x,
        startY: node.y,
        startW: node.w,
        startH: node.h
      };
      if (handle.setPointerCapture) handle.setPointerCapture(event.pointerId);
    });
    group.appendChild(handle);
  });
}

function attachNodeEvents(group, node) {
  group.classList.add("node");
  group.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    const p = toWorldPoint(event.clientX, event.clientY);
    state.selectedNodeId = node.id;
    state.selectedLinkId = null;
    hideContextMenu();

    // Doble clic robusto: entra a edicion antes de iniciar arrastre.
    if (event.detail >= 2 && node.type !== "logo") {
      state.draggingNodeId = null;
      state.draggingCanvas = false;
      setInteracting(false);
      openInlineEditor(node, event);
      scheduleRender();
      return;
    }

    if (state.manualConnect) {
      if (!state.connectFromId) {
        state.connectFromId = node.id;
        showToast(`Origen: ${node.label}. Selecciona destino.`);
        return;
      }
      const from = state.nodes.find((n) => n.id === state.connectFromId);
      const to = node;
      if (!canConnect(from, to)) {
        state.connectFromId = null;
        showToast("Conexion no valida (no persona-persona).");
        return;
      }
      const exists = state.links.some((l) => l.from === from.id && l.to === to.id);
      if (!exists) state.links.push(createLink(from.id, to.id));
      state.connectFromId = null;
      render();
      schedulePersist();
      showToast("Conexion creada");
      return;
    }

    state.draggingNodeId = node.id;
    state.dragNodeStart = { x: node.x, y: node.y };
    state.dragOffset = { x: p.x - node.x, y: p.y - node.y };
    setInteracting(true);
    // No render inmediato para no interferir con doble clic nativo del sistema.
  });

  group.addEventListener("contextmenu", (event) => {
    if (node.type === "logo") return;
    event.preventDefault();
    event.stopPropagation();
    state.selectedNodeId = node.id;
    state.selectedLinkId = null;
    showContextMenu(node, event);
    scheduleRender();
  });
}

function drawLogoNode(group, node) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", node.x + node.w / 2);
  circle.setAttribute("cy", node.y + node.h / 2);
  circle.setAttribute("r", String(node.w / 2));
  circle.setAttribute("class", "center-logo");
  circle.setAttribute("fill", "#ffffff");
  circle.setAttribute("stroke", "#475569");
  circle.setAttribute("stroke-width", "2");
  circle.setAttribute("filter", "url(#softShadow)");
  group.appendChild(circle);

  if (state.logoUrl) {
    const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttribute("href", state.logoUrl);
    img.setAttribute("x", String(node.x + 20));
    img.setAttribute("y", String(node.y + 20));
    img.setAttribute("width", String(node.w - 40));
    img.setAttribute("height", String(node.h - 40));
    img.setAttribute("preserveAspectRatio", "xMidYMid meet");
    group.appendChild(img);
  } else {
    const txt = editableText(
      node,
      node.x + node.w / 2,
      node.y + node.h / 2,
      "#0f172a",
      "middle",
      readableFontSize(node, 30, 18, 54, 34),
      800
    );
    txt.setAttribute("class", "center-logo-text");
    setTextContent(txt, node.label, readableFontSize(node, 30, 18, 54, 34), "middle", true, node.w - 36, node.h - 30);
    group.appendChild(txt);
  }
}

function drawBackgroundCables() {
  bgFxLayer.innerHTML = "";
  const cableColors = ["#60a5fa", "#22d3ee", "#93c5fd", "#f59e0b", "#34d399", "#a78bfa", "#f472b6", "#38bdf8"];
  const cables = Array.from({ length: 14 }, (_, idx) => {
    const startX = -14000 + Math.random() * 12000;
    const startY = -9000 + Math.random() * 20000;
    const endX = 8000 + Math.random() * 12000;
    const endY = -9000 + Math.random() * 20000;
    const c1x = -5000 + Math.random() * 13000;
    const c1y = -12000 + Math.random() * 24000;
    const c2x = -500 + Math.random() * 13000;
    const c2y = -12000 + Math.random() * 24000;
    return {
      d: `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`,
      color: cableColors[idx % cableColors.length],
      w: 6 + Math.random() * 8
    };
  });

  cables.forEach((cable, idx) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", cable.d);
    path.setAttribute("stroke", cable.color);
    path.setAttribute("stroke-width", String(cable.w));
    path.setAttribute("class", "bg-cable");
    bgFxLayer.appendChild(path);

    const beam = document.createElementNS("http://www.w3.org/2000/svg", "path");
    beam.setAttribute("d", cable.d);
    beam.setAttribute("class", `bg-cable-beam${idx % 2 ? " rev" : ""}`);
    beam.style.animationDuration = `${2.0 + Math.random() * 1.8}s`;
    beam.style.animationDelay = `${Math.random() * 1.6}s`;
    beam.style.strokeWidth = `${Math.max(2.3, cable.w * 0.45)}`;
    bgFxLayer.appendChild(beam);
  });
}

function drawNode(node, targetLayer) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.dataset.id = node.id;
  if (node.id === state.selectedNodeId) {
    group.classList.add("selected-node");
  }

  const applyPaint = (element, defaultFill, defaultStroke, defaultStrokeWidth) => {
    element.setAttribute("fill", defaultFill);
    element.setAttribute("stroke", defaultStroke);
    element.setAttribute("stroke-width", String(defaultStrokeWidth));
    // El style inline tiene prioridad sobre clases CSS: evita que el color "falle".
    if (node.fill) {
      element.style.fill = node.fill;
    } else {
      element.style.removeProperty("fill");
    }
    if (node.stroke) {
      element.style.stroke = node.stroke;
    } else {
      element.style.removeProperty("stroke");
    }
  };

  if (node.type === "team") {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(node.x));
    rect.setAttribute("y", String(node.y));
    rect.setAttribute("width", String(node.w));
    rect.setAttribute("height", String(node.h));
    rect.setAttribute("class", "team-rect");
    applyPaint(rect, "#ffffff", "#9ca3af", 2.5);
    rect.setAttribute("rx", "16");
    group.appendChild(rect);
    const title = editableText(
      node,
      node.x + node.w / 2,
      node.y + Math.max(22, node.h * 0.12),
      "#111111",
      "middle",
      readableFontSize(node, 18, 11, 30, 22),
      800
    );
    setTextContent(
      title,
      node.label,
      readableFontSize(node, 18, 11, 30, 22),
      "middle",
      true,
      node.w - 24,
      Math.max(24, node.h * 0.3)
    );
    group.appendChild(title);
  } else if (node.type === "person") {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(node.x));
    rect.setAttribute("y", String(node.y));
    rect.setAttribute("width", String(node.w));
    rect.setAttribute("height", String(node.h));
    rect.setAttribute("class", "person-rect");
    applyPaint(rect, "#f8fafc", "#7a8ea3", 2);
    rect.setAttribute("rx", "10");
    group.appendChild(rect);
    const accent = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    accent.setAttribute("x", String(node.x + 4));
    accent.setAttribute("y", String(node.y + 4));
    accent.setAttribute("width", "14");
    accent.setAttribute("height", String(Math.max(8, node.h - 8)));
    accent.setAttribute("class", "person-accent");
    accent.setAttribute("fill", node.accent || "#60a5fa");
    group.appendChild(accent);
    const personText = editableText(
      node,
      node.x + node.w / 2,
      node.y + node.h / 2,
      node.textColor || "#0f172a",
      "middle",
      readableFontSize(node, 16, 10, 24, 16),
      700
    );
    setTextContent(
      personText,
      node.label,
      readableFontSize(node, 16, 10, 24, 16),
      "middle",
      true,
      node.w - 18,
      node.h - 10
    );
    group.appendChild(personText);
  } else if (node.type === "function") {
    const pill = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    pill.setAttribute("x", String(node.x));
    pill.setAttribute("y", String(node.y));
    pill.setAttribute("width", String(node.w));
    pill.setAttribute("height", String(node.h));
    pill.setAttribute("class", "function-pill");
    applyPaint(pill, "#39b9ff", "#1580bb", 2);
    pill.setAttribute("rx", "16");
    group.appendChild(pill);
    const fnText = editableText(
      node,
      node.x + node.w / 2,
      node.y + node.h / 2,
      node.textColor || "#082f49",
      "middle",
      readableFontSize(node, 14, 9, 22, 14),
      700
    );
    setTextContent(
      fnText,
      node.label,
      readableFontSize(node, 14, 9, 22, 14),
      "middle",
      true,
      node.w - 16,
      node.h - 8
    );
    group.appendChild(fnText);
  } else if (node.type === "comment") {
    const note = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    note.setAttribute("x", String(node.x));
    note.setAttribute("y", String(node.y));
    note.setAttribute("width", String(node.w));
    note.setAttribute("height", String(node.h));
    note.setAttribute("class", "comment-note");
    applyPaint(note, "#ffe59a", "#c2a24f", 2);
    note.setAttribute("rx", "12");
    group.appendChild(note);
    const commentText = editableText(
      node,
      node.x + 12,
      node.y + Math.max(20, node.h * 0.2),
      "#222222",
      "start",
      readableFontSize(node, 14, 9, 22, 16),
      700
    );
    setTextContent(
      commentText,
      node.label,
      readableFontSize(node, 14, 9, 22, 16),
      "start",
      true,
      node.w - 18,
      node.h - 14,
      "top"
    );
    group.appendChild(commentText);
  } else if (node.type === "logo") {
    drawLogoNode(group, node);
  }

  if (node.id === state.selectedNodeId) {
    addResizeHandles(group, node);
  }
  attachNodeEvents(group, node);
  targetLayer.appendChild(group);
}

function render() {
  applyViewportTransform();
  const teamsFragment = document.createDocumentFragment();
  const frontFragment = document.createDocumentFragment();
  const teams = state.nodes.filter((node) => node.type === "team");
  const frontNodes = state.nodes.filter((node) => node.type !== "team");
  teams.forEach((node) => drawNode(node, teamsFragment));
  drawLinks();
  frontNodes.forEach((node) => drawNode(node, frontFragment));
  teamsLayer.replaceChildren(teamsFragment);
  frontNodesLayer.replaceChildren(frontFragment);
}

function scheduleRender() {
  if (state.renderQueued) return;
  state.renderQueued = true;
  window.requestAnimationFrame(() => {
    state.renderQueued = false;
    render();
  });
}

function scheduleLinksRender() {
  if (state.linksRenderQueued) return;
  state.linksRenderQueued = true;
  window.requestAnimationFrame(() => {
    state.linksRenderQueued = false;
    drawLinks();
  });
}

function addTeam() {
  const pos = spawnPosition("team");
  createNode("team", pos.x, pos.y, "NUEVO EQUIPO");
  render();
  schedulePersist();
}

function addPerson() {
  const teams = state.nodes.filter((n) => n.type === "team");
  if (teams.length === 0) {
    showToast("Primero crea un equipo.");
    return;
  }
  const base = state.selectedNodeId
    ? state.nodes.find((n) => n.id === state.selectedNodeId && n.type === "team")
    : null;
  const team = base || nearestNodeOfType("team", state.cursorWorld) || teams[0];
  const pos = spawnPosition("person");
  createNode("person", pos.x, pos.y, "Nueva persona", team.id);
  render();
  schedulePersist();
}

function addFunction() {
  const person = state.nodes.find((n) => n.type === "person");
  if (!person) {
    showToast("Primero crea una persona.");
    return;
  }
  const base = state.selectedNodeId
    ? state.nodes.find((n) => n.id === state.selectedNodeId && n.type === "person")
    : null;
  const owner = base || nearestNodeOfType("person", state.cursorWorld) || person;
  const pos = spawnPosition("function");
  createNode("function", pos.x, pos.y, "Nueva funcion", owner.id);
  render();
  schedulePersist();
}

function addComment() {
  const pos = spawnPosition("comment");
  createNode("comment", pos.x, pos.y, "Nuevo comentario");
  render();
  schedulePersist();
}

function setManualConnect(active) {
  state.manualConnect = active;
  state.connectFromId = null;
  const modeButton = document.getElementById("btnManualConnect");
  const addButton = document.getElementById("btnAddLink");
  if (modeButton) modeButton.textContent = `Modo conectar: ${state.manualConnect ? "ON" : "OFF"}`;
  if (addButton) addButton.textContent = state.manualConnect ? "Cancelar conexion" : "+ Conexion";
  showToast(state.manualConnect ? "Modo conexion activo: elige origen y destino" : "Modo conexion desactivado");
}

function adjustZoom(delta, cx = window.innerWidth / 2, cy = window.innerHeight / 2) {
  const oldScale = state.scale;
  const nextScale = Math.min(6, Math.max(0.35, oldScale + delta));
  if (nextScale === oldScale) return;

  // Zoom centrado en el cursor: conserva el punto bajo el mouse.
  const p = toSvgPoint(cx, cy);
  const worldX = (p.x - state.offsetX) / oldScale;
  const worldY = (p.y - state.offsetY) / oldScale;
  state.scale = nextScale;
  state.offsetX = p.x - worldX * nextScale;
  state.offsetY = p.y - worldY * nextScale;
  applyViewportTransform();
  schedulePersist();
}

function buildExportContentGroup() {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const teamsClone = teamsLayer.cloneNode(true);
  const linksClone = linksLayer.cloneNode(true);
  const frontClone = frontNodesLayer.cloneNode(true);

  [teamsClone, linksClone, frontClone].forEach((layer) => {
    layer.querySelectorAll(".resize-handle").forEach((el) => el.remove());
    layer.querySelectorAll(".selected-node").forEach((el) => el.classList.remove("selected-node"));
    layer.querySelectorAll("[filter]").forEach((el) => el.removeAttribute("filter"));
    layer.querySelectorAll("*").forEach((el) => {
      el.removeAttribute("class");
      if (el.style) el.style.filter = "none";
    });
  });

  // Reforzar estilos de conexiones para export estable.
  const linkPaths = Array.from(linksClone.querySelectorAll("path"));
  linkPaths.forEach((pathEl, index) => {
    pathEl.setAttribute("stroke", linkStrokeColor(state.links[index] || {}));
    pathEl.setAttribute("stroke-width", "4");
    pathEl.setAttribute("fill", "none");
    pathEl.removeAttribute("marker-end");
  });

  group.appendChild(teamsClone);
  group.appendChild(linksClone);
  group.appendChild(frontClone);
  return group;
}

function computeDiagramBounds() {
  const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  tempSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  tempSvg.setAttribute("width", "10");
  tempSvg.setAttribute("height", "10");
  tempSvg.style.position = "fixed";
  tempSvg.style.left = "-10000px";
  tempSvg.style.top = "-10000px";
  tempSvg.style.opacity = "0";

  const content = buildExportContentGroup();
  tempSvg.appendChild(content);
  document.body.appendChild(tempSvg);

  try {
    const box = content.getBBox();
    if (!Number.isFinite(box.x) || !Number.isFinite(box.y) || !Number.isFinite(box.width) || !Number.isFinite(box.height)) {
      return { x: 0, y: 0, w: 1200, h: 900 };
    }
    const pad = 18;
    return {
      x: box.x - pad,
      y: box.y - pad,
      w: Math.max(220, box.width + pad * 2),
      h: Math.max(220, box.height + pad * 2)
    };
  } finally {
    tempSvg.remove();
  }
}

async function renderExportCanvas() {
  const bounds = computeDiagramBounds();
  const exportSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  exportSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  exportSvg.setAttribute("width", String(Math.ceil(bounds.w)));
  exportSvg.setAttribute("height", String(Math.ceil(bounds.h)));
  exportSvg.setAttribute("viewBox", `0 0 ${Math.ceil(bounds.w)} ${Math.ceil(bounds.h)}`);

  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", "0");
  bg.setAttribute("y", "0");
  bg.setAttribute("width", String(Math.ceil(bounds.w)));
  bg.setAttribute("height", String(Math.ceil(bounds.h)));
  bg.setAttribute("fill", "#ffffff");
  exportSvg.appendChild(bg);

  const g = buildExportContentGroup();
  g.setAttribute("transform", `translate(${-bounds.x}, ${-bounds.y})`);
  exportSvg.appendChild(g);

  const serialized = new XMLSerializer().serializeToString(exportSvg);
  const blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(bounds.w * 2);
    canvas.height = Math.ceil(bounds.h * 2);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function exportPdf() {
  const btn = document.getElementById("btnExportPdf");
  btn.disabled = true;
  try {
    if (!window.jspdf) {
      window.print();
      return;
    }
    const canvas = await renderExportCanvas();
    const imgData = canvas.toDataURL("image/png");
    const jsPdf = window.jspdf.jsPDF;
    const pdf = new jsPdf({
      orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
    pdf.save("organigrama-oati.pdf");
    showToast("PDF exportado");
  } catch (error) {
    console.error(error);
    showToast("No se pudo exportar PDF");
  } finally {
    btn.disabled = false;
  }
}

svg.addEventListener("pointerdown", (event) => {
  updateCursorWorldFromEvent(event);
  if (event.button !== 0) return;
  closeInlineEditor(true);
  hideContextMenu();
  if (event.target.closest(".node")) return;
  state.selectedNodeId = null;
  state.selectedLinkId = null;
  state.draggingCanvas = true;
  setInteracting(true);
  state.dragPointerStart = { x: event.clientX, y: event.clientY };
  scheduleRender();
});

svg.addEventListener("pointermove", (event) => {
  updateCursorWorldFromEvent(event);
  if (state.draggingLink) {
    const current = toWorldPoint(event.clientX, event.clientY);
    const active = state.draggingLink;
    const link = state.links.find((item) => item.id === active.id);
    if (!link) return;
    link.controlDx = active.startDx + (current.x - active.startX);
    link.controlDy = active.startDy + (current.y - active.startY);
    scheduleLinksRender();
    return;
  }

  if (state.resizingNode) {
    const active = state.resizingNode;
    const node = state.nodes.find((n) => n.id === active.id);
    if (!node) return;

    const p = toWorldPoint(event.clientX, event.clientY);
    const dx = p.x - active.startPointerX;
    const dy = p.y - active.startPointerY;
    let nextX = active.startX;
    let nextY = active.startY;
    let nextW = active.startW;
    let nextH = active.startH;

    if (active.corner === "nw") {
      nextX = active.startX + dx;
      nextY = active.startY + dy;
      nextW = active.startW - dx;
      nextH = active.startH - dy;
    } else if (active.corner === "ne") {
      nextY = active.startY + dy;
      nextW = active.startW + dx;
      nextH = active.startH - dy;
    } else if (active.corner === "sw") {
      nextX = active.startX + dx;
      nextW = active.startW - dx;
      nextH = active.startH + dy;
    } else if (active.corner === "se") {
      nextW = active.startW + dx;
      nextH = active.startH + dy;
    }

    const min = MIN_NODE_SIZE[node.type] || { w: 100, h: 60 };
    if (nextW < min.w) {
      if (active.corner === "nw" || active.corner === "sw") {
        nextX -= min.w - nextW;
      }
      nextW = min.w;
    }
    if (nextH < min.h) {
      if (active.corner === "nw" || active.corner === "ne") {
        nextY -= min.h - nextH;
      }
      nextH = min.h;
    }

    node.x = nextX;
    node.y = nextY;
    node.w = nextW;
    node.h = nextH;
    scheduleRender();
    return;
  }

  if (state.draggingNodeId) {
    const node = state.nodes.find((n) => n.id === state.draggingNodeId);
    if (!node) return;
    const p = toWorldPoint(event.clientX, event.clientY);
    node.x = p.x - state.dragOffset.x;
    node.y = p.y - state.dragOffset.y;
    previewDraggedNode(node);
    scheduleLinksRender();
    return;
  }

  if (!state.draggingCanvas) return;
  state.offsetX += event.clientX - state.dragPointerStart.x;
  state.offsetY += event.clientY - state.dragPointerStart.y;
  state.dragPointerStart = { x: event.clientX, y: event.clientY };
  applyViewportTransform();
});

svg.addEventListener("pointerup", () => {
  const hadInteraction = Boolean(state.draggingNodeId || state.draggingLink || state.resizingNode || state.draggingCanvas);
  state.draggingNodeId = null;
  state.draggingLink = null;
  state.resizingNode = null;
  state.draggingCanvas = false;
  setInteracting(false);
  if (hadInteraction) {
    render();
    schedulePersist();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideContextMenu();
    closeInlineEditor(false);
    return;
  }
  if (!inlineEditor.classList.contains("hidden")) return;

  const isCtrl = event.ctrlKey || event.metaKey;
  const key = event.key.toLowerCase();
  if (isCtrl && key === "z" && !event.shiftKey) {
    event.preventDefault();
    if (undoHistory()) showToast("Deshacer");
    return;
  }
  if (isCtrl && (key === "y" || (key === "z" && event.shiftKey))) {
    event.preventDefault();
    if (redoHistory()) showToast("Rehacer");
    return;
  }
  if (isCtrl && key === "c") {
    event.preventDefault();
    if (state.selectedNodeId) {
      const clip = buildNodeClipboard(state.selectedNodeId);
      if (clip) {
        state.clipboard = clip;
        showToast("Elemento copiado");
      }
      return;
    }
    if (state.selectedLinkId) {
      const link = state.links.find((l) => l.id === state.selectedLinkId);
      if (link) {
        state.clipboard = { kind: "link", link: { ...link } };
        showToast("Conexion copiada");
      }
    }
    return;
  }
  if (isCtrl && key === "v") {
    event.preventDefault();
    if (pasteClipboardAtCursor()) {
      showToast("Pegado");
    }
    return;
  }

  if (event.key !== "Delete" && event.key !== "Backspace") return;
  if (deleteSelectedNode()) return;
  if (!state.selectedLinkId) return;
  const before = state.links.length;
  state.links = state.links.filter((link) => link.id !== state.selectedLinkId);
  state.selectedLinkId = null;
  if (state.links.length !== before) {
    scheduleRender();
    schedulePersist();
    showToast("Conexion eliminada");
  }
});

inlineEditor.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    closeInlineEditor(true);
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeInlineEditor(false);
  }
});

inlineEditor.addEventListener("blur", () => {
  closeInlineEditor(true);
});

menuEditNode.addEventListener("click", () => {
  if (!state.contextMenuNodeId) return;
  const node = state.nodes.find((item) => item.id === state.contextMenuNodeId);
  if (!node) {
    hideContextMenu();
    return;
  }
  const menuRect = nodeContextMenu.getBoundingClientRect();
  openInlineEditor(node, { clientX: menuRect.left, clientY: menuRect.top });
  hideContextMenu();
});

menuIncreaseFont.addEventListener("click", () => {
  if (!state.contextMenuNodeId) return;
  const node = state.nodes.find((item) => item.id === state.contextMenuNodeId);
  if (!node) {
    hideContextMenu();
    return;
  }
  node.fontScale = Math.min(2.6, (Number(node.fontScale) || 1) + 0.15);
  hideContextMenu();
  render();
  schedulePersist();
  showToast("Fuente aumentada");
});

menuReduceFont.addEventListener("click", () => {
  if (!state.contextMenuNodeId) return;
  const node = state.nodes.find((item) => item.id === state.contextMenuNodeId);
  if (!node) {
    hideContextMenu();
    return;
  }
  node.fontScale = Math.max(0.5, (Number(node.fontScale) || 1) - 0.15);
  hideContextMenu();
  render();
  schedulePersist();
  showToast("Fuente reducida");
});

menuColorNode.addEventListener("click", () => {
  if (!state.contextMenuNodeId) return;
  const node = state.nodes.find((item) => item.id === state.contextMenuNodeId);
  if (!node) {
    hideContextMenu();
    return;
  }
  state.selectedNodeId = node.id;
  state.colorTargetNodeId = node.id;
  showToast("Elige un color de la paleta");
});

menuColorPalette.addEventListener("click", (event) => {
  const swatch = event.target.closest(".menu-color-swatch");
  if (!swatch) return;
  const targetId = state.colorTargetNodeId || state.selectedNodeId || state.contextMenuNodeId;
  if (!targetId) return;
  const node = state.nodes.find((item) => item.id === targetId);
  if (!node) return;
  node.fill = swatch.dataset.color || "#ffffff";
  hideContextMenu();
  render();
  schedulePersist();
  showToast("Color actualizado");
});

window.addEventListener("pointerdown", (event) => {
  if (nodeContextMenu.classList.contains("hidden")) return;
  if (nodeContextMenu.contains(event.target)) return;
  hideContextMenu();
});

svg.addEventListener("wheel", (event) => {
  event.preventDefault();
  const delta = event.deltaY < 0 ? 0.1 : -0.1;
  adjustZoom(delta, event.clientX, event.clientY);
});

document.getElementById("btnAddTeam").addEventListener("click", addTeam);
document.getElementById("btnAddPerson").addEventListener("click", addPerson);
document.getElementById("btnAddFunction").addEventListener("click", addFunction);
document.getElementById("btnAddComment").addEventListener("click", addComment);
document.getElementById("btnAddLink").addEventListener("click", () => setManualConnect(!state.manualConnect));
document.getElementById("btnAutoLinks").addEventListener("click", regenerateAutoLinks);
document.getElementById("btnClearLinks").addEventListener("click", clearLinks);
document.getElementById("btnZoomIn").addEventListener("click", () => adjustZoom(0.1));
document.getElementById("btnZoomOut").addEventListener("click", () => adjustZoom(-0.1));
document.getElementById("btnResetView").addEventListener("click", () => {
  state.scale = 1;
  state.offsetX = 0;
  state.offsetY = 0;
  render();
  schedulePersist();
});
document.getElementById("btnSaveProject").addEventListener("click", downloadProjectState);
document.getElementById("btnLoadProject").addEventListener("click", () => stateFileInput.click());
document.getElementById("btnExportPdf").addEventListener("click", exportPdf);

document.getElementById("btnManualConnect").addEventListener("click", () => setManualConnect(!state.manualConnect));

logoInput.addEventListener("change", () => {
  const file = logoInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.logoUrl = String(reader.result || "");
    render();
    schedulePersist();
  };
  reader.readAsDataURL(file);
});

stateFileInput.addEventListener("change", () => {
  const file = stateFileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    importProjectStateFromText(String(reader.result || ""));
    stateFileInput.value = "";
  };
  reader.readAsText(file);
});

async function bootstrap() {
  drawBackgroundCables();
  const loaded = loadState() || await tryLoadBundledStateFile();
  if (!loaded) {
    seedData();
    regenerateAutoLinks();
  } else {
    render();
  }
  saveState();
}

bootstrap();
