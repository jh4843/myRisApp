// For Patient
export const GetFirstNameFromPN = (fullname: string): string => {
  const name = fullname.split("^");

  if (name.length < 2) return "";

  return name[1];
};

export const GetLastNameFromPN = (fullname: string): string => {
  const name = fullname.split("^");

  if (name.length < 1) return "";

  return name[0];
};

export const GetFirstNameFromDisplayName = (fullname: string): string => {
  const name = fullname.split(" ");

  if (name.length < 1) return "";

  return name[0];
};

export const GetLastNameFromDisplayName = (fullname: string): string => {
  const name = fullname.split(" ");

  if (name.length < 2) return "";

  return name[1];
};

export const GetPN = (
  last = "",
  first = "",
  middle = "",
  prefix = "",
  suffix = ""
): string => {
  return [last, first, middle, prefix, suffix].join("^");
};

export const GetDisplayFullNameFromPN = (pn: string): string => {
  const name = pn.split("^");
  let res = "";

  switch (name.length) {
    case 1:
      res = name[0];
      break;
    case 2:
      res = [name[1], name[0]].join(" ");
      break;
    case 3:
      res = [name[1], name[0], name[2]].join(" ");
      break;
    case 4:
      res = [name[1], name[0], name[2], name[3]].join(" ");
      break;
    case 5:
      res = [name[1], name[0], name[2], name[3], name[4]].join(" ");
      break;
    default:
      res = "";
      break;
  }

  return res;
};
