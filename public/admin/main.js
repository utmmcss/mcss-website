/* This is some REALLY bad code that was written at 1am
*
* I recommend you cover your eyes if you want to remain sane
* */

function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log(token, user)
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...


        alert('Unable to login!')
    });
}

function signout(silent) {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.

        console.log('Logged out!')

        if (!silent) {
            alert('You have been signed out')
        }

    }, function(error) {
        // An error happened.
        console.log('Could\'t logout')

        alert('Couldn\'t signout')
    });
}

function addEvent() {

    /*
    *
        *     name
    *     location
    *     description
    *     time/date
    *     link*/

    if ($('#name').val() != '' && $('#timedate').val() != '') {
        var data = {
            'name': $('#name').val(),
            'location': $('#location').val(),
            'description': $('#description').val(),
            'timestamp': new Date($('#timedate').val()).getTime(),
            'link': $('#link').val()
        };

        console.log(data);

        var db = firebase.firestore();

        db.collection('events').add(data).then(function () {
            alert('Event has been added!');
            location.reload();
        }).error(function () {
            alert('Unable to add event.');
        });
    } else {
        alert('Mandatory field not filled!');
    }
}

function populateEventManagement() {
    /*
    *
    *
    * */

    var outHTML = '';

    var db = firebase.firestore();
    db.collection('events').get().then(function (snapshot) {

        var rawEvents = snapshot.docs.map(doc => {
            return [doc.id, doc.data()];
        });

        console.log(rawEvents)

        for (var i in rawEvents) {
            var e = rawEvents[i][1];

            outHTML += '<li class="list-group-item">' +
                '<b>Name:</b>' + e['name'] +'<br>' +
                '<b>Date: </b>' + new Date(e['timestamp']).toString() + '<br>' +
                '<b>ID: </b>' + rawEvents[i][0] + '<br>' +
                '<button id="' + rawEvents[i][0] + '" class="btn btn-danger delete">Delete</button></li>'
        }

        $('#event-management').html(outHTML);

    });

}

function deleteEvent(eID) {
    var confirmation = prompt('Are you sure you want to delete the event with ID ' + eID + '? Type "YES" to confirm.')

    if (confirmation == 'YES') {

        var db = firebase.firestore();

        db.collection('events').doc(eID).delete().then(function () {
           alert('Event deleted!');
           location.reload();
        }).error(function () {
            alert('Unable to delete event.');
        });

    } else {
        alert('Action aborted.');
    }

}

$(document).ready(function () {

    $('body').on('click', '.delete', function () {
        deleteEvent($(this).attr("id"));
    });

});

firebase.auth().onAuthStateChanged(function(user) {

    var db = firebase.firestore();
    db.collection('users').doc('admin').get().then(function (snapshot) {

        var validUID = snapshot.data()['uids'];
        if (user && validUID.indexOf(user.uid) != -1) {
            sessionStorage.token = user.ra;

            $('#logged-in').css('display', 'inline-block');
            $('#not-logged-in').css('display', 'none');


            populateEventManagement();

        } else { // Just kick the user if they're not an admin. If they bypass this it's just a UI thing.
            sessionStorage.token = '';

            $('#not-logged-in').css('display', 'inline-block');
            $('#logged-in').css('display', 'none');
            // logged out

            signout(true);

            if (user && validUID.indexOf(user.uid) == -1) {
                alert('You don\'t have permission to access this page!')
            }
        }

    });

});


$(document).ready(function () {
    $('#login').click(login);
    $('#signout').click(signout);
    $('#addevent').click(addEvent);
});