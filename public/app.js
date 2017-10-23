'use strict';
var learnjs = {};

learnjs.problems = [
    {
        description: 'What is truth?',
        code: 'function problem () { return __; }'
    },
    {
        description: 'Simple Math',
        code: 'function problem () { return 42 === __; }'
    }
];

learnjs.applyObject = function (obj, elem) {
    for (var key in obj) {
        elem.find('[data-name="' + key + '"]').text(obj[key]);
    }
};

learnjs.template = function (name) {
    return $('.templates .' + name).clone();
};

learnjs.buildCorrectFlash = function (problemNum) {
    var correctFlash = learnjs.template('correct-flash');
    var link = correctFlash.find('a');

    if (problemNum < learnjs.problems.length) {
        link.attr('href', "#problem-" + (problemNum + 1));
    } else {
        link.attr('href', '');
        link.text('You are Finished');
    }

    return correctFlash;
};

learnjs.problemView = function (data) {
    var problemNumber = parseInt(data, 10);
    var view = $('.templates .problem-view').clone();
    var problemData = learnjs.problems[problemNumber - 1];
    var resultFlash = view.find('.result');

    function checkAnswer() {
        var answer = view.find('.answer').val();
        var test = problemData.code.replace('__', answer) + '; problem();';
        return eval(test);
    }

    function checkAnswerClick() {
        if (checkAnswer()) {
            var correctFlash = learnjs.buildCorrectFlash(problemNumber);
            learnjs.flashElement(resultFlash, correctFlash);
        } else {
            learnjs.flashElement(resultFlash, 'Incorrect!');
        }
        return false;
    }

    view.find('.check-btn').click(checkAnswerClick);
    view.find('.title').text('Problem #' + problemNumber);
    learnjs.applyObject(problemData, view);
    return view;
};

learnjs.flashElement = function (elem, content) {
    elem.fadeOut('fast', function () {
        elem.html(content);
        elem.fadeIn();
    });
};

learnjs.showView = function (hash) {
    var routes = {
        '#problem': learnjs.problemView
    };

    var hashParts = hash.split('-');
    var viewFn = routes[hashParts[0]];

    if (viewFn) {
        var view = viewFn(hashParts[1]);
        $('.view-container').empty().append(view);
    }
};

learnjs.appOnReady = function () {
    window.onhashchange = function () {
        learnjs.showView(window.location.hash);
    };

    learnjs.showView(window.location.hash);
};