import IndexPage from './IndexPage';
import DemandPage from './demand/DemandPage';
import RecommendPage from './recommend/RecommendPage';
import NotFoundPage from './exception/NotFoundPage';
import LoginPage from './login/LoginPage';

export { default as IndexPage } from './IndexPage';
export { default as DemandPage } from './demand/DemandPage';
export { default as RecommendPage } from './recommend/RecommendPage';
export { default as NotFoundPage } from './exception/NotFoundPage';
export { default as LoginPage } from './login/LoginPage';

export default {
  IndexPage: IndexPage,
  DemandPage: DemandPage,
  RecommendPage: RecommendPage,
  NotFoundPage: NotFoundPage,
  LoginPage: LoginPage,
};
