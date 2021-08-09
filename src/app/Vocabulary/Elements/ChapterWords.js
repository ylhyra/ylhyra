if (this.props.onlyWordList) {
  return (
    <div className="toc-vocabulary-list" key={2}>
      {vocabulary_list.map(getPlaintextFromVocabularyEntry).join(" • ")}
    </div>
  );
}
