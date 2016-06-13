(function(window) {
    'use strict';

    var
        location = window.location,
        document = window.document,
        head = document.head || document.getElementsByTagName('head')[0],
        body = document.body,
        docElem = document.documentElement,

        HeaderABC = {};

    HeaderABC.template = '<a href="#" class="hamburger-menu"><span class="icon">=</span></a>' +
                        '<ul class="predefine-actions">' +
                            '<li>UserName</li>' +
                            '<li><a href="#">Logout</a></li>' +
                        '</ul>';
    var cssArray = [
        '#HeaderABC', '{ width: 100%; height: 40px; over }',
        '#HeaderABC .hamburger-menu', '{ text-decoration: none; }',
        '#HeaderABC .hamburger-menu .icon', '{ color: red; }',
        '#HeaderABC .predefine-actions', '{ float: right; }',
        '#HeaderABC .predefine-actions li', '{ float: left; margin: 0 0 0 10px; }',
        '#HeaderABC .predefine-actions li a', '{ text-decoration: none;}',
        '#HeaderABC .clearfix:before', '{ content: " "; display: table; }',
        '#HeaderABC .clearfix:after', '{ content: " "; display: table; clear: both; }'
    ];

    document.addEventListener("DOMContentLoaded", function (event) {
        var body = document.body;
        // generate html
        HeaderABC.element = document.createElement('div');
        HeaderABC.element.id = 'HeaderABC';
        HeaderABC.element.className = 'clearfix';
        HeaderABC.element.innerHTML = HeaderABC.template;
        debugger;
        body.insertBefore(HeaderABC.element, body.children[0]);

        // generate stylesheet
        HeaderABC.styleSheet = document.createElement('style');
        HeaderABC.styleSheet.type = 'text/css';
        HeaderABC.css = cssArray.join();

        if (HeaderABC.styleSheet.styleSheet) {
            HeaderABC.styleSheet.styleSheet.cssText = HeaderABC.css;
        } else {
            HeaderABC.styleSheet.appendChild(document.createTextNode(HeaderABC.css));
        }

        head.appendChild(HeaderABC.styleSheet);
    });

})(window);