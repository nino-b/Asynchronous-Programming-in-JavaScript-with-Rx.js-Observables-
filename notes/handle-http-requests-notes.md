# Handle HTTP Requests with Observables


### distinctUntilChanged()

**`distinctUntilChanged()`** will compare succsessive values in a stream and will dedupe (deduplicate) them for us.




### Side Effects

- Side Effects happens sometimes.
- We should do the Side Effects only after we `forEach()` over an Observable. We shouldn't do Side Effects when we create an Observable.
- So, make Sure that an Observable is Lazy.
- We should encapsulate Side Effects inside an Observable.



### doAction()

**`doAction()`** makes sure that when we `forEach()`over an Observable, it injects some code that we can run to cause Side Effects to occur.

- We can do side effects on `onError()` and on `onCompleted()`.
- Difference between `forEach()` and `doAction()`: 
  - `forEach()` makes Observable to do something.
  - `forEach()` is eager.
  - `doAction()` returns another Observable and when `forEach()` is called on that Observable, those actions will occur. 
  - `doAction()` is lazy.

##### Async Side

- `doAction()` is synchronous. We can't do async side effects.

To perform async side effects, we need to `map()` and create an Observable that causes the asynchronous thing to occur and then do `doAction()` on the Inner Observable.

1. First we take the thing we want to happen and `map()`.
2. Then return the thing we want to have. And this gives us a Two-Dimensional Observable because:
  - For every item in the stream that we want to happen first, we are substituting in an Observable for each one of those items.
  - Then we have to pick the right flattening strategy.