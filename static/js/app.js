
var App = function () {

    var HOST = location.origin.replace(/^http/, 'ws');
    var socket = io(HOST);

    var tableMap = {
        etabMen: 'etab-men',
        etabWomen: 'etab-women',
        excelMen: 'excel-men',
        excelWomen: 'excel-women',
        mixed: 'mixed',
    }

    function init() {

        displayAll();


        explosion = Explosion.init({canvasId: 'explosion-canvas'});
        socket.on('explosion', function() {
            explosion.explode();
        });
    }
    
    function showContent(){ 
        $('#content').show();
    };
    
    function hideContent(){ 
        $('#content').hide();
    };

    function displayAllUsers(data) {
        _.forEach(data, function(value, key) {
            displayUsers(key, value);
        })
    };

    function checkValue(value) {
        return value ? value : '';
    }

    function displayUsers(selector, users) {

            var position = 1;

            var list = $('#' + selector + ' tbody');
            list.empty();

            users.forEach(function(user) {
                list.append('<tr>'+
                            '	<td>' + position++ + '</td>'+
                            '	<td>' + checkValue(user.name.last)+ ' ' + checkValue(user.name.first[0]) + '. </td>'+
                            '	<td>' + checkValue(Number((user.time/1000).toFixed(2)))  + '</td>'+
                            '	<td>' + checkValue(user.score) + '</td>'+
                        '</tr>');
            });
    }

    function displayEtabWomen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Etablissement filles');

        socket.removeAllListeners();
        socket.on('etab-women', function(users) {
            console.log('etab-women ' + users.length + ' updated')
            displayUsers('single-category', users)
        });
        socket.emit('get-etab-women');

    }

    function displayEtabMen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Etablissement garçons');

        socket.removeAllListeners();
        socket.on('etab-men', function(users) {
            displayUsers('single-category', users)
        });
        socket.emit('get-etab-men');
    }

    function displayExcelWomen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Excellence filles');

        socket.removeAllListeners();
        socket.on('excel-women', function(users) {
            console.log('excel-women ' + users.length + ' updated')
            displayUsers('single-category', users)
        });
        socket.emit('get-excel-women');

    }

    function displayExcelMen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Excellence garçons');

        socket.removeAllListeners();
        socket.on('excel-men', function(users) {
            displayUsers('single-category', users)
        });
        socket.emit('get-excel-men');
    }

    function precessScores(users) {
        if(users.length === 0) {
            return;
        };
        var bestTime = users[0].time;
        users.slice(1, users.length).forEach(function(user) {
            
        });

    }

    function displayAll() {
        $('#single-category').hide();
        $('#all-categories').show();

        socket.on('all', function(data) {
            displayAllUsers(data)
        });
        socket.emit('get-all');
    }

    return {
        init: init,
        showContent: showContent,
        hideContent: hideContent,
        displayAll: displayAll,
        displayEtabWomen: displayEtabWomen,
        displayEtabMen: displayEtabMen,
        displayExcelWomen: displayExcelWomen,
        displayExcelMen: displayExcelMen
    };

} ();