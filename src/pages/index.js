import IndexPage from './index/IndexPage';
import DemandPage from './demand';
import myProfilePage from './myProfile';
import NotFoundPage from './exception/NotFoundPage';
import LoginPage from './login/LoginPage';

export { default as IndexPage } from './index/IndexPage';
export { default as DemandPage } from './demand';
export { default as myProfilePage } from './myProfile';
export { default as NotFoundPage } from './exception/NotFoundPage';
export { default as LoginPage } from './login/LoginPage';

export default {
  IndexPage: IndexPage,
  DemandPage: DemandPage,
  myProfilePage: myProfilePage,
  NotFoundPage: NotFoundPage,
  LoginPage: LoginPage,
};
