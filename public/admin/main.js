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

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
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

        var img = $('#imageUpload')[0].files[0];
        var rawFileName = $('#imageUpload').val().split('/');
        var uploadImageName = '';

        if (img) {

            uploadImageName = uuidv4();
            console.log(img);

            var reader = new FileReader();
            reader.readAsDataURL(img);

            reader.onload = function(e) {

                console.log('Upload file!', e.target);

                var storageRef = firebase.storage().ref();
                var imgRef = storageRef.child(uploadImageName);

                imgRef.putString(e.target.result.toString().substr(22), 'base64').then(function(snapshot) {
                    console.log('Uploaded a blob or file!', snapshot);

                    storageRef.child(uploadImageName).getDownloadURL().then(function(url) {

                        data['image'] = url;
                        console.log('IMG URL IS', url);

                        addEventToDB(data);

                    });
                });
            };

        } else {
            addEventToDB(data);
        }
    } else {
        alert('Mandatory field not filled!');
    }
}

function addEventToDB(data) {
    var db = firebase.firestore();

    db.collection('events').add(data).then(function (snapshot) {

        alert('Event has been added!');
        location.reload();

    });
}

function populateEventManagement() {
    /*
    *
    *
    * */

    var outHTML = '';

    var db = firebase.firestore();

    db.collection('settings').doc('events').get().then(function (snapshot) {

        var featuredEventID = snapshot.data()['featured'];

        if (!featuredEventID) {
            $('#clearFeaturedEvent').hide();
        }

        db.collection('events').get().then(function (snapshot) {

            var rawEvents = snapshot.docs.map(doc => {
                return [doc.id, doc.data()];
            });

            console.log(rawEvents);

            for (var i in rawEvents) {
                var e = rawEvents[i][1];

                outHTML += '<li class="list-group-item">' +
                    (rawEvents[i][0] == featuredEventID ? '<b>FEATURED EVENT!</b><br>' : '') +
                    '<b>Name:</b>' + e['name'] + '<br>' +
                    '<b>Date: </b>' + new Date(e['timestamp']).toString() + '<br>' +
                    '<b>ID: </b>' + rawEvents[i][0] + '<br>' +
                    '<button id="' + rawEvents[i][0] + '" class="btn btn-danger delete">Delete</button>' +
                    '<button id="' + rawEvents[i][0] + '" class="btn btn-warning feature" style="margin-left: 4px">Feature</button></li>'
            }

            $('#event-management').html(outHTML);

        });
    });

}

function featureEvent(eID) {
    var confirmation = prompt('Are you sure you want to feature the event with ID ' + eID + '? Type "YES" to confirm.')

    if (confirmation == 'YES') {

        var db = firebase.firestore();

        db.collection('settings').doc('events').set({'featured': eID}).then(function () {
            alert('Event featured!');
            location.reload();
        });

    } else {
        alert('Action aborted.');
    }
}

function clearFeaturedEvent() {
    var confirmation = prompt('Are you sure you want to clear the featured event? Type "YES" to confirm.')

    if (confirmation == 'YES') {

        var db = firebase.firestore();

        db.collection('settings').doc('events').set({'featured': ''}).then(function () {
            alert('Featured event cleared!');
            location.reload();
        });

    } else {
        alert('Action aborted.');
    }
}

function deleteEvent(eID) {
    var confirmation = prompt('Are you sure you want to delete the event with ID ' + eID + '? Type "YES" to confirm.')

    if (confirmation == 'YES') {

        var db = firebase.firestore();

        db.collection('events').doc(eID).delete().then(function () {
           alert('Event deleted!');
           location.reload();
        });

    } else {
        alert('Action aborted.');
    }

}

$(document).ready(function () {

    $('body').on('click', '.delete', function () {
        deleteEvent($(this).attr("id"));
    });

    $('body').on('click', '.feature', function () {
        featureEvent($(this).attr("id"));
    });

});

firebase.auth().onAuthStateChanged(function(user) {

    firebase.auth().currentUser.getIdTokenResult(true) // 1
        .then((idTokenResult) => {
            if (idTokenResult.claims.admin) {
                sessionStorage.token = user.ra;

                $('#logged-in').css('display', 'inline-block');
                $('#not-logged-in').css('display', 'none');


                populateEventManagement();
            } else {
                sessionStorage.token = '';

                $('#not-logged-in').css('display', 'inline-block');
                $('#logged-in').css('display', 'none');
                // logged out

                signout(true);

                if (user && validUID.indexOf(user.uid) == -1) {
                    alert('You don\'t have permission to access this page!')
                }
            }
        })
        .catch((error) => {
            console.log(error);
            alert('You don\'t have permission to access this page!')
        });

});


$(document).ready(function () {
    $('#login').click(login);
    $('#signout').click(signout);
    $('#addevent').click(addEvent);
    $('#clearFeaturedEvent').click(clearFeaturedEvent);
});