// ==UserScript==
// @name         AMQ No Avatar Snipe
// @namespace    https://github.com/JJJJoe-Lin
// @version      0.2.1
// @author       JJJJoe
// @description  Avatar would not change when players answered
// @updateURL    https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/quick-answer/script/quick-answer.user.js
// @match        https://animemusicquiz.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// ==/UserScript==

// use vite-plugin-monkey@0.2.14 at 2022-07-14T18:39:55.361Z

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
          this.save();
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
    save() {
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
      GM_setValue(this.id, datas);
    }
    reset() {
      this.body.empty();
      this.entries.length = 0;
      const datas = GM_getValue(this.id);
      console.log(`Reset and load table '${this.id}':`, datas);
      if (datas !== void 0) {
        for (let rowData of datas) {
          this.appendRow(rowData);
        }
      }
    }
  }
  var styles = ".amqtbButtonContainer {\n  display: flex;\n  flex-flow: row wrap;\n  justify-content: space-around;\n  align-content: space-around;\n  margin: 5px 0;\n}\n.amqtbButtonContainer button {\n  margin: 5px 0;\n}\n.customCheckboxContainer {\n  display: flex;\n}\n.customCheckboxContainer > div {\n  display: inline-block;\n  margin: 5px 0px;\n}\n.customCheckboxContainer > .customCheckboxContainerLabel {\n  margin-left: 5px;\n  margin-top: 5px;\n  font-weight: normal;\n}\n.amqtbRadio {\n  text-align: center;\n}\n.offset1 {\n  margin-left: 20px;\n}\n.offset2 {\n  margin-left: 40px;\n}\n.amqtbTable {\n    border-collapse: separate;\n    padding: 0 15px;\n}\n.amqtbTable th, .amqtbTable td {\n    text-align: center;\n    vertical-align: middle !important;\n}\n.amqtbTable thead {\n    background-color: #000;\n}\n.amqtbTable tbody tr {\n    background-color: #424242 !important;\n}\n.amqtbWindow {\n  overflow-y: hidden;\n  top: 0px;\n  left: 0px;\n  margin: 0px;\n  background-color: #424242;\n  border: 1px solid rgba(27, 27, 27, 0.2);\n  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n  user-select: text;\n  display: none;\n}\n.draggableWindow {\n  cursor: move;\n}\n.amqtbWindowBody {\n  width: 100%;\n  overflow-y: auto;\n}\n.amqtbWindowContent {\n  width: 100%;\n  position: absolute;\n  top: 0px;\n}\n.amqtbWindow .close {\n  font-size: 32px;\n}\n.windowResizers {\n  width: 100%;\n  height: 100%;\n}\n.windowResizer {\n  width: 10px;\n  height: 10px;\n  position: absolute;\n  z-index: 100;\n}\n.windowResizer.top-left {\n  top: 0px;\n  left: 0px;\n  cursor: nwse-resize;\n}\n.windowResizer.top-right {\n  top: 0px;\n  right: 0px;\n  cursor: nesw-resize;\n}\n.windowResizer.bottom-left {\n  bottom: 0px;\n  left: 0px;\n  cursor: nesw-resize;\n}\n.windowResizer.bottom-right {\n  bottom: 0px;\n  right: 0px;\n  cursor: nwse-resize;\n}\n#qpToolboxContainer {\n  max-width: 215px;\n  min-width: 208px;\n  width: calc(100% + 30px);\n  position: absolute;\n  border-radius: 5px;\n  padding-bottom: 5px;\n  padding-top: 5px;\n  margin-top: 10px;\n  left: 0px;\n  right: 0px;\n}\n#qpToolboxContainer h5 {\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n#amqtbSettingButton {\n  width: 30px;\n  height: 100%;\n}\n#qpAvatarRow {\n  width: 80%;\n}\n.collapsible:hover {\n  background-color: #555;\n}\n.amqtbPluginManageTableEnabledCell {\n  position: relative;\n  top: -10px;\n  left: -25px;\n  display: inline-block;\n}";
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
        }
      });
      this.manageTable.saveBtn.self.on("click", () => {
        console.log("Refresh AMQ Toolbox");
        this.refresh();
        this.manageModal.self.modal("hide");
      });
      this.oldPluginsInfo = GM_getValue(PluginManageTableId, []);
      GM_deleteValue(PluginManageTableId);
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
  class NoAvatarSnipe {
    constructor() {
      __publicField(this, "name", "No Avatar Snipe");
      __publicField(this, "_enabled", false);
      __publicField(this, "oldListener");
      __publicField(this, "listener");
      this.oldListener = quiz._playerAnswerListener;
      this.listener = new Listener("play next song", function() {
      });
    }
    get enabled() {
      return this._enabled;
    }
    set enabled(val) {
      if (val !== this._enabled) {
        this._enabled = val;
        if (val) {
          quiz._playerAnswerListener.unbindListener();
          quiz._playerAnswerListener = this.listener;
          quiz._playerAnswerListener.bindListener();
        } else {
          quiz._playerAnswerListener.unbindListener();
          quiz._playerAnswerListener = this.oldListener;
          quiz._playerAnswerListener.bindListener();
        }
      }
    }
  }
  function setup() {
    if (unsafeWindow.amqToolbox === void 0) {
      unsafeWindow.amqToolbox = new AMQ_Toolbox();
    }
    const plugin = new NoAvatarSnipe();
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
        clearInterval(loadInterval);
      }
    }, 500);
  }
  $(main);
})();
 
