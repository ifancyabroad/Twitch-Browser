// Global variables for DOM elements
const table = document.getElementById('table');
const getInfo = document.getElementById('refresh');

// Array of Twitch usernames to get information for
let twitchUsernames = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

// Array to store stream and channel information
let twitchChannels = [];

// Show an error if app initially fails to retrieve data from Twitch
const showError = function() {
  window.alert(`Sorry there was an error retrieving data from Twitch`);
}

// Fetch URL for each user channel
const getURLs = function() {
  for (let channel of twitchChannels) {
    fetch(`https://api.twitch.tv/kraken/channels/${channel.id}?api_version=5&client_id=2gpx8zv8oh250fbghonp9qbftngdr5`)
    .then(response => response.json())
    .then(function(data) {
      channel.url = data.url;
    })
    // Set URL to placeholder if unable to get data
    .catch(function() {
      channel.url = '#';
    })
  }
}

// Fetch stream information for each channel
const getStreamData = function() {
  for (let channel of twitchChannels) {
    fetch(`https://api.twitch.tv/kraken/streams/${channel.id}?api_version=5&client_id=2gpx8zv8oh250fbghonp9qbftngdr5`)
    .then(response => response.json())
    .then(function(data) {
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
    .catch(function() {
      channel.streamName = 'Failed to retrieve stream data';
      channel.streamGame = '';
      populateTable(channel)
    })
  }
}

// Empty the table
const emptyTable = function() {
  table.innerHTML = '';
}

// Populate the table with relevant data
const populateTable = function(channel) {
  // Create a row element
  let row = document.createElement('tr');
  // Set the row's html with all the data gathered
  row.innerHTML = `<td><img src="${channel.logo}" class="logo"></td><td class="username"><a href="${channel.url}">${channel.display_name}</a></td><td class="game">${channel.streamGame}</td><td class="stream">${channel.streamName}</td>`;
  // Set classes for row depending on whether online or offline
  if (channel.streamName === 'Offline') {
    row.className = 'offline';
  } else {
    row.className = 'online';
  }
  // Finally add the row to the table
  table.appendChild(row);
}

// Get initial user information from login names
const getUsers = function() {
  // First empty any data already displayed 
  emptyTable();
  fetch(`https://api.twitch.tv/kraken/users?login=${twitchUsernames.join(',')}&api_version=5&client_id=2gpx8zv8oh250fbghonp9qbftngdr5`)
  .then(response => response.json())
  .then(function(data) {
    // Remove any channel information from the channels array
    twitchChannels.splice(0);
    // Create a user object for each login name and set initial properties 
    for (let user of data.users) {
      let channel = {
        id: user._id,
        display_name: user.display_name,
        logo: user.logo
      }
      // Push users to the channels array
      twitchChannels.push(channel);
    }
  })
  .catch(showError)
  // Asynchronously run the next functions 
  .then(getURLs)
  .then(getStreamData)
}

// Add listener to the refresh button
getInfo.addEventListener('click', getUsers);

// Start the app
getUsers();