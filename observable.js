const button = document.getElementById('button');


function Observable(forEach) {
  this._forEach = forEach;
}

Observable.prototype = {
  forEach: function(onNext, onError, onCompleted) {
    // Three separate functions were passed in instead of an object
    if (typeof onNext === "function") {
      return this._forEach({
        onNext: onNext,
        onError: onError || function() {},
        onCompleted: onCompleted || function() {},
      })
    }
    else {
      // In this case 'onNext' is an Observer Object
      // 'onNext' is { onNext: () => {}, onError: () => {} }
      return this._forEach(onNext);
    }
  },

  map: function(projectionFunction) {
    // Because mapped Observable needs to call 'forEach()' on the original Observable, 
    // we need to save the original 'this'
    const self = this;
    // Mapped Observable
    return new Observable(function forEach(observer) {
      // We are Streaming the data, not collecting in the memory
      return self.forEach(
        function onNext(x) { observer.onNext(projectionFunction(x)) },
        function onError(e) { observer.onError(projectionFunction(e)) },
        function onCompleted() { observer.onCompleted() },
      )
    });
  },

  filter: function(testFunction) {
    const self = this;

    // Filtered Observable
    return new Observable(function forEach(observer) {
      return self.forEach(
        function onNext(x) {
          if ( observer.onNext(testFunction(x))) {
            /* return */ observer.onNext(x);
          }
         },
        function onError(e) { observer.onError(projectionFunction(e)) },
        function onCompleted() { observer.onCompleted() },
      )
    });
  },

  take: function(num) {
    const self = this;

    // Take Observable
    return new Observable(
      function forEach(observer) {
        const counter = 0;
        const subscription = self.forEach(
          function onNext(v) {
            observer.onNext(v);
            counter++;

            if (counter === num) {
              observer.onCompleted();
              subscription.dispose();
            }
          }
        )
        return subscription;
      },
      function onError(error) {
        observer.onError(error);
      },
      function onCompleted() {
        observer.onCompleted();
      }
    );
  },
}

Observable.fromEvent = function(dom, eventName) {
  return new Observable(function forEach(observer) {
    const handler = event => observer.onNext(event);

    dom.addEventListener(eventName, handler);

    // Subscription Object
    return {
      dispose: () => {
        dom.removeEventListener(eventName, handler);
      }
    }
  });
}

Observable.observations = function(obj) {
  return new Observable(function forEach(observer) {
    const handler = event => observer.onNext(event);

    Object.observe.addEventListener(eventName, handler);

    // Subscription Object
    return {
      dispose: () => {
        Object.unobserve.removeEventListener(eventName, handler);
      }
    }
  })
}



/* const clicks = 
  Observable
    .fromEvent(button, 'click')
    .filter(event => event.pageX > 40)
    .map(event => event.pageX + 'px');


clicks.forEach(x => console.log(x.pageX)); */