import React from "react";
import VocabularyHeader from "app/Vocabulary/Elements/VocabularyHeader";
export default (props) => {
  // console.log(JSON.parse(atob(props.header_data)))
  // console.log(props.header_data);
  return (
    <VocabularyHeader
      header_data={{
        vocabulary: props.header_data && JSON.parse(atob(props.header_data)),
      }}
      button={false}
    />
  );
};
