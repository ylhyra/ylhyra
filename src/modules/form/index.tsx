import { isObservable, makeObservable, observable } from "mobx";
import { observer } from "mobx-react-lite";
import { uppercaseFirstLetter } from "modules/uppercaseFirstLetter";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";

export type FieldsSetup<TypeThisIsDescribing = object> = Array<
  {
    /**
     * This is a mapped type that is immediately indexed, in order to
     * be able to use only the allowed values of a given interface.
     */
    [K in keyof TypeThisIsDescribing]-?: {
      name: K;
      /** If not passed, then by default uppercase first of name */
      label?: string;
      /** "Text" is default */
      type?: "text" | "select" | "checkbox" | "textarea";
      value?: TypeThisIsDescribing[K];
      defaultValue?: TypeThisIsDescribing[K];
      description?: string;
      options?: Array<{
        value: TypeThisIsDescribing[K];
        label: string;
      }>;
      onlyShowIf?: (arg0: TypeThisIsDescribing) => boolean;
    };
  }[keyof TypeThisIsDescribing]
>;

export class form<TypeThisIsDescribing = Record<string, any>> {
  values: Record<string, any> = {};
  touched: Record<string, Boolean> = {};
  onSubmit: Function | undefined;
  onChange: Function | undefined;
  fields?: FieldsSetup<any>;
  constructor(
    public props: {
      values?: Record<string, any>;
      onSubmit?: Function;
      onChange?: Function;
      fields?: FieldsSetup<any>;
    }
  ) {
    this.values = props.values || {};
    if (props.onSubmit) {
      this.onSubmit = props.onSubmit;
    }
    if (props.onChange) {
      this.onChange = props.onChange;
    }
    if (props.fields) {
      this.fields = props.fields;
    }
    if (!isObservable(this.values)) {
      if (props.values) {
        console.warn("Values given to form are not observable.");
      }
      makeObservable(this, {
        values: observable,
      });
    }
  }
  setFormValues(values: Record<string, any>) {
    this.values = values;
  }
  getFormValuesIgnoringDefaults() {
    return this.values;
  }
  getFormValuesWithDefaults() {
    throw new Error("Not implemented");
    return this.values;
  }
  resetForm() {
    this.values = {};
  }
  handleChange = (fieldName: string, isCheckbox?: Boolean) => {
    return (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      this.values[fieldName] =
        isCheckbox && "checked" in event.target
          ? event.target.checked
          : event.target.value;
      this.onChange?.(this.values);
    };
  };
  handleBlur = (fieldName: string) => () => {
    this.touched[fieldName] = true;
  };
  getChangeHandlers = (fieldName: string, isCheckbox?: Boolean) => {
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

  /** Used to automatically print all fields with labels */
  AllFields: React.FC = () => {
    const InputWithLabel = this.InputWithLabelInternal;
    return (
      <div>
        {this.fields?.map((field, index) => (
          <InputWithLabel {...field} key={index} />
        ))}
      </div>
    );
  };

  /** Used externally to print a single input just by its name */
  Input = ({ name }: { name: keyof TypeThisIsDescribing }) => {
    const field = this.fields?.find((j) => j.name === name);
    if (!field) throw new Error(`No field with name ${String(name)}`);
    const InputInternal = this.InputInternal;
    return <InputInternal {...field} />;
  };

  /** Used externally to print an input just by its name */
  InputWithLabel = ({ name }: { name: keyof TypeThisIsDescribing }) => {
    const field = this.fields?.find((j) => j.name === name);
    if (!field) throw new Error(`No field with name ${String(name)}`);
    const InputWithLabelInternal = this.InputWithLabelInternal;
    return <InputWithLabelInternal {...field} />;
  };

  /** Used internally, a {@link FieldsSetup} object must be passed to it. */
  InputWithLabelInternal = (field: FieldsSetup<any>[number]) => {
    const label = field.label || uppercaseFirstLetter(field.name);
    const Input = this.InputInternal;
    return (
      <>
        {field.type === "checkbox" ? (
          <label>
            <Input {...field} /> {label}
          </label>
        ) : (
          <label>
            <div>{label}:</div>
            <div>
              <Input {...field} />
            </div>
          </label>
        )}
        <div className="text-sm text-gray-400">{field.description}</div>
      </>
    );
  };

  /**
   * Used internally, a {@link FieldsSetup} object must be passed to it.
   * Todo: https://reactjs.org/docs/uncontrolled-components.html
   */
  InputInternal = observer((field: FieldsSetup<any>[number]) => {
    const value = this.values[field.name] ?? field.defaultValue;

    if (field.type === "checkbox") {
      return (
        <input
          type="checkbox"
          name={field.name}
          checked={value}
          {...this.getChangeHandlers(field.name, true)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          name={field.name}
          value={value}
          {...this.getChangeHandlers(field.name)}
        >
          {field.options?.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "text" || !field.type) {
      return (
        <input
          type="text"
          // <TextareaAutosize
          // <textarea
          name={field.name}
          value={value || ""}
          {...this.getChangeHandlers(field.name)}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <TextareaAutosize
          name={field.name}
          value={value || ""}
          {...this.getChangeHandlers(field.name)}
        />
      );
    }

    console.warn(`Unknown field type ${field.type}`);

    return null;
  });
}

export const getDefaultValue = <T extends FieldsSetup<any>>(
  input: T,
  key: string
) => {
  return input.find((field) => field.name === key)?.defaultValue;
};
