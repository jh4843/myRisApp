export const getMultipleStrValQuery = (
  column: string,
  multiVal: string,
  separator: string
): string => {
  if (column == "" || multiVal == "" || separator == "") return "";

  let resQuery = `${column} in (`;

  let bFirst = true;
  const valList = multiVal.split(separator);

  if (valList.length)
    for (const val of valList) {
      if (bFirst) {
        bFirst = false;
      } else {
        resQuery += ", ";
      }

      resQuery += `"${val}"`;
    }

  resQuery += ")";

  return resQuery;
};
