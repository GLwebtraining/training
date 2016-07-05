(function (window) {
    'use strict';

    var
        location = window.location,
        document = window.document,
        docElem = document.documentElement;

    var rootUrl = 'https://rawgit.com/GLwebtraining/training/gh-pages/external/';
    var globalMenuUrl = 'https://wo16outer.qa.synapse.com/api/globalmenu';

    var HeaderABC = {
        debug: true,
        define: function () {
            this.head = document.head || ABC('head')[0];
            this.body = ABC(document.body);
            this.firstBodyElement = this.body.get().children[0];
            this.isHtmlGenerated = false;
            this.isCssGenerated = false;
            this.sidebarOpened = false;
            this.progressDone = this.generated();
        },
        generate: {
            html: function () {
                HeaderABC.element = ABC('<div></div>').attrs({
                    id: 'HeaderABC',
                    className: 'clearfix'
                });

                getFile(rootUrl + 'header.html').then(function (content) {
                    HeaderABC.element.html(content);
                    HeaderABC.isHtmlGenerated = true;
                    HeaderABC.progressDone('html');
                }, function (error) {
                    throw new Error(error);
                });
            },
            css: function () {
                HeaderABC.styleSheet = ABC('<style>').attrs({
                    type: 'text/css'
                }).get();

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
            menu: function () {
                getFile(globalMenuUrl).then(getMenuCallback, function (error) {
                    getMenuCallback('');
                });

                function getMenuCallback(data) {
                    HeaderABC.menuConfig = ABC.isJson(data) ? JSON.parse(data) : HeaderABC.fallback.menu;
                    HeaderABC.menu = generateItems(HeaderABC.menuConfig);
                    HeaderABC.progressDone('menu');
                }

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
            var title = '';
            if (HeaderABC.debug) {
                HeaderABC.menuConfig.push({
                    url: 'https://ers.local.synapse.com',
                    name: 'Expenses'
                });
                HeaderABC.menuConfig.push({
                    url: 'https://ers.qa.synapse.com',
                    name: 'Expenses'
                });
                HeaderABC.menuConfig.push({
                    url: 'https://erswo16.qa.synapse.com',
                    name: 'Expenses'
                });
            }
            for (var i = 0; i < HeaderABC.menuConfig.length; i++) {
                if (HeaderABC.menuConfig[i].url.indexOf(host) !== -1) {
                    return ABC.capitalize(HeaderABC.menuConfig[i].name.toLowerCase());
                }
            }
        },
        setUserName: function (name) {
            var userName = name.split(' ');;
            var userNameHtml = '';

            for (var i = 0; i < userName.length; i++) {
                userNameHtml += '<em>' + userName[i] + '</em>';
            }

            HeaderABC.element.find('.avatar').html(userNameHtml);
        },
        applyMarkup: function () {
            var deferred = ABC.defer();
            var _this = this;
            if (!!_this.isHtmlGenerated && !!_this.isCssGenerated) {
                _this.head.appendChild(HeaderABC.styleSheet);
                HeaderABC.styleSheet.onload = function () {
                    _this.body.addClass('header-abc');
                    _this.body.get().insertBefore(HeaderABC.element.get(), _this.body.get().children[0]);

                    HeaderABC.element.find('.sidebar-wrapper').html(HeaderABC.menu);
                    HeaderABC.element.find('.logo').html(HeaderABC.getTitle());

                    HeaderABC.setUserName('User Name');

                    setTimeout(HeaderABC.applyResizeEvent, 0);
                    deferred.resolve();
                }
            }
            return deferred.promise;
        },
        applyEvents: function () {
            var body = this.body;
            var header = ABC('#HeaderABC');
            var sidebar = ABC('#HeaderABC-SidebarMenu');
            var overlay = ABC('#HeaderABC-overlay');
            var hamburgerMenuOpener = header.find('.hamburger-menu');

            hamburgerMenuOpener.on('click', function () {
                if (HeaderABC.sidebarOpened) {
                    sidebar.removeClass('opened');
                    overlay.removeClass('opened');
                    body.removeClass('sidebar-abc-opened');
                    HeaderABC.sidebarOpened = false;
                } else {
                    sidebar.addClass('opened');
                    overlay.addClass('opened');
                    body.addClass('sidebar-abc-opened');
                    HeaderABC.sidebarOpened = true;
                }
            });
        },
        applyResizeEvent: function () {
            var body = HeaderABC.body,
                header = ABC('#HeaderABC'),
                element = HeaderABC.element.get(),
                headerWidth = getHeaderWrapperWidth();

            ABC.windowOnResize(function () {
                body[(element.offsetWidth < headerWidth ? 'addClass': 'removeClass')]('header-abc-overwidth');
            });

            function getHeaderWrapperWidth() {
                var width = 0, headerWrapper = header.find('.header-wrapper').get();
                if (headerWrapper) {
                    var paddingLeft = ABC(headerWrapper).getStyle('paddingLeft') || 0;
                    var paddingRight = ABC(headerWrapper).getStyle('paddingRight') || 0;

                    width = paddingLeft + paddingRight + 108;
                    for (var i = 0; i < headerWrapper.children.length; i++) {
                        width += headerWrapper.children[i].offsetWidth;
                    }
                }
                return width;
            }
        },
        fallback: {
            menu: []
        },
        generated: function () {
            var deferred = ABC.defer();
            var triggers = (function () {
                var obj = {};
                for (var key in HeaderABC.generate) {
                    obj[key] = false;
                }
                return obj;
            })();

            return function (trigger) {
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
                HeaderABC.applyMarkup().then(function () {
                    HeaderABC.applyEvents();
                    HeaderABC.expenseNow();
                });

            });
        },
        expenseNow: function () {
            var title = HeaderABC.getTitle();
            if (!!title && title.toLowerCase() === 'expenses') {
                intializeExpenseNow();
            }
        }
    };

    function getFile(fileName) {
        var deferred = ABC.defer();

        ABC.ajax({
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
            var injector = angular.element(HeaderABC.body.get()).injector();
            getRootScope.$inject = ['$rootScope'];
            return injector.invoke(getRootScope, null, null);
        }
    }

    function getRootScope($rootScope) {
        $rootScope.$broadcast('header:init');
    }

    function ABC(element) {
        if (!element) {
            return;
        }
        return new ABC.init(element);
    }

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

    ABC.init = function (element) {
        this.element = ABC.Element(element);
    }

    ABC.init.prototype = {
        attrs: function (obj) {
            var element = this.element;

            if (ABC.isExists(element) && ABC.isObject(obj)) {
                for (var key in obj) {
                    if (ABC(obj).has(key)) {
                        element.setAttribute(key, obj[key]);
                    }
                }
            }
            return this;
        },
        css: function (obj) {
            var element = this.element;
            if (ABC.isExists(element) && ABC.isObject(obj)) {
                for (var key in obj) {
                    if (ABC(obj).has(key)) {
                        element.style[key] = obj[key];
                    }
                }
            }
            return this;
        },
        getStyle: function (style) {
            var computedStyle = null;
            if (!!style) {
                computedStyle = window.getComputedStyle(this.element)[style];
                if (!!computedStyle && computedStyle.indexOf('px')) {
                    computedStyle = computedStyle.split('px')[0] * 1;
                }
            }
            return computedStyle;
        },
        has: function (key) {
            return this.element.hasOwnProperty(key);
        },
        on: function (event, handler) {
            if (!event) {
                return;
            }
            this.element.addEventListener(event, function (e) {
                handler(e);
                e.stopPropagation();
                e.preventDefault();
            });
        },
        find: function (selector) {
            return ABC(ABC.Element(selector, this.element)[0]);
        },
        addClass: function (className) {
            if (this.element.classList) {
                this.element.classList.add(className);
            } else if (!this.element.hasClass(className)) {
                this.element.className += " " + className;
            }
            return this;
        },
        removeClass: function (className) {
            if (this.element.classList) {
                this.element.classList.remove(className);
            } else if (this.element.hasClass(target, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                this.element.className = this.element.className.replace(reg, ' ');
            }
            return this;
        },
        hasClass: function (className) {
            if (this.element.classList) {
                return this.element.classList.contains(className);
            } else {
                return !!this.element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
            }
            return this;
        },
        html: function (html) {
            this.element.innerHTML = html;
            return this;
        },
        get: function () {
            return this.element;
        }
    };

    ABC.isArray = function (item) {
        if (ABC.isExists(item)) {
            if (item instanceof Array) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    ABC.isObject = function (item) {
        if (ABC.isExists(item)) {
            if (!ABC.isArray(item) && item instanceof Object) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    ABC.isFunction = function (f) {
        return typeof f === 'function';
    };

    ABC.isExists = function (item) {
        return !!item;
    };

    ABC.Element = function (selector, parentNode) {
        if (!ABC.isQuerySelector(selector)) {
            return selector;
        }
        var delay, count = 0;
        var regEx = {
            byClassName: /\.[A-Za-z0-9]+/,
            byId: /\#[A-Za-z0-9]+/,
            byCreation: /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            byTag: /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/
        };
        var api = {
            byTag: getByTag,
            byClassName: getByClassName,
            byId: getById,
            byCreation: getByCreation
        }

        function checkSelector(selector) {
            for (var key in regEx) {
                if (regEx[key].test(selector)) {
                    return api[key](selector);
                }
            }
        }

        function getByTag(selector, parentNode) {
            return (!!parentNode ? parentNode : document).getElementsByTagName(selector) || null;
        }

        function getById(selector) {
            return document.getElementById(selector.substr(1)) || null;
        }

        function getByClassName(selector, parentNode) {
            var matched = (!!parentNode ? parentNode : document).querySelectorAll(selector);
            return matched.length > 0 ? matched : null;
        }

        function getByCreation(selector) {
            var tag = selector.match(/([\w:-]+)/g, '')[0];
            return document.createElement(tag);
        }

        return checkSelector(selector);
    }

    ABC.isNodeElement = function (element) {
        return !!~[1, 2, 3, 8].indexOf(element.nodeType);
    }

    ABC.isQuerySelector = function (element) {
        return !ABC.isNodeElement(element) && !~['number', 'boolean'].indexOf(typeof element) && !(ABC.isArray(element) || ABC.isObject(element) || ABC.isFunction(element));
    }

    ABC.isJson = function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    ABC.defer = function () {
        return new Promise;
    }

    ABC.ajax = function (settings) {
        var _this = this;
        var request = {
            isXdr: function () {
                return window.XDomainRequest ? true : false;
            },
            createCrossDomainRequest: function () {
                return this.isXdr() ? new XDomainRequest() : new XMLHttpRequest();
            },
            send: function () {
                var invocation = this.createCrossDomainRequest();
                var params = [(!!settings.method ? settings.method : 'get'), settings.url, true];
                var body = settings.data || '';
                if (this.isXdr()) {
                    invocation.onload = processResult;
                    invocation.open.apply(invocation, params);
                    invocation.send(body);
                } else {
                    invocation.open.apply(invocation, params);
                    invocation.onreadystatechange = function () {
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

                function processResult() {
                    if (_this.isFunction(settings.success)) {
                        settings.success(invocation.responseText);
                    }
                }
            }
        };
        request.send();
    }

    ABC.capitalize = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    ABC.ready = function (callback) {
        window.document.addEventListener('DOMContentLoaded', function (event) {
            if (!!callback && typeof callback === 'function') {
                callback(event);
            }
        });
    }

    ABC.windowOnLoad = function (callback) {
        window.addEventListener('load', function (event) {
            if (!!callback && typeof callback === 'function') {
                callback(event);
            }
        });
    }

    ABC.windowOnResize = function (callback) {
        window.addEventListener('resize', function (event) {
            if (!!callback && typeof callback === 'function') {
                callback(event);
            }
        });
    }

    ABC.ready(function () {
        HeaderABC.initialize();
    });

    window.HeaderABC = HeaderABC;

})(window);