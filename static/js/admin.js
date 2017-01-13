
var Admin = function (App) {

    var usersList = [];
    var testExplosion;

    function init(){  
        App.init();
        showConfig();
        getUsers();  
       
        testExplosion = Explosion.init({canvasId: 'test-canvas'});

        loadEvents();
    };

    function showContent(){ 
        $('#config').hide();
        $('#edit').show();  
        App.showContent();
    };

    function showConfig(){  
        $('#config').show();
        $('#edit').hide();  
        App.hideContent(); 
    };

    function displayAll() {
        showContent();
        App.displayAll();
    }

    /*-------------------------------------*/
    /*-------------------------------------*/

    function loadEvents() {
        $('#button-valid').click(function() {
            saveScore();
        });

        $('#button-test-explosion').click(function() {
            testExplosion.explode();
        });

        $('#button-upload').click(function (e) {

            var data = new FormData();
            data.append('usersFile', $('#usersFile')[0].files[0]);

            $.ajax({
                url: '/users',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data){
                    getUsers(); 
                }
            });
        });

        $('#club-picker').change(function(){
            var value = $(this).val();
            if(!value) {
                return;
            }
            $('#user-picker').empty();
            $('#user-picker').append($("<option></option>").attr("value", '').text(''));
            _.filter(usersList, {club: value}).forEach(function(user) {
                $('#user-picker').append($("<option></option>").attr("value", user.id).text(user.name.first + ' ' + user.name.last));
            });
            $('#user-picker').selectpicker('refresh');
        });
    }

    function saveScore() {
        var userId = $('#user-picker').val();
        var seconds = $('#input-seconds').val();
        var subSeconds = $('#input-subseconds').val();
        var error = false;
        if(userId === '') {
            $('button[data-id="user-picker"]').css('background-color', '#ff7777');
            error = true;       
        } else {
            $('button[data-id="user-picker"]').css('background-color', 'white');     
        }

        if(!isNaN(seconds)) {
            $('#input-seconds').css('background-color', '#ff7777');
            error = true;       
        } else {
            $('#input-seconds').css('background-color', 'white');            
        }

        if(!isNaN(subSeconds)) {
            $('#input-subseconds').css('background-color', '#ff7777');
            error = true;       
        } else {
            $('#input-subseconds').css('background-color', 'white');            
        }

        if(error) {
            return;
        }

        var time = (seconds + 0.01 * subSeconds) * 1000;
        $.post( '/admin/users/result', {userId: userId, time: time}, 
        function( data ) {
            var userId = $('#user-picker').val(null);
            var second = $('#input-seconds').val(null);
            var subSeconds = $('#input-subseconds').val(null);
        });
    }

    function getUsers() {
        $.ajax({
        url: '/admin/users',
            success: function(data){
                usersList = data;                
                loadClubs();
                displayUsersList(); 
            }
        });            
    }

    function checkValue(value) {
        return value ? value : '';
    }

    function displayUsersList() {

        var list = $('#users tbody');
        list.empty();
        usersList.forEach(function(user) {
            var excellenceIcon = user.excellence ? 'ok' : 'remove';
            list.append('<tr>'+
                        '	<td>' + checkValue(user.licence) + '</td>'+
                        '	<td>' + checkValue(user.name.last) + '</td>'+
                        '	<td>' + checkValue(user.name.first) + '</td>'+
                        '	<td>' + checkValue(user.category) + '</td>'+
                        '	<td>' + checkValue(user.type) + '</td>'+
                        '	<td>' + checkValue(user.club) + '</td>'+
                        '	<td>' + checkValue(user.city) + '</td>'+
                        '	<td>' + checkValue(user.team) + '</td>'+
                        '	<td><span class="glyphicon glyphicon-'+excellenceIcon+'"></span></td>'+
                        '	<td>' + checkValue(user.time) + '</td>'+
                        '</tr>');
        });
        $('#users .title').text('Elèves ('+ usersList.length +')');
    };

    function loadClubs() {
        var clubs = _.uniq(_.pluck(usersList, 'club')).forEach(function(club) {
            $('#club-picker').append($("<option></option>").attr("value", club).text(club));
        });
        $('#club-picker').selectpicker('refresh');
    }

    return {
        init: init,
        showContent: showContent,
        showConfig: showConfig,
        displayAll: displayAll
    };
} (App || {});
