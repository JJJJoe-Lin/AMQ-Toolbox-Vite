// ==UserScript==
// @name         AMQ No Avatar Snipe
// @namespace    https://github.com/JJJJoe-Lin
// @version      0.3.2
// @author       JJJJoe
// @description  Avatar would not change when players answered
// @downloadURL  https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/no-avatar-snipe/script/no-avatar-snipe.user.js
// @updateURL    https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/no-avatar-snipe/script/no-avatar-snipe.user.js
// @include      /^https:\/\/animemusicquiz\.com\/(\?.*|#.*)?$/
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// use vite-plugin-monkey@0.2.14 at 2022-08-19T10:29:34.476Z

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  "use strict";
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
      const closeIcon = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`).append($(`<span aria-hidden="true">\xD7</span>`));
      this.contentBlock = $(`<div class="modal-body"></div>`);
      this.self.addClass("modal fade").attr("tabindex", "-1").attr("role", "dialog").append(dialog.append(content.append(header.append(closeIcon, title)).append(this.contentBlock)));
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
      this.self.addClass("tab leftRightButtonTop clickAble").append($(`<h5></h5>`).text(opt.tabName));
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
      const closeIcon = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`).append($(`<span aria-hidden="true">\xD7</span>`));
      this.tabBlock = $(`<div class="tabContainer"></div>`);
      this.contentBlock = $(`<div class="modal-body"></div>`);
      this.self.addClass("modal fade tab-modal").attr("tabindex", "-1").attr("role", "dialog").append(dialog.append(content.append(header.append(closeIcon, title)).append(this.tabBlock).append(this.contentBlock)));
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
  function toTitle(str) {
    let ret = str.replace(/[_].?/g, (letter) => letter.slice(1).toUpperCase());
    ret = ret.replace(/[A-Z]/g, (letter) => ` ${letter}`);
    ret = ret.charAt(0).toUpperCase() + ret.slice(1);
    return ret;
  }
  const SIZE_MAP = {
    "large": "btn-lg",
    "default": "",
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
    set style(style) {
      this.self.removeClass(this._style);
      this._style = STYLE_MAP[style];
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
      this.savable = opt.savable;
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
          size: "default",
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
          size: "default",
          style: "success"
        });
        saveBtn.self.on("click", () => {
          this.save();
        });
        const resetBtn = new Button({
          name: "reset",
          label: "Reset",
          size: "default",
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
          GM_setValue(this.name, this.getValue());
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
          val = GM_getValue(this.name);
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
  var styles = ".amqtbButtonContainer {\n    display: flex;\n    flex-flow: row wrap;\n    justify-content: space-around;\n    align-content: space-around;\n    margin: 5px 0;\n}\n.amqtbButtonContainer button {\n    margin: 5px 0;\n}\n.amqtbWindow {\n    overflow-y: hidden;\n    top: 0px;\n    left: 0px;\n    margin: 0px;\n    background-color: #424242;\n    border: 1px solid rgba(27, 27, 27, 0.2);\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n    user-select: text;\n    display: none;\n}\n.draggableWindow {\n    cursor: move;\n}\n.amqtbWindowBody {\n    width: 100%;\n    overflow-y: auto;\n}\n.amqtbWindowContent {\n    width: 100%;\n    position: absolute;\n    top: 0px;\n}\n.amqtbWindow .close {\n    font-size: 32px;\n}\n.windowResizers {\n    width: 100%;\n    height: 100%;\n}\n.windowResizer {\n    width: 10px;\n    height: 10px;\n    position: absolute;\n    z-index: 100;\n}\n.windowResizer.top-left {\n    top: 0px;\n    left: 0px;\n    cursor: nwse-resize;\n}\n.windowResizer.top-right {\n    top: 0px;\n    right: 0px;\n    cursor: nesw-resize;\n}\n.windowResizer.bottom-left {\n    bottom: 0px;\n    left: 0px;\n    cursor: nesw-resize;\n}\n.windowResizer.bottom-right {\n    bottom: 0px;\n    right: 0px;\n    cursor: nwse-resize;\n}\n.customCheckboxContainer {\n    display: flex;\n}\n.customCheckboxContainer>div {\n    display: inline-block;\n    margin: 5px 0px;\n}\n.customCheckboxContainer>.customCheckboxContainerLabel {\n    margin-left: 5px;\n    margin-top: 5px;\n    font-weight: normal;\n}\n.amqtbRadio {\n    text-align: center;\n}\n.offset1 {\n    margin-left: 20px;\n}\n.offset2 {\n    margin-left: 40px;\n}\n.amqtbMultiSelect a.selected {\n    background-color: #4497ea;\n    color: #fff;\n}\n.amqtbTable {\n    border-collapse: separate;\n    padding: 0 15px;\n}\n.amqtbTable th, .amqtbTable td {\n    text-align: center;\n    vertical-align: middle !important;\n}\n.amqtbTable thead {\n    background-color: #000;\n}\n.amqtbTable tbody tr {\n    background-color: #424242 !important;\n}\n#qpToolboxContainer {\n  max-width: 215px;\n  min-width: 208px;\n  width: calc(100% + 30px);\n  position: absolute;\n  border-radius: 5px;\n  padding-bottom: 5px;\n  padding-top: 5px;\n  margin-top: 10px;\n  left: 0px;\n  right: 0px;\n}\n#qpToolboxContainer h5 {\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n#amqtbSettingButton {\n  width: 30px;\n  height: 100%;\n}\n#qpAvatarRow {\n  width: 80%;\n}\n.collapsible:hover {\n  background-color: #555;\n}\n.amqtbPluginManageTableEnabledCell {\n  position: relative;\n  top: -10px;\n  left: -25px;\n  display: inline-block;\n}";
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
      this.switch = $(`<div class="switchContainer slider-track"></div>`).append($(`<div class="slider-tick-container"></div>`).append(this.switchOff).append(this.switchOn));
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
        savable: true,
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
      this.pluginTable.load();
      this.prevPluginsInfo = this.pluginTable.getValue();
      this.pluginTable.splice(0);
      this.pluginTable.save();
      $("#optionsContainer > ul").prepend($(`<li class="clickAble" data-toggle="modal" data-target="#amqtbManageModal"></li>`).text("Plugins"));
      $("#optionsContainer > ul").prepend($(`<li class="clickAble" data-toggle="modal" data-target="#amqtbSettingModal"></li>`).text("Toolbox Setting"));
      GM_addStyle(styles);
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
        if (unsafeWindow.amqToolbox === void 0) {
          unsafeWindow.amqToolbox = new Toolbox();
        }
        unsafeWindow.amqToolbox.addPlugin(plugin);
      });
    } catch (err) {
      console.error(`[registerPlugin] Failed to register ${plugin.name}`, err);
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
      this.enable();
    }
    enable() {
      if (!this._enabled) {
        this._enabled = true;
        quiz._playerAnswerListener.unbindListener();
        quiz._playerAnswerListener = this.listener;
        quiz._playerAnswerListener.bindListener();
      }
    }
    disable() {
      if (this._enabled) {
        this._enabled = false;
        quiz._playerAnswerListener.unbindListener();
        quiz._playerAnswerListener = this.oldListener;
        quiz._playerAnswerListener.bindListener();
      }
    }
    enabled() {
      return this._enabled;
    }
  }
  function main() {
    onStartPageLoaded(() => {
      registerPlugin(new NoAvatarSnipe());
    });
  }
  $(main);
})();
 
