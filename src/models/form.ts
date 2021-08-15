type Input = "text" | "dropdown" | "date" | "password";
type FormStyle = "flat";
type Value = string | number | boolean | null;

export interface Item {
  text: string;
  value: string | boolean | number;
}

export interface FormData {
  title: string;
  style?: FormStyle;
  submitText?: string;
  onSubmit?(...args: any): void;
  fields: Array<FormField>;
}

declare interface DateField {
  menu: boolean; // default to the menu appearing or not
  date: string; // use new Date().toISOString().substr(0, 10)
  ref: string; // used to differentiate multiple date fields
}

export interface Rules {
  required?: boolean;
  integer?: boolean;
  positive?: boolean;
  email?: boolean;
}

export interface FormField {
  order: number;
  name: string;
  input: Input; // type of field (eg. dropdown)
  rules: Rules; // validation rules
  value?: Value; // initial value for two way bindings
  longName?: string; // text next to form field
  label?: string; // text inside form field
  items?: Array<Item>; // for list items
  dateMeta?: DateField; // data for date fields
  disabled?: boolean; // pass to keep disabled
  default?: Item | Value; // item if dropdown, Value otherwise
}
