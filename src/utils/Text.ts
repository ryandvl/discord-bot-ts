export function spaceString(string: string, space: number): string {
  var spacesBefore = Math.floor((space - string.length) / 2);
  var spacesAfter = space - string.length - spacesBefore;

  let newString = " ".repeat(spacesBefore) + string + " ".repeat(spacesAfter);

  return newString;
}
