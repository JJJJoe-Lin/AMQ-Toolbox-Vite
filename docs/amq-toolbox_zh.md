# amq-toolbox Document

## Interface
### IPlugin
#### Attribute
- `name`
	- Type：`string`
- `dependencies`（optional）
	- Type：`string[]`
- `view`（optional）
	- Type：`IComponent`
- `options`（optional）
	- Type：`IOptions`
- `settingTab`（optional）
	- Type：`ITab`
#### Method
- `enable()`
	- 說明：啟用函數
- `disable()`
	- 說明：停用函數
- `enabled()`
	- 說明：plugin 目前是否啟用

### IComponent
#### Attribute
- `name`（optional）
	- Type：`string`
- `self`
	- Type：`JQuery<HTMLElement>`

### IButton
繼承自 [IComponent](#icomponent)
#### Attribute
- label
	- Type：`string`
- size
	- Type：`large | default | normal | small | extra-small`
- style
	- Type：`default | primary | success | info | warning | danger | link`

### ITable
繼承自 [IComponent](#icomponent)
#### Attribute
- `name`
	- Type：`string`
- `table`
	- Type：`JQuery<HTMLElement>`
#### Method
- `getValue()`
	- 說明：取得每列的 \<欄位, 值\>
- `setValue()`
	- 說明：設定每列的 \<欄位, 值\>
- `save()`
	- 說明：儲存 Table 資料到 storage
- `load()`
	- 說明：從 storage 載入 Table 資料
- `createRow()`
	- 說明：建立 Row 物件
- `splice()`
	- 說明：刪除或插入 Row 物件至 Table
- `append()`
	- 說明：插入 Row 物件至 Table 的最後
- `getButton()`
	- 說明：取得按鈕物件（若有建立）

### IValuable\<T\>
繼承自 [IComponent](#icomponent)
- `getValue()`
	- 說明：取得元件值
- `setValue()`
	- 說明：設定元件值

### ITextInput
繼承自 [IValuable\<string\>](#ivaluablet)

### ISingleSelect
繼承自 [IValuable\<string\>](#ivaluablet)

### IMultiSelect
繼承自 [IValuable\<string\>](#ivaluablet)

### IOptionComponent\<T\>
繼承自 [IValuable\<T\>](#ivaluablet)
#### Attribute
- `name`
	- Type：`string`
- `enables`（optional）
	- Type：`Record<string, string[]>`
	- 說明：當選項為 X 時，會啟用哪些 options
- `input`
	- Type：`JQuery<HTMLElement>`
#### Method
- `save()`
	- 說明：儲存設定資料到 storage
- `load()`
	- 說明：從 storage 載入設定資料
- `enable()`
	- 說明：啟用函數
- `disable()`
	- 說明：停用函數
- `enabled()`
	- 說明：option 目前是否啟用

### IRadioOption
繼承自 [IOptionComponent\<string | number | boolean\>](#ioptioncomponentt)
#### Method
- `relayout()`
	- 說明：重新渲染此元件

### ICheckboxOption
繼承自 [IOptionComponent\<boolean\>](#ioptioncomponentt)

### IContainer\<T\>
繼承自 [IComponent](#icomponent)，可迭代（Iterable）
#### Attribute
- `length`（get only）
	- Type：`number`

#### Method
- `push()`
	- 說明：同 `Array.push()`
- `pop()`
	- 說明：同 `Array.pop()`
- `clear()`
	- 說明：清除容器所有元件
- `splice()`
	- 說明：同 `Array.splice()`
- `at()`
	- 說明：同 `Array.at()`
- `find()`
	- 說明：同 `Array.find()`
- `get()`
	- 說明：回傳容器內指定名稱的元件
- `show()`
	- 說明：顯示此容器
- `hide()`
	- 說明：隱藏此容器
- `isVisible()`
	- 說明：此容器目前是否可見

### IButtons
繼承自 [IContainer\<IButton\>](#icontainert)

### IModal
繼承自 [IContainer\<IComponent\>](#icontainert)

### IOptions
繼承自 [IContainer\<IOptionComponent\>](#icontainert)
#### Method
- `refresh()`

### ITab
繼承自 [IContainer\<IComponent\>](#icontainert)
#### Attribute
- `content`
	- Type：`JQuery<HTMLElement>`

### ITabModal
繼承自 [IContainer\<ITab\>](#icontainert)
#### Method
- `select()`
	- 說明：選取某個頁籤

### IWindow
繼承自 [IContainer\<IComponent\>](#icontainert)

## Class
所有 Component Object 在建構時需要傳入「建構選項物件」，所有建構選項物件都包含以下屬性
- `name`（optional）
	- Type: `string`
- `id`（optional）
	- Type: `string`
	- 說明：ID of HTML Element
- `class`（optional）
	- Type: `string`
	- 說明：Class of HTML Element

### Button
實作了 [IButton](#ibutton)
#### 建構選項
- label
	- Type：`string`
- size
	- Type：`large | default | normal | small | extra-small`
- style
	- Type：`default | primary | success | info | warning | danger | link`

### Table
#### 建構選項
- `defaultValue`（optional）
- `name`
	- Type：`string`
- `title`（optional）
	- Type：`string`
- `newRow`
	- Type：
- `addOrDeletable`
	- Type：`boolean`
	- 說明：
- `movable`
	- Type：`boolean`
- `saveIn`（optional）
	- Type：`Script | LocalStorage | Cookie`

### TextInput
實作了 [ITextInput](#itextinput)
#### 建構選項
- `defaultValue`（optional）
- `type`（optional）
	- Type：`text | password`
- `placeholder`（optional）
	- Type：`string`

### SingleSelect
實作了 [ISingleSelect](#isingleselect)
#### 建構選項
- `defaultValue`（optional）
- `label`
	- Type：`string`
- `choices`
	- Type：`{label:string, value: T}[]`

### MultiSelect
實作了 [IMultiSelect](#imultiselect)
#### 建構選項
- `defaultValue`（optional）
- `label`
	- Type：`string`
- `choices`
	- Type：`{label:string, value: T}[]`

### RadioOption
實作了 [IRadioOption](#iradiooption)
#### 建構選項
- `defaultValue`（optional）
- `name`
	- Type：`string`
- `inputId`
	- Type：`string`
- `saveIn`
	- Type：`Script | LocalStorage | Cookie`
- `offset`
	- Type：`number`
- `enables`（optional）
	- Type：`{string, string[]}`
	- 說明：選取 X 時，會啟用哪些 options（name）
- `label`
	- Type：`string`
- `description`（optional）
	- Type：`string`
- `choices`
	- Type：`{label:string, value: T}[]`

### CheckboxOption
實作了 [ICheckboxOption](#icheckboxoption)
#### 建構選項
- `defaultValue`（optional）
- `name`
	- Type：`string`
- `inputId`
	- Type：`string`
- `saveIn`
	- Type：`Script | LocalStorage | Cookie`
- `offset`
	- Type：`number`
- `enables`（optional）
	- Type：`{string, string[]}`
	- 說明：選取 X 時，會啟用哪些 options（name）
- `label`
	- Type：`string`
- `description`（optional）
	- Type：`string`

### Buttons
實作了 [IButtons](#ibuttons)

### Modal
實作了 [IModal](#imodal)
#### 建構選項
- `title`
	- Type：`string`
- `size`
	- Type：`large | normal | small`

### Options
實作了 [IOptions](#ioptions)
#### 建構選項
- `title`
	- Type：`string`

### Tab
實作了 [ITab](#itab)
#### 建構選項
- `tabName`
	- Type：`string`
- `contentId`（optional）
	- Type：`string`
- `contentClass`（optional）
	- Type：`string`

### TabModal
實作了 [ITabModal](#itabmodal)
#### 建構選項
- `title`
	- Type：`string`
- `size`
	- Type：`large | normal | small`

### Window
實作了 [IWindow](#iwindow)
#### 建構選項
- `title`
	- Type：`string`
- `width`
	- Type：`number`
- `height`
	- Type：`number`
- `resizable`
	- Type：`boolean`
- `draggable`
	- Type：`boolean`
- `minWidth`
	- Type：`number`
- `minHeight`
	- Type：`number`
- `position`
	- Type：`{x:number, y:number}`;
- `zIndex`
	- Type：`number`