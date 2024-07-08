

|  Method  |  What it does  |
|----------|----------------|
| forEach | Takes a function and applies that function to every iten in an array. |
| Map | Takes a function, applies it to every item in a collection, creating a new value. Then creates a new array with all results of applying that function to each value in the array. Map does not change the original array. It creates a new array. Change the item - Put it in a new collection - r\Return that collection. |
| Filter | Applies a test function to every item in the array. Instead of transforming a value, it will apply a test to every single value and only if that value passes the test, it will make in a new collection. |
|  |  |
|  |  |
| -------- | -------- |
| ** concatAll | (We will write it) Takes a multidimensional array and flattens it by one dimension. |
|  |  |




## The difference between an array and an event

Events and arrays are both collections.

Iterators:  
- There are Producers and Consumers.
- The Consumer requests information, one at a time, from the Producer until one of two things happen: 
  1. The Producer has no more information.
  2. The Producer says that an error occured.
- We can request an iterator object: 
```js
const iterator = [1, 2, 3].iterator()
```
- If we call the method ```iterator.next()``` we will get the value we requested and a boolean indicating whether there are more values to get.
```js
console.log(iterator.next());
{ value: 1, done: false };

console.log(iterator.next());
{ value: 2, done: false };

console.log(iterator.next());
{ value: 3, done: false };

console.log(iterator.next());
{ done: true };
```
In this case we are consumers and we are puliing values out of the producer - iterator, until ther producer says that there are no more values to get.


### Observer Pattern - Event Listeners

When we add event listeners to some event, we add a function (an event handler function) to some data producer (to event).  

Instead of consumer pulling the data out, the producer pushes the data action (an event, like 'mousemove'), one item at a time.



In the Iterator pattern the consumer is in control - the consumer pulls values out, the consumer decides when it gets the next value. 

In the Observer pattern, the producer is in control - the producer decides when do we get the next value. It calls the callback and pushes to us.



In case of Iterator pattern, if there is no more data or some error has occured, the consumer is notified about that.  
But in case of Observer pattern, the consumer is not notified in any way, whether there is no more data or an error has occured. The only message consumer recieves from the Producer is more data. With observables, consumer also can say that they don't need the data any more.


Push APIs:
- DOM Events.
- Websockets.
- Server-sent Events.
- Node Streams.
- Service Workers.
- jQuery Events.
- XMLHttpRequest.
- setInterval.



Iterables - something we can ask for iterator from. E.g. an array is not an iterable, it is something we can ask to give us iterator.  
Observables - a collection that arrives over time.  
Observable = Collection + Time.



## Observables

Observables can model:
- Events.
- Async Server Requests.
- Animations.


Get the Observable extension from: [https://reactivex.io/].  
It introduces an Observable type.



#### Events to Observables


- Adapt all different type of async APIs into Observables - a common interface.
- ```fromEvent``` takes a DOM Object and the name of an event, and adapts it into an Observable.

```js
const mouseMoves = Observable.fromEvent(element, 'mousemove');
```
<hr>


- Subscribe 

We can take any Observable and iterate with ```forEach``` over it. 
```forEach``` returns a Subscription Object. 
Observable is a collection that arrives over time. So, when we ```forEach``` over observable, code doesn't wait to recieve all the data. This way it would block the execution. Instead it completes the action and as the observable comes, the function gets invoked again.

```js
const subscription = mouseMoves.forEach(console.log);
```
<hr>


- Unsubscribe
- Consumer can say that they don't need any more data.
- Every ```forEach``` call returns different ```dispose``` object.

```js
subscription.dispose();
```
<hr>

- There is a way in a Push Stream to give a Consumer an information that an error has occured or there is no more data coming.

```js
const subscription = mouseMoves.forEach( {
    onNext: event => console.log(event); // To Recieve the data (like addEventListener).
    onError: error => console.error(error); // optional - Tells consumers that there was an error.
    onCompleted: () => console.log('done'); // optional - Excepts no arguments. Tells consumer that there is no more data.
});
```


Shorthand:
```js
const subscription = mouseMoves.forEach(
  event => console.log(event); // To Recieve the data (like addEventListener).
  error => console.error(error); // optional - Tells consumers that there was an error.
  () => console.log('done'); // optional - Excepts no arguments. Tells consumer that there is no more data.
)
```
<hr>


- Observer

Observer observes Observable. It is the object with ```onNext```, ```onError```, ```onCompleted``` methods on it.

<hr>

- Convert Events to Observables.
- An Observable is an object with ```forEach``` method on it.

```js
Observable.fromEvent = function(dom, eventName) {
  // returning Observable Object
  return {
    forEach: function(observer) {
      const handler = e => observer.onNext(e);
      dom.addEventListener(eventName, handler);

      // returning Subscription Object
      return {
        dispose: function() {
          dom.removeEventListener(eventName, handler);
        }
      }
    }
  }
}
```

<hr>

- Hot Observable - 
- Observable that emit values regarding whether we listen to it or not (we listen to events via ```forEach``` and get values with ```forEach.onNext()```). And if we don't start listening soon enough, we might miss some Event Objects. The example of this behavior is mouse move events.

<hr>

- Cold Observable.
- Observable that don't do anything until somebody calls ```forEach``` on it and subscribes it. Data won't come out of this observables until we subscribe it.

- If we ```forEach``` over an empty collection, the only thing will happen is it fires ```onCompleted```. If an observable completes without emitting any values, the ```onCompleted``` callback will be invoked.
```onCompleted``` from this object:
```js
const subscription = mouseMoves.forEach( {
    onNext: event => console.log(event); // To Recieve the data (like addEventListener).
    onError: error => console.error(error); // optional - Tells consumers that there was an error.
    onCompleted: () => console.log('done'); // optional - Excepts no arguments. Tells consumer that there is no more data.
});
```
- This is the way to stop race conditions.  
If we subscribe to two events, they will come at us in any order. They won't wait from the first event all the data to be completed before second event comes.    
And this way we can order events.


There might be an Observable that never says that it is done. There might be an observable that goes on forever. A lot of DOM events can go forever. In this case Consumers should say when they want to stop recieving data.


```dispose()``` does not call ```onCompleted```.

<hr>

- ```takeUntil```
- ```source_collection.takeUntil(stop_collection)``` 
- ```takeUntil``` takes a Source Observable, Stop Observable and creates a New Observable and completes that observable as soon as Stop Observable fires a value(```onNext```, ```onCompleted```) and under the hood unsubscribes by calling dispose on both source and stop. ```onCompleted``` will be fired if Stop Observable returns either ```onNext``` or```onCompleted```. If it fires ```onError```, overall Observable will end with an error. 

- Don't use ```removeEventListener```, instead create a new event from existing event and end them when we want to end them. Take a source collection, use ```takeUntil``` to combine it with whatever event happens when we're supposed to stop listening - this creates an Observable that completes when we want to.


<hr>

Flattening Patterns

<hr>

```concatAll```
- Will not emit any more values from subsequent observables until the observable currently listening to is completed.

```
{
  ...{1}
  ........{2..............3}
  .............{}
  .................{4}
}.concatAll()

{...1...2......3...4}
```


<hr>

```mergeAll```
- Merge does not wait the current Observable to be complete. If another observable comes along, it keeps listening to the first one and Subscribes (```forEach```) to the second one too. And when the second one gives a value, it disposes that Observable, and finally, when the first Observable comes, it gets the first Observable's value.
- Use ```mergeAll``` when we don't care about data order and need the data as quick as it is possible.
```
{
  ...{1}
  ........{2..............3}
  .............{}
  .................{4}
}.mergeAll()

{...1...2.....4........3}
```


<hr>

```switchLatest```
- If while we are waiting for the first Observable to come, if the second Observable comes, it switches to the latest Observable. 
- It disposes the subscription to the first Observable and waits for  the second one.

```
{
  ...{1}
  ........{2..............3}
  .............{}
  .................{4}
}.switchLatest()

{...1...2....4}
```

<hr>



























