import { makeAutoObservable } from "mobx";

export class form {
  values = {};
  touched = {};
  onSubmit;
  constructor(props) {
    this.values = props.initialValues || {};
    this.onSubmit = props.onSubmit;
    makeAutoObservable(this);
  }
  setValues(values) {
    this.values = values;
  }
  handleChange = (fieldName) => (event) => {
    this.values[fieldName] = event.target.value;
  };
  handleBlur = (fieldName) => (event) => {
    this.touched[fieldName] = true;
  };
  getFieldProps = (fieldName) => ({
    value: this.values[fieldName],
    onChange: this.handleChange(fieldName),
    onBlur: this.handleBlur(fieldName),
  });
  _onSubmit = (event) => {
    event.preventDefault();
    this.onSubmit && this.onSubmit(this.values);
  };
  Form = (props) => {
    return <form onSubmit={this._onSubmit}>{props.children}</form>;
  };
}

export const InputWithLabel = ({
  name,
  title,
}: {
  name: string;
  title: string;
}) => {
  return (
    <label>
      <div>{title}:</div>
      <div>
        <input type="text" />
      </div>
    </label>
  );
};
