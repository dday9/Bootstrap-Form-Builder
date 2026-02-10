(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.formBuilder = factory());
})(this, (function () { 'use strict';

	class Utilities {
		static GLOBAL_ATTRIBUTES = Object.freeze([
			'accesskey'
			, 'autocorrect'
			, 'class'
			, 'contenteditable'
			, 'dir'
			, 'disabled'
			, 'draggable'
			, 'enterkeyhint'
			, 'exportparts'
			, 'form'
			, 'hidden'
			, 'id'
			, 'inert'
			, 'inputmode'
			, 'is'
			, 'itemid'
			, 'itemprop'
			, 'itemref'
			, 'itemscope'
			, 'itemtype'
			, 'lang'
			, 'name'
			, 'nonce'
			, 'part'
			, 'popover'
			, 'role'
			, 'slot'
			, 'spellcheck'
			, 'style'
			, 'tabindex'
			, 'title'
			, 'translate'
			, 'virtualkeyboardpolicy'
			, 'writingsuggestions'
		, ]);

		constructor() {
			throw new Error('Utilities is static-only.');
		}

		static IS_ARGUMENT_FUNCTION(arg) {
			return Object.prototype.toString.call(arg) === '[object Function]';
		}

		static IS_ARGUMENT_OBJECT(arg) {
			return Object.prototype.toString.call(arg) === '[object Object]';
		}

		static IS_ARGUMENT_STRING(arg) {
			return Object.prototype.toString.call(arg) === '[object String]';
		}

		static isValidAttribute(attribute, typeSpecific = null) {
			if (!this.IS_ARGUMENT_STRING(attribute)) return false;

			attribute = attribute.toLowerCase();
			return (
				this.GLOBAL_ATTRIBUTES.includes(attribute) ||
				(!typeSpecific || typeSpecific.has(attribute)) ||
				attribute.startsWith('aria-') ||
				attribute.startsWith('data-')
			);
		}

		static flattenLegacyAttributes(config) {
			if (!this.IS_ARGUMENT_OBJECT(config)) {
				return config;
			}

			const result = {
				...config
			};

			if (this.IS_ARGUMENT_OBJECT(result.attributes)) {
				console.warn('[DEPRECATED] attributes is deprecated. Pass attributes directly to the config instead. Future releases will remove support for attributes.');
				for (const [k, v] of Object.entries(result.attributes)) {
					if (!(k in result)) result[k] = v;
				}
				delete result.attributes;
			}

			return result;
		}

		static normalizeLegacyOptions(options) {
			if (!Array.isArray(options)) {
				return options;
			}

			return options.map(item => {
				if (Utilities.IS_ARGUMENT_OBJECT(item) && item.optgroup) {
					return item.optgroup;
				}
				return item;
			});
		}

		static setAttribute(el, attr, value) {
			if (typeof value === 'boolean') {
				if (value) {
					el.setAttribute(attr, '');
				}
			} else {
				el.setAttribute(attr, value);
			}
		}
	}

	// inputs
	class Input {
		#_allowedAttributes;
		#_inputType;
		#_typeSpecificArguments;
		#_typeSpecificClass;

		static BOOTSTRAP_CLASS = 'form-control';
		static STRUCTURAL_KEYS = Object.freeze(new Set(['type', 'grid', 'label', 'datalist']));
		static TYPE_SPECIFIC_ARGUMENTS = Object.freeze(new Set(['grid']));

		constructor(inputType, typeSpecificArguments = [], typeSpecificClass) {
			this.#_inputType = inputType || 'text';
			this.#_typeSpecificArguments = Object.freeze([...typeSpecificArguments]);
			this.#_typeSpecificClass = typeSpecificClass || Input.BOOTSTRAP_CLASS;
			this.#_allowedAttributes = new Set([
				...Input.TYPE_SPECIFIC_ARGUMENTS
				, ...this.#_typeSpecificArguments
			, ]);
		}

		createElement(attributesWithValues = {}) {
			if (!Utilities.IS_ARGUMENT_OBJECT(attributesWithValues)) {
				console.warn('Input configuration must be an object.');
				attributesWithValues = {};
			}

			attributesWithValues = Utilities.flattenLegacyAttributes(attributesWithValues);

			const input = document.createElement('input');
			input.type = this.#_inputType;

			for (const [rawKey, value] of Object.entries(attributesWithValues)) {
				const key = rawKey.toLowerCase();
				if (Input.STRUCTURAL_KEYS.has(key)) {
					continue;
				}
				this.#_setAttribute(input, key, value);
			}

			this.#_applyBootstrapClass(input);
			return input;
		}

		#_setAttribute(input, attribute, value) {
			if (
				Utilities.isValidAttribute(attribute, this.#_allowedAttributes)
			) {
				Utilities.setAttribute(input, attribute, value);
			} else {
				console.warn(`'${attribute}' is invalid for <input type="${this.#_inputType}">`);
			}
		}

		#_applyBootstrapClass(input) {
			if (!input.classList.contains(this.#_typeSpecificClass)) {
				input.classList.add(this.#_typeSpecificClass);
			}
		}

		static getInputByType(type = 'text') {
			const mapping = {
				checkbox: CheckboxInput
				, color: ColorInput
				, date: DateInput
				, 'datetime-local': DatetimeLocalInput
				, email: EmailInput
				, file: FileInput
				, hidden: HiddenInput
				, image: ImageInput
				, month: MonthInput
				, number: NumberInput
				, password: PasswordInput
				, radio: RadioInput
				, range: RangeInput
				, search: SearchInput
				, tel: TelInput
				, text: TextInput
				, time: TimeInput
				, url: UrlInput
				, week: WeekInput
			, };

			const InputClass = mapping[type];
			if (!InputClass) {
				console.warn(`Unknown input type "${type}", defaulting to text.`);
				return new TextInput();
			}

			return new InputClass();
		}
	}

	class CheckboxInput extends Input {
		static INPUT_TYPE = 'checkbox';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'checked'
			, 'required'
			, 'value'
		, ];
		static TYPE_SPECIFIC_CLASS = 'form-check-input';

		constructor() {
			super(
				CheckboxInput.INPUT_TYPE
				, CheckboxInput.TYPE_SPECIFIC_ATTRIBUTES
				, CheckboxInput.TYPE_SPECIFIC_CLASS
			, );
		}

		isSwitch(attributesWithValues) {
			if (
				!attributesWithValues ||
				!Utilities.IS_ARGUMENT_OBJECT(attributesWithValues)
			) {
				return false;
			}
			const role = attributesWithValues.role ?? attributesWithValues?.attributes?.role;
			return role === 'switch';
		}
	}

	class ColorInput extends Input {
		static INPUT_TYPE = 'color';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'alpha'
			, 'autocapitalize'
			, 'autocomplete'
			, 'colorspace'
			, 'list'
			, 'value'
		, ];

		constructor() {
			super(ColorInput.INPUT_TYPE, ColorInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class DateInput extends Input {
		static INPUT_TYPE = 'date';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'list'
			, 'max'
			, 'min'
			, 'readonly'
			, 'required'
			, 'step'
			, 'value'
		, ];

		constructor() {
			super(DateInput.INPUT_TYPE, DateInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class DatetimeLocalInput extends Input {
		static INPUT_TYPE = 'datetime-local';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'list'
			, 'max'
			, 'min'
			, 'readonly'
			, 'required'
			, 'step'
			, 'value'
		, ];

		constructor() {
			super(
				DatetimeLocalInput.INPUT_TYPE
				, DatetimeLocalInput.TYPE_SPECIFIC_ATTRIBUTES
			, );
		}
	}

	class EmailInput extends Input {
		static INPUT_TYPE = 'email';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocomplete'
			, 'dirname'
			, 'list'
			, 'maxlength'
			, 'minlength'
			, 'multiple'
			, 'pattern'
			, 'placeholder'
			, 'readonly'
			, 'required'
			, 'size'
			, 'value'
		, ];

		constructor() {
			super(EmailInput.INPUT_TYPE, EmailInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class FileInput extends Input {
		static INPUT_TYPE = 'file';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'accept'
			, 'autocapitalize'
			, 'autocomplete'
			, 'capture'
			, 'list'
			, 'multiple'
			, 'readonly'
			, 'required'
			, 'value'
		, ];

		constructor() {
			super(FileInput.INPUT_TYPE, FileInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class HiddenInput extends Input {
		static INPUT_TYPE = 'hidden';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'dirname'
			, 'value'
		, ];

		constructor() {
			super(HiddenInput.INPUT_TYPE, HiddenInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class ImageInput extends Input {
		static INPUT_TYPE = 'image';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'alt'
			, 'autocapitalize'
			, 'autocomplete'
			, 'formaction'
			, 'formenctype'
			, 'formmethod'
			, 'formnovalidate'
			, 'formtarget'
			, 'height'
			, 'list'
			, 'readonly'
			, 'required'
			, 'src'
			, 'width'
		, ];

		constructor() {
			super(ImageInput.INPUT_TYPE, ImageInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class MonthInput extends Input {
		static INPUT_TYPE = 'month';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'list'
			, 'max'
			, 'min'
			, 'readonly'
			, 'required'
			, 'step'
			, 'value'
		, ];

		constructor() {
			super(MonthInput.INPUT_TYPE, MonthInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class NumberInput extends Input {
		static INPUT_TYPE = 'number';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'list'
			, 'max'
			, 'min'
			, 'placeholder'
			, 'readonly'
			, 'required'
			, 'step'
			, 'value'
		, ];

		constructor() {
			super(NumberInput.INPUT_TYPE, NumberInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class PasswordInput extends Input {
		static INPUT_TYPE = 'password';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocomplete'
			, 'maxlength'
			, 'minlength'
			, 'pattern'
			, 'placeholder'
			, 'readonly'
			, 'required'
			, 'size'
			, 'value'
		, ];

		constructor() {
			super(PasswordInput.INPUT_TYPE, PasswordInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class RadioInput extends Input {
		static INPUT_TYPE = 'radio';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'checked'
			, 'required'
			, 'value'
		, ];
		static TYPE_SPECIFIC_CLASS = 'form-check-input';

		constructor() {
			super(
				RadioInput.INPUT_TYPE
				, RadioInput.TYPE_SPECIFIC_ATTRIBUTES
				, RadioInput.TYPE_SPECIFIC_CLASS
			, );
		}
	}

	class RangeInput extends Input {
		static INPUT_TYPE = 'range';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'list'
			, 'max'
			, 'min'
			, 'step'
			, 'value'
		, ];
		static TYPE_SPECIFIC_CLASS = 'form-range';

		constructor() {
			super(
				RangeInput.INPUT_TYPE
				, RangeInput.TYPE_SPECIFIC_ATTRIBUTES
				, RangeInput.TYPE_SPECIFIC_CLASS
			, );
		}
	}

	class SearchInput extends Input {
		static INPUT_TYPE = 'search';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'dirname'
			, 'list'
			, 'maxlength'
			, 'minlength'
			, 'pattern'
			, 'placeholder'
			, 'readonly'
			, 'required'
			, 'size'
			, 'value'
		, ];

		constructor() {
			super(SearchInput.INPUT_TYPE, SearchInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class TelInput extends Input {
		static INPUT_TYPE = 'tel';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'dirname'
			, 'list'
			, 'maxlength'
			, 'minlength'
			, 'pattern'
			, 'placeholder'
			, 'readonly'
			, 'required'
			, 'size'
			, 'value'
		, ];

		constructor() {
			super(TelInput.INPUT_TYPE, TelInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class TextInput extends Input {
		static INPUT_TYPE = 'text';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'dirname'
			, 'list'
			, 'maxlength'
			, 'minlength'
			, 'pattern'
			, 'placeholder'
			, 'readonly'
			, 'required'
			, 'size'
			, 'value'
		, ];

		constructor() {
			super(TextInput.INPUT_TYPE, TextInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class TimeInput extends Input {
		static INPUT_TYPE = 'time';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'list'
			, 'max'
			, 'min'
			, 'readonly'
			, 'required'
			, 'step'
			, 'value'
		, ];

		constructor() {
			super(TimeInput.INPUT_TYPE, TimeInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class UrlInput extends Input {
		static INPUT_TYPE = 'url';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'dirname'
			, 'list'
			, 'maxlength'
			, 'minlength'
			, 'pattern'
			, 'placeholder'
			, 'readonly'
			, 'required'
			, 'size'
			, 'value'
		, ];

		constructor() {
			super(UrlInput.INPUT_TYPE, UrlInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	class WeekInput extends Input {
		static INPUT_TYPE = 'week';
		static TYPE_SPECIFIC_ATTRIBUTES = [
			'autocapitalize'
			, 'autocomplete'
			, 'list'
			, 'max'
			, 'min'
			, 'readonly'
			, 'required'
			, 'step'
			, 'value'
		, ];

		constructor() {
			super(WeekInput.INPUT_TYPE, WeekInput.TYPE_SPECIFIC_ATTRIBUTES);
		}
	}

	// selects
	class Select {

		static BOOTSTRAP_CLASS = 'form-select';
		static STRUCTURAL_KEYS = Object.freeze(new Set(['type', 'grid', 'label', 'options']));
		static TYPE_SPECIFIC_ARGUMENTS = Object.freeze(new Set([
			'autofocus'
			, 'disabled'
			, 'multiple'
			, 'name'
			, 'required'
			, 'size'
		, ]));

		static createElement(config = {}) {
			if (!Utilities.IS_ARGUMENT_OBJECT(config)) {
				console.warn('Select config must be an object.');
				config = {};
			}

			config = this.normalizeSelectConfig(config);

			if (Array.isArray(config.options)) {
				config.options = Utilities.normalizeLegacyOptions(config.options);
			}

			const select = document.createElement('select');

			for (const [rawKey, value] of Object.entries(config)) {
				const key = rawKey.toLowerCase();
				if (this.STRUCTURAL_KEYS.has(key)) {
					continue;
				}

				if (Utilities.isValidAttribute(key, this.TYPE_SPECIFIC_ARGUMENTS)) {
					Utilities.setAttribute(select, key, value);
				} else {
					console.warn(`'${key}' is an invalid attribute for <select>.`);
				}
			}

			select.classList.add(this.BOOTSTRAP_CLASS);

			if (Array.isArray(config.options)) {
				const optionBuilder = new Option();

				for (const item of config.options) {
					if (
						Utilities.IS_ARGUMENT_OBJECT(item) &&
						Array.isArray(item.options)
					) {
						select.appendChild(OptGroup.createElement(item));
					} else {
						select.appendChild(optionBuilder.createElement(item));
					}
				}
			}

			return select;
		}

		static normalizeSelectConfig(config) {
			config = Utilities.flattenLegacyAttributes(config);

			if (Array.isArray(config.options)) {
				config.options = Utilities.normalizeLegacyOptions(config.options);
			}

			return config;
		}
	}

	class Option {
		static TYPE_SPECIFIC_ARGUMENTS = Object.freeze(new Set([
			'disabled'
			, 'label'
			, 'selected'
			, 'value'
		, ]));

		createElement(attributesWithValues = {}) {
			const option = document.createElement('option');

			if (Utilities.IS_ARGUMENT_STRING(attributesWithValues)) {
				option.value = attributesWithValues;
				option.textContent = attributesWithValues;
				return option;
			}

			if (!Utilities.IS_ARGUMENT_OBJECT(attributesWithValues)) {
				console.warn('Option configuration must be a string or object.');
				return option;
			}

			const {
				text
				, ...attrs
			} = attributesWithValues;
			if (text) {
				option.textContent = text;
			}
			for (const [rawKey, value] of Object.entries(attrs)) {
				const key = rawKey.toLowerCase();
				this.#_setAttribute(option, key, value);
			}

			return option;
		}

		#_setAttribute(option, attribute, value) {
			if (Utilities.isValidAttribute(attribute, this.TYPE_SPECIFIC_ARGUMENTS)) {
				Utilities.setAttribute(option, attribute, value);
			} else {
				console.warn(`'${attribute}' is invalid for <option>.`);
			}
		}
	}

	class OptGroup {

		static STRUCTURAL_KEYS = Object.freeze(new Set(['options']));
		static TYPE_SPECIFIC_ARGUMENTS = Object.freeze(new Set(['label', 'disabled']));

		static createElement(config) {
			if (!Utilities.IS_ARGUMENT_OBJECT(config)) {
				console.warn('OptGroup config must be an object.');
				return document.createElement('optgroup');
			}

			const optgroup = document.createElement('optgroup');

			for (const [rawKey, value] of Object.entries(config)) {
				const key = rawKey.toLowerCase();
				if (this.STRUCTURAL_KEYS.has(key)) {
					continue;
				}

				if (Utilities.isValidAttribute(key, this.TYPE_SPECIFIC_ARGUMENTS)) {
					Utilities.setAttribute(optgroup, key, value);
				} else {
					console.warn(`'${key}' is invalid for <optgroup>.`);
				}
			}

			if (Array.isArray(config.options)) {
				const optionBuilder = new Option();
				for (const optionConfig of config.options) {
					optgroup.appendChild(optionBuilder.createElement(optionConfig));
				}
			}

			return optgroup;
		}
	}

	class Datalist {

		static STRUCTURAL_KEYS = Object.freeze(new Set(['options']));

		static createElement(attributesWithValues = null) {
			const datalist = document.createElement('datalist');

			if (Array.isArray(attributesWithValues)) {
				attributesWithValues = {
					options: attributesWithValues
				};
			} else if (!Utilities.IS_ARGUMENT_OBJECT(attributesWithValues)) {
				if (attributesWithValues) {
					console.warn('Datalist attributes must be an object or an array.');
				}
				attributesWithValues = {};
			}

			for (let key in attributesWithValues) {
				if (this.STRUCTURAL_KEYS.has(key)) {
					continue;
				}

				const value = attributesWithValues[key];
				this.#_setAttribute(datalist, key, value);
			}

			if (Array.isArray(attributesWithValues.options)) {
				const optionBuilder = new Option();

				for (let optionConfig of attributesWithValues.options) {
					const option = optionBuilder.createElement(optionConfig);
					datalist.appendChild(option);
				}
			} else {
				console.warn('Datalist "options" must be an array.');
			}

			return datalist;
		}

		static #_setAttribute(datalist, attribute, value) {
			if (Utilities.isValidAttribute(attribute)) {
				Utilities.setAttribute(datalist, attribute, value);
			} else {
				console.warn(`'${attribute}' is an invalid attribute for datalist.`);
			}
		}
	}

	// labels
	class Label {
		static BOOTSTRAP_CLASS = 'form-label';

		static getLabelByType(type) {
			return type === 'checkbox' || type === 'radio' ?
				new CheckRadioLabel() :
				new Label();
		}

		createElement(config = {}) {
			const label = document.createElement('label');

			if (Utilities.IS_ARGUMENT_STRING(config)) {
				label.textContent = config;
			} else if (Utilities.IS_ARGUMENT_OBJECT(config)) {
				const {
					text
					, ...attrs
				} = config;
				if (text) {
					label.textContent = text;
				}

				for (const [key, value] of Object.entries(attrs)) {
					if (Utilities.isValidAttribute(key)) {
						Utilities.setAttribute(label, key, value);
					}
				}
			}

			label.classList.add(Label.BOOTSTRAP_CLASS);
			return label;
		}
	}

	class CheckRadioLabel extends Label {
		constructor() {
			super();
		}
	}

	// form
	class FormField {

		static createElement(attributesWithValues = null) {
			let container = null;
			let labelElement = null;
			let innerContainer = null;
			let element = null;
			
			if (Fieldset.isFieldset(attributesWithValues)) {
				container = Fieldset.createElement(attributesWithValues);
			} else if (Utilities.IS_ARGUMENT_OBJECT(attributesWithValues)) {
				container = this.#_createContainer();

				if (attributesWithValues.label) {
					const label = Label.getLabelByType(attributesWithValues.type);
					labelElement = label.createElement(attributesWithValues.label);
					attributesWithValues = {
						...attributesWithValues
					};
					delete attributesWithValues.label;
				}

				if (attributesWithValues.type === 'select') {
					element = Select.createElement(attributesWithValues);
					container.appendChild(element);
				} else {
					const inputType = attributesWithValues.type;
					const input = Input.getInputByType(attributesWithValues.type);
					element = input.createElement(attributesWithValues);
					if (
						inputType === CheckboxInput.INPUT_TYPE ||
						inputType === RadioInput.INPUT_TYPE
					) {
						innerContainer = this.#_createContainer();
						innerContainer.classList.add('form-check');
					}

					if (
						input instanceof CheckboxInput &&
						input.isSwitch(attributesWithValues)
					) {
						element.setAttribute('role', 'switch');
						container.classList.add('form-switch');
					}
				}
			} else {
				console.warn('FormField must be a Fieldset or Input');
				return null;
			}

			if (innerContainer) {
				innerContainer.appendChild(labelElement);
				innerContainer.appendChild(element);
				container.appendChild(innerContainer);
			} else {
				container.appendChild(labelElement);
				container.appendChild(element);
			}
			this.#_setContainerGrid(container, attributesWithValues);

			return container;
		}

		static #_createContainer() {
			const div = document.createElement('div');
			return div;
		}

		static #_setContainerGrid(container, attributesWithValues) {
			const grid = attributesWithValues?.grid;
			if (!grid) {
				return;
			}

			if (Utilities.IS_ARGUMENT_STRING(grid)) {
				container.classList.add(grid);
			} else if (Number.isInteger(grid)) {
				if (grid >= 1 && grid <= 12) {
					container.classList.add(`col-${grid}`);
				} else {
					console.warn(`When FormField "grid" is a number, it must be between 1 - 12. Value: ${grid}`);
				}
			} else if (Utilities.IS_ARGUMENT_OBJECT(grid)) {
				for (const [bp, size] of Object.entries(grid)) {
					container.classList.add(`col-${bp}-${size}`);
				}
			} else {
				console.warn('FormField "grid" is not a valid string, number, or object.');
			}
		}

	}

	class Form {

		static STRUCTURAL_KEYS = Object.freeze(new Set(['fieldsets']));
		static TYPE_SPECIFIC_ARGUMENTS = Object.freeze(new Set([
			'accept'
			, 'accept-charset'
			, 'action'
			, 'autocapitalize'
			, 'autocomplete'
			, 'enctype'
			, 'method'
			, 'name'
			, 'novalidate'
			, 'rel'
			, 'target'
		, ]));

		static createElement(attributesWithValues = null) {
			const form = document.createElement('form');

			if (!Utilities.IS_ARGUMENT_OBJECT(attributesWithValues)) {
				if (attributesWithValues) {
					console.warn('Form attributes must be an object.');
				}
				attributesWithValues = {};
			}

			attributesWithValues = Utilities.flattenLegacyAttributes(attributesWithValues);

			for (const [rawKey, value] of Object.entries(attributesWithValues)) {
				const key = rawKey.toLowerCase();
				if (this.STRUCTURAL_KEYS.has(key)) {
					continue;
				}

				this.#_setAttribute(form, key, value);
			}

			if (Array.isArray(attributesWithValues.fieldsets)) {
				for (let fieldset of attributesWithValues.fieldsets) {
					const child = Fieldset.createElement(fieldset);
					if (child) {
						form.appendChild(child);
					}
				}
			} else if (attributesWithValues.fieldsets) {
				console.warn('Form "fieldsets" must be an array.');
			}

			return form;
		}

		static #_setAttribute(form, attribute, value) {
			if (Utilities.isValidAttribute(attribute, this.TYPE_SPECIFIC_ARGUMENTS)) {
				Utilities.setAttribute(form, attribute, value);
			} else {
				console.warn(`'${attribute}' is an invalid attribute for form.`);
			}
		}

	}

	class Fieldset {

		static STRUCTURAL_KEYS = Object.freeze(new Set(['fields', 'legend']));
		static TYPE_SPECIFIC_ARGUMENTS = Object.freeze(new Set(['disabled', 'form', 'grid', 'name']));

		static createElement(attributesWithValues = null) {
			const fieldset = document.createElement('fieldset');

			if (!Utilities.IS_ARGUMENT_OBJECT(attributesWithValues)) {
				if (attributesWithValues) {
					console.warn('Fieldset attributes must be an object.');
				}
				attributesWithValues = {};
			}

			if (Utilities.IS_ARGUMENT_STRING(attributesWithValues.legend)) {
				const legend = document.createElement('legend');
				legend.innerText = attributesWithValues.legend;
				fieldset.appendChild(legend);
			}

			attributesWithValues = Utilities.flattenLegacyAttributes(attributesWithValues);

			for (const [rawKey, value] of Object.entries(attributesWithValues)) {
				const key = rawKey.toLowerCase();
				if (this.STRUCTURAL_KEYS.has(key)) {
					continue;
				}
				this.#_setAttribute(fieldset, key, value);
			}

			if (Array.isArray(attributesWithValues.fields)) {
				for (let field of attributesWithValues.fields) {
					const child = FormField.createElement(field);
					if (child) {
						fieldset.appendChild(child);
					}
				}
			} else if (attributesWithValues.fields) {
				console.warn('Fieldset "fields" must be an array.');
			}

			fieldset.classList.add('row');

			return fieldset;
		}

		static isFieldset(field) {
			return Utilities.IS_ARGUMENT_OBJECT(field) && Array.isArray(field.fields);
		}

		static #_setAttribute(fieldset, attribute, value) {
			if (Utilities.isValidAttribute(attribute, this.TYPE_SPECIFIC_ARGUMENTS)) {
				Utilities.setAttribute(fieldset, attribute, value);
			} else {
				console.warn(`'${attribute}' is an invalid attribute for fieldset.`);
			}
		}

	}

	class formBuilder {

		static buildForm(options) {
			console.warn('[DEPRECATED] formBuilder is deprecated, use FormBuilder instead. Future releases will remove support for formBuilder.');
			const {
				submit
				, ...attributesWithValues
			} = options;
			const form = Form.createElement(attributesWithValues);
			if (Utilities.IS_ARGUMENT_FUNCTION(submit) && form) {
				form.addEventListener('submit', submit);
			}
			return form;
		}

	}

	return formBuilder;

}));
//# sourceMappingURL=bootstrap-form-builder.umd.js.map
