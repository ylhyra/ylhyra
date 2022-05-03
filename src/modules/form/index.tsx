import { makeAutoObservable } from "mobx";
import { uppercaseFirstLetter } from "modules/uppercaseFirstLetter";
import React from "react";

export type FieldsSetup<TypeThisIsDescribing = void> = Array<{
  name: Extract<keyof TypeThisIsDescribing, string>;
  /** If not passed, then by default uppercase first of name */
  label?: string;
  type: "text" | "select" | "checkbox";
  defaultValue?: string | Number | Boolean;
  description?: string;
  options?: Array<{
    value: string | Number;
    label: string;
  }>;
}>;

export class form {
  values: Record<string, any> = {};
  touched: Record<string, Boolean> = {};
  onSubmit: Function | undefined;
  fields?: FieldsSetup<any>;
  constructor(props: {
    initialValues: Record<string, any>;
    onSubmit?: Function;
    fields?: FieldsSetup<any>;
  }) {
    this.values = props.initialValues || {};
    if (props.onSubmit) {
      this.onSubmit = props.onSubmit;
    }
    if (props.fields) {
      this.fields = props.fields;
    }
    makeAutoObservable(this);
  }
  setValues(values: Record<string, any>) {
    this.values = values;
  }
  handleChange = (fieldName: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.values[fieldName] = event.target.value;
    };
  };
  handleBlur = (fieldName: string) => () => {
    this.touched[fieldName] = true;
  };
  getFieldProps = (fieldName: string) => ({
    value: this.values[fieldName],
    onChange: this.handleChange(fieldName),
    onBlur: this.handleBlur(fieldName),
  });
  onSubmitInternal = (event: React.FormEvent) => {
    event.preventDefault();
    this.onSubmit && this.onSubmit(this.values);
  };
  Form: React.FC = (props) => {
    return <form onSubmit={this.onSubmitInternal}>{props.children}</form>;
  };
  Fields: React.FC = () => {
    const InputWithLabel = this.InputWithLabel;
    return (
      <div>
        {this.fields?.map((field) => (
          <div>
            <InputWithLabel {...field} />
          </div>
        ))}
      </div>
    );
  };
  InputWithLabel = (props: FieldsSetup<any>[number]) => {
    return (
      <label>
        <div>{props.label || uppercaseFirstLetter(props.name)}:</div>
        <div>
          <input type="text" name={props.name} />
        </div>
        <div className="text-sm text-gray-400">{props.description}</div>
      </label>
    );
  };
}
