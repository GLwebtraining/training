(function(window) {
    'use strict';

    var
        location = window.location,
        document = window.document,
        docElem = document.documentElement,

        HeaderABC = {
            define: function() {
                this.head = document.head || document.getElementsByTagName('head')[0];
                this.body = document.body;
                this.firstBodyElement = this.body.children[0];
            },
            generate: {
                html: function() {
                    HeaderABC.element = document.createElement('div');
                    HeaderABC.element.id = 'HeaderABC';
                    HeaderABC.element.className = 'clearfix';
                    HeaderABC.element.innerHTML = HeaderABC.template;
                    HeaderABC.isHtmlGenerated = true;
                },
                css: function() {
                    HeaderABC.styleSheet = document.createElement('style');
                    HeaderABC.styleSheet.type = 'text/css';
                    HeaderABC.css = HeaderABC.cssArray.join('');

                    if (HeaderABC.styleSheet.styleSheet) {
                        HeaderABC.styleSheet.styleSheet.cssText = HeaderABC.css;
                    } else {
                        HeaderABC.styleSheet.appendChild(document.createTextNode(HeaderABC.css));
                    }
                    HeaderABC.isCssGenerated = true;
                }
            },
            applyMarkup: function() {
                if (!!this.isHtmlGenerated && !!this.isCssGenerated) {
                    this.body.insertBefore(HeaderABC.element, this.body.children[0]);
                    this.head.appendChild(HeaderABC.styleSheet);
                }
            },
            template:   '<div class="header-wrapper">' +
                            '<a href="#" class="hamburger-menu"><span class="icon">=</span></a>' +
                            '<ul class="predefine-actions">' +
                                '<li>UserName</li>' +
                                '<li><a href="#">Logout</a></li>' +
                            '</ul>' +
                        '</div>' +
                        '<div id="HeaderABC-SidebarMenu">'+
                        '</div>',
            cssArray: [
                        '#HeaderABC', '{ width: 100%; height: 40px; font: 12px/14px Arial, sans-serif; }',
                        '#HeaderABC .header-wrapper', '{ width: 100%; box-sizing: border-box; padding: 10px 20px; }',
                        '#HeaderABC .hamburger-menu', '{ text-decoration: none; }',
                        '#HeaderABC .hamburger-menu .icon', '{ color: red; }',
                        '#HeaderABC .predefine-actions', '{ float: right; }',
                        '#HeaderABC .predefine-actions li', '{ float: left; margin: 0 0 0 10px; }',
                        '#HeaderABC .predefine-actions li a', '{ text-decoration: none;}',
                        '#HeaderABC .clearfix:before', '{ content: " "; display: table; }',
                        '#HeaderABC .clearfix:after', '{ content: " "; display: table; clear: both; }',
                        '#HeaderABC-SidebarMenu', '{ display: none }'
            ],
            initialize: function() {
                this.generate.html();
                this.generate.css();
                this.applyMarkup();
            }
        };

    document.addEventListener("DOMContentLoaded", function (event) {
        HeaderABC.initialize();
    });

})(window);

(function(){

    'use strict';

    var R = function(){};

    R.defer = function(){
        return new Promise; 
    }

    function Promise() {
        this.promise = {
            callbacks: [],
            then: function () {
                this.callbacks = Array.prototype.slice.call(arguments);
            }
        };
    }

    Promise.prototype = {
        resolve: function() {
            if (!!this.promise.callbacks.length && !!this.promise.callbacks[0] && typeof this.promise.callbacks[0] === 'function') {
                this.promise.callbacks[0]();
            }
        },
        reject: function() {
            if (!!this.promise.callbacks.length && !!this.promise.callbacks[0] && typeof this.promise.callbacks[1] === 'function') {
                this.promise.callbacks[1]();
            }
        }
    }

    window.R = R;

})();
