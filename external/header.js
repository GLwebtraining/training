(function(window) {
    'use strict';

    var
        location = window.location,
        document = window.document,
        docElem = document.documentElement;

    var Utils = defineUtils();

    var HeaderABC = {
            define: function() {
                this.head = document.head || Utils.getElement('head')[0];
                this.body = document.body;
                this.firstBodyElement = this.body.children[0];
                this.isHtmlGenerated = false;
                this.isCssGenerated = false;
                this.sidebarOpened = false;
            },
            generate: {
                html: function() {
                    HeaderABC.element = Utils.createElement('div', {
                        id: 'HeaderABC',
                        className: 'clearfix'
                    });
                    Utils.html(HeaderABC.element, HeaderABC.template);
                    HeaderABC.isHtmlGenerated = true;
                },
                css: function() {
                    HeaderABC.styleSheet = Utils.createElement('style', {
                        type: 'text/css'
                    });
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
                    this.body.insertBefore(HeaderABC.element, this.firstBodyElement);
                    this.head.appendChild(HeaderABC.styleSheet);
                }
            },
            applyEvents: function() {
                var header = Utils.getElement('#HeaderABC');
                var sidebar = Utils.getElement('#HeaderABC-SidebarMenu');
                var overlay = Utils.getElement('#HeaderABC-overlay');
                var hamburgerMenuOpener = Utils.getElement('.hamburger-menu')[0];


                Utils.on(hamburgerMenuOpener, 'click', function() {
                    if (HeaderABC.sidebarOpened) {
                        Utils.removeClass(sidebar, 'opened');
                        Utils.removeClass(overlay, 'opened');
                        Utils.removeClass(HeaderABC.body, 'sidebar-abc-opened');
                        HeaderABC.sidebarOpened = false;
                    } else {
                        Utils.addClass(sidebar, 'opened');
                        Utils.addClass(overlay, 'opened');
                        Utils.addClass(HeaderABC.body, 'sidebar-abc-opened');
                        HeaderABC.sidebarOpened = true;
                    }
                });
            },
            template:   '<div class="header-wrapper">' +
                            '<a href="#" class="hamburger-menu"><span class="icon">=</span></a>' +
                            '<ul class="predefine-actions">' +
                                '<li>UserName</li>' +
                                '<li><a href="#">Logout</a></li>' +
                            '</ul>' +
                        '</div>' +
                        '<div id="HeaderABC-SidebarMenu">' +
                            '<div class="sidebar-wrapper">' +
                                '<ul class="list">' +
                                    '<li><a href="#">Item 1</a></li>' +
                                    '<li><a href="#">Item 2</a></li>' +
                                    '<li><a href="#">Item 3</a></li>' +
                                    '<li><a href="#">Item 4</a></li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                        '<div id="HeaderABC-overlay"></div>',
            cssArray: [
                        'body.sidebar-abc-opened', '{ overflow: hidden }',
                        '#HeaderABC', '{ width: 100%; height: 40px; font: 12px/14px Arial, sans-serif; position: relative; z-index: 9999; }',
                        '#HeaderABC .header-wrapper', '{ width: 100%; box-sizing: border-box; padding: 13px 20px; position: relative; z-index: 11; background: #fff; }',
                        '#HeaderABC .hamburger-menu', '{ text-decoration: none; }',
                        '#HeaderABC .hamburger-menu .icon', '{ color: red; }',
                        '#HeaderABC .predefine-actions', '{ float: right; }',
                        '#HeaderABC .predefine-actions li', '{ float: left; margin: 0 0 0 10px; }',
                        '#HeaderABC .predefine-actions li a', '{ text-decoration: none;}',
                        '#HeaderABC .clearfix:before', '{ content: " "; display: table; }',
                        '#HeaderABC .clearfix:after', '{ content: " "; display: table; clear: both; }',
                        '#HeaderABC-SidebarMenu', '{ display: none; width: 200px; position: fixed; top: 0; right: 0; bottom: 0; left: 0; background: #fff; z-index: 10; }',
                        '#HeaderABC-SidebarMenu.opened', '{ display: block; }',
                        '#HeaderABC-SidebarMenu .sidebar-wrapper', '{ width: 100%; overflow: hidden; padding: 40px 0 0 20px; }',
                        '#HeaderABC-SidebarMenu .sidebar-wrapper .list', '{ margin: 0; padding: 0; list-style: none; }',
                        '#HeaderABC-SidebarMenu .sidebar-wrapper .list li', '{ margin: 0 0 10px; }',
                        '#HeaderABC-overlay', '{ display: none; position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: #000; opacity: 0.5; z-index: 9; }',
                        '#HeaderABC-overlay.opened', '{ display: block; }'
            ],
            initialize: function () {
                this.define();
                this.generate.html();
                this.generate.css();
                this.applyMarkup();
                this.applyEvents();
            }
        };

    function defineUtils() {
        return {
            ready: function (callback) {
                window.document.addEventListener('DOMContentLoaded', function (event) {
                    if (!!callback && typeof callback === 'function') {
                        callback(event);
                    }
                });
            },
            on: function (target, event, handler) {
                if (!target || !event) {
                    return;
                }
                target.addEventListener(event, function (e) {
                    handler(e);
                    e.stopPropagation();
                    e.preventDefault();
                });
            },
            addClass: function (target, className) {
                if (target.classList) {
                    target.classList.add(className);
                } else if (!hasClass(target, className)) {
                    target.className += " " + className;
                }
            },
            removeClass: function (target, className) {
                if (target.classList) {
                    target.classList.remove(className);
                } else if (hasClass(target, className)) {
                    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                    target.className = target.className.replace(reg, ' ');
                }
            },
            hasClass: function (target, className) {
                if (target.classList) {
                    return target.classList.contains(className);
                } else {
                    return !!target.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
                }
            },
            defer: function(){
                return new Promise; 
            },
            ajax: function(settings) {
                var xhr = new XMLHttpRequest();
                xhr.open(settings.method, settings.url, true);
                if (settings.header) {
                    xhr.setRequestHeader(settings.header.name, settings.header.value);
                }
                xhr.onreadystatechange = function () {
                    if (this.readyState != 4) return;
                    if (this.status != 200) {
                        if (!!settings.error && typeof settings.error === 'function') {
                            settings.error({ status: this.status, statusText: this.statusText, headers: xhr.getAllResponseHeaders() });
                        }
                        return;
                    }
                    if (!!settings.success && typeof settings.success === 'function') {
                        settings.success(this.responseText, xhr.getAllResponseHeaders());
                    }
                }
                xhr.send(settings.data || '');
            },
            getElement: function(selector, parentNode) {
                if (selector.indexOf('#') !== -1) {
                    return document.getElementById(selector.substr(selector.indexOf('#') + 1));
                }
                if (selector.indexOf('.') !== -1) {
                    return (parentNode || document).getElementsByClassName(selector.indexOf('.') + 1);
                }
                return document.getElementsByTagName(selector);
            },
            createElement: function(tag, attrs) {
                var element = document.createElement(tag);
                if (!!attrs) {
                    for (var key in attrs) {
                        element[key] = attrs[key];
                    }
                }
                return element;
            },
            html: function(element, html) {
                element.innerHTML = html;
            }
        };

        function Promise() {
            this.promise = {
                callbacks: [],
                then: function () {
                    this.callbacks = Array.prototype.slice.call(arguments);
                }
            };
        }

        Promise.prototype = {
            resolve: function () {
                if (!!this.promise.callbacks.length && !!this.promise.callbacks[0] && typeof this.promise.callbacks[0] === 'function') {
                    this.promise.callbacks[0].apply(this, arguments);
                }
            },
            reject: function () {
                if (!!this.promise.callbacks.length && !!this.promise.callbacks[0] && typeof this.promise.callbacks[1] === 'function') {
                    this.promise.callbacks[1].apply(this, arguments);
                }
            }
        }
    };

    Utils.ready(function() {
        HeaderABC.initialize();
    });

})(window);