import React from "react";
import VocabularyHeader from "app/Vocabulary/Elements/VocabularyHeader";
import atob from "atob";

export default (props) => {
  const vocabulary =
    props.header_data &&
    JSON.parse(decodeURIComponent(atob(props.header_data)));
  return (
    <div>
      <VocabularyHeader
        header_data={{
          vocabulary,
        }}
        button={false}
      />
      <h3>{props.children}</h3>
    </div>
  );
};
