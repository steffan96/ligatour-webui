import { createHashRouter } from 'react-router-dom';
import Sidepanel from '../components/shared/Sidepanel';
// import { EmployeeShow } from '../components/EmployeeShow/EmployeeShow';
// import { EmployeeCreate } from '../components/EmployeeCreate/EmployeeCreate';
// import { EmployeeEdit } from '../components/EmployeeEdit/EmployeeEdit';


export const router = createHashRouter([
  {
    path: '/',
    element: <Sidepanel />,
    children: []
  },
]);