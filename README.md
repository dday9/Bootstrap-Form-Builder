
# Bootstrap Form Builder

A simple solution for creating Bootstrap forms on the fly.

## Demo
Demo Files: [./demo](./demo)

Fiddle: https://jsfiddle.net/mo96241a/

## Dependencies
### CSS
 - Bootstrap 5.0

## Options
The option passed to the `formBuilder.buildForm` method is the core behind the form builder library. The option can be represented as the following interface:
```js
interface IForm {
  attributes?: IFormAttribute[];
  fieldsets?: IFieldset[];
  submit?: (e) => void;
}

interface IFormAttribute {
  accept?: string;
  accept-charset?: string;
  accesskey?: string;
  action?: string;
  autocapitalize?: string;
  autocomplete?: string;
  autofocus?: string;
  class?: string;
  contenteditable?: string;
  context-menu?: string;
  dir?: string;
  draggable?: string;
  enctype?: string;
  enterkeyhint?: string;
  exportparts?: string;
  hidden?: string;
  id?: string;
  inputmode?: string;
  is?: string;
  itemid?: string;
  itemprop?: string;
  itemref?: string;
  itemscope?: string;
  itemtype?: string;
  lang?: string;
  method?: string;
  name?: string;
  nonce?: string;
  novalidate?: string;
  part?: string;
  rel?: string;
  slot?: string;
  spellcheck?: string;
  style?: string;
  tabindex?: string;
  target?: string;
  title?: string;
  translate?: string;
}

interface IFieldset {
  legend?: string;
  fields?: IField[];
}

interface IField {
  attributes?: object[];
  datalist?: IDatalist;
  label?: string;
  type: 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
}

interface IDatalist {
  id: string;
  values: string[];
}
```

## Example
The following is an example of dynamically building a contact form:
```js
const contactForm = formBuilder.buildForm({
  attributes: {
    enctype: 'application/x-www-form-urlencoded',
    method: 'post',
  },
  fieldsets: [
    {
      legend: 'Name',
      fields: [
        {
          attributes: {
            name: 'firstName',
            placeholder: 'John'
          },
          label: 'First Name'
        },
        {
          attributes: {
            name: 'lastName',
          placeholder: 'Doe'
          },
          label: 'Last Name'
        },
        {
          attributes: {
            name: 'email'
          },
          label: 'Email Address',
          type: 'email'
        }
      ]
    },
    {
      legend: 'Address',
      fields: [
        {
          attributes: {
            name: 'street1',
            placeholder: '123 Main St'
          },
          label: 'Street'
        },
        {
          attributes: {
            name: 'city',
            placeholder: 'Anytown'
          },
          label: 'City'
        },
        {
          attributes: {
            list: 'datalist-states',
            name: 'state'
          },
          datalist: {
            id: 'datalist-states',
            values: [ 'AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','PR','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI','WV','WY']
          },
          label: 'State',
        },
        {
          attributes: {
            name: 'zip',
            pattern: '\\d{5}',
            placeholder: '12345'
          },
          label: 'Zip Code',
          type: 'tel'
        }
      ]
    }
  ],
  submit: (e) => {
    e.preventDefault();
    console.log('submit');
  }
});
```

## Donate
Show your support! Your (non-tax deductible) donation of Monero cryptocurrency is a sign of solidarity among web developers.

Being self taught, I have come a long way over the years. I certainly do not intend on making a living from this free feature, but my hope is to earn a few dollars to validate all of my hard work.

Monero Address: 447SPi8XcexZnF7kYGDboKB6mghWQzRfyScCgDP2r4f2JJTfLGeVcFpKEBT9jazYuW2YG4qn51oLwXpQJ3oEXkeXUsd6TCF

![447SPi8XcexZnF7kYGDboKB6mghWQzRfyScCgDP2r4f2JJTfLGeVcFpKEBT9jazYuW2YG4qn51oLwXpQJ3oEXkeXUsd6TCF](monero.png)
