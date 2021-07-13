import { isBrowser } from "app/App/functions/isBrowser";
import React from "react";
import VocabularyHeader from "app/Vocabulary/Elements/VocabularyHeader";
import atob from "atob";
export default (props) => {
  if (!isBrowser) return <div />;
  // console.log(decodeURIComponent(atob(props.header_data)));
  // return null;
  // console.log(props.header_data);
  return (
    <VocabularyHeader
      header_data={{
        vocabulary:
          props.header_data &&
          JSON.parse(decodeURIComponent(atob(props.header_data))),
      }}
    />
  );
};
