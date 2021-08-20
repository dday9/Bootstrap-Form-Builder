
# Bootstrap Form Builder

A simple solution for creating Bootstrap forms on the fly.

## Demo
Demo Files: [./demo](./demo)
Fiddle: https://jsfiddle.net/ux84votz/

## Dependencies
### CSS
 - Bootstrap 5.0

## Options
The option passed to the `formBuilder.buildForm` method is the core behind the form builder library. The option can be represented as the following interface:
```js
interface IOption {
  attributes?: object[];
  fieldsets?: IFieldset[];
  submit?: (e) => void;
}

interface IFieldset {
  legend?: string;
  fields?: IField[];
}

interface IField {
  attributes?: object[];
  datalist?: IDatalist;
  label?: string;
  type: string;
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
