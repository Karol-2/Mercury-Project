// Modified Levenshtein distance
// Tries to match infixes
// basket - ske => 0
// basket
// ..ske.
//
// basket - ska => 1
// basket
// ..ska.
function editDistance(a: string, b: string) {
  if (a.length < b.length) {
    const temp = a;
    a = b;
    b = temp;
  }

  const lengthDiff = a.length - b.length;

  const editRow = Array.from({ length: a.length + 1 }, (_, i) =>
    Math.max(0, i - lengthDiff),
  );

  for (let j = 1; j < b.length + 1; j++) {
    let topLeft = editRow[0];
    editRow[0] = j;

    for (let i = 1; i < a.length + 1; i++) {
      const left = editRow[i - 1];
      const top = editRow[i];

      const charMatch = a.charAt(i - 1) == b.charAt(j - 1);
      const add = charMatch ? 0 : 1;
      const value = Math.min(left + 1, top + 1, topLeft + add);

      topLeft = editRow[i];
      editRow[i] = value;
    }
  }

  return Math.min(...editRow);
}

export default editDistance;
