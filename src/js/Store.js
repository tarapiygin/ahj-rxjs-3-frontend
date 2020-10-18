import { Subject } from 'rxjs';
import {
  startWith, scan, share,
} from 'rxjs/operators';

const Actions = {
  Increment: 'INCREMENT',
  Decrement: 'DECREMENT',
  Reset: 'RESET',
};

function reduce(state, action) {
  switch (action.type) {
    case Actions.Increment:
      return { ...state, counter: state.counter + action.payload };
    case Actions.Decrement:
      return { ...state, counter: state.counter - action.payload };
    case Actions.Reset:
      return { ...state, counter: 0 };
    default:
      return state;
  }
}

export default class Store {
  constructor(counter) {
    this.actions$ = new Subject();
    this.state$ = this.actions$.asObservable().pipe(
      startWith({ type: '__INITIALIZATION__' }),
      scan((state, action) => reduce(state, action), { counter }),
      share(),
    );
  }

  dispatch(type, payload = null) {
    this.actions$.next({ type, payload });
  }

  inc(value = null) {
    this.dispatch(Actions.Increment, value);
  }

  dec(value = null) {
    this.dispatch(Actions.Decrement, value);
  }

  reset() {
    this.dispatch(Actions.Reset);
  }
}
