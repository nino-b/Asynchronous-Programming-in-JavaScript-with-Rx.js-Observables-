# Observables and Events

### Obserable behind the scenes


1. Build a function;
2. Build another function, we want the first one to bind to.
3. Build the binder (glue) function that glues the first function with the second function.
- At this point, no function is running.
- We are creating bigger and bigger functions by gluing other functions to each other.


```js
// Build a function (1)
function then(f, anotherF) {
  return function() {
    f();
    anotherF();
  }
}

// Create another function (3)
function print() {
  console.log('hi');
}

// Use another function (2) to glue the first function with another function (3) that we want to run afterwards
const func = then(print, function() { console.log('after') });

```

**Laziness**

- Observable is just an Object with `forEach()` method waiting to be called.
- When we call `map()`, we glue it together with another function and create another Object with `forEach()` method waiting to be called.
- Instead of doing something, we create a function, which can be called later on to do something.
- Pros: We can call this function as we need and as many times we need.


**We can take any push API, any async API that calls us instead of us calling it, and we can make it into an observable.**



### setTimeout() into an Observable

```js
const Observer = {
  onNext(x) { console.log(x) },
  onError(e) { console.error(e) }
  onCompleted() { console.log('done') }
}

function timeout(time) {
  return {
    forEach: function(observer) {
      const handle = setTimeout(() => {
        observer.onNext(undefined); // setTimeout doesn't emit a value
        observer.onCompleted();
      }, time);
    }
  }
}

timeout(5000).forEach({
  onNext: function(v) {
    alert('Timeout!');
  }
});
```