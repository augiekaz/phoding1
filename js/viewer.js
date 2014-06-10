// Copyright Â© 2014 John Watson
// All rights reserved

var _EXAMPLEWIDTH = 848;
var _EXAMPLEHEIGHT = 450;

var _PHASERVERSION = "2.0.4";

var mechanics = null;
var game = null;
var currentExample = null;

function loadExamples() {
    $('#spinner').show();
    $('#source').hide();

    $('#mechanic').empty();
    $('#mechanic').append('<option value="-1">Choose...</option>');

    $.get('examples.json')
        .success(function(data) {
            mechanics = data;

            var hash = window.location.hash || '';
            var slug = '';
            var example = 0;
            var total = 0;
            if (hash !== '') {
                var parts = hash.split('-');
                slug = parts[0].substr(1);
                example = Math.floor(parts[1]) - 1;
            }

            var categories = { 'mechanic': 'Mechanics', 'effect': 'Effects' };
            for (var cat in categories) {
                var optgroup = $('<optgroup></optgroup>');
                optgroup.attr('label', categories[cat]);

                for(var i = 0; i < mechanics.length; i++) {
                    var m = mechanics[i];
                    if (m.category === cat) {
                        var opt = $('<option></option>');
                        opt.attr('value', i);
                        opt.text(m.name);
                        total += m.examples.length;
                        if (m.slug === slug) opt.attr('selected', 'selected');
                        optgroup.append(opt);
                    }
                }

                $('#mechanic').append(optgroup);
            }
            selectMechanic(example);
        })
        .always(function() { $('#spinner').hide(); });
}

function selectMechanic(n) {
    $('#example-list').empty();

    if (n === undefined) n = 0;

    if (mechanics[$('#mechanic').val()] === undefined) {
        // NOP
    } else {
        var mechanic = mechanics[$('#mechanic').val()];
        var examples = mechanic.examples;

        for(var i = 0; i < examples.length; i++) {

            var ex = examples[i];
            var item = $('<li></li>');
            var link = $('<a></a>').html(ex.name);
            link.attr('href', '#');
            link.attr('onclick', 'return selectExample(' + i + ');');
            item.append(link);
            $('#example-list').append(item);
        }

       

        if (examples[n] === undefined) n = 0;
    }

    selectExample(n);

    return false;
}

function selectExample(n) {
    $('#spinner').show();
    $('#source').hide();

    if (n === undefined) n = 0;

    var mechanic;
    var example;

    if (game !== undefined && game !== null && game.destroy !== undefined && typeof game.destroy === 'function') {
        game.destroy();
        game = null;
    }

    $('#webgl-warning').hide();

    if (mechanics[$('#mechanic').val()] === undefined) {
        $('#spinner').hide();

        currentExample = null;

        var w = $(window).width();
        if (w < 970) {
            $('#name').html('');
        } else {
            $('#name').html('<ul class="breadcrumb"><li> Choose an example to get started.</li></ul>');
            $('#name .breadcrumb').css({ backgroundColor: '#ffc' })
                .animate({ backgroundColor: '#f5f5f5' }, 1000)
                .animate({ backgroundColor: '#ffc' }, 1000)
                .animate({ backgroundColor: '#f5f5f5' }, 1000)
                .animate({ backgroundColor: '#ffc' }, 1000)
                .animate({ backgroundColor: '#f5f5f5' }, 1000);
        }

        //$('#description').html('<img src="assets/welcome.png" src="Welcome to Game Mechanic Explorer!" class="img-responsive">');

        $('#content h3').hide();

        $('#example-container').empty();

        window.location.hash = '';
    } else {
        $('#example-container').empty();
        $('#example-container').append($('<div id="game"></div>'));

        $('#content h3').show();

        mechanic = mechanics[$('#mechanic').val()];
        example = mechanic.examples[n];

        currentExample = example;

        window.location.hash = mechanic.slug + '-' + (n + 1);

        $('#example-list li').each(function(i, e) {
            if (i == n) {
                $(e).addClass('active');
            } else {
                $(e).removeClass('active');
            }
        });

        if (example.name !== undefined) {
            $('#name').html('<ul class="breadcrumb"><li>' + mechanic.name + '</li><li>' + example.name + '</li></ul>');
        } else {
            $('#name').html('');
        }

        if (example.description !== undefined) {
            $('#description').html(example.description);
        } else {
            $('#description').html('');
        }
    }

    if (example !== undefined) {
        $.getScript('source/' + example.script)
            .success(function(script) {
                // Replace _EXAMPLEWIDTH and _EXAMPLEHEIGHT so the examples can be
                // copied and run with no modifications necessary.
                script = script.replace('_EXAMPLEWIDTH', _EXAMPLEWIDTH);
                script = script.replace('_EXAMPLEHEIGHT', _EXAMPLEHEIGHT);
                script = "// This example uses the Phaser " + _PHASERVERSION + " framework\n\n" + script;
                $('#source').show();
                $('#source code').html(script);
                Prism.highlightAll();

                setTimeout(windowResize, 1000);
                setTimeout(checkRenderer, 1000);

                var location = window.location.pathname +
                    window.location.search +
                    window.location.hash;
               // ga('send', 'pageview', location);
            })
            .always(function() { $('#spinner').hide(); });
    }

    return false;
}

function windowResize() {
    var w = $(window).width();
    if (w < 970 && $('#bottom').children().length === 0) {
        $('#about').appendTo($('#bottom'));
    } else if (w >= 970 && $('#bottom').children().length !== 0) {
        $('#about').appendTo($('#leftcolumn'));
    }

    if (game) {
        game.scale.maxWidth = _EXAMPLEWIDTH;
        game.scale.maxHeight = _EXAMPLEHEIGHT;
        game.scale.setScreenSize();
        game.scale.setShowAll();
        game.scale.refresh();
    }
}

function checkRenderer() {
    $('#webgl-warning').hide();
    if (game && currentExample && currentExample.webgl && game.renderer instanceof PIXI.CanvasRenderer) {
        $('#webgl-warning').show();
    }
}

$(document).ready(
    function() {
        loadExamples();

        $('#show-more').click(function() {
            $('#more-info').show();
            $('#show-more').hide();
            return false;
        });

        $('#hide-more').click(function() {
            $('#more-info').hide();
            $('#show-more').show();
            return false;
        });

        windowResize();
    }
);



