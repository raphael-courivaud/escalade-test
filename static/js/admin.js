
var Admin = function (App) {

    var usersList = [];
    var explosion;

    function init(){  
        App.init();
        displayAll();
        getUsers();  
       
        explosion = Explosion.init({canvasId: 'explosion-canvas'});

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

    function displayEtabWomen() {
        showContent();
        App.displayEtabWomen();
    }

    function displayEtabMen() {
        showContent();
        App.displayEtabMen();
    }

    function displayExcelWomen() {
        showContent();
        App.displayExcelWomen();
    }

    function displayExcelMen() {
        showContent();
        App.displayExcelMen();
    }

    /*-------------------------------------*/
    /*-------------------------------------*/

    function loadEvents() {
        $('#button-valid').click(function() {
            saveScore();
        });

        $('#button-test-explosion').click(function() {
            explosion.explode();
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
            var club = $(this).val();
            if(club === '') {
                return;
            }

            var type = $('#type-picker').val();
            if(type === '') {
                return;
            }

            $('#user-picker').empty();
            $('#user-picker').append($("<option></option>").attr("value", '').text(''));
            _.filter(usersList, {club: club}).forEach(function(user) {
                $('#user-picker').append($("<option></option>").attr("value", user._id).text(user.name.first + ' ' + user.name.last));
            });
            $('#user-picker').selectpicker('refresh');
        });


        $('#input-seconds').bind("input", function() {
            var $this = $(this);
            setTimeout(function() {
                if ( $this.val().length >= parseInt($this.attr("maxlength"),10) )
                    $this.next("input").focus();
            },0);
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

        if(seconds === '' || isNaN(seconds)) {
            $('#input-seconds').css('background-color', '#ff7777');
            error = true;       
        } else {
            $('#input-seconds').css('background-color', 'white');            
        }

        if(subSeconds === '' || isNaN(subSeconds)) {
            $('#input-subseconds').css('background-color', '#ff7777');
            error = true;       
        } else {
            $('#input-subseconds').css('background-color', 'white');            
        }

        if(error) {
            return;
        }

        var time = (seconds + (0.1 * subSeconds)) * 100;
        $.ajax({
            url: '/admin/users/result', 
            data : JSON.stringify({userId: userId, time: time}),
            contentType : 'application/json',
            type : 'POST',
            success: function() {
                $('#user-picker').val('');
                $('#user-picker').selectpicker('refresh');
                $('#input-seconds').val(null);
                $('#input-subseconds').val(null);
            }
        });
    }

    function getUsers() {
        $.ajax({
        url: '/admin/users',
            success: function(data){
                usersList = data;    
                displayUsersList();
                loadClubs(); 
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
                        '	<td>' + checkValue(user.club) + '</td>'+
                        '	<td>' + checkValue(user.city) + '</td>'+
                        '	<td>' + checkValue(user.team) + '</td>'+
                        '	<td><span class="glyphicon glyphicon-'+excellenceIcon+'"></span></td>'+
                        '	<td>' + checkValue(user.time/1000) + '</td>'+
                        '</tr>');
        });
        $('#users .title').text('Elèves ('+ usersList.length +')');
    };

    function loadClubs(type) {
        $('#club-picker option').remove();
        var clubs = _.uniq(_.pluck(_.filter(usersList), 'club')).sort().forEach(function(club) {
            $('#club-picker').append($("<option></option>").attr("value", club).text(club));
        });
        $('#club-picker').selectpicker('refresh');
    }

    return {
        init: init,
        showContent: showContent,
        showConfig: showConfig,
        displayAll: displayAll,
        displayEtabWomen: displayEtabWomen,
        displayEtabMen: displayEtabMen,
        displayExcelWomen: displayExcelWomen,
        displayExcelMen: displayExcelMen
    };
} (App || {});
