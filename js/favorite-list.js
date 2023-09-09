const firebaseConfig = {
    apiKey: "AIzaSyAt1O_d0v7s8i7mcXcK2F0a2N8hqsOx684",
    authDomain: "foreignar.firebaseapp.com",
    projectId: "foreignar",
    storageBucket: "foreignar.appspot.com",
    messagingSenderId: "133387199847",
    appId: "1:133387199847:web:2a19f1247b3308be767bc2",
    measurementId: "G-GZJ2PP03NB"
    };
    firebase.initializeApp(firebaseConfig);

    // ユーザーのUIDを取得
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    var uid = user.uid;
    console.log("User UID: " + uid);
    } else {
    console.log("No user is signed in.");
    }}
        
    //favorites-listをリクエスト
    const getFavorites = firebase.functions().httpsCallable('getFavorites');
    getFavorites({}).then(result => {
    console.log(result.data);
    }).catch(error => {
    console.error('Error:', error);
    });

