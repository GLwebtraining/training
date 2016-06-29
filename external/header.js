(function(window) {
    'use strict';

    var
        location = window.location,
        document = window.document,
        docElem = document.documentElement;

    var Utils = defineUtils();
    var rootUrl = 'https://rawgit.com/GLwebtraining/training/gh-pages/external/';

    var HeaderABC = {
            define: function() {
                this.head = document.head || Utils.getElement('head')[0];
                this.body = document.body;
                this.firstBodyElement = this.body.children[0];
                this.isHtmlGenerated = false;
                this.isCssGenerated = false;
                this.sidebarOpened = false;
                this.progressDone = this.generated();
            },
            generate: {
                html: function() {
                    HeaderABC.element = Utils.createElement('div', {
                        id: 'HeaderABC',
                        className: 'clearfix'
                    });

                    getFile(rootUrl + 'header.html').then(function (content) {
                        Utils.html(HeaderABC.element, content);
                        HeaderABC.isHtmlGenerated = true;
                        HeaderABC.progressDone('html');
                    }, function (error) {
                        throw new Error(error);
                    });
                },
                css: function () {
                    HeaderABC.styleSheet = Utils.createElement('style', {
                        type: 'text/css'
                    });

                    getFile(rootUrl + 'header.css').then(function (content) {
                        HeaderABC.css = content; //HeaderABC.cssArray.join('');
                        if (HeaderABC.styleSheet.styleSheet) {
                            HeaderABC.styleSheet.styleSheet.cssText = HeaderABC.css;
                        } else {
                            HeaderABC.styleSheet.appendChild(document.createTextNode(HeaderABC.css));
                        }
                        HeaderABC.isCssGenerated = true;
                        HeaderABC.progressDone('css');
                    }, function (error) {
                        throw new Error(error);
                    });
                },
                menu: function() {
                    getFile(rootUrl + 'config.json').then(function (json) {
                        HeaderABC.menuConfig = JSON.parse(json);
                        HeaderABC.menu = generateItems(HeaderABC.menuConfig);
                        HeaderABC.progressDone('menu');
                    }, function (error) {
                        throw new Error(error);
                    });

                    function generateItems(json) {
                        var listHtml = '<ul class="list">';
                        var listHtmlEnd = '</ul>';
                        for (var i = 0; i < json.length; i++) {
                            listHtml += '<li><a href="' + json[i].url + '">' + json[i].name + '</a></li>';
                        }
                        listHtml += listHtmlEnd;
                        return listHtml;
                    }
                }
            },
            getTitle: function () {
                var host = location.hostname;
                return 'Expenses';
            },
            setUserName: function (name) {
                var userName = name.split(' ');;
                var userNameHtml = '';

                for (var i = 0; i < userName.length; i++) {
                    userNameHtml += '<em>' + userName[i] + '</em>';
                }

                Utils.html(Utils.getElement('.avatar', HeaderABC.element)[0], userNameHtml);
            },
            applyMarkup: function () {
                var deferred = Utils.defer();
                var _this = this;
                if (!!_this.isHtmlGenerated && !!_this.isCssGenerated) {
                    _this.head.appendChild(HeaderABC.styleSheet);
                    HeaderABC.styleSheet.onload = function () {
                        Utils.addClass(_this.body, 'header-abc');
                        _this.body.insertBefore(HeaderABC.element, _this.body.children[0]);

                        Utils.html(Utils.getElement('.sidebar-wrapper', HeaderABC.element)[0], HeaderABC.menu);
                        Utils.html(Utils.getElement('.logo', HeaderABC.element)[0], HeaderABC.getTitle());
                        HeaderABC.setUserName('User Name');
                        
                        setTimeout(HeaderABC.applyResizeEvent, 0);
                        deferred.resolve();
                    }
                }
                return deferred.promise;
            },
            applyEvents: function() {
                var header = Utils.getElement('#HeaderABC');
                var sidebar = Utils.getElement('#HeaderABC-SidebarMenu');
                var overlay = Utils.getElement('#HeaderABC-overlay');
                var hamburgerMenuOpener = Utils.getElement('.hamburger-menu', header)[0];
                
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
            applyResizeEvent: function () {
                var gotHeaderWidth = false;
                var header = Utils.getElement('#HeaderABC');
                var headerWidth = getHeaderWrapperWidth();

                Utils.windowOnResize(function () {
                    if (HeaderABC.element.offsetWidth < headerWidth) {
                        Utils.addClass(HeaderABC.body, 'header-abc-overwidth');
                    } else {
                        Utils.removeClass(HeaderABC.body, 'header-abc-overwidth');
                    }
                });

                function getHeaderWrapperWidth() {
                    var headerWrapper = Utils.getElement('.header-wrapper', header)[0];
                    var width = 0;
                    if (headerWrapper) {
                        var paddingLeft = Utils.getStyle(headerWrapper, 'paddingLeft') || 0;
                        var paddingRight = Utils.getStyle(headerWrapper, 'paddingRight') || 0;
                    
                        width = paddingLeft + paddingRight + 108;
                        for (var i = 0; i < headerWrapper.children.length; i++) {
                            width += headerWrapper.children[i].offsetWidth;
                        }
                    }
                    return width;
                }
            },
            generated: function () {
                var deferred = Utils.defer();
                var triggers = (function () {
                    var obj = {};
                    for (var key in HeaderABC.generate) {
                        obj[key] = false;
                    }
                    return obj;
                })();

                return function(trigger) {
                    var done = true;
                    if (trigger in triggers) {
                        triggers[trigger] = true;
                    }
                    for (var key in triggers) {
                        if (!triggers[key]) {
                            done = false;
                            break;
                        }
                    }
                    if (done) {
                        deferred.resolve();
                    }
                    return deferred.promise;
                }
            },
            template: getMainTemplate(),
            cssArray: getCssArray(),
            initialize: function () {
                this.define();
                this.generate.html();
                this.generate.css();
                this.generate.menu();
                this.progressDone().then(function () {
                    HeaderABC.applyMarkup().then(function() {
                        HeaderABC.applyEvents();
                        HeaderABC.expenseNow();
                    });

                });
            },
            expenseNow: function() {
                var title = HeaderABC.getTitle();
                if (title.toLowerCase() === 'expenses') {
                    intializeExpenseNow();
                }
            }
    };

    function defineUtils() {
        function Promise() {
            this.promise = {
                callbacks: [],
                then: function () {
                    this.callbacks = Array.prototype.slice.call(arguments);
                },
                resolved: false,
                rejected: false
            };
        }

        Promise.prototype = {
            resolve: function () {
                if (!!this.promise.callbacks.length && !!this.promise.callbacks[0] && typeof this.promise.callbacks[0] === 'function') {
                    this.promise.callbacks[0].apply(this, arguments);
                    this.promise.resolved = true;
                }
            },
            reject: function () {
                if (!!this.promise.callbacks.length && !!this.promise.callbacks[0] && typeof this.promise.callbacks[1] === 'function') {
                    this.promise.callbacks[1].apply(this, arguments);
                    this.promise.rejected = true;
                }
            }
        }

        return {
            ready: function (callback) {
                window.document.addEventListener('DOMContentLoaded', function (event) {
                    if (!!callback && typeof callback === 'function') {
                        callback(event);
                    }
                });
            },
            windowOnLoad: function (callback) {
                window.addEventListener('load', function (event) {
                    if (!!callback && typeof callback === 'function') {
                        callback(event);
                    }
                });
            },
            windowOnResize: function (callback) {
                window.addEventListener('resize', function (event) {
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
                } else if (!this.hasClass(target, className)) {
                    target.className += " " + className;
                }
            },
            removeClass: function (target, className) {
                if (target.classList) {
                    target.classList.remove(className);
                } else if (this.hasClass(target, className)) {
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
            isFunction: function(func){
                return !!func && typeof func === 'function';
            },
            ajax: function (settings) {
                var _this = this;
                var request = {
                    isXdr: function(){
                        return window.XDomainRequest ? true : false;
                    },
                    createCrossDomainRequest: function(){
                        return this.isXdr() ? new XDomainRequest() : new XMLHttpRequest();
                    },
                    send: function(){
                        var invocation = this.createCrossDomainRequest();
                        var params = [(!!settings.method ? settings.method : 'get'), settings.url, true];
                        var body = settings.data || '';
                        if(this.isXdr()){
                            invocation.onload = processResult;
                            invocation.open.apply(invocation, params);
                            invocation.send(body);
                        } else {
                            invocation.open.apply(invocation, params);
                            invocation.onreadystatechange = function(){
                                if (invocation.readyState != 4) return;
                                if (invocation.status != 200) {
                                    if (_this.isFunction(settings.error)) {
                                        settings.error({ status: invocation.status, statusText: invocation.statusText, headers: invocation.getAllResponseHeaders() });
                                    }
                                    return;
                                }
                                processResult();
                            };
                            invocation.send(body);
                        };

                        function processResult(){
                            if(_this.isFunction(settings.success)){
                                settings.success(invocation.responseText);
                            }
                        }
                    }
                };
                request.send();
            },
            getStyle: function (element, style) {
                var computedStyle = null;
                if (!!element && !!style) {
                    computedStyle = window.getComputedStyle(element)[style];
                    if (!!computedStyle && computedStyle.indexOf('px')) {
                        computedStyle = computedStyle.split('px')[0] * 1;
                    }
                }
                return computedStyle;
            },
            getElement: function(selector, parentNode) {
                if (selector.indexOf('#') !== -1) {
                    return document.getElementById(selector.substr(selector.indexOf('#') + 1));
                }
                if (selector.indexOf('.') !== -1) {
                    return (!!parentNode ? parentNode : document).getElementsByClassName(selector.substr(selector.indexOf('.') + 1));
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
    }

    function getFile(fileName) {
        var deferred = Utils.defer();

        Utils.ajax({
            url: fileName,
            success: function (response) {
                deferred.resolve(response);
            },
            error: function (error) {
                deferred.reject(error);
            }
        });

        return deferred.promise;
    }

    function getCssArray() {
        return [
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
        ];
    }

    function getMainTemplate() {
        return '<div class="header-wrapper">' +
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
                '<div id="HeaderABC-overlay"></div>';
    }

    function intializeExpenseNow() {
        if (!!window.angular) {
            var injector = angular.element(HeaderABC.body).injector();
            getRootScope.$inject = ['$rootScope'];
            return injector.invoke(getRootScope, null, null);
        }
    }

    function getRootScope($rootScope) {
        $rootScope.$broadcast('header:init');
    }

    Utils.ready(function() {
        HeaderABC.initialize();
    });

    window.HeaderABC = HeaderABC;

})(window);