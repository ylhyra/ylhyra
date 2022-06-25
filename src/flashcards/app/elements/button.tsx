import { joinClassNames } from "modules/addCssClass";

export function Button({ className, children, ...props }: any) {
  return (
    <button className={joinClassNames("btn btn-blue", className)} {...props}>
      {children}
    </button>
  );
}
