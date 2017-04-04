
var App = function () {

    var HOST = location.origin.replace(/^http/, 'ws');
    var socket = io(HOST);

    var tableMap = {
        collegeEtabMen: 'college-etab-men',
        collegeEtabWomen: 'college-etab-women',
        collegeExcelMen: 'college-excel-men',
        collegeExcelWomen: 'college-etab-women',
        lyceeEtabMen: 'lycee-etab-men',
        lyceeEtabWomen: 'lycee-etab-women',
        lyceeExcelMen: 'lycee-excel-men',
        lyceeExcelWomen: 'lycee-etab-women',
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
                            '	<td>' + checkValue(user.time/1000)  + '</td>'+
                            '	<td>' + checkValue(user.score) + '</td>'+
                        '</tr>');
            });
    }

    function displayCollegeEtabWomen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Collège Etablissement filles');

        socket.removeAllListeners();
        socket.on('college-etab-women', function(users) {
            console.log('college-etab-women ' + users.length + ' updated')
            displayUsers('single-category', users)
        });
        socket.emit('get-college-etab-women');

    }

    function displayCollegeEtabMen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Collège Etablissement garçons');

        socket.removeAllListeners();
        socket.on('college-etab-men', function(users) {
            displayUsers('single-category', users)
        });
        socket.emit('get-college-etab-men');
    }

    function displayCollegeExcelWomen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Collège Excellence filles');

        socket.removeAllListeners();
        socket.on('college-excel-women', function(users) {
            console.log('college-excel-women ' + users.length + ' updated')
            displayUsers('single-category', users)
        });
        socket.emit('get-college-excel-women');

    }

    function displayCollegeExcelMen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Collège Excellence garçons');

        socket.removeAllListeners();
        socket.on('college-excel-men', function(users) {
            displayUsers('single-category', users)
        });
        socket.emit('get-college-excel-men');
    }

    function displayLyceeEtabWomen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Lycée Etablissement filles');

        socket.removeAllListeners();
        socket.on('lycee-etab-women', function(users) {
            console.log('lycee-etab-women ' + users.length + ' updated')
            displayUsers('single-category', users)
        });
        socket.emit('get-lycee-etab-women');

    }

    function displayLyceeEtabMen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Lycée Etablissement garçons');

        socket.removeAllListeners();
        socket.on('lycee-etab-men', function(users) {
            displayUsers('single-category', users)
        });
        socket.emit('get-lycee-etab-men');
    }

    function displayLyceeExcelWomen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Lycée Excellence filles');

        socket.removeAllListeners();
        socket.on('lycee-excel-women', function(users) {
            console.log('lycee-excel-women ' + users.length + ' updated')
            displayUsers('single-category', users)
        });
        socket.emit('get-lycee-excel-women');

    }

    function displayLyceeExcelMen() {
        $('#all-categories').hide();
        $('#single-category').show();
        $('#single-category .title').text('Lycée Excellence garçons');

        socket.removeAllListeners();
        socket.on('lycee-excel-men', function(users) {
            displayUsers('single-category', users)
        });
        socket.emit('get-lycee-excel-men');
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
        displayCollegeEtabWomen: displayCollegeEtabWomen,
        displayCollegeEtabMen: displayCollegeEtabMen,
        displayCollegeExcelWomen: displayCollegeExcelWomen,
        displayCollegeExcelMen: displayCollegeExcelMen,
        displayLyceeEtabWomen: displayLyceeEtabWomen,
        displayLyceeEtabMen: displayLyceeEtabMen,
        displayLyceeExcelWomen: displayLyceeExcelWomen,
        displayLyceeExcelMen: displayLyceeExcelMen
    };

} ();