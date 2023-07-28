// ==UserScript==
// @name         AMQ Custom Autocomplete(dev)
// @namespace    https://github.com/JJJJoe-Lin
// @version      0.1.0
// @author       JJJJoe
// @description  AMQ Custom Autocomplete
// @downloadURL  https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/develop/plugins/custom-autocomplete/script/custom-autocomplete.user.js
// @updateURL    https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/develop/plugins/custom-autocomplete/script/custom-autocomplete.user.js
// @include      /^https:\/\/animemusicquiz\.com\/(\?.*|#.*)?$/
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
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
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
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
    let val;
    switch (type) {
      case "Script":
        val = _GM_getValue(comp.name);
        break;
      case "LocalStorage":
        val = loadFromLocalStorage(comp.name);
        break;
      case "Cookie":
        val = loadFromCookie(comp.name);
        break;
    }
    if (val !== void 0) {
      comp.setValue(val);
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
            placement: "top"
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
      const val = opt.defaultValue === void 0 ? this.choices[0].value : opt.defaultValue;
      this.setValue(val);
      this.load();
      this.input.trigger("amqtoolbox.option.enables", this.getValue());
    }
    getValue() {
      const idx = this.input.bootstrapSlider("getValue");
      return this.choices[idx].value;
    }
    setValue(val) {
      const idx = this.choices.findIndex((c) => c.value === val);
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
      if (opt instanceof RadioOption) {
        opt.relayout();
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
          placement: "top"
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
    setValue(val) {
      this.input.prop("checked", val);
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
          if (!plugin.enabled()) {
            plugin.enable();
          }
        } else {
          if (plugin.enabled()) {
            plugin.disable();
          }
        }
      } else {
        if (!plugin.enabled()) {
          plugin.enable();
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
          if (!plugin.enabled()) {
            plugin.enable();
          }
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
          if (plugin.enabled()) {
            plugin.disable();
          }
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
  /** @license
   * fzf v0.5.2
   * Copyright (c) 2021 Ajit
   * Licensed under BSD 3-Clause
   */
  const normalized = {
    216: "O",
    223: "s",
    248: "o",
    273: "d",
    295: "h",
    305: "i",
    320: "l",
    322: "l",
    359: "t",
    383: "s",
    384: "b",
    385: "B",
    387: "b",
    390: "O",
    392: "c",
    393: "D",
    394: "D",
    396: "d",
    398: "E",
    400: "E",
    402: "f",
    403: "G",
    407: "I",
    409: "k",
    410: "l",
    412: "M",
    413: "N",
    414: "n",
    415: "O",
    421: "p",
    427: "t",
    429: "t",
    430: "T",
    434: "V",
    436: "y",
    438: "z",
    477: "e",
    485: "g",
    544: "N",
    545: "d",
    549: "z",
    564: "l",
    565: "n",
    566: "t",
    567: "j",
    570: "A",
    571: "C",
    572: "c",
    573: "L",
    574: "T",
    575: "s",
    576: "z",
    579: "B",
    580: "U",
    581: "V",
    582: "E",
    583: "e",
    584: "J",
    585: "j",
    586: "Q",
    587: "q",
    588: "R",
    589: "r",
    590: "Y",
    591: "y",
    592: "a",
    593: "a",
    595: "b",
    596: "o",
    597: "c",
    598: "d",
    599: "d",
    600: "e",
    603: "e",
    604: "e",
    605: "e",
    606: "e",
    607: "j",
    608: "g",
    609: "g",
    610: "G",
    613: "h",
    614: "h",
    616: "i",
    618: "I",
    619: "l",
    620: "l",
    621: "l",
    623: "m",
    624: "m",
    625: "m",
    626: "n",
    627: "n",
    628: "N",
    629: "o",
    633: "r",
    634: "r",
    635: "r",
    636: "r",
    637: "r",
    638: "r",
    639: "r",
    640: "R",
    641: "R",
    642: "s",
    647: "t",
    648: "t",
    649: "u",
    651: "v",
    652: "v",
    653: "w",
    654: "y",
    655: "Y",
    656: "z",
    657: "z",
    663: "c",
    665: "B",
    666: "e",
    667: "G",
    668: "H",
    669: "j",
    670: "k",
    671: "L",
    672: "q",
    686: "h",
    867: "a",
    868: "e",
    869: "i",
    870: "o",
    871: "u",
    872: "c",
    873: "d",
    874: "h",
    875: "m",
    876: "r",
    877: "t",
    878: "v",
    879: "x",
    7424: "A",
    7427: "B",
    7428: "C",
    7429: "D",
    7431: "E",
    7432: "e",
    7433: "i",
    7434: "J",
    7435: "K",
    7436: "L",
    7437: "M",
    7438: "N",
    7439: "O",
    7440: "O",
    7441: "o",
    7442: "o",
    7443: "o",
    7446: "o",
    7447: "o",
    7448: "P",
    7449: "R",
    7450: "R",
    7451: "T",
    7452: "U",
    7453: "u",
    7454: "u",
    7455: "m",
    7456: "V",
    7457: "W",
    7458: "Z",
    7522: "i",
    7523: "r",
    7524: "u",
    7525: "v",
    7834: "a",
    7835: "s",
    8305: "i",
    8341: "h",
    8342: "k",
    8343: "l",
    8344: "m",
    8345: "n",
    8346: "p",
    8347: "s",
    8348: "t",
    8580: "c"
  };
  for (let i = "̀".codePointAt(0); i <= "ͯ".codePointAt(0); ++i) {
    const diacritic = String.fromCodePoint(i);
    for (const asciiChar of "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
      const withDiacritic = (asciiChar + diacritic).normalize();
      const withDiacriticCodePoint = withDiacritic.codePointAt(0);
      if (withDiacriticCodePoint > 126) {
        normalized[withDiacriticCodePoint] = asciiChar;
      }
    }
  }
  const ranges = {
    a: [7844, 7863],
    e: [7870, 7879],
    o: [7888, 7907],
    u: [7912, 7921]
  };
  for (const lowerChar of Object.keys(ranges)) {
    const upperChar = lowerChar.toUpperCase();
    for (let i = ranges[lowerChar][0]; i <= ranges[lowerChar][1]; ++i) {
      normalized[i] = i % 2 === 0 ? upperChar : lowerChar;
    }
  }
  function normalizeRune(rune) {
    if (rune < 192 || rune > 8580) {
      return rune;
    }
    const normalizedChar = normalized[rune];
    if (normalizedChar !== void 0)
      return normalizedChar.codePointAt(0);
    return rune;
  }
  function toShort(number) {
    return number;
  }
  function toInt(number) {
    return number;
  }
  function maxInt16(num1, num2) {
    return num1 > num2 ? num1 : num2;
  }
  const strToRunes = (str) => str.split("").map((s) => s.codePointAt(0));
  const runesToStr = (runes) => runes.map((r) => String.fromCodePoint(r)).join("");
  const whitespaceRunes = new Set(
    " \f\n\r	\v  \u2028\u2029  　\uFEFF".split("").map((v) => v.codePointAt(0))
  );
  for (let codePoint = " ".codePointAt(0); codePoint <= " ".codePointAt(0); codePoint++) {
    whitespaceRunes.add(codePoint);
  }
  const isWhitespace = (rune) => whitespaceRunes.has(rune);
  const whitespacesAtStart = (runes) => {
    let whitespaces = 0;
    for (const rune of runes) {
      if (isWhitespace(rune))
        whitespaces++;
      else
        break;
    }
    return whitespaces;
  };
  const whitespacesAtEnd = (runes) => {
    let whitespaces = 0;
    for (let i = runes.length - 1; i >= 0; i--) {
      if (isWhitespace(runes[i]))
        whitespaces++;
      else
        break;
    }
    return whitespaces;
  };
  const MAX_ASCII = "".codePointAt(0);
  const CAPITAL_A_RUNE = "A".codePointAt(0);
  const CAPITAL_Z_RUNE = "Z".codePointAt(0);
  const SMALL_A_RUNE = "a".codePointAt(0);
  const SMALL_Z_RUNE = "z".codePointAt(0);
  const NUMERAL_ZERO_RUNE = "0".codePointAt(0);
  const NUMERAL_NINE_RUNE = "9".codePointAt(0);
  function indexAt(index, max, forward) {
    if (forward) {
      return index;
    }
    return max - index - 1;
  }
  const SCORE_MATCH = 16, SCORE_GAP_START = -3, SCORE_GAP_EXTENTION = -1, BONUS_BOUNDARY = SCORE_MATCH / 2, BONUS_NON_WORD = SCORE_MATCH / 2, BONUS_CAMEL_123 = BONUS_BOUNDARY + SCORE_GAP_EXTENTION, BONUS_CONSECUTIVE = -(SCORE_GAP_START + SCORE_GAP_EXTENTION), BONUS_FIRST_CHAR_MULTIPLIER = 2;
  function createPosSet(withPos) {
    if (withPos) {
      return /* @__PURE__ */ new Set();
    }
    return null;
  }
  function alloc16(offset, slab2, size) {
    if (slab2 !== null && slab2.i16.length > offset + size) {
      const subarray = slab2.i16.subarray(offset, offset + size);
      return [offset + size, subarray];
    }
    return [offset, new Int16Array(size)];
  }
  function alloc32(offset, slab2, size) {
    if (slab2 !== null && slab2.i32.length > offset + size) {
      const subarray = slab2.i32.subarray(offset, offset + size);
      return [offset + size, subarray];
    }
    return [offset, new Int32Array(size)];
  }
  function charClassOfAscii(rune) {
    if (rune >= SMALL_A_RUNE && rune <= SMALL_Z_RUNE) {
      return 1;
    } else if (rune >= CAPITAL_A_RUNE && rune <= CAPITAL_Z_RUNE) {
      return 2;
    } else if (rune >= NUMERAL_ZERO_RUNE && rune <= NUMERAL_NINE_RUNE) {
      return 4;
    } else {
      return 0;
    }
  }
  function charClassOfNonAscii(rune) {
    const char = String.fromCodePoint(rune);
    if (char !== char.toUpperCase()) {
      return 1;
    } else if (char !== char.toLowerCase()) {
      return 2;
    } else if (char.match(/\p{Number}/gu) !== null) {
      return 4;
    } else if (char.match(/\p{Letter}/gu) !== null) {
      return 3;
    }
    return 0;
  }
  function charClassOf(rune) {
    if (rune <= MAX_ASCII) {
      return charClassOfAscii(rune);
    }
    return charClassOfNonAscii(rune);
  }
  function bonusFor(prevClass, currClass) {
    if (prevClass === 0 && currClass !== 0) {
      return BONUS_BOUNDARY;
    } else if (prevClass === 1 && currClass === 2 || prevClass !== 4 && currClass === 4) {
      return BONUS_CAMEL_123;
    } else if (currClass === 0) {
      return BONUS_NON_WORD;
    }
    return 0;
  }
  function bonusAt(input, idx) {
    if (idx === 0) {
      return BONUS_BOUNDARY;
    }
    return bonusFor(charClassOf(input[idx - 1]), charClassOf(input[idx]));
  }
  function trySkip(input, caseSensitive, char, from) {
    let rest = input.slice(from);
    let idx = rest.indexOf(char);
    if (idx === 0) {
      return from;
    }
    if (!caseSensitive && char >= SMALL_A_RUNE && char <= SMALL_Z_RUNE) {
      if (idx > 0) {
        rest = rest.slice(0, idx);
      }
      const uidx = rest.indexOf(char - 32);
      if (uidx >= 0) {
        idx = uidx;
      }
    }
    if (idx < 0) {
      return -1;
    }
    return from + idx;
  }
  function isAscii(runes) {
    for (const rune of runes) {
      if (rune >= 128) {
        return false;
      }
    }
    return true;
  }
  function asciiFuzzyIndex(input, pattern, caseSensitive) {
    if (!isAscii(input)) {
      return 0;
    }
    if (!isAscii(pattern)) {
      return -1;
    }
    let firstIdx = 0, idx = 0;
    for (let pidx = 0; pidx < pattern.length; pidx++) {
      idx = trySkip(input, caseSensitive, pattern[pidx], idx);
      if (idx < 0) {
        return -1;
      }
      if (pidx === 0 && idx > 0) {
        firstIdx = idx - 1;
      }
      idx++;
    }
    return firstIdx;
  }
  const fuzzyMatchV2 = (caseSensitive, normalize, forward, input, pattern, withPos, slab2) => {
    const M = pattern.length;
    if (M === 0) {
      return [{ start: 0, end: 0, score: 0 }, createPosSet(withPos)];
    }
    const N = input.length;
    if (slab2 !== null && N * M > slab2.i16.length) {
      return fuzzyMatchV1(caseSensitive, normalize, forward, input, pattern, withPos);
    }
    const idx = asciiFuzzyIndex(input, pattern, caseSensitive);
    if (idx < 0) {
      return [{ start: -1, end: -1, score: 0 }, null];
    }
    let offset16 = 0, offset32 = 0, H0 = null, C0 = null, B = null, F = null;
    [offset16, H0] = alloc16(offset16, slab2, N);
    [offset16, C0] = alloc16(offset16, slab2, N);
    [offset16, B] = alloc16(offset16, slab2, N);
    [offset32, F] = alloc32(offset32, slab2, M);
    const [, T] = alloc32(offset32, slab2, N);
    for (let i = 0; i < T.length; i++) {
      T[i] = input[i];
    }
    let maxScore = toShort(0), maxScorePos = 0;
    let pidx = 0, lastIdx = 0;
    const pchar0 = pattern[0];
    let pchar = pattern[0], prevH0 = toShort(0), prevCharClass = 0, inGap = false;
    let Tsub = T.subarray(idx);
    let H0sub = H0.subarray(idx).subarray(0, Tsub.length), C0sub = C0.subarray(idx).subarray(0, Tsub.length), Bsub = B.subarray(idx).subarray(0, Tsub.length);
    for (let [off, char] of Tsub.entries()) {
      let charClass = null;
      if (char <= MAX_ASCII) {
        charClass = charClassOfAscii(char);
        if (!caseSensitive && charClass === 2) {
          char += 32;
        }
      } else {
        charClass = charClassOfNonAscii(char);
        if (!caseSensitive && charClass === 2) {
          char = String.fromCodePoint(char).toLowerCase().codePointAt(0);
        }
        if (normalize) {
          char = normalizeRune(char);
        }
      }
      Tsub[off] = char;
      const bonus = bonusFor(prevCharClass, charClass);
      Bsub[off] = bonus;
      prevCharClass = charClass;
      if (char === pchar) {
        if (pidx < M) {
          F[pidx] = toInt(idx + off);
          pidx++;
          pchar = pattern[Math.min(pidx, M - 1)];
        }
        lastIdx = idx + off;
      }
      if (char === pchar0) {
        const score = SCORE_MATCH + bonus * BONUS_FIRST_CHAR_MULTIPLIER;
        H0sub[off] = score;
        C0sub[off] = 1;
        if (M === 1 && (forward && score > maxScore || !forward && score >= maxScore)) {
          maxScore = score;
          maxScorePos = idx + off;
          if (forward && bonus === BONUS_BOUNDARY) {
            break;
          }
        }
        inGap = false;
      } else {
        if (inGap) {
          H0sub[off] = maxInt16(prevH0 + SCORE_GAP_EXTENTION, 0);
        } else {
          H0sub[off] = maxInt16(prevH0 + SCORE_GAP_START, 0);
        }
        C0sub[off] = 0;
        inGap = true;
      }
      prevH0 = H0sub[off];
    }
    if (pidx !== M) {
      return [{ start: -1, end: -1, score: 0 }, null];
    }
    if (M === 1) {
      const result = {
        start: maxScorePos,
        end: maxScorePos + 1,
        score: maxScore
      };
      if (!withPos) {
        return [result, null];
      }
      const pos2 = /* @__PURE__ */ new Set();
      pos2.add(maxScorePos);
      return [result, pos2];
    }
    const f0 = F[0];
    const width = lastIdx - f0 + 1;
    let H = null;
    [offset16, H] = alloc16(offset16, slab2, width * M);
    {
      const toCopy = H0.subarray(f0, lastIdx + 1);
      for (const [i, v] of toCopy.entries()) {
        H[i] = v;
      }
    }
    let [, C] = alloc16(offset16, slab2, width * M);
    {
      const toCopy = C0.subarray(f0, lastIdx + 1);
      for (const [i, v] of toCopy.entries()) {
        C[i] = v;
      }
    }
    const Fsub = F.subarray(1);
    const Psub = pattern.slice(1).slice(0, Fsub.length);
    for (const [off, f] of Fsub.entries()) {
      let inGap2 = false;
      const pchar2 = Psub[off], pidx2 = off + 1, row = pidx2 * width, Tsub2 = T.subarray(f, lastIdx + 1), Bsub2 = B.subarray(f).subarray(0, Tsub2.length), Csub = C.subarray(row + f - f0).subarray(0, Tsub2.length), Cdiag = C.subarray(row + f - f0 - 1 - width).subarray(0, Tsub2.length), Hsub = H.subarray(row + f - f0).subarray(0, Tsub2.length), Hdiag = H.subarray(row + f - f0 - 1 - width).subarray(0, Tsub2.length), Hleft = H.subarray(row + f - f0 - 1).subarray(0, Tsub2.length);
      Hleft[0] = 0;
      for (const [off2, char] of Tsub2.entries()) {
        const col = off2 + f;
        let s1 = 0, s2 = 0, consecutive = 0;
        if (inGap2) {
          s2 = Hleft[off2] + SCORE_GAP_EXTENTION;
        } else {
          s2 = Hleft[off2] + SCORE_GAP_START;
        }
        if (pchar2 === char) {
          s1 = Hdiag[off2] + SCORE_MATCH;
          let b = Bsub2[off2];
          consecutive = Cdiag[off2] + 1;
          if (b === BONUS_BOUNDARY) {
            consecutive = 1;
          } else if (consecutive > 1) {
            b = maxInt16(b, maxInt16(BONUS_CONSECUTIVE, B[col - consecutive + 1]));
          }
          if (s1 + b < s2) {
            s1 += Bsub2[off2];
            consecutive = 0;
          } else {
            s1 += b;
          }
        }
        Csub[off2] = consecutive;
        inGap2 = s1 < s2;
        const score = maxInt16(maxInt16(s1, s2), 0);
        if (pidx2 === M - 1 && (forward && score > maxScore || !forward && score >= maxScore)) {
          maxScore = score;
          maxScorePos = col;
        }
        Hsub[off2] = score;
      }
    }
    const pos = createPosSet(withPos);
    let j = f0;
    if (withPos && pos !== null) {
      let i = M - 1;
      j = maxScorePos;
      let preferMatch = true;
      while (true) {
        const I = i * width, j0 = j - f0, s = H[I + j0];
        let s1 = 0, s2 = 0;
        if (i > 0 && j >= F[i]) {
          s1 = H[I - width + j0 - 1];
        }
        if (j > F[i]) {
          s2 = H[I + j0 - 1];
        }
        if (s > s1 && (s > s2 || s === s2 && preferMatch)) {
          pos.add(j);
          if (i === 0) {
            break;
          }
          i--;
        }
        preferMatch = C[I + j0] > 1 || I + width + j0 + 1 < C.length && C[I + width + j0 + 1] > 0;
        j--;
      }
    }
    return [{ start: j, end: maxScorePos + 1, score: maxScore }, pos];
  };
  function calculateScore(caseSensitive, normalize, text, pattern, sidx, eidx, withPos) {
    let pidx = 0, score = 0, inGap = false, consecutive = 0, firstBonus = toShort(0);
    const pos = createPosSet(withPos);
    let prevCharClass = 0;
    if (sidx > 0) {
      prevCharClass = charClassOf(text[sidx - 1]);
    }
    for (let idx = sidx; idx < eidx; idx++) {
      let rune = text[idx];
      const charClass = charClassOf(rune);
      if (!caseSensitive) {
        if (rune >= CAPITAL_A_RUNE && rune <= CAPITAL_Z_RUNE) {
          rune += 32;
        } else if (rune > MAX_ASCII) {
          rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
        }
      }
      if (normalize) {
        rune = normalizeRune(rune);
      }
      if (rune === pattern[pidx]) {
        if (withPos && pos !== null) {
          pos.add(idx);
        }
        score += SCORE_MATCH;
        let bonus = bonusFor(prevCharClass, charClass);
        if (consecutive === 0) {
          firstBonus = bonus;
        } else {
          if (bonus === BONUS_BOUNDARY) {
            firstBonus = bonus;
          }
          bonus = maxInt16(maxInt16(bonus, firstBonus), BONUS_CONSECUTIVE);
        }
        if (pidx === 0) {
          score += bonus * BONUS_FIRST_CHAR_MULTIPLIER;
        } else {
          score += bonus;
        }
        inGap = false;
        consecutive++;
        pidx++;
      } else {
        if (inGap) {
          score += SCORE_GAP_EXTENTION;
        } else {
          score += SCORE_GAP_START;
        }
        inGap = true;
        consecutive = 0;
        firstBonus = 0;
      }
      prevCharClass = charClass;
    }
    return [score, pos];
  }
  const fuzzyMatchV1 = (caseSensitive, normalize, forward, text, pattern, withPos, slab2) => {
    if (pattern.length === 0) {
      return [{ start: 0, end: 0, score: 0 }, null];
    }
    if (asciiFuzzyIndex(text, pattern, caseSensitive) < 0) {
      return [{ start: -1, end: -1, score: 0 }, null];
    }
    let pidx = 0, sidx = -1, eidx = -1;
    const lenRunes = text.length;
    const lenPattern = pattern.length;
    for (let index = 0; index < lenRunes; index++) {
      let rune = text[indexAt(index, lenRunes, forward)];
      if (!caseSensitive) {
        if (rune >= CAPITAL_A_RUNE && rune <= CAPITAL_Z_RUNE) {
          rune += 32;
        } else if (rune > MAX_ASCII) {
          rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
        }
      }
      if (normalize) {
        rune = normalizeRune(rune);
      }
      const pchar = pattern[indexAt(pidx, lenPattern, forward)];
      if (rune === pchar) {
        if (sidx < 0) {
          sidx = index;
        }
        pidx++;
        if (pidx === lenPattern) {
          eidx = index + 1;
          break;
        }
      }
    }
    if (sidx >= 0 && eidx >= 0) {
      pidx--;
      for (let index = eidx - 1; index >= sidx; index--) {
        const tidx = indexAt(index, lenRunes, forward);
        let rune = text[tidx];
        if (!caseSensitive) {
          if (rune >= CAPITAL_A_RUNE && rune <= CAPITAL_Z_RUNE) {
            rune += 32;
          } else if (rune > MAX_ASCII) {
            rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
          }
        }
        const pidx_ = indexAt(pidx, lenPattern, forward);
        const pchar = pattern[pidx_];
        if (rune === pchar) {
          pidx--;
          if (pidx < 0) {
            sidx = index;
            break;
          }
        }
      }
      if (!forward) {
        const sidxTemp = sidx;
        sidx = lenRunes - eidx;
        eidx = lenRunes - sidxTemp;
      }
      const [score, pos] = calculateScore(
        caseSensitive,
        normalize,
        text,
        pattern,
        sidx,
        eidx,
        withPos
      );
      return [{ start: sidx, end: eidx, score }, pos];
    }
    return [{ start: -1, end: -1, score: 0 }, null];
  };
  const exactMatchNaive = (caseSensitive, normalize, forward, text, pattern, withPos, slab2) => {
    if (pattern.length === 0) {
      return [{ start: 0, end: 0, score: 0 }, null];
    }
    const lenRunes = text.length;
    const lenPattern = pattern.length;
    if (lenRunes < lenPattern) {
      return [{ start: -1, end: -1, score: 0 }, null];
    }
    if (asciiFuzzyIndex(text, pattern, caseSensitive) < 0) {
      return [{ start: -1, end: -1, score: 0 }, null];
    }
    let pidx = 0;
    let bestPos = -1, bonus = toShort(0), bestBonus = toShort(-1);
    for (let index = 0; index < lenRunes; index++) {
      const index_ = indexAt(index, lenRunes, forward);
      let rune = text[index_];
      if (!caseSensitive) {
        if (rune >= CAPITAL_A_RUNE && rune <= CAPITAL_Z_RUNE) {
          rune += 32;
        } else if (rune > MAX_ASCII) {
          rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
        }
      }
      if (normalize) {
        rune = normalizeRune(rune);
      }
      const pidx_ = indexAt(pidx, lenPattern, forward);
      const pchar = pattern[pidx_];
      if (pchar === rune) {
        if (pidx_ === 0) {
          bonus = bonusAt(text, index_);
        }
        pidx++;
        if (pidx === lenPattern) {
          if (bonus > bestBonus) {
            bestPos = index;
            bestBonus = bonus;
          }
          if (bonus === BONUS_BOUNDARY) {
            break;
          }
          index -= pidx - 1;
          pidx = 0;
          bonus = 0;
        }
      } else {
        index -= pidx;
        pidx = 0;
        bonus = 0;
      }
    }
    if (bestPos >= 0) {
      let sidx = 0, eidx = 0;
      if (forward) {
        sidx = bestPos - lenPattern + 1;
        eidx = bestPos + 1;
      } else {
        sidx = lenRunes - (bestPos + 1);
        eidx = lenRunes - (bestPos - lenPattern + 1);
      }
      const [score] = calculateScore(caseSensitive, normalize, text, pattern, sidx, eidx, false);
      return [{ start: sidx, end: eidx, score }, null];
    }
    return [{ start: -1, end: -1, score: 0 }, null];
  };
  const prefixMatch = (caseSensitive, normalize, forward, text, pattern, withPos, slab2) => {
    if (pattern.length === 0) {
      return [{ start: 0, end: 0, score: 0 }, null];
    }
    let trimmedLen = 0;
    if (!isWhitespace(pattern[0])) {
      trimmedLen = whitespacesAtStart(text);
    }
    if (text.length - trimmedLen < pattern.length) {
      return [{ start: -1, end: -1, score: 0 }, null];
    }
    for (const [index, r] of pattern.entries()) {
      let rune = text[trimmedLen + index];
      if (!caseSensitive) {
        rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
      }
      if (normalize) {
        rune = normalizeRune(rune);
      }
      if (rune !== r) {
        return [{ start: -1, end: -1, score: 0 }, null];
      }
    }
    const lenPattern = pattern.length;
    const [score] = calculateScore(
      caseSensitive,
      normalize,
      text,
      pattern,
      trimmedLen,
      trimmedLen + lenPattern,
      false
    );
    return [{ start: trimmedLen, end: trimmedLen + lenPattern, score }, null];
  };
  const suffixMatch = (caseSensitive, normalize, forward, text, pattern, withPos, slab2) => {
    const lenRunes = text.length;
    let trimmedLen = lenRunes;
    if (pattern.length === 0 || !isWhitespace(pattern[pattern.length - 1])) {
      trimmedLen -= whitespacesAtEnd(text);
    }
    if (pattern.length === 0) {
      return [{ start: trimmedLen, end: trimmedLen, score: 0 }, null];
    }
    const diff = trimmedLen - pattern.length;
    if (diff < 0) {
      return [{ start: -1, end: -1, score: 0 }, null];
    }
    for (const [index, r] of pattern.entries()) {
      let rune = text[index + diff];
      if (!caseSensitive) {
        rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
      }
      if (normalize) {
        rune = normalizeRune(rune);
      }
      if (rune !== r) {
        return [{ start: -1, end: -1, score: 0 }, null];
      }
    }
    const lenPattern = pattern.length;
    const sidx = trimmedLen - lenPattern;
    const eidx = trimmedLen;
    const [score] = calculateScore(caseSensitive, normalize, text, pattern, sidx, eidx, false);
    return [{ start: sidx, end: eidx, score }, null];
  };
  const equalMatch = (caseSensitive, normalize, forward, text, pattern, withPos, slab2) => {
    const lenPattern = pattern.length;
    if (lenPattern === 0) {
      return [{ start: -1, end: -1, score: 0 }, null];
    }
    let trimmedLen = 0;
    if (!isWhitespace(pattern[0])) {
      trimmedLen = whitespacesAtStart(text);
    }
    let trimmedEndLen = 0;
    if (!isWhitespace(pattern[lenPattern - 1])) {
      trimmedEndLen = whitespacesAtEnd(text);
    }
    if (text.length - trimmedLen - trimmedEndLen != lenPattern) {
      return [{ start: -1, end: -1, score: 0 }, null];
    }
    let match = true;
    if (normalize) {
      const runes = text;
      for (const [idx, pchar] of pattern.entries()) {
        let rune = runes[trimmedLen + idx];
        if (!caseSensitive) {
          rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
        }
        if (normalizeRune(pchar) !== normalizeRune(rune)) {
          match = false;
          break;
        }
      }
    } else {
      let runesStr = runesToStr(text).substring(trimmedLen, text.length - trimmedEndLen);
      if (!caseSensitive) {
        runesStr = runesStr.toLowerCase();
      }
      match = runesStr === runesToStr(pattern);
    }
    if (match) {
      return [
        {
          start: trimmedLen,
          end: trimmedLen + lenPattern,
          score: (SCORE_MATCH + BONUS_BOUNDARY) * lenPattern + (BONUS_FIRST_CHAR_MULTIPLIER - 1) * BONUS_BOUNDARY
        },
        null
      ];
    }
    return [{ start: -1, end: -1, score: 0 }, null];
  };
  const SLAB_16_SIZE = 100 * 1024;
  const SLAB_32_SIZE = 2048;
  function makeSlab(size16, size32) {
    return {
      i16: new Int16Array(size16),
      i32: new Int32Array(size32)
    };
  }
  const slab = makeSlab(SLAB_16_SIZE, SLAB_32_SIZE);
  var TermType = /* @__PURE__ */ ((TermType2) => {
    TermType2[TermType2["Fuzzy"] = 0] = "Fuzzy";
    TermType2[TermType2["Exact"] = 1] = "Exact";
    TermType2[TermType2["Prefix"] = 2] = "Prefix";
    TermType2[TermType2["Suffix"] = 3] = "Suffix";
    TermType2[TermType2["Equal"] = 4] = "Equal";
    return TermType2;
  })(TermType || {});
  const termTypeMap = {
    [0]: fuzzyMatchV2,
    [1]: exactMatchNaive,
    [2]: prefixMatch,
    [3]: suffixMatch,
    [4]: equalMatch
  };
  function buildPatternForExtendedMatch(fuzzy, caseMode, normalize, str) {
    let cacheable = true;
    str = str.trimLeft();
    {
      const trimmedAtRightStr = str.trimRight();
      if (trimmedAtRightStr.endsWith("\\") && str[trimmedAtRightStr.length] === " ") {
        str = trimmedAtRightStr + " ";
      } else {
        str = trimmedAtRightStr;
      }
    }
    let sortable = false;
    let termSets = [];
    termSets = parseTerms(fuzzy, caseMode, normalize, str);
    Loop:
      for (const termSet of termSets) {
        for (const [idx, term] of termSet.entries()) {
          if (!term.inv) {
            sortable = true;
          }
          if (!cacheable || idx > 0 || term.inv || fuzzy && term.typ !== 0 || !fuzzy && term.typ !== 1) {
            cacheable = false;
            if (sortable) {
              break Loop;
            }
          }
        }
      }
    return {
      str,
      termSets,
      sortable,
      cacheable,
      fuzzy
    };
  }
  function parseTerms(fuzzy, caseMode, normalize, str) {
    str = str.replace(/\\ /g, "	");
    const tokens = str.split(/ +/);
    const sets = [];
    let set = [];
    let switchSet = false;
    let afterBar = false;
    for (const token of tokens) {
      let typ = 0, inv = false, text = token.replace(/\t/g, " ");
      const lowerText = text.toLowerCase();
      const caseSensitive = caseMode === "case-sensitive" || caseMode === "smart-case" && text !== lowerText;
      const normalizeTerm = normalize && lowerText === runesToStr(strToRunes(lowerText).map(normalizeRune));
      if (!caseSensitive) {
        text = lowerText;
      }
      if (!fuzzy) {
        typ = 1;
      }
      if (set.length > 0 && !afterBar && text === "|") {
        switchSet = false;
        afterBar = true;
        continue;
      }
      afterBar = false;
      if (text.startsWith("!")) {
        inv = true;
        typ = 1;
        text = text.substring(1);
      }
      if (text !== "$" && text.endsWith("$")) {
        typ = 3;
        text = text.substring(0, text.length - 1);
      }
      if (text.startsWith("'")) {
        if (fuzzy && !inv) {
          typ = 1;
        } else {
          typ = 0;
        }
        text = text.substring(1);
      } else if (text.startsWith("^")) {
        if (typ === 3) {
          typ = 4;
        } else {
          typ = 2;
        }
        text = text.substring(1);
      }
      if (text.length > 0) {
        if (switchSet) {
          sets.push(set);
          set = [];
        }
        let textRunes = strToRunes(text);
        if (normalizeTerm) {
          textRunes = textRunes.map(normalizeRune);
        }
        set.push({
          typ,
          inv,
          text: textRunes,
          caseSensitive,
          normalize: normalizeTerm
        });
        switchSet = true;
      }
    }
    if (set.length > 0) {
      sets.push(set);
    }
    return sets;
  }
  const buildPatternForBasicMatch = (query, casing, normalize) => {
    let caseSensitive = false;
    switch (casing) {
      case "smart-case":
        if (query.toLowerCase() !== query) {
          caseSensitive = true;
        }
        break;
      case "case-sensitive":
        caseSensitive = true;
        break;
      case "case-insensitive":
        query = query.toLowerCase();
        caseSensitive = false;
        break;
    }
    let queryRunes = strToRunes(query);
    if (normalize) {
      queryRunes = queryRunes.map(normalizeRune);
    }
    return {
      queryRunes,
      caseSensitive
    };
  };
  function iter(algoFn, tokens, caseSensitive, normalize, forward, pattern, slab2) {
    for (const part of tokens) {
      const [res, pos] = algoFn(caseSensitive, normalize, forward, part.text, pattern, true, slab2);
      if (res.start >= 0) {
        const sidx = res.start + part.prefixLength;
        const eidx = res.end + part.prefixLength;
        if (pos !== null) {
          const newPos = /* @__PURE__ */ new Set();
          pos.forEach((v) => newPos.add(part.prefixLength + v));
          return [[sidx, eidx], res.score, newPos];
        }
        return [[sidx, eidx], res.score, pos];
      }
    }
    return [[-1, -1], 0, null];
  }
  function computeExtendedMatch(text, pattern, fuzzyAlgo, forward) {
    const input = [
      {
        text,
        prefixLength: 0
      }
    ];
    const offsets = [];
    let totalScore = 0;
    const allPos = /* @__PURE__ */ new Set();
    for (const termSet of pattern.termSets) {
      let offset = [0, 0];
      let currentScore = 0;
      let matched = false;
      for (const term of termSet) {
        let algoFn = termTypeMap[term.typ];
        if (term.typ === TermType.Fuzzy) {
          algoFn = fuzzyAlgo;
        }
        const [off, score, pos] = iter(
          algoFn,
          input,
          term.caseSensitive,
          term.normalize,
          forward,
          term.text,
          slab
        );
        const sidx = off[0];
        if (sidx >= 0) {
          if (term.inv) {
            continue;
          }
          offset = off;
          currentScore = score;
          matched = true;
          if (pos !== null) {
            pos.forEach((v) => allPos.add(v));
          } else {
            for (let idx = off[0]; idx < off[1]; ++idx) {
              allPos.add(idx);
            }
          }
          break;
        } else if (term.inv) {
          offset = [0, 0];
          currentScore = 0;
          matched = true;
          continue;
        }
      }
      if (matched) {
        offsets.push(offset);
        totalScore += currentScore;
      }
    }
    return { offsets, totalScore, allPos };
  }
  function getResultFromScoreMap(scoreMap, limit) {
    const scoresInDesc = Object.keys(scoreMap).map((v) => parseInt(v, 10)).sort((a, b) => b - a);
    let result = [];
    for (const score of scoresInDesc) {
      result = result.concat(scoreMap[score]);
      if (result.length >= limit) {
        break;
      }
    }
    return result;
  }
  function getBasicMatchIter(scoreMap, queryRunes, caseSensitive) {
    return (idx) => {
      const itemRunes = this.runesList[idx];
      if (queryRunes.length > itemRunes.length)
        return;
      let [match, positions] = this.algoFn(
        caseSensitive,
        this.opts.normalize,
        this.opts.forward,
        itemRunes,
        queryRunes,
        true,
        slab
      );
      if (match.start === -1)
        return;
      if (this.opts.fuzzy === false) {
        positions = /* @__PURE__ */ new Set();
        for (let position = match.start; position < match.end; ++position) {
          positions.add(position);
        }
      }
      const scoreKey = this.opts.sort ? match.score : 0;
      if (scoreMap[scoreKey] === void 0) {
        scoreMap[scoreKey] = [];
      }
      scoreMap[scoreKey].push({
        item: this.items[idx],
        ...match,
        positions: positions != null ? positions : /* @__PURE__ */ new Set()
      });
    };
  }
  function getExtendedMatchIter(scoreMap, pattern) {
    return (idx) => {
      const runes = this.runesList[idx];
      const match = computeExtendedMatch(runes, pattern, this.algoFn, this.opts.forward);
      if (match.offsets.length !== pattern.termSets.length)
        return;
      let sidx = -1, eidx = -1;
      if (match.allPos.size > 0) {
        sidx = Math.min(...match.allPos);
        eidx = Math.max(...match.allPos) + 1;
      }
      const scoreKey = this.opts.sort ? match.totalScore : 0;
      if (scoreMap[scoreKey] === void 0) {
        scoreMap[scoreKey] = [];
      }
      scoreMap[scoreKey].push({
        score: match.totalScore,
        item: this.items[idx],
        positions: match.allPos,
        start: sidx,
        end: eidx
      });
    };
  }
  function basicMatch(query) {
    const { queryRunes, caseSensitive } = buildPatternForBasicMatch(
      query,
      this.opts.casing,
      this.opts.normalize
    );
    const scoreMap = {};
    const iter2 = getBasicMatchIter.bind(this)(
      scoreMap,
      queryRunes,
      caseSensitive
    );
    for (let i = 0, len = this.runesList.length; i < len; ++i) {
      iter2(i);
    }
    return getResultFromScoreMap(scoreMap, this.opts.limit);
  }
  function extendedMatch(query) {
    const pattern = buildPatternForExtendedMatch(
      Boolean(this.opts.fuzzy),
      this.opts.casing,
      this.opts.normalize,
      query
    );
    const scoreMap = {};
    const iter2 = getExtendedMatchIter.bind(this)(scoreMap, pattern);
    for (let i = 0, len = this.runesList.length; i < len; ++i) {
      iter2(i);
    }
    return getResultFromScoreMap(scoreMap, this.opts.limit);
  }
  const defaultOpts = {
    limit: Infinity,
    selector: (v) => v,
    casing: "smart-case",
    normalize: true,
    fuzzy: "v2",
    tiebreakers: [],
    sort: true,
    forward: true
  };
  class BaseFinder {
    constructor(list, ...optionsTuple) {
      this.opts = { ...defaultOpts, ...optionsTuple[0] };
      this.items = list;
      this.runesList = list.map((item) => strToRunes(this.opts.selector(item).normalize()));
      this.algoFn = exactMatchNaive;
      switch (this.opts.fuzzy) {
        case "v2":
          this.algoFn = fuzzyMatchV2;
          break;
        case "v1":
          this.algoFn = fuzzyMatchV1;
          break;
      }
    }
  }
  const syncDefaultOpts = {
    ...defaultOpts,
    match: basicMatch
  };
  class SyncFinder extends BaseFinder {
    constructor(list, ...optionsTuple) {
      super(list, ...optionsTuple);
      this.opts = { ...syncDefaultOpts, ...optionsTuple[0] };
    }
    find(query) {
      if (query.length === 0 || this.items.length === 0)
        return this.items.slice(0, this.opts.limit).map(createResultItemWithEmptyPos);
      query = query.normalize();
      let result = this.opts.match.bind(this)(query);
      return postProcessResultItems(result, this.opts);
    }
  }
  const createResultItemWithEmptyPos = (item) => ({
    item,
    start: -1,
    end: -1,
    score: 0,
    positions: /* @__PURE__ */ new Set()
  });
  function postProcessResultItems(result, opts) {
    if (opts.sort) {
      const { selector } = opts;
      result.sort((a, b) => {
        if (a.score === b.score) {
          for (const tiebreaker of opts.tiebreakers) {
            const diff = tiebreaker(a, b, selector);
            if (diff !== 0) {
              return diff;
            }
          }
        }
        return 0;
      });
    }
    if (Number.isFinite(opts.limit)) {
      result.splice(opts.limit);
    }
    return result;
  }
  function byLengthAsc(a, b, selector) {
    return selector(a.item).length - selector(b.item).length;
  }
  function byStartAsc(a, b) {
    return a.start - b.start;
  }
  class Fzf {
    constructor(list, ...optionsTuple) {
      this.finder = new SyncFinder(list, ...optionsTuple);
      this.find = this.finder.find.bind(this.finder);
    }
  }
  function NormalizeName(name) {
    const rules = [
      { input: "[aä@âàáạåæā]", output: "a" },
      { input: "[bß]", output: "b" },
      { input: "[č]", output: "c" },
      { input: "[eéêëèæē]", output: "e" },
      { input: "[ií]", output: "i" },
      { input: "[nñ]", output: "n" },
      { input: "[oōóòöôøΦ]", output: "o" },
      { input: "[uuūûúùüǖ]", output: "u" },
      { input: "[x×]", output: "x" },
      { input: "[2²]", output: "2" },
      { input: "[3³]", output: "3" },
      { input: "['’]", output: "'" },
      { input: "[★☆·♥∽・〜†×♪→␣]", output: " " }
    ];
    let ret = "";
    name.split("").forEach((c) => {
      rules.forEach((rule) => {
        if (RegExp(rule.input).test(c)) {
          c = rule.output;
        }
      });
      ret += c;
    });
    return ret.replace(/\s\s+/g, " ");
  }
  function FzfAmqAwesomplete(input, o, scrollable) {
    console.log("AmqAwesomeplete init");
    o.autoFirst = true;
    o.filter = (text, input2) => {
      return RegExp(input2.trim(), "i").test(text);
    };
    Awesomplete.call(this, input, o);
    this.searchId = 0;
    this.currentSubList = null;
    this.o = o;
    console.log("fzf init");
    let fzfList = [];
    this.o.list.forEach((inputEntry) => {
      fzfList.push({ name: inputEntry, NormalizedName: NormalizeName(inputEntry) });
    });
    this.fzf = new Fzf(fzfList, {
      casing: "case-insensitive",
      selector: (item) => item.NormalizedName,
      match: extendedMatch,
      tiebreakers: [byLengthAsc, byStartAsc]
    });
    this.currentQuery = "";
    this.$ul = $(this.ul);
    if (scrollable) {
      let $input = $(input);
      let $awesompleteList = $input.parent().find("ul");
      $awesompleteList.perfectScrollbar({
        suppressScrollX: true
      });
      $input.on("awesomplete-open", () => {
        $awesompleteList.perfectScrollbar("update");
        $awesompleteList[0].scrollTop = 0;
      });
    }
    let create = function(tag, o2) {
      var element = document.createElement(tag);
      for (var i in o2) {
        var val = o2[i];
        if (i === "inside") {
          $(val).appendChild(element);
        } else if (i === "around") {
          var ref = $(val);
          ref.parentNode.insertBefore(element, ref);
          element.appendChild(ref);
          if (ref.getAttribute("autofocus") != null) {
            ref.focus();
          }
        } else if (i in element) {
          element[i] = val;
        } else {
          element.setAttribute(i, val);
        }
      }
      return element;
    };
    this.item = function(text, item_id) {
      var html = text;
      return create("li", {
        innerHTML: html,
        "role": "option",
        "aria-selected": "false",
        "id": "awesomplete_list_" + this.count + "_item_" + item_id
      });
    };
  }
  function FzfEvaluate() {
    var me = this;
    let unescapedValue = this.input.value;
    var value = createAnimeSearchRegexQuery(unescapedValue);
    if (value.length >= this.minChars && this.fzf) {
      this.searchId++;
      this.searchId;
      $("#qpAnswerInputLoadingContainer").removeClass("hide");
      this.index = -1;
      this.$ul.children("li").remove();
      let handlePassedSuggestions = function(me2) {
        this.suggestions = this.suggestions.slice(0, this.maxItems);
        for (let i = this.suggestions.length - 1; i >= 0; i--) {
          let suggestion = this.suggestions[i].label;
          me2.ul.insertBefore(me2.item(suggestion, i), me2.ul.firstChild);
        }
        if (this.ul.children.length === 0) {
          this.status.textContent = "No results found";
          this.close({ reason: "nomatches" });
        } else {
          this.open();
          this.status.textContent = this.ul.children.length + " results found";
        }
        $("#qpAnswerInputLoadingContainer").addClass("hide");
      }.bind(this);
      let normalizedValue = NormalizeName(unescapedValue);
      const entries = this.fzf.find(normalizedValue);
      for (let entry of entries) {
        let basic_fzf = new Fzf([entry.item.NormalizedName], {
          casing: "case-insensitive",
          match: basicMatch
        });
        let basic_entries = basic_fzf.find(normalizedValue);
        if (basic_entries.length == 0) {
          entry.basic_score = 0;
        } else {
          entry.basic_score = basic_entries[0].score;
          entry.basic_positions = basic_entries[0].positions;
        }
      }
      entries.sort(function(a, b) {
        let factor_a = [-a.score, -a.basic_score, a.length, a.item.start];
        let factor_b = [-b.score, -b.basic_score, b.length, b.item.start];
        for (let i in factor_a) {
          if (factor_a[i] > factor_b[i]) {
            return 1;
          }
          if (factor_a[i] < factor_b[i]) {
            return -1;
          }
        }
        return 0;
      });
      let fzf_suggestions = [];
      for (let entry of entries) {
        let positions = entry.basic_score > 0 ? entry.basic_positions : entry.positions;
        let name = entry.item.name;
        let label = "";
        for (let i = 0; i < name.length; ++i) {
          if (positions.has(i)) {
            label += "<mark>" + name[i] + "</mark>";
          } else {
            label += name[i];
          }
        }
        let suggestion = new Suggestion([label, name]);
        fzf_suggestions.push(suggestion);
      }
      this.suggestions = fzf_suggestions;
      handlePassedSuggestions(me);
    } else {
      this.close({ reason: "nomatches" });
      this.status.textContent = "No results found";
    }
  }
  class CustomAutocomplete {
    constructor() {
      __publicField(this, "name", "Custom Autocomplete");
      __publicField(this, "options");
      __publicField(this, "_enabled", false);
      __publicField(this, "_FZFAwesomeplete");
      __publicField(this, "_originNewList");
      __publicField(this, "_customNewList");
      this.options = new Options({
        title: this.name
      });
      this.options.push(new CheckboxOption({
        name: "autoFirst",
        inputId: "amqtbCustomAutocmpleteAutoFirst",
        label: "Auto select the first matched answer",
        offset: 0,
        saveIn: "Script",
        defaultValue: false
      }));
      this.options.push(new CheckboxOption({
        name: "redo",
        inputId: "amqtbCustomAutocmpleteRedo",
        label: "Can redo after select a answer (experimental)",
        offset: 0,
        saveIn: "Script",
        defaultValue: false,
        description: "Can use Ctrl-Z to return to the last input even if a answer was selected.(Disable this if any Compatibility issues)"
      }));
      this.options.push(new RadioOption({
        name: "matchMethod",
        inputId: "amqtbDownloaderAutoDlMediaType",
        label: "Match Algorithm",
        saveIn: "Script",
        offset: 0,
        choices: [
          {
            label: "Origin(AMQ)",
            value: "Origin"
          },
          {
            label: "FZF",
            value: "FZF"
          }
        ],
        defaultValue: "Origin"
      }));
      this._FZFAwesomeplete = FzfAmqAwesomplete;
      this._FZFAwesomeplete.prototype = Object.create(Awesomplete.prototype);
      this._FZFAwesomeplete.prototype.constructor = FzfAmqAwesomplete;
      this._FZFAwesomeplete.prototype.evaluate = FzfEvaluate;
      this._originNewList = quiz.answerInput.typingInput.autoCompleteController.newList;
      this._customNewList = () => {
        let acc = quiz.answerInput.typingInput.autoCompleteController;
        let autoFirst = this.options.get("autoFirst").getValue();
        let redoOpt = this.options.get("redo").getValue();
        let matchMethod = this.options.get("matchMethod").getValue();
        console.log("[Custom Autocomplete] Do custom newList()");
        if (acc.awesomepleteInstance) {
          acc.awesomepleteInstance.destroy();
        }
        if (matchMethod === "Origin") {
          acc.awesomepleteInstance = new AmqAwesomeplete(
            acc.$input[0],
            {
              list: acc.list,
              minChars: 1,
              maxItems: 25
            },
            true
          );
        } else if (matchMethod === "FZF") {
          acc.awesomepleteInstance = new this._FZFAwesomeplete(
            acc.$input[0],
            {
              list: acc.list,
              minChars: 1,
              maxItems: 25
            },
            true
          );
        }
        if (redoOpt) {
          acc.awesomepleteInstance.replace = function(suggestion) {
            this.input.focus();
            this.input.select();
            document.execCommand("insertText", false, suggestion.value);
          };
        }
        quiz.answerInput.typingInput.autoCompleteController.awesomepleteInstance.autoFirst = autoFirst;
      };
      this.options.get("autoFirst").input.on("click", () => {
        let opt = this.options.get("autoFirst").getValue();
        if (quiz.answerInput.typingInput.autoCompleteController.awesomepleteInstance) {
          quiz.answerInput.typingInput.autoCompleteController.awesomepleteInstance.autoFirst = opt;
        }
      });
      this.options.get("redo").input.on("click", () => {
        this.updateAutoComplete();
      });
      this.options.get("matchMethod").input.on("change", () => {
        this.updateAutoComplete();
      });
    }
    enable() {
      this._enabled = true;
      quiz.answerInput.typingInput.autoCompleteController.newList = this._customNewList;
      this.updateAutoComplete();
    }
    disable() {
      this._enabled = false;
      quiz.answerInput.typingInput.autoCompleteController.newList = this._originNewList;
      this.updateAutoComplete();
    }
    enabled() {
      return this._enabled;
    }
    updateAutoComplete() {
      quiz.answerInput.typingInput.autoCompleteController.newList();
    }
  }
  function main() {
    onStartPageLoaded(() => {
      registerPlugin(new CustomAutocomplete());
    });
  }
  $(main);

})();
