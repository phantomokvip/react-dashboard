export const typeFomartEditor = () => {
  return [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block"
  ]
}

export const getNameByUrl = (str) => {
  try {
    return str.split("/").pop()
  } catch (e) {
    return str
  }
}
export const extractManyId = (str) => {
  const groupRegex = /group_([a-z0-9]+)/;
  const departmentRegex = /department_([a-z0-9]+)/;
  const companyRegex = /company_([a-z0-9]+)/;

  const groupMatch = str?.match(groupRegex);
  const departmentMatch = str?.match(departmentRegex);
  const companyMatch = str?.match(companyRegex);

  let group = null;
  let department = null;
  let company = null;

  if (groupMatch && groupMatch[1]) {
    group = groupMatch[1];
  }

  if (departmentMatch && departmentMatch[1]) {
    department = departmentMatch[1];
  }

  if (companyMatch && companyMatch[1]) {
    company = companyMatch[1];
  }

  return { group, department, company };
}

export const extractId = (groupId, departmentId, companyId) => {
  if (companyId) {
    let id
    if (departmentId) {
      if (groupId) {
        id = `group_${groupId}_department_${departmentId}_company_${companyId}`
      } else {
        id = `department_${departmentId}_company_${companyId}`
      }
    } else {
      id = `company_${companyId}`
    }
    return id
  }
}

export const extractTwoIds = (departmentId, companyId) => {
  if (companyId) {
    let id
    if (departmentId) {
      id = `department_${departmentId}_company_${companyId}`
    } else {
      id = `company_${companyId}`
    }
    return id
  }
}