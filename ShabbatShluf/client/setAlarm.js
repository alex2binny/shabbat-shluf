Template.setAlarm.rendered = function () {
  $(document).ready(function() {
    $('select').material_select();
  });
};

var clock = 10;
var timeLeft = function () {
  if (clock > 0) {
    clock --;
    Session.set('timer', clock);
  }
}

Template.setAlarm.helpers({
  'currentAlarm': function () {
    return Alarms.find({}).fetch();
  },

  'weatherData': function () {
    return Session.get('weatherData');
  },

  'time': function() {
    return Session.get('timer');
  }
});

Template.setAlarm.events({
  'click a.submit': function (e) {
    e.preventDefault();

    var hour = $('.hour option:selected').val();
    var minutes = $('.minutes option:selected').val();
    var ampm = $('.ampm option:selected').val();

    if (!hour || !minutes || !ampm) {
      Materialize.toast('Please fill out all the fields', 3000);
      return;
    }

    var time = {
      hour: hour,
      minutes: minutes,
      ampm: ampm
    }

    Alarms.insert(time);
  },

  'click i.delete': function (e) {
    Alarms.remove(this._id);
  },

  'click a.previewAlarm': function (e) {
    e.preventDefault();

    var weather = "";

    var xmlhttp = new XMLHttpRequest();
    var url = "http://api.openweathermap.org/data/2.5/weather?zip=10016%2Cus&APPID=c502caf059df9b3d30f37cdac6bc06a0";

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          Session.set('responseText', xmlhttp.responseText)
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    var parsedData = $.parseJSON(Session.get('responseText'))
    Session.set('weatherData', parsedData);

    $('#modal1').openModal();
    Meteor.setInterval(timeLeft, 1000)

    var s = new buzz.sound('/audio/alarm.m4a');
    s.play();
  }
});
