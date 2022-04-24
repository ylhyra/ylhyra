import React from "react";
import Link from "ylhyra/app/router/Link";

export default ({ level }: { level: string }) => {
  if (!level) {
    throw new Error('Missing parameter "level" in Level.tsx');
  }
  return (
    <span className="level">
      Level <Link href={level}>{level.toUpperCase()}</Link>
    </span>
  );
};
