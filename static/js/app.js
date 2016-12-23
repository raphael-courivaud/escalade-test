var HOST = location.origin.replace(/^http/, 'ws');
var socket = io(HOST);

function loadUsers(type) {
    socket.on('users', function(users) {
        var list = $('#college-fille tbody');
        list.empty();
        users.forEach(function(user) {
            list.append('<tr>'+
                        '	<td>' +user.firstName+ '</td>'+
                        '	<td>' +user.lastName+ '</td>'+
                        '	<td>' +user.bestTime+ '</td>'+
                        '</tr>');
        });
    });
}

function displayUsers(location, users) {
    var list = $(location);
    list.empty();
    var position = 1;
    users.forEach(function(user) {

        list.append('<tr>'+
                    '	<td>' + position++ + '</td>'+
                    '	<td>' + user.firstName + '</td>'+
                    '	<td>' + user.lastName + '</td>'+
                    '	<td>' + user.bestTime + '</td>'+
                    '</tr>');
    });
}

function displayCollegeWomen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Collège filles');

    socket.removeAllListeners();
    socket.on('college-women', function(users) {
        displayUsers('#single-category tbody', users)
    });
    socket.emit('get-college-women');

}

function displayCollegeMen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Collège garçons');

    socket.on('college-men', function(users) {
        displayUsers('#single-category tbody', users)
    });
    socket.emit('get-college-men');
}

function displayEliteWomen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Elite filles');

    socket.on('elite-women', function(users) {
        displayUsers('#single-category tbody', users)
    });
    socket.emit('get-elite-women');
}

function displayEliteMen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Elite garçons');

    socket.on('elite-men', function(users) {
        displayUsers('#single-category tbody', users)
    });
    socket.emit('get-elite-men');
}

function displayCustomWomen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Aménagée filles');

    socket.on('custom-men', function(users) {
        displayUsers('#single-category tbody', users)
    });
    socket.emit('get-custom-men');
}

function displayCustomMen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Aménagée garçons');

    socket.on('custom-men', function(users) {
        displayUsers('#single-category tbody', users)
    });
    socket.emit('get-custom-men');
}

function displayAll() {
    $('#single-category').hide();
    $('#all-categories').show();

    socket.on('all', function(users) {
        displayUsers('#single-category tbody', users)
    });
    socket.emit('get-all');
}


$('#add-button').click(function () {
    var firstName = $('#first-name').val();  
        lastName = $('#last-name').val();  
        bestTime = $('#best-time').val();  

    socket.emit('add-user', {
        firstName:firstName, 
        lastName:lastName, 
        bestTime:bestTime
        });
})