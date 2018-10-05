console.log('app is alive');

/* global variable of currentluy selected channel */
var currentChannel;

/* onload selected channel */
currentChannel = octoberfest;

/* current location of app user */
var currentLocation = {
    longitude: 48.264976,
    latitude: 11.668641,
    what3words: "dose.verse.lunged"
};

/* function to switch between channels by clicking on the channel row in the channel list */
/** @param channelObject
*/

function switchChannel(channelObject) {
    console.log('Turning into channel', channelObject);
    
    /* empty messages in chatarea */
    $('#chat').empty();
    /* adjusting of the selected channel name in the rightside app-bar */
    $('#rightside .app-bar h1 span').html(channelObject.name);
    /* adjusting of the selected channel location in the rightside app-bar shown as w3w */
    $('#rightside .app-bar h1 strong').html('<a href="https://map.what3words.com/'
        +channelObject.createdBy
        +'" target="_blank">'
        +channelObject.createdBy
        +'</a>');
    
    /* removing of class "selected-channel" from all channels in the list */
    $('#channels li').removeClass('selected-channel');

    /* adding of class "selected-channel" to the recently clicked channel */
    $('#channels li:contains('+channelObject.name+')').addClass('selected-channel');
    
    /* remove of class (solid/ unsolid) of the star in rightside app-bar */
    $('#rightside .app-bar i').removeClass('fas far');

    /* adding of class depending on the value starred in the channel object */
    $('#rightside .app-bar i').addClass(channelObject.starred ? 'fas' : 'far');
    
    /* defining of recently clicked channel as currently selected channel */
    currentChannel = channelObject;

};

/* function to toggle the star rightside app-bar between solid and unsolid (like/ no like) 
and chaning of the channelObject.starred value in channel list */

function likeChannel() {
    $('#rightside .app-bar i').toggleClass('fas far');
    
    /* starred value is changed */
    currentChannel.starred = !currentChannel.starred;

    $('#channels li:contains('+currentChannel.name+') .fa-star').removeClass('fas far');
    $('#channels li:contains('+currentChannel.name+') .fa-star').addClass(currentChannel.starred ? 'fas' : 'far');

    console.log(currentChannel.name,' starstatus is ',currentChannel.starred);
};

/* function to add class "selected-tab" to recently clicked tab */

function selectTab(tabID) {
    $('#tab-bar button').removeClass('selected-tab');
    console.log('Changing to Tab ' + tabID)
    $(tabID).addClass('selected-tab')
};

/* function to show the emoji window */

function showEmojis()  {
    var emojis = require('emojis-list')
    console.log(emojis[0]);
    $('#emojis').toggle();
};

/* section-2 creates new message objects and puts them into the chatarea */

/** @param text
 *  @constructor
 */

 /* messageObject that performs as a form for newly created messages*/
function Message(text) {
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    this.createdOn = new Date();
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); /* current time plus 15min (converted to ms) */
    this.text = text;
    this.own = true; /* always true as messages created are always "own" messages */
};


/* function that is linked with clicking the send button */
function sendMessage() {
    /* reading the input out of the message input field */
    var newMessage = new Message($('#message-input').val());
    /* reading the number of letters put into the message input field */
    var textLength = $('#message-input').val().length;

    /* condition to ensure that a message is entered before being able to send the message */
    if (textLength > 0) {
       currentChannel.messages.push(newMessage);
       $('#chat').append(createMessageElement(newMessage));
       $('#chat').scrollTop($('#chat').prop('scrollHight'));
       $('#message-input').val('');
       currentChannel.messageCount++;
       console.log("New message '", newMessage.text, "' in channel", currentChannel, "with ", textLength, " letters");
       console.log(currentChannel.name, "has", currentChannel.messageCount, "messages now");

    /* alert shown in case of no message entered */
    } else {
       alert("You have nothing to say?");
       console.log("No message created");
    }
};

/* function to create new message field in the chatarea:
   <div class="message">
        <h3>
            <strong><a href="w3w_link">channel_createdBy</a></strong> channel_createdOn 
            <span class="remaining-time">channel_expiresIn=min left</span>
        </h3>
            <p>message_text<button class="button-accent">+5min</button></p>
    </div>
*/

/** @param messageObject
 *  @returns
 */

function createMessageElement(messageObject) {
    /* converting the specific time to a period of time (the message is going to remain) */
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);
    
    /* create a messageObject and return is back to "sendMessage()" */
    return '<div class="message'+
    (messageObject.own ? ' own' : '')+'">'+
        '<h3>'+
            '<strong><a href="https://map.what3words.com/' + messageObject.createdBy + '"target="_blank">' + messageObject.createdBy + '</a></strong>' +
            messageObject.createdOn.toLocaleString() + /* converting the time format */
            '<span class="remaining-time">' + expiresIn + 'min left</span>'+
        '</h3>'+
            '<p>' + messageObject.text + '<button class="button-accent">+5min</button></p>'+
    '</div>';
};

/* end of section-2 */

/* section-3 creates new channel list elements */

/* function lists the channels; order determined by "channels" array; onload */

/** @param criterion */

function listChannels(criterion) {
    for (var i=0; i < channels.length; i++) {
        console.log('add channel:', channels[i]);
        $('#channels ul').append(createChannelElement(channels[i]));
    }
    channels.sort(criterion);
};

/* function creates channel list object:
   <li onclick="switchChannel(channel_title)">channel_name
        <span class="channel-list-icons">
           <i class"fa? fa-star></i><span>channel_expiresIn+min</span><span>channel_messageCount+new</span><i class="fas fa-chevron-right"></i>
        </span>
    </li>
*/


/** @param channelObject
 *  @returns
 */

 function createChannelElement(channelObject) {
    var channel = $('<li>').text(channelObject.name);
    channel.click(function() {switchChannel(channelObject)}); /* onclick function added and linked to "switchChannel" function */
    var channelBar = $('<span>').addClass('channel-list-icons').appendTo(channel);
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(channelBar); /* star */
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(channelBar); /* min counter */
    $('<span>').text(channelObject.messageCount + ' new').appendTo(channelBar); /* message counter */
    $('<i>').addClass('fas fa-chevron-right').appendTo(channelBar); /* right arrow */

    return channel; /* return newly adjusted variable "channel" to function "listChannels" */
     
 }

//  function compareNew(channels) {
//      return (.createdOn - .createdOn);
//  }

 function compareTrending(channels) {
    for (var i=0; i < channels.length; i++) {
     if (channels[i].messageCount < channels[i].messageCount) {
         return -1;
     } else {
         return 1;
     }
    } 
 }

//  function compareFavorites(channels) {
//      if (.starred = true) {
//          return -1;
//      } else {
//          return 1;
//      }
//  }



 /* end of section-3 */

 /* section-4 channel-creation-mode */
 //var oldAppBar = $('#rightside .app-bar h1');
 //oldAppBar.data('oldAppBar', createChannel());

 function channelCreationMode() {
    /* empty messages in chatarea */ 
    $('#chat').empty();
    
    /* swap rightside app-bar title (h1) with input field */
    $('#rightside .app-bar h1').html('<input type="text" id="channel-input" name="newchannel" placeholder="#ChannelName...">');
    /* abort button */
    var abortButton = $('<i class="fas fa-times"> ABORT</i>').appendTo('#rightside .app-bar h1');
    abortButton.click(function() {abortNewChannel()});
    /* swap send-button */
    $('#send-message-button').replaceWith('<button id="create-channel-button" class="button-accent" onclick="createChannel()">CREATE</button>');

 };

 function abortNewChannel () {
    
    //oldAppBar.html(oldAppBar.data('oldAppBar'));

    /* switch back to the former channel */
    switchChannel(currentChannel);
 };

/** @param name
 *  @constructor
 */

 function Channel(name) {
    this.name = name;
    this.createdOn = new Date();
    this.createdBy = currentLocation.what3words;
    //this.starred = false;
    //this.expiresIn = 15;
    //this.messageCount = 20;
    this.messages = [];
 }

 function createChannel() {
     
    var textLength = $('#message-input').val().length;
    var hashtag = ($('#message-input').val().startsWith('#'));
    var spaces = $('#message-input').val().contains(' ');

    if (textLength > 0 && hashtag >= 0 && spaces <= 0) {
        var newChannel = new Channel($('#channel-input').val());
        currentChannel = newChannel;
        console.log('New channel created ', currentChannel);

    } else {
        alert("Please check your input");
        console.log("No new channel created");
    }
 }

 