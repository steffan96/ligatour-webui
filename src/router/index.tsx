import { createHashRouter } from 'react-router-dom';
import DashboardLayout from "../components/dashboard/DashboardLayout";
// import { EmployeeList } from '../components/EmployeeList/EmployeeList';
// import { EmployeeShow } from '../components/EmployeeShow/EmployeeShow';
// import { EmployeeCreate } from '../components/EmployeeCreate/EmployeeCreate';
// import { EmployeeEdit } from '../components/EmployeeEdit/EmployeeEdit';


export const router = createHashRouter([
  {
    Component: DashboardLayout,
    children: [
    //   {
    //     path: '/employees',
    //     Component: EmployeeList,
    //   },
    //   {
    //     path: '/employees/:employeeId',
    //     Component: EmployeeShow,
    //   },
    //   {
    //     path: '/employees/new',
    //     Component: EmployeeCreate,
    //   },
    //   {
    //     path: '/employees/:employeeId/edit',
    //     Component: EmployeeEdit,
    //   },
    //   // Fallback route
    //   {
    //     path: '*',
    //     Component: EmployeeList,
    //   },
    ],
  },
]);