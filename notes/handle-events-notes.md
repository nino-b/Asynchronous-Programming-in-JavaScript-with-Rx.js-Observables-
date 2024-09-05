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

`timeout` will return an Observable, that will fire after a certain amount of time once we call `forEach()`.

```js

function timeout(time) {
  return {
    forEach: function(observer) {
      const handle = setTimeout(() => {
        observer.onNext(undefined); // setTimeout doesn't emit a value
        // We call `onNext()` to send a message that the timeout has elapsed to the Observable
        observer.onCompleted(); // setTimeout is fired only once, after certain amount of time
        // And there is going to be no more callbacks
      }, time);

      // Return the Subscription Object
      return {
        dispose: function() {
          // Make sure that we will never be able to call onNext(), onError, onCompleted
          clearTimeout(handle);
        }
      }
    }
  }
}

timeout(5000).forEach({
  onNext: function(v) {
    alert('Timeout!');
  }
});

```


```js

function fromEvent(domElement, eventName) {
  return {
    forEach: function(observer) {
      const handler = e => observer.onNext(e)
      domElement.addEventListener(eventName, handler);
      // A DOM Event does emit a stream of values, so we need to thread along an event object that is given to us
      // The Observable becomes a stream of all events of the event objects that the handler would have been called with.
      // An event doesn't end after the first item, so we don't call onCompleted().
      


      // Return the Subscription Object
      return {
        dispose: function() {
          // Make sure that we will never be able to call onNext(), onError, onCompleted
          removeEventListener(eventName, handler);
        }
      }
    }
  }
}
```

So, basically, this is how Observables work.  
An Observable is just an Object with a function waiting to be called.  
And then at that point, it will hook up to an event and return a subscription which,when disposed of, will do whatever it needs to,



```js

function fromEvent(domElement, eventName) {
  return {
    forEach: function(observer) {
      const handler = e => observer.onNext(e)
      domElement.addEventListener(eventName, handler);
      // A DOM Event does emit a stream of values, so we need to thread along an event object that is given to us
      // The Observable becomes a stream of all events of the event objects that the handler would have been called with.
      // An event doesn't end after the first item, so we don't call onCompleted().
      


      // Return the Subscription Object
      return {
        dispose: function() {
          // Make sure that we will never be able to call onNext(), onError, onCompleted
          removeEventListener(eventName, handler);
        }
      }
    }
  }
}
```
