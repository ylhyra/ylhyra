import React from "react";
import VocabularyHeader from "app/Vocabulary/Elements/VocabularyHeader";
import atob from "atob";

export default (props) => {
  const vocabulary =
    props.header_data &&
    JSON.parse(decodeURIComponent(atob(props.header_data)));
  return (
    <a
      href={props.chapter_url}
      className={props.show_words ? "chapter" : "link-with-percentage"}
    >
      <div className="chapter-title">
        <div>{props.children}</div>
        <VocabularyHeader header_data={{ vocabulary }} onlyPercentage={true} />
      </div>
      {props.show_words && (
        <div className="chapter-vocabulary-list">
          <VocabularyHeader header_data={{ vocabulary }} onlyWordList={true} />
        </div>
      )}
    </a>
  );
};
