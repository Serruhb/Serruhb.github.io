/**
 * Naturally Logical — site chat widget
 *
 * Usage: drop this on any page —
 *   <script src="nl-chat-widget.js" data-api="https://nl-chatbot.YOUR-SUBDOMAIN.workers.dev/api/chat"></script>
 *
 * No dependencies. Self-contained styles, scoped to #nl-chat-root.
 */
(function () {
  const scriptTag = document.currentScript;
  const API_URL = scriptTag.getAttribute("data-api");

  if (!API_URL) {
    console.error("[nl-chat-widget] Missing data-api attribute on script tag.");
    return;
  }

  // ---------- styles ----------
  const css = `
  #nl-chat-root { all: initial; }
  #nl-chat-root, #nl-chat-root * { box-sizing: border-box; font-family: -apple-system, "Inter", "Segoe UI", sans-serif; }

  #nl-chat-root .nl-launcher {
    position: fixed; bottom: 24px; right: 24px; z-index: 999999;
    width: 56px; height: 56px; border-radius: 10px;
    background: #1D2126; color: #F6F5F2; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    transition: transform 0.15s ease;
  }
  #nl-chat-root .nl-launcher:hover { transform: translateY(-2px); }
  #nl-chat-root .nl-launcher:focus-visible { outline: 2px solid #4F7C82; outline-offset: 3px; }
  #nl-chat-root .nl-launcher svg { width: 24px; height: 24px; }

  #nl-chat-root .nl-panel {
    position: fixed; bottom: 24px; right: 24px; z-index: 999999;
    width: 368px; max-width: calc(100vw - 32px);
    height: 540px; max-height: calc(100vh - 48px);
    background: #F6F5F2; border-radius: 12px; overflow: hidden;
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    display: flex; flex-direction: column;
    border: 1px solid #D8D6D0;
  }

  #nl-chat-root .nl-header {
    background: #1D2126; color: #F6F5F2; padding: 14px 16px;
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  #nl-chat-root .nl-header-title { font-size: 14px; font-weight: 600; letter-spacing: 0.01em; }
  #nl-chat-root .nl-header-sub {
    font-family: "SF Mono", "Consolas", monospace; font-size: 11px;
    color: #8FA9AC; margin-top: 2px;
  }
  #nl-chat-root .nl-close {
    background: none; border: none; color: #F6F5F2; cursor: pointer;
    opacity: 0.7; padding: 4px; display: flex;
  }
  #nl-chat-root .nl-close:hover { opacity: 1; }
  #nl-chat-root .nl-close svg { width: 18px; height: 18px; }

  #nl-chat-root .nl-messages {
    flex: 1; overflow-y: auto; padding: 16px;
    display: flex; flex-direction: column; gap: 10px;
  }

  #nl-chat-root .nl-msg {
    max-width: 84%; padding: 9px 12px; border-radius: 8px;
    font-size: 13.5px; line-height: 1.45; white-space: pre-wrap;
  }
  #nl-chat-root .nl-msg.bot {
    align-self: flex-start; background: #FFFFFF; color: #1D2126;
    border: 1px solid #E4E2DC; border-bottom-left-radius: 2px;
  }
  #nl-chat-root .nl-msg.user {
    align-self: flex-end; background: #1D2126; color: #F6F5F2;
    border-bottom-right-radius: 2px;
  }

  #nl-chat-root .nl-typing {
    align-self: flex-start; font-family: "SF Mono", "Consolas", monospace;
    font-size: 13px; color: #8A8A85; padding: 2px 12px;
  }

  #nl-chat-root .nl-inputrow {
    display: flex; gap: 8px; padding: 12px; border-top: 1px solid #E4E2DC;
    background: #F6F5F2; flex-shrink: 0;
  }
  #nl-chat-root .nl-input {
    flex: 1; border: 1px solid #D8D6D0; border-radius: 7px;
    padding: 9px 11px; font-size: 13.5px; resize: none;
    background: #FFFFFF; color: #1D2126;
  }
  #nl-chat-root .nl-input:focus-visible { outline: 2px solid #4F7C82; outline-offset: 1px; }
  #nl-chat-root .nl-send {
    background: #1D2126; color: #F6F5F2; border: none; border-radius: 7px;
    width: 38px; flex-shrink: 0; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  #nl-chat-root .nl-send:hover { background: #2B3138; }
  #nl-chat-root .nl-send:disabled { opacity: 0.4; cursor: default; }
  #nl-chat-root .nl-send svg { width: 16px; height: 16px; }

  @media (max-width: 480px) {
    #nl-chat-root .nl-panel {
      right: 16px; bottom: 16px; left: 16px; width: auto;
      height: calc(100vh - 32px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    #nl-chat-root .nl-launcher { transition: none; }
  }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---------- DOM ----------
  const root = document.createElement("div");
  root.id = "nl-chat-root";
  document.body.appendChild(root);

  const launcher = document.createElement("button");
  launcher.className = "nl-launcher";
  launcher.setAttribute("aria-label", "Open chat");
  launcher.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v12H7l-3 3V4z"/></svg>`;

  const panel = document.createElement("div");
  panel.className = "nl-panel";
  panel.style.display = "none";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Naturally Logical chat");
  panel.innerHTML = `
    <div class="nl-header">
      <div>
        <div class="nl-header-title">Naturally Logical</div>
        <div class="nl-header-sub">// ask us anything</div>
      </div>
      <button class="nl-close" aria-label="Close chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="nl-messages" id="nl-messages"></div>
    <div class="nl-inputrow">
      <textarea class="nl-input" id="nl-input" rows="1" placeholder="Ask about our approach, a project, anything…"></textarea>
      <button class="nl-send" id="nl-send" aria-label="Send message" disabled>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
      </button>
    </div>
  `;

  root.appendChild(launcher);
  root.appendChild(panel);

  const messagesEl = panel.querySelector("#nl-messages");
  const inputEl = panel.querySelector("#nl-input");
  const sendBtn = panel.querySelector("#nl-send");
  const closeBtn = panel.querySelector(".nl-close");

  // ---------- state ----------
  let history = []; // [{role, content}], content is plain string for user turns
  let open = false;

  const GREETING =
    "Let's get to the root of it 😉. What's going on with your systems?";

  function addMessage(role, text) {
    const el = document.createElement("div");
    el.className = `nl-msg ${role === "user" ? "user" : "bot"}`;
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function setTyping(on) {
    let el = messagesEl.querySelector(".nl-typing");
    if (on && !el) {
      el = document.createElement("div");
      el.className = "nl-typing";
      el.textContent = "…thinking";
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } else if (!on && el) {
      el.remove();
    }
  }

  function autoGrow() {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + "px";
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage("user", text);
    history.push({ role: "user", content: text });
    inputEl.value = "";
    autoGrow();
    sendBtn.disabled = true;
    setTyping(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      setTyping(false);

      if (!res.ok || !data.reply) {
        addMessage("bot", "Something went wrong on our end — mind trying again?");
        return;
      }

      addMessage("bot", data.reply);
      history.push({ role: "assistant", content: data.reply });
    } catch (err) {
      setTyping(false);
      addMessage("bot", "Couldn't reach the server — check your connection and try again.");
    }
  }

  inputEl.addEventListener("input", () => {
    sendBtn.disabled = inputEl.value.trim().length === 0;
    autoGrow();
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });

  sendBtn.addEventListener("click", sendMessage);

  function togglePanel(show) {
    open = show;
    panel.style.display = open ? "flex" : "none";
    launcher.style.display = open ? "none" : "flex";
    if (open) {
      if (messagesEl.children.length === 0) addMessage("bot", GREETING);
      inputEl.focus();
    }
  }

  launcher.addEventListener("click", () => togglePanel(true));
  closeBtn.addEventListener("click", () => togglePanel(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) togglePanel(false);
  });
})();
