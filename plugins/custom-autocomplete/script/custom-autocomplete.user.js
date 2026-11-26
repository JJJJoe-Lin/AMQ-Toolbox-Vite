// ==UserScript==
// @name         AMQ Custom Autocomplete
// @namespace    https://github.com/JJJJoe-Lin
// @version      0.5.1
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

(function() {
	// \0./main-hXAMuem_.js
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
	/** @license
	* fzf v0.5.2
	* Copyright (c) 2021 Ajit
	* Licensed under BSD 3-Clause
	*/
	var normalized = {
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
			const withDiacriticCodePoint = (asciiChar + diacritic).normalize().codePointAt(0);
			if (withDiacriticCodePoint > 126) normalized[withDiacriticCodePoint] = asciiChar;
		}
	}
	var ranges = {
		a: [7844, 7863],
		e: [7870, 7879],
		o: [7888, 7907],
		u: [7912, 7921]
	};
	for (const lowerChar of Object.keys(ranges)) {
		const upperChar = lowerChar.toUpperCase();
		for (let i = ranges[lowerChar][0]; i <= ranges[lowerChar][1]; ++i) normalized[i] = i % 2 === 0 ? upperChar : lowerChar;
	}
	function normalizeRune(rune) {
		if (rune < 192 || rune > 8580) return rune;
		const normalizedChar = normalized[rune];
		if (normalizedChar !== void 0) return normalizedChar.codePointAt(0);
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
	var strToRunes = (str) => str.split("").map((s) => s.codePointAt(0));
	var whitespaceRunes = new Set(" \f\n\r	\v\xA0 \u2028\u2029  　﻿".split("").map((v) => v.codePointAt(0)));
	for (let codePoint = " ".codePointAt(0); codePoint <= " ".codePointAt(0); codePoint++) whitespaceRunes.add(codePoint);
	var MAX_ASCII = "".codePointAt(0);
	var CAPITAL_A_RUNE = "A".codePointAt(0);
	var CAPITAL_Z_RUNE = "Z".codePointAt(0);
	var SMALL_A_RUNE = "a".codePointAt(0);
	var SMALL_Z_RUNE = "z".codePointAt(0);
	var NUMERAL_ZERO_RUNE = "0".codePointAt(0);
	var NUMERAL_NINE_RUNE = "9".codePointAt(0);
	function indexAt(index, max, forward) {
		if (forward) return index;
		return max - index - 1;
	}
	var SCORE_MATCH = 16;
	var SCORE_GAP_START = -3;
	var SCORE_GAP_EXTENTION = -1;
	var BONUS_BOUNDARY = SCORE_MATCH / 2;
	var BONUS_NON_WORD = SCORE_MATCH / 2;
	var BONUS_CAMEL_123 = 7;
	var BONUS_CONSECUTIVE = 4;
	var BONUS_FIRST_CHAR_MULTIPLIER = 2;
	function createPosSet(withPos) {
		if (withPos) return /* @__PURE__ */ new Set();
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
		if (rune >= SMALL_A_RUNE && rune <= SMALL_Z_RUNE) return 1;
		else if (rune >= CAPITAL_A_RUNE && rune <= CAPITAL_Z_RUNE) return 2;
		else if (rune >= NUMERAL_ZERO_RUNE && rune <= NUMERAL_NINE_RUNE) return 4;
		else return 0;
	}
	function charClassOfNonAscii(rune) {
		const char = String.fromCodePoint(rune);
		if (char !== char.toUpperCase()) return 1;
		else if (char !== char.toLowerCase()) return 2;
		else if (char.match(/\p{Number}/gu) !== null) return 4;
		else if (char.match(/\p{Letter}/gu) !== null) return 3;
		return 0;
	}
	function charClassOf(rune) {
		if (rune <= MAX_ASCII) return charClassOfAscii(rune);
		return charClassOfNonAscii(rune);
	}
	function bonusFor(prevClass, currClass) {
		if (prevClass === 0 && currClass !== 0) return BONUS_BOUNDARY;
		else if (prevClass === 1 && currClass === 2 || prevClass !== 4 && currClass === 4) return BONUS_CAMEL_123;
		else if (currClass === 0) return BONUS_NON_WORD;
		return 0;
	}
	function bonusAt(input, idx) {
		if (idx === 0) return BONUS_BOUNDARY;
		return bonusFor(charClassOf(input[idx - 1]), charClassOf(input[idx]));
	}
	function trySkip(input, caseSensitive, char, from) {
		let rest = input.slice(from);
		let idx = rest.indexOf(char);
		if (idx === 0) return from;
		if (!caseSensitive && char >= SMALL_A_RUNE && char <= SMALL_Z_RUNE) {
			if (idx > 0) rest = rest.slice(0, idx);
			const uidx = rest.indexOf(char - 32);
			if (uidx >= 0) idx = uidx;
		}
		if (idx < 0) return -1;
		return from + idx;
	}
	function isAscii(runes) {
		for (const rune of runes) if (rune >= 128) return false;
		return true;
	}
	function asciiFuzzyIndex(input, pattern, caseSensitive) {
		if (!isAscii(input)) return 0;
		if (!isAscii(pattern)) return -1;
		let firstIdx = 0, idx = 0;
		for (let pidx = 0; pidx < pattern.length; pidx++) {
			idx = trySkip(input, caseSensitive, pattern[pidx], idx);
			if (idx < 0) return -1;
			if (pidx === 0 && idx > 0) firstIdx = idx - 1;
			idx++;
		}
		return firstIdx;
	}
	var fuzzyMatchV2 = (caseSensitive, normalize, forward, input, pattern, withPos, slab2) => {
		const M = pattern.length;
		if (M === 0) return [{
			start: 0,
			end: 0,
			score: 0
		}, createPosSet(withPos)];
		const N = input.length;
		if (slab2 !== null && N * M > slab2.i16.length) return fuzzyMatchV1(caseSensitive, normalize, forward, input, pattern, withPos);
		const idx = asciiFuzzyIndex(input, pattern, caseSensitive);
		if (idx < 0) return [{
			start: -1,
			end: -1,
			score: 0
		}, null];
		let offset16 = 0, offset32 = 0, H0 = null, C0 = null, B = null, F = null;
		[offset16, H0] = alloc16(offset16, slab2, N);
		[offset16, C0] = alloc16(offset16, slab2, N);
		[offset16, B] = alloc16(offset16, slab2, N);
		[offset32, F] = alloc32(offset32, slab2, M);
		const [, T] = alloc32(offset32, slab2, N);
		for (let i = 0; i < T.length; i++) T[i] = input[i];
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
				if (!caseSensitive && charClass === 2) char += 32;
			} else {
				charClass = charClassOfNonAscii(char);
				if (!caseSensitive && charClass === 2) char = String.fromCodePoint(char).toLowerCase().codePointAt(0);
				if (normalize) char = normalizeRune(char);
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
					if (forward && bonus === BONUS_BOUNDARY) break;
				}
				inGap = false;
			} else {
				if (inGap) H0sub[off] = maxInt16(prevH0 + SCORE_GAP_EXTENTION, 0);
				else H0sub[off] = maxInt16(prevH0 + SCORE_GAP_START, 0);
				C0sub[off] = 0;
				inGap = true;
			}
			prevH0 = H0sub[off];
		}
		if (pidx !== M) return [{
			start: -1,
			end: -1,
			score: 0
		}, null];
		if (M === 1) {
			const result = {
				start: maxScorePos,
				end: maxScorePos + 1,
				score: maxScore
			};
			if (!withPos) return [result, null];
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
			for (const [i, v] of toCopy.entries()) H[i] = v;
		}
		let [, C] = alloc16(offset16, slab2, width * M);
		{
			const toCopy = C0.subarray(f0, lastIdx + 1);
			for (const [i, v] of toCopy.entries()) C[i] = v;
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
				if (inGap2) s2 = Hleft[off2] + SCORE_GAP_EXTENTION;
				else s2 = Hleft[off2] + SCORE_GAP_START;
				if (pchar2 === char) {
					s1 = Hdiag[off2] + SCORE_MATCH;
					let b = Bsub2[off2];
					consecutive = Cdiag[off2] + 1;
					if (b === BONUS_BOUNDARY) consecutive = 1;
					else if (consecutive > 1) b = maxInt16(b, maxInt16(BONUS_CONSECUTIVE, B[col - consecutive + 1]));
					if (s1 + b < s2) {
						s1 += Bsub2[off2];
						consecutive = 0;
					} else s1 += b;
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
				if (i > 0 && j >= F[i]) s1 = H[I - width + j0 - 1];
				if (j > F[i]) s2 = H[I + j0 - 1];
				if (s > s1 && (s > s2 || s === s2 && preferMatch)) {
					pos.add(j);
					if (i === 0) break;
					i--;
				}
				preferMatch = C[I + j0] > 1 || I + width + j0 + 1 < C.length && C[I + width + j0 + 1] > 0;
				j--;
			}
		}
		return [{
			start: j,
			end: maxScorePos + 1,
			score: maxScore
		}, pos];
	};
	function calculateScore(caseSensitive, normalize, text, pattern, sidx, eidx, withPos) {
		let pidx = 0, score = 0, inGap = false, consecutive = 0, firstBonus = toShort(0);
		const pos = createPosSet(withPos);
		let prevCharClass = 0;
		if (sidx > 0) prevCharClass = charClassOf(text[sidx - 1]);
		for (let idx = sidx; idx < eidx; idx++) {
			let rune = text[idx];
			const charClass = charClassOf(rune);
			if (!caseSensitive) {
				if (rune >= CAPITAL_A_RUNE && rune <= CAPITAL_Z_RUNE) rune += 32;
				else if (rune > MAX_ASCII) rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
			}
			if (normalize) rune = normalizeRune(rune);
			if (rune === pattern[pidx]) {
				if (withPos && pos !== null) pos.add(idx);
				score += SCORE_MATCH;
				let bonus = bonusFor(prevCharClass, charClass);
				if (consecutive === 0) firstBonus = bonus;
				else {
					if (bonus === BONUS_BOUNDARY) firstBonus = bonus;
					bonus = maxInt16(maxInt16(bonus, firstBonus), BONUS_CONSECUTIVE);
				}
				if (pidx === 0) score += bonus * BONUS_FIRST_CHAR_MULTIPLIER;
				else score += bonus;
				inGap = false;
				consecutive++;
				pidx++;
			} else {
				if (inGap) score += SCORE_GAP_EXTENTION;
				else score += SCORE_GAP_START;
				inGap = true;
				consecutive = 0;
				firstBonus = 0;
			}
			prevCharClass = charClass;
		}
		return [score, pos];
	}
	var fuzzyMatchV1 = (caseSensitive, normalize, forward, text, pattern, withPos, slab2) => {
		if (pattern.length === 0) return [{
			start: 0,
			end: 0,
			score: 0
		}, null];
		if (asciiFuzzyIndex(text, pattern, caseSensitive) < 0) return [{
			start: -1,
			end: -1,
			score: 0
		}, null];
		let pidx = 0, sidx = -1, eidx = -1;
		const lenRunes = text.length;
		const lenPattern = pattern.length;
		for (let index = 0; index < lenRunes; index++) {
			let rune = text[indexAt(index, lenRunes, forward)];
			if (!caseSensitive) {
				if (rune >= CAPITAL_A_RUNE && rune <= CAPITAL_Z_RUNE) rune += 32;
				else if (rune > MAX_ASCII) rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
			}
			if (normalize) rune = normalizeRune(rune);
			const pchar = pattern[indexAt(pidx, lenPattern, forward)];
			if (rune === pchar) {
				if (sidx < 0) sidx = index;
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
				let rune = text[indexAt(index, lenRunes, forward)];
				if (!caseSensitive) {
					if (rune >= CAPITAL_A_RUNE && rune <= CAPITAL_Z_RUNE) rune += 32;
					else if (rune > MAX_ASCII) rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
				}
				const pchar = pattern[indexAt(pidx, lenPattern, forward)];
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
			const [score, pos] = calculateScore(caseSensitive, normalize, text, pattern, sidx, eidx, withPos);
			return [{
				start: sidx,
				end: eidx,
				score
			}, pos];
		}
		return [{
			start: -1,
			end: -1,
			score: 0
		}, null];
	};
	var exactMatchNaive = (caseSensitive, normalize, forward, text, pattern, withPos, slab2) => {
		if (pattern.length === 0) return [{
			start: 0,
			end: 0,
			score: 0
		}, null];
		const lenRunes = text.length;
		const lenPattern = pattern.length;
		if (lenRunes < lenPattern) return [{
			start: -1,
			end: -1,
			score: 0
		}, null];
		if (asciiFuzzyIndex(text, pattern, caseSensitive) < 0) return [{
			start: -1,
			end: -1,
			score: 0
		}, null];
		let pidx = 0;
		let bestPos = -1, bonus = toShort(0), bestBonus = toShort(-1);
		for (let index = 0; index < lenRunes; index++) {
			const index_ = indexAt(index, lenRunes, forward);
			let rune = text[index_];
			if (!caseSensitive) {
				if (rune >= CAPITAL_A_RUNE && rune <= CAPITAL_Z_RUNE) rune += 32;
				else if (rune > MAX_ASCII) rune = String.fromCodePoint(rune).toLowerCase().codePointAt(0);
			}
			if (normalize) rune = normalizeRune(rune);
			const pidx_ = indexAt(pidx, lenPattern, forward);
			if (pattern[pidx_] === rune) {
				if (pidx_ === 0) bonus = bonusAt(text, index_);
				pidx++;
				if (pidx === lenPattern) {
					if (bonus > bestBonus) {
						bestPos = index;
						bestBonus = bonus;
					}
					if (bonus === BONUS_BOUNDARY) break;
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
			return [{
				start: sidx,
				end: eidx,
				score
			}, null];
		}
		return [{
			start: -1,
			end: -1,
			score: 0
		}, null];
	};
	var SLAB_16_SIZE = 102400;
	var SLAB_32_SIZE = 2048;
	function makeSlab(size16, size32) {
		return {
			i16: new Int16Array(size16),
			i32: new Int32Array(size32)
		};
	}
	var slab = makeSlab(SLAB_16_SIZE, SLAB_32_SIZE);
	var buildPatternForBasicMatch = (query, casing, normalize) => {
		let caseSensitive = false;
		switch (casing) {
			case "smart-case":
				if (query.toLowerCase() !== query) caseSensitive = true;
				break;
			case "case-sensitive":
				caseSensitive = true;
				break;
			case "case-insensitive":
				query = query.toLowerCase();
				caseSensitive = false;
		}
		let queryRunes = strToRunes(query);
		if (normalize) queryRunes = queryRunes.map(normalizeRune);
		return {
			queryRunes,
			caseSensitive
		};
	};
	function getResultFromScoreMap(scoreMap, limit) {
		const scoresInDesc = Object.keys(scoreMap).map((v) => parseInt(v, 10)).sort((a, b) => b - a);
		let result = [];
		for (const score of scoresInDesc) {
			result = result.concat(scoreMap[score]);
			if (result.length >= limit) break;
		}
		return result;
	}
	function getBasicMatchIter(scoreMap, queryRunes, caseSensitive) {
		return (idx) => {
			const itemRunes = this.runesList[idx];
			if (queryRunes.length > itemRunes.length) return;
			let [match, positions] = this.algoFn(caseSensitive, this.opts.normalize, this.opts.forward, itemRunes, queryRunes, true, slab);
			if (match.start === -1) return;
			if (this.opts.fuzzy === false) {
				positions = /* @__PURE__ */ new Set();
				for (let position = match.start; position < match.end; ++position) positions.add(position);
			}
			const scoreKey = this.opts.sort ? match.score : 0;
			if (scoreMap[scoreKey] === void 0) scoreMap[scoreKey] = [];
			scoreMap[scoreKey].push({
				item: this.items[idx],
				...match,
				positions: positions != null ? positions : /* @__PURE__ */ new Set()
			});
		};
	}
	function basicMatch(query) {
		const { queryRunes, caseSensitive } = buildPatternForBasicMatch(query, this.opts.casing, this.opts.normalize);
		const scoreMap = {};
		const iter2 = getBasicMatchIter.bind(this)(scoreMap, queryRunes, caseSensitive);
		for (let i = 0, len = this.runesList.length; i < len; ++i) iter2(i);
		return getResultFromScoreMap(scoreMap, this.opts.limit);
	}
	var defaultOpts = {
		limit: 1e400,
		selector: (v) => v,
		casing: "smart-case",
		normalize: true,
		fuzzy: "v2",
		tiebreakers: [],
		sort: true,
		forward: true
	};
	var BaseFinder = class {
		constructor(list, ...optionsTuple) {
			this.opts = {
				...defaultOpts,
				...optionsTuple[0]
			};
			this.items = list;
			this.runesList = list.map((item) => strToRunes(this.opts.selector(item).normalize()));
			this.algoFn = exactMatchNaive;
			switch (this.opts.fuzzy) {
				case "v2":
					this.algoFn = fuzzyMatchV2;
					break;
				case "v1": this.algoFn = fuzzyMatchV1;
			}
		}
	};
	var syncDefaultOpts = {
		...defaultOpts,
		match: basicMatch
	};
	var SyncFinder = class extends BaseFinder {
		constructor(list, ...optionsTuple) {
			super(list, ...optionsTuple);
			this.opts = {
				...syncDefaultOpts,
				...optionsTuple[0]
			};
		}
		find(query) {
			if (query.length === 0 || this.items.length === 0) return this.items.slice(0, this.opts.limit).map(createResultItemWithEmptyPos);
			query = query.normalize();
			return postProcessResultItems(this.opts.match.bind(this)(query), this.opts);
		}
	};
	({ ...defaultOpts });
	var createResultItemWithEmptyPos = (item) => ({
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
				if (a.score === b.score) for (const tiebreaker of opts.tiebreakers) {
					const diff = tiebreaker(a, b, selector);
					if (diff !== 0) return diff;
				}
				return 0;
			});
		}
		if (Number.isFinite(opts.limit)) result.splice(opts.limit);
		return result;
	}
	function byLengthAsc(a, b, selector) {
		return selector(a.item).length - selector(b.item).length;
	}
	function byStartAsc(a, b) {
		return a.start - b.start;
	}
	var Fzf = class {
		constructor(list, ...optionsTuple) {
			this.finder = new SyncFinder(list, ...optionsTuple);
			this.find = this.finder.find.bind(this.finder);
		}
	};
	function NormalizeName(name, camelize = false) {
		const rules = [
			{
				input: "ä@âàáạåæā",
				output: "a"
			},
			{
				input: "ß",
				output: "b"
			},
			{
				input: "č",
				output: "c"
			},
			{
				input: "éêëèæē",
				output: "e"
			},
			{
				input: "í",
				output: "i"
			},
			{
				input: "ñ",
				output: "n"
			},
			{
				input: "ōóòöôøΦ",
				output: "o"
			},
			{
				input: "uūûúùüǖ",
				output: "u"
			},
			{
				input: "×",
				output: "x"
			},
			{
				input: "²",
				output: "2"
			},
			{
				input: "³",
				output: "3"
			},
			{
				input: "’",
				output: "'"
			},
			{
				input: "★☆·♥∽・〜†♪→␣",
				output: " "
			}
		];
		let rule_map = /* @__PURE__ */ new Map();
		for (let rule of rules) for (let c of rule.input) rule_map.set(c, rule.output);
		let ret = "";
		name.split("").forEach((c) => {
			ret += rule_map.get(c) ?? c;
		});
		if (camelize) ret = ret.replace(/(:?^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase());
		return ret.replace(/\s\s+/g, " ");
	}
	var InvalidAbbrRegex = /[^A-Z0-9:-]/;
	function Abbreviate(name) {
		if (name.length == 0) return "";
		let abbr = name[0], abbr_offset = [0];
		for (let i = 1; i < name.length; ++i) {
			let current = name[i];
			let previous = name[i - 1];
			let next = name[i + 1] || "";
			if (InvalidAbbrRegex.test(current)) continue;
			if (current == ":" && next != " ") continue;
			if (current == "-" && previous != " " && next != " ") continue;
			abbr += current;
			abbr_offset.push(i);
		}
		return [abbr, abbr_offset];
	}
	function ToItemList(fzf_entries) {
		let items = [];
		for (let entry of fzf_entries) items.push(entry.item);
		return items;
	}
	function BuildTerms(input) {
		input = input.trim();
		input = input.replace(/\\ /g, "	");
		let terms = input.split(/ +/);
		for (let i in terms) terms[i] = terms[i].replace(/\t/g, " ");
		return terms;
	}
	var FinderResult = class {
		constructor(item) {
			this.item = item;
			this.positions = /* @__PURE__ */ new Set();
			this.start = item.name.length;
			this.end = 0;
			this.matched = 0;
			this.abbr_score = 0;
			this.score = 0;
			this.basic_score = 0;
		}
		reset() {
			this.positions.clear();
			this.start = this.item.name.length;
			this.end = 0;
			this.matched = 0;
			this.abbr_score = 0;
			this.score = 0;
			this.basic_score = 0;
		}
		merge(result) {
			for (const pos of result.positions) this.positions.add(pos);
			this.start = this.start < result.start ? this.start : result.start;
			this.end = this.end > result.end ? this.end : result.end;
			this.score += result.score;
			if (result.score > 0) this.matched += 1;
		}
		setAbbrResult(result) {
			this.abbr_score = result.score;
			this.positions.clear();
			for (const pos of result.positions) {
				if (!pos in this.item.abbr_offset) {
					console.log(`{pos} is not in {this.item.abbr_offset}`);
					continue;
				}
				this.positions.add(this.item.abbr_offset[pos]);
			}
		}
		getNormScore(value) {
			let score = this.abbr_score || this.score;
			return this.#normScore(value, score);
		}
		#goodScore(terms) {
			let concat_value = terms.join("");
			let token_count = terms.length;
			const score_match = 16;
			const bonus_first = 8;
			const bonus_consecutive = 8;
			const len = concat_value.length;
			return score_match * len + bonus_consecutive * (len - 1) + bonus_first * (token_count + 1);
		}
		#badScore(terms) {
			let concat_value = terms.join("");
			const score_match = 16;
			const score_gap_start = -3;
			const len = concat_value.length;
			return score_match * len + score_gap_start * (len - 1);
		}
		#normScore(value, score) {
			let terms = BuildTerms(value);
			let good_score = this.#goodScore(terms);
			let bad_score = this.#badScore(terms);
			return (score - bad_score) / (good_score - bad_score);
		}
	};
	var Finder = class {
		constructor(items) {
			this.items = items;
			this.selector = (item) => item.normalized;
			this.abbr_selector = (item) => item.abbr;
			this.finder_opt = {
				casing: "case-insensitive",
				selector: this.selector,
				tiebreakers: [byLengthAsc, byStartAsc]
			};
			this.filter_opt = {
				casing: "case-insensitive",
				selector: this.selector,
				sort: false
			};
			this.abbr_filter_opt = {
				selector: this.abbr_selector,
				sort: false
			};
			this.finder = new Fzf(items, this.finder_opt);
			this.filter = new Fzf(items, this.filter_opt);
			this.abbr_filter = new Fzf(items, this.abbr_filter_opt);
		}
		find(value) {
			return this.finder.find(value);
		}
		filt(value) {
			return this.filter.find(value);
		}
		abbr_filt(value) {
			return this.abbr_filter.find(value);
		}
	};
	var CustomFzf = class {
		constructor(itemList) {
			let fzfList = [];
			for (let [idx, item] of itemList.entries()) {
				let normalized = NormalizeName(item);
				const [abbr, abbr_offset] = Abbreviate(NormalizeName(item, true));
				fzfList.push({
					index: idx,
					name: item,
					normalized,
					abbr,
					abbr_offset
				});
			}
			this.default_finder = new Finder(fzfList);
			this.finder_map = /* @__PURE__ */ new Map();
			const alphabet = [..."qxzjvwfpbycldgkmhutrsnoiea"];
			for (let a of alphabet) setTimeout(() => {
				let items = ToItemList(this.default_finder.filt(a));
				this.finder_map.set(a, new Finder(items));
			}, 10);
			this.default_entries = fzfList.map((item) => new FinderResult(item));
		}
		getFinder(input) {
			for (let [k, _] of this.finder_map) if (input.includes(k)) return this.finder_map.get(k);
			return this.default_finder;
		}
		extendedFind(input, limit = 1e3) {
			let finder = this.getFinder(input);
			let terms = BuildTerms(input);
			if (terms.length == 0) return;
			let entries = this.default_entries;
			for (let entry of entries) entry.reset();
			for (let term of terms) {
				let term_entries = finder.filt(term);
				for (let entry of term_entries) entries[entry.item.index].merge(entry);
			}
			let filtered_entries;
			if (terms.length == 1 && !InvalidAbbrRegex.test(input)) {
				let abbr_term = input;
				let abbr_entries = finder.abbr_filt(abbr_term);
				for (let entry of abbr_entries) entries[entry.item.index].setAbbrResult(entry);
				filtered_entries = entries.filter((e) => e.abbr_score > 0 || e.matched == terms.length);
			} else filtered_entries = entries.filter((e) => e.matched == terms.length);
			filtered_entries.sort(function(a, b) {
				if (a.abbr_score != b.abbr_score) return b.abbr_score - a.abbr_score;
				if (a.abbr_score > 0 && a.item.abbr.length != b.item.abbr.length) return a.item.abbr.length - b.item.abbr.length;
				if (a.score != b.score) return b.score - a.score;
				if (a.item.normalized.length != b.item.normalized.length) return a.item.normalized.length - b.item.normalized.length;
				return a.start - b.start;
			});
			return filtered_entries.slice(0, limit);
		}
		find(value) {
			let terms = BuildTerms(value);
			let entries = this.extendedFind(value);
			if (!entries) console.log("Nothing found in extendedFind()");
			let basic_fzf = new Fzf(ToItemList(entries), {
				casing: "case-insensitive",
				selector: (item) => item.normalized,
				match: basicMatch,
				sort: false
			});
			let concat_value = terms.join("");
			let basic_entries = basic_fzf.find(concat_value);
			let e = 0, b = 0;
			for (; e < entries.length && b < basic_entries.length; ++e) {
				let entry = entries[e];
				let basic_entry = basic_entries[b];
				if (entry.item.name == basic_entry.item.name) {
					entry.basic_score = basic_entry.score;
					b += 1;
				} else entry.basic_score = 0;
			}
			if (b != basic_entries.length) console.log("unmatched basic entires item");
			entries.sort(function(a, b) {
				if (a.abbr_score != b.abbr_score) return b.abbr_score - a.abbr_score;
				if (a.abbr_score > 0 && a.item.abbr.length != b.item.abbr.length) return a.item.abbr.length - b.item.abbr.length;
				if (a.score != b.score) return b.score - a.score;
				if (a.score != b.basic_score) return b.basic_score - a.basic_score;
				if (a.item.normalized.length != b.item.normalized.length) return a.item.normalized.length - b.item.normalized.length;
				return a.start - b.start;
			});
			return entries;
		}
	};
	function FzfAmqAwesomplete(input, o, scrollable) {
		console.log("AmqAwesomeplete init");
		o.autoFirst = true;
		o.filter = (text, input) => {
			return RegExp(input.trim(), "i").test(text);
		};
		Awesomplete.call(this, input, o);
		this.searchId = 0;
		this.currentSubList = null;
		this.o = o;
		this.customFzf = o.customFzf ?? new CustomFzf(this.o.list);
		this.currentQuery = "";
		this.$ul = $(this.ul);
		if (scrollable) {
			let $input = $(input);
			let $awesompleteList = $input.parent().find("ul");
			$awesompleteList.perfectScrollbar({ suppressScrollX: true });
			$input.on("awesomplete-open", () => {
				$awesompleteList.perfectScrollbar("update");
				$awesompleteList[0].scrollTop = 0;
			});
		}
		let create = function(tag, o) {
			var element = document.createElement(tag);
			for (var i in o) {
				var val = o[i];
				if (i === "inside") $(val).appendChild(element);
				else if (i === "around") {
					var ref = $(val);
					ref.parentNode.insertBefore(element, ref);
					element.appendChild(ref);
					if (ref.getAttribute("autofocus") != null) ref.focus();
				} else if (i in element) element[i] = val;
				else element.setAttribute(i, val);
			}
			return element;
		};
		this.item = function(text, item_id) {
			return create("li", {
				innerHTML: text,
				"role": "option",
				"aria-selected": "false",
				"id": "awesomplete_list_" + this.count + "_item_" + item_id
			});
		};
	}
	function FzfEvaluate() {
		if (this.once_disable_evaluate) {
			this.once_disable_evaluate = false;
			return;
		}
		var me = this;
		let value = this.input.value;
		if (value.length < this.minChars) {
			this.close({ reason: "nomatches" });
			this.status.textContent = "No results found";
			return;
		}
		this.searchId++;
		this.searchId;
		$("#qpAnswerInputLoadingContainer").removeClass("hide");
		this.index = -1;
		this.$ul.children("li").remove();
		let handlePassedSuggestions = function(me) {
			this.suggestions = this.suggestions.slice(0, this.maxItems);
			for (let i = this.suggestions.length - 1; i >= 0; i--) {
				let suggestion = this.suggestions[i].label;
				me.ul.insertBefore(me.item(suggestion, i), me.ul.firstChild);
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
		let normalizedValue = NormalizeName(value);
		let startTime = Date.now();
		let entries = this.customFzf.find(normalizedValue);
		let timeTaken = Date.now() - startTime;
		if (timeTaken > 100) console.log("fzf search took long time:", timeTaken, "ms");
		let fzf_suggestions = [];
		for (let i in entries) {
			if (i >= this.maxItems) break;
			let entry = entries[i];
			let positions = entry.positions;
			let name = entry.item.name;
			let label = "";
			for (let i = 0; i < name.length; ++i) if (positions.has(i)) label += "<mark>" + name[i] + "</mark>";
			else label += name[i];
			let norm_score = entry.getNormScore(normalizedValue);
			norm_score = Math.min(1, norm_score);
			norm_score = Math.max(0, norm_score);
			let html = "<span style=\"color:hsl(" + 120 * (norm_score * norm_score) + ", 60%, 80%);\">" + label + "</span>";
			let suggestion = new Suggestion([html, name]);
			fzf_suggestions.push(suggestion);
		}
		this.suggestions = fzf_suggestions;
		handlePassedSuggestions(me);
	}
	var CustomAutocomplete = class {
		name = "Custom Autocomplete";
		options;
		_enabled = false;
		_FZFAwesomeplete;
		_originCreateNewInstance;
		_customCreateNewInstance;
		_cachedList = null;
		_cachedListLength = -1;
		_cachedFzf = null;
		constructor() {
			this.options = new Options({ title: this.name });
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
				label: "Can redo after select a answer",
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
				choices: [{
					label: "Origin(AMQ)",
					value: "Origin"
				}, {
					label: "FZF",
					value: "FZF"
				}],
				defaultValue: "Origin"
			}));
			this._FZFAwesomeplete = FzfAmqAwesomplete;
			this._FZFAwesomeplete.prototype = Object.create(AmqAwesomeplete.prototype);
			this._FZFAwesomeplete.prototype.constructor = FzfAmqAwesomplete;
			this._FZFAwesomeplete.prototype.evaluate = FzfEvaluate;
			this._originCreateNewInstance = autoCompleteController.createNewInstance;
			this._customCreateNewInstance = ($input) => {
				let acc = autoCompleteController;
				let autoFirst = this.options.get("autoFirst").getValue();
				let redoOpt = this.options.get("redo").getValue();
				let matchMethod = this.options.get("matchMethod").getValue();
				console.log("[Custom Autocomplete] Do custom createNewInstance()");
				let instance;
				if (matchMethod === "Origin") instance = new AmqAwesomeplete($input[0], {
					list: acc.list,
					minChars: 1,
					maxItems: 25
				}, true);
				else if (matchMethod === "FZF") instance = new this._FZFAwesomeplete($input[0], {
					list: acc.list,
					minChars: 1,
					maxItems: 25,
					customFzf: this.getCustomFzf(acc.list)
				}, true);
				if (!instance) return;
				if (redoOpt) {
					instance.once_disable_evaluate = false;
					instance.replace = function(suggestion) {
						this.input.focus();
						this.input.select();
						this.once_disable_evaluate = true;
						document.execCommand("insertText", false, suggestion.value);
					};
				}
				instance.autoFirst = autoFirst;
				acc.awesomepleteInstances.push(instance);
			};
			this.options.get("autoFirst").input.on("click", () => {
				let opt = this.options.get("autoFirst").getValue();
				for (let instance of autoCompleteController.awesomepleteInstances) instance.autoFirst = opt;
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
			autoCompleteController.createNewInstance = this._customCreateNewInstance;
			this.updateAutoComplete();
		}
		disable() {
			this._enabled = false;
			autoCompleteController.createNewInstance = this._originCreateNewInstance;
			this.updateAutoComplete();
		}
		enabled() {
			return this._enabled;
		}
		getCustomFzf(list) {
			if (!this._cachedFzf || this._cachedList !== list || this._cachedListLength !== list.length) {
				this._cachedList = list;
				this._cachedListLength = list.length;
				this._cachedFzf = new CustomFzf(list);
			}
			return this._cachedFzf;
		}
		updateAutoComplete() {
			if (autoCompleteController.version !== null || autoCompleteController.awesomepleteInstances.length > 0) autoCompleteController.newList();
		}
	};
	function main() {
		onStartPageLoaded(() => {
			registerPlugin(new CustomAutocomplete());
		});
	}
	$(main);
})();
