/**
 * Splits text into parts where each occurence of search is a separate part.
 * The parts before, after or in between will be entries in the list.
 * Example: splitString("a", "abba") => ["a", "bb", "a"]
 *
 * @param search The string to search for.
 * @param text The text to split into parts, where each part is either the "search" string or not.
 */
export function splitString(search: string, text: string) {
  const parts: { content: string; match: boolean }[] = [];

  let remaining = text.slice();

  while (remaining.length > 0) {
    const index = remaining
      .toLocaleLowerCase()
      .indexOf(search.toLocaleLowerCase());

    if (index === -1) {
      parts.push({ content: remaining, match: false });
      break;
    }

    if (index > 0) {
      // Avoid pushing empty strings if the search is at the start of the remaining text.
      parts.push({ content: remaining.slice(0, index), match: false });
    }
    parts.push({
      content: remaining.slice(index, index + search.length),
      match: true,
    });
    remaining = remaining.slice(index + search.length);
  }

  return parts;
}
