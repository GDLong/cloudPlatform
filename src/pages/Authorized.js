import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);
// const isLodin = () => {
//   var state = sessionStorage.getItem('isLogin') ? true : false;

//   console.log(state);
//   if (state) {
//     return true;
//   } else {
//     return false;
//   }
// };

export default ({ children }) => (
  <Authorized authority={children.props.route.authority} noMatch={<Redirect to="/user/login" />}>
    {/* {isLodin() ? children : <Redirect to="/user/login" />} */}
    {children}
  </Authorized>
);
