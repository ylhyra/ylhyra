import { classNames } from "modules/addCssClass";

export function Button({ className, children, ...props }: any) {
  return (
    <button className={classNames("btn btn-blue", className)} {...props}>
      {children}
    </button>
  );
}
