import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { uppercaseFirstLetter } from "modules/uppercaseFirstLetter";
import React from "react";

export type FieldsSetup<TypeThisIsDescribing = void> = Array<
  {
    /**
     * This is a mapped type that is immediately indexed,
     * in order to be able to use only the allowed values of a
     * given interface.
     */
    [K in keyof TypeThisIsDescribing]-?: {
      name: K;
      /** If not passed, then by default uppercase first of name */
      label?: string;
      /** "Text" is default */
      type?: "text" | "select" | "checkbox";
      value?: TypeThisIsDescribing[K];
      defaultValue?: TypeThisIsDescribing[K];
      description?: string;
      options?: Array<{
        value: TypeThisIsDescribing[K];
        label: string;
      }>;
      onlyShowIf?: {
        key: keyof TypeThisIsDescribing;
        is: any;
      };
    };
  }[keyof TypeThisIsDescribing]
>;

export class form {
  values: Record<string, any> = {};
  touched: Record<string, Boolean> = {};
  onSubmit: Function | undefined;
  fields?: FieldsSetup<any>;
  constructor(props: {
    values: Record<string, any>;
    onSubmit?: Function;
    fields?: FieldsSetup<any>;
  }) {
    this.values = props.values || {};
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
  handleChange = (fieldName: string, isCheckbox?: Boolean) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      this.values[fieldName] =
        isCheckbox && "checked" in event.target
          ? event.target.checked
          : event.target.value;
    };
  };
  handleBlur = (fieldName: string) => () => {
    this.touched[fieldName] = true;
  };
  getFieldProps = (fieldName: string, isCheckbox?: Boolean) => {
    return {
      onChange: this.handleChange(fieldName, isCheckbox),
      onBlur: this.handleBlur(fieldName),
    };
  };
  onSubmitInternal = (event: React.FormEvent) => {
    if (this.onSubmit) {
      event.preventDefault();
      this.onSubmit(this.values);
    }
  };
  Form: React.FC = (props) => {
    return <form onSubmit={this.onSubmitInternal}>{props.children}</form>;
  };
  Fields: React.FC = () => {
    const InputWithLabel = this.InputWithLabel;
    return (
      <div>
        {this.fields?.map((field, index) => (
          <InputWithLabel {...field} key={index} />
        ))}
      </div>
    );
  };
  /**
   * Todo: https://reactjs.org/docs/uncontrolled-components.html
   */
  InputWithLabel = observer((props: FieldsSetup<any>[number]) => {
    const label = props.label || uppercaseFirstLetter(props.name);
    const value = this.values[props.name] ?? props.defaultValue;
    return (
      <>
        {props.type === "checkbox" ? (
          <label>
            <input
              type="checkbox"
              name={props.name}
              checked={value}
              {...this.getFieldProps(props.name, true)}
            />{" "}
            {label}
          </label>
        ) : (
          <label>
            <div>{label}:</div>
            <div>
              {(props.type === "text" || !props.type) && (
                <input
                  type="text"
                  name={props.name}
                  value={value || ""}
                  {...this.getFieldProps(props.name)}
                />
              )}
              {props.type === "select" && (
                <select
                  name={props.name}
                  value={value}
                  {...this.getFieldProps(props.name)}
                >
                  {props.options?.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </label>
        )}
        <div className="text-sm text-gray-400">{props.description}</div>
      </>
    );
  });
}
