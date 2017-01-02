
var Admin = function (App) {

    var users = [];

    function init(){  
        App.init();
        showConfig();
        getUsers();  

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
                    alert(data);
                }
            });
        });
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

    function getUsers() {
        $.ajax({
        url: '/admin/users',
            success: function(data){
                users = data;
                displayUsersList(); 
            }
        });            
    }

    function displayUsersList() {

        var list = $('#users tbody');
        list.empty();
        users.forEach(function(user) {
            var excellenceIcon = user.excellence ? 'ok' : 'remove';
            var time = user.time ? user.time : '';
            list.append('<tr>'+
                        '	<td>' + user.licence + '</td>'+
                        '	<td>' + user.name.last + '</td>'+
                        '	<td>' + user.name.first + '</td>'+
                        '	<td>' + user.category + '</td>'+
                        '	<td>' + user.type + '</td>'+
                        '	<td>' + user.club + '</td>'+
                        '	<td>' + user.city + '</td>'+
                        '	<td>' + user.team + '</td>'+
                        '	<td><span class="glyphicon glyphicon-'+excellenceIcon+'"></span></td>'+
                        '	<td>' + time + '</td>'+
                        '</tr>');
        });
    };

    // admin
    var users = [];

    return {
        init: init,
        showContent: showContent,
        showConfig: showConfig,
        displayAll: displayAll,
    };
} (App || {});
