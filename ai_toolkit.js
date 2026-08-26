/*!
 * IIROSE(蔷薇花园) 插件
 * ---------------------------------------------------------------
 * 功能：
 *  1. 可拖动悬浮窗，单击打开覆盖全屏的面板，返回键关闭
 *  2. WebSocket 包装钩子（核心）：定位 IIROSE 前端 socket 实例，
 *     包装其 send / _onmessage，在保留原有逻辑不失效的前提下，
 *     只监听：弹幕 / 私聊 / 房间消息 / 进出房间，其它格式不记录
 *
 * main.js 会被 IIROSE 插件系统装载并执行一次
 */
(function () {
  'use strict';

  // 防止重复执行
  if (window.__iiroseToolInstalled) return;
  window.__iiroseToolInstalled = true;

  var NS = 'iirose_tool';

  /* ================= 插件状态 ================= */
  var state = {
    socket: null,          // IIROSE socket 实例
    uid: null,             // 当前用户 UID
    wrapped: false,        // 是否已包装
    logEnabled: true       // 是否记录调试信息
  };

  /* ================= 工具函数 ================= */
  function decodeEntities(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, "'")
      .replace(/&/g, '&');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  function fmtTime(ts) {
    var d = ts ? new Date(ts * 1000) : new Date();
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }

  /* ================= 定位 IIROSE 窗口 ================= */
  // IIROSE 前端把 WebSocket 实例暴露为 window.socket，当前用户 UID 为 window.uid。
  // 聊天可能运行在主窗口，也可能运行在 #mainFrame iframe 中。
  function getIIROSEWindow() {
    if (window.socket && window.uid) return window;

    var iframe = document.getElementById('mainFrame');
    try {
      if (iframe && iframe.contentWindow &&
          iframe.contentWindow.socket && iframe.contentWindow.uid) {
        return iframe.contentWindow;
      }
    } catch (e) { /* 跨域时无法访问 */ }

    return null;
  }

  /* ================= 消息解析（依据协议字段） ================= */
  // 下行：公共消息字段 [时间戳,头像,用户名,文本,?,消息色,用户色,?,用户ID,等级,消息ID]
  // 注意：房间事件（进房/换房/退房）为 12 字段，f[3] 以 ' 开头
  function parsePublicMessage(raw) {
    var f = raw.split('>');
    if (f.length < 4) return null;

    // 房间事件
    if (f.length === 12 && f[3].indexOf("'") === 0) {
      var evType = f[3] === "'1" ? 'join' : (f[3] === "'3" ? 'leave' : 'switch');
      return {
        type: 'room_' + evType,
        timestamp: parseInt(f[0], 10) || 0,
        avatar: decodeEntities(f[1]),
        username: decodeEntities(f[2]),
        userId: f[8] || '',
        room: f[10] || '',
        targetRoom: evType === 'switch' ? f[3].substring(2) : '',
        raw: raw
      };
    }

    return {
      type: 'room_msg',
      timestamp: parseInt(f[0], 10) || 0,
      avatar: decodeEntities(f[1]),
      username: decodeEntities(f[2]),
      text: decodeEntities(f[3]),
      messageColor: decodeEntities(f[5] || ''),
      userColor: decodeEntities(f[6] || ''),
      userId: f[8] || '',
      title: f[9] || '',
      messageId: f[10] || '',
      raw: raw
    };
  }

  // 下行：私聊字段（11 字段，权威格式）
  // [0]时间戳 [1]uid [2]用户名 [3]头像 [4]内容 [5]消息色 [6]匿名@ [7]用户色 [8]性别 [9]封面图 [10]消息ID
  function parsePrivateMessage(raw) {
    var f = raw.split('>');
    if (f.length < 4) return null;
    return {
      type: f[6] === '@' ? 'private_anon' : 'private',
      timestamp: parseInt(f[0], 10) || 0,
      userId: f[1] || '',
      username: decodeEntities(f[2]),
      avatar: decodeEntities(f[3]),
      text: decodeEntities(f[4]),
      messageColor: decodeEntities(f[5] || ''),
      anonymous: f[6] === '@',
      userColor: decodeEntities(f[7] || ''),
      gender: f[8] || '',
      coverImage: decodeEntities(f[9] || ''),
      messageId: f[10] || '',
      raw: raw
    };
  }

  // 只解析目标消息类型；其它格式一律不监听（原样透传给原逻辑，但不记录/输出）
  // 目标：弹幕(=) / 私聊("") / 房间消息与进出房间(单 ")
  function parseIncoming(data) {
    if (typeof data !== 'string' || data.length === 0) return [];

    var results = [];

    // 私聊："" 前缀
    if (data.indexOf('""') === 0) {
      data.substring(2).split('<').forEach(function (raw) {
        if (!raw) return;
        var m = parsePrivateMessage(raw);
        if (m) results.push(m);
      });
      return results;
    }

    // 房间消息 / 进出房间：单 " 前缀（含 < 分隔的多条）
    if (data[0] === '"') {
      data.substring(1).split('<').forEach(function (raw) {
        if (!raw) return;
        var m = parsePublicMessage(raw);
        if (m) results.push(m);
      });
      return results;
    }

    // 弹幕：= 前缀
    if (data[0] === '=') {
      var df = data.substring(1).split('>');
      if (df.length >= 2) {
        results.push({
          type: 'damaku',
          timestamp: parseInt(df[6], 10) || 0,
          username: decodeEntities(df[0]),
          text: decodeEntities(df[1]),
          userId: df[7] || '',
          raw: data
        });
      }
      return results;
    }

    // 其它格式（系统/状态/响应/心跳等）：不监听
    return results;
  }

  /* ================= 核心：WebSocket 包装钩子 =================
   * 目标：包装 socket.send（发出）与 socket._onmessage（收到），
   * 让本插件逻辑先处理，再交给原始函数，从而「之前的逻辑不失效」。
   * 使用标记防止重复包装；轮询以应对重连重建的 socket。
   */
  function wrapSocket(win) {
    var sock = win.socket;
    if (!sock) return false;
    if (sock.__iiroseToolWrapped) {
      // socket 已包装，仅同步状态
      if (state.socket !== sock) {
        state.socket = sock;
        state.uid = win.uid || null;
      }
      return true;
    }

    var originalSend = (typeof sock.send === 'function') ? sock.send : null;
    var originalOnMessage = (typeof sock._onmessage === 'function') ? sock._onmessage : null;

    // ---- 包装发出方向 ----
    if (originalSend) {
      sock.send = function () {
        var args = Array.prototype.slice.call(arguments);
        try {
          hookOutgoing(args[0]);
        } catch (e) { /* 钩子出错不影响原逻辑 */ }
        // 原样调用原始 send，保持 this 与参数，不破坏原逻辑
        return originalSend.apply(this, args);
      };
    }

    // ---- 包装接收方向 ----
    // IIROSE 内部以字符串调用 socket._onmessage(data)
    if (originalOnMessage) {
      sock._onmessage = function (msg) {
        // 兼容 Event 形式（原生 onmessage 风格）
        var data = (msg && typeof msg === 'object' && 'data' in msg) ? msg.data : msg;
        var pass;
        try {
          pass = hookIncoming(data);
        } catch (e) {
          pass = data;
        }
        if (pass === null) return; // 返回 null 表示吞掉该消息
        // 默认原样转发，保证原有逻辑不失效
        return originalOnMessage.call(this, pass);
      };
    }

    sock.__iiroseToolWrapped = true;
    state.socket = sock;
    state.uid = win.uid || null;
    state.wrapped = true;
    return true;
  }

  // 判断是否自己发送的消息（服务端会回显自己的消息，需要排除）
  function isSelfMessage(m) {
    return !!(m && m.userId && state.uid && m.userId === state.uid);
  }

  // 收到下行数据：解析 + 记录 + 调试输出 + AI 自动回复 + 回调（默认透传）
  // 仅记录目标消息类型且非本人消息；其它格式不输出（但原样透传，不破坏原逻辑）
  function hookIncoming(data) {
    if (typeof data === 'string') {
      parseIncoming(data).forEach(function (m) {
        if (isSelfMessage(m)) return; // 排除自己发送的消息
        if (state.logEnabled) debugWrite('in', m);
        handleAiAutoReply(m); // AI 自动回复（不受调试记录开关影响）
      });
    }
    notifyListeners('incoming', data);
    return data; // 原样返回，不吞消息
  }

  // 发出上行数据：识别 房间/私聊/弹幕 三种发送格式并记录（默认透传）
  function hookOutgoing(data) {
    if (typeof data === 'string') {
      var detail = null;
      // 弹幕：~{"t":..,"c":..}
      if (data[0] === '~') {
        try {
          var dObj = JSON.parse(data.substring(1));
          if (dObj && typeof dObj.t === 'string') {
            detail = {
              type: 'send_damaku',
              text: decodeEntities(dObj.t),
              messageColor: dObj.c || ''
            };
          }
        } catch (e) { /* 忽略 */ }
      } else {
        // 房间消息 / 私聊：{"m":..,"mc":..,"i":..} 或 {"g":uid,...}
        try {
          var obj = JSON.parse(data);
          if (obj && typeof obj.m === 'string') {
            detail = {
              type: obj.g ? 'send_private' : 'send_room',
              text: decodeEntities(obj.m),
              target: obj.g || '',
              messageColor: obj.mc || '',
              messageId: obj.i || ''
            };
          }
        } catch (e) { /* 非 JSON（如登录 *{...}、心跳空串） */ }
      }
      var entry = detail || { type: 'raw', text: data.slice(0, 120), raw: data };
      if (state.logEnabled) {
        debugWrite('out', entry);
      }
    } else {
      if (state.logEnabled) {
        var bin = { type: 'binary', text: '[二进制数据]' };
        debugWrite('out', bin);
      }
    }
    notifyListeners('outgoing', data);
    return data;
  }

  /* ================= 发送 API ================= */
  // 依据参考实现与 @yakumoran/core 编码器：
  //   房间消息 {"m":内容,"mc":颜色,"i":随机}
  //   弹幕     ~{"t":内容,"c":颜色,"v":0}
  //   私聊     {"g":uid,"m":内容,"mc":颜色,"i":随机}

  function getSocket() {
    var win = getIIROSEWindow();
    if (!win || !win.socket) return null;
    if (win.socket.readyState !== 1) return null;
    return win.socket;
  }

  function sendMsgId() {
    return Math.random().toString().substr(2, 12);
  }

  // 发送房间消息
  function sendRoomMsg(text, color) {
    var sock = getSocket();
    if (!sock) return false;
    sock.send(JSON.stringify({
      m: String(text == null ? '' : text),
      mc: color || 'ffffff',
      i: sendMsgId()
    }));
    return true;
  }

  // 发送弹幕
  function sendDanmaku(text, color) {
    var sock = getSocket();
    if (!sock) return false;
    sock.send('~' + JSON.stringify({
      t: String(text == null ? '' : text),
      c: color || 'ffffff',
      v: 0
    }));
    return true;
  }

  // 给指定用户发送私聊
  function sendPrivate(uid, text, color) {
    var sock = getSocket();
    if (!sock) return false;
    uid = String(uid == null ? '' : uid).trim();
    if (!uid) return false;
    sock.send(JSON.stringify({
      g: uid,
      m: String(text == null ? '' : text),
      mc: color || 'ffffff',
      i: sendMsgId()
    }));
    return true;
  }

  // 对外暴露 API（控制台或其它脚本可调用）
  window.iiroseTool = window.iiroseTool || {};
  window.iiroseTool.sendRoomMsg = sendRoomMsg;
  window.iiroseTool.sendDanmaku = sendDanmaku;
  window.iiroseTool.sendPrivate = sendPrivate;
  window.iiroseTool.getSocket = getSocket;

  /* ================= 设置系统（持久化到 localStorage） ================= */
  // 支持类型：boolean / string / select(多选一) / int(带上下界) / float(带上下界)
  var STORAGE_KEY = 'iirose_tool_settings';

  var SETTINGS = {
    ai_api_url: {
      label: 'OpenAI兼容API地址',
      type: 'string',
      default: 'http://localhost:11434/v1',
      placeholder: 'http://localhost:11434/v1'
    },
    ai_model: {
      label: 'AI模型名称',
      type: 'string',
      default: '',
      placeholder: '如 qwen2.5，留空用服务端默认'
    },
    ai_api_key: {
      label: 'API Key（留空则不鉴权）',
      type: 'string',
      inputType: 'password',
      default: '',
      placeholder: 'sk-... 留空则不带 Authorization 头'
    },
    ai_private_reply: {
      label: '开启私聊AI自动回复',
      type: 'boolean',
      default: false
    },
    ai_room_reply: {
      label: '开启房间消息AI自动回复',
      type: 'boolean',
      default: false
    },
    ai_timeout: {
      label: 'AI请求超时时间(秒)',
      type: 'int',
      default: 30,
      min: 1,
      max: 300
    },
    debug_clear_interval: {
      label: '自动清空调试信息间隔(秒，0=关闭)',
      type: 'int',
      default: 300,
      min: 0,
      max: 3600
    }
  };

  // 按类型规整值（含上下界约束）
  function normalizeSetting(key, v) {
    var def = SETTINGS[key];
    if (!def) return v;
    switch (def.type) {
      case 'boolean':
        return !!v;
      case 'string':
        return String(v == null ? '' : v);
      case 'select':
        return def.options && def.options.indexOf(v) !== -1 ? v : def.default;
      case 'int':
        var n = parseInt(v, 10);
        if (isNaN(n)) return def.default;
        if (def.min !== undefined) n = Math.max(def.min, n);
        if (def.max !== undefined) n = Math.min(def.max, n);
        return n;
      case 'float':
        var f = parseFloat(v);
        if (isNaN(f)) return def.default;
        if (def.min !== undefined) f = Math.max(def.min, f);
        if (def.max !== undefined) f = Math.min(def.max, f);
        return f;
      default:
        return v;
    }
  }

  // 简单加密（XOR + Base64）混淆存储，避免 API Key 明文暴露在 localStorage
  var SECRET = 'iirose_tool::key_v1';
  function encryptStr(s) {
    if (s == null || s === '') return '';
    try {
      var r = '';
      for (var i = 0; i < s.length; i++) {
        r += String.fromCharCode(s.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length));
      }
      return btoa(encodeURIComponent(r));
    } catch (e) { return ''; }
  }
  function decryptStr(s) {
    if (s == null || s === '') return '';
    try {
      var r = decodeURIComponent(atob(s));
      var o = '';
      for (var i = 0; i < r.length; i++) {
        o += String.fromCharCode(r.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length));
      }
      return o;
    } catch (e) { return ''; }
  }

  function loadSettings() {
    var s = {};
    Object.keys(SETTINGS).forEach(function (k) { s[k] = SETTINGS[k].default; });
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        Object.keys(SETTINGS).forEach(function (k) {
          if (saved[k] !== undefined) {
            var v = normalizeSetting(k, saved[k]);
            if (k === 'ai_api_key' && v) v = decryptStr(v);
            s[k] = v;
          }
        });
      }
    } catch (e) { /* localStorage 不可用时使用默认值 */ }
    return s;
  }

  var settings = loadSettings();

  function saveSettings() {
    var store = {};
    Object.keys(settings).forEach(function (k) { store[k] = settings[k]; });
    if (store.ai_api_key) store.ai_api_key = encryptStr(store.ai_api_key);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch (e) { /* 忽略 */ }
  }

  function getSetting(key) { return settings[key]; }
  function getSettings() { return settings; }

  function setSetting(key, v) {
    if (!SETTINGS[key]) return false;
    settings[key] = normalizeSetting(key, v);
    saveSettings();
    return true;
  }

  function resetSettings() {
    Object.keys(SETTINGS).forEach(function (k) { settings[k] = SETTINGS[k].default; });
    saveSettings();
  }

  window.iiroseTool.getSetting = getSetting;
  window.iiroseTool.setSetting = setSetting;
  window.iiroseTool.getSettings = getSettings;

  /* ================= AI 自动回复 ================= */
  // 调用 OpenAI 兼容 /chat/completions；错误用 IIROSE 全局 _alert 提示；带超时

  // 规整 API 地址：去尾部斜杠
  function normalizeApiUrl(url) {
    url = String(url == null ? '' : url).trim();
    if (!url) return '';
    return url.replace(/\/+$/, '');
  }

  // 全局弹窗（IIROSE 提供 window._alert）
  function showAlert(msg) {
    var text = String(msg == null ? '' : msg);
    try {
      if (typeof window._alert === 'function') {
        window._alert(text);
      } else if (typeof alert === 'function') {
        alert(text);
      }
    } catch (e) { /* 忽略 */ }
  }

  // 调用 chat/completions，返回回复文本；失败返回 null 并弹窗
  function aiChat(messages) {
    var base = normalizeApiUrl(getSetting('ai_api_url'));
    if (!base) {
      var errMsg = '未配置 OpenAI 兼容 API 地址，请在设置中填写';
      showAlert(errMsg);
      debugWrite('ai', { type: 'ai', text: errMsg });
      return Promise.resolve(null);
    }
    var timeoutSec = getSetting('ai_timeout');
    if (!(timeoutSec > 0)) timeoutSec = 30;
    var controller = (typeof AbortController === 'function') ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, timeoutSec * 1000) : null;

    var body = { messages: messages };
    var model = getSetting('ai_model');
    if (model) body.model = model;

    var headers = { 'Content-Type': 'application/json' };
    var apiKey = getSetting('ai_api_key');
    if (apiKey) headers['Authorization'] = 'Bearer ' + apiKey;

    var req = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    };
    if (controller) req.signal = controller.signal;

    return fetch(base + '/chat/completions', req)
      .then(function (res) {
        if (timer) clearTimeout(timer);
        if (!res.ok) {
          return res.text().then(function (t) {
            throw new Error('HTTP ' + res.status + (t ? ': ' + t.slice(0, 200) : ''));
          });
        }
        return res.json();
      })
      .then(function (json) {
        var content = json && json.choices && json.choices[0] &&
          json.choices[0].message && json.choices[0].message.content;
        return content ? String(content) : '';
      })
      .catch(function (err) {
        if (timer) clearTimeout(timer);
        var reason = (err && err.name === 'AbortError')
          ? '请求超时(' + timeoutSec + 's)'
          : (err && err.message ? err.message : String(err));
        showAlert('AI 请求失败：' + reason);
        debugWrite('ai', { type: 'ai', text: 'AI 请求失败: ' + reason });
        return null;
      });
  }

  // 处理 AI 自动回复：私聊 / 房间消息按设置触发
  function handleAiAutoReply(m) {
    if (!m || !m.text) return;
    if (m.type === 'private' || m.type === 'private_anon') {
      if (!getSetting('ai_private_reply')) return;
      debugWrite('ai', { type: 'ai', text: '收到私聊，正在生成回复…' });
      aiChat([{ role: 'user', content: m.text }]).then(function (reply) {
        if (reply && m.userId) sendPrivate(m.userId, reply);
      });
    } else if (m.type === 'room_msg') {
      if (!getSetting('ai_room_reply')) return;
      debugWrite('ai', { type: 'ai', text: '收到房间消息，正在生成回复…' });
      aiChat([{ role: 'user', content: m.text }]).then(function (reply) {
        if (reply) sendRoomMsg(reply);
      });
    }
  }

  window.iiroseTool.aiChat = aiChat;

  // 简单事件分发（供 UI 等订阅）
  var _listeners = [];
  function notifyListeners(kind, data) {
    for (var i = 0; i < _listeners.length; i++) {
      try { _listeners[i](kind, data); } catch (e) { /* 忽略 */ }
    }
  }
  function onHookEvent(fn) { _listeners.push(fn); }

  // ===== 调试输出框 =====
  var DEBUG_MAX_LINES = 500;

  function typeName(t) {
    return {
      room_msg: '房间消息',
      public: '公共消息',
      private: '私聊',
      private_anon: '匿名私聊',
      damaku: '弹幕',
      room_join: '进房',
      room_switch: '换房',
      room_leave: '退房',
      ai: 'AI',
      system: '系统数据',
      send_room: '发送房间',
      send_private: '发送私聊',
      send_damaku: '发送弹幕',
      raw: '原始',
      binary: '二进制'
    }[t] || t;
  }

  // 生成可读的消息内容
  function describeMessage(m) {
    if (!m) return '';
    if (m.type === 'system') return m.raw || m.text || '';
    if (m.type === 'private' || m.type === 'private_anon') {
      var s = '';
      if (m.username) s += (m.anonymous ? '[匿名]' : m.username) + ': ';
      s += (m.text || '');
      if (m.coverImage) s += '  [图片] ' + m.coverImage;
      if (m.messageId) s += '  [id=' + m.messageId + ']';
      return s;
    }
    if (m.type === 'room_msg') {
      return (m.username ? m.username + ': ' : '') + (m.text || '');
    }
    if (m.type === 'damaku') {
      return (m.username ? m.username + ': ' : '') + (m.text || '');
    }
    if (m.type === 'room_join') {
      return (m.username || '') + ' 进入房间 ' + (m.room || '');
    }
    if (m.type === 'room_switch') {
      return (m.username || '') + ' 切换到房间 ' + (m.targetRoom || m.room || '');
    }
    if (m.type === 'room_leave') {
      return (m.username || '') + ' 离开房间 ' + (m.room || '');
    }
    return m.text || '';
  }

  // 向调试输出框追加一行：显示消息类型与消息内容
  function debugWrite(dir, m) {
    if (!panel) return;
    var box = panel.querySelector('#' + NS + '_debug');
    if (!box) return;
    if (!box.__dbgInit) {
      box.innerHTML = '';
      box.__dbgInit = true;
    }
    var line = document.createElement('div');
    var raw = (m && m.raw) ? String(m.raw) : '';
    line.innerHTML =
      '<span class="' + NS + '_dtime">[' + fmtTime(m && m.timestamp) + ']</span> ' +
      '<span class="' + NS + '_dtype">' + (dir === 'in' ? '收' : (dir === 'out' ? '发' : 'AI')) + '·' + escapeHtml(typeName(m && m.type)) + '</span> ' +
      escapeHtml(describeMessage(m)) +
      (raw ? '<div class="' + NS + '_draw">' + escapeHtml(raw) + '</div>' : '');
    box.appendChild(line);
    while (box.childNodes.length > DEBUG_MAX_LINES) box.removeChild(box.firstChild);
    box.scrollTop = box.scrollHeight;
  }

  /* ================= 轮询：等待 socket 就绪并包装 ================= */
  function pollSocket() {
    var win = getIIROSEWindow();
    if (win) {
      wrapSocket(win);
    }
    renderStatus();
  }

  function startPolling() {
    pollSocket();
    setInterval(pollSocket, 2000);
  }

  /* ================= UI：悬浮窗 + 全屏面板 ================= */
  var floatBtn = null;
  var panel = null;

  function injectStyles() {
    var styleId = NS + '_style';
    if (document.getElementById(styleId)) return;
    var css = [
      '#' + NS + '_float{position:fixed;left:16px;bottom:120px;z-index:2147483000;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#ff8fb1,#ff4d7e);box-shadow:0 4px 16px rgba(255,77,126,.45);color:#fff;font-size:26px;line-height:56px;text-align:center;cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none;transition:box-shadow .2s ease,transform .15s ease}',
      '#' + NS + '_float:hover{box-shadow:0 6px 22px rgba(255,77,126,.6)}',
      '#' + NS + '_float:active{cursor:grabbing;transform:scale(.94)}',
      '#' + NS + '_float.dragging{box-shadow:0 10px 28px rgba(255,77,126,.7);transform:scale(1.05);transition:none}',
      '#' + NS + '_panel{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483001;background:#f7f8fc;display:none;flex-direction:column;overflow:hidden;font-family:"Microsoft YaHei","PingFang SC",sans-serif;user-select:text;-webkit-user-select:text}',
      '#' + NS + '_panel.show{display:flex;animation:' + NS + '_fadeIn .25s ease}',
      '#' + NS + '_panel.show.out{animation:' + NS + '_fadeOut .2s ease forwards}',
      '@keyframes ' + NS + '_fadeIn{from{opacity:0}to{opacity:1}}',
      '@keyframes ' + NS + '_fadeOut{from{opacity:1}to{opacity:0}}',
      '#' + NS + '_panel .' + NS + '_header{display:flex;align-items:center;flex-shrink:0;height:48px;padding:0 12px;background:#fff;border-bottom:1px solid #ececf1;box-shadow:0 1px 4px rgba(0,0,0,.04)}',
      '#' + NS + '_panel .' + NS + '_back{width:34px;height:34px;border:none;background:transparent;border-radius:50%;color:#333;font-size:22px;line-height:34px;text-align:center;cursor:pointer;transition:background .15s ease}',
      '#' + NS + '_panel .' + NS + '_back:hover{background:#f2f2f7}',
      '#' + NS + '_panel .' + NS + '_title{flex:1;margin-left:8px;font-size:16px;font-weight:600;color:#222}',
      '#' + NS + '_panel .' + NS + '_actions{display:flex;gap:8px}',
      '#' + NS + '_panel .' + NS + '_btn{height:28px;padding:0 12px;border:1px solid #ddd;border-radius:14px;background:#fff;color:#555;font-size:12px;cursor:pointer}',
      '#' + NS + '_panel .' + NS + '_btn:hover{border-color:#ff4d7e;color:#ff4d7e}',
      '#' + NS + '_panel .' + NS + '_body{flex:1;overflow:auto;padding:12px 16px;color:#444}',
      '#' + NS + '_panel .' + NS + '_status{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}',
      '#' + NS + '_panel .' + NS + '_pill{padding:4px 10px;border-radius:12px;background:#fff;border:1px solid #ececf1;font-size:12px;color:#666}',
      '#' + NS + '_panel .' + NS + '_pill b{color:#333}',
      '#' + NS + '_panel .' + NS + '_pill.ok{border-color:#52c41a;color:#389e0d}',
      '#' + NS + '_panel .' + NS + '_pill.warn{border-color:#faad14;color:#d48806}',
      '#' + NS + '_panel .' + NS + '_dbgBar{display:flex;align-items:center;justify-content:space-between;margin:14px 0 6px}',
      '#' + NS + '_panel .' + NS + '_dbgTitle{font-size:13px;font-weight:600;color:#555}',
      '#' + NS + '_panel .' + NS + '_dbgCopy{height:24px;padding:0 12px;border:1px solid #ddd;border-radius:12px;background:#fff;color:#555;font-size:12px;cursor:pointer}',
      '#' + NS + '_panel .' + NS + '_dbgCopy:hover{border-color:#ff4d7e;color:#ff4d7e}',
      '#' + NS + '_panel .' + NS + '_debug{height:180px;overflow:auto;padding:8px 10px;border-radius:8px;background:#1e1e2e;color:#cdd6f4;font-family:Consolas,"Courier New",monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;word-break:break-all;user-select:text;-webkit-user-select:text}',
      '#' + NS + '_panel .' + NS + '_debug .' + NS + '_dtime{color:#6c7086;margin-right:4px}',
      '#' + NS + '_panel .' + NS + '_debug .' + NS + '_dtype{color:#ff9d5c;margin-right:6px}',
      '#' + NS + '_panel .' + NS + '_debug .' + NS + '_draw{color:#6c7086;font-size:11px;margin:2px 0 6px;word-break:break-all}',
      '#' + NS + '_panel .' + NS + '_test{margin-top:12px;display:flex;gap:8px;flex-wrap:wrap}',
      '#' + NS + '_panel .' + NS + '_test select{height:32px;padding:0 8px;border:1px solid #ddd;border-radius:16px;background:#fff;color:#555;font-size:13px;outline:none}',
      '#' + NS + '_panel .' + NS + '_test input{flex:1;min-width:80px;height:32px;padding:0 10px;border:1px solid #ddd;border-radius:16px;outline:none;font-size:13px}',
      '#' + NS + '_panel .' + NS + '_test button{height:32px;padding:0 16px;border:none;border-radius:16px;background:#ff4d7e;color:#fff;font-size:13px;cursor:pointer}',
      '#' + NS + '_panel .' + NS + '_setBar{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}',
      '#' + NS + '_panel .' + NS + '_setList{display:flex;flex-direction:column;gap:10px}',
      '#' + NS + '_panel .' + NS + '_setRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;background:#fff;border:1px solid #ececf1;border-radius:8px}',
      '#' + NS + '_panel .' + NS + '_setLabel{font-size:13px;color:#333;flex-shrink:0}',
      '#' + NS + '_panel .' + NS + '_setCtrl{flex-shrink:0}',
      '#' + NS + '_panel .' + NS + '_setCtrl input[type="text"],#' + NS + '_panel .' + NS + '_setCtrl input[type="number"],#' + NS + '_panel .' + NS + '_setCtrl select{height:30px;min-width:200px;padding:0 8px;border:1px solid #ddd;border-radius:8px;outline:none;font-size:13px;color:#333}',
      '#' + NS + '_panel .' + NS + '_setCtrl input[type="checkbox"]{width:18px;height:18px;cursor:pointer}'
    ].join('\n');
    var styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = css;
    (document.head || document.documentElement).appendChild(styleEl);
  }

  function buildFloatButton() {
    floatBtn = document.createElement('div');
    floatBtn.id = NS + '_float';
    floatBtn.title = '打开面板';
    floatBtn.textContent = '✦';
    document.body.appendChild(floatBtn);
    enableDrag(floatBtn);
  }

  // 拖动逻辑（鼠标 + 触摸，位移阈值区分 拖动/点击）
  function enableDrag(el) {
    var startX = 0, startY = 0, originLeft = 0, originTop = 0;
    var dragging = false, moved = false;
    var threshold = 5;

    function getPoint(e) {
      var t = e.touches ? e.touches[0] : null;
      return { x: t ? t.clientX : e.clientX, y: t ? t.clientY : e.clientY };
    }
    function onDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      var pt = getPoint(e);
      dragging = true; moved = false;
      startX = pt.x; startY = pt.y;
      originLeft = el.offsetLeft; originTop = el.offsetTop;
      el.classList.add('dragging');
      try {
        if (el.setPointerCapture && e.pointerId !== undefined) el.setPointerCapture(e.pointerId);
      } catch (err) { /* 忽略 */ }
      window.addEventListener('mousemove', onMove, { passive: false });
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);
      window.addEventListener('touchcancel', onUp);
    }
    function onMove(e) {
      if (!dragging) return;
      var pt = getPoint(e);
      var dx = pt.x - startX, dy = pt.y - startY;
      if (!moved && Math.abs(dx) + Math.abs(dy) > threshold) moved = true;
      if (!moved) return;
      if (e.preventDefault) e.preventDefault();
      var left = Math.max(0, Math.min(originLeft + dx, window.innerWidth - el.offsetWidth));
      var top = Math.max(0, Math.min(originTop + dy, window.innerHeight - el.offsetHeight));
      el.style.left = left + 'px';
      el.style.top = top + 'px';
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('dragging');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('touchcancel', onUp);
      if (!moved) openPanel();
    }
    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: false });
  }

  function buildPanel() {
    panel = document.createElement('div');
    panel.id = NS + '_panel';
    panel.innerHTML =
      '<div class="' + NS + '_header">' +
        '<button class="' + NS + '_back" title="返回">‹</button>' +
        '<div class="' + NS + '_title">IIROSE AI工具箱</div>' +
        '<div class="' + NS + '_actions">' +
          '<button class="' + NS + '_btn" id="' + NS + '_clear">清空</button>' +
          '<button class="' + NS + '_btn" id="' + NS + '_toggle">暂停记录</button>' +
          '<button class="' + NS + '_btn" id="' + NS + '_set">设置</button>' +
        '</div>' +
      '</div>' +
      '<div class="' + NS + '_body">' +
        '<div class="' + NS + '_view" id="' + NS + '_viewMain">' +
          '<div class="' + NS + '_status" id="' + NS + '_status"></div>' +
          '<div class="' + NS + '_dbgBar">' +
            '<div class="' + NS + '_dbgTitle">调试输出 · 收到的消息类型与内容</div>' +
            '<button class="' + NS + '_dbgCopy" id="' + NS + '_dbgCopy">复制</button>' +
          '</div>' +
          '<div class="' + NS + '_debug" id="' + NS + '_debug">等待接收消息…</div>' +
          '<div class="' + NS + '_test">' +
            '<select id="' + NS + '_sendType">' +
              '<option value="room">房间</option>' +
              '<option value="damaku">弹幕</option>' +
              '<option value="private">私聊</option>' +
            '</select>' +
            '<input id="' + NS + '_sendUid" placeholder="UID(私聊)" style="display:none" />' +
            '<input id="' + NS + '_input" placeholder="输入内容" />' +
            '<button id="' + NS + '_send">发送</button>' +
          '</div>' +
        '</div>' +
        '<div class="' + NS + '_view" id="' + NS + '_viewSettings" style="display:none">' +
          '<div class="' + NS + '_setBar">' +
            '<button class="' + NS + '_btn" id="' + NS + '_setBack">‹ 返回</button>' +
            '<button class="' + NS + '_btn" id="' + NS + '_setReset">恢复默认</button>' +
          '</div>' +
          '<div class="' + NS + '_setList" id="' + NS + '_setList"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(panel);

    panel.querySelector('.' + NS + '_back').addEventListener('click', closePanel);
    panel.querySelector('.' + NS + '_back').addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Enter') closePanel();
    });
    panel.querySelector('#' + NS + '_clear').addEventListener('click', clearDebug);
    panel.querySelector('#' + NS + '_toggle').addEventListener('click', function () {
      state.logEnabled = !state.logEnabled;
      this.textContent = state.logEnabled ? '暂停记录' : '恢复记录';
    });
    var sendBtn = panel.querySelector('#' + NS + '_send');
    var input = panel.querySelector('#' + NS + '_input');
    var sendUid = panel.querySelector('#' + NS + '_sendUid');
    var sendType = panel.querySelector('#' + NS + '_sendType');
    function refreshUid() {
      sendUid.style.display = sendType.value === 'private' ? '' : 'none';
    }
    sendType.addEventListener('change', refreshUid);
    sendBtn.addEventListener('click', doTestSend);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doTestSend();
    });
    sendUid.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doTestSend();
    });
    panel.querySelector('#' + NS + '_dbgCopy').addEventListener('click', copyDebug);
    panel.querySelector('#' + NS + '_set').addEventListener('click', function () { showView('settings'); });
    panel.querySelector('#' + NS + '_setBack').addEventListener('click', function () { showView('main'); });
    panel.querySelector('#' + NS + '_setReset').addEventListener('click', function () {
      resetSettings();
      renderSettings();
    });
  }

  // ===== 设置视图 =====
  function controlHtml(key, def) {
    if (def.type === 'boolean') {
      return '<input type="checkbox" data-key="' + key + '" />';
    }
    if (def.type === 'select') {
      var opts = (def.options || []).map(function (o) {
        return '<option value="' + escapeHtml(o) + '">' + escapeHtml(o) + '</option>';
      }).join('');
      return '<select data-key="' + key + '">' + opts + '</select>';
    }
    var attr = '';
    if (def.type === 'int' || def.type === 'float') {
      if (def.min !== undefined) attr += ' min="' + def.min + '"';
      if (def.max !== undefined) attr += ' max="' + def.max + '"';
      attr += def.type === 'int' ? ' step="1"' : ' step="any"';
    }
    var ph = def.placeholder ? ' placeholder="' + escapeHtml(def.placeholder) + '"' : '';
    var inputType = (def.type === 'int' || def.type === 'float') ? 'number' : (def.inputType || 'text');
    return '<input type="' + inputType + '" data-key="' + key + '"' + attr + ph + ' />';
  }

  function renderSettings() {
    if (!panel) return;
    var list = panel.querySelector('#' + NS + '_setList');
    if (!list) return;
    var html = '';
    Object.keys(SETTINGS).forEach(function (key) {
      var def = SETTINGS[key];
      html += '<div class="' + NS + '_setRow">' +
        '<div class="' + NS + '_setLabel">' + escapeHtml(def.label) + '</div>' +
        '<div class="' + NS + '_setCtrl">' + controlHtml(key, def) + '</div>' +
        '</div>';
    });
    list.innerHTML = html;
    // 绑定事件：修改即写入 localStorage
    Object.keys(SETTINGS).forEach(function (key) {
      var def = SETTINGS[key];
      var el = list.querySelector('[data-key="' + key + '"]');
      if (!el) return;
      if (def.type === 'boolean') {
        el.checked = !!settings[key];
        el.addEventListener('change', function () { setSetting(key, el.checked); });
      } else if (def.type === 'select') {
        el.value = settings[key];
        el.addEventListener('change', function () { setSetting(key, el.value); });
      } else if (def.type === 'int') {
        el.value = settings[key];
        el.addEventListener('change', function () { setSetting(key, parseInt(el.value, 10)); });
      } else if (def.type === 'float') {
        el.value = settings[key];
        el.addEventListener('change', function () { setSetting(key, parseFloat(el.value)); });
      } else {
        el.value = settings[key];
        el.addEventListener('change', function () { setSetting(key, el.value); });
      }
    });
  }

  // 切换 主视图 / 设置视图
  function showView(name) {
    if (!panel) return;
    var main = panel.querySelector('#' + NS + '_viewMain');
    var set = panel.querySelector('#' + NS + '_viewSettings');
    if (!main || !set) return;
    if (name === 'settings') {
      main.style.display = 'none';
      set.style.display = 'block';
      renderSettings();
    } else {
      set.style.display = 'none';
      main.style.display = 'block';
    }
  }

  // 复制调试输出内容到剪贴板
  function copyDebug() {
    if (!panel) return;
    var box = panel.querySelector('#' + NS + '_debug');
    if (!box) return;
    var text = box.innerText || box.textContent || '';
    var btn = panel.querySelector('#' + NS + '_dbgCopy');
    var flash = function () {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = '已复制';
      setTimeout(function () { btn.textContent = old; }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(flash, function () {
        fallbackCopy(text);
        flash();
      });
    } else {
      fallbackCopy(text);
      flash();
    }
  }

  // 剪贴板降级方案（旧浏览器 / 非 https）
  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) { /* 忽略 */ }
  }

  function renderStatus() {
    if (!panel) return;
    var box = panel.querySelector('#' + NS + '_status');
    if (!box) return;
    var win = getIIROSEWindow();
    var sock = state.socket;
    var ready = sock ? sock.readyState : -1;
    var readyText = ready === 1 ? 'OPEN' : (ready === 0 ? 'CONNECTING' : (ready === -1 ? '未找到' : 'CLOSED'));
    var room = (win && win.room) ? win.room : (win && win.rid) ? win.rid : '';

    box.innerHTML =
      '<span class="' + NS + '_pill ' + (sock ? 'ok' : 'warn') + '">Socket: <b>' + readyText + '</b></span>' +
      '<span class="' + NS + '_pill ' + (state.wrapped ? 'ok' : 'warn') + '">钩子: <b>' + (state.wrapped ? '已包装' : '未包装') + '</b></span>' +
      '<span class="' + NS + '_pill">UID: <b>' + escapeHtml(state.uid || '-') + '</b></span>' +
      '<span class="' + NS + '_pill">房间: <b>' + escapeHtml(room || '-') + '</b></span>' +
      '<span class="' + NS + '_pill">记录: <b>' + (state.logEnabled ? '开' : '关') + '</b></span>';
  }

  // 清空调试输出框
  function clearDebug() {
    if (!panel) return;
    var box = panel.querySelector('#' + NS + '_debug');
    if (!box) return;
    box.innerHTML = '等待接收消息…';
    box.__dbgInit = false;
  }

  // 定时清空调试信息，防止累积过多导致卡顿（间隔秒数可配置，0=关闭）
  function scheduleDebugClear() {
    var sec = getSetting('debug_clear_interval');
    if (sec && sec > 0) {
      setTimeout(function () {
        clearDebug();
        scheduleDebugClear();
      }, sec * 1000);
    } else {
      // 关闭状态：定期检查设置是否被打开
      setTimeout(scheduleDebugClear, 5000);
    }
  }

  function openPanel() {
    if (!panel) return;
    panel.classList.remove('out');
    panel.classList.add('show');
    renderStatus();
  }

  function closePanel() {
    if (!panel || !panel.classList.contains('show')) return;
    panel.classList.add('out');
    setTimeout(function () {
      panel.classList.remove('show', 'out');
    }, 200);
  }

  // 测试发送：按面板选择的类型调用发送 API（走被包装的 socket.send，可被钩子拦截）
  function doTestSend() {
    var input = panel.querySelector('#' + NS + '_input');
    var text = (input.value || '').trim();
    if (!text) { input.focus(); return; }
    var type = panel.querySelector('#' + NS + '_sendType').value;
    var uid = panel.querySelector('#' + NS + '_sendUid').value;
    var ok;
    if (type === 'damaku') ok = sendDanmaku(text);
    else if (type === 'private') ok = sendPrivate(uid, text);
    else ok = sendRoomMsg(text);
    if (!ok) debugWrite('out', { type: 'raw', text: '发送失败：socket 未连接' });
    input.value = '';
  }

  /* ================= 初始化 ================= */
  function init() {
    injectStyles();
    buildFloatButton();
    buildPanel();

    // 每次钩子触发时刷新状态（如收到消息）
    onHookEvent(function () { renderStatus(); });

    startPolling();
    scheduleDebugClear();

    console.log('[iirose_tool] 插件已加载：悬浮窗 + WebSocket 包装钩子');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
