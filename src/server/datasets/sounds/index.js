import query from "server/database";

export default (input) => {
  if (!input || !input.trim()) return;
  input = input.toLowerCase().trim();
  return new Promise((resolve) => {
    if (input.length < 50) {
      query(
        "SELECT file FROM sounds WHERE text = ?",
        [input],
        (error, results) => {
          if (error) throw error;
          const files = results
            .map((i) => i.file)
            .map((i) => {
              if (i.startsWith("islex/")) {
                return "https://media.egill.xyz/audio/" + i;
              } else {
                return "https://ylhyra.is/Special:Redirect/file/" + i;
              }
            });
          resolve(files);
        }
      );
    } else {
      resolve();
    }
  });
};
