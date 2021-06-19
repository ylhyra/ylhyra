import Link from "app/Router/Link";

export default (props) => {
  return (
    <div className="book" data-translate="true">
      {props.children}
    </div>
  );
};
