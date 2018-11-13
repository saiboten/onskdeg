import { branch, renderComponent } from 'recompose';
import Spinner from './Loading';

export default isLoading => branch(
  isLoading,
  renderComponent(Spinner), // `Spinner` is a React component
);
