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
      console.warn(`'${attribute}' is an invalid form attribute.`);
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
      console.warn('fieldset.legend is not a string');
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
        console.warn('field.label is not a string');
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

formBuilder.buildInput = (field, fieldType) => {
  // valdiate the field parameter
  if (typeof field !== 'object' || field == null) {
    return null;
  }

  // validate the fieldType parameter
  if (Object.prototype.toString.call(fieldType) !== "[object String]") {
    return null;
  }

  // create the input
  const input = document.createElement('input');
  input.setAttribute('type', fieldType);

  // iterate over each attribute to set the input attribute
  const attributes = Object.keys(field.attributes);
  attributes.forEach(attribute => {
    if (formBuilder.isValidInputAttribute(fieldType, attribute)) {
      input.setAttribute(attribute, field.attributes[attribute]);
    } else {
      console.warn(`'${attribute}' is an invalid attribute for ${fieldType}.`);
    }
  });
  if (attributes.indexOf('class') < 0 || attributes.class.indexOf('form-control') < 0) {
    input.classList.add('form-control');
  }

  // return the input
  return input;
};

formBuilder.buildLabel = (label) => {
  // validate the label parameter
  if (Object.prototype.toString.call(label) !== "[object String]") {
    return null;
  }

  // create the label
  const labelElement = document.createElement('label');
  labelElement.setAttribute('class', 'form-label');
  labelElement.innerHTML = label;

  // return the label
  return labelElement;
};

formBuilder.isValidFieldType = (field) => {
  // validate the field parameter
  if (typeof field !== 'object' || field == null || !field.hasOwnProperty('type')) {
    return false;
  }

  // enumerate the acceptable types
  const acceptedTypes = [
    'checkbox',
    'color',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'search',
    'tel',
    'text',
    'time',
    'url',
    'week'
  ];

  // return if the field.type is one of the acceptable types
  return acceptedTypes.indexOf(field.type) > -1;
};

formBuilder.isValidFormAttribute = (attribute) => {
  if (Object.prototype.toString.call(attribute) !== "[object String]") {
    return false;
  }
  const attributes = [
    'accept',
    'accept-charset',
    'accesskey',
    'action',
    'autocapitalize',
    'autocomplete',
    'autofocus',
    'class',
    'contenteditable',
    'context-menu',
    'dir',
    'draggable',
    'enctype',
    'enterkeyhint',
    'exportparts',
    'hidden',
    'id',
    'inputmode',
    'is',
    'itemid',
    'itemprop',
    'itemref',
    'itemscope',
    'itemtype',
    'lang',
    'method',
    'name',
    'nonce',
    'novalidate',
    'part',
    'rel',
    'slot',
    'spellcheck',
    'style',
    'tabindex',
    'target',
    'title',
    'translate'
  ];
  if (attributes.indexOf(attribute) > -1) {
    return true;
  }
  if (attribute.indexOf('data-') > 0 && attribute.length > 5) {
    return true;
  }

  return false;
};

formBuilder.isValidInputAttribute = (type, attribute) => {
  if (Object.prototype.toString.call(attribute) !== "[object String]") {
    return false;
  }
  const allTypeAttributes = [
    'accesskey',
    'autocapitalize',
    'autocomplete',
    'autofocus',
    'class',
    'contenteditable',
    'context-menu',
    'dir',
    'disabled',
    'draggable',
    'enterkeyhint',
    'exportparts',
    'form',
    'hidden',
    'id',
    'inputmode',
    'is',
    'itemid',
    'itemprop',
    'itemref',
    'itemscope',
    'itemtype',
    'lang',
    'list',
    'name',
    'nonce',
    'part',
    'readonly',
    'required',
    'slot',
    'spellcheck',
    'style',
    'tabindex',
    'title',
    'translate',
    'value'
  ];
  if (allTypeAttributes.indexOf(attribute) > -1) {
    return true;
  }
  if (attribute.indexOf('data-') > 0 && attribute.length > 5) {
    return true;
  }

  if (type === 'checkbox') {
    const checkboxAttributes = [
      'checked'
    ];
    return checkboxAttributes.indexOf(attribute) > -1;
  }

  if (type === 'color') {
    const colorAttributes = [
      'list'
    ];
    return colorAttributes.indexOf(attribute) > -1;
  }

  if (type === 'date') {
    const dateAttributes = [
      'list',
      'max',
      'min',
      'readonly',
      'required',
      'step'
    ];
    return dateAttributes.indexOf(attribute) > -1;
  }

  if (type === 'datetime-local') {
    const datetimeLocalAttributes = [
      'list',
      'max',
      'min',
      'readonly',
      'required',
      'step'
    ];
    return datetimeLocalAttributes.indexOf(attribute) > -1;
  }

  if (type === 'email') {
    const emailAttributes = [
      'list',
      'readonly',
      'required'
    ];
    return emailAttributes.indexOf(attribute) > -1;
  }

  if (type === 'file') {
    const fileAttributes = [
      'accept',
      'capture',
      'multiple',
      'required'
    ];
    return fileAttributes.indexOf(attribute) > -1;
  }

  if (type === 'hidden') {
    return false;
  }

  if (type === 'month') {
    const monthAttributes = [
      'list',
      'max',
      'min',
      'readonly',
      'required',
      'step'
    ];
    return monthAttributes.indexOf(attribute) > -1;
  }

  if (type === 'number') {
    const numberAttributes = [
      'max',
      'min',
      'required',
      'step'
    ];
    return numberAttributes.indexOf(attribute) > -1;
  }

  if (type === 'password') {
    const passwordAttributes = [
      'maxlength',
      'minlength',
      'readonly',
      'required',
      'pattern',
      'placeholder',
      'size'
    ];
    return passwordAttributes.indexOf(attribute) > -1;
  }

  if (type === 'radio') {
    const radioAttributes = [
      'checked'
    ];
    return radioAttributes.indexOf(attribute) > -1;
  }

  if (type === 'range') {
    const rangeAttributes = [
      'list'
    ];
    return rangeAttributes.indexOf(attribute) > -1;
  }

  if (type === 'search') {
    const searchAttributes = [
      'dirname',
      'list',
      'maxlength',
      'minlength',
      'placeholder',
      'readonly',
      'required'
    ];
    return searchAttributes.indexOf(attribute) > -1;
  }

  if (type === 'tel') {
    const telAttributes = [
      'list',
      'maxlength',
      'minlength',
      'pattern',
      'placeholder',
      'readonly',
      'required',
      'size'
    ];
    return telAttributes.indexOf(attribute) > -1;
  }

  if (type === 'text') {
    const textAttributes = [
      'dirname',
      'list',
      'maxlength',
      'minlength',
      'pattern',
      'placeholder',
      'readonly',
      'required',
      'size'
    ];
    return textAttributes.indexOf(attribute) > -1;
  }

  if (type === 'time') {
    const timeAttributes = [
      'list',
      'max',
      'min',
      'readonly',
      'required',
      'step'
    ];
    return timeAttributes.indexOf(attribute) > -1;
  }

  if (type === 'url') {
    const timeAttributes = [
      'list',
      'maxlength',
      'minlength',
      'placeholder',
      'readonly',
      'required'
    ];
    return timeAttributes.indexOf(attribute) > -1;
  }

  if (type === 'week') {
    const weekAttributes = [
      'list',
      'max',
      'min',
      'readonly',
      'required',
      'step'
    ];
    return weekAttributes.indexOf(attribute) > -1;
  }

  return false;
};
