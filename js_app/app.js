
function init() {
  var url = "https://us-central1-poetic-avenue-237204.cloudfunctions.net/stroke";
  var seconds = 0;

  // dom elements
  var cta = document.getElementById("analyze-cta");
  var demo = document.getElementById("demo");
  var reset = document.getElementById("reset-cta");
  var resultsPositive = document.getElementsByClassName("result-positive");
  var resultsNegative = document.getElementsByClassName("result-negative");
  var secondsCounter = document.getElementById("seconds-counter");
  var missingValues = document.getElementById("missing-value");

  // input fields
  var inputGender = document.getElementById("gender");
  var inputAge = document.getElementById("age");
  var inputHypertension = document.getElementById("hypertension");
  var inputHeartDisease = document.getElementById("heart-disease");
  var inputGlucose = document.getElementById("glucose");
  var inputMarried = document.getElementById("married");
  var inputWork = document.getElementById("work-type");
  var inputSmoking = document.getElementById("smoking");
  var inputResidence = document.getElementById("residence-type");
  var inputBMI = document.getElementById("bmi");

  function getResults() {
    if (!inputGender.value || !inputAge.value || !inputHypertension.value
      || !inputHeartDisease.value || !inputGlucose.value || !inputMarried.value || !inputWork.value || !inputSmoking.value || !inputResidence.value || !inputBMI.value){
      missingValues.classList.add("display");
      return;
    }

    missingValues.classList.remove("display");

    demo.classList.remove('done');
    demo.classList.add("loading");
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
        gender: inputGender.value,
        age: parseFloat(inputAge.value),
        hypertension: parseFloat(inputHypertension.value),
        heart_disease: parseFloat(inputHeartDisease.value),
        ever_married: inputMarried.value,
        work_type: inputWork.value,
        residence_type: inputResidence.value,
        glucose: parseFloat(inputGlucose.value),
        bmi: parseFloat(inputBMI.value),
        smoking: inputSmoking.value
      })
    })
    .then(function(response) {
      clearInterval(interval);

      response.text().then(function(text) {
        if (text) {
          demo.classList.add("done");
          demo.classList.remove("loading");
          
          cta.disabled = false;
          reset.disabled = false;


          var results = JSON.parse(text);

          var positive = Math.round(parseFloat(results.stroke) * 10000)/100;
          var negative = Math.round(parseFloat(results.noStroke) * 10000)/100;

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
    demo.classList.remove('done');

    inputGender.value = '';
    inputAge.value = '';
    inputHypertension.value = '';
    inputHeartDisease.value = '';
    inputGlucose.value = '';
    inputMarried.value = '';
    inputWork.value = '';
    inputSmoking.value = '';
    inputResidence.value = '';
    inputBMI.value = '';
  }

  cta.onclick = getResults;
  reset.onclick = resetFields;
}

init();





