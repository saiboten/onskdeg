import { branch, renderComponent } from 'recompose';
import Spinner from './Loading';

export default (isLoading: boolean) => branch(
  isLoading,
  renderComponent(Spinner), // `Spinner` is a React component
);
