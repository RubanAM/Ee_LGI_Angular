export interface Post {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
}

export interface Department {
  departmentCode: string;
  departmentName: string;
}

export interface AddForm {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentCode: string;
  departmentName: string;
}