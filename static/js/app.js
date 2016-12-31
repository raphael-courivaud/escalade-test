var HOST = location.origin.replace(/^http/, 'ws');
var socket = io(HOST);

var tableMap = {
    collegeMen: 'college-men',
    collegeWomen: 'college-women',
    eliteMen: 'elite-men',
    eliteWomen: 'elite-women',
    customMen: 'custom-men',
    customWomen: 'custom-women',
}

displayAll();

function displayAllUsers(data) {
    _.forEach(data, function(value, key) {
        displayUsers(tableMap[key], value);
    })
};

function displayUsers(selector, users) {

        var position = 1;

        var list = $('#' + selector + ' tbody');
        list.empty();

        users.forEach(function(user) {

            list.append('<tr>'+
                        '	<td>' + position++ + '</td>'+
                        '	<td>' + user.lastName+ ' ' + user.firstName[0]+ '. </td>'+
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
        displayUsers('single-category', users)
    });
    socket.emit('get-college-women');

}

function displayCollegeMen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Collège garçons');

    socket.on('college-men', function(users) {
        displayUsers('single-category', users)
    });
    socket.emit('get-college-men');
}

function displayEliteWomen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Elite filles');

    socket.on('elite-women', function(users) {
        displayUsers('single-category', users)
    });
    socket.emit('get-elite-women');
}

function displayEliteMen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Elite garçons');

    socket.on('elite-men', function(users) {
        displayUsers('single-category', users)
    });
    socket.emit('get-elite-men');
}

function displayCustomWomen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Aménagée filles');

    socket.on('custom-men', function(users) {
        displayUsers('single-category', users)
    });
    socket.emit('get-custom-men');
}

function displayCustomMen() {
    $('#all-categories').hide();
    $('#single-category').show();
    $('#single-category .title').text('Aménagée garçons');

    socket.on('custom-men', function(users) {
        displayUsers('single-category', users)
    });
    socket.emit('get-custom-men');
}

function displayAll() {
    $('#single-category').hide();
    $('#all-categories').show();

    socket.on('all', function(data) {
        displayAllUsers(data)
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

// admin
var users = [];
loadUsers();
function loadUsers(type)  {
    $.ajax({
        url: '/admin/users',
        success: function(data){
            users = data;
        }
    });
};

$('#category-picker').change(function(){
    if(!$(this).val()) {
        return;
    }
    $('#user-picker').empty();
    $('#user-picker').append($("<option></option>").attr("value", '').text(''));
    users[$(this).val()].forEach(function(user) {
        $('#user-picker').append($("<option></option>").attr("value", user.id).attr("data-subtext", user.club).text(user.firstName + ' ' + user.lastName));
    });
    $('#user-picker').selectpicker('refresh');
});

$('form select').change(function(){
    var ok = true;
    $('form select, form input').each(function( index ) {
        if(!$( this ).val()) {
            ok = false;
        }
    });
    if(ok) {
        $('#button-valid').show();
    }
    
});

$('form input').on('input',function(e){
    var ok = true;
    $('form select, form input').each(function( index ) {
        console.log($( this ).val());
        if(!$( this ).val()) {
            ok = false;
        }
    });
    if(ok) {
        $('#button-valid').show();
    }
});