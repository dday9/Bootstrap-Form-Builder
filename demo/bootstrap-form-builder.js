const formBuilder = {};

formBuilder.buildForm = (options) => {
	// validate the options parameter
	options = options || {};
	if (typeof options !== 'object' || options == null) {
		console.error('options is not a valid object');
		return null;
	}

	// validate the options.fieldsets parameter
	options.fieldsets = options.fieldsets || [];
	if (!Array.isArray(options.fieldsets)) {
		console.error('options.fieldset is not an array');
		return null;
	}

	// validate the options.attributes
	options.attributes = options.attributes || {};
	if (typeof options.attributes !== 'object' || options.attributes == null) {
		console.error('options.attributes is not a valid object');
		return null;
	}

	// create the form
	const form = document.createElement('form');

	// create a random id
	const rightNow = new Date();
	form.id = rightNow.getTime();

	// optionally bind to the submit event
	if (options.submit) {
		if ({}.toString.call(options.submit) !== '[object Function]') {
			console.error('options.submit is not a valid function');
			return;
		}
		// add the event listenter to document
		document.addEventListener('submit', (e) => {
			// check if the target is the form
			if (e.target && e.target.id === form.id) {
				// call the submit callback, passing e
				options.submit(e);
			}
		});
	}

	// iterate over every attribute to set the form attribute
	const attributes = Object.keys(options.attributes);
	attributes.forEach(attribute => {
		if (formBuilder.isValidFormAttribute(attribute)) {
			form.setAttribute(attribute, options.attributes[attribute]);
		} else {
			console.log(`'${attribute}' is an invalid form attribute.`);
		}
	});

	// iterate over every fieldset
	options.fieldsets.forEach(fieldset => {
		// create and append the fieldset to the form
		const fieldsetElement = formBuilder.buildFieldset(fieldset);
		if (fieldsetElement) {
			form.append(fieldsetElement);
		}
	});

	// return the form
	return form;
};

formBuilder.buildDatalist = (datalist) => {
	// validate the datalist parameter
	if (typeof datalist !== 'object' || datalist == null) {
		return null;
	}

	// require an id property
	if (!datalist.hasOwnProperty('id')) {
		console.error('datalist is missing the required property \'id\'');
		return null;
	}

	// require a values property
	if (!datalist.hasOwnProperty('values')) {
		console.error('datalist is missing the required property \'values\'');
		return null;
	}

	// require that the values property be an array
	if (!Array.isArray(datalist.values)) {
		console.error('datalist.values is not an array');
		return null;
	}

	// create the datalist
	const datalistElement = document.createElement('datalist');
	datalistElement.id = datalist.id;

	// iterate over the values to create an option with a value
	datalist.values.forEach(value => {
		const option = document.createElement('option');
		option.value = value;
		datalistElement.append(option);
	});

	// return the datalist
	return datalistElement;
};

formBuilder.buildFieldset = (fieldset) => {
	// validate the fieldset parameter
	if (typeof fieldset !== 'object' || fieldset == null) {
		console.error('fieldset is not a valid object');
		return null;
	}

	// validate the fieldset.fields parameter
	fieldset.fields = fieldset.fields || [];
	if (!Array.isArray(fieldset.fields)) {
		console.error('fieldset.fields is not an array');
		return null;
	}

	// create the element
	const fieldsetElement = document.createElement('fieldset');

	// optionally create a legend
	if (fieldset.legend) {
		if (Object.prototype.toString.call(fieldset.legend) !== "[object String]") {
			// validate the legend property
			console.log('fieldset.legend is not a string');
		} else {
			// create the legend element and append it to the fieldset
			const legend = document.createElement('legend');
			legend.innerHTML = fieldset.legend;
			fieldsetElement.append(legend);
		}
	}

	// iterate over each field
	fieldset.fields.forEach(field => {
		// create the div container
		const divContainer = document.createElement('div');
		divContainer.setAttribute('class', 'mb-3');

		// validate the field type or default to text
		const fieldType = (formBuilder.isValidFieldType(field) ? field.type : 'text');

		// optionally create the label
		if (field.label) {
			if (Object.prototype.toString.call(field.label) !== "[object String]") {
				// validate the legend property
				console.log('field.label is not a string');
			} else {
				// create the label and append it to the div container
				const label = formBuilder.buildLabel(field.label);
				if (label) {
					divContainer.append(label);
				}
			}
		}

		// create the input and append it to the div container
		const input = formBuilder.buildInput(field, fieldType);
		if (input) {
			divContainer.append(input);
		}

		// optionally create the datalist
		if (field.hasOwnProperty('datalist') && typeof field.datalist === 'object' && field.datalist !== null) {
			const datalist = formBuilder.buildDatalist(field.datalist);
			if (datalist) {
				divContainer.append(datalist);
			}
		}

		// append the div container
		fieldsetElement.append(divContainer);
	});

	// return the fieldset
	return fieldsetElement;
};
