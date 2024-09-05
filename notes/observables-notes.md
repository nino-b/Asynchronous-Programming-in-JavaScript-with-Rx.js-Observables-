# Observables

### Types of Problems we might run into when building an async programs:

- **Race Conditions**
  Race Conditions happen when several operations are trying to manipulate the shared resources and final outcome depends on which operation completes first.

- **Memory Leaks**
  A Memory Leak occurs when a program fails to free up a memory space that is no longer needed. When the Garbage Collector is unable to free up the memory space that is still referenced but no longer needed by the program.

- **Complex State Machines**
  A Complex State Machine arises when there are many states, or nested states, making system difficult to manage and debug. Asynchronous operations further complicate these State Machines due to unpredictable timing of events.

  A State Machine is a model of computation where the program can be in one of several states, and transitions between these states are triggered by events (input, network response, timer, or other external resoutce). 
  
- **Uncaught Async Errors**
  Uncaught Async Errors occur when an error is thrown during an asynchronous operation, and that error is not properly caught or handled by the program: 
    - **Silent  Failures**:
    Program keeps running, but parts of the application stop functioning correctly.

    - **Unhandled Promise Rejections**
    If a Promise is rejected and no `.catch()` handler is attached, it results in an Unhandled Promise Rejection.

  **Common Sources of Uncaught Async Errors**
    - Network Requests: Unhandled errors caused by Network Issues, Server Errors, Incorrect URLs...
    - File I/O Operations: Unhandled errors caused by problems with reading or writing to disk due to permissions issues, missing files, or disk space limitations. 
    - Timeouts: Unhandled errors caused byunhandled Timeouts - If an asynchronous operation takes too long, it may time out.
    - Promise Rejections: Promises that are Rejected without a `.catch()` or `try/catch` block.
    - Event Listeners: Unhandled errors in Asynchronous Event Listeners (e.g., in response to user input or server events).




## How To Program Without Loops


- You Can't repeat an asynchronous function with a loop.


#### forEach()

- `forEach()` takes a function and applies that function to every item in an array.
- `forEach()` changes the original array.




#### map()

- `map()` is similar to `forEach()` function, with some differences.  
- `map()` takes a function and applies it to every item in a collection, creating a **New Value** and then creates a **New Array** with all results of applying that function to each value in the array. 
- `map()` doesn't change the original array, it creates a new array.
- `map()` transforms every item in the collection and put it into a new collection.




#### filter()

- `filter()` applies a **test function** to every value in the array and only if the value passes the test, will make it in the new collection.
- `filter()` doesn't hange the original array, it creates a new array.



#### concatAll()

- `concatAll()` takes a **Multidimensional Array** and **Flattens it by One Dimension**.
- `concatAll()` doesn't have a recursive nature. It flattens by only one dimension.
- If an empty collection is flattened, nothing is added to the 'parent' array.


<hr>
<hr>


## Difference between an Iterators and an Observer Pattern

Events and Arrays are both collections.  
There is a **Producer** and a **Consumer**.

**Iterators** and an **Observer Pattern** do the same thing. The difference is who is in control.  
- With **Iterators** the **Consumer** is in control (Pull-based).
- With **Observer Pattern** the **Producer** is in control (Push-based).


### Iterators

- **Consumer** is in control.
- **Consumer** decides when we get the next value.
- **Consumer** Requests information, **one at a time**, from the **Producer**, until one of two things happens:
  - The **Producer** says that it has no more information for us.
  - The **Producer** says an error occured.

To get one item at a time, in JS we request an **Iterator Object** - **`[].iterator()`**.  
`const iterator = [1, 2, 3].iterator()`

```js
const iterator = [1, 2, 3].iterator();

console.log(iterator.next());
{ value: 1, done: false };

console.log(iterator.next());
{ value: 2, done: false };

console.log(iterator.next());
{ value: 3, done: false };

console.log(iterator.next());
{ done: true };
```

**Iterator Object** has **`.next()`** method that returns an object, which has two properties:
  - **`value`** property: The Value that  we requested.
  - **`done`** property: Indicating whether or not there are more values to get.



<hr>
<hr>



### Observer Pattern

- **Producer** is in control.
- **Producer** decides when we get the next value.

- In **Observer Pattern** we add a function to the **Producer** and the **Producer** Pushes the data at us  
(instead of **Consumer** pulling the data, like in Iterators).
- **Producer** calls the callback and pushes the next value.
- The only thing we receive is more data, the **Producer** is not able to tell the **Consumer** that there is no more data, or an error has occured.




## Observable


Push APIsthat use different interfaces:

- DOM Events.
- Websockets.
- Server-sent Events.
- Node Streams.
- Service Workers.
- jQuery Events.
- XMLHttpRequest.
- setInterval.

**For the Push Streams we use Observables.**

<hr>
<hr>



#### Iterator and Observable

An **Array** is a collection of elements we can Iterate over. It is not an Iterator itself.    
An **Array** is something that we can ask for an Iterator from (by `[1, 2, 3][Symbol.iterator]()`).

As an analogy, we can think that an **Observable** is something that we can ask for an 'Iterator' from (Technically, we can't get an Iterator from an Observable. We get a Stream of Events).

**Observable** is a collection of data that arrives over time.
Observable = Collection + Time.

> **Note:**  Here I should add comparison between Iterator, Generator and Observable
With generators we can pull and push the data.  
With iterators, we pull the data.
With observables, the data is pushed to us.


**Observables can model**

- Events
- Async Server Requests
- Animations


<hr>
<hr>


### Adapt Async APIs into Observables

- Adapt all different type of async APIs into Observables - a common interface.
- ```fromEvent``` takes a DOM Object and the name of an event, and adapts it into an Observable.

**Events to Observables**

- **`fromEvent(element, "DOM Event Name")`**
- ```const mouseMoves = Observable.fromEvent(element, "mousemove");```

**Subscribing to an Event and Unsubscribing from an Event**  

**JS**
```js
const handler = event => console.log(event);

// Subscribe
document.addEventListener('mousemove', handler);

// Unsubscribe
document.removeEventListener('mousemove', handler);
```

**ReactiveX**

```js
// subscribe
const subscription = mouseMoves.forEach(console.log);

// unsubscribe
subscription.dispose();
```
Every time the Observable items come at us, `forEach()` (from 'ReactiveX') method gets invoked automativally and when the stream of items stops, `forEach()` completes.  
`forEach()` gets invoked as the stream of data arrives. It does not run consistently. It stops running as soon as the stream of data stops.  
Observable is a collection that arrives over time. So, when we ```forEach``` over observable, code doesn't wait to recieve all the data. This way it would block the execution. Instead it completes the action and as the observable comes, the function gets invoked again.

<hr>
<hr>


### Subscription Object

.
  - `forEach()` method returns a **Subscription Object**. 
  - On Subscription Object is a `dispose()` method, which enables us to unsubscribe from an Observable.

.
  - The Subscription Object also has handler methods: `onNext()`, `onError()`, `onCompleted()`.
  - Handler methods can be passed directly as arguments, or as methods in an object (Observer Object).
  - These handler methods enable Observable to give the next value to an Observer, or tell that there was an Error or there is no more data to get.
  - An Observer Object defines the behavior for handling the notifications sent by an Observable.

.
  - This gives the **Consumer** ability to tell the **Producer** that it needs no more data.
  - This gives the **Producer** ability to tell the **Consumer** that there is no more data or an error occured.




```js
// Shorthand
const subscription = mousemoves.forEach(
  event => console.log(event); // To Receive the data (like addEventListener).
  error => console.error(error); // optional - Tells consumers that there was an error (optional).
  () => console.log('done'); // optional - Excepts no arguments. Tells consumer that there is no more data (optional).
);


// Long Version
const subscription = mousemoves.forEach({
  onNext: event => console.log(event); // To Recieve the data (like addEventListener).
  onError: error => console.error(error); // optional - Tells consumers that there was an error.
  onCompleted: () => console.log('done'); // optional - Excepts no arguments. Tells consumer that there is no more data.
});

// Unsubscribe
subscription.dispose();
```

**Observer Object**  

```js
{
  onNext: event => console.log(event),
  onError: error => console.log(error),
  onCompleted: () => console.log("done"),
}
```



#### How the Observable Works

1. Create an Observer Object (with those handlers) inside an Observable.
2. The Observable pushes data into the Observer Object and one of those handler method handles the value.
3. It will call `onNext()` zero to infinite times, and finally it will call either `onError()` or `onCompleted()`. 
  - Sometimes it might never call `onError()` or `onCompleted()`, because some streams go on forever. E.g. `"mousemove"` can go on forever, if the Observable is just wrapping `"mousemove"` event.




<hr>
<hr>


### Convert Events to Observables

- An Observable is an Object with `forEach()` method on it.
- `dispose()` means that we are not going to get any more callbacks (or notifications).
- Every ```forEach``` call returns different ```dispose``` object.


```js
Observable.fromEvent = function(dom, eventName) {
  // Observable Object
  return {
    forEach: function(observer) {
      const handler = event => observer.onNext(event);
      dom.addEventListener(eventName, handler);

      // Subscription Object
      return {
        dispose: function() {
          dom.removeEventListener(eventName, handler);
        }
      };
    }
  };
}
```



<hr>
<hr>


## map()

**`map()`** takes an Observable, applies a function to every item in a collection and creates a new collection (Observable) containing all of the transformed results.

When we call **`map()`** on an Observable, we get an Observable that gives us each value, but first transforms it through a function. 

Each Value comes over time. As soon as the data comes along, it is transformed an sent to the Observer. Data is not collected in the memory. As soon as it comes, it is transformed and given to the Observer.

```js
{1...2.......3}.map(x => x + 1).forEach(console.log);
```


## filter()

**`filter()`** takes an Observable, applies a test function to each item in the collection and creates a new Observable that contains only those elements that passed the test.

```js
{1...2.......3}.filter(x => x > 1).forEach(console.log);
```


## Concurrency - Flattening the Observable

**The Problem**

1. Observable is a collection of data that comes over time. 
2. An Observable can give us another Observable, so now we have an Observable of Observable.
3. **Concurrency problem**:
  - If there are several Observables, and we `forEach()` over each. `forEach()` over the first Observable. 
  - Then `forEach()` over the second observable. 
  - But during the second Observable `forEach()`, the first Observable creates a new Observable while we are not completed with the second Observable. 
  - So, now we have an Observable of an Observable.
  - >**Note**: There might be a case where Observable Observables might never complete, thus it will restrict `forEach()` method and it will never move on the next Observable.  
  An example of Infinite stream is mouse move. We can stop listening to that infinite stream by `takeUntil()` method.

Because items arrive Over Time, and there is possible to exist Observable of Observable, there are several ways to flatten the Observable.

>**Note**: Not all Observables emit values immediately:
- **Hot Observable**:Some Observables emit values immediately (e.g. `"mousemove"`). It goes on whether we listen to it or not. If we don't listen, we might miss some data.
- **Cold Observable**: Some Observables don't emit values until we `forEach()` over them.


>**Note**: Any Error, that happens in any of inner Observables (or Observables of Observables), is forwarded upwards and the whole Observable stream stops because of an Error. 

>**Note**: Calling `dispose()` on the subscription on the flattened Observable will call `dispose()` on the Outer Observable Subscription and Inner Observable Subscription (if we are currently listening one).

>**Note**: `dispose()` does not trigger `onCompleted()`. `dispose()` means that we don't want an Observer to talk to as any more. So there is no need for `onCompleted()`.  
```dispose()``` does not call ```onCompleted```.


**These are the ways we can Order Events:**
- `concatAll()`.
- `mergeAll()`.
- `switchLatest()`.




### takeUntil()

**`takeUntil()`** 
  1. Takes the Source Observable and the Stop Observable and creates a new Observable with all of the data from the Source Observable. 
  2. Every time a Source Observable emits, it forvards the value.
  3. As soon as the Stop Observable fires a value (`onNext()` or `onCompleted()`), `takeUntil()` completes that new Observable (that's taking these two Observables and putting them together). And unsubscribes by calling `dispose()` method Stop Observable. The Source Observable is already completed, so no need to call `dispose()` on it.
  - If the Stop Collection throws an Error, the overall Observable will end with that Error. Error will be forwarded along.  
  4. If there are multiple Stop Observables, we can use a composition and use `.takeUntil()` as many times as needed.


With `takeUntil()` we can take two Infinite Observables and create an Observable that ends.

- ```source_collection.takeUntil(stop_collection)``` 
- Don't use ```removeEventListener```, instead create a new event from existing event and end them when we want to end them. Take a source collection, use ```takeUntil``` to combine it with whatever event happens when we're supposed to stop listening - this creates an Observable that completes when we want to.




### concatAll()

**`concatAll()`** flattens the higher-order Observable by one dimension.
- `concatAll()` starts flattening from top to bottom, left to right.
- We have **Cold Observables**. It didn't `forEach()` over `{}` or `{4}`, until `3` was not completed (`onCompleted()`). `concatAll()`put them aside (**Buffered Observables**) and didn't flatten them yet.
- `{}` when there is an Empty Collection, it immediately completes - `onCompleted()` runs and nothing is added to the new flattened Observable.
- Using `concatAll()` on infinite stream is not a good idea. If there are multiple Observables, and some Observable has Observable of Observables, and that Observable of Observables has an infinite stream, it might restrict the `forEach()` from getting to the next Observable.  


```js
       Time
------------------->
{
  ...{1}
  .....{2..........3}
  .........{}
  ...........{4}
}.concatAll()

{..1...2.......3....4}
```


```js
[
  [1]
  [2, 3]
  []
  [4]
].concatAll()

[1, 2, 3, 4]
```




### mergeAll()

**`mergeAll()`** immediately `forEach()` over the Observables, as soon as they come. It doesn't wait an Observable stream to be complete.

With `mergeAll()` we don't care about the order.

```js
       Time
------------------->
{
  ...{1}
  .....{2..........3}
  .........{}
  ...........{4}
}.mergeAll()

{..1...2.....4..........3}
```



### switchLatest()

**`switchLatest()`** switches to the latest Observable. It unsubscribes from the Previous Observable by calling `dispose()` (even if the Observable is empty). It doesn't wait for previous Observable values. If the Previous Observable emits a new Observable later on, the new Observable won't be registered.

This is one of the common operator for User Interfaces. Because, user might click button-1 at first, but then change mind and click button-2 and want to see button-2 result.


**Button click Example**

When user clicks on the button several times, with `switchLatest()` we map over each click and replace each click event with an Observable, that is the result of (e.g.) a network request and turn it into a two dimensional Observable.

For every click event object, we're going to substitute in an Observable that represents the result of the network request. So now we have a two dimensional Observable.

Every time a new Observable comes, it disposes the old Observable and aborts XHR process and starts a new one.


```js
       Time
------------------->
{
  ...{1}
  .....{2..........3}
  .........{}
  ...........{4}
}.switchLatest()

{..1...2.....4}
```






<hr>
<hr>





## Examples

To solve problems, we need to take four steps:

1. What collections (Observables) do we have.
2. What collection (Observable) do we want.
3. How do we get from the collections (Observables) we have to the collection (Observable) we want.
4. Once we have that collection (Observable), what are we going to do with the data that comes out of it.






|Method| Explanation|
|------------|------------|
| `ajax.getJSON` | Sends an HTTP GET request to specified URL (like `fetch()` in JS). Returns an Observable. It is the result of whatever we get back from the server, parsed as JSON. It is an Observable with One Value in it. So `onCompleted()` comes right after JSON object, because this Observable has only one value. |
| `throttle(<Time Interval>)` | Ensures that an event handler is executed at most once in a specified time interval. It takes an item, waits for the specified time. If after that time another item comes, it drops the old item and takes a new one. And if after the specified time it doesn't get another item, it forwards the current item that it is holding. |
| `retry(<How Many Times to Retry>)` | Used to resubscribe to the Source Observable after an error has occured. It will call `forEach()` maximum as many times as it is specified. |





### Promises

We don't use Promises for UI (e.g. animations) because we might need to cancel it, and **We Can't Cancel Promises**.

We can't retry the Promise. We can call again the function that made a network request.






### zip()

**`zip()`** operator is used to combine multiple Observables into a single Observable by combining their emitted values into tuples (arrays). 

`zip()` creates a new Observable.

It waits for each Source Observable to emit a value, and then combines these values into a new value, which is emitted by the resulting Observable.

`zip()` preserves the order of emissions from each source Observable and combines them into tuples based on their emission sequence.

Each emitted value is a tuple containing one value from each source Observable. Emissions are only combined into tuples when each source Observable has emitted.

```js
       Time
------------------->
{
  ...{1}
  .....{2}
  .........{3}
}.zip({
  ...{a}
  .....{b}
  .........{c}
})

{..1, a...2, b.....3, c}
```


### concatMap()

**`concatMap()`** is used to transform each value emitted by the Source Observable into an Inner Observable, and then flatten these inner Observables sequentially in the order they were created. It ensures that each inner Observable is  subscribed to and completed before moving on to the next one.