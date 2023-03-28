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

export const getMultipleNumValQuery = (
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

      resQuery += `${val}`;
    }

  resQuery += ")";

  return resQuery;
};

export const getArrayNumValuQuery = (column: string, arrVal: number[]): string => {
  let resQuery = `${column} in (`;

  let bFirst = true;

  if (arrVal.length)
    for (const val of arrVal) {
      if (bFirst) {
        bFirst = false;
      } else {
        resQuery += ", ";
      }

      resQuery += `${val}`;
    }

  resQuery += ")";

  return resQuery;
}