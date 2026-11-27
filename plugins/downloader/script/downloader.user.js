// ==UserScript==
// @name         AMQ Downloader
// @namespace    https://github.com/JJJJoe-Lin
// @version      0.4.5
// @author       JJJJoe
// @description  AMQ song downloader
// @downloadURL  https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js
// @updateURL    https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js
// @include      /^https:\/\/animemusicquiz\.com\/(\?.*|#.*)?$/
// @connect      cdn.animenewsnetwork.com
// @connect      ladist1.catbox.video
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

(function() {
	// \0./main-B3NK9SRl.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	var Container = class {
		self;
		name;
		container;
		constructor(opt) {
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
			for (let component of this.container) this.detachComponent(component);
			let deleted;
			if (deleteCount === void 0) deleted = this.container.splice(start);
			else deleted = this.container.splice(start, deleteCount, ...components);
			for (let component of this.container) this.appendComponent(component);
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
	};
	var Buttons = class extends Container {
		constructor(opt) {
			super(opt);
			this.self.addClass("amqtbButtonContainer");
		}
	};
	var SIZE_MAP$2 = {
		"large": "btn-lg",
		"normal": "",
		"small": "btn-sm"
	};
	var Modal = class extends Container {
		contentBlock;
		components = this.container;
		constructor(opt) {
			super(opt);
			const dialog = $(`<div class="modal-dialog" role="document"></div>`).addClass(SIZE_MAP$2[opt.size]);
			const content = $(`<div class="modal-content"></div>`);
			const header = $(`<div class="modal-header"></div>`);
			const title = $(`<h2 class="modal-title">${opt.title}</h2>`);
			const closeIcon = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`).append($(`<span aria-hidden="true">×</span>`));
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
	};
	var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
	var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
	var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
	var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
	var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
	var attr = {
		expires: 365,
		Domain: "animemusicquiz.com",
		secure: true
	};
	function saveToCookie(key, entry) {
		Cookies.set(key, JSON.stringify(entry), attr);
	}
	function loadFromCookie(key, defaultVal) {
		let val = Cookies.get(key);
		if (val === void 0) return defaultVal;
		else return JSON.parse(val);
	}
	function saveToLocalStorage(key, entry) {
		localStorage.setItem(key, JSON.stringify(entry));
	}
	function loadFromLocalStorage(key, defaultVal) {
		const val = localStorage.getItem(key);
		if (val === null) return defaultVal;
		else return JSON.parse(val);
	}
	function saveStorable(comp, type) {
		switch (type) {
			case "Script":
				_GM_setValue(comp.name, comp.getValue());
				break;
			case "LocalStorage":
				saveToLocalStorage(comp.name, comp.getValue());
				break;
			case "Cookie": saveToCookie(comp.name, comp.getValue());
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
			case "Cookie": val = loadFromCookie(comp.name);
		}
		if (val !== void 0) comp.setValue(val);
	}
	var RadioOption = class {
		name;
		self;
		input;
		enables;
		saveIn;
		choices;
		constructor(opt) {
			const id = opt.id === void 0 ? "" : opt.id;
			const cls = opt.class === void 0 ? "" : opt.class;
			this.saveIn = opt.saveIn;
			this.enables = opt.enables;
			this.name = opt.name;
			if (opt.choices.length > 10) this.choices = opt.choices.slice(0, 10);
			else this.choices = opt.choices;
			this.self = $(`<div class='amqtbRadio'></div>`).attr("id", id).addClass(cls).addClass(opt.offset !== 0 ? `offset${opt.offset}` : "");
			if (opt.label) {
				const label = $(`<label></label>`).text(opt.label).css("width", "100%");
				if (opt.description) label.popover({
					content: opt.description,
					trigger: "hover",
					placement: "top"
				});
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
			if (idx !== -1) this.input.bootstrapSlider("setValue", idx);
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
	};
	var Options = class extends Container {
		options = this.container;
		constructor(opt) {
			super(opt);
			this.self.addClass("col-xs-6");
			this.self.append($(`<h4>${opt.title}</h4>`).css("text-align", "center"));
		}
		refresh() {
			for (let option of this.options) option.input.trigger("amqtoolbox.option.enables", String(option.getValue()));
		}
		splice(start, deleteCount, ...opts) {
			let ret;
			if (deleteCount === void 0) ret = super.splice(start);
			else ret = super.splice(start, deleteCount, ...opts);
			if (!checkEnables(this.options)) throw new Error("Duplicated optionName in enables with other options");
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
				for (let option of this.options) if (enables.includes(option.name)) option.enable();
				else if (disables.includes(option.name)) option.disable();
			}
			if (opt instanceof RadioOption) opt.relayout();
		}
	};
	function getEnables(opt, optEnableKey) {
		const enabledOptNames = /* @__PURE__ */ new Set();
		const disabledOptNames = /* @__PURE__ */ new Set();
		if (opt.enables !== void 0) for (let [key, optNames] of Object.entries(opt.enables)) for (let optName of optNames) if (optEnableKey === void 0 || optEnableKey === key) enabledOptNames.add(optName);
		else disabledOptNames.add(optName);
		if (optEnableKey === void 0) return [...enabledOptNames];
		else return {
			enabledOptNames: [...enabledOptNames],
			disabledOptNames: [...disabledOptNames]
		};
	}
	function checkEnables(options) {
		const optNames = /* @__PURE__ */ new Set();
		for (let option of options) {
			const enables = getEnables(option);
			for (let enable of enables) {
				if (optNames.has(enable)) return false;
				optNames.add(enable);
			}
		}
		return true;
	}
	var Tab = class extends Container {
		content;
		components = this.container;
		constructor(opt) {
			super(opt);
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
	};
	var SIZE_MAP$1 = {
		"large": "btn-lg",
		"normal": "",
		"small": "btn-sm"
	};
	var TabModal = class extends Container {
		contentBlock;
		tabBlock;
		tabs = this.container;
		curTab;
		constructor(opt) {
			super(opt);
			const dialog = $(`<div class="modal-dialog" role="document"></div>`).addClass(SIZE_MAP$1[opt.size]);
			const content = $(`<div class="modal-content"></div>`);
			const header = $(`<div class="modal-header"></div>`);
			const title = $(`<h4 class="modal-title">${opt.title}</h4>`);
			const closeIcon = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`).append($(`<span aria-hidden="true">×</span>`));
			this.tabBlock = $(`<div class="tabContainer"></div>`);
			this.contentBlock = $(`<div class="modal-body"></div>`);
			this.self.addClass("modal fade tab-modal").attr("tabindex", "-1").attr("role", "dialog").append(dialog.append(content.append(header.append(closeIcon, title)).append(this.tabBlock).append(this.contentBlock)));
			this.curTab = null;
			$("#gameContainer").append(this.self);
		}
		push(...tabs) {
			super.push(...tabs);
			if (this.curTab === null && this.tabs.length > 0) this.select(this.tabs[0]);
		}
		pop() {
			const tab = super.pop();
			if (this.curTab === tab && this.tabs.length > 0) this.select(this.tabs[0]);
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
	};
	var CheckboxOption = class {
		name;
		self;
		input;
		enables;
		saveIn;
		constructor(opt) {
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
			if (opt.description) textLabel.popover({
				content: opt.description,
				trigger: "hover",
				placement: "top"
			});
			this.self = $(`<div class='customCheckboxContainer'></div>`).attr("id", id).addClass(cls).addClass(opt.offset !== 0 ? `offset${opt.offset}` : "").append($(`<div class='customCheckbox'></div>`).append(this.input).append(checkLabel)).append(textLabel);
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
	};
	function toTitle(str) {
		let ret = str.replace(/[_].?/g, (letter) => letter.slice(1).toUpperCase());
		ret = ret.replace(/[A-Z]/g, (letter) => ` ${letter}`);
		ret = ret.charAt(0).toUpperCase() + ret.slice(1);
		return ret;
	}
	var SIZE_MAP = {
		"large": "btn-lg",
		"default": "",
		"normal": "btn",
		"small": "btn-sm",
		"extra-small": "btn-xs"
	};
	var STYLE_MAP = {
		"default": "btn-default",
		"primary": "btn-primary",
		"success": "btn-success",
		"info": "btn-info",
		"warning": "btn-warning",
		"danger": "btn-danger",
		"link": "btn-link"
	};
	var Button = class {
		self;
		name;
		_size;
		_style;
		constructor(opt) {
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
	};
	var Table = class {
		self;
		table;
		name;
		buttonBlock;
		saveIn;
		body;
		newRow;
		addOrDeletable;
		movable;
		savable;
		rows;
		constructor(opt) {
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
			if (opt.title) this.self.append($(`<h4 style="text-align: center;"><b>${opt.title}</b></h4>`));
			const header = $(`<thead></thead>`);
			const headerRow = $(`<tr></tr>`);
			for (let fieldName of Object.keys(this.newRow())) headerRow.append(`<th>${toTitle(fieldName)}</th>`);
			if (opt.addOrDeletable || opt.movable) headerRow.append(`<th></th>`);
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
				this.buttonBlock = new Buttons({ name: "tableButtons" });
				this.buttonBlock.push(...btns);
				this.self.append(this.buttonBlock.self);
			} else this.buttonBlock = null;
			if (opt.defaultValue !== void 0) this.setValue(opt.defaultValue);
			this.load();
		}
		createRow(data) {
			const newFields = this.newRow();
			const rowElem = $(`<tr></tr>`);
			for (let field of Object.keys(newFields)) {
				if (data) newFields[field].setValue(data[field]);
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
					if (idx !== -1) this.splice(idx, 1);
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
			for (let row of this.rows) row.elem.detach();
			let deleted;
			if (deleteCount === void 0) deleted = this.rows.splice(start);
			else deleted = this.rows.splice(start, deleteCount, ...rows);
			for (let row of this.rows) this.body.append(row.elem);
			return deleted;
		}
		getButton(name) {
			if (this.buttonBlock) return this.buttonBlock.find((btn) => btn.name === name);
			else return;
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
			for (let data of datas) this.splice(this.rows.length, 0, this.createRow(data));
		}
		save() {
			switch (this.saveIn) {
				case "Script":
					_GM_setValue(this.name, this.getValue());
					break;
				case "LocalStorage":
					saveToLocalStorage(this.name, this.getValue());
					break;
				case "Cookie": saveToCookie(this.name, this.getValue());
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
				case "Cookie": val = loadFromCookie(this.name);
			}
			if (val !== void 0) this.setValue(val);
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
	};
	var style_default = ".amqtbButtonContainer {\n    display: flex;\n    flex-flow: row wrap;\n    justify-content: space-around;\n    align-content: space-around;\n    margin: 5px 0;\n}\n.amqtbButtonContainer button {\n    margin: 5px 0;\n}\n.amqtbWindow {\n    overflow-y: hidden;\n    top: 0px;\n    left: 0px;\n    margin: 0px;\n    background-color: #424242;\n    border: 1px solid rgba(27, 27, 27, 0.2);\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n    user-select: text;\n    display: none;\n}\n\n.draggableWindow {\n    cursor: move;\n}\n\n.amqtbWindowBody {\n    width: 100%;\n    overflow-y: auto;\n}\n\n.amqtbWindowContent {\n    width: 100%;\n    position: absolute;\n    top: 0px;\n}\n\n.amqtbWindow .close {\n    font-size: 32px;\n}\n\n.windowResizers {\n    width: 100%;\n    height: 100%;\n}\n\n.windowResizer {\n    width: 10px;\n    height: 10px;\n    position: absolute;\n    z-index: 100;\n}\n\n.windowResizer.top-left {\n    top: 0px;\n    left: 0px;\n    cursor: nwse-resize;\n}\n\n.windowResizer.top-right {\n    top: 0px;\n    right: 0px;\n    cursor: nesw-resize;\n}\n\n.windowResizer.bottom-left {\n    bottom: 0px;\n    left: 0px;\n    cursor: nesw-resize;\n}\n\n.windowResizer.bottom-right {\n    bottom: 0px;\n    right: 0px;\n    cursor: nwse-resize;\n}\n\n.customCheckboxContainer {\n    display: flex;\n}\n.customCheckboxContainer>div {\n    display: inline-block;\n    margin: 5px 0px;\n}\n.customCheckboxContainer>.customCheckboxContainerLabel {\n    margin-left: 5px;\n    margin-top: 5px;\n    font-weight: normal;\n}\n.amqtbRadio {\n    text-align: center;\n}\n.offset1 {\n    margin-left: 20px;\n}\n.offset2 {\n    margin-left: 40px;\n}\n.amqtbMultiSelect a.selected {\n    background-color: #4497ea;\n    color: #fff;\n}\n.amqtbTable {\n    border-collapse: separate;\n    padding: 0 15px;\n}\n.amqtbTable th, .amqtbTable td {\n    text-align: center;\n    vertical-align: middle !important;\n}\n.amqtbTable thead {\n    background-color: #000;\n}\n.amqtbTable tbody tr {\n    background-color: #424242 !important;\n}\n#qpToolboxContainer {\n  /* box size */\n  max-width: 215px;\n  min-width: 208px;\n  width: calc(100% + 30px);\n  border-radius: 5px;\n  padding-top: 5px;\n  padding-bottom: 5px;\n  /* position */\n  margin-top: 10px;\n  position: absolute;\n  left: 0px;\n  right: 0px;\n}\n#gameChatPage.nexusView #qpToolboxContainer {\n  position: relative; /* overwrite */\n  float: right;\n  pointer-events: initial;\n  clear: both;\n}\n#qpToolboxContainer h5 {\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n#amqtbSettingButton {\n  width: 30px;\n  height: 100%;\n}\n#qpAvatarRow {\n  width: 80%;\n}\n#gameChatPage.nexusView #qpAvatarRow {\n  width: 70%;  /* overwrite */\n  margin-left: 25%;\n  margin-right: 5%;\n}\n.collapsible:hover {\n  background-color: #555;\n}\n.amqtbPluginManageTableEnabledCell {\n  position: relative;\n  top: -10px;\n  left: -25px;\n  display: inline-block;\n}";
	var View = class {
		self;
		constructor(opt) {
			this.self = $(`<div class="row"></div>`);
			const header = $(`<h5 class="collapsible"></h5>`).text(opt.title);
			header.on("click", function() {
				this.classList.toggle("active");
				const content = this.nextElementSibling;
				if (content.style.display === "") content.style.display = "none";
				else content.style.display = "";
			});
			this.self.append(header, opt.content);
		}
	};
	var ViewBlock = class extends Container {
		constructor(opt) {
			super(opt);
			this.self.attr("id", "qpToolboxContainer").addClass("container floatingContainer");
		}
	};
	var Text = class {
		self;
		constructor() {
			this.self = $(`<p></p>`);
		}
		setValue(val) {
			this.self.text(val);
		}
		getValue() {
			return this.self.text();
		}
	};
	var Switch = class {
		self;
		switch;
		switchOn;
		switchOff;
		constructor() {
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
	};
	var Toolbox = class {
		viewBlock;
		settingModal;
		optionTab;
		manageModal;
		pluginTable;
		prevPluginsInfo;
		plugins;
		constructor() {
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
				for (let plugin of this.plugins.values()) if (plugin.enabled() && plugin.options) plugin.options.refresh();
			});
			$("#gameContainer").append(this.settingModal.self);
			this.settingModal.push(this.optionTab);
			const settingBtn = { self: $(`<div></div>`).attr("id", "amqtbSettingButton").addClass("clickAble qpOption").append($(`<i></i>`).addClass("fa fa-wrench").addClass("qpMenuItem").attr("aria-hidden", "true")).on("click", () => {
				this.settingModal.self.modal("show");
			}).popover({
				placement: "bottom",
				content: "Toolbox Setting",
				trigger: "hover"
			}) };
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
			this.pluginTable.getButton("save").self.on("click", () => {
				console.log("[Toolbox] Reload plugins");
				this.reload();
				this.manageModal.hide();
			});
			this.prevPluginsInfo = this.pluginTable.getValue();
			this.pluginTable.splice(0);
			this.pluginTable.save();
			$("#optionsContainer > ul").prepend($(`<li class="clickAble" data-toggle="modal" data-target="#amqtbManageModal"></li>`).text("Plugins"));
			$("#optionsContainer > ul").prepend($(`<li class="clickAble" data-toggle="modal" data-target="#amqtbSettingModal"></li>`).text("Toolbox Setting"));
			_GM_addStyle(style_default);
			console.log("New AMQ Toolbox created");
		}
		addPlugin(plugin) {
			if (plugin.dependencies && !this.checkDependency(plugin.dependencies)) throw new Error("Dependencies has not loaded");
			this.plugins.set(plugin.name, plugin);
			const prevOrder = this.prevPluginsInfo.findIndex((info) => info.pluginName === plugin.name);
			if (prevOrder !== -1) {
				if (this.prevPluginsInfo[prevOrder].enabled) {
					if (!plugin.enabled()) plugin.enable();
				} else if (plugin.enabled()) plugin.disable();
			} else if (!plugin.enabled()) plugin.enable();
			const pluginInfos = this.pluginTable.getValue();
			const newRow = this.pluginTable.createRow({
				pluginName: plugin.name,
				enabled: plugin.enabled()
			});
			let insertIdx = pluginInfos.length;
			if (prevOrder !== -1) for (let [idx, pluginInfo] of pluginInfos.entries()) {
				const order = this.prevPluginsInfo.findIndex((info) => info.pluginName === pluginInfo.pluginName);
				if (order === -1 || prevOrder < order) {
					insertIdx = idx;
					break;
				}
			}
			if (insertIdx === pluginInfos.length) this.pluginTable.append(newRow);
			else this.pluginTable.splice(insertIdx, 0, newRow);
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
					if (!plugin.enabled()) plugin.enable();
					if (plugin.view) this.viewBlock.push(new View({
						title: plugin.name,
						content: plugin.view.self
					}));
					if (plugin.options) this.optionTab.push(plugin.options);
					if (plugin.settingTab) this.settingModal.push(plugin.settingTab);
				} else if (plugin.enabled()) plugin.disable();
			}
		}
		checkDependency(dps) {
			let pluginNames = [...this.plugins.keys()];
			dps.forEach((dp) => {
				if (!pluginNames.includes(dp)) return false;
			});
			return true;
		}
	};
	function onStartPageLoaded(callback) {
		if (document.getElementById("startPage")) return;
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
				if (_unsafeWindow.amqToolbox === void 0) _unsafeWindow.amqToolbox = new Toolbox();
				_unsafeWindow.amqToolbox.addPlugin(plugin);
			});
		} catch (err) {
			console.error(`[registerPlugin] Failed to register ${plugin.name}`, err);
		}
	}
	var regexName = /* @__PURE__ */ new RegExp("^[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
	function getAllMatches(string, regex) {
		const matches = [];
		let match = regex.exec(string);
		while (match) {
			const allmatches = [];
			allmatches.startIndex = regex.lastIndex - match[0].length;
			const len = match.length;
			for (let index = 0; index < len; index++) allmatches.push(match[index]);
			matches.push(allmatches);
			match = regex.exec(string);
		}
		return matches;
	}
	var isName = function(string) {
		const match = regexName.exec(string);
		return !(match === null || typeof match === "undefined");
	};
	function isExist(v) {
		return typeof v !== "undefined";
	}
	/**
	* Dangerous property names that could lead to prototype pollution or security issues
	*/
	var DANGEROUS_PROPERTY_NAMES = [
		"hasOwnProperty",
		"toString",
		"valueOf",
		"__defineGetter__",
		"__defineSetter__",
		"__lookupGetter__",
		"__lookupSetter__"
	];
	var criticalProperties = [
		"__proto__",
		"constructor",
		"prototype"
	];
	var defaultOptions$1 = {
		allowBooleanAttributes: false,
		unpairedTags: []
	};
	function validate(xmlData, options) {
		options = Object.assign({}, defaultOptions$1, options);
		const tags = [];
		let tagFound = false;
		let reachedRoot = false;
		if (xmlData[0] === "﻿") xmlData = xmlData.substr(1);
		for (let i = 0; i < xmlData.length; i++) if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
			i += 2;
			i = readPI(xmlData, i);
			if (i.err) return i;
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
				for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) tagName += xmlData[i];
				tagName = tagName.trim();
				if (tagName[tagName.length - 1] === "/") {
					tagName = tagName.substring(0, tagName.length - 1);
					i--;
				}
				if (!validateTagName(tagName)) {
					let msg;
					if (tagName.trim().length === 0) msg = "Invalid space after '<'.";
					else msg = "Tag '" + tagName + "' is an invalid name.";
					return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
				}
				const result = readAttributeStr(xmlData, i);
				if (result === false) return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
				let attrStr = result.value;
				i = result.index;
				if (attrStr[attrStr.length - 1] === "/") {
					const attrStrStart = i - attrStr.length;
					attrStr = attrStr.substring(0, attrStr.length - 1);
					const isValid = validateAttributeString(attrStr, options);
					if (isValid === true) tagFound = true;
					else return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
				} else if (closingTag) {
					if (!result.tagClosed) return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
					else if (attrStr.trim().length > 0) return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
					else if (tags.length === 0) return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
					else {
						const otg = tags.pop();
						if (tagName !== otg.tagName) {
							let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
							return getErrorObject("InvalidTag", "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.", getLineNumberForPosition(xmlData, tagStartPos));
						}
						if (tags.length == 0) reachedRoot = true;
					}
				} else {
					const isValid = validateAttributeString(attrStr, options);
					if (isValid !== true) return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
					if (reachedRoot === true) return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
					else if (options.unpairedTags.indexOf(tagName) !== -1) {} else tags.push({
						tagName,
						tagStartPos
					});
					tagFound = true;
				}
				for (i++; i < xmlData.length; i++) if (xmlData[i] === "<") {
					if (xmlData[i + 1] === "!") {
						i++;
						i = readCommentAndCDATA(xmlData, i);
						continue;
					} else if (xmlData[i + 1] === "?") {
						i = readPI(xmlData, ++i);
						if (i.err) return i;
					} else break;
				} else if (xmlData[i] === "&") {
					const afterAmp = validateAmpersand(xmlData, i);
					if (afterAmp == -1) return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
					i = afterAmp;
				} else if (reachedRoot === true && !isWhiteSpace(xmlData[i])) return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
				if (xmlData[i] === "<") i--;
			}
		} else {
			if (isWhiteSpace(xmlData[i])) continue;
			return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
		}
		if (!tagFound) return getErrorObject("InvalidXml", "Start tag expected.", 1);
		else if (tags.length == 1) return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
		else if (tags.length > 0) return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
			line: 1,
			col: 1
		});
		return true;
	}
	function isWhiteSpace(char) {
		return char === " " || char === "	" || char === "\n" || char === "\r";
	}
	/**
	* Read Processing insstructions and skip
	* @param {*} xmlData
	* @param {*} i
	*/
	function readPI(xmlData, i) {
		const start = i;
		for (; i < xmlData.length; i++) if (xmlData[i] == "?" || xmlData[i] == " ") {
			const tagname = xmlData.substr(start, i - start);
			if (i > 5 && tagname === "xml") return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
			else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
				i++;
				break;
			} else continue;
		}
		return i;
	}
	function readCommentAndCDATA(xmlData, i) {
		if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
			for (i += 3; i < xmlData.length; i++) if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
				i += 2;
				break;
			}
		} else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
			let angleBracketsCount = 1;
			for (i += 8; i < xmlData.length; i++) if (xmlData[i] === "<") angleBracketsCount++;
			else if (xmlData[i] === ">") {
				angleBracketsCount--;
				if (angleBracketsCount === 0) break;
			}
		} else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
			for (i += 8; i < xmlData.length; i++) if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
				i += 2;
				break;
			}
		}
		return i;
	}
	var doubleQuote = "\"";
	var singleQuote = "'";
	/**
	* Keep reading xmlData until '<' is found outside the attribute value.
	* @param {string} xmlData
	* @param {number} i
	*/
	function readAttributeStr(xmlData, i) {
		let attrStr = "";
		let startChar = "";
		let tagClosed = false;
		for (; i < xmlData.length; i++) {
			if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
				if (startChar === "") startChar = xmlData[i];
				else if (startChar !== xmlData[i]) {} else startChar = "";
			} else if (xmlData[i] === ">") {
				if (startChar === "") {
					tagClosed = true;
					break;
				}
			}
			attrStr += xmlData[i];
		}
		if (startChar !== "") return false;
		return {
			value: attrStr,
			index: i,
			tagClosed
		};
	}
	/**
	* Walk `attrStr` once, left to right, splitting it into attribute tokens.
	*
	* This replaces a regex that used to do the same job
	* (`(\s*)([^\s=]+)(\s*=)?(\s*(['"])(([\s\S])*?)\5)?`). That regex led with an
	* optional whitespace group followed by a required "non-whitespace" group.
	* On a long run of whitespace that never resolves into an attribute name
	* (e.g. a tag with thousands of trailing spaces before `>`), the engine
	* backtracks the whitespace group one character at a time before giving up
	* and moving to the next starting position — one full backtrack per
	* position, which is quadratic in the length of the run.
	*
	* The scan is forward-only: the cursor never moves backwards, so each
	* character is visited a constant number of times and the cost is linear
	* in the length of the string.
	*
	* Each returned token mirrors the shape the old regex match array had, so
	* the validation logic below (which reads token[1]..token[6]) didn't need
	* to change:
	*   token.startIndex - where this token begins in attrStr
	*   token[1]          - leading whitespace before the name
	*   token[2]          - the attribute name
	*   token[3]          - whitespace + '=' if present, else undefined
	*   token[4]          - marker (any defined value) if a quoted value was found
	*   token[5]          - the quote character used ('"' or "'")
	*   token[6]          - the value's text, without the surrounding quotes
	*
	* A malformed leading character (e.g. a stray '=' with no name before it)
	* is simply skipped over, one character at a time — the same outcome the
	* old regex produced by failing to match at that position and retrying at
	* the next one.
	*/
	function scanAttributeTokens(attrStr) {
		const tokens = [];
		const len = attrStr.length;
		let i = 0;
		while (i < len) {
			const tokenStart = i;
			while (i < len && isWhiteSpace(attrStr[i])) i++;
			if (i >= len) break;
			if (attrStr[i] === "=") {
				i++;
				continue;
			}
			const leadingWs = attrStr.slice(tokenStart, i);
			const nameStart = i;
			while (i < len && !isWhiteSpace(attrStr[i]) && attrStr[i] !== "=") i++;
			const name = attrStr.slice(nameStart, i);
			let equalsGroup;
			let j = i;
			while (j < len && isWhiteSpace(attrStr[j])) j++;
			if (j < len && attrStr[j] === "=") {
				equalsGroup = attrStr.slice(i, j + 1);
				i = j + 1;
			}
			let quoteChar;
			let value;
			let k = i;
			while (k < len && isWhiteSpace(attrStr[k])) k++;
			if (k < len && (attrStr[k] === "\"" || attrStr[k] === "'")) {
				const valueStart = k + 1;
				const closeIdx = attrStr.indexOf(attrStr[k], valueStart);
				if (closeIdx !== -1) {
					quoteChar = attrStr[k];
					value = attrStr.slice(valueStart, closeIdx);
					i = closeIdx + 1;
				}
			}
			const token = { startIndex: tokenStart };
			token[1] = leadingWs;
			token[2] = name;
			token[3] = equalsGroup;
			token[4] = quoteChar !== void 0 ? true : void 0;
			token[5] = quoteChar;
			token[6] = value;
			tokens.push(token);
		}
		return tokens;
	}
	function validateAttributeString(attrStr, options) {
		const matches = scanAttributeTokens(attrStr);
		const attrNames = {};
		for (let i = 0; i < matches.length; i++) {
			if (matches[i][1].length === 0) return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
			else if (matches[i][3] !== void 0 && matches[i][4] === void 0) return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
			else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
			const attrName = matches[i][2];
			if (!validateAttrName(attrName)) return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
			if (!Object.prototype.hasOwnProperty.call(attrNames, attrName)) attrNames[attrName] = 1;
			else return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
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
			if (xmlData[i] === ";") return i;
			if (!xmlData[i].match(re)) break;
		}
		return -1;
	}
	function validateAmpersand(xmlData, i) {
		i++;
		if (xmlData[i] === ";") return -1;
		if (xmlData[i] === "#") {
			i++;
			return validateNumberAmpersand(xmlData, i);
		}
		let count = 0;
		for (; i < xmlData.length; i++, count++) {
			if (xmlData[i].match(/\w/) && count < 20) continue;
			if (xmlData[i] === ";") break;
			return -1;
		}
		return i;
	}
	function getErrorObject(code, message, lineNumber) {
		return { err: {
			code,
			msg: message,
			line: lineNumber.line || lineNumber,
			col: lineNumber.col
		} };
	}
	function validateAttrName(attrName) {
		return isName(attrName);
	}
	function validateTagName(tagname) {
		return isName(tagname);
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
	/**
	* Currency Symbols
	* @type {Record<string, string>}
	*/
	var CURRENCY = {
		cent: "¢",
		pound: "£",
		curren: "¤",
		yen: "¥",
		euro: "€",
		dollar: "$",
		fnof: "ƒ",
		inr: "₹",
		af: "؋",
		birr: "ብር",
		peso: "₱",
		rub: "₽",
		won: "₩",
		yuan: "¥",
		cedil: "¸"
	};
	var XML = {
		amp: "&",
		apos: "'",
		gt: ">",
		lt: "<",
		quot: "\""
	};
	var COMMON_HTML = {
		nbsp: "\xA0",
		copy: "©",
		reg: "®",
		trade: "™",
		mdash: "—",
		ndash: "–",
		hellip: "…",
		laquo: "«",
		raquo: "»",
		lsquo: "‘",
		rsquo: "’",
		ldquo: "“",
		rdquo: "”",
		bull: "•",
		para: "¶",
		sect: "§",
		deg: "°",
		frac12: "½",
		frac14: "¼",
		frac34: "¾"
	};
	/**
	* Action constants for `onExternalEntity` and `onInputEntity` hooks.
	*
	* Use these instead of raw strings to avoid typos:
	*
	* @example
	* import EntityDecoder, { ENTITY_ACTION } from './EntityDecoder.js';
	* const dec = new EntityDecoder({
	*   onInputEntity: (name, value) => ENTITY_ACTION.BLOCK,
	* });
	*/
	var ENTITY_ACTION = Object.freeze({
		/** Resolve and expand the entity normally. */
		ALLOW: "allow",
		/** Silently skip this entity — it will not be registered. */
		BLOCK: "block",
		/** Throw an error, aborting entity registration entirely. */
		THROW: "throw"
	});
	var SPECIAL_CHARS = /* @__PURE__ */ new Set("!?\\\\/[]$%{}^&*()<>|+");
	/**
	* Validate that an entity name contains no dangerous characters.
	* @param {string} name
	* @returns {string} the name, unchanged
	* @throws {Error} on invalid characters
	*/
	function validateEntityName$1(name) {
		if (name[0] === "#") throw new Error(`[EntityReplacer] Invalid character '#' in entity name: "${name}"`);
		for (const ch of name) if (SPECIAL_CHARS.has(ch)) throw new Error(`[EntityReplacer] Invalid character '${ch}' in entity name: "${name}"`);
		return name;
	}
	/**
	* Merge one or more entity maps into a flat name→string map.
	* Accepts either:
	*   - plain string values:             { amp: '&' }
	*   - legacy {regex,val} / {regx,val}: { lt: { regex: /.../, val: '<' } }
	*
	* Values containing '&' are skipped (recursive expansion risk).
	*
	* @param {...object} maps
	* @returns {Record<string, string>}
	*/
	function mergeEntityMaps(...maps) {
		const out = Object.create(null);
		for (const map of maps) {
			if (!map) continue;
			for (const key of Object.keys(map)) {
				const raw = map[key];
				if (typeof raw === "string") out[key] = raw;
				else if (raw && typeof raw === "object" && raw.val !== void 0) {
					const val = raw.val;
					if (typeof val === "string") out[key] = val;
				}
			}
		}
		return out;
	}
	var LIMIT_TIER_EXTERNAL = "external";
	var LIMIT_TIER_BASE = "base";
	var LIMIT_TIER_ALL = "all";
	/**
	* Resolve `applyLimitsTo` option into a normalised Set of tier strings.
	* Accepted values: 'external' | 'base' | 'all' | string[]
	* Default: 'external' (only untrusted injected entities are counted).
	* @param {string|string[]|undefined} raw
	* @returns {Set<string>}
	*/
	function parseLimitTiers(raw) {
		if (!raw || raw === LIMIT_TIER_EXTERNAL) return /* @__PURE__ */ new Set([LIMIT_TIER_EXTERNAL]);
		if (raw === LIMIT_TIER_ALL) return /* @__PURE__ */ new Set([LIMIT_TIER_ALL]);
		if (raw === LIMIT_TIER_BASE) return /* @__PURE__ */ new Set([LIMIT_TIER_BASE]);
		if (Array.isArray(raw)) return new Set(raw);
		return /* @__PURE__ */ new Set([LIMIT_TIER_EXTERNAL]);
	}
	var NCR_LEVEL = Object.freeze({
		allow: 0,
		leave: 1,
		remove: 2,
		throw: 3
	});
	var XML10_ALLOWED_C0 = /* @__PURE__ */ new Set([
		9,
		10,
		13
	]);
	/**
	* Parse the `ncr` constructor option into flat, hot-path-friendly fields.
	* @param {object|undefined} ncr
	* @returns {{ xmlVersion: number, onLevel: number, nullLevel: number }}
	*/
	function parseNCRConfig(ncr) {
		if (!ncr) return {
			xmlVersion: 1,
			onLevel: NCR_LEVEL.allow,
			nullLevel: NCR_LEVEL.remove
		};
		const xmlVersion = ncr.xmlVersion === 1.1 ? 1.1 : 1;
		const onLevel = NCR_LEVEL[ncr.onNCR] ?? NCR_LEVEL.allow;
		const nullLevel = NCR_LEVEL[ncr.nullNCR] ?? NCR_LEVEL.remove;
		return {
			xmlVersion,
			onLevel,
			nullLevel: Math.max(nullLevel, NCR_LEVEL.remove)
		};
	}
	/**
	* Single-pass, zero-regex entity replacer for XML/HTML content.
	*
	* Algorithm: scan the string once for '&', read to ';', resolve via map
	* or direct codepoint conversion, build output chunks, join once at the end.
	*
	* Entity lookup priority (highest → lowest):
	*   1. input / runtime  (DOCTYPE entities for current document)
	*   2. persistent external (survive across documents)
	*   3. base named map   (DEFAULT_XML_ENTITIES + user-supplied namedEntities)
	*
	* Both input and external resolve as the 'external' tier for limit purposes.
	* Base map entities resolve as the 'base' tier.
	*
	* Numeric / hex references (&#NNN; / &#xHH;) are resolved directly via
	* String.fromCodePoint() — no map needed. They count as 'base' tier.
	*
	* @example
	* const replacer = new EntityReplacer({ namedEntities: COMMON_HTML });
	* replacer.setExternalEntities({ brand: 'Acme' });
	*
	* const instance = replacer.reset();
	* instance.addInputEntities({ version: '1.0' });
	* instance.encode('&brand; v&version; &lt;'); // 'Acme v1.0 <'
	*/
	var EntityDecoder = class {
		/**
		* @param {object} [options]
		* @param {object|null}  [options.namedEntities]        — extra named entities merged into base map
		* @param {object}  [options.limit]                 — security limits
		* @param {number}       [options.limit.maxTotalExpansions=0]  — 0 = unlimited
		* @param {number}       [options.limit.maxExpandedLength=0]   — 0 = unlimited
		* @param {'external'|'base'|'all'|string[]} [options.limit.applyLimitsTo='external']
		*   Which entity tiers count against the security limits:
		*   - 'external' (default) — only input/runtime + persistent external entities
		*   - 'base'               — only DEFAULT_XML_ENTITIES + namedEntities
		*   - 'all'                — every entity regardless of tier
		*   - string[]             — explicit combination, e.g. ['external', 'base']
		* @param {((resolved: string, original: string) => string)|null} [options.postCheck=null]
		* @param {string[]} [options.remove=[]] — entity names (e.g. ['nbsp', '#13']) to delete (replace with empty string)
		* @param {string[]} [options.leave=[]]  — entity names to keep as literal (unchanged in output)
		* @param {object}   [options.ncr]       — Numeric Character Reference controls
		* @param {1.0|1.1}  [options.ncr.xmlVersion=1.0]
		*   XML version governing which codepoint ranges are restricted:
		*   - 1.0 — C0 controls U+0001–U+001F (except U+0009/000A/000D) are prohibited
		*   - 1.1 — C0 controls are allowed when written as NCRs; C1 (U+007F–U+009F) decoded as-is
		* @param {'allow'|'leave'|'remove'|'throw'} [options.ncr.onNCR='allow']
		*   Base action for numeric references. Severity order: allow < leave < remove < throw.
		*   For codepoint ranges that carry a minimum level (surrogates → remove, XML 1.0 C0 → remove),
		*   the effective action is max(onNCR, rangeMinimum).
		* @param {'remove'|'throw'} [options.ncr.nullNCR='remove']
		*   Action for U+0000 (null). 'allow' and 'leave' are clamped to 'remove' since null is never safe.
		* @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} [options.onExternalEntity=null]
		*   Hook called when an external entity is registered via `setExternalEntities()` or
		*   `addExternalEntity()`. Return `ENTITY_ACTION.ALLOW` to accept the entity,
		*   `ENTITY_ACTION.BLOCK` to silently skip it, or `ENTITY_ACTION.THROW` to abort with an error.
		* @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} [options.onInputEntity=null]
		*   Hook called when an input entity is registered via `addInputEntities()`. Return
		*   `ENTITY_ACTION.ALLOW` to accept, `ENTITY_ACTION.BLOCK` to silently skip, or
		*   `ENTITY_ACTION.THROW` to abort with an error.
		*/
		constructor(options = {}) {
			this._limit = options.limit || {};
			this._maxTotalExpansions = this._limit.maxTotalExpansions || 0;
			this._maxExpandedLength = this._limit.maxExpandedLength || 0;
			this._postCheck = typeof options.postCheck === "function" ? options.postCheck : (r) => r;
			this._limitTiers = parseLimitTiers(this._limit.applyLimitsTo ?? LIMIT_TIER_EXTERNAL);
			this._numericAllowed = options.numericAllowed ?? true;
			this._baseMap = mergeEntityMaps(XML, options.namedEntities || null);
			/** @type {Record<string, string>} */
			this._externalMap = Object.create(null);
			/** @type {Record<string, string>} */
			this._inputMap = Object.create(null);
			this._totalExpansions = 0;
			this._expandedLength = 0;
			/** @type {Set<string>} */
			this._removeSet = new Set(options.remove && Array.isArray(options.remove) ? options.remove : []);
			/** @type {Set<string>} */
			this._leaveSet = new Set(options.leave && Array.isArray(options.leave) ? options.leave : []);
			const ncrCfg = parseNCRConfig(options.ncr);
			this._ncrXmlVersion = ncrCfg.xmlVersion;
			this._ncrOnLevel = ncrCfg.onLevel;
			this._ncrNullLevel = ncrCfg.nullLevel;
			/** @type {((name: string, value: string) => 'allow'|'block'|'throw')|null} */
			this._onExternalEntity = typeof options.onExternalEntity === "function" ? options.onExternalEntity : null;
			/** @type {((name: string, value: string) => 'allow'|'block'|'throw')|null} */
			this._onInputEntity = typeof options.onInputEntity === "function" ? options.onInputEntity : null;
		}
		/**
		* Invoke a registration hook for a single entity name/value pair.
		* Returns true when the entity should be accepted, false when it should be
		* silently skipped (BLOCK), and throws when the hook returns THROW.
		*
		* @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} hook
		* @param {string} name
		* @param {string} value
		* @param {string} context  — used in error messages ('external' | 'input')
		* @returns {boolean}  true = accept, false = skip
		*/
		_applyRegistrationHook(hook, name, value, context) {
			if (!hook) return true;
			const action = hook(name, value);
			if (action === ENTITY_ACTION.BLOCK) return false;
			if (action === ENTITY_ACTION.THROW) throw new Error(`[EntityDecoder] Registration of ${context} entity "&${name};" was rejected by hook`);
			return true;
		}
		/**
		* Replace the full set of persistent external entities.
		* All keys are validated — throws on invalid characters.
		* If `onExternalEntity` is set, it is called once per entry; entries that
		* return `ENTITY_ACTION.BLOCK` are silently omitted, `ENTITY_ACTION.THROW`
		* aborts the whole call.
		* @param {Record<string, string | { regex?: RegExp, val: string }>} map
		*/
		setExternalEntities(map) {
			if (map) for (const key of Object.keys(map)) validateEntityName$1(key);
			if (!this._onExternalEntity) {
				this._externalMap = mergeEntityMaps(map);
				return;
			}
			const flat = mergeEntityMaps(map);
			const filtered = Object.create(null);
			for (const [name, value] of Object.entries(flat)) if (this._applyRegistrationHook(this._onExternalEntity, name, value, "external")) filtered[name] = value;
			this._externalMap = filtered;
		}
		/**
		* Add a single persistent external entity.
		* If `onExternalEntity` is set it is called before the entity is stored;
		* `ENTITY_ACTION.BLOCK` silently skips storage, `ENTITY_ACTION.THROW` raises.
		* @param {string} key
		* @param {string} value
		*/
		addExternalEntity(key, value) {
			validateEntityName$1(key);
			if (typeof value === "string" && value.indexOf("&") === -1) {
				if (this._applyRegistrationHook(this._onExternalEntity, key, value, "external")) this._externalMap[key] = value;
			}
		}
		/**
		* Inject DOCTYPE entities for the current document.
		* Also resets per-document expansion counters.
		* If `onInputEntity` is set it is called once per entry; entries returning
		* `ENTITY_ACTION.BLOCK` are silently omitted, `ENTITY_ACTION.THROW` aborts.
		* @param {Record<string, string | { regx?: RegExp, regex?: RegExp, val: string }>} map
		*/
		addInputEntities(map) {
			this._totalExpansions = 0;
			this._expandedLength = 0;
			if (!this._onInputEntity) {
				this._inputMap = mergeEntityMaps(map);
				return;
			}
			const flat = mergeEntityMaps(map);
			const filtered = Object.create(null);
			for (const [name, value] of Object.entries(flat)) if (this._applyRegistrationHook(this._onInputEntity, name, value, "input")) filtered[name] = value;
			this._inputMap = filtered;
		}
		/**
		* Wipe input/runtime entities and reset counters.
		* Call this before processing each new document.
		* @returns {this}
		*/
		reset() {
			this._inputMap = Object.create(null);
			this._totalExpansions = 0;
			this._expandedLength = 0;
			return this;
		}
		/**
		* Update the XML version used for NCR classification.
		* Call this as soon as the document's `<?xml version="...">` declaration is parsed.
		* @param {1.0|1.1|number} version
		*/
		setXmlVersion(version) {
			this._ncrXmlVersion = version === 1.1 ? 1.1 : 1;
		}
		/**
		* Replace all entity references in `str` in a single pass.
		*
		* @param {string} str
		* @returns {string}
		*/
		decode(str) {
			if (typeof str !== "string" || str.length === 0) return str;
			if (str.indexOf("&") === -1) return str;
			const original = str;
			const chunks = [];
			const len = str.length;
			let last = 0;
			let i = 0;
			const limitExpansions = this._maxTotalExpansions > 0;
			const limitLength = this._maxExpandedLength > 0;
			const checkLimits = limitExpansions || limitLength;
			while (i < len) {
				if (str.charCodeAt(i) !== 38) {
					i++;
					continue;
				}
				let j = i + 1;
				while (j < len && str.charCodeAt(j) !== 59 && j - i <= 32) j++;
				if (j >= len || str.charCodeAt(j) !== 59) {
					i++;
					continue;
				}
				const token = str.slice(i + 1, j);
				if (token.length === 0) {
					i++;
					continue;
				}
				let replacement;
				let tier;
				if (this._removeSet.has(token)) {
					replacement = "";
					if (tier === void 0) tier = LIMIT_TIER_EXTERNAL;
				} else if (this._leaveSet.has(token)) {
					i++;
					continue;
				} else if (token.charCodeAt(0) === 35) {
					const ncrResult = this._resolveNCR(token);
					if (ncrResult === void 0) {
						i++;
						continue;
					}
					replacement = ncrResult;
					tier = LIMIT_TIER_BASE;
				} else {
					const resolved = this._resolveName(token);
					replacement = resolved?.value;
					tier = resolved?.tier;
				}
				if (replacement === void 0) {
					i++;
					continue;
				}
				if (i > last) chunks.push(str.slice(last, i));
				chunks.push(replacement);
				last = j + 1;
				i = last;
				if (checkLimits && this._tierCounts(tier)) {
					if (limitExpansions) {
						this._totalExpansions++;
						if (this._totalExpansions > this._maxTotalExpansions) throw new Error(`[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`);
					}
					if (limitLength) {
						const delta = replacement.length - (token.length + 2);
						if (delta > 0) {
							this._expandedLength += delta;
							if (this._expandedLength > this._maxExpandedLength) throw new Error(`[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`);
						}
					}
				}
			}
			if (last < len) chunks.push(str.slice(last));
			const result = chunks.length === 0 ? str : chunks.join("");
			return this._postCheck(result, original);
		}
		/**
		* Returns true if a resolved entity of the given tier should count
		* against the expansion/length limits.
		* @param {string} tier  — LIMIT_TIER_EXTERNAL | LIMIT_TIER_BASE
		* @returns {boolean}
		*/
		_tierCounts(tier) {
			if (this._limitTiers.has(LIMIT_TIER_ALL)) return true;
			return this._limitTiers.has(tier);
		}
		/**
		* Resolve a named entity token (without & and ;).
		* Priority: inputMap > externalMap > baseMap
		* Returns the resolved value tagged with its limit tier.
		*
		* @param {string} name
		* @returns {{ value: string, tier: string }|undefined}
		*/
		_resolveName(name) {
			if (name in this._inputMap) return {
				value: this._inputMap[name],
				tier: LIMIT_TIER_EXTERNAL
			};
			if (name in this._externalMap) return {
				value: this._externalMap[name],
				tier: LIMIT_TIER_EXTERNAL
			};
			if (name in this._baseMap) return {
				value: this._baseMap[name],
				tier: LIMIT_TIER_BASE
			};
		}
		/**
		* Classify a codepoint and return the minimum action level that must be applied.
		* Returns -1 when no minimum is imposed (normal allow path).
		*
		* Ranges checked (in priority order):
		*   1. U+0000            — null, governed by nullNCR (always ≥ remove)
		*   2. U+D800–U+DFFF     — surrogates, always prohibited (min: remove)
		*   3. U+0001–U+001F \ {0x09,0x0A,0x0D}  — XML 1.0 restricted C0 (min: remove)
		*      (skipped in XML 1.1 — C0 controls are allowed when written as NCRs)
		*
		* @param {number} cp  — codepoint
		* @returns {number}   — minimum NCR_LEVEL value, or -1 for no restriction
		*/
		_classifyNCR(cp) {
			if (cp === 0) return this._ncrNullLevel;
			if (cp >= 55296 && cp <= 57343) return NCR_LEVEL.remove;
			if (this._ncrXmlVersion === 1) {
				if (cp >= 1 && cp <= 31 && !XML10_ALLOWED_C0.has(cp)) return NCR_LEVEL.remove;
			}
			return -1;
		}
		/**
		* Execute a resolved NCR action.
		*
		* @param {number} action   — NCR_LEVEL value
		* @param {string} token    — raw token (e.g. '#38') for error messages
		* @param {number} cp       — codepoint, used only for error messages
		* @returns {string|undefined}
		*   - decoded character string  → 'allow'
		*   - ''                        → 'remove'
		*   - undefined                 → 'leave' (caller must skip past '&' only)
		*   - throws Error              → 'throw'
		*/
		_applyNCRAction(action, token, cp) {
			switch (action) {
				case NCR_LEVEL.allow: return String.fromCodePoint(cp);
				case NCR_LEVEL.remove: return "";
				case NCR_LEVEL.leave: return;
				case NCR_LEVEL.throw: throw new Error(`[EntityDecoder] Prohibited numeric character reference &${token}; (U+${cp.toString(16).toUpperCase().padStart(4, "0")})`);
				default: return String.fromCodePoint(cp);
			}
		}
		/**
		* Full NCR resolution pipeline for a numeric token.
		*
		* Steps:
		*   1. Parse the codepoint (decimal or hex).
		*   2. Validate the raw codepoint range (NaN, <0, >0x10FFFF).
		*   3. If numericAllowed is false and no minimum restriction applies → leave as-is.
		*   4. Classify the codepoint to find the minimum required action level.
		*   5. Resolve effective action = max(onNCR, minimum).
		*   6. Apply and return.
		*
		* @param {string} token  — e.g. '#38', '#x26', '#X26'
		* @returns {string|undefined}
		*   - string (incl. '')  — replacement ('' = remove)
		*   - undefined          — leave original &token; as-is
		*/
		_resolveNCR(token) {
			const second = token.charCodeAt(1);
			let cp;
			if (second === 120 || second === 88) cp = parseInt(token.slice(2), 16);
			else cp = parseInt(token.slice(1), 10);
			if (Number.isNaN(cp) || cp < 0 || cp > 1114111) return void 0;
			const minimum = this._classifyNCR(cp);
			if (!this._numericAllowed && minimum < NCR_LEVEL.remove) return void 0;
			const effective = minimum === -1 ? this._ncrOnLevel : Math.max(this._ncrOnLevel, minimum);
			return this._applyNCRAction(effective, token, cp);
		}
	};
	var defaultOnDangerousProperty = (name) => {
		if (DANGEROUS_PROPERTY_NAMES.includes(name)) return "__" + name;
		return name;
	};
	var defaultOptions = {
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
			leadingZeros: true,
			eNotation: true,
			unicode: false
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
		entityDecoder: null,
		ignoreDeclaration: false,
		ignorePiTags: false,
		transformTagName: false,
		transformAttributeName: false,
		updateTag: function(tagName, jPath, attrs) {
			return tagName;
		},
		captureMetaData: false,
		maxNestedTags: 100,
		strictReservedNames: true,
		jPath: true,
		onDangerousProperty: defaultOnDangerousProperty
	};
	/**
	* Validates that a property name is safe to use
	* @param {string} propertyName - The property name to validate
	* @param {string} optionName - The option field name (for error message)
	* @throws {Error} If property name is dangerous
	*/
	function validatePropertyName(propertyName, optionName) {
		if (typeof propertyName !== "string") return;
		const normalized = propertyName.toLowerCase();
		if (DANGEROUS_PROPERTY_NAMES.some((dangerous) => normalized === dangerous.toLowerCase())) throw new Error(`[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`);
		if (criticalProperties.some((dangerous) => normalized === dangerous.toLowerCase())) throw new Error(`[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`);
	}
	/**
	* Normalizes processEntities option for backward compatibility
	* @param {boolean|object} value 
	* @returns {object} Always returns normalized object
	*/
	function normalizeProcessEntities(value, htmlEntities) {
		if (typeof value === "boolean") return {
			enabled: value,
			maxEntitySize: 1e4,
			maxExpansionDepth: 1e4,
			maxTotalExpansions: 1e400,
			maxExpandedLength: 1e5,
			maxEntityCount: 1e3,
			allowedTags: null,
			tagFilter: null,
			appliesTo: "all"
		};
		if (typeof value === "object" && value !== null) return {
			enabled: value.enabled !== false,
			maxEntitySize: Math.max(1, value.maxEntitySize ?? 1e4),
			maxExpansionDepth: Math.max(1, value.maxExpansionDepth ?? 1e4),
			maxTotalExpansions: Math.max(1, value.maxTotalExpansions ?? 1e400),
			maxExpandedLength: Math.max(1, value.maxExpandedLength ?? 1e5),
			maxEntityCount: Math.max(1, value.maxEntityCount ?? 1e3),
			allowedTags: value.allowedTags ?? null,
			tagFilter: value.tagFilter ?? null,
			appliesTo: value.appliesTo ?? "all"
		};
		return normalizeProcessEntities(true);
	}
	var buildOptions = function(options) {
		const built = Object.assign({}, defaultOptions, options);
		const propertyNameOptions = [
			{
				value: built.attributeNamePrefix,
				name: "attributeNamePrefix"
			},
			{
				value: built.attributesGroupName,
				name: "attributesGroupName"
			},
			{
				value: built.textNodeName,
				name: "textNodeName"
			},
			{
				value: built.cdataPropName,
				name: "cdataPropName"
			},
			{
				value: built.commentPropName,
				name: "commentPropName"
			}
		];
		for (const { value, name } of propertyNameOptions) if (value) validatePropertyName(value, name);
		if (built.onDangerousProperty === null) built.onDangerousProperty = defaultOnDangerousProperty;
		built.processEntities = normalizeProcessEntities(built.processEntities, built.htmlEntities);
		built.unpairedTagsSet = new Set(built.unpairedTags);
		if (built.stopNodes && Array.isArray(built.stopNodes)) built.stopNodes = built.stopNodes.map((node) => {
			if (typeof node === "string" && node.startsWith("*.")) return ".." + node.substring(2);
			return node;
		});
		return built;
	};
	var METADATA_SYMBOL$1;
	if (typeof Symbol !== "function") METADATA_SYMBOL$1 = "@@xmlMetadata";
	else METADATA_SYMBOL$1 = Symbol("XML Node Metadata");
	var XmlNode = class {
		constructor(tagname) {
			this.tagname = tagname;
			this.child = [];
			this[":@"] = Object.create(null);
		}
		add(key, val) {
			if (key === "__proto__") key = "#__proto__";
			this.child.push({ [key]: val });
		}
		addChild(node, startIndex) {
			if (node.tagname === "__proto__") node.tagname = "#__proto__";
			if (node[":@"] && Object.keys(node[":@"]).length > 0) this.child.push({
				[node.tagname]: node.child,
				[":@"]: node[":@"]
			});
			else this.child.push({ [node.tagname]: node.child });
			this.addStartIndex(startIndex);
		}
		addStartIndex(startIndex) {
			if (startIndex !== void 0) this.child[this.child.length - 1][METADATA_SYMBOL$1] = { startIndex };
		}
		addEndIndex(endIndex) {
			const lastChild = this.child[this.child.length - 1];
			if (lastChild !== void 0 && lastChild[METADATA_SYMBOL$1] !== void 0 && lastChild[METADATA_SYMBOL$1].endIndex === void 0) lastChild[METADATA_SYMBOL$1].endIndex = endIndex;
		}
		/** symbol used for metadata */
		static getMetaDataSymbol() {
			return METADATA_SYMBOL$1;
		}
	};
	/**
	* xml-naming
	* Validates XML Name productions as defined in the XML 1.0 and 1.1 specifications.
	* Covers: Name, NCName, QName, NMToken, NMTokens
	*
	* XML 1.0 spec: https://www.w3.org/TR/xml/#NT-Name
	* XML 1.1 spec: https://www.w3.org/TR/xml11/#NT-NameStartChar
	* XML NS spec:  https://www.w3.org/TR/xml-names/#NT-NCName
	*/
	var nameStartChar10 = ":A-Za-z_À-ÖØ-öø-˿Ͱ-ͽͿ-҆҈-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�";
	var nameChar10 = nameStartChar10 + "\\-\\.\\d·̀-ͯ‿-⁀";
	var nameStartChar11 = ":A-Za-z_À-˿Ͱ-ͽͿ-҆҈-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�𐀀-󯿿";
	var nameChar11 = nameStartChar11 + "\\-\\.\\d·̀-ͯ҇‿-⁀";
	var buildRegexes = (startChar, char, flags = "") => {
		const ncNamePat = `[${startChar.replace(":", "")}][${char.replace(":", "")}]*`;
		return {
			name: new RegExp(`^[${startChar}][${char}]*$`, flags),
			ncName: new RegExp(`^${ncNamePat}$`, flags),
			qName: new RegExp(`^${ncNamePat}(?::${ncNamePat})?$`, flags),
			nmToken: new RegExp(`^[${char}]+$`, flags),
			nmTokens: new RegExp(`^[${char}]+(?:\\s+[${char}]+)*$`, flags)
		};
	};
	var regexes10 = buildRegexes(nameStartChar10, nameChar10);
	var regexes11 = buildRegexes(nameStartChar11, nameChar11, "u");
	var regexesAscii = buildRegexes(":A-Za-z_", ":A-Za-z_\\-\\.\\d");
	var getRegexes = (xmlVersion = "1.0", asciiOnly = false) => {
		if (asciiOnly) return regexesAscii;
		return xmlVersion === "1.1" ? regexes11 : regexes10;
	};
	/**
	* Returns true if the string is a valid QName (Qualified Name).
	* Allows exactly one colon as a prefix separator: prefix:localName.
	* Used for: element and attribute names in namespace-aware XML/SVG.
	*
	* @param {{ xmlVersion?: '1.0'|'1.1', asciiOnly?: boolean }} [opts]
	*   asciiOnly: skip unicode-aware matching, ASCII names only (default false).
	*/
	var qName = (str, { xmlVersion = "1.0", asciiOnly = false } = {}) => getRegexes(xmlVersion, asciiOnly).qName.test(str);
	var DocTypeReader = class {
		constructor(options, xmlVersion) {
			this.suppressValidationErr = !options;
			this.options = options;
			this.xmlVersion = xmlVersion || 1;
		}
		setXmlVersion(xmlVersion = 1) {
			this.xmlVersion = xmlVersion;
		}
		readDocType(xmlData, i) {
			const entities = Object.create(null);
			let entityCount = 0;
			if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
				i = i + 9;
				let angleBracketsCount = 1;
				let hasBody = false, comment = false;
				let quoteChar = null;
				let exp = "";
				for (; i < xmlData.length; i++) {
					if (quoteChar !== null) {
						if (xmlData[i] === quoteChar) quoteChar = null;
						exp += xmlData[i];
						continue;
					}
					if (!hasBody && !comment && (xmlData[i] === "\"" || xmlData[i] === "'")) {
						quoteChar = xmlData[i];
						exp += xmlData[i];
						continue;
					}
					if (xmlData[i] === "<" && !comment) {
						if (hasBody && hasSeq(xmlData, "!ENTITY", i)) {
							i += 7;
							let entityName, val;
							[entityName, val, i] = this.readEntityExp(xmlData, i + 1, this.suppressValidationErr);
							if (val.indexOf("&") === -1) {
								if (this.options.enabled !== false && this.options.maxEntityCount != null && entityCount >= this.options.maxEntityCount) throw new Error(`Entity count (${entityCount + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`);
								entities[entityName] = val;
								entityCount++;
							}
						} else if (hasBody && hasSeq(xmlData, "!ELEMENT", i)) {
							i += 8;
							const { index } = this.readElementExp(xmlData, i + 1);
							i = index;
						} else if (hasBody && hasSeq(xmlData, "!ATTLIST", i)) i += 8;
						else if (hasBody && hasSeq(xmlData, "!NOTATION", i)) {
							i += 9;
							const { index } = this.readNotationExp(xmlData, i + 1, this.suppressValidationErr);
							i = index;
						} else if (hasSeq(xmlData, "!--", i)) comment = true;
						else throw new Error(`Invalid DOCTYPE`);
						angleBracketsCount++;
						exp = "";
					} else if (xmlData[i] === ">") {
						if (comment) {
							if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
								comment = false;
								angleBracketsCount--;
							}
						} else angleBracketsCount--;
						if (angleBracketsCount === 0) break;
					} else if (xmlData[i] === "[") hasBody = true;
					else exp += xmlData[i];
				}
				if (quoteChar !== null || angleBracketsCount !== 0) throw new Error(`Unclosed DOCTYPE`);
			} else throw new Error(`Invalid Tag instead of DOCTYPE`);
			return {
				entities,
				i
			};
		}
		readEntityExp(xmlData, i) {
			i = skipWhitespace(xmlData, i);
			const startIndex = i;
			while (i < xmlData.length && !/\s/.test(xmlData[i]) && xmlData[i] !== "\"" && xmlData[i] !== "'") i++;
			let entityName = xmlData.substring(startIndex, i);
			validateEntityName(entityName, { xmlVersion: this.xmlVersion });
			i = skipWhitespace(xmlData, i);
			if (!this.suppressValidationErr) {
				if (xmlData.substring(i, i + 6).toUpperCase() === "SYSTEM") throw new Error("External entities are not supported");
				else if (xmlData[i] === "%") throw new Error("Parameter entities are not supported");
			}
			let entityValue = "";
			[i, entityValue] = this.readIdentifierVal(xmlData, i, "entity");
			if (this.options.enabled !== false && this.options.maxEntitySize != null && entityValue.length > this.options.maxEntitySize) throw new Error(`Entity "${entityName}" size (${entityValue.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);
			i--;
			return [
				entityName,
				entityValue,
				i
			];
		}
		readNotationExp(xmlData, i) {
			i = skipWhitespace(xmlData, i);
			const startIndex = i;
			while (i < xmlData.length && !/\s/.test(xmlData[i])) i++;
			let notationName = xmlData.substring(startIndex, i);
			!this.suppressValidationErr && validateEntityName(notationName, { xmlVersion: this.xmlVersion });
			i = skipWhitespace(xmlData, i);
			const identifierType = xmlData.substring(i, i + 6).toUpperCase();
			if (!this.suppressValidationErr && identifierType !== "SYSTEM" && identifierType !== "PUBLIC") throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
			i += identifierType.length;
			i = skipWhitespace(xmlData, i);
			let publicIdentifier = null;
			let systemIdentifier = null;
			if (identifierType === "PUBLIC") {
				[i, publicIdentifier] = this.readIdentifierVal(xmlData, i, "publicIdentifier");
				i = skipWhitespace(xmlData, i);
				if (xmlData[i] === "\"" || xmlData[i] === "'") [i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
			} else if (identifierType === "SYSTEM") {
				[i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
				if (!this.suppressValidationErr && !systemIdentifier) throw new Error("Missing mandatory system identifier for SYSTEM notation");
			}
			return {
				notationName,
				publicIdentifier,
				systemIdentifier,
				index: --i
			};
		}
		readIdentifierVal(xmlData, i, type) {
			let identifierVal = "";
			const startChar = xmlData[i];
			if (startChar !== "\"" && startChar !== "'") throw new Error(`Expected quoted string, found "${startChar}"`);
			i++;
			const startIndex = i;
			while (i < xmlData.length && xmlData[i] !== startChar) i++;
			identifierVal = xmlData.substring(startIndex, i);
			if (xmlData[i] !== startChar) throw new Error(`Unterminated ${type} value`);
			i++;
			return [i, identifierVal];
		}
		readElementExp(xmlData, i) {
			i = skipWhitespace(xmlData, i);
			const startIndex = i;
			while (i < xmlData.length && !/\s/.test(xmlData[i])) i++;
			let elementName = xmlData.substring(startIndex, i);
			if (!this.suppressValidationErr && !qName(elementName, { xmlVersion: this.xmlVersion })) throw new Error(`Invalid element name: "${elementName}"`);
			i = skipWhitespace(xmlData, i);
			let contentModel = "";
			if (xmlData[i] === "E" && hasSeq(xmlData, "MPTY", i)) i += 4;
			else if (xmlData[i] === "A" && hasSeq(xmlData, "NY", i)) i += 2;
			else if (xmlData[i] === "(") {
				i++;
				const startIndex = i;
				while (i < xmlData.length && xmlData[i] !== ")") i++;
				contentModel = xmlData.substring(startIndex, i);
				if (xmlData[i] !== ")") throw new Error("Unterminated content model");
			} else if (!this.suppressValidationErr) throw new Error(`Invalid Element Expression, found "${xmlData[i]}"`);
			return {
				elementName,
				contentModel: contentModel.trim(),
				index: i
			};
		}
		readAttlistExp(xmlData, i) {
			i = skipWhitespace(xmlData, i);
			let startIndex = i;
			while (i < xmlData.length && !/\s/.test(xmlData[i])) i++;
			let elementName = xmlData.substring(startIndex, i);
			validateEntityName(elementName, { xmlVersion: this.xmlVersion });
			i = skipWhitespace(xmlData, i);
			startIndex = i;
			while (i < xmlData.length && !/\s/.test(xmlData[i])) i++;
			let attributeName = xmlData.substring(startIndex, i);
			if (!validateEntityName(attributeName, { xmlVersion: this.xmlVersion })) throw new Error(`Invalid attribute name: "${attributeName}"`);
			i = skipWhitespace(xmlData, i);
			let attributeType = "";
			if (xmlData.substring(i, i + 8).toUpperCase() === "NOTATION") {
				attributeType = "NOTATION";
				i += 8;
				i = skipWhitespace(xmlData, i);
				if (xmlData[i] !== "(") throw new Error(`Expected '(', found "${xmlData[i]}"`);
				i++;
				let allowedNotations = [];
				while (i < xmlData.length && xmlData[i] !== ")") {
					const startIndex = i;
					while (i < xmlData.length && xmlData[i] !== "|" && xmlData[i] !== ")") i++;
					let notation = xmlData.substring(startIndex, i);
					notation = notation.trim();
					if (!validateEntityName(notation, { xmlVersion: this.xmlVersion })) throw new Error(`Invalid notation name: "${notation}"`);
					allowedNotations.push(notation);
					if (xmlData[i] === "|") {
						i++;
						i = skipWhitespace(xmlData, i);
					}
				}
				if (xmlData[i] !== ")") throw new Error("Unterminated list of notations");
				i++;
				attributeType += " (" + allowedNotations.join("|") + ")";
			} else {
				const startIndex = i;
				while (i < xmlData.length && !/\s/.test(xmlData[i])) i++;
				attributeType += xmlData.substring(startIndex, i);
				if (!this.suppressValidationErr && ![
					"CDATA",
					"ID",
					"IDREF",
					"IDREFS",
					"ENTITY",
					"ENTITIES",
					"NMTOKEN",
					"NMTOKENS"
				].includes(attributeType.toUpperCase())) throw new Error(`Invalid attribute type: "${attributeType}"`);
			}
			i = skipWhitespace(xmlData, i);
			let defaultValue = "";
			if (xmlData.substring(i, i + 8).toUpperCase() === "#REQUIRED") {
				defaultValue = "#REQUIRED";
				i += 8;
			} else if (xmlData.substring(i, i + 7).toUpperCase() === "#IMPLIED") {
				defaultValue = "#IMPLIED";
				i += 7;
			} else [i, defaultValue] = this.readIdentifierVal(xmlData, i, "ATTLIST");
			return {
				elementName,
				attributeName,
				attributeType,
				defaultValue,
				index: i
			};
		}
	};
	var skipWhitespace = (data, index) => {
		while (index < data.length && /\s/.test(data[index])) index++;
		return index;
	};
	function hasSeq(data, seq, i) {
		for (let j = 0; j < seq.length; j++) if (seq[j] !== data[i + j + 1]) return false;
		return true;
	}
	function validateEntityName(name, xmlVersion) {
		if (qName(name, { xmlVersion })) return name;
		else throw new Error(`Invalid entity name ${name}`);
	}
	/**
	* Flat lookup table: maps Unicode code point → ASCII digit (0-9).
	* Only decimal digit characters (Unicode category Nd) are included.
	*
	* Strategy: Int32Array of size (maxCodePoint - minCodePoint + 1).
	* Value 0xFF means "not a digit". Value 0-9 is the ASCII digit value.
	* This gives O(1) lookup with no branching, no bisect, no loop.
	*
	* Memory: range is 0x0660 to 0x1FBF0 → ~129,936 entries × 1 byte = ~127 KB.
	* Acceptable for a one-time init; lookup is a single array index.
	*/
	var SCRIPT_ZEROS = [
		48,
		1632,
		1776,
		2406,
		2534,
		2662,
		2790,
		2918,
		3046,
		3174,
		3302,
		3430,
		3558,
		3664,
		3792,
		3872,
		4160,
		4240,
		6112,
		6160,
		6470,
		6608,
		6784,
		6800,
		6992,
		7088,
		7232,
		7248,
		65296,
		120782,
		120792,
		120802,
		120812,
		120822,
		66720,
		68912,
		69734,
		69872,
		69942,
		70096,
		70384,
		70736,
		70864,
		71248,
		71360,
		71472,
		71904,
		72016,
		72688,
		72784,
		73040,
		73120,
		73552,
		92768,
		92864,
		93008,
		123200,
		123632,
		124144,
		125264,
		130032
	];
	var HIGH_MAP = /* @__PURE__ */ new Map();
	var LOW_MAX = 65535;
	var TABLE_OFFSET = 1632;
	var TABLE = (/* @__PURE__ */ new Uint8Array(63904)).fill(255);
	for (const zero of SCRIPT_ZEROS) for (let d = 0; d < 10; d++) {
		const cp = zero + d;
		if (cp <= LOW_MAX) TABLE[cp - TABLE_OFFSET] = d;
		else HIGH_MAP.set(cp, d);
	}
	var CHAR_0 = 48;
	var CHAR_9 = 57;
	var CHAR_MINUS = 45;
	var MINUS_SET = /* @__PURE__ */ new Set([
		8722,
		65293,
		65123
	]);
	/**
	* Normalize all Unicode decimal digit characters in a string to ASCII (0-9),
	* and normalize Unicode minus variants to ASCII '-' (U+002D).
	*
	* Non-digit, non-minus characters are passed through unchanged.
	*
	* Performance design:
	* - Fast path: if the string has no convertible characters, return it unchanged
	*   (zero allocation).
	* - BMP digits (0x0660..0xFFFF excl. surrogates): flat Uint8Array lookup (O(1)).
	* - Supplementary plane digits (> 0xFFFF, encoded as surrogate pairs): Map lookup.
	* - Minus variants: checked inline with a small fixed Set.
	*
	* @param {string} str
	* @returns {string}
	*/
	function anynum(str) {
		if (typeof str !== "string") return str;
		const len = str.length;
		if (len === 0) return str;
		let firstHit = -1;
		for (let i = 0; i < len; i++) {
			const cc = str.charCodeAt(i);
			if (cc >= CHAR_0 && cc <= CHAR_9 || cc === CHAR_MINUS) continue;
			if (cc < 1632) {
				if (MINUS_SET.has(cc)) {
					firstHit = i;
					break;
				}
				continue;
			}
			if (cc >= 55296 && cc <= 56319) {
				if (i + 1 < len) {
					const low = str.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						const cp = 65536 + (cc - 55296 << 10) + (low - 56320);
						if (HIGH_MAP.has(cp)) {
							firstHit = i;
							break;
						}
					}
				}
				continue;
			}
			if (TABLE[cc - 1632] !== 255 || MINUS_SET.has(cc)) {
				firstHit = i;
				break;
			}
		}
		if (firstHit === -1) return str;
		const chars = [];
		if (firstHit > 0) chars.push(str.slice(0, firstHit));
		for (let i = firstHit; i < len; i++) {
			const cc = str.charCodeAt(i);
			if (cc >= CHAR_0 && cc <= CHAR_9 || cc === CHAR_MINUS) {
				chars.push(str[i]);
				continue;
			}
			if (cc < 1632) {
				chars.push(MINUS_SET.has(cc) ? "-" : str[i]);
				continue;
			}
			if (cc >= 55296 && cc <= 56319) {
				if (i + 1 < len) {
					const low = str.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						const cp = 65536 + (cc - 55296 << 10) + (low - 56320);
						const d = HIGH_MAP.get(cp);
						if (d !== void 0) {
							chars.push(String.fromCharCode(d + 48));
							i++;
							continue;
						}
					}
				}
				chars.push(str[i]);
				continue;
			}
			if (MINUS_SET.has(cc)) {
				chars.push("-");
				continue;
			}
			const d = TABLE[cc - TABLE_OFFSET];
			chars.push(d !== 255 ? String.fromCharCode(d + 48) : str[i]);
		}
		return chars.join("");
	}
	var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
	var binRegex = /^0b[01]+$/;
	var octRegex = /^0o[0-7]+$/;
	var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
	var consider = {
		hex: true,
		binary: false,
		octal: false,
		leadingZeros: true,
		decimalPoint: ".",
		eNotation: true,
		infinity: "original",
		unicode: false
	};
	function toNumber(str, options = {}) {
		options = Object.assign({}, consider, options);
		if (!str || typeof str !== "string") return str;
		let trimmedStr = str.trim();
		if (trimmedStr.length === 0) return str;
		else if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
		else if (trimmedStr === "0") return 0;
		if (options.unicode) {
			trimmedStr = anynum(trimmedStr);
			if (trimmedStr === "0") return 0;
		}
		if (options.hex && hexRegex.test(trimmedStr)) return parse_int(trimmedStr, 16);
		else if (options.binary && binRegex.test(trimmedStr)) return parse_int(trimmedStr, 2);
		else if (options.octal && octRegex.test(trimmedStr)) return parse_int(trimmedStr, 8);
		else if (!isFinite(trimmedStr)) {
			const num = Number(trimmedStr);
			if (Number.isNaN(num)) return str;
			return handleInfinity(str, num, options);
		} else if (trimmedStr.includes("e") || trimmedStr.includes("E")) return resolveEnotation(str, trimmedStr, options);
		else {
			const match = numRegex.exec(trimmedStr);
			if (match) {
				const sign = match[1] || "";
				const leadingZeros = match[2];
				let numTrimmedByZeros = trimZeros(match[3]);
				const decimalAdjacentToLeadingZeros = sign ? trimmedStr[leadingZeros.length + 1] === "." : trimmedStr[leadingZeros.length] === ".";
				if (!options.leadingZeros && (leadingZeros.length > 1 || leadingZeros.length === 1 && !decimalAdjacentToLeadingZeros)) return str;
				else {
					const num = Number(trimmedStr);
					const parsedStr = String(num);
					if (num === 0) return num;
					if (parsedStr.search(/[eE]/) !== -1) {
						if (options.eNotation) return num;
						else return str;
					} else if (trimmedStr.indexOf(".") !== -1) {
						if (parsedStr === "0") return num;
						else if (parsedStr === numTrimmedByZeros) return num;
						else if (parsedStr === `${sign}${numTrimmedByZeros}`) return num;
						else return str;
					}
					let n = leadingZeros ? numTrimmedByZeros : trimmedStr;
					if (leadingZeros) return n === parsedStr || sign + n === parsedStr ? num : str;
					else return n === parsedStr || n === sign + parsedStr ? num : str;
				}
			} else return str;
		}
	}
	var eNotationRegx = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
	function resolveEnotation(str, trimmedStr, options) {
		if (!options.eNotation) return str;
		const notation = trimmedStr.match(eNotationRegx);
		if (notation) {
			let sign = notation[1] || "";
			const eChar = notation[3].indexOf("e") === -1 ? "E" : "e";
			const leadingZeros = notation[2];
			const eAdjacentToLeadingZeros = sign ? trimmedStr[leadingZeros.length + 1] === eChar : trimmedStr[leadingZeros.length] === eChar;
			if (leadingZeros.length > 1 && eAdjacentToLeadingZeros) return str;
			else if (leadingZeros.length === 1 && (notation[3].startsWith(`.${eChar}`) || notation[3][0] === eChar)) return Number(trimmedStr);
			else if (leadingZeros.length > 0) {
				if (options.leadingZeros && !eAdjacentToLeadingZeros) return Number(trimmedStr);
				else return str;
			} else return Number(trimmedStr);
		} else return str;
	}
	/**
	* 
	* @param {string} numStr without leading zeros
	* @returns 
	*/
	function trimZeros(numStr) {
		if (numStr && numStr.indexOf(".") !== -1) {
			let end = numStr.length;
			while (end > 0 && numStr.charCodeAt(end - 1) === 48) end--;
			numStr = numStr.slice(0, end);
			if (numStr === ".") numStr = "0";
			else if (numStr[0] === ".") numStr = "0" + numStr;
			else if (numStr[numStr.length - 1] === ".") numStr = numStr.substring(0, numStr.length - 1);
			return numStr;
		}
		return numStr;
	}
	function parse_int(numStr, base) {
		const str = numStr.trim();
		if (base === 2 || base === 8) numStr = str.substring(2);
		if (parseInt) return parseInt(numStr, base);
		else if (Number.parseInt) return Number.parseInt(numStr, base);
		else if (window && window.parseInt) return window.parseInt(numStr, base);
		else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
	}
	/**
	* Handle infinite values based on user option
	* @param {string} str - original input string
	* @param {number} num - parsed number (Infinity or -Infinity)
	* @param {object} options - user options
	* @returns {string|number|null} based on infinity option
	*/
	function handleInfinity(str, num, options) {
		const isPositive = num === 1e400;
		switch (options.infinity.toLowerCase()) {
			case "null": return null;
			case "infinity": return num;
			case "string": return isPositive ? "Infinity" : "-Infinity";
			default: return str;
		}
	}
	function getIgnoreAttributesFn(ignoreAttributes) {
		if (typeof ignoreAttributes === "function") return ignoreAttributes;
		if (Array.isArray(ignoreAttributes)) return (attrName) => {
			for (const pattern of ignoreAttributes) {
				if (typeof pattern === "string" && attrName === pattern) return true;
				if (pattern instanceof RegExp && pattern.test(attrName)) return true;
			}
		};
		return () => false;
	}
	/**
	* Expression - Parses and stores a tag pattern expression
	* 
	* Patterns are parsed once and stored in an optimized structure for fast matching.
	* 
	* @example
	* const expr = new Expression("root.users.user");
	* const expr2 = new Expression("..user[id]:first");
	* const expr3 = new Expression("root/users/user", { separator: '/' });
	*/
	var Expression = class {
		/**
		* Create a new Expression
		* @param {string} pattern - Pattern string (e.g., "root.users.user", "..user[id]")
		* @param {Object} options - Configuration options
		* @param {string} options.separator - Path separator (default: '.')
		*/
		constructor(pattern, options = {}, data) {
			this.pattern = pattern;
			this.separator = options.separator || ".";
			this.segments = this._parse(pattern);
			this.data = data;
			this._hasDeepWildcard = this.segments.some((seg) => seg.type === "deep-wildcard");
			this._hasAttributeCondition = this.segments.some((seg) => seg.attrName !== void 0);
			this._hasPositionSelector = this.segments.some((seg) => seg.position !== void 0);
		}
		/**
		* Parse pattern string into segments
		* @private
		* @param {string} pattern - Pattern to parse
		* @returns {Array} Array of segment objects
		*/
		_parse(pattern) {
			const segments = [];
			let i = 0;
			let currentPart = "";
			while (i < pattern.length) if (pattern[i] === this.separator) {
				if (i + 1 < pattern.length && pattern[i + 1] === this.separator) {
					if (currentPart.trim()) {
						segments.push(this._parseSegment(currentPart.trim()));
						currentPart = "";
					}
					segments.push({ type: "deep-wildcard" });
					i += 2;
				} else {
					if (currentPart.trim()) segments.push(this._parseSegment(currentPart.trim()));
					currentPart = "";
					i++;
				}
			} else {
				currentPart += pattern[i];
				i++;
			}
			if (currentPart.trim()) segments.push(this._parseSegment(currentPart.trim()));
			return segments;
		}
		/**
		* Parse a single segment
		* @private
		* @param {string} part - Segment string (e.g., "user", "ns::user", "user[id]", "ns::user:first")
		* @returns {Object} Segment object
		*/
		_parseSegment(part) {
			const segment = { type: "tag" };
			let bracketContent = null;
			let withoutBrackets = part;
			const bracketMatch = part.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
			if (bracketMatch) {
				withoutBrackets = bracketMatch[1] + bracketMatch[3];
				if (bracketMatch[2]) {
					const content = bracketMatch[2].slice(1, -1);
					if (content) bracketContent = content;
				}
			}
			let namespace = void 0;
			let tagAndPosition = withoutBrackets;
			if (withoutBrackets.includes("::")) {
				const nsIndex = withoutBrackets.indexOf("::");
				namespace = withoutBrackets.substring(0, nsIndex).trim();
				tagAndPosition = withoutBrackets.substring(nsIndex + 2).trim();
				if (!namespace) throw new Error(`Invalid namespace in pattern: ${part}`);
			}
			let tag = void 0;
			let positionMatch = null;
			if (tagAndPosition.includes(":")) {
				const colonIndex = tagAndPosition.lastIndexOf(":");
				const tagPart = tagAndPosition.substring(0, colonIndex).trim();
				const posPart = tagAndPosition.substring(colonIndex + 1).trim();
				if ([
					"first",
					"last",
					"odd",
					"even"
				].includes(posPart) || /^nth\(\d+\)$/.test(posPart)) {
					tag = tagPart;
					positionMatch = posPart;
				} else tag = tagAndPosition;
			} else tag = tagAndPosition;
			if (!tag) throw new Error(`Invalid segment pattern: ${part}`);
			segment.tag = tag;
			if (namespace) segment.namespace = namespace;
			if (bracketContent) {
				if (bracketContent.includes("=")) {
					const eqIndex = bracketContent.indexOf("=");
					segment.attrName = bracketContent.substring(0, eqIndex).trim();
					segment.attrValue = bracketContent.substring(eqIndex + 1).trim();
				} else segment.attrName = bracketContent.trim();
			}
			if (positionMatch) {
				const nthMatch = positionMatch.match(/^nth\((\d+)\)$/);
				if (nthMatch) {
					segment.position = "nth";
					segment.positionValue = parseInt(nthMatch[1], 10);
				} else segment.position = positionMatch;
			}
			return segment;
		}
		/**
		* Get the number of segments
		* @returns {number}
		*/
		get length() {
			return this.segments.length;
		}
		/**
		* Check if expression contains deep wildcard
		* @returns {boolean}
		*/
		hasDeepWildcard() {
			return this._hasDeepWildcard;
		}
		/**
		* Check if expression has attribute conditions
		* @returns {boolean}
		*/
		hasAttributeCondition() {
			return this._hasAttributeCondition;
		}
		/**
		* Check if expression has position selectors
		* @returns {boolean}
		*/
		hasPositionSelector() {
			return this._hasPositionSelector;
		}
		/**
		* Get string representation
		* @returns {string}
		*/
		toString() {
			return this.pattern;
		}
	};
	/**
	* ExpressionSet - An indexed collection of Expressions for efficient bulk matching
	*
	* Instead of iterating all expressions on every tag, ExpressionSet pre-indexes
	* them at insertion time by depth and terminal tag name. At match time, only
	* the relevant bucket is evaluated — typically reducing checks from O(E) to O(1)
	* lookup plus O(small bucket) matches.
	*
	* Three buckets are maintained:
	*  - `_byDepthAndTag`  — exact depth + exact tag name  (tightest, used first)
	*  - `_wildcardByDepth` — exact depth + wildcard tag `*` (depth-matched only)
	*  - `_deepWildcards`  — expressions containing `..`  (cannot be depth-indexed)
	*
	* @example
	* import { Expression, ExpressionSet } from 'fast-xml-tagger';
	*
	* // Build once at config time
	* const stopNodes = new ExpressionSet();
	* stopNodes.add(new Expression('root.users.user'));
	* stopNodes.add(new Expression('root.config.setting'));
	* stopNodes.add(new Expression('..script'));
	*
	* // Query on every tag — hot path
	* if (stopNodes.matchesAny(matcher)) { ... }
	*/
	var ExpressionSet = class {
		constructor() {
			/** @type {Map<string, import('./Expression.js').default[]>} depth:tag → expressions */
			this._byDepthAndTag = /* @__PURE__ */ new Map();
			/** @type {Map<number, import('./Expression.js').default[]>} depth → wildcard-tag expressions */
			this._wildcardByDepth = /* @__PURE__ */ new Map();
			/** @type {import('./Expression.js').default[]} expressions containing deep wildcard (..) */
			this._deepWildcards = [];
			/** @type {Map<string, import('./Expression.js').default[]>} terminalTag → deep wildcard expressions */
			this._deepByTerminalTag = /* @__PURE__ */ new Map();
			/** @type {Set<string>} pattern strings already added — used for deduplication */
			this._patterns = /* @__PURE__ */ new Set();
			/** @type {boolean} whether the set is sealed against further additions */
			this._sealed = false;
		}
		/**
		* Add an Expression to the set.
		* Duplicate patterns (same pattern string) are silently ignored.
		*
		* @param {import('./Expression.js').default} expression - A pre-constructed Expression instance
		* @returns {this} for chaining
		* @throws {TypeError} if called after seal()
		*
		* @example
		* set.add(new Expression('root.users.user'));
		* set.add(new Expression('..script'));
		*/
		add(expression) {
			if (this._sealed) throw new TypeError("ExpressionSet is sealed. Create a new ExpressionSet to add more expressions.");
			if (this._patterns.has(expression.pattern)) return this;
			this._patterns.add(expression.pattern);
			if (expression.hasDeepWildcard()) {
				const lastSeg = expression.segments[expression.segments.length - 1];
				if (lastSeg && lastSeg.type !== "deep-wildcard" && lastSeg.tag !== "*") {
					const tag = lastSeg.tag;
					if (!this._deepByTerminalTag.has(tag)) this._deepByTerminalTag.set(tag, []);
					this._deepByTerminalTag.get(tag).push(expression);
				} else this._deepWildcards.push(expression);
				return this;
			}
			const depth = expression.length;
			const tag = expression.segments[expression.segments.length - 1]?.tag;
			if (!tag || tag === "*") {
				if (!this._wildcardByDepth.has(depth)) this._wildcardByDepth.set(depth, []);
				this._wildcardByDepth.get(depth).push(expression);
			} else {
				const key = `${depth}:${tag}`;
				if (!this._byDepthAndTag.has(key)) this._byDepthAndTag.set(key, []);
				this._byDepthAndTag.get(key).push(expression);
			}
			return this;
		}
		/**
		* Add multiple expressions at once.
		*
		* @param {import('./Expression.js').default[]} expressions - Array of Expression instances
		* @returns {this} for chaining
		*
		* @example
		* set.addAll([
		*   new Expression('root.users.user'),
		*   new Expression('root.config.setting'),
		* ]);
		*/
		addAll(expressions) {
			for (const expr of expressions) this.add(expr);
			return this;
		}
		/**
		* Check whether a pattern string is already present in the set.
		*
		* @param {import('./Expression.js').default} expression
		* @returns {boolean}
		*/
		has(expression) {
			return this._patterns.has(expression.pattern);
		}
		/**
		* Number of expressions in the set.
		* @type {number}
		*/
		get size() {
			return this._patterns.size;
		}
		/**
		* Seal the set against further modifications.
		* Useful to prevent accidental mutations after config is built.
		* Calling add() or addAll() on a sealed set throws a TypeError.
		*
		* @returns {this}
		*/
		seal() {
			this._sealed = true;
			return this;
		}
		/**
		* Whether the set has been sealed.
		* @type {boolean}
		*/
		get isSealed() {
			return this._sealed;
		}
		/**
		* Test whether the matcher's current path matches any expression in the set.
		*
		* Evaluation order (cheapest → most expensive):
		*  1. Exact depth + tag bucket  — O(1) lookup, typically 0–2 expressions
		*  2. Depth-only wildcard bucket — O(1) lookup, rare
		*  3. Deep-wildcard list         — always checked, but usually small
		*
		* @param {import('./Matcher.js').default} matcher - Matcher instance (or readOnly view)
		* @returns {boolean} true if any expression matches the current path
		*
		* @example
		* if (stopNodes.matchesAny(matcher)) {
		*   // handle stop node
		* }
		*/
		matchesAny(matcher) {
			return this.findMatch(matcher) !== null;
		}
		/**
		* Find and return the first Expression that matches the matcher's current path.
		*
		* Uses the same evaluation order as matchesAny (cheapest → most expensive):
		*  1. Exact depth + tag bucket
		*  2. Depth-only wildcard bucket
		*  3. Deep-wildcard list
		*
		* @param {import('./Matcher.js').default} matcher - Matcher instance (or readOnly view)
		* @returns {import('./Expression.js').default | null} the first matching Expression, or null
		*
		* @example
		* const expr = stopNodes.findMatch(matcher);
		* if (expr) {
		*   // access expr.config, expr.pattern, etc.
		* }
		*/
		findMatch(matcher) {
			const depth = matcher.getDepth();
			const tag = matcher.getCurrentTag();
			const exactKey = `${depth}:${tag}`;
			const exactBucket = this._byDepthAndTag.get(exactKey);
			if (exactBucket) {
				for (let i = 0; i < exactBucket.length; i++) if (matcher.matches(exactBucket[i])) return exactBucket[i];
			}
			const wildcardBucket = this._wildcardByDepth.get(depth);
			if (wildcardBucket) {
				for (let i = 0; i < wildcardBucket.length; i++) if (matcher.matches(wildcardBucket[i])) return wildcardBucket[i];
			}
			const deepBucket = this._deepByTerminalTag.get(tag);
			if (deepBucket) {
				for (let i = 0; i < deepBucket.length; i++) if (matcher.matches(deepBucket[i])) return deepBucket[i];
			}
			for (let i = 0; i < this._deepWildcards.length; i++) if (matcher.matches(this._deepWildcards[i])) return this._deepWildcards[i];
			return null;
		}
	};
	/**
	* MatcherView - A lightweight read-only view over a Matcher's internal state.
	*
	* Created once by Matcher and reused across all callbacks. Holds a direct
	* reference to the parent Matcher so it always reflects current parser state
	* with zero copying or freezing overhead.
	*
	* Users receive this via {@link Matcher#readOnly} or directly from parser
	* callbacks. It exposes all query and matching methods but has no mutation
	* methods — misuse is caught at the TypeScript level rather than at runtime.
	*
	* @example
	* const matcher = new Matcher();
	* const view = matcher.readOnly();
	*
	* matcher.push("root", {});
	* view.getCurrentTag(); // "root"
	* view.getDepth();      // 1
	*/
	var MatcherView = class {
		/**
		* @param {Matcher} matcher - The parent Matcher instance to read from.
		*/
		constructor(matcher) {
			this._matcher = matcher;
		}
		/**
		* Get the path separator used by the parent matcher.
		* @returns {string}
		*/
		get separator() {
			return this._matcher.separator;
		}
		/**
		* Get current tag name.
		* @returns {string|undefined}
		*/
		getCurrentTag() {
			const path = this._matcher.path;
			return path.length > 0 ? path[path.length - 1].tag : void 0;
		}
		/**
		* Get current namespace.
		* @returns {string|undefined}
		*/
		getCurrentNamespace() {
			const path = this._matcher.path;
			return path.length > 0 ? path[path.length - 1].namespace : void 0;
		}
		/**
		* Get current node's attribute value.
		* @param {string} attrName
		* @returns {*}
		*/
		getAttrValue(attrName) {
			const path = this._matcher.path;
			if (path.length === 0) return void 0;
			return path[path.length - 1].values?.[attrName];
		}
		/**
		* Check if current node has an attribute.
		* @param {string} attrName
		* @returns {boolean}
		*/
		hasAttr(attrName) {
			const path = this._matcher.path;
			if (path.length === 0) return false;
			const current = path[path.length - 1];
			return current.values !== void 0 && attrName in current.values;
		}
		/**
		* Get the value of a "kept" attribute from the nearest ancestor (or
		* current node) that declared it via `push(tag, attrs, ns, { keep: [...] })`.
		* @param {string} attrName
		* @returns {*}
		*/
		getAnyParentAttr(attrName) {
			return this._matcher.getAnyParentAttr(attrName);
		}
		/**
		* Check whether any ancestor (or the current node) kept the given
		* attribute via `push(tag, attrs, ns, { keep: [...] })`.
		* @param {string} attrName
		* @returns {boolean}
		*/
		hasAnyParentAttr(attrName) {
			return this._matcher.hasAnyParentAttr(attrName);
		}
		/**
		* Get current node's sibling position (child index in parent).
		* @returns {number}
		*/
		getPosition() {
			const path = this._matcher.path;
			if (path.length === 0) return -1;
			return path[path.length - 1].position ?? 0;
		}
		/**
		* Get current node's repeat counter (occurrence count of this tag name).
		* @returns {number}
		*/
		getCounter() {
			const path = this._matcher.path;
			if (path.length === 0) return -1;
			return path[path.length - 1].counter ?? 0;
		}
		/**
		* Get current node's sibling index (alias for getPosition).
		* @returns {number}
		* @deprecated Use getPosition() or getCounter() instead
		*/
		getIndex() {
			return this.getPosition();
		}
		/**
		* Get current path depth.
		* @returns {number}
		*/
		getDepth() {
			return this._matcher.path.length;
		}
		/**
		* Get path as string.
		* @param {string} [separator] - Optional separator (uses default if not provided)
		* @param {boolean} [includeNamespace=true]
		* @returns {string}
		*/
		toString(separator, includeNamespace = true) {
			return this._matcher.toString(separator, includeNamespace);
		}
		/**
		* Get path as array of tag names.
		* @returns {string[]}
		*/
		toArray() {
			return this._matcher.path.map((n) => n.tag);
		}
		/**
		* Match current path against an Expression.
		* @param {Expression} expression
		* @returns {boolean}
		*/
		matches(expression) {
			return this._matcher.matches(expression);
		}
		/**
		* Match any expression in the given set against the current path.
		* @param {ExpressionSet} exprSet
		* @returns {boolean}
		*/
		matchesAny(exprSet) {
			return exprSet.matchesAny(this._matcher);
		}
	};
	/**
	* Matcher - Tracks current path in XML/JSON tree and matches against Expressions.
	*
	* The matcher maintains a stack of nodes representing the current path from root to
	* current tag. It only stores attribute values for the current (top) node to minimize
	* memory usage. Sibling tracking is used to auto-calculate position and counter.
	*
	* Use {@link Matcher#readOnly} to obtain a {@link MatcherView} safe to pass to
	* user callbacks — it always reflects current state with no Proxy overhead.
	*
	* @example
	* const matcher = new Matcher();
	* matcher.push("root", {});
	* matcher.push("users", {});
	* matcher.push("user", { id: "123", type: "admin" });
	*
	* const expr = new Expression("root.users.user");
	* matcher.matches(expr); // true
	*/
	var Matcher = class {
		/**
		* Create a new Matcher.
		* @param {Object} [options={}]
		* @param {string} [options.separator='.'] - Default path separator
		*/
		constructor(options = {}) {
			this.separator = options.separator || ".";
			this.path = [];
			this.siblingStacks = [];
			this._pathStringCache = null;
			this._view = new MatcherView(this);
			this._keptAttrs = [];
		}
		/**
		* Push a new tag onto the path.
		* @param {string} tagName
		* @param {Object|null} [attrValues=null]
		* @param {string|null} [namespace=null]
		* @param {Object|null} [options=null]
		* @param {string[]} [options.keep] - Names of attributes (from attrValues)
		*/
		push(tagName, attrValues = null, namespace = null, options = null) {
			this._pathStringCache = null;
			if (this.path.length > 0) this.path[this.path.length - 1].values = void 0;
			const currentLevel = this.path.length;
			let level = this.siblingStacks[currentLevel];
			if (!level) {
				level = {
					counts: /* @__PURE__ */ new Map(),
					total: 0
				};
				this.siblingStacks[currentLevel] = level;
			}
			const siblingKey = namespace ? `${namespace}:${tagName}` : tagName;
			const counter = level.counts.get(siblingKey) || 0;
			const position = level.total;
			level.counts.set(siblingKey, counter + 1);
			level.total++;
			const node = {
				tag: tagName,
				position,
				counter
			};
			if (namespace !== null && namespace !== void 0) node.namespace = namespace;
			if (attrValues !== null && attrValues !== void 0) node.values = attrValues;
			this.path.push(node);
			const depth = this.path.length;
			const keep = options !== null ? options.keep : null;
			if (keep !== null && keep !== void 0 && keep.length > 0 && attrValues) for (let i = 0; i < keep.length; i++) {
				const name = keep[i];
				if (attrValues[name] !== void 0) this._keptAttrs.push({
					depth,
					name,
					value: attrValues[name]
				});
			}
		}
		/**
		* Pop the last tag from the path.
		* @returns {Object|undefined} The popped node
		*/
		pop() {
			if (this.path.length === 0) return void 0;
			this._pathStringCache = null;
			const node = this.path.pop();
			if (this.siblingStacks.length > this.path.length + 1) this.siblingStacks.length = this.path.length + 1;
			const poppedDepth = this.path.length + 1;
			while (this._keptAttrs.length > 0 && this._keptAttrs[this._keptAttrs.length - 1].depth >= poppedDepth) this._keptAttrs.pop();
			return node;
		}
		/**
		* Update current node's attribute values.
		* Useful when attributes are parsed after push.
		* @param {Object} attrValues
		*/
		updateCurrent(attrValues) {
			if (this.path.length > 0) {
				const current = this.path[this.path.length - 1];
				if (attrValues !== null && attrValues !== void 0) current.values = attrValues;
			}
		}
		/**
		* Get current tag name.
		* @returns {string|undefined}
		*/
		getCurrentTag() {
			return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
		}
		/**
		* Get current namespace.
		* @returns {string|undefined}
		*/
		getCurrentNamespace() {
			return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
		}
		/**
		* Get current node's attribute value.
		* @param {string} attrName
		* @returns {*}
		*/
		getAttrValue(attrName) {
			if (this.path.length === 0) return void 0;
			return this.path[this.path.length - 1].values?.[attrName];
		}
		/**
		* Check if current node has an attribute.
		* @param {string} attrName
		* @returns {boolean}
		*/
		hasAttr(attrName) {
			if (this.path.length === 0) return false;
			const current = this.path[this.path.length - 1];
			return current.values !== void 0 && attrName in current.values;
		}
		/**
		* Get the value of a "kept" attribute from the nearest ancestor (or
		* current node) that declared it via `push(tag, attrs, ns, { keep: [...] })`.
		* Unlike getAttrValue(), this works regardless of how deep the path has
		* gone since the attribute was pushed — but only for attribute names that
		* were explicitly marked with `keep` at push time. Cost is proportional to
		* the number of currently-kept attributes (typically 0-3), not path depth.
		* @param {string} attrName
		* @returns {*} the value, or undefined if no ancestor kept this attribute
		*/
		getAnyParentAttr(attrName) {
			const kept = this._keptAttrs;
			for (let i = kept.length - 1; i >= 0; i--) if (kept[i].name === attrName) return kept[i].value;
		}
		/**
		* Check whether any ancestor (or the current node) kept the given
		* attribute via `push(tag, attrs, ns, { keep: [...] })`.
		* @param {string} attrName
		* @returns {boolean}
		*/
		hasAnyParentAttr(attrName) {
			const kept = this._keptAttrs;
			for (let i = kept.length - 1; i >= 0; i--) if (kept[i].name === attrName) return true;
			return false;
		}
		/**
		* Get current node's sibling position (child index in parent).
		* @returns {number}
		*/
		getPosition() {
			if (this.path.length === 0) return -1;
			return this.path[this.path.length - 1].position ?? 0;
		}
		/**
		* Get current node's repeat counter (occurrence count of this tag name).
		* @returns {number}
		*/
		getCounter() {
			if (this.path.length === 0) return -1;
			return this.path[this.path.length - 1].counter ?? 0;
		}
		/**
		* Get current node's sibling index (alias for getPosition).
		* @returns {number}
		* @deprecated Use getPosition() or getCounter() instead
		*/
		getIndex() {
			return this.getPosition();
		}
		/**
		* Get current path depth.
		* @returns {number}
		*/
		getDepth() {
			return this.path.length;
		}
		/**
		* Get path as string.
		* @param {string} [separator] - Optional separator (uses default if not provided)
		* @param {boolean} [includeNamespace=true]
		* @returns {string}
		*/
		toString(separator, includeNamespace = true) {
			const sep = separator || this.separator;
			if (sep === this.separator && includeNamespace === true) {
				if (this._pathStringCache !== null) return this._pathStringCache;
				const result = this.path.map((n) => n.namespace ? `${n.namespace}:${n.tag}` : n.tag).join(sep);
				this._pathStringCache = result;
				return result;
			}
			return this.path.map((n) => includeNamespace && n.namespace ? `${n.namespace}:${n.tag}` : n.tag).join(sep);
		}
		/**
		* Get path as array of tag names.
		* @returns {string[]}
		*/
		toArray() {
			return this.path.map((n) => n.tag);
		}
		/**
		* Reset the path to empty.
		*/
		reset() {
			this._pathStringCache = null;
			this.path = [];
			this.siblingStacks = [];
			this._keptAttrs = [];
		}
		/**
		* Match current path against an Expression.
		* @param {Expression} expression
		* @returns {boolean}
		*/
		matches(expression) {
			const segments = expression.segments;
			if (segments.length === 0) return false;
			if (expression.hasDeepWildcard()) return this._matchWithDeepWildcard(segments);
			return this._matchSimple(segments);
		}
		/**
		* @private
		*/
		_matchSimple(segments) {
			if (this.path.length !== segments.length) return false;
			for (let i = 0; i < segments.length; i++) if (!this._matchSegment(segments[i], this.path[i], i === this.path.length - 1)) return false;
			return true;
		}
		/**
		* @private
		*/
		_matchWithDeepWildcard(segments) {
			let pathIdx = this.path.length - 1;
			let segIdx = segments.length - 1;
			while (segIdx >= 0 && pathIdx >= 0) {
				const segment = segments[segIdx];
				if (segment.type === "deep-wildcard") {
					segIdx--;
					if (segIdx < 0) return true;
					const nextSeg = segments[segIdx];
					let found = false;
					for (let i = pathIdx; i >= 0; i--) if (this._matchSegment(nextSeg, this.path[i], i === this.path.length - 1)) {
						pathIdx = i - 1;
						segIdx--;
						found = true;
						break;
					}
					if (!found) return false;
				} else {
					if (!this._matchSegment(segment, this.path[pathIdx], pathIdx === this.path.length - 1)) return false;
					pathIdx--;
					segIdx--;
				}
			}
			return segIdx < 0;
		}
		/**
		* @private
		*/
		_matchSegment(segment, node, isCurrentNode) {
			if (segment.tag !== "*" && segment.tag !== node.tag) return false;
			if (segment.namespace !== void 0) {
				if (segment.namespace !== "*" && segment.namespace !== node.namespace) return false;
			}
			if (segment.attrName !== void 0) {
				if (!isCurrentNode) return false;
				if (!node.values || !(segment.attrName in node.values)) return false;
				if (segment.attrValue !== void 0) {
					if (String(node.values[segment.attrName]) !== String(segment.attrValue)) return false;
				}
			}
			if (segment.position !== void 0) {
				if (!isCurrentNode) return false;
				const counter = node.counter ?? 0;
				if (segment.position === "first" && counter !== 0) return false;
				else if (segment.position === "odd" && counter % 2 !== 1) return false;
				else if (segment.position === "even" && counter % 2 !== 0) return false;
				else if (segment.position === "nth" && counter !== segment.positionValue) return false;
			}
			return true;
		}
		/**
		* Match any expression in the given set against the current path.
		* @param {ExpressionSet} exprSet
		* @returns {boolean}
		*/
		matchesAny(exprSet) {
			return exprSet.matchesAny(this);
		}
		/**
		* Create a snapshot of current state.
		* @returns {Object}
		*/
		snapshot() {
			return {
				path: this.path.map((node) => ({ ...node })),
				siblingStacks: this.siblingStacks.map((level) => level ? {
					counts: new Map(level.counts),
					total: level.total
				} : level),
				keptAttrs: this._keptAttrs.map((entry) => ({ ...entry }))
			};
		}
		/**
		* Restore state from snapshot.
		* @param {Object} snapshot
		*/
		restore(snapshot) {
			this._pathStringCache = null;
			this.path = snapshot.path.map((node) => ({ ...node }));
			this.siblingStacks = snapshot.siblingStacks.map((level) => level ? {
				counts: new Map(level.counts),
				total: level.total
			} : level);
			this._keptAttrs = (snapshot.keptAttrs || []).map((entry) => ({ ...entry }));
		}
		/**
		* Return the read-only {@link MatcherView} for this matcher.
		*
		* The same instance is returned on every call — no allocation occurs.
		* It always reflects the current parser state and is safe to pass to
		* user callbacks without risk of accidental mutation.
		*
		* @returns {MatcherView}
		*
		* @example
		* const view = matcher.readOnly();
		* // pass view to callbacks — it stays in sync automatically
		* view.matches(expr);       // ✓
		* view.getCurrentTag();     // ✓
		* // view.push(...)         // ✗ method does not exist — caught by TypeScript
		*/
		readOnly() {
			return this._view;
		}
	};
	/**
	* HTML context patterns.
	*
	* Detects XSS vectors that are dangerous when a string ends up rendered as HTML.
	* All patterns use bounded quantifiers to ensure linear-time matching (ReDoS-safe).
	*
	* Each entry is { pattern: RegExp, id: string, description: string }
	* so callers can inspect which rule fired if they need to.
	*/
	var HTML_PATTERNS = [
		{
			id: "html-script-open",
			description: "<script opening tag",
			pattern: /<script[\s>/]/i
		},
		{
			id: "html-script-close",
			description: "<\/script closing tag",
			pattern: /<\/script[\s>]/i
		},
		{
			id: "html-javascript-protocol",
			description: "javascript: URI scheme (with optional whitespace/encoding)",
			pattern: /j[\t\n\r ]*a[\t\n\r ]*v[\t\n\r ]*a[\t\n\r ]*s[\t\n\r ]*c[\t\n\r ]*r[\t\n\r ]*i[\t\n\r ]*p[\t\n\r ]*t[\t\n\r ]*:/i
		},
		{
			id: "html-vbscript-protocol",
			description: "vbscript: URI scheme",
			pattern: /vbscript[\t\n\r ]*:/i
		},
		{
			id: "html-data-html",
			description: "data:text/html URI — can execute scripts in browsers",
			pattern: /data[\t\n\r ]*:[\t\n\r ]*text\/html/i
		},
		{
			id: "html-data-xhtml",
			description: "data:application/xhtml+xml URI",
			pattern: /data[\t\n\r ]*:[\t\n\r ]*application\/xhtml/i
		},
		{
			id: "html-data-svg",
			description: "data:image/svg+xml URI — can execute scripts",
			pattern: /data[\t\n\r ]*:[\t\n\r ]*image\/svg\+xml/i
		},
		{
			id: "html-inline-event-handler",
			description: "Inline event handler attributes: onclick=, onerror=, onload=, etc.",
			pattern: /\bon\w{1,30}\s*=/i
		},
		{
			id: "html-entity-obfuscated-script",
			description: "HTML-entity-encoded <script (e.g. &#x3C;script or &lt;script)",
			pattern: /(?:&#x0*3[Cc];?|&#0*60;?|&lt;)\s*script/i
		},
		{
			id: "html-entity-obfuscated-javascript",
			description: "HTML-entity-encoded javascript: (partial — catches common &#106; or &#x6a; for \"j\")",
			pattern: /(?:&#x0*6[Aa];?|&#0*106;?)\s*(?:&#x0*61;?|a)[\s\S]{0,80}script\s*:/i
		},
		{
			id: "html-style-expression",
			description: "CSS expression() — IE-era code execution in style attributes",
			pattern: /style[\s\S]{0,20}expression\s*\(/i
		},
		{
			id: "html-object-embed",
			description: "<object or <embed tags that can load active content",
			pattern: /<(?:object|embed)[\s>/]/i
		},
		{
			id: "html-base-tag",
			description: "<base href= — can hijack all relative URLs on a page",
			pattern: /<base[\s>]/i
		},
		{
			id: "html-meta-refresh",
			description: "<meta http-equiv=\"refresh\" — can redirect users",
			pattern: /<meta[\s\S]{0,40}http-equiv[\s\S]{0,20}refresh/i
		},
		{
			id: "html-srcdoc",
			description: "srcdoc= attribute on iframes — embeds HTML that can run scripts",
			pattern: /srcdoc\s*=/i
		},
		{
			id: "html-iframe",
			description: "<iframe tag",
			pattern: /<iframe[\s>/]/i
		},
		{
			id: "html-form",
			description: "<form tag — can be used for phishing / credential harvesting injection",
			pattern: /<form[\s>/]/i
		}
	];
	/**
	* XML context patterns.
	*
	* Detects injection vectors that are specifically dangerous when a string
	* is inserted into an XML document (not HTML rendering context).
	*
	* Key distinction from HTML: these patterns target parser-level attacks —
	* things that can confuse or subvert an XML parser, trigger external entity
	* resolution, or inject DTD content. HTML rendering concerns (XSS) belong
	* in the HTML context.
	*/
	var XML_PATTERNS = [
		{
			id: "xml-cdata-injection",
			description: "CDATA section injection: <![CDATA[ breaks out of text node context",
			pattern: /<!\[CDATA\[/i
		},
		{
			id: "xml-cdata-close",
			description: "CDATA close sequence: ]]> can terminate an enclosing CDATA section",
			pattern: /\]\]>/
		},
		{
			id: "xml-processing-instruction",
			description: "XML processing instruction: <?xml-stylesheet or <?php etc.",
			pattern: /<\?(?:xml[\- ]|php|asp)/i
		},
		{
			id: "xml-doctype-injection",
			description: "DOCTYPE declaration embedded in content — can define entities",
			pattern: /<!DOCTYPE(?:[\s[]|$)/i
		},
		{
			id: "xml-entity-system",
			description: "SYSTEM keyword — used in external entity declarations (XXE)",
			pattern: /\bSYSTEM\s+["']/i
		},
		{
			id: "xml-entity-public",
			description: "PUBLIC keyword — used in external entity declarations (XXE)",
			pattern: /\bPUBLIC\s+["']/i
		},
		{
			id: "xml-entity-declaration",
			description: "<!ENTITY declaration — defines entities, potential XXE or entity expansion",
			pattern: /<!ENTITY[\s%]/i
		},
		{
			id: "xml-billion-laughs",
			description: "Entity reference chaining / billion laughs: repeated &eX; style references",
			pattern: /(?:&\w{1,20};){3,}/
		},
		{
			id: "xml-namespace-confusion",
			description: "xmlns: attribute injection — can redefine namespaces to confuse parsers",
			pattern: /\bxmlns(?::\w{1,40})?\s*=/i
		},
		{
			id: "xml-comment-injection",
			description: "<!-- comment injection — can hide content from some parsers",
			pattern: /<!--/
		},
		{
			id: "xml-comment-close",
			description: "--> closes an enclosing XML comment",
			pattern: /-->/
		},
		{
			id: "xml-pi-close",
			description: "?> closes an enclosing processing instruction",
			pattern: /\?>/
		}
	];
	/**
	* SVG context patterns.
	*
	* SVG is XML-based but renders in browsers, giving it a unique attack surface
	* that combines XML parser behaviour with browser rendering and JavaScript execution.
	*
	* Many of these vectors bypass HTML sanitizers that don't understand SVG semantics
	* (DOMPurify has documented bypass vulnerabilities specifically in SVG/XML context).
	*/
	var SVG_PATTERNS = [
		{
			id: "svg-script-element",
			description: "<script element inside SVG executes JavaScript",
			pattern: /<script[\s>/]/i
		},
		{
			id: "svg-xlink-href-javascript",
			description: "xlink:href with javascript: — classic SVG XSS via <a> or <use>",
			pattern: /xlink\s*:\s*href\s*=\s*["']?\s*javascript\s*:/i
		},
		{
			id: "svg-href-javascript",
			description: "href= with javascript: in SVG context (<a>, <animate>, etc.)",
			pattern: /href\s*=\s*["']?\s*javascript\s*:/i
		},
		{
			id: "svg-foreignobject",
			description: "<foreignObject embeds HTML inside SVG — can execute scripts",
			pattern: /<foreignObject[\s>/]/i
		},
		{
			id: "svg-use-external",
			description: "<use xlink:href or href pointing to external resource (non-fragment URL)",
			pattern: /<use[\s\S]{0,60}(?:xlink\s*:\s*)?href\s*=\s*(?:["'][^#]|[^"'#\s>])/i
		},
		{
			id: "svg-animate-href",
			description: "<animate attributeName=\"href\" — can dynamically change href to javascript:",
			pattern: /<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*href["']/i
		},
		{
			id: "svg-animate-xlinkhref",
			description: "<animate attributeName=\"xlink:href\"",
			pattern: /<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*xlink\s*:\s*href["']/i
		},
		{
			id: "svg-set-javascript",
			description: "<set to=\"javascript:...\" — sets an attribute to a javascript: URI",
			pattern: /<set[\s\S]{0,80}to\s*=\s*["']?\s*javascript\s*:/i
		},
		{
			id: "svg-event-handler",
			description: "SVG-specific event handler attributes: onload=, onerror=, onactivate=, etc.",
			pattern: /\bon(?:load|error|activate|begin|end|repeat|focus|blur|click|mouse\w{1,20}|key\w{1,20})\s*=/i
		},
		{
			id: "svg-handler-generic",
			description: "Generic on* handler catch-all for SVG attributes",
			pattern: /\bon\w{1,30}\s*=/i
		},
		{
			id: "svg-filter-feimage",
			description: "<feImage href= — filter primitive that can load external resources",
			pattern: /<feImage[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=/i
		},
		{
			id: "svg-image-external",
			description: "<image xlink:href with http/https or javascript protocol",
			pattern: /<image[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=\s*["']?\s*(?:https?|javascript)\s*:/i
		},
		{
			id: "svg-style-javascript",
			description: "style= attribute containing javascript: (e.g. background:url(javascript:...))",
			pattern: /style\s*=[\s\S]{0,60}javascript\s*:/i
		}
	];
	/**
	* SQL context patterns — high-precision rules only.
	*
	* These rules have very low false-positive risk and are safe to apply to
	* general user text (names, descriptions, search queries, etc.).
	* All patterns are ReDoS-safe — unlike the `sql-injection` npm package
	* which has an active CVE on its own detection regexes.
	*
	* For exhaustive coverage including noisier heuristics (comment sequences,
	* hex literals, stacked queries with semicolons), use 'SQL-STRICT' instead.
	* Apply 'SQL-STRICT' only to strings that are specifically SQL fragments,
	* not to general free-text fields.
	*/
	var SQL_PATTERNS = [
		{
			id: "sql-block-comment-open",
			description: "SQL block comment open: /* ... */ — unusual in legitimate user text",
			pattern: /\/\*/
		},
		{
			id: "sql-union-select",
			description: "UNION SELECT — most common SQL injection aggregation attack",
			pattern: /\bUNION\s{1,20}(?:ALL\s{1,20})?SELECT\b/i
		},
		{
			id: "sql-drop-table",
			description: "DROP TABLE — destructive DDL injection",
			pattern: /\bDROP\s{1,20}TABLE\b/i
		},
		{
			id: "sql-drop-database",
			description: "DROP DATABASE — destructive DDL injection",
			pattern: /\bDROP\s{1,20}DATABASE\b/i
		},
		{
			id: "sql-insert-into",
			description: "INSERT INTO — data injection",
			pattern: /\bINSERT\s{1,20}INTO\b/i
		},
		{
			id: "sql-delete-from",
			description: "DELETE FROM — data deletion injection",
			pattern: /\bDELETE\s{1,20}FROM\b/i
		},
		{
			id: "sql-update-set",
			description: "UPDATE ... SET — data modification injection",
			pattern: /\bUPDATE\b[\s\S]{1,60}\bSET\b/i
		},
		{
			id: "sql-exec-xp",
			description: "EXEC xp_ — MSSQL extended stored procedure execution",
			pattern: /\bEXEC(?:UTE)?\s{1,20}xp_/i
		},
		{
			id: "sql-tautology-string",
			description: "Classic string tautology: ' OR '1'='1 or \" OR \"1\"=\"1\"",
			pattern: /'\s{0,10}OR\s{0,10}'[^']{0,20}'\s*=\s*'[^']{0,20}/i
		},
		{
			id: "sql-tautology-numeric",
			description: "Numeric tautology: OR 1=1",
			pattern: /\bOR\s{1,10}1\s*=\s*1\b/i
		},
		{
			id: "sql-always-true-zero",
			description: "Numeric tautology: OR 0=0",
			pattern: /\bOR\s{1,10}0\s*=\s*0\b/i
		},
		{
			id: "sql-sleep-benchmark",
			description: "Time-based blind injection: SLEEP() or BENCHMARK()",
			pattern: /\b(?:SLEEP|BENCHMARK)\s*\(/i
		},
		{
			id: "sql-waitfor-delay",
			description: "MSSQL time-based blind injection: WAITFOR DELAY",
			pattern: /\bWAITFOR\s{1,20}DELAY\b/i
		},
		{
			id: "sql-char-function",
			description: "CHAR() function — used to obfuscate injected strings",
			pattern: /\bCHAR\s*\(\s*\d{1,3}/i
		},
		{
			id: "sql-information-schema",
			description: "INFORMATION_SCHEMA — reconnaissance query for table/column enumeration",
			pattern: /\bINFORMATION_SCHEMA\b/i
		}
	];
	/**
	* SHELL context patterns.
	*
	* Detects shell injection vectors and path traversal patterns.
	* Designed for use when a string will be passed to a shell command,
	* used as a file path, or interpolated into OS-level operations.
	*/
	var SHELL_PATTERNS = [
		{
			id: "shell-path-traversal-unix",
			description: "Unix path traversal: ../  — climbing the directory tree",
			pattern: /\.\.\//
		},
		{
			id: "shell-path-traversal-windows",
			description: "Windows path traversal: ..\\ — climbing the directory tree",
			pattern: /\.\.\\/
		},
		{
			id: "shell-path-traversal-encoded",
			description: "URL-encoded path traversal: %2e%2e or %2f variants",
			pattern: /%2e%2e|%2f\.\.|\.\.%2f/i
		},
		{
			id: "shell-null-byte",
			description: "Null byte injection: \\x00 or %00 — truncates strings in C-backed functions",
			pattern: /\x00|%00/
		},
		{
			id: "shell-semicolon",
			description: "Semicolon command separator: cmd1; cmd2",
			pattern: /;/
		},
		{
			id: "shell-pipe",
			description: "Pipe operator: cmd1 | cmd2",
			pattern: /\|/
		},
		{
			id: "shell-and-operator",
			description: "AND operator: cmd1 && cmd2",
			pattern: /&&/
		},
		{
			id: "shell-or-operator",
			description: "OR operator: cmd1 || cmd2",
			pattern: /\|\|/
		},
		{
			id: "shell-backtick",
			description: "Backtick command substitution: `cmd`",
			pattern: /`/
		},
		{
			id: "shell-dollar-paren",
			description: "Dollar-paren command substitution: $(cmd)",
			pattern: /\$\(/
		},
		{
			id: "shell-dollar-brace",
			description: "Dollar-brace variable expansion: ${var} — can be abused for injection",
			pattern: /\$\{/
		},
		{
			id: "shell-redirect-out",
			description: "Output redirection: cmd > file or cmd >> file",
			pattern: />{1,2}/
		},
		{
			id: "shell-redirect-in",
			description: "Input redirection: cmd < file",
			pattern: /</
		},
		{
			id: "shell-newline-injection",
			description: "Newline injection: \\n or \\r — can inject new shell commands",
			pattern: /[\n\r]/
		},
		{
			id: "shell-glob-star",
			description: "Glob expansion: * or ? — can expand to unintended files",
			pattern: /[/\\][*?]/
		},
		{
			id: "shell-absolute-root",
			description: "Absolute root path injection: string starting with / or \\ (Windows UNC)",
			pattern: /^(?:\/|\\\\)/
		},
		{
			id: "shell-windows-drive",
			description: "Windows drive letter path injection: C:\\ or D:/",
			pattern: /^[a-zA-Z]:[/\\]/
		},
		{
			id: "shell-curl-wget",
			description: "curl/wget with URL or flags — can exfiltrate data or download payloads",
			pattern: /\b(?:curl|wget)\s+(?:https?:\/\/|ftp:\/\/|-)/i
		}
	];
	/**
	* REDOS context patterns.
	*
	* Detects strings that, if used as regular expressions, could cause
	* catastrophic backtracking (ReDoS — Regular Expression Denial of Service).
	*
	* These patterns detect the structural forms that lead to exponential or
	* polynomial backtracking in NFA-based regex engines (V8, PCRE, Java, etc.).
	*
	* Use this context when user-supplied strings will be compiled into RegExp objects.
	*/
	var REDOS_PATTERNS = [
		{
			id: "redos-nested-quantifier-plus",
			description: "Nested + quantifier inside a group with outer quantifier: (a+)+, (.+b)*, etc.",
			pattern: /\([^)]*\+[^)]*\)[+*]/
		},
		{
			id: "redos-nested-quantifier-star",
			description: "Nested * quantifier: (a*)* or (a*)+ — catastrophic backtracking",
			pattern: /\([^)]*\*[^)]*\)[*+]/
		},
		{
			id: "redos-nested-groups",
			description: "Doubly nested quantified groups: ((a+)+) — guaranteed catastrophic",
			pattern: /\(\([^)]{0,40}\)[+*]\)[+*]/
		},
		{
			id: "redos-alternation-overlap",
			description: "Overlapping alternation under quantifier: (a|a)+ — ambiguous NFA paths",
			pattern: /\(([^|()]{1,20})\|(?:\1)(?:\|[^|()]{1,20}){0,5}\)[+*?]{1,2}/
		},
		{
			id: "redos-star-plus-concat",
			description: "(x*x)+ pattern — triggers super-linear backtracking",
			pattern: /\([^)]{0,10}\*[^)]{0,10}\)[+*]/
		},
		{
			id: "redos-dot-star-greedy",
			description: "(.*){n,} or (.+){n,} — repeated greedy dot quantifiers",
			pattern: /\(\.[*+]\)\{?\d/
		},
		{
			id: "redos-large-repetition",
			description: "Very large fixed or range repetition count {1000,} or {1000,n} — denial of service via backtracking",
			pattern: /\{\d{4,}(?:,\d*)?\}/
		},
		{
			id: "redos-catastrophic-alternation",
			description: "Long alternation with many similar branches — polynomial backtracking risk",
			pattern: /\([^)]{0,200}(?:\|[^|)]{0,50}){9,}\)/
		}
	];
	var sep = "[\"'\\s]*:";
	var NOSQL_PATTERNS = [
		{
			id: "nosql-where-operator",
			description: "$where — executes arbitrary JavaScript server-side in MongoDB",
			pattern: new RegExp(`\\$where${sep}`, "i")
		},
		{
			id: "nosql-ne-operator",
			description: "$ne — \"not equal\" operator used to bypass equality checks",
			pattern: new RegExp(`\\$ne${sep}`, "i")
		},
		{
			id: "nosql-gt-operator",
			description: "$gt — \"greater than\" used to bypass password/value checks",
			pattern: new RegExp(`\\$gte?${sep}`, "i")
		},
		{
			id: "nosql-lt-operator",
			description: "$lt / $lte — \"less than\" bypass variants",
			pattern: new RegExp(`\\$lte?${sep}`, "i")
		},
		{
			id: "nosql-regex-operator",
			description: "$regex — can be used to extract data character by character (blind injection)",
			pattern: new RegExp(`\\$regex${sep}`, "i")
		},
		{
			id: "nosql-or-operator",
			description: "$or — logical OR; used to create always-true conditions",
			pattern: new RegExp(`\\$or${sep}\\s*\\[`, "i")
		},
		{
			id: "nosql-and-operator",
			description: "$and — logical AND operator injection",
			pattern: new RegExp(`\\$and${sep}\\s*\\[`, "i")
		},
		{
			id: "nosql-nor-operator",
			description: "$nor — logical NOR operator injection",
			pattern: new RegExp(`\\$nor${sep}\\s*\\[`, "i")
		},
		{
			id: "nosql-exists-operator",
			description: "$exists — can enumerate fields to determine schema",
			pattern: new RegExp(`\\$exists${sep}`, "i")
		},
		{
			id: "nosql-in-operator",
			description: "$in — matches any value in a list; can enumerate values",
			pattern: new RegExp(`\\$in${sep}\\s*\\[`, "i")
		},
		{
			id: "nosql-expr-operator",
			description: "$expr — allows aggregation expressions in queries (MongoDB 3.6+)",
			pattern: new RegExp(`\\$expr${sep}`, "i")
		},
		{
			id: "nosql-function-operator",
			description: "$function — executes arbitrary JavaScript in MongoDB 4.4+",
			pattern: new RegExp(`\\$function${sep}`, "i")
		},
		{
			id: "nosql-accumulator-operator",
			description: "$accumulator — custom aggregation with arbitrary JS execution",
			pattern: new RegExp(`\\$accumulator${sep}`, "i")
		},
		{
			id: "nosql-proto-pollution",
			description: "__proto__ — prototype pollution via object key injection",
			pattern: /__proto__/
		},
		{
			id: "nosql-constructor-prototype",
			description: "constructor.prototype — alternative prototype pollution vector (dot notation or JSON key)",
			pattern: /constructor[\s"':.,{\[]*prototype/i
		},
		{
			id: "nosql-proto-bracket",
			description: "[\"__proto__\"] — bracket-notation prototype pollution",
			pattern: /\[["']__proto__["']\]/
		}
	];
	/**
	* LOG context patterns.
	*
	* Detects injection vectors that are dangerous when a string is written
	* to a log file, passed to a logging framework, or interpolated into
	* a log message that will be parsed or displayed.
	*
	* Attack categories:
	*   1. CRLF injection — injects fake log lines by embedding newlines
	*   2. Log4Shell (CVE-2021-44228) — ${jndi:...} triggers JNDI lookup in Log4j
	*   3. SSTI in log templates — {{...}}, #{...} trigger template evaluation
	*      if the log message is passed through a template engine
	*   4. Null byte injection — truncates log entries in some implementations
	*   5. ANSI escape injection — manipulates terminal output when logs are
	*      tailed in a terminal (colour codes, cursor movement, etc.)
	*
	* Note: Newline characters (\n, \r) will produce false positives for
	* multi-line legitimate values. Use this context only for single-line
	* log field values (usernames, IDs, request parameters, etc.).
	*/
	var LOG_PATTERNS = [
		{
			id: "log-crlf-injection",
			description: "CRLF injection: literal \\r or \\n embeds fake log lines",
			pattern: /[\r\n]/
		},
		{
			id: "log-url-encoded-crlf",
			description: "URL-encoded CRLF: %0d, %0a, %0D, %0A — decoded by some log parsers",
			pattern: /%0[dDaA]/
		},
		{
			id: "log-unicode-newline",
			description: "Unicode newline variants: U+2028 (line separator), U+2029 (paragraph separator)",
			pattern: /[\u2028\u2029]/
		},
		{
			id: "log-log4shell-jndi",
			description: "Log4Shell: ${jndi:...} triggers remote code execution in Apache Log4j",
			pattern: /\$\{jndi\s*:/i
		},
		{
			id: "log-log4shell-obfuscated",
			description: "Obfuscated Log4Shell: ${::-j}... lookup-bypass prefix used to evade WAF detection",
			pattern: /\$\{::-/
		},
		{
			id: "log-log4j-lookup",
			description: "Log4j lookup syntax: ${env:...}, ${sys:...}, ${ctx:...} — data exfiltration",
			pattern: /\$\{(?:env|sys|ctx|main|map|sd|web|docker|k8s|spring)\s*:/i
		},
		{
			id: "log-ssti-double-brace",
			description: "SSTI double-brace: {{expression}} — Jinja2, Twig, Handlebars, etc.",
			pattern: /\{\{[\s\S]{0,80}\}\}/
		},
		{
			id: "log-ssti-hash-brace",
			description: "SSTI hash-brace: #{expression} — Thymeleaf, Velocity, Ruby ERB",
			pattern: /#\{[\s\S]{0,80}\}/
		},
		{
			id: "log-ssti-dollar-brace",
			description: "SSTI/EL injection: ${expression with operators or method calls} — JSP EL, Freemarker, SpEL",
			pattern: /\$\{[^}]*(?:\.|\(|\*|\+|\bclass\b|\bruntime\b|\bprocess\b|\bexec\b)[^}]{0,80}\}/i
		},
		{
			id: "log-ssti-percent-tag",
			description: "SSTI ERB/ASP tag: <%= expression %> — Ruby ERB, ASP",
			pattern: /<%=[\s\S]{0,80}%>/
		},
		{
			id: "log-null-byte",
			description: "Null byte: \\x00 or %00 — can truncate log entries in C-backed loggers",
			pattern: /\x00|%00/
		},
		{
			id: "log-ansi-escape",
			description: "ANSI escape sequence: ESC[ — can manipulate terminal output when logs are tailed",
			pattern: /\x1b\[/
		}
	];
	/**
	* SQL-STRICT context patterns.
	*
	* Extends the base 'SQL' context with three additional rules that are
	* effective at detecting real injections but carry a higher false-positive
	* risk on general free-text input.
	*
	* Use 'SQL-STRICT' when:
	*   - The string is specifically a SQL fragment or database identifier
	*   - You control the input domain (e.g. a dedicated SQL search field)
	*   - You can tolerate occasional false positives in exchange for broader coverage
	*
	* Use 'SQL' (not STRICT) when:
	*   - The field is general user text (names, descriptions, comments)
	*   - False positives would block legitimate content (e.g. "see note -- above")
	*
	* Rules moved here from 'SQL' due to false-positive risk:
	*
	*   sql-line-comment   — "--" fires on "see note -- above", "value--", CSS var(--primary)
	*   sql-stacked-query  — "; SELECT" fires on legitimate prose with semicolons + SQL words
	*   sql-hex-encoding   — "0xDEAD" fires on hex values in technical docs and log output
	*/
	var SQL_STRICT_EXTRA = [
		{
			id: "sql-line-comment",
			description: "SQL line comment: -- followed by whitespace or end of string",
			pattern: /--(?:\s|$)/
		},
		{
			id: "sql-stacked-query",
			description: "Stacked queries: semicolon immediately followed by a SQL keyword",
			pattern: /;\s{0,10}(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b/i
		},
		{
			id: "sql-hex-encoding",
			description: "Hex-encoded string injection: 0x41414141 style (MySQL)",
			pattern: /\b0x[0-9a-f]{4,}/i
		}
	];
	var SQL_STRICT_PATTERNS = [...SQL_PATTERNS, ...SQL_STRICT_EXTRA];
	/**
	* Decode the HTML character references that matter for markup-context
	* detection.
	*
	* Browsers decode character references in attribute values before they
	* interpret a URL, so `javascript&#58;alert(1)` in an href is the
	* `javascript:` scheme. The HTML/XML/SVG rules match literal characters, so
	* without this step such payloads slip through.
	*
	* Deliberately NOT a full entity decoder. It decodes only:
	*   - decimal refs  &#58;  &#058;  &#00000058;  &#58   (any leading zeros,
	*                   trailing ; optional — browsers accept both)
	*   - hex refs      &#x3a; &#X3A; &#x0000003a; &#x3a   (same)
	*   - named refs    &colon;  &Tab;  &NewLine;
	*       Named refs are CASE-SENSITIVE and REQUIRE the trailing ';', exactly
	*       like a browser (so `&COLON;` and `&colon` are not decoded).
	*       &Tab; / &NewLine; matter because the URL parser strips tab/newline,
	*       so `java&Tab;script:` is still a javascript: URL.
	*
	* It does NOT decode &amp; (single pass only), so double-encoded text such as
	* "&amp;lt;script&amp;gt;" stays literal — a browser renders that as text.
	*
	* All quantifiers are bounded; no ReDoS risk.
	*
	* @param {string} input
	* @returns {string}
	*/
	var NAMED = Object.freeze({
		colon: ":",
		Tab: "	",
		NewLine: "\n"
	});
	var ENTITY_RE = /&(?:#[xX]0*([0-9a-fA-F]{1,6});?|#0*([0-9]{1,7});?|([a-zA-Z][a-zA-Z0-9]{1,15});)/g;
	function decodeEntities(input) {
		if (input.indexOf("&") === -1) return input;
		return input.replace(ENTITY_RE, (match, hex, dec, name) => {
			if (name !== void 0) return Object.prototype.hasOwnProperty.call(NAMED, name) ? NAMED[name] : match;
			const cp = hex !== void 0 ? parseInt(hex, 16) : parseInt(dec, 10);
			if (!Number.isFinite(cp) || cp > 1114111) return match;
			return String.fromCodePoint(cp);
		});
	}
	HTML_PATTERNS.label = "HTML";
	XML_PATTERNS.label = "XML";
	SVG_PATTERNS.label = "SVG";
	HTML_PATTERNS.decodeEntities = true;
	XML_PATTERNS.decodeEntities = true;
	SVG_PATTERNS.decodeEntities = true;
	SQL_PATTERNS.label = "SQL";
	SQL_STRICT_PATTERNS.label = "SQL-STRICT";
	SHELL_PATTERNS.label = "SHELL";
	REDOS_PATTERNS.label = "REDOS";
	NOSQL_PATTERNS.label = "NOSQL";
	LOG_PATTERNS.label = "LOG";
	Object.freeze({
		HTML: HTML_PATTERNS,
		XML: XML_PATTERNS,
		SVG: SVG_PATTERNS,
		SQL: SQL_PATTERNS,
		"SQL-STRICT": SQL_STRICT_PATTERNS,
		SHELL: SHELL_PATTERNS,
		REDOS: REDOS_PATTERNS,
		NOSQL: NOSQL_PATTERNS,
		LOG: LOG_PATTERNS
	});
	/**
	* @typedef {{ id: string, description: string, pattern: RegExp }} Rule
	*/
	/**
	* @typedef {Rule[]} PatternList
	*/
	/**
	* @typedef {Object} MatchResult
	* @property {string} context     - Label identifying which context matched ('HTML', 'CUSTOM', etc.)
	* @property {string} id          - Rule identifier
	* @property {string} description - Human-readable description of what was matched
	* @property {RegExp} pattern     - The pattern that matched
	*/
	/**
	* @param {unknown} value
	*/
	function assertString(value) {
		if (typeof value !== "string") throw new TypeError(`is-unsafe: first argument must be a string, got ${typeof value}`);
	}
	/**
	* @param {unknown} context
	*/
	function assertContext(context) {
		if (context instanceof RegExp) return;
		if (Array.isArray(context)) {
			if (context.length === 0) throw new TypeError("is-unsafe: context must not be an empty array");
			if (Array.isArray(context[0])) {
				for (const list of context) if (!Array.isArray(list) || list.length === 0) throw new TypeError("is-unsafe: each context in the array must be a non-empty pattern array (PatternList)");
			}
			return;
		}
		throw new TypeError(`is-unsafe: second argument must be a PatternList (e.g. HTML), an array of PatternLists (e.g. [HTML, XML]), or a RegExp. Got: ${typeof context}`);
	}
	/**
	* Normalise any valid context arg into an array of PatternLists.
	*
	* @param {Rule[]|Rule[][]|RegExp} context
	* @returns {{ lists: Rule[][]|null, regex: RegExp|null }}
	*/
	function normalise(context) {
		if (context instanceof RegExp) return {
			lists: null,
			regex: context
		};
		if (Array.isArray(context[0])) return {
			lists: context,
			regex: null
		};
		return {
			lists: [context],
			regex: null
		};
	}
	/**
	* For markup contexts, return an entity-decoded copy of `value` to test
	* alongside the raw input, or null when there is nothing extra to test.
	*
	* @param {string} value
	* @param {Rule[]} list
	* @returns {string|null}
	*/
	function decodedCopy(value, list) {
		if (!list.decodeEntities) return null;
		const decoded = decodeEntities(value);
		return decoded === value ? null : decoded;
	}
	/**
	* Test value against a single PatternList. Returns the first MatchResult or null.
	*
	* @param {string} value
	* @param {Rule[]} list
	* @returns {MatchResult|null}
	*/
	function matchList(value, list) {
		const label = list.label ?? "CUSTOM";
		const decoded = decodedCopy(value, list);
		for (const rule of list) if (rule.pattern.test(value) || decoded !== null && rule.pattern.test(decoded)) return {
			context: label,
			id: rule.id,
			description: rule.description,
			pattern: rule.pattern
		};
		return null;
	}
	/**
	* Returns `true` if `value` is unsafe in the given context(s), `false` otherwise.
	*
	* @param {string} value - The string to test
	* @param {PatternList | PatternList[] | RegExp} context
	*   - A PatternList imported from is-unsafe (e.g. `HTML`, `XML`)
	*   - An array of PatternLists — returns true if unsafe in **any** of them
	*   - A custom RegExp — returns true if the pattern matches
	* @returns {boolean}
	*
	* @example
	* import { isUnsafe, HTML, SQL } from 'is-unsafe';
	*
	* isUnsafe('<script>alert(1)<\/script>', HTML)       // true
	* isUnsafe('hello world', HTML)                     // false
	* isUnsafe('value', [HTML, SQL])                    // false
	* isUnsafe('value', /my-pattern/i)                  // false
	*/
	function isUnsafe(value, context) {
		assertString(value);
		assertContext(context);
		const { lists, regex } = normalise(context);
		if (regex) return regex.test(value);
		for (const list of lists) if (matchList(value, list) !== null) return true;
		return false;
	}
	/**
	* Extract raw attributes (without prefix) from prefixed attribute map
	* @param {object} prefixedAttrs - Attributes with prefix from buildAttributesMap
	* @param {object} options - Parser options containing attributeNamePrefix
	* @returns {object} Raw attributes for matcher
	*/
	function extractRawAttributes(prefixedAttrs, options) {
		if (!prefixedAttrs) return {};
		const attrs = options.attributesGroupName ? prefixedAttrs[options.attributesGroupName] : prefixedAttrs;
		if (!attrs) return {};
		const rawAttrs = {};
		for (const key in attrs) if (key.startsWith(options.attributeNamePrefix)) {
			const rawName = key.substring(options.attributeNamePrefix.length);
			rawAttrs[rawName] = attrs[key];
		} else rawAttrs[key] = attrs[key];
		return rawAttrs;
	}
	/**
	* Extract namespace from raw tag name
	* @param {string} rawTagName - Tag name possibly with namespace (e.g., "soap:Envelope")
	* @returns {string|undefined} Namespace or undefined
	*/
	function extractNamespace(rawTagName) {
		if (!rawTagName || typeof rawTagName !== "string") return void 0;
		const colonIndex = rawTagName.indexOf(":");
		if (colonIndex !== -1 && colonIndex > 0) {
			const ns = rawTagName.substring(0, colonIndex);
			if (ns !== "xmlns") return ns;
		}
	}
	var OrderedObjParser = class {
		constructor(options, externalEntities) {
			this.options = options;
			this.currentNode = null;
			this.tagsNodeStack = [];
			this.parseXml = parseXml;
			this.parseTextData = parseTextData;
			this.resolveNameSpace = resolveNameSpace;
			this.buildAttributesMap = buildAttributesMap;
			this.isItStopNode = isItStopNode;
			this.replaceEntitiesValue = replaceEntitiesValue;
			this.readStopNodeData = readStopNodeData;
			this.saveTextToParentTag = saveTextToParentTag;
			this.addChild = addChild;
			this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
			this.entityExpansionCount = 0;
			this.currentExpandedLength = 0;
			this.doctypefound = false;
			let namedEntities = { ...XML };
			if (this.options.entityDecoder) this.entityDecoder = this.options.entityDecoder;
			else {
				if (typeof this.options.htmlEntities === "object") namedEntities = this.options.htmlEntities;
				else if (this.options.htmlEntities === true) namedEntities = {
					...COMMON_HTML,
					...CURRENCY
				};
				this.entityDecoder = new EntityDecoder({
					namedEntities: {
						...namedEntities,
						...externalEntities
					},
					numericAllowed: this.options.htmlEntities,
					limit: {
						maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
						maxExpandedLength: this.options.processEntities.maxExpandedLength,
						applyLimitsTo: this.options.processEntities.appliesTo
					},
					onInputEntity: (name, value) => isUnsafe(value, [HTML_PATTERNS, XML_PATTERNS]) ? ENTITY_ACTION.BLOCK : ENTITY_ACTION.ALLOW
				});
			}
			this.matcher = new Matcher();
			this.readonlyMatcher = this.matcher.readOnly();
			this.isCurrentNodeStopNode = false;
			this.stopNodeExpressionsSet = new ExpressionSet();
			const stopNodesOpts = this.options.stopNodes;
			if (stopNodesOpts && stopNodesOpts.length > 0) {
				for (let i = 0; i < stopNodesOpts.length; i++) {
					const stopNodeExp = stopNodesOpts[i];
					if (typeof stopNodeExp === "string") this.stopNodeExpressionsSet.add(new Expression(stopNodeExp));
					else if (stopNodeExp instanceof Expression) this.stopNodeExpressionsSet.add(stopNodeExp);
				}
				this.stopNodeExpressionsSet.seal();
			}
		}
	};
	/**
	* @param {string} val
	* @param {string} tagName
	* @param {string|Matcher} jPath - jPath string or Matcher instance based on options.jPath
	* @param {boolean} dontTrim
	* @param {boolean} hasAttributes
	* @param {boolean} isLeafNode
	* @param {boolean} escapeEntities
	*/
	function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
		const options = this.options;
		if (val !== void 0) {
			if (options.trimValues && !dontTrim) val = val.trim();
			if (val.length > 0) {
				if (!escapeEntities) val = this.replaceEntitiesValue(val, tagName, jPath);
				const jPathOrMatcher = options.jPath ? jPath.toString() : jPath;
				const newval = options.tagValueProcessor(tagName, val, jPathOrMatcher, hasAttributes, isLeafNode);
				if (newval === null || newval === void 0) return val;
				else if (typeof newval !== typeof val || newval !== val) return newval;
				else if (options.trimValues) return parseValue(val, options.parseTagValue, options.numberParseOptions);
				else if (val.trim() === val) return parseValue(val, options.parseTagValue, options.numberParseOptions);
				else return val;
			}
		}
	}
	function resolveNameSpace(tagname) {
		if (this.options.removeNSPrefix) {
			const tags = tagname.split(":");
			const prefix = tagname.charAt(0) === "/" ? "/" : "";
			if (tags[0] === "xmlns") return "";
			if (tags.length === 2) tagname = prefix + tags[1];
		}
		return tagname;
	}
	var attrsRegx = /([^\s=]+)\s*(=\s*(?:"([^"]*)"|'([^']*)'))?/gm;
	function attrValue(match) {
		return match[3] !== void 0 ? match[3] : match[4];
	}
	function buildAttributesMap(attrStr, jPath, tagName, force = false) {
		const options = this.options;
		if (force === true || options.ignoreAttributes !== true && typeof attrStr === "string") {
			const matches = getAllMatches(attrStr, attrsRegx);
			const len = matches.length;
			const attrs = {};
			const processedVals = new Array(len);
			let hasRawAttrs = false;
			const rawAttrsForMatcher = {};
			for (let i = 0; i < len; i++) {
				const attrName = this.resolveNameSpace(matches[i][1]);
				const oldVal = attrValue(matches[i]);
				if (attrName.length && oldVal !== void 0) {
					let val = oldVal;
					if (options.trimValues) val = val.trim();
					val = this.replaceEntitiesValue(val, tagName, this.readonlyMatcher);
					processedVals[i] = val;
					rawAttrsForMatcher[attrName] = val;
					hasRawAttrs = true;
				}
			}
			if (hasRawAttrs && typeof jPath === "object" && jPath.updateCurrent) jPath.updateCurrent(rawAttrsForMatcher);
			const jPathStr = options.jPath ? jPath.toString() : this.readonlyMatcher;
			let hasAttrs = false;
			for (let i = 0; i < len; i++) {
				const attrName = this.resolveNameSpace(matches[i][1]);
				if (this.ignoreAttributesFn(attrName, jPathStr)) continue;
				let aName = options.attributeNamePrefix + attrName;
				if (attrName.length) {
					if (options.transformAttributeName) aName = options.transformAttributeName(aName);
					aName = sanitizeName(aName, options);
					if (attrValue(matches[i]) !== void 0) {
						const oldVal = processedVals[i];
						const newVal = options.attributeValueProcessor(attrName, oldVal, jPathStr);
						if (newVal === null || newVal === void 0) attrs[aName] = oldVal;
						else if (typeof newVal !== typeof oldVal || newVal !== oldVal) attrs[aName] = newVal;
						else attrs[aName] = parseValue(oldVal, options.parseAttributeValue, options.numberParseOptions);
						hasAttrs = true;
					} else if (options.allowBooleanAttributes) {
						attrs[aName] = true;
						hasAttrs = true;
					}
				}
			}
			if (!hasAttrs) return;
			if (options.attributesGroupName && !options.preserveOrder) {
				const attrCollection = {};
				attrCollection[options.attributesGroupName] = attrs;
				return attrCollection;
			}
			return attrs;
		}
	}
	var parseXml = function(xmlData) {
		const options = this.options;
		const crlfPositions = options.captureMetaData ? [] : void 0;
		xmlData = xmlData.replace(/\r\n?/g, options.captureMetaData ? (newline, index) => {
			if (newline.length === 2) crlfPositions.push(index - crlfPositions.length);
			return "\n";
		} : "\n");
		const xmlObj = new XmlNode("!xml");
		let currentNode = xmlObj;
		let textData = "";
		this.matcher.reset();
		this.entityDecoder.reset();
		this.entityExpansionCount = 0;
		this.currentExpandedLength = 0;
		this.doctypefound = false;
		const docTypeReader = new DocTypeReader(options.processEntities);
		const xmlLen = xmlData.length;
		for (let i = 0; i < xmlLen; i++) if (xmlData[i] === "<") {
			const c1 = xmlData.charCodeAt(i + 1);
			if (c1 === 47) {
				const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
				let tagName = xmlData.substring(i + 2, closeIndex).trim();
				if (options.removeNSPrefix) {
					const colonIndex = tagName.indexOf(":");
					if (colonIndex !== -1) tagName = tagName.substr(colonIndex + 1);
				}
				tagName = transformTagName(options.transformTagName, tagName, "", options).tagName;
				if (currentNode) textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
				const lastTagName = this.matcher.getCurrentTag();
				if (tagName && options.unpairedTagsSet.has(tagName)) throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
				if (lastTagName && options.unpairedTagsSet.has(lastTagName)) {
					this.matcher.pop();
					this.tagsNodeStack.pop();
				}
				this.matcher.pop();
				this.isCurrentNodeStopNode = false;
				currentNode = this.tagsNodeStack.pop() || xmlObj;
				if (options.captureMetaData && currentNode) currentNode.addEndIndex(getOriginalIndex(closeIndex + 1, crlfPositions));
				textData = "";
				i = closeIndex;
			} else if (c1 === 63) {
				let tagData = readTagExp(xmlData, i, false, "?>");
				if (!tagData) throw new Error("Pi Tag is not closed.");
				textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
				const attsMap = this.buildAttributesMap(tagData.tagExp, this.matcher, tagData.tagName, true);
				if (attsMap) {
					const ver = attsMap[this.options.attributeNamePrefix + "version"];
					this.entityDecoder.setXmlVersion(Number(ver) || 1);
					docTypeReader.setXmlVersion(Number(ver) || 1);
				}
				if (options.ignoreDeclaration && tagData.tagName === "?xml" || options.ignorePiTags) {} else {
					const childNode = new XmlNode(tagData.tagName);
					childNode.add(options.textNodeName, "");
					if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent && options.ignoreAttributes !== true) childNode[":@"] = attsMap;
					const startIndex = options.captureMetaData ? getOriginalIndex(i, crlfPositions) : i;
					this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
					if (options.captureMetaData) currentNode.addEndIndex(getOriginalIndex(tagData.closeIndex + 2, crlfPositions));
				}
				i = tagData.closeIndex + 1;
			} else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 45 && xmlData.charCodeAt(i + 3) === 45) {
				const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
				if (options.commentPropName) {
					const comment = xmlData.substring(i + 4, endIndex - 2);
					textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
					currentNode.add(options.commentPropName, [{ [options.textNodeName]: comment }]);
				}
				i = endIndex;
			} else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 68) {
				if (this.doctypefound) throw new Error("Multiple DOCTYPE declarations found.");
				this.doctypefound = true;
				const result = docTypeReader.readDocType(xmlData, i);
				this.entityDecoder.addInputEntities(result.entities);
				i = result.i;
			} else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 91) {
				const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
				const tagExp = xmlData.substring(i + 9, closeIndex);
				textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
				let val = this.parseTextData(tagExp, currentNode.tagname, this.readonlyMatcher, true, false, true, true);
				if (val == void 0) val = "";
				if (options.cdataPropName) currentNode.add(options.cdataPropName, [{ [options.textNodeName]: tagExp }]);
				else currentNode.add(options.textNodeName, val);
				i = closeIndex + 2;
			} else {
				let result = readTagExp(xmlData, i, options.removeNSPrefix);
				if (!result) {
					const context = xmlData.substring(Math.max(0, i - 50), Math.min(xmlLen, i + 50));
					throw new Error(`readTagExp returned undefined at position ${i}. Context: "${context}"`);
				}
				let tagName = result.tagName;
				const rawTagName = result.rawTagName;
				let tagExp = result.tagExp;
				let attrExpPresent = result.attrExpPresent;
				let closeIndex = result.closeIndex;
				({tagName, tagExp} = transformTagName(options.transformTagName, tagName, tagExp, options));
				if (options.strictReservedNames && (tagName === options.commentPropName || tagName === options.cdataPropName || tagName === options.textNodeName || tagName === options.attributesGroupName)) throw new Error(`Invalid tag name: ${tagName}`);
				if (currentNode && textData) {
					if (currentNode.tagname !== "!xml") textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher, false);
				}
				const lastTag = currentNode;
				if (lastTag && options.unpairedTagsSet.has(lastTag.tagname)) {
					currentNode = this.tagsNodeStack.pop();
					this.matcher.pop();
				}
				let isSelfClosing = false;
				if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
					isSelfClosing = true;
					if (tagName[tagName.length - 1] === "/") {
						tagName = tagName.substr(0, tagName.length - 1);
						tagExp = tagName;
					} else tagExp = tagExp.substr(0, tagExp.length - 1);
					attrExpPresent = tagName !== tagExp;
				}
				let prefixedAttrs = null;
				let namespace = void 0;
				namespace = extractNamespace(rawTagName);
				if (tagName !== xmlObj.tagname) this.matcher.push(tagName, {}, namespace);
				if (tagName !== tagExp && attrExpPresent) {
					prefixedAttrs = this.buildAttributesMap(tagExp, this.matcher, tagName);
					if (prefixedAttrs) extractRawAttributes(prefixedAttrs, options);
				}
				if (tagName !== xmlObj.tagname) this.isCurrentNodeStopNode = this.isItStopNode();
				const startIndex = options.captureMetaData ? getOriginalIndex(i, crlfPositions) : i;
				if (this.isCurrentNodeStopNode) {
					let tagContent = "";
					if (isSelfClosing) i = result.closeIndex;
					else if (options.unpairedTagsSet.has(tagName)) i = result.closeIndex;
					else {
						const result = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
						if (!result) throw new Error(`Unexpected end of ${rawTagName}`);
						i = result.i;
						tagContent = result.tagContent;
					}
					const childNode = new XmlNode(tagName);
					if (prefixedAttrs) childNode[":@"] = prefixedAttrs;
					childNode.add(options.textNodeName, tagContent);
					this.matcher.pop();
					this.isCurrentNodeStopNode = false;
					this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
					if (options.captureMetaData) currentNode.addEndIndex(getOriginalIndex(i + 1, crlfPositions));
				} else {
					if (isSelfClosing) {
						({tagName, tagExp} = transformTagName(options.transformTagName, tagName, tagExp, options));
						const childNode = new XmlNode(tagName);
						if (prefixedAttrs) childNode[":@"] = prefixedAttrs;
						this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
						if (options.captureMetaData) currentNode.addEndIndex(getOriginalIndex(closeIndex + 1, crlfPositions));
						this.matcher.pop();
						this.isCurrentNodeStopNode = false;
					} else if (options.unpairedTagsSet.has(tagName)) {
						const childNode = new XmlNode(tagName);
						if (prefixedAttrs) childNode[":@"] = prefixedAttrs;
						this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
						if (options.captureMetaData) currentNode.addEndIndex(getOriginalIndex(result.closeIndex + 1, crlfPositions));
						this.matcher.pop();
						this.isCurrentNodeStopNode = false;
						i = result.closeIndex;
						continue;
					} else {
						const childNode = new XmlNode(tagName);
						if (this.tagsNodeStack.length > options.maxNestedTags) throw new Error("Maximum nested tags exceeded");
						this.tagsNodeStack.push(currentNode);
						if (prefixedAttrs) childNode[":@"] = prefixedAttrs;
						this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
						currentNode = childNode;
					}
					textData = "";
					i = closeIndex;
				}
			}
		} else textData += xmlData[i];
		return xmlObj.child;
	};
	function getOriginalIndex(index, crlfPositions) {
		let low = 0;
		let high = crlfPositions.length;
		while (low < high) {
			const middle = Math.floor((low + high) / 2);
			if (crlfPositions[middle] < index) low = middle + 1;
			else high = middle;
		}
		return index + low;
	}
	function addChild(currentNode, childNode, matcher, startIndex) {
		if (!this.options.captureMetaData) startIndex = void 0;
		const jPathOrMatcher = this.options.jPath ? matcher.toString() : matcher;
		const result = this.options.updateTag(childNode.tagname, jPathOrMatcher, childNode[":@"]);
		if (result === false) {} else if (typeof result === "string") {
			childNode.tagname = result;
			currentNode.addChild(childNode, startIndex);
		} else currentNode.addChild(childNode, startIndex);
	}
	/**
	* @param {object} val - Entity object with regex and val properties
	* @param {string} tagName - Tag name
	* @param {string|Matcher} jPath - jPath string or Matcher instance based on options.jPath
	*/
	function replaceEntitiesValue(val, tagName, jPath) {
		const entityConfig = this.options.processEntities;
		if (!entityConfig || !entityConfig.enabled) return val;
		if (entityConfig.allowedTags) {
			const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
			if (!(Array.isArray(entityConfig.allowedTags) ? entityConfig.allowedTags.includes(tagName) : entityConfig.allowedTags(tagName, jPathOrMatcher))) return val;
		}
		if (entityConfig.tagFilter) {
			const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
			if (!entityConfig.tagFilter(tagName, jPathOrMatcher)) return val;
		}
		return this.entityDecoder.decode(val);
	}
	function saveTextToParentTag(textData, parentNode, matcher, isLeafNode) {
		if (textData) {
			if (isLeafNode === void 0) isLeafNode = parentNode.child.length === 0;
			textData = this.parseTextData(textData, parentNode.tagname, matcher, false, parentNode[":@"] ? Object.keys(parentNode[":@"]).length !== 0 : false, isLeafNode);
			if (textData !== void 0 && textData !== "") parentNode.add(this.options.textNodeName, textData);
			textData = "";
		}
		return textData;
	}
	/**
	* @param {Array<Expression>} stopNodeExpressions - Array of compiled Expression objects
	* @param {Matcher} matcher - Current path matcher
	*/
	function isItStopNode() {
		if (this.stopNodeExpressionsSet.size === 0) return false;
		return this.matcher.matchesAny(this.stopNodeExpressionsSet);
	}
	/**
	* Returns the tag Expression and where it is ending handling single-double quotes situation
	* @param {string} xmlData 
	* @param {number} i starting index
	* @returns 
	*/
	function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
		const len = xmlData.length;
		const closeCode0 = closingChar.charCodeAt(0);
		const closeCode1 = closingChar.length > 1 ? closingChar.charCodeAt(1) : -1;
		let result = "";
		let segmentStart = i;
		for (let index = i; index < len; index++) {
			const code = xmlData.charCodeAt(index);
			if (code === 34 || code === 39) {
				index = xmlData.indexOf(xmlData[index], index + 1);
				if (index === -1) return;
			} else if (code === closeCode0) {
				if (closeCode1 !== -1) {
					if (xmlData.charCodeAt(index + 1) === closeCode1) {
						result += xmlData.substring(segmentStart, index);
						return {
							data: result,
							index
						};
					}
				} else {
					result += xmlData.substring(segmentStart, index);
					return {
						data: result,
						index
					};
				}
			} else if (code === 9) {
				result += xmlData.substring(segmentStart, index) + " ";
				segmentStart = index + 1;
			}
		}
	}
	function findClosingIndex(xmlData, str, i, errMsg) {
		const closingIndex = xmlData.indexOf(str, i);
		if (closingIndex === -1) throw new Error(errMsg);
		else return closingIndex + str.length - 1;
	}
	function findClosingChar(xmlData, char, i, errMsg) {
		const closingIndex = xmlData.indexOf(char, i);
		if (closingIndex === -1) throw new Error(errMsg);
		return closingIndex;
	}
	function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
		const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
		if (!result) return;
		let tagExp = result.data;
		const closeIndex = result.index;
		const separatorIndex = tagExp.search(/\s/);
		let tagName = tagExp;
		let attrExpPresent = true;
		if (separatorIndex !== -1) {
			tagName = tagExp.substring(0, separatorIndex);
			tagExp = tagExp.substring(separatorIndex + 1).trimStart();
		}
		const rawTagName = tagName;
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
			attrExpPresent,
			rawTagName
		};
	}
	/**
	* find paired tag for a stop node
	* @param {string} xmlData 
	* @param {string} tagName 
	* @param {number} i 
	*/
	function readStopNodeData(xmlData, tagName, i) {
		const startIndex = i;
		let openTagCount = 1;
		let lenient = false;
		let nextGt = -1;
		const xmllen = xmlData.length;
		for (; i < xmllen; i++) if (xmlData[i] === "<") {
			const c1 = xmlData.charCodeAt(i + 1);
			if (c1 === 47) {
				const closeIndex = findClosingChar(xmlData, ">", i, `${tagName} is not closed`);
				if (xmlData.substring(i + 2, closeIndex).trim() === tagName) {
					openTagCount--;
					if (openTagCount === 0) return {
						tagContent: xmlData.substring(startIndex, i),
						i: closeIndex
					};
				}
				i = closeIndex;
			} else if (c1 === 63) i = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
			else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 45 && xmlData.charCodeAt(i + 3) === 45) i = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
			else if (c1 === 33 && xmlData.charCodeAt(i + 2) === 91) i = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
			else {
				const tagData = lenient ? void 0 : readTagExp(xmlData, i, false);
				if (tagData) {
					if (tagData.tagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") openTagCount++;
					i = tagData.closeIndex;
				} else {
					lenient = true;
					if (nextGt < i) {
						nextGt = xmlData.indexOf(">", i);
						if (nextGt === -1) return;
					}
					const nextLt = xmlData.indexOf("<", i + 1);
					if (nextLt === -1 || nextLt > nextGt) {
						const exp = xmlData.substring(i + 1, nextGt);
						const sep = exp.search(/\s/);
						if ((sep === -1 ? exp : exp.substring(0, sep)) === tagName && exp[exp.length - 1] !== "/") openTagCount++;
						i = nextGt;
					}
				}
			}
		}
	}
	function parseValue(val, shouldParse, options) {
		if (shouldParse && typeof val === "string") {
			const newval = val.trim();
			if (newval === "true") return true;
			else if (newval === "false") return false;
			else return toNumber(val, options);
		} else if (isExist(val)) return val;
		else return "";
	}
	function transformTagName(fn, tagName, tagExp, options) {
		if (fn) {
			const newTagName = fn(tagName);
			if (tagExp === tagName) tagExp = newTagName;
			tagName = newTagName;
		}
		tagName = sanitizeName(tagName, options);
		return {
			tagName,
			tagExp
		};
	}
	function sanitizeName(name, options) {
		if (criticalProperties.includes(name)) throw new Error(`[SECURITY] Invalid name: "${name}" is a reserved JavaScript keyword that could cause prototype pollution`);
		else if (DANGEROUS_PROPERTY_NAMES.includes(name)) return options.onDangerousProperty(name);
		return name;
	}
	var METADATA_SYMBOL = XmlNode.getMetaDataSymbol();
	/**
	* Helper function to strip attribute prefix from attribute map
	* @param {object} attrs - Attributes with prefix (e.g., {"@_class": "code"})
	* @param {string} prefix - Attribute prefix to remove (e.g., "@_")
	* @returns {object} Attributes without prefix (e.g., {"class": "code"})
	*/
	function stripAttributePrefix(attrs, prefix) {
		if (!attrs || typeof attrs !== "object") return {};
		if (!prefix) return attrs;
		const rawAttrs = {};
		for (const key in attrs) if (key.startsWith(prefix)) {
			const rawName = key.substring(prefix.length);
			rawAttrs[rawName] = attrs[key];
		} else rawAttrs[key] = attrs[key];
		return rawAttrs;
	}
	/**
	* 
	* @param {array} node 
	* @param {any} options 
	* @param {Matcher} matcher - Path matcher instance
	* @returns 
	*/
	function prettify(node, options, matcher, readonlyMatcher) {
		return compress(node, options, matcher, readonlyMatcher);
	}
	/**
	* @param {array} arr 
	* @param {object} options 
	* @param {Matcher} matcher - Path matcher instance
	* @returns object
	*/
	function compress(arr, options, matcher, readonlyMatcher) {
		let text;
		const compressedObj = {};
		for (let i = 0; i < arr.length; i++) {
			const tagObj = arr[i];
			const property = propName(tagObj);
			if (property !== void 0 && property !== options.textNodeName) {
				const rawAttrs = stripAttributePrefix(tagObj[":@"] || {}, options.attributeNamePrefix);
				matcher.push(property, rawAttrs);
			}
			if (property === options.textNodeName) {
				if (text === void 0) text = tagObj[property];
				else text += "" + tagObj[property];
			} else if (property === void 0) continue;
			else if (tagObj[property]) {
				let val = compress(tagObj[property], options, matcher, readonlyMatcher);
				const isLeaf = isLeafTag(val, options);
				if (Object.keys(val).length === 0 && options.alwaysCreateTextNode) val[options.textNodeName] = "";
				if (tagObj[":@"]) assignAttributes(val, tagObj[":@"], readonlyMatcher, options);
				else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) val = val[options.textNodeName];
				else if (Object.keys(val).length === 0) {
					if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
					else val = "";
				}
				if (tagObj[METADATA_SYMBOL] !== void 0 && typeof val === "object" && val !== null) val[METADATA_SYMBOL] = tagObj[METADATA_SYMBOL];
				if (compressedObj[property] !== void 0 && Object.prototype.hasOwnProperty.call(compressedObj, property)) {
					if (!Array.isArray(compressedObj[property])) compressedObj[property] = [compressedObj[property]];
					compressedObj[property].push(val);
				} else {
					const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() : readonlyMatcher;
					if (options.isArray(property, jPathOrMatcher, isLeaf)) compressedObj[property] = [val];
					else compressedObj[property] = val;
				}
				if (property !== void 0 && property !== options.textNodeName) matcher.pop();
			}
		}
		if (typeof text === "string") {
			if (text.length > 0) compressedObj[options.textNodeName] = text;
		} else if (text !== void 0) compressedObj[options.textNodeName] = text;
		return compressedObj;
	}
	function propName(obj) {
		const keys = Object.keys(obj);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (key !== ":@") return key;
		}
	}
	function assignAttributes(obj, attrMap, readonlyMatcher, options) {
		if (attrMap) {
			const keys = Object.keys(attrMap);
			const len = keys.length;
			for (let i = 0; i < len; i++) {
				const atrrName = keys[i];
				const rawAttrName = atrrName.startsWith(options.attributeNamePrefix) ? atrrName.substring(options.attributeNamePrefix.length) : atrrName;
				const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() + "." + rawAttrName : readonlyMatcher;
				if (options.isArray(atrrName, jPathOrMatcher, true, true)) obj[atrrName] = [attrMap[atrrName]];
				else obj[atrrName] = attrMap[atrrName];
			}
		}
	}
	function isLeafTag(obj, options) {
		const { textNodeName } = options;
		const propCount = Object.keys(obj).length;
		if (propCount === 0) return true;
		if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) return true;
		return false;
	}
	var XMLParser = class {
		constructor(options) {
			this.externalEntities = {};
			this.options = buildOptions(options);
		}
		/**
		* Parse XML dats to JS object 
		* @param {string|Uint8Array} xmlData 
		* @param {boolean|Object} validationOption 
		*/
		parse(xmlData, validationOption) {
			if (typeof xmlData !== "string" && xmlData.toString) {
				if (xmlData instanceof Uint8Array && !(typeof Buffer !== "undefined" && Buffer.isBuffer(xmlData))) xmlData = new TextDecoder("utf-8", { ignoreBOM: true }).decode(xmlData);
				else xmlData = xmlData.toString();
			} else if (typeof xmlData !== "string") throw new Error("XML data is accepted in String or Bytes[] form.");
			if (validationOption) {
				if (validationOption === true) validationOption = {};
				const result = validate(xmlData, validationOption);
				if (result !== true) throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
			}
			const orderedObjParser = new OrderedObjParser(this.options, this.externalEntities);
			const orderedResult = orderedObjParser.parseXml(xmlData);
			if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
			else return prettify(orderedResult, this.options, orderedObjParser.matcher, orderedObjParser.readonlyMatcher);
		}
		/**
		* Add Entity which is not by default supported by this library
		* @param {string} key 
		* @param {string} value 
		*/
		addEntity(key, value) {
			if (value.indexOf("&") !== -1) throw new Error("Entity value can't have '&'");
			else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
			else if (value === "&") throw new Error("An entity with value '&' is not permitted");
			else this.externalEntities[key] = value;
		}
		/**
		* Returns a Symbol that can be used to access the metadata
		* property on a node.
		* 
		* If Symbol is not available in the environment, an ordinary property is used
		* and the name of the property is here returned.
		* 
		* The XMLMetaData property is only present when `captureMetaData`
		* is true in the options.
		*/
		static getMetaDataSymbol() {
			return XmlNode.getMetaDataSymbol();
		}
	};
	async function getAnimeImage(annId) {
		if (annId === null) return null;
		const imageUrl = await getAnimeImageUrl(annId);
		if (imageUrl === null) return null;
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
						if (contentType === void 0) resolve(null);
						else resolve({
							data: resp.response,
							contentType
						});
					}
				}
			});
		});
	}
	function getAttrFromHeader(headerText, targetAttr) {
		const attrsText = headerText.split("\n");
		let ret = void 0;
		for (let attrText of attrsText) {
			const [attr, value] = attrText.split(/\s*:\s*/);
			if (attr === targetAttr) ret = value;
		}
		return ret;
	}
	async function getAnimeImageUrl(annId) {
		if (annId === null) return null;
		const res = await fetch(`https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=${annId}`);
		if (!res.ok) {
			console.warn("fetch cdn.animenewsnetwork.com failed");
			return null;
		}
		const xml = await res.text();
		const obj = new XMLParser({ ignoreAttributes: false }).parse(xml);
		let ret = void 0;
		if (obj.ann && obj.ann.anime && obj.ann.anime.info && Array.isArray(obj.ann.anime.info)) {
			for (let info of obj.ann.anime.info) if (info["@_type"] === "Picture" && info.img && Array.isArray(info.img)) {
				const img = info.img[info.img.length - 1];
				if (typeof img["@_src"] === "string") ret = img["@_src"];
			}
		}
		return ret === void 0 ? null : ret;
	}
	var import_mp3tag = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module, this$1) => {
		var define;
		(function(global, factory) {
			typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.MP3Tag = factory());
		})(this$1, (function() {
			"use strict";
			function ownKeys$2(object, enumerableOnly) {
				var keys = Object.keys(object);
				if (Object.getOwnPropertySymbols) {
					var symbols = Object.getOwnPropertySymbols(object);
					enumerableOnly && (symbols = symbols.filter(function(sym) {
						return Object.getOwnPropertyDescriptor(object, sym).enumerable;
					})), keys.push.apply(keys, symbols);
				}
				return keys;
			}
			function _objectSpread2(target) {
				for (var i = 1; i < arguments.length; i++) {
					var source = null != arguments[i] ? arguments[i] : {};
					i % 2 ? ownKeys$2(Object(source), !0).forEach(function(key) {
						_defineProperty(target, key, source[key]);
					}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function(key) {
						Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
					});
				}
				return target;
			}
			function _typeof(obj) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
					return typeof obj;
				} : function(obj) {
					return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
				}, _typeof(obj);
			}
			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
			}
			function _defineProperties(target, props) {
				for (var i = 0; i < props.length; i++) {
					var descriptor = props[i];
					descriptor.enumerable = descriptor.enumerable || false;
					descriptor.configurable = true;
					if ("value" in descriptor) descriptor.writable = true;
					Object.defineProperty(target, descriptor.key, descriptor);
				}
			}
			function _createClass(Constructor, protoProps, staticProps) {
				if (protoProps) _defineProperties(Constructor.prototype, protoProps);
				if (staticProps) _defineProperties(Constructor, staticProps);
				Object.defineProperty(Constructor, "prototype", { writable: false });
				return Constructor;
			}
			function _defineProperty(obj, key, value) {
				if (key in obj) Object.defineProperty(obj, key, {
					value,
					enumerable: true,
					configurable: true,
					writable: true
				});
				else obj[key] = value;
				return obj;
			}
			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
				subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
					value: subClass,
					writable: true,
					configurable: true
				} });
				Object.defineProperty(subClass, "prototype", { writable: false });
				if (superClass) _setPrototypeOf(subClass, superClass);
			}
			function _getPrototypeOf(o) {
				_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
					return o.__proto__ || Object.getPrototypeOf(o);
				};
				return _getPrototypeOf(o);
			}
			function _setPrototypeOf(o, p) {
				_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
					o.__proto__ = p;
					return o;
				};
				return _setPrototypeOf(o, p);
			}
			function _isNativeReflectConstruct() {
				if (typeof Reflect === "undefined" || !Reflect.construct) return false;
				if (Reflect.construct.sham) return false;
				if (typeof Proxy === "function") return true;
				try {
					Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
					return true;
				} catch (e) {
					return false;
				}
			}
			function _construct(Parent, args, Class) {
				if (_isNativeReflectConstruct()) _construct = Reflect.construct.bind();
				else _construct = function _construct(Parent, args, Class) {
					var a = [null];
					a.push.apply(a, args);
					var instance = new (Function.bind.apply(Parent, a))();
					if (Class) _setPrototypeOf(instance, Class.prototype);
					return instance;
				};
				return _construct.apply(null, arguments);
			}
			function _isNativeFunction(fn) {
				return Function.toString.call(fn).indexOf("[native code]") !== -1;
			}
			function _wrapNativeSuper(Class) {
				var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
				_wrapNativeSuper = function _wrapNativeSuper(Class) {
					if (Class === null || !_isNativeFunction(Class)) return Class;
					if (typeof Class !== "function") throw new TypeError("Super expression must either be null or a function");
					if (typeof _cache !== "undefined") {
						if (_cache.has(Class)) return _cache.get(Class);
						_cache.set(Class, Wrapper);
					}
					function Wrapper() {
						return _construct(Class, arguments, _getPrototypeOf(this).constructor);
					}
					Wrapper.prototype = Object.create(Class.prototype, { constructor: {
						value: Wrapper,
						enumerable: false,
						writable: true,
						configurable: true
					} });
					return _setPrototypeOf(Wrapper, Class);
				};
				return _wrapNativeSuper(Class);
			}
			function _assertThisInitialized(self) {
				if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return self;
			}
			function _possibleConstructorReturn(self, call) {
				if (call && (typeof call === "object" || typeof call === "function")) return call;
				else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
				return _assertThisInitialized(self);
			}
			function _createSuper(Derived) {
				var hasNativeReflectConstruct = _isNativeReflectConstruct();
				return function _createSuperInternal() {
					var Super = _getPrototypeOf(Derived), result;
					if (hasNativeReflectConstruct) {
						var NewTarget = _getPrototypeOf(this).constructor;
						result = Reflect.construct(Super, arguments, NewTarget);
					} else result = Super.apply(this, arguments);
					return _possibleConstructorReturn(this, result);
				};
			}
			function _toConsumableArray(arr) {
				return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
			}
			function _arrayWithoutHoles(arr) {
				if (Array.isArray(arr)) return _arrayLikeToArray(arr);
			}
			function _iterableToArray(iter) {
				if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
			}
			function _unsupportedIterableToArray(o, minLen) {
				if (!o) return;
				if (typeof o === "string") return _arrayLikeToArray(o, minLen);
				var n = Object.prototype.toString.call(o).slice(8, -1);
				if (n === "Object" && o.constructor) n = o.constructor.name;
				if (n === "Map" || n === "Set") return Array.from(o);
				if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
			}
			function _arrayLikeToArray(arr, len) {
				if (len == null || len > arr.length) len = arr.length;
				for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
				return arr2;
			}
			function _nonIterableSpread() {
				throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
			}
			var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
			var fails$D = function(exec) {
				try {
					return !!exec();
				} catch (error) {
					return true;
				}
			};
			var descriptors = !fails$D(function() {
				return Object.defineProperty({}, 1, { get: function() {
					return 7;
				} })[1] != 7;
			});
			var functionBindNative = !fails$D(function() {
				var test = function() {}.bind();
				return typeof test != "function" || test.hasOwnProperty("prototype");
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
				if (isNullOrUndefined$6(it)) throw $TypeError$g("Can't call method on " + it);
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
			var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
				return hasOwnProperty(toObject$a(it), key);
			};
			var DESCRIPTORS$j = descriptors;
			var hasOwn$h = hasOwnProperty_1;
			var FunctionPrototype$2 = Function.prototype;
			var getDescriptor = DESCRIPTORS$j && Object.getOwnPropertyDescriptor;
			var EXISTS$1 = hasOwn$h(FunctionPrototype$2, "name");
			var functionName = {
				EXISTS: EXISTS$1,
				PROPER: EXISTS$1 && function something() {}.name === "something",
				CONFIGURABLE: EXISTS$1 && (!DESCRIPTORS$j || DESCRIPTORS$j && getDescriptor(FunctionPrototype$2, "name").configurable)
			};
			var objectDefineProperty = {};
			var check = function(it) {
				return it && it.Math == Math && it;
			};
			var global$u = check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || check(typeof self == "object" && self) || check(typeof commonjsGlobal == "object" && commonjsGlobal) || function() {
				return this;
			}() || Function("return this")();
			var isCallable$n = function(argument) {
				return typeof argument == "function";
			};
			var isCallable$m = isCallable$n;
			var documentAll = typeof document == "object" && document.all;
			var isObject$f = typeof documentAll == "undefined" && documentAll !== void 0 ? function(it) {
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
				return Object.defineProperty(createElement("div"), "a", { get: function() {
					return 7;
				} }).a != 7;
			});
			var v8PrototypeDefineBug = descriptors && fails$D(function() {
				return Object.defineProperty(function() {}, "prototype", {
					value: 42,
					writable: false
				}).prototype != 42;
			});
			var isObject$d = isObject$f;
			var $String$3 = String;
			var $TypeError$f = TypeError;
			var anObject$g = function(argument) {
				if (isObject$d(argument)) return argument;
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
			var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);
			var engineUserAgent = getBuiltIn$9("navigator", "userAgent") || "";
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
					if (match) version = +match[1];
				}
			}
			var engineV8Version = version;
			var V8_VERSION$2 = engineV8Version;
			var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$D(function() {
				var symbol = Symbol();
				return !String(symbol) || !(Object(symbol) instanceof Symbol) || !Symbol.sham && V8_VERSION$2 && V8_VERSION$2 < 41;
			});
			var useSymbolAsUid = symbolConstructorDetection && !Symbol.sham && typeof Symbol.iterator == "symbol";
			var getBuiltIn$7 = getBuiltIn$9;
			var isCallable$k = isCallable$n;
			var isPrototypeOf$7 = objectIsPrototypeOf;
			var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
			var $Object$3 = Object;
			var isSymbol$5 = USE_SYMBOL_AS_UID$1 ? function(it) {
				return typeof it == "symbol";
			} : function(it) {
				var $Symbol = getBuiltIn$7("Symbol");
				return isCallable$k($Symbol) && isPrototypeOf$7($Symbol.prototype, $Object$3(it));
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
				if (isCallable$j(argument)) return argument;
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
				var fn, val;
				if (pref === "string" && isCallable$i(fn = input.toString) && !isObject$c(val = call$j(fn, input))) return val;
				if (isCallable$i(fn = input.valueOf) && !isObject$c(val = call$j(fn, input))) return val;
				if (pref !== "string" && isCallable$i(fn = input.toString) && !isObject$c(val = call$j(fn, input))) return val;
				throw $TypeError$d("Can't convert object to primitive value");
			};
			var shared$7 = { exports: {} };
			var global$q = global$u;
			var defineProperty$b = Object.defineProperty;
			var defineGlobalProperty$3 = function(key, value) {
				try {
					defineProperty$b(global$q, key, {
						value,
						configurable: true,
						writable: true
					});
				} catch (error) {
					global$q[key] = value;
				}
				return value;
			};
			var global$p = global$u;
			var defineGlobalProperty$2 = defineGlobalProperty$3;
			var SHARED = "__core-js_shared__";
			var sharedStore = global$p[SHARED] || defineGlobalProperty$2(SHARED, {});
			var store$2 = sharedStore;
			(shared$7.exports = function(key, value) {
				return store$2[key] || (store$2[key] = value !== void 0 ? value : {});
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
			var uid$4 = function(key) {
				return "Symbol(" + (key === void 0 ? "" : key) + ")_" + toString$g(++id + postfix, 36);
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
					if (NATIVE_SYMBOL$5 && hasOwn$g(Symbol$2, name)) WellKnownSymbolsStore$1[name] = Symbol$2[name];
					else if (USE_SYMBOL_AS_UID && symbolFor) WellKnownSymbolsStore$1[name] = symbolFor(description);
					else WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
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
				if (!isObject$b(input) || isSymbol$4(input)) return input;
				var exoticToPrim = getMethod$4(input, TO_PRIMITIVE);
				var result;
				if (exoticToPrim) {
					if (pref === void 0) pref = "default";
					result = call$i(exoticToPrim, input, pref);
					if (!isObject$b(result) || isSymbol$4(result)) return result;
					throw $TypeError$c("Can't convert object to primitive value");
				}
				if (pref === void 0) pref = "number";
				return ordinaryToPrimitive(input, pref);
			};
			var toPrimitive$1 = toPrimitive$2;
			var isSymbol$3 = isSymbol$5;
			var toPropertyKey$5 = function(argument) {
				var key = toPrimitive$1(argument, "string");
				return isSymbol$3(key) ? key : key + "";
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
			objectDefineProperty.f = DESCRIPTORS$g ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
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
			} : $defineProperty$1 : function defineProperty(O, P, Attributes) {
				anObject$f(O);
				P = toPropertyKey$4(P);
				anObject$f(Attributes);
				if (IE8_DOM_DEFINE$1) try {
					return $defineProperty$1(O, P, Attributes);
				} catch (error) {}
				if ("get" in Attributes || "set" in Attributes) throw $TypeError$b("Accessors not supported");
				if ("value" in Attributes) O[P] = Attributes.value;
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
			if (DESCRIPTORS$f && !FUNCTION_NAME_EXISTS) defineProperty$a(FunctionPrototype$1, NAME$1, {
				configurable: true,
				get: function() {
					try {
						return regExpExec$2(nameRE, functionToString$1(this))[1];
					} catch (error) {
						return "";
					}
				}
			});
			var objectGetOwnPropertyDescriptor = {};
			var objectPropertyIsEnumerable = {};
			var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
			var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;
			objectPropertyIsEnumerable.f = getOwnPropertyDescriptor$2 && !$propertyIsEnumerable$1.call({ 1: 2 }, 1) ? function propertyIsEnumerable(V) {
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
			objectGetOwnPropertyDescriptor.f = DESCRIPTORS$e ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
				O = toIndexedObject$9(O);
				P = toPropertyKey$3(P);
				if (IE8_DOM_DEFINE) try {
					return $getOwnPropertyDescriptor$1(O, P);
				} catch (error) {}
				if (hasOwn$f(O, P)) return createPropertyDescriptor$5(!call$h(propertyIsEnumerableModule$1.f, O, P), O[P]);
			};
			var DESCRIPTORS$d = descriptors;
			var definePropertyModule$7 = objectDefineProperty;
			var createPropertyDescriptor$4 = createPropertyDescriptor$6;
			var createNonEnumerableProperty$9 = DESCRIPTORS$d ? function(object, key, value) {
				return definePropertyModule$7.f(object, key, createPropertyDescriptor$4(1, value));
			} : function(object, key, value) {
				object[key] = value;
				return object;
			};
			var makeBuiltIn$3 = { exports: {} };
			var uncurryThis$x = functionUncurryThis;
			var isCallable$h = isCallable$n;
			var store$1 = sharedStore;
			var functionToString = uncurryThis$x(Function.toString);
			if (!isCallable$h(store$1.inspectSource)) store$1.inspectSource = function(it) {
				return functionToString(it);
			};
			var inspectSource$2 = store$1.inspectSource;
			var global$n = global$u;
			var isCallable$g = isCallable$n;
			var WeakMap$1 = global$n.WeakMap;
			var weakMapBasicDetection = isCallable$g(WeakMap$1) && /native code/.test(String(WeakMap$1));
			var shared$5 = shared$7.exports;
			var uid$2 = uid$4;
			var keys$2 = shared$5("keys");
			var sharedKey$4 = function(key) {
				return keys$2[key] || (keys$2[key] = uid$2(key));
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
					if (!isObject$a(it) || (state = get$1(it)).type !== TYPE) throw TypeError$3("Incompatible receiver, " + TYPE + " required");
					return state;
				};
			};
			if (NATIVE_WEAK_MAP || shared$4.state) {
				var store = shared$4.state || (shared$4.state = new WeakMap());
				var wmget = uncurryThis$w(store.get);
				var wmhas = uncurryThis$w(store.has);
				var wmset = uncurryThis$w(store.set);
				set$1 = function(it, metadata) {
					if (wmhas(store, it)) throw TypeError$3(OBJECT_ALREADY_INITIALIZED);
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
					if (hasOwn$e(it, STATE)) throw TypeError$3(OBJECT_ALREADY_INITIALIZED);
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
				return defineProperty$9(function() {}, "length", { value: 8 }).length !== 8;
			});
			var TEMPLATE = String(String).split("String");
			var makeBuiltIn$2 = makeBuiltIn$3.exports = function(value, name, options) {
				if (String(name).slice(0, 7) === "Symbol(") name = "[" + String(name).replace(/^Symbol\(([^)]*)\)/, "$1") + "]";
				if (options && options.getter) name = "get " + name;
				if (options && options.setter) name = "set " + name;
				if (!hasOwn$d(value, "name") || CONFIGURABLE_FUNCTION_NAME$2 && value.name !== name) {
					if (DESCRIPTORS$c) defineProperty$9(value, "name", {
						value: name,
						configurable: true
					});
					else value.name = name;
				}
				if (CONFIGURABLE_LENGTH && options && hasOwn$d(options, "arity") && value.length !== options.arity) defineProperty$9(value, "length", { value: options.arity });
				try {
					if (options && hasOwn$d(options, "constructor") && options.constructor) {
						if (DESCRIPTORS$c) defineProperty$9(value, "prototype", { writable: false });
					} else if (value.prototype) value.prototype = void 0;
				} catch (error) {}
				var state = enforceInternalState$3(value);
				if (!hasOwn$d(state, "source")) state.source = TEMPLATE.join(typeof name == "string" ? name : "");
				return value;
			};
			Function.prototype.toString = makeBuiltIn$2(function toString() {
				return isCallable$f(this) && getInternalState$7(this).source || inspectSource$1(this);
			}, "toString");
			var isCallable$e = isCallable$n;
			var definePropertyModule$6 = objectDefineProperty;
			var makeBuiltIn$1 = makeBuiltIn$3.exports;
			var defineGlobalProperty$1 = defineGlobalProperty$3;
			var defineBuiltIn$c = function(O, key, value, options) {
				if (!options) options = {};
				var simple = options.enumerable;
				var name = options.name !== void 0 ? options.name : key;
				if (isCallable$e(value)) makeBuiltIn$1(value, name, options);
				if (options.global) {
					if (simple) O[key] = value;
					else defineGlobalProperty$1(key, value);
				} else {
					try {
						if (!options.unsafe) delete O[key];
						else if (O[key]) simple = true;
					} catch (error) {}
					if (simple) O[key] = value;
					else definePropertyModule$6.f(O, key, {
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
			var trunc = Math.trunc || function trunc(x) {
				var n = +x;
				return (n > 0 ? floor$5 : ceil)(n);
			};
			var toIntegerOrInfinity$8 = function(argument) {
				var number = +argument;
				return number !== number || number === 0 ? 0 : trunc(number);
			};
			var toIntegerOrInfinity$7 = toIntegerOrInfinity$8;
			var max$3 = Math.max;
			var min$6 = Math.min;
			var toAbsoluteIndex$7 = function(index, length) {
				var integer = toIntegerOrInfinity$7(index);
				return integer < 0 ? max$3(integer + length, 0) : min$6(integer, length);
			};
			var toIntegerOrInfinity$6 = toIntegerOrInfinity$8;
			var min$5 = Math.min;
			var toLength$a = function(argument) {
				return argument > 0 ? min$5(toIntegerOrInfinity$6(argument), 0x1fffffffffffff) : 0;
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
					var index = toAbsoluteIndex$6(fromIndex, length);
					var value;
					if (IS_INCLUDES && el != el) while (length > index) {
						value = O[index++];
						if (value != value) return true;
					}
					else for (; length > index; index++) if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
					return !IS_INCLUDES && -1;
				};
			};
			var arrayIncludes = {
				includes: createMethod$4(true),
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
				var key;
				for (key in O) !hasOwn$c(hiddenKeys$3, key) && hasOwn$c(O, key) && push$4(result, key);
				while (names.length > i) if (hasOwn$c(O, key = names[i++])) ~indexOf$1(result, key) || push$4(result, key);
				return result;
			};
			var enumBugKeys$3 = [
				"constructor",
				"hasOwnProperty",
				"isPrototypeOf",
				"propertyIsEnumerable",
				"toLocaleString",
				"toString",
				"valueOf"
			];
			var internalObjectKeys$1 = objectKeysInternal;
			var hiddenKeys$2 = enumBugKeys$3.concat("length", "prototype");
			objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
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
			var ownKeys$1 = getBuiltIn$6("Reflect", "ownKeys") || function ownKeys(it) {
				var keys = getOwnPropertyNamesModule$1.f(anObject$e(it));
				var getOwnPropertySymbols = getOwnPropertySymbolsModule$2.f;
				return getOwnPropertySymbols ? concat$1(keys, getOwnPropertySymbols(it)) : keys;
			};
			var hasOwn$b = hasOwnProperty_1;
			var ownKeys = ownKeys$1;
			var getOwnPropertyDescriptorModule$2 = objectGetOwnPropertyDescriptor;
			var definePropertyModule$5 = objectDefineProperty;
			var copyConstructorProperties$2 = function(target, source, exceptions) {
				var keys = ownKeys(source);
				var defineProperty = definePropertyModule$5.f;
				var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$2.f;
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					if (!hasOwn$b(target, key) && !(exceptions && hasOwn$b(exceptions, key))) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
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
				var FORCED, target, key, targetProperty, sourceProperty, descriptor;
				if (GLOBAL) target = global$l;
				else if (STATIC) target = global$l[TARGET] || defineGlobalProperty(TARGET, {});
				else target = (global$l[TARGET] || {}).prototype;
				if (target) for (key in source) {
					sourceProperty = source[key];
					if (options.dontCallGetSet) {
						descriptor = getOwnPropertyDescriptor$1(target, key);
						targetProperty = descriptor && descriptor.value;
					} else targetProperty = target[key];
					FORCED = isForced$1(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
					if (!FORCED && targetProperty !== void 0) {
						if (typeof sourceProperty == typeof targetProperty) continue;
						copyConstructorProperties$1(sourceProperty, targetProperty);
					}
					if (options.sham || targetProperty && targetProperty.sham) createNonEnumerableProperty$7(sourceProperty, "sham", true);
					defineBuiltIn$b(target, key, sourceProperty, options);
				}
			};
			var objectDefineProperties = {};
			var internalObjectKeys = objectKeysInternal;
			var enumBugKeys$1 = enumBugKeys$3;
			var objectKeys$2 = Object.keys || function keys(O) {
				return internalObjectKeys(O, enumBugKeys$1);
			};
			var DESCRIPTORS$b = descriptors;
			var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
			var definePropertyModule$4 = objectDefineProperty;
			var anObject$d = anObject$g;
			var toIndexedObject$6 = toIndexedObject$a;
			var objectKeys$1 = objectKeys$2;
			objectDefineProperties.f = DESCRIPTORS$b && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
				anObject$d(O);
				var props = toIndexedObject$6(Properties);
				var keys = objectKeys$1(Properties);
				var length = keys.length;
				var index = 0;
				var key;
				while (length > index) definePropertyModule$4.f(O, key = keys[index++], props[key]);
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
			}, { defineProperties });
			var classof$d = classofRaw$1;
			var isArray$5 = Array.isArray || function isArray(argument) {
				return classof$d(argument) == "Array";
			};
			_export({
				target: "Array",
				stat: true
			}, { isArray: isArray$5 });
			var TO_STRING_TAG$3 = wellKnownSymbol$q("toStringTag");
			var test = {};
			test[TO_STRING_TAG$3] = "z";
			var toStringTagSupport = String(test) === "[object z]";
			var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
			var isCallable$c = isCallable$n;
			var classofRaw = classofRaw$1;
			var TO_STRING_TAG$2 = wellKnownSymbol$q("toStringTag");
			var $Object$1 = Object;
			var CORRECT_ARGUMENTS = classofRaw(function() {
				return arguments;
			}()) == "Arguments";
			var tryGet = function(it, key) {
				try {
					return it[key];
				} catch (error) {}
			};
			var classof$c = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function(it) {
				var O, tag, result;
				return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = $Object$1(it), TO_STRING_TAG$2)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) == "Object" && isCallable$c(O.callee) ? "Arguments" : result;
			};
			var classof$b = classof$c;
			var $String$1 = String;
			var toString$e = function(argument) {
				if (classof$b(argument) === "Symbol") throw TypeError("Cannot convert a Symbol value to a string");
				return $String$1(argument);
			};
			var anObject$c = anObject$g;
			var regexpFlags$1 = function() {
				var that = anObject$c(this);
				var result = "";
				if (that.hasIndices) result += "d";
				if (that.global) result += "g";
				if (that.ignoreCase) result += "i";
				if (that.multiline) result += "m";
				if (that.dotAll) result += "s";
				if (that.unicode) result += "u";
				if (that.unicodeSets) result += "v";
				if (that.sticky) result += "y";
				return result;
			};
			var fails$u = fails$D;
			var $RegExp$2 = global$u.RegExp;
			var UNSUPPORTED_Y$3 = fails$u(function() {
				var re = $RegExp$2("a", "y");
				re.lastIndex = 2;
				return re.exec("abcd") != null;
			});
			var MISSED_STICKY$2 = UNSUPPORTED_Y$3 || fails$u(function() {
				return !$RegExp$2("a", "y").sticky;
			});
			var regexpStickyHelpers = {
				BROKEN_CARET: UNSUPPORTED_Y$3 || fails$u(function() {
					var re = $RegExp$2("^r", "gy");
					re.lastIndex = 2;
					return re.exec("str") != null;
				}),
				MISSED_STICKY: MISSED_STICKY$2,
				UNSUPPORTED_Y: UNSUPPORTED_Y$3
			};
			var html$1 = getBuiltIn$9("document", "documentElement");
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
			var EmptyConstructor = function() {};
			var scriptTag = function(content) {
				return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
			};
			var NullProtoObjectViaActiveX = function(activeXDocument) {
				activeXDocument.write(scriptTag(""));
				activeXDocument.close();
				var temp = activeXDocument.parentWindow.Object;
				activeXDocument = null;
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
				} catch (error) {}
				NullProtoObject = typeof document != "undefined" ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument);
				var length = enumBugKeys.length;
				while (length--) delete NullProtoObject[PROTOTYPE$2][enumBugKeys[length]];
				return NullProtoObject();
			};
			hiddenKeys$1[IE_PROTO$1] = true;
			var objectCreate = Object.create || function create(O, Properties) {
				var result;
				if (O !== null) {
					EmptyConstructor[PROTOTYPE$2] = anObject$b(O);
					result = new EmptyConstructor();
					EmptyConstructor[PROTOTYPE$2] = null;
					result[IE_PROTO$1] = O;
				} else result = NullProtoObject();
				return Properties === void 0 ? result : definePropertiesModule$1.f(result, Properties);
			};
			var fails$t = fails$D;
			var $RegExp$1 = global$u.RegExp;
			var regexpUnsupportedDotAll = fails$t(function() {
				var re = $RegExp$1(".", "s");
				return !(re.dotAll && re.exec("\n") && re.flags === "s");
			});
			var fails$s = fails$D;
			var $RegExp = global$u.RegExp;
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
				var re1 = /a/;
				var re2 = /b*/g;
				call$g(nativeExec, re1, "a");
				call$g(nativeExec, re2, "a");
				return re1.lastIndex !== 0 || re2.lastIndex !== 0;
			}();
			var UNSUPPORTED_Y$2 = stickyHelpers$2.BROKEN_CARET;
			var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
			if (UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2 || UNSUPPORTED_DOT_ALL$1 || UNSUPPORTED_NCG$1) patchedExec = function exec(string) {
				var re = this;
				var state = getInternalState$6(re);
				var str = toString$d(string);
				var raw = state.raw;
				var result, reCopy, lastIndex, match, i, object, group;
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
					if (indexOf(flags, "g") === -1) flags += "g";
					strCopy = stringSlice$6(str, re.lastIndex);
					if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$5(str, re.lastIndex - 1) !== "\n")) {
						source = "(?: " + source + ")";
						strCopy = " " + strCopy;
						charsAdded++;
					}
					reCopy = new RegExp("^(?:" + source + ")", flags);
				}
				if (NPCG_INCLUDED) reCopy = new RegExp("^" + source + "$(?!\\s)", flags);
				if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
				match = call$g(nativeExec, sticky ? reCopy : re, strCopy);
				if (sticky) {
					if (match) {
						match.input = stringSlice$6(match.input, charsAdded);
						match[0] = stringSlice$6(match[0], charsAdded);
						match.index = re.lastIndex;
						re.lastIndex += match[0].length;
					} else re.lastIndex = 0;
				} else if (UPDATES_LAST_INDEX_WRONG && match) re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
				if (NPCG_INCLUDED && match && match.length > 1) call$g(nativeReplace, match[0], reCopy, function() {
					for (i = 1; i < arguments.length - 2; i++) if (arguments[i] === void 0) match[i] = void 0;
				});
				if (match && groups) {
					match.groups = object = create$3(null);
					for (i = 0; i < groups.length; i++) {
						group = groups[i];
						object[group[0]] = match[group[1]];
					}
				}
				return match;
			};
			var regexpExec$3 = patchedExec;
			var $$n = _export;
			var exec$5 = regexpExec$3;
			$$n({
				target: "RegExp",
				proto: true,
				forced: /./.exec !== exec$5
			}, { exec: exec$5 });
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
			var fixRegexpWellKnownSymbolLogic = function(KEY, exec, FORCED, SHAM) {
				var SYMBOL = wellKnownSymbol$m(KEY);
				var DELEGATES_TO_SYMBOL = !fails$r(function() {
					var O = {};
					O[SYMBOL] = function() {
						return 7;
					};
					return ""[KEY](O) != 7;
				});
				var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$r(function() {
					var execCalled = false;
					var re = /a/;
					if (KEY === "split") {
						re = {};
						re.constructor = {};
						re.constructor[SPECIES$5] = function() {
							return re;
						};
						re.flags = "";
						re[SYMBOL] = /./[SYMBOL];
					}
					re.exec = function() {
						execCalled = true;
						return null;
					};
					re[SYMBOL]("");
					return !execCalled;
				});
				if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || FORCED) {
					var uncurriedNativeRegExpMethod = uncurryThis$s(/./[SYMBOL]);
					var methods = exec(SYMBOL, ""[KEY], function(nativeMethod, regexp, str, arg2, forceStringMethod) {
						var uncurriedNativeMethod = uncurryThis$s(nativeMethod);
						var $exec = regexp.exec;
						if ($exec === regexpExec$2 || $exec === RegExpPrototype$5.exec) {
							if (DELEGATES_TO_SYMBOL && !forceStringMethod) return {
								done: true,
								value: uncurriedNativeRegExpMethod(regexp, str, arg2)
							};
							return {
								done: true,
								value: uncurriedNativeMethod(str, regexp, arg2)
							};
						}
						return { done: false };
					});
					defineBuiltIn$a(String.prototype, KEY, methods[0]);
					defineBuiltIn$a(RegExpPrototype$5, SYMBOL, methods[1]);
				}
				if (SHAM) createNonEnumerableProperty$6(RegExpPrototype$5[SYMBOL], "sham", true);
			};
			var isObject$9 = isObject$f;
			var classof$a = classofRaw$1;
			var MATCH$2 = wellKnownSymbol$q("match");
			var isRegexp = function(it) {
				var isRegExp;
				return isObject$9(it) && ((isRegExp = it[MATCH$2]) !== void 0 ? !!isRegExp : classof$a(it) == "RegExp");
			};
			var uncurryThis$r = functionUncurryThis;
			var fails$q = fails$D;
			var isCallable$b = isCallable$n;
			var classof$9 = classof$c;
			var getBuiltIn$4 = getBuiltIn$9;
			var inspectSource = inspectSource$2;
			var noop = function() {};
			var empty = [];
			var construct = getBuiltIn$4("Reflect", "construct");
			var constructorRegExp = /^\s*(?:class|function)\b/;
			var exec$4 = uncurryThis$r(constructorRegExp.exec);
			var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);
			var isConstructorModern = function isConstructor(argument) {
				if (!isCallable$b(argument)) return false;
				try {
					construct(noop, empty, argument);
					return true;
				} catch (error) {
					return false;
				}
			};
			var isConstructorLegacy = function isConstructor(argument) {
				if (!isCallable$b(argument)) return false;
				switch (classof$9(argument)) {
					case "AsyncFunction":
					case "GeneratorFunction":
					case "AsyncGeneratorFunction": return false;
				}
				try {
					return INCORRECT_TO_STRING || !!exec$4(constructorRegExp, inspectSource(argument));
				} catch (error) {
					return true;
				}
			};
			isConstructorLegacy.sham = true;
			var isConstructor$3 = !construct || fails$q(function() {
				var called;
				return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function() {
					called = true;
				}) || called;
			}) ? isConstructorLegacy : isConstructorModern;
			var isConstructor$2 = isConstructor$3;
			var tryToString$4 = tryToString$6;
			var $TypeError$a = TypeError;
			var aConstructor$2 = function(argument) {
				if (isConstructor$2(argument)) return argument;
				throw $TypeError$a(tryToString$4(argument) + " is not a constructor");
			};
			var anObject$a = anObject$g;
			var aConstructor$1 = aConstructor$2;
			var isNullOrUndefined$4 = isNullOrUndefined$7;
			var SPECIES$4 = wellKnownSymbol$q("species");
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
					var first, second;
					if (position < 0 || position >= size) return CONVERT_TO_STRING ? "" : void 0;
					first = charCodeAt$1(S, position);
					return first < 55296 || first > 56319 || position + 1 === size || (second = charCodeAt$1(S, position + 1)) < 56320 || second > 57343 ? CONVERT_TO_STRING ? charAt$4(S, position) : first : CONVERT_TO_STRING ? stringSlice$5(S, position, position + 2) : (first - 55296 << 10) + (second - 56320) + 65536;
				};
			};
			var charAt$3 = {
				codeAt: createMethod$3(false),
				charAt: createMethod$3(true)
			}.charAt;
			var advanceStringIndex$3 = function(S, index, unicode) {
				return index + (unicode ? charAt$3(S, index).length : 1);
			};
			var toPropertyKey$2 = toPropertyKey$5;
			var definePropertyModule$3 = objectDefineProperty;
			var createPropertyDescriptor$3 = createPropertyDescriptor$6;
			var createProperty$3 = function(object, key, value) {
				var propertyKey = toPropertyKey$2(key);
				if (propertyKey in object) definePropertyModule$3.f(object, propertyKey, createPropertyDescriptor$3(0, value));
				else object[propertyKey] = value;
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
				for (var n = 0; k < fin; k++, n++) createProperty$2(result, n, O[k]);
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
				var exec = R.exec;
				if (isCallable$a(exec)) {
					var result = call$e(exec, R, S);
					if (result !== null) anObject$9(result);
					return result;
				}
				if (classof$8(R) === "RegExp") return call$e(regexpExec$1, R, S);
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
			var MAX_UINT32 = 0xffffffff;
			var min$4 = Math.min;
			var $push = [].push;
			var exec$3 = uncurryThis$p(/./.exec);
			var push$3 = uncurryThis$p($push);
			var stringSlice$4 = uncurryThis$p("".slice);
			fixRegExpWellKnownSymbolLogic$2("split", function(SPLIT, nativeSplit, maybeCallNative) {
				var internalSplit;
				if ("abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length) internalSplit = function(separator, limit) {
					var string = toString$b(requireObjectCoercible$5(this));
					var lim = limit === void 0 ? MAX_UINT32 : limit >>> 0;
					if (lim === 0) return [];
					if (separator === void 0) return [string];
					if (!isRegExp$2(separator)) return call$d(nativeSplit, string, separator, lim);
					var output = [];
					var flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.unicode ? "u" : "") + (separator.sticky ? "y" : "");
					var lastLastIndex = 0;
					var separatorCopy = new RegExp(separator.source, flags + "g");
					var match, lastIndex, lastLength;
					while (match = call$d(regexpExec, separatorCopy, string)) {
						lastIndex = separatorCopy.lastIndex;
						if (lastIndex > lastLastIndex) {
							push$3(output, stringSlice$4(string, lastLastIndex, match.index));
							if (match.length > 1 && match.index < string.length) apply$5($push, output, arraySlice$7(match, 1));
							lastLength = match[0].length;
							lastLastIndex = lastIndex;
							if (output.length >= lim) break;
						}
						if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++;
					}
					if (lastLastIndex === string.length) {
						if (lastLength || !exec$3(separatorCopy, "")) push$3(output, "");
					} else push$3(output, stringSlice$4(string, lastLastIndex));
					return output.length > lim ? arraySlice$7(output, 0, lim) : output;
				};
				else if ("0".split(void 0, 0).length) internalSplit = function(separator, limit) {
					return separator === void 0 && limit === 0 ? [] : call$d(nativeSplit, this, separator, limit);
				};
				else internalSplit = nativeSplit;
				return [function split(separator, limit) {
					var O = requireObjectCoercible$5(this);
					var splitter = isNullOrUndefined$3(separator) ? void 0 : getMethod$3(separator, SPLIT);
					return splitter ? call$d(splitter, separator, O, limit) : call$d(internalSplit, toString$b(O), separator, limit);
				}, function(string, limit) {
					var rx = anObject$8(this);
					var S = toString$b(string);
					var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
					if (res.done) return res.value;
					var C = speciesConstructor$2(rx, RegExp);
					var unicodeMatching = rx.unicode;
					var flags = (rx.ignoreCase ? "i" : "") + (rx.multiline ? "m" : "") + (rx.unicode ? "u" : "") + (UNSUPPORTED_Y$1 ? "g" : "y");
					var splitter = new C(UNSUPPORTED_Y$1 ? "^(?:" + rx.source + ")" : rx, flags);
					var lim = limit === void 0 ? MAX_UINT32 : limit >>> 0;
					if (lim === 0) return [];
					if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
					var p = 0;
					var q = 0;
					var A = [];
					while (q < S.length) {
						splitter.lastIndex = UNSUPPORTED_Y$1 ? 0 : q;
						var z = callRegExpExec(splitter, UNSUPPORTED_Y$1 ? stringSlice$4(S, q) : S);
						var e;
						if (z === null || (e = min$4(toLength$8(splitter.lastIndex + (UNSUPPORTED_Y$1 ? q : 0)), S.length)) === p) q = advanceStringIndex$2(S, q, unicodeMatching);
						else {
							push$3(A, stringSlice$4(S, p, q));
							if (A.length === lim) return A;
							for (var i = 1; i <= z.length - 1; i++) {
								push$3(A, z[i]);
								if (A.length === lim) return A;
							}
							q = p = e;
						}
					}
					push$3(A, stringSlice$4(S, p));
					return A;
				}];
			}, !!fails$p(function() {
				var re = /(?:)/;
				var originalExec = re.exec;
				re.exec = function() {
					return originalExec.apply(this, arguments);
				};
				var result = "ab".split(re);
				return result.length !== 2 || result[0] !== "a" || result[1] !== "b";
			}), UNSUPPORTED_Y$1);
			var wellKnownSymbol$j = wellKnownSymbol$q;
			var create$2 = objectCreate;
			var defineProperty$8 = objectDefineProperty.f;
			var UNSCOPABLES = wellKnownSymbol$j("unscopables");
			var ArrayPrototype$1 = Array.prototype;
			if (ArrayPrototype$1[UNSCOPABLES] == void 0) defineProperty$8(ArrayPrototype$1, UNSCOPABLES, {
				configurable: true,
				value: create$2(null)
			});
			var addToUnscopables$2 = function(key) {
				ArrayPrototype$1[UNSCOPABLES][key] = true;
			};
			var iterators = {};
			var correctPrototypeGetter = !fails$D(function() {
				function F() {}
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
				if (hasOwn$a(object, IE_PROTO)) return object[IE_PROTO];
				var constructor = object.constructor;
				if (isCallable$9(constructor) && object instanceof constructor) return constructor.prototype;
				return object instanceof $Object ? ObjectPrototype$3 : null;
			};
			var fails$n = fails$D;
			var isCallable$8 = isCallable$n;
			var isObject$8 = isObject$f;
			var getPrototypeOf$3 = objectGetPrototypeOf;
			var defineBuiltIn$9 = defineBuiltIn$c;
			var ITERATOR$6 = wellKnownSymbol$q("iterator");
			var BUGGY_SAFARI_ITERATORS$1 = false;
			var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;
			if ([].keys) {
				arrayIterator = [].keys();
				if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
				else {
					PrototypeOfArrayIteratorPrototype = getPrototypeOf$3(getPrototypeOf$3(arrayIterator));
					if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
				}
			}
			if (!isObject$8(IteratorPrototype$2) || fails$n(function() {
				var test = {};
				return IteratorPrototype$2[ITERATOR$6].call(test) !== test;
			})) IteratorPrototype$2 = {};
			if (!isCallable$8(IteratorPrototype$2[ITERATOR$6])) defineBuiltIn$9(IteratorPrototype$2, ITERATOR$6, function() {
				return this;
			});
			var iteratorsCore = {
				IteratorPrototype: IteratorPrototype$2,
				BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
			};
			var defineProperty$7 = objectDefineProperty.f;
			var hasOwn$9 = hasOwnProperty_1;
			var TO_STRING_TAG$1 = wellKnownSymbol$q("toStringTag");
			var setToStringTag$4 = function(target, TAG, STATIC) {
				if (target && !STATIC) target = target.prototype;
				if (target && !hasOwn$9(target, TO_STRING_TAG$1)) defineProperty$7(target, TO_STRING_TAG$1, {
					configurable: true,
					value: TAG
				});
			};
			var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
			var create$1 = objectCreate;
			var createPropertyDescriptor$2 = createPropertyDescriptor$6;
			var setToStringTag$3 = setToStringTag$4;
			var Iterators$4 = iterators;
			var returnThis$1 = function() {
				return this;
			};
			var iteratorCreateConstructor = function(IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
				var TO_STRING_TAG = NAME + " Iterator";
				IteratorConstructor.prototype = create$1(IteratorPrototype$1, { next: createPropertyDescriptor$2(+!ENUMERABLE_NEXT, next) });
				setToStringTag$3(IteratorConstructor, TO_STRING_TAG, false);
				Iterators$4[TO_STRING_TAG] = returnThis$1;
				return IteratorConstructor;
			};
			var isCallable$7 = isCallable$n;
			var $String = String;
			var $TypeError$8 = TypeError;
			var aPossiblePrototype$1 = function(argument) {
				if (typeof argument == "object" || isCallable$7(argument)) return argument;
				throw $TypeError$8("Can't set " + $String(argument) + " as a prototype");
			};
			var uncurryThis$o = functionUncurryThis;
			var anObject$7 = anObject$g;
			var aPossiblePrototype = aPossiblePrototype$1;
			var objectSetPrototypeOf = Object.setPrototypeOf || ("__proto__" in {} ? function() {
				var CORRECT_SETTER = false;
				var test = {};
				var setter;
				try {
					setter = uncurryThis$o(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set);
					setter(test, []);
					CORRECT_SETTER = test instanceof Array;
				} catch (error) {}
				return function setPrototypeOf(O, proto) {
					anObject$7(O);
					aPossiblePrototype(proto);
					if (CORRECT_SETTER) setter(O, proto);
					else O.__proto__ = proto;
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
			var iteratorDefine = function(Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
				createIteratorConstructor(IteratorConstructor, NAME, next);
				var getIterationMethod = function(KIND) {
					if (KIND === DEFAULT && defaultIterator) return defaultIterator;
					if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
					switch (KIND) {
						case KEYS: return function keys() {
							return new IteratorConstructor(this, KIND);
						};
						case VALUES: return function values() {
							return new IteratorConstructor(this, KIND);
						};
						case ENTRIES: return function entries() {
							return new IteratorConstructor(this, KIND);
						};
					}
					return function() {
						return new IteratorConstructor(this);
					};
				};
				var TO_STRING_TAG = NAME + " Iterator";
				var INCORRECT_VALUES_NAME = false;
				var IterablePrototype = Iterable.prototype;
				var nativeIterator = IterablePrototype[ITERATOR$5] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
				var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
				var anyNativeIterator = NAME == "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
				var CurrentIteratorPrototype, methods, KEY;
				if (anyNativeIterator) {
					CurrentIteratorPrototype = getPrototypeOf$2(anyNativeIterator.call(new Iterable()));
					if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
						if (getPrototypeOf$2(CurrentIteratorPrototype) !== IteratorPrototype) {
							if (setPrototypeOf$4) setPrototypeOf$4(CurrentIteratorPrototype, IteratorPrototype);
							else if (!isCallable$6(CurrentIteratorPrototype[ITERATOR$5])) defineBuiltIn$8(CurrentIteratorPrototype, ITERATOR$5, returnThis);
						}
						setToStringTag$2(CurrentIteratorPrototype, TO_STRING_TAG, true);
					}
				}
				if (PROPER_FUNCTION_NAME$2 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
					if (CONFIGURABLE_FUNCTION_NAME$1) createNonEnumerableProperty$5(IterablePrototype, "name", VALUES);
					else {
						INCORRECT_VALUES_NAME = true;
						defaultIterator = function values() {
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
					if (FORCED) {
						for (KEY in methods) if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) defineBuiltIn$8(IterablePrototype, KEY, methods[KEY]);
					} else $$m({
						target: NAME,
						proto: true,
						forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
					}, methods);
				}
				if (IterablePrototype[ITERATOR$5] !== defaultIterator) defineBuiltIn$8(IterablePrototype, ITERATOR$5, defaultIterator, { name: DEFAULT });
				Iterators$3[NAME] = defaultIterator;
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
					index: 0,
					kind
				});
			}, function() {
				var state = getInternalState$5(this);
				var target = state.target;
				var kind = state.kind;
				var index = state.index++;
				if (!target || index >= target.length) {
					state.target = void 0;
					return createIterResultObject(void 0, true);
				}
				if (kind == "keys") return createIterResultObject(index, false);
				if (kind == "values") return createIterResultObject(target[index], false);
				return createIterResultObject([index, target[index]], false);
			}, "values");
			var values = Iterators$2.Arguments = Iterators$2.Array;
			addToUnscopables$1("keys");
			addToUnscopables$1("values");
			addToUnscopables$1("entries");
			if (DESCRIPTORS$9 && values.name !== "values") try {
				defineProperty$6(values, "name", { value: "values" });
			} catch (error) {}
			var arrayBufferBasicDetection = typeof ArrayBuffer != "undefined" && typeof DataView != "undefined";
			var defineBuiltIn$7 = defineBuiltIn$c;
			var defineBuiltIns$1 = function(target, src, options) {
				for (var key in src) defineBuiltIn$7(target, key, src[key], options);
				return target;
			};
			var isPrototypeOf$6 = objectIsPrototypeOf;
			var $TypeError$7 = TypeError;
			var anInstance$2 = function(it, Prototype) {
				if (isPrototypeOf$6(Prototype, it)) return it;
				throw $TypeError$7("Incorrect invocation");
			};
			var toIntegerOrInfinity$4 = toIntegerOrInfinity$8;
			var toLength$7 = toLength$a;
			var $RangeError$2 = RangeError;
			var toIndex$2 = function(it) {
				if (it === void 0) return 0;
				var number = toIntegerOrInfinity$4(it);
				var length = toLength$7(number);
				if (number !== length) throw $RangeError$2("Wrong length or index");
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
				var index = 0;
				var exponent, mantissa, c;
				number = abs(number);
				if (number != number || number === 1e400) {
					mantissa = number != number ? 1 : 0;
					exponent = eMax;
				} else {
					exponent = floor$4(log(number) / LN2);
					c = pow(2, -exponent);
					if (number * c < 1) {
						exponent--;
						c *= 2;
					}
					if (exponent + eBias >= 1) number += rt / c;
					else number += rt * pow(2, 1 - eBias);
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
					buffer[index++] = mantissa & 255;
					mantissa /= 256;
					mantissaLength -= 8;
				}
				exponent = exponent << mantissaLength | mantissa;
				exponentLength += mantissaLength;
				while (exponentLength > 0) {
					buffer[index++] = exponent & 255;
					exponent /= 256;
					exponentLength -= 8;
				}
				buffer[--index] |= sign * 128;
				return buffer;
			};
			var unpack = function(buffer, mantissaLength) {
				var bytes = buffer.length;
				var exponentLength = bytes * 8 - mantissaLength - 1;
				var eMax = (1 << exponentLength) - 1;
				var eBias = eMax >> 1;
				var nBits = exponentLength - 7;
				var index = bytes - 1;
				var sign = buffer[index--];
				var exponent = sign & 127;
				var mantissa;
				sign >>= 7;
				while (nBits > 0) {
					exponent = exponent * 256 + buffer[index--];
					nBits -= 8;
				}
				mantissa = exponent & (1 << -nBits) - 1;
				exponent >>= -nBits;
				nBits += mantissaLength;
				while (nBits > 0) {
					mantissa = mantissa * 256 + buffer[index--];
					nBits -= 8;
				}
				if (exponent === 0) exponent = 1 - eBias;
				else if (exponent === eMax) return mantissa ? NaN : sign ? -1e400 : 1e400;
				else {
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
			var arrayFill$1 = function fill(value) {
				var O = toObject$8(this);
				var length = lengthOfArrayLike$9(O);
				var argumentsLength = arguments.length;
				var index = toAbsoluteIndex$4(argumentsLength > 1 ? arguments[1] : void 0, length);
				var end = argumentsLength > 2 ? arguments[2] : void 0;
				var endPos = end === void 0 ? length : toAbsoluteIndex$4(end, length);
				while (endPos > index) O[index++] = value;
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
				return [
					number & 255,
					number >> 8 & 255,
					number >> 16 & 255,
					number >> 24 & 255
				];
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
			var addGetter$1 = function(Constructor, key) {
				defineProperty$5(Constructor[PROTOTYPE$1], key, { get: function() {
					return getInternalState$4(this)[key];
				} });
			};
			var get = function(view, count, index, isLittleEndian) {
				var intIndex = toIndex$1(index);
				var store = getInternalState$4(view);
				if (intIndex + count > store.byteLength) throw RangeError$3(WRONG_INDEX);
				var bytes = getInternalState$4(store.buffer).bytes;
				var start = intIndex + store.byteOffset;
				var pack = arraySlice$6(bytes, start, start + count);
				return isLittleEndian ? pack : reverse(pack);
			};
			var set = function(view, count, index, conversion, value, isLittleEndian) {
				var intIndex = toIndex$1(index);
				var store = getInternalState$4(view);
				if (intIndex + count > store.byteLength) throw RangeError$3(WRONG_INDEX);
				var bytes = getInternalState$4(store.buffer).bytes;
				var start = intIndex + store.byteOffset;
				var pack = conversion(+value);
				for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
			};
			if (!NATIVE_ARRAY_BUFFER$2) {
				$ArrayBuffer = function ArrayBuffer(length) {
					anInstance$1(this, ArrayBufferPrototype$1);
					var byteLength = toIndex$1(length);
					setInternalState$2(this, {
						bytes: fill(Array$1(byteLength), 0),
						byteLength
					});
					if (!DESCRIPTORS$8) this.byteLength = byteLength;
				};
				ArrayBufferPrototype$1 = $ArrayBuffer[PROTOTYPE$1];
				$DataView = function DataView(buffer, byteOffset, byteLength) {
					anInstance$1(this, DataViewPrototype$1);
					anInstance$1(buffer, ArrayBufferPrototype$1);
					var bufferLength = getInternalState$4(buffer).byteLength;
					var offset = toIntegerOrInfinity$3(byteOffset);
					if (offset < 0 || offset > bufferLength) throw RangeError$3("Wrong offset");
					byteLength = byteLength === void 0 ? bufferLength - offset : toLength$6(byteLength);
					if (offset + byteLength > bufferLength) throw RangeError$3(WRONG_LENGTH$1);
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
					getUint8: function getUint8(byteOffset) {
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
					setUint8: function setUint8(byteOffset, value) {
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
					$ArrayBuffer = function ArrayBuffer(length) {
						anInstance$1(this, ArrayBufferPrototype$1);
						return new NativeArrayBuffer$1(toIndex$1(length));
					};
					$ArrayBuffer[PROTOTYPE$1] = ArrayBufferPrototype$1;
					for (var keys$1 = getOwnPropertyNames$2(NativeArrayBuffer$1), j = 0, key; keys$1.length > j;) if (!((key = keys$1[j++]) in $ArrayBuffer)) createNonEnumerableProperty$4($ArrayBuffer, key, NativeArrayBuffer$1[key]);
					ArrayBufferPrototype$1.constructor = $ArrayBuffer;
				} else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) createNonEnumerableProperty$4(NativeArrayBuffer$1, "name", ARRAY_BUFFER$1);
				if (setPrototypeOf$3 && getPrototypeOf$1(DataViewPrototype$1) !== ObjectPrototype$2) setPrototypeOf$3(DataViewPrototype$1, ObjectPrototype$2);
				var testView = new $DataView(new $ArrayBuffer(2));
				var $setInt8 = uncurryThis$n(DataViewPrototype$1.setInt8);
				testView.setInt8(0, 0x80000000);
				testView.setInt8(1, 0x80000001);
				if (testView.getInt8(0) || !testView.getInt8(1)) defineBuiltIns(DataViewPrototype$1, {
					setInt8: function setInt8(byteOffset, value) {
						$setInt8(this, byteOffset, value << 24 >> 24);
					},
					setUint8: function setUint8(byteOffset, value) {
						$setInt8(this, byteOffset, value << 24 >> 24);
					}
				}, { unsafe: true });
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
			$$l({
				target: "ArrayBuffer",
				proto: true,
				unsafe: true,
				forced: fails$l(function() {
					return !new ArrayBuffer$4(2).slice(1, void 0).byteLength;
				})
			}, { slice: function slice(start, end) {
				if (nativeArrayBufferSlice && end === void 0) return nativeArrayBufferSlice(anObject$6(this), start);
				var length = anObject$6(this).byteLength;
				var first = toAbsoluteIndex$3(start, length);
				var fin = toAbsoluteIndex$3(end === void 0 ? length : end, length);
				var result = new (speciesConstructor$1(this, ArrayBuffer$4))(toLength$5(fin - first));
				var viewSource = new DataView$2(this);
				var viewTarget = new DataView$2(result);
				var index = 0;
				while (first < fin) setUint8(viewTarget, index++, getUint8(viewSource, first++));
				return result;
			} });
			var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
			var classof$7 = classof$c;
			var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
				return "[object " + classof$7(this) + "]";
			};
			var TO_STRING_TAG_SUPPORT = toStringTagSupport;
			var defineBuiltIn$6 = defineBuiltIn$c;
			var toString$a = objectToString;
			if (!TO_STRING_TAG_SUPPORT) defineBuiltIn$6(Object.prototype, "toString", toString$a, { unsafe: true });
			var typedArrayConstructor = { exports: {} };
			var ITERATOR$4 = wellKnownSymbol$q("iterator");
			var SAFE_CLOSING = false;
			try {
				var called = 0;
				var iteratorWithReturn = {
					next: function() {
						return { done: !!called++ };
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
			} catch (error) {}
			var checkCorrectnessOfIteration$1 = function(exec, SKIP_CLOSING) {
				if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
				var ITERATION_SUPPORT = false;
				try {
					var object = {};
					object[ITERATOR$4] = function() {
						return { next: function() {
							return { done: ITERATION_SUPPORT = true };
						} };
					};
					exec(object);
				} catch (error) {}
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
			var isView = function isView(it) {
				if (!isObject$7(it)) return false;
				var klass = classof$6(it);
				return klass === "DataView" || hasOwn$8(TypedArrayConstructorsList, klass) || hasOwn$8(BigIntArrayConstructorsList, klass);
			};
			var getTypedArrayConstructor$1 = function(it) {
				var proto = getPrototypeOf(it);
				if (!isObject$7(proto)) return;
				var state = getInternalState$3(proto);
				return state && hasOwn$8(state, TYPED_ARRAY_CONSTRUCTOR) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor$1(proto);
			};
			var isTypedArray$1 = function(it) {
				if (!isObject$7(it)) return false;
				var klass = classof$6(it);
				return hasOwn$8(TypedArrayConstructorsList, klass) || hasOwn$8(BigIntArrayConstructorsList, klass);
			};
			var aTypedArray$m = function(it) {
				if (isTypedArray$1(it)) return it;
				throw TypeError$2("Target is not a typed array");
			};
			var aTypedArrayConstructor$3 = function(C) {
				if (isCallable$5(C) && (!setPrototypeOf$2 || isPrototypeOf$5(TypedArray$1, C))) return C;
				throw TypeError$2(tryToString$3(C) + " is not a typed array constructor");
			};
			var exportTypedArrayMethod$n = function(KEY, property, forced, options) {
				if (!DESCRIPTORS$7) return;
				if (forced) for (var ARRAY in TypedArrayConstructorsList) {
					var TypedArrayConstructor = global$g[ARRAY];
					if (TypedArrayConstructor && hasOwn$8(TypedArrayConstructor.prototype, KEY)) try {
						delete TypedArrayConstructor.prototype[KEY];
					} catch (error) {
						try {
							TypedArrayConstructor.prototype[KEY] = property;
						} catch (error2) {}
					}
				}
				if (!TypedArrayPrototype$2[KEY] || forced) defineBuiltIn$5(TypedArrayPrototype$2, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$3 && Int8ArrayPrototype$1[KEY] || property, options);
			};
			var exportTypedArrayStaticMethod = function(KEY, property, forced) {
				var ARRAY, TypedArrayConstructor;
				if (!DESCRIPTORS$7) return;
				if (setPrototypeOf$2) {
					if (forced) for (ARRAY in TypedArrayConstructorsList) {
						TypedArrayConstructor = global$g[ARRAY];
						if (TypedArrayConstructor && hasOwn$8(TypedArrayConstructor, KEY)) try {
							delete TypedArrayConstructor[KEY];
						} catch (error) {}
					}
					if (!TypedArray$1[KEY] || forced) try {
						return defineBuiltIn$5(TypedArray$1, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$3 && TypedArray$1[KEY] || property);
					} catch (error) {}
					else return;
				}
				for (ARRAY in TypedArrayConstructorsList) {
					TypedArrayConstructor = global$g[ARRAY];
					if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) defineBuiltIn$5(TypedArrayConstructor, KEY, property);
				}
			};
			for (NAME in TypedArrayConstructorsList) {
				Constructor = global$g[NAME];
				Prototype = Constructor && Constructor.prototype;
				if (Prototype) enforceInternalState$2(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
				else NATIVE_ARRAY_BUFFER_VIEWS$3 = false;
			}
			for (NAME in BigIntArrayConstructorsList) {
				Constructor = global$g[NAME];
				Prototype = Constructor && Constructor.prototype;
				if (Prototype) enforceInternalState$2(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
			}
			if (!NATIVE_ARRAY_BUFFER_VIEWS$3 || !isCallable$5(TypedArray$1) || TypedArray$1 === Function.prototype) {
				TypedArray$1 = function TypedArray() {
					throw TypeError$2("Incorrect invocation");
				};
				if (NATIVE_ARRAY_BUFFER_VIEWS$3) {
					for (NAME in TypedArrayConstructorsList) if (global$g[NAME]) setPrototypeOf$2(global$g[NAME], TypedArray$1);
				}
			}
			if (!NATIVE_ARRAY_BUFFER_VIEWS$3 || !TypedArrayPrototype$2 || TypedArrayPrototype$2 === ObjectPrototype$1) {
				TypedArrayPrototype$2 = TypedArray$1.prototype;
				if (NATIVE_ARRAY_BUFFER_VIEWS$3) {
					for (NAME in TypedArrayConstructorsList) if (global$g[NAME]) setPrototypeOf$2(global$g[NAME].prototype, TypedArrayPrototype$2);
				}
			}
			if (NATIVE_ARRAY_BUFFER_VIEWS$3 && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype$2) setPrototypeOf$2(Uint8ClampedArrayPrototype, TypedArrayPrototype$2);
			if (DESCRIPTORS$7 && !hasOwn$8(TypedArrayPrototype$2, TO_STRING_TAG)) {
				TYPED_ARRAY_TAG_REQUIRED = true;
				defineProperty$4(TypedArrayPrototype$2, TO_STRING_TAG, { get: function() {
					return isObject$7(this) ? this[TYPED_ARRAY_TAG$1] : void 0;
				} });
				for (NAME in TypedArrayConstructorsList) if (global$g[NAME]) createNonEnumerableProperty$3(global$g[NAME], TYPED_ARRAY_TAG$1, NAME);
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
				if (result < 0) throw $RangeError$1("The argument can't be less than 0");
				return result;
			};
			var toPositiveInteger = toPositiveInteger$1;
			var $RangeError = RangeError;
			var toOffset$2 = function(it, BYTES) {
				var offset = toPositiveInteger(it);
				if (offset % BYTES) throw $RangeError("Wrong offset");
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
			var ITERATOR$3 = wellKnownSymbol$q("iterator");
			var getIteratorMethod$2 = function(it) {
				if (!isNullOrUndefined$2(it)) return getMethod$2(it, ITERATOR$3) || getMethod$2(it, "@@iterator") || Iterators$1[classof$5(it)];
			};
			var call$b = functionCall;
			var aCallable$2 = aCallable$5;
			var anObject$5 = anObject$g;
			var tryToString$2 = tryToString$6;
			var getIteratorMethod$1 = getIteratorMethod$2;
			var $TypeError$6 = TypeError;
			var getIterator$1 = function(argument, usingIterator) {
				var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
				if (aCallable$2(iteratorMethod)) return anObject$5(call$b(iteratorMethod, argument));
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
			var slice$2 = functionUncurryThis("".slice);
			var isBigIntArray$1 = function(it) {
				return slice$2(classof$4(it), 0, 3) === "Big";
			};
			var toPrimitive = toPrimitive$2;
			var $TypeError$5 = TypeError;
			var toBigInt$2 = function(argument) {
				var prim = toPrimitive(argument, "number");
				if (typeof prim == "number") throw $TypeError$5("Can't convert number to bigint");
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
					while (!(step = call$a(next, iterator)).done) O.push(step.value);
				}
				if (mapping && argumentsLength > 2) mapfn = bind$1(mapfn, arguments[2]);
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
			var SPECIES$3 = wellKnownSymbol$q("species");
			var $Array$1 = Array;
			var arraySpeciesConstructor$1 = function(originalArray) {
				var C;
				if (isArray$3(originalArray)) {
					C = originalArray.constructor;
					if (isConstructor$1(C) && (C === $Array$1 || isArray$3(C.prototype))) C = void 0;
					else if (isObject$5(C)) {
						C = C[SPECIES$3];
						if (C === null) C = void 0;
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
					var self = IndexedObject$1(O);
					var boundFunction = bind(callbackfn, that);
					var length = lengthOfArrayLike$7(self);
					var index = 0;
					var create = specificCreate || arraySpeciesCreate$1;
					var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : void 0;
					var value, result;
					for (; length > index; index++) if (NO_HOLES || index in self) {
						value = self[index];
						result = boundFunction(value, index, O);
						if (TYPE) {
							if (IS_MAP) target[index] = result;
							else if (result) switch (TYPE) {
								case 3: return true;
								case 5: return value;
								case 6: return index;
								case 2: push$2(target, value);
							}
							else switch (TYPE) {
								case 4: return false;
								case 7: push$2(target, value);
							}
						}
					}
					return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
				};
			};
			var arrayIteration = {
				forEach: createMethod$2(0),
				map: createMethod$2(1),
				filter: createMethod$2(2),
				some: createMethod$2(3),
				every: createMethod$2(4),
				find: createMethod$2(5),
				findIndex: createMethod$2(6),
				filterReject: createMethod$2(7)
			};
			var getBuiltIn$3 = getBuiltIn$9;
			var definePropertyModule$2 = objectDefineProperty;
			var wellKnownSymbol$a = wellKnownSymbol$q;
			var DESCRIPTORS$6 = descriptors;
			var SPECIES$2 = wellKnownSymbol$a("species");
			var setSpecies$3 = function(CONSTRUCTOR_NAME) {
				var Constructor = getBuiltIn$3(CONSTRUCTOR_NAME);
				var defineProperty = definePropertyModule$2.f;
				if (DESCRIPTORS$6 && Constructor && !Constructor[SPECIES$2]) defineProperty(Constructor, SPECIES$2, {
					configurable: true,
					get: function() {
						return this;
					}
				});
			};
			var isCallable$4 = isCallable$n;
			var isObject$4 = isObject$f;
			var setPrototypeOf$1 = objectSetPrototypeOf;
			var inheritIfRequired$2 = function($this, dummy, Wrapper) {
				var NewTarget, NewTargetPrototype;
				if (setPrototypeOf$1 && isCallable$4(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject$4(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) setPrototypeOf$1($this, NewTargetPrototype);
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
				var index = 0;
				var length = list.length;
				var result = new C(length);
				while (length > index) result[index] = list[index++];
				return result;
			};
			var addGetter = function(it, key) {
				nativeDefineProperty$1(it, key, { get: function() {
					return getInternalState$2(this)[key];
				} });
			};
			var isArrayBuffer = function(it) {
				var klass;
				return isPrototypeOf$4(ArrayBufferPrototype, it) || (klass = classof$3(it)) == "ArrayBuffer" || klass == "SharedArrayBuffer";
			};
			var isTypedArrayIndex = function(target, key) {
				return isTypedArray(target) && !isSymbol$2(key) && key in target && isIntegralNumber(+key) && key >= 0;
			};
			var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
				key = toPropertyKey$1(key);
				return isTypedArrayIndex(target, key) ? createPropertyDescriptor$1(2, target[key]) : nativeGetOwnPropertyDescriptor$1(target, key);
			};
			var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
				key = toPropertyKey$1(key);
				if (isTypedArrayIndex(target, key) && isObject$3(descriptor) && hasOwn$7(descriptor, "value") && !hasOwn$7(descriptor, "get") && !hasOwn$7(descriptor, "set") && !descriptor.configurable && (!hasOwn$7(descriptor, "writable") || descriptor.writable) && (!hasOwn$7(descriptor, "enumerable") || descriptor.enumerable)) {
					target[key] = descriptor.value;
					return target;
				}
				return nativeDefineProperty$1(target, key, descriptor);
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
					var getter = function(that, index) {
						var data = getInternalState$2(that);
						return data.view[GETTER](index * BYTES + data.byteOffset, true);
					};
					var setter = function(that, index, value) {
						var data = getInternalState$2(that);
						if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 255 ? 255 : value & 255;
						data.view[SETTER](index * BYTES + data.byteOffset, value, true);
					};
					var addElement = function(that, index) {
						nativeDefineProperty$1(that, index, {
							get: function() {
								return getter(this, index);
							},
							set: function(value) {
								return setter(this, index, value);
							},
							enumerable: true
						});
					};
					if (!NATIVE_ARRAY_BUFFER_VIEWS$1) {
						TypedArrayConstructor = wrapper(function(that, data, offset, $length) {
							anInstance(that, TypedArrayConstructorPrototype);
							var index = 0;
							var byteOffset = 0;
							var buffer, byteLength, length;
							if (!isObject$3(data)) {
								length = toIndex(data);
								byteLength = length * BYTES;
								buffer = new ArrayBuffer$2(byteLength);
							} else if (isArrayBuffer(data)) {
								buffer = data;
								byteOffset = toOffset$1(offset, BYTES);
								var $len = data.byteLength;
								if ($length === void 0) {
									if ($len % BYTES) throw RangeError$2(WRONG_LENGTH);
									byteLength = $len - byteOffset;
									if (byteLength < 0) throw RangeError$2(WRONG_LENGTH);
								} else {
									byteLength = toLength$4($length) * BYTES;
									if (byteLength + byteOffset > $len) throw RangeError$2(WRONG_LENGTH);
								}
								length = byteLength / BYTES;
							} else if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
							else return call$9(typedArrayFrom, TypedArrayConstructor, data);
							setInternalState$1(that, {
								buffer,
								byteOffset,
								byteLength,
								length,
								view: new DataView$1(buffer)
							});
							while (index < length) addElement(that, index++);
						});
						if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
						TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create(TypedArrayPrototype$1);
					} else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
						TypedArrayConstructor = wrapper(function(dummy, data, typedArrayOffset, $length) {
							anInstance(dummy, TypedArrayConstructorPrototype);
							return inheritIfRequired$1(function() {
								if (!isObject$3(data)) return new NativeTypedArrayConstructor(toIndex(data));
								if (isArrayBuffer(data)) return $length !== void 0 ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES), $length) : typedArrayOffset !== void 0 ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES)) : new NativeTypedArrayConstructor(data);
								if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
								return call$9(typedArrayFrom, TypedArrayConstructor, data);
							}(), dummy, TypedArrayConstructor);
						});
						if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
						forEach$2(getOwnPropertyNames$1(NativeTypedArrayConstructor), function(key) {
							if (!(key in TypedArrayConstructor)) createNonEnumerableProperty$2(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
						});
						TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
					}
					if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) createNonEnumerableProperty$2(TypedArrayConstructorPrototype, "constructor", TypedArrayConstructor);
					enforceInternalState$1(TypedArrayConstructorPrototype).TypedArrayConstructor = TypedArrayConstructor;
					if (TYPED_ARRAY_TAG) createNonEnumerableProperty$2(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
					var FORCED = TypedArrayConstructor != NativeTypedArrayConstructor;
					exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;
					$$k({
						global: true,
						constructor: true,
						forced: FORCED,
						sham: !NATIVE_ARRAY_BUFFER_VIEWS$1
					}, exported);
					if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) createNonEnumerableProperty$2(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
					if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) createNonEnumerableProperty$2(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
					setSpecies$2(CONSTRUCTOR_NAME);
				};
			} else typedArrayConstructor.exports = function() {};
			(0, typedArrayConstructor.exports)("Uint8", function(init) {
				return function Uint8Array(data, byteOffset, length) {
					return init(this, data, byteOffset, length);
				};
			});
			var tryToString$1 = tryToString$6;
			var $TypeError$4 = TypeError;
			var deletePropertyOrThrow$1 = function(O, P) {
				if (!delete O[P]) throw $TypeError$4("Cannot delete property " + tryToString$1(P) + " of " + tryToString$1(O));
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
					if (from in O) O[to] = O[from];
					else deletePropertyOrThrow(O, to);
					to += inc;
					from += inc;
				}
				return O;
			};
			var uncurryThis$i = functionUncurryThis;
			var ArrayBufferViewCore$n = arrayBufferViewCore;
			var u$ArrayCopyWithin = uncurryThis$i(arrayCopyWithin);
			var aTypedArray$l = ArrayBufferViewCore$n.aTypedArray;
			(0, ArrayBufferViewCore$n.exportTypedArrayMethod)("copyWithin", function copyWithin(target, start) {
				return u$ArrayCopyWithin(aTypedArray$l(this), target, start, arguments.length > 2 ? arguments[2] : void 0);
			});
			var ArrayBufferViewCore$m = arrayBufferViewCore;
			var $every$1 = arrayIteration.every;
			var aTypedArray$k = ArrayBufferViewCore$m.aTypedArray;
			(0, ArrayBufferViewCore$m.exportTypedArrayMethod)("every", function every(callbackfn) {
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
			exportTypedArrayMethod$k("fill", function fill(value) {
				var length = arguments.length;
				aTypedArray$j(this);
				var actualValue = slice$1(classof$2(this), 0, 3) === "Big" ? toBigInt(value) : +value;
				return call$8($fill, this, actualValue, length > 1 ? arguments[1] : void 0, length > 2 ? arguments[2] : void 0);
			}, fails$j(function() {
				var count = 0;
				(/* @__PURE__ */ new Int8Array(2)).fill({ valueOf: function() {
					return count++;
				} });
				return count !== 1;
			}));
			var lengthOfArrayLike$5 = lengthOfArrayLike$c;
			var arrayFromConstructorAndList$1 = function(Constructor, list) {
				var index = 0;
				var length = lengthOfArrayLike$5(list);
				var result = new Constructor(length);
				while (length > index) result[index] = list[index++];
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
			(0, ArrayBufferViewCore$j.exportTypedArrayMethod)("filter", function filter(callbackfn) {
				var list = $filter(aTypedArray$i(this), callbackfn, arguments.length > 1 ? arguments[1] : void 0);
				return fromSpeciesAndList(this, list);
			});
			var ArrayBufferViewCore$i = arrayBufferViewCore;
			var $find = arrayIteration.find;
			var aTypedArray$h = ArrayBufferViewCore$i.aTypedArray;
			(0, ArrayBufferViewCore$i.exportTypedArrayMethod)("find", function find(predicate) {
				return $find(aTypedArray$h(this), predicate, arguments.length > 1 ? arguments[1] : void 0);
			});
			var ArrayBufferViewCore$h = arrayBufferViewCore;
			var $findIndex = arrayIteration.findIndex;
			var aTypedArray$g = ArrayBufferViewCore$h.aTypedArray;
			(0, ArrayBufferViewCore$h.exportTypedArrayMethod)("findIndex", function findIndex(predicate) {
				return $findIndex(aTypedArray$g(this), predicate, arguments.length > 1 ? arguments[1] : void 0);
			});
			var ArrayBufferViewCore$g = arrayBufferViewCore;
			var $forEach$2 = arrayIteration.forEach;
			var aTypedArray$f = ArrayBufferViewCore$g.aTypedArray;
			(0, ArrayBufferViewCore$g.exportTypedArrayMethod)("forEach", function forEach(callbackfn) {
				$forEach$2(aTypedArray$f(this), callbackfn, arguments.length > 1 ? arguments[1] : void 0);
			});
			var ArrayBufferViewCore$f = arrayBufferViewCore;
			var $includes$1 = arrayIncludes.includes;
			var aTypedArray$e = ArrayBufferViewCore$f.aTypedArray;
			(0, ArrayBufferViewCore$f.exportTypedArrayMethod)("includes", function includes(searchElement) {
				return $includes$1(aTypedArray$e(this), searchElement, arguments.length > 1 ? arguments[1] : void 0);
			});
			var ArrayBufferViewCore$e = arrayBufferViewCore;
			var $indexOf$1 = arrayIncludes.indexOf;
			var aTypedArray$d = ArrayBufferViewCore$e.aTypedArray;
			(0, ArrayBufferViewCore$e.exportTypedArrayMethod)("indexOf", function indexOf(searchElement) {
				return $indexOf$1(aTypedArray$d(this), searchElement, arguments.length > 1 ? arguments[1] : void 0);
			});
			var global$d = global$u;
			var fails$i = fails$D;
			var uncurryThis$g = functionUncurryThis;
			var ArrayBufferViewCore$d = arrayBufferViewCore;
			var ArrayIterators = es_array_iterator;
			var ITERATOR$1 = wellKnownSymbol$q("iterator");
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
			var typedArrayValues = function values() {
				return arrayValues(aTypedArray$c(this));
			};
			exportTypedArrayMethod$d("entries", function entries() {
				return arrayEntries(aTypedArray$c(this));
			}, GENERIC);
			exportTypedArrayMethod$d("keys", function keys() {
				return arrayKeys(aTypedArray$c(this));
			}, GENERIC);
			exportTypedArrayMethod$d("values", typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: "values" });
			exportTypedArrayMethod$d(ITERATOR$1, typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: "values" });
			var ArrayBufferViewCore$c = arrayBufferViewCore;
			var uncurryThis$f = functionUncurryThis;
			var aTypedArray$b = ArrayBufferViewCore$c.aTypedArray;
			var exportTypedArrayMethod$c = ArrayBufferViewCore$c.exportTypedArrayMethod;
			var $join = uncurryThis$f([].join);
			exportTypedArrayMethod$c("join", function join(separator) {
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
			var arrayLastIndexOf = NEGATIVE_ZERO$1 || !STRICT_METHOD$3 ? function lastIndexOf(searchElement) {
				if (NEGATIVE_ZERO$1) return apply$4($lastIndexOf$1, this, arguments) || 0;
				var O = toIndexedObject$4(this);
				var length = lengthOfArrayLike$4(O);
				var index = length - 1;
				if (arguments.length > 1) index = min$2(index, toIntegerOrInfinity$1(arguments[1]));
				if (index < 0) index = length + index;
				for (; index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
				return -1;
			} : $lastIndexOf$1;
			var ArrayBufferViewCore$b = arrayBufferViewCore;
			var apply$3 = functionApply;
			var $lastIndexOf = arrayLastIndexOf;
			var aTypedArray$a = ArrayBufferViewCore$b.aTypedArray;
			(0, ArrayBufferViewCore$b.exportTypedArrayMethod)("lastIndexOf", function lastIndexOf(searchElement) {
				var length = arguments.length;
				return apply$3($lastIndexOf, aTypedArray$a(this), length > 1 ? [searchElement, arguments[1]] : [searchElement]);
			});
			var ArrayBufferViewCore$a = arrayBufferViewCore;
			var $map = arrayIteration.map;
			var typedArraySpeciesConstructor$2 = typedArraySpeciesConstructor$4;
			var aTypedArray$9 = ArrayBufferViewCore$a.aTypedArray;
			(0, ArrayBufferViewCore$a.exportTypedArrayMethod)("map", function map(mapfn) {
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
					var self = IndexedObject(O);
					var length = lengthOfArrayLike$3(O);
					var index = IS_RIGHT ? length - 1 : 0;
					var i = IS_RIGHT ? -1 : 1;
					if (argumentsLength < 2) while (true) {
						if (index in self) {
							memo = self[index];
							index += i;
							break;
						}
						index += i;
						if (IS_RIGHT ? index < 0 : length <= index) throw $TypeError$3("Reduce of empty array with no initial value");
					}
					for (; IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) memo = callbackfn(memo, self[index], index, O);
					return memo;
				};
			};
			var arrayReduce = {
				left: createMethod$1(false),
				right: createMethod$1(true)
			};
			var ArrayBufferViewCore$9 = arrayBufferViewCore;
			var $reduce = arrayReduce.left;
			var aTypedArray$8 = ArrayBufferViewCore$9.aTypedArray;
			(0, ArrayBufferViewCore$9.exportTypedArrayMethod)("reduce", function reduce(callbackfn) {
				var length = arguments.length;
				return $reduce(aTypedArray$8(this), callbackfn, length, length > 1 ? arguments[1] : void 0);
			});
			var ArrayBufferViewCore$8 = arrayBufferViewCore;
			var $reduceRight = arrayReduce.right;
			var aTypedArray$7 = ArrayBufferViewCore$8.aTypedArray;
			(0, ArrayBufferViewCore$8.exportTypedArrayMethod)("reduceRight", function reduceRight(callbackfn) {
				var length = arguments.length;
				return $reduceRight(aTypedArray$7(this), callbackfn, length, length > 1 ? arguments[1] : void 0);
			});
			var ArrayBufferViewCore$7 = arrayBufferViewCore;
			var aTypedArray$6 = ArrayBufferViewCore$7.aTypedArray;
			var exportTypedArrayMethod$7 = ArrayBufferViewCore$7.exportTypedArrayMethod;
			var floor$2 = Math.floor;
			exportTypedArrayMethod$7("reverse", function reverse() {
				var that = this;
				var length = aTypedArray$6(that).length;
				var middle = floor$2(length / 2);
				var index = 0;
				var value;
				while (index < middle) {
					value = that[index];
					that[index++] = that[--length];
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
				var array = /* @__PURE__ */ new Uint8ClampedArray(2);
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
			exportTypedArrayMethod$6("set", function set(arrayLike) {
				aTypedArray$5(this);
				var offset = toOffset(arguments.length > 1 ? arguments[1] : void 0, 1);
				var src = toIndexedObject$3(arrayLike);
				if (WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS) return call$7($set, this, src, offset);
				var length = this.length;
				var len = lengthOfArrayLike$2(src);
				var index = 0;
				if (len + offset > length) throw RangeError$1("Wrong length");
				while (index < len) this[offset + index] = src[index++];
			}, !WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);
			var arraySlice$5 = functionUncurryThis([].slice);
			var ArrayBufferViewCore$5 = arrayBufferViewCore;
			var typedArraySpeciesConstructor$1 = typedArraySpeciesConstructor$4;
			var fails$f = fails$D;
			var arraySlice$4 = arraySlice$5;
			var aTypedArray$4 = ArrayBufferViewCore$5.aTypedArray;
			(0, ArrayBufferViewCore$5.exportTypedArrayMethod)("slice", function slice(start, end) {
				var list = arraySlice$4(aTypedArray$4(this), start, end);
				var C = typedArraySpeciesConstructor$1(this);
				var index = 0;
				var length = list.length;
				var result = new C(length);
				while (length > index) result[index] = list[index++];
				return result;
			}, fails$f(function() {
				(/* @__PURE__ */ new Int8Array(1)).slice();
			}));
			var ArrayBufferViewCore$4 = arrayBufferViewCore;
			var $some = arrayIteration.some;
			var aTypedArray$3 = ArrayBufferViewCore$4.aTypedArray;
			(0, ArrayBufferViewCore$4.exportTypedArrayMethod)("some", function some(callbackfn) {
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
				var element, j;
				while (i < length) {
					j = i;
					element = array[i];
					while (j && comparefn(array[j - 1], element) > 0) array[j] = array[--j];
					if (j !== i++) array[j] = element;
				}
				return array;
			};
			var merge = function(array, left, right, comparefn) {
				var llength = left.length;
				var rlength = right.length;
				var lindex = 0;
				var rindex = 0;
				while (lindex < llength || rindex < rlength) array[lindex + rindex] = lindex < llength && rindex < rlength ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++] : lindex < llength ? left[lindex++] : right[rindex++];
				return array;
			};
			var arraySort = mergeSort;
			var firefox = engineUserAgent.match(/firefox\/(\d+)/i);
			var engineFfVersion = !!firefox && +firefox[1];
			var UA = engineUserAgent;
			var engineIsIeOrEdge = /MSIE|Trident/.test(UA);
			var webkit = engineUserAgent.match(/AppleWebKit\/(\d+)\./);
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
				if (V8) return V8 < 74;
				if (FF) return FF < 67;
				if (IE_OR_EDGE) return true;
				if (WEBKIT) return WEBKIT < 602;
				var array = new Uint16Array$1(516);
				var expected = Array(516);
				var index = 0, mod;
				for (; index < 516; index++) {
					mod = index % 4;
					array[index] = 515 - index;
					expected[index] = index - 2 * mod + 3;
				}
				nativeSort(array, function(a, b) {
					return (a / 4 | 0) - (b / 4 | 0);
				});
				for (index = 0; index < 516; index++) if (array[index] !== expected[index]) return true;
			});
			var getSortCompare = function(comparefn) {
				return function(x, y) {
					if (comparefn !== void 0) return +comparefn(x, y) || 0;
					if (y !== y) return -1;
					if (x !== x) return 1;
					if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
					return x > y;
				};
			};
			exportTypedArrayMethod$3("sort", function sort(comparefn) {
				if (comparefn !== void 0) aCallable(comparefn);
				if (STABLE_SORT) return nativeSort(this, comparefn);
				return internalSort(aTypedArray$2(this), getSortCompare(comparefn));
			}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);
			var ArrayBufferViewCore$2 = arrayBufferViewCore;
			var toLength$3 = toLength$a;
			var toAbsoluteIndex$1 = toAbsoluteIndex$7;
			var typedArraySpeciesConstructor = typedArraySpeciesConstructor$4;
			var aTypedArray$1 = ArrayBufferViewCore$2.aTypedArray;
			(0, ArrayBufferViewCore$2.exportTypedArrayMethod)("subarray", function subarray(begin, end) {
				var O = aTypedArray$1(this);
				var length = O.length;
				var beginIndex = toAbsoluteIndex$1(begin, length);
				return new (typedArraySpeciesConstructor(O))(O.buffer, O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT, toLength$3((end === void 0 ? length : toAbsoluteIndex$1(end, length)) - beginIndex));
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
			exportTypedArrayMethod$1("toLocaleString", function toLocaleString() {
				return apply$2($toLocaleString, TO_LOCALE_STRING_BUG ? arraySlice$2(aTypedArray(this)) : aTypedArray(this), arraySlice$2(arguments));
			}, fails$d(function() {
				return [1, 2].toLocaleString() != new Int8Array$1([1, 2]).toLocaleString();
			}) || !fails$d(function() {
				Int8Array$1.prototype.toLocaleString.call([1, 2]);
			}));
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
			})) arrayToString = function toString() {
				return join(this);
			};
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
						return { foo: 1 };
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
			}, { slice: function slice(start, end) {
				var O = toIndexedObject$2(this);
				var length = lengthOfArrayLike$1(O);
				var k = toAbsoluteIndex(start, length);
				var fin = toAbsoluteIndex(end === void 0 ? length : end, length);
				var Constructor, result, n;
				if (isArray$2(O)) {
					Constructor = O.constructor;
					if (isConstructor(Constructor) && (Constructor === $Array || isArray$2(Constructor.prototype))) Constructor = void 0;
					else if (isObject$2(Constructor)) {
						Constructor = Constructor[SPECIES];
						if (Constructor === null) Constructor = void 0;
					}
					if (Constructor === $Array || Constructor === void 0) return nativeSlice(O, k, fin);
				}
				result = new (Constructor === void 0 ? $Array : Constructor)(max$1(fin - k, 0));
				for (n = 0; k < fin; k++, n++) if (k in O) createProperty$1(result, n, O[k]);
				result.length = n;
				return result;
			} });
			var $$i = _export;
			var ArrayBufferViewCore = arrayBufferViewCore;
			$$i({
				target: "ArrayBuffer",
				stat: true,
				forced: !ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS
			}, { isView: ArrayBufferViewCore.isView });
			var $$h = _export;
			var global$8 = global$u;
			var arrayBufferModule = arrayBuffer;
			var setSpecies$1 = setSpecies$3;
			var ARRAY_BUFFER = "ArrayBuffer";
			var ArrayBuffer$1 = arrayBufferModule[ARRAY_BUFFER];
			$$h({
				global: true,
				constructor: true,
				forced: global$8[ARRAY_BUFFER] !== ArrayBuffer$1
			}, { ArrayBuffer: ArrayBuffer$1 });
			setSpecies$1(ARRAY_BUFFER);
			var $TypeError$2 = TypeError;
			var MAX_SAFE_INTEGER = 0x1fffffffffffff;
			var doesNotExceedSafeInteger$1 = function(it) {
				if (it > MAX_SAFE_INTEGER) throw $TypeError$2("Maximum allowed index exceeded");
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
				if (!isObject$1(O)) return false;
				var spreadable = O[IS_CONCAT_SPREADABLE];
				return spreadable !== void 0 ? !!spreadable : isArray$1(O);
			};
			$$g({
				target: "Array",
				proto: true,
				arity: 1,
				forced: !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT
			}, { concat: function concat(arg) {
				var O = toObject$3(this);
				var A = arraySpeciesCreate(O, 0);
				var n = 0;
				var i = -1, k, length = arguments.length, len, E;
				for (; i < length; i++) {
					E = i === -1 ? O : arguments[i];
					if (isConcatSpreadable(E)) {
						len = lengthOfArrayLike(E);
						doesNotExceedSafeInteger(n + len);
						for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
					} else {
						doesNotExceedSafeInteger(n + 1);
						createProperty(A, n++, E);
					}
				}
				A.length = n;
				return A;
			} });
			var isRegExp$1 = isRegexp;
			var $TypeError$1 = TypeError;
			var notARegexp = function(it) {
				if (isRegExp$1(it)) throw $TypeError$1("The method doesn't accept regular expressions");
				return it;
			};
			var MATCH$1 = wellKnownSymbol$q("match");
			var correctIsRegexpLogic = function(METHOD_NAME) {
				var regexp = /./;
				try {
					"/./"[METHOD_NAME](regexp);
				} catch (error1) {
					try {
						regexp[MATCH$1] = false;
						return "/./"[METHOD_NAME](regexp);
					} catch (error2) {}
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
			$$f({
				target: "String",
				proto: true,
				forced: !(!CORRECT_IS_REGEXP_LOGIC && !!function() {
					var descriptor = getOwnPropertyDescriptor(String.prototype, "endsWith");
					return descriptor && !descriptor.writable;
				}()) && !CORRECT_IS_REGEXP_LOGIC
			}, { endsWith: function endsWith(searchString) {
				var that = toString$9(requireObjectCoercible$4(this));
				notARegExp$1(searchString);
				var endPosition = arguments.length > 1 ? arguments[1] : void 0;
				var len = that.length;
				var end = endPosition === void 0 ? len : min$1(toLength$2(endPosition), len);
				var search = toString$9(searchString);
				return nativeEndsWith ? nativeEndsWith(that, search, end) : slice(that, end - search.length, end) === search;
			} });
			_export({
				global: true,
				constructor: true,
				forced: !arrayBufferBasicDetection
			}, { DataView: arrayBuffer.DataView });
			(0, typedArrayConstructor.exports)("Uint16", function(init) {
				return function Uint16Array(data, byteOffset, length) {
					return init(this, data, byteOffset, length);
				};
			});
			var $forEach$1 = arrayIteration.forEach;
			var arrayForEach = !arrayMethodIsStrict$4("forEach") ? function forEach(callbackfn) {
				return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
			} : [].forEach;
			var $$d = _export;
			var forEach$1 = arrayForEach;
			$$d({
				target: "Array",
				proto: true,
				forced: [].forEach != forEach$1
			}, { forEach: forEach$1 });
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
			var classList = documentCreateElement$2("span").classList;
			var DOMTokenListPrototype$1 = classList && classList.constructor && classList.constructor.prototype;
			var domTokenListPrototype = DOMTokenListPrototype$1 === Object.prototype ? void 0 : DOMTokenListPrototype$1;
			var global$7 = global$u;
			var DOMIterables = domIterables;
			var DOMTokenListPrototype = domTokenListPrototype;
			var forEach = arrayForEach;
			var createNonEnumerableProperty$1 = createNonEnumerableProperty$9;
			var handlePrototype = function(CollectionPrototype) {
				if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
					createNonEnumerableProperty$1(CollectionPrototype, "forEach", forEach);
				} catch (error) {
					CollectionPrototype.forEach = forEach;
				}
			};
			for (var COLLECTION_NAME in DOMIterables) if (DOMIterables[COLLECTION_NAME]) handlePrototype(global$7[COLLECTION_NAME] && global$7[COLLECTION_NAME].prototype);
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
						default: string += "";
					}
				}
				return string;
			}
			function encodeUTF8(string) {
				var bytes = [];
				for (var i = 0; i < string.length; i++) {
					var charCode = string.charCodeAt(i);
					if (charCode < 128) bytes.push(charCode);
					else if (charCode < 2048) bytes.push(192 | charCode >> 6, 128 | charCode & 63);
					else if (charCode < 55296 || charCode >= 57344) bytes.push(224 | charCode >> 12, 128 | charCode >> 6 & 63, 128 | charCode & 63);
					else {
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
					case "utf-16be":
						var buffer = new ArrayBuffer(string.length * 2);
						var uint16 = new Uint16Array(buffer);
						var uint8 = new Uint8Array(buffer);
						for (var i = 0; i < string.length; i++) uint16[i] = string.charCodeAt(i);
						bytes = [255, 254];
						uint8.forEach(function(_byte) {
							return bytes.push(_byte);
						});
						break;
					default: for (var _i = 0; _i < string.length; _i++) bytes.push(string.charCodeAt(_i));
				}
				return bytes;
			}
			function isBuffer(param) {
				return param instanceof ArrayBuffer || typeof Buffer !== "undefined" && param instanceof Buffer;
			}
			var BufferView = /*#__PURE__*/ function(_DataView) {
				_inherits(BufferView, _DataView);
				var _super = _createSuper(BufferView);
				function BufferView() {
					_classCallCheck(this, BufferView);
					for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) params[_key] = arguments[_key];
					if (typeof params[0] === "number" || Array.isArray(params[0])) params[0] = new Uint8Array(params[0]);
					if (ArrayBuffer.isView(params[0])) params[0] = params[0].buffer;
					return _super.call.apply(_super, [this].concat(params));
				}
				_createClass(BufferView, [
					{
						key: "getString",
						value: function getString(offset, maxlength) {
							var format = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "windows1251";
							var string = "";
							var bytes = this.getUint8(offset, maxlength);
							if (!Array.isArray(bytes)) bytes = [bytes];
							switch (format) {
								case "utf8":
								case "utf-8":
									string = decodeUTF8(bytes);
									break;
								case "utf16":
								case "utf16be":
								case "utf-16":
								case "utf-16be":
									var le = null;
									if (bytes[0] === 255 && bytes[1] === 254) le = true;
									else if (bytes[0] === 254 && bytes[1] === 255) le = false;
									if (le !== null) {
										offset += 2;
										maxlength -= 2;
									}
									string = this.getUint16String(offset, maxlength, le === true);
									break;
								default: string = this.getUint8String(offset, maxlength);
							}
							return {
								string: string.endsWith("\0") ? string.substr(0, string.length - 1) : string,
								length: bytes.length
							};
						}
					},
					{
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
							if (!Array.isArray(bytes)) bytes = [bytes];
							for (var i = 0; i < bytes.length; i++) if (bytes[i] === 0) {
								limit = (i + 1) * bytesPerChar;
								break;
							}
							return this.getString(offset, limit, format);
						}
					},
					{
						key: "getUint8String",
						value: function getUint8String(offset, length) {
							var bytes = this.getUint8(offset, length);
							var string = "";
							if (!Array.isArray(bytes)) bytes = [bytes];
							for (var i = 0; i < bytes.length; i++) {
								var character = String.fromCharCode(bytes[i]);
								string += character;
							}
							return string;
						}
					},
					{
						key: "getUint16String",
						value: function getUint16String(offset, length) {
							var le = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
							var bytes = this.getUint16(offset, length, le);
							var string = "";
							if (!Array.isArray(bytes)) bytes = [bytes];
							for (var i = 0; i < bytes.length; i++) {
								var character = String.fromCharCode(bytes[i]);
								string += character;
							}
							return string;
						}
					},
					{
						key: "getUint8",
						value: function getUint8(offset) {
							var limit = offset + (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1);
							var bytes = [];
							if (this.byteLength - limit < 0) return false;
							for (var i = offset; i < limit; i++) {
								var _byte = DataView.prototype.getUint8.call(this, i);
								bytes.push(_byte);
							}
							return bytes.length === 1 ? bytes[0] : bytes;
						}
					},
					{
						key: "getUint16",
						value: function getUint16(offset) {
							var length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
							var le = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
							if (length % 2 !== 0) length -= 1;
							var limit = offset + length;
							var bytes = [];
							if (this.byteLength - limit < 0) return false;
							for (var i = offset; i < limit; i += 2) {
								var _byte2 = DataView.prototype.getUint16.call(this, i, le);
								bytes.push(_byte2);
							}
							return bytes.length === 1 ? bytes[0] : bytes;
						}
					}
				], [{
					key: "isViewable",
					value: function isViewable(param) {
						if (isBuffer(param) || Array.isArray(param) || ArrayBuffer.isView(param)) return true;
						return false;
					}
				}]);
				return BufferView;
			}(/*#__PURE__*/ _wrapNativeSuper(DataView));
			var uncurryThis$a = functionUncurryThis;
			var toObject$2 = toObject$b;
			var floor = Math.floor;
			var charAt$2 = uncurryThis$a("".charAt);
			var replace$4 = uncurryThis$a("".replace);
			var stringSlice$3 = uncurryThis$a("".slice);
			var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
			var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;
			var getSubstitution$1 = function(matched, str, position, captures, namedCaptures, replacement) {
				var tailPos = position + matched.length;
				var m = captures.length;
				var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
				if (namedCaptures !== void 0) {
					namedCaptures = toObject$2(namedCaptures);
					symbols = SUBSTITUTION_SYMBOLS;
				}
				return replace$4(replacement, symbols, function(match, ch) {
					var capture;
					switch (charAt$2(ch, 0)) {
						case "$": return "$";
						case "&": return matched;
						case "`": return stringSlice$3(str, 0, position);
						case "'": return stringSlice$3(str, tailPos);
						case "<":
							capture = namedCaptures[stringSlice$3(ch, 1, -1)];
							break;
						default:
							var n = +ch;
							if (n === 0) return match;
							if (n > m) {
								var f = floor(n / 10);
								if (f === 0) return match;
								if (f <= m) return captures[f - 1] === void 0 ? charAt$2(ch, 1) : captures[f - 1] + charAt$2(ch, 1);
								return match;
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
			var REPLACE = wellKnownSymbol$q("replace");
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
				if (/./[REPLACE]) return /./[REPLACE]("a", "$0") === "";
				return false;
			}();
			fixRegExpWellKnownSymbolLogic$1("replace", function(_, nativeReplace, maybeCallNative) {
				var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? "$" : "$0";
				return [function replace(searchValue, replaceValue) {
					var O = requireObjectCoercible$3(this);
					var replacer = isNullOrUndefined$1(searchValue) ? void 0 : getMethod$1(searchValue, REPLACE);
					return replacer ? call$6(replacer, searchValue, O, replaceValue) : call$6(nativeReplace, toString$8(O), searchValue, replaceValue);
				}, function(string, replaceValue) {
					var rx = anObject$4(this);
					var S = toString$8(string);
					if (typeof replaceValue == "string" && stringIndexOf$2(replaceValue, UNSAFE_SUBSTITUTE) === -1 && stringIndexOf$2(replaceValue, "$<") === -1) {
						var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
						if (res.done) return res.value;
					}
					var functionalReplace = isCallable$3(replaceValue);
					if (!functionalReplace) replaceValue = toString$8(replaceValue);
					var global = rx.global;
					if (global) {
						var fullUnicode = rx.unicode;
						rx.lastIndex = 0;
					}
					var results = [];
					while (true) {
						var result = regExpExec$1(rx, S);
						if (result === null) break;
						push$1(results, result);
						if (!global) break;
						if (toString$8(result[0]) === "") rx.lastIndex = advanceStringIndex$1(S, toLength$1(rx.lastIndex), fullUnicode);
					}
					var accumulatedResult = "";
					var nextSourcePosition = 0;
					for (var i = 0; i < results.length; i++) {
						result = results[i];
						var matched = toString$8(result[0]);
						var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
						var captures = [];
						for (var j = 1; j < result.length; j++) push$1(captures, maybeToString(result[j]));
						var namedCaptures = result.groups;
						if (functionalReplace) {
							var replacerArgs = concat([matched], captures, position, S);
							if (namedCaptures !== void 0) push$1(replacerArgs, namedCaptures);
							var replacement = toString$8(apply$1(replaceValue, void 0, replacerArgs));
						} else replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
						if (position >= nextSourcePosition) {
							accumulatedResult += stringSlice$2(S, nextSourcePosition, position) + replacement;
							nextSourcePosition = position + matched.length;
						}
					}
					return accumulatedResult + stringSlice$2(S, nextSourcePosition);
				}];
			}, !!fails$9(function() {
				var re = /./;
				re.exec = function() {
					var result = [];
					result.groups = { a: "7" };
					return result;
				};
				return "".replace(re, "$<a>") !== "7";
			}) || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);
			var uncurryThis$8 = functionUncurryThis;
			var defineBuiltIn$4 = defineBuiltIn$c;
			var DatePrototype = Date.prototype;
			var INVALID_DATE = "Invalid Date";
			var TO_STRING$1 = "toString";
			var nativeDateToString = uncurryThis$8(DatePrototype[TO_STRING$1]);
			var thisTimeValue = uncurryThis$8(DatePrototype.getTime);
			if (String(/* @__PURE__ */ new Date(NaN)) != INVALID_DATE) defineBuiltIn$4(DatePrototype, TO_STRING$1, function toString() {
				var value = thisTimeValue(this);
				return value === value ? nativeDateToString(this) : INVALID_DATE;
			});
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
			var nativeToString = RegExp.prototype[TO_STRING];
			var NOT_GENERIC = fails$8(function() {
				return nativeToString.call({
					source: "a",
					flags: "b"
				}) != "/a/b";
			});
			var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name != TO_STRING;
			if (NOT_GENERIC || INCORRECT_NAME) defineBuiltIn$3(RegExp.prototype, TO_STRING, function toString() {
				var R = anObject$3(this);
				var pattern = $toString$1(R.source);
				var flags = $toString$1(getRegExpFlags$1(R));
				return "/" + pattern + "/" + flags;
			}, { unsafe: true });
			var whitespaces$2 = "	\n\v\f\r \xA0              　\u2028\u2029﻿";
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
					if (TYPE & 1) string = replace$3(string, ltrim, "");
					if (TYPE & 2) string = replace$3(string, rtrim, "");
					return string;
				};
			};
			var stringTrim = {
				start: createMethod(1),
				end: createMethod(2),
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
			var numberParseInt = $parseInt$1(whitespaces + "08") !== 8 || $parseInt$1(whitespaces + "0x16") !== 22 || ITERATOR && !fails$7(function() {
				$parseInt$1(Object(ITERATOR));
			}) ? function parseInt(string, radix) {
				var S = trim(toString$6(string));
				return $parseInt$1(S, radix >>> 0 || (exec$2(hex, S) ? 16 : 10));
			} : $parseInt$1;
			var $$c = _export;
			var $parseInt = numberParseInt;
			$$c({
				global: true,
				forced: parseInt != $parseInt
			}, { parseInt: $parseInt });
			var $$b = _export;
			var $includes = arrayIncludes.includes;
			var fails$6 = fails$D;
			var addToUnscopables = addToUnscopables$2;
			$$b({
				target: "Array",
				proto: true,
				forced: fails$6(function() {
					return !Array(1).includes();
				})
			}, { includes: function includes(el) {
				return $includes(this, el, arguments.length > 1 ? arguments[1] : void 0);
			} });
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
			}, { indexOf: function indexOf(searchElement) {
				var fromIndex = arguments.length > 1 ? arguments[1] : void 0;
				return NEGATIVE_ZERO ? nativeIndexOf(this, searchElement, fromIndex) || 0 : $indexOf(this, searchElement, fromIndex);
			} });
			function isBitSet(_byte, bit) {
				return (_byte & 1 << bit) > 0;
			}
			function setBit(_byte2, bit) {
				return _byte2 | 1 << bit;
			}
			function decodeSynch(synch) {
				var out = 0;
				var mask = 0x7f000000;
				while (mask) {
					out >>= 1;
					out |= synch & mask;
					mask >>= 8;
				}
				return out;
			}
			function encodeSynch(size) {
				var out = 0;
				var mask = 127;
				while (mask ^ 0x7fffffff) {
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
				for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) params[_key] = arguments[_key];
				params.forEach(function(param) {
					if (param.forEach) param.forEach(function(_byte3) {
						return merged.push(_byte3);
					});
					else merged.push(param);
				});
				return new Uint8Array(merged);
			}
			function synch(unsynch) {
				var bytes = [];
				var i = 0;
				while (i < unsynch.length) {
					bytes.push(unsynch[i]);
					if (unsynch[i] === 255 && unsynch[i + 1] === 0) i++;
					i++;
				}
				return bytes;
			}
			function unsynch(synch) {
				var bytes = [];
				var i = 0;
				while (i < synch.length) {
					bytes.push(synch[i]);
					if (synch[i] === 255 && (synch[i + 1] >= 224 || synch[i + 1] === 0)) bytes.push(0);
					i++;
				}
				return bytes;
			}
			function dataBlock(data, max) {
				data = data || [];
				var bytes = [];
				var length = data.length;
				var offset = max - length;
				for (var i = 0; i < offset; i++) bytes.push(0);
				for (var _i = 0; _i < length; _i++) bytes.push(data[_i]);
				return bytes;
			}
			var GENRES = [
				"Blues",
				"Classic Rock",
				"Country",
				"Dance",
				"Disco",
				"Funk",
				"Grunge",
				"Hip-Hop",
				"Jazz",
				"Metal",
				"New Age",
				"Oldies",
				"Other",
				"Pop",
				"R&B",
				"Reggae",
				"Rock",
				"Techno",
				"Industrial",
				"Alternative",
				"Ska",
				"Death Metal",
				"Pranks",
				"Soundtrack",
				"Euro-Techno",
				"Ambient",
				"Trip-Hop",
				"Vocal",
				"Jazz+Funk",
				"Fusion",
				"Trance",
				"Classical",
				"Instrumental",
				"Acid",
				"House",
				"Game",
				"Sound Clip",
				"Gospel",
				"Noise",
				"Alt. Rock",
				"Bass",
				"Soul",
				"Punk",
				"Space",
				"Meditative",
				"Instrumental Pop",
				"Instrumental Rock",
				"Ethnic",
				"Gothic",
				"Darkwave",
				"Techno-Industrial",
				"Electronic",
				"Pop-Folk",
				"Eurodance",
				"Dream",
				"Southern Rock",
				"Comedy",
				"Cult",
				"Gangsta Rap",
				"Top 40",
				"Christian Rap",
				"Pop/Funk",
				"Jungle",
				"Native American",
				"Cabaret",
				"New Wave",
				"Psychedelic",
				"Rave",
				"Showtunes",
				"Trailer",
				"Lo-Fi",
				"Tribal",
				"Acid Punk",
				"Acid Jazz",
				"Polka",
				"Retro",
				"Musical",
				"Rock & Roll",
				"Hard Rock",
				"Folk",
				"Folk-Rock",
				"National Folk",
				"Swing",
				"Fast-Fusion",
				"Bebop",
				"Latin",
				"Revival",
				"Celtic",
				"Bluegrass",
				"Avantgarde",
				"Gothic Rock",
				"Progressive Rock",
				"Psychedelic Rock",
				"Symphonic Rock",
				"Slow Rock",
				"Big Band",
				"Chorus",
				"Easy Listening",
				"Acoustic",
				"Humour",
				"Speech",
				"Chanson",
				"Opera",
				"Chamber Music",
				"Sonata",
				"Symphony",
				"Booty Bass",
				"Primus",
				"Porn Groove",
				"Satire",
				"Slow Jam",
				"Club",
				"Tango",
				"Samba",
				"Folklore",
				"Ballad",
				"Power Ballad",
				"Rhythmic Soul",
				"Freestyle",
				"Duet",
				"Punk Rock",
				"Drum Solo",
				"A Cappella",
				"Euro-House",
				"Dance Hall",
				"Goa",
				"Drum & Bass",
				"Club-House",
				"Hardcore",
				"Terror",
				"Indie",
				"BritPop",
				"Afro-Punk",
				"Polsk Punk",
				"Beat",
				"Christian Gangsta Rap",
				"Heavy Metal",
				"Black Metal",
				"Crossover",
				"Contemporary Christian",
				"Christian Rock",
				"Merengue",
				"Salsa",
				"Thrash Metal",
				"Anime",
				"JPop",
				"Synthpop",
				"Abstract",
				"Art Rock",
				"Baroque",
				"Bhangra",
				"Big Beat",
				"Breakbeat",
				"Chillout",
				"Downtempo",
				"Dub",
				"EBM",
				"Eclectic",
				"Electro",
				"Electroclash",
				"Emo",
				"Experimental",
				"Garage",
				"Global",
				"IDM",
				"Illbient",
				"Industro-Goth",
				"Jam Band",
				"Krautrock",
				"Leftfield",
				"Lounge",
				"Math Rock",
				"New Romantic",
				"Nu-Breakz",
				"Post-Punk",
				"Post-Rock",
				"Psytrance",
				"Shoegaze",
				"Space Rock",
				"Trop Rock",
				"World Music",
				"Neoclassical",
				"Audiobook",
				"Audio Theatre",
				"Neue Deutsche Welle",
				"Podcast",
				"Indie Rock",
				"G-Funk",
				"Dubstep",
				"Garage Rock",
				"Psybient"
			];
			function hasID3v1(buffer) {
				var offset = buffer.byteLength - 128;
				if (offset > -1) return new BufferView(buffer, offset).getString(0, 3).string === "TAG";
				else return false;
			}
			function decode$1(buffer) {
				var view = new BufferView(buffer, buffer.byteLength - 128);
				var title = view.getString(3, 30, "utf-8").string.replace(/\0/g, "");
				var artist = view.getString(33, 30, "utf-8").string.replace(/\0/g, "");
				var album = view.getString(63, 30, "utf-8").string.replace(/\0/g, "");
				var year = view.getString(93, 4, "utf-8").string.replace(/\0/g, "");
				var track = view.getUint8(126).toString() || "";
				return {
					tags: {
						title,
						artist,
						album,
						year,
						track,
						comment: view.getString(97, track !== null ? 28 : 30, "utf-8").string.replace(/\0/g, ""),
						genre: GENRES[view.getUint8(127)] || ""
					},
					details: {
						version: track ? 1 : 0,
						size: 128
					}
				};
			}
			function validate$1(tags, strict) {
				var title = tags.title, artist = tags.artist, album = tags.album, year = tags.year, comment = tags.comment, track = tags.track, genre = tags.genre;
				if (typeof title !== "string") throw new Error("Title is not a string");
				else if (encodeString(title, "utf-8").length > 30) throw new Error("Title length exceeds 30 characters");
				if (typeof artist !== "string") throw new Error("Artist is not a string");
				else if (encodeString(artist, "utf-8").length > 30) throw new Error("Artist length exceeds 30 characters");
				if (typeof album !== "string") throw new Error("Album is not a string");
				else if (encodeString(album, "utf-8").length > 30) throw new Error("Album length exceeds 30 characters");
				if (typeof year !== "string") throw new Error("Year is not a string");
				else if (encodeString(year, "utf-8").length > 4) throw new Error("Year length exceeds 4 characters");
				if (typeof comment !== "string") throw new Error("Comment is not a string");
				if (typeof track !== "string") throw new Error("Track is not a string");
				else if (parseInt(track) > 255 || parseInt(track) < 0) throw new Error("Track should be in range 255 - 0");
				if (track !== "") {
					if (encodeString(comment, "utf-8").length > 28) throw new Error("Comment length exceeds 28 characters");
				} else if (encodeString(comment, "utf-8").length > 30) throw new Error("Comment length exceeds 30 characters");
				if (typeof genre !== "string") throw new Error("Genre is not a string");
				else if (strict && !GENRES.includes(genre) && genre !== "") throw new Error("Unknown genre");
				return true;
			}
			function encode$1(tags) {
				var title = tags.title, artist = tags.artist, album = tags.album, year = tags.year, comment = tags.comment, track = tags.track, genre = tags.genre;
				title = encodeString(title, "utf-8");
				artist = encodeString(artist, "utf-8");
				album = encodeString(album, "utf-8");
				year = encodeString(year, "utf-8");
				comment = encodeString(comment, "utf-8");
				genre = GENRES.indexOf(genre);
				while (title.length < 30) title.push(0);
				while (artist.length < 30) artist.push(0);
				while (album.length < 30) album.push(0);
				while (year.length < 4) year.push(0);
				if (track !== "") {
					while (comment.length < 28) comment.push(0);
					comment.push(0, parseInt(track));
				} else while (comment.length < 30) comment.push(0);
				return mergeBytes(84, 65, 71, title, artist, album, year, comment, genre > -1 ? genre : 12).buffer;
			}
			var makeBuiltIn = makeBuiltIn$3.exports;
			var defineProperty$3 = objectDefineProperty;
			var defineBuiltInAccessor$2 = function(target, name, descriptor) {
				if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
				if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
				return defineProperty$3.f(target, name, descriptor);
			};
			var global$5 = global$u;
			var DESCRIPTORS$4 = descriptors;
			var defineBuiltInAccessor$1 = defineBuiltInAccessor$2;
			var regExpFlags = regexpFlags$1;
			var fails$5 = fails$D;
			var RegExp$1 = global$5.RegExp;
			var RegExpPrototype$2 = RegExp$1.prototype;
			if (DESCRIPTORS$4 && fails$5(function() {
				var INDICES_SUPPORT = true;
				try {
					RegExp$1(".", "d");
				} catch (error) {
					INDICES_SUPPORT = false;
				}
				var O = {};
				var calls = "";
				var expected = INDICES_SUPPORT ? "dgimsy" : "gimsy";
				var addGetter = function(key, chr) {
					Object.defineProperty(O, key, { get: function() {
						calls += chr;
						return true;
					} });
				};
				var pairs = {
					dotAll: "s",
					global: "g",
					ignoreCase: "i",
					multiline: "m",
					sticky: "y"
				};
				if (INDICES_SUPPORT) pairs.hasIndices = "d";
				for (var key in pairs) addGetter(key, pairs[key]);
				return Object.getOwnPropertyDescriptor(RegExpPrototype$2, "flags").get.call(O) !== expected || calls !== expected;
			})) defineBuiltInAccessor$1(RegExpPrototype$2, "flags", {
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
			}, { includes: function includes(searchString) {
				return !!~stringIndexOf$1(toString$5(requireObjectCoercible$1(this)), toString$5(notARegExp(searchString)), arguments.length > 1 ? arguments[1] : void 0);
			} });
			var $$8 = _export;
			var toObject$1 = toObject$b;
			var nativeKeys = objectKeys$2;
			$$8({
				target: "Object",
				stat: true,
				forced: fails$D(function() {
					nativeKeys(1);
				})
			}, { keys: function keys(it) {
				return nativeKeys(toObject$1(it));
			} });
			function getHeaderFlags(_byte, version) {
				var flags = {};
				switch (version) {
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
				}
				return flags;
			}
			function getFrameFlags(bytes, version) {
				var flags = {};
				switch (version) {
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
				}
				return flags;
			}
			var ENCODINGS = [
				"windows1251",
				"utf-16",
				"utf-16be",
				"utf-8"
			];
			function textFrame$2(buffer, version) {
				var view = new BufferView(buffer);
				var encoding = ENCODINGS[view.getUint8(0)];
				var len = view.byteLength - 1;
				return version === 3 ? view.getCString(1, encoding).string.replace(/\//g, "\\\\") : view.getString(1, len, encoding).string.replace(/\0/g, "\\\\");
			}
			function setFrame$2(buffer, version) {
				var view = new BufferView(buffer);
				var encoding = ENCODINGS[view.getUint8(0)];
				var len = view.byteLength - 1;
				return version === 3 ? view.getCString(1, encoding).string : view.getString(1, len, encoding).string.replace(/\0/g, "\\\\");
			}
			function iplsFrame$1(buffer, version) {
				var view = new BufferView(buffer);
				var encoding = ENCODINGS[view.getUint8(0)];
				var len = view.byteLength - 1;
				return view.getString(1, len, encoding).string.replace(/\0/g, "\\\\");
			}
			function urlFrame$2(buffer, version) {
				return new BufferView(buffer).getCString(0).string;
			}
			function txxxFrame$2(buffer, version) {
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
			function wxxxFrame$2(buffer, version) {
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
			function langDescFrame$2(buffer, version) {
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
			function apicFrame$2(buffer, version) {
				var view = new BufferView(buffer);
				var encoding = ENCODINGS[view.getUint8(0)];
				var mime = view.getCString(1);
				var type = view.getUint8(mime.length + 1);
				var desc = view.getCString(mime.length + 2, encoding);
				var dataOffset = mime.length + desc.length + 2;
				var dataLength = view.byteLength - dataOffset;
				var data = view.getUint8(dataOffset, dataLength);
				return {
					format: mime.string,
					type,
					description: desc.string,
					data
				};
			}
			function geobFrame$2(buffer, version) {
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
			function ufidFrame$2(buffer, version) {
				var view = new BufferView(buffer);
				var ownerId = view.getCString(0);
				var id = view.getUint8(ownerId.length, view.byteLength - ownerId.length);
				return {
					ownerId: ownerId.string,
					id
				};
			}
			function userFrame$2(buffer, version) {
				var view = new BufferView(buffer);
				var encoding = ENCODINGS[view.getUint8(0)];
				return {
					language: view.getString(1, 3).string,
					text: view.getString(4, view.byteLength - 4, encoding).string
				};
			}
			function owneFrame$2(buffer, version) {
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
			function privFrame$2(buffer, version) {
				var view = new BufferView(buffer);
				var ownerId = view.getCString(0);
				var data = view.getUint8(ownerId.length, view.byteLength - ownerId.length);
				return {
					ownerId: ownerId.string,
					data
				};
			}
			function rvadFrame$2(buffer, version) {
				var view = new BufferView(buffer);
				var incdec = view.getUint8(0);
				var bitsvolume = view.getUint8(1);
				var datablocks = [];
				var blocklength = Math.ceil(bitsvolume / 8);
				for (var i = 2; i < view.byteLength; i += blocklength) datablocks.push(view.getUint8(i, blocklength));
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
			function rva2Frame$2(buffer, version) {
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
			function signFrame$2(buffer, version) {
				var view = new BufferView(buffer);
				return {
					group: view.getUint8(0),
					signature: view.getUint8(1, view.byteLength - 1)
				};
			}
			function seekFrame(buffer, version) {
				return new BufferView(buffer).getUint32(0);
			}
			function syltFrame$2(buffer, version) {
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
					while (ms.length < 3) ms = "0" + ms;
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
			function mcdiFrame$2(buffer, version) {
				var view = new BufferView(buffer);
				return { data: view.getUint8(0, view.byteLength) };
			}
			function sytcFrame$2(buffer, version) {
				var view = new BufferView(buffer);
				return {
					format: view.getUint8(0),
					data: view.getUint8(1, view.byteLength - 1)
				};
			}
			function win1251Frame$1(buffer, version) {
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
			fixRegExpWellKnownSymbolLogic("match", function(MATCH, nativeMatch, maybeCallNative) {
				return [function match(regexp) {
					var O = requireObjectCoercible(this);
					var matcher = isNullOrUndefined(regexp) ? void 0 : getMethod(regexp, MATCH);
					return matcher ? call$4(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString$4(O));
				}, function(string) {
					var rx = anObject$2(this);
					var S = toString$4(string);
					var res = maybeCallNative(nativeMatch, rx, S);
					if (res.done) return res.value;
					if (!rx.global) return regExpExec(rx, S);
					var fullUnicode = rx.unicode;
					rx.lastIndex = 0;
					var A = [];
					var n = 0;
					var result;
					while ((result = regExpExec(rx, S)) !== null) {
						var matchStr = toString$4(result[0]);
						A[n] = matchStr;
						if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
						n++;
					}
					return n === 0 ? null : A;
				}];
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
			objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
				return windowNames && classof$1(it) == "Window" ? getWindowNames(it) : $getOwnPropertyNames$1(toIndexedObject$1(it));
			};
			var wellKnownSymbolWrapped = {};
			wellKnownSymbolWrapped.f = wellKnownSymbol$q;
			var path = global$u;
			var hasOwn$5 = hasOwnProperty_1;
			var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
			var defineProperty$2 = objectDefineProperty.f;
			var wellKnownSymbolDefine = function(NAME) {
				var Symbol = path.Symbol || (path.Symbol = {});
				if (!hasOwn$5(Symbol, NAME)) defineProperty$2(Symbol, NAME, { value: wrappedWellKnownSymbolModule$1.f(NAME) });
			};
			var call$3 = functionCall;
			var getBuiltIn$2 = getBuiltIn$9;
			var wellKnownSymbol$2 = wellKnownSymbol$q;
			var defineBuiltIn$2 = defineBuiltIn$c;
			var symbolDefineToPrimitive = function() {
				var Symbol = getBuiltIn$2("Symbol");
				var SymbolPrototype = Symbol && Symbol.prototype;
				var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
				var TO_PRIMITIVE = wellKnownSymbol$2("toPrimitive");
				if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) defineBuiltIn$2(SymbolPrototype, TO_PRIMITIVE, function(hint) {
					return call$3(valueOf, this);
				}, { arity: 1 });
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
				return nativeObjectCreate(nativeDefineProperty({}, "a", { get: function() {
					return nativeDefineProperty(this, "a", { value: 7 }).a;
				} })).a != 7;
			}) ? function(O, P, Attributes) {
				var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
				if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
				nativeDefineProperty(O, P, Attributes);
				if (ObjectPrototypeDescriptor && O !== ObjectPrototype) nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
			} : nativeDefineProperty;
			var wrap = function(tag, description) {
				var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype$1);
				setInternalState(symbol, {
					type: SYMBOL,
					tag,
					description
				});
				if (!DESCRIPTORS$3) symbol.description = description;
				return symbol;
			};
			var $defineProperty = function defineProperty(O, P, Attributes) {
				if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
				anObject$1(O);
				var key = toPropertyKey(P);
				anObject$1(Attributes);
				if (hasOwn$4(AllSymbols, key)) {
					if (!Attributes.enumerable) {
						if (!hasOwn$4(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
						O[HIDDEN][key] = true;
					} else {
						if (hasOwn$4(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
						Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
					}
					return setSymbolDescriptor(O, key, Attributes);
				}
				return nativeDefineProperty(O, key, Attributes);
			};
			var $defineProperties = function defineProperties(O, Properties) {
				anObject$1(O);
				var properties = toIndexedObject(Properties);
				$forEach(objectKeys(properties).concat($getOwnPropertySymbols(properties)), function(key) {
					if (!DESCRIPTORS$3 || call$2($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
				});
				return O;
			};
			var $create = function create(O, Properties) {
				return Properties === void 0 ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
			};
			var $propertyIsEnumerable = function propertyIsEnumerable(V) {
				var P = toPropertyKey(V);
				var enumerable = call$2(nativePropertyIsEnumerable, this, P);
				if (this === ObjectPrototype && hasOwn$4(AllSymbols, P) && !hasOwn$4(ObjectPrototypeSymbols, P)) return false;
				return enumerable || !hasOwn$4(this, P) || !hasOwn$4(AllSymbols, P) || hasOwn$4(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
			};
			var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
				var it = toIndexedObject(O);
				var key = toPropertyKey(P);
				if (it === ObjectPrototype && hasOwn$4(AllSymbols, key) && !hasOwn$4(ObjectPrototypeSymbols, key)) return;
				var descriptor = nativeGetOwnPropertyDescriptor(it, key);
				if (descriptor && hasOwn$4(AllSymbols, key) && !(hasOwn$4(it, HIDDEN) && it[HIDDEN][key])) descriptor.enumerable = true;
				return descriptor;
			};
			var $getOwnPropertyNames = function getOwnPropertyNames(O) {
				var names = nativeGetOwnPropertyNames(toIndexedObject(O));
				var result = [];
				$forEach(names, function(key) {
					if (!hasOwn$4(AllSymbols, key) && !hasOwn$4(hiddenKeys, key)) push(result, key);
				});
				return result;
			};
			var $getOwnPropertySymbols = function(O) {
				var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
				var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
				var result = [];
				$forEach(names, function(key) {
					if (hasOwn$4(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn$4(ObjectPrototype, key))) push(result, AllSymbols[key]);
				});
				return result;
			};
			if (!NATIVE_SYMBOL$4) {
				$Symbol = function Symbol() {
					if (isPrototypeOf$2(SymbolPrototype$1, this)) throw TypeError$1("Symbol is not a constructor");
					var description = !arguments.length || arguments[0] === void 0 ? void 0 : $toString(arguments[0]);
					var tag = uid(description);
					var setter = function(value) {
						if (this === ObjectPrototype) call$2(setter, ObjectPrototypeSymbols, value);
						if (hasOwn$4(this, HIDDEN) && hasOwn$4(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
						setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
					};
					if (DESCRIPTORS$3 && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, {
						configurable: true,
						set: setter
					});
					return wrap(tag, description);
				};
				SymbolPrototype$1 = $Symbol[PROTOTYPE];
				defineBuiltIn$1(SymbolPrototype$1, "toString", function toString() {
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
					defineBuiltIn$1(ObjectPrototype, "propertyIsEnumerable", $propertyIsEnumerable, { unsafe: true });
				}
			}
			$$7({
				global: true,
				constructor: true,
				wrap: true,
				forced: !NATIVE_SYMBOL$4,
				sham: !NATIVE_SYMBOL$4
			}, { Symbol: $Symbol });
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
				create: $create,
				defineProperty: $defineProperty,
				defineProperties: $defineProperties,
				getOwnPropertyDescriptor: $getOwnPropertyDescriptor
			});
			$$7({
				target: "Object",
				stat: true,
				forced: !NATIVE_SYMBOL$4
			}, { getOwnPropertyNames: $getOwnPropertyNames });
			defineSymbolToPrimitive();
			setToStringTag($Symbol, SYMBOL);
			hiddenKeys[HIDDEN] = true;
			var symbolRegistryDetection = symbolConstructorDetection && !!Symbol["for"] && !!Symbol.keyFor;
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
			}, { "for": function(key) {
				var string = toString$3(key);
				if (hasOwn$3(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
				var symbol = getBuiltIn$1("Symbol")(string);
				StringToSymbolRegistry[string] = symbol;
				SymbolToStringRegistry$1[symbol] = string;
				return symbol;
			} });
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
			}, { keyFor: function keyFor(sym) {
				if (!isSymbol$1(sym)) throw TypeError(tryToString(sym) + " is not a symbol");
				if (hasOwn$2(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
			} });
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
				return $stringify([symbol]) != "[null]" || $stringify({ a: symbol }) != "{}" || $stringify(Object(symbol)) != "{}";
			});
			var ILL_FORMED_UNICODE = fails$2(function() {
				return $stringify("\udf06\ud834") !== "\"\\udf06\\ud834\"" || $stringify("\udead") !== "\"\\udead\"";
			});
			var stringifyWithSymbolsFix = function(it, replacer) {
				var args = arraySlice(arguments);
				var $replacer = replacer;
				if (!isObject(replacer) && it === void 0 || isSymbol(it)) return;
				if (!isArray(replacer)) replacer = function(key, value) {
					if (isCallable$2($replacer)) value = call$1($replacer, this, key, value);
					if (!isSymbol(value)) return value;
				};
				args[1] = replacer;
				return apply($stringify, null, args);
			};
			var fixIllFormed = function(match, offset, string) {
				var prev = charAt$1(string, offset - 1);
				var next = charAt$1(string, offset + 1);
				if (exec$1(low, match) && !exec$1(hi, next) || exec$1(hi, match) && !exec$1(low, prev)) return "\\u" + numberToString(charCodeAt(match, 0), 16);
				return match;
			};
			if ($stringify) $$4({
				target: "JSON",
				stat: true,
				arity: 3,
				forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE
			}, { stringify: function stringify(it, replacer, space) {
				var args = arraySlice(arguments);
				var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
				return ILL_FORMED_UNICODE && typeof result == "string" ? replace$2(result, tester, fixIllFormed) : result;
			} });
			var $$3 = _export;
			var NATIVE_SYMBOL$1 = symbolConstructorDetection;
			var fails$1 = fails$D;
			var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
			var toObject = toObject$b;
			$$3({
				target: "Object",
				stat: true,
				forced: !NATIVE_SYMBOL$1 || fails$1(function() {
					getOwnPropertySymbolsModule.f(1);
				})
			}, { getOwnPropertySymbols: function getOwnPropertySymbols(it) {
				var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
				return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
			} });
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
			if (DESCRIPTORS$2 && isCallable$1(NativeSymbol) && (!("description" in SymbolPrototype) || NativeSymbol().description !== void 0)) {
				var EmptyStringDescriptionStore = {};
				var SymbolWrapper = function Symbol() {
					var description = arguments.length < 1 || arguments[0] === void 0 ? void 0 : toString$2(arguments[0]);
					var result = isPrototypeOf$1(SymbolPrototype, this) ? new NativeSymbol(description) : description === void 0 ? NativeSymbol() : NativeSymbol(description);
					if (description === "") EmptyStringDescriptionStore[result] = true;
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
						if (hasOwn$1(EmptyStringDescriptionStore, symbol)) return "";
						var string = symbolDescriptiveString(symbol);
						var desc = NATIVE_SYMBOL ? stringSlice$1(string, 7, -1) : replace$1(string, regexp, "$1");
						return desc === "" ? void 0 : desc;
					}
				});
				$$2({
					global: true,
					constructor: true,
					forced: true
				}, { Symbol: SymbolWrapper });
			}
			var $$1 = _export;
			var $every = arrayIteration.every;
			$$1({
				target: "Array",
				proto: true,
				forced: !arrayMethodIsStrict$4("every")
			}, { every: function every(callbackfn) {
				return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
			} });
			var $ = _export;
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
			$({
				target: "RegExp",
				proto: true,
				forced: !DELEGATES_TO_EXEC
			}, { test: function(S) {
				var R = anObject(this);
				var string = toString$1(S);
				var exec = R.exec;
				if (!isCallable(exec)) return call(nativeTest, R, string);
				var result = call(exec, R, string);
				if (result === null) return false;
				anObject(result);
				return true;
			} });
			var defineProperty = objectDefineProperty.f;
			var proxyAccessor$1 = function(Target, Source, key) {
				key in Target || defineProperty(Target, key, {
					configurable: true,
					get: function() {
						return Source[key];
					},
					set: function(it) {
						Source[key] = it;
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
				var index = 0;
				var result = "";
				var brackets = false;
				var chr;
				for (; index <= length; index++) {
					chr = charAt(string, index);
					if (chr === "\\") {
						result += chr + charAt(string, ++index);
						continue;
					}
					if (!brackets && chr === ".") result += "[\\s\\S]";
					else {
						if (chr === "[") brackets = true;
						else if (chr === "]") brackets = false;
						result += chr;
					}
				}
				return result;
			};
			var handleNCG = function(string) {
				var length = string.length;
				var index = 0;
				var result = "";
				var named = [];
				var names = {};
				var brackets = false;
				var ncg = false;
				var groupid = 0;
				var groupname = "";
				var chr;
				for (; index <= length; index++) {
					chr = charAt(string, index);
					if (chr === "\\") chr = chr + charAt(string, ++index);
					else if (chr === "]") brackets = false;
					else if (!brackets) switch (true) {
						case chr === "[":
							brackets = true;
							break;
						case chr === "(":
							if (exec(IS_NCG, stringSlice(string, index + 1))) {
								index += 2;
								ncg = true;
							}
							result += chr;
							groupid++;
							continue;
						case chr === ">" && ncg:
							if (groupname === "" || hasOwn(names, groupname)) throw new SyntaxError("Invalid capture group name");
							names[groupname] = true;
							named[named.length] = [groupname, groupid];
							ncg = false;
							groupname = "";
							continue;
					}
					if (ncg) groupname += chr;
					else result += chr;
				}
				return [result, named];
			};
			if (isForced("RegExp", BASE_FORCED)) {
				var RegExpWrapper = function RegExp(pattern, flags) {
					var thisIsRegExp = isPrototypeOf(RegExpPrototype$1, this);
					var patternIsRegExp = isRegExp(pattern);
					var flagsAreUndefined = flags === void 0;
					var groups = [];
					var rawPattern = pattern;
					var rawFlags, dotAll, sticky, handled, result, state;
					if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) return pattern;
					if (patternIsRegExp || isPrototypeOf(RegExpPrototype$1, pattern)) {
						pattern = pattern.source;
						if (flagsAreUndefined) flags = getRegExpFlags(rawPattern);
					}
					pattern = pattern === void 0 ? "" : toString(pattern);
					flags = flags === void 0 ? "" : toString(flags);
					rawPattern = pattern;
					if (UNSUPPORTED_DOT_ALL && "dotAll" in re1) {
						dotAll = !!flags && stringIndexOf(flags, "s") > -1;
						if (dotAll) flags = replace(flags, /s/g, "");
					}
					rawFlags = flags;
					if (MISSED_STICKY$1 && "sticky" in re1) {
						sticky = !!flags && stringIndexOf(flags, "y") > -1;
						if (sticky && UNSUPPORTED_Y) flags = replace(flags, /y/g, "");
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
						if (sticky) state.sticky = true;
						if (groups.length) state.groups = groups;
					}
					if (pattern !== rawPattern) try {
						createNonEnumerableProperty(result, "source", rawPattern === "" ? "(?:)" : rawPattern);
					} catch (error) {}
					return result;
				};
				for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) proxyAccessor(RegExpWrapper, NativeRegExp, keys[index++]);
				RegExpPrototype$1.constructor = RegExpWrapper;
				RegExpWrapper.prototype = RegExpPrototype$1;
				defineBuiltIn(global$1, "RegExp", RegExpWrapper, { constructor: true });
			}
			setSpecies("RegExp");
			var DESCRIPTORS = descriptors;
			var MISSED_STICKY = regexpStickyHelpers.MISSED_STICKY;
			var classof = classofRaw$1;
			var defineBuiltInAccessor = defineBuiltInAccessor$2;
			var getInternalState = internalState.get;
			var RegExpPrototype = RegExp.prototype;
			var $TypeError = TypeError;
			if (DESCRIPTORS && MISSED_STICKY) defineBuiltInAccessor(RegExpPrototype, "sticky", {
				configurable: true,
				get: function sticky() {
					if (this === RegExpPrototype) return void 0;
					if (classof(this) === "RegExp") return !!getInternalState(this).sticky;
					throw $TypeError("Incompatible receiver, RegExp required");
				}
			});
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
				while (i < array.length && !included) if (objectEqual(array[i], object)) {
					included = true;
					break;
				} else i++;
				return included;
			}
			function objectEqual(obj1, obj2) {
				for (var prop in obj1) {
					if (_typeof(obj1[prop]) !== _typeof(obj2[prop])) return false;
					switch (_typeof(obj1[prop])) {
						case "object":
							if (!objectEqual(obj1[prop], obj2[prop])) return false;
							break;
						case "function":
							if (typeof obj2[prop] === "undefined" || obj1[prop].toString() !== obj2[prop].toString()) return false;
							break;
						default: if (obj1[prop] !== obj2[prop]) return false;
					}
				}
				for (var _prop in obj2) if (typeof obj1[_prop] === "undefined") return false;
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
						default: object[prop] = _typeof(defVal) === _typeof(usrVal) ? usrVal : defVal;
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
			function textFrame$1(value, version, strict) {
				if (typeof value !== "string") throw new Error("Value is not a string");
				if (strict && !value.match(stringRegex)) throw new Error("Newlines are not allowed");
				return true;
			}
			function setFrame$1(value, version, strict) {
				if (version === 3) value = [value];
				else if (version === 4) value = value.split("\\\\");
				value.forEach(function(set) {
					textFrame$1(set, version, strict);
					if (typeof set !== "string" && typeof set !== "number") throw new Error("Value is not a string/number");
					var match = set.match(setRegex);
					if (strict && typeof set === "string") {
						if (match === null) throw new Error("Invalid format (eg. 1/2)");
						var position = parseInt(match[1]);
						var total = match[2] ? parseInt(match[2].substr(1)) : null;
						if (total !== null && position > total) throw new Error("Position is greater then total");
					}
				});
				return true;
			}
			function timeFrame(value, version, strict) {
				if (version === 3) value = [value];
				else if (version === 4) value = value.split("\\\\");
				value.forEach(function(time) {
					textFrame$1(time, version, strict);
					if (version === 3 && strict && !time.match(/^(\d{4})$/)) throw new Error("Value is not 4 numeric characters");
					if (version === 4 && strict && !time.match(timeRegex)) throw new Error("Time frames must follow ISO 8601");
				});
				return true;
			}
			function tkeyFrame(value, version, strict) {
				if (version === 3) value = [value];
				else if (version === 4) value = value.split("\\\\");
				value.forEach(function(tkey) {
					textFrame$1(tkey, version, strict);
					if (strict && !tkey.match(/^([A-Gb#mo]{1,3})$/)) throw new Error("Invalid TKEY Format (eg Cbm)");
				});
				return true;
			}
			function tlanFrame(value, version, strict) {
				if (version === 3) value = [value];
				else if (version === 4) value = value.split("\\\\");
				value.forEach(function(tlan) {
					textFrame$1(tlan, version, strict);
					if (strict && !tlan.match(langRegex)) throw new Error("Language must follow ISO 639-2");
				});
				return true;
			}
			function tsrcFrame(value, version, strict) {
				if (version === 3) value = [value];
				else if (version === 4) value = value.split("\\\\");
				value.forEach(function(tsrc) {
					textFrame$1(tsrc, version, strict);
					if (strict && !tsrc.match(/^([A-Z0-9]{12})$/)) throw new Error("Invalid ISRC format");
				});
				return true;
			}
			function urlFrame$1(value, version, strict) {
				textFrame$1(value, version, strict);
				if (strict && !value.match(urlRegex)) throw new Error("Invalid URL");
				return true;
			}
			function txxxFrame$1(values, version, strict) {
				var descriptions = [];
				values.forEach(function(value) {
					textFrame$1(value.description, version, strict);
					textFrame$1(value.text, version, strict);
					if (strict && includes(descriptions, value.description)) throw new Error("Description should not duplicate");
					else descriptions.push(value.description);
				});
				return true;
			}
			function wxxxFrame$1(values, version, strict) {
				var descriptions = [];
				values.forEach(function(value) {
					textFrame$1(value.description, version, strict);
					urlFrame$1(value.url, version, strict);
					if (strict && includes(descriptions, value.description)) throw new Error("Description should not duplicate");
					else descriptions.push(value.description);
				});
				return true;
			}
			function langDescFrame$1(values, version, strict) {
				var langDescs = [];
				values.forEach(function(langDesc) {
					textFrame$1(langDesc.language, version, strict);
					textFrame$1(langDesc.descriptor, version, strict);
					if (typeof langDesc.text !== "string") throw new Error("Text is not a string");
					if (strict && !langDesc.language.match(langRegex)) throw new Error("Language must follow ISO 639-2");
					var checkObj = {
						language: langDesc.language,
						descriptor: langDesc.descriptor
					};
					if (strict && includes(langDescs, checkObj)) throw new Error("Language and descriptor should not duplicate");
					else langDescs.push(checkObj);
				});
				return true;
			}
			function apicFrame$1(values, version, strict) {
				var descriptions = [];
				values.forEach(function(apic) {
					textFrame$1(apic.format, version, strict);
					textFrame$1(apic.description, version, strict);
					if (typeof apic.type !== "number") throw new Error("Type is not a number");
					if (apic.type > 255 || apic.type < 0) throw new Error("Type should be in range of 0 - 255");
					if (!BufferView.isViewable(apic.data)) throw new Error("Image data should be viewable");
					if (strict) {
						if (apic.type > 21 || apic.type < 0) throw new Error("Type should be in range of 0 - 21");
						if (!apic.format.match(imageRegex)) throw new Error("Format should be an image MIME");
						if (apic.description.length > 64) throw new Error("Description should not exceed 64");
						if (includes(descriptions, apic.description)) throw new Error("Description should not duplicate");
						else descriptions.push(apic.description);
					}
				});
				return true;
			}
			function geobFrame$1(values, version, strict) {
				var descriptions = [];
				values.forEach(function(geob) {
					textFrame$1(geob.format, version, strict);
					textFrame$1(geob.filename, version, strict);
					textFrame$1(geob.description, version, strict);
					if (!BufferView.isViewable(geob.object)) throw new Error("Object data should be viewable");
					if (strict && includes(descriptions, geob.description)) throw new Error("GEOB description should not duplicate");
					else descriptions.push(geob.description);
				});
				return true;
			}
			function ufidFrame$1(values, version, strict) {
				var ownerIds = [];
				values.forEach(function(ufid) {
					textFrame$1(ufid.ownerId, version, strict);
					if (!BufferView.isViewable(ufid.id)) throw new Error("ID should be viewable");
					if (strict) {
						if (ufid.ownerId === "") throw new Error("ownerId should not be blank");
						if ((ufid.id.byteLength || ufid.id.length || 0) > 64) throw new Error("ID bytelength should not exceed 64 bytes");
						if (includes(ownerIds, ufid.ownerId)) throw new Error("ownerId should not duplicate");
						else ownerIds.push(ufid.ownerId);
					}
				});
				return true;
			}
			function userFrame$1(values, version, strict) {
				values.forEach(function(user) {
					textFrame$1(user.language, version, strict);
					if (typeof user.text !== "string") throw new Error("Text is not a string");
					if (strict && !user.language.match(langRegex)) throw new Error("Language must follow ISO 639-2");
				});
				return true;
			}
			function owneFrame$1(value, version, strict) {
				textFrame$1(value.date, version, strict);
				textFrame$1(value.seller, version, strict);
				textFrame$1(value.currencyCode, version, strict);
				textFrame$1(value.currencyPrice, version, strict);
				if (strict) {
					if (!value.date.match("".concat(year).concat(month).concat(day))) throw new Error("Date is not valid (format: YYYYMMDD)");
					if (!value.currencyCode.match(/^([A-Z]{3})$/)) throw new Error("Currency code is not valid (eg. USD)");
					if (!value.currencyPrice.match(/^(\d*)\.(\d+)$/)) throw new Error("Currency price is not valid (eg. 2.00)");
				}
				return true;
			}
			function privFrame$1(values, version, strict) {
				var contents = [];
				values.forEach(function(priv) {
					textFrame$1(priv.ownerId, version, strict);
					if (!BufferView.isViewable(priv.data)) throw new Error("Data should be viewable");
					if (strict && includes(contents, priv.data)) throw new Error("Data should not duplicate");
					else contents.push(priv.data);
				});
				return true;
			}
			function checkRvadData(object, props, limit, name) {
				for (var i = 0; i < props.length; i++) {
					var prop = props[i];
					var data = object[prop];
					if (data) {
						if (!BufferView.isViewable(data)) throw new Error("".concat(name, ".").concat(prop, " must be viewable"));
						if (new BufferView(data).byteLength > limit) throw new Error("".concat(name, ".").concat(prop, " exceeds bits limit"));
					}
				}
			}
			function rvadFrame$1(values, version, strict) {
				if (_typeof(values) !== "object") throw new Error("Values must be an object");
				var volumechange = values.volumechange;
				var peakvolume = values.peakvolume;
				var bitsvolume = values.bitsvolume || 16;
				var limit = Math.ceil(bitsvolume / 8);
				if (bitsvolume && (bitsvolume < 0 || bitsvolume > 255)) throw new Error("Bits volume should be in the range of 0 - 255");
				if (strict && bitsvolume === 0) throw new Error("Bits used for volume description may not be 0");
				var props = [
					"right",
					"left",
					"rightback",
					"leftback",
					"center",
					"bass"
				];
				if (volumechange) checkRvadData(volumechange, props, limit, "volumechange");
				if (peakvolume) checkRvadData(peakvolume, props, limit, "peakvolume");
				return true;
			}
			function rva2Frame$1(values, version, strict) {
				var frames = [];
				values.forEach(function(value) {
					if (!Array.isArray(value.channels)) throw new Error("Channels should be an array");
					for (var i = 0; i < value.channels.length; i++) {
						var channel = value.channels[i];
						if (typeof channel.type !== "number") throw new Error("Type of channel should be a number");
						if (strict && (channel.type < 0 || channel.type > 8)) throw new Error("Type of channel should be in the range of 0 - 8");
						if (typeof channel.volumeadjust !== "number") throw new Error("Volume adjustment should be a number");
						if (typeof channel.bitspeak !== "number") throw new Error("Bits representing peak should be a number");
						if (channel.bitspeak < 0 || channel.bitspeak > 255) throw new Error("Bits representing peak should be in range of 0 - 255");
						if (!BufferView.isViewable(channel.peakvolume)) throw new Error("Peak volume must be viewable");
						if (new BufferView(channel.peakvolume).byteLength > Math.ceil(channel.bitspeak / 8)) throw new Error("Peak volume exceeds bits limit");
					}
					var checkObj = { identification: value.identification };
					if (strict && includes(frames, checkObj)) throw new Error("RVA2 identification should be unique");
					else frames.push(checkObj);
				});
			}
			function signFrame$1(values, version, strict) {
				var signs = [];
				values.forEach(function(sign) {
					if (typeof sign.group !== "number") throw new Error("Group ID is not a number");
					if (sign.group < 0 || sign.group > 255) throw new Error("Group ID should be in the range of 0 - 255");
					if (!BufferView.isViewable(sign.signature)) throw new Error("Signature should be viewable");
					if (strict && includes(signs, sign)) throw new Error("SIGN contents should not be identical to others");
					else signs.push(sign);
				});
				return true;
			}
			function syltFrame$1(values, version, strict) {
				var sylts = [];
				values.forEach(function(sylt) {
					textFrame$1(sylt.language, version, strict);
					textFrame$1(sylt.descriptor, version, strict);
					if (typeof sylt.lyrics !== "string") throw new Error("Lyrics is not a string");
					if (typeof sylt.type !== "number") throw new Error("Type is not a number");
					else if (sylt.type > 255 || sylt.type < 0) throw new Error("Type should be in range of 0 - 255");
					if (typeof sylt.format !== "number") throw new Error("Format is not a number");
					else if (sylt.format > 255 || sylt.format < 0) throw new Error("Format should be in range of 0 - 255");
					if (strict) {
						if (!sylt.language.match(langRegex)) throw new Error("Language must follow ISO 639-2");
						if (sylt.type > 6 || sylt.type < 0) throw new Error("Type should be in range of 0 - 6");
						if (sylt.format > 2 || sylt.format < 1) throw new Error("Format should be either 1 or 2");
						if (!sylt.lyrics.split("\n").every(function(entry) {
							return syltRegex.test(entry);
						})) throw new Error("Lyrics must follow this format: [mm:ss.xxx]");
						var checkObj = {
							language: sylt.language,
							descriptor: sylt.descriptor
						};
						if (includes(sylts, checkObj)) throw new Error("1 SYLT with same language and descriptor only");
						else sylts.push(checkObj);
					}
				});
				return true;
			}
			function mcdiFrame$1(value, version, strict) {
				if (!BufferView.isViewable(value.data)) throw new Error("Data should be viewable");
				return true;
			}
			function sytcFrame$1(value, version, strict) {
				if (!BufferView.isViewable(value.data)) throw new Error("Data should be viewable");
				if (typeof value.format !== "number") throw new Error("Format is not a number");
				else if (value.format > 255 || value.format < 0) throw new Error("Format should be in range of 0 - 255");
				if (strict && (value.format > 2 || value.format < 1)) throw new Error("Invalid timestamp");
				return true;
			}
			(0, typedArrayConstructor.exports)("Int16", function(init) {
				return function Int16Array(data, byteOffset, length) {
					return init(this, data, byteOffset, length);
				};
			});
			function getHeaderBytes(id, size, version, flags) {
				var idBytes = encodeString(id);
				var sizeView = new BufferView(4);
				sizeView.setUint32(0, version === 3 ? size : encodeSynch(size));
				var flagsBytes = [0, 0];
				if (version === 4 && flags.unsynchronisation) flagsBytes[1] = setBit(flagsBytes[1], 1);
				if (version === 4 && flags.dataLengthIndicator) flagsBytes[1] = setBit(flagsBytes[1], 0);
				return mergeBytes(idBytes, sizeView.getUint8(0, 4), flagsBytes);
			}
			function unsynchData(data, version) {
				var sizeView = new BufferView(4);
				var dataBytes = unsynch(data);
				var content = [];
				if (version === 4) {
					sizeView.setUint32(0, encodeSynch(data.length));
					content.push.apply(content, _toConsumableArray(sizeView.getUint8(0, 4)));
				}
				dataBytes.forEach(function(_byte) {
					return content.push(_byte);
				});
				return new Uint8Array(content);
			}
			function textFrame(value, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var encoding = 0;
				var strBytes = [];
				switch (version) {
					case 3:
						encoding = 1;
						strBytes = encodeString(value.replace("\\\\", "/") + "\0", "utf-16");
						break;
					case 4:
						encoding = 3;
						strBytes = encodeString(value.replace("\\\\", "\0") + "\0", "utf-8");
				}
				var data = mergeBytes(encoding, strBytes);
				if (unsynch) data = unsynchData(data, version);
				return mergeBytes(getHeaderBytes(id, data.length, version, {
					unsynchronisation: unsynch,
					dataLengthIndicator: unsynch
				}), data);
			}
			function win1251Frame(value, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var strBytes = [];
				switch (version) {
					case 3:
						strBytes = encodeString(value.replace("\\\\", "/") + "\0");
						break;
					case 4: strBytes = encodeString(value.replace("\\\\", "\0") + "\0");
				}
				var data = mergeBytes(0, strBytes);
				if (unsynch) data = unsynchData(data, version);
				return mergeBytes(getHeaderBytes(id, data.length, version, {
					unsynchronisation: unsynch,
					dataLengthIndicator: unsynch
				}), data);
			}
			function setFrame(value, options) {
				var version = options.version;
				if (version === 3) value = value.toString().split("\\\\")[0];
				else if (version === 4) value = value.toString().replace("\\\\", "\0");
				return win1251Frame(value, options);
			}
			function urlFrame(value, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var strBytes = encodeString(value + "\0");
				if (unsynch) strBytes = unsynchData(strBytes, version);
				return mergeBytes(getHeaderBytes(id, strBytes.length, version, {
					unsynchronisation: unsynch,
					dataLengthIndicator: unsynch
				}), strBytes);
			}
			function txxxFrame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				values.forEach(function(txxx) {
					var encoding = 0;
					var descBytes, strBytes;
					switch (version) {
						case 3:
							encoding = 1;
							descBytes = encodeString(txxx.description + "\0", "utf-16");
							strBytes = encodeString(txxx.text + "\0", "utf-16");
							break;
						case 4:
							encoding = 3;
							descBytes = encodeString(txxx.description + "\0", "utf-8");
							strBytes = encodeString(txxx.text + "\0", "utf-8");
					}
					var data = mergeBytes(encoding, descBytes, strBytes);
					if (unsynch) data = unsynchData(data, version);
					mergeBytes(getHeaderBytes(id, data.length, version, {
						unsynchronisation: unsynch,
						dataLengthIndicator: unsynch
					}), data).forEach(function(_byte2) {
						return bytes.push(_byte2);
					});
				});
				return bytes;
			}
			function wxxxFrame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				values.forEach(function(wxxx) {
					var encoding = 0;
					var descBytes, strBytes;
					switch (version) {
						case 3:
							encoding = 1;
							descBytes = encodeString(wxxx.description + "\0", "utf-16");
							strBytes = encodeString(wxxx.url + "\0");
							break;
						case 4:
							encoding = 3;
							descBytes = encodeString(wxxx.description + "\0", "utf-8");
							strBytes = encodeString(wxxx.url + "\0");
					}
					var data = mergeBytes(encoding, descBytes, strBytes);
					if (unsynch) data = unsynchData(data, version);
					mergeBytes(getHeaderBytes(id, data.length, version, {
						unsynchronisation: unsynch,
						dataLengthIndicator: unsynch
					}), data).forEach(function(_byte3) {
						return bytes.push(_byte3);
					});
				});
				return bytes;
			}
			function iplsFrame(value, options) {
				options.version = 4;
				return textFrame(value, options);
			}
			function langDescFrame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				values.forEach(function(langDesc) {
					var encoding = 0;
					var langBytes = encodeString(langDesc.language);
					var descBytes, textBytes;
					switch (version) {
						case 3:
							encoding = 1;
							descBytes = encodeString(langDesc.descriptor + "\0", "utf-16");
							textBytes = encodeString(langDesc.text + "\0", "utf-16");
							break;
						case 4:
							encoding = 3;
							descBytes = encodeString(langDesc.descriptor + "\0", "utf-8");
							textBytes = encodeString(langDesc.text + "\0", "utf-8");
					}
					var data = mergeBytes(encoding, langBytes, descBytes, textBytes);
					if (unsynch) data = unsynchData(data, version);
					mergeBytes(getHeaderBytes(id, data.length, version, {
						unsynchronisation: unsynch,
						dataLengthIndicator: unsynch
					}), data).forEach(function(_byte4) {
						return bytes.push(_byte4);
					});
				});
				return bytes;
			}
			function apicFrame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				values.forEach(function(apic) {
					var encoding = 0;
					var mimeBytes = encodeString(apic.format + "\0");
					var imageBytes = new Uint8Array(apic.data);
					var strBytes = [];
					switch (version) {
						case 3:
							encoding = 1;
							strBytes = encodeString(apic.description + "\0", "utf-16");
							break;
						case 4:
							encoding = 3;
							strBytes = encodeString(apic.description + "\0", "utf-8");
					}
					var data = mergeBytes(encoding, mimeBytes, apic.type, strBytes, imageBytes);
					if (unsynch) data = unsynchData(data, version);
					mergeBytes(getHeaderBytes(id, data.length, version, {
						unsynchronisation: unsynch,
						dataLengthIndicator: unsynch
					}), data).forEach(function(_byte5) {
						return bytes.push(_byte5);
					});
				});
				return bytes;
			}
			function geobFrame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				values.forEach(function(geob) {
					var mime = encodeString(geob.format + "\0");
					var object = new Uint8Array(geob.object);
					var encoding, filename, description;
					switch (version) {
						case 3:
							encoding = 1;
							filename = encodeString(geob.filename + "\0", "utf-16");
							description = encodeString(geob.description + "\0", "utf-16");
							break;
						case 4:
							encoding = 3;
							filename = encodeString(geob.filename + "\0", "utf-8");
							description = encodeString(geob.description + "\0", "utf-8");
					}
					var data = mergeBytes(encoding, mime, filename, description, object);
					if (unsynch) data = unsynchData(data, version);
					mergeBytes(getHeaderBytes(id, data.length, version, {
						unsynchronisation: unsynch,
						dataLengthIndicator: unsynch
					}), data).forEach(function(_byte6) {
						return bytes.push(_byte6);
					});
				});
				return bytes;
			}
			function ufidFrame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				values.forEach(function(ufid) {
					var data = mergeBytes(encodeString(ufid.ownerId + "\0"), new Uint8Array(ufid.id));
					if (unsynch) data = unsynchData(data, version);
					mergeBytes(getHeaderBytes(id, data.length, version, {
						unsynchronisation: unsynch,
						dataLengthIndicator: unsynch
					}), data).forEach(function(_byte7) {
						return bytes.push(_byte7);
					});
				});
				return bytes;
			}
			function userFrame(value, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				var encoding = 0;
				var langBytes = encodeString(value.language);
				var textBytes;
				switch (version) {
					case 3:
						encoding = 1;
						textBytes = encodeString(value.text + "\0", "utf-16");
						break;
					case 4:
						encoding = 3;
						textBytes = encodeString(value.text + "\0", "utf-8");
				}
				var data = mergeBytes(encoding, langBytes, textBytes);
				if (unsynch) data = unsynchData(data, version);
				mergeBytes(getHeaderBytes(id, data.length, version, {
					unsynchronisation: unsynch,
					dataLengthIndicator: unsynch
				}), data).forEach(function(_byte8) {
					return bytes.push(_byte8);
				});
				return bytes;
			}
			function owneFrame(value, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var encoding = 0;
				var codeBytes = encodeString(value.currencyCode);
				var priceBytes = encodeString(value.currencyPrice + "\0");
				var dateBytes = encodeString(value.date);
				var sellerBytes;
				switch (version) {
					case 3:
						encoding = 1;
						sellerBytes = encodeString(value.seller, "utf-16");
						break;
					case 4:
						encoding = 3;
						sellerBytes = encodeString(value.seller, "utf-8");
				}
				var data = mergeBytes(encoding, codeBytes, priceBytes, dateBytes, sellerBytes);
				if (unsynch) data = unsynchData(data, version);
				return mergeBytes(getHeaderBytes(id, data.length, version, {
					unsynchronisation: unsynch,
					dataLengthIndicator: unsynch
				}), data);
			}
			function privFrame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				values.forEach(function(priv) {
					var data = mergeBytes(encodeString(priv.ownerId), new Uint8Array(priv.data));
					if (unsynch) data = unsynchData(data, version);
					mergeBytes(getHeaderBytes(id, data.length, version, {
						unsynchronisation: unsynch,
						dataLengthIndicator: unsynch
					}), data).forEach(function(_byte9) {
						return bytes.push(_byte9);
					});
				});
				return bytes;
			}
			function rvadFrame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				var bitsvolume = values.bitsvolume || 16;
				var limit = Math.ceil(bitsvolume / 8);
				var incdec = 0;
				if (values.incdec) {
					if (values.incdec.right) incdec = setBit(incdec, 0);
					if (values.incdec.left) incdec = setBit(incdec, 1);
					if (values.incdec.rightback) incdec = setBit(incdec, 2);
					if (values.incdec.leftback) incdec = setBit(incdec, 3);
					if (values.incdec.center) incdec = setBit(incdec, 4);
					if (values.incdec.bass) incdec = setBit(incdec, 5);
				}
				bytes.push(incdec);
				bytes.push(bitsvolume);
				var volumechange = values.volumechange || {};
				var peakvolume = values.peakvolume || {};
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
				var data = unsynch ? unsynchData(bytes) : bytes;
				return mergeBytes(getHeaderBytes(id, data.length, version, {
					unsynchronisation: unsynch,
					dataLengthIndicator: unsynch
				}), data);
			}
			function rva2Frame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				values.forEach(function(value) {
					var data = encodeString(value.identification + "\0");
					for (var i = 0; i < value.channels.length; i++) {
						var channel = value.channels[i];
						var type = channel.type;
						var volumeadjust = new Int16Array([channel.volumeadjust]);
						var volumeadjust8 = new Uint8Array(volumeadjust.buffer);
						var bitspeak = channel.bitspeak;
						var limit = Math.ceil(bitspeak / 8);
						var peakvolume = dataBlock(channel.peakvolume, limit);
						data = mergeBytes(data, type, volumeadjust8, bitspeak, peakvolume);
					}
					mergeBytes(getHeaderBytes(id, data.length, version, {
						unsynchronisation: unsynch,
						dataLengthIndicator: unsynch
					}), data).forEach(function(_byte22) {
						return bytes.push(_byte22);
					});
				});
				return bytes;
			}
			function signFrame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				values.forEach(function(sign) {
					var signature = new Uint8Array(sign.signature);
					var data = mergeBytes(sign.group, signature);
					if (unsynch) data = unsynchData(data, version);
					mergeBytes(getHeaderBytes(id, data.length, version, {
						unsynchronisation: unsynch,
						dataLengthIndicator: unsynch
					}), data).forEach(function(_byte23) {
						return bytes.push(_byte23);
					});
				});
				return bytes;
			}
			function syltFrame(values, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var bytes = [];
				values.forEach(function(sylt) {
					var encoding = 0;
					var langBytes = encodeString(sylt.language);
					var descBytes = [];
					switch (version) {
						case 3:
							encoding = 1;
							descBytes = encodeString(sylt.descriptor + "\0", "utf-16");
							break;
						case 4:
							encoding = 3;
							descBytes = encodeString(sylt.descriptor + "\0", "utf-8");
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
					var data = mergeBytes(encoding, langBytes, sylt.format, sylt.type, descBytes, lyricsBytes);
					if (unsynch) data = unsynchData(data, version);
					mergeBytes(getHeaderBytes(id, data.length, version, {
						unsynchronisation: unsynch,
						dataLengthIndicator: unsynch
					}), data).forEach(function(_byte24) {
						return bytes.push(_byte24);
					});
				});
				return bytes;
			}
			function mcdiFrame(value, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				if (unsynch) value.data = unsynchData(value.data, version);
				return mergeBytes(getHeaderBytes(id, value.data.length, version, {
					unsynchronisation: unsynch,
					dataLengthIndicator: unsynch
				}), value.data);
			}
			function sytcFrame(value, options) {
				var id = options.id, version = options.version, unsynch = options.unsynch;
				var data = mergeBytes(value.format, value.data);
				if (unsynch) data = unsynchData(data, version);
				return mergeBytes(getHeaderBytes(id, data.length, version, {
					unsynchronisation: unsynch,
					dataLengthIndicator: unsynch
				}), data);
			}
			var frames = /*#__PURE__*/ Object.freeze({
				__proto__: null,
				APIC: {
					parse: apicFrame$2,
					validate: apicFrame$1,
					write: apicFrame,
					version: [3, 4]
				},
				COMM: {
					parse: langDescFrame$2,
					validate: langDescFrame$1,
					write: langDescFrame,
					version: [3, 4]
				},
				GEOB: {
					parse: geobFrame$2,
					validate: geobFrame$1,
					write: geobFrame,
					version: [3, 4]
				},
				IPLS: {
					parse: iplsFrame$1,
					validate: textFrame$1,
					write: iplsFrame,
					version: [3]
				},
				MCDI: {
					parse: mcdiFrame$2,
					validate: mcdiFrame$1,
					write: mcdiFrame,
					version: [3, 4]
				},
				OWNE: {
					parse: owneFrame$2,
					validate: owneFrame$1,
					write: owneFrame,
					version: [3, 4]
				},
				PRIV: {
					parse: privFrame$2,
					validate: privFrame$1,
					write: privFrame,
					version: [3, 4]
				},
				RVAD: {
					parse: rvadFrame$2,
					validate: rvadFrame$1,
					write: rvadFrame,
					version: [3]
				},
				RVA2: {
					parse: rva2Frame$2,
					validate: rva2Frame$1,
					write: rva2Frame,
					version: [4]
				},
				SEEK: { parse: seekFrame },
				SIGN: {
					parse: signFrame$2,
					validate: signFrame$1,
					write: signFrame,
					version: [4]
				},
				SYLT: {
					parse: syltFrame$2,
					validate: syltFrame$1,
					write: syltFrame,
					version: [3, 4]
				},
				SYTC: {
					parse: sytcFrame$2,
					validate: sytcFrame$1,
					write: sytcFrame,
					version: [3, 4]
				},
				TALB: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TBPM: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: win1251Frame,
					version: [3, 4]
				},
				TCOM: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TCON: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TCOP: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TDAT: {
					parse: textFrame$2,
					validate: timeFrame,
					write: win1251Frame,
					version: [3]
				},
				TDEN: {
					parse: textFrame$2,
					validate: timeFrame,
					write: win1251Frame,
					version: [4]
				},
				TDLY: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: win1251Frame,
					version: [3]
				},
				TDOR: {
					parse: textFrame$2,
					validate: timeFrame,
					write: win1251Frame,
					version: [4]
				},
				TDRC: {
					parse: textFrame$2,
					validate: timeFrame,
					write: win1251Frame,
					version: [4]
				},
				TDRL: {
					parse: textFrame$2,
					validate: timeFrame,
					write: win1251Frame,
					version: [4]
				},
				TDTG: {
					parse: textFrame$2,
					validate: timeFrame,
					write: win1251Frame,
					version: [4]
				},
				TENC: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TEXT: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TFLT: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TIME: {
					parse: textFrame$2,
					validate: timeFrame,
					write: win1251Frame,
					version: [3]
				},
				TIPL: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [4]
				},
				TIT1: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TIT2: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TIT3: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TKEY: {
					parse: textFrame$2,
					validate: tkeyFrame,
					write: win1251Frame,
					version: [3, 4]
				},
				TLAN: {
					parse: textFrame$2,
					validate: tlanFrame,
					write: win1251Frame,
					version: [3, 4]
				},
				TLEN: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: win1251Frame,
					version: [3, 4]
				},
				TMCL: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [4]
				},
				TMED: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TMOO: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [4]
				},
				TOAL: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TOFN: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TOLY: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TOPE: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TORY: {
					parse: textFrame$2,
					validate: timeFrame,
					write: win1251Frame,
					version: [3]
				},
				TOWN: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TPE1: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TPE2: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TPE3: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TPE4: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TPOS: {
					parse: setFrame$2,
					validate: setFrame$1,
					write: setFrame,
					version: [3, 4]
				},
				TPRO: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [4]
				},
				TPUB: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TRCK: {
					parse: setFrame$2,
					validate: setFrame$1,
					write: setFrame,
					version: [3, 4]
				},
				TRDA: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3]
				},
				TRSN: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TRSO: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TSIZ: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: win1251Frame,
					version: [3]
				},
				TSOA: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [4]
				},
				TSOC: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [4]
				},
				TSOP: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [4]
				},
				TSOT: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [4]
				},
				TSRC: {
					parse: textFrame$2,
					validate: tsrcFrame,
					write: win1251Frame,
					version: [3, 4]
				},
				TSSE: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [3, 4]
				},
				TSST: {
					parse: textFrame$2,
					validate: textFrame$1,
					write: textFrame,
					version: [4]
				},
				TYER: {
					parse: textFrame$2,
					validate: timeFrame,
					write: win1251Frame,
					version: [3]
				},
				TXXX: {
					parse: txxxFrame$2,
					validate: txxxFrame$1,
					write: txxxFrame,
					version: [3, 4]
				},
				UFID: {
					parse: ufidFrame$2,
					validate: ufidFrame$1,
					write: ufidFrame,
					version: [3, 4]
				},
				USER: {
					parse: userFrame$2,
					validate: userFrame$1,
					write: userFrame,
					version: [3, 4]
				},
				USLT: {
					parse: langDescFrame$2,
					validate: langDescFrame$1,
					write: langDescFrame,
					version: [3, 4]
				},
				WCOM: {
					parse: urlFrame$2,
					validate: urlFrame$1,
					write: urlFrame,
					version: [3, 4]
				},
				WCOP: {
					parse: urlFrame$2,
					validate: urlFrame$1,
					write: urlFrame,
					version: [3, 4]
				},
				WFED: {
					parse: win1251Frame$1,
					validate: urlFrame$1,
					write: win1251Frame,
					version: [3, 4]
				},
				TGID: {
					parse: win1251Frame$1,
					validate: urlFrame$1,
					write: win1251Frame,
					version: [3, 4]
				},
				WOAF: {
					parse: urlFrame$2,
					validate: urlFrame$1,
					write: urlFrame,
					version: [3, 4]
				},
				WOAR: {
					parse: urlFrame$2,
					validate: urlFrame$1,
					write: urlFrame,
					version: [3, 4]
				},
				WOAS: {
					parse: urlFrame$2,
					validate: urlFrame$1,
					write: urlFrame,
					version: [3, 4]
				},
				WORS: {
					parse: urlFrame$2,
					validate: urlFrame$1,
					write: urlFrame,
					version: [3, 4]
				},
				WPAY: {
					parse: urlFrame$2,
					validate: urlFrame$1,
					write: urlFrame,
					version: [3, 4]
				},
				WPUB: {
					parse: urlFrame$2,
					validate: urlFrame$1,
					write: urlFrame,
					version: [3, 4]
				},
				WXXX: {
					parse: wxxxFrame$2,
					validate: wxxxFrame$1,
					write: wxxxFrame,
					version: [3, 4]
				}
			});
			function hasID3v2(buffer) {
				return new BufferView(buffer).getString(0, 3).string === "ID3";
			}
			function decode(buffer) {
				var view = new BufferView(buffer, arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0);
				var version = view.getUint8(3, 2);
				var size = decodeSynch(view.getUint32(6));
				var flags = getHeaderFlags(view.getUint8(5), version[0]);
				var details = {
					version,
					flags,
					size
				};
				var tags = {};
				if (version[0] !== 3 && version[0] !== 4) throw new Error("Unknown ID3v2 major version");
				var offset = 10;
				var limit = size;
				var pushTag = function pushTag(tag) {
					var singleFrame = [
						"USER",
						"OWNE",
						"MCDI",
						"RVAD",
						"SYTC"
					];
					switch (_typeof(tag.value)) {
						case "number":
						case "string":
							tag.value = tag.value.toString();
							if (tags[tag.id]) tags[tag.id] += "\\\\" + tag.value;
							else tags[tag.id] = tag.value;
							break;
						case "object": if (singleFrame.includes(tag.id)) tags[tag.id] = tag.value;
						else if (tags[tag.id]) tags[tag.id].push(tag.value);
						else tags[tag.id] = [tag.value];
					}
				};
				while (offset < size) {
					var frame = decodeFrame(view.getUint8(offset, limit), {
						version,
						flags
					});
					if (!frame) break;
					offset += frame.size + 10;
					limit -= frame.size + 10;
					if (frame.id === "SEEK") {
						var seekedTags = decode(buffer, offset + frame.value);
						for (var id in seekedTags) pushTag({
							id,
							value: seekedTags[id]
						});
					} else pushTag({
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
				if (view.getUint8(0) === 0) return false;
				var frame = {};
				var version = options.version, flags = options.flags;
				var sizeByte = view.getUint32(4);
				frame.id = view.getUint8String(0, 4);
				frame.flags = getFrameFlags(view.getUint8(8, 2), version[0]);
				frame.size = version[0] === 4 ? decodeSynch(sizeByte) : sizeByte;
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
				if (version === 4) unsynchedData = frame.flags.unsynchronisation;
				if (unsynchedData) {
					var uint8 = view.getUint8(offset, dataLength);
					var unsynched = synch(Array.isArray(uint8) ? uint8 : [uint8]);
					contents = new Uint8Array(unsynched);
				} else {
					var _uint = view.getUint8(offset, actualSize);
					contents = new Uint8Array(Array.isArray(_uint) ? _uint : [_uint]);
				}
				frame.value = frameSpec.parse(contents.buffer, version[0]);
				return frame;
			}
			function validate(tags, strict, options) {
				var version = options.version;
				if (version !== 3 && version !== 4) throw new Error("Unknown provided version");
				for (var id in tags) {
					if (!Object.keys(frames).includes(id)) continue;
					var frameSpec = frames[id];
					if (strict && !frameSpec.version.includes(version)) throw new Error("".concat(id, " is not supported in ID3v2.").concat(version));
					try {
						frameSpec.validate(tags[id], version, strict);
					} catch (error) {
						throw new Error("".concat(error.message, " at ").concat(id));
					}
				}
				return true;
			}
			function encode(tags, options) {
				var version = options.version, padding = options.padding, unsynch = options.unsynch;
				var headerBytes = [
					73,
					68,
					51,
					version,
					0
				];
				var flagsByte = 0;
				var sizeView = new BufferView(4);
				var paddingBytes = new Uint8Array(padding);
				var framesBytes = [];
				for (var id in tags) frames[id].write(tags[id], {
					id,
					version,
					unsynch
				}).forEach(function(_byte) {
					return framesBytes.push(_byte);
				});
				if (unsynch) flagsByte = setBit(flagsByte, 7);
				sizeView.setUint32(0, encodeSynch(framesBytes.length));
				return mergeBytes(headerBytes, flagsByte, sizeView.getUint8(0, 4), framesBytes, paddingBytes).buffer;
			}
			return /* @__PURE__ */ function() {
				function MP3Tag(buffer) {
					var verbose = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
					_classCallCheck(this, MP3Tag);
					if (!isBuffer(buffer)) throw new TypeError("buffer is not ArrayBuffer/Buffer");
					this.name = "MP3Tag";
					this.version = "3.3.2";
					this.verbose = verbose;
					this.buffer = buffer;
					this.tags = {};
					this.error = "";
				}
				_createClass(MP3Tag, [
					{
						key: "read",
						value: function read() {
							var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
							this.tags = {};
							this.error = "";
							try {
								this.tags = MP3Tag.readBuffer(this.buffer, options, this.verbose);
							} catch (error) {
								this.error = error.message;
							}
							return this.tags;
						}
					},
					{
						key: "save",
						value: function save() {
							var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
							this.error = "";
							var buffer = this.buffer;
							try {
								buffer = MP3Tag.writeBuffer(this.buffer, this.tags, options, this.verbose);
							} catch (error) {
								this.error = error.message;
							}
							if (this.error === "") this.buffer = buffer;
							return this.buffer;
						}
					},
					{
						key: "remove",
						value: function remove() {
							this.tags = {};
							this.error = "";
							this.buffer = this.getAudio();
							return true;
						}
					},
					{
						key: "getAudio",
						value: function getAudio() {
							return MP3Tag.getAudioBuffer(this.buffer);
						}
					}
				], [
					{
						key: "readBuffer",
						value: function readBuffer(buffer) {
							var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
							var verbose = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
							if (!isBuffer(buffer)) throw new TypeError("buffer is not ArrayBuffer/Buffer");
							var tags = {};
							options = overwriteDefault(options, {
								id3v1: true,
								id3v2: true
							});
							if (options.id3v1 && hasID3v1(buffer)) {
								if (verbose) console.log("ID3v1 found, reading...");
								var _ID3v1$decode = decode$1(buffer), v1Tags = _ID3v1$decode.tags, details = _ID3v1$decode.details;
								if (verbose) console.log("ID3v1 reading finished");
								tags.v1 = _objectSpread2({}, v1Tags);
								tags.v1Details = details;
							}
							if (options.id3v2 && hasID3v2(buffer)) {
								if (verbose) console.log("ID3v2 found, reading...");
								var _ID3v2$decode = decode(buffer), v2Tags = _ID3v2$decode.tags, _details = _ID3v2$decode.details;
								if (verbose) console.log("ID3v2 reading finished");
								tags.v2 = _objectSpread2({}, v2Tags);
								tags.v2Details = _details;
							}
							Object.defineProperties(tags, {
								title: {
									get: function get() {
										return this.v2 && this.v2.TIT2 || this.v1 && this.v1.title || "";
									},
									set: function set(value) {
										if (this.v2) this.v2.TIT2 = value;
										if (this.v1) this.v1.title = value;
									}
								},
								artist: {
									get: function get() {
										return this.v2 && this.v2.TPE1 || this.v1 && this.v1.artist || "";
									},
									set: function set(value) {
										if (this.v2) this.v2.TPE1 = value;
										if (this.v1) this.v1.artist = value;
									}
								},
								album: {
									get: function get() {
										return this.v2 && this.v2.TALB || this.v1 && this.v1.album || "";
									},
									set: function set(value) {
										if (this.v2) this.v2.TALB = value;
										if (this.v1) this.v1.album = value;
									}
								},
								year: {
									get: function get() {
										return this.v2 && (this.v2.TYER || this.v2.TDRC) || this.v1 && this.v1.year || "";
									},
									set: function set(value) {
										if (this.v2) {
											var version = this.v2Details.version[0];
											if (version === 3) this.v2.TYER = value;
											else if (version === 4) this.v2.TDRC = value;
										}
										if (this.v1) this.v1.year = value;
									}
								},
								comment: {
									get: function get() {
										var text = "";
										if (this.v2 && this.v2.COMM) {
											var comm = this.v2.COMM;
											if (Array.isArray(comm) && comm.length > 0) text = comm[0].text;
										} else if (this.v1 && this.v1.comment) text = this.v1.comment;
										return text;
									},
									set: function set(value) {
										if (this.v2) this.v2.COMM = [{
											language: "eng",
											descriptor: "",
											text: value
										}];
										if (this.v1) this.v1.comment = value;
									}
								},
								track: {
									get: function get() {
										return this.v2 && this.v2.TRCK && this.v2.TRCK.split("/")[0] || this.v1 && this.v1.track || "";
									},
									set: function set(value) {
										if (this.v2) this.v2.TRCK = value;
										if (this.v1) this.v1.track = value;
									}
								},
								genre: {
									get: function get() {
										return this.v2 && this.v2.TCON || this.v1 && this.v1.genre || "";
									},
									set: function set(value) {
										if (this.v2) this.v2.TCON = value;
										if (this.v1) this.v1.genre = value;
									}
								}
							});
							return tags;
						}
					},
					{
						key: "writeBuffer",
						value: function writeBuffer(buffer, tags) {
							var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
							var verbose = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
							var defaultVersion = tags.v2Details ? tags.v2Details.version[0] : 3;
							var audio = new Uint8Array(MP3Tag.getAudioBuffer(buffer));
							options = overwriteDefault(options, {
								strict: false,
								id3v1: { include: false },
								id3v2: {
									include: true,
									unsynch: false,
									version: defaultVersion,
									padding: 2048
								}
							});
							if (options.id3v1.include) {
								if (verbose) console.log("Validating ID3v1...");
								validate$1(tags.v1, options.strict);
								if (verbose) console.log("Writing ID3v1...");
								var encoded = encode$1(tags.v1);
								var tagBytes = new Uint8Array(encoded);
								audio = mergeBytes(audio, tagBytes);
							}
							if (options.id3v2.include) {
								if (verbose) console.log("Validating ID3v2...");
								validate(tags.v2, options.strict, options.id3v2);
								if (verbose) console.log("Writing ID3v2...");
								var _encoded = encode(tags.v2, options.id3v2);
								audio = mergeBytes(new Uint8Array(_encoded), audio);
							}
							return audio.buffer;
						}
					},
					{
						key: "getAudioBuffer",
						value: function getAudioBuffer(buffer) {
							if (!isBuffer(buffer)) throw new TypeError("buffer is not ArrayBuffer/Buffer");
							if (hasID3v1(buffer)) buffer = buffer.slice(0, buffer.byteLength - 128);
							var view = new BufferView(buffer);
							var start = 0;
							var i = 0;
							while (i < view.byteLength) if (view.getUint8(i) === 255 && view.getUint8(i + 1) === 251) {
								start = i;
								break;
							} else i++;
							return buffer.slice(start);
						}
					}
				]);
				return MP3Tag;
			}();
		}));
	})))());
	var CatboxUrlPrefix = "https://ladist1.catbox.video/";
	var Downloader = class {
		name = "Downloader";
		options;
		view;
		_enabled = false;
		currentSongInfo;
		isAutoDlRunning;
		answerResultListener;
		constructor() {
			this.isAutoDlRunning = false;
			this.options = new Options({ title: this.name });
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
				choices: [{
					label: "Audio",
					value: "Audio"
				}, {
					label: "Video",
					value: "Video"
				}]
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
				if (videoDlBtn.self.data("url") !== void 0) this.downloadSongData(videoDlBtn.self.data("url"), !this.isAutoDlRunning);
			});
			audioDlBtn.self.on("click", () => {
				if (audioDlBtn.self.data("url") !== void 0) this.downloadSongData(audioDlBtn.self.data("url"), !this.isAutoDlRunning);
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
				let videoURL = result.songInfo.videoTargetMap.catbox[resolution];
				if (videoURL !== void 0) {
					videoDlBtn.self.data("url", CatboxUrlPrefix + videoURL).removeClass("disabled");
					break;
				}
			}
			const audioURL = result.songInfo.videoTargetMap.catbox["0"];
			if (audioURL !== void 0) audioDlBtn.self.data("url", CatboxUrlPrefix + audioURL).removeClass("disabled");
			else audioDlBtn.self.removeData("url").addClass("disabled");
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
				if (!this.options.get("autoDlOnWrong").getValue() || isCorrect !== void 0 && !isCorrect) {
					const autoDlMedia = this.options.get("autoDlMedia").getValue();
					const autoDlInfo = this.options.get("autoDlInfo").getValue();
					if (autoDlMedia) {
						const mediaType = this.options.get("autoDlMediaType").getValue();
						if (mediaType === "Audio") audioDlBtn.self.trigger("click");
						else if (mediaType === "Video") videoDlBtn.self.trigger("click");
					}
					if (autoDlInfo) infoDlBtn.self.trigger("click");
				}
			}
		}
		async downloadSongData(url, interactive = false) {
			const fileName = this.nameFromSongInfo();
			const fileExt = url.split(".").pop();
			const mp3Info = this.getMp3Info();
			if (interactive) alert(`Downloading song: ${fileName}`);
			const rawMedia = await fetchRawMedia(url);
			if (rawMedia) {
				let blob;
				if (fileExt === "mp3") {
					mp3Info.cover = await getAnimeImage(mp3Info.annId);
					const taggedMp3 = addMp3Tag(rawMedia, mp3Info);
					if (taggedMp3 === null) {
						console.warn(`Failed to add mp3 tag, download origin mp3...`);
						blob = new Blob([rawMedia], { type: "audio/mpeg" });
					} else {
						console.log("Download tagged mp3");
						blob = new Blob([taggedMp3], { type: "audio/mpeg" });
					}
				} else blob = new Blob([rawMedia]);
				downloadBlob(blob, `${fileName}.${fileExt}`);
			}
		}
		downloadSongInfo() {
			const fileName = this.nameFromSongInfo();
			const text = JSON.stringify(this.currentSongInfo);
			downloadBlob(new Blob([text], { type: "text/plain" }), `${fileName}.txt`);
		}
		nameFromSongInfo() {
			const animeName = this.currentSongInfo.animeNames.romaji;
			const songName = this.currentSongInfo.songName;
			return `[${animeName}(${this.songType()})] ${songName} (${this.currentSongInfo.artist})`;
		}
		getMp3Info() {
			const catbox = this.currentSongInfo.videoTargetMap["catbox"];
			const opm = this.currentSongInfo.videoTargetMap["openingsmoe"];
			return {
				animeName: this.currentSongInfo.animeNames.romaji,
				songName: this.currentSongInfo.songName,
				type: this.songType(),
				artist: this.currentSongInfo.artist,
				annId: this.currentSongInfo.annId,
				cover: null,
				videoUrl: {
					"catbox_480": catbox && catbox["480"] && CatboxUrlPrefix + catbox["480"],
					"catbox_720": catbox && catbox["720"] && CatboxUrlPrefix + catbox["720"],
					"openingsmoe": opm && opm["720"]
				}
			};
		}
		songType() {
			switch (this.currentSongInfo.type) {
				case 1: return `Opening ${this.currentSongInfo.typeNumber}`;
				case 2: return `Ending ${this.currentSongInfo.typeNumber}`;
				case 3: return "Insert Song";
				default: return "";
			}
		}
	};
	async function fetchRawMedia(url) {
		return new Promise((resolve, reject) => {
			_GM_xmlhttpRequest({
				method: "GET",
				url,
				responseType: "arraybuffer",
				onload: (resp) => {
					if (resp.status != 200) {
						console.warn("fetch media failed");
						resolve(null);
					} else resolve(resp.response);
				}
			});
		});
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
		const mp3tag = new import_mp3tag.default(data);
		mp3tag.read();
		if (mp3tag.error !== "") {
			console.warn(`"${info.artist} - ${info.songName}" read tag fail`);
			return null;
		}
		mp3tag.tags.title = info.songName;
		mp3tag.tags.artist = info.artist;
		mp3tag.tags.album = info.animeName;
		let comment = "";
		if (info.videoUrl.catbox_480) comment += `Catbox 480p: ${info.videoUrl.catbox_480}\n`;
		if (info.videoUrl.catbox_720) comment += `Catbox 720p: ${info.videoUrl.catbox_720}\n`;
		if (info.videoUrl.openingsmoe) comment += `OpeningsMoe: ${info.videoUrl.openingsmoe}\n`;
		mp3tag.tags.comment = comment;
		if (info.cover !== null) mp3tag.tags.v2.APIC = [{
			format: info.cover.contentType,
			type: 3,
			description: "anime cover from animenewsnetwork",
			data: info.cover.data
		}];
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
	function main() {
		onStartPageLoaded(() => {
			registerPlugin(new Downloader());
		});
	}
	$(main);
})();
