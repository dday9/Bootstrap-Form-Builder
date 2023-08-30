
# Bootstrap Form Builder

A simple solution for creating Bootstrap forms on the fly.

## Demo
Demo Files: [./demo](./demo)

Fiddle: https://jsfiddle.net/sr92ubq3/

## Dependencies
### CSS
 - Bootstrap 5.0

## Options
The option passed to the `formBuilder.buildForm` method is the core behind the form builder library. The option can be represented as the following interface:
```js
interface IForm {
  attributes?: IFormAttribute;
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
  fields?: IField[] | ISelect[];
  grid?: boolean;
}

interface IField {
  attributes?: object[];
  datalist?: IDatalist;
  grid?: string | IGrid;
  label?: string;
  type: 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
}

interface IGrid {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

interface ISelect {
  attributes: object[]; // attributes must have an options property
  label?: string;
  type?: 'select';
}

interface IDatalist {
  id: string;
  values: string[];
}
```

## Example
The following is an example of dynamically building a contact form:
```js
window.addEventListener('load', () => {
  const contactFormOptions = {
    attributes: {
      enctype: 'application/x-www-form-urlencoded',
      method: 'post'
    },
    fieldsets: [
      {
        grid: true,
        legend: 'Name',
        fields: [
        {
          attributes: {
            name: 'firstName',
            placeholder: 'John'
          },
          label: 'First Name',
          grid: {
            xs: 12,
            md: 4
          }
        },
        {
          attributes: {
            name: 'lastName',
            placeholder: 'Doe'
          },
          label: 'Last Name',
          grid: {
            xs: 12,
            md: 4
          }
        },
        {
          attributes: {
            name: 'email'
          },
          label: 'Email Address',
          type: 'email',
          grid: {
            xs: 12,
            md: 4
          }
        }]
      },
      {
        grid: true,
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
          label: 'City',
          grid: {
            xs: 12,
            md: 4
          }
        },
        {
          attributes: {
            name: 'state',
            options: [
            {
              optgroup: {
                label: 'A',
                options: [
                  {
                    text: 'Alabama',
                    value: 'AL'
                  },
                  {
                    text: 'Alaska',
                    value: 'AK'
                  },
                  {
                    text: 'Arizona',
                    value: 'AZ'
                  },
                  {
                    text: 'Arkansas',
                    value: 'AR'
                  }
                ]
              }
            },
            {
              optgroup: {
                label: 'C',
                options: [
                  {
                    text: 'California',
                    value: 'CA'
                  },
                  {
                    text: 'Colorado',
                    value: 'CO'
                  },
                  {
                    text: 'Connecticut',
                    value: 'CT'
                  }
                ]
              }
            },
            {
              optgroup: {
                label: 'D',
                options: [
                  {
                    text: 'Delaware',
                    value: 'DE'
                  },
                  {
                    text: 'District of Columbia',
                    value: 'DC'
                  }
                ]
              }
            },
            {
              text: 'Florida',
              value: 'FL'
            },
            {
              text: 'Georgia',
              value: 'GA'
            },
            {
              text: 'Hawaii',
              value: 'HI'
            },
            {
              optgroup: {
                label: 'I',
                options: [
                  {
                    text: 'Idaho',
                    value: 'ID'
                  },
                  {
                    text: 'Illinois',
                    value: 'IL'
                  },
                  {
                    text: 'Indiana',
                    value: 'IN'
                  },
                  {
                    text: 'Iowa',
                    value: 'IA'
                  }
                ]
              }
            },
            {
              optgroup: {
                label: 'K',
                options: [
                  {
                    text: 'Kansas',
                    value: 'KS'
                  },
                  {
                    text: 'Kentucky',
                    value: 'KY'
                  }
                ]
              }
            },
            {
              text: 'Louisiana',
              value: 'LA'
            },
            {
              optgroup: {
                label: 'M',
                options: [
                  {
                    text: 'Maine',
                    value: 'ME'
                  },
                  {
                    text: 'Maryland',
                    value: 'MD'
                  },
                  {
                    text: 'Massachusetts',
                    value: 'MA'
                  },
                  {
                    text: 'Michigan',
                    value: 'MI'
                  },
                  {
                    text: 'Minnesota',
                    value: 'MN'
                  },
                  {
                    text: 'Mississippi',
                    value: 'MS'
                  },
                  {
                    text: 'Missouri',
                    value: 'MO'
                  },
                  {
                    text: 'Montana',
                    value: 'MT'
                  }
                ]
              }
            },
            {
              optgroup: {
                label: 'N',
                options: [
                  {
                    text: 'Nebraska',
                    value: 'NE'
                  },
                  {
                    text: 'Nevada',
                    value: 'NV'
                  },
                  {
                    text: 'New Hampshire',
                    value: 'NH'
                  },
                  {
                    text: 'New Jersey',
                    value: 'NJ'
                  },
                  {
                    text: 'New Mexico',
                    value: 'NM'
                  },
                  {
                    text: 'New York',
                    value: 'NY'
                  },
                  {
                    text: 'North Carolina',
                    value: 'NC'
                  },
                  {
                    text: 'North Dakota',
                    value: 'ND'
                  }
                ]
              }
            },
            {
              optgroup: {
                label: 'O',
                options: [
                  {
                    text: 'Ohio',
                    value: 'OH'
                  },
                  {
                    text: 'Oklahoma',
                    value: 'OK'
                  },
                  {
                    text: 'Oregan',
                    value: 'OR'
                  }
                ]
              }
            },
            {
              text: 'Pennsilvania',
              value: 'PA'
            },
            {
              text: 'Rhode Island',
              value: 'RI'
            },
            {
              optgroup: {
                label: 'S',
                options: [
                  {
                    text: 'South Carolina',
                    value: 'SC'
                  },
                  {
                    text: 'South Dakota',
                    value: 'SD'
                  }
                ]
              }
            },
            {
              optgroup: {
                label: 'T',
                options: [
                  {
                    text: 'Tennessee',
                    value: 'TN'
                  },
                  {
                    text: 'Texas',
                    value: 'TX'
                  }
                ]
              }
            },
            {
              text: 'Utah',
              value: 'UT'
            },
            {
              optgroup: {
                label: 'V',
                options: [
                  {
                    text: 'Vermont',
                    value: 'VT'
                  },
                  {
                    text: 'Virginia',
                    value: 'VA'
                  }
                ]
              }
            },
            {
              optgroup: {
                label: 'W',
                options: [
                  {
                    text: 'Washington',
                    value: 'WA'
                  },
                  {
                    text: 'West Virginia',
                    value: 'WV'
                  },
                  {
                    text: 'Wisconsin',
                    value: 'WI'
                  },
                  {
                    text: 'Wyoming',
                    value: 'WY'
                  }
                ]
              }
            }]
          },
          label: 'State',
          type: 'select',
          grid: {
            xs: 12,
            md: 4
          }
        },
        {
          attributes: {
            name: 'zip',
            pattern: '\\d{5}',
            placeholder: '12345'
          },
          label: 'Zip Code',
          type: 'tel',
          grid: {
            xs: 12,
            md: 4
          }
        },
        {
          attributes: {
            name: 'is_mailing_address'
          },
          label: 'Is Mailing Address?',
          type: 'checkbox',
          grid: {
            xs: 12,
            md: 4
          }
        }]
      }
    ],
    submit: (e) =>
    {
      e.preventDefault();
      console.log('submit');
    }
  };
  const contactForm = formBuilder.buildForm(contactFormOptions);
  const input = document.createElement('input');
  input.setAttribute('class', 'btn btn-primary');
  input.setAttribute('type', 'submit');
  input.value = 'Submit';
  contactForm.append(input);
  document
    .getElementById('container')
    .append(contactForm);
}, false);
```

## Donate
Show your support! Your (non-tax deductible) donation of Monero cryptocurrency is a sign of solidarity among web developers.

Being self taught, I have come a long way over the years. I certainly do not intend on making a living from this free feature, but my hope is to earn a few dollars to validate all of my hard work.

Monero Address: 447SPi8XcexZnF7kYGDboKB6mghWQzRfyScCgDP2r4f2JJTfLGeVcFpKEBT9jazYuW2YG4qn51oLwXpQJ3oEXkeXUsd6TCF

![447SPi8XcexZnF7kYGDboKB6mghWQzRfyScCgDP2r4f2JJTfLGeVcFpKEBT9jazYuW2YG4qn51oLwXpQJ3oEXkeXUsd6TCF](monero.png)
