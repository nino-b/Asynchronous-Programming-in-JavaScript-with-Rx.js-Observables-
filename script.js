window.onload = function() {
  const Observable = Rx.Observable;
  const textbox = document.getElementById('textbox');
  const keypresses = Observable.fromEvent(textbox, 'keypress');
  const results = document.getElementById('results');
  const searchButton = document.getElementById('searchButton');
  const searchButtonClicks = Observable.fromEvent(searchButton, 'click');
/* 
  keypresses.forEach(function(keypress) {
    alert(keypress);
  }); */

  function getWikipediaSearchResults(term) {
    return Observable.create(function forEach(observer) {
      let cancelled = false;
      const url = `http://en.wikipedia.org/w/api.php?actopm=opensearch&format=${encodeURIComponent(term)}&callback=?`;

      $.getJSON(url, function(data) {
        if (!cancelled) {
          observer.onNext(data[1]);
          observer.onCompleted();
        }
      });
      return function dispose() {
        cancelled = true;
      }
    });
  }


  const searchFormOpens = searchButtonClicks.doActions(
    function onNext() {
      document.getElementById('searchForm').style.display = 'block';
    }
  );


  const searchResultSets = searchFormOpens.map(() => {
    const closeClicks = Observable.fromEvent(document.getElementById('closeButton'), 'click');
    
    const searchFormCloses = closeClicks.doActions(() => {
      document.getElementById('searchForm').style.display = 'none';
    },
    (error) => {}, // onError
    () => {} // onCompleted
    );

    return keypresses
      .throttle(20)
      .map(function() {
        return textbox.value;
      })
      .distinctUntilChanged()
      .map(search => {
        return getWikipediaSearchResults(search).retry(3);
      })
      .switchLatest()
      .takeUntil(searchFormCloses);
    }).switchLatest();
  

    searchResultSets.forEach(
      function(resultSet) {
        results.value = JSON.stringify(resultSet);
      },
      function(error) {
        alert('Not working. Try again later.');
      }
    );
}
