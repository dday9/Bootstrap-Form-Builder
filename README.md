
# Bootstrap Form Builder

A simple solution for creating Bootstrap forms on the fly.

## Demo

Demo Files: [./demo](./demo)

Fiddle (ESM build): https://jsfiddle.net/hLj2mb17/
Fiddle (UMD build): https://jsfiddle.net/x7p9Lv12/

## Dependencies

### CSS

 - Bootstrap 5.x

## Installation

This library can be used either as an ES module or as a UMD script (classic `<script>` usage).

### ES Module (recommended)

```js
import { FormBuilder } from './bootstrap-form-builder.esm.js';
const form = FormBuilder.buildForm(options);
```

### UMD (script tag)

```html
<script src="bootstrap-form-builder.umd.js"></script>
<script>
  const form = formBuilder.buildForm(options);
</script>
```

> Note:
> ES module usage exposes `FormBuilder` (PascalCase).
> UMD usage exposes `formBuilder` (camelCase).

## Configuration Reference

> This section documents the current configuration shape for both ES module
> and UMD usage.
>
> The configuration object is the same for ESM and UMD builds; only the
> entry point differs (`FormBuilder` vs `formBuilder`).
>
> Some legacy properties are still supported but are marked as deprecated
> and will be removed in a future major release.

### Form Configuration

The object passed to `FormBuilder.buildForm(options)` or
`formBuilder.buildForm(options)` represents a form.

```js
interface FormConfig {
  fieldsets?: FieldsetConfig[];
  submit?: (e: SubmitEvent) => void;

  // Any valid HTML <form> attribute may also be provided directly
  // (e.g. action, method, enctype, class, id, etc.)
}
```

#### Deprecated

```js
attributes?: object;
```

Passing form attributes inside an `attributes` object is deprecated.
All valid HTML attributes should be provided directly on the form config
instead.

### Fieldset Configuration

```js
interface FieldsetConfig {
  legend?: string;
  fields?: FieldConfig[];
  grid?: string | number | GridConfig;

  // Any valid HTML <fieldset> attribute may also be provided directly
}
```

---

### Field Configuration

Each field represents either an input or a select element.

```js
interface FieldConfig {
  type?: string;
  label?: string;
  grid?: string | number | GridConfig;
  datalist?: DatalistConfig;

  // Any valid HTML attribute for the underlying element
  // may be provided directly (e.g. name, placeholder, value, required, etc.)
}
```

Supported input types include:

```
checkbox, color, date, datetime-local, email, file, hidden,
image, month, number, password, radio, range, search,
tel, text, time, url, week, select
```

#### Deprecated

```js
attributes?: object;
```

Passing field attributes inside an `attributes` object is deprecated.
Attributes should now be provided directly on the field configuration.

---

### Grid Configuration

```js
interface GridConfig {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}
```

Grid values map directly to Bootstrap column classes.

Examples:

```js
grid: 6              // col-6
grid: 'col-md-4'     // custom class
grid: { md: 4 }      // col-md-4
```

---

### Select Configuration

When `type` is set to `select`, the field accepts an `options` array.

```js
interface SelectOption {
  text?: string;
  value?: string;
  disabled?: boolean;
  selected?: boolean;
}

interface SelectOptGroup {
  label: string;
  options: SelectOption[];
}

options: (SelectOption | SelectOptGroup)[];
```

---

### Datalist Configuration

```js
interface DatalistConfig {
  options: string[] | SelectOption[];
}
```

The datalist configuration is passed directly to a generated
`<datalist>` element.

---

### Summary of Deprecated Properties

The following properties are deprecated and will be removed
in a future major release:

- `form.attributes`
- `field.attributes`

All valid HTML attributes should now be passed directly
to the configuration object instead of nested under `attributes`.

## Example

The following is an example of dynamically building a contact form.

> Note:
> The following example uses the UMD build `formBuilder`.
> For ES module usage, replace `formBuilder` with `FormBuilder`.

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
  document
    .getElementById('container')
    .append(contactForm);
}, false);
```

## Design Philosophy

Bootstrap Form Builder is intentionally permissive.

- Most valid HTML attributes may be passed directly to elements
- Unknown attributes are ignored with warnings
- Bootstrap classes are applied automatically when missing
- The library generates standard HTML and does not abstract it away

The intention was to have this library favor flexibility and clarity over rigid schemas.

## Donate

Show your support! Your (non-tax deductible) donation of Monero cryptocurrency is a sign of solidarity among web developers.

Being self taught, I have come a long way over the years. I certainly do not intend on making a living from this free feature, but my hope is to earn a few dollars to validate all of my hard work.

Monero Address: 447SPi8XcexZnF7kYGDboKB6mghWQzRfyScCgDP2r4f2JJTfLGeVcFpKEBT9jazYuW2YG4qn51oLwXpQJ3oEXkeXUsd6TCF

![447SPi8XcexZnF7kYGDboKB6mghWQzRfyScCgDP2r4f2JJTfLGeVcFpKEBT9jazYuW2YG4qn51oLwXpQJ3oEXkeXUsd6TCF](monero.png)
