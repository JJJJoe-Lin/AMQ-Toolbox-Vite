// ==UserScript==
// @name         AMQ Downloader
// @namespace    https://github.com/JJJJoe-Lin
// @version      0.4.0
// @author       JJJJoe
// @description  AMQ song downloader
// @downloadURL  https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js
// @updateURL    https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js
// @include      /^https:\/\/animemusicquiz\.com\/(\?.*|#.*)?$/
// @connect      cdn.animenewsnetwork.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

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
  class Options extends Container {
    constructor(opt) {
      super(opt);
      __publicField(this, "options", this.container);
      this.self.addClass("col-xs-6");
      this.self.append(
        $(`<h4>${opt.title}</h4>`).css("text-align", "center")
      );
    }
    refresh() {
      for (let option of this.options) {
        option.input.trigger("amqtoolbox.option.enables", String(option.getValue()));
      }
    }
    splice(start, deleteCount, ...opts) {
      let ret;
      if (deleteCount === void 0) {
        ret = super.splice(start);
      } else {
        ret = super.splice(start, deleteCount, ...opts);
      }
      if (!checkEnables(this.options)) {
        throw new Error("Duplicated optionName in enables with other options");
      }
      return ret;
    }
    appendComponent(opt) {
      this.self.append(opt.self);
      opt.input.on("amqtoolbox.option.enables", (_, optEnableKey) => {
        this.updateEnabled(opt, optEnableKey);
      });
    }
    detachComponent(opt) {
      opt.self.detach();
      opt.input.off("amqtoolbox.option.enables");
    }
    updateEnabled(opt, optEnableKey) {
      if (opt.enables) {
        const { enabledOptNames: enables, disabledOptNames: disables } = getEnables(opt, optEnableKey);
        for (let option of this.options) {
          if (enables.includes(option.name)) {
            option.enable();
          } else if (disables.includes(option.name)) {
            option.disable();
          }
        }
      }
    }
  }
  function getEnables(opt, optEnableKey) {
    const enabledOptNames = /* @__PURE__ */ new Set();
    const disabledOptNames = /* @__PURE__ */ new Set();
    if (opt.enables !== void 0) {
      for (let [key, optNames] of Object.entries(opt.enables)) {
        for (let optName of optNames) {
          if (optEnableKey === void 0 || optEnableKey === key) {
            enabledOptNames.add(optName);
          } else {
            disabledOptNames.add(optName);
          }
        }
      }
    }
    if (optEnableKey === void 0) {
      return [...enabledOptNames];
    } else {
      return {
        enabledOptNames: [...enabledOptNames],
        disabledOptNames: [...disabledOptNames]
      };
    }
  }
  function checkEnables(options) {
    const optNames = /* @__PURE__ */ new Set();
    for (let option of options) {
      const enables = getEnables(option);
      for (let enable of enables) {
        if (optNames.has(enable)) {
          return false;
        }
        optNames.add(enable);
      }
    }
    return true;
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
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
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
    let val2 = Cookies.get(key);
    if (val2 === void 0) {
      return defaultVal;
    } else {
      return JSON.parse(val2);
    }
  }
  function saveToLocalStorage(key, entry) {
    localStorage.setItem(key, JSON.stringify(entry));
  }
  function loadFromLocalStorage(key, defaultVal) {
    const val2 = localStorage.getItem(key);
    if (val2 === null) {
      return defaultVal;
    } else {
      return JSON.parse(val2);
    }
  }
  function saveStorable(comp, type) {
    switch (type) {
      case "Script":
        _GM_setValue(comp.name, comp.getValue());
        break;
      case "LocalStorage":
        saveToLocalStorage(comp.name, comp.getValue());
        break;
      case "Cookie":
        saveToCookie(comp.name, comp.getValue());
        break;
    }
  }
  function loadStorable(comp, type) {
    let val2;
    switch (type) {
      case "Script":
        val2 = _GM_getValue(comp.name);
        break;
      case "LocalStorage":
        val2 = loadFromLocalStorage(comp.name);
        break;
      case "Cookie":
        val2 = loadFromCookie(comp.name);
        break;
    }
    if (val2 !== void 0) {
      comp.setValue(val2);
    }
  }
  class CheckboxOption {
    constructor(opt) {
      __publicField(this, "name");
      __publicField(this, "self");
      __publicField(this, "input");
      __publicField(this, "enables");
      __publicField(this, "saveIn");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.saveIn = opt.saveIn;
      this.name = opt.name;
      this.enables = opt.enables;
      this.input = $(`<input id="${opt.inputId}" type="checkbox">`);
      this.input.on("click", () => {
        this.save();
        this.input.trigger("amqtoolbox.option.enables", this.getValue() ? "true" : "false");
      });
      const checkLabel = $(`<label for="${opt.inputId}"></label>`).append($(`<i class='fa fa-check' aria-hidden='true'></i>`));
      const textLabel = $(`<label for="${opt.inputId}"></label>`).addClass("customCheckboxContainerLabel").text(opt.label);
      if (opt.description) {
        textLabel.popover({
          content: opt.description,
          trigger: "hover",
          html: true,
          placement: "top",
          container: "#settingModal"
        });
      }
      this.self = $(`<div class='customCheckboxContainer'></div>`).attr("id", id).addClass(cls).addClass(opt.offset !== 0 ? `offset${opt.offset}` : "").append(
        $(`<div class='customCheckbox'></div>`).append(this.input).append(checkLabel)
      ).append(textLabel);
      const checked = opt.defaultValue ? true : false;
      this.setValue(checked);
      this.load();
      this.input.trigger("amqtoolbox.option.enables", this.getValue());
    }
    getValue() {
      return this.input.prop("checked");
    }
    setValue(val2) {
      this.input.prop("checked", val2);
    }
    enabled() {
      return !this.self.hasClass("disabled");
    }
    enable() {
      this.self.removeClass("disabled");
    }
    disable() {
      this.self.addClass("disabled");
    }
    save() {
      saveStorable(this, this.saveIn);
    }
    load() {
      loadStorable(this, this.saveIn);
    }
  }
  class RadioOption {
    constructor(opt) {
      __publicField(this, "name");
      __publicField(this, "self");
      __publicField(this, "input");
      __publicField(this, "enables");
      __publicField(this, "saveIn");
      __publicField(this, "choices");
      const id = opt.id === void 0 ? "" : opt.id;
      const cls = opt.class === void 0 ? "" : opt.class;
      this.saveIn = opt.saveIn;
      this.enables = opt.enables;
      this.name = opt.name;
      if (opt.choices.length > 10) {
        this.choices = opt.choices.slice(0, 10);
      } else {
        this.choices = opt.choices;
      }
      this.self = $(`<div class='amqtbRadio'></div>`).attr("id", id).addClass(cls).addClass(opt.offset !== 0 ? `offset${opt.offset}` : "");
      if (opt.label) {
        const label = $(`<label></label>`).text(opt.label).css("width", "100%");
        if (opt.description) {
          label.popover({
            content: opt.description,
            trigger: "hover",
            html: true,
            placement: "top",
            container: "#settingModal"
          });
        }
        this.self.append(label);
      }
      this.input = $(`<input class='sliderInput' type='text'>`);
      this.self.append(this.input);
      this.input.bootstrapSlider({
        id: opt.inputId,
        ticks: this.choices.map((_, idx) => idx),
        ticks_labels: this.choices.map((ch) => ch.label),
        value: 0,
        formatter: (idx) => this.choices[idx].label,
        selection: "none"
      });
      this.input.on("change", () => {
        this.save();
        this.input.trigger("amqtoolbox.option.enables", this.getValue());
      });
      const val2 = opt.defaultValue === void 0 ? this.choices[0].value : opt.defaultValue;
      this.setValue(val2);
      this.load();
      this.input.trigger("amqtoolbox.option.enables", this.getValue());
    }
    getValue() {
      const idx = this.input.bootstrapSlider("getValue");
      return this.choices[idx].value;
    }
    setValue(val2) {
      const idx = this.choices.findIndex((c) => c.value === val2);
      if (idx !== -1) {
        this.input.bootstrapSlider("setValue", idx);
      }
    }
    enabled() {
      return this.input.bootstrapSlider("isEnabled");
    }
    enable() {
      this.self.show();
      this.relayout();
    }
    disable() {
      this.self.hide();
    }
    save() {
      saveStorable(this, this.saveIn);
    }
    load() {
      loadStorable(this, this.saveIn);
    }
    relayout() {
      this.input.bootstrapSlider("relayout");
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
      let val2;
      switch (this.saveIn) {
        case "Script":
          val2 = _GM_getValue(this.name);
          break;
        case "LocalStorage":
          val2 = loadFromLocalStorage(this.name);
          break;
        case "Cookie":
          val2 = loadFromCookie(this.name);
          break;
      }
      if (val2 !== void 0) {
        this.setValue(val2);
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
    setValue(val2) {
      this.self.text(val2);
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
    setValue(val2) {
      if (val2) {
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
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
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
    //A tag can have attributes without any value
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
                return getErrorObject(
                  "InvalidTag",
                  "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                  getLineNumberForPosition(xmlData, tagStartPos)
                );
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
      // column number is last line's length + 1, because column numbering starts at 1:
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
    // remove NS from tag name or attribute name if true
    allowBooleanAttributes: false,
    //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseTagValue: true,
    parseAttributeValue: false,
    trimValues: true,
    //Trim string values of tag and attributes
    cdataPropName: false,
    numberParseOptions: {
      hex: true,
      leadingZeros: true,
      eNotation: true
    },
    tagValueProcessor: function(tagName, val2) {
      return val2;
    },
    attributeValueProcessor: function(attrName, val2) {
      return val2;
    },
    stopNodes: [],
    //nested tags will not be parsed even for errors
    alwaysCreateTextNode: false,
    isArray: () => false,
    commentPropName: false,
    unpairedTags: [],
    processEntities: true,
    htmlEntities: false,
    ignoreDeclaration: false,
    ignorePiTags: false,
    transformTagName: false,
    transformAttributeName: false,
    updateTag: function(tagName, jPath, attrs) {
      return tagName;
    }
    // skipEmptyListItem: false
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
    add(key, val2) {
      if (key === "__proto__")
        key = "#__proto__";
      this.child.push({ [key]: val2 });
    }
    addChild(node) {
      if (node.tagname === "__proto__")
        node.tagname = "#__proto__";
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
      let hasBody = false, comment = false;
      let exp = "";
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === "<" && !comment) {
          if (hasBody && isEntity(xmlData, i)) {
            i += 7;
            [entityName, val, i] = readEntityExp(xmlData, i + 1);
            if (val.indexOf("&") === -1)
              entities[entityName] = {
                regx: RegExp(`&${entityName};`, "g"),
                val
              };
          } else if (hasBody && isElement(xmlData, i))
            i += 8;
          else if (hasBody && isAttlist(xmlData, i))
            i += 8;
          else if (hasBody && isNotation(xmlData, i))
            i += 9;
          else if (isComment)
            comment = true;
          else
            throw new Error("Invalid DOCTYPE");
          angleBracketsCount++;
          exp = "";
        } else if (xmlData[i] === ">") {
          if (comment) {
            if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
              comment = false;
              angleBracketsCount--;
            }
          } else {
            angleBracketsCount--;
          }
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
  function readEntityExp(xmlData, i) {
    let entityName2 = "";
    for (; i < xmlData.length && (xmlData[i] !== "'" && xmlData[i] !== '"'); i++) {
      entityName2 += xmlData[i];
    }
    entityName2 = entityName2.trim();
    if (entityName2.indexOf(" ") !== -1)
      throw new Error("External entites are not supported");
    const startChar = xmlData[i++];
    let val2 = "";
    for (; i < xmlData.length && xmlData[i] !== startChar; i++) {
      val2 += xmlData[i];
    }
    return [entityName2, val2, i];
  }
  function isComment(xmlData, i) {
    if (xmlData[i + 1] === "!" && xmlData[i + 2] === "-" && xmlData[i + 3] === "-")
      return true;
    return false;
  }
  function isEntity(xmlData, i) {
    if (xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "N" && xmlData[i + 4] === "T" && xmlData[i + 5] === "I" && xmlData[i + 6] === "T" && xmlData[i + 7] === "Y")
      return true;
    return false;
  }
  function isElement(xmlData, i) {
    if (xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "L" && xmlData[i + 4] === "E" && xmlData[i + 5] === "M" && xmlData[i + 6] === "E" && xmlData[i + 7] === "N" && xmlData[i + 8] === "T")
      return true;
    return false;
  }
  function isAttlist(xmlData, i) {
    if (xmlData[i + 1] === "!" && xmlData[i + 2] === "A" && xmlData[i + 3] === "T" && xmlData[i + 4] === "T" && xmlData[i + 5] === "L" && xmlData[i + 6] === "I" && xmlData[i + 7] === "S" && xmlData[i + 8] === "T")
      return true;
    return false;
  }
  function isNotation(xmlData, i) {
    if (xmlData[i + 1] === "!" && xmlData[i + 2] === "N" && xmlData[i + 3] === "O" && xmlData[i + 4] === "T" && xmlData[i + 5] === "A" && xmlData[i + 6] === "T" && xmlData[i + 7] === "I" && xmlData[i + 8] === "O" && xmlData[i + 9] === "N")
      return true;
    return false;
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
    //skipLike: /regex/
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
  let OrderedObjParser$1 = class OrderedObjParser {
    constructor(options) {
      this.options = options;
      this.currentNode = null;
      this.tagsNodeStack = [];
      this.docTypeEntities = {};
      this.lastEntities = {
        "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
        "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
        "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
        "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
      };
      this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
      this.htmlEntities = {
        "space": { regex: /&(nbsp|#160);/g, val: " " },
        // "lt" : { regex: /&(lt|#60);/g, val: "<" },
        // "gt" : { regex: /&(gt|#62);/g, val: ">" },
        // "amp" : { regex: /&(amp|#38);/g, val: "&" },
        // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
        // "apos" : { regex: /&(apos|#39);/g, val: "'" },
        "cent": { regex: /&(cent|#162);/g, val: "¢" },
        "pound": { regex: /&(pound|#163);/g, val: "£" },
        "yen": { regex: /&(yen|#165);/g, val: "¥" },
        "euro": { regex: /&(euro|#8364);/g, val: "€" },
        "copyright": { regex: /&(copy|#169);/g, val: "©" },
        "reg": { regex: /&(reg|#174);/g, val: "®" },
        "inr": { regex: /&(inr|#8377);/g, val: "₹" }
      };
      this.addExternalEntities = addExternalEntities;
      this.parseXml = parseXml;
      this.parseTextData = parseTextData;
      this.resolveNameSpace = resolveNameSpace;
      this.buildAttributesMap = buildAttributesMap;
      this.isItStopNode = isItStopNode;
      this.replaceEntitiesValue = replaceEntitiesValue$1;
      this.readStopNodeData = readStopNodeData;
      this.saveTextToParentTag = saveTextToParentTag;
      this.addChild = addChild;
    }
  };
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
  function parseTextData(val2, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
    if (val2 !== void 0) {
      if (this.options.trimValues && !dontTrim) {
        val2 = val2.trim();
      }
      if (val2.length > 0) {
        if (!escapeEntities)
          val2 = this.replaceEntitiesValue(val2);
        const newval = this.options.tagValueProcessor(tagName, val2, jPath, hasAttributes, isLeafNode);
        if (newval === null || newval === void 0) {
          return val2;
        } else if (typeof newval !== typeof val2 || newval !== val2) {
          return newval;
        } else if (this.options.trimValues) {
          return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
        } else {
          const trimmedVal = val2.trim();
          if (trimmedVal === val2) {
            return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            return val2;
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
  function buildAttributesMap(attrStr, jPath, tagName) {
    if (!this.options.ignoreAttributes && typeof attrStr === "string") {
      const matches = util.getAllMatches(attrStr, attrsRegx);
      const len = matches.length;
      const attrs = {};
      for (let i = 0; i < len; i++) {
        const attrName = this.resolveNameSpace(matches[i][1]);
        let oldVal = matches[i][4];
        let aName = this.options.attributeNamePrefix + attrName;
        if (attrName.length) {
          if (this.options.transformAttributeName) {
            aName = this.options.transformAttributeName(aName);
          }
          if (aName === "__proto__")
            aName = "#__proto__";
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
              attrs[aName] = parseValue(
                oldVal,
                this.options.parseAttributeValue,
                this.options.numberParseOptions
              );
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
          const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
          if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
            throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
          }
          let propIndex = 0;
          if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
            propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
            this.tagsNodeStack.pop();
          } else {
            propIndex = jPath.lastIndexOf(".");
          }
          jPath = jPath.substring(0, propIndex);
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
              childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
            }
            this.addChild(currentNode, childNode, jPath);
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
            let val2 = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true);
            if (val2 == void 0)
              val2 = "";
            currentNode.add(this.options.textNodeName, val2);
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
          const lastTag = currentNode;
          if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
            currentNode = this.tagsNodeStack.pop();
            jPath = jPath.substring(0, jPath.lastIndexOf("."));
          }
          if (tagName !== xmlObj.tagname) {
            jPath += jPath ? "." + tagName : tagName;
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
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
            }
            if (tagContent) {
              tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
            }
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
            childNode.add(this.options.textNodeName, tagContent);
            this.addChild(currentNode, childNode, jPath);
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
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              this.addChild(currentNode, childNode, jPath);
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
            } else {
              const childNode = new xmlNode(tagName);
              this.tagsNodeStack.push(currentNode);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              this.addChild(currentNode, childNode, jPath);
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
  function addChild(currentNode, childNode, jPath) {
    const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
    if (result === false)
      ;
    else if (typeof result === "string") {
      childNode.tagname = result;
      currentNode.addChild(childNode);
    } else {
      currentNode.addChild(childNode);
    }
  }
  const replaceEntitiesValue$1 = function(val2) {
    if (this.options.processEntities) {
      for (let entityName2 in this.docTypeEntities) {
        const entity = this.docTypeEntities[entityName2];
        val2 = val2.replace(entity.regx, entity.val);
      }
      for (let entityName2 in this.lastEntities) {
        const entity = this.lastEntities[entityName2];
        val2 = val2.replace(entity.regex, entity.val);
      }
      if (this.options.htmlEntities) {
        for (let entityName2 in this.htmlEntities) {
          const entity = this.htmlEntities[entityName2];
          val2 = val2.replace(entity.regex, entity.val);
        }
      }
      val2 = val2.replace(this.ampEntity.regex, this.ampEntity.val);
    }
    return val2;
  };
  function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
    if (textData) {
      if (isLeafNode === void 0)
        isLeafNode = Object.keys(currentNode.child).length === 0;
      textData = this.parseTextData(
        textData,
        currentNode.tagname,
        jPath,
        false,
        currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
        isLeafNode
      );
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
  function parseValue(val2, shouldParse, options) {
    if (shouldParse && typeof val2 === "string") {
      const newval = val2.trim();
      if (newval === "true")
        return true;
      else if (newval === "false")
        return false;
      else
        return toNumber(val2, options);
    } else {
      if (util.isExist(val2)) {
        return val2;
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
        let val2 = compress(tagObj[property], options, newJpath);
        const isLeaf = isLeafTag(val2, options);
        if (tagObj[":@"]) {
          assignAttributes(val2, tagObj[":@"], newJpath, options);
        } else if (Object.keys(val2).length === 1 && val2[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
          val2 = val2[options.textNodeName];
        } else if (Object.keys(val2).length === 0) {
          if (options.alwaysCreateTextNode)
            val2[options.textNodeName] = "";
          else
            val2 = "";
        }
        if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
          if (!Array.isArray(compressedObj[property])) {
            compressedObj[property] = [compressedObj[property]];
          }
          compressedObj[property].push(val2);
        } else {
          if (options.isArray(property, newJpath, isLeaf)) {
            compressedObj[property] = [val2];
          } else {
            compressedObj[property] = val2;
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
    const { textNodeName } = options;
    const propCount = Object.keys(obj).length;
    if (propCount === 0) {
      return true;
    }
    if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
      return true;
    }
    return false;
  }
  node2json.prettify = prettify$1;
  const { buildOptions } = OptionsBuilder;
  const OrderedObjParser2 = OrderedObjParser_1;
  const { prettify } = node2json;
  const validator$1 = validator$2;
  let XMLParser$1 = class XMLParser {
    constructor(options) {
      this.externalEntities = {};
      this.options = buildOptions(options);
    }
    /**
     * Parse XML dats to JS object 
     * @param {string|Buffer} xmlData 
     * @param {boolean|Object} validationOption 
     */
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
      const orderedObjParser = new OrderedObjParser2(this.options);
      orderedObjParser.addExternalEntities(this.externalEntities);
      const orderedResult = orderedObjParser.parseXml(xmlData);
      if (this.options.preserveOrder || orderedResult === void 0)
        return orderedResult;
      else
        return prettify(orderedResult, this.options);
    }
    /**
     * Add Entity which is not by default supported by this library
     * @param {string} key 
     * @param {string} value 
     */
    addEntity(key, value) {
      if (value.indexOf("&") !== -1) {
        throw new Error("Entity value can't have '&'");
      } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
        throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
      } else if (value === "&") {
        throw new Error("An entity with value '&' is not permitted");
      } else {
        this.externalEntities[key] = value;
      }
    }
  };
  var XMLParser_1 = XMLParser$1;
  const EOL = "\n";
  function toXml(jArray, options) {
    let indentation = "";
    if (options.format && options.indentBy.length > 0) {
      indentation = EOL;
    }
    return arrToStr(jArray, options, "", indentation);
  }
  function arrToStr(arr, options, jPath, indentation) {
    let xmlStr = "";
    let isPreviousElementTag = false;
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
          tagText = replaceEntitiesValue(tagText, options);
        }
        if (isPreviousElementTag) {
          xmlStr += indentation;
        }
        xmlStr += tagText;
        isPreviousElementTag = false;
        continue;
      } else if (tagName === options.cdataPropName) {
        if (isPreviousElementTag) {
          xmlStr += indentation;
        }
        xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
        isPreviousElementTag = false;
        continue;
      } else if (tagName === options.commentPropName) {
        xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
        isPreviousElementTag = true;
        continue;
      } else if (tagName[0] === "?") {
        const attStr2 = attr_to_str(tagObj[":@"], options);
        const tempInd = tagName === "?xml" ? "" : indentation;
        let piTextNodeName = tagObj[tagName][0][options.textNodeName];
        piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
        xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
        isPreviousElementTag = true;
        continue;
      }
      let newIdentation = indentation;
      if (newIdentation !== "") {
        newIdentation += options.indentBy;
      }
      const attStr = attr_to_str(tagObj[":@"], options);
      const tagStart = indentation + `<${tagName}${attStr}`;
      const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
      if (options.unpairedTags.indexOf(tagName) !== -1) {
        if (options.suppressUnpairedNode)
          xmlStr += tagStart + ">";
        else
          xmlStr += tagStart + "/>";
      } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
        xmlStr += tagStart + "/>";
      } else if (tagValue && tagValue.endsWith(">")) {
        xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
      } else {
        xmlStr += tagStart + ">";
        if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
          xmlStr += indentation + options.indentBy + tagValue + indentation;
        } else {
          xmlStr += tagValue;
        }
        xmlStr += `</${tagName}>`;
      }
      isPreviousElementTag = true;
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
        attrVal = replaceEntitiesValue(attrVal, options);
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
  function replaceEntitiesValue(textValue, options) {
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
      //it must be on top
      { regex: new RegExp(">", "g"), val: "&gt;" },
      { regex: new RegExp("<", "g"), val: "&lt;" },
      { regex: new RegExp("'", "g"), val: "&apos;" },
      { regex: new RegExp('"', "g"), val: "&quot;" }
    ],
    processEntities: true,
    stopNodes: [],
    // transformTagName: false,
    // transformAttributeName: false,
    oneListGroup: false
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
    let val2 = "";
    for (let key in jObj) {
      if (typeof jObj[key] === "undefined")
        ;
      else if (jObj[key] === null) {
        if (key[0] === "?")
          val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
        else
          val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
      } else if (jObj[key] instanceof Date) {
        val2 += this.buildTextValNode(jObj[key], key, "", level);
      } else if (typeof jObj[key] !== "object") {
        const attr2 = this.isAttribute(key);
        if (attr2) {
          attrStr += this.buildAttrPairStr(attr2, "" + jObj[key]);
        } else {
          if (key === this.options.textNodeName) {
            let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
            val2 += this.replaceEntitiesValue(newval);
          } else {
            val2 += this.buildTextValNode(jObj[key], key, "", level);
          }
        }
      } else if (Array.isArray(jObj[key])) {
        const arrLen = jObj[key].length;
        let listTagVal = "";
        for (let j = 0; j < arrLen; j++) {
          const item = jObj[key][j];
          if (typeof item === "undefined")
            ;
          else if (item === null) {
            if (key[0] === "?")
              val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
            else
              val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          } else if (typeof item === "object") {
            if (this.options.oneListGroup) {
              listTagVal += this.j2x(item, level + 1).val;
            } else {
              listTagVal += this.processTextOrObjNode(item, key, level);
            }
          } else {
            listTagVal += this.buildTextValNode(item, key, "", level);
          }
        }
        if (this.options.oneListGroup) {
          listTagVal = this.buildObjectNode(listTagVal, key, "", level);
        }
        val2 += listTagVal;
      } else {
        if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
          const Ks = Object.keys(jObj[key]);
          const L = Ks.length;
          for (let j = 0; j < L; j++) {
            attrStr += this.buildAttrPairStr(Ks[j], "" + jObj[key][Ks[j]]);
          }
        } else {
          val2 += this.processTextOrObjNode(jObj[key], key, level);
        }
      }
    }
    return { attrStr, val: val2 };
  };
  Builder.prototype.buildAttrPairStr = function(attrName, val2) {
    val2 = this.options.attributeValueProcessor(attrName, "" + val2);
    val2 = this.replaceEntitiesValue(val2);
    if (this.options.suppressBooleanAttributes && val2 === "true") {
      return " " + attrName;
    } else
      return " " + attrName + '="' + val2 + '"';
  };
  function processTextOrObjNode(object, key, level) {
    const result = this.j2x(object, level + 1);
    if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
      return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
    } else {
      return this.buildObjectNode(result.val, key, result.attrStr, level);
    }
  }
  Builder.prototype.buildObjectNode = function(val2, key, attrStr, level) {
    if (val2 === "") {
      if (key[0] === "?")
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      else {
        return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
      }
    } else {
      let tagEndExp = "</" + key + this.tagEndChar;
      let piClosingChar = "";
      if (key[0] === "?") {
        piClosingChar = "?";
        tagEndExp = "";
      }
      if (attrStr && val2.indexOf("<") === -1) {
        return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val2 + tagEndExp;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
        return this.indentate(level) + `<!--${val2}-->` + this.newLine;
      } else {
        return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val2 + this.indentate(level) + tagEndExp;
      }
    }
  };
  Builder.prototype.closeTag = function(key) {
    let closeTag = "";
    if (this.options.unpairedTags.indexOf(key) !== -1) {
      if (!this.options.suppressUnpairedNode)
        closeTag = "/";
    } else if (this.options.suppressEmptyNode) {
      closeTag = "/";
    } else {
      closeTag = `></${key}`;
    }
    return closeTag;
  };
  Builder.prototype.buildTextValNode = function(val2, key, attrStr, level) {
    if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
      return this.indentate(level) + `<![CDATA[${val2}]]>` + this.newLine;
    } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
      return this.indentate(level) + `<!--${val2}-->` + this.newLine;
    } else if (key[0] === "?") {
      return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
    } else {
      let textValue = this.options.tagValueProcessor(key, val2);
      textValue = this.replaceEntitiesValue(textValue);
      if (textValue === "") {
        return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
      } else {
        return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
      }
    }
  };
  Builder.prototype.replaceEntitiesValue = function(textValue) {
    if (textValue && textValue.length > 0 && this.options.processEntities) {
      for (let i = 0; i < this.options.entities.length; i++) {
        const entity = this.options.entities[i];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  };
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
  const XMLParser2 = XMLParser_1;
  const XMLBuilder = json2xml;
  var fxp = {
    XMLParser: XMLParser2,
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
      _GM_xmlhttpRequest({
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
  var mp3tagExports = {};
  var mp3tag = {
    get exports() {
      return mp3tagExports;
    },
    set exports(v) {
      mp3tagExports = v;
    }
  };
  (function(module, exports) {
    (function(global2, factory) {
      module.exports = factory();
    })(commonjsGlobal, function() {
      function ownKeys$2(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = null != arguments[i] ? arguments[i] : {};
          i % 2 ? ownKeys$2(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
          return typeof obj2;
        } : function(obj2) {
          return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        }, _typeof(obj);
      }
      function _classCallCheck(instance, Constructor2) {
        if (!(instance instanceof Constructor2)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _createClass(Constructor2, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor2.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor2, staticProps);
        Object.defineProperty(Constructor2, "prototype", {
          writable: false
        });
        return Constructor2;
      }
      function _defineProperty(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            writable: true,
            configurable: true
          }
        });
        Object.defineProperty(subClass, "prototype", {
          writable: false
        });
        if (superClass)
          _setPrototypeOf(subClass, superClass);
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct)
          return false;
        if (Reflect.construct.sham)
          return false;
        if (typeof Proxy === "function")
          return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e) {
          return false;
        }
      }
      function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) {
          _construct = Reflect.construct.bind();
        } else {
          _construct = function _construct2(Parent2, args2, Class2) {
            var a = [null];
            a.push.apply(a, args2);
            var Constructor2 = Function.bind.apply(Parent2, a);
            var instance = new Constructor2();
            if (Class2)
              _setPrototypeOf(instance, Class2.prototype);
            return instance;
          };
        }
        return _construct.apply(null, arguments);
      }
      function _isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
      }
      function _wrapNativeSuper(Class) {
        var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
        _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
          if (Class2 === null || !_isNativeFunction(Class2))
            return Class2;
          if (typeof Class2 !== "function") {
            throw new TypeError("Super expression must either be null or a function");
          }
          if (typeof _cache !== "undefined") {
            if (_cache.has(Class2))
              return _cache.get(Class2);
            _cache.set(Class2, Wrapper);
          }
          function Wrapper() {
            return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
          }
          Wrapper.prototype = Object.create(Class2.prototype, {
            constructor: {
              value: Wrapper,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
          return _setPrototypeOf(Wrapper, Class2);
        };
        return _wrapNativeSuper(Class);
      }
      function _assertThisInitialized(self2) {
        if (self2 === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self2;
      }
      function _possibleConstructorReturn(self2, call2) {
        if (call2 && (typeof call2 === "object" || typeof call2 === "function")) {
          return call2;
        } else if (call2 !== void 0) {
          throw new TypeError("Derived constructors may only return object or undefined");
        }
        return _assertThisInitialized(self2);
      }
      function _createSuper(Derived) {
        var hasNativeReflectConstruct = _isNativeReflectConstruct();
        return function _createSuperInternal() {
          var Super = _getPrototypeOf(Derived), result;
          if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
          } else {
            result = Super.apply(this, arguments);
          }
          return _possibleConstructorReturn(this, result);
        };
      }
      function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
      }
      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr))
          return _arrayLikeToArray(arr);
      }
      function _iterableToArray(iter) {
        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
          return Array.from(iter);
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++)
          arr2[i] = arr[i];
        return arr2;
      }
      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var commonjsGlobal$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : {};
      var fails$D = function(exec2) {
        try {
          return !!exec2();
        } catch (error) {
          return true;
        }
      };
      var fails$C = fails$D;
      var descriptors = !fails$C(function() {
        return Object.defineProperty({}, 1, {
          get: function() {
            return 7;
          }
        })[1] != 7;
      });
      var fails$B = fails$D;
      var functionBindNative = !fails$B(function() {
        var test2 = function() {
        }.bind();
        return typeof test2 != "function" || test2.hasOwnProperty("prototype");
      });
      var NATIVE_BIND$3 = functionBindNative;
      var FunctionPrototype$3 = Function.prototype;
      var bind$3 = FunctionPrototype$3.bind;
      var call$l = FunctionPrototype$3.call;
      var uncurryThis$E = NATIVE_BIND$3 && bind$3.bind(call$l, call$l);
      var functionUncurryThis = NATIVE_BIND$3 ? function(fn) {
        return fn && uncurryThis$E(fn);
      } : function(fn) {
        return fn && function() {
          return call$l.apply(fn, arguments);
        };
      };
      var isNullOrUndefined$7 = function(it) {
        return it === null || it === void 0;
      };
      var isNullOrUndefined$6 = isNullOrUndefined$7;
      var $TypeError$g = TypeError;
      var requireObjectCoercible$9 = function(it) {
        if (isNullOrUndefined$6(it))
          throw $TypeError$g("Can't call method on " + it);
        return it;
      };
      var requireObjectCoercible$8 = requireObjectCoercible$9;
      var $Object$4 = Object;
      var toObject$b = function(argument) {
        return $Object$4(requireObjectCoercible$8(argument));
      };
      var uncurryThis$D = functionUncurryThis;
      var toObject$a = toObject$b;
      var hasOwnProperty = uncurryThis$D({}.hasOwnProperty);
      var hasOwnProperty_1 = Object.hasOwn || function hasOwn2(it, key2) {
        return hasOwnProperty(toObject$a(it), key2);
      };
      var DESCRIPTORS$j = descriptors;
      var hasOwn$h = hasOwnProperty_1;
      var FunctionPrototype$2 = Function.prototype;
      var getDescriptor = DESCRIPTORS$j && Object.getOwnPropertyDescriptor;
      var EXISTS$1 = hasOwn$h(FunctionPrototype$2, "name");
      var PROPER = EXISTS$1 && function something() {
      }.name === "something";
      var CONFIGURABLE$1 = EXISTS$1 && (!DESCRIPTORS$j || DESCRIPTORS$j && getDescriptor(FunctionPrototype$2, "name").configurable);
      var functionName = {
        EXISTS: EXISTS$1,
        PROPER,
        CONFIGURABLE: CONFIGURABLE$1
      };
      var objectDefineProperty = {};
      var check = function(it) {
        return it && it.Math == Math && it;
      };
      var global$u = (
        // eslint-disable-next-line es-x/no-global-this -- safe
        check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || // eslint-disable-next-line no-restricted-globals -- safe
        check(typeof self == "object" && self) || check(typeof commonjsGlobal$1 == "object" && commonjsGlobal$1) || // eslint-disable-next-line no-new-func -- fallback
        function() {
          return this;
        }() || Function("return this")()
      );
      var isCallable$n = function(argument) {
        return typeof argument == "function";
      };
      var isCallable$m = isCallable$n;
      var documentAll = typeof document == "object" && document.all;
      var SPECIAL_DOCUMENT_ALL = typeof documentAll == "undefined" && documentAll !== void 0;
      var isObject$f = SPECIAL_DOCUMENT_ALL ? function(it) {
        return typeof it == "object" ? it !== null : isCallable$m(it) || it === documentAll;
      } : function(it) {
        return typeof it == "object" ? it !== null : isCallable$m(it);
      };
      var global$t = global$u;
      var isObject$e = isObject$f;
      var document$1 = global$t.document;
      var EXISTS = isObject$e(document$1) && isObject$e(document$1.createElement);
      var documentCreateElement$2 = function(it) {
        return EXISTS ? document$1.createElement(it) : {};
      };
      var DESCRIPTORS$i = descriptors;
      var fails$A = fails$D;
      var createElement = documentCreateElement$2;
      var ie8DomDefine = !DESCRIPTORS$i && !fails$A(function() {
        return Object.defineProperty(createElement("div"), "a", {
          get: function() {
            return 7;
          }
        }).a != 7;
      });
      var DESCRIPTORS$h = descriptors;
      var fails$z = fails$D;
      var v8PrototypeDefineBug = DESCRIPTORS$h && fails$z(function() {
        return Object.defineProperty(function() {
        }, "prototype", {
          value: 42,
          writable: false
        }).prototype != 42;
      });
      var isObject$d = isObject$f;
      var $String$3 = String;
      var $TypeError$f = TypeError;
      var anObject$g = function(argument) {
        if (isObject$d(argument))
          return argument;
        throw $TypeError$f($String$3(argument) + " is not an object");
      };
      var NATIVE_BIND$2 = functionBindNative;
      var call$k = Function.prototype.call;
      var functionCall = NATIVE_BIND$2 ? call$k.bind(call$k) : function() {
        return call$k.apply(call$k, arguments);
      };
      var global$s = global$u;
      var isCallable$l = isCallable$n;
      var aFunction = function(argument) {
        return isCallable$l(argument) ? argument : void 0;
      };
      var getBuiltIn$9 = function(namespace, method) {
        return arguments.length < 2 ? aFunction(global$s[namespace]) : global$s[namespace] && global$s[namespace][method];
      };
      var uncurryThis$C = functionUncurryThis;
      var objectIsPrototypeOf = uncurryThis$C({}.isPrototypeOf);
      var getBuiltIn$8 = getBuiltIn$9;
      var engineUserAgent = getBuiltIn$8("navigator", "userAgent") || "";
      var global$r = global$u;
      var userAgent$2 = engineUserAgent;
      var process = global$r.process;
      var Deno = global$r.Deno;
      var versions = process && process.versions || Deno && Deno.version;
      var v8 = versions && versions.v8;
      var match, version;
      if (v8) {
        match = v8.split(".");
        version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
      }
      if (!version && userAgent$2) {
        match = userAgent$2.match(/Edge\/(\d+)/);
        if (!match || match[1] >= 74) {
          match = userAgent$2.match(/Chrome\/(\d+)/);
          if (match)
            version = +match[1];
        }
      }
      var engineV8Version = version;
      var V8_VERSION$2 = engineV8Version;
      var fails$y = fails$D;
      var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$y(function() {
        var symbol = Symbol();
        return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
        !Symbol.sham && V8_VERSION$2 && V8_VERSION$2 < 41;
      });
      var NATIVE_SYMBOL$6 = symbolConstructorDetection;
      var useSymbolAsUid = NATIVE_SYMBOL$6 && !Symbol.sham && typeof Symbol.iterator == "symbol";
      var getBuiltIn$7 = getBuiltIn$9;
      var isCallable$k = isCallable$n;
      var isPrototypeOf$7 = objectIsPrototypeOf;
      var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
      var $Object$3 = Object;
      var isSymbol$5 = USE_SYMBOL_AS_UID$1 ? function(it) {
        return typeof it == "symbol";
      } : function(it) {
        var $Symbol2 = getBuiltIn$7("Symbol");
        return isCallable$k($Symbol2) && isPrototypeOf$7($Symbol2.prototype, $Object$3(it));
      };
      var $String$2 = String;
      var tryToString$6 = function(argument) {
        try {
          return $String$2(argument);
        } catch (error) {
          return "Object";
        }
      };
      var isCallable$j = isCallable$n;
      var tryToString$5 = tryToString$6;
      var $TypeError$e = TypeError;
      var aCallable$5 = function(argument) {
        if (isCallable$j(argument))
          return argument;
        throw $TypeError$e(tryToString$5(argument) + " is not a function");
      };
      var aCallable$4 = aCallable$5;
      var isNullOrUndefined$5 = isNullOrUndefined$7;
      var getMethod$5 = function(V, P) {
        var func = V[P];
        return isNullOrUndefined$5(func) ? void 0 : aCallable$4(func);
      };
      var call$j = functionCall;
      var isCallable$i = isCallable$n;
      var isObject$c = isObject$f;
      var $TypeError$d = TypeError;
      var ordinaryToPrimitive$1 = function(input, pref) {
        var fn, val2;
        if (pref === "string" && isCallable$i(fn = input.toString) && !isObject$c(val2 = call$j(fn, input)))
          return val2;
        if (isCallable$i(fn = input.valueOf) && !isObject$c(val2 = call$j(fn, input)))
          return val2;
        if (pref !== "string" && isCallable$i(fn = input.toString) && !isObject$c(val2 = call$j(fn, input)))
          return val2;
        throw $TypeError$d("Can't convert object to primitive value");
      };
      var shared$7 = { exports: {} };
      var global$q = global$u;
      var defineProperty$b = Object.defineProperty;
      var defineGlobalProperty$3 = function(key2, value) {
        try {
          defineProperty$b(global$q, key2, {
            value,
            configurable: true,
            writable: true
          });
        } catch (error) {
          global$q[key2] = value;
        }
        return value;
      };
      var global$p = global$u;
      var defineGlobalProperty$2 = defineGlobalProperty$3;
      var SHARED = "__core-js_shared__";
      var store$3 = global$p[SHARED] || defineGlobalProperty$2(SHARED, {});
      var sharedStore = store$3;
      var store$2 = sharedStore;
      (shared$7.exports = function(key2, value) {
        return store$2[key2] || (store$2[key2] = value !== void 0 ? value : {});
      })("versions", []).push({
        version: "3.25.1",
        mode: "global",
        copyright: "© 2014-2022 Denis Pushkarev (zloirock.ru)",
        license: "https://github.com/zloirock/core-js/blob/v3.25.1/LICENSE",
        source: "https://github.com/zloirock/core-js"
      });
      var uncurryThis$B = functionUncurryThis;
      var id = 0;
      var postfix = Math.random();
      var toString$g = uncurryThis$B(1 .toString);
      var uid$4 = function(key2) {
        return "Symbol(" + (key2 === void 0 ? "" : key2) + ")_" + toString$g(++id + postfix, 36);
      };
      var global$o = global$u;
      var shared$6 = shared$7.exports;
      var hasOwn$g = hasOwnProperty_1;
      var uid$3 = uid$4;
      var NATIVE_SYMBOL$5 = symbolConstructorDetection;
      var USE_SYMBOL_AS_UID = useSymbolAsUid;
      var WellKnownSymbolsStore$1 = shared$6("wks");
      var Symbol$2 = global$o.Symbol;
      var symbolFor = Symbol$2 && Symbol$2["for"];
      var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$2 : Symbol$2 && Symbol$2.withoutSetter || uid$3;
      var wellKnownSymbol$q = function(name) {
        if (!hasOwn$g(WellKnownSymbolsStore$1, name) || !(NATIVE_SYMBOL$5 || typeof WellKnownSymbolsStore$1[name] == "string")) {
          var description = "Symbol." + name;
          if (NATIVE_SYMBOL$5 && hasOwn$g(Symbol$2, name)) {
            WellKnownSymbolsStore$1[name] = Symbol$2[name];
          } else if (USE_SYMBOL_AS_UID && symbolFor) {
            WellKnownSymbolsStore$1[name] = symbolFor(description);
          } else {
            WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
          }
        }
        return WellKnownSymbolsStore$1[name];
      };
      var call$i = functionCall;
      var isObject$b = isObject$f;
      var isSymbol$4 = isSymbol$5;
      var getMethod$4 = getMethod$5;
      var ordinaryToPrimitive = ordinaryToPrimitive$1;
      var wellKnownSymbol$p = wellKnownSymbol$q;
      var $TypeError$c = TypeError;
      var TO_PRIMITIVE = wellKnownSymbol$p("toPrimitive");
      var toPrimitive$2 = function(input, pref) {
        if (!isObject$b(input) || isSymbol$4(input))
          return input;
        var exoticToPrim = getMethod$4(input, TO_PRIMITIVE);
        var result;
        if (exoticToPrim) {
          if (pref === void 0)
            pref = "default";
          result = call$i(exoticToPrim, input, pref);
          if (!isObject$b(result) || isSymbol$4(result))
            return result;
          throw $TypeError$c("Can't convert object to primitive value");
        }
        if (pref === void 0)
          pref = "number";
        return ordinaryToPrimitive(input, pref);
      };
      var toPrimitive$1 = toPrimitive$2;
      var isSymbol$3 = isSymbol$5;
      var toPropertyKey$5 = function(argument) {
        var key2 = toPrimitive$1(argument, "string");
        return isSymbol$3(key2) ? key2 : key2 + "";
      };
      var DESCRIPTORS$g = descriptors;
      var IE8_DOM_DEFINE$1 = ie8DomDefine;
      var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
      var anObject$f = anObject$g;
      var toPropertyKey$4 = toPropertyKey$5;
      var $TypeError$b = TypeError;
      var $defineProperty$1 = Object.defineProperty;
      var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;
      var ENUMERABLE = "enumerable";
      var CONFIGURABLE = "configurable";
      var WRITABLE = "writable";
      objectDefineProperty.f = DESCRIPTORS$g ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty2(O, P, Attributes) {
        anObject$f(O);
        P = toPropertyKey$4(P);
        anObject$f(Attributes);
        if (typeof O === "function" && P === "prototype" && "value" in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
          var current = $getOwnPropertyDescriptor$2(O, P);
          if (current && current[WRITABLE]) {
            O[P] = Attributes.value;
            Attributes = {
              configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
              enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
              writable: false
            };
          }
        }
        return $defineProperty$1(O, P, Attributes);
      } : $defineProperty$1 : function defineProperty2(O, P, Attributes) {
        anObject$f(O);
        P = toPropertyKey$4(P);
        anObject$f(Attributes);
        if (IE8_DOM_DEFINE$1)
          try {
            return $defineProperty$1(O, P, Attributes);
          } catch (error) {
          }
        if ("get" in Attributes || "set" in Attributes)
          throw $TypeError$b("Accessors not supported");
        if ("value" in Attributes)
          O[P] = Attributes.value;
        return O;
      };
      var DESCRIPTORS$f = descriptors;
      var FUNCTION_NAME_EXISTS = functionName.EXISTS;
      var uncurryThis$A = functionUncurryThis;
      var defineProperty$a = objectDefineProperty.f;
      var FunctionPrototype$1 = Function.prototype;
      var functionToString$1 = uncurryThis$A(FunctionPrototype$1.toString);
      var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
      var regExpExec$2 = uncurryThis$A(nameRE.exec);
      var NAME$1 = "name";
      if (DESCRIPTORS$f && !FUNCTION_NAME_EXISTS) {
        defineProperty$a(FunctionPrototype$1, NAME$1, {
          configurable: true,
          get: function() {
            try {
              return regExpExec$2(nameRE, functionToString$1(this))[1];
            } catch (error) {
              return "";
            }
          }
        });
      }
      var objectGetOwnPropertyDescriptor = {};
      var objectPropertyIsEnumerable = {};
      var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
      var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;
      var NASHORN_BUG = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable$1.call({
        1: 2
      }, 1);
      objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
        var descriptor = getOwnPropertyDescriptor$2(this, V);
        return !!descriptor && descriptor.enumerable;
      } : $propertyIsEnumerable$1;
      var createPropertyDescriptor$6 = function(bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value
        };
      };
      var uncurryThis$z = functionUncurryThis;
      var toString$f = uncurryThis$z({}.toString);
      var stringSlice$7 = uncurryThis$z("".slice);
      var classofRaw$1 = function(it) {
        return stringSlice$7(toString$f(it), 8, -1);
      };
      var uncurryThis$y = functionUncurryThis;
      var fails$x = fails$D;
      var classof$e = classofRaw$1;
      var $Object$2 = Object;
      var split = uncurryThis$y("".split);
      var indexedObject = fails$x(function() {
        return !$Object$2("z").propertyIsEnumerable(0);
      }) ? function(it) {
        return classof$e(it) == "String" ? split(it, "") : $Object$2(it);
      } : $Object$2;
      var IndexedObject$2 = indexedObject;
      var requireObjectCoercible$7 = requireObjectCoercible$9;
      var toIndexedObject$a = function(it) {
        return IndexedObject$2(requireObjectCoercible$7(it));
      };
      var DESCRIPTORS$e = descriptors;
      var call$h = functionCall;
      var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
      var createPropertyDescriptor$5 = createPropertyDescriptor$6;
      var toIndexedObject$9 = toIndexedObject$a;
      var toPropertyKey$3 = toPropertyKey$5;
      var hasOwn$f = hasOwnProperty_1;
      var IE8_DOM_DEFINE = ie8DomDefine;
      var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
      objectGetOwnPropertyDescriptor.f = DESCRIPTORS$e ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor2(O, P) {
        O = toIndexedObject$9(O);
        P = toPropertyKey$3(P);
        if (IE8_DOM_DEFINE)
          try {
            return $getOwnPropertyDescriptor$1(O, P);
          } catch (error) {
          }
        if (hasOwn$f(O, P))
          return createPropertyDescriptor$5(!call$h(propertyIsEnumerableModule$1.f, O, P), O[P]);
      };
      var DESCRIPTORS$d = descriptors;
      var definePropertyModule$7 = objectDefineProperty;
      var createPropertyDescriptor$4 = createPropertyDescriptor$6;
      var createNonEnumerableProperty$9 = DESCRIPTORS$d ? function(object, key2, value) {
        return definePropertyModule$7.f(object, key2, createPropertyDescriptor$4(1, value));
      } : function(object, key2, value) {
        object[key2] = value;
        return object;
      };
      var makeBuiltIn$3 = { exports: {} };
      var uncurryThis$x = functionUncurryThis;
      var isCallable$h = isCallable$n;
      var store$1 = sharedStore;
      var functionToString = uncurryThis$x(Function.toString);
      if (!isCallable$h(store$1.inspectSource)) {
        store$1.inspectSource = function(it) {
          return functionToString(it);
        };
      }
      var inspectSource$2 = store$1.inspectSource;
      var global$n = global$u;
      var isCallable$g = isCallable$n;
      var WeakMap$1 = global$n.WeakMap;
      var weakMapBasicDetection = isCallable$g(WeakMap$1) && /native code/.test(String(WeakMap$1));
      var shared$5 = shared$7.exports;
      var uid$2 = uid$4;
      var keys$2 = shared$5("keys");
      var sharedKey$4 = function(key2) {
        return keys$2[key2] || (keys$2[key2] = uid$2(key2));
      };
      var hiddenKeys$5 = {};
      var NATIVE_WEAK_MAP = weakMapBasicDetection;
      var global$m = global$u;
      var uncurryThis$w = functionUncurryThis;
      var isObject$a = isObject$f;
      var createNonEnumerableProperty$8 = createNonEnumerableProperty$9;
      var hasOwn$e = hasOwnProperty_1;
      var shared$4 = sharedStore;
      var sharedKey$3 = sharedKey$4;
      var hiddenKeys$4 = hiddenKeys$5;
      var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
      var TypeError$3 = global$m.TypeError;
      var WeakMap = global$m.WeakMap;
      var set$1, get$1, has;
      var enforce = function(it) {
        return has(it) ? get$1(it) : set$1(it, {});
      };
      var getterFor = function(TYPE) {
        return function(it) {
          var state;
          if (!isObject$a(it) || (state = get$1(it)).type !== TYPE) {
            throw TypeError$3("Incompatible receiver, " + TYPE + " required");
          }
          return state;
        };
      };
      if (NATIVE_WEAK_MAP || shared$4.state) {
        var store = shared$4.state || (shared$4.state = new WeakMap());
        var wmget = uncurryThis$w(store.get);
        var wmhas = uncurryThis$w(store.has);
        var wmset = uncurryThis$w(store.set);
        set$1 = function(it, metadata) {
          if (wmhas(store, it))
            throw TypeError$3(OBJECT_ALREADY_INITIALIZED);
          metadata.facade = it;
          wmset(store, it, metadata);
          return metadata;
        };
        get$1 = function(it) {
          return wmget(store, it) || {};
        };
        has = function(it) {
          return wmhas(store, it);
        };
      } else {
        var STATE = sharedKey$3("state");
        hiddenKeys$4[STATE] = true;
        set$1 = function(it, metadata) {
          if (hasOwn$e(it, STATE))
            throw TypeError$3(OBJECT_ALREADY_INITIALIZED);
          metadata.facade = it;
          createNonEnumerableProperty$8(it, STATE, metadata);
          return metadata;
        };
        get$1 = function(it) {
          return hasOwn$e(it, STATE) ? it[STATE] : {};
        };
        has = function(it) {
          return hasOwn$e(it, STATE);
        };
      }
      var internalState = {
        set: set$1,
        get: get$1,
        has,
        enforce,
        getterFor
      };
      var fails$w = fails$D;
      var isCallable$f = isCallable$n;
      var hasOwn$d = hasOwnProperty_1;
      var DESCRIPTORS$c = descriptors;
      var CONFIGURABLE_FUNCTION_NAME$2 = functionName.CONFIGURABLE;
      var inspectSource$1 = inspectSource$2;
      var InternalStateModule$5 = internalState;
      var enforceInternalState$3 = InternalStateModule$5.enforce;
      var getInternalState$7 = InternalStateModule$5.get;
      var defineProperty$9 = Object.defineProperty;
      var CONFIGURABLE_LENGTH = DESCRIPTORS$c && !fails$w(function() {
        return defineProperty$9(function() {
        }, "length", {
          value: 8
        }).length !== 8;
      });
      var TEMPLATE = String(String).split("String");
      var makeBuiltIn$2 = makeBuiltIn$3.exports = function(value, name, options) {
        if (String(name).slice(0, 7) === "Symbol(") {
          name = "[" + String(name).replace(/^Symbol\(([^)]*)\)/, "$1") + "]";
        }
        if (options && options.getter)
          name = "get " + name;
        if (options && options.setter)
          name = "set " + name;
        if (!hasOwn$d(value, "name") || CONFIGURABLE_FUNCTION_NAME$2 && value.name !== name) {
          if (DESCRIPTORS$c)
            defineProperty$9(value, "name", {
              value: name,
              configurable: true
            });
          else
            value.name = name;
        }
        if (CONFIGURABLE_LENGTH && options && hasOwn$d(options, "arity") && value.length !== options.arity) {
          defineProperty$9(value, "length", {
            value: options.arity
          });
        }
        try {
          if (options && hasOwn$d(options, "constructor") && options.constructor) {
            if (DESCRIPTORS$c)
              defineProperty$9(value, "prototype", {
                writable: false
              });
          } else if (value.prototype)
            value.prototype = void 0;
        } catch (error) {
        }
        var state = enforceInternalState$3(value);
        if (!hasOwn$d(state, "source")) {
          state.source = TEMPLATE.join(typeof name == "string" ? name : "");
        }
        return value;
      };
      Function.prototype.toString = makeBuiltIn$2(function toString2() {
        return isCallable$f(this) && getInternalState$7(this).source || inspectSource$1(this);
      }, "toString");
      var isCallable$e = isCallable$n;
      var definePropertyModule$6 = objectDefineProperty;
      var makeBuiltIn$1 = makeBuiltIn$3.exports;
      var defineGlobalProperty$1 = defineGlobalProperty$3;
      var defineBuiltIn$c = function(O, key2, value, options) {
        if (!options)
          options = {};
        var simple = options.enumerable;
        var name = options.name !== void 0 ? options.name : key2;
        if (isCallable$e(value))
          makeBuiltIn$1(value, name, options);
        if (options.global) {
          if (simple)
            O[key2] = value;
          else
            defineGlobalProperty$1(key2, value);
        } else {
          try {
            if (!options.unsafe)
              delete O[key2];
            else if (O[key2])
              simple = true;
          } catch (error) {
          }
          if (simple)
            O[key2] = value;
          else
            definePropertyModule$6.f(O, key2, {
              value,
              enumerable: false,
              configurable: !options.nonConfigurable,
              writable: !options.nonWritable
            });
        }
        return O;
      };
      var objectGetOwnPropertyNames = {};
      var ceil = Math.ceil;
      var floor$5 = Math.floor;
      var mathTrunc = Math.trunc || function trunc2(x) {
        var n = +x;
        return (n > 0 ? floor$5 : ceil)(n);
      };
      var trunc = mathTrunc;
      var toIntegerOrInfinity$8 = function(argument) {
        var number = +argument;
        return number !== number || number === 0 ? 0 : trunc(number);
      };
      var toIntegerOrInfinity$7 = toIntegerOrInfinity$8;
      var max$3 = Math.max;
      var min$6 = Math.min;
      var toAbsoluteIndex$7 = function(index2, length) {
        var integer = toIntegerOrInfinity$7(index2);
        return integer < 0 ? max$3(integer + length, 0) : min$6(integer, length);
      };
      var toIntegerOrInfinity$6 = toIntegerOrInfinity$8;
      var min$5 = Math.min;
      var toLength$a = function(argument) {
        return argument > 0 ? min$5(toIntegerOrInfinity$6(argument), 9007199254740991) : 0;
      };
      var toLength$9 = toLength$a;
      var lengthOfArrayLike$c = function(obj) {
        return toLength$9(obj.length);
      };
      var toIndexedObject$8 = toIndexedObject$a;
      var toAbsoluteIndex$6 = toAbsoluteIndex$7;
      var lengthOfArrayLike$b = lengthOfArrayLike$c;
      var createMethod$4 = function(IS_INCLUDES) {
        return function($this, el, fromIndex) {
          var O = toIndexedObject$8($this);
          var length = lengthOfArrayLike$b(O);
          var index2 = toAbsoluteIndex$6(fromIndex, length);
          var value;
          if (IS_INCLUDES && el != el)
            while (length > index2) {
              value = O[index2++];
              if (value != value)
                return true;
            }
          else
            for (; length > index2; index2++) {
              if ((IS_INCLUDES || index2 in O) && O[index2] === el)
                return IS_INCLUDES || index2 || 0;
            }
          return !IS_INCLUDES && -1;
        };
      };
      var arrayIncludes = {
        // `Array.prototype.includes` method
        // https://tc39.es/ecma262/#sec-array.prototype.includes
        includes: createMethod$4(true),
        // `Array.prototype.indexOf` method
        // https://tc39.es/ecma262/#sec-array.prototype.indexof
        indexOf: createMethod$4(false)
      };
      var uncurryThis$v = functionUncurryThis;
      var hasOwn$c = hasOwnProperty_1;
      var toIndexedObject$7 = toIndexedObject$a;
      var indexOf$1 = arrayIncludes.indexOf;
      var hiddenKeys$3 = hiddenKeys$5;
      var push$4 = uncurryThis$v([].push);
      var objectKeysInternal = function(object, names) {
        var O = toIndexedObject$7(object);
        var i = 0;
        var result = [];
        var key2;
        for (key2 in O)
          !hasOwn$c(hiddenKeys$3, key2) && hasOwn$c(O, key2) && push$4(result, key2);
        while (names.length > i)
          if (hasOwn$c(O, key2 = names[i++])) {
            ~indexOf$1(result, key2) || push$4(result, key2);
          }
        return result;
      };
      var enumBugKeys$3 = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
      var internalObjectKeys$1 = objectKeysInternal;
      var enumBugKeys$2 = enumBugKeys$3;
      var hiddenKeys$2 = enumBugKeys$2.concat("length", "prototype");
      objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames2(O) {
        return internalObjectKeys$1(O, hiddenKeys$2);
      };
      var objectGetOwnPropertySymbols = {};
      objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
      var getBuiltIn$6 = getBuiltIn$9;
      var uncurryThis$u = functionUncurryThis;
      var getOwnPropertyNamesModule$1 = objectGetOwnPropertyNames;
      var getOwnPropertySymbolsModule$2 = objectGetOwnPropertySymbols;
      var anObject$e = anObject$g;
      var concat$1 = uncurryThis$u([].concat);
      var ownKeys$1 = getBuiltIn$6("Reflect", "ownKeys") || function ownKeys2(it) {
        var keys2 = getOwnPropertyNamesModule$1.f(anObject$e(it));
        var getOwnPropertySymbols = getOwnPropertySymbolsModule$2.f;
        return getOwnPropertySymbols ? concat$1(keys2, getOwnPropertySymbols(it)) : keys2;
      };
      var hasOwn$b = hasOwnProperty_1;
      var ownKeys = ownKeys$1;
      var getOwnPropertyDescriptorModule$2 = objectGetOwnPropertyDescriptor;
      var definePropertyModule$5 = objectDefineProperty;
      var copyConstructorProperties$2 = function(target, source, exceptions) {
        var keys2 = ownKeys(source);
        var defineProperty2 = definePropertyModule$5.f;
        var getOwnPropertyDescriptor2 = getOwnPropertyDescriptorModule$2.f;
        for (var i = 0; i < keys2.length; i++) {
          var key2 = keys2[i];
          if (!hasOwn$b(target, key2) && !(exceptions && hasOwn$b(exceptions, key2))) {
            defineProperty2(target, key2, getOwnPropertyDescriptor2(source, key2));
          }
        }
      };
      var fails$v = fails$D;
      var isCallable$d = isCallable$n;
      var replacement = /#|\.prototype\./;
      var isForced$2 = function(feature, detection) {
        var value = data[normalize(feature)];
        return value == POLYFILL ? true : value == NATIVE ? false : isCallable$d(detection) ? fails$v(detection) : !!detection;
      };
      var normalize = isForced$2.normalize = function(string) {
        return String(string).replace(replacement, ".").toLowerCase();
      };
      var data = isForced$2.data = {};
      var NATIVE = isForced$2.NATIVE = "N";
      var POLYFILL = isForced$2.POLYFILL = "P";
      var isForced_1 = isForced$2;
      var global$l = global$u;
      var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
      var createNonEnumerableProperty$7 = createNonEnumerableProperty$9;
      var defineBuiltIn$b = defineBuiltIn$c;
      var defineGlobalProperty = defineGlobalProperty$3;
      var copyConstructorProperties$1 = copyConstructorProperties$2;
      var isForced$1 = isForced_1;
      var _export = function(options, source) {
        var TARGET = options.target;
        var GLOBAL = options.global;
        var STATIC = options.stat;
        var FORCED2, target, key2, targetProperty, sourceProperty, descriptor;
        if (GLOBAL) {
          target = global$l;
        } else if (STATIC) {
          target = global$l[TARGET] || defineGlobalProperty(TARGET, {});
        } else {
          target = (global$l[TARGET] || {}).prototype;
        }
        if (target)
          for (key2 in source) {
            sourceProperty = source[key2];
            if (options.dontCallGetSet) {
              descriptor = getOwnPropertyDescriptor$1(target, key2);
              targetProperty = descriptor && descriptor.value;
            } else
              targetProperty = target[key2];
            FORCED2 = isForced$1(GLOBAL ? key2 : TARGET + (STATIC ? "." : "#") + key2, options.forced);
            if (!FORCED2 && targetProperty !== void 0) {
              if (typeof sourceProperty == typeof targetProperty)
                continue;
              copyConstructorProperties$1(sourceProperty, targetProperty);
            }
            if (options.sham || targetProperty && targetProperty.sham) {
              createNonEnumerableProperty$7(sourceProperty, "sham", true);
            }
            defineBuiltIn$b(target, key2, sourceProperty, options);
          }
      };
      var objectDefineProperties = {};
      var internalObjectKeys = objectKeysInternal;
      var enumBugKeys$1 = enumBugKeys$3;
      var objectKeys$2 = Object.keys || function keys2(O) {
        return internalObjectKeys(O, enumBugKeys$1);
      };
      var DESCRIPTORS$b = descriptors;
      var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
      var definePropertyModule$4 = objectDefineProperty;
      var anObject$d = anObject$g;
      var toIndexedObject$6 = toIndexedObject$a;
      var objectKeys$1 = objectKeys$2;
      objectDefineProperties.f = DESCRIPTORS$b && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties2(O, Properties) {
        anObject$d(O);
        var props = toIndexedObject$6(Properties);
        var keys2 = objectKeys$1(Properties);
        var length = keys2.length;
        var index2 = 0;
        var key2;
        while (length > index2)
          definePropertyModule$4.f(O, key2 = keys2[index2++], props[key2]);
        return O;
      };
      var $$p = _export;
      var DESCRIPTORS$a = descriptors;
      var defineProperties = objectDefineProperties.f;
      $$p({
        target: "Object",
        stat: true,
        forced: Object.defineProperties !== defineProperties,
        sham: !DESCRIPTORS$a
      }, {
        defineProperties
      });
      var classof$d = classofRaw$1;
      var isArray$5 = Array.isArray || function isArray2(argument) {
        return classof$d(argument) == "Array";
      };
      var $$o = _export;
      var isArray$4 = isArray$5;
      $$o({
        target: "Array",
        stat: true
      }, {
        isArray: isArray$4
      });
      var wellKnownSymbol$o = wellKnownSymbol$q;
      var TO_STRING_TAG$3 = wellKnownSymbol$o("toStringTag");
      var test = {};
      test[TO_STRING_TAG$3] = "z";
      var toStringTagSupport = String(test) === "[object z]";
      var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
      var isCallable$c = isCallable$n;
      var classofRaw = classofRaw$1;
      var wellKnownSymbol$n = wellKnownSymbol$q;
      var TO_STRING_TAG$2 = wellKnownSymbol$n("toStringTag");
      var $Object$1 = Object;
      var CORRECT_ARGUMENTS = classofRaw(function() {
        return arguments;
      }()) == "Arguments";
      var tryGet = function(it, key2) {
        try {
          return it[key2];
        } catch (error) {
        }
      };
      var classof$c = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function(it) {
        var O, tag, result;
        return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = $Object$1(it), TO_STRING_TAG$2)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) == "Object" && isCallable$c(O.callee) ? "Arguments" : result;
      };
      var classof$b = classof$c;
      var $String$1 = String;
      var toString$e = function(argument) {
        if (classof$b(argument) === "Symbol")
          throw TypeError("Cannot convert a Symbol value to a string");
        return $String$1(argument);
      };
      var anObject$c = anObject$g;
      var regexpFlags$1 = function() {
        var that = anObject$c(this);
        var result = "";
        if (that.hasIndices)
          result += "d";
        if (that.global)
          result += "g";
        if (that.ignoreCase)
          result += "i";
        if (that.multiline)
          result += "m";
        if (that.dotAll)
          result += "s";
        if (that.unicode)
          result += "u";
        if (that.unicodeSets)
          result += "v";
        if (that.sticky)
          result += "y";
        return result;
      };
      var fails$u = fails$D;
      var global$k = global$u;
      var $RegExp$2 = global$k.RegExp;
      var UNSUPPORTED_Y$3 = fails$u(function() {
        var re = $RegExp$2("a", "y");
        re.lastIndex = 2;
        return re.exec("abcd") != null;
      });
      var MISSED_STICKY$2 = UNSUPPORTED_Y$3 || fails$u(function() {
        return !$RegExp$2("a", "y").sticky;
      });
      var BROKEN_CARET = UNSUPPORTED_Y$3 || fails$u(function() {
        var re = $RegExp$2("^r", "gy");
        re.lastIndex = 2;
        return re.exec("str") != null;
      });
      var regexpStickyHelpers = {
        BROKEN_CARET,
        MISSED_STICKY: MISSED_STICKY$2,
        UNSUPPORTED_Y: UNSUPPORTED_Y$3
      };
      var getBuiltIn$5 = getBuiltIn$9;
      var html$1 = getBuiltIn$5("document", "documentElement");
      var anObject$b = anObject$g;
      var definePropertiesModule$1 = objectDefineProperties;
      var enumBugKeys = enumBugKeys$3;
      var hiddenKeys$1 = hiddenKeys$5;
      var html = html$1;
      var documentCreateElement$1 = documentCreateElement$2;
      var sharedKey$2 = sharedKey$4;
      var GT = ">";
      var LT = "<";
      var PROTOTYPE$2 = "prototype";
      var SCRIPT = "script";
      var IE_PROTO$1 = sharedKey$2("IE_PROTO");
      var EmptyConstructor = function() {
      };
      var scriptTag = function(content) {
        return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
      };
      var NullProtoObjectViaActiveX = function(activeXDocument2) {
        activeXDocument2.write(scriptTag(""));
        activeXDocument2.close();
        var temp = activeXDocument2.parentWindow.Object;
        activeXDocument2 = null;
        return temp;
      };
      var NullProtoObjectViaIFrame = function() {
        var iframe = documentCreateElement$1("iframe");
        var JS = "java" + SCRIPT + ":";
        var iframeDocument;
        iframe.style.display = "none";
        html.appendChild(iframe);
        iframe.src = String(JS);
        iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(scriptTag("document.F=Object"));
        iframeDocument.close();
        return iframeDocument.F;
      };
      var activeXDocument;
      var NullProtoObject = function() {
        try {
          activeXDocument = new ActiveXObject("htmlfile");
        } catch (error) {
        }
        NullProtoObject = typeof document != "undefined" ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument);
        var length = enumBugKeys.length;
        while (length--)
          delete NullProtoObject[PROTOTYPE$2][enumBugKeys[length]];
        return NullProtoObject();
      };
      hiddenKeys$1[IE_PROTO$1] = true;
      var objectCreate = Object.create || function create2(O, Properties) {
        var result;
        if (O !== null) {
          EmptyConstructor[PROTOTYPE$2] = anObject$b(O);
          result = new EmptyConstructor();
          EmptyConstructor[PROTOTYPE$2] = null;
          result[IE_PROTO$1] = O;
        } else
          result = NullProtoObject();
        return Properties === void 0 ? result : definePropertiesModule$1.f(result, Properties);
      };
      var fails$t = fails$D;
      var global$j = global$u;
      var $RegExp$1 = global$j.RegExp;
      var regexpUnsupportedDotAll = fails$t(function() {
        var re = $RegExp$1(".", "s");
        return !(re.dotAll && re.exec("\n") && re.flags === "s");
      });
      var fails$s = fails$D;
      var global$i = global$u;
      var $RegExp = global$i.RegExp;
      var regexpUnsupportedNcg = fails$s(function() {
        var re = $RegExp("(?<a>b)", "g");
        return re.exec("b").groups.a !== "b" || "b".replace(re, "$<a>c") !== "bc";
      });
      var call$g = functionCall;
      var uncurryThis$t = functionUncurryThis;
      var toString$d = toString$e;
      var regexpFlags = regexpFlags$1;
      var stickyHelpers$2 = regexpStickyHelpers;
      var shared$3 = shared$7.exports;
      var create$3 = objectCreate;
      var getInternalState$6 = internalState.get;
      var UNSUPPORTED_DOT_ALL$1 = regexpUnsupportedDotAll;
      var UNSUPPORTED_NCG$1 = regexpUnsupportedNcg;
      var nativeReplace = shared$3("native-string-replace", String.prototype.replace);
      var nativeExec = RegExp.prototype.exec;
      var patchedExec = nativeExec;
      var charAt$5 = uncurryThis$t("".charAt);
      var indexOf = uncurryThis$t("".indexOf);
      var replace$5 = uncurryThis$t("".replace);
      var stringSlice$6 = uncurryThis$t("".slice);
      var UPDATES_LAST_INDEX_WRONG = function() {
        var re12 = /a/;
        var re22 = /b*/g;
        call$g(nativeExec, re12, "a");
        call$g(nativeExec, re22, "a");
        return re12.lastIndex !== 0 || re22.lastIndex !== 0;
      }();
      var UNSUPPORTED_Y$2 = stickyHelpers$2.BROKEN_CARET;
      var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
      var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2 || UNSUPPORTED_DOT_ALL$1 || UNSUPPORTED_NCG$1;
      if (PATCH) {
        patchedExec = function exec2(string) {
          var re = this;
          var state = getInternalState$6(re);
          var str = toString$d(string);
          var raw = state.raw;
          var result, reCopy, lastIndex, match2, i, object, group;
          if (raw) {
            raw.lastIndex = re.lastIndex;
            result = call$g(patchedExec, raw, str);
            re.lastIndex = raw.lastIndex;
            return result;
          }
          var groups = state.groups;
          var sticky = UNSUPPORTED_Y$2 && re.sticky;
          var flags = call$g(regexpFlags, re);
          var source = re.source;
          var charsAdded = 0;
          var strCopy = str;
          if (sticky) {
            flags = replace$5(flags, "y", "");
            if (indexOf(flags, "g") === -1) {
              flags += "g";
            }
            strCopy = stringSlice$6(str, re.lastIndex);
            if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$5(str, re.lastIndex - 1) !== "\n")) {
              source = "(?: " + source + ")";
              strCopy = " " + strCopy;
              charsAdded++;
            }
            reCopy = new RegExp("^(?:" + source + ")", flags);
          }
          if (NPCG_INCLUDED) {
            reCopy = new RegExp("^" + source + "$(?!\\s)", flags);
          }
          if (UPDATES_LAST_INDEX_WRONG)
            lastIndex = re.lastIndex;
          match2 = call$g(nativeExec, sticky ? reCopy : re, strCopy);
          if (sticky) {
            if (match2) {
              match2.input = stringSlice$6(match2.input, charsAdded);
              match2[0] = stringSlice$6(match2[0], charsAdded);
              match2.index = re.lastIndex;
              re.lastIndex += match2[0].length;
            } else
              re.lastIndex = 0;
          } else if (UPDATES_LAST_INDEX_WRONG && match2) {
            re.lastIndex = re.global ? match2.index + match2[0].length : lastIndex;
          }
          if (NPCG_INCLUDED && match2 && match2.length > 1) {
            call$g(nativeReplace, match2[0], reCopy, function() {
              for (i = 1; i < arguments.length - 2; i++) {
                if (arguments[i] === void 0)
                  match2[i] = void 0;
              }
            });
          }
          if (match2 && groups) {
            match2.groups = object = create$3(null);
            for (i = 0; i < groups.length; i++) {
              group = groups[i];
              object[group[0]] = match2[group[1]];
            }
          }
          return match2;
        };
      }
      var regexpExec$3 = patchedExec;
      var $$n = _export;
      var exec$5 = regexpExec$3;
      $$n({
        target: "RegExp",
        proto: true,
        forced: /./.exec !== exec$5
      }, {
        exec: exec$5
      });
      var NATIVE_BIND$1 = functionBindNative;
      var FunctionPrototype = Function.prototype;
      var apply$6 = FunctionPrototype.apply;
      var call$f = FunctionPrototype.call;
      var functionApply = typeof Reflect == "object" && Reflect.apply || (NATIVE_BIND$1 ? call$f.bind(apply$6) : function() {
        return call$f.apply(apply$6, arguments);
      });
      var uncurryThis$s = functionUncurryThis;
      var defineBuiltIn$a = defineBuiltIn$c;
      var regexpExec$2 = regexpExec$3;
      var fails$r = fails$D;
      var wellKnownSymbol$m = wellKnownSymbol$q;
      var createNonEnumerableProperty$6 = createNonEnumerableProperty$9;
      var SPECIES$5 = wellKnownSymbol$m("species");
      var RegExpPrototype$5 = RegExp.prototype;
      var fixRegexpWellKnownSymbolLogic = function(KEY, exec2, FORCED2, SHAM) {
        var SYMBOL2 = wellKnownSymbol$m(KEY);
        var DELEGATES_TO_SYMBOL = !fails$r(function() {
          var O = {};
          O[SYMBOL2] = function() {
            return 7;
          };
          return ""[KEY](O) != 7;
        });
        var DELEGATES_TO_EXEC2 = DELEGATES_TO_SYMBOL && !fails$r(function() {
          var execCalled = false;
          var re = /a/;
          if (KEY === "split") {
            re = {};
            re.constructor = {};
            re.constructor[SPECIES$5] = function() {
              return re;
            };
            re.flags = "";
            re[SYMBOL2] = /./[SYMBOL2];
          }
          re.exec = function() {
            execCalled = true;
            return null;
          };
          re[SYMBOL2]("");
          return !execCalled;
        });
        if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC2 || FORCED2) {
          var uncurriedNativeRegExpMethod = uncurryThis$s(/./[SYMBOL2]);
          var methods = exec2(SYMBOL2, ""[KEY], function(nativeMethod, regexp2, str, arg2, forceStringMethod) {
            var uncurriedNativeMethod = uncurryThis$s(nativeMethod);
            var $exec = regexp2.exec;
            if ($exec === regexpExec$2 || $exec === RegExpPrototype$5.exec) {
              if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                return {
                  done: true,
                  value: uncurriedNativeRegExpMethod(regexp2, str, arg2)
                };
              }
              return {
                done: true,
                value: uncurriedNativeMethod(str, regexp2, arg2)
              };
            }
            return {
              done: false
            };
          });
          defineBuiltIn$a(String.prototype, KEY, methods[0]);
          defineBuiltIn$a(RegExpPrototype$5, SYMBOL2, methods[1]);
        }
        if (SHAM)
          createNonEnumerableProperty$6(RegExpPrototype$5[SYMBOL2], "sham", true);
      };
      var isObject$9 = isObject$f;
      var classof$a = classofRaw$1;
      var wellKnownSymbol$l = wellKnownSymbol$q;
      var MATCH$2 = wellKnownSymbol$l("match");
      var isRegexp = function(it) {
        var isRegExp2;
        return isObject$9(it) && ((isRegExp2 = it[MATCH$2]) !== void 0 ? !!isRegExp2 : classof$a(it) == "RegExp");
      };
      var uncurryThis$r = functionUncurryThis;
      var fails$q = fails$D;
      var isCallable$b = isCallable$n;
      var classof$9 = classof$c;
      var getBuiltIn$4 = getBuiltIn$9;
      var inspectSource = inspectSource$2;
      var noop = function() {
      };
      var empty = [];
      var construct = getBuiltIn$4("Reflect", "construct");
      var constructorRegExp = /^\s*(?:class|function)\b/;
      var exec$4 = uncurryThis$r(constructorRegExp.exec);
      var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);
      var isConstructorModern = function isConstructor2(argument) {
        if (!isCallable$b(argument))
          return false;
        try {
          construct(noop, empty, argument);
          return true;
        } catch (error) {
          return false;
        }
      };
      var isConstructorLegacy = function isConstructor2(argument) {
        if (!isCallable$b(argument))
          return false;
        switch (classof$9(argument)) {
          case "AsyncFunction":
          case "GeneratorFunction":
          case "AsyncGeneratorFunction":
            return false;
        }
        try {
          return INCORRECT_TO_STRING || !!exec$4(constructorRegExp, inspectSource(argument));
        } catch (error) {
          return true;
        }
      };
      isConstructorLegacy.sham = true;
      var isConstructor$3 = !construct || fails$q(function() {
        var called2;
        return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function() {
          called2 = true;
        }) || called2;
      }) ? isConstructorLegacy : isConstructorModern;
      var isConstructor$2 = isConstructor$3;
      var tryToString$4 = tryToString$6;
      var $TypeError$a = TypeError;
      var aConstructor$2 = function(argument) {
        if (isConstructor$2(argument))
          return argument;
        throw $TypeError$a(tryToString$4(argument) + " is not a constructor");
      };
      var anObject$a = anObject$g;
      var aConstructor$1 = aConstructor$2;
      var isNullOrUndefined$4 = isNullOrUndefined$7;
      var wellKnownSymbol$k = wellKnownSymbol$q;
      var SPECIES$4 = wellKnownSymbol$k("species");
      var speciesConstructor$3 = function(O, defaultConstructor) {
        var C = anObject$a(O).constructor;
        var S;
        return C === void 0 || isNullOrUndefined$4(S = anObject$a(C)[SPECIES$4]) ? defaultConstructor : aConstructor$1(S);
      };
      var uncurryThis$q = functionUncurryThis;
      var toIntegerOrInfinity$5 = toIntegerOrInfinity$8;
      var toString$c = toString$e;
      var requireObjectCoercible$6 = requireObjectCoercible$9;
      var charAt$4 = uncurryThis$q("".charAt);
      var charCodeAt$1 = uncurryThis$q("".charCodeAt);
      var stringSlice$5 = uncurryThis$q("".slice);
      var createMethod$3 = function(CONVERT_TO_STRING) {
        return function($this, pos) {
          var S = toString$c(requireObjectCoercible$6($this));
          var position = toIntegerOrInfinity$5(pos);
          var size = S.length;
          var first, second2;
          if (position < 0 || position >= size)
            return CONVERT_TO_STRING ? "" : void 0;
          first = charCodeAt$1(S, position);
          return first < 55296 || first > 56319 || position + 1 === size || (second2 = charCodeAt$1(S, position + 1)) < 56320 || second2 > 57343 ? CONVERT_TO_STRING ? charAt$4(S, position) : first : CONVERT_TO_STRING ? stringSlice$5(S, position, position + 2) : (first - 55296 << 10) + (second2 - 56320) + 65536;
        };
      };
      var stringMultibyte = {
        // `String.prototype.codePointAt` method
        // https://tc39.es/ecma262/#sec-string.prototype.codepointat
        codeAt: createMethod$3(false),
        // `String.prototype.at` method
        // https://github.com/mathiasbynens/String.prototype.at
        charAt: createMethod$3(true)
      };
      var charAt$3 = stringMultibyte.charAt;
      var advanceStringIndex$3 = function(S, index2, unicode) {
        return index2 + (unicode ? charAt$3(S, index2).length : 1);
      };
      var toPropertyKey$2 = toPropertyKey$5;
      var definePropertyModule$3 = objectDefineProperty;
      var createPropertyDescriptor$3 = createPropertyDescriptor$6;
      var createProperty$3 = function(object, key2, value) {
        var propertyKey = toPropertyKey$2(key2);
        if (propertyKey in object)
          definePropertyModule$3.f(object, propertyKey, createPropertyDescriptor$3(0, value));
        else
          object[propertyKey] = value;
      };
      var toAbsoluteIndex$5 = toAbsoluteIndex$7;
      var lengthOfArrayLike$a = lengthOfArrayLike$c;
      var createProperty$2 = createProperty$3;
      var $Array$3 = Array;
      var max$2 = Math.max;
      var arraySliceSimple = function(O, start, end) {
        var length = lengthOfArrayLike$a(O);
        var k = toAbsoluteIndex$5(start, length);
        var fin = toAbsoluteIndex$5(end === void 0 ? length : end, length);
        var result = $Array$3(max$2(fin - k, 0));
        for (var n = 0; k < fin; k++, n++)
          createProperty$2(result, n, O[k]);
        result.length = n;
        return result;
      };
      var call$e = functionCall;
      var anObject$9 = anObject$g;
      var isCallable$a = isCallable$n;
      var classof$8 = classofRaw$1;
      var regexpExec$1 = regexpExec$3;
      var $TypeError$9 = TypeError;
      var regexpExecAbstract = function(R, S) {
        var exec2 = R.exec;
        if (isCallable$a(exec2)) {
          var result = call$e(exec2, R, S);
          if (result !== null)
            anObject$9(result);
          return result;
        }
        if (classof$8(R) === "RegExp")
          return call$e(regexpExec$1, R, S);
        throw $TypeError$9("RegExp#exec called on incompatible receiver");
      };
      var apply$5 = functionApply;
      var call$d = functionCall;
      var uncurryThis$p = functionUncurryThis;
      var fixRegExpWellKnownSymbolLogic$2 = fixRegexpWellKnownSymbolLogic;
      var anObject$8 = anObject$g;
      var isNullOrUndefined$3 = isNullOrUndefined$7;
      var isRegExp$2 = isRegexp;
      var requireObjectCoercible$5 = requireObjectCoercible$9;
      var speciesConstructor$2 = speciesConstructor$3;
      var advanceStringIndex$2 = advanceStringIndex$3;
      var toLength$8 = toLength$a;
      var toString$b = toString$e;
      var getMethod$3 = getMethod$5;
      var arraySlice$7 = arraySliceSimple;
      var callRegExpExec = regexpExecAbstract;
      var regexpExec = regexpExec$3;
      var stickyHelpers$1 = regexpStickyHelpers;
      var fails$p = fails$D;
      var UNSUPPORTED_Y$1 = stickyHelpers$1.UNSUPPORTED_Y;
      var MAX_UINT32 = 4294967295;
      var min$4 = Math.min;
      var $push = [].push;
      var exec$3 = uncurryThis$p(/./.exec);
      var push$3 = uncurryThis$p($push);
      var stringSlice$4 = uncurryThis$p("".slice);
      var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$p(function() {
        var re = /(?:)/;
        var originalExec = re.exec;
        re.exec = function() {
          return originalExec.apply(this, arguments);
        };
        var result = "ab".split(re);
        return result.length !== 2 || result[0] !== "a" || result[1] !== "b";
      });
      fixRegExpWellKnownSymbolLogic$2("split", function(SPLIT, nativeSplit, maybeCallNative) {
        var internalSplit;
        if ("abbc".split(/(b)*/)[1] == "c" || // eslint-disable-next-line regexp/no-empty-group -- required for testing
        "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
        ".".split(/()()/).length > 1 || "".split(/.?/).length) {
          internalSplit = function(separator, limit) {
            var string = toString$b(requireObjectCoercible$5(this));
            var lim = limit === void 0 ? MAX_UINT32 : limit >>> 0;
            if (lim === 0)
              return [];
            if (separator === void 0)
              return [string];
            if (!isRegExp$2(separator)) {
              return call$d(nativeSplit, string, separator, lim);
            }
            var output = [];
            var flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.unicode ? "u" : "") + (separator.sticky ? "y" : "");
            var lastLastIndex = 0;
            var separatorCopy = new RegExp(separator.source, flags + "g");
            var match2, lastIndex, lastLength;
            while (match2 = call$d(regexpExec, separatorCopy, string)) {
              lastIndex = separatorCopy.lastIndex;
              if (lastIndex > lastLastIndex) {
                push$3(output, stringSlice$4(string, lastLastIndex, match2.index));
                if (match2.length > 1 && match2.index < string.length)
                  apply$5($push, output, arraySlice$7(match2, 1));
                lastLength = match2[0].length;
                lastLastIndex = lastIndex;
                if (output.length >= lim)
                  break;
              }
              if (separatorCopy.lastIndex === match2.index)
                separatorCopy.lastIndex++;
            }
            if (lastLastIndex === string.length) {
              if (lastLength || !exec$3(separatorCopy, ""))
                push$3(output, "");
            } else
              push$3(output, stringSlice$4(string, lastLastIndex));
            return output.length > lim ? arraySlice$7(output, 0, lim) : output;
          };
        } else if ("0".split(void 0, 0).length) {
          internalSplit = function(separator, limit) {
            return separator === void 0 && limit === 0 ? [] : call$d(nativeSplit, this, separator, limit);
          };
        } else
          internalSplit = nativeSplit;
        return [
          // `String.prototype.split` method
          // https://tc39.es/ecma262/#sec-string.prototype.split
          function split2(separator, limit) {
            var O = requireObjectCoercible$5(this);
            var splitter = isNullOrUndefined$3(separator) ? void 0 : getMethod$3(separator, SPLIT);
            return splitter ? call$d(splitter, separator, O, limit) : call$d(internalSplit, toString$b(O), separator, limit);
          },
          // `RegExp.prototype[@@split]` method
          // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
          //
          // NOTE: This cannot be properly polyfilled in engines that don't support
          // the 'y' flag.
          function(string, limit) {
            var rx = anObject$8(this);
            var S = toString$b(string);
            var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
            if (res.done)
              return res.value;
            var C = speciesConstructor$2(rx, RegExp);
            var unicodeMatching = rx.unicode;
            var flags = (rx.ignoreCase ? "i" : "") + (rx.multiline ? "m" : "") + (rx.unicode ? "u" : "") + (UNSUPPORTED_Y$1 ? "g" : "y");
            var splitter = new C(UNSUPPORTED_Y$1 ? "^(?:" + rx.source + ")" : rx, flags);
            var lim = limit === void 0 ? MAX_UINT32 : limit >>> 0;
            if (lim === 0)
              return [];
            if (S.length === 0)
              return callRegExpExec(splitter, S) === null ? [S] : [];
            var p = 0;
            var q = 0;
            var A = [];
            while (q < S.length) {
              splitter.lastIndex = UNSUPPORTED_Y$1 ? 0 : q;
              var z = callRegExpExec(splitter, UNSUPPORTED_Y$1 ? stringSlice$4(S, q) : S);
              var e;
              if (z === null || (e = min$4(toLength$8(splitter.lastIndex + (UNSUPPORTED_Y$1 ? q : 0)), S.length)) === p) {
                q = advanceStringIndex$2(S, q, unicodeMatching);
              } else {
                push$3(A, stringSlice$4(S, p, q));
                if (A.length === lim)
                  return A;
                for (var i = 1; i <= z.length - 1; i++) {
                  push$3(A, z[i]);
                  if (A.length === lim)
                    return A;
                }
                q = p = e;
              }
            }
            push$3(A, stringSlice$4(S, p));
            return A;
          }
        ];
      }, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y$1);
      var wellKnownSymbol$j = wellKnownSymbol$q;
      var create$2 = objectCreate;
      var defineProperty$8 = objectDefineProperty.f;
      var UNSCOPABLES = wellKnownSymbol$j("unscopables");
      var ArrayPrototype$1 = Array.prototype;
      if (ArrayPrototype$1[UNSCOPABLES] == void 0) {
        defineProperty$8(ArrayPrototype$1, UNSCOPABLES, {
          configurable: true,
          value: create$2(null)
        });
      }
      var addToUnscopables$2 = function(key2) {
        ArrayPrototype$1[UNSCOPABLES][key2] = true;
      };
      var iterators = {};
      var fails$o = fails$D;
      var correctPrototypeGetter = !fails$o(function() {
        function F() {
        }
        F.prototype.constructor = null;
        return Object.getPrototypeOf(new F()) !== F.prototype;
      });
      var hasOwn$a = hasOwnProperty_1;
      var isCallable$9 = isCallable$n;
      var toObject$9 = toObject$b;
      var sharedKey$1 = sharedKey$4;
      var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;
      var IE_PROTO = sharedKey$1("IE_PROTO");
      var $Object = Object;
      var ObjectPrototype$3 = $Object.prototype;
      var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function(O) {
        var object = toObject$9(O);
        if (hasOwn$a(object, IE_PROTO))
          return object[IE_PROTO];
        var constructor = object.constructor;
        if (isCallable$9(constructor) && object instanceof constructor) {
          return constructor.prototype;
        }
        return object instanceof $Object ? ObjectPrototype$3 : null;
      };
      var fails$n = fails$D;
      var isCallable$8 = isCallable$n;
      var isObject$8 = isObject$f;
      var getPrototypeOf$3 = objectGetPrototypeOf;
      var defineBuiltIn$9 = defineBuiltIn$c;
      var wellKnownSymbol$i = wellKnownSymbol$q;
      var ITERATOR$6 = wellKnownSymbol$i("iterator");
      var BUGGY_SAFARI_ITERATORS$1 = false;
      var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;
      if ([].keys) {
        arrayIterator = [].keys();
        if (!("next" in arrayIterator))
          BUGGY_SAFARI_ITERATORS$1 = true;
        else {
          PrototypeOfArrayIteratorPrototype = getPrototypeOf$3(getPrototypeOf$3(arrayIterator));
          if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
            IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
        }
      }
      var NEW_ITERATOR_PROTOTYPE = !isObject$8(IteratorPrototype$2) || fails$n(function() {
        var test2 = {};
        return IteratorPrototype$2[ITERATOR$6].call(test2) !== test2;
      });
      if (NEW_ITERATOR_PROTOTYPE)
        IteratorPrototype$2 = {};
      if (!isCallable$8(IteratorPrototype$2[ITERATOR$6])) {
        defineBuiltIn$9(IteratorPrototype$2, ITERATOR$6, function() {
          return this;
        });
      }
      var iteratorsCore = {
        IteratorPrototype: IteratorPrototype$2,
        BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
      };
      var defineProperty$7 = objectDefineProperty.f;
      var hasOwn$9 = hasOwnProperty_1;
      var wellKnownSymbol$h = wellKnownSymbol$q;
      var TO_STRING_TAG$1 = wellKnownSymbol$h("toStringTag");
      var setToStringTag$4 = function(target, TAG, STATIC) {
        if (target && !STATIC)
          target = target.prototype;
        if (target && !hasOwn$9(target, TO_STRING_TAG$1)) {
          defineProperty$7(target, TO_STRING_TAG$1, {
            configurable: true,
            value: TAG
          });
        }
      };
      var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
      var create$1 = objectCreate;
      var createPropertyDescriptor$2 = createPropertyDescriptor$6;
      var setToStringTag$3 = setToStringTag$4;
      var Iterators$4 = iterators;
      var returnThis$1 = function() {
        return this;
      };
      var iteratorCreateConstructor = function(IteratorConstructor, NAME2, next, ENUMERABLE_NEXT) {
        var TO_STRING_TAG2 = NAME2 + " Iterator";
        IteratorConstructor.prototype = create$1(IteratorPrototype$1, {
          next: createPropertyDescriptor$2(+!ENUMERABLE_NEXT, next)
        });
        setToStringTag$3(IteratorConstructor, TO_STRING_TAG2, false);
        Iterators$4[TO_STRING_TAG2] = returnThis$1;
        return IteratorConstructor;
      };
      var isCallable$7 = isCallable$n;
      var $String = String;
      var $TypeError$8 = TypeError;
      var aPossiblePrototype$1 = function(argument) {
        if (typeof argument == "object" || isCallable$7(argument))
          return argument;
        throw $TypeError$8("Can't set " + $String(argument) + " as a prototype");
      };
      var uncurryThis$o = functionUncurryThis;
      var anObject$7 = anObject$g;
      var aPossiblePrototype = aPossiblePrototype$1;
      var objectSetPrototypeOf = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var CORRECT_SETTER = false;
        var test2 = {};
        var setter;
        try {
          setter = uncurryThis$o(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set);
          setter(test2, []);
          CORRECT_SETTER = test2 instanceof Array;
        } catch (error) {
        }
        return function setPrototypeOf2(O, proto) {
          anObject$7(O);
          aPossiblePrototype(proto);
          if (CORRECT_SETTER)
            setter(O, proto);
          else
            O.__proto__ = proto;
          return O;
        };
      }() : void 0);
      var $$m = _export;
      var call$c = functionCall;
      var FunctionName$1 = functionName;
      var isCallable$6 = isCallable$n;
      var createIteratorConstructor = iteratorCreateConstructor;
      var getPrototypeOf$2 = objectGetPrototypeOf;
      var setPrototypeOf$4 = objectSetPrototypeOf;
      var setToStringTag$2 = setToStringTag$4;
      var createNonEnumerableProperty$5 = createNonEnumerableProperty$9;
      var defineBuiltIn$8 = defineBuiltIn$c;
      var wellKnownSymbol$g = wellKnownSymbol$q;
      var Iterators$3 = iterators;
      var IteratorsCore = iteratorsCore;
      var PROPER_FUNCTION_NAME$2 = FunctionName$1.PROPER;
      var CONFIGURABLE_FUNCTION_NAME$1 = FunctionName$1.CONFIGURABLE;
      var IteratorPrototype = IteratorsCore.IteratorPrototype;
      var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
      var ITERATOR$5 = wellKnownSymbol$g("iterator");
      var KEYS = "keys";
      var VALUES = "values";
      var ENTRIES = "entries";
      var returnThis = function() {
        return this;
      };
      var iteratorDefine = function(Iterable, NAME2, IteratorConstructor, next, DEFAULT, IS_SET, FORCED2) {
        createIteratorConstructor(IteratorConstructor, NAME2, next);
        var getIterationMethod = function(KIND) {
          if (KIND === DEFAULT && defaultIterator)
            return defaultIterator;
          if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype)
            return IterablePrototype[KIND];
          switch (KIND) {
            case KEYS:
              return function keys2() {
                return new IteratorConstructor(this, KIND);
              };
            case VALUES:
              return function values2() {
                return new IteratorConstructor(this, KIND);
              };
            case ENTRIES:
              return function entries() {
                return new IteratorConstructor(this, KIND);
              };
          }
          return function() {
            return new IteratorConstructor(this);
          };
        };
        var TO_STRING_TAG2 = NAME2 + " Iterator";
        var INCORRECT_VALUES_NAME = false;
        var IterablePrototype = Iterable.prototype;
        var nativeIterator = IterablePrototype[ITERATOR$5] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
        var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
        var anyNativeIterator = NAME2 == "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
        var CurrentIteratorPrototype, methods, KEY;
        if (anyNativeIterator) {
          CurrentIteratorPrototype = getPrototypeOf$2(anyNativeIterator.call(new Iterable()));
          if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
            if (getPrototypeOf$2(CurrentIteratorPrototype) !== IteratorPrototype) {
              if (setPrototypeOf$4) {
                setPrototypeOf$4(CurrentIteratorPrototype, IteratorPrototype);
              } else if (!isCallable$6(CurrentIteratorPrototype[ITERATOR$5])) {
                defineBuiltIn$8(CurrentIteratorPrototype, ITERATOR$5, returnThis);
              }
            }
            setToStringTag$2(CurrentIteratorPrototype, TO_STRING_TAG2, true);
          }
        }
        if (PROPER_FUNCTION_NAME$2 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
          if (CONFIGURABLE_FUNCTION_NAME$1) {
            createNonEnumerableProperty$5(IterablePrototype, "name", VALUES);
          } else {
            INCORRECT_VALUES_NAME = true;
            defaultIterator = function values2() {
              return call$c(nativeIterator, this);
            };
          }
        }
        if (DEFAULT) {
          methods = {
            values: getIterationMethod(VALUES),
            keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
            entries: getIterationMethod(ENTRIES)
          };
          if (FORCED2)
            for (KEY in methods) {
              if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
                defineBuiltIn$8(IterablePrototype, KEY, methods[KEY]);
              }
            }
          else
            $$m({
              target: NAME2,
              proto: true,
              forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
            }, methods);
        }
        if (IterablePrototype[ITERATOR$5] !== defaultIterator) {
          defineBuiltIn$8(IterablePrototype, ITERATOR$5, defaultIterator, {
            name: DEFAULT
          });
        }
        Iterators$3[NAME2] = defaultIterator;
        return methods;
      };
      var createIterResultObject$1 = function(value, done) {
        return {
          value,
          done
        };
      };
      var toIndexedObject$5 = toIndexedObject$a;
      var addToUnscopables$1 = addToUnscopables$2;
      var Iterators$2 = iterators;
      var InternalStateModule$4 = internalState;
      var defineProperty$6 = objectDefineProperty.f;
      var defineIterator = iteratorDefine;
      var createIterResultObject = createIterResultObject$1;
      var DESCRIPTORS$9 = descriptors;
      var ARRAY_ITERATOR = "Array Iterator";
      var setInternalState$3 = InternalStateModule$4.set;
      var getInternalState$5 = InternalStateModule$4.getterFor(ARRAY_ITERATOR);
      var es_array_iterator = defineIterator(Array, "Array", function(iterated, kind) {
        setInternalState$3(this, {
          type: ARRAY_ITERATOR,
          target: toIndexedObject$5(iterated),
          // target
          index: 0,
          // next index
          kind
          // kind
        });
      }, function() {
        var state = getInternalState$5(this);
        var target = state.target;
        var kind = state.kind;
        var index2 = state.index++;
        if (!target || index2 >= target.length) {
          state.target = void 0;
          return createIterResultObject(void 0, true);
        }
        if (kind == "keys")
          return createIterResultObject(index2, false);
        if (kind == "values")
          return createIterResultObject(target[index2], false);
        return createIterResultObject([index2, target[index2]], false);
      }, "values");
      var values = Iterators$2.Arguments = Iterators$2.Array;
      addToUnscopables$1("keys");
      addToUnscopables$1("values");
      addToUnscopables$1("entries");
      if (DESCRIPTORS$9 && values.name !== "values")
        try {
          defineProperty$6(values, "name", {
            value: "values"
          });
        } catch (error) {
        }
      var arrayBufferBasicDetection = typeof ArrayBuffer != "undefined" && typeof DataView != "undefined";
      var defineBuiltIn$7 = defineBuiltIn$c;
      var defineBuiltIns$1 = function(target, src, options) {
        for (var key2 in src)
          defineBuiltIn$7(target, key2, src[key2], options);
        return target;
      };
      var isPrototypeOf$6 = objectIsPrototypeOf;
      var $TypeError$7 = TypeError;
      var anInstance$2 = function(it, Prototype2) {
        if (isPrototypeOf$6(Prototype2, it))
          return it;
        throw $TypeError$7("Incorrect invocation");
      };
      var toIntegerOrInfinity$4 = toIntegerOrInfinity$8;
      var toLength$7 = toLength$a;
      var $RangeError$2 = RangeError;
      var toIndex$2 = function(it) {
        if (it === void 0)
          return 0;
        var number = toIntegerOrInfinity$4(it);
        var length = toLength$7(number);
        if (number !== length)
          throw $RangeError$2("Wrong length or index");
        return length;
      };
      var $Array$2 = Array;
      var abs = Math.abs;
      var pow = Math.pow;
      var floor$4 = Math.floor;
      var log = Math.log;
      var LN2 = Math.LN2;
      var pack = function(number, mantissaLength, bytes) {
        var buffer = $Array$2(bytes);
        var exponentLength = bytes * 8 - mantissaLength - 1;
        var eMax = (1 << exponentLength) - 1;
        var eBias = eMax >> 1;
        var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
        var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
        var index2 = 0;
        var exponent, mantissa, c;
        number = abs(number);
        if (number != number || number === Infinity) {
          mantissa = number != number ? 1 : 0;
          exponent = eMax;
        } else {
          exponent = floor$4(log(number) / LN2);
          c = pow(2, -exponent);
          if (number * c < 1) {
            exponent--;
            c *= 2;
          }
          if (exponent + eBias >= 1) {
            number += rt / c;
          } else {
            number += rt * pow(2, 1 - eBias);
          }
          if (number * c >= 2) {
            exponent++;
            c /= 2;
          }
          if (exponent + eBias >= eMax) {
            mantissa = 0;
            exponent = eMax;
          } else if (exponent + eBias >= 1) {
            mantissa = (number * c - 1) * pow(2, mantissaLength);
            exponent = exponent + eBias;
          } else {
            mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
            exponent = 0;
          }
        }
        while (mantissaLength >= 8) {
          buffer[index2++] = mantissa & 255;
          mantissa /= 256;
          mantissaLength -= 8;
        }
        exponent = exponent << mantissaLength | mantissa;
        exponentLength += mantissaLength;
        while (exponentLength > 0) {
          buffer[index2++] = exponent & 255;
          exponent /= 256;
          exponentLength -= 8;
        }
        buffer[--index2] |= sign * 128;
        return buffer;
      };
      var unpack = function(buffer, mantissaLength) {
        var bytes = buffer.length;
        var exponentLength = bytes * 8 - mantissaLength - 1;
        var eMax = (1 << exponentLength) - 1;
        var eBias = eMax >> 1;
        var nBits = exponentLength - 7;
        var index2 = bytes - 1;
        var sign = buffer[index2--];
        var exponent = sign & 127;
        var mantissa;
        sign >>= 7;
        while (nBits > 0) {
          exponent = exponent * 256 + buffer[index2--];
          nBits -= 8;
        }
        mantissa = exponent & (1 << -nBits) - 1;
        exponent >>= -nBits;
        nBits += mantissaLength;
        while (nBits > 0) {
          mantissa = mantissa * 256 + buffer[index2--];
          nBits -= 8;
        }
        if (exponent === 0) {
          exponent = 1 - eBias;
        } else if (exponent === eMax) {
          return mantissa ? NaN : sign ? -Infinity : Infinity;
        } else {
          mantissa = mantissa + pow(2, mantissaLength);
          exponent = exponent - eBias;
        }
        return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
      };
      var ieee754 = {
        pack,
        unpack
      };
      var toObject$8 = toObject$b;
      var toAbsoluteIndex$4 = toAbsoluteIndex$7;
      var lengthOfArrayLike$9 = lengthOfArrayLike$c;
      var arrayFill$1 = function fill2(value) {
        var O = toObject$8(this);
        var length = lengthOfArrayLike$9(O);
        var argumentsLength = arguments.length;
        var index2 = toAbsoluteIndex$4(argumentsLength > 1 ? arguments[1] : void 0, length);
        var end = argumentsLength > 2 ? arguments[2] : void 0;
        var endPos = end === void 0 ? length : toAbsoluteIndex$4(end, length);
        while (endPos > index2)
          O[index2++] = value;
        return O;
      };
      var global$h = global$u;
      var uncurryThis$n = functionUncurryThis;
      var DESCRIPTORS$8 = descriptors;
      var NATIVE_ARRAY_BUFFER$2 = arrayBufferBasicDetection;
      var FunctionName = functionName;
      var createNonEnumerableProperty$4 = createNonEnumerableProperty$9;
      var defineBuiltIns = defineBuiltIns$1;
      var fails$m = fails$D;
      var anInstance$1 = anInstance$2;
      var toIntegerOrInfinity$3 = toIntegerOrInfinity$8;
      var toLength$6 = toLength$a;
      var toIndex$1 = toIndex$2;
      var IEEE754 = ieee754;
      var getPrototypeOf$1 = objectGetPrototypeOf;
      var setPrototypeOf$3 = objectSetPrototypeOf;
      var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
      var defineProperty$5 = objectDefineProperty.f;
      var arrayFill = arrayFill$1;
      var arraySlice$6 = arraySliceSimple;
      var setToStringTag$1 = setToStringTag$4;
      var InternalStateModule$3 = internalState;
      var PROPER_FUNCTION_NAME$1 = FunctionName.PROPER;
      var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
      var getInternalState$4 = InternalStateModule$3.get;
      var setInternalState$2 = InternalStateModule$3.set;
      var ARRAY_BUFFER$1 = "ArrayBuffer";
      var DATA_VIEW = "DataView";
      var PROTOTYPE$1 = "prototype";
      var WRONG_LENGTH$1 = "Wrong length";
      var WRONG_INDEX = "Wrong index";
      var NativeArrayBuffer$1 = global$h[ARRAY_BUFFER$1];
      var $ArrayBuffer = NativeArrayBuffer$1;
      var ArrayBufferPrototype$1 = $ArrayBuffer && $ArrayBuffer[PROTOTYPE$1];
      var $DataView = global$h[DATA_VIEW];
      var DataViewPrototype$1 = $DataView && $DataView[PROTOTYPE$1];
      var ObjectPrototype$2 = Object.prototype;
      var Array$1 = global$h.Array;
      var RangeError$3 = global$h.RangeError;
      var fill = uncurryThis$n(arrayFill);
      var reverse = uncurryThis$n([].reverse);
      var packIEEE754 = IEEE754.pack;
      var unpackIEEE754 = IEEE754.unpack;
      var packInt8 = function(number) {
        return [number & 255];
      };
      var packInt16 = function(number) {
        return [number & 255, number >> 8 & 255];
      };
      var packInt32 = function(number) {
        return [number & 255, number >> 8 & 255, number >> 16 & 255, number >> 24 & 255];
      };
      var unpackInt32 = function(buffer) {
        return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
      };
      var packFloat32 = function(number) {
        return packIEEE754(number, 23, 4);
      };
      var packFloat64 = function(number) {
        return packIEEE754(number, 52, 8);
      };
      var addGetter$1 = function(Constructor2, key2) {
        defineProperty$5(Constructor2[PROTOTYPE$1], key2, {
          get: function() {
            return getInternalState$4(this)[key2];
          }
        });
      };
      var get = function(view, count, index2, isLittleEndian) {
        var intIndex = toIndex$1(index2);
        var store2 = getInternalState$4(view);
        if (intIndex + count > store2.byteLength)
          throw RangeError$3(WRONG_INDEX);
        var bytes = getInternalState$4(store2.buffer).bytes;
        var start = intIndex + store2.byteOffset;
        var pack2 = arraySlice$6(bytes, start, start + count);
        return isLittleEndian ? pack2 : reverse(pack2);
      };
      var set = function(view, count, index2, conversion, value, isLittleEndian) {
        var intIndex = toIndex$1(index2);
        var store2 = getInternalState$4(view);
        if (intIndex + count > store2.byteLength)
          throw RangeError$3(WRONG_INDEX);
        var bytes = getInternalState$4(store2.buffer).bytes;
        var start = intIndex + store2.byteOffset;
        var pack2 = conversion(+value);
        for (var i = 0; i < count; i++)
          bytes[start + i] = pack2[isLittleEndian ? i : count - i - 1];
      };
      if (!NATIVE_ARRAY_BUFFER$2) {
        $ArrayBuffer = function ArrayBuffer2(length) {
          anInstance$1(this, ArrayBufferPrototype$1);
          var byteLength = toIndex$1(length);
          setInternalState$2(this, {
            bytes: fill(Array$1(byteLength), 0),
            byteLength
          });
          if (!DESCRIPTORS$8)
            this.byteLength = byteLength;
        };
        ArrayBufferPrototype$1 = $ArrayBuffer[PROTOTYPE$1];
        $DataView = function DataView2(buffer, byteOffset, byteLength) {
          anInstance$1(this, DataViewPrototype$1);
          anInstance$1(buffer, ArrayBufferPrototype$1);
          var bufferLength = getInternalState$4(buffer).byteLength;
          var offset = toIntegerOrInfinity$3(byteOffset);
          if (offset < 0 || offset > bufferLength)
            throw RangeError$3("Wrong offset");
          byteLength = byteLength === void 0 ? bufferLength - offset : toLength$6(byteLength);
          if (offset + byteLength > bufferLength)
            throw RangeError$3(WRONG_LENGTH$1);
          setInternalState$2(this, {
            buffer,
            byteLength,
            byteOffset: offset
          });
          if (!DESCRIPTORS$8) {
            this.buffer = buffer;
            this.byteLength = byteLength;
            this.byteOffset = offset;
          }
        };
        DataViewPrototype$1 = $DataView[PROTOTYPE$1];
        if (DESCRIPTORS$8) {
          addGetter$1($ArrayBuffer, "byteLength");
          addGetter$1($DataView, "buffer");
          addGetter$1($DataView, "byteLength");
          addGetter$1($DataView, "byteOffset");
        }
        defineBuiltIns(DataViewPrototype$1, {
          getInt8: function getInt8(byteOffset) {
            return get(this, 1, byteOffset)[0] << 24 >> 24;
          },
          getUint8: function getUint82(byteOffset) {
            return get(this, 1, byteOffset)[0];
          },
          getInt16: function getInt16(byteOffset) {
            var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : void 0);
            return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
          },
          getUint16: function getUint16(byteOffset) {
            var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : void 0);
            return bytes[1] << 8 | bytes[0];
          },
          getInt32: function getInt32(byteOffset) {
            return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : void 0));
          },
          getUint32: function getUint32(byteOffset) {
            return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : void 0)) >>> 0;
          },
          getFloat32: function getFloat32(byteOffset) {
            return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : void 0), 23);
          },
          getFloat64: function getFloat64(byteOffset) {
            return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : void 0), 52);
          },
          setInt8: function setInt8(byteOffset, value) {
            set(this, 1, byteOffset, packInt8, value);
          },
          setUint8: function setUint82(byteOffset, value) {
            set(this, 1, byteOffset, packInt8, value);
          },
          setInt16: function setInt16(byteOffset, value) {
            set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : void 0);
          },
          setUint16: function setUint16(byteOffset, value) {
            set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : void 0);
          },
          setInt32: function setInt32(byteOffset, value) {
            set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : void 0);
          },
          setUint32: function setUint32(byteOffset, value) {
            set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : void 0);
          },
          setFloat32: function setFloat32(byteOffset, value) {
            set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : void 0);
          },
          setFloat64: function setFloat64(byteOffset, value) {
            set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : void 0);
          }
        });
      } else {
        var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME$1 && NativeArrayBuffer$1.name !== ARRAY_BUFFER$1;
        if (!fails$m(function() {
          NativeArrayBuffer$1(1);
        }) || !fails$m(function() {
          new NativeArrayBuffer$1(-1);
        }) || fails$m(function() {
          new NativeArrayBuffer$1();
          new NativeArrayBuffer$1(1.5);
          new NativeArrayBuffer$1(NaN);
          return NativeArrayBuffer$1.length != 1 || INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
        })) {
          $ArrayBuffer = function ArrayBuffer2(length) {
            anInstance$1(this, ArrayBufferPrototype$1);
            return new NativeArrayBuffer$1(toIndex$1(length));
          };
          $ArrayBuffer[PROTOTYPE$1] = ArrayBufferPrototype$1;
          for (var keys$1 = getOwnPropertyNames$2(NativeArrayBuffer$1), j = 0, key; keys$1.length > j; ) {
            if (!((key = keys$1[j++]) in $ArrayBuffer)) {
              createNonEnumerableProperty$4($ArrayBuffer, key, NativeArrayBuffer$1[key]);
            }
          }
          ArrayBufferPrototype$1.constructor = $ArrayBuffer;
        } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
          createNonEnumerableProperty$4(NativeArrayBuffer$1, "name", ARRAY_BUFFER$1);
        }
        if (setPrototypeOf$3 && getPrototypeOf$1(DataViewPrototype$1) !== ObjectPrototype$2) {
          setPrototypeOf$3(DataViewPrototype$1, ObjectPrototype$2);
        }
        var testView = new $DataView(new $ArrayBuffer(2));
        var $setInt8 = uncurryThis$n(DataViewPrototype$1.setInt8);
        testView.setInt8(0, 2147483648);
        testView.setInt8(1, 2147483649);
        if (testView.getInt8(0) || !testView.getInt8(1))
          defineBuiltIns(DataViewPrototype$1, {
            setInt8: function setInt8(byteOffset, value) {
              $setInt8(this, byteOffset, value << 24 >> 24);
            },
            setUint8: function setUint82(byteOffset, value) {
              $setInt8(this, byteOffset, value << 24 >> 24);
            }
          }, {
            unsafe: true
          });
      }
      setToStringTag$1($ArrayBuffer, ARRAY_BUFFER$1);
      setToStringTag$1($DataView, DATA_VIEW);
      var arrayBuffer = {
        ArrayBuffer: $ArrayBuffer,
        DataView: $DataView
      };
      var $$l = _export;
      var uncurryThis$m = functionUncurryThis;
      var fails$l = fails$D;
      var ArrayBufferModule$2 = arrayBuffer;
      var anObject$6 = anObject$g;
      var toAbsoluteIndex$3 = toAbsoluteIndex$7;
      var toLength$5 = toLength$a;
      var speciesConstructor$1 = speciesConstructor$3;
      var ArrayBuffer$4 = ArrayBufferModule$2.ArrayBuffer;
      var DataView$2 = ArrayBufferModule$2.DataView;
      var DataViewPrototype = DataView$2.prototype;
      var nativeArrayBufferSlice = uncurryThis$m(ArrayBuffer$4.prototype.slice);
      var getUint8 = uncurryThis$m(DataViewPrototype.getUint8);
      var setUint8 = uncurryThis$m(DataViewPrototype.setUint8);
      var INCORRECT_SLICE = fails$l(function() {
        return !new ArrayBuffer$4(2).slice(1, void 0).byteLength;
      });
      $$l({
        target: "ArrayBuffer",
        proto: true,
        unsafe: true,
        forced: INCORRECT_SLICE
      }, {
        slice: function slice2(start, end) {
          if (nativeArrayBufferSlice && end === void 0) {
            return nativeArrayBufferSlice(anObject$6(this), start);
          }
          var length = anObject$6(this).byteLength;
          var first = toAbsoluteIndex$3(start, length);
          var fin = toAbsoluteIndex$3(end === void 0 ? length : end, length);
          var result = new (speciesConstructor$1(this, ArrayBuffer$4))(toLength$5(fin - first));
          var viewSource = new DataView$2(this);
          var viewTarget = new DataView$2(result);
          var index2 = 0;
          while (first < fin) {
            setUint8(viewTarget, index2++, getUint8(viewSource, first++));
          }
          return result;
        }
      });
      var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
      var classof$7 = classof$c;
      var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString2() {
        return "[object " + classof$7(this) + "]";
      };
      var TO_STRING_TAG_SUPPORT = toStringTagSupport;
      var defineBuiltIn$6 = defineBuiltIn$c;
      var toString$a = objectToString;
      if (!TO_STRING_TAG_SUPPORT) {
        defineBuiltIn$6(Object.prototype, "toString", toString$a, {
          unsafe: true
        });
      }
      var typedArrayConstructor = { exports: {} };
      var wellKnownSymbol$f = wellKnownSymbol$q;
      var ITERATOR$4 = wellKnownSymbol$f("iterator");
      var SAFE_CLOSING = false;
      try {
        var called = 0;
        var iteratorWithReturn = {
          next: function() {
            return {
              done: !!called++
            };
          },
          "return": function() {
            SAFE_CLOSING = true;
          }
        };
        iteratorWithReturn[ITERATOR$4] = function() {
          return this;
        };
        Array.from(iteratorWithReturn, function() {
          throw 2;
        });
      } catch (error) {
      }
      var checkCorrectnessOfIteration$1 = function(exec2, SKIP_CLOSING) {
        if (!SKIP_CLOSING && !SAFE_CLOSING)
          return false;
        var ITERATION_SUPPORT = false;
        try {
          var object = {};
          object[ITERATOR$4] = function() {
            return {
              next: function() {
                return {
                  done: ITERATION_SUPPORT = true
                };
              }
            };
          };
          exec2(object);
        } catch (error) {
        }
        return ITERATION_SUPPORT;
      };
      var NATIVE_ARRAY_BUFFER$1 = arrayBufferBasicDetection;
      var DESCRIPTORS$7 = descriptors;
      var global$g = global$u;
      var isCallable$5 = isCallable$n;
      var isObject$7 = isObject$f;
      var hasOwn$8 = hasOwnProperty_1;
      var classof$6 = classof$c;
      var tryToString$3 = tryToString$6;
      var createNonEnumerableProperty$3 = createNonEnumerableProperty$9;
      var defineBuiltIn$5 = defineBuiltIn$c;
      var defineProperty$4 = objectDefineProperty.f;
      var isPrototypeOf$5 = objectIsPrototypeOf;
      var getPrototypeOf = objectGetPrototypeOf;
      var setPrototypeOf$2 = objectSetPrototypeOf;
      var wellKnownSymbol$e = wellKnownSymbol$q;
      var uid$1 = uid$4;
      var InternalStateModule$2 = internalState;
      var enforceInternalState$2 = InternalStateModule$2.enforce;
      var getInternalState$3 = InternalStateModule$2.get;
      var Int8Array$4 = global$g.Int8Array;
      var Int8ArrayPrototype$1 = Int8Array$4 && Int8Array$4.prototype;
      var Uint8ClampedArray$1 = global$g.Uint8ClampedArray;
      var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype;
      var TypedArray$1 = Int8Array$4 && getPrototypeOf(Int8Array$4);
      var TypedArrayPrototype$2 = Int8ArrayPrototype$1 && getPrototypeOf(Int8ArrayPrototype$1);
      var ObjectPrototype$1 = Object.prototype;
      var TypeError$2 = global$g.TypeError;
      var TO_STRING_TAG = wellKnownSymbol$e("toStringTag");
      var TYPED_ARRAY_TAG$1 = uid$1("TYPED_ARRAY_TAG");
      var TYPED_ARRAY_CONSTRUCTOR = "TypedArrayConstructor";
      var NATIVE_ARRAY_BUFFER_VIEWS$3 = NATIVE_ARRAY_BUFFER$1 && !!setPrototypeOf$2 && classof$6(global$g.opera) !== "Opera";
      var TYPED_ARRAY_TAG_REQUIRED = false;
      var NAME, Constructor, Prototype;
      var TypedArrayConstructorsList = {
        Int8Array: 1,
        Uint8Array: 1,
        Uint8ClampedArray: 1,
        Int16Array: 2,
        Uint16Array: 2,
        Int32Array: 4,
        Uint32Array: 4,
        Float32Array: 4,
        Float64Array: 8
      };
      var BigIntArrayConstructorsList = {
        BigInt64Array: 8,
        BigUint64Array: 8
      };
      var isView = function isView2(it) {
        if (!isObject$7(it))
          return false;
        var klass = classof$6(it);
        return klass === "DataView" || hasOwn$8(TypedArrayConstructorsList, klass) || hasOwn$8(BigIntArrayConstructorsList, klass);
      };
      var getTypedArrayConstructor$1 = function(it) {
        var proto = getPrototypeOf(it);
        if (!isObject$7(proto))
          return;
        var state = getInternalState$3(proto);
        return state && hasOwn$8(state, TYPED_ARRAY_CONSTRUCTOR) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor$1(proto);
      };
      var isTypedArray$1 = function(it) {
        if (!isObject$7(it))
          return false;
        var klass = classof$6(it);
        return hasOwn$8(TypedArrayConstructorsList, klass) || hasOwn$8(BigIntArrayConstructorsList, klass);
      };
      var aTypedArray$m = function(it) {
        if (isTypedArray$1(it))
          return it;
        throw TypeError$2("Target is not a typed array");
      };
      var aTypedArrayConstructor$3 = function(C) {
        if (isCallable$5(C) && (!setPrototypeOf$2 || isPrototypeOf$5(TypedArray$1, C)))
          return C;
        throw TypeError$2(tryToString$3(C) + " is not a typed array constructor");
      };
      var exportTypedArrayMethod$n = function(KEY, property, forced, options) {
        if (!DESCRIPTORS$7)
          return;
        if (forced)
          for (var ARRAY in TypedArrayConstructorsList) {
            var TypedArrayConstructor = global$g[ARRAY];
            if (TypedArrayConstructor && hasOwn$8(TypedArrayConstructor.prototype, KEY))
              try {
                delete TypedArrayConstructor.prototype[KEY];
              } catch (error) {
                try {
                  TypedArrayConstructor.prototype[KEY] = property;
                } catch (error2) {
                }
              }
          }
        if (!TypedArrayPrototype$2[KEY] || forced) {
          defineBuiltIn$5(TypedArrayPrototype$2, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$3 && Int8ArrayPrototype$1[KEY] || property, options);
        }
      };
      var exportTypedArrayStaticMethod = function(KEY, property, forced) {
        var ARRAY, TypedArrayConstructor;
        if (!DESCRIPTORS$7)
          return;
        if (setPrototypeOf$2) {
          if (forced)
            for (ARRAY in TypedArrayConstructorsList) {
              TypedArrayConstructor = global$g[ARRAY];
              if (TypedArrayConstructor && hasOwn$8(TypedArrayConstructor, KEY))
                try {
                  delete TypedArrayConstructor[KEY];
                } catch (error) {
                }
            }
          if (!TypedArray$1[KEY] || forced) {
            try {
              return defineBuiltIn$5(TypedArray$1, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$3 && TypedArray$1[KEY] || property);
            } catch (error) {
            }
          } else
            return;
        }
        for (ARRAY in TypedArrayConstructorsList) {
          TypedArrayConstructor = global$g[ARRAY];
          if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
            defineBuiltIn$5(TypedArrayConstructor, KEY, property);
          }
        }
      };
      for (NAME in TypedArrayConstructorsList) {
        Constructor = global$g[NAME];
        Prototype = Constructor && Constructor.prototype;
        if (Prototype)
          enforceInternalState$2(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
        else
          NATIVE_ARRAY_BUFFER_VIEWS$3 = false;
      }
      for (NAME in BigIntArrayConstructorsList) {
        Constructor = global$g[NAME];
        Prototype = Constructor && Constructor.prototype;
        if (Prototype)
          enforceInternalState$2(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
      }
      if (!NATIVE_ARRAY_BUFFER_VIEWS$3 || !isCallable$5(TypedArray$1) || TypedArray$1 === Function.prototype) {
        TypedArray$1 = function TypedArray2() {
          throw TypeError$2("Incorrect invocation");
        };
        if (NATIVE_ARRAY_BUFFER_VIEWS$3)
          for (NAME in TypedArrayConstructorsList) {
            if (global$g[NAME])
              setPrototypeOf$2(global$g[NAME], TypedArray$1);
          }
      }
      if (!NATIVE_ARRAY_BUFFER_VIEWS$3 || !TypedArrayPrototype$2 || TypedArrayPrototype$2 === ObjectPrototype$1) {
        TypedArrayPrototype$2 = TypedArray$1.prototype;
        if (NATIVE_ARRAY_BUFFER_VIEWS$3)
          for (NAME in TypedArrayConstructorsList) {
            if (global$g[NAME])
              setPrototypeOf$2(global$g[NAME].prototype, TypedArrayPrototype$2);
          }
      }
      if (NATIVE_ARRAY_BUFFER_VIEWS$3 && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype$2) {
        setPrototypeOf$2(Uint8ClampedArrayPrototype, TypedArrayPrototype$2);
      }
      if (DESCRIPTORS$7 && !hasOwn$8(TypedArrayPrototype$2, TO_STRING_TAG)) {
        TYPED_ARRAY_TAG_REQUIRED = true;
        defineProperty$4(TypedArrayPrototype$2, TO_STRING_TAG, {
          get: function() {
            return isObject$7(this) ? this[TYPED_ARRAY_TAG$1] : void 0;
          }
        });
        for (NAME in TypedArrayConstructorsList)
          if (global$g[NAME]) {
            createNonEnumerableProperty$3(global$g[NAME], TYPED_ARRAY_TAG$1, NAME);
          }
      }
      var arrayBufferViewCore = {
        NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS$3,
        TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG$1,
        aTypedArray: aTypedArray$m,
        aTypedArrayConstructor: aTypedArrayConstructor$3,
        exportTypedArrayMethod: exportTypedArrayMethod$n,
        exportTypedArrayStaticMethod,
        getTypedArrayConstructor: getTypedArrayConstructor$1,
        isView,
        isTypedArray: isTypedArray$1,
        TypedArray: TypedArray$1,
        TypedArrayPrototype: TypedArrayPrototype$2
      };
      var global$f = global$u;
      var fails$k = fails$D;
      var checkCorrectnessOfIteration = checkCorrectnessOfIteration$1;
      var NATIVE_ARRAY_BUFFER_VIEWS$2 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
      var ArrayBuffer$3 = global$f.ArrayBuffer;
      var Int8Array$3 = global$f.Int8Array;
      var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$2 || !fails$k(function() {
        Int8Array$3(1);
      }) || !fails$k(function() {
        new Int8Array$3(-1);
      }) || !checkCorrectnessOfIteration(function(iterable) {
        new Int8Array$3();
        new Int8Array$3(null);
        new Int8Array$3(1.5);
        new Int8Array$3(iterable);
      }, true) || fails$k(function() {
        return new Int8Array$3(new ArrayBuffer$3(2), 1, void 0).length !== 1;
      });
      var isObject$6 = isObject$f;
      var floor$3 = Math.floor;
      var isIntegralNumber$1 = Number.isInteger || function isInteger(it) {
        return !isObject$6(it) && isFinite(it) && floor$3(it) === it;
      };
      var toIntegerOrInfinity$2 = toIntegerOrInfinity$8;
      var $RangeError$1 = RangeError;
      var toPositiveInteger$1 = function(it) {
        var result = toIntegerOrInfinity$2(it);
        if (result < 0)
          throw $RangeError$1("The argument can't be less than 0");
        return result;
      };
      var toPositiveInteger = toPositiveInteger$1;
      var $RangeError = RangeError;
      var toOffset$2 = function(it, BYTES) {
        var offset = toPositiveInteger(it);
        if (offset % BYTES)
          throw $RangeError("Wrong offset");
        return offset;
      };
      var uncurryThis$l = functionUncurryThis;
      var aCallable$3 = aCallable$5;
      var NATIVE_BIND = functionBindNative;
      var bind$2 = uncurryThis$l(uncurryThis$l.bind);
      var functionBindContext = function(fn, that) {
        aCallable$3(fn);
        return that === void 0 ? fn : NATIVE_BIND ? bind$2(fn, that) : function() {
          return fn.apply(that, arguments);
        };
      };
      var classof$5 = classof$c;
      var getMethod$2 = getMethod$5;
      var isNullOrUndefined$2 = isNullOrUndefined$7;
      var Iterators$1 = iterators;
      var wellKnownSymbol$d = wellKnownSymbol$q;
      var ITERATOR$3 = wellKnownSymbol$d("iterator");
      var getIteratorMethod$2 = function(it) {
        if (!isNullOrUndefined$2(it))
          return getMethod$2(it, ITERATOR$3) || getMethod$2(it, "@@iterator") || Iterators$1[classof$5(it)];
      };
      var call$b = functionCall;
      var aCallable$2 = aCallable$5;
      var anObject$5 = anObject$g;
      var tryToString$2 = tryToString$6;
      var getIteratorMethod$1 = getIteratorMethod$2;
      var $TypeError$6 = TypeError;
      var getIterator$1 = function(argument, usingIterator) {
        var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
        if (aCallable$2(iteratorMethod))
          return anObject$5(call$b(iteratorMethod, argument));
        throw $TypeError$6(tryToString$2(argument) + " is not iterable");
      };
      var wellKnownSymbol$c = wellKnownSymbol$q;
      var Iterators = iterators;
      var ITERATOR$2 = wellKnownSymbol$c("iterator");
      var ArrayPrototype = Array.prototype;
      var isArrayIteratorMethod$1 = function(it) {
        return it !== void 0 && (Iterators.Array === it || ArrayPrototype[ITERATOR$2] === it);
      };
      var classof$4 = classof$c;
      var uncurryThis$k = functionUncurryThis;
      var slice$2 = uncurryThis$k("".slice);
      var isBigIntArray$1 = function(it) {
        return slice$2(classof$4(it), 0, 3) === "Big";
      };
      var toPrimitive = toPrimitive$2;
      var $TypeError$5 = TypeError;
      var toBigInt$2 = function(argument) {
        var prim = toPrimitive(argument, "number");
        if (typeof prim == "number")
          throw $TypeError$5("Can't convert number to bigint");
        return BigInt(prim);
      };
      var bind$1 = functionBindContext;
      var call$a = functionCall;
      var aConstructor = aConstructor$2;
      var toObject$7 = toObject$b;
      var lengthOfArrayLike$8 = lengthOfArrayLike$c;
      var getIterator = getIterator$1;
      var getIteratorMethod = getIteratorMethod$2;
      var isArrayIteratorMethod = isArrayIteratorMethod$1;
      var isBigIntArray = isBigIntArray$1;
      var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
      var toBigInt$1 = toBigInt$2;
      var typedArrayFrom$1 = function from(source) {
        var C = aConstructor(this);
        var O = toObject$7(source);
        var argumentsLength = arguments.length;
        var mapfn = argumentsLength > 1 ? arguments[1] : void 0;
        var mapping = mapfn !== void 0;
        var iteratorMethod = getIteratorMethod(O);
        var i, length, result, thisIsBigIntArray, value, step, iterator, next;
        if (iteratorMethod && !isArrayIteratorMethod(iteratorMethod)) {
          iterator = getIterator(O, iteratorMethod);
          next = iterator.next;
          O = [];
          while (!(step = call$a(next, iterator)).done) {
            O.push(step.value);
          }
        }
        if (mapping && argumentsLength > 2) {
          mapfn = bind$1(mapfn, arguments[2]);
        }
        length = lengthOfArrayLike$8(O);
        result = new (aTypedArrayConstructor$2(C))(length);
        thisIsBigIntArray = isBigIntArray(result);
        for (i = 0; length > i; i++) {
          value = mapping ? mapfn(O[i], i) : O[i];
          result[i] = thisIsBigIntArray ? toBigInt$1(value) : +value;
        }
        return result;
      };
      var isArray$3 = isArray$5;
      var isConstructor$1 = isConstructor$3;
      var isObject$5 = isObject$f;
      var wellKnownSymbol$b = wellKnownSymbol$q;
      var SPECIES$3 = wellKnownSymbol$b("species");
      var $Array$1 = Array;
      var arraySpeciesConstructor$1 = function(originalArray) {
        var C;
        if (isArray$3(originalArray)) {
          C = originalArray.constructor;
          if (isConstructor$1(C) && (C === $Array$1 || isArray$3(C.prototype)))
            C = void 0;
          else if (isObject$5(C)) {
            C = C[SPECIES$3];
            if (C === null)
              C = void 0;
          }
        }
        return C === void 0 ? $Array$1 : C;
      };
      var arraySpeciesConstructor = arraySpeciesConstructor$1;
      var arraySpeciesCreate$2 = function(originalArray, length) {
        return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
      };
      var bind = functionBindContext;
      var uncurryThis$j = functionUncurryThis;
      var IndexedObject$1 = indexedObject;
      var toObject$6 = toObject$b;
      var lengthOfArrayLike$7 = lengthOfArrayLike$c;
      var arraySpeciesCreate$1 = arraySpeciesCreate$2;
      var push$2 = uncurryThis$j([].push);
      var createMethod$2 = function(TYPE) {
        var IS_MAP = TYPE == 1;
        var IS_FILTER = TYPE == 2;
        var IS_SOME = TYPE == 3;
        var IS_EVERY = TYPE == 4;
        var IS_FIND_INDEX = TYPE == 6;
        var IS_FILTER_REJECT = TYPE == 7;
        var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
        return function($this, callbackfn, that, specificCreate) {
          var O = toObject$6($this);
          var self2 = IndexedObject$1(O);
          var boundFunction = bind(callbackfn, that);
          var length = lengthOfArrayLike$7(self2);
          var index2 = 0;
          var create2 = specificCreate || arraySpeciesCreate$1;
          var target = IS_MAP ? create2($this, length) : IS_FILTER || IS_FILTER_REJECT ? create2($this, 0) : void 0;
          var value, result;
          for (; length > index2; index2++)
            if (NO_HOLES || index2 in self2) {
              value = self2[index2];
              result = boundFunction(value, index2, O);
              if (TYPE) {
                if (IS_MAP)
                  target[index2] = result;
                else if (result)
                  switch (TYPE) {
                    case 3:
                      return true;
                    case 5:
                      return value;
                    case 6:
                      return index2;
                    case 2:
                      push$2(target, value);
                  }
                else
                  switch (TYPE) {
                    case 4:
                      return false;
                    case 7:
                      push$2(target, value);
                  }
              }
            }
          return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
        };
      };
      var arrayIteration = {
        // `Array.prototype.forEach` method
        // https://tc39.es/ecma262/#sec-array.prototype.foreach
        forEach: createMethod$2(0),
        // `Array.prototype.map` method
        // https://tc39.es/ecma262/#sec-array.prototype.map
        map: createMethod$2(1),
        // `Array.prototype.filter` method
        // https://tc39.es/ecma262/#sec-array.prototype.filter
        filter: createMethod$2(2),
        // `Array.prototype.some` method
        // https://tc39.es/ecma262/#sec-array.prototype.some
        some: createMethod$2(3),
        // `Array.prototype.every` method
        // https://tc39.es/ecma262/#sec-array.prototype.every
        every: createMethod$2(4),
        // `Array.prototype.find` method
        // https://tc39.es/ecma262/#sec-array.prototype.find
        find: createMethod$2(5),
        // `Array.prototype.findIndex` method
        // https://tc39.es/ecma262/#sec-array.prototype.findIndex
        findIndex: createMethod$2(6),
        // `Array.prototype.filterReject` method
        // https://github.com/tc39/proposal-array-filtering
        filterReject: createMethod$2(7)
      };
      var getBuiltIn$3 = getBuiltIn$9;
      var definePropertyModule$2 = objectDefineProperty;
      var wellKnownSymbol$a = wellKnownSymbol$q;
      var DESCRIPTORS$6 = descriptors;
      var SPECIES$2 = wellKnownSymbol$a("species");
      var setSpecies$3 = function(CONSTRUCTOR_NAME) {
        var Constructor2 = getBuiltIn$3(CONSTRUCTOR_NAME);
        var defineProperty2 = definePropertyModule$2.f;
        if (DESCRIPTORS$6 && Constructor2 && !Constructor2[SPECIES$2]) {
          defineProperty2(Constructor2, SPECIES$2, {
            configurable: true,
            get: function() {
              return this;
            }
          });
        }
      };
      var isCallable$4 = isCallable$n;
      var isObject$4 = isObject$f;
      var setPrototypeOf$1 = objectSetPrototypeOf;
      var inheritIfRequired$2 = function($this, dummy, Wrapper) {
        var NewTarget, NewTargetPrototype;
        if (
          // it can work only with native `setPrototypeOf`
          setPrototypeOf$1 && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
          isCallable$4(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject$4(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype
        )
          setPrototypeOf$1($this, NewTargetPrototype);
        return $this;
      };
      var $$k = _export;
      var global$e = global$u;
      var call$9 = functionCall;
      var DESCRIPTORS$5 = descriptors;
      var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = typedArrayConstructorsRequireWrappers;
      var ArrayBufferViewCore$o = arrayBufferViewCore;
      var ArrayBufferModule$1 = arrayBuffer;
      var anInstance = anInstance$2;
      var createPropertyDescriptor$1 = createPropertyDescriptor$6;
      var createNonEnumerableProperty$2 = createNonEnumerableProperty$9;
      var isIntegralNumber = isIntegralNumber$1;
      var toLength$4 = toLength$a;
      var toIndex = toIndex$2;
      var toOffset$1 = toOffset$2;
      var toPropertyKey$1 = toPropertyKey$5;
      var hasOwn$7 = hasOwnProperty_1;
      var classof$3 = classof$c;
      var isObject$3 = isObject$f;
      var isSymbol$2 = isSymbol$5;
      var create = objectCreate;
      var isPrototypeOf$4 = objectIsPrototypeOf;
      var setPrototypeOf = objectSetPrototypeOf;
      var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
      var typedArrayFrom = typedArrayFrom$1;
      var forEach$2 = arrayIteration.forEach;
      var setSpecies$2 = setSpecies$3;
      var definePropertyModule$1 = objectDefineProperty;
      var getOwnPropertyDescriptorModule$1 = objectGetOwnPropertyDescriptor;
      var InternalStateModule$1 = internalState;
      var inheritIfRequired$1 = inheritIfRequired$2;
      var getInternalState$2 = InternalStateModule$1.get;
      var setInternalState$1 = InternalStateModule$1.set;
      var enforceInternalState$1 = InternalStateModule$1.enforce;
      var nativeDefineProperty$1 = definePropertyModule$1.f;
      var nativeGetOwnPropertyDescriptor$1 = getOwnPropertyDescriptorModule$1.f;
      var round = Math.round;
      var RangeError$2 = global$e.RangeError;
      var ArrayBuffer$2 = ArrayBufferModule$1.ArrayBuffer;
      var ArrayBufferPrototype = ArrayBuffer$2.prototype;
      var DataView$1 = ArrayBufferModule$1.DataView;
      var NATIVE_ARRAY_BUFFER_VIEWS$1 = ArrayBufferViewCore$o.NATIVE_ARRAY_BUFFER_VIEWS;
      var TYPED_ARRAY_TAG = ArrayBufferViewCore$o.TYPED_ARRAY_TAG;
      var TypedArray = ArrayBufferViewCore$o.TypedArray;
      var TypedArrayPrototype$1 = ArrayBufferViewCore$o.TypedArrayPrototype;
      var aTypedArrayConstructor$1 = ArrayBufferViewCore$o.aTypedArrayConstructor;
      var isTypedArray = ArrayBufferViewCore$o.isTypedArray;
      var BYTES_PER_ELEMENT = "BYTES_PER_ELEMENT";
      var WRONG_LENGTH = "Wrong length";
      var fromList = function(C, list) {
        aTypedArrayConstructor$1(C);
        var index2 = 0;
        var length = list.length;
        var result = new C(length);
        while (length > index2)
          result[index2] = list[index2++];
        return result;
      };
      var addGetter = function(it, key2) {
        nativeDefineProperty$1(it, key2, {
          get: function() {
            return getInternalState$2(this)[key2];
          }
        });
      };
      var isArrayBuffer = function(it) {
        var klass;
        return isPrototypeOf$4(ArrayBufferPrototype, it) || (klass = classof$3(it)) == "ArrayBuffer" || klass == "SharedArrayBuffer";
      };
      var isTypedArrayIndex = function(target, key2) {
        return isTypedArray(target) && !isSymbol$2(key2) && key2 in target && isIntegralNumber(+key2) && key2 >= 0;
      };
      var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor2(target, key2) {
        key2 = toPropertyKey$1(key2);
        return isTypedArrayIndex(target, key2) ? createPropertyDescriptor$1(2, target[key2]) : nativeGetOwnPropertyDescriptor$1(target, key2);
      };
      var wrappedDefineProperty = function defineProperty2(target, key2, descriptor) {
        key2 = toPropertyKey$1(key2);
        if (isTypedArrayIndex(target, key2) && isObject$3(descriptor) && hasOwn$7(descriptor, "value") && !hasOwn$7(descriptor, "get") && !hasOwn$7(descriptor, "set") && !descriptor.configurable && (!hasOwn$7(descriptor, "writable") || descriptor.writable) && (!hasOwn$7(descriptor, "enumerable") || descriptor.enumerable)) {
          target[key2] = descriptor.value;
          return target;
        }
        return nativeDefineProperty$1(target, key2, descriptor);
      };
      if (DESCRIPTORS$5) {
        if (!NATIVE_ARRAY_BUFFER_VIEWS$1) {
          getOwnPropertyDescriptorModule$1.f = wrappedGetOwnPropertyDescriptor;
          definePropertyModule$1.f = wrappedDefineProperty;
          addGetter(TypedArrayPrototype$1, "buffer");
          addGetter(TypedArrayPrototype$1, "byteOffset");
          addGetter(TypedArrayPrototype$1, "byteLength");
          addGetter(TypedArrayPrototype$1, "length");
        }
        $$k({
          target: "Object",
          stat: true,
          forced: !NATIVE_ARRAY_BUFFER_VIEWS$1
        }, {
          getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
          defineProperty: wrappedDefineProperty
        });
        typedArrayConstructor.exports = function(TYPE, wrapper, CLAMPED) {
          var BYTES = TYPE.match(/\d+$/)[0] / 8;
          var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? "Clamped" : "") + "Array";
          var GETTER = "get" + TYPE;
          var SETTER = "set" + TYPE;
          var NativeTypedArrayConstructor = global$e[CONSTRUCTOR_NAME];
          var TypedArrayConstructor = NativeTypedArrayConstructor;
          var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
          var exported = {};
          var getter = function(that, index2) {
            var data2 = getInternalState$2(that);
            return data2.view[GETTER](index2 * BYTES + data2.byteOffset, true);
          };
          var setter = function(that, index2, value) {
            var data2 = getInternalState$2(that);
            if (CLAMPED)
              value = (value = round(value)) < 0 ? 0 : value > 255 ? 255 : value & 255;
            data2.view[SETTER](index2 * BYTES + data2.byteOffset, value, true);
          };
          var addElement = function(that, index2) {
            nativeDefineProperty$1(that, index2, {
              get: function() {
                return getter(this, index2);
              },
              set: function(value) {
                return setter(this, index2, value);
              },
              enumerable: true
            });
          };
          if (!NATIVE_ARRAY_BUFFER_VIEWS$1) {
            TypedArrayConstructor = wrapper(function(that, data2, offset, $length) {
              anInstance(that, TypedArrayConstructorPrototype);
              var index2 = 0;
              var byteOffset = 0;
              var buffer, byteLength, length;
              if (!isObject$3(data2)) {
                length = toIndex(data2);
                byteLength = length * BYTES;
                buffer = new ArrayBuffer$2(byteLength);
              } else if (isArrayBuffer(data2)) {
                buffer = data2;
                byteOffset = toOffset$1(offset, BYTES);
                var $len = data2.byteLength;
                if ($length === void 0) {
                  if ($len % BYTES)
                    throw RangeError$2(WRONG_LENGTH);
                  byteLength = $len - byteOffset;
                  if (byteLength < 0)
                    throw RangeError$2(WRONG_LENGTH);
                } else {
                  byteLength = toLength$4($length) * BYTES;
                  if (byteLength + byteOffset > $len)
                    throw RangeError$2(WRONG_LENGTH);
                }
                length = byteLength / BYTES;
              } else if (isTypedArray(data2)) {
                return fromList(TypedArrayConstructor, data2);
              } else {
                return call$9(typedArrayFrom, TypedArrayConstructor, data2);
              }
              setInternalState$1(that, {
                buffer,
                byteOffset,
                byteLength,
                length,
                view: new DataView$1(buffer)
              });
              while (index2 < length)
                addElement(that, index2++);
            });
            if (setPrototypeOf)
              setPrototypeOf(TypedArrayConstructor, TypedArray);
            TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create(TypedArrayPrototype$1);
          } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
            TypedArrayConstructor = wrapper(function(dummy, data2, typedArrayOffset, $length) {
              anInstance(dummy, TypedArrayConstructorPrototype);
              return inheritIfRequired$1(function() {
                if (!isObject$3(data2))
                  return new NativeTypedArrayConstructor(toIndex(data2));
                if (isArrayBuffer(data2))
                  return $length !== void 0 ? new NativeTypedArrayConstructor(data2, toOffset$1(typedArrayOffset, BYTES), $length) : typedArrayOffset !== void 0 ? new NativeTypedArrayConstructor(data2, toOffset$1(typedArrayOffset, BYTES)) : new NativeTypedArrayConstructor(data2);
                if (isTypedArray(data2))
                  return fromList(TypedArrayConstructor, data2);
                return call$9(typedArrayFrom, TypedArrayConstructor, data2);
              }(), dummy, TypedArrayConstructor);
            });
            if (setPrototypeOf)
              setPrototypeOf(TypedArrayConstructor, TypedArray);
            forEach$2(getOwnPropertyNames$1(NativeTypedArrayConstructor), function(key2) {
              if (!(key2 in TypedArrayConstructor)) {
                createNonEnumerableProperty$2(TypedArrayConstructor, key2, NativeTypedArrayConstructor[key2]);
              }
            });
            TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
          }
          if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
            createNonEnumerableProperty$2(TypedArrayConstructorPrototype, "constructor", TypedArrayConstructor);
          }
          enforceInternalState$1(TypedArrayConstructorPrototype).TypedArrayConstructor = TypedArrayConstructor;
          if (TYPED_ARRAY_TAG) {
            createNonEnumerableProperty$2(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
          }
          var FORCED2 = TypedArrayConstructor != NativeTypedArrayConstructor;
          exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;
          $$k({
            global: true,
            constructor: true,
            forced: FORCED2,
            sham: !NATIVE_ARRAY_BUFFER_VIEWS$1
          }, exported);
          if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
            createNonEnumerableProperty$2(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
          }
          if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
            createNonEnumerableProperty$2(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
          }
          setSpecies$2(CONSTRUCTOR_NAME);
        };
      } else
        typedArrayConstructor.exports = function() {
        };
      var createTypedArrayConstructor$2 = typedArrayConstructor.exports;
      createTypedArrayConstructor$2("Uint8", function(init) {
        return function Uint8Array2(data2, byteOffset, length) {
          return init(this, data2, byteOffset, length);
        };
      });
      var tryToString$1 = tryToString$6;
      var $TypeError$4 = TypeError;
      var deletePropertyOrThrow$1 = function(O, P) {
        if (!delete O[P])
          throw $TypeError$4("Cannot delete property " + tryToString$1(P) + " of " + tryToString$1(O));
      };
      var toObject$5 = toObject$b;
      var toAbsoluteIndex$2 = toAbsoluteIndex$7;
      var lengthOfArrayLike$6 = lengthOfArrayLike$c;
      var deletePropertyOrThrow = deletePropertyOrThrow$1;
      var min$3 = Math.min;
      var arrayCopyWithin = [].copyWithin || function copyWithin(target, start) {
        var O = toObject$5(this);
        var len = lengthOfArrayLike$6(O);
        var to = toAbsoluteIndex$2(target, len);
        var from = toAbsoluteIndex$2(start, len);
        var end = arguments.length > 2 ? arguments[2] : void 0;
        var count = min$3((end === void 0 ? len : toAbsoluteIndex$2(end, len)) - from, len - to);
        var inc = 1;
        if (from < to && to < from + count) {
          inc = -1;
          from += count - 1;
          to += count - 1;
        }
        while (count-- > 0) {
          if (from in O)
            O[to] = O[from];
          else
            deletePropertyOrThrow(O, to);
          to += inc;
          from += inc;
        }
        return O;
      };
      var uncurryThis$i = functionUncurryThis;
      var ArrayBufferViewCore$n = arrayBufferViewCore;
      var $ArrayCopyWithin = arrayCopyWithin;
      var u$ArrayCopyWithin = uncurryThis$i($ArrayCopyWithin);
      var aTypedArray$l = ArrayBufferViewCore$n.aTypedArray;
      var exportTypedArrayMethod$m = ArrayBufferViewCore$n.exportTypedArrayMethod;
      exportTypedArrayMethod$m("copyWithin", function copyWithin(target, start) {
        return u$ArrayCopyWithin(aTypedArray$l(this), target, start, arguments.length > 2 ? arguments[2] : void 0);
      });
      var ArrayBufferViewCore$m = arrayBufferViewCore;
      var $every$1 = arrayIteration.every;
      var aTypedArray$k = ArrayBufferViewCore$m.aTypedArray;
      var exportTypedArrayMethod$l = ArrayBufferViewCore$m.exportTypedArrayMethod;
      exportTypedArrayMethod$l("every", function every(callbackfn) {
        return $every$1(aTypedArray$k(this), callbackfn, arguments.length > 1 ? arguments[1] : void 0);
      });
      var ArrayBufferViewCore$l = arrayBufferViewCore;
      var $fill = arrayFill$1;
      var toBigInt = toBigInt$2;
      var classof$2 = classof$c;
      var call$8 = functionCall;
      var uncurryThis$h = functionUncurryThis;
      var fails$j = fails$D;
      var aTypedArray$j = ArrayBufferViewCore$l.aTypedArray;
      var exportTypedArrayMethod$k = ArrayBufferViewCore$l.exportTypedArrayMethod;
      var slice$1 = uncurryThis$h("".slice);
      var CONVERSION_BUG = fails$j(function() {
        var count = 0;
        new Int8Array(2).fill({
          valueOf: function() {
            return count++;
          }
        });
        return count !== 1;
      });
      exportTypedArrayMethod$k("fill", function fill2(value) {
        var length = arguments.length;
        aTypedArray$j(this);
        var actualValue = slice$1(classof$2(this), 0, 3) === "Big" ? toBigInt(value) : +value;
        return call$8($fill, this, actualValue, length > 1 ? arguments[1] : void 0, length > 2 ? arguments[2] : void 0);
      }, CONVERSION_BUG);
      var lengthOfArrayLike$5 = lengthOfArrayLike$c;
      var arrayFromConstructorAndList$1 = function(Constructor2, list) {
        var index2 = 0;
        var length = lengthOfArrayLike$5(list);
        var result = new Constructor2(length);
        while (length > index2)
          result[index2] = list[index2++];
        return result;
      };
      var ArrayBufferViewCore$k = arrayBufferViewCore;
      var speciesConstructor = speciesConstructor$3;
      var aTypedArrayConstructor = ArrayBufferViewCore$k.aTypedArrayConstructor;
      var getTypedArrayConstructor = ArrayBufferViewCore$k.getTypedArrayConstructor;
      var typedArraySpeciesConstructor$4 = function(originalArray) {
        return aTypedArrayConstructor(speciesConstructor(originalArray, getTypedArrayConstructor(originalArray)));
      };
      var arrayFromConstructorAndList = arrayFromConstructorAndList$1;
      var typedArraySpeciesConstructor$3 = typedArraySpeciesConstructor$4;
      var typedArrayFromSpeciesAndList = function(instance, list) {
        return arrayFromConstructorAndList(typedArraySpeciesConstructor$3(instance), list);
      };
      var ArrayBufferViewCore$j = arrayBufferViewCore;
      var $filter = arrayIteration.filter;
      var fromSpeciesAndList = typedArrayFromSpeciesAndList;
      var aTypedArray$i = ArrayBufferViewCore$j.aTypedArray;
      var exportTypedArrayMethod$j = ArrayBufferViewCore$j.exportTypedArrayMethod;
      exportTypedArrayMethod$j("filter", function filter(callbackfn) {
        var list = $filter(aTypedArray$i(this), callbackfn, arguments.length > 1 ? arguments[1] : void 0);
        return fromSpeciesAndList(this, list);
      });
      var ArrayBufferViewCore$i = arrayBufferViewCore;
      var $find = arrayIteration.find;
      var aTypedArray$h = ArrayBufferViewCore$i.aTypedArray;
      var exportTypedArrayMethod$i = ArrayBufferViewCore$i.exportTypedArrayMethod;
      exportTypedArrayMethod$i("find", function find(predicate) {
        return $find(aTypedArray$h(this), predicate, arguments.length > 1 ? arguments[1] : void 0);
      });
      var ArrayBufferViewCore$h = arrayBufferViewCore;
      var $findIndex = arrayIteration.findIndex;
      var aTypedArray$g = ArrayBufferViewCore$h.aTypedArray;
      var exportTypedArrayMethod$h = ArrayBufferViewCore$h.exportTypedArrayMethod;
      exportTypedArrayMethod$h("findIndex", function findIndex(predicate) {
        return $findIndex(aTypedArray$g(this), predicate, arguments.length > 1 ? arguments[1] : void 0);
      });
      var ArrayBufferViewCore$g = arrayBufferViewCore;
      var $forEach$2 = arrayIteration.forEach;
      var aTypedArray$f = ArrayBufferViewCore$g.aTypedArray;
      var exportTypedArrayMethod$g = ArrayBufferViewCore$g.exportTypedArrayMethod;
      exportTypedArrayMethod$g("forEach", function forEach2(callbackfn) {
        $forEach$2(aTypedArray$f(this), callbackfn, arguments.length > 1 ? arguments[1] : void 0);
      });
      var ArrayBufferViewCore$f = arrayBufferViewCore;
      var $includes$1 = arrayIncludes.includes;
      var aTypedArray$e = ArrayBufferViewCore$f.aTypedArray;
      var exportTypedArrayMethod$f = ArrayBufferViewCore$f.exportTypedArrayMethod;
      exportTypedArrayMethod$f("includes", function includes2(searchElement) {
        return $includes$1(aTypedArray$e(this), searchElement, arguments.length > 1 ? arguments[1] : void 0);
      });
      var ArrayBufferViewCore$e = arrayBufferViewCore;
      var $indexOf$1 = arrayIncludes.indexOf;
      var aTypedArray$d = ArrayBufferViewCore$e.aTypedArray;
      var exportTypedArrayMethod$e = ArrayBufferViewCore$e.exportTypedArrayMethod;
      exportTypedArrayMethod$e("indexOf", function indexOf2(searchElement) {
        return $indexOf$1(aTypedArray$d(this), searchElement, arguments.length > 1 ? arguments[1] : void 0);
      });
      var global$d = global$u;
      var fails$i = fails$D;
      var uncurryThis$g = functionUncurryThis;
      var ArrayBufferViewCore$d = arrayBufferViewCore;
      var ArrayIterators = es_array_iterator;
      var wellKnownSymbol$9 = wellKnownSymbol$q;
      var ITERATOR$1 = wellKnownSymbol$9("iterator");
      var Uint8Array$2 = global$d.Uint8Array;
      var arrayValues = uncurryThis$g(ArrayIterators.values);
      var arrayKeys = uncurryThis$g(ArrayIterators.keys);
      var arrayEntries = uncurryThis$g(ArrayIterators.entries);
      var aTypedArray$c = ArrayBufferViewCore$d.aTypedArray;
      var exportTypedArrayMethod$d = ArrayBufferViewCore$d.exportTypedArrayMethod;
      var TypedArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype;
      var GENERIC = !fails$i(function() {
        TypedArrayPrototype[ITERATOR$1].call([1]);
      });
      var ITERATOR_IS_VALUES = !!TypedArrayPrototype && TypedArrayPrototype.values && TypedArrayPrototype[ITERATOR$1] === TypedArrayPrototype.values && TypedArrayPrototype.values.name === "values";
      var typedArrayValues = function values2() {
        return arrayValues(aTypedArray$c(this));
      };
      exportTypedArrayMethod$d("entries", function entries() {
        return arrayEntries(aTypedArray$c(this));
      }, GENERIC);
      exportTypedArrayMethod$d("keys", function keys2() {
        return arrayKeys(aTypedArray$c(this));
      }, GENERIC);
      exportTypedArrayMethod$d("values", typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, {
        name: "values"
      });
      exportTypedArrayMethod$d(ITERATOR$1, typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, {
        name: "values"
      });
      var ArrayBufferViewCore$c = arrayBufferViewCore;
      var uncurryThis$f = functionUncurryThis;
      var aTypedArray$b = ArrayBufferViewCore$c.aTypedArray;
      var exportTypedArrayMethod$c = ArrayBufferViewCore$c.exportTypedArrayMethod;
      var $join = uncurryThis$f([].join);
      exportTypedArrayMethod$c("join", function join2(separator) {
        return $join(aTypedArray$b(this), separator);
      });
      var fails$h = fails$D;
      var arrayMethodIsStrict$4 = function(METHOD_NAME, argument) {
        var method = [][METHOD_NAME];
        return !!method && fails$h(function() {
          method.call(null, argument || function() {
            return 1;
          }, 1);
        });
      };
      var apply$4 = functionApply;
      var toIndexedObject$4 = toIndexedObject$a;
      var toIntegerOrInfinity$1 = toIntegerOrInfinity$8;
      var lengthOfArrayLike$4 = lengthOfArrayLike$c;
      var arrayMethodIsStrict$3 = arrayMethodIsStrict$4;
      var min$2 = Math.min;
      var $lastIndexOf$1 = [].lastIndexOf;
      var NEGATIVE_ZERO$1 = !!$lastIndexOf$1 && 1 / [1].lastIndexOf(1, -0) < 0;
      var STRICT_METHOD$3 = arrayMethodIsStrict$3("lastIndexOf");
      var FORCED$6 = NEGATIVE_ZERO$1 || !STRICT_METHOD$3;
      var arrayLastIndexOf = FORCED$6 ? function lastIndexOf(searchElement) {
        if (NEGATIVE_ZERO$1)
          return apply$4($lastIndexOf$1, this, arguments) || 0;
        var O = toIndexedObject$4(this);
        var length = lengthOfArrayLike$4(O);
        var index2 = length - 1;
        if (arguments.length > 1)
          index2 = min$2(index2, toIntegerOrInfinity$1(arguments[1]));
        if (index2 < 0)
          index2 = length + index2;
        for (; index2 >= 0; index2--)
          if (index2 in O && O[index2] === searchElement)
            return index2 || 0;
        return -1;
      } : $lastIndexOf$1;
      var ArrayBufferViewCore$b = arrayBufferViewCore;
      var apply$3 = functionApply;
      var $lastIndexOf = arrayLastIndexOf;
      var aTypedArray$a = ArrayBufferViewCore$b.aTypedArray;
      var exportTypedArrayMethod$b = ArrayBufferViewCore$b.exportTypedArrayMethod;
      exportTypedArrayMethod$b("lastIndexOf", function lastIndexOf(searchElement) {
        var length = arguments.length;
        return apply$3($lastIndexOf, aTypedArray$a(this), length > 1 ? [searchElement, arguments[1]] : [searchElement]);
      });
      var ArrayBufferViewCore$a = arrayBufferViewCore;
      var $map = arrayIteration.map;
      var typedArraySpeciesConstructor$2 = typedArraySpeciesConstructor$4;
      var aTypedArray$9 = ArrayBufferViewCore$a.aTypedArray;
      var exportTypedArrayMethod$a = ArrayBufferViewCore$a.exportTypedArrayMethod;
      exportTypedArrayMethod$a("map", function map(mapfn) {
        return $map(aTypedArray$9(this), mapfn, arguments.length > 1 ? arguments[1] : void 0, function(O, length) {
          return new (typedArraySpeciesConstructor$2(O))(length);
        });
      });
      var aCallable$1 = aCallable$5;
      var toObject$4 = toObject$b;
      var IndexedObject = indexedObject;
      var lengthOfArrayLike$3 = lengthOfArrayLike$c;
      var $TypeError$3 = TypeError;
      var createMethod$1 = function(IS_RIGHT) {
        return function(that, callbackfn, argumentsLength, memo) {
          aCallable$1(callbackfn);
          var O = toObject$4(that);
          var self2 = IndexedObject(O);
          var length = lengthOfArrayLike$3(O);
          var index2 = IS_RIGHT ? length - 1 : 0;
          var i = IS_RIGHT ? -1 : 1;
          if (argumentsLength < 2)
            while (true) {
              if (index2 in self2) {
                memo = self2[index2];
                index2 += i;
                break;
              }
              index2 += i;
              if (IS_RIGHT ? index2 < 0 : length <= index2) {
                throw $TypeError$3("Reduce of empty array with no initial value");
              }
            }
          for (; IS_RIGHT ? index2 >= 0 : length > index2; index2 += i)
            if (index2 in self2) {
              memo = callbackfn(memo, self2[index2], index2, O);
            }
          return memo;
        };
      };
      var arrayReduce = {
        // `Array.prototype.reduce` method
        // https://tc39.es/ecma262/#sec-array.prototype.reduce
        left: createMethod$1(false),
        // `Array.prototype.reduceRight` method
        // https://tc39.es/ecma262/#sec-array.prototype.reduceright
        right: createMethod$1(true)
      };
      var ArrayBufferViewCore$9 = arrayBufferViewCore;
      var $reduce = arrayReduce.left;
      var aTypedArray$8 = ArrayBufferViewCore$9.aTypedArray;
      var exportTypedArrayMethod$9 = ArrayBufferViewCore$9.exportTypedArrayMethod;
      exportTypedArrayMethod$9("reduce", function reduce(callbackfn) {
        var length = arguments.length;
        return $reduce(aTypedArray$8(this), callbackfn, length, length > 1 ? arguments[1] : void 0);
      });
      var ArrayBufferViewCore$8 = arrayBufferViewCore;
      var $reduceRight = arrayReduce.right;
      var aTypedArray$7 = ArrayBufferViewCore$8.aTypedArray;
      var exportTypedArrayMethod$8 = ArrayBufferViewCore$8.exportTypedArrayMethod;
      exportTypedArrayMethod$8("reduceRight", function reduceRight(callbackfn) {
        var length = arguments.length;
        return $reduceRight(aTypedArray$7(this), callbackfn, length, length > 1 ? arguments[1] : void 0);
      });
      var ArrayBufferViewCore$7 = arrayBufferViewCore;
      var aTypedArray$6 = ArrayBufferViewCore$7.aTypedArray;
      var exportTypedArrayMethod$7 = ArrayBufferViewCore$7.exportTypedArrayMethod;
      var floor$2 = Math.floor;
      exportTypedArrayMethod$7("reverse", function reverse2() {
        var that = this;
        var length = aTypedArray$6(that).length;
        var middle = floor$2(length / 2);
        var index2 = 0;
        var value;
        while (index2 < middle) {
          value = that[index2];
          that[index2++] = that[--length];
          that[length] = value;
        }
        return that;
      });
      var global$c = global$u;
      var call$7 = functionCall;
      var ArrayBufferViewCore$6 = arrayBufferViewCore;
      var lengthOfArrayLike$2 = lengthOfArrayLike$c;
      var toOffset = toOffset$2;
      var toIndexedObject$3 = toObject$b;
      var fails$g = fails$D;
      var RangeError$1 = global$c.RangeError;
      var Int8Array$2 = global$c.Int8Array;
      var Int8ArrayPrototype = Int8Array$2 && Int8Array$2.prototype;
      var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
      var aTypedArray$5 = ArrayBufferViewCore$6.aTypedArray;
      var exportTypedArrayMethod$6 = ArrayBufferViewCore$6.exportTypedArrayMethod;
      var WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS = !fails$g(function() {
        var array = new Uint8ClampedArray(2);
        call$7($set, array, {
          length: 1,
          0: 3
        }, 1);
        return array[1] !== 3;
      });
      var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore$6.NATIVE_ARRAY_BUFFER_VIEWS && fails$g(function() {
        var array = new Int8Array$2(2);
        array.set(1);
        array.set("2", 1);
        return array[0] !== 0 || array[1] !== 2;
      });
      exportTypedArrayMethod$6("set", function set2(arrayLike) {
        aTypedArray$5(this);
        var offset = toOffset(arguments.length > 1 ? arguments[1] : void 0, 1);
        var src = toIndexedObject$3(arrayLike);
        if (WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS)
          return call$7($set, this, src, offset);
        var length = this.length;
        var len = lengthOfArrayLike$2(src);
        var index2 = 0;
        if (len + offset > length)
          throw RangeError$1("Wrong length");
        while (index2 < len)
          this[offset + index2] = src[index2++];
      }, !WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);
      var uncurryThis$e = functionUncurryThis;
      var arraySlice$5 = uncurryThis$e([].slice);
      var ArrayBufferViewCore$5 = arrayBufferViewCore;
      var typedArraySpeciesConstructor$1 = typedArraySpeciesConstructor$4;
      var fails$f = fails$D;
      var arraySlice$4 = arraySlice$5;
      var aTypedArray$4 = ArrayBufferViewCore$5.aTypedArray;
      var exportTypedArrayMethod$5 = ArrayBufferViewCore$5.exportTypedArrayMethod;
      var FORCED$5 = fails$f(function() {
        new Int8Array(1).slice();
      });
      exportTypedArrayMethod$5("slice", function slice2(start, end) {
        var list = arraySlice$4(aTypedArray$4(this), start, end);
        var C = typedArraySpeciesConstructor$1(this);
        var index2 = 0;
        var length = list.length;
        var result = new C(length);
        while (length > index2)
          result[index2] = list[index2++];
        return result;
      }, FORCED$5);
      var ArrayBufferViewCore$4 = arrayBufferViewCore;
      var $some = arrayIteration.some;
      var aTypedArray$3 = ArrayBufferViewCore$4.aTypedArray;
      var exportTypedArrayMethod$4 = ArrayBufferViewCore$4.exportTypedArrayMethod;
      exportTypedArrayMethod$4("some", function some(callbackfn) {
        return $some(aTypedArray$3(this), callbackfn, arguments.length > 1 ? arguments[1] : void 0);
      });
      var arraySlice$3 = arraySliceSimple;
      var floor$1 = Math.floor;
      var mergeSort = function(array, comparefn) {
        var length = array.length;
        var middle = floor$1(length / 2);
        return length < 8 ? insertionSort(array, comparefn) : merge(array, mergeSort(arraySlice$3(array, 0, middle), comparefn), mergeSort(arraySlice$3(array, middle), comparefn), comparefn);
      };
      var insertionSort = function(array, comparefn) {
        var length = array.length;
        var i = 1;
        var element, j2;
        while (i < length) {
          j2 = i;
          element = array[i];
          while (j2 && comparefn(array[j2 - 1], element) > 0) {
            array[j2] = array[--j2];
          }
          if (j2 !== i++)
            array[j2] = element;
        }
        return array;
      };
      var merge = function(array, left, right, comparefn) {
        var llength = left.length;
        var rlength = right.length;
        var lindex = 0;
        var rindex = 0;
        while (lindex < llength || rindex < rlength) {
          array[lindex + rindex] = lindex < llength && rindex < rlength ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++] : lindex < llength ? left[lindex++] : right[rindex++];
        }
        return array;
      };
      var arraySort = mergeSort;
      var userAgent$1 = engineUserAgent;
      var firefox = userAgent$1.match(/firefox\/(\d+)/i);
      var engineFfVersion = !!firefox && +firefox[1];
      var UA = engineUserAgent;
      var engineIsIeOrEdge = /MSIE|Trident/.test(UA);
      var userAgent = engineUserAgent;
      var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);
      var engineWebkitVersion = !!webkit && +webkit[1];
      var global$b = global$u;
      var uncurryThis$d = functionUncurryThis;
      var fails$e = fails$D;
      var aCallable = aCallable$5;
      var internalSort = arraySort;
      var ArrayBufferViewCore$3 = arrayBufferViewCore;
      var FF = engineFfVersion;
      var IE_OR_EDGE = engineIsIeOrEdge;
      var V8 = engineV8Version;
      var WEBKIT = engineWebkitVersion;
      var aTypedArray$2 = ArrayBufferViewCore$3.aTypedArray;
      var exportTypedArrayMethod$3 = ArrayBufferViewCore$3.exportTypedArrayMethod;
      var Uint16Array$1 = global$b.Uint16Array;
      var nativeSort = Uint16Array$1 && uncurryThis$d(Uint16Array$1.prototype.sort);
      var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !(fails$e(function() {
        nativeSort(new Uint16Array$1(2), null);
      }) && fails$e(function() {
        nativeSort(new Uint16Array$1(2), {});
      }));
      var STABLE_SORT = !!nativeSort && !fails$e(function() {
        if (V8)
          return V8 < 74;
        if (FF)
          return FF < 67;
        if (IE_OR_EDGE)
          return true;
        if (WEBKIT)
          return WEBKIT < 602;
        var array = new Uint16Array$1(516);
        var expected = Array(516);
        var index2, mod;
        for (index2 = 0; index2 < 516; index2++) {
          mod = index2 % 4;
          array[index2] = 515 - index2;
          expected[index2] = index2 - 2 * mod + 3;
        }
        nativeSort(array, function(a, b) {
          return (a / 4 | 0) - (b / 4 | 0);
        });
        for (index2 = 0; index2 < 516; index2++) {
          if (array[index2] !== expected[index2])
            return true;
        }
      });
      var getSortCompare = function(comparefn) {
        return function(x, y) {
          if (comparefn !== void 0)
            return +comparefn(x, y) || 0;
          if (y !== y)
            return -1;
          if (x !== x)
            return 1;
          if (x === 0 && y === 0)
            return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
          return x > y;
        };
      };
      exportTypedArrayMethod$3("sort", function sort(comparefn) {
        if (comparefn !== void 0)
          aCallable(comparefn);
        if (STABLE_SORT)
          return nativeSort(this, comparefn);
        return internalSort(aTypedArray$2(this), getSortCompare(comparefn));
      }, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);
      var ArrayBufferViewCore$2 = arrayBufferViewCore;
      var toLength$3 = toLength$a;
      var toAbsoluteIndex$1 = toAbsoluteIndex$7;
      var typedArraySpeciesConstructor = typedArraySpeciesConstructor$4;
      var aTypedArray$1 = ArrayBufferViewCore$2.aTypedArray;
      var exportTypedArrayMethod$2 = ArrayBufferViewCore$2.exportTypedArrayMethod;
      exportTypedArrayMethod$2("subarray", function subarray(begin, end) {
        var O = aTypedArray$1(this);
        var length = O.length;
        var beginIndex = toAbsoluteIndex$1(begin, length);
        var C = typedArraySpeciesConstructor(O);
        return new C(O.buffer, O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT, toLength$3((end === void 0 ? length : toAbsoluteIndex$1(end, length)) - beginIndex));
      });
      var global$a = global$u;
      var apply$2 = functionApply;
      var ArrayBufferViewCore$1 = arrayBufferViewCore;
      var fails$d = fails$D;
      var arraySlice$2 = arraySlice$5;
      var Int8Array$1 = global$a.Int8Array;
      var aTypedArray = ArrayBufferViewCore$1.aTypedArray;
      var exportTypedArrayMethod$1 = ArrayBufferViewCore$1.exportTypedArrayMethod;
      var $toLocaleString = [].toLocaleString;
      var TO_LOCALE_STRING_BUG = !!Int8Array$1 && fails$d(function() {
        $toLocaleString.call(new Int8Array$1(1));
      });
      var FORCED$4 = fails$d(function() {
        return [1, 2].toLocaleString() != new Int8Array$1([1, 2]).toLocaleString();
      }) || !fails$d(function() {
        Int8Array$1.prototype.toLocaleString.call([1, 2]);
      });
      exportTypedArrayMethod$1("toLocaleString", function toLocaleString() {
        return apply$2($toLocaleString, TO_LOCALE_STRING_BUG ? arraySlice$2(aTypedArray(this)) : aTypedArray(this), arraySlice$2(arguments));
      }, FORCED$4);
      var exportTypedArrayMethod = arrayBufferViewCore.exportTypedArrayMethod;
      var fails$c = fails$D;
      var global$9 = global$u;
      var uncurryThis$c = functionUncurryThis;
      var Uint8Array$1 = global$9.Uint8Array;
      var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype || {};
      var arrayToString = [].toString;
      var join = uncurryThis$c([].join);
      if (fails$c(function() {
        arrayToString.call({});
      })) {
        arrayToString = function toString2() {
          return join(this);
        };
      }
      var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;
      exportTypedArrayMethod("toString", arrayToString, IS_NOT_ARRAY_METHOD);
      var fails$b = fails$D;
      var wellKnownSymbol$8 = wellKnownSymbol$q;
      var V8_VERSION$1 = engineV8Version;
      var SPECIES$1 = wellKnownSymbol$8("species");
      var arrayMethodHasSpeciesSupport$2 = function(METHOD_NAME) {
        return V8_VERSION$1 >= 51 || !fails$b(function() {
          var array = [];
          var constructor = array.constructor = {};
          constructor[SPECIES$1] = function() {
            return {
              foo: 1
            };
          };
          return array[METHOD_NAME](Boolean).foo !== 1;
        });
      };
      var $$j = _export;
      var isArray$2 = isArray$5;
      var isConstructor = isConstructor$3;
      var isObject$2 = isObject$f;
      var toAbsoluteIndex = toAbsoluteIndex$7;
      var lengthOfArrayLike$1 = lengthOfArrayLike$c;
      var toIndexedObject$2 = toIndexedObject$a;
      var createProperty$1 = createProperty$3;
      var wellKnownSymbol$7 = wellKnownSymbol$q;
      var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$2;
      var nativeSlice = arraySlice$5;
      var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$1("slice");
      var SPECIES = wellKnownSymbol$7("species");
      var $Array = Array;
      var max$1 = Math.max;
      $$j({
        target: "Array",
        proto: true,
        forced: !HAS_SPECIES_SUPPORT
      }, {
        slice: function slice2(start, end) {
          var O = toIndexedObject$2(this);
          var length = lengthOfArrayLike$1(O);
          var k = toAbsoluteIndex(start, length);
          var fin = toAbsoluteIndex(end === void 0 ? length : end, length);
          var Constructor2, result, n;
          if (isArray$2(O)) {
            Constructor2 = O.constructor;
            if (isConstructor(Constructor2) && (Constructor2 === $Array || isArray$2(Constructor2.prototype))) {
              Constructor2 = void 0;
            } else if (isObject$2(Constructor2)) {
              Constructor2 = Constructor2[SPECIES];
              if (Constructor2 === null)
                Constructor2 = void 0;
            }
            if (Constructor2 === $Array || Constructor2 === void 0) {
              return nativeSlice(O, k, fin);
            }
          }
          result = new (Constructor2 === void 0 ? $Array : Constructor2)(max$1(fin - k, 0));
          for (n = 0; k < fin; k++, n++)
            if (k in O)
              createProperty$1(result, n, O[k]);
          result.length = n;
          return result;
        }
      });
      var $$i = _export;
      var ArrayBufferViewCore = arrayBufferViewCore;
      var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
      $$i({
        target: "ArrayBuffer",
        stat: true,
        forced: !NATIVE_ARRAY_BUFFER_VIEWS
      }, {
        isView: ArrayBufferViewCore.isView
      });
      var $$h = _export;
      var global$8 = global$u;
      var arrayBufferModule = arrayBuffer;
      var setSpecies$1 = setSpecies$3;
      var ARRAY_BUFFER = "ArrayBuffer";
      var ArrayBuffer$1 = arrayBufferModule[ARRAY_BUFFER];
      var NativeArrayBuffer = global$8[ARRAY_BUFFER];
      $$h({
        global: true,
        constructor: true,
        forced: NativeArrayBuffer !== ArrayBuffer$1
      }, {
        ArrayBuffer: ArrayBuffer$1
      });
      setSpecies$1(ARRAY_BUFFER);
      var $TypeError$2 = TypeError;
      var MAX_SAFE_INTEGER = 9007199254740991;
      var doesNotExceedSafeInteger$1 = function(it) {
        if (it > MAX_SAFE_INTEGER)
          throw $TypeError$2("Maximum allowed index exceeded");
        return it;
      };
      var $$g = _export;
      var fails$a = fails$D;
      var isArray$1 = isArray$5;
      var isObject$1 = isObject$f;
      var toObject$3 = toObject$b;
      var lengthOfArrayLike = lengthOfArrayLike$c;
      var doesNotExceedSafeInteger = doesNotExceedSafeInteger$1;
      var createProperty = createProperty$3;
      var arraySpeciesCreate = arraySpeciesCreate$2;
      var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$2;
      var wellKnownSymbol$6 = wellKnownSymbol$q;
      var V8_VERSION = engineV8Version;
      var IS_CONCAT_SPREADABLE = wellKnownSymbol$6("isConcatSpreadable");
      var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails$a(function() {
        var array = [];
        array[IS_CONCAT_SPREADABLE] = false;
        return array.concat()[0] !== array;
      });
      var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("concat");
      var isConcatSpreadable = function(O) {
        if (!isObject$1(O))
          return false;
        var spreadable = O[IS_CONCAT_SPREADABLE];
        return spreadable !== void 0 ? !!spreadable : isArray$1(O);
      };
      var FORCED$3 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;
      $$g({
        target: "Array",
        proto: true,
        arity: 1,
        forced: FORCED$3
      }, {
        // eslint-disable-next-line no-unused-vars -- required for `.length`
        concat: function concat2(arg) {
          var O = toObject$3(this);
          var A = arraySpeciesCreate(O, 0);
          var n = 0;
          var i, k, length, len, E;
          for (i = -1, length = arguments.length; i < length; i++) {
            E = i === -1 ? O : arguments[i];
            if (isConcatSpreadable(E)) {
              len = lengthOfArrayLike(E);
              doesNotExceedSafeInteger(n + len);
              for (k = 0; k < len; k++, n++)
                if (k in E)
                  createProperty(A, n, E[k]);
            } else {
              doesNotExceedSafeInteger(n + 1);
              createProperty(A, n++, E);
            }
          }
          A.length = n;
          return A;
        }
      });
      var isRegExp$1 = isRegexp;
      var $TypeError$1 = TypeError;
      var notARegexp = function(it) {
        if (isRegExp$1(it)) {
          throw $TypeError$1("The method doesn't accept regular expressions");
        }
        return it;
      };
      var wellKnownSymbol$5 = wellKnownSymbol$q;
      var MATCH$1 = wellKnownSymbol$5("match");
      var correctIsRegexpLogic = function(METHOD_NAME) {
        var regexp2 = /./;
        try {
          "/./"[METHOD_NAME](regexp2);
        } catch (error1) {
          try {
            regexp2[MATCH$1] = false;
            return "/./"[METHOD_NAME](regexp2);
          } catch (error2) {
          }
        }
        return false;
      };
      var $$f = _export;
      var uncurryThis$b = functionUncurryThis;
      var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
      var toLength$2 = toLength$a;
      var toString$9 = toString$e;
      var notARegExp$1 = notARegexp;
      var requireObjectCoercible$4 = requireObjectCoercible$9;
      var correctIsRegExpLogic$1 = correctIsRegexpLogic;
      var nativeEndsWith = uncurryThis$b("".endsWith);
      var slice = uncurryThis$b("".slice);
      var min$1 = Math.min;
      var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic$1("endsWith");
      var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function() {
        var descriptor = getOwnPropertyDescriptor(String.prototype, "endsWith");
        return descriptor && !descriptor.writable;
      }();
      $$f({
        target: "String",
        proto: true,
        forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC
      }, {
        endsWith: function endsWith(searchString) {
          var that = toString$9(requireObjectCoercible$4(this));
          notARegExp$1(searchString);
          var endPosition = arguments.length > 1 ? arguments[1] : void 0;
          var len = that.length;
          var end = endPosition === void 0 ? len : min$1(toLength$2(endPosition), len);
          var search = toString$9(searchString);
          return nativeEndsWith ? nativeEndsWith(that, search, end) : slice(that, end - search.length, end) === search;
        }
      });
      var $$e = _export;
      var ArrayBufferModule = arrayBuffer;
      var NATIVE_ARRAY_BUFFER = arrayBufferBasicDetection;
      $$e({
        global: true,
        constructor: true,
        forced: !NATIVE_ARRAY_BUFFER
      }, {
        DataView: ArrayBufferModule.DataView
      });
      var createTypedArrayConstructor$1 = typedArrayConstructor.exports;
      createTypedArrayConstructor$1("Uint16", function(init) {
        return function Uint16Array2(data2, byteOffset, length) {
          return init(this, data2, byteOffset, length);
        };
      });
      var $forEach$1 = arrayIteration.forEach;
      var arrayMethodIsStrict$2 = arrayMethodIsStrict$4;
      var STRICT_METHOD$2 = arrayMethodIsStrict$2("forEach");
      var arrayForEach = !STRICT_METHOD$2 ? function forEach2(callbackfn) {
        return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
      } : [].forEach;
      var $$d = _export;
      var forEach$1 = arrayForEach;
      $$d({
        target: "Array",
        proto: true,
        forced: [].forEach != forEach$1
      }, {
        forEach: forEach$1
      });
      var domIterables = {
        CSSRuleList: 0,
        CSSStyleDeclaration: 0,
        CSSValueList: 0,
        ClientRectList: 0,
        DOMRectList: 0,
        DOMStringList: 0,
        DOMTokenList: 1,
        DataTransferItemList: 0,
        FileList: 0,
        HTMLAllCollection: 0,
        HTMLCollection: 0,
        HTMLFormElement: 0,
        HTMLSelectElement: 0,
        MediaList: 0,
        MimeTypeArray: 0,
        NamedNodeMap: 0,
        NodeList: 1,
        PaintRequestList: 0,
        Plugin: 0,
        PluginArray: 0,
        SVGLengthList: 0,
        SVGNumberList: 0,
        SVGPathSegList: 0,
        SVGPointList: 0,
        SVGStringList: 0,
        SVGTransformList: 0,
        SourceBufferList: 0,
        StyleSheetList: 0,
        TextTrackCueList: 0,
        TextTrackList: 0,
        TouchList: 0
      };
      var documentCreateElement = documentCreateElement$2;
      var classList = documentCreateElement("span").classList;
      var DOMTokenListPrototype$1 = classList && classList.constructor && classList.constructor.prototype;
      var domTokenListPrototype = DOMTokenListPrototype$1 === Object.prototype ? void 0 : DOMTokenListPrototype$1;
      var global$7 = global$u;
      var DOMIterables = domIterables;
      var DOMTokenListPrototype = domTokenListPrototype;
      var forEach = arrayForEach;
      var createNonEnumerableProperty$1 = createNonEnumerableProperty$9;
      var handlePrototype = function(CollectionPrototype) {
        if (CollectionPrototype && CollectionPrototype.forEach !== forEach)
          try {
            createNonEnumerableProperty$1(CollectionPrototype, "forEach", forEach);
          } catch (error) {
            CollectionPrototype.forEach = forEach;
          }
      };
      for (var COLLECTION_NAME in DOMIterables) {
        if (DOMIterables[COLLECTION_NAME]) {
          handlePrototype(global$7[COLLECTION_NAME] && global$7[COLLECTION_NAME].prototype);
        }
      }
      handlePrototype(DOMTokenListPrototype);
      function decodeUTF8(bytes) {
        var string = "";
        var i = 0;
        var c = 0;
        var c2 = 0;
        var c3 = 0;
        i += bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191 ? 3 : 0;
        while (i < bytes.length) {
          c = bytes[i++];
          switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
              string += String.fromCharCode(c);
              break;
            case 12:
            case 13:
              c2 = bytes[i++];
              string += String.fromCharCode((c & 31) << 6 | c2 & 63);
              break;
            case 14:
              c2 = bytes[i++];
              c3 = bytes[i++];
              string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | (c3 & 63) << 0);
              break;
            default:
              string += "";
          }
        }
        return string;
      }
      function encodeUTF8(string) {
        var bytes = [];
        for (var i = 0; i < string.length; i++) {
          var charCode = string.charCodeAt(i);
          if (charCode < 128) {
            bytes.push(charCode);
          } else if (charCode < 2048) {
            bytes.push(192 | charCode >> 6, 128 | charCode & 63);
          } else if (charCode < 55296 || charCode >= 57344) {
            bytes.push(224 | charCode >> 12, 128 | charCode >> 6 & 63, 128 | charCode & 63);
          } else {
            i++;
            charCode = 65536 + ((charCode & 1023) << 10 | string.charCodeAt(i) & 1023);
            bytes.push(240 | charCode >> 18, 128 | charCode >> 12 & 63, 128 | charCode >> 6 & 63, 128 | charCode & 63);
          }
        }
        return bytes;
      }
      function encodeString(string) {
        var format = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "windows1251";
        var bytes = [];
        switch (format) {
          case "utf-8":
            bytes = encodeUTF8(string);
            break;
          case "utf-16":
          case "utf-16be": {
            var buffer = new ArrayBuffer(string.length * 2);
            var uint16 = new Uint16Array(buffer);
            var uint8 = new Uint8Array(buffer);
            for (var i = 0; i < string.length; i++) {
              uint16[i] = string.charCodeAt(i);
            }
            bytes = [255, 254];
            uint8.forEach(function(_byte) {
              return bytes.push(_byte);
            });
            break;
          }
          case "windows1251":
          default:
            for (var _i = 0; _i < string.length; _i++) {
              bytes.push(string.charCodeAt(_i));
            }
        }
        return bytes;
      }
      function isBuffer(param) {
        return param instanceof ArrayBuffer || typeof Buffer !== "undefined" && param instanceof Buffer;
      }
      var BufferView = /* @__PURE__ */ function(_DataView) {
        _inherits(BufferView2, _DataView);
        var _super = _createSuper(BufferView2);
        function BufferView2() {
          _classCallCheck(this, BufferView2);
          for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
          }
          if (typeof params[0] === "number" || Array.isArray(params[0])) {
            params[0] = new Uint8Array(params[0]);
          }
          if (ArrayBuffer.isView(params[0])) {
            params[0] = params[0].buffer;
          }
          return _super.call.apply(_super, [this].concat(params));
        }
        _createClass(BufferView2, [{
          key: "getString",
          value: function getString(offset, maxlength) {
            var format = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "windows1251";
            var string = "";
            var bytes = this.getUint8(offset, maxlength);
            if (!Array.isArray(bytes))
              bytes = [bytes];
            switch (format) {
              case "utf8":
              case "utf-8":
                string = decodeUTF8(bytes);
                break;
              case "utf16":
              case "utf16be":
              case "utf-16":
              case "utf-16be": {
                var le = null;
                if (bytes[0] === 255 && bytes[1] === 254)
                  le = true;
                else if (bytes[0] === 254 && bytes[1] === 255)
                  le = false;
                if (le !== null) {
                  offset += 2;
                  maxlength -= 2;
                }
                string = this.getUint16String(offset, maxlength, le === true);
                break;
              }
              case "windows1251":
              default:
                string = this.getUint8String(offset, maxlength);
            }
            return {
              string: string.endsWith("\0") ? string.substr(0, string.length - 1) : string,
              length: bytes.length
            };
          }
        }, {
          key: "getCString",
          value: function getCString(offset) {
            var format = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "windows1251";
            var bytes, bytesPerChar;
            var limit = this.byteLength - offset;
            switch (format) {
              case "utf16":
              case "utf16be":
              case "utf-16":
              case "utf-16be":
                bytesPerChar = 2;
                bytes = this.getUint16(offset, limit);
                break;
              default:
                bytesPerChar = 1;
                bytes = this.getUint8(offset, limit);
            }
            if (!Array.isArray(bytes))
              bytes = [bytes];
            for (var i = 0; i < bytes.length; i++) {
              if (bytes[i] === 0) {
                limit = (i + 1) * bytesPerChar;
                break;
              }
            }
            return this.getString(offset, limit, format);
          }
        }, {
          key: "getUint8String",
          value: function getUint8String(offset, length) {
            var bytes = this.getUint8(offset, length);
            var string = "";
            if (!Array.isArray(bytes))
              bytes = [bytes];
            for (var i = 0; i < bytes.length; i++) {
              var character = String.fromCharCode(bytes[i]);
              string += character;
            }
            return string;
          }
        }, {
          key: "getUint16String",
          value: function getUint16String(offset, length) {
            var le = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
            var bytes = this.getUint16(offset, length, le);
            var string = "";
            if (!Array.isArray(bytes))
              bytes = [bytes];
            for (var i = 0; i < bytes.length; i++) {
              var character = String.fromCharCode(bytes[i]);
              string += character;
            }
            return string;
          }
        }, {
          key: "getUint8",
          value: function getUint82(offset) {
            var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
            var limit = offset + length;
            var bytes = [];
            if (this.byteLength - limit < 0)
              return false;
            for (var i = offset; i < limit; i++) {
              var _byte = DataView.prototype.getUint8.call(this, i);
              bytes.push(_byte);
            }
            return bytes.length === 1 ? bytes[0] : bytes;
          }
        }, {
          key: "getUint16",
          value: function getUint16(offset) {
            var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
            var le = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
            if (length % 2 !== 0)
              length -= 1;
            var limit = offset + length;
            var bytes = [];
            if (this.byteLength - limit < 0)
              return false;
            for (var i = offset; i < limit; i += 2) {
              var _byte2 = DataView.prototype.getUint16.call(this, i, le);
              bytes.push(_byte2);
            }
            return bytes.length === 1 ? bytes[0] : bytes;
          }
        }], [{
          key: "isViewable",
          value: function isViewable(param) {
            if (isBuffer(param) || Array.isArray(param) || ArrayBuffer.isView(param)) {
              return true;
            }
            return false;
          }
        }]);
        return BufferView2;
      }(/* @__PURE__ */ _wrapNativeSuper(DataView));
      var uncurryThis$a = functionUncurryThis;
      var toObject$2 = toObject$b;
      var floor = Math.floor;
      var charAt$2 = uncurryThis$a("".charAt);
      var replace$4 = uncurryThis$a("".replace);
      var stringSlice$3 = uncurryThis$a("".slice);
      var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
      var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;
      var getSubstitution$1 = function(matched, str, position, captures, namedCaptures, replacement2) {
        var tailPos = position + matched.length;
        var m = captures.length;
        var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
        if (namedCaptures !== void 0) {
          namedCaptures = toObject$2(namedCaptures);
          symbols = SUBSTITUTION_SYMBOLS;
        }
        return replace$4(replacement2, symbols, function(match2, ch) {
          var capture;
          switch (charAt$2(ch, 0)) {
            case "$":
              return "$";
            case "&":
              return matched;
            case "`":
              return stringSlice$3(str, 0, position);
            case "'":
              return stringSlice$3(str, tailPos);
            case "<":
              capture = namedCaptures[stringSlice$3(ch, 1, -1)];
              break;
            default:
              var n = +ch;
              if (n === 0)
                return match2;
              if (n > m) {
                var f = floor(n / 10);
                if (f === 0)
                  return match2;
                if (f <= m)
                  return captures[f - 1] === void 0 ? charAt$2(ch, 1) : captures[f - 1] + charAt$2(ch, 1);
                return match2;
              }
              capture = captures[n - 1];
          }
          return capture === void 0 ? "" : capture;
        });
      };
      var apply$1 = functionApply;
      var call$6 = functionCall;
      var uncurryThis$9 = functionUncurryThis;
      var fixRegExpWellKnownSymbolLogic$1 = fixRegexpWellKnownSymbolLogic;
      var fails$9 = fails$D;
      var anObject$4 = anObject$g;
      var isCallable$3 = isCallable$n;
      var isNullOrUndefined$1 = isNullOrUndefined$7;
      var toIntegerOrInfinity = toIntegerOrInfinity$8;
      var toLength$1 = toLength$a;
      var toString$8 = toString$e;
      var requireObjectCoercible$3 = requireObjectCoercible$9;
      var advanceStringIndex$1 = advanceStringIndex$3;
      var getMethod$1 = getMethod$5;
      var getSubstitution = getSubstitution$1;
      var regExpExec$1 = regexpExecAbstract;
      var wellKnownSymbol$4 = wellKnownSymbol$q;
      var REPLACE = wellKnownSymbol$4("replace");
      var max = Math.max;
      var min = Math.min;
      var concat = uncurryThis$9([].concat);
      var push$1 = uncurryThis$9([].push);
      var stringIndexOf$2 = uncurryThis$9("".indexOf);
      var stringSlice$2 = uncurryThis$9("".slice);
      var maybeToString = function(it) {
        return it === void 0 ? it : String(it);
      };
      var REPLACE_KEEPS_$0 = function() {
        return "a".replace(/./, "$0") === "$0";
      }();
      var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function() {
        if (/./[REPLACE]) {
          return /./[REPLACE]("a", "$0") === "";
        }
        return false;
      }();
      var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$9(function() {
        var re = /./;
        re.exec = function() {
          var result = [];
          result.groups = {
            a: "7"
          };
          return result;
        };
        return "".replace(re, "$<a>") !== "7";
      });
      fixRegExpWellKnownSymbolLogic$1("replace", function(_, nativeReplace2, maybeCallNative) {
        var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? "$" : "$0";
        return [
          // `String.prototype.replace` method
          // https://tc39.es/ecma262/#sec-string.prototype.replace
          function replace2(searchValue, replaceValue) {
            var O = requireObjectCoercible$3(this);
            var replacer = isNullOrUndefined$1(searchValue) ? void 0 : getMethod$1(searchValue, REPLACE);
            return replacer ? call$6(replacer, searchValue, O, replaceValue) : call$6(nativeReplace2, toString$8(O), searchValue, replaceValue);
          },
          // `RegExp.prototype[@@replace]` method
          // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
          function(string, replaceValue) {
            var rx = anObject$4(this);
            var S = toString$8(string);
            if (typeof replaceValue == "string" && stringIndexOf$2(replaceValue, UNSAFE_SUBSTITUTE) === -1 && stringIndexOf$2(replaceValue, "$<") === -1) {
              var res = maybeCallNative(nativeReplace2, rx, S, replaceValue);
              if (res.done)
                return res.value;
            }
            var functionalReplace = isCallable$3(replaceValue);
            if (!functionalReplace)
              replaceValue = toString$8(replaceValue);
            var global2 = rx.global;
            if (global2) {
              var fullUnicode = rx.unicode;
              rx.lastIndex = 0;
            }
            var results = [];
            while (true) {
              var result = regExpExec$1(rx, S);
              if (result === null)
                break;
              push$1(results, result);
              if (!global2)
                break;
              var matchStr = toString$8(result[0]);
              if (matchStr === "")
                rx.lastIndex = advanceStringIndex$1(S, toLength$1(rx.lastIndex), fullUnicode);
            }
            var accumulatedResult = "";
            var nextSourcePosition = 0;
            for (var i = 0; i < results.length; i++) {
              result = results[i];
              var matched = toString$8(result[0]);
              var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
              var captures = [];
              for (var j2 = 1; j2 < result.length; j2++)
                push$1(captures, maybeToString(result[j2]));
              var namedCaptures = result.groups;
              if (functionalReplace) {
                var replacerArgs = concat([matched], captures, position, S);
                if (namedCaptures !== void 0)
                  push$1(replacerArgs, namedCaptures);
                var replacement2 = toString$8(apply$1(replaceValue, void 0, replacerArgs));
              } else {
                replacement2 = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
              }
              if (position >= nextSourcePosition) {
                accumulatedResult += stringSlice$2(S, nextSourcePosition, position) + replacement2;
                nextSourcePosition = position + matched.length;
              }
            }
            return accumulatedResult + stringSlice$2(S, nextSourcePosition);
          }
        ];
      }, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);
      var uncurryThis$8 = functionUncurryThis;
      var defineBuiltIn$4 = defineBuiltIn$c;
      var DatePrototype = Date.prototype;
      var INVALID_DATE = "Invalid Date";
      var TO_STRING$1 = "toString";
      var nativeDateToString = uncurryThis$8(DatePrototype[TO_STRING$1]);
      var thisTimeValue = uncurryThis$8(DatePrototype.getTime);
      if (String(/* @__PURE__ */ new Date(NaN)) != INVALID_DATE) {
        defineBuiltIn$4(DatePrototype, TO_STRING$1, function toString2() {
          var value = thisTimeValue(this);
          return value === value ? nativeDateToString(this) : INVALID_DATE;
        });
      }
      var call$5 = functionCall;
      var hasOwn$6 = hasOwnProperty_1;
      var isPrototypeOf$3 = objectIsPrototypeOf;
      var regExpFlags$1 = regexpFlags$1;
      var RegExpPrototype$4 = RegExp.prototype;
      var regexpGetFlags = function(R) {
        var flags = R.flags;
        return flags === void 0 && !("flags" in RegExpPrototype$4) && !hasOwn$6(R, "flags") && isPrototypeOf$3(RegExpPrototype$4, R) ? call$5(regExpFlags$1, R) : flags;
      };
      var PROPER_FUNCTION_NAME = functionName.PROPER;
      var defineBuiltIn$3 = defineBuiltIn$c;
      var anObject$3 = anObject$g;
      var $toString$1 = toString$e;
      var fails$8 = fails$D;
      var getRegExpFlags$1 = regexpGetFlags;
      var TO_STRING = "toString";
      var RegExpPrototype$3 = RegExp.prototype;
      var nativeToString = RegExpPrototype$3[TO_STRING];
      var NOT_GENERIC = fails$8(function() {
        return nativeToString.call({
          source: "a",
          flags: "b"
        }) != "/a/b";
      });
      var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name != TO_STRING;
      if (NOT_GENERIC || INCORRECT_NAME) {
        defineBuiltIn$3(RegExp.prototype, TO_STRING, function toString2() {
          var R = anObject$3(this);
          var pattern = $toString$1(R.source);
          var flags = $toString$1(getRegExpFlags$1(R));
          return "/" + pattern + "/" + flags;
        }, {
          unsafe: true
        });
      }
      var whitespaces$2 = "	\n\v\f\r                　\u2028\u2029\uFEFF";
      var uncurryThis$7 = functionUncurryThis;
      var requireObjectCoercible$2 = requireObjectCoercible$9;
      var toString$7 = toString$e;
      var whitespaces$1 = whitespaces$2;
      var replace$3 = uncurryThis$7("".replace);
      var whitespace = "[" + whitespaces$1 + "]";
      var ltrim = RegExp("^" + whitespace + whitespace + "*");
      var rtrim = RegExp(whitespace + whitespace + "*$");
      var createMethod = function(TYPE) {
        return function($this) {
          var string = toString$7(requireObjectCoercible$2($this));
          if (TYPE & 1)
            string = replace$3(string, ltrim, "");
          if (TYPE & 2)
            string = replace$3(string, rtrim, "");
          return string;
        };
      };
      var stringTrim = {
        // `String.prototype.{ trimLeft, trimStart }` methods
        // https://tc39.es/ecma262/#sec-string.prototype.trimstart
        start: createMethod(1),
        // `String.prototype.{ trimRight, trimEnd }` methods
        // https://tc39.es/ecma262/#sec-string.prototype.trimend
        end: createMethod(2),
        // `String.prototype.trim` method
        // https://tc39.es/ecma262/#sec-string.prototype.trim
        trim: createMethod(3)
      };
      var global$6 = global$u;
      var fails$7 = fails$D;
      var uncurryThis$6 = functionUncurryThis;
      var toString$6 = toString$e;
      var trim = stringTrim.trim;
      var whitespaces = whitespaces$2;
      var $parseInt$1 = global$6.parseInt;
      var Symbol$1 = global$6.Symbol;
      var ITERATOR = Symbol$1 && Symbol$1.iterator;
      var hex = /^[+-]?0x/i;
      var exec$2 = uncurryThis$6(hex.exec);
      var FORCED$2 = $parseInt$1(whitespaces + "08") !== 8 || $parseInt$1(whitespaces + "0x16") !== 22 || ITERATOR && !fails$7(function() {
        $parseInt$1(Object(ITERATOR));
      });
      var numberParseInt = FORCED$2 ? function parseInt2(string, radix) {
        var S = trim(toString$6(string));
        return $parseInt$1(S, radix >>> 0 || (exec$2(hex, S) ? 16 : 10));
      } : $parseInt$1;
      var $$c = _export;
      var $parseInt = numberParseInt;
      $$c({
        global: true,
        forced: parseInt != $parseInt
      }, {
        parseInt: $parseInt
      });
      var $$b = _export;
      var $includes = arrayIncludes.includes;
      var fails$6 = fails$D;
      var addToUnscopables = addToUnscopables$2;
      var BROKEN_ON_SPARSE = fails$6(function() {
        return !Array(1).includes();
      });
      $$b({
        target: "Array",
        proto: true,
        forced: BROKEN_ON_SPARSE
      }, {
        includes: function includes2(el) {
          return $includes(this, el, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
      addToUnscopables("includes");
      var $$a = _export;
      var uncurryThis$5 = functionUncurryThis;
      var $indexOf = arrayIncludes.indexOf;
      var arrayMethodIsStrict$1 = arrayMethodIsStrict$4;
      var nativeIndexOf = uncurryThis$5([].indexOf);
      var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
      var STRICT_METHOD$1 = arrayMethodIsStrict$1("indexOf");
      $$a({
        target: "Array",
        proto: true,
        forced: NEGATIVE_ZERO || !STRICT_METHOD$1
      }, {
        indexOf: function indexOf2(searchElement) {
          var fromIndex = arguments.length > 1 ? arguments[1] : void 0;
          return NEGATIVE_ZERO ? nativeIndexOf(this, searchElement, fromIndex) || 0 : $indexOf(this, searchElement, fromIndex);
        }
      });
      function isBitSet(_byte, bit) {
        return (_byte & 1 << bit) > 0;
      }
      function setBit(_byte2, bit) {
        return _byte2 | 1 << bit;
      }
      function decodeSynch(synch2) {
        var out = 0;
        var mask = 2130706432;
        while (mask) {
          out >>= 1;
          out |= synch2 & mask;
          mask >>= 8;
        }
        return out;
      }
      function encodeSynch(size) {
        var out = 0;
        var mask = 127;
        while (mask ^ 2147483647) {
          out = size & ~mask;
          out <<= 1;
          out |= size & mask;
          mask = (mask + 1 << 8) - 1;
          size = out;
        }
        return out;
      }
      function mergeBytes() {
        var merged = [];
        for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
          params[_key] = arguments[_key];
        }
        params.forEach(function(param) {
          if (param.forEach)
            param.forEach(function(_byte3) {
              return merged.push(_byte3);
            });
          else
            merged.push(param);
        });
        return new Uint8Array(merged);
      }
      function synch(unsynch2) {
        var bytes = [];
        var i = 0;
        while (i < unsynch2.length) {
          bytes.push(unsynch2[i]);
          if (unsynch2[i] === 255 && unsynch2[i + 1] === 0)
            i++;
          i++;
        }
        return bytes;
      }
      function unsynch(synch2) {
        var bytes = [];
        var i = 0;
        while (i < synch2.length) {
          bytes.push(synch2[i]);
          if (synch2[i] === 255 && (synch2[i + 1] >= 224 || synch2[i + 1] === 0)) {
            bytes.push(0);
          }
          i++;
        }
        return bytes;
      }
      function dataBlock(data2, max2) {
        data2 = data2 || [];
        var bytes = [];
        var length = data2.length;
        var offset = max2 - length;
        for (var i = 0; i < offset; i++) {
          bytes.push(0);
        }
        for (var _i = 0; _i < length; _i++) {
          bytes.push(data2[_i]);
        }
        return bytes;
      }
      var GENRES = ["Blues", "Classic Rock", "Country", "Dance", "Disco", "Funk", "Grunge", "Hip-Hop", "Jazz", "Metal", "New Age", "Oldies", "Other", "Pop", "R&B", "Reggae", "Rock", "Techno", "Industrial", "Alternative", "Ska", "Death Metal", "Pranks", "Soundtrack", "Euro-Techno", "Ambient", "Trip-Hop", "Vocal", "Jazz+Funk", "Fusion", "Trance", "Classical", "Instrumental", "Acid", "House", "Game", "Sound Clip", "Gospel", "Noise", "Alt. Rock", "Bass", "Soul", "Punk", "Space", "Meditative", "Instrumental Pop", "Instrumental Rock", "Ethnic", "Gothic", "Darkwave", "Techno-Industrial", "Electronic", "Pop-Folk", "Eurodance", "Dream", "Southern Rock", "Comedy", "Cult", "Gangsta Rap", "Top 40", "Christian Rap", "Pop/Funk", "Jungle", "Native American", "Cabaret", "New Wave", "Psychedelic", "Rave", "Showtunes", "Trailer", "Lo-Fi", "Tribal", "Acid Punk", "Acid Jazz", "Polka", "Retro", "Musical", "Rock & Roll", "Hard Rock", "Folk", "Folk-Rock", "National Folk", "Swing", "Fast-Fusion", "Bebop", "Latin", "Revival", "Celtic", "Bluegrass", "Avantgarde", "Gothic Rock", "Progressive Rock", "Psychedelic Rock", "Symphonic Rock", "Slow Rock", "Big Band", "Chorus", "Easy Listening", "Acoustic", "Humour", "Speech", "Chanson", "Opera", "Chamber Music", "Sonata", "Symphony", "Booty Bass", "Primus", "Porn Groove", "Satire", "Slow Jam", "Club", "Tango", "Samba", "Folklore", "Ballad", "Power Ballad", "Rhythmic Soul", "Freestyle", "Duet", "Punk Rock", "Drum Solo", "A Cappella", "Euro-House", "Dance Hall", "Goa", "Drum & Bass", "Club-House", "Hardcore", "Terror", "Indie", "BritPop", "Afro-Punk", "Polsk Punk", "Beat", "Christian Gangsta Rap", "Heavy Metal", "Black Metal", "Crossover", "Contemporary Christian", "Christian Rock", "Merengue", "Salsa", "Thrash Metal", "Anime", "JPop", "Synthpop", "Abstract", "Art Rock", "Baroque", "Bhangra", "Big Beat", "Breakbeat", "Chillout", "Downtempo", "Dub", "EBM", "Eclectic", "Electro", "Electroclash", "Emo", "Experimental", "Garage", "Global", "IDM", "Illbient", "Industro-Goth", "Jam Band", "Krautrock", "Leftfield", "Lounge", "Math Rock", "New Romantic", "Nu-Breakz", "Post-Punk", "Post-Rock", "Psytrance", "Shoegaze", "Space Rock", "Trop Rock", "World Music", "Neoclassical", "Audiobook", "Audio Theatre", "Neue Deutsche Welle", "Podcast", "Indie Rock", "G-Funk", "Dubstep", "Garage Rock", "Psybient"];
      function hasID3v1(buffer) {
        var offset = buffer.byteLength - 128;
        if (offset > -1) {
          var view = new BufferView(buffer, offset);
          return view.getString(0, 3).string === "TAG";
        } else
          return false;
      }
      function decode$1(buffer) {
        var view = new BufferView(buffer, buffer.byteLength - 128);
        var title = view.getString(3, 30, "utf-8").string.replace(/\0/g, "");
        var artist = view.getString(33, 30, "utf-8").string.replace(/\0/g, "");
        var album = view.getString(63, 30, "utf-8").string.replace(/\0/g, "");
        var year2 = view.getString(93, 4, "utf-8").string.replace(/\0/g, "");
        var track = view.getUint8(126).toString() || "";
        var comment = view.getString(97, track !== null ? 28 : 30, "utf-8").string.replace(/\0/g, "");
        var genre = GENRES[view.getUint8(127)] || "";
        var tags = {
          title,
          artist,
          album,
          year: year2,
          track,
          comment,
          genre
        };
        var details = {
          version: track ? 1 : 0,
          size: 128
        };
        return {
          tags,
          details
        };
      }
      function validate$1(tags, strict) {
        var title = tags.title, artist = tags.artist, album = tags.album, year2 = tags.year, comment = tags.comment, track = tags.track, genre = tags.genre;
        if (typeof title !== "string") {
          throw new Error("Title is not a string");
        } else if (encodeString(title, "utf-8").length > 30) {
          throw new Error("Title length exceeds 30 characters");
        }
        if (typeof artist !== "string") {
          throw new Error("Artist is not a string");
        } else if (encodeString(artist, "utf-8").length > 30) {
          throw new Error("Artist length exceeds 30 characters");
        }
        if (typeof album !== "string") {
          throw new Error("Album is not a string");
        } else if (encodeString(album, "utf-8").length > 30) {
          throw new Error("Album length exceeds 30 characters");
        }
        if (typeof year2 !== "string") {
          throw new Error("Year is not a string");
        } else if (encodeString(year2, "utf-8").length > 4) {
          throw new Error("Year length exceeds 4 characters");
        }
        if (typeof comment !== "string") {
          throw new Error("Comment is not a string");
        }
        if (typeof track !== "string") {
          throw new Error("Track is not a string");
        } else if (parseInt(track) > 255 || parseInt(track) < 0) {
          throw new Error("Track should be in range 255 - 0");
        }
        if (track !== "") {
          if (encodeString(comment, "utf-8").length > 28) {
            throw new Error("Comment length exceeds 28 characters");
          }
        } else if (encodeString(comment, "utf-8").length > 30) {
          throw new Error("Comment length exceeds 30 characters");
        }
        if (typeof genre !== "string") {
          throw new Error("Genre is not a string");
        } else if (strict && !GENRES.includes(genre) && genre !== "") {
          throw new Error("Unknown genre");
        }
        return true;
      }
      function encode$1(tags) {
        var title = tags.title, artist = tags.artist, album = tags.album, year2 = tags.year, comment = tags.comment, track = tags.track, genre = tags.genre;
        title = encodeString(title, "utf-8");
        artist = encodeString(artist, "utf-8");
        album = encodeString(album, "utf-8");
        year2 = encodeString(year2, "utf-8");
        comment = encodeString(comment, "utf-8");
        genre = GENRES.indexOf(genre);
        while (title.length < 30) {
          title.push(0);
        }
        while (artist.length < 30) {
          artist.push(0);
        }
        while (album.length < 30) {
          album.push(0);
        }
        while (year2.length < 4) {
          year2.push(0);
        }
        if (track !== "") {
          while (comment.length < 28) {
            comment.push(0);
          }
          comment.push(0, parseInt(track));
        } else {
          while (comment.length < 30) {
            comment.push(0);
          }
        }
        return mergeBytes(84, 65, 71, title, artist, album, year2, comment, genre > -1 ? genre : 12).buffer;
      }
      var makeBuiltIn = makeBuiltIn$3.exports;
      var defineProperty$3 = objectDefineProperty;
      var defineBuiltInAccessor$2 = function(target, name, descriptor) {
        if (descriptor.get)
          makeBuiltIn(descriptor.get, name, {
            getter: true
          });
        if (descriptor.set)
          makeBuiltIn(descriptor.set, name, {
            setter: true
          });
        return defineProperty$3.f(target, name, descriptor);
      };
      var global$5 = global$u;
      var DESCRIPTORS$4 = descriptors;
      var defineBuiltInAccessor$1 = defineBuiltInAccessor$2;
      var regExpFlags = regexpFlags$1;
      var fails$5 = fails$D;
      var RegExp$1 = global$5.RegExp;
      var RegExpPrototype$2 = RegExp$1.prototype;
      var FORCED$1 = DESCRIPTORS$4 && fails$5(function() {
        var INDICES_SUPPORT = true;
        try {
          RegExp$1(".", "d");
        } catch (error) {
          INDICES_SUPPORT = false;
        }
        var O = {};
        var calls = "";
        var expected = INDICES_SUPPORT ? "dgimsy" : "gimsy";
        var addGetter2 = function(key3, chr) {
          Object.defineProperty(O, key3, {
            get: function() {
              calls += chr;
              return true;
            }
          });
        };
        var pairs = {
          dotAll: "s",
          global: "g",
          ignoreCase: "i",
          multiline: "m",
          sticky: "y"
        };
        if (INDICES_SUPPORT)
          pairs.hasIndices = "d";
        for (var key2 in pairs)
          addGetter2(key2, pairs[key2]);
        var result = Object.getOwnPropertyDescriptor(RegExpPrototype$2, "flags").get.call(O);
        return result !== expected || calls !== expected;
      });
      if (FORCED$1)
        defineBuiltInAccessor$1(RegExpPrototype$2, "flags", {
          configurable: true,
          get: regExpFlags
        });
      var $$9 = _export;
      var uncurryThis$4 = functionUncurryThis;
      var notARegExp = notARegexp;
      var requireObjectCoercible$1 = requireObjectCoercible$9;
      var toString$5 = toString$e;
      var correctIsRegExpLogic = correctIsRegexpLogic;
      var stringIndexOf$1 = uncurryThis$4("".indexOf);
      $$9({
        target: "String",
        proto: true,
        forced: !correctIsRegExpLogic("includes")
      }, {
        includes: function includes2(searchString) {
          return !!~stringIndexOf$1(toString$5(requireObjectCoercible$1(this)), toString$5(notARegExp(searchString)), arguments.length > 1 ? arguments[1] : void 0);
        }
      });
      var $$8 = _export;
      var toObject$1 = toObject$b;
      var nativeKeys = objectKeys$2;
      var fails$4 = fails$D;
      var FAILS_ON_PRIMITIVES = fails$4(function() {
        nativeKeys(1);
      });
      $$8({
        target: "Object",
        stat: true,
        forced: FAILS_ON_PRIMITIVES
      }, {
        keys: function keys2(it) {
          return nativeKeys(toObject$1(it));
        }
      });
      function getHeaderFlags(_byte, version2) {
        var flags = {};
        switch (version2) {
          case 3:
            flags.unsynchronisation = isBitSet(_byte, 7);
            flags.extendedHeader = isBitSet(_byte, 6);
            flags.experimentalIndicator = isBitSet(_byte, 5);
            break;
          case 4:
            flags.unsynchronisation = isBitSet(_byte, 7);
            flags.extendedHeader = isBitSet(_byte, 6);
            flags.experimentalIndicator = isBitSet(_byte, 5);
            flags.footerPresent = isBitSet(_byte, 4);
            break;
        }
        return flags;
      }
      function getFrameFlags(bytes, version2) {
        var flags = {};
        switch (version2) {
          case 3:
            flags.tagAlterPreservation = isBitSet(bytes[0], 7);
            flags.fileAlterPreservation = isBitSet(bytes[0], 6);
            flags.readOnly = isBitSet(bytes[0], 5);
            flags.compression = isBitSet(bytes[1], 7);
            flags.encryption = isBitSet(bytes[1], 6);
            flags.groupingIdentity = isBitSet(bytes[1], 5);
            break;
          case 4:
            flags.tagAlterPreservation = isBitSet(bytes[0], 6);
            flags.fileAlterPreservation = isBitSet(bytes[0], 5);
            flags.readOnly = isBitSet(bytes[0], 4);
            flags.groupingIdentity = isBitSet(bytes[1], 6);
            flags.compression = isBitSet(bytes[1], 3);
            flags.encryption = isBitSet(bytes[1], 2);
            flags.unsynchronisation = isBitSet(bytes[1], 1);
            flags.dataLengthIndicator = isBitSet(bytes[1], 0);
            break;
        }
        return flags;
      }
      var ENCODINGS = ["windows1251", "utf-16", "utf-16be", "utf-8"];
      function textFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var len = view.byteLength - 1;
        return version2 === 3 ? view.getCString(1, encoding).string.replace(/\//g, "\\\\") : view.getString(1, len, encoding).string.replace(/\0/g, "\\\\");
      }
      function setFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var len = view.byteLength - 1;
        return version2 === 3 ? view.getCString(1, encoding).string : view.getString(1, len, encoding).string.replace(/\0/g, "\\\\");
      }
      function iplsFrame$1(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var len = view.byteLength - 1;
        return view.getString(1, len, encoding).string.replace(/\0/g, "\\\\");
      }
      function urlFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        return view.getCString(0).string;
      }
      function txxxFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var description = view.getCString(1, encoding);
        var valueOffset = description.length + 1;
        var valueLength = view.byteLength - valueOffset;
        var value = view.getString(valueOffset, valueLength, encoding);
        return {
          description: description.string,
          text: value.string
        };
      }
      function wxxxFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var description = view.getCString(1, encoding);
        var urlOffset = description.length + 1;
        var urlLength = view.byteLength - urlOffset;
        var url = view.getString(urlOffset, urlLength);
        return {
          description: description.string,
          url: url.string
        };
      }
      function langDescFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var descriptor = view.getCString(4, encoding);
        var textOffset = descriptor.length + 4;
        var textLength = view.byteLength - textOffset;
        var text = view.getString(textOffset, textLength, encoding);
        return {
          language: view.getString(1, 3).string,
          descriptor: descriptor.string,
          text: text.string
        };
      }
      function apicFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var mime = view.getCString(1);
        var type = view.getUint8(mime.length + 1);
        var desc = view.getCString(mime.length + 2, encoding);
        var dataOffset = mime.length + desc.length + 2;
        var dataLength = view.byteLength - dataOffset;
        var data2 = view.getUint8(dataOffset, dataLength);
        return {
          format: mime.string,
          type,
          description: desc.string,
          data: data2
        };
      }
      function geobFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var mime = view.getCString(1);
        var fname = view.getCString(mime.length + 1, encoding);
        var desc = view.getCString(fname.length + mime.length + 1, encoding);
        var binOffset = mime.length + fname.length + desc.length + 1;
        var binLength = view.byteLength - binOffset;
        var object = view.getUint8(binOffset, binLength);
        return {
          format: mime.string,
          filename: fname.string,
          description: desc.string,
          object
        };
      }
      function ufidFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var ownerId = view.getCString(0);
        var id2 = view.getUint8(ownerId.length, view.byteLength - ownerId.length);
        return {
          ownerId: ownerId.string,
          id: id2
        };
      }
      function userFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        return {
          language: view.getString(1, 3).string,
          text: view.getString(4, view.byteLength - 4, encoding).string
        };
      }
      function owneFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var currencyCode = view.getString(1, 3);
        var currency = view.getCString(4);
        var date = view.getString(currency.length + 4, 8);
        var sellerOffset = currency.length + date.length + 4;
        var sellerLength = view.byteLength - sellerOffset;
        var seller = view.getString(sellerOffset, sellerLength, encoding);
        return {
          currencyCode: currencyCode.string,
          currencyPrice: currency.string,
          date: date.string,
          seller: seller.string
        };
      }
      function privFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var ownerId = view.getCString(0);
        var data2 = view.getUint8(ownerId.length, view.byteLength - ownerId.length);
        return {
          ownerId: ownerId.string,
          data: data2
        };
      }
      function rvadFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var incdec = view.getUint8(0);
        var bitsvolume = view.getUint8(1);
        var datablocks = [];
        var blocklength = Math.ceil(bitsvolume / 8);
        for (var i = 2; i < view.byteLength; i += blocklength) {
          datablocks.push(view.getUint8(i, blocklength));
        }
        return {
          bitsvolume,
          incdec: {
            right: isBitSet(incdec, 0),
            left: isBitSet(incdec, 1),
            rightback: isBitSet(incdec, 2),
            leftback: isBitSet(incdec, 3),
            center: isBitSet(incdec, 4),
            bass: isBitSet(incdec, 5)
          },
          volumechange: {
            right: typeof datablocks[0] !== "undefined" ? datablocks[0] : [],
            left: typeof datablocks[1] !== "undefined" ? datablocks[1] : [],
            rightback: typeof datablocks[4] !== "undefined" ? datablocks[4] : [],
            leftback: typeof datablocks[5] !== "undefined" ? datablocks[5] : [],
            center: typeof datablocks[8] !== "undefined" ? datablocks[8] : [],
            bass: typeof datablocks[10] !== "undefined" ? datablocks[10] : []
          },
          peakvolume: {
            right: typeof datablocks[2] !== "undefined" ? datablocks[2] : [],
            left: typeof datablocks[3] !== "undefined" ? datablocks[3] : [],
            rightback: typeof datablocks[6] !== "undefined" ? datablocks[6] : [],
            leftback: typeof datablocks[7] !== "undefined" ? datablocks[7] : [],
            center: typeof datablocks[9] !== "undefined" ? datablocks[9] : [],
            bass: typeof datablocks[11] !== "undefined" ? datablocks[11] : []
          }
        };
      }
      function rva2Frame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var identification = view.getCString(0);
        var channels = [];
        var read = identification.length;
        while (read < view.byteLength) {
          var type = view.getUint8(read);
          var volumeadjust = view.getInt16(read + 1, true);
          var bitspeak = view.getUint8(read + 3);
          var length = Math.ceil(bitspeak / 8);
          var peakvolume = view.getUint8(read + 4, length);
          channels.push({
            type,
            volumeadjust,
            bitspeak,
            peakvolume: Array.isArray(peakvolume) ? peakvolume : [peakvolume]
          });
          read += 4 + length;
        }
        return {
          identification: identification.string,
          channels
        };
      }
      function signFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        return {
          group: view.getUint8(0),
          signature: view.getUint8(1, view.byteLength - 1)
        };
      }
      function seekFrame(buffer, version2) {
        var view = new BufferView(buffer);
        return view.getUint32(0);
      }
      function syltFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var language = view.getString(1, 3).string;
        var format = view.getUint8(4);
        var type = view.getUint8(5);
        var descriptor = view.getCString(6, encoding);
        var lyricsOffset = descriptor.length + 6;
        var lyricsLength = view.byteLength - lyricsOffset;
        var lyrics = view.getUint8(lyricsOffset, lyricsLength);
        var text = "";
        for (var i = 0; i < lyrics.length; i += 4) {
          var lyricsView = new BufferView(lyrics);
          var line = lyricsView.getCString(i);
          var time = lyricsView.getUint32(i + line.length);
          var minutes = Math.floor(time / 6e4).toString();
          var seconds = Math.floor(time % 6e4 / 1e3).toString();
          seconds = seconds.length === 1 ? "0" + seconds : seconds;
          var ms = (time % 1e3).toString();
          while (ms.length < 3) {
            ms = "0" + ms;
          }
          text += "[".concat(minutes, ":").concat(seconds, ".").concat(ms, "] ").concat(line.string);
          i += line.length;
        }
        return {
          language,
          format,
          type,
          descriptor: descriptor.string,
          lyrics: text
        };
      }
      function mcdiFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        return {
          data: view.getUint8(0, view.byteLength)
        };
      }
      function sytcFrame$2(buffer, version2) {
        var view = new BufferView(buffer);
        return {
          format: view.getUint8(0),
          data: view.getUint8(1, view.byteLength - 1)
        };
      }
      function win1251Frame$1(buffer, version2) {
        var view = new BufferView(buffer);
        var encoding = ENCODINGS[view.getUint8(0)];
        var length = view.byteLength - 1;
        return view.getString(1, length, encoding).string;
      }
      var call$4 = functionCall;
      var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
      var anObject$2 = anObject$g;
      var isNullOrUndefined = isNullOrUndefined$7;
      var toLength = toLength$a;
      var toString$4 = toString$e;
      var requireObjectCoercible = requireObjectCoercible$9;
      var getMethod = getMethod$5;
      var advanceStringIndex = advanceStringIndex$3;
      var regExpExec = regexpExecAbstract;
      fixRegExpWellKnownSymbolLogic("match", function(MATCH2, nativeMatch, maybeCallNative) {
        return [
          // `String.prototype.match` method
          // https://tc39.es/ecma262/#sec-string.prototype.match
          function match2(regexp2) {
            var O = requireObjectCoercible(this);
            var matcher = isNullOrUndefined(regexp2) ? void 0 : getMethod(regexp2, MATCH2);
            return matcher ? call$4(matcher, regexp2, O) : new RegExp(regexp2)[MATCH2](toString$4(O));
          },
          // `RegExp.prototype[@@match]` method
          // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
          function(string) {
            var rx = anObject$2(this);
            var S = toString$4(string);
            var res = maybeCallNative(nativeMatch, rx, S);
            if (res.done)
              return res.value;
            if (!rx.global)
              return regExpExec(rx, S);
            var fullUnicode = rx.unicode;
            rx.lastIndex = 0;
            var A = [];
            var n = 0;
            var result;
            while ((result = regExpExec(rx, S)) !== null) {
              var matchStr = toString$4(result[0]);
              A[n] = matchStr;
              if (matchStr === "")
                rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
              n++;
            }
            return n === 0 ? null : A;
          }
        ];
      });
      var objectGetOwnPropertyNamesExternal = {};
      var classof$1 = classofRaw$1;
      var toIndexedObject$1 = toIndexedObject$a;
      var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
      var arraySlice$1 = arraySliceSimple;
      var windowNames = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
      var getWindowNames = function(it) {
        try {
          return $getOwnPropertyNames$1(it);
        } catch (error) {
          return arraySlice$1(windowNames);
        }
      };
      objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames2(it) {
        return windowNames && classof$1(it) == "Window" ? getWindowNames(it) : $getOwnPropertyNames$1(toIndexedObject$1(it));
      };
      var wellKnownSymbolWrapped = {};
      var wellKnownSymbol$3 = wellKnownSymbol$q;
      wellKnownSymbolWrapped.f = wellKnownSymbol$3;
      var global$4 = global$u;
      var path$1 = global$4;
      var path = path$1;
      var hasOwn$5 = hasOwnProperty_1;
      var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
      var defineProperty$2 = objectDefineProperty.f;
      var wellKnownSymbolDefine = function(NAME2) {
        var Symbol2 = path.Symbol || (path.Symbol = {});
        if (!hasOwn$5(Symbol2, NAME2))
          defineProperty$2(Symbol2, NAME2, {
            value: wrappedWellKnownSymbolModule$1.f(NAME2)
          });
      };
      var call$3 = functionCall;
      var getBuiltIn$2 = getBuiltIn$9;
      var wellKnownSymbol$2 = wellKnownSymbol$q;
      var defineBuiltIn$2 = defineBuiltIn$c;
      var symbolDefineToPrimitive = function() {
        var Symbol2 = getBuiltIn$2("Symbol");
        var SymbolPrototype2 = Symbol2 && Symbol2.prototype;
        var valueOf = SymbolPrototype2 && SymbolPrototype2.valueOf;
        var TO_PRIMITIVE2 = wellKnownSymbol$2("toPrimitive");
        if (SymbolPrototype2 && !SymbolPrototype2[TO_PRIMITIVE2]) {
          defineBuiltIn$2(SymbolPrototype2, TO_PRIMITIVE2, function(hint) {
            return call$3(valueOf, this);
          }, {
            arity: 1
          });
        }
      };
      var $$7 = _export;
      var global$3 = global$u;
      var call$2 = functionCall;
      var uncurryThis$3 = functionUncurryThis;
      var DESCRIPTORS$3 = descriptors;
      var NATIVE_SYMBOL$4 = symbolConstructorDetection;
      var fails$3 = fails$D;
      var hasOwn$4 = hasOwnProperty_1;
      var isPrototypeOf$2 = objectIsPrototypeOf;
      var anObject$1 = anObject$g;
      var toIndexedObject = toIndexedObject$a;
      var toPropertyKey = toPropertyKey$5;
      var $toString = toString$e;
      var createPropertyDescriptor = createPropertyDescriptor$6;
      var nativeObjectCreate = objectCreate;
      var objectKeys = objectKeys$2;
      var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
      var getOwnPropertyNamesExternal = objectGetOwnPropertyNamesExternal;
      var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
      var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
      var definePropertyModule = objectDefineProperty;
      var definePropertiesModule = objectDefineProperties;
      var propertyIsEnumerableModule = objectPropertyIsEnumerable;
      var defineBuiltIn$1 = defineBuiltIn$c;
      var shared$2 = shared$7.exports;
      var sharedKey = sharedKey$4;
      var hiddenKeys = hiddenKeys$5;
      var uid = uid$4;
      var wellKnownSymbol$1 = wellKnownSymbol$q;
      var wrappedWellKnownSymbolModule = wellKnownSymbolWrapped;
      var defineWellKnownSymbol = wellKnownSymbolDefine;
      var defineSymbolToPrimitive = symbolDefineToPrimitive;
      var setToStringTag = setToStringTag$4;
      var InternalStateModule = internalState;
      var $forEach = arrayIteration.forEach;
      var HIDDEN = sharedKey("hidden");
      var SYMBOL = "Symbol";
      var PROTOTYPE = "prototype";
      var setInternalState = InternalStateModule.set;
      var getInternalState$1 = InternalStateModule.getterFor(SYMBOL);
      var ObjectPrototype = Object[PROTOTYPE];
      var $Symbol = global$3.Symbol;
      var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE];
      var TypeError$1 = global$3.TypeError;
      var QObject = global$3.QObject;
      var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
      var nativeDefineProperty = definePropertyModule.f;
      var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
      var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
      var push = uncurryThis$3([].push);
      var AllSymbols = shared$2("symbols");
      var ObjectPrototypeSymbols = shared$2("op-symbols");
      var WellKnownSymbolsStore = shared$2("wks");
      var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
      var setSymbolDescriptor = DESCRIPTORS$3 && fails$3(function() {
        return nativeObjectCreate(nativeDefineProperty({}, "a", {
          get: function() {
            return nativeDefineProperty(this, "a", {
              value: 7
            }).a;
          }
        })).a != 7;
      }) ? function(O, P, Attributes) {
        var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
        if (ObjectPrototypeDescriptor)
          delete ObjectPrototype[P];
        nativeDefineProperty(O, P, Attributes);
        if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
          nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
        }
      } : nativeDefineProperty;
      var wrap = function(tag, description) {
        var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype$1);
        setInternalState(symbol, {
          type: SYMBOL,
          tag,
          description
        });
        if (!DESCRIPTORS$3)
          symbol.description = description;
        return symbol;
      };
      var $defineProperty = function defineProperty2(O, P, Attributes) {
        if (O === ObjectPrototype)
          $defineProperty(ObjectPrototypeSymbols, P, Attributes);
        anObject$1(O);
        var key2 = toPropertyKey(P);
        anObject$1(Attributes);
        if (hasOwn$4(AllSymbols, key2)) {
          if (!Attributes.enumerable) {
            if (!hasOwn$4(O, HIDDEN))
              nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
            O[HIDDEN][key2] = true;
          } else {
            if (hasOwn$4(O, HIDDEN) && O[HIDDEN][key2])
              O[HIDDEN][key2] = false;
            Attributes = nativeObjectCreate(Attributes, {
              enumerable: createPropertyDescriptor(0, false)
            });
          }
          return setSymbolDescriptor(O, key2, Attributes);
        }
        return nativeDefineProperty(O, key2, Attributes);
      };
      var $defineProperties = function defineProperties2(O, Properties) {
        anObject$1(O);
        var properties = toIndexedObject(Properties);
        var keys2 = objectKeys(properties).concat($getOwnPropertySymbols(properties));
        $forEach(keys2, function(key2) {
          if (!DESCRIPTORS$3 || call$2($propertyIsEnumerable, properties, key2))
            $defineProperty(O, key2, properties[key2]);
        });
        return O;
      };
      var $create = function create2(O, Properties) {
        return Properties === void 0 ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
      };
      var $propertyIsEnumerable = function propertyIsEnumerable(V) {
        var P = toPropertyKey(V);
        var enumerable = call$2(nativePropertyIsEnumerable, this, P);
        if (this === ObjectPrototype && hasOwn$4(AllSymbols, P) && !hasOwn$4(ObjectPrototypeSymbols, P))
          return false;
        return enumerable || !hasOwn$4(this, P) || !hasOwn$4(AllSymbols, P) || hasOwn$4(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
      };
      var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor2(O, P) {
        var it = toIndexedObject(O);
        var key2 = toPropertyKey(P);
        if (it === ObjectPrototype && hasOwn$4(AllSymbols, key2) && !hasOwn$4(ObjectPrototypeSymbols, key2))
          return;
        var descriptor = nativeGetOwnPropertyDescriptor(it, key2);
        if (descriptor && hasOwn$4(AllSymbols, key2) && !(hasOwn$4(it, HIDDEN) && it[HIDDEN][key2])) {
          descriptor.enumerable = true;
        }
        return descriptor;
      };
      var $getOwnPropertyNames = function getOwnPropertyNames2(O) {
        var names = nativeGetOwnPropertyNames(toIndexedObject(O));
        var result = [];
        $forEach(names, function(key2) {
          if (!hasOwn$4(AllSymbols, key2) && !hasOwn$4(hiddenKeys, key2))
            push(result, key2);
        });
        return result;
      };
      var $getOwnPropertySymbols = function(O) {
        var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
        var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
        var result = [];
        $forEach(names, function(key2) {
          if (hasOwn$4(AllSymbols, key2) && (!IS_OBJECT_PROTOTYPE || hasOwn$4(ObjectPrototype, key2))) {
            push(result, AllSymbols[key2]);
          }
        });
        return result;
      };
      if (!NATIVE_SYMBOL$4) {
        $Symbol = function Symbol2() {
          if (isPrototypeOf$2(SymbolPrototype$1, this))
            throw TypeError$1("Symbol is not a constructor");
          var description = !arguments.length || arguments[0] === void 0 ? void 0 : $toString(arguments[0]);
          var tag = uid(description);
          var setter = function(value) {
            if (this === ObjectPrototype)
              call$2(setter, ObjectPrototypeSymbols, value);
            if (hasOwn$4(this, HIDDEN) && hasOwn$4(this[HIDDEN], tag))
              this[HIDDEN][tag] = false;
            setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
          };
          if (DESCRIPTORS$3 && USE_SETTER)
            setSymbolDescriptor(ObjectPrototype, tag, {
              configurable: true,
              set: setter
            });
          return wrap(tag, description);
        };
        SymbolPrototype$1 = $Symbol[PROTOTYPE];
        defineBuiltIn$1(SymbolPrototype$1, "toString", function toString2() {
          return getInternalState$1(this).tag;
        });
        defineBuiltIn$1($Symbol, "withoutSetter", function(description) {
          return wrap(uid(description), description);
        });
        propertyIsEnumerableModule.f = $propertyIsEnumerable;
        definePropertyModule.f = $defineProperty;
        definePropertiesModule.f = $defineProperties;
        getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
        getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
        getOwnPropertySymbolsModule$1.f = $getOwnPropertySymbols;
        wrappedWellKnownSymbolModule.f = function(name) {
          return wrap(wellKnownSymbol$1(name), name);
        };
        if (DESCRIPTORS$3) {
          nativeDefineProperty(SymbolPrototype$1, "description", {
            configurable: true,
            get: function description() {
              return getInternalState$1(this).description;
            }
          });
          {
            defineBuiltIn$1(ObjectPrototype, "propertyIsEnumerable", $propertyIsEnumerable, {
              unsafe: true
            });
          }
        }
      }
      $$7({
        global: true,
        constructor: true,
        wrap: true,
        forced: !NATIVE_SYMBOL$4,
        sham: !NATIVE_SYMBOL$4
      }, {
        Symbol: $Symbol
      });
      $forEach(objectKeys(WellKnownSymbolsStore), function(name) {
        defineWellKnownSymbol(name);
      });
      $$7({
        target: SYMBOL,
        stat: true,
        forced: !NATIVE_SYMBOL$4
      }, {
        useSetter: function() {
          USE_SETTER = true;
        },
        useSimple: function() {
          USE_SETTER = false;
        }
      });
      $$7({
        target: "Object",
        stat: true,
        forced: !NATIVE_SYMBOL$4,
        sham: !DESCRIPTORS$3
      }, {
        // `Object.create` method
        // https://tc39.es/ecma262/#sec-object.create
        create: $create,
        // `Object.defineProperty` method
        // https://tc39.es/ecma262/#sec-object.defineproperty
        defineProperty: $defineProperty,
        // `Object.defineProperties` method
        // https://tc39.es/ecma262/#sec-object.defineproperties
        defineProperties: $defineProperties,
        // `Object.getOwnPropertyDescriptor` method
        // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
        getOwnPropertyDescriptor: $getOwnPropertyDescriptor
      });
      $$7({
        target: "Object",
        stat: true,
        forced: !NATIVE_SYMBOL$4
      }, {
        // `Object.getOwnPropertyNames` method
        // https://tc39.es/ecma262/#sec-object.getownpropertynames
        getOwnPropertyNames: $getOwnPropertyNames
      });
      defineSymbolToPrimitive();
      setToStringTag($Symbol, SYMBOL);
      hiddenKeys[HIDDEN] = true;
      var NATIVE_SYMBOL$3 = symbolConstructorDetection;
      var symbolRegistryDetection = NATIVE_SYMBOL$3 && !!Symbol["for"] && !!Symbol.keyFor;
      var $$6 = _export;
      var getBuiltIn$1 = getBuiltIn$9;
      var hasOwn$3 = hasOwnProperty_1;
      var toString$3 = toString$e;
      var shared$1 = shared$7.exports;
      var NATIVE_SYMBOL_REGISTRY$1 = symbolRegistryDetection;
      var StringToSymbolRegistry = shared$1("string-to-symbol-registry");
      var SymbolToStringRegistry$1 = shared$1("symbol-to-string-registry");
      $$6({
        target: "Symbol",
        stat: true,
        forced: !NATIVE_SYMBOL_REGISTRY$1
      }, {
        "for": function(key2) {
          var string = toString$3(key2);
          if (hasOwn$3(StringToSymbolRegistry, string))
            return StringToSymbolRegistry[string];
          var symbol = getBuiltIn$1("Symbol")(string);
          StringToSymbolRegistry[string] = symbol;
          SymbolToStringRegistry$1[symbol] = string;
          return symbol;
        }
      });
      var $$5 = _export;
      var hasOwn$2 = hasOwnProperty_1;
      var isSymbol$1 = isSymbol$5;
      var tryToString = tryToString$6;
      var shared = shared$7.exports;
      var NATIVE_SYMBOL_REGISTRY = symbolRegistryDetection;
      var SymbolToStringRegistry = shared("symbol-to-string-registry");
      $$5({
        target: "Symbol",
        stat: true,
        forced: !NATIVE_SYMBOL_REGISTRY
      }, {
        keyFor: function keyFor(sym) {
          if (!isSymbol$1(sym))
            throw TypeError(tryToString(sym) + " is not a symbol");
          if (hasOwn$2(SymbolToStringRegistry, sym))
            return SymbolToStringRegistry[sym];
        }
      });
      var $$4 = _export;
      var getBuiltIn = getBuiltIn$9;
      var apply = functionApply;
      var call$1 = functionCall;
      var uncurryThis$2 = functionUncurryThis;
      var fails$2 = fails$D;
      var isArray = isArray$5;
      var isCallable$2 = isCallable$n;
      var isObject = isObject$f;
      var isSymbol = isSymbol$5;
      var arraySlice = arraySlice$5;
      var NATIVE_SYMBOL$2 = symbolConstructorDetection;
      var $stringify = getBuiltIn("JSON", "stringify");
      var exec$1 = uncurryThis$2(/./.exec);
      var charAt$1 = uncurryThis$2("".charAt);
      var charCodeAt = uncurryThis$2("".charCodeAt);
      var replace$2 = uncurryThis$2("".replace);
      var numberToString = uncurryThis$2(1 .toString);
      var tester = /[\uD800-\uDFFF]/g;
      var low = /^[\uD800-\uDBFF]$/;
      var hi = /^[\uDC00-\uDFFF]$/;
      var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL$2 || fails$2(function() {
        var symbol = getBuiltIn("Symbol")();
        return $stringify([symbol]) != "[null]" || $stringify({
          a: symbol
        }) != "{}" || $stringify(Object(symbol)) != "{}";
      });
      var ILL_FORMED_UNICODE = fails$2(function() {
        return $stringify("\uDF06\uD834") !== '"\\udf06\\ud834"' || $stringify("\uDEAD") !== '"\\udead"';
      });
      var stringifyWithSymbolsFix = function(it, replacer) {
        var args = arraySlice(arguments);
        var $replacer = replacer;
        if (!isObject(replacer) && it === void 0 || isSymbol(it))
          return;
        if (!isArray(replacer))
          replacer = function(key2, value) {
            if (isCallable$2($replacer))
              value = call$1($replacer, this, key2, value);
            if (!isSymbol(value))
              return value;
          };
        args[1] = replacer;
        return apply($stringify, null, args);
      };
      var fixIllFormed = function(match2, offset, string) {
        var prev = charAt$1(string, offset - 1);
        var next = charAt$1(string, offset + 1);
        if (exec$1(low, match2) && !exec$1(hi, next) || exec$1(hi, match2) && !exec$1(low, prev)) {
          return "\\u" + numberToString(charCodeAt(match2, 0), 16);
        }
        return match2;
      };
      if ($stringify) {
        $$4({
          target: "JSON",
          stat: true,
          arity: 3,
          forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE
        }, {
          // eslint-disable-next-line no-unused-vars -- required for `.length`
          stringify: function stringify(it, replacer, space) {
            var args = arraySlice(arguments);
            var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
            return ILL_FORMED_UNICODE && typeof result == "string" ? replace$2(result, tester, fixIllFormed) : result;
          }
        });
      }
      var $$3 = _export;
      var NATIVE_SYMBOL$1 = symbolConstructorDetection;
      var fails$1 = fails$D;
      var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
      var toObject = toObject$b;
      var FORCED = !NATIVE_SYMBOL$1 || fails$1(function() {
        getOwnPropertySymbolsModule.f(1);
      });
      $$3({
        target: "Object",
        stat: true,
        forced: FORCED
      }, {
        getOwnPropertySymbols: function getOwnPropertySymbols(it) {
          var $getOwnPropertySymbols2 = getOwnPropertySymbolsModule.f;
          return $getOwnPropertySymbols2 ? $getOwnPropertySymbols2(toObject(it)) : [];
        }
      });
      var $$2 = _export;
      var DESCRIPTORS$2 = descriptors;
      var global$2 = global$u;
      var uncurryThis$1 = functionUncurryThis;
      var hasOwn$1 = hasOwnProperty_1;
      var isCallable$1 = isCallable$n;
      var isPrototypeOf$1 = objectIsPrototypeOf;
      var toString$2 = toString$e;
      var defineProperty$1 = objectDefineProperty.f;
      var copyConstructorProperties = copyConstructorProperties$2;
      var NativeSymbol = global$2.Symbol;
      var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;
      if (DESCRIPTORS$2 && isCallable$1(NativeSymbol) && (!("description" in SymbolPrototype) || // Safari 12 bug
      NativeSymbol().description !== void 0)) {
        var EmptyStringDescriptionStore = {};
        var SymbolWrapper = function Symbol2() {
          var description = arguments.length < 1 || arguments[0] === void 0 ? void 0 : toString$2(arguments[0]);
          var result = isPrototypeOf$1(SymbolPrototype, this) ? new NativeSymbol(description) : description === void 0 ? NativeSymbol() : NativeSymbol(description);
          if (description === "")
            EmptyStringDescriptionStore[result] = true;
          return result;
        };
        copyConstructorProperties(SymbolWrapper, NativeSymbol);
        SymbolWrapper.prototype = SymbolPrototype;
        SymbolPrototype.constructor = SymbolWrapper;
        var NATIVE_SYMBOL = String(NativeSymbol("test")) == "Symbol(test)";
        var thisSymbolValue = uncurryThis$1(SymbolPrototype.valueOf);
        var symbolDescriptiveString = uncurryThis$1(SymbolPrototype.toString);
        var regexp = /^Symbol\((.*)\)[^)]+$/;
        var replace$1 = uncurryThis$1("".replace);
        var stringSlice$1 = uncurryThis$1("".slice);
        defineProperty$1(SymbolPrototype, "description", {
          configurable: true,
          get: function description() {
            var symbol = thisSymbolValue(this);
            if (hasOwn$1(EmptyStringDescriptionStore, symbol))
              return "";
            var string = symbolDescriptiveString(symbol);
            var desc = NATIVE_SYMBOL ? stringSlice$1(string, 7, -1) : replace$1(string, regexp, "$1");
            return desc === "" ? void 0 : desc;
          }
        });
        $$2({
          global: true,
          constructor: true,
          forced: true
        }, {
          Symbol: SymbolWrapper
        });
      }
      var $$1 = _export;
      var $every = arrayIteration.every;
      var arrayMethodIsStrict = arrayMethodIsStrict$4;
      var STRICT_METHOD = arrayMethodIsStrict("every");
      $$1({
        target: "Array",
        proto: true,
        forced: !STRICT_METHOD
      }, {
        every: function every(callbackfn) {
          return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
      var $2 = _export;
      var call = functionCall;
      var isCallable = isCallable$n;
      var anObject = anObject$g;
      var toString$1 = toString$e;
      var DELEGATES_TO_EXEC = function() {
        var execCalled = false;
        var re = /[ac]/;
        re.exec = function() {
          execCalled = true;
          return /./.exec.apply(this, arguments);
        };
        return re.test("abc") === true && execCalled;
      }();
      var nativeTest = /./.test;
      $2({
        target: "RegExp",
        proto: true,
        forced: !DELEGATES_TO_EXEC
      }, {
        test: function(S) {
          var R = anObject(this);
          var string = toString$1(S);
          var exec2 = R.exec;
          if (!isCallable(exec2))
            return call(nativeTest, R, string);
          var result = call(exec2, R, string);
          if (result === null)
            return false;
          anObject(result);
          return true;
        }
      });
      var defineProperty = objectDefineProperty.f;
      var proxyAccessor$1 = function(Target, Source, key2) {
        key2 in Target || defineProperty(Target, key2, {
          configurable: true,
          get: function() {
            return Source[key2];
          },
          set: function(it) {
            Source[key2] = it;
          }
        });
      };
      var DESCRIPTORS$1 = descriptors;
      var global$1 = global$u;
      var uncurryThis = functionUncurryThis;
      var isForced = isForced_1;
      var inheritIfRequired = inheritIfRequired$2;
      var createNonEnumerableProperty = createNonEnumerableProperty$9;
      var getOwnPropertyNames = objectGetOwnPropertyNames.f;
      var isPrototypeOf = objectIsPrototypeOf;
      var isRegExp = isRegexp;
      var toString = toString$e;
      var getRegExpFlags = regexpGetFlags;
      var stickyHelpers = regexpStickyHelpers;
      var proxyAccessor = proxyAccessor$1;
      var defineBuiltIn = defineBuiltIn$c;
      var fails = fails$D;
      var hasOwn = hasOwnProperty_1;
      var enforceInternalState = internalState.enforce;
      var setSpecies = setSpecies$3;
      var wellKnownSymbol = wellKnownSymbol$q;
      var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
      var UNSUPPORTED_NCG = regexpUnsupportedNcg;
      var MATCH = wellKnownSymbol("match");
      var NativeRegExp = global$1.RegExp;
      var RegExpPrototype$1 = NativeRegExp.prototype;
      var SyntaxError = global$1.SyntaxError;
      var exec = uncurryThis(RegExpPrototype$1.exec);
      var charAt = uncurryThis("".charAt);
      var replace = uncurryThis("".replace);
      var stringIndexOf = uncurryThis("".indexOf);
      var stringSlice = uncurryThis("".slice);
      var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
      var re1 = /a/g;
      var re2 = /a/g;
      var CORRECT_NEW = new NativeRegExp(re1) !== re1;
      var MISSED_STICKY$1 = stickyHelpers.MISSED_STICKY;
      var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
      var BASE_FORCED = DESCRIPTORS$1 && (!CORRECT_NEW || MISSED_STICKY$1 || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails(function() {
        re2[MATCH] = false;
        return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, "i") != "/a/i";
      }));
      var handleDotAll = function(string) {
        var length = string.length;
        var index2 = 0;
        var result = "";
        var brackets = false;
        var chr;
        for (; index2 <= length; index2++) {
          chr = charAt(string, index2);
          if (chr === "\\") {
            result += chr + charAt(string, ++index2);
            continue;
          }
          if (!brackets && chr === ".") {
            result += "[\\s\\S]";
          } else {
            if (chr === "[") {
              brackets = true;
            } else if (chr === "]") {
              brackets = false;
            }
            result += chr;
          }
        }
        return result;
      };
      var handleNCG = function(string) {
        var length = string.length;
        var index2 = 0;
        var result = "";
        var named = [];
        var names = {};
        var brackets = false;
        var ncg = false;
        var groupid = 0;
        var groupname = "";
        var chr;
        for (; index2 <= length; index2++) {
          chr = charAt(string, index2);
          if (chr === "\\") {
            chr = chr + charAt(string, ++index2);
          } else if (chr === "]") {
            brackets = false;
          } else if (!brackets)
            switch (true) {
              case chr === "[":
                brackets = true;
                break;
              case chr === "(":
                if (exec(IS_NCG, stringSlice(string, index2 + 1))) {
                  index2 += 2;
                  ncg = true;
                }
                result += chr;
                groupid++;
                continue;
              case (chr === ">" && ncg):
                if (groupname === "" || hasOwn(names, groupname)) {
                  throw new SyntaxError("Invalid capture group name");
                }
                names[groupname] = true;
                named[named.length] = [groupname, groupid];
                ncg = false;
                groupname = "";
                continue;
            }
          if (ncg)
            groupname += chr;
          else
            result += chr;
        }
        return [result, named];
      };
      if (isForced("RegExp", BASE_FORCED)) {
        var RegExpWrapper = function RegExp2(pattern, flags) {
          var thisIsRegExp = isPrototypeOf(RegExpPrototype$1, this);
          var patternIsRegExp = isRegExp(pattern);
          var flagsAreUndefined = flags === void 0;
          var groups = [];
          var rawPattern = pattern;
          var rawFlags, dotAll, sticky, handled, result, state;
          if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
            return pattern;
          }
          if (patternIsRegExp || isPrototypeOf(RegExpPrototype$1, pattern)) {
            pattern = pattern.source;
            if (flagsAreUndefined)
              flags = getRegExpFlags(rawPattern);
          }
          pattern = pattern === void 0 ? "" : toString(pattern);
          flags = flags === void 0 ? "" : toString(flags);
          rawPattern = pattern;
          if (UNSUPPORTED_DOT_ALL && "dotAll" in re1) {
            dotAll = !!flags && stringIndexOf(flags, "s") > -1;
            if (dotAll)
              flags = replace(flags, /s/g, "");
          }
          rawFlags = flags;
          if (MISSED_STICKY$1 && "sticky" in re1) {
            sticky = !!flags && stringIndexOf(flags, "y") > -1;
            if (sticky && UNSUPPORTED_Y)
              flags = replace(flags, /y/g, "");
          }
          if (UNSUPPORTED_NCG) {
            handled = handleNCG(pattern);
            pattern = handled[0];
            groups = handled[1];
          }
          result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$1, RegExpWrapper);
          if (dotAll || sticky || groups.length) {
            state = enforceInternalState(result);
            if (dotAll) {
              state.dotAll = true;
              state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
            }
            if (sticky)
              state.sticky = true;
            if (groups.length)
              state.groups = groups;
          }
          if (pattern !== rawPattern)
            try {
              createNonEnumerableProperty(result, "source", rawPattern === "" ? "(?:)" : rawPattern);
            } catch (error) {
            }
          return result;
        };
        for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index; ) {
          proxyAccessor(RegExpWrapper, NativeRegExp, keys[index++]);
        }
        RegExpPrototype$1.constructor = RegExpWrapper;
        RegExpWrapper.prototype = RegExpPrototype$1;
        defineBuiltIn(global$1, "RegExp", RegExpWrapper, {
          constructor: true
        });
      }
      setSpecies("RegExp");
      var DESCRIPTORS = descriptors;
      var MISSED_STICKY = regexpStickyHelpers.MISSED_STICKY;
      var classof = classofRaw$1;
      var defineBuiltInAccessor = defineBuiltInAccessor$2;
      var getInternalState = internalState.get;
      var RegExpPrototype = RegExp.prototype;
      var $TypeError = TypeError;
      if (DESCRIPTORS && MISSED_STICKY) {
        defineBuiltInAccessor(RegExpPrototype, "sticky", {
          configurable: true,
          get: function sticky() {
            if (this === RegExpPrototype)
              return void 0;
            if (classof(this) === "RegExp") {
              return !!getInternalState(this).sticky;
            }
            throw $TypeError("Incompatible receiver, RegExp required");
          }
        });
      }
      var year = "(\\d{4})";
      var month = "(0[1-9]|1[0-2])";
      var day = "(0[1-9]|1\\d|2\\d|3[0-1])";
      var hour = "(0\\d|1\\d|2[0-3])";
      var minute = "(0\\d|1\\d|2\\d|3\\d|4\\d|5\\d)";
      var second = minute;
      var timeRegex = new RegExp("^(".concat(year, "(-").concat(month, "(-").concat(day, "(T").concat(hour, "(:").concat(minute, "(:").concat(second, ")?)?)?)?)?)$"));
      function includes(array, object) {
        var included = false;
        var i = 0;
        while (i < array.length && !included) {
          if (objectEqual(array[i], object)) {
            included = true;
            break;
          } else
            i++;
        }
        return included;
      }
      function objectEqual(obj1, obj2) {
        for (var prop in obj1) {
          if (_typeof(obj1[prop]) !== _typeof(obj2[prop]))
            return false;
          switch (_typeof(obj1[prop])) {
            case "object":
              if (!objectEqual(obj1[prop], obj2[prop]))
                return false;
              break;
            case "function":
              if (typeof obj2[prop] === "undefined" || obj1[prop].toString() !== obj2[prop].toString())
                return false;
              break;
            default:
              if (obj1[prop] !== obj2[prop])
                return false;
          }
        }
        for (var _prop in obj2) {
          if (typeof obj1[_prop] === "undefined")
            return false;
        }
        return true;
      }
      function overwriteDefault(usrObj, defObj) {
        var object = {};
        for (var prop in defObj) {
          var defVal = defObj[prop];
          var usrVal = usrObj[prop];
          if (typeof usrVal === "undefined") {
            object[prop] = defVal;
            continue;
          }
          switch (_typeof(defVal)) {
            case "object":
              object[prop] = overwriteDefault(usrVal, defVal);
              break;
            default:
              object[prop] = _typeof(defVal) === _typeof(usrVal) ? usrVal : defVal;
          }
        }
        return object;
      }
      var stringRegex = /^(.*)$/;
      var setRegex = /^([0-9]+)(\/[0-9]+)?$/;
      var urlRegex = /^(https?):\/\/[^\s/$.?#]+\.[^\s]*/;
      var langRegex = /^([a-z]{3}|XXX)$/;
      var imageRegex = /(image\/[a-z0-9!#$&.+\-^_]+){0,129}/;
      var syltRegex = /^((\[\d{1,}:\d{2}\.\d{3}\]) (.*))/;
      function textFrame$1(value, version2, strict) {
        if (typeof value !== "string") {
          throw new Error("Value is not a string");
        }
        if (strict && !value.match(stringRegex)) {
          throw new Error("Newlines are not allowed");
        }
        return true;
      }
      function setFrame$1(value, version2, strict) {
        if (version2 === 3)
          value = [value];
        else if (version2 === 4)
          value = value.split("\\\\");
        value.forEach(function(set2) {
          textFrame$1(set2, version2, strict);
          if (typeof set2 !== "string" && typeof set2 !== "number") {
            throw new Error("Value is not a string/number");
          }
          var match2 = set2.match(setRegex);
          if (strict && typeof set2 === "string") {
            if (match2 === null)
              throw new Error("Invalid format (eg. 1/2)");
            var position = parseInt(match2[1]);
            var total = match2[2] ? parseInt(match2[2].substr(1)) : null;
            if (total !== null && position > total) {
              throw new Error("Position is greater then total");
            }
          }
        });
        return true;
      }
      function timeFrame(value, version2, strict) {
        if (version2 === 3)
          value = [value];
        else if (version2 === 4)
          value = value.split("\\\\");
        value.forEach(function(time) {
          textFrame$1(time, version2, strict);
          if (version2 === 3 && strict && !time.match(/^(\d{4})$/)) {
            throw new Error("Value is not 4 numeric characters");
          }
          if (version2 === 4 && strict && !time.match(timeRegex)) {
            throw new Error("Time frames must follow ISO 8601");
          }
        });
        return true;
      }
      function tkeyFrame(value, version2, strict) {
        if (version2 === 3)
          value = [value];
        else if (version2 === 4)
          value = value.split("\\\\");
        value.forEach(function(tkey) {
          textFrame$1(tkey, version2, strict);
          if (strict && !tkey.match(/^([A-Gb#mo]{1,3})$/)) {
            throw new Error("Invalid TKEY Format (eg Cbm)");
          }
        });
        return true;
      }
      function tlanFrame(value, version2, strict) {
        if (version2 === 3)
          value = [value];
        else if (version2 === 4)
          value = value.split("\\\\");
        value.forEach(function(tlan) {
          textFrame$1(tlan, version2, strict);
          if (strict && !tlan.match(langRegex)) {
            throw new Error("Language must follow ISO 639-2");
          }
        });
        return true;
      }
      function tsrcFrame(value, version2, strict) {
        if (version2 === 3)
          value = [value];
        else if (version2 === 4)
          value = value.split("\\\\");
        value.forEach(function(tsrc) {
          textFrame$1(tsrc, version2, strict);
          if (strict && !tsrc.match(/^([A-Z0-9]{12})$/)) {
            throw new Error("Invalid ISRC format");
          }
        });
        return true;
      }
      function urlFrame$1(value, version2, strict) {
        textFrame$1(value, version2, strict);
        if (strict && !value.match(urlRegex))
          throw new Error("Invalid URL");
        return true;
      }
      function txxxFrame$1(values2, version2, strict) {
        var descriptions = [];
        values2.forEach(function(value) {
          textFrame$1(value.description, version2, strict);
          textFrame$1(value.text, version2, strict);
          if (strict && includes(descriptions, value.description)) {
            throw new Error("Description should not duplicate");
          } else
            descriptions.push(value.description);
        });
        return true;
      }
      function wxxxFrame$1(values2, version2, strict) {
        var descriptions = [];
        values2.forEach(function(value) {
          textFrame$1(value.description, version2, strict);
          urlFrame$1(value.url, version2, strict);
          if (strict && includes(descriptions, value.description)) {
            throw new Error("Description should not duplicate");
          } else
            descriptions.push(value.description);
        });
        return true;
      }
      function langDescFrame$1(values2, version2, strict) {
        var langDescs = [];
        values2.forEach(function(langDesc) {
          textFrame$1(langDesc.language, version2, strict);
          textFrame$1(langDesc.descriptor, version2, strict);
          if (typeof langDesc.text !== "string") {
            throw new Error("Text is not a string");
          }
          if (strict && !langDesc.language.match(langRegex)) {
            throw new Error("Language must follow ISO 639-2");
          }
          var checkObj = {
            language: langDesc.language,
            descriptor: langDesc.descriptor
          };
          if (strict && includes(langDescs, checkObj)) {
            throw new Error("Language and descriptor should not duplicate");
          } else
            langDescs.push(checkObj);
        });
        return true;
      }
      function apicFrame$1(values2, version2, strict) {
        var descriptions = [];
        values2.forEach(function(apic) {
          textFrame$1(apic.format, version2, strict);
          textFrame$1(apic.description, version2, strict);
          if (typeof apic.type !== "number") {
            throw new Error("Type is not a number");
          }
          if (apic.type > 255 || apic.type < 0) {
            throw new Error("Type should be in range of 0 - 255");
          }
          if (!BufferView.isViewable(apic.data)) {
            throw new Error("Image data should be viewable");
          }
          if (strict) {
            if (apic.type > 21 || apic.type < 0) {
              throw new Error("Type should be in range of 0 - 21");
            }
            if (!apic.format.match(imageRegex)) {
              throw new Error("Format should be an image MIME");
            }
            if (apic.description.length > 64) {
              throw new Error("Description should not exceed 64");
            }
            if (includes(descriptions, apic.description)) {
              throw new Error("Description should not duplicate");
            } else
              descriptions.push(apic.description);
          }
        });
        return true;
      }
      function geobFrame$1(values2, version2, strict) {
        var descriptions = [];
        values2.forEach(function(geob) {
          textFrame$1(geob.format, version2, strict);
          textFrame$1(geob.filename, version2, strict);
          textFrame$1(geob.description, version2, strict);
          if (!BufferView.isViewable(geob.object)) {
            throw new Error("Object data should be viewable");
          }
          if (strict && includes(descriptions, geob.description)) {
            throw new Error("GEOB description should not duplicate");
          } else
            descriptions.push(geob.description);
        });
        return true;
      }
      function ufidFrame$1(values2, version2, strict) {
        var ownerIds = [];
        values2.forEach(function(ufid) {
          textFrame$1(ufid.ownerId, version2, strict);
          if (!BufferView.isViewable(ufid.id)) {
            throw new Error("ID should be viewable");
          }
          if (strict) {
            if (ufid.ownerId === "") {
              throw new Error("ownerId should not be blank");
            }
            var idLength = ufid.id.byteLength || ufid.id.length || 0;
            if (idLength > 64) {
              throw new Error("ID bytelength should not exceed 64 bytes");
            }
            if (includes(ownerIds, ufid.ownerId)) {
              throw new Error("ownerId should not duplicate");
            } else
              ownerIds.push(ufid.ownerId);
          }
        });
        return true;
      }
      function userFrame$1(values2, version2, strict) {
        values2.forEach(function(user) {
          textFrame$1(user.language, version2, strict);
          if (typeof user.text !== "string") {
            throw new Error("Text is not a string");
          }
          if (strict && !user.language.match(langRegex)) {
            throw new Error("Language must follow ISO 639-2");
          }
        });
        return true;
      }
      function owneFrame$1(value, version2, strict) {
        textFrame$1(value.date, version2, strict);
        textFrame$1(value.seller, version2, strict);
        textFrame$1(value.currencyCode, version2, strict);
        textFrame$1(value.currencyPrice, version2, strict);
        if (strict) {
          if (!value.date.match("".concat(year).concat(month).concat(day))) {
            throw new Error("Date is not valid (format: YYYYMMDD)");
          }
          if (!value.currencyCode.match(/^([A-Z]{3})$/)) {
            throw new Error("Currency code is not valid (eg. USD)");
          }
          if (!value.currencyPrice.match(/^(\d*)\.(\d+)$/)) {
            throw new Error("Currency price is not valid (eg. 2.00)");
          }
        }
        return true;
      }
      function privFrame$1(values2, version2, strict) {
        var contents = [];
        values2.forEach(function(priv) {
          textFrame$1(priv.ownerId, version2, strict);
          if (!BufferView.isViewable(priv.data)) {
            throw new Error("Data should be viewable");
          }
          if (strict && includes(contents, priv.data)) {
            throw new Error("Data should not duplicate");
          } else
            contents.push(priv.data);
        });
        return true;
      }
      function checkRvadData(object, props, limit, name) {
        for (var i = 0; i < props.length; i++) {
          var prop = props[i];
          var data2 = object[prop];
          if (data2) {
            if (!BufferView.isViewable(data2)) {
              throw new Error("".concat(name, ".").concat(prop, " must be viewable"));
            }
            var view = new BufferView(data2);
            var length = view.byteLength;
            if (length > limit) {
              throw new Error("".concat(name, ".").concat(prop, " exceeds bits limit"));
            }
          }
        }
      }
      function rvadFrame$1(values2, version2, strict) {
        if (_typeof(values2) !== "object") {
          throw new Error("Values must be an object");
        }
        var volumechange = values2.volumechange;
        var peakvolume = values2.peakvolume;
        var bitsvolume = values2.bitsvolume || 16;
        var limit = Math.ceil(bitsvolume / 8);
        if (bitsvolume && (bitsvolume < 0 || bitsvolume > 255)) {
          throw new Error("Bits volume should be in the range of 0 - 255");
        }
        if (strict && bitsvolume === 0) {
          throw new Error("Bits used for volume description may not be 0");
        }
        var props = ["right", "left", "rightback", "leftback", "center", "bass"];
        if (volumechange)
          checkRvadData(volumechange, props, limit, "volumechange");
        if (peakvolume)
          checkRvadData(peakvolume, props, limit, "peakvolume");
        return true;
      }
      function rva2Frame$1(values2, version2, strict) {
        var frames2 = [];
        values2.forEach(function(value) {
          if (!Array.isArray(value.channels)) {
            throw new Error("Channels should be an array");
          }
          for (var i = 0; i < value.channels.length; i++) {
            var channel = value.channels[i];
            if (typeof channel.type !== "number") {
              throw new Error("Type of channel should be a number");
            }
            if (strict && (channel.type < 0 || channel.type > 8)) {
              throw new Error("Type of channel should be in the range of 0 - 8");
            }
            if (typeof channel.volumeadjust !== "number") {
              throw new Error("Volume adjustment should be a number");
            }
            if (typeof channel.bitspeak !== "number") {
              throw new Error("Bits representing peak should be a number");
            }
            if (channel.bitspeak < 0 || channel.bitspeak > 255) {
              throw new Error("Bits representing peak should be in range of 0 - 255");
            }
            if (!BufferView.isViewable(channel.peakvolume)) {
              throw new Error("Peak volume must be viewable");
            }
            var view = new BufferView(channel.peakvolume);
            var length = view.byteLength;
            var limit = Math.ceil(channel.bitspeak / 8);
            if (length > limit) {
              throw new Error("Peak volume exceeds bits limit");
            }
          }
          var checkObj = {
            identification: value.identification
          };
          if (strict && includes(frames2, checkObj)) {
            throw new Error("RVA2 identification should be unique");
          } else
            frames2.push(checkObj);
        });
      }
      function signFrame$1(values2, version2, strict) {
        var signs = [];
        values2.forEach(function(sign) {
          if (typeof sign.group !== "number") {
            throw new Error("Group ID is not a number");
          }
          if (sign.group < 0 || sign.group > 255) {
            throw new Error("Group ID should be in the range of 0 - 255");
          }
          if (!BufferView.isViewable(sign.signature)) {
            throw new Error("Signature should be viewable");
          }
          if (strict && includes(signs, sign)) {
            throw new Error("SIGN contents should not be identical to others");
          } else
            signs.push(sign);
        });
        return true;
      }
      function syltFrame$1(values2, version2, strict) {
        var sylts = [];
        values2.forEach(function(sylt) {
          textFrame$1(sylt.language, version2, strict);
          textFrame$1(sylt.descriptor, version2, strict);
          if (typeof sylt.lyrics !== "string") {
            throw new Error("Lyrics is not a string");
          }
          if (typeof sylt.type !== "number") {
            throw new Error("Type is not a number");
          } else if (sylt.type > 255 || sylt.type < 0) {
            throw new Error("Type should be in range of 0 - 255");
          }
          if (typeof sylt.format !== "number") {
            throw new Error("Format is not a number");
          } else if (sylt.format > 255 || sylt.format < 0) {
            throw new Error("Format should be in range of 0 - 255");
          }
          if (strict) {
            if (!sylt.language.match(langRegex)) {
              throw new Error("Language must follow ISO 639-2");
            }
            if (sylt.type > 6 || sylt.type < 0) {
              throw new Error("Type should be in range of 0 - 6");
            }
            if (sylt.format > 2 || sylt.format < 1) {
              throw new Error("Format should be either 1 or 2");
            }
            if (!sylt.lyrics.split("\n").every(function(entry) {
              return syltRegex.test(entry);
            })) {
              throw new Error("Lyrics must follow this format: [mm:ss.xxx]");
            }
            var checkObj = {
              language: sylt.language,
              descriptor: sylt.descriptor
            };
            if (includes(sylts, checkObj)) {
              throw new Error("1 SYLT with same language and descriptor only");
            } else
              sylts.push(checkObj);
          }
        });
        return true;
      }
      function mcdiFrame$1(value, version2, strict) {
        if (!BufferView.isViewable(value.data)) {
          throw new Error("Data should be viewable");
        }
        return true;
      }
      function sytcFrame$1(value, version2, strict) {
        if (!BufferView.isViewable(value.data)) {
          throw new Error("Data should be viewable");
        }
        if (typeof value.format !== "number") {
          throw new Error("Format is not a number");
        } else if (value.format > 255 || value.format < 0) {
          throw new Error("Format should be in range of 0 - 255");
        }
        if (strict && (value.format > 2 || value.format < 1)) {
          throw new Error("Invalid timestamp");
        }
        return true;
      }
      var createTypedArrayConstructor = typedArrayConstructor.exports;
      createTypedArrayConstructor("Int16", function(init) {
        return function Int16Array2(data2, byteOffset, length) {
          return init(this, data2, byteOffset, length);
        };
      });
      function getHeaderBytes(id2, size, version2, flags) {
        var idBytes = encodeString(id2);
        var sizeView = new BufferView(4);
        sizeView.setUint32(0, version2 === 3 ? size : encodeSynch(size));
        var flagsBytes = [0, 0];
        if (version2 === 4 && flags.unsynchronisation) {
          flagsBytes[1] = setBit(flagsBytes[1], 1);
        }
        if (version2 === 4 && flags.dataLengthIndicator) {
          flagsBytes[1] = setBit(flagsBytes[1], 0);
        }
        return mergeBytes(idBytes, sizeView.getUint8(0, 4), flagsBytes);
      }
      function unsynchData(data2, version2) {
        var sizeView = new BufferView(4);
        var dataBytes = unsynch(data2);
        var content = [];
        if (version2 === 4) {
          sizeView.setUint32(0, encodeSynch(data2.length));
          content.push.apply(content, _toConsumableArray(sizeView.getUint8(0, 4)));
        }
        dataBytes.forEach(function(_byte) {
          return content.push(_byte);
        });
        return new Uint8Array(content);
      }
      function textFrame(value, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var encoding = 0;
        var strBytes = [];
        switch (version2) {
          case 3:
            encoding = 1;
            strBytes = encodeString(value.replace("\\\\", "/") + "\0", "utf-16");
            break;
          case 4:
            encoding = 3;
            strBytes = encodeString(value.replace("\\\\", "\0") + "\0", "utf-8");
            break;
        }
        var data2 = mergeBytes(encoding, strBytes);
        if (unsynch2)
          data2 = unsynchData(data2, version2);
        var header = getHeaderBytes(id2, data2.length, version2, {
          unsynchronisation: unsynch2,
          dataLengthIndicator: unsynch2
        });
        return mergeBytes(header, data2);
      }
      function win1251Frame(value, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var strBytes = [];
        switch (version2) {
          case 3:
            strBytes = encodeString(value.replace("\\\\", "/") + "\0");
            break;
          case 4:
            strBytes = encodeString(value.replace("\\\\", "\0") + "\0");
            break;
        }
        var data2 = mergeBytes(0, strBytes);
        if (unsynch2)
          data2 = unsynchData(data2, version2);
        var header = getHeaderBytes(id2, data2.length, version2, {
          unsynchronisation: unsynch2,
          dataLengthIndicator: unsynch2
        });
        return mergeBytes(header, data2);
      }
      function setFrame(value, options) {
        var version2 = options.version;
        if (version2 === 3)
          value = value.toString().split("\\\\")[0];
        else if (version2 === 4)
          value = value.toString().replace("\\\\", "\0");
        return win1251Frame(value, options);
      }
      function urlFrame(value, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var strBytes = encodeString(value + "\0");
        if (unsynch2)
          strBytes = unsynchData(strBytes, version2);
        var header = getHeaderBytes(id2, strBytes.length, version2, {
          unsynchronisation: unsynch2,
          dataLengthIndicator: unsynch2
        });
        return mergeBytes(header, strBytes);
      }
      function txxxFrame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        values2.forEach(function(txxx) {
          var encoding = 0;
          var descBytes, strBytes;
          switch (version2) {
            case 3:
              encoding = 1;
              descBytes = encodeString(txxx.description + "\0", "utf-16");
              strBytes = encodeString(txxx.text + "\0", "utf-16");
              break;
            case 4:
              encoding = 3;
              descBytes = encodeString(txxx.description + "\0", "utf-8");
              strBytes = encodeString(txxx.text + "\0", "utf-8");
              break;
          }
          var data2 = mergeBytes(encoding, descBytes, strBytes);
          if (unsynch2)
            data2 = unsynchData(data2, version2);
          var header = getHeaderBytes(id2, data2.length, version2, {
            unsynchronisation: unsynch2,
            dataLengthIndicator: unsynch2
          });
          var merged = mergeBytes(header, data2);
          merged.forEach(function(_byte2) {
            return bytes.push(_byte2);
          });
        });
        return bytes;
      }
      function wxxxFrame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        values2.forEach(function(wxxx) {
          var encoding = 0;
          var descBytes, strBytes;
          switch (version2) {
            case 3:
              encoding = 1;
              descBytes = encodeString(wxxx.description + "\0", "utf-16");
              strBytes = encodeString(wxxx.url + "\0");
              break;
            case 4:
              encoding = 3;
              descBytes = encodeString(wxxx.description + "\0", "utf-8");
              strBytes = encodeString(wxxx.url + "\0");
              break;
          }
          var data2 = mergeBytes(encoding, descBytes, strBytes);
          if (unsynch2)
            data2 = unsynchData(data2, version2);
          var header = getHeaderBytes(id2, data2.length, version2, {
            unsynchronisation: unsynch2,
            dataLengthIndicator: unsynch2
          });
          var merged = mergeBytes(header, data2);
          merged.forEach(function(_byte3) {
            return bytes.push(_byte3);
          });
        });
        return bytes;
      }
      function iplsFrame(value, options) {
        options.version = 4;
        return textFrame(value, options);
      }
      function langDescFrame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        values2.forEach(function(langDesc) {
          var encoding = 0;
          var langBytes = encodeString(langDesc.language);
          var descBytes, textBytes;
          switch (version2) {
            case 3:
              encoding = 1;
              descBytes = encodeString(langDesc.descriptor + "\0", "utf-16");
              textBytes = encodeString(langDesc.text + "\0", "utf-16");
              break;
            case 4:
              encoding = 3;
              descBytes = encodeString(langDesc.descriptor + "\0", "utf-8");
              textBytes = encodeString(langDesc.text + "\0", "utf-8");
              break;
          }
          var data2 = mergeBytes(encoding, langBytes, descBytes, textBytes);
          if (unsynch2)
            data2 = unsynchData(data2, version2);
          var header = getHeaderBytes(id2, data2.length, version2, {
            unsynchronisation: unsynch2,
            dataLengthIndicator: unsynch2
          });
          var merged = mergeBytes(header, data2);
          merged.forEach(function(_byte4) {
            return bytes.push(_byte4);
          });
        });
        return bytes;
      }
      function apicFrame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        values2.forEach(function(apic) {
          var encoding = 0;
          var mimeBytes = encodeString(apic.format + "\0");
          var imageBytes = new Uint8Array(apic.data);
          var strBytes = [];
          switch (version2) {
            case 3:
              encoding = 1;
              strBytes = encodeString(apic.description + "\0", "utf-16");
              break;
            case 4:
              encoding = 3;
              strBytes = encodeString(apic.description + "\0", "utf-8");
              break;
          }
          var data2 = mergeBytes(encoding, mimeBytes, apic.type, strBytes, imageBytes);
          if (unsynch2)
            data2 = unsynchData(data2, version2);
          var header = getHeaderBytes(id2, data2.length, version2, {
            unsynchronisation: unsynch2,
            dataLengthIndicator: unsynch2
          });
          var merged = mergeBytes(header, data2);
          merged.forEach(function(_byte5) {
            return bytes.push(_byte5);
          });
        });
        return bytes;
      }
      function geobFrame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        values2.forEach(function(geob) {
          var mime = encodeString(geob.format + "\0");
          var object = new Uint8Array(geob.object);
          var encoding, filename, description;
          switch (version2) {
            case 3:
              encoding = 1;
              filename = encodeString(geob.filename + "\0", "utf-16");
              description = encodeString(geob.description + "\0", "utf-16");
              break;
            case 4:
              encoding = 3;
              filename = encodeString(geob.filename + "\0", "utf-8");
              description = encodeString(geob.description + "\0", "utf-8");
              break;
          }
          var data2 = mergeBytes(encoding, mime, filename, description, object);
          if (unsynch2)
            data2 = unsynchData(data2, version2);
          var header = getHeaderBytes(id2, data2.length, version2, {
            unsynchronisation: unsynch2,
            dataLengthIndicator: unsynch2
          });
          var merged = mergeBytes(header, data2);
          merged.forEach(function(_byte6) {
            return bytes.push(_byte6);
          });
        });
        return bytes;
      }
      function ufidFrame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        values2.forEach(function(ufid) {
          var ownerBytes = encodeString(ufid.ownerId + "\0");
          var idBytes = new Uint8Array(ufid.id);
          var data2 = mergeBytes(ownerBytes, idBytes);
          if (unsynch2)
            data2 = unsynchData(data2, version2);
          var header = getHeaderBytes(id2, data2.length, version2, {
            unsynchronisation: unsynch2,
            dataLengthIndicator: unsynch2
          });
          var merged = mergeBytes(header, data2);
          merged.forEach(function(_byte7) {
            return bytes.push(_byte7);
          });
        });
        return bytes;
      }
      function userFrame(value, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        var encoding = 0;
        var langBytes = encodeString(value.language);
        var textBytes;
        switch (version2) {
          case 3:
            encoding = 1;
            textBytes = encodeString(value.text + "\0", "utf-16");
            break;
          case 4:
            encoding = 3;
            textBytes = encodeString(value.text + "\0", "utf-8");
            break;
        }
        var data2 = mergeBytes(encoding, langBytes, textBytes);
        if (unsynch2)
          data2 = unsynchData(data2, version2);
        var header = getHeaderBytes(id2, data2.length, version2, {
          unsynchronisation: unsynch2,
          dataLengthIndicator: unsynch2
        });
        var merged = mergeBytes(header, data2);
        merged.forEach(function(_byte8) {
          return bytes.push(_byte8);
        });
        return bytes;
      }
      function owneFrame(value, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var encoding = 0;
        var codeBytes = encodeString(value.currencyCode);
        var priceBytes = encodeString(value.currencyPrice + "\0");
        var dateBytes = encodeString(value.date);
        var sellerBytes;
        switch (version2) {
          case 3:
            encoding = 1;
            sellerBytes = encodeString(value.seller, "utf-16");
            break;
          case 4:
            encoding = 3;
            sellerBytes = encodeString(value.seller, "utf-8");
            break;
        }
        var data2 = mergeBytes(encoding, codeBytes, priceBytes, dateBytes, sellerBytes);
        if (unsynch2)
          data2 = unsynchData(data2, version2);
        var header = getHeaderBytes(id2, data2.length, version2, {
          unsynchronisation: unsynch2,
          dataLengthIndicator: unsynch2
        });
        return mergeBytes(header, data2);
      }
      function privFrame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        values2.forEach(function(priv) {
          var ownerIdBytes = encodeString(priv.ownerId);
          var privData = new Uint8Array(priv.data);
          var data2 = mergeBytes(ownerIdBytes, privData);
          if (unsynch2)
            data2 = unsynchData(data2, version2);
          var header = getHeaderBytes(id2, data2.length, version2, {
            unsynchronisation: unsynch2,
            dataLengthIndicator: unsynch2
          });
          var merged = mergeBytes(header, data2);
          merged.forEach(function(_byte9) {
            return bytes.push(_byte9);
          });
        });
        return bytes;
      }
      function rvadFrame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        var bitsvolume = values2.bitsvolume || 16;
        var limit = Math.ceil(bitsvolume / 8);
        var incdec = 0;
        if (values2.incdec) {
          if (values2.incdec.right)
            incdec = setBit(incdec, 0);
          if (values2.incdec.left)
            incdec = setBit(incdec, 1);
          if (values2.incdec.rightback)
            incdec = setBit(incdec, 2);
          if (values2.incdec.leftback)
            incdec = setBit(incdec, 3);
          if (values2.incdec.center)
            incdec = setBit(incdec, 4);
          if (values2.incdec.bass)
            incdec = setBit(incdec, 5);
        }
        bytes.push(incdec);
        bytes.push(bitsvolume);
        var volumechange = values2.volumechange || {};
        var peakvolume = values2.peakvolume || {};
        var rightChangeBlock = dataBlock(volumechange.right, limit);
        var leftChangeBlock = dataBlock(volumechange.left, limit);
        var rightPeakBlock = dataBlock(peakvolume.right, limit);
        var leftPeakBlock = dataBlock(peakvolume.left, limit);
        rightChangeBlock.forEach(function(_byte10) {
          return bytes.push(_byte10);
        });
        leftChangeBlock.forEach(function(_byte11) {
          return bytes.push(_byte11);
        });
        rightPeakBlock.forEach(function(_byte12) {
          return bytes.push(_byte12);
        });
        leftPeakBlock.forEach(function(_byte13) {
          return bytes.push(_byte13);
        });
        if (volumechange.rightback || volumechange.leftback || peakvolume.rightback || peakvolume.leftback || volumechange.center || peakvolume.center || volumechange.bass || peakvolume.bass) {
          var rightBackChangeBlock = dataBlock(volumechange.rightback, limit);
          var leftBackChangeBlock = dataBlock(volumechange.leftback, limit);
          var rightBackPeakBlock = dataBlock(peakvolume.rightback, limit);
          var leftBackPeakBlock = dataBlock(peakvolume.leftback, limit);
          rightBackChangeBlock.forEach(function(_byte14) {
            return bytes.push(_byte14);
          });
          leftBackChangeBlock.forEach(function(_byte15) {
            return bytes.push(_byte15);
          });
          rightBackPeakBlock.forEach(function(_byte16) {
            return bytes.push(_byte16);
          });
          leftBackPeakBlock.forEach(function(_byte17) {
            return bytes.push(_byte17);
          });
        }
        if (volumechange.center || peakvolume.center || volumechange.bass || peakvolume.bass) {
          var centerChangeBlock = dataBlock(volumechange.center, limit);
          var centerPeakBlock = dataBlock(peakvolume.center, limit);
          centerChangeBlock.forEach(function(_byte18) {
            return bytes.push(_byte18);
          });
          centerPeakBlock.forEach(function(_byte19) {
            return bytes.push(_byte19);
          });
        }
        if (volumechange.bass || peakvolume.bass) {
          var bassChangeBlock = dataBlock(volumechange.bass, limit);
          var bassPeakBlock = dataBlock(peakvolume.bass, limit);
          bassChangeBlock.forEach(function(_byte20) {
            return bytes.push(_byte20);
          });
          bassPeakBlock.forEach(function(_byte21) {
            return bytes.push(_byte21);
          });
        }
        var data2 = unsynch2 ? unsynchData(bytes) : bytes;
        var header = getHeaderBytes(id2, data2.length, version2, {
          unsynchronisation: unsynch2,
          dataLengthIndicator: unsynch2
        });
        return mergeBytes(header, data2);
      }
      function rva2Frame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        values2.forEach(function(value) {
          var identification = encodeString(value.identification + "\0");
          var data2 = identification;
          for (var i = 0; i < value.channels.length; i++) {
            var channel = value.channels[i];
            var type = channel.type;
            var volumeadjust = new Int16Array([channel.volumeadjust]);
            var volumeadjust8 = new Uint8Array(volumeadjust.buffer);
            var bitspeak = channel.bitspeak;
            var limit = Math.ceil(bitspeak / 8);
            var peakvolume = dataBlock(channel.peakvolume, limit);
            data2 = mergeBytes(data2, type, volumeadjust8, bitspeak, peakvolume);
          }
          var header = getHeaderBytes(id2, data2.length, version2, {
            unsynchronisation: unsynch2,
            dataLengthIndicator: unsynch2
          });
          var merged = mergeBytes(header, data2);
          merged.forEach(function(_byte22) {
            return bytes.push(_byte22);
          });
        });
        return bytes;
      }
      function signFrame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        values2.forEach(function(sign) {
          var signature = new Uint8Array(sign.signature);
          var data2 = mergeBytes(sign.group, signature);
          if (unsynch2)
            data2 = unsynchData(data2, version2);
          var header = getHeaderBytes(id2, data2.length, version2, {
            unsynchronisation: unsynch2,
            dataLengthIndicator: unsynch2
          });
          var merged = mergeBytes(header, data2);
          merged.forEach(function(_byte23) {
            return bytes.push(_byte23);
          });
        });
        return bytes;
      }
      function syltFrame(values2, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var bytes = [];
        values2.forEach(function(sylt) {
          var encoding = 0;
          var langBytes = encodeString(sylt.language);
          var descBytes = [];
          switch (version2) {
            case 3:
              encoding = 1;
              descBytes = encodeString(sylt.descriptor + "\0", "utf-16");
              break;
            case 4:
              encoding = 3;
              descBytes = encodeString(sylt.descriptor + "\0", "utf-8");
              break;
          }
          var regex = /^(\[\d{1,}:\d{2}\.\d{3}\]) ?(.*)/;
          var lyricsBytes = [];
          sylt.lyrics.replace(/\r\n/, "\n").split("\n").forEach(function(line) {
            if (line !== "") {
              var result = regex.exec(line);
              var time = parseInt(result[1].replace(/[^0-9]/g, ""));
              var string = encodeString((result[2] || "") + "\n\0");
              var timeBytes = new BufferView(4);
              timeBytes.setUint32(0, time);
              lyricsBytes = mergeBytes(lyricsBytes, string, timeBytes.getUint8(0, 4));
            }
          });
          var data2 = mergeBytes(encoding, langBytes, sylt.format, sylt.type, descBytes, lyricsBytes);
          if (unsynch2)
            data2 = unsynchData(data2, version2);
          var header = getHeaderBytes(id2, data2.length, version2, {
            unsynchronisation: unsynch2,
            dataLengthIndicator: unsynch2
          });
          var merged = mergeBytes(header, data2);
          merged.forEach(function(_byte24) {
            return bytes.push(_byte24);
          });
        });
        return bytes;
      }
      function mcdiFrame(value, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        if (unsynch2)
          value.data = unsynchData(value.data, version2);
        var header = getHeaderBytes(id2, value.data.length, version2, {
          unsynchronisation: unsynch2,
          dataLengthIndicator: unsynch2
        });
        return mergeBytes(header, value.data);
      }
      function sytcFrame(value, options) {
        var id2 = options.id, version2 = options.version, unsynch2 = options.unsynch;
        var data2 = mergeBytes(value.format, value.data);
        if (unsynch2)
          data2 = unsynchData(data2, version2);
        var header = getHeaderBytes(id2, data2.length, version2, {
          unsynchronisation: unsynch2,
          dataLengthIndicator: unsynch2
        });
        return mergeBytes(header, data2);
      }
      var APIC = {
        parse: apicFrame$2,
        validate: apicFrame$1,
        write: apicFrame,
        version: [3, 4]
      };
      var COMM = {
        parse: langDescFrame$2,
        validate: langDescFrame$1,
        write: langDescFrame,
        version: [3, 4]
      };
      var GEOB = {
        parse: geobFrame$2,
        validate: geobFrame$1,
        write: geobFrame,
        version: [3, 4]
      };
      var IPLS = {
        parse: iplsFrame$1,
        validate: textFrame$1,
        write: iplsFrame,
        version: [3]
      };
      var MCDI = {
        parse: mcdiFrame$2,
        validate: mcdiFrame$1,
        write: mcdiFrame,
        version: [3, 4]
      };
      var OWNE = {
        parse: owneFrame$2,
        validate: owneFrame$1,
        write: owneFrame,
        version: [3, 4]
      };
      var PRIV = {
        parse: privFrame$2,
        validate: privFrame$1,
        write: privFrame,
        version: [3, 4]
      };
      var RVAD = {
        parse: rvadFrame$2,
        validate: rvadFrame$1,
        write: rvadFrame,
        version: [3]
      };
      var RVA2 = {
        parse: rva2Frame$2,
        validate: rva2Frame$1,
        write: rva2Frame,
        version: [4]
      };
      var SEEK = {
        parse: seekFrame
      };
      var SIGN = {
        parse: signFrame$2,
        validate: signFrame$1,
        write: signFrame,
        version: [4]
      };
      var SYLT = {
        parse: syltFrame$2,
        validate: syltFrame$1,
        write: syltFrame,
        version: [3, 4]
      };
      var SYTC = {
        parse: sytcFrame$2,
        validate: sytcFrame$1,
        write: sytcFrame,
        version: [3, 4]
      };
      var TALB = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TBPM = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: win1251Frame,
        version: [3, 4]
      };
      var TCOM = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TCON = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TCOP = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TDAT = {
        parse: textFrame$2,
        validate: timeFrame,
        write: win1251Frame,
        version: [3]
      };
      var TDEN = {
        parse: textFrame$2,
        validate: timeFrame,
        write: win1251Frame,
        version: [4]
      };
      var TDLY = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: win1251Frame,
        version: [3]
      };
      var TDOR = {
        parse: textFrame$2,
        validate: timeFrame,
        write: win1251Frame,
        version: [4]
      };
      var TDRC = {
        parse: textFrame$2,
        validate: timeFrame,
        write: win1251Frame,
        version: [4]
      };
      var TDRL = {
        parse: textFrame$2,
        validate: timeFrame,
        write: win1251Frame,
        version: [4]
      };
      var TDTG = {
        parse: textFrame$2,
        validate: timeFrame,
        write: win1251Frame,
        version: [4]
      };
      var TENC = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TEXT = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TFLT = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TIME = {
        parse: textFrame$2,
        validate: timeFrame,
        write: win1251Frame,
        version: [3]
      };
      var TIPL = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [4]
      };
      var TIT1 = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TIT2 = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TIT3 = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TKEY = {
        parse: textFrame$2,
        validate: tkeyFrame,
        write: win1251Frame,
        version: [3, 4]
      };
      var TLAN = {
        parse: textFrame$2,
        validate: tlanFrame,
        write: win1251Frame,
        version: [3, 4]
      };
      var TLEN = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: win1251Frame,
        version: [3, 4]
      };
      var TMCL = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [4]
      };
      var TMED = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TMOO = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [4]
      };
      var TOAL = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TOFN = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TOLY = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TOPE = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TORY = {
        parse: textFrame$2,
        validate: timeFrame,
        write: win1251Frame,
        version: [3]
      };
      var TOWN = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TPE1 = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TPE2 = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TPE3 = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TPE4 = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TPOS = {
        parse: setFrame$2,
        validate: setFrame$1,
        write: setFrame,
        version: [3, 4]
      };
      var TPRO = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [4]
      };
      var TPUB = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TRCK = {
        parse: setFrame$2,
        validate: setFrame$1,
        write: setFrame,
        version: [3, 4]
      };
      var TRDA = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3]
      };
      var TRSN = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TRSO = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TSIZ = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: win1251Frame,
        version: [3]
      };
      var TSOA = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [4]
      };
      var TSOC = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [4]
      };
      var TSOP = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [4]
      };
      var TSOT = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [4]
      };
      var TSRC = {
        parse: textFrame$2,
        validate: tsrcFrame,
        write: win1251Frame,
        version: [3, 4]
      };
      var TSSE = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [3, 4]
      };
      var TSST = {
        parse: textFrame$2,
        validate: textFrame$1,
        write: textFrame,
        version: [4]
      };
      var TYER = {
        parse: textFrame$2,
        validate: timeFrame,
        write: win1251Frame,
        version: [3]
      };
      var TXXX = {
        parse: txxxFrame$2,
        validate: txxxFrame$1,
        write: txxxFrame,
        version: [3, 4]
      };
      var UFID = {
        parse: ufidFrame$2,
        validate: ufidFrame$1,
        write: ufidFrame,
        version: [3, 4]
      };
      var USER = {
        parse: userFrame$2,
        validate: userFrame$1,
        write: userFrame,
        version: [3, 4]
      };
      var USLT = {
        parse: langDescFrame$2,
        validate: langDescFrame$1,
        write: langDescFrame,
        version: [3, 4]
      };
      var WCOM = {
        parse: urlFrame$2,
        validate: urlFrame$1,
        write: urlFrame,
        version: [3, 4]
      };
      var WCOP = {
        parse: urlFrame$2,
        validate: urlFrame$1,
        write: urlFrame,
        version: [3, 4]
      };
      var WFED = {
        parse: win1251Frame$1,
        validate: urlFrame$1,
        write: win1251Frame,
        version: [3, 4]
      };
      var TGID = {
        parse: win1251Frame$1,
        validate: urlFrame$1,
        write: win1251Frame,
        version: [3, 4]
      };
      var WOAF = {
        parse: urlFrame$2,
        validate: urlFrame$1,
        write: urlFrame,
        version: [3, 4]
      };
      var WOAR = {
        parse: urlFrame$2,
        validate: urlFrame$1,
        write: urlFrame,
        version: [3, 4]
      };
      var WOAS = {
        parse: urlFrame$2,
        validate: urlFrame$1,
        write: urlFrame,
        version: [3, 4]
      };
      var WORS = {
        parse: urlFrame$2,
        validate: urlFrame$1,
        write: urlFrame,
        version: [3, 4]
      };
      var WPAY = {
        parse: urlFrame$2,
        validate: urlFrame$1,
        write: urlFrame,
        version: [3, 4]
      };
      var WPUB = {
        parse: urlFrame$2,
        validate: urlFrame$1,
        write: urlFrame,
        version: [3, 4]
      };
      var WXXX = {
        parse: wxxxFrame$2,
        validate: wxxxFrame$1,
        write: wxxxFrame,
        version: [3, 4]
      };
      var frames = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        APIC,
        COMM,
        GEOB,
        IPLS,
        MCDI,
        OWNE,
        PRIV,
        RVAD,
        RVA2,
        SEEK,
        SIGN,
        SYLT,
        SYTC,
        TALB,
        TBPM,
        TCOM,
        TCON,
        TCOP,
        TDAT,
        TDEN,
        TDLY,
        TDOR,
        TDRC,
        TDRL,
        TDTG,
        TENC,
        TEXT,
        TFLT,
        TIME,
        TIPL,
        TIT1,
        TIT2,
        TIT3,
        TKEY,
        TLAN,
        TLEN,
        TMCL,
        TMED,
        TMOO,
        TOAL,
        TOFN,
        TOLY,
        TOPE,
        TORY,
        TOWN,
        TPE1,
        TPE2,
        TPE3,
        TPE4,
        TPOS,
        TPRO,
        TPUB,
        TRCK,
        TRDA,
        TRSN,
        TRSO,
        TSIZ,
        TSOA,
        TSOC,
        TSOP,
        TSOT,
        TSRC,
        TSSE,
        TSST,
        TYER,
        TXXX,
        UFID,
        USER,
        USLT,
        WCOM,
        WCOP,
        WFED,
        TGID,
        WOAF,
        WOAR,
        WOAS,
        WORS,
        WPAY,
        WPUB,
        WXXX
      });
      function hasID3v2(buffer) {
        var view = new BufferView(buffer);
        return view.getString(0, 3).string === "ID3";
      }
      function decode(buffer) {
        var tagOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        var view = new BufferView(buffer, tagOffset);
        var version2 = view.getUint8(3, 2);
        var size = decodeSynch(view.getUint32(6));
        var flags = getHeaderFlags(view.getUint8(5), version2[0]);
        var details = {
          version: version2,
          flags,
          size
        };
        var tags = {};
        if (version2[0] !== 3 && version2[0] !== 4) {
          throw new Error("Unknown ID3v2 major version");
        }
        var offset = 10;
        var limit = size;
        var pushTag = function pushTag2(tag) {
          var singleFrame = ["USER", "OWNE", "MCDI", "RVAD", "SYTC"];
          switch (_typeof(tag.value)) {
            case "number":
            case "string":
              tag.value = tag.value.toString();
              if (tags[tag.id])
                tags[tag.id] += "\\\\" + tag.value;
              else
                tags[tag.id] = tag.value;
              break;
            case "object":
              if (singleFrame.includes(tag.id))
                tags[tag.id] = tag.value;
              else {
                if (tags[tag.id])
                  tags[tag.id].push(tag.value);
                else
                  tags[tag.id] = [tag.value];
              }
              break;
          }
        };
        while (offset < size) {
          var frameBytes = view.getUint8(offset, limit);
          var frame = decodeFrame(frameBytes, {
            version: version2,
            flags
          });
          if (!frame)
            break;
          offset += frame.size + 10;
          limit -= frame.size + 10;
          if (frame.id === "SEEK") {
            var seekedTags = decode(buffer, offset + frame.value);
            for (var id2 in seekedTags) {
              pushTag({
                id: id2,
                value: seekedTags[id2]
              });
            }
          } else
            pushTag({
              id: frame.id,
              value: frame.value
            });
        }
        return {
          tags,
          details
        };
      }
      function decodeFrame(bytes, options) {
        var view = new BufferView(bytes);
        if (view.getUint8(0) === 0)
          return false;
        var frame = {};
        var version2 = options.version, flags = options.flags;
        var sizeByte = view.getUint32(4);
        frame.id = view.getUint8String(0, 4);
        frame.flags = getFrameFlags(view.getUint8(8, 2), version2[0]);
        frame.size = version2[0] === 4 ? decodeSynch(sizeByte) : sizeByte;
        var frameSpec = frames[frame.id];
        var offset = 10;
        var actualSize = frame.size;
        var dataLength = frame.size;
        var contents;
        if (!frameSpec) {
          console.warn("Skipping unsupported frame: ".concat(frame.id));
          return frame;
        }
        if (frame.flags.dataLengthIndicator) {
          actualSize = decodeSynch(view.getUint32(offset));
          offset += 4;
          dataLength -= 4;
        }
        var unsynchedData = flags.unsynchronisation;
        if (version2 === 4)
          unsynchedData = frame.flags.unsynchronisation;
        if (unsynchedData) {
          var uint8 = view.getUint8(offset, dataLength);
          var unsynched = synch(Array.isArray(uint8) ? uint8 : [uint8]);
          contents = new Uint8Array(unsynched);
        } else {
          var _uint = view.getUint8(offset, actualSize);
          contents = new Uint8Array(Array.isArray(_uint) ? _uint : [_uint]);
        }
        frame.value = frameSpec.parse(contents.buffer, version2[0]);
        return frame;
      }
      function validate(tags, strict, options) {
        var version2 = options.version;
        if (version2 !== 3 && version2 !== 4) {
          throw new Error("Unknown provided version");
        }
        for (var id2 in tags) {
          if (!Object.keys(frames).includes(id2))
            continue;
          var frameSpec = frames[id2];
          if (strict && !frameSpec.version.includes(version2)) {
            throw new Error("".concat(id2, " is not supported in ID3v2.").concat(version2));
          }
          try {
            frameSpec.validate(tags[id2], version2, strict);
          } catch (error) {
            throw new Error("".concat(error.message, " at ").concat(id2));
          }
        }
        return true;
      }
      function encode(tags, options) {
        var version2 = options.version, padding = options.padding, unsynch2 = options.unsynch;
        var headerBytes = [73, 68, 51, version2, 0];
        var flagsByte = 0;
        var sizeView = new BufferView(4);
        var paddingBytes = new Uint8Array(padding);
        var framesBytes = [];
        for (var id2 in tags) {
          var frameSpec = frames[id2];
          var bytes = frameSpec.write(tags[id2], {
            id: id2,
            version: version2,
            unsynch: unsynch2
          });
          bytes.forEach(function(_byte) {
            return framesBytes.push(_byte);
          });
        }
        if (unsynch2)
          flagsByte = setBit(flagsByte, 7);
        sizeView.setUint32(0, encodeSynch(framesBytes.length));
        return mergeBytes(headerBytes, flagsByte, sizeView.getUint8(0, 4), framesBytes, paddingBytes).buffer;
      }
      var MP3Tag2 = /* @__PURE__ */ function() {
        function MP3Tag3(buffer) {
          var verbose = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
          _classCallCheck(this, MP3Tag3);
          if (!isBuffer(buffer)) {
            throw new TypeError("buffer is not ArrayBuffer/Buffer");
          }
          this.name = "MP3Tag";
          this.version = "3.3.2";
          this.verbose = verbose;
          this.buffer = buffer;
          this.tags = {};
          this.error = "";
        }
        _createClass(MP3Tag3, [{
          key: "read",
          value: function read() {
            var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            this.tags = {};
            this.error = "";
            try {
              this.tags = MP3Tag3.readBuffer(this.buffer, options, this.verbose);
            } catch (error) {
              this.error = error.message;
            }
            return this.tags;
          }
        }, {
          key: "save",
          value: function save() {
            var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            this.error = "";
            var buffer = this.buffer;
            try {
              buffer = MP3Tag3.writeBuffer(this.buffer, this.tags, options, this.verbose);
            } catch (error) {
              this.error = error.message;
            }
            if (this.error === "")
              this.buffer = buffer;
            return this.buffer;
          }
        }, {
          key: "remove",
          value: function remove() {
            this.tags = {};
            this.error = "";
            this.buffer = this.getAudio();
            return true;
          }
        }, {
          key: "getAudio",
          value: function getAudio() {
            return MP3Tag3.getAudioBuffer(this.buffer);
          }
        }], [{
          key: "readBuffer",
          value: function readBuffer(buffer) {
            var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            var verbose = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
            if (!isBuffer(buffer)) {
              throw new TypeError("buffer is not ArrayBuffer/Buffer");
            }
            var tags = {};
            options = overwriteDefault(options, {
              id3v1: true,
              id3v2: true
            });
            if (options.id3v1 && hasID3v1(buffer)) {
              if (verbose)
                console.log("ID3v1 found, reading...");
              var _ID3v1$decode = decode$1(buffer), v1Tags = _ID3v1$decode.tags, details = _ID3v1$decode.details;
              if (verbose)
                console.log("ID3v1 reading finished");
              tags.v1 = _objectSpread2({}, v1Tags);
              tags.v1Details = details;
            }
            if (options.id3v2 && hasID3v2(buffer)) {
              if (verbose)
                console.log("ID3v2 found, reading...");
              var _ID3v2$decode = decode(buffer), v2Tags = _ID3v2$decode.tags, _details = _ID3v2$decode.details;
              if (verbose)
                console.log("ID3v2 reading finished");
              tags.v2 = _objectSpread2({}, v2Tags);
              tags.v2Details = _details;
            }
            Object.defineProperties(tags, {
              title: {
                get: function get2() {
                  return this.v2 && this.v2.TIT2 || this.v1 && this.v1.title || "";
                },
                set: function set2(value) {
                  if (this.v2)
                    this.v2.TIT2 = value;
                  if (this.v1)
                    this.v1.title = value;
                }
              },
              artist: {
                get: function get2() {
                  return this.v2 && this.v2.TPE1 || this.v1 && this.v1.artist || "";
                },
                set: function set2(value) {
                  if (this.v2)
                    this.v2.TPE1 = value;
                  if (this.v1)
                    this.v1.artist = value;
                }
              },
              album: {
                get: function get2() {
                  return this.v2 && this.v2.TALB || this.v1 && this.v1.album || "";
                },
                set: function set2(value) {
                  if (this.v2)
                    this.v2.TALB = value;
                  if (this.v1)
                    this.v1.album = value;
                }
              },
              year: {
                get: function get2() {
                  return this.v2 && (this.v2.TYER || this.v2.TDRC) || this.v1 && this.v1.year || "";
                },
                set: function set2(value) {
                  if (this.v2) {
                    var version2 = this.v2Details.version[0];
                    if (version2 === 3)
                      this.v2.TYER = value;
                    else if (version2 === 4)
                      this.v2.TDRC = value;
                  }
                  if (this.v1)
                    this.v1.year = value;
                }
              },
              comment: {
                get: function get2() {
                  var text = "";
                  if (this.v2 && this.v2.COMM) {
                    var comm = this.v2.COMM;
                    if (Array.isArray(comm) && comm.length > 0)
                      text = comm[0].text;
                  } else if (this.v1 && this.v1.comment)
                    text = this.v1.comment;
                  return text;
                },
                set: function set2(value) {
                  if (this.v2) {
                    this.v2.COMM = [{
                      language: "eng",
                      descriptor: "",
                      text: value
                    }];
                  }
                  if (this.v1)
                    this.v1.comment = value;
                }
              },
              track: {
                get: function get2() {
                  return this.v2 && this.v2.TRCK && this.v2.TRCK.split("/")[0] || this.v1 && this.v1.track || "";
                },
                set: function set2(value) {
                  if (this.v2)
                    this.v2.TRCK = value;
                  if (this.v1)
                    this.v1.track = value;
                }
              },
              genre: {
                get: function get2() {
                  return this.v2 && this.v2.TCON || this.v1 && this.v1.genre || "";
                },
                set: function set2(value) {
                  if (this.v2)
                    this.v2.TCON = value;
                  if (this.v1)
                    this.v1.genre = value;
                }
              }
            });
            return tags;
          }
        }, {
          key: "writeBuffer",
          value: function writeBuffer(buffer, tags) {
            var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
            var verbose = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
            var defaultVersion = tags.v2Details ? tags.v2Details.version[0] : 3;
            var audio = new Uint8Array(MP3Tag3.getAudioBuffer(buffer));
            options = overwriteDefault(options, {
              strict: false,
              id3v1: {
                include: false
              },
              id3v2: {
                include: true,
                unsynch: false,
                version: defaultVersion,
                padding: 2048
              }
            });
            if (options.id3v1.include) {
              if (verbose)
                console.log("Validating ID3v1...");
              validate$1(tags.v1, options.strict);
              if (verbose)
                console.log("Writing ID3v1...");
              var encoded = encode$1(tags.v1);
              var tagBytes = new Uint8Array(encoded);
              audio = mergeBytes(audio, tagBytes);
            }
            if (options.id3v2.include) {
              if (verbose)
                console.log("Validating ID3v2...");
              validate(tags.v2, options.strict, options.id3v2);
              if (verbose)
                console.log("Writing ID3v2...");
              var _encoded = encode(tags.v2, options.id3v2);
              var _tagBytes = new Uint8Array(_encoded);
              audio = mergeBytes(_tagBytes, audio);
            }
            return audio.buffer;
          }
        }, {
          key: "getAudioBuffer",
          value: function getAudioBuffer(buffer) {
            if (!isBuffer(buffer)) {
              throw new TypeError("buffer is not ArrayBuffer/Buffer");
            }
            if (hasID3v1(buffer)) {
              buffer = buffer.slice(0, buffer.byteLength - 128);
            }
            var view = new BufferView(buffer);
            var start = 0;
            var i = 0;
            while (i < view.byteLength) {
              if (view.getUint8(i) === 255 && view.getUint8(i + 1) === 251) {
                start = i;
                break;
              } else
                i++;
            }
            return buffer.slice(start);
          }
        }]);
        return MP3Tag3;
      }();
      return MP3Tag2;
    });
  })(mp3tag);
  const MP3Tag = mp3tagExports;
  class Downloader {
    constructor() {
      __publicField(this, "name", "Downloader");
      __publicField(this, "options");
      __publicField(this, "view");
      __publicField(this, "_enabled", false);
      __publicField(this, "currentSongInfo");
      __publicField(this, "isAutoDlRunning");
      __publicField(this, "answerResultListener");
      this.isAutoDlRunning = false;
      this.options = new Options({
        title: this.name
      });
      this.options.push(new CheckboxOption({
        name: "autoDlOnWrong",
        inputId: "amqtbDownloaderAutoDlOnWrong",
        label: "Auto download only on wrong",
        offset: 0,
        saveIn: "Script"
      }));
      this.options.push(new CheckboxOption({
        name: "autoDlMedia",
        inputId: "amqtbDownloaderAutoDlMedia",
        label: "Auto download media",
        offset: 0,
        saveIn: "Script",
        enables: {
          "true": ["autoDlMediaType"],
          "false": []
        }
      }));
      this.options.push(new RadioOption({
        name: "autoDlMediaType",
        inputId: "amqtbDownloaderAutoDlMediaType",
        label: "Media Type",
        saveIn: "Script",
        offset: 0,
        choices: [
          {
            label: "Audio",
            value: "Audio"
          },
          {
            label: "Video",
            value: "Video"
          }
        ]
      }));
      this.options.push(new CheckboxOption({
        name: "autoDlInfo",
        inputId: "amqtbDownloaderAutoDlInfo",
        label: "Auto download info",
        offset: 0,
        saveIn: "Script"
      }));
      this.view = new Buttons({});
      const autoDlBtn = new Button({
        name: "autoDlBtn",
        label: "Start AutoDL",
        size: "extra-small",
        style: "success"
      });
      const videoDlBtn = new Button({
        name: "videoDlBtn",
        label: "Video",
        size: "extra-small",
        style: "primary"
      });
      const audioDlBtn = new Button({
        name: "audioDlBtn",
        label: "Audio",
        size: "extra-small",
        style: "primary"
      });
      const infoDlBtn = new Button({
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
      this.view.push(autoDlBtn, videoDlBtn, audioDlBtn, infoDlBtn);
      this.answerResultListener = new Listener("answer results", this.answerResultHanler.bind(this));
      this.enable();
    }
    enable() {
      if (!this._enabled) {
        this._enabled = true;
        this.answerResultListener.bindListener();
      }
    }
    disable() {
      if (this._enabled) {
        this._enabled = false;
        this.answerResultListener.unbindListener();
      }
    }
    enabled() {
      return this._enabled;
    }
    answerResultHanler(result) {
      this.currentSongInfo = result.songInfo;
      const resolutions = ["720", "480"];
      const videoDlBtn = this.view.get("videoDlBtn");
      const audioDlBtn = this.view.get("audioDlBtn");
      const infoDlBtn = this.view.get("infoDlBtn");
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
        const autoDlOnWrong = this.options.get("autoDlOnWrong").getValue();
        if (!autoDlOnWrong || isCorrect !== void 0 && !isCorrect) {
          const autoDlMedia = this.options.get("autoDlMedia").getValue();
          const autoDlInfo = this.options.get("autoDlInfo").getValue();
          if (autoDlMedia) {
            const mediaType = this.options.get("autoDlMediaType").getValue();
            if (mediaType === "Audio") {
              audioDlBtn.self.trigger("click");
            } else if (mediaType === "Video") {
              videoDlBtn.self.trigger("click");
            }
          }
          if (autoDlInfo) {
            infoDlBtn.self.trigger("click");
          }
        }
      }
    }
    async downloadSongData(url, interactive = false) {
      const fileName = this.nameFromSongInfo();
      const fileExt = url.split(".").pop();
      const mp3Info = this.getMp3Info();
      if (interactive) {
        alert(`Downloading song: ${fileName}`);
      }
      const response = await fetch(url);
      let blob;
      if (fileExt === "mp3") {
        const mp3 = await response.arrayBuffer();
        mp3Info.cover = await getAnimeImage(mp3Info.annId);
        const taggedMp3 = addMp3Tag(mp3, mp3Info);
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
    getMp3Info() {
      const catbox = this.currentSongInfo.urlMap["catbox"];
      const opm = this.currentSongInfo.urlMap["openingsmoe"];
      return {
        animeName: this.currentSongInfo.animeNames.romaji,
        songName: this.currentSongInfo.songName,
        type: this.songType(),
        artist: this.currentSongInfo.artist,
        annId: this.currentSongInfo.annId,
        cover: null,
        videoUrl: {
          "catbox_480": catbox ? catbox["480"] ? catbox["480"] : void 0 : void 0,
          "catbox_720": catbox ? catbox["720"] ? catbox["720"] : void 0 : void 0,
          "openingsmoe": opm ? opm["720"] ? catbox["720"] : void 0 : void 0
        }
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
    const mp3tag2 = new MP3Tag(data);
    mp3tag2.read();
    if (mp3tag2.error !== "") {
      console.warn(`"${info.artist} - ${info.songName}" read tag fail`);
      return null;
    }
    mp3tag2.tags.title = info.songName;
    mp3tag2.tags.artist = info.artist;
    mp3tag2.tags.album = info.animeName;
    let comment = "";
    if (info.videoUrl.catbox_480) {
      comment += `Catbox 480p: ${info.videoUrl.catbox_480}
`;
    }
    if (info.videoUrl.catbox_720) {
      comment += `Catbox 720p: ${info.videoUrl.catbox_720}
`;
    }
    if (info.videoUrl.openingsmoe) {
      comment += `OpeningsMoe: ${info.videoUrl.openingsmoe}
`;
    }
    mp3tag2.tags.comment = comment;
    if (info.cover !== null) {
      mp3tag2.tags.v2.APIC = [{
        format: info.cover.contentType,
        type: 3,
        description: "anime cover from animenewsnetwork",
        data: info.cover.data
      }];
    }
    const ret = mp3tag2.save({
      id3v1: { include: false },
      id3v2: {
        include: true,
        version: 3
      }
    });
    if (mp3tag2.error !== "") {
      console.warn(`"${info.artist} - ${info.songName}" write tag fail`);
      return null;
    }
    return ret;
  }
  function main() {
    onStartPageLoaded(() => {
      registerPlugin(new Downloader());
    });
  }
  $(main);

})();
