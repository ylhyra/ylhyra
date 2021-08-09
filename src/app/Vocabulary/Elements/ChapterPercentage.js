if (this.props.onlyPercentage) {
  return (
    <small className="percentage-known sans-serif" key={1}>
      {PercentageKnown(cards, deck)}% known
    </small>
  );
}
