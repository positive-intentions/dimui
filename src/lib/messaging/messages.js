BP.module("dimui/lib/messaging/messages", [], function () {
  const STATUSES = ["sent", "delivered", "read"];
  const KINDS = ["text", "file"];
  const DIRECTIONS = ["out", "in"];

  function newId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "msg-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  }

  function normalizeMessage(raw) {
    if (!raw || typeof raw !== "object") return null;
    const direction = DIRECTIONS.indexOf(raw.direction) >= 0 ? raw.direction : "out";
    const kind = KINDS.indexOf(raw.kind) >= 0 ? raw.kind : "text";
    const status = STATUSES.indexOf(raw.status) >= 0 ? raw.status : "sent";
    const id = String(raw.id || newId());
    const body = String(raw.body || "");
    const createdAt = String(raw.createdAt || new Date().toISOString());
    const msg = { id, direction, kind, body, status, createdAt };
    if (kind === "file") {
      const att = raw.attachment && typeof raw.attachment === "object"
        ? raw.attachment
        : {};
      msg.attachment = {
        name: String(att.name || "file.bin"),
        mime: String(att.mime || "application/octet-stream"),
        size: Number(att.size) || 0,
        phase: String(att.phase || "complete"),
        progress: Math.max(0, Math.min(100, Number(att.progress) || 0)),
      };
    }
    return msg;
  }

  function normalizeMessages(list) {
    if (!Array.isArray(list)) return [];
    return list.map(normalizeMessage).filter(Boolean);
  }

  function createTextMessage(body, direction) {
    return normalizeMessage({
      id: newId(),
      direction: direction || "out",
      kind: "text",
      body: String(body || "").trim(),
      status: direction === "in" ? "delivered" : "sent",
      createdAt: new Date().toISOString(),
    });
  }

  function createFileMessage(fileMeta, direction) {
    const name = (fileMeta && fileMeta.name) || "attachment.bin";
    const size = (fileMeta && fileMeta.size) || 0;
    const mime = (fileMeta && fileMeta.mime) || "application/octet-stream";
    return normalizeMessage({
      id: newId(),
      direction: direction || "out",
      kind: "file",
      body: name,
      status: "sent",
      createdAt: new Date().toISOString(),
      attachment: {
        name,
        mime,
        size,
        phase: "encrypting",
        progress: 0,
      },
    });
  }

  function advanceStatus(status) {
    const i = STATUSES.indexOf(status);
    if (i < 0 || i >= STATUSES.length - 1) return status;
    return STATUSES[i + 1];
  }

  function tickMarks(status) {
    if (status === "read") return "✓✓";
    if (status === "delivered") return "✓✓";
    return "✓";
  }

  function formatTime(iso) {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  }

  function dateChipLabel(iso) {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      const today = new Date();
      const startToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      const startMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diffDays = Math.round(
        (startToday - startMsg) / (24 * 60 * 60 * 1000),
      );
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      return d.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "";
    }
  }

  function withDateChips(messages) {
    const sorted = normalizeMessages(messages).slice().sort(function (a, b) {
      return String(a.createdAt).localeCompare(String(b.createdAt));
    });
    const out = [];
    let lastChip = "";
    for (let i = 0; i < sorted.length; i++) {
      const msg = sorted[i];
      const chip = dateChipLabel(msg.createdAt);
      if (chip && chip !== lastChip) {
        out.push({ type: "chip", id: "chip-" + chip + "-" + i, label: chip });
        lastChip = chip;
      }
      out.push({ type: "message", message: msg });
    }
    return out;
  }

  function updateAttachmentPhase(msg, phase, progress) {
    const next = normalizeMessage(msg);
    if (!next || next.kind !== "file") return next;
    next.attachment = {
      ...next.attachment,
      phase: String(phase || next.attachment.phase),
      progress:
        progress == null
          ? next.attachment.progress
          : Math.max(0, Math.min(100, Number(progress))),
    };
    if (phase === "complete") {
      next.attachment.progress = 100;
      next.status = "delivered";
    }
    if (phase === "cancelled" || phase === "failed") {
      next.status = "sent";
    }
    return next;
  }

  return {
    STATUSES,
    KINDS,
    DIRECTIONS,
    newId,
    normalizeMessage,
    normalizeMessages,
    createTextMessage,
    createFileMessage,
    advanceStatus,
    tickMarks,
    formatTime,
    dateChipLabel,
    withDateChips,
    updateAttachmentPhase,
  };
});
