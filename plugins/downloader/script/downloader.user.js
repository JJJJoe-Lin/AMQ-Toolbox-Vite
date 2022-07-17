// ==UserScript==
// @name         AMQ Downloader
// @namespace    https://github.com/JJJJoe-Lin
// @version      0.2.3
// @author       JJJJoe
// @description  AMQ song downloader
// @downloadURL  https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js
// @updateURL    https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js
// @match        https://animemusicquiz.com/*
// @require      https://cdn.jsdelivr.net/npm/mp3tag.js@latest/dist/mp3tag.min.js
// @connect      cdn.animenewsnetwork.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

// use vite-plugin-monkey@0.2.14 at 2022-07-17T06:55:49.173Z

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  "use strict";
  const AmqtbButtonSize = {
    "large": "btn-lg",
    "default": "",
    "small": "btn-sm",
    "extra-small": "btn-xs"
  };
  const AmqtbButtonStyle = {
    "default": "btn-default",
    "primary": "btn-primary",
    "success": "btn-success",
    "info": "btn-info",
    "warning": "btn-warning",
    "danger": "btn-danger",
    "link": "btn-link"
  };
  class AmqtbButton {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "id");
      __publicField(this, "name");
      __publicField(this, "_size");
      __publicField(this, "_style");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.self = $(`<button></button>`).attr("id", id).attr("type", "button").addClass(cls).addClass(AmqtbButtonSize[opt.size]).addClass(AmqtbButtonStyle[opt.style]).text(opt.label);
      this.id = id;
      this.name = opt.name;
      this._size = AmqtbButtonSize[opt.size];
      this._style = AmqtbButtonStyle[opt.style];
    }
    set size(size) {
      this.self.removeClass(this._size);
      this._size = AmqtbButtonSize[size];
      this.self.addClass(this._size);
    }
    set style(style) {
      this.self.removeClass(this._style);
      this._style = AmqtbButtonStyle[style];
      this.self.addClass(this._style);
    }
    set label(text) {
      this.self.text(text);
    }
  }
  class AmqtbButtonContainer {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "buttons");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.self = $(`<div></div>`).attr("id", id).addClass("amqtbButtonContainer").addClass(cls);
      this.buttons = /* @__PURE__ */ new Map();
    }
    add(...btns) {
      for (let btn of btns) {
        if (btn.name) {
          if (this.buttons.has(btn.name)) {
            console.warn(`Skip adding duplicated button '${btn.name}' in this container`);
            continue;
          }
          this.buttons.set(btn.name, btn);
        }
        this.self.append(btn.self);
      }
    }
    get(btn) {
      if (typeof btn === "string") {
        return this.buttons.get(btn);
      } else {
        return btn.name === void 0 ? void 0 : this.buttons.get(btn.name);
      }
    }
    has(btn) {
      if (typeof btn === "string") {
        return this.buttons.has(btn);
      } else {
        return btn.name === void 0 ? false : this.buttons.has(btn.name);
      }
    }
    clear() {
      this.buttons.clear();
      this.self.empty();
    }
  }
  class AmqtbTab {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "container");
      __publicField(this, "name");
      let id = opt.id === void 0 ? "" : opt.id;
      let cls = opt.class === void 0 ? "" : opt.class;
      let ctid = opt.containerId === void 0 ? "" : opt.containerId;
      let ctcls = opt.containerClass === void 0 ? "" : opt.containerClass;
      this.self = $(`<div></div>`).attr("id", id).addClass(cls).addClass("tab leftRightButtonTop clickAble").append($(`<h5></h5>`).text(opt.title));
      this.container = $(`<div></div>`).attr("id", ctid).addClass(ctcls).addClass("hide");
      this.name = opt.name;
    }
  }
  class AmqtbTabContainer {
    constructor() {
      __publicField(this, "self");
      __publicField(this, "contentContainer");
      __publicField(this, "curTab");
      __publicField(this, "tabs");
      this.self = $(`<div class="tabContainer"></div>`);
      this.contentContainer = $(`<div></div>`);
      this.tabs = /* @__PURE__ */ new Map();
    }
    selectTab(tab) {
      if (this.curTab !== void 0) {
        this.curTab.self.removeClass("selected");
        this.curTab.container.addClass("hide");
      }
      tab.self.addClass("selected");
      tab.container.removeClass("hide");
      this.curTab = tab;
    }
    add(...tabs) {
      for (let tab of tabs) {
        if (tab.name) {
          if (this.tabs.has(tab.name)) {
            console.warn(`Skip adding duplicated tab '${tab.name}' in this container`);
            continue;
          }
          this.tabs.set(tab.name, tab);
        }
        tab.self.on("click", () => {
          this.selectTab(tab);
        });
        this.self.append(tab.self);
        this.contentContainer.append(tab.container);
      }
    }
    has(tab) {
      if (typeof tab === "string") {
        return this.tabs.has(tab);
      } else {
        return tab.name === void 0 ? false : this.tabs.has(tab.name);
      }
    }
    get(tab) {
      if (typeof tab === "string") {
        return this.tabs.get(tab);
      } else {
        return tab.name === void 0 ? void 0 : this.tabs.get(tab.name);
      }
    }
    select(tab) {
      if (this.has(tab)) {
        const _tab = this.get(tab);
        this.selectTab(_tab);
      }
    }
    hide(tab) {
      if (this.has(tab)) {
        const _tab = this.get(tab);
        _tab.self.addClass("hide");
        _tab.container.addClass("hide");
        if (this.curTab === _tab) {
          const existTab = [...this.tabs.values()].find((t) => !t.self.hasClass("hide"));
          if (existTab === void 0) {
            this.curTab.self.removeClass("selected");
            this.curTab = void 0;
          } else {
            this.selectTab(existTab);
          }
        }
      }
    }
    hideAll() {
      if (this.curTab !== void 0) {
        this.curTab.self.removeClass("selected");
        this.curTab = void 0;
      }
      for (let tab of this.tabs.values()) {
        this.hide(tab);
      }
    }
    show(tab) {
      if (this.has(tab)) {
        const _tab = this.get(tab);
        _tab.self.removeClass("hide");
        if (this.curTab === void 0) {
          this.selectTab(_tab);
        }
      }
    }
    get contents() {
      return [...this.tabs.values()].map((tab) => tab.container);
    }
  }
  class AmqtbModal {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "content");
      const cls = opt.class === void 0 ? "" : opt.class;
      this.self = $(`<div class="modal fade" tabindex="-1" role="dialog"></div>`).attr("id", opt.id).addClass(cls);
      const dialog = $(`<div class="modal-dialog" role="document"></div>`);
      if (opt.size === "small") {
        dialog.addClass("modal-sm");
      } else if (opt.size === "large") {
        dialog.addClass("modal-lg");
      }
      const content = $(`<div class="modal-content"></div>`);
      const header = $(`<div class="modal-header"></div>`);
      const closeIcon = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`).append($(`<span aria-hidden="true">\xD7</span>`));
      const body = $(`<div class="modal-body"></div>`);
      this.self.append(dialog.append(content.append(header.append(closeIcon)).append(body)));
      if (opt.content instanceof AmqtbTabContainer) {
        const title = $(`<h4 class="modal-title">${opt.title}</h4>`);
        this.self.addClass("tab-modal");
        header.append(title);
        opt.content.self.insertAfter(header);
        body.append(opt.content.contentContainer);
      } else {
        const title = $(`<h2 class="modal-title">${opt.title}</h2>`);
        header.append(title);
        body.append(opt.content);
      }
      this.content = body;
      $("#gameContainer").append(this.self);
    }
  }
  class AmqtbCheckbox {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "input");
      __publicField(this, "id");
      __publicField(this, "name");
      __publicField(this, "enables");
      __publicField(this, "onSave");
      __publicField(this, "onLoad");
      this.id = opt.id;
      this.name = opt.name;
      this.enables = opt.enables;
      this.input = $(`<input id="${this.id}" type="checkbox">`).on(`click`, () => {
        this.save(this.checked);
      });
      const checkLabel = $(`<label for="${this.id}"></label>`).append($(`<i class='fa fa-check' aria-hidden='true'></i>`));
      const textLabel = $(`<label for="${this.id}"></label>`).addClass("customCheckboxContainerLabel").text(opt.label);
      if (opt.description) {
        textLabel.popover({
          content: opt.description,
          trigger: "hover",
          html: true,
          placement: "top",
          container: "#settingModal"
        });
      }
      this.self = $(`<div class='customCheckboxContainer'></div>`).addClass(opt.offset !== 0 ? `offset${opt.offset}` : "").append($(`<div class='customCheckbox'></div>`).append(this.input).append(checkLabel)).append(textLabel);
      this.onSave = opt.onSave;
      this.onLoad = opt.onLoad;
      this.checked = this.load();
    }
    get checked() {
      return this.input.prop("checked");
    }
    set checked(val) {
      this.input.prop("checked", val);
    }
    get enabled() {
      return !this.self.hasClass("disabled");
    }
    set enabled(val) {
      if (val) {
        this.self.removeClass("disabled");
      } else {
        this.self.addClass("disabled");
      }
    }
    load() {
      return this.onLoad !== void 0 ? this.onLoad() : false;
    }
    save(val) {
      if (this.onSave) {
        this.onSave(val);
      }
    }
  }
  class AmqtbRadio {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "input");
      __publicField(this, "label");
      __publicField(this, "id");
      __publicField(this, "name");
      __publicField(this, "choices");
      __publicField(this, "onSave");
      __publicField(this, "onLoad");
      this.id = opt.id;
      this.name = opt.name;
      if (opt.choices.length > 10) {
        this.choices = opt.choices.slice(0, 10);
      } else {
        this.choices = opt.choices;
      }
      this.self = $(`<div class='amqtbRadio'></div>`);
      if (opt.label) {
        this.label = $(`<label></label>`).text(opt.label).css("width", "100%");
        if (opt.description) {
          this.label.popover({
            content: opt.description,
            trigger: "hover",
            html: true,
            placement: "top",
            container: "#settingModal"
          });
        }
        this.self.append(this.label);
      }
      this.input = $(`<input class='sliderInput' type='text'>`);
      this.self.append(this.input);
      this.input.bootstrapSlider({
        id: this.id,
        ticks: this.choices.map((_, idx) => idx),
        ticks_labels: this.choices.map((ch) => ch.label),
        value: 0,
        formatter: (idx) => this.choices[idx].label,
        selection: "none"
      });
      this.input.on("change", () => {
        this.save(this.value);
      });
      this.onSave = opt.onSave;
      this.onLoad = opt.onLoad;
      this.value = this.load();
    }
    relayout() {
      this.input.bootstrapSlider("relayout");
    }
    get value() {
      const idx = this.input.bootstrapSlider("getValue");
      return this.choices[idx].value;
    }
    set value(val) {
      const idx = this.choices.findIndex((c) => c.value === val);
      if (idx !== -1) {
        this.input.bootstrapSlider("setValue", idx);
      }
    }
    get enabled() {
      return this.input.bootstrapSlider("isEnabled");
    }
    set enabled(val) {
      if (val) {
        this.self.show();
        this.relayout();
      } else {
        this.self.hide();
      }
    }
    load() {
      return this.onLoad !== void 0 ? this.onLoad() : "";
    }
    save(val) {
      if (this.onSave) {
        this.onSave(val);
      }
    }
  }
  class AmqtbOptions {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "options");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.options = /* @__PURE__ */ new Map();
      this.self = $(`<div></div>`).addClass("col-xs-6").attr("id", id).addClass(cls);
      if (opt.title !== void 0) {
        this.self.append($(`<h4>${opt.title}</h4>`).css("text-align", "center"));
      }
    }
    refresh() {
      for (let opt of this.options.values()) {
        if ("enables" in opt) {
          this.updateEnabled(opt);
        }
      }
    }
    add(...options) {
      for (let option of options) {
        if (option.name) {
          if (this.options.has(option.name)) {
            console.warn(`Skip adding duplicated option '${option.name}' in this options`);
            continue;
          }
          this.options.set(option.name, option);
        }
        this.self.append(option.self);
        if (option instanceof AmqtbCheckbox) {
          option.input.on("click", () => {
            this.updateEnabled(option);
          });
        }
      }
    }
    get(opt) {
      if (typeof opt === "string") {
        return this.options.get(opt);
      } else {
        return opt.name === void 0 ? void 0 : this.options.get(opt.name);
      }
    }
    has(opt) {
      if (typeof opt === "string") {
        return this.options.has(opt);
      } else {
        return opt.name === void 0 ? false : this.options.has(opt.name);
      }
    }
    updateEnabled(opt) {
      for (let enableOptId of opt.enables) {
        let enableOpt = this.options.get(enableOptId);
        if (enableOpt) {
          if (enableOpt instanceof AmqtbCheckbox) {
            if (opt.checked) {
              enableOpt.checked = true;
            } else {
              enableOpt.checked = false;
            }
          }
          if (opt.checked) {
            enableOpt.enabled = true;
          } else {
            enableOpt.enabled = false;
          }
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
  class AmqtbTable {
    constructor(opt) {
      __publicField(this, "self");
      __publicField(this, "table");
      __publicField(this, "id");
      __publicField(this, "entries", []);
      __publicField(this, "addBtn");
      __publicField(this, "saveBtn");
      __publicField(this, "resetBtn");
      __publicField(this, "genRowElem");
      __publicField(this, "header");
      __publicField(this, "body");
      __publicField(this, "deletable");
      __publicField(this, "movable");
      __publicField(this, "onSave");
      __publicField(this, "onLoad");
      const cls = opt.class === void 0 ? "" : opt.class;
      const title = opt.title === void 0 ? null : opt.title;
      this.id = opt.id;
      this.genRowElem = opt.newRow;
      const tr = $(`<tr></tr>`);
      for (let field of opt.fieldNames) {
        tr.append($(`<th>${toTitle(field)}</th>`));
      }
      if (opt.deletable || opt.movable) {
        tr.append($(`<th></th>`));
      }
      this.header = $(`<thead></thead>`).append(tr);
      this.body = $(`<tbody></tbody>`);
      this.table = $(`<table class="table amqtbTable"></table>`).attr("id", opt.id).addClass(cls).append(this.header).append(this.body);
      this.self = $(`<div class="row"></div>`);
      if (title !== null) {
        this.self.append($(`<h4 style="text-align: center;"><b>${title}</b></h4>`));
      }
      this.self.append($(`<div></div>`).append(this.table));
      this.deletable = opt.deletable;
      this.movable = opt.movable;
      const buttons = [];
      if (opt.addable) {
        this.addBtn = new AmqtbButton({
          label: "Add New",
          size: "default",
          style: "success"
        });
        this.addBtn.self.on("click", () => {
          this.appendRow();
        });
        buttons.push(this.addBtn);
      }
      if (opt.settable) {
        this.saveBtn = new AmqtbButton({
          label: "Save",
          size: "default",
          style: "success"
        });
        this.saveBtn.self.on("click", () => {
          this.dump();
        });
        this.resetBtn = new AmqtbButton({
          label: "Reset",
          size: "default",
          style: "danger"
        });
        this.resetBtn.self.on("click", () => {
          this.reset();
        });
        buttons.push(this.saveBtn, this.resetBtn);
      }
      if (buttons.length > 0) {
        const btnContainer = new AmqtbButtonContainer({});
        for (let btn of buttons) {
          btnContainer.add(btn);
        }
        this.self.append(btnContainer.self);
      }
      this.onSave = opt.onSave;
      this.onLoad = opt.onLoad;
      this.reset();
    }
    createRow(rowData) {
      const cells = this.genRowElem();
      if (rowData !== void 0) {
        for (let fieldName of Object.keys(rowData)) {
          cells[fieldName].value = rowData[fieldName];
        }
      }
      const row = {
        ...cells,
        _elem: $(`<tr></tr>`)
      };
      for (let fieldName of Object.keys(cells)) {
        const cell = cells[fieldName];
        const td = $(`<td></td>`).append(cell.elem);
        row._elem.append(td);
      }
      const buttons = [];
      if (this.deletable) {
        const delBtn = new AmqtbButton({
          label: "",
          name: "delBtn",
          size: "small",
          style: "danger"
        });
        delBtn.self.append($(`<i class="fa fa-trash" style="font-size: 15px;"></i>`)).on("click", () => {
          row._elem.remove();
          const idx = this.entries.findIndex((r) => r === row);
          this.entries.splice(idx, 1);
        });
        buttons.push(delBtn);
      }
      if (this.movable) {
        const upBtn = new AmqtbButton({
          label: "",
          size: "small",
          style: "primary"
        });
        upBtn.self.append($(`<i class="fa fa-arrow-up" style="font-size: 15px;"></i>`)).on("click", () => {
          const prev = row._elem.prev();
          const cur = row._elem;
          if (prev.length != 0) {
            cur.detach().insertBefore(prev);
          }
          const idx = this.entries.findIndex((r) => r === row);
          if (idx > 0) {
            [this.entries[idx - 1], this.entries[idx]] = [this.entries[idx], this.entries[idx - 1]];
          }
        });
        const downBtn = new AmqtbButton({
          label: "",
          size: "small",
          style: "primary"
        });
        downBtn.self.append($(`<i class="fa fa-arrow-down" style="font-size: 15px;"></i>`)).on("click", () => {
          let next = row._elem.next();
          let cur = row._elem;
          if (next.length != 0) {
            cur.detach().insertAfter(next);
          }
          const idx = this.entries.findIndex((r) => r === row);
          if (idx < this.entries.length - 1) {
            [this.entries[idx], this.entries[idx + 1]] = [this.entries[idx + 1], this.entries[idx]];
          }
        });
        buttons.push(upBtn, downBtn);
      }
      if (buttons.length > 0) {
        const td = $(`<td></td>`).append(buttons.map((btn) => btn.self));
        row._elem.append(td);
      }
      return row;
    }
    appendRow(rowData) {
      const row = this.createRow(rowData);
      console.log(`Append new row on table '${this.id}':`, row);
      this.body.append(row._elem);
      this.entries.push(row);
    }
    insertRowBefore(target, rowData) {
      const newRow = this.createRow(rowData);
      const idx = this.entries.findIndex((row) => row === target);
      if (idx !== -1) {
        console.log(`Insert new row on table[${idx}] '${this.id}':`, newRow);
        newRow._elem.insertBefore(target._elem);
        this.entries.splice(idx, 0, newRow);
      }
    }
    dump() {
      const datas = [];
      for (let row of this.entries) {
        const rowData = {};
        for (let fieldName of Object.keys(row)) {
          if (fieldName !== "_elem") {
            rowData[fieldName] = row[fieldName].value;
          }
        }
        datas.push(rowData);
      }
      console.log(`Save table '${this.id}':`, datas);
      if (this.onSave) {
        this.onSave(datas);
      }
    }
    reset() {
      this.body.empty();
      this.entries.length = 0;
      const datas = this.onLoad !== void 0 ? this.onLoad() : void 0;
      console.log(`Reset and load table '${this.id}':`, datas);
      if (datas !== void 0) {
        for (let rowData of datas) {
          this.appendRow(rowData);
        }
      }
    }
  }
  var styles = ".amqtbButtonContainer {\n  display: flex;\n  flex-flow: row wrap;\n  justify-content: space-around;\n  align-content: space-around;\n  margin: 5px 0;\n}\n.amqtbButtonContainer button {\n  margin: 5px 0;\n}\n.customCheckboxContainer {\n  display: flex;\n}\n.customCheckboxContainer > div {\n  display: inline-block;\n  margin: 5px 0px;\n}\n.customCheckboxContainer > .customCheckboxContainerLabel {\n  margin-left: 5px;\n  margin-top: 5px;\n  font-weight: normal;\n}\n.amqtbRadio {\n  text-align: center;\n}\n.offset1 {\n  margin-left: 20px;\n}\n.offset2 {\n  margin-left: 40px;\n}\n.amqtbTable {\n    border-collapse: separate;\n    padding: 0 15px;\n}\n.amqtbTable th, .amqtbTable td {\n    text-align: center;\n    vertical-align: middle !important;\n}\n.amqtbTable thead {\n    background-color: #000;\n}\n.amqtbTable tbody tr {\n    background-color: #424242 !important;\n}\n.amqtbWindow {\n  overflow-y: hidden;\n  top: 0px;\n  left: 0px;\n  margin: 0px;\n  background-color: #424242;\n  border: 1px solid rgba(27, 27, 27, 0.2);\n  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n  user-select: text;\n  display: none;\n}\n.draggableWindow {\n  cursor: move;\n}\n.amqtbWindowBody {\n  width: 100%;\n  overflow-y: auto;\n}\n.amqtbWindowContent {\n  width: 100%;\n  position: absolute;\n  top: 0px;\n}\n.amqtbWindow .close {\n  font-size: 32px;\n}\n.windowResizers {\n  width: 100%;\n  height: 100%;\n}\n.windowResizer {\n  width: 10px;\n  height: 10px;\n  position: absolute;\n  z-index: 100;\n}\n.windowResizer.top-left {\n  top: 0px;\n  left: 0px;\n  cursor: nwse-resize;\n}\n.windowResizer.top-right {\n  top: 0px;\n  right: 0px;\n  cursor: nesw-resize;\n}\n.windowResizer.bottom-left {\n  bottom: 0px;\n  left: 0px;\n  cursor: nesw-resize;\n}\n.windowResizer.bottom-right {\n  bottom: 0px;\n  right: 0px;\n  cursor: nwse-resize;\n}\n#qpToolboxContainer {\n  max-width: 215px;\n  min-width: 208px;\n  width: calc(100% + 30px);\n  position: absolute;\n  border-radius: 5px;\n  padding-bottom: 5px;\n  padding-top: 5px;\n  margin-top: 10px;\n  left: 0px;\n  right: 0px;\n}\n#qpToolboxContainer h5 {\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n#amqtbSettingButton {\n  width: 30px;\n  height: 100%;\n}\n#qpAvatarRow {\n  width: 80%;\n}\n.collapsible:hover {\n  background-color: #555;\n}\n.amqtbPluginManageTableEnabledCell {\n  position: relative;\n  top: -10px;\n  left: -25px;\n  display: inline-block;\n}";
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
  function deleteCookie(key) {
    Cookies.remove(key, attr);
  }
  class AmqtbViewBlock {
    constructor(opt) {
      __publicField(this, "self");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.self = $(`<div class="row"></div>`).attr("id", id).addClass(cls);
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
  const PluginManageTableId = "amqtbPluginManageTable";
  class PluginNameCell {
    constructor() {
      __publicField(this, "elem");
      this.elem = $(`<p></p>`);
    }
    get value() {
      return this.elem.text();
    }
    set value(str) {
      this.elem.text(str);
    }
  }
  class EnabledCell {
    constructor(enabled) {
      __publicField(this, "elem");
      __publicField(this, "switch");
      __publicField(this, "switchOn");
      __publicField(this, "switchOff");
      this.switchOff = $(`<div class="switchOff slider-tick round"></div>`);
      this.switchOn = $(`<div class="switchOn slider-tick round"></div>`);
      this.switch = $(`<div class="switchContainer slider-track"></div>`).append($(`<div class="slider-tick-container"></div>`).append(this.switchOff).append(this.switchOn));
      this.elem = $(`<div></div>`).addClass(`${PluginManageTableId}EnabledCell`).append(this.switch);
      if (enabled) {
        this.switchOff.hide();
        this.switch.addClass("active");
      } else {
        this.switchOn.hide();
        this.switch.removeClass("active");
      }
      this.switch.on("click", () => {
        this.value = !this.value;
      });
    }
    get value() {
      return this.switch.hasClass("active");
    }
    set value(val) {
      if (val !== this.value) {
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
    }
  }
  class AMQ_Toolbox {
    constructor() {
      __publicField(this, "settingModal");
      __publicField(this, "viewBlocks");
      __publicField(this, "tabContainer");
      __publicField(this, "settingButton");
      __publicField(this, "optionsTab");
      __publicField(this, "manageModal");
      __publicField(this, "manageTable");
      __publicField(this, "plugins");
      __publicField(this, "oldPluginsInfo");
      this.viewBlocks = $(`<div></div>`).attr("id", "qpToolboxContainer").addClass("container floatingContainer");
      this.viewBlocks.insertBefore($(`#qpCheatTestCommands`));
      this.tabContainer = new AmqtbTabContainer();
      this.settingModal = new AmqtbModal({
        id: "amqtbSettingModal",
        title: "Toolbox Setting",
        size: "normal",
        content: this.tabContainer
      });
      this.optionsTab = new AmqtbTab({
        title: "Option",
        name: "optionsTab",
        containerClass: "row"
      });
      this.tabContainer.add(this.optionsTab);
      this.tabContainer.select(this.optionsTab);
      this.settingButton = $(`<div></div>`).attr("id", "amqtbSettingButton").addClass("clickAble qpOption").append($(`<i></i>`).addClass("fa fa-wrench").addClass("qpMenuItem").attr("aria-hidden", "true")).on("click", () => {
        this.settingModal.self.modal("show");
      }).popover({
        placement: "bottom",
        content: "Toolbox Setting",
        trigger: "hover"
      });
      const oldWidth = $("#qpOptionContainer").width();
      $("#qpOptionContainer").width(oldWidth + 35);
      $("#qpOptionContainer > div").append(this.settingButton);
      this.plugins = [];
      this.manageTable = new AmqtbTable({
        id: PluginManageTableId,
        addable: false,
        deletable: false,
        movable: true,
        settable: true,
        fieldNames: ["pluginName", "enabled"],
        newRow: () => {
          return {
            pluginName: new PluginNameCell(),
            enabled: new EnabledCell(true)
          };
        },
        onSave: (data) => {
          saveToCookie(PluginManageTableId, data);
        },
        onLoad: () => {
          return loadFromCookie(PluginManageTableId);
        }
      });
      this.manageTable.saveBtn.self.on("click", () => {
        console.log("Refresh AMQ Toolbox");
        this.refresh();
        this.manageModal.self.modal("hide");
      });
      this.oldPluginsInfo = loadFromCookie(PluginManageTableId, []);
      deleteCookie(PluginManageTableId);
      this.manageTable.reset();
      this.manageModal = new AmqtbModal({
        id: "amqtbManageModal",
        title: "Toolbox Management",
        content: this.manageTable.self,
        size: "normal"
      });
      $("#optionsContainer > ul").prepend($(`<li class="clickAble" data-toggle="modal" data-target="#amqtbManageModal"></li>`).text("Plugins"));
      $("#optionsContainer > ul").prepend($(`<li class="clickAble" data-toggle="modal" data-target="#amqtbSettingModal"></li>`).text("Toolbox Setting"));
      GM_addStyle(styles);
      console.log("New AMQ Toolbox created");
    }
    registerPlugin(plugin) {
      if (plugin.dependencies && !this.checkDependency(plugin.dependencies)) {
        return new Error("Dependencies has not loaded");
      }
      this.plugins.push(plugin);
      const saveInfo = this.oldPluginsInfo.find((info) => info.pluginName === plugin.name);
      if (saveInfo !== void 0) {
        plugin.enabled = saveInfo.enabled;
      }
      const newEntry = {
        pluginName: plugin.name,
        enabled: plugin.enabled
      };
      const savedOrder = this.oldPluginsInfo.findIndex((info) => info.pluginName === plugin.name);
      if (savedOrder !== -1) {
        newEntry.enabled = this.oldPluginsInfo[savedOrder].enabled;
        let added = false;
        for (let entry of this.manageTable.entries) {
          const order = this.oldPluginsInfo.findIndex((info) => info.pluginName === entry.pluginName.value);
          if (order === void 0 || savedOrder < order) {
            this.manageTable.insertRowBefore(entry, newEntry);
            added = true;
            break;
          }
        }
        if (!added) {
          this.manageTable.appendRow(newEntry);
        }
      } else {
        this.manageTable.appendRow(newEntry);
      }
      this.manageTable.saveBtn.self.trigger("click");
      console.log(`Register plugin: ${plugin.name}`);
      return null;
    }
    refresh() {
      this.viewBlocks.children().detach();
      this.tabContainer.hideAll();
      this.tabContainer.show(this.optionsTab);
      this.optionsTab.container.children(".col-xs-6").detach();
      for (let info of this.manageTable.entries) {
        const plugin = this.plugins.find((p) => p.name === info.pluginName.value);
        if (plugin === void 0) {
          console.error("loaded Plugin: ", this.plugins.map((p) => p.name), "\nentry in table: ", info.pluginName.value);
        } else {
          plugin.enabled = info.enabled.value;
          if (plugin.enabled) {
            if (plugin.view) {
              this.viewBlocks.append(plugin.view.self);
            }
            if (plugin.settingTab) {
              if (this.tabContainer.has(plugin.settingTab)) {
                this.tabContainer.show(plugin.settingTab);
              } else {
                this.tabContainer.add(plugin.settingTab);
              }
            }
            if (plugin.enabled && plugin.options) {
              this.optionsTab.container.append(plugin.options.self);
              this.settingModal.self.on("shown.bs.modal", () => {
                plugin.options.refresh();
              });
            }
          }
        }
      }
    }
    checkDependency(dps) {
      let ret = true;
      let pluginNames = this.plugins.map((p) => p.name);
      dps.forEach((dp) => {
        if (!pluginNames.includes(dp)) {
          ret = false;
        }
      });
      return ret;
    }
  }
  var validator$2 = {};
  var util$2 = {};
  (function(exports) {
    const nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    const nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    const nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    const regexName = new RegExp("^" + nameRegexp + "$");
    const getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    const isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports.isExist = function(v) {
      return typeof v !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a, arrayMode) {
      if (a) {
        const keys = Object.keys(a);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          if (arrayMode === "strict") {
            target[keys[i]] = [a[keys[i]]];
          } else {
            target[keys[i]] = a[keys[i]];
          }
        }
      }
    };
    exports.getValue = function(v) {
      if (exports.isExist(v)) {
        return v;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  })(util$2);
  const util$1 = util$2;
  const defaultOptions$2 = {
    allowBooleanAttributes: false,
    unpairedTags: []
  };
  validator$2.validate = function(xmlData, options) {
    options = Object.assign({}, defaultOptions$2, options);
    const tags = [];
    let tagFound = false;
    let reachedRoot = false;
    if (xmlData[0] === "\uFEFF") {
      xmlData = xmlData.substr(1);
    }
    for (let i = 0; i < xmlData.length; i++) {
      if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
        i += 2;
        i = readPI(xmlData, i);
        if (i.err)
          return i;
      } else if (xmlData[i] === "<") {
        let tagStartPos = i;
        i++;
        if (xmlData[i] === "!") {
          i = readCommentAndCDATA(xmlData, i);
          continue;
        } else {
          let closingTag = false;
          if (xmlData[i] === "/") {
            closingTag = true;
            i++;
          }
          let tagName = "";
          for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
            tagName += xmlData[i];
          }
          tagName = tagName.trim();
          if (tagName[tagName.length - 1] === "/") {
            tagName = tagName.substring(0, tagName.length - 1);
            i--;
          }
          if (!validateTagName(tagName)) {
            let msg;
            if (tagName.trim().length === 0) {
              msg = "Invalid space after '<'.";
            } else {
              msg = "Tag '" + tagName + "' is an invalid name.";
            }
            return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
          }
          const result = readAttributeStr(xmlData, i);
          if (result === false) {
            return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
          }
          let attrStr = result.value;
          i = result.index;
          if (attrStr[attrStr.length - 1] === "/") {
            const attrStrStart = i - attrStr.length;
            attrStr = attrStr.substring(0, attrStr.length - 1);
            const isValid = validateAttributeString(attrStr, options);
            if (isValid === true) {
              tagFound = true;
            } else {
              return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
            }
          } else if (closingTag) {
            if (!result.tagClosed) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
            } else if (attrStr.trim().length > 0) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
            } else {
              const otg = tags.pop();
              if (tagName !== otg.tagName) {
                let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                return getErrorObject("InvalidTag", "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.", getLineNumberForPosition(xmlData, tagStartPos));
              }
              if (tags.length == 0) {
                reachedRoot = true;
              }
            }
          } else {
            const isValid = validateAttributeString(attrStr, options);
            if (isValid !== true) {
              return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
            }
            if (reachedRoot === true) {
              return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
            } else if (options.unpairedTags.indexOf(tagName) !== -1)
              ;
            else {
              tags.push({ tagName, tagStartPos });
            }
            tagFound = true;
          }
          for (i++; i < xmlData.length; i++) {
            if (xmlData[i] === "<") {
              if (xmlData[i + 1] === "!") {
                i++;
                i = readCommentAndCDATA(xmlData, i);
                continue;
              } else if (xmlData[i + 1] === "?") {
                i = readPI(xmlData, ++i);
                if (i.err)
                  return i;
              } else {
                break;
              }
            } else if (xmlData[i] === "&") {
              const afterAmp = validateAmpersand(xmlData, i);
              if (afterAmp == -1)
                return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
              i = afterAmp;
            } else {
              if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
                return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
              }
            }
          }
          if (xmlData[i] === "<") {
            i--;
          }
        }
      } else {
        if (isWhiteSpace(xmlData[i])) {
          continue;
        }
        return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
      }
    }
    if (!tagFound) {
      return getErrorObject("InvalidXml", "Start tag expected.", 1);
    } else if (tags.length == 1) {
      return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
    } else if (tags.length > 0) {
      return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
    }
    return true;
  };
  function isWhiteSpace(char) {
    return char === " " || char === "	" || char === "\n" || char === "\r";
  }
  function readPI(xmlData, i) {
    const start = i;
    for (; i < xmlData.length; i++) {
      if (xmlData[i] == "?" || xmlData[i] == " ") {
        const tagname = xmlData.substr(start, i - start);
        if (i > 5 && tagname === "xml") {
          return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
        } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
          i++;
          break;
        } else {
          continue;
        }
      }
    }
    return i;
  }
  function readCommentAndCDATA(xmlData, i) {
    if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
      for (i += 3; i < xmlData.length; i++) {
        if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
          i += 2;
          break;
        }
      }
    } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
      let angleBracketsCount = 1;
      for (i += 8; i < xmlData.length; i++) {
        if (xmlData[i] === "<") {
          angleBracketsCount++;
        } else if (xmlData[i] === ">") {
          angleBracketsCount--;
          if (angleBracketsCount === 0) {
            break;
          }
        }
      }
    } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
      for (i += 8; i < xmlData.length; i++) {
        if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
          i += 2;
          break;
        }
      }
    }
    return i;
  }
  const doubleQuote = '"';
  const singleQuote = "'";
  function readAttributeStr(xmlData, i) {
    let attrStr = "";
    let startChar = "";
    let tagClosed = false;
    for (; i < xmlData.length; i++) {
      if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
        if (startChar === "") {
          startChar = xmlData[i];
        } else if (startChar !== xmlData[i])
          ;
        else {
          startChar = "";
        }
      } else if (xmlData[i] === ">") {
        if (startChar === "") {
          tagClosed = true;
          break;
        }
      }
      attrStr += xmlData[i];
    }
    if (startChar !== "") {
      return false;
    }
    return {
      value: attrStr,
      index: i,
      tagClosed
    };
  }
  const validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
  function validateAttributeString(attrStr, options) {
    const matches = util$1.getAllMatches(attrStr, validAttrStrRegxp);
    const attrNames = {};
    for (let i = 0; i < matches.length; i++) {
      if (matches[i][1].length === 0) {
        return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
      } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
        return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
      } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
        return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
      }
      const attrName = matches[i][2];
      if (!validateAttrName(attrName)) {
        return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
      }
      if (!attrNames.hasOwnProperty(attrName)) {
        attrNames[attrName] = 1;
      } else {
        return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
      }
    }
    return true;
  }
  function validateNumberAmpersand(xmlData, i) {
    let re = /\d/;
    if (xmlData[i] === "x") {
      i++;
      re = /[\da-fA-F]/;
    }
    for (; i < xmlData.length; i++) {
      if (xmlData[i] === ";")
        return i;
      if (!xmlData[i].match(re))
        break;
    }
    return -1;
  }
  function validateAmpersand(xmlData, i) {
    i++;
    if (xmlData[i] === ";")
      return -1;
    if (xmlData[i] === "#") {
      i++;
      return validateNumberAmpersand(xmlData, i);
    }
    let count = 0;
    for (; i < xmlData.length; i++, count++) {
      if (xmlData[i].match(/\w/) && count < 20)
        continue;
      if (xmlData[i] === ";")
        break;
      return -1;
    }
    return i;
  }
  function getErrorObject(code, message, lineNumber) {
    return {
      err: {
        code,
        msg: message,
        line: lineNumber.line || lineNumber,
        col: lineNumber.col
      }
    };
  }
  function validateAttrName(attrName) {
    return util$1.isName(attrName);
  }
  function validateTagName(tagname) {
    return util$1.isName(tagname);
  }
  function getLineNumberForPosition(xmlData, index) {
    const lines = xmlData.substring(0, index).split(/\r?\n/);
    return {
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    };
  }
  function getPositionFromMatch(match) {
    return match.startIndex + match[1].length;
  }
  var OptionsBuilder = {};
  const defaultOptions$1 = {
    preserveOrder: false,
    attributeNamePrefix: "@_",
    attributesGroupName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    removeNSPrefix: false,
    allowBooleanAttributes: false,
    parseTagValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataPropName: false,
    numberParseOptions: {
      hex: true,
      leadingZeros: true
    },
    tagValueProcessor: function(tagName, val) {
      return val;
    },
    attributeValueProcessor: function(attrName, val) {
      return val;
    },
    stopNodes: [],
    alwaysCreateTextNode: false,
    isArray: () => false,
    commentPropName: false,
    unpairedTags: [],
    processEntities: true,
    htmlEntities: false,
    ignoreDeclaration: false,
    ignorePiTags: false,
    transformTagName: false
  };
  const buildOptions$1 = function(options) {
    return Object.assign({}, defaultOptions$1, options);
  };
  OptionsBuilder.buildOptions = buildOptions$1;
  OptionsBuilder.defaultOptions = defaultOptions$1;
  class XmlNode {
    constructor(tagname) {
      this.tagname = tagname;
      this.child = [];
      this[":@"] = {};
    }
    add(key, val) {
      this.child.push({ [key]: val });
    }
    addChild(node) {
      if (node[":@"] && Object.keys(node[":@"]).length > 0) {
        this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
      } else {
        this.child.push({ [node.tagname]: node.child });
      }
    }
  }
  var xmlNode$1 = XmlNode;
  function readDocType$1(xmlData, i) {
    const entities = {};
    if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
      i = i + 9;
      let angleBracketsCount = 1;
      let hasBody = false, entity = false, comment = false;
      let exp = "";
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === "<") {
          if (hasBody && xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "N" && xmlData[i + 4] === "T" && xmlData[i + 5] === "I" && xmlData[i + 6] === "T" && xmlData[i + 7] === "Y") {
            i += 7;
            entity = true;
          } else if (hasBody && xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "L" && xmlData[i + 4] === "E" && xmlData[i + 5] === "M" && xmlData[i + 6] === "E" && xmlData[i + 7] === "N" && xmlData[i + 8] === "T") {
            i += 8;
          } else if (hasBody && xmlData[i + 1] === "!" && xmlData[i + 2] === "A" && xmlData[i + 3] === "T" && xmlData[i + 4] === "T" && xmlData[i + 5] === "L" && xmlData[i + 6] === "I" && xmlData[i + 7] === "S" && xmlData[i + 8] === "T") {
            i += 8;
          } else if (hasBody && xmlData[i + 1] === "!" && xmlData[i + 2] === "N" && xmlData[i + 3] === "O" && xmlData[i + 4] === "T" && xmlData[i + 5] === "A" && xmlData[i + 6] === "T" && xmlData[i + 7] === "I" && xmlData[i + 8] === "O" && xmlData[i + 9] === "N") {
            i += 9;
          } else if (xmlData[i + 1] === "!" && xmlData[i + 2] === "-" && xmlData[i + 3] === "-") {
            comment = true;
          } else {
            throw new Error("Invalid DOCTYPE");
          }
          angleBracketsCount++;
          exp = "";
        } else if (xmlData[i] === ">") {
          if (comment) {
            if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
              comment = false;
            } else {
              throw new Error(`Invalid XML comment in DOCTYPE`);
            }
          } else if (entity) {
            parseEntityExp(exp, entities);
            entity = false;
          }
          angleBracketsCount--;
          if (angleBracketsCount === 0) {
            break;
          }
        } else if (xmlData[i] === "[") {
          hasBody = true;
        } else {
          exp += xmlData[i];
        }
      }
      if (angleBracketsCount !== 0) {
        throw new Error(`Unclosed DOCTYPE`);
      }
    } else {
      throw new Error(`Invalid Tag instead of DOCTYPE`);
    }
    return { entities, i };
  }
  const entityRegex = RegExp(`^\\s([a-zA-z0-0]+)[ 	](['"])([^&]+)\\2`);
  function parseEntityExp(exp, entities) {
    const match = entityRegex.exec(exp);
    if (match) {
      entities[match[1]] = {
        regx: RegExp(`&${match[1]};`, "g"),
        val: match[3]
      };
    }
  }
  var DocTypeReader = readDocType$1;
  const hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
  const numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
  if (!Number.parseInt && window.parseInt) {
    Number.parseInt = window.parseInt;
  }
  if (!Number.parseFloat && window.parseFloat) {
    Number.parseFloat = window.parseFloat;
  }
  const consider = {
    hex: true,
    leadingZeros: true,
    decimalPoint: ".",
    eNotation: true
  };
  function toNumber$1(str, options = {}) {
    options = Object.assign({}, consider, options);
    if (!str || typeof str !== "string")
      return str;
    let trimmedStr = str.trim();
    if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr))
      return str;
    else if (options.hex && hexRegex.test(trimmedStr)) {
      return Number.parseInt(trimmedStr, 16);
    } else {
      const match = numRegex.exec(trimmedStr);
      if (match) {
        const sign = match[1];
        const leadingZeros = match[2];
        let numTrimmedByZeros = trimZeros(match[3]);
        const eNotation = match[4] || match[6];
        if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".")
          return str;
        else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".")
          return str;
        else {
          const num = Number(trimmedStr);
          const numStr = "" + num;
          if (numStr.search(/[eE]/) !== -1) {
            if (options.eNotation)
              return num;
            else
              return str;
          } else if (eNotation) {
            if (options.eNotation)
              return num;
            else
              return str;
          } else if (trimmedStr.indexOf(".") !== -1) {
            if (numStr === "0" && numTrimmedByZeros === "")
              return num;
            else if (numStr === numTrimmedByZeros)
              return num;
            else if (sign && numStr === "-" + numTrimmedByZeros)
              return num;
            else
              return str;
          }
          if (leadingZeros) {
            if (numTrimmedByZeros === numStr)
              return num;
            else if (sign + numTrimmedByZeros === numStr)
              return num;
            else
              return str;
          }
          if (trimmedStr === numStr)
            return num;
          else if (trimmedStr === sign + numStr)
            return num;
          return str;
        }
      } else {
        return str;
      }
    }
  }
  function trimZeros(numStr) {
    if (numStr && numStr.indexOf(".") !== -1) {
      numStr = numStr.replace(/0+$/, "");
      if (numStr === ".")
        numStr = "0";
      else if (numStr[0] === ".")
        numStr = "0" + numStr;
      else if (numStr[numStr.length - 1] === ".")
        numStr = numStr.substr(0, numStr.length - 1);
      return numStr;
    }
    return numStr;
  }
  var strnum = toNumber$1;
  const util = util$2;
  const xmlNode = xmlNode$1;
  const readDocType = DocTypeReader;
  const toNumber = strnum;
  "<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)".replace(/NAME/g, util.nameRegexp);
  class OrderedObjParser$1 {
    constructor(options) {
      this.options = options;
      this.currentNode = null;
      this.tagsNodeStack = [];
      this.docTypeEntities = {};
      this.lastEntities = {
        "amp": { regex: /&(amp|#38|#x26);/g, val: "&" },
        "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
        "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
        "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
        "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
      };
      this.htmlEntities = {
        "space": { regex: /&(nbsp|#160);/g, val: " " },
        "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
        "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
        "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
        "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
        "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
        "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
        "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" }
      };
      this.addExternalEntities = addExternalEntities;
      this.parseXml = parseXml;
      this.parseTextData = parseTextData;
      this.resolveNameSpace = resolveNameSpace;
      this.buildAttributesMap = buildAttributesMap;
      this.isItStopNode = isItStopNode;
      this.replaceEntitiesValue = replaceEntitiesValue$2;
      this.readStopNodeData = readStopNodeData;
      this.saveTextToParentTag = saveTextToParentTag;
    }
  }
  function addExternalEntities(externalEntities) {
    const entKeys = Object.keys(externalEntities);
    for (let i = 0; i < entKeys.length; i++) {
      const ent = entKeys[i];
      this.lastEntities[ent] = {
        regex: new RegExp("&" + ent + ";", "g"),
        val: externalEntities[ent]
      };
    }
  }
  function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
    if (val !== void 0) {
      if (this.options.trimValues && !dontTrim) {
        val = val.trim();
      }
      if (val.length > 0) {
        if (!escapeEntities)
          val = this.replaceEntitiesValue(val);
        const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
        if (newval === null || newval === void 0) {
          return val;
        } else if (typeof newval !== typeof val || newval !== val) {
          return newval;
        } else if (this.options.trimValues) {
          return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
        } else {
          const trimmedVal = val.trim();
          if (trimmedVal === val) {
            return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            return val;
          }
        }
      }
    }
  }
  function resolveNameSpace(tagname) {
    if (this.options.removeNSPrefix) {
      const tags = tagname.split(":");
      const prefix = tagname.charAt(0) === "/" ? "/" : "";
      if (tags[0] === "xmlns") {
        return "";
      }
      if (tags.length === 2) {
        tagname = prefix + tags[1];
      }
    }
    return tagname;
  }
  const attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
  function buildAttributesMap(attrStr, jPath) {
    if (!this.options.ignoreAttributes && typeof attrStr === "string") {
      const matches = util.getAllMatches(attrStr, attrsRegx);
      const len = matches.length;
      const attrs = {};
      for (let i = 0; i < len; i++) {
        const attrName = this.resolveNameSpace(matches[i][1]);
        let oldVal = matches[i][4];
        const aName = this.options.attributeNamePrefix + attrName;
        if (attrName.length) {
          if (oldVal !== void 0) {
            if (this.options.trimValues) {
              oldVal = oldVal.trim();
            }
            oldVal = this.replaceEntitiesValue(oldVal);
            const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
            if (newVal === null || newVal === void 0) {
              attrs[aName] = oldVal;
            } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
              attrs[aName] = newVal;
            } else {
              attrs[aName] = parseValue(oldVal, this.options.parseAttributeValue, this.options.numberParseOptions);
            }
          } else if (this.options.allowBooleanAttributes) {
            attrs[aName] = true;
          }
        }
      }
      if (!Object.keys(attrs).length) {
        return;
      }
      if (this.options.attributesGroupName) {
        const attrCollection = {};
        attrCollection[this.options.attributesGroupName] = attrs;
        return attrCollection;
      }
      return attrs;
    }
  }
  const parseXml = function(xmlData) {
    xmlData = xmlData.replace(/\r\n?/g, "\n");
    const xmlObj = new xmlNode("!xml");
    let currentNode = xmlObj;
    let textData = "";
    let jPath = "";
    for (let i = 0; i < xmlData.length; i++) {
      const ch = xmlData[i];
      if (ch === "<") {
        if (xmlData[i + 1] === "/") {
          const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
          let tagName = xmlData.substring(i + 2, closeIndex).trim();
          if (this.options.removeNSPrefix) {
            const colonIndex = tagName.indexOf(":");
            if (colonIndex !== -1) {
              tagName = tagName.substr(colonIndex + 1);
            }
          }
          if (this.options.transformTagName) {
            tagName = this.options.transformTagName(tagName);
          }
          if (currentNode) {
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
          }
          jPath = jPath.substr(0, jPath.lastIndexOf("."));
          currentNode = this.tagsNodeStack.pop();
          textData = "";
          i = closeIndex;
        } else if (xmlData[i + 1] === "?") {
          let tagData = readTagExp(xmlData, i, false, "?>");
          if (!tagData)
            throw new Error("Pi Tag is not closed.");
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
          if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags)
            ;
          else {
            const childNode = new xmlNode(tagData.tagName);
            childNode.add(this.options.textNodeName, "");
            if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath);
            }
            currentNode.addChild(childNode);
          }
          i = tagData.closeIndex + 1;
        } else if (xmlData.substr(i + 1, 3) === "!--") {
          const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
          if (this.options.commentPropName) {
            const comment = xmlData.substring(i + 4, endIndex - 2);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
          }
          i = endIndex;
        } else if (xmlData.substr(i + 1, 2) === "!D") {
          const result = readDocType(xmlData, i);
          this.docTypeEntities = result.entities;
          i = result.i;
        } else if (xmlData.substr(i + 1, 2) === "![") {
          const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
          const tagExp = xmlData.substring(i + 9, closeIndex);
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
          if (this.options.cdataPropName) {
            currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
          } else {
            let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true);
            if (val == void 0)
              val = "";
            currentNode.add(this.options.textNodeName, val);
          }
          i = closeIndex + 2;
        } else {
          let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
          let tagName = result.tagName;
          let tagExp = result.tagExp;
          let attrExpPresent = result.attrExpPresent;
          let closeIndex = result.closeIndex;
          if (this.options.transformTagName) {
            tagName = this.options.transformTagName(tagName);
          }
          if (currentNode && textData) {
            if (currentNode.tagname !== "!xml") {
              textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
            }
          }
          if (tagName !== xmlObj.tagname) {
            jPath += jPath ? "." + tagName : tagName;
          }
          const lastTag = currentNode;
          if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
            currentNode = this.tagsNodeStack.pop();
          }
          if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
            let tagContent = "";
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              i = result.closeIndex;
            } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
              i = result.closeIndex;
            } else {
              const result2 = this.readStopNodeData(xmlData, tagName, closeIndex + 1);
              if (!result2)
                throw new Error(`Unexpected end of ${tagName}`);
              i = result2.i;
              tagContent = result2.tagContent;
            }
            const childNode = new xmlNode(tagName);
            if (tagName !== tagExp && attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
            }
            if (tagContent) {
              tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
            }
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
            childNode.add(this.options.textNodeName, tagContent);
            currentNode.addChild(childNode);
          } else {
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substr(0, tagName.length - 1);
                tagExp = tagName;
              } else {
                tagExp = tagExp.substr(0, tagExp.length - 1);
              }
              if (this.options.transformTagName) {
                tagName = this.options.transformTagName(tagName);
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              currentNode.addChild(childNode);
            } else {
              const childNode = new xmlNode(tagName);
              this.tagsNodeStack.push(currentNode);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
              }
              currentNode.addChild(childNode);
              currentNode = childNode;
            }
            textData = "";
            i = closeIndex;
          }
        }
      } else {
        textData += xmlData[i];
      }
    }
    return xmlObj.child;
  };
  const replaceEntitiesValue$2 = function(val) {
    if (this.options.processEntities) {
      for (let entityName in this.docTypeEntities) {
        const entity = this.docTypeEntities[entityName];
        val = val.replace(entity.regx, entity.val);
      }
      for (let entityName in this.lastEntities) {
        const entity = this.lastEntities[entityName];
        val = val.replace(entity.regex, entity.val);
      }
      if (this.options.htmlEntities) {
        for (let entityName in this.htmlEntities) {
          const entity = this.htmlEntities[entityName];
          val = val.replace(entity.regex, entity.val);
        }
      }
    }
    return val;
  };
  function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
    if (textData) {
      if (isLeafNode === void 0)
        isLeafNode = Object.keys(currentNode.child).length === 0;
      textData = this.parseTextData(textData, currentNode.tagname, jPath, false, currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false, isLeafNode);
      if (textData !== void 0 && textData !== "")
        currentNode.add(this.options.textNodeName, textData);
      textData = "";
    }
    return textData;
  }
  function isItStopNode(stopNodes, jPath, currentTagName) {
    const allNodesExp = "*." + currentTagName;
    for (const stopNodePath in stopNodes) {
      const stopNodeExp = stopNodes[stopNodePath];
      if (allNodesExp === stopNodeExp || jPath === stopNodeExp)
        return true;
    }
    return false;
  }
  function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
    let attrBoundary;
    let tagExp = "";
    for (let index = i; index < xmlData.length; index++) {
      let ch = xmlData[index];
      if (attrBoundary) {
        if (ch === attrBoundary)
          attrBoundary = "";
      } else if (ch === '"' || ch === "'") {
        attrBoundary = ch;
      } else if (ch === closingChar[0]) {
        if (closingChar[1]) {
          if (xmlData[index + 1] === closingChar[1]) {
            return {
              data: tagExp,
              index
            };
          }
        } else {
          return {
            data: tagExp,
            index
          };
        }
      } else if (ch === "	") {
        ch = " ";
      }
      tagExp += ch;
    }
  }
  function findClosingIndex(xmlData, str, i, errMsg) {
    const closingIndex = xmlData.indexOf(str, i);
    if (closingIndex === -1) {
      throw new Error(errMsg);
    } else {
      return closingIndex + str.length - 1;
    }
  }
  function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
    const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
    if (!result)
      return;
    let tagExp = result.data;
    const closeIndex = result.index;
    const separatorIndex = tagExp.search(/\s/);
    let tagName = tagExp;
    let attrExpPresent = true;
    if (separatorIndex !== -1) {
      tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, "");
      tagExp = tagExp.substr(separatorIndex + 1);
    }
    if (removeNSPrefix) {
      const colonIndex = tagName.indexOf(":");
      if (colonIndex !== -1) {
        tagName = tagName.substr(colonIndex + 1);
        attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
      }
    }
    return {
      tagName,
      tagExp,
      closeIndex,
      attrExpPresent
    };
  }
  function readStopNodeData(xmlData, tagName, i) {
    const startIndex = i;
    let openTagCount = 1;
    for (; i < xmlData.length; i++) {
      if (xmlData[i] === "<") {
        if (xmlData[i + 1] === "/") {
          const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
          let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
          if (closeTagName === tagName) {
            openTagCount--;
            if (openTagCount === 0) {
              return {
                tagContent: xmlData.substring(startIndex, i),
                i: closeIndex
              };
            }
          }
          i = closeIndex;
        } else if (xmlData[i + 1] === "?") {
          const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
          i = closeIndex;
        } else if (xmlData.substr(i + 1, 3) === "!--") {
          const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
          i = closeIndex;
        } else if (xmlData.substr(i + 1, 2) === "![") {
          const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
          i = closeIndex;
        } else {
          const tagData = readTagExp(xmlData, i, ">");
          if (tagData) {
            const openTagName = tagData && tagData.tagName;
            if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
              openTagCount++;
            }
            i = tagData.closeIndex;
          }
        }
      }
    }
  }
  function parseValue(val, shouldParse, options) {
    if (shouldParse && typeof val === "string") {
      const newval = val.trim();
      if (newval === "true")
        return true;
      else if (newval === "false")
        return false;
      else
        return toNumber(val, options);
    } else {
      if (util.isExist(val)) {
        return val;
      } else {
        return "";
      }
    }
  }
  var OrderedObjParser_1 = OrderedObjParser$1;
  var node2json = {};
  function prettify$1(node, options) {
    return compress(node, options);
  }
  function compress(arr, options, jPath) {
    let text;
    const compressedObj = {};
    for (let i = 0; i < arr.length; i++) {
      const tagObj = arr[i];
      const property = propName$1(tagObj);
      let newJpath = "";
      if (jPath === void 0)
        newJpath = property;
      else
        newJpath = jPath + "." + property;
      if (property === options.textNodeName) {
        if (text === void 0)
          text = tagObj[property];
        else
          text += "" + tagObj[property];
      } else if (property === void 0) {
        continue;
      } else if (tagObj[property]) {
        let val = compress(tagObj[property], options, newJpath);
        const isLeaf = isLeafTag(val, options);
        if (tagObj[":@"]) {
          assignAttributes(val, tagObj[":@"], newJpath, options);
        } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
          val = val[options.textNodeName];
        } else if (Object.keys(val).length === 0) {
          if (options.alwaysCreateTextNode)
            val[options.textNodeName] = "";
          else
            val = "";
        }
        if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
          if (!Array.isArray(compressedObj[property])) {
            compressedObj[property] = [compressedObj[property]];
          }
          compressedObj[property].push(val);
        } else {
          if (options.isArray(property, newJpath, isLeaf)) {
            compressedObj[property] = [val];
          } else {
            compressedObj[property] = val;
          }
        }
      }
    }
    if (typeof text === "string") {
      if (text.length > 0)
        compressedObj[options.textNodeName] = text;
    } else if (text !== void 0)
      compressedObj[options.textNodeName] = text;
    return compressedObj;
  }
  function propName$1(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== ":@")
        return key;
    }
  }
  function assignAttributes(obj, attrMap, jpath, options) {
    if (attrMap) {
      const keys = Object.keys(attrMap);
      const len = keys.length;
      for (let i = 0; i < len; i++) {
        const atrrName = keys[i];
        if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
          obj[atrrName] = [attrMap[atrrName]];
        } else {
          obj[atrrName] = attrMap[atrrName];
        }
      }
    }
  }
  function isLeafTag(obj, options) {
    const propCount = Object.keys(obj).length;
    if (propCount === 0 || propCount === 1 && obj[options.textNodeName])
      return true;
    return false;
  }
  node2json.prettify = prettify$1;
  const { buildOptions } = OptionsBuilder;
  const OrderedObjParser = OrderedObjParser_1;
  const { prettify } = node2json;
  const validator$1 = validator$2;
  class XMLParser$1 {
    constructor(options) {
      this.externalEntities = {};
      this.options = buildOptions(options);
    }
    parse(xmlData, validationOption) {
      if (typeof xmlData === "string")
        ;
      else if (xmlData.toString) {
        xmlData = xmlData.toString();
      } else {
        throw new Error("XML data is accepted in String or Bytes[] form.");
      }
      if (validationOption) {
        if (validationOption === true)
          validationOption = {};
        const result = validator$1.validate(xmlData, validationOption);
        if (result !== true) {
          throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
        }
      }
      const orderedObjParser = new OrderedObjParser(this.options);
      orderedObjParser.addExternalEntities(this.externalEntities);
      const orderedResult = orderedObjParser.parseXml(xmlData);
      if (this.options.preserveOrder || orderedResult === void 0)
        return orderedResult;
      else
        return prettify(orderedResult, this.options);
    }
    addEntity(key, value) {
      if (value.indexOf("&") !== -1) {
        throw new Error("Entity value can't have '&'");
      } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
        throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
      } else {
        this.externalEntities[key] = value;
      }
    }
  }
  var XMLParser_1 = XMLParser$1;
  const EOL = "\n";
  function toXml(jArray, options) {
    return arrToStr(jArray, options, "", 0);
  }
  function arrToStr(arr, options, jPath, level) {
    let xmlStr = "";
    let indentation = "";
    if (options.format && options.indentBy.length > 0) {
      indentation = EOL + "" + options.indentBy.repeat(level);
    }
    for (let i = 0; i < arr.length; i++) {
      const tagObj = arr[i];
      const tagName = propName(tagObj);
      let newJPath = "";
      if (jPath.length === 0)
        newJPath = tagName;
      else
        newJPath = `${jPath}.${tagName}`;
      if (tagName === options.textNodeName) {
        let tagText = tagObj[tagName];
        if (!isStopNode(newJPath, options)) {
          tagText = options.tagValueProcessor(tagName, tagText);
          tagText = replaceEntitiesValue$1(tagText, options);
        }
        xmlStr += indentation + tagText;
        continue;
      } else if (tagName === options.cdataPropName) {
        xmlStr += indentation + `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
        continue;
      } else if (tagName === options.commentPropName) {
        xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
        continue;
      } else if (tagName[0] === "?") {
        const attStr2 = attr_to_str(tagObj[":@"], options);
        const tempInd = tagName === "?xml" ? "" : indentation;
        let piTextNodeName = tagObj[tagName][0][options.textNodeName];
        piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
        xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
        continue;
      }
      const attStr = attr_to_str(tagObj[":@"], options);
      let tagStart = indentation + `<${tagName}${attStr}`;
      let tagValue = arrToStr(tagObj[tagName], options, newJPath, level + 1);
      if (options.unpairedTags.indexOf(tagName) !== -1) {
        if (options.suppressUnpairedNode)
          xmlStr += tagStart + ">";
        else
          xmlStr += tagStart + "/>";
      } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
        xmlStr += tagStart + "/>";
      } else {
        xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
      }
    }
    return xmlStr;
  }
  function propName(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== ":@")
        return key;
    }
  }
  function attr_to_str(attrMap, options) {
    let attrStr = "";
    if (attrMap && !options.ignoreAttributes) {
      for (let attr2 in attrMap) {
        let attrVal = options.attributeValueProcessor(attr2, attrMap[attr2]);
        attrVal = replaceEntitiesValue$1(attrVal, options);
        if (attrVal === true && options.suppressBooleanAttributes) {
          attrStr += ` ${attr2.substr(options.attributeNamePrefix.length)}`;
        } else {
          attrStr += ` ${attr2.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
        }
      }
    }
    return attrStr;
  }
  function isStopNode(jPath, options) {
    jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
    let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
    for (let index in options.stopNodes) {
      if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName)
        return true;
    }
    return false;
  }
  function replaceEntitiesValue$1(textValue, options) {
    if (textValue && textValue.length > 0 && options.processEntities) {
      for (let i = 0; i < options.entities.length; i++) {
        const entity = options.entities[i];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  }
  var orderedJs2Xml = toXml;
  const buildFromOrderedJs = orderedJs2Xml;
  const defaultOptions = {
    attributeNamePrefix: "@_",
    attributesGroupName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    cdataPropName: false,
    format: false,
    indentBy: "  ",
    suppressEmptyNode: false,
    suppressUnpairedNode: true,
    suppressBooleanAttributes: true,
    tagValueProcessor: function(key, a) {
      return a;
    },
    attributeValueProcessor: function(attrName, a) {
      return a;
    },
    preserveOrder: false,
    commentPropName: false,
    unpairedTags: [],
    entities: [
      { regex: new RegExp("&", "g"), val: "&amp;" },
      { regex: new RegExp(">", "g"), val: "&gt;" },
      { regex: new RegExp("<", "g"), val: "&lt;" },
      { regex: new RegExp("'", "g"), val: "&apos;" },
      { regex: new RegExp('"', "g"), val: "&quot;" }
    ],
    processEntities: true,
    stopNodes: [],
    transformTagName: false
  };
  function Builder(options) {
    this.options = Object.assign({}, defaultOptions, options);
    if (this.options.ignoreAttributes || this.options.attributesGroupName) {
      this.isAttribute = function() {
        return false;
      };
    } else {
      this.attrPrefixLen = this.options.attributeNamePrefix.length;
      this.isAttribute = isAttribute;
    }
    this.processTextOrObjNode = processTextOrObjNode;
    if (this.options.format) {
      this.indentate = indentate;
      this.tagEndChar = ">\n";
      this.newLine = "\n";
    } else {
      this.indentate = function() {
        return "";
      };
      this.tagEndChar = ">";
      this.newLine = "";
    }
    if (this.options.suppressEmptyNode) {
      this.buildTextNode = buildEmptyTextNode;
      this.buildObjNode = buildEmptyObjNode;
    } else {
      this.buildTextNode = buildTextValNode;
      this.buildObjNode = buildObjectNode;
    }
    this.buildTextValNode = buildTextValNode;
    this.buildObjectNode = buildObjectNode;
    this.replaceEntitiesValue = replaceEntitiesValue;
    this.buildAttrPairStr = buildAttrPairStr;
  }
  Builder.prototype.build = function(jObj) {
    if (this.options.preserveOrder) {
      return buildFromOrderedJs(jObj, this.options);
    } else {
      if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
        jObj = {
          [this.options.arrayNodeName]: jObj
        };
      }
      return this.j2x(jObj, 0).val;
    }
  };
  Builder.prototype.j2x = function(jObj, level) {
    let attrStr = "";
    let val = "";
    for (let key in jObj) {
      if (typeof jObj[key] === "undefined")
        ;
      else if (jObj[key] === null) {
        if (key[0] === "?")
          val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
        else
          val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
      } else if (jObj[key] instanceof Date) {
        val += this.buildTextNode(jObj[key], key, "", level);
      } else if (typeof jObj[key] !== "object") {
        const attr2 = this.isAttribute(key);
        if (attr2) {
          attrStr += this.buildAttrPairStr(attr2, "" + jObj[key]);
        } else {
          if (key === this.options.textNodeName) {
            let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
            val += this.replaceEntitiesValue(newval);
          } else {
            val += this.buildTextNode(jObj[key], key, "", level);
          }
        }
      } else if (Array.isArray(jObj[key])) {
        const arrLen = jObj[key].length;
        for (let j = 0; j < arrLen; j++) {
          const item = jObj[key][j];
          if (typeof item === "undefined")
            ;
          else if (item === null) {
            if (key[0] === "?")
              val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
            else
              val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          } else if (typeof item === "object") {
            val += this.processTextOrObjNode(item, key, level);
          } else {
            val += this.buildTextNode(item, key, "", level);
          }
        }
      } else {
        if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
          const Ks = Object.keys(jObj[key]);
          const L = Ks.length;
          for (let j = 0; j < L; j++) {
            attrStr += this.buildAttrPairStr(Ks[j], "" + jObj[key][Ks[j]]);
          }
        } else {
          val += this.processTextOrObjNode(jObj[key], key, level);
        }
      }
    }
    return { attrStr, val };
  };
  function buildAttrPairStr(attrName, val) {
    val = this.options.attributeValueProcessor(attrName, "" + val);
    val = this.replaceEntitiesValue(val);
    if (this.options.suppressBooleanAttributes && val === "true") {
      return " " + attrName;
    } else
      return " " + attrName + '="' + val + '"';
  }
  function processTextOrObjNode(object, key, level) {
    const result = this.j2x(object, level + 1);
    if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
      return this.buildTextNode(object[this.options.textNodeName], key, result.attrStr, level);
    } else {
      return this.buildObjNode(result.val, key, result.attrStr, level);
    }
  }
  function buildObjectNode(val, key, attrStr, level) {
    let tagEndExp = "</" + key + this.tagEndChar;
    let piClosingChar = "";
    if (key[0] === "?") {
      piClosingChar = "?";
      tagEndExp = "";
    }
    if (attrStr && val.indexOf("<") === -1) {
      return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
    } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
      return this.indentate(level) + `<!--${val}-->` + this.newLine;
    } else {
      return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
    }
  }
  function buildEmptyObjNode(val, key, attrStr, level) {
    if (val !== "") {
      return this.buildObjectNode(val, key, attrStr, level);
    } else {
      if (key[0] === "?")
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      else
        return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
    }
  }
  function buildTextValNode(val, key, attrStr, level) {
    if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
      return this.indentate(level) + `<![CDATA[${val}]]>` + this.newLine;
    } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
      return this.indentate(level) + `<!--${val}-->` + this.newLine;
    } else {
      let textValue = this.options.tagValueProcessor(key, val);
      textValue = this.replaceEntitiesValue(textValue);
      if (textValue === "" && this.options.unpairedTags.indexOf(key) !== -1) {
        if (this.options.suppressUnpairedNode) {
          return this.indentate(level) + "<" + key + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        }
      } else {
        return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
      }
    }
  }
  function replaceEntitiesValue(textValue) {
    if (textValue && textValue.length > 0 && this.options.processEntities) {
      for (let i = 0; i < this.options.entities.length; i++) {
        const entity = this.options.entities[i];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  }
  function buildEmptyTextNode(val, key, attrStr, level) {
    if (val === "" && this.options.unpairedTags.indexOf(key) !== -1) {
      if (this.options.suppressUnpairedNode) {
        return this.indentate(level) + "<" + key + this.tagEndChar;
      } else {
        return this.indentate(level) + "<" + key + "/" + this.tagEndChar;
      }
    } else if (val !== "") {
      return this.buildTextValNode(val, key, attrStr, level);
    } else {
      if (key[0] === "?")
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      else
        return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
    }
  }
  function indentate(level) {
    return this.options.indentBy.repeat(level);
  }
  function isAttribute(name) {
    if (name.startsWith(this.options.attributeNamePrefix)) {
      return name.substr(this.attrPrefixLen);
    } else {
      return false;
    }
  }
  var json2xml = Builder;
  const validator = validator$2;
  const XMLParser = XMLParser_1;
  const XMLBuilder = json2xml;
  var fxp = {
    XMLParser,
    XMLValidator: validator,
    XMLBuilder
  };
  async function getAnimeImage(annId) {
    if (annId === null) {
      return null;
    }
    const imageUrl = await getAnimeImageUrl(annId);
    if (imageUrl === null) {
      return null;
    }
    return await getImage(imageUrl);
  }
  function getImage(imageUrl) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: imageUrl,
        responseType: "arraybuffer",
        onload: (resp) => {
          if (resp.status != 200) {
            console.warn("fetch image failed");
            resolve(null);
          } else {
            const contentType = getAttrFromHeader(resp.responseHeaders, "content-type");
            if (contentType === void 0) {
              resolve(null);
            } else {
              resolve({
                data: resp.response,
                contentType
              });
            }
          }
        }
      });
    });
  }
  function getAttrFromHeader(headerText, targetAttr) {
    const attrsText = headerText.split("\n");
    let ret = void 0;
    for (let attrText of attrsText) {
      const [attr2, value] = attrText.split(/\s*:\s*/);
      if (attr2 === targetAttr) {
        ret = value;
      }
    }
    return ret;
  }
  async function getAnimeImageUrl(annId) {
    if (annId === null) {
      return null;
    }
    const res = await fetch(`https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=${annId}`);
    if (!res.ok) {
      console.warn("fetch cdn.animenewsnetwork.com failed");
      return null;
    }
    const xml = await res.text();
    const parser = new fxp.XMLParser({ ignoreAttributes: false });
    const obj = parser.parse(xml);
    let ret = void 0;
    if (obj.ann && obj.ann.anime && obj.ann.anime.info && Array.isArray(obj.ann.anime.info)) {
      for (let info of obj.ann.anime.info) {
        if (info["@_type"] === "Picture" && info.img && Array.isArray(info.img)) {
          const img = info.img[info.img.length - 1];
          if (typeof img["@_src"] === "string") {
            ret = img["@_src"];
          }
        }
      }
    }
    return ret === void 0 ? null : ret;
  }
  class Downloader {
    constructor() {
      __publicField(this, "name", "Downloader");
      __publicField(this, "options");
      __publicField(this, "view");
      __publicField(this, "_enabled", false);
      __publicField(this, "currentSongInfo");
      __publicField(this, "isAutoDlRunning");
      __publicField(this, "btnContainer");
      __publicField(this, "answerResultListener");
      this.isAutoDlRunning = false;
      this.options = new AmqtbOptions({
        title: this.name
      });
      this.options.add(new AmqtbCheckbox({
        id: "amqtbDownloaderAutoDlOnWrong",
        name: "autoDlOnWrong",
        label: "Auto download only on wrong",
        offset: 0,
        enables: [],
        onSave: (data) => {
          GM_setValue("amqtbDownloaderAutoDlOnWrong", data);
        },
        onLoad: () => {
          return GM_getValue("amqtbDownloaderAutoDlOnWrong", false);
        }
      }));
      this.options.add(new AmqtbCheckbox({
        id: "amqtbDownloaderAutoDlMedia",
        name: "autoDlMedia",
        label: "Auto download media",
        offset: 0,
        enables: ["autoDlMediaType"],
        onSave: (data) => {
          GM_setValue("amqtbDownloaderAutoDlMedia", data);
        },
        onLoad: () => {
          return GM_getValue("amqtbDownloaderAutoDlMedia", false);
        }
      }));
      const radio = new AmqtbRadio({
        id: "amqtbDownloaderAutoDlMediaType",
        name: "autoDlMediaType",
        label: "Media Type",
        choices: [
          {
            label: "Audio",
            value: "audio"
          },
          {
            label: "Video",
            value: "video"
          }
        ],
        onSave: (data) => {
          GM_setValue("amqtbDownloaderAutoDlMediaType", data);
        },
        onLoad: () => {
          return GM_getValue("amqtbDownloaderAutoDlMediaType", "video");
        }
      });
      this.options.add(radio);
      this.options.add(new AmqtbCheckbox({
        id: "amqtbDownloaderAutoDlInfo",
        name: "autoDlInfo",
        label: "Auto download info",
        offset: 0,
        enables: [],
        onSave: (data) => {
          GM_setValue("amqtbDownloaderAutoDlInfo", data);
        },
        onLoad: () => {
          return GM_getValue("amqtbDownloaderAutoDlInfo", false);
        }
      }));
      this.btnContainer = new AmqtbButtonContainer({});
      const autoDlBtn = new AmqtbButton({
        name: "autoDlBtn",
        label: "Start AutoDL",
        size: "extra-small",
        style: "success"
      });
      const videoDlBtn = new AmqtbButton({
        name: "videoDlBtn",
        label: "Video",
        size: "extra-small",
        style: "primary"
      });
      const audioDlBtn = new AmqtbButton({
        name: "audioDlBtn",
        label: "Audio",
        size: "extra-small",
        style: "primary"
      });
      const infoDlBtn = new AmqtbButton({
        name: "infoDlBtn",
        label: "Info",
        size: "extra-small",
        style: "primary"
      });
      autoDlBtn.self.on("click", () => {
        this.isAutoDlRunning = !this.isAutoDlRunning;
        if (this.isAutoDlRunning) {
          autoDlBtn.label = "Stop AutoDL";
          autoDlBtn.style = "danger";
        } else {
          autoDlBtn.label = "Start AutoDL";
          autoDlBtn.style = "success";
        }
      });
      videoDlBtn.self.on("click", () => {
        if (videoDlBtn.self.data("url") !== void 0) {
          this.downloadSongData(videoDlBtn.self.data("url"), !this.isAutoDlRunning);
        }
      });
      audioDlBtn.self.on("click", () => {
        if (audioDlBtn.self.data("url") !== void 0) {
          this.downloadSongData(audioDlBtn.self.data("url"), !this.isAutoDlRunning);
        }
      });
      infoDlBtn.self.on("click", () => {
        this.downloadSongInfo();
      });
      this.btnContainer.add(autoDlBtn, videoDlBtn, audioDlBtn, infoDlBtn);
      this.view = new AmqtbViewBlock({
        title: "Download",
        content: this.btnContainer.self
      });
      this.answerResultListener = new Listener("answer results", this.answerResultHanler.bind(this));
    }
    get enabled() {
      return this._enabled;
    }
    set enabled(val) {
      if (val !== this._enabled) {
        this._enabled = val;
        if (val) {
          this.answerResultListener.bindListener();
        } else {
          this.answerResultListener.unbindListener();
        }
      }
    }
    answerResultHanler(result) {
      this.currentSongInfo = result.songInfo;
      const resolutions = ["720", "480"];
      const videoDlBtn = this.btnContainer.get("videoDlBtn");
      const audioDlBtn = this.btnContainer.get("audioDlBtn");
      const infoDlBtn = this.btnContainer.get("infoDlBtn");
      videoDlBtn.self.removeData("url").addClass("disabled");
      for (let resolution of resolutions) {
        let videoURL = result.songInfo.urlMap.catbox[resolution];
        if (videoURL !== void 0) {
          videoDlBtn.self.data("url", videoURL).removeClass("disabled");
          break;
        }
      }
      const audioURL = result.songInfo.urlMap.catbox["0"];
      if (audioURL !== void 0) {
        audioDlBtn.self.data("url", audioURL).removeClass("disabled");
      } else {
        audioDlBtn.self.removeData("url").addClass("disabled");
      }
      if (this.isAutoDlRunning) {
        let isCorrect = void 0;
        let findPlayer = Object.values(quiz.players).find((tmpPlayer) => {
          return tmpPlayer._name === selfName && tmpPlayer.avatarSlot._disabled === false;
        });
        if (findPlayer !== void 0) {
          let playerIdx = Object.values(result.players).findIndex((tmpPlayer) => {
            return findPlayer.gamePlayerId === tmpPlayer.gamePlayerId;
          });
          isCorrect = result.players[playerIdx].correct;
        }
        const autoDlOnWrong = this.options.get("autoDlOnWrong");
        if (autoDlOnWrong.checked || isCorrect !== void 0 && !isCorrect) {
          const autoDlMedia = this.options.get("autoDlMedia");
          const autoDlInfo = this.options.get("autoDlInfo");
          if (autoDlMedia.checked) {
            const mediaType = this.options.get("autoDlMediaType");
            if (mediaType.value === "audio") {
              audioDlBtn.self.trigger("click");
            } else if (mediaType.value === "video") {
              videoDlBtn.self.trigger("click");
            }
          }
          if (autoDlInfo.checked) {
            infoDlBtn.self.trigger("click");
          }
        }
      }
    }
    async downloadSongData(url, interactive = false) {
      const fileName = this.nameFromSongInfo();
      const fileExt = url.split(".").pop();
      if (interactive) {
        alert(`Downloading song: ${fileName}`);
      }
      const response = await fetch(url);
      let blob;
      if (fileExt === "mp3") {
        const mp3 = await response.arrayBuffer();
        const info = await this.getMp3Info();
        const taggedMp3 = addMp3Tag(mp3, info);
        if (taggedMp3 === null) {
          console.warn(`Failed to add mp3 tag, download origin mp3...`);
          blob = new Blob([mp3], { type: "audio/mpeg" });
        } else {
          console.log("Download tagged mp3");
          blob = new Blob([taggedMp3], { type: "audio/mpeg" });
        }
      } else {
        blob = await response.blob();
      }
      downloadBlob(blob, `${fileName}.${fileExt}`);
    }
    downloadSongInfo() {
      const fileName = this.nameFromSongInfo();
      const text = JSON.stringify(this.currentSongInfo);
      const blob = new Blob([text], { type: "text/plain" });
      downloadBlob(blob, `${fileName}.txt`);
    }
    nameFromSongInfo() {
      const animeName = this.currentSongInfo.animeNames.romaji;
      const songName = this.currentSongInfo.songName;
      const type = this.songType();
      const artist = this.currentSongInfo.artist;
      return `[${animeName}(${type})] ${songName} (${artist})`;
    }
    async getMp3Info() {
      return {
        animeName: this.currentSongInfo.animeNames.romaji,
        songName: this.currentSongInfo.songName,
        type: this.songType(),
        artist: this.currentSongInfo.artist,
        cover: await getAnimeImage(this.currentSongInfo.annId)
      };
    }
    songType() {
      switch (this.currentSongInfo.type) {
        case 1:
          return `Opening ${this.currentSongInfo.typeNumber}`;
        case 2:
          return `Ending ${this.currentSongInfo.typeNumber}`;
        case 3:
          return "Insert Song";
        default:
          return "";
      }
    }
  }
  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    $(`<a></a>`).attr("href", url).attr("download", fileName).get(0).click();
    console.log(`Download: ${fileName}`);
    setTimeout(() => {
      URL.revokeObjectURL(url);
      console.log(`revoke url of ${fileName}`);
    }, 1e3);
  }
  function addMp3Tag(data, info) {
    const mp3tag = new MP3Tag(data);
    mp3tag.read();
    if (mp3tag.error !== "") {
      console.warn(`"${info.artist} - ${info.songName}" read tag fail`);
      return null;
    }
    mp3tag.tags.title = info.songName;
    mp3tag.tags.artist = info.artist;
    mp3tag.tags.album = info.animeName;
    if (info.cover !== null) {
      mp3tag.tags.v2.APIC = [{
        format: info.cover.contentType,
        type: 3,
        description: "anime cover from animenewsnetwork",
        data: info.cover.data
      }];
    }
    const ret = mp3tag.save({
      id3v1: { include: false },
      id3v2: {
        include: true,
        version: 3
      }
    });
    if (mp3tag.error !== "") {
      console.warn(`"${info.artist} - ${info.songName}" write tag fail`);
      return null;
    }
    return ret;
  }
  function setup() {
    if (unsafeWindow.amqToolbox === void 0) {
      unsafeWindow.amqToolbox = new AMQ_Toolbox();
    }
    const plugin = new Downloader();
    const err = amqToolbox.registerPlugin(plugin);
    if (err) {
      console.error(err);
      plugin.enabled = false;
      return;
    }
  }
  function main() {
    if (document.getElementById("startPage"))
      return;
    let loadInterval = setInterval(() => {
      if ($("#loadingScreen").hasClass("hidden")) {
        try {
          setup();
        } finally {
          clearInterval(loadInterval);
        }
      }
    }, 500);
  }
  $(main);
})();
 
