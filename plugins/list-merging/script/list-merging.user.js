// ==UserScript==
// @name         AMQ List Merging
// @namespace    https://github.com/JJJJoe-Lin
// @version      0.2.1
// @author       JJJJoe
// @description  Merge multiple list to one
// @downloadURL  https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/list-merging/script/list-merging.user.js
// @updateURL    https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/list-merging/script/list-merging.user.js
// @include      /^https:\/\/animemusicquiz\.com\/(\?.*|#.*)?$/
// @include      https://animemusicquiz.com/amqToolbox/oauth2?*
// @connect      myanimelist.net
// @connect      anilist.co
// @connect      kitsu.io
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        window.close
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(" .amqtb-list-merging-tab i.fa-spinner{position:relative;left:5px} ");

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  class Container {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "name");
      __publicField(this, "container");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.name = opt.name;
      this.self = $(`<div></div>`).attr("id", id).addClass(cls);
      this.container = [];
    }
    push(...components) {
      this.splice(this.length, 0, ...components);
    }
    pop() {
      const ret = this.splice(-1, 1);
      return ret.length === 0 ? void 0 : ret[0];
    }
    at(idx) {
      return this.container.at(idx);
    }
    find(callbackFn) {
      return this.container.find(callbackFn);
    }
    get(name) {
      return this.find((elem) => elem.name === name);
    }
    splice(start, deleteCount, ...components) {
      for (let component of this.container) {
        this.detachComponent(component);
      }
      let deleted;
      if (deleteCount === void 0) {
        deleted = this.container.splice(start);
      } else {
        deleted = this.container.splice(start, deleteCount, ...components);
      }
      for (let component of this.container) {
        this.appendComponent(component);
      }
      return deleted;
    }
    clear() {
      return this.splice(0);
    }
    get length() {
      return this.container.length;
    }
    [Symbol.iterator]() {
      return this.container.values();
    }
    show() {
      this.self.show();
    }
    hide() {
      this.self.hide();
    }
    isVisible() {
      return this.self.is(":visible");
    }
    appendComponent(component) {
      this.self.append(component.self);
    }
    detachComponent(component) {
      component.self.detach();
    }
  }
  class Buttons extends Container {
    constructor(opt) {
      super(opt);
      this.self.addClass("amqtbButtonContainer");
    }
  }
  const SIZE_MAP$2 = {
    "large": "btn-lg",
    "normal": "",
    "small": "btn-sm"
  };
  class Modal extends Container {
    constructor(opt) {
      super(opt);
      __publicField(this, "contentBlock");
      __publicField(this, "components", this.container);
      const dialog = $(`<div class="modal-dialog" role="document"></div>`).addClass(SIZE_MAP$2[opt.size]);
      const content = $(`<div class="modal-content"></div>`);
      const header = $(`<div class="modal-header"></div>`);
      const title = $(`<h2 class="modal-title">${opt.title}</h2>`);
      const closeIcon = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`).append($(`<span aria-hidden="true">×</span>`));
      this.contentBlock = $(`<div class="modal-body"></div>`);
      this.self.addClass("modal fade").attr("tabindex", "-1").attr("role", "dialog").append(
        dialog.append(
          content.append(
            header.append(closeIcon, title)
          ).append(this.contentBlock)
        )
      );
      $("#gameContainer").append(this.self);
    }
    appendComponent(component) {
      this.contentBlock.append(component.self);
    }
    show() {
      this.self.modal("show");
    }
    hide() {
      this.self.modal("hide");
    }
  }
  class Tab extends Container {
    constructor(opt) {
      super(opt);
      __publicField(this, "content");
      __publicField(this, "components", this.container);
      const contentId = opt.contentId === void 0 ? "" : opt.contentId;
      const contentClass = opt.contentClass === void 0 ? "" : opt.contentClass;
      this.self.addClass("tab clickAble").append($(`<h5></h5>`).text(opt.tabName));
      this.content = $(`<div></div>`).attr("id", contentId).addClass(contentClass);
      this.content.hide();
    }
    appendComponent(component) {
      this.content.append(component.self);
    }
    hide() {
      super.hide();
      this.content.hide();
    }
  }
  const SIZE_MAP$1 = {
    "large": "btn-lg",
    "normal": "",
    "small": "btn-sm"
  };
  class TabModal extends Container {
    constructor(opt) {
      super(opt);
      __publicField(this, "contentBlock");
      __publicField(this, "tabBlock");
      __publicField(this, "tabs", this.container);
      __publicField(this, "curTab");
      const dialog = $(`<div class="modal-dialog" role="document"></div>`).addClass(SIZE_MAP$1[opt.size]);
      const content = $(`<div class="modal-content"></div>`);
      const header = $(`<div class="modal-header"></div>`);
      const title = $(`<h4 class="modal-title">${opt.title}</h4>`);
      const closeIcon = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`).append($(`<span aria-hidden="true">×</span>`));
      this.tabBlock = $(`<div class="tabContainer"></div>`);
      this.contentBlock = $(`<div class="modal-body"></div>`);
      this.self.addClass("modal fade tab-modal").attr("tabindex", "-1").attr("role", "dialog").append(
        dialog.append(
          content.append(
            header.append(closeIcon, title)
          ).append(this.tabBlock).append(this.contentBlock)
        )
      );
      this.curTab = null;
      $("#gameContainer").append(this.self);
    }
    push(...tabs) {
      super.push(...tabs);
      if (this.curTab === null && this.tabs.length > 0) {
        this.select(this.tabs[0]);
      }
    }
    pop() {
      const tab = super.pop();
      if (this.curTab === tab && this.tabs.length > 0) {
        this.select(this.tabs[0]);
      }
      return tab;
    }
    clear() {
      if (this.curTab) {
        this.curTab.self.removeClass("selected");
        this.curTab.content.hide();
      }
      this.curTab = null;
      return super.clear();
    }
    show() {
      this.self.modal("show");
    }
    hide() {
      this.self.modal("hide");
    }
    select(tab) {
      if (this.curTab) {
        this.curTab.self.removeClass("selected");
        this.curTab.content.hide();
      }
      tab.self.addClass("selected");
      tab.content.show();
      this.curTab = tab;
    }
    appendComponent(tab) {
      tab.self.on("click", () => {
        this.select(tab);
      });
      this.tabBlock.append(tab.self);
      this.contentBlock.append(tab.content);
    }
    detachComponent(tab) {
      tab.self.off("click");
      tab.self.detach();
      tab.content.detach();
    }
  }
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_removeValueChangeListener = /* @__PURE__ */ (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const attr = {
    expires: 365,
    Domain: "animemusicquiz.com",
    secure: true
  };
  function saveToCookie(key, entry) {
    Cookies.set(key, JSON.stringify(entry), attr);
  }
  function loadFromCookie(key, defaultVal) {
    let val = Cookies.get(key);
    if (val === void 0) {
      return defaultVal;
    } else {
      return JSON.parse(val);
    }
  }
  function saveToLocalStorage(key, entry) {
    localStorage.setItem(key, JSON.stringify(entry));
  }
  function loadFromLocalStorage(key, defaultVal) {
    const val = localStorage.getItem(key);
    if (val === null) {
      return defaultVal;
    } else {
      return JSON.parse(val);
    }
  }
  class TextInput {
    constructor(opt) {
      __publicField(this, "name");
      __publicField(this, "self");
      __publicField(this, "input");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      const inputType = opt.type === void 0 ? "text" : opt.type;
      const placeholder = opt.placeholder === void 0 ? "" : opt.placeholder;
      this.name = opt.name;
      this.self = $(`<div class='amqtbTextInput'></div>`).attr("id", id).addClass(cls);
      this.input = $(`<input type="${inputType}"></input>`).addClass("form-control input-sm").attr("placeholder", placeholder);
      this.self.append(this.input);
      if (opt.defaultValue !== void 0) {
        this.setValue(opt.defaultValue);
      }
    }
    setValue(val) {
      this.input.val(val);
    }
    getValue() {
      const ret = this.input.val();
      if (ret === void 0) {
        return "";
      } else {
        return ret.toString();
      }
    }
  }
  class SingleSelect {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "button");
      __publicField(this, "menu");
      __publicField(this, "label");
      __publicField(this, "choices");
      __publicField(this, "choice");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.self = $(`<div class="dropdown"></div>`).css("display", "inline-block").attr("id", id).addClass(cls);
      this.button = $(`<button type="button" data-toggle="dropdown"></button>`).addClass("btn btn-default dropdown-toggle");
      this.menu = $(`<ul class="dropdown-menu"></ul>`);
      this.label = opt.label;
      this.choices = [...opt.choices];
      for (let choice of this.choices) {
        const li = $(`<li></li>`);
        const a = $(`<a href="#"></a>`).text(choice.label);
        a.on("click", () => {
          this.setValue(choice.value);
        });
        this.menu.append(li.append(a));
      }
      this.self.append(this.button, this.menu);
      this.choice = this.choices.find((ch) => ch.value === opt.defaultValue);
      this.setValue(this.choice === void 0 ? void 0 : this.choice.value);
    }
    getValue() {
      return this.choice === void 0 ? void 0 : this.choice.value;
    }
    setValue(val) {
      this.choice = this.choices.find((ch) => ch.value === val);
      const label = this.choice === void 0 ? this.label : this.choice.label;
      this.button.text(`${label} `);
      this.button.append($(`<span class="caret"></span>`));
    }
  }
  class MultiSelect {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "button");
      __publicField(this, "menu");
      __publicField(this, "options");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.self = $(`<div class="amqtbMultiSelect dropdown"></div>`).css("display", "inline-block").attr("id", id).addClass(cls);
      this.button = $(`<button type="button" data-toggle="dropdown"></button>`).addClass("btn btn-default dropdown-toggle").text(`${opt.label} `);
      this.button.append($(`<span class="caret"></span>`));
      this.menu = $(`<ul class="dropdown-menu"></ul>`);
      this.options = [];
      for (let [idx, choice] of opt.choices.entries()) {
        const li = $(`<li></li>`);
        const a = $(`<a href="#"><input type="checkbox"> ${choice.label}</a>`);
        a.on("click", (e) => {
          this.toggle(idx, e.eventPhase === 2);
        });
        this.menu.append(li.append(a));
        this.options.push({ selected: false, value: choice.value });
      }
      this.self.append(this.button, this.menu);
      const value = opt.defaultValue === void 0 ? [] : opt.defaultValue;
      this.setValue(value);
    }
    getValue() {
      return this.options.filter((opt) => opt.selected).map((opt) => opt.value);
    }
    setValue(val) {
      for (let [idx, opt] of this.options.entries()) {
        if (opt.selected !== val.includes(opt.value)) {
          this.toggle(idx, true);
        }
      }
    }
    toggle(idx, toogleCheckbox) {
      const a = this.menu.find("li > a").eq(idx);
      this.options[idx].selected = !this.options[idx].selected;
      if (this.options[idx].selected) {
        a.addClass("selected");
        if (toogleCheckbox) {
          a.children("input").prop("checked", true);
        }
      } else {
        a.removeClass("selected");
        if (toogleCheckbox) {
          a.children("input").prop("checked", false);
        }
      }
    }
  }
  function toTitle(str) {
    let ret = str.replace(/[_].?/g, (letter) => letter.slice(1).toUpperCase());
    ret = ret.replace(/[A-Z]/g, (letter) => ` ${letter}`);
    ret = ret.charAt(0).toUpperCase() + ret.slice(1);
    return ret;
  }
  const SIZE_MAP = {
    "large": "btn-lg",
    "default": "",
    "normal": "btn",
    "small": "btn-sm",
    "extra-small": "btn-xs"
  };
  const STYLE_MAP = {
    "default": "btn-default",
    "primary": "btn-primary",
    "success": "btn-success",
    "info": "btn-info",
    "warning": "btn-warning",
    "danger": "btn-danger",
    "link": "btn-link"
  };
  class Button {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "name");
      __publicField(this, "_size");
      __publicField(this, "_style");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.self = $(`<button></button>`).attr("id", id).attr("type", "button").addClass(cls).addClass(SIZE_MAP[opt.size]).addClass(STYLE_MAP[opt.style]).text(opt.label);
      this.name = opt.name;
      this._size = SIZE_MAP[opt.size];
      this._style = STYLE_MAP[opt.style];
    }
    set size(size) {
      this.self.removeClass(this._size);
      this._size = SIZE_MAP[size];
      this.self.addClass(this._size);
    }
    set style(style2) {
      this.self.removeClass(this._style);
      this._style = STYLE_MAP[style2];
      this.self.addClass(this._style);
    }
    set label(text) {
      this.self.text(text);
    }
  }
  class Table {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "table");
      __publicField(this, "name");
      __publicField(this, "buttonBlock");
      __publicField(this, "saveIn");
      __publicField(this, "body");
      __publicField(this, "newRow");
      __publicField(this, "addOrDeletable");
      __publicField(this, "movable");
      __publicField(this, "savable");
      __publicField(this, "rows");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.name = opt.name;
      this.saveIn = opt.saveIn;
      this.newRow = opt.newRow;
      this.addOrDeletable = opt.addOrDeletable;
      this.movable = opt.movable;
      this.savable = opt.saveIn === void 0 ? false : true;
      this.rows = [];
      this.self = $(`<div class="row"></div>`).attr("id", id).addClass(cls);
      if (opt.title) {
        this.self.append($(`<h4 style="text-align: center;"><b>${opt.title}</b></h4>`));
      }
      const header = $(`<thead></thead>`);
      const headerRow = $(`<tr></tr>`);
      for (let fieldName of Object.keys(this.newRow())) {
        headerRow.append(`<th>${toTitle(fieldName)}</th>`);
      }
      if (opt.addOrDeletable || opt.movable) {
        headerRow.append(`<th></th>`);
      }
      header.append(headerRow);
      this.body = $(`<tbody></tbody>`);
      this.table = $(`<table class="table amqtbTable"></table>`).append(header).append(this.body);
      this.self.append($(`<div></div>`).append(this.table));
      const btns = [];
      if (this.addOrDeletable) {
        const btn = new Button({
          name: "add",
          label: "Add New",
          size: "small",
          style: "success"
        });
        btn.self.on("click", () => {
          this.append(this.createRow());
        });
        btns.push(btn);
      }
      if (this.savable) {
        const saveBtn = new Button({
          name: "save",
          label: "Save",
          size: "small",
          style: "success"
        });
        saveBtn.self.on("click", () => {
          this.save();
        });
        const resetBtn = new Button({
          name: "reset",
          label: "Reset",
          size: "small",
          style: "danger"
        });
        resetBtn.self.on("click", () => {
          this.load();
        });
        btns.push(saveBtn, resetBtn);
      }
      if (btns.length > 0) {
        this.buttonBlock = new Buttons({
          name: "tableButtons"
        });
        this.buttonBlock.push(...btns);
        this.self.append(this.buttonBlock.self);
      } else {
        this.buttonBlock = null;
      }
      if (opt.defaultValue !== void 0) {
        this.setValue(opt.defaultValue);
      }
      this.load();
    }
    createRow(data) {
      const newFields = this.newRow();
      const rowElem = $(`<tr></tr>`);
      for (let field of Object.keys(newFields)) {
        if (data) {
          newFields[field].setValue(data[field]);
        }
        rowElem.append($(`<td></td>`).append(newFields[field].self));
      }
      const row = {
        elem: rowElem,
        fields: newFields
      };
      const buttons = [];
      if (this.addOrDeletable) {
        const delBtn = new Button({
          label: "",
          name: "delBtn",
          size: "small",
          style: "danger"
        });
        delBtn.self.append($(`<i class="fa fa-trash" style="font-size: 15px;"></i>`)).on("click", () => {
          const idx = this.rows.findIndex((r) => r === row);
          if (idx !== -1) {
            this.splice(idx, 1);
          }
        });
        buttons.push(delBtn);
      }
      if (this.movable) {
        const upBtn = new Button({
          label: "",
          name: "upBtn",
          size: "small",
          style: "primary"
        });
        upBtn.self.append($(`<i class="fa fa-arrow-up" style="font-size: 15px;"></i>`)).on("click", () => {
          this.moveUp(row);
        });
        const downBtn = new Button({
          label: "",
          name: "downBtn",
          size: "small",
          style: "primary"
        });
        downBtn.self.append($(`<i class="fa fa-arrow-down" style="font-size: 15px;"></i>`)).on("click", () => {
          this.moveDown(row);
        });
        buttons.push(upBtn, downBtn);
      }
      if (buttons.length > 0) {
        const td = $(`<td></td>`).append(buttons.map((btn) => btn.self));
        rowElem.append(td);
      }
      return row;
    }
    append(row) {
      this.body.append(row.elem);
      this.rows.push(row);
    }
    splice(start, deleteCount, ...rows) {
      for (let row of this.rows) {
        row.elem.detach();
      }
      let deleted;
      if (deleteCount === void 0) {
        deleted = this.rows.splice(start);
      } else {
        deleted = this.rows.splice(start, deleteCount, ...rows);
      }
      for (let row of this.rows) {
        this.body.append(row.elem);
      }
      return deleted;
    }
    getButton(name) {
      if (this.buttonBlock) {
        return this.buttonBlock.find((btn) => btn.name === name);
      } else {
        return void 0;
      }
    }
    getValue() {
      let datas = [];
      for (let row of this.rows) {
        const data = Object.fromEntries(Object.entries(row.fields).map(([field, cp]) => {
          return [field, cp.getValue()];
        }));
        datas.push(data);
      }
      return datas;
    }
    setValue(datas) {
      this.splice(0);
      for (let data of datas) {
        this.splice(this.rows.length, 0, this.createRow(data));
      }
    }
    save() {
      switch (this.saveIn) {
        case "Script":
          _GM_setValue(this.name, this.getValue());
          break;
        case "LocalStorage":
          saveToLocalStorage(this.name, this.getValue());
          break;
        case "Cookie":
          saveToCookie(this.name, this.getValue());
          break;
      }
    }
    load() {
      let val;
      switch (this.saveIn) {
        case "Script":
          val = _GM_getValue(this.name);
          break;
        case "LocalStorage":
          val = loadFromLocalStorage(this.name);
          break;
        case "Cookie":
          val = loadFromCookie(this.name);
          break;
      }
      if (val !== void 0) {
        this.setValue(val);
      }
    }
    moveUp(row) {
      const idx = this.rows.findIndex((r) => r === row);
      if (idx > 0) {
        row.elem.detach();
        row.elem.insertBefore(this.rows[idx - 1].elem);
        [this.rows[idx], this.rows[idx - 1]] = [this.rows[idx - 1], this.rows[idx]];
      }
    }
    moveDown(row) {
      const idx = this.rows.findIndex((r) => r === row);
      if (idx > -1 && idx < this.rows.length - 1) {
        row.elem.detach();
        row.elem.insertAfter(this.rows[idx + 1].elem);
        [this.rows[idx], this.rows[idx + 1]] = [this.rows[idx + 1], this.rows[idx]];
      }
    }
  }
  const styles = ".amqtbButtonContainer {\n    display: flex;\n    flex-flow: row wrap;\n    justify-content: space-around;\n    align-content: space-around;\n    margin: 5px 0;\n}\n.amqtbButtonContainer button {\n    margin: 5px 0;\n}\n.amqtbWindow {\n    overflow-y: hidden;\n    top: 0px;\n    left: 0px;\n    margin: 0px;\n    background-color: #424242;\n    border: 1px solid rgba(27, 27, 27, 0.2);\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n    user-select: text;\n    display: none;\n}\n.draggableWindow {\n    cursor: move;\n}\n.amqtbWindowBody {\n    width: 100%;\n    overflow-y: auto;\n}\n.amqtbWindowContent {\n    width: 100%;\n    position: absolute;\n    top: 0px;\n}\n.amqtbWindow .close {\n    font-size: 32px;\n}\n.windowResizers {\n    width: 100%;\n    height: 100%;\n}\n.windowResizer {\n    width: 10px;\n    height: 10px;\n    position: absolute;\n    z-index: 100;\n}\n.windowResizer.top-left {\n    top: 0px;\n    left: 0px;\n    cursor: nwse-resize;\n}\n.windowResizer.top-right {\n    top: 0px;\n    right: 0px;\n    cursor: nesw-resize;\n}\n.windowResizer.bottom-left {\n    bottom: 0px;\n    left: 0px;\n    cursor: nesw-resize;\n}\n.windowResizer.bottom-right {\n    bottom: 0px;\n    right: 0px;\n    cursor: nwse-resize;\n}\n.customCheckboxContainer {\n    display: flex;\n}\n.customCheckboxContainer>div {\n    display: inline-block;\n    margin: 5px 0px;\n}\n.customCheckboxContainer>.customCheckboxContainerLabel {\n    margin-left: 5px;\n    margin-top: 5px;\n    font-weight: normal;\n}\n.amqtbRadio {\n    text-align: center;\n}\n.offset1 {\n    margin-left: 20px;\n}\n.offset2 {\n    margin-left: 40px;\n}\n.amqtbMultiSelect a.selected {\n    background-color: #4497ea;\n    color: #fff;\n}\n.amqtbTable {\n    border-collapse: separate;\n    padding: 0 15px;\n}\n.amqtbTable th, .amqtbTable td {\n    text-align: center;\n    vertical-align: middle !important;\n}\n.amqtbTable thead {\n    background-color: #000;\n}\n.amqtbTable tbody tr {\n    background-color: #424242 !important;\n}\n#qpToolboxContainer {\n  /* box size */\n  max-width: 215px;\n  min-width: 208px;\n  width: calc(100% + 30px);\n  border-radius: 5px;\n  padding-top: 5px;\n  padding-bottom: 5px;\n  /* position */\n  margin-top: 10px;\n  position: absolute;\n  left: 0px;\n  right: 0px;\n}\n#gameChatPage.nexusView #qpToolboxContainer {\n  position: relative; /* overwrite */\n  float: right;\n  pointer-events: initial;\n  clear: both;\n}\n#qpToolboxContainer h5 {\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n#amqtbSettingButton {\n  width: 30px;\n  height: 100%;\n}\n#qpAvatarRow {\n  width: 80%;\n}\n#gameChatPage.nexusView #qpAvatarRow {\n  width: 70%;  /* overwrite */\n  margin-left: 25%;\n  margin-right: 5%;\n}\n.collapsible:hover {\n  background-color: #555;\n}\n.amqtbPluginManageTableEnabledCell {\n  position: relative;\n  top: -10px;\n  left: -25px;\n  display: inline-block;\n}";
  class View {
    constructor(opt) {
      __publicField(this, "self");
      this.self = $(`<div class="row"></div>`);
      const header = $(`<h5 class="collapsible"></h5>`).text(opt.title);
      header.on("click", function() {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.display === "") {
          content.style.display = "none";
        } else {
          content.style.display = "";
        }
      });
      this.self.append(header, opt.content);
    }
  }
  class ViewBlock extends Container {
    constructor(opt) {
      super(opt);
      this.self.attr("id", "qpToolboxContainer").addClass("container floatingContainer");
    }
  }
  class Text {
    constructor() {
      __publicField(this, "self");
      this.self = $(`<p></p>`);
    }
    setValue(val) {
      this.self.text(val);
    }
    getValue() {
      return this.self.text();
    }
  }
  class Switch {
    constructor() {
      __publicField(this, "self");
      __publicField(this, "switch");
      __publicField(this, "switchOn");
      __publicField(this, "switchOff");
      this.switchOff = $(`<div class="switchOff slider-tick round"></div>`);
      this.switchOn = $(`<div class="switchOn slider-tick round"></div>`);
      this.switch = $(`<div class="switchContainer slider-track"></div>`).append(
        $(`<div class="slider-tick-container"></div>`).append(this.switchOff).append(this.switchOn)
      );
      this.self = $(`<div></div>`).addClass(`amqtbPluginManageTableEnabledCell`).append(this.switch);
      this.switch.on("click", () => {
        this.setValue(!this.getValue());
      });
    }
    setValue(val) {
      if (val) {
        this.switchOn.show();
        this.switchOff.hide();
        this.switch.addClass("active");
      } else {
        this.switchOn.hide();
        this.switchOff.show();
        this.switch.removeClass("active");
      }
    }
    getValue() {
      return this.switch.hasClass("active");
    }
  }
  class Toolbox {
    constructor() {
      __publicField(this, "viewBlock");
      __publicField(this, "settingModal");
      __publicField(this, "optionTab");
      __publicField(this, "manageModal");
      __publicField(this, "pluginTable");
      __publicField(this, "prevPluginsInfo");
      __publicField(this, "plugins");
      this.plugins = /* @__PURE__ */ new Map();
      this.viewBlock = new ViewBlock({});
      this.viewBlock.self.insertBefore(`#qpCheatTestCommands`);
      this.optionTab = new Tab({
        tabName: "Option",
        contentClass: "row"
      });
      this.settingModal = new TabModal({
        title: "Toolbox Setting",
        id: "amqtbSettingModal",
        size: "normal"
      });
      this.settingModal.self.on("shown.bs.modal", () => {
        for (let plugin of this.plugins.values()) {
          if (plugin.enabled() && plugin.options) {
            plugin.options.refresh();
          }
        }
      });
      $("#gameContainer").append(this.settingModal.self);
      this.settingModal.push(this.optionTab);
      const settingBtn = {
        self: $(`<div></div>`).attr("id", "amqtbSettingButton").addClass("clickAble qpOption").append($(`<i></i>`).addClass("fa fa-wrench").addClass("qpMenuItem").attr("aria-hidden", "true")).on("click", () => {
          this.settingModal.self.modal("show");
        }).popover({
          placement: "bottom",
          content: "Toolbox Setting",
          trigger: "hover"
        })
      };
      const oldWidth = $("#qpOptionContainer").width();
      $("#qpOptionContainer").width(oldWidth + 35);
      $("#qpOptionContainer > div").append(settingBtn.self);
      this.manageModal = new Modal({
        title: "Toolbox Management",
        id: "amqtbManageModal",
        size: "normal"
      });
      this.pluginTable = new Table({
        name: "amqtbPluginManageTable",
        addOrDeletable: false,
        movable: true,
        saveIn: "LocalStorage",
        newRow: () => ({
          pluginName: new Text(),
          enabled: new Switch()
        })
      });
      this.manageModal.push(this.pluginTable);
      const saveBtn = this.pluginTable.getButton("save");
      saveBtn.self.on("click", () => {
        console.log("[Toolbox] Reload plugins");
        this.reload();
        this.manageModal.hide();
      });
      this.prevPluginsInfo = this.pluginTable.getValue();
      this.pluginTable.splice(0);
      this.pluginTable.save();
      $("#optionsContainer > ul").prepend(
        $(`<li class="clickAble" data-toggle="modal" data-target="#amqtbManageModal"></li>`).text("Plugins")
      );
      $("#optionsContainer > ul").prepend(
        $(`<li class="clickAble" data-toggle="modal" data-target="#amqtbSettingModal"></li>`).text("Toolbox Setting")
      );
      _GM_addStyle(styles);
      console.log("New AMQ Toolbox created");
    }
    addPlugin(plugin) {
      if (plugin.dependencies && !this.checkDependency(plugin.dependencies)) {
        throw new Error("Dependencies has not loaded");
      }
      this.plugins.set(plugin.name, plugin);
      const prevOrder = this.prevPluginsInfo.findIndex((info) => info.pluginName === plugin.name);
      if (prevOrder !== -1) {
        if (this.prevPluginsInfo[prevOrder].enabled) {
          plugin.enable();
        } else {
          plugin.disable();
        }
      }
      const pluginInfos = this.pluginTable.getValue();
      const newRow = this.pluginTable.createRow({
        pluginName: plugin.name,
        enabled: plugin.enabled()
      });
      let insertIdx = pluginInfos.length;
      if (prevOrder !== -1) {
        for (let [idx, pluginInfo] of pluginInfos.entries()) {
          const order = this.prevPluginsInfo.findIndex((info) => info.pluginName === pluginInfo.pluginName);
          if (order === -1 || prevOrder < order) {
            insertIdx = idx;
            break;
          }
        }
      }
      if (insertIdx === pluginInfos.length) {
        this.pluginTable.append(newRow);
      } else {
        this.pluginTable.splice(insertIdx, 0, newRow);
      }
      this.pluginTable.save();
      this.reload();
      console.log(`[Toolbox] Register plugin: ${plugin.name}`);
    }
    reload() {
      this.viewBlock.clear();
      this.optionTab.clear();
      this.settingModal.clear();
      this.settingModal.push(this.optionTab);
      const pluginInfos = this.pluginTable.getValue();
      for (let pluginInfo of pluginInfos) {
        const plugin = this.plugins.get(pluginInfo.pluginName);
        if (plugin === void 0) {
          console.error(`plugins:`, this.plugins, `table:`, pluginInfos);
          throw new Error(`Reload Error`);
        }
        if (pluginInfo.enabled) {
          plugin.enable();
          if (plugin.view) {
            this.viewBlock.push(new View({
              title: plugin.name,
              content: plugin.view.self
            }));
          }
          if (plugin.options) {
            this.optionTab.push(plugin.options);
          }
          if (plugin.settingTab) {
            this.settingModal.push(plugin.settingTab);
          }
        } else {
          plugin.disable();
        }
      }
    }
    checkDependency(dps) {
      let pluginNames = [...this.plugins.keys()];
      dps.forEach((dp) => {
        if (!pluginNames.includes(dp)) {
          return false;
        }
      });
      return true;
    }
  }
  function onStartPageLoaded(callback) {
    if (document.getElementById("startPage"))
      return;
    const loadInterval = setInterval(() => {
      if ($("#loadingScreen").hasClass("hidden")) {
        clearInterval(loadInterval);
        callback();
      }
    }, 500);
  }
  function registerPlugin(plugin) {
    try {
      onStartPageLoaded(() => {
        if (_unsafeWindow.amqToolbox === void 0) {
          _unsafeWindow.amqToolbox = new Toolbox();
        }
        _unsafeWindow.amqToolbox.addPlugin(plugin);
      });
    } catch (err) {
      console.error(`[registerPlugin] Failed to register ${plugin.name}`, err);
    }
  }
  const authCodeKeyName = "authorizationCode";
  function authoriationRequest(authURL) {
    return new Promise((resolve, reject) => {
      _GM_setValue(authCodeKeyName, "");
      const tab = _GM_openInTab(authURL, { active: true, setParent: true });
      const listenerID = _GM_addValueChangeListener(authCodeKeyName, (_, __, newValue) => {
        tab.close();
        resolve(newValue);
      });
      tab.onclose = () => {
        if (_GM_getValue(authCodeKeyName) === "") {
          resolve(new Error("Authoriation Request failed"));
        }
        _GM_removeValueChangeListener(listenerID);
        _GM_deleteValue(authCodeKeyName);
      };
    });
  }
  function redirectURLHandler() {
    const path2 = new URL(document.URL);
    const authCode = path2.searchParams.get("code");
    if (_GM_getValue(authCodeKeyName, void 0) !== void 0) {
      if (authCode) {
        _GM_setValue(authCodeKeyName, authCode);
      } else {
        window.close();
      }
    }
  }
  function async_GM_xmlhttpRequest(details) {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        ...details,
        onload: (response) => {
          resolve(response);
        },
        onerror: (err) => {
          console.error(`Request for ${details.url} error:`, err);
          resolve(null);
        },
        ontimeout: () => {
          console.error(`Request for ${details.url} timeout`);
          resolve(null);
        }
      });
    });
  }
  async function asyncWait(ms) {
    return new Promise((resolve, _) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
  const ToGlobalStatus$2 = {
    "watching": "Watching",
    "completed": "Completed",
    "on_hold": "On-Hold",
    "dropped": "Dropped",
    "plan_to_watch": "Plan to Watch"
  };
  const ToLocalStatus$2 = {
    "Watching": "watching",
    "Completed": "completed",
    "On-Hold": "on_hold",
    "Dropped": "dropped",
    "Plan to Watch": "plan_to_watch"
  };
  const ToGlobalSeriesType$2 = {
    "unknown": "Unknown",
    "tv": "TV",
    "ova": "OVA",
    "movie": "Movie",
    "special": "Special",
    "ona": "ONA",
    "music": "Music"
  };
  class MyAnimeListFactory {
    getInstance() {
      return new MyAnimeList();
    }
  }
  class MyAnimeList {
    // ms
    constructor() {
      __publicField(this, "user");
      __publicField(this, "PKCECode");
      __publicField(this, "PKCEMethod", "plain");
      __publicField(this, "clientID", "9c9b61db4efa44f989cf3dea37bff94d");
      __publicField(this, "clientSecret", "c6593a0dbbe8eb2ee8e15b59a62e04fe35989c6d2f11ce18aa1e108660e2aac2");
      __publicField(this, "authBaseURL", "https://myanimelist.net/v1/oauth2/authorize");
      __publicField(this, "tokenBaseURL", "https://myanimelist.net/v1/oauth2/token");
      __publicField(this, "redirectURL", "https://animemusicquiz.com/amqToolbox/oauth2");
      __publicField(this, "reqDelay", 10);
      this.user = null;
      this.PKCECode = window.btoa(Math.random().toFixed(16).toString()) + window.btoa(Math.random().toFixed(16).toString());
    }
    async login(opt) {
      if (opt.grantTypes !== "Authorization Code") {
        return new Error("Not supported grant type");
      }
      if (!this.logined()) {
        const authReqParam = new URLSearchParams({
          response_type: "code",
          client_id: this.clientID,
          redirect_uri: this.redirectURL,
          code_challenge: this.PKCECode,
          code_challenge_method: this.PKCEMethod
        });
        const authCode = await authoriationRequest(`${this.authBaseURL}?${authReqParam.toString()}`);
        if (authCode instanceof Error) {
          return authCode;
        }
        const clientAuth = window.btoa(`${this.clientID}:${this.clientSecret}`);
        const authGrantData = new URLSearchParams({
          client_id: this.clientID,
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: this.redirectURL,
          code_verifier: this.PKCECode
        });
        const authGrantResp = await async_GM_xmlhttpRequest({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${clientAuth}`
          },
          url: this.tokenBaseURL,
          data: authGrantData.toString()
        });
        if (authGrantResp === null || authGrantResp.status !== 200) {
          console.log(authGrantResp);
          return new Error("Authoriation Grant failed");
        }
        const token = JSON.parse(authGrantResp.responseText);
        token.expires_in = Date.now() + (token.expires_in - 86400) * 1e3;
        _GM_setValue("MyAnimeList_accessToken", token);
      }
      return null;
    }
    async logout() {
      this.user = null;
      _GM_deleteValue("MyAnimeList_accessToken");
      return null;
    }
    logined() {
      const token = _GM_getValue("MyAnimeList_accessToken");
      if (token && Date.now() < token.expires_in) {
        return true;
      } else {
        return false;
      }
    }
    async getMyInfo() {
      if (this.user) {
        return this.user;
      } else {
        const user = await this.getUser();
        if (user instanceof Error) {
          return user;
        }
        this.user = {
          id: user.id,
          name: user.name
        };
        return this.user;
      }
    }
    async updateAnime(id, status) {
      const token = await this.getToken();
      if (token instanceof Error) {
        return token;
      }
      const query2 = `https://api.myanimelist.net/v2/anime/${id}/my_list_status`;
      const data = new URLSearchParams({
        status: ToLocalStatus$2[status]
      });
      const resp = await async_GM_xmlhttpRequest({
        method: "PATCH",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${token.access_token}`
        },
        url: query2,
        data: data.toString()
      });
      if (resp === null || resp.status !== 200) {
        console.log(resp);
        return new Error(`Query failed: ${query2}`);
      }
      return null;
    }
    async deleteAnime(id) {
      const token = await this.getToken();
      if (token instanceof Error) {
        return token;
      }
      const query2 = `https://api.myanimelist.net/v2/anime/${id}/my_list_status`;
      const resp = await async_GM_xmlhttpRequest({
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token.access_token}`
        },
        url: query2
      });
      if (resp === null || resp.status !== 200) {
        console.log(resp);
        return new Error(`Query failed: ${query2}`);
      }
      return null;
    }
    async getList(user, statuses) {
      if (!("name" in user)) {
        return new Error("Only support getting list by username");
      }
      const malStatuses = statuses.map((stat) => ToLocalStatus$2[stat]);
      let headers;
      let query2;
      let selfName = void 0;
      const myInfo = await this.getMyInfo();
      if (!(user instanceof Error)) {
        selfName = myInfo.name;
      }
      if (user.name === selfName) {
        const token = await this.getToken();
        if (token instanceof Error) {
          return token;
        }
        headers = {
          "Authorization": `Bearer ${token.access_token}`
        };
        query2 = `https://api.myanimelist.net/v2/users/@me/animelist`;
      } else {
        headers = {
          "X-MAL-CLIENT-ID": this.clientID
        };
        query2 = `https://api.myanimelist.net/v2/users/${user.name}/animelist`;
      }
      query2 += `?` + new URLSearchParams({
        fields: `list_status,media_type,num_episodes`,
        limit: "1000",
        nsfw: "true"
      });
      const ret = [];
      do {
        const resp = await async_GM_xmlhttpRequest({
          method: "GET",
          headers,
          url: query2
        });
        if (resp === null || resp.status !== 200) {
          console.log(resp);
          return new Error(`Query failed: ${query2}`);
        }
        const respData = JSON.parse(resp.responseText);
        for (let entry of respData.data) {
          if (malStatuses.includes(entry.list_status.status)) {
            ret.push({
              malID: entry.node.id,
              status: ToGlobalStatus$2[entry.list_status.status],
              title: entry.node.title,
              type: ToGlobalSeriesType$2[entry.node.media_type],
              updateOnImport: true,
              numEpisodes: entry.node.num_episodes
            });
          }
        }
        query2 = respData.paging.next;
      } while (query2);
      return ret;
    }
    async importList(entries, overwrite) {
      if (!this.logined()) {
        return new Error("Not logined");
      }
      if (overwrite) {
        const err = await this.deleteList(["Completed", "Dropped", "On-Hold", "Plan to Watch", "Watching"]);
        if (err) {
          return err;
        }
        console.log("[importList] delete all entries successfully");
      }
      const reqs = [];
      for (let entry of entries) {
        await asyncWait(this.reqDelay);
        reqs.push(this.updateAnime(entry.malID, entry.status));
      }
      let retry = 3;
      while (retry--) {
        const errs = await Promise.all(reqs);
        let count = 0;
        for (let [idx, err] of errs.entries()) {
          if (err) {
            console.warn(`Anime "${entries[idx].title}" update failed:`, err);
            count++;
            if (retry > 0) {
              await asyncWait(this.reqDelay);
              reqs[idx] = this.updateAnime(entries[idx].malID, entries[idx].status);
            }
          }
        }
        if (count === 0) {
          console.log(`[importList] all animes are updated`);
          break;
        } else if (retry === 0) {
          return new Error(`${count} animes are not updated`);
        } else {
          console.log(`[importList] ${count} entries are not updated, retry...`);
        }
      }
      return null;
    }
    async deleteList(statuses) {
      const user = await this.getMyInfo();
      if (user instanceof Error) {
        return user;
      }
      let retry = 3;
      while (retry--) {
        const entries = await this.getList({ name: user.name }, statuses);
        if (entries instanceof Error) {
          return entries;
        }
        console.log(`[deleteList] get ${statuses} entries successfully`, entries);
        const count = entries.length;
        if (count === 0) {
          console.log(`[deleteList] all entries are deleted`);
          break;
        } else if (retry === 0) {
          return new Error(`Some ${count} entries are not deleted`);
        } else {
          console.log(`[deleteList] ${count} entries are ready to delete`);
        }
        const reqs = [];
        for (let entry of entries) {
          await asyncWait(this.reqDelay);
          reqs.push(this.deleteAnime(entry.malID));
        }
        const errs = await Promise.all(reqs);
        for (let [idx, err] of errs.entries()) {
          if (err) {
            console.warn(`Anime "${entries[idx].title}" delete failed:`, err);
          }
        }
      }
      return null;
    }
    async getUser() {
      const token = await this.getToken();
      if (token instanceof Error) {
        return token;
      }
      const query2 = `https://api.myanimelist.net/v2/users/@me`;
      const resp = await async_GM_xmlhttpRequest({
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token.access_token}`
        },
        url: query2
      });
      if (resp === null || resp.status !== 200) {
        console.log(resp);
        return new Error(`Query failed: ${query2}`);
      }
      const user = JSON.parse(resp.responseText);
      return {
        id: user.id,
        name: user.name
      };
    }
    async refreshToken() {
      const oldToken = _GM_getValue("MyAnimeList_accessToken");
      if (oldToken === void 0) {
        return new Error("No token to refresh");
      }
      const clientAuth = window.btoa(`${this.clientID}:${this.clientSecret}`);
      const data = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: oldToken.refresh_token
      });
      const resp = await async_GM_xmlhttpRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${clientAuth}`
        },
        url: this.tokenBaseURL,
        data: data.toString()
      });
      if (resp === null || resp.status !== 200) {
        return new Error("Refresh token failed");
      }
      const newToken = JSON.parse(resp.responseText);
      newToken.expires_in = Date.now() + (newToken.expires_in - 86400) * 1e3;
      _GM_setValue("MyAnimeList_accessToken", newToken);
      return newToken;
    }
    async getToken() {
      const token = _GM_getValue("MyAnimeList_accessToken");
      if (token === void 0) {
        return new Error("Not logined");
      } else if (Date.now() > token.expires_in) {
        return this.refreshToken();
      } else {
        return token;
      }
    }
  }
  const ToGlobalStatus$1 = {
    "CURRENT": "Watching",
    "COMPLETED": "Completed",
    "PAUSED": "On-Hold",
    "DROPPED": "Dropped",
    "PLANNING": "Plan to Watch"
  };
  const ToLocalStatus$1 = {
    "Watching": "CURRENT",
    "Completed": "COMPLETED",
    "On-Hold": "PAUSED",
    "Dropped": "DROPPED",
    "Plan to Watch": "PLANNING"
  };
  const ToGlobalSeriesType$1 = {
    "MANGA": "Unknown",
    "MOVIE": "Movie",
    "MUSIC": "Music",
    "NOVEL": "Unknown",
    "ONA": "ONA",
    "ONE_SHOT": "Unknown",
    "OVA": "OVA",
    "SPECIAL": "Special",
    "TV": "TV",
    "TV_SHORT": "TV"
  };
  class AniListFactory {
    getInstance() {
      return new AniList();
    }
  }
  class AniList {
    constructor() {
      __publicField(this, "user");
      __publicField(this, "clientID", "8357");
      __publicField(this, "clientSecret", "H7r1aJRh6XEnTnGZdqhd7WJIVklt622sYeR53syl");
      __publicField(this, "authBaseURL", "https://anilist.co/api/v2/oauth/authorize");
      __publicField(this, "tokenBaseURL", "https://anilist.co/api/v2/oauth/token");
      __publicField(this, "redirectURL", "https://animemusicquiz.com/amqToolbox/oauth2");
      this.user = null;
    }
    async login(opt) {
      if (opt.grantTypes !== "Authorization Code") {
        return new Error("Not supported grant type");
      }
      if (!this.logined()) {
        const authReqParam = new URLSearchParams({
          response_type: "code",
          client_id: this.clientID,
          redirect_uri: this.redirectURL
        });
        const authCode = await authoriationRequest(`${this.authBaseURL}?${authReqParam.toString()}`);
        if (authCode instanceof Error) {
          return authCode;
        }
        window.btoa(`${this.clientID}:${this.clientSecret}`);
        const authGrantData = {
          client_id: this.clientID,
          client_secret: this.clientSecret,
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: this.redirectURL
        };
        const authGrantResp = await async_GM_xmlhttpRequest({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          url: this.tokenBaseURL,
          data: JSON.stringify(authGrantData)
        });
        if (authGrantResp === null || authGrantResp.status !== 200) {
          if (authGrantResp !== null) {
            console.log(authGrantResp);
          }
          return new Error(`Authoriation Grant failed`);
        }
        const token = JSON.parse(authGrantResp.responseText);
        token.expires_in = Date.now() + (token.expires_in - 86400) * 1e3;
        _GM_setValue("AniList_accessToken", token);
      }
      return null;
    }
    async logout() {
      this.user = null;
      _GM_deleteValue("AniList_accessToken");
      return null;
    }
    logined() {
      const token = _GM_getValue("AniList_accessToken");
      if (token && Date.now() < token.expires_in) {
        return true;
      } else {
        return false;
      }
    }
    async getMyInfo() {
      if (!this.logined()) {
        return new Error("Not logined");
      }
      if (this.user) {
        return this.user;
      } else {
        const user = await this.getUser();
        if (user instanceof Error) {
          return user;
        }
        this.user = {
          id: user.id,
          name: user.name
        };
        return this.user;
      }
    }
    async updateAnime(id, status) {
      return this.updateAnimes([{ id, status }]);
    }
    async deleteAnime(id) {
      const user = await this.getMyInfo();
      if (user instanceof Error) {
        return user;
      }
      const entry = await this.getEntry(user.name, id);
      if (entry instanceof Error) {
        return entry;
      }
      return this.deleteEntries([entry.id]);
    }
    async getList(user, statuses) {
      const entries = await this.getEntries(user, statuses);
      if (entries instanceof Error) {
        return entries;
      }
      return entries.map((entry) => entry.media);
    }
    async importList(entries, overwrite) {
      if (overwrite) {
        const err = await this.deleteList(["Completed", "Dropped", "On-Hold", "Plan to Watch", "Watching"]);
        if (err) {
          return err;
        }
        console.log("[importList] delete all entries successfully");
      }
      const ids = await this.getIds(entries);
      if (ids instanceof Error) {
        return ids;
      }
      console.log("[importList] get AniList IDs successfully", ids);
      const animes = entries.map((entry, idx) => {
        return {
          id: ids[idx],
          status: entry.status
        };
      });
      return this.updateAnimes(animes);
    }
    async deleteList(statuses) {
      const user = await this.getMyInfo();
      if (user instanceof Error) {
        return user;
      }
      const entries = await this.getEntries({ name: user.name }, statuses);
      if (entries instanceof Error) {
        return entries;
      }
      console.log(`[deleteList] get ${statuses} entries successfully`, entries);
      return this.deleteEntries(entries.map((entry) => entry.id));
    }
    async getUser() {
      const token = await this.getToken();
      if (token instanceof Error) {
        return token;
      }
      const data = {
        query: `mutation getUser {
                UpdateUser {
                    id
                    name
                }
            }`,
        variables: {}
      };
      const resp = await async_GM_xmlhttpRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token.access_token}`
        },
        url: "https://graphql.anilist.co",
        data: JSON.stringify(data)
      });
      if (resp === null || resp.status !== 200) {
        return new Error(`Query failed: ${data.query}`);
      }
      const user = JSON.parse(resp.responseText).data.UpdateUser;
      return {
        id: user.id,
        name: user.name
      };
    }
    async refreshToken() {
      const oldToken = _GM_getValue("AniList_accessToken");
      if (oldToken === void 0) {
        return new Error("No token to refresh");
      }
      const data = {
        client_id: this.clientID,
        client_secret: this.clientSecret,
        grant_type: "refresh_token",
        refresh_token: oldToken.refresh_token
      };
      const resp = await async_GM_xmlhttpRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        url: this.tokenBaseURL,
        data: JSON.stringify(data)
      });
      if (resp === null || resp.status !== 200) {
        console.log(resp);
        return new Error("Refresh token failed");
      }
      const newToken = JSON.parse(resp.responseText);
      newToken.expires_in = Date.now() + (newToken.expires_in - 86400) * 1e3;
      _GM_setValue("AniList_accessToken", newToken);
      return newToken;
    }
    async getToken() {
      const token = _GM_getValue("AniList_accessToken");
      if (token === void 0) {
        return new Error("Not logined");
      } else if (Date.now() > token.expires_in) {
        return this.refreshToken();
      } else {
        return token;
      }
    }
    async getEntry(userName, animeId) {
      const data = {
        query: `query getEntry ($mediaId: Int, $userName: String) {
                query: MediaList (userName: $userName, mediaId: $mediaId) {
                    id
                    status
                    media {
                        id
                        idMal
                        title {
                            romaji
                        }
                        format
                        episodes
                    }
                    user {
                        id
                        name
                    }
                }
            }`,
        variables: {
          userName,
          mediaId: animeId
        }
      };
      const resp = await async_GM_xmlhttpRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        url: "https://graphql.anilist.co",
        data: JSON.stringify(data)
      });
      if (resp === null || resp.status !== 200) {
        console.log(resp);
        return new Error(`Query failed: ${data.query}`);
      }
      const entry = JSON.parse(resp.responseText).data.query;
      return {
        id: entry.id,
        media: {
          malID: entry.media.idMal,
          status: ToGlobalStatus$1[entry.status],
          title: entry.media.title.romaji,
          type: ToGlobalSeriesType$1[entry.media.format],
          updateOnImport: true,
          numEpisodes: entry.media.episodes
        }
      };
    }
    async getEntries(user, statuses) {
      const stats = statuses.map((stat) => ToLocalStatus$1[stat]);
      let varStr;
      let paramStr;
      let variables;
      if ("id" in user) {
        varStr = "($userId: Int, $statuses: [MediaListStatus])";
        paramStr = "(userId: $userId, type: ANIME, status_in: $statuses)";
        variables = {
          userId: user.id,
          statuses: stats
        };
      } else {
        varStr = "($userName: String, $statuses: [MediaListStatus])";
        paramStr = "(userName: $userName, type: ANIME, status_in: $statuses)";
        variables = {
          userName: user.name,
          statuses: stats
        };
      }
      const data = {
        query: `query getList ${varStr} {
                query: MediaListCollection ${paramStr} {
                    lists {
                        entries {
                            id
                            status
                            media {
                                id
                                idMal
                                title {
                                    romaji
                                }
                                format
                                episodes
                            }
                        }
                    }
                    user {
                        id
                        name
                    }
                }
            }`,
        variables
      };
      const resp = await async_GM_xmlhttpRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        url: "https://graphql.anilist.co",
        data: JSON.stringify(data)
      });
      if (resp === null || resp.status !== 200) {
        console.log(resp);
        return new Error(`Query failed: ${data.query}`);
      }
      const lists = JSON.parse(resp.responseText).data.query.lists;
      const ret = [];
      for (let list of lists) {
        for (let entry of list.entries) {
          ret.push({
            id: entry.id,
            media: {
              malID: entry.media.idMal,
              status: ToGlobalStatus$1[entry.status],
              title: entry.media.title.romaji,
              type: ToGlobalSeriesType$1[entry.media.format],
              updateOnImport: true,
              numEpisodes: entry.media.episodes
            }
          });
        }
      }
      return ret;
    }
    async updateAnimes(animes) {
      const token = await this.getToken();
      if (token instanceof Error) {
        return token;
      }
      const queryNumLimit = 250;
      const data = {
        query: `mutation addAnimes {`,
        variables: {}
      };
      for (let [idx, anime] of animes.entries()) {
        data.query += `q${idx}: SaveMediaListEntry (mediaId: ${anime.id}, status: ${ToLocalStatus$1[anime.status]}) {
                id
            }`;
        if ((idx + 1) % queryNumLimit === 0 || idx === animes.length - 1) {
          data.query += `}`;
          const resp = await async_GM_xmlhttpRequest({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token.access_token}`
            },
            url: "https://graphql.anilist.co",
            data: JSON.stringify(data)
          });
          if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Query failed: ${data.query}`);
          }
          data.query = `mutation addAnimes {`;
        }
      }
      return null;
    }
    async deleteEntries(ids) {
      const token = await this.getToken();
      if (token instanceof Error) {
        return token;
      }
      const queryNumLimit = 250;
      const data = {
        query: `mutation delEntries {`,
        variables: {}
      };
      for (let [idx, id] of ids.entries()) {
        data.query += `q${idx}: DeleteMediaListEntry (id: ${id}) {
                deleted
            }`;
        if ((idx + 1) % queryNumLimit === 0 || idx === ids.length - 1) {
          data.query += `}`;
          const resp = await async_GM_xmlhttpRequest({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token.access_token}`
            },
            url: "https://graphql.anilist.co",
            data: JSON.stringify(data)
          });
          if (resp === null || resp.status !== 200) {
            console.log(resp);
            return new Error(`Query failed: ${data.query}`);
          }
          data.query = `mutation delEntries {`;
        }
      }
      return null;
    }
    async getIds(entries) {
      const malIds = entries.map((entry) => entry.malID);
      const queryNumLimit = 250;
      const data = {
        query: `query getMedium {`,
        variables: {}
      };
      const ret = [];
      for (let [idx, malId] of malIds.entries()) {
        data.query += `q${idx}: Media (idMal: ${malId}, type: ANIME) {
                id
            }`;
        if ((idx + 1) % queryNumLimit === 0 || idx === malIds.length - 1) {
          data.query += `}`;
          const resp = await async_GM_xmlhttpRequest({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            url: "https://graphql.anilist.co",
            data: JSON.stringify(data)
          });
          if (resp === null || resp.status !== 200) {
            if (resp !== null) {
              const errs = JSON.parse(resp.responseText).errors;
              if (errs !== void 0) {
                for (let err of errs) {
                  const st = Math.floor(idx / queryNumLimit) * queryNumLimit;
                  const errIdx = st + (err.locations[0].line - 1) / 2;
                  console.warn(`Failed to get ID of malID=${malIds[errIdx]}: ${err.message}`);
                  if (err.status === 404) {
                    entries.splice(errIdx, 1);
                  }
                }
                return this.getIds(entries);
              }
            }
            console.log(resp);
            return new Error(`Query failed: ${data.query}`);
          }
          const medium = JSON.parse(resp.responseText).data;
          for (let [key, media] of Object.entries(medium)) {
            const idx2 = parseInt(key.slice(1), 10);
            ret[idx2] = media.id;
          }
          data.query = `query getMedium {`;
        }
      }
      return ret;
    }
  }
  function deattribute(data) {
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data))
        data.map((el) => deattribute(el));
      else if (typeof data.attributes === "object" && !Array.isArray(data.attributes) && data.attributes !== null) {
        for (const key of Object.keys(data.attributes)) {
          if (!data.attributes.attributes) {
            data[key] = data.attributes[key];
          }
        }
        if (data.attributes.attributes) {
          data.attributes = data.attributes.attributes;
        } else {
          delete data.attributes;
        }
      }
    }
    return data;
  }
  function error(Error2) {
    if (Error2.response) {
      const e = Error2.response.data;
      if (e !== null && e !== void 0 && e.errors)
        Error2.errors = e.errors;
    }
    throw Error2;
  }
  function filterIncludes(included, _ref) {
    let {
      id,
      type
    } = _ref;
    try {
      if (id && type) {
        const filtered = included.filter((el) => {
          return el.id === id && el.type === type;
        })[0] || {
          id,
          type
        };
        return Object.assign({}, filtered);
      } else {
        return {};
      }
    } catch (E) {
      error(E);
    }
  }
  const isDeepEqual = (left, right) => {
    if (!left || !right) {
      return left === right;
    }
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length)
      return false;
    for (const key of leftKeys) {
      const leftValue = left[key];
      const rightValue = right[key];
      const isObjects = isObject(leftValue) && isObject(rightValue);
      if (isObjects && !isDeepEqual(leftValue, rightValue) || !isObjects && leftValue !== rightValue) {
        return false;
      }
    }
    return true;
  };
  const isObject = (object) => {
    return object != null && typeof object === "object";
  };
  function link(_ref, included, previouslyLinked, relationshipCache) {
    let {
      id,
      type,
      meta
    } = _ref;
    const filtered = filterIncludes(included, {
      id,
      type
    });
    previouslyLinked[`${type}#${id}`] = filtered;
    if (filtered.relationships) {
      linkRelationships(filtered, included, previouslyLinked, relationshipCache);
    }
    if (meta)
      filtered.meta = meta;
    return deattribute(filtered);
  }
  function linkArray(data, included, key, previouslyLinked, relationshipCache) {
    data[key] = {};
    if (data.relationships[key].links)
      data[key].links = data.relationships[key].links;
    if (data.relationships[key].meta)
      data[key].meta = data.relationships[key].meta;
    data[key].data = [];
    for (const resource of data.relationships[key].data) {
      const cache = previouslyLinked[`${resource.type}#${resource.id}`];
      let relationship = cache || link(resource, included, previouslyLinked, relationshipCache);
      if (resource.meta !== relationship.meta)
        relationship = {
          ...relationship,
          meta: resource.meta
        };
      data[key].data.push(relationship);
    }
    delete data.relationships[key];
  }
  function linkObject(data, included, key, previouslyLinked, relationshipCache) {
    data[key] = {};
    const resource = data.relationships[key].data;
    const cache = previouslyLinked[`${resource.type}#${resource.id}`];
    if (cache) {
      let resourceCache = null;
      if (!isDeepEqual(cache.meta, resource.meta)) {
        resourceCache = {
          ...cache,
          meta: resource.meta
        };
      } else {
        resourceCache = cache;
      }
      data[key].data = resourceCache;
    } else {
      data[key].data = link(resource, included, previouslyLinked, relationshipCache);
    }
    const cacheKey = `${data.type}#${data.id}#${key}`;
    const relationships = relationshipCache[cacheKey] || data.relationships[key];
    if (!relationshipCache[cacheKey])
      relationshipCache[cacheKey] = relationships;
    if (relationships !== null && relationships !== void 0 && relationships.links)
      data[key].links = relationships.links;
    if (relationships !== null && relationships !== void 0 && relationships.meta)
      data[key].meta = relationships.meta;
    delete data.relationships[key];
  }
  function linkAttr(data, key) {
    data[key] = {};
    if (data.relationships[key].links)
      data[key].links = data.relationships[key].links;
    if (data.relationships[key].meta)
      data[key].meta = data.relationships[key].meta;
    delete data.relationships[key];
  }
  function linkRelationships(data) {
    let included = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    let previouslyLinked = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let relationshipCache = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const {
      relationships
    } = data;
    for (const key in relationships) {
      var _relationships$key;
      if (Array.isArray((_relationships$key = relationships[key]) === null || _relationships$key === void 0 ? void 0 : _relationships$key.data)) {
        linkArray(data, included, key, previouslyLinked, relationshipCache);
      } else if (relationships[key].data) {
        linkObject(data, included, key, previouslyLinked, relationshipCache);
      } else {
        linkAttr(data, key);
      }
    }
    if (Object.keys(relationships || []).length === 0 && typeof relationships === "object" && !Array.isArray(relationships) && relationships !== null) {
      delete data.relationships;
    }
    return data;
  }
  function deserialiseArray(array) {
    const previouslyLinked = {};
    const relationshipCache = {};
    for (let value of array.data) {
      const included = [...array.data.map((item) => ({
        ...item,
        relationships: {
          ...item.relationships
        }
      })), ...array.included || []];
      value = linkRelationships(value, included, previouslyLinked, relationshipCache);
      if (value.attributes)
        value = deattribute(value);
      array.data[array.data.indexOf(value)] = value;
    }
    return array;
  }
  function deserialise(response) {
    var _response$data;
    if (!response)
      return;
    if (Array.isArray(response.data))
      response = deserialiseArray(response);
    else if (response.included)
      response.data = linkRelationships(response.data, response.included);
    else if (typeof response.data === "object" && response.data !== null)
      response.data = linkRelationships(response.data);
    delete response.included;
    if ((_response$data = response.data) !== null && _response$data !== void 0 && _response$data.attributes)
      response.data = deattribute(response.data);
    return response;
  }
  function queryFormat(value, key, traditional) {
    if (traditional && value !== null && Array.isArray(value))
      return value.map((v) => queryFormat(v, key, traditional)).join("&");
    if (!traditional && value !== null && Array.isArray(value))
      return value.map((v) => queryFormat(v, `${key}[]`, traditional)).join("&");
    else if (value !== null && typeof value === "object")
      return query(value, key, traditional);
    else
      return encodeURIComponent(key) + "=" + encodeURIComponent(value);
  }
  function paramKeyName(param) {
    if (["[]", "]["].includes(param.slice(-2))) {
      return `[${param.slice(0, -2)}][]`;
    }
    return `[${param}]`;
  }
  function query(params) {
    let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    let traditional = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    const str = [];
    for (const param in params) {
      str.push(queryFormat(params[param], prefix ? `${prefix}${paramKeyName(param)}` : param, traditional));
    }
    return str.join("&");
  }
  function isValid(isArray, type, payload, method) {
    const requireID = new Error(`${method} requires an ID for the ${type} type`);
    if (type === void 0) {
      throw new Error(`${method} requires a resource type`);
    }
    if (isArray) {
      if (method !== "POST" && payload.length > 0) {
        for (const resource of payload) {
          if (!resource.id)
            throw requireID;
        }
      }
    } else {
      if (typeof payload !== "object" || method !== "POST" && Object.keys(payload).length === 0) {
        throw new Error(`${method} requires an object or array body`);
      }
      if (method !== "POST" && !payload.id) {
        throw requireID;
      }
    }
  }
  function serialiseRelationOne(node, nodeType) {
    if (node === null)
      return node;
    let relation = {};
    for (const prop of Object.keys(node)) {
      if (["id", "type"].includes(prop))
        relation[prop] = node[prop];
      else
        relation = serialiseAttr(node[prop], prop, relation);
    }
    if (!relation.type)
      relation.type = nodeType;
    return relation;
  }
  function serialiseRelationMany(node, nodeType) {
    const relation = [];
    for (const prop of node) {
      const serialised = serialiseRelationOne(prop);
      if (!serialised.type)
        serialised.type = nodeType;
      relation.push(serialised);
    }
    return relation;
  }
  function serialiseRelation(node, nodeType, key, data) {
    var _node$links, _node$links2;
    if (!data.relationships)
      data.relationships = {};
    data.relationships[key] = {
      data: Array.isArray(node.data) ? serialiseRelationMany(node.data, nodeType) : serialiseRelationOne(node.data, nodeType)
    };
    if (node !== null && node !== void 0 && (_node$links = node.links) !== null && _node$links !== void 0 && _node$links.self || node !== null && node !== void 0 && (_node$links2 = node.links) !== null && _node$links2 !== void 0 && _node$links2.related)
      data.relationships[key].links = node.links;
    if (node !== null && node !== void 0 && node.meta)
      data.relationships[key].meta = node.meta;
    return data;
  }
  function serialiseAttr(node, key, data) {
    if (!data.attributes)
      data.attributes = {};
    if (key === "links" && (typeof node.self === "string" || typeof node.related === "string"))
      data.links = node;
    else if (key === "meta" && typeof node === "object" && !Array.isArray(node) && node !== null)
      data.meta = node;
    else
      data.attributes[key] = node;
    return data;
  }
  function hasID(node) {
    var _node$data;
    if ((node === null || node === void 0 ? void 0 : node.data) === null || Array.isArray(node === null || node === void 0 ? void 0 : node.data) && (node === null || node === void 0 ? void 0 : (_node$data = node.data) === null || _node$data === void 0 ? void 0 : _node$data.length) === 0)
      return true;
    if (!node.data)
      return false;
    const nodeData = Array.isArray(node.data) ? node.data[0] : node.data;
    return Object.prototype.hasOwnProperty.call(nodeData, "id");
  }
  function serialiseRootArray(type, payload, method, options) {
    isValid(true, type, payload, method);
    const data = [];
    for (const resource of payload) {
      data.push(serialiseRootObject(type, resource, method, options).data);
    }
    return {
      data
    };
  }
  function serialiseRootObject(type, payload, method, options) {
    isValid(false, type, payload, method);
    type = options.pluralTypes(options.camelCaseTypes(type));
    let data = {
      type
    };
    if (payload !== null && payload !== void 0 && payload.id)
      data.id = String(payload.id);
    for (const key in payload) {
      const node = payload[key];
      const nodeType = options.pluralTypes(options.camelCaseTypes(key));
      if (typeof node === "object" && !Array.isArray(node) && node !== null && hasID(node)) {
        data = serialiseRelation(node, nodeType, key, data);
      } else if (key !== "id" && key !== "type") {
        data = serialiseAttr(node, key, data);
      }
    }
    return {
      data
    };
  }
  function serialise(type) {
    let data = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let method = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "POST";
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    try {
      if (!options.camelCaseTypes)
        options.camelCaseTypes = (s) => s;
      if (!options.pluralTypes)
        options.pluralTypes = (s) => s;
      if (data === null || Array.isArray(data) && data.length === 0)
        return {
          data
        };
      if (Array.isArray(data) && (data === null || data === void 0 ? void 0 : data.length) > 0)
        return serialiseRootArray(type, data, method, options);
      else
        return serialiseRootObject(type, data, method, options);
    } catch (E) {
      throw error(E);
    }
  }
  const ToGlobalStatus = {
    "completed": "Completed",
    "current": "Watching",
    "dropped": "Dropped",
    "on_hold": "On-Hold",
    "planned": "Plan to Watch"
  };
  const ToLocalStatus = {
    "Completed": "completed",
    "Watching": "current",
    "Dropped": "dropped",
    "On-Hold": "on_hold",
    "Plan to Watch": "planned"
  };
  const ToGlobalSeriesType = {
    "TV": "TV",
    "OVA": "OVA",
    "movie": "Movie",
    "special": "Special",
    "ONA": "ONA",
    "music": "Music"
  };
  class KitsuFactory {
    getInstance() {
      return new Kitsu();
    }
  }
  class Kitsu {
    // ms
    constructor() {
      __publicField(this, "user");
      __publicField(this, "clientID", "dd031b32d2f56c990b1425efe6c42ad847e7fe3ab46bf1299f05ecd856bdb7dd");
      __publicField(this, "clientSecret", "54d7307928f63414defd96399fc31ba847961ceaecef3a5fd93144e960c0e151");
      __publicField(this, "tokenBaseURL", "https://kitsu.io/api/oauth/token");
      __publicField(this, "reqDelay", 10);
      this.user = null;
    }
    async login(opt) {
      if (opt.grantTypes !== "Password" || opt.username === void 0 || opt.password === void 0) {
        return new Error("Not supported AuthOptions");
      }
      if (!this.logined()) {
        const authData = new URLSearchParams({
          grant_type: "password",
          username: opt.username,
          password: encodeURIComponent(opt.password)
        });
        const resp = await async_GM_xmlhttpRequest({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: this.tokenBaseURL,
          data: authData.toString()
        });
        if (resp === null || resp.status !== 200) {
          console.log(resp);
          return new Error("Password Grant failed");
        }
        const token = JSON.parse(resp.responseText);
        token.expires_in -= 86400;
        _GM_setValue("Kitsu_accessToken", token);
      }
      return null;
    }
    logined() {
      const token = _GM_getValue("Kitsu_accessToken");
      if (token && Date.now() < (token.created_at + token.expires_in) * 1e3) {
        return true;
      } else {
        return false;
      }
    }
    async logout() {
      this.user = null;
      _GM_deleteValue("Kitsu_accessToken");
      return null;
    }
    async getMyInfo() {
      if (this.user) {
        return this.user;
      } else {
        const user = await this.getUser();
        if (user instanceof Error) {
          return user;
        }
        this.user = {
          id: parseInt(user.id, 10),
          name: user.name
        };
        return this.user;
      }
    }
    async updateAnime(id, status) {
      const user = await this.getMyInfo();
      if (user instanceof Error) {
        return user;
      }
      const entry = await this.getEntry({ id: user.id }, id);
      if (entry instanceof Error) {
        return entry;
      } else if (entry === null) {
        return this.addEntry(id, status);
      } else {
        return this.updateEntry(entry, status);
      }
    }
    async deleteAnime(id) {
      const user = await this.getMyInfo();
      if (user instanceof Error) {
        return user;
      }
      const entry = await this.getEntry({ id: user.id }, id);
      if (entry instanceof Error) {
        return entry;
      } else if (entry === null) {
        console.warn("[deleteAnime] No anime to be deleted");
        return null;
      } else {
        return this.deleteEntry(entry);
      }
    }
    async getList(user, statuses) {
      const entries = await this.getEntries(user, statuses);
      if (entries instanceof Error) {
        return entries;
      }
      const ret = [];
      for (let entry of entries) {
        if (entry.media) {
          ret.push(entry.media);
        }
      }
      return ret;
    }
    async importList(entries, overwrite) {
      if (overwrite) {
        const err = await this.deleteList(["Completed", "Dropped", "On-Hold", "Plan to Watch", "Watching"]);
        if (err) {
          return err;
        }
        console.log("[importList] delete all entries successfully");
      }
      const user = await this.getMyInfo();
      if (user instanceof Error) {
        return user;
      }
      const existEntries = await this.getEntries(
        { id: user.id },
        ["Completed", "Dropped", "On-Hold", "Plan to Watch", "Watching"]
      );
      if (existEntries instanceof Error) {
        return existEntries;
      }
      console.log("[importList] get exist entries successfully", existEntries);
      const tasks = [];
      for (let entry of entries) {
        await asyncWait(this.reqDelay);
        tasks.push(this.importEntry(existEntries, entry));
      }
      let retry = 3;
      while (retry--) {
        const errs = await Promise.all(tasks);
        let count = 0;
        for (let [idx, err] of errs.entries()) {
          if (err) {
            console.warn(`[importList] Anime "${entries[idx].title}" import failed:`, err);
            count++;
            if (retry > 0) {
              await asyncWait(this.reqDelay);
              tasks[idx] = this.importEntry(existEntries, entries[idx]);
            }
          }
        }
        if (count === 0) {
          console.log(`[importList] all animes are updated`);
          break;
        } else if (retry === 0) {
          return new Error(`${count} animes are not updated`);
        } else {
          console.log(`[importList] ${count} entries are not updated, retry...`);
        }
      }
      return null;
    }
    async deleteList(statuses) {
      const user = await this.getMyInfo();
      if (user instanceof Error) {
        return user;
      }
      let retry = 3;
      while (retry--) {
        const entries = await this.getEntries({ id: user.id }, statuses);
        if (entries instanceof Error) {
          return entries;
        }
        console.log(`[deleteList] get ${statuses} entries successfully`, entries);
        const count = entries.length;
        if (count === 0) {
          console.log(`[deleteList] all entries are deleted`);
          break;
        } else if (retry === 0) {
          return new Error(`Some ${count} entries are not deleted`);
        } else {
          console.log(`[deleteList] ${count} entries are ready to delete`);
        }
        const reqs = [];
        for (let entry of entries) {
          await asyncWait(this.reqDelay);
          reqs.push(this.deleteEntry(entry));
        }
        const errs = await Promise.all(reqs);
        for (let [idx, err] of errs.entries()) {
          if (err) {
            if (entries[idx].media) {
              console.warn(`Anime "${entries[idx].media.title}" delete failed:`, err);
            } else {
              console.warn(`Entry ID "${entries[idx].id}" delete failed:`, err);
            }
          }
        }
      }
      return null;
    }
    async refreshToken() {
      const oldToken = _GM_getValue("Kitsu_accessToken");
      if (oldToken === void 0) {
        return new Error("No token to refresh");
      }
      const data = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: oldToken.refresh_token
      });
      const resp = await async_GM_xmlhttpRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: this.tokenBaseURL,
        data: data.toString()
      });
      if (resp === null || resp.status !== 200) {
        return new Error("Refresh token failed");
      }
      const newToken = JSON.parse(resp.responseText);
      newToken.expires_in -= 86400;
      _GM_setValue("Kitsu_accessToken", newToken);
      return newToken;
    }
    async getToken() {
      const token = _GM_getValue("Kitsu_accessToken");
      if (token === void 0) {
        return new Error("Not logined");
      } else if (Date.now() > (token.created_at + token.expires_in) * 1e3) {
        return this.refreshToken();
      } else {
        return token;
      }
    }
    async getUser(userName) {
      let query$1;
      let resp;
      if (userName === void 0 || this.logined()) {
        const token = await this.getToken();
        if (token instanceof Error) {
          return token;
        }
        query$1 = `https://kitsu.io/api/edge/users?` + query({
          filter: {
            self: true
          }
        });
        resp = await async_GM_xmlhttpRequest({
          method: "GET",
          headers: {
            "Content-Type": "application/vnd.api+json",
            "Accept": "application/vnd.api+json",
            "Authorization": `Bearer ${token.access_token}`
          },
          url: query$1
        });
      } else {
        query$1 = `https://kitsu.io/api/edge/users?` + query({
          filter: {
            name: userName
          }
        });
        resp = await async_GM_xmlhttpRequest({
          method: "GET",
          headers: {
            "Content-Type": "application/vnd.api+json",
            "Accept": "application/vnd.api+json"
          },
          url: query$1
        });
      }
      if (resp === null || resp.status !== 200) {
        console.log(resp);
        return new Error(`Query failed: ${query$1}`);
      }
      const user = JSON.parse(resp.responseText).data[0];
      return {
        id: user.id,
        name: user.attributes.name
      };
    }
    async getEntry(user, animeId) {
      const token = await this.getToken();
      if (!(token instanceof Error)) {
        `Bearer ${token.access_token}`;
      }
      let userId;
      if ("id" in user) {
        userId = user.id;
      } else {
        const userInfo = await this.getUser(user.name);
        if (userInfo instanceof Error) {
          return userInfo;
        }
        userId = parseInt(userInfo.id, 10);
      }
      const query$1 = `https://kitsu.io/api/edge/library-entries?` + query({
        filter: {
          userId,
          animeId
        },
        include: "anime,anime.mappings"
      });
      const resp = await async_GM_xmlhttpRequest({
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.api+json",
          "Accept": "application/vnd.api+json"
        },
        url: query$1
      });
      if (resp === null || resp.status !== 200) {
        console.log(resp);
        return new Error(`Query failed: ${query$1}`);
      }
      const entries = deserialise(JSON.parse(resp.responseText));
      if (!entries) {
        return new Error(`[getEntry] Invalid response of ${query$1}: Can't deserialise`);
      } else if (!entries.data) {
        return new Error(`[getEntry] Invalid response of ${query$1}: No data in entries`);
      } else if (entries.data.length === 0) {
        return null;
      }
      const entry = entries.data[0];
      const kitsuEntry = {
        id: entry.id,
        selfLink: entry.links.self
      };
      const anime = entry.anime.data;
      if (anime === void 0) {
        console.warn(`[getEntry] No anime data in entry`, entry);
        return kitsuEntry;
      }
      const mappings = anime.mappings.data;
      if (mappings === void 0) {
        console.warn(`[getEntry] No mappings data in entry`, entry);
        return kitsuEntry;
      }
      const malMapping = mappings.find((mapping) => {
        return mapping.externalSite === "myanimelist/anime";
      });
      if (malMapping === void 0) {
        console.warn(`[getEntry] No MAL mapping data in entry`, entry);
        return kitsuEntry;
      }
      kitsuEntry.media = {
        malID: parseInt(malMapping.externalId, 10),
        status: ToGlobalStatus[entry.status],
        title: anime.canonicalTitle,
        type: ToGlobalSeriesType[anime.subtype],
        updateOnImport: true,
        numEpisodes: anime.episodeCount
      };
      return kitsuEntry;
    }
    async getEntries(user, statuses) {
      let headers = {
        "Content-Type": "application/vnd.api+json",
        "Accept": "application/vnd.api+json"
      };
      const token = await this.getToken();
      if (!(token instanceof Error)) {
        headers["Authorization"] = `Bearer ${token.access_token}`;
      }
      let userId;
      if ("id" in user) {
        userId = user.id;
      } else {
        const userInfo = await this.getUser(user.name);
        if (userInfo instanceof Error) {
          return userInfo;
        }
        userId = parseInt(userInfo.id, 10);
      }
      const stat = statuses.map((status) => ToLocalStatus[status]);
      let query$1 = `https://kitsu.io/api/edge/library-entries?` + query({
        filter: {
          userId,
          status: stat.toString(),
          kind: "anime"
        },
        include: "anime,anime.mappings",
        page: {
          limit: 500
        }
      });
      const ret = [];
      while (query$1) {
        const resp = await async_GM_xmlhttpRequest({
          method: "GET",
          headers,
          url: query$1
        });
        if (resp === null || resp.status !== 200) {
          console.log(resp);
          return new Error(`Query failed: ${query$1}`);
        }
        const entries = deserialise(JSON.parse(resp.responseText));
        if (!entries) {
          return new Error(`[getEntries] Invalid response of ${query$1}: Can't deserialise`);
        } else if (!entries.data) {
          return new Error(`[getEntries] Invalid response of ${query$1}: No data in entries`);
        }
        for (let entry of entries.data) {
          const kitsuEntry = {
            id: entry.id,
            selfLink: entry.links.self
          };
          const anime = entry.anime.data;
          if (anime === void 0) {
            console.warn(`[getEntries] No anime data in entry`, entry);
            ret.push(kitsuEntry);
            continue;
          }
          const mappings = anime.mappings.data;
          if (mappings === void 0) {
            console.warn(`[getEntries] No mappings data in entry`, entry);
            ret.push(kitsuEntry);
            continue;
          }
          const malMapping = mappings.find((mapping) => {
            return mapping.externalSite === "myanimelist/anime";
          });
          if (malMapping === void 0) {
            console.warn(`[getEntries] No MAL mapping data in entry`, entry);
            ret.push(kitsuEntry);
            continue;
          }
          kitsuEntry.media = {
            malID: parseInt(malMapping.externalId, 10),
            status: ToGlobalStatus[entry.status],
            title: anime.canonicalTitle,
            type: ToGlobalSeriesType[anime.subtype],
            updateOnImport: true,
            numEpisodes: anime.episodeCount
          };
          ret.push(kitsuEntry);
        }
        query$1 = entries.links.next;
      }
      return ret;
    }
    async deleteEntry(entry) {
      const token = await this.getToken();
      if (token instanceof Error) {
        return token;
      }
      const resp = await async_GM_xmlhttpRequest({
        method: "DELETE",
        headers: {
          "Content-Type": "application/vnd.api+json",
          "Accept": "application/vnd.api+json",
          "Authorization": `Bearer ${token.access_token}`
        },
        url: entry.selfLink
      });
      if (resp === null || resp.status !== 204) {
        console.log(resp);
        return new Error(`Delete query failed: ${entry.selfLink}`);
      }
      return null;
    }
    async addEntry(animeId, status) {
      const token = await this.getToken();
      if (token instanceof Error) {
        return token;
      }
      const user = await this.getMyInfo();
      if (user instanceof Error) {
        return user;
      }
      const data = {
        user: {
          data: {
            type: "users",
            id: user.id
          }
        },
        anime: {
          data: {
            type: "anime",
            id: animeId
          }
        },
        status: ToLocalStatus[status]
      };
      const resp = await async_GM_xmlhttpRequest({
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.api+json",
          "Accept": "application/vnd.api+json",
          "Authorization": `Bearer ${token.access_token}`
        },
        url: `https://kitsu.io/api/edge/library-entries`,
        data: JSON.stringify(serialise("libraryEntries", data))
      });
      if (resp === null || resp.status !== 201) {
        console.log(resp);
        return new Error(`Update anime query failed: ${JSON.stringify(data)}`);
      }
      return null;
    }
    async updateEntry(entry, status) {
      const token = await this.getToken();
      if (token instanceof Error) {
        return token;
      }
      const data = {
        id: entry.id,
        status: ToLocalStatus[status]
      };
      const resp = await async_GM_xmlhttpRequest({
        method: "PATCH",
        headers: {
          "Content-Type": "application/vnd.api+json",
          "Accept": "application/vnd.api+json",
          "Authorization": `Bearer ${token.access_token}`
        },
        url: entry.selfLink,
        data: JSON.stringify(serialise("libraryEntries", data))
      });
      if (resp === null || resp.status !== 200) {
        console.log(resp);
        return new Error(`Update entry failed: ${JSON.stringify(data)}`);
      }
      return null;
    }
    async importEntry(existEntries, entry) {
      const existEntry = existEntries.find((existEntry2) => {
        return existEntry2.media && existEntry2.media.malID === entry.malID;
      });
      if (existEntry && existEntry.media.status !== entry.status && entry.updateOnImport) {
        return this.updateEntry(existEntry, entry.status);
      } else if (existEntry) {
        return null;
      } else {
        const animeId = await this.getAnimeId(entry.malID);
        if (animeId === null) {
          return new Error(`No anime '${entry.title}' in Kitsu`);
        } else if (animeId instanceof Error) {
          return animeId;
        } else {
          return this.addEntry(animeId, entry.status);
        }
      }
    }
    async getAnimeId(malId) {
      const query$1 = `https://kitsu.io/api/edge/mappings?` + query({
        filter: {
          externalSite: "myanimelist/anime",
          externalId: malId
        },
        include: "item"
      });
      const resp = await async_GM_xmlhttpRequest({
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.api+json",
          "Accept": "application/vnd.api+json"
        },
        url: query$1
      });
      if (resp === null || resp.status !== 200) {
        console.log(resp);
        return new Error(`Query failed: ${query$1}`);
      }
      const mappings = deserialise(JSON.parse(resp.responseText));
      if (!mappings) {
        return new Error(`Invalid response of ${query$1}: Can't deserialise`);
      } else if (!mappings.data) {
        console.warn(`No data in mappings of malId=${malId}`);
        return null;
      }
      let animeInfo = void 0;
      for (let mapping of mappings.data) {
        const info = mapping.item.data;
        if (info === void 0) {
          continue;
        } else if (info.type !== "anime") {
          continue;
        } else {
          animeInfo = info;
          break;
        }
      }
      if (animeInfo === void 0) {
        console.warn(`[getAnimeId] No anime info of malId=${malId}`);
        return null;
      }
      return parseInt(animeInfo.id, 10);
    }
  }
  const redirectPathName = "/amqToolbox/oauth2";
  class EntrySet {
    constructor() {
      __publicField(this, "include");
      __publicField(this, "optional");
      __publicField(this, "exclude");
      this.include = null;
      this.optional = [];
      this.exclude = [];
    }
    update(entries, included) {
      switch (included) {
        case "Include": {
          if (this.include === null) {
            this.include = [...entries];
            this.difference(this.include, this.exclude);
          } else {
            this.intersection(this.include, entries);
          }
          break;
        }
        case "Optional": {
          if (this.include === null) {
            this.union(this.optional, entries);
          }
          break;
        }
        case "Exclude": {
          if (this.include === null) {
            this.union(this.exclude, entries);
          } else {
            this.difference(this.include, entries);
          }
          break;
        }
      }
    }
    getResult() {
      if (this.include === null) {
        this.difference(this.optional, this.exclude);
        return this.optional;
      } else {
        return this.include;
      }
    }
    union(dst, src) {
      const temp = Object.fromEntries(dst.map((entry) => [entry.malID, entry]));
      for (let entry of src) {
        if (!temp.hasOwnProperty(entry.malID)) {
          dst.push(entry);
        }
      }
    }
    intersection(dst, src) {
      const temp = new Map(dst.map((entry) => [entry.malID, entry]));
      for (let entry of src) {
        if (!temp.has(entry.malID)) {
          temp.delete(entry.malID);
        }
      }
      dst.length = 0;
      dst.push(...temp.values());
    }
    difference(dst, src) {
      const temp = new Map(dst.map((entry) => [entry.malID, entry]));
      for (let entry of src) {
        if (temp.has(entry.malID)) {
          temp.delete(entry.malID);
        }
      }
      dst.length = 0;
      dst.push(...temp.values());
    }
  }
  class AnimeListAccount {
    constructor() {
      __publicField(this, "self");
      __publicField(this, "kitsu");
      __publicField(this, "mal");
      __publicField(this, "aniList");
      this.self = $(`<div class="col-xs-6"></div>`).css("text-align", "center");
      this.kitsu = new KitsuFactory().getInstance();
      this.mal = new MyAnimeListFactory().getInstance();
      this.aniList = new AniListFactory().getInstance();
    }
    show(site) {
      this.self.empty();
      let animeList;
      switch (site) {
        case "Kitsu":
          animeList = this.kitsu;
          break;
        case "MyAnimeList":
          animeList = this.mal;
          break;
        case "AniList":
          animeList = this.aniList;
          break;
      }
      if (animeList.logined()) {
        (async () => {
          const userInfo = await animeList.getMyInfo();
          const user = $(`<span>User : <b>${userInfo.name}</b></span>`).css("margin", "0 15px");
          const logoutBtn = new Button({
            label: "Logout",
            size: "normal",
            style: "danger"
          });
          logoutBtn.self.on("click", async () => {
            await animeList.logout();
            this.show(site);
          });
          this.self.append(user, logoutBtn.self);
        })();
      } else {
        const loginBtn = new Button({
          label: "Login",
          size: "normal",
          style: "primary"
        });
        const spinner = $(`<i class="fa fa-spinner fa-spin hide"></i>`);
        const emailInput = new TextInput({ placeholder: "E-mail" });
        emailInput.self.css("padding", "5px 30px");
        const passwordInput = new TextInput({ placeholder: "Password", type: "password" });
        passwordInput.self.css("padding", "5px 30px");
        if (site === "Kitsu") {
          this.self.append(emailInput.self, passwordInput.self);
        }
        loginBtn.self.on("click", async () => {
          let loginInfo;
          if (site === "Kitsu") {
            loginInfo = {
              grantTypes: "Password",
              username: emailInput.getValue(),
              password: passwordInput.getValue()
            };
          } else {
            loginInfo = { grantTypes: "Authorization Code" };
          }
          spinner.removeClass("hide");
          const err = await animeList.login(loginInfo);
          spinner.addClass("hide");
          if (err) {
            displayMessage("Login Error", err.message);
          } else {
            displayMessage("Login Successful", "Login Successful", () => {
              this.show(site);
            });
          }
        });
        this.self.append(loginBtn.self, spinner);
      }
    }
    getAccount(site) {
      switch (site) {
        case "Kitsu":
          return this.kitsu;
        case "MyAnimeList":
          return this.mal;
        case "AniList":
          return this.aniList;
      }
    }
  }
  class ListMerging {
    constructor() {
      __publicField(this, "name", "List Merging");
      __publicField(this, "settingTab");
      __publicField(this, "_enabled", false);
      __publicField(this, "account");
      __publicField(this, "site");
      __publicField(this, "status");
      __publicField(this, "mergedLists");
      this.settingTab = new Tab({
        tabName: "Custom List",
        contentClass: "amqtb-list-merging-tab row"
      });
      const accountTitle = $('<div class="col-xs-12"></div>').append(
        $("<h4><b>Target Account</b></h4>").css("text-align", "center")
      );
      this.settingTab.push({ self: accountTitle });
      this.account = new AnimeListAccount();
      const siteChooseBlock = $('<div class="col-xs-3"></div>').css("text-align", "center");
      this.site = new SingleSelect({
        label: "Site",
        choices: [
          { label: "MyAnimeList", value: "MyAnimeList" },
          { label: "AniList", value: "AniList" },
          { label: "Kistu", value: "Kitsu" }
        ]
      });
      const options = this.site.self.find("ul > li > a");
      options.eq(0).on("click", () => {
        this.account.show("MyAnimeList");
      });
      options.eq(1).on("click", () => {
        this.account.show("AniList");
      });
      options.eq(2).on("click", () => {
        this.account.show("Kitsu");
      });
      siteChooseBlock.append(this.site.self);
      this.settingTab.push({ self: siteChooseBlock });
      const statusChooseBlock = $('<div class="col-xs-3"></div>').css("text-align", "center");
      this.status = new SingleSelect({
        label: "Status",
        choices: [
          { label: "Watching", value: "Watching" },
          { label: "Completed", value: "Completed" },
          { label: "On Hold", value: "On-Hold" },
          { label: "Dropped", value: "Dropped" },
          { label: "Planning", value: "Plan to Watch" }
        ]
      });
      statusChooseBlock.append(this.status.self);
      this.settingTab.push({ self: statusChooseBlock });
      this.settingTab.push(this.account);
      const tableBlock = $('<div class="col-xs-12"></div>');
      this.mergedLists = new Table({
        name: "Merged List",
        title: "Lists To Be Merged",
        addOrDeletable: true,
        movable: false,
        saveIn: "Script",
        newRow: () => ({
          accountType: new SingleSelect({
            label: "Choose a type",
            choices: [
              { label: "MAL Username", value: "MyAnimeList" },
              { label: "AniList Username", value: "AniList" },
              { label: "Kitsu ID", value: "Kitsu" }
            ]
          }),
          user: new TextInput({ placeholder: "username/ID" }),
          status: new MultiSelect({
            label: "Status",
            choices: [
              { label: "Watching", value: "Watching" },
              { label: "Completed", value: "Completed" },
              { label: "On Hold", value: "On-Hold" },
              { label: "Dropped", value: "Dropped" },
              { label: "Planning", value: "Plan to Watch" }
            ]
          }),
          included: new SingleSelect({
            label: "",
            choices: [
              { label: "Optional", value: "Optional" },
              { label: "Include", value: "Include" },
              { label: "Exclude", value: "Exclude" },
              { label: "Skip", value: "Skip" }
            ]
          })
        })
      });
      const saveBtn = this.mergedLists.getButton("save");
      const saveLabel = saveBtn.self.text();
      saveBtn.self.html(`${saveLabel}<i class="fa fa-spinner fa-spin hide"></i>`);
      const spinner = saveBtn.self.find("i");
      saveBtn.self.on("click", async () => {
        spinner.removeClass("hide");
        const err = await this.mergeLists();
        spinner.addClass("hide");
        if (err) {
          displayMessage("Merge Failed", err.message);
        } else {
          displayMessage("Merge Successful", "The lists has been merged to the target");
        }
      });
      tableBlock.append(this.mergedLists.self);
      this.settingTab.push({ self: tableBlock });
      this.enable();
    }
    enable() {
      this._enabled = true;
    }
    disable() {
      this._enabled = false;
    }
    enabled() {
      return this._enabled;
    }
    async mergeLists() {
      const site = this.site.getValue();
      const status = this.status.getValue();
      if (site === void 0 || status === void 0) {
        return new Error("missing some target account information");
      }
      const account = this.account.getAccount(site);
      console.log(`[mergeLists] get merged entries`);
      const entries = await this.getMergedEntries();
      if (entries instanceof Error) {
        return new Error(`failed to merge lists: ${entries}`);
      }
      for (let entry of entries) {
        entry.status = status;
      }
      console.log(`[mergeLists] delete target's '${status}' list`);
      let err = await account.deleteList([status]);
      if (err) {
        return new Error(`failed to delete entries of target: ${err}`);
      }
      console.log(`[mergeLists] import merged entries to target`);
      err = await account.importList(entries, false);
      if (err) {
        return new Error(`failed to import entries to target: ${err}`);
      }
      return null;
    }
    async getMergedEntries() {
      const entrySet = new EntrySet();
      const mergedLists = this.mergedLists.getValue();
      for (let list of mergedLists) {
        if (list.accountType === void 0 || !list.user || list.included === void 0) {
          return new Error("missing some list information");
        } else if (list.status.length === 0 || list.included === "Skip") {
          continue;
        }
        console.log(`[getMergedEntries] get ${list.user} List`);
        let entries;
        if (list.accountType === "Kitsu") {
          entries = await this.account.getAccount(list.accountType).getList(
            { id: parseInt(list.user, 10) },
            list.status
          );
        } else {
          entries = await this.account.getAccount(list.accountType).getList(
            { name: list.user },
            list.status
          );
        }
        if (entries instanceof Error) {
          return new Error(`Failed to get [${list.accountType}]${list.user}'s list: ${entries}`);
        }
        entrySet.update(entries, list.included);
      }
      return entrySet.getResult();
    }
  }
  function main() {
    onStartPageLoaded(() => {
      registerPlugin(new ListMerging());
    });
  }
  const path = new URL(document.URL);
  if (path.pathname === redirectPathName) {
    redirectURLHandler();
  } else {
    $(main);
  }

})();
