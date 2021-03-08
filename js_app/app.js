
function init() {
  var url = "https://us-central1-poetic-avenue-237204.cloudfunctions.net/stroke";
  var seconds = 0;

  // dom elements
  var cta = document.getElementById("analyze-cta");
  var input = document.getElementById("input");
  var demo = document.getElementById("demo");
  var reset = document.getElementById("reset-cta");
  var resultsPositive = document.getElementsByClassName("result-positive");
  var resultsNegative = document.getElementsByClassName("result-negative");
  var secondsCounter = document.getElementById('seconds-counter');

  function getResults() {
    demo.classList.remove('done');
    demo.classList.add("loading");
    input.disabled = true;
    cta.disabled = true;
    reset.disabled = true;
    seconds = 0;

    function incrementSeconds() {
      seconds += 1;
      secondsCounter.innerText = "You have been waiting for " + seconds + " seconds.";
    }
    var interval = setInterval(incrementSeconds, 1000);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gender: "Male",
        age: 25.0,
        hypertension: 0,
        heart_disease: 0,
        ever_married: "Yes",
        work_type: "Private",
        residence_type: "Rural",
        glucose: 105.92,
        bmi: 20,
        smoking: "never smoked"
      })
    })
    .then(function(response) {
      clearInterval(interval);

      response.text().then(function(text) {
        if (text) {
          demo.classList.add("done");
          demo.classList.remove("loading");
          
          input.disabled = false;
          cta.disabled = false;
          reset.disabled = false;

          var results = JSON.parse(text);
          var positive = Math.round(parseFloat(results.positive) * 10000)/100;
          var negative = Math.round(parseFloat(results.negative) * 10000)/100;

          for (var i = 0; i < 1; i++) {
            resultsPositive[i].innerText = positive + '%';
            resultsNegative[i].innerText = negative + '%';
          }
        }
      });
    })
    .catch(function(err) {
      console.log('Fetch Error', err);
    });
  }

  function resetFields() {
    input.value = '';
    demo.classList.remove('done');
  }

  cta.onclick = getResults;
  reset.onclick = resetFields;
}

init();





