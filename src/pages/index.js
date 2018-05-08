import IndexPage from './index/IndexPage';
import DemandPage from './demand';
import MyProfilePage from './myProfile';
import NotFoundPage from './exception/NotFoundPage';
import LoginPage from './login/LoginPage';

export { default as IndexPage } from './index/IndexPage';
export { default as DemandPage } from './demand';
export { default as MyProfilePage } from './myProfile';
export { default as NotFoundPage } from './exception/NotFoundPage';
export { default as LoginPage } from './login/LoginPage';

export default {
  IndexPage: IndexPage,
  DemandPage: DemandPage,
  MyProfilePage: MyProfilePage,
  NotFoundPage: NotFoundPage,
  LoginPage: LoginPage,
};
