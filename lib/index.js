'use strict';
// Global variables for DOM elements
var table = document.getElementById('table');
var getInfo = document.getElementById('refresh');

// Array of Twitch usernames to get information for
var twitchUsernames = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

// Array to store stream and channel information
var twitchChannels = [];

// Show an error if app initially fails to retrieve data from Twitch
var showError = function showError() {
  window.alert('Sorry there was an error retrieving data from Twitch');
};

// Fetch URL for each user channel
var getURLs = function getURLs() {
  var _loop = function _loop(channel) {
    fetch('https://api.twitch.tv/kraken/channels/' + channel.id + '?api_version=5&client_id=2gpx8zv8oh250fbghonp9qbftngdr5').then(function (response) {
      return response.json();
    }).then(function (data) {
      channel.url = data.url;
    })
    // Set URL to placeholder if unable to get data
    .catch(function () {
      channel.url = '#';
    });
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = twitchChannels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var channel = _step.value;

      _loop(channel);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

// Fetch stream information for each channel
var getStreamData = function getStreamData() {
  var _loop2 = function _loop2(channel) {
    fetch('https://api.twitch.tv/kraken/streams/' + channel.id + '?api_version=5&client_id=2gpx8zv8oh250fbghonp9qbftngdr5').then(function (response) {
      return response.json();
    }).then(function (data) {
      // If data exists set the name and game
      if (data.stream) {
        channel.streamName = data.stream.channel.status;
        channel.streamGame = data.stream.channel.game;
        // If no stream is active, set to offline
      } else {
        channel.streamName = 'Offline';
        channel.streamGame = '';
      }
      // Render information to the table
      populateTable(channel);
    })
    // Show failure message for any failed AJAX requests
    .catch(function () {
      channel.streamName = 'Failed to retrieve stream data';
      channel.streamGame = '';
      populateTable(channel);
    });
  };

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = twitchChannels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var channel = _step2.value;

      _loop2(channel);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
};

// Empty the table
var emptyTable = function emptyTable() {
  table.innerHTML = '';
};

// Populate the table with relevant data
var populateTable = function populateTable(channel) {
  // Create a row element
  var row = document.createElement('tr');
  // Set the row's html with all the data gathered
  row.innerHTML = '<td><img src="' + channel.logo + '" class="logo"></td><td class="username"><a href="' + channel.url + '">' + channel.display_name + '</a></td><td class="game">' + channel.streamGame + '</td><td class="stream">' + channel.streamName + '</td>';
  // Set classes for row depending on whether online or offline
  if (channel.streamName === 'Offline') {
    row.className = 'offline';
  } else {
    row.className = 'online';
  }
  // Finally add the row to the table
  table.appendChild(row);
};

// Get initial user information from login names
var getUsers = function getUsers() {
  // First empty any data already displayed 
  emptyTable();
  fetch('https://api.twitch.tv/kraken/users?login=' + twitchUsernames.join(',') + '&api_version=5&client_id=2gpx8zv8oh250fbghonp9qbftngdr5').then(function (response) {
    return response.json();
  }).then(function (data) {
    // Remove any channel information from the channels array
    twitchChannels.splice(0);
    // Create a user object for each login name and set initial properties 
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = data.users[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var user = _step3.value;

        var channel = {
          id: user._id,
          display_name: user.display_name,
          logo: user.logo
          // Push users to the channels array
        };twitchChannels.push(channel);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }).catch(showError)
  // Asynchronously run the next functions 
  .then(getURLs).then(getStreamData);
};

// Add listener to the refresh button
getInfo.addEventListener('click', getUsers);

// Start the app
getUsers();