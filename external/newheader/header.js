(function (window) {
    'use strict';

    var document = window.document;
    var appState = null;

    var HeaderABC = {
        define: function () {
            this.head = document.head || ABC('head')[0];
            this.body = ABC(document.body);
            this.firstBodyElement = this.body.get().children[0];
            this.isHtmlGenerated = false;
            this.isCssGenerated = false;
            this.sidebarOpened = false;
            this.progressDone = this.generated();
            this.ready();
        },
        settings: {
            userName: 'User',
            isExpenseNow: false,
            menuUrl: null,
            upmUrl: null,
            userInfoPath: 'api/user/info',
            authPath: 'auth/hidden',
            setUserRolePath: 'api/user/setCurrentUserRole',
            avatarPath: 'api/picture/get/useravatar/small/',
            userSuggestionPath: 'api/suggestion/delegate',
            userSuggestionCount: 10,
            avatarId: null,
            separator: /\?/
        },
        component: {
            roles: {
                current: null,
                available: [],
                opened: false,
                others: {}
            },
            user: {
                hasAdminRole: hasAdminRole,
                hasOnlyFolio: hasOnlyFolio,
                isUnderTheAnotherUser: underTheAnotherUser,
                isDeactivated: isDeactivated
            },
            app: {
                isItEn: isItEn
            },
            menu: function (element, data) {
                return ABC.Component({
                    name: 'globalMenu',
                    element: element,
                    model: data,
                    template: '<li><a href="|url|">|name|</a></li>',
                    render: function () {
                        this.element.innerHTML = '<span class="icon"></span><div class="list-wrapper"><ul class="list">' + ABC.Template(this.template)(this.model) + '</ul></div>';
                        ABC(this.element).on('click', function (e) {
                            ABC.Events.publish('menu:' + (ABC(e.currentTarget).hasClass('active') ? 'hide' : 'show'));
                            ABC.Events.publish('user-drop:hide');
                        });
                        ABC('#HeaderABC-overlay').on('click', function () {
                            ABC.Events.publish('menu:hide');
                        });
                    }
                });
            },
            userDelegates: function(element, data){
                return ABC.Component({
                    name: 'userDelegates',
                    element: element,
                    model: data,
                    template: '<div class="avatar-holder"><div class="img-wrapper no-pic"><img src="|src|" /></div><span class="user-name">|username|</span></div>',
                    render: function () {
                        this.element.innerHTML = ABC.Template(this.template)(this.model);
                        var imgs = ABC(this.element).get().getElementsByTagName('img');
                        for (var i = 0; i < imgs.length; i++) {
                            ABC(imgs[i]).on('load', function (e) {
                                ABC(e.target.parentNode).removeClass('no-pic');
                            });
                            ABC(imgs[i]).on('error', function (e) {
                                ABC(e.target.parentNode).addClass('no-pic');
                                ABC(e.target.parentNode).get().removeChild(ABC(e.target).get());
                            });
                        }
                        ABC(this.element).delegate('.avatar-holder', 'click', function (event, node) {});
                    }
                });
            },
            avatar: function (element, data) {
                return ABC.Component({
                    name: 'userPrimaryInfo',
                    element: element,
                    model: data,
                    template: '<div class="avatar-holder"><div class="img-wrapper no-pic"><img src="|src|" /></div><span class="user-name">|username|</span></div>',
                    render: function () {
                        this.element.innerHTML = ABC.Template(this.template)(this.model);
                        ABC(this.element).find('img').on('load', function (e) {
                            ABC(e.target.parentNode).removeClass('no-pic');
                        });
                        ABC(this.element).find('img').on('error', function (e) {
                            ABC(e.target.parentNode).addClass('no-pic');
                        });
                        ABC(this.element).on('click', function () {
                            ABC.Events.publish('profile:show');
                        });
                    },
                    update: function(){
                        this.element.innerHTML = ABC.Template(this.template)(this.model);
                    }
                });
            },
            info: function (element, data) {
                var dropTriggerTemplate = '<div class="drop-trigger"><span class="arrow down"></span></div>';
                var dropHolderTemplate = '<div class="drop-holder"><div class="profile-link"></div><div class="profile-link-return"></div><div class="profile-delegates"></div><div class="profile-roles"></div><div class="profile-search"></div></div>';
                return ABC.Component({
                    name: 'userMainInfo',
                    element: element,
                    model: data,
                    template: dropTriggerTemplate + dropHolderTemplate,
                    render: function () {
                        var that = this, el = ABC(this.element);
                        ABC(this.element).get().innerHTML = ABC.Template(that.template)(that.model);
                        this.update();
                        if (this.model.dropAllow) {
                            el.addClass('has-delegates');
                        }
                        ABC(this.element).delegate('.drop-trigger', 'click', function (event, element) {
                            ABC.Events.publish('user-drop:' + (el.hasClass('open') ? 'hide' : 'show'));
                        });
                    },
                    update: function(){
                        var that = this, el = ABC(this.element);
                        var underUser = !!HeaderABC.settings.onBehalfOf;
                        if(underUser){
                            HeaderABC.component.profile(el.find('.profile-link').get(), { label: 'Open ' + HeaderABC.settings.onBehalfOf.split(' ')[0] + '\'s profile' }).render();
                            ABC.Events.publish('returnLink:show');
                        } else {
                            HeaderABC.component.profile(el.find('.profile-link').get(), { label: 'Open my profile' }).render();
                            ABC.Events.publish('returnLink:hide');
                        }

                        if (!underUser && !!that.model.delegates && that.model.delegates.length > 0) {
                            HeaderABC.component.userDelegates(el.find('.profile-delegates').get(), that.model.delegates).render();
                        }
                        if (!underUser && !!that.model.roles && that.model.roles.length > 0) {
                            HeaderABC.component.rolesList(el.find('.profile-roles').get(), that.model.roles).render();
                        }
                        if (!underUser && !!that.model.searchAllow) {
                            HeaderABC.component.userSearch(el.find('.profile-search').get(), {}).render();
                        }
                        HeaderABC.component.returnUser(el.find('.profile-link-return').get(), { label: 'Return to my user' }).render();
                        ABC.Events.publish('otherUsersNoMatch:hide');
                        ABC.Events.publish('otherUsersDrop:hide');
                    }
                });
            },
            returnUser: function (element, data) {
                return ABC.Component({
                    name: 'returnUser',
                    element: element,
                    model: data,
                    template: '<span class="profile-link-icon"></span><span class="profile-link-return-label">|label|</span>',
                    render: function () {
                        this.element.innerHTML = ABC.Template(this.template)(this.model);
                        ABC(this.element).on('click', function () {
                            var current = appState.loggedUser;
                            ABC.Events.publish('returnLink:hide');
                            ABC.Events.publish('user-drop:hide');
                            ABC.Events.publish('delegate:apply', { roleName: current.role, name: current.role, displayName: current.roleDisplayName, externalId: current.externalId });
                        });
                    },
                    update: function(){
                        this.element.innerHTML = ABC.Template(this.template)(this.model);
                    }
                });
            },
            profile: function (element, data) {
                return ABC.Component({
                    name: 'profileLink',
                    element: element,
                    model: data,
                    template: '<span class="profile-link-icon"></span><span class="profile-link-label">|label|</span>',
                    render: function () {
                        this.element.innerHTML = ABC.Template(this.template)(this.model);
                        ABC(this.element).on('click', function () {
                            ABC.Events.publish('user-drop:hide');
                            ABC.Events.publish('profile:show');
                        });
                    }
                });
            },
            rolesList: function (element, data) {
                return ABC.Component({
                    name: 'roles',
                    element: element,
                    model: data,
                    template: '<div class="role" data-model-name="|name|" data-model-displayName="|displayName|"><em>&gt;</em><span>|displayName|</span></div>',
                    render: function () {
                        var that = this;
                        this.element.innerHTML = '<div class="profile-roles-holder"><strong class="heading">change role</strong>' + ABC.Template(this.template)(this.model) + '</div>';
                        that.setActive(that.element, appState.loggedUser.role);
                        ABC(this.element).delegate('.role', 'click', function (event, element, dataset) {
                            that.setActive(that.element, dataset.modelName);
                            ABC.Events.publish('user-drop:hide');
                            ABC.Events.publish('role:apply', { name: dataset.modelName, displayName: dataset.modelDisplayname });
                        });
                    },
                    setActive: function(rootEl, currentRole){
                        var children = rootEl.children[0].children;
                        for(var i = 0; i < children.length; i++){
                            if(children[i].dataset.modelName === currentRole){
                                ABC(children[i]).addClass('active');
                            } else {
                                ABC(children[i]).removeClass('active');
                            }
                        }
                    }
                });
            },
            userSearch: function (element, data) {
                var searchTemplate = '<div class="profile-search-holder">' +
                                            '<strong class="heading">other users</strong>' +
                                            '<div class="txt-input-holder">' +
                                                '<div class="search-box">' +
                                                    '<input type="text" class="txt-input" placeholder="Search by name" maxlength="30" autocomplete="off">' +
                                                    '<button type="button" class="search" tabindex="-1">Search</button>' +
                                                '</div>' +
                                                '<ul class="dropdown-menu"></ul>' +
                                                '<div class="no-match">' +
                                                    '<div>No match</div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>';

                return ABC.Component({
                    name: 'userSearch',
                    element: element,
                    model: data,
                    template: searchTemplate,
                    render: function () {
                        var el = ABC(this.element);
                        this.element.innerHTML = ABC.Template(this.template)(this.model);
                        el.delegate('input', 'keyup', function (event, element) {
                            var val = ABC(element).val();
                            if (!!val && val.length >= 3) {
                                HeaderABC.searchUser(val).then(function (usersObject) {
                                    if (!!usersObject.items.length) {
                                        ABC.Events.publish('otherUsersNoMatch:hide');
                                        HeaderABC.component.userSearchDrop(el.find('.dropdown-menu').get(), usersObject).render();
                                    } else {
                                        ABC.Events.publish('otherUsersDrop:hide');
                                        ABC.Events.publish('otherUsersNoMatch:show');
                                    }
                                });
                            } else if (!!val) {
                                ABC.Events.publish('otherUsersNoMatch:hide');
                                ABC.Events.publish('otherUsersDrop:hide');
                            } else {
                                ABC.Events.publish('otherUsersNoMatch:hide');
                                ABC.Events.publish('otherUsersDrop:hide');
                            }
                        });
                    },
                    update: function(){
                        this.element.innerHTML = ABC.Template(this.template)(this.model);
                    }
                });
            },
            userSearchDrop: function (element, data) {
                return ABC.Component({
                    name: 'searchResult',
                    element: element,
                    model: data.items,
                    template: '<li data-role="|role|" data-id="|externalId|" data-model-name="|userName|" data-model-displayName="|roleDisplayName|"><div class="role"><div class="user-name">|userName|</div><div class="user-role">|roleDisplayName|</div></div></li>',
                    render: function () {
                        ABC.Events.publish('otherUsersDrop:' + (!!this.model.length ? 'show' : 'hide'));
                        this.element.innerHTML = ABC.Template(this.template)(this.model);
                        ABC(this.element).delegate('li', 'click', function(event, element, dataset){
                            ABC.Events.publish('otherUsersDrop:hide');
                            ABC.Events.publish('user-drop:hide');
                            ABC.Events.publish('delegate:apply', { roleName: dataset.role, name: dataset.role, displayName: dataset.modelDisplayname, externalId: dataset.id });
                        });
                    },
                    update: function(){
                        ABC.Events.publish('otherUsersDrop:' + (!!this.model.length ? 'show' : 'hide'));
                        this.element.innerHTML = ABC.Template(this.template)(this.model);
                    }
                });
            }
        },
        config: function (settings) {
            if (settings) {
                for (var key in settings) {
                    if (settings.hasOwnProperty(key)) {
                        this.settings[key] = settings[key];
                    }
                }
            }

            if (this.settings.isExpenseNow && !!HeaderABC.initialized) {
                HeaderABC.expenseNow();
            }
        },
        generate: {
            html: function () {
                if (!HeaderABC.isHtmlGenerated) {
                    HeaderABC.element = ABC('<div></div>').attrs({
                        id: 'HeaderABC',
                        className: 'clearfix',
                        style: 'display: none'
                    });

                    HeaderABC.element.html(HeaderABC.template);
                    HeaderABC.isHtmlGenerated = true;
                    HeaderABC.progressDone('html');
                }
            },
            css: function () {
                if (!HeaderABC.isCssGenerated) {
                    HeaderABC.styleSheet = ABC('<style>').attrs({
                        type: 'text/css'
                    }).get();

                    HeaderABC.css = HeaderABC.cssArray.join('');

                    if (HeaderABC.styleSheet.styleSheet) {
                        HeaderABC.styleSheet.styleSheet.cssText = HeaderABC.css;
                    } else {
                        HeaderABC.styleSheet.appendChild(document.createTextNode(HeaderABC.css));
                    }
                    HeaderABC.isCssGenerated = true;
                    HeaderABC.progressDone('css');
                }
            },
            menu: function () {
                if (!!HeaderABC.settings.menuUrl) {
                    getFile(HeaderABC.settings.menuUrl).then(getMenuCallback, function (error) {
                        getMenuCallback('');
                    });
                } else {
                    getMenuCallback('');
                }

                function getMenuCallback(data) {
                    HeaderABC.component.menu(ABC('#abcmenu').get(), ABC.isJson(data) ? JSON.parse(data) : []).render();
                    HeaderABC.element.find('.logo').attrs({ href: '#' }).html(HeaderABC.getTitle());
                }
            }
        },
        getTitle: function () {
            if (HeaderABC.settings.isExpenseNow === true) {
                return 'Expenses';
            }
            var host = window.location.hostname;
            for (var i = 0; i < HeaderABC.menuConfig.length; i++) {
                if (HeaderABC.menuConfig[i].url.indexOf(host) !== -1) {
                    return ABC.capitalize(HeaderABC.menuConfig[i].name.toLowerCase());
                }
            }
            return '';
        },
        searchUser: function (val) {
            var search = ABC.defer();
            ABC.ajax({
                url: HeaderABC.settings.upmUrl + '/' + HeaderABC.settings.userSuggestionPath + '?count=' + HeaderABC.settings.userSuggestionCount + '&key=' + val,
                success: function (response) {
                    if (ABC.isJson(response)) {
                        search.resolve(JSON.parse(response));
                    }
                },
                error: function () {
                    console.log('Search error!');
                    search.reject();
                }
            });
            return search.promise;
        },
        setUserRoleUPM: function (roleSettings) {
            var changeRole = ABC.defer();
            ABC.ajax({
                url: HeaderABC.settings.upmUrl + '/' + HeaderABC.settings.setUserRolePath + '?externalId=' + roleSettings.externalId + '&roleName=' + roleSettings.name,
                method: 'get',
                success: function () {
                    changeRole.resolve();
                },
                error: function () {
                    console.log('Change role error!');
                    changeRole.reject();
                }
            });
            return changeRole.promise;
        },
        setUserRoleERS: function (roleSettings) {
            triggerScope(['role:apply'], {
                changeRoleTo: roleSettings
            });
            triggerScope(['role:change'], {
                changeRoleTo: roleSettings
            });
        },
        setUserPrimaryInfo: function(){
            var name = HeaderABC.settings.userName,
                onBehalfOf = HeaderABC.settings.onBehalfOf;
            HeaderABC.component.avatar(ABC('#abcavatar').get(), [{
                src: HeaderABC.settings.upmUrl + '/' + HeaderABC.settings.avatarPath + HeaderABC.settings.avatarId,
                username: (onBehalfOf ? onBehalfOf : name)
            }]).render();          
        },
        render: {
            userName: function () {
                HeaderABC.setUserPrimaryInfo();
            }
        },
        applyMarkup: function () {
            var deferred = ABC.defer();
            var _this = this;

            if (!!_this.isHtmlGenerated && !!_this.isCssGenerated) {
                _this.head.appendChild(HeaderABC.styleSheet);

                setTimeout(function () {
                    _this.body.addClass('header-abc');
                    _this.body.get().appendChild(HeaderABC.element.get());

                    deferred.resolve();
                }, 10);

            }
            return deferred.promise;
        },
        closeOuter: function () {
            if (!appState || (!!appState && appState.forceProfile === false)) {
                ABC('#ABCouter-wrapper').removeClass('opened');
                ABC('#ABCouter-wrapper').removeClass('profile');
                ABC('#ABCouter-wrapper').removeClass('agreement');
                ABC('#ABCouter-wrapper').attrs({ style: '' });
                ABC('#HeaderABC-overlay').removeClass('outer-opened');
                HeaderABC.body.removeClass('upm-abc-opened');
                HeaderABC.outerOpened = false;
                document.removeEventListener('keydown', keyLogger);
                ABC('#user-profile').attrs({
                    src: HeaderABC.settings.upmUrl
                });
            }
        },
        applyEvents: function () {
            ABC.Events.subscribe('menu:hide', function () {
                ABC('#HeaderABC-overlay').removeClass('opened');
                ABC('#abcmenu').removeClass('active');
            });
            ABC.Events.subscribe('menu:show', function () {
                ABC('#abcmenu').addClass('active');
                ABC('#HeaderABC-overlay').addClass('opened');
            });
            ABC.Events.subscribe('profile:show', function () {
                var iframe,
                    isUnderUser = HeaderABC.component.user.isUnderTheAnotherUser(),
                    hasAdminRole = HeaderABC.component.user.hasAdminRole(),
                    isDeactivated = HeaderABC.component.user.isDeactivated();

                if (HeaderABC.outerOpened) {
                    HeaderABC.closeOuter();
                } else {
                    if (!isUnderUser || (isUnderUser && hasAdminRole && !isDeactivated)) {
                        HeaderABC.body.addClass('upm-abc-opened');
                        ABC('#ABCouter-wrapper').addClass('opened');
                        ABC('#HeaderABC-overlay').addClass('outer-opened');
                        HeaderABC.outerOpened = true;

                        if (!ABC('#user-profile').get()) {
                            iframe = ABC('<iframe></iframe>').attrs({
                                id: 'user-profile',
                                src: HeaderABC.settings.upmUrl,
                                name: 'wprofile'
                            });

                            ABC('#ABCouter-wrapper').find('.content').get().appendChild(iframe.get());
                        } else {
                            window.frames.wprofile.window.postMessage({
                                type: 'openWindow'
                            }, '*');
                        }

                        document.addEventListener('keydown', keyLogger);
                    }
                }
            });
            ABC.Events.subscribe('user-drop:show', function () {
                ABC('#abcinfo').addClass('open');
            });
            ABC.Events.subscribe('user-drop:hide', function () {
                ABC('#abcinfo').removeClass('open');
            });
            ABC.Events.subscribe('role:apply', function (role) {
                role.roleName = role.name;
                role.externalId = appState.loggedUser.externalId;

                if (!!appState.onBehalfOfUser) {
                    HeaderABC.setUserRoleUPM(role).then(function () {
                        appState = null;
                        HeaderABC.settings.onBehalfOf = null;
                        getAppState();
                    });
                } else {
                    HeaderABC.setUserRoleUPM(role).then(function () {
                        HeaderABC.setUserRoleERS(role);
                    });
                }
            });
            ABC.Events.subscribe('delegate:apply', function (role) {
                role.roleName = role.name;
                HeaderABC.setUserRoleUPM(role).then(function () {
                    appState = null;
                    getAppState();
                });
            });
            ABC.Events.subscribe('otherUsersDrop:show', function () {
                ABC('#abcinfo').find('.profile-search').addClass('has-others');
            });
            ABC.Events.subscribe('otherUsersDrop:hide', function () {
                ABC('#abcinfo').find('.profile-search').removeClass('has-others');
            });
            ABC.Events.subscribe('otherUsersNoMatch:show', function () {
                ABC('#abcinfo').find('.profile-search').addClass('no-others');
            });
            ABC.Events.subscribe('otherUsersNoMatch:hide', function () {
                ABC('#abcinfo').find('.profile-search').removeClass('no-others');
            });
            ABC.Events.subscribe('returnLink:show', function () {
                ABC('#abcinfo').find('.drop-holder').addClass('under-other-user');
            });
            ABC.Events.subscribe('returnLink:hide', function () {
                ABC('#abcinfo').find('.drop-holder').removeClass('under-other-user');
            });

            ABC('#HeaderABC').on('click', function (e) {
                var el = e.target, parent;
                while (el) {
                    parent = el.parentElement;
                    if (parent && (el.id === 'HeaderABC' || parent.id === 'HeaderABC')) {
                        ABC.Events.publish('menu:hide');
                        break;
                    } else {
                        break;
                    }
                    el = parent;
                }
            });
        },
        generated: function () {
            var triggers = (function () {
                var obj = {};
                for (var key in HeaderABC.generate) {
                    if (key !== 'menu') {
                        obj[key] = false;
                    }
                }
                return obj;
            })();

            return function (trigger) {
                var done = true;
                if (trigger in triggers) {
                    triggers[trigger] = true;
                }
                for (var key in triggers) {
                    if (triggers.hasOwnProperty(key)) {
                        if (!triggers[key]) {
                            done = false;
                            break;
                        }
                    }
                }
                if (done) {
                    HeaderABC.initialized = true;
                    HeaderABC.loaded.resolve();
                }
            };
        },
        template: getMainTemplate(),
        cssArray: getCssArray(),
        initialize: function () {
            this.define();
            this.generate.html();
            this.generate.css();
            this.generate.menu();
        },
        ready: function () {
            this.loaded = ABC.defer();
            this.loaded.promise.then(function () {
                HeaderABC.applyMarkup().then(function () {
                    HeaderABC.signin();
                    HeaderABC.applyEvents();
                    HeaderABC.expenseNow();
                });
            });
        },
        loadingAnimation: function (w, h) {
            var html = '<span class="spinner"><span></span><span></span><span></span></span>';
            var loadingAnimationHolder = document.createElement('div');
            loadingAnimationHolder.className = 'loading-animation';
            loadingAnimationHolder.innerHTML = html;
            return loadingAnimationHolder;
        },
        signin: function () {
            var contentHolder = ABC('#ABCouter-wrapper').find('.content').get();
            var iframeSignin = ABC('<iframe></iframe>').attrs({
                id: 'abc-user-ipd-signin-abc',
                src: HeaderABC.settings.upmUrl + '/' + HeaderABC.settings.authPath,
                name: 'wsignin',
                width: 0,
                height: 0,
                style: 'display: none'
            });
            contentHolder.appendChild(iframeSignin.get());
            contentHolder.appendChild(this.loadingAnimation(640, 300));
        },
        expenseNow: function () {
            if (HeaderABC.settings.isExpenseNow === true) {
                intializeExpenseNow();
            }
        }
    };

    function isItEn() {
        return !!appState.isItEn;
    }

    function hasOnlyFolio() {
        return HeaderABC.component.roles.available.length === 1 && HeaderABC.component.roles.available[0].name.toLowerCase() === 'folioeditor' && HeaderABC.component.roles.current.name.toLowerCase() === 'folioeditor';
    }

    function hasAdminRole() {
        return HeaderABC.component.roles.available.some(function (role) {
            return role.name.toLowerCase() === 'administrator';
        });
    }

    function underTheAnotherUser() {
        return !!appState.onBehalfOfUser;
    }

    function isDeactivated() {
        return appState.isDeactivated;
    }

    function receiveMessage(event) {
        switch (event.data.type) {
            case 'closeWindow':
                if (!!appState) {
                    appState.forceProfile = false;
                    triggerScope(['tutorial:start'], {
                        agreementAccept: !appState.forceProfile
                    });
                }
                HeaderABC.closeOuter();
                break;
            case 'getHostName':
                window.frames.wprofile.window.postMessage({
                    type: 'appState',
                    isAgreementAccepted: appState.isAgreementAccepted,
                    isItEn: appState.isItEn,
                    isItTravel: appState.isItTravel
                }, '*');
                break;
            case 'setWelcomeFlow':
                ABC('#ABCouter-wrapper').addClass('agreement');
                ABC('#ABCouter-wrapper').removeClass('profile');
                break;
            case 'setProfileFlow':
                ABC('#ABCouter-wrapper').addClass('profile');
                ABC('#ABCouter-wrapper').removeClass('agreement');
                break;
            case 'avatarRender':
                HeaderABC.settings.avatarId = event.data.avatarId;
                HeaderABC.setUserPrimaryInfo();
                break;
            case 'changeDimentions':
                changeModalDimention(event.data);
                break;
            case 'agreementAccept':
                appState.isAgreementAccepted = true;
                break;
            case 'SIGNIN_SUCCESS':
                var iframeSignin = ABC('#abc-user-ipd-signin-abc').get();
                iframeSignin.parentNode.removeChild(iframeSignin);
                getAppState();
                break;
        }
    }

    function changeModalDimention(data) {
        ABC('#ABCouter-wrapper').css(data);
    }

    function keyLogger(e) {
        if (e.keyCode === 9 || e.keyCode === 32 || e.keyCode === 38 || e.keyCode === 40) {
            e.preventDefault();
        }
    }

    function getAppState() {
        if (!!HeaderABC.settings.upmUrl && !appState) {
            ABC.ajax({
                url: HeaderABC.settings.upmUrl + '/' + HeaderABC.settings.userInfoPath + '/' + ABC.localpath(),
                success: function (response) {
                    if (ABC.isJson(response)) {
                        var currentUser = {};
                        appState = JSON.parse(response);

                        if (appState.loggedUser.hasOwnProperty('userName')) {
                            currentUser.externalId = appState.loggedUser.externalId;
                            currentUser.roleName = appState.loggedUser.role;

                            HeaderABC.settings.userName = appState.loggedUser.userName;
                            HeaderABC.settings.avatarId = appState.avatarId;
                            if (!!appState.onBehalfOfUser) {
                                HeaderABC.settings.onBehalfOf = appState.onBehalfOfUser.userName;
                                currentUser.externalId = appState.onBehalfOfUser.externalId;
                                currentUser.roleName = appState.onBehalfOfUser.role;
                            } else {
                                HeaderABC.settings.onBehalfOf = null;
                            }
                            HeaderABC.setUserPrimaryInfo();
                            triggerScope(['tutorial:start'], {
                                agreementAccept: !appState.forceProfile
                            });
                        }
                        if (appState.isItEn) {
                            HeaderABC.setUserRoleERS(currentUser);
                        }
                        updateUpmUrl(appState);
                    }
                },
                error: function () {
                    updateUpmUrl({ forceProfile: false });
                }
            });
        }
    }

    function updateUpmUrl(data) {
        HeaderABC.applyMarkup().then(function () {
            if (data.forceProfile) {
                ABC('#userabc').get().click();
            }
            HeaderABC.setUserPrimaryInfo();
            buildComponents(data);
        });
    }

    function buildComponents(data) {
        var isEn = data.isItEn;
        var hasDelagates = !!data.delegatedUsers && !!data.delegatedUsers.length;
        var hasRoles = !!data.roles && !!data.roles.length;
        var hasAdminRole = data.roles.some(function (role) {
            return role.name.toLowerCase() === 'administrator';
        });

        data.hasDelagates = hasDelagates;
        data.dropAllow = hasDelagates || hasRoles;
        data.searchAllow = hasAdminRole || isEn;
        HeaderABC.component.info(ABC('#abcinfo').get(), data).render();
    }

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
            '@import url(https://fonts.googleapis.com/css?family=Droid+Sans:400,700);',
            '@media only screen and (max-width: 640px){', '', '}',
            '@-webkit-keyframes bounce {0%, 75%, 100% {-webkit-transform: translateY(0px); -moz-transform: translateY(0px); transform: translateY(0px); } 25% {-webkit-transform: translateY(-4px); -moz-transform: translateY(-4px); transform: translateY(-4px); } }',
            '@keyframes bounce {0%, 75%, 100% {-webkit-transform: translateY(0px); -moz-transform: translateY(0px); transform: translateY(0px); } 25% {-webkit-transform: translateY(-4px); -moz-transform: translateY(-4px); transform: translateY(-4px); } }',
            'body.header-abc', '{margin-top:0;margin-left:0;margin-right:0;padding:61px 0 0}',
            'body.sidebar-abc-opened', '{overflow:hidden}',
            'body.upm-abc-opened', '{overflow:hidden}',
            '#HeaderABC', '{width:100%;font:13px/14px "Droid Sans",Arial,sans-serif;position:fixed;z-index:2050;left:0;top:0;border-bottom:1px solid #ddd;min-width:320px;display:block !important;}',
            '#HeaderABC ul', '{margin:0;padding:0;list-style:none}',
            '#HeaderABC .header-wrapper', '{width:100%;height:61px;box-sizing:border-box;padding:16px 20px;position:relative;z-index:11;background:#fff;outline:none;}',
            '#HeaderABC .header-wrapper .logo', '{float:left;height:30px;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIzM3B4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAzMyAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT43OEZDQkVDRi0wNkVCLTRBQTgtODNBQS1COEYzNzI1MjlDQjU8L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+ICAgIDxkZWZzPjwvZGVmcz4gICAgPGcgaWQ9Im5ldyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0iU3VibWl0dGVkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTYuMDAwMDAwLCAtMjEuMDAwMDAwKSIgZmlsbD0iIzgwODA4MCI+ICAgICAgICAgICAgPHBhdGggZD0iTTY2LjQ0NDcwMjQsMjYuNjg4NDQyNSBDNjYuNDM1NzE2OCwyNi41NjM5NjI0IDY2LjQyOTIwNDIsMjYuNDM5MjM1MSA2Ni40MTcxNjg0LDI2LjMxNTAwMjMgQzY2LjM3Mzk3MTMsMjUuODY5NDI5NiA2Ni4yMjY5ODU5LDI1LjQ1ODk3NTEgNjUuOTYwNzE0LDI1LjEwMDQ1NiBDNjUuMTg2OTU5MSwyNC4wNTg3ODA0IDY0LjEyNDAxNDcsMjMuNzEyNzkxNyA2Mi44NzI5NDg3LDIzLjg1MjI3NTQgQzYyLjMyNjg4NTEsMjMuOTEzMTE0IDYxLjgzODUyNzYsMjQuMTI4MDI3NiA2MS40MTE5MTU0LDI0LjQ3NTc0NzQgQzYwLjQ4Mjc2NjUsMjUuMjMzMTc5OCA2MC4xMjczOCwyNi4yMDYxODUzIDYwLjM3Mzg2NywyNy4zNzYxMzMxIEM2MC41NDc0Nzk2LDI4LjE5OTg0NDkgNjEuMDY2NTg2MiwyOC43Nzk0NjA0IDYxLjgwMTg0MywyOS4xNTkwODM0IEM2Mi41NzQ1MjYzLDI5LjU1NzkxNDMgNjMuMzk2ODM2NywyOS42MDY3MTcgNjQuMjMzMzI2MywyOS40MTQ5NjgzIEM2NS40MDAxNDE1LDI5LjE0NzQ1OTggNjYuNDc1MTIxNywyOC4xMDQzMDAzIDY2LjQ0NDcwMjQsMjYuNjg4NDQyNSBNNjMuNTA1NDA2NCw0Mi40NjA5NzQ0IEM2My42OTIzNzM4LDQyLjQ1MDgzNDcgNjMuOTk1OTA3Myw0Mi40NDgyNzkxIDY0LjI5NjA2MSw0Mi40MTQ3MjcyIEM2NC43MTM0NDAyLDQyLjM2ODA2NzggNjUuMTMyNTUwNSw0Mi4zMTkyNjUgNjUuNTQyODQwMiw0Mi4yMzMzNjU1IEM2Ni4xMjE2MzEzLDQyLjExMjEwMDUgNjYuNjYyMzM2NCw0MS44OTE5OTMzIDY3LjEyNDM5NjYsNDEuNTA1NjkyOSBDNjcuODgzMDY1NSw0MC44NzE0MjE2IDY4LjAwODEyMjYsMzkuNjUyMDExNSA2Ny4xODE2OTA0LDM4LjkyNTMyODIgQzY2Ljg2MDg0NTEsMzguNjQzMjI4MyA2Ni40OTY4MDI3LDM4LjQzNDgyNzMgNjYuMTA3NTM0NSwzOC4yNjgwNTY5IEM2NS4xMjM4MTIyLDM3Ljg0NjQ3MzQgNjQuMDgyNTQ4OCwzNy43MTM5OTcgNjMuMDI1NTM5OCwzNy42NzM3Njc2IEM2Mi43MzMzMDAyLDM3LjY2MjYzODYgNjIuNDM5NzQxNiwzNy42NzkyOTA5IDYyLjE0NzAwNzMsMzcuNjg5MTAwOSBDNjEuNzAzNTc4LDM3LjcwNDAyMjEgNjEuMjcxNTI1LDM3Ljc4NzAzNjMgNjAuODUyMjQ5NywzNy45MzAxNDcxIEM2MC4zNzg4MTMyLDM4LjA5MTcyMzkgNTkuOTQ3MjU0OCwzOC4zMjkwNjA0IDU5LjU5MTcwMzUsMzguNjg1NzY1OSBDNTkuMTc1ODA4MSwzOS4xMDI4OTc4IDU4Ljk5MzM3NDgsMzkuNjA2MDExNiA1OS4wMzM3NjksNDAuMTk4ODk5NSBDNTkuMDczNTg2MSw0MC43ODMwNDkgNTkuMzExNDk5Nyw0MS4yNTQwOTQ4IDU5Ljc2ODUzMTEsNDEuNjE2NDg4NCBDNjAuMTE4MjI5NSw0MS44OTM4MDcgNjAuNTIyMDg5LDQyLjA1OTE3NTggNjAuOTQ2OTcsNDIuMTc3ODAyOSBDNjEuNzQ2MTE1NSw0Mi40MDA4Nzc4IDYyLjU2NjIwMDEsNDIuNDQ0MDc0OCA2My41MDU0MDY0LDQyLjQ2MDk3NDQgTTU2LDM5LjgxNTQ4NDQgQzU2LjAwOTMxNTQsMzkuNzgyMDk3MyA1Ni4wMjUyMjU4LDM5Ljc0OTA0IDU2LjAyNjk1NjksMzkuNzE1MzIzMyBDNTYuMDg3NDY1OCwzOC41MzY4ODQ0IDU2LjU4Mzk4NDcsMzcuNTkxMDAwOCA1Ny41MzQzMTk5LDM2Ljg4NzM5OTggQzU4LjE0NDI3MjMsMzYuNDM1NzI2OCA1OC44MzM3NzY1LDM2LjE1NDEyMTUgNTkuNTU3NTc0NSwzNS45NDY5NTcgQzU5LjY3MzMxNjIsMzUuOTEzODE3MyA1OS43ODk3MTc1LDM1Ljg4MzE1MDcgNTkuOTMyNzQ1OSwzNS44NDM5OTMgQzU5Ljg4NjI1MTQsMzUuODA3NDczNCA1OS44NjExMDgsMzUuNzg1NDYyNyA1OS44MzM4MjEzLDM1Ljc2NjU4NDYgQzU5LjQ2NDE3MzIsMzUuNTEwMzY5OSA1OS4xMTE2NzIsMzUuMjM0NjE3NyA1OC44MjY4NTE4LDM0Ljg4MjExNjUgQzU4LjU2MjcyMzIsMzQuNTU1MjUzMyA1OC4zODQyNDY4LDM0LjE5MTc4OCA1OC40MDY3NTIxLDMzLjc2MTIxODggQzU4LjQyODY4MDQsMzMuMzQxMzY2NSA1OC42MDEzODYyLDMyLjk3ODgwOCA1OC44Nzk3NzY0LDMyLjY2NjYxODYgQzU5LjMzOTM2MzQsMzIuMTUxMzA0MSA1OS45MjY5NzUzLDMxLjg0NDcyMDQgNjAuNTcyODcwMiwzMS42MzQzNDA4IEM2MC42NTQ5Nzc2LDMxLjYwNzU0ODcgNjAuNzM3NDk3MiwzMS41ODE5MTA4IDYwLjgxOTg1MTksMzEuNTU1Nzc4MiBDNjAuODE4OTQ1MSwzMS41NDcxMjIzIDYwLjgxNzk1NTgsMzEuNTM4NTQ4OCA2MC44MTY5NjY2LDMxLjUyOTk3NTQgQzYwLjY1OTg0MTQsMzEuNDQ5MzUxOSA2MC41MDEyMzI0LDMxLjM3MTM2NjMgNjAuMzQ1NzU1OSwzMS4yODc2OTI2IEM1OS42MTgyNDgyLDMwLjg5NjAzMzggNTguOTcxNDQ2NSwzMC40MDUxMjA3IDU4LjQ1OTAxNzMsMjkuNzQ5MjUwOSBDNTcuOTgzMzU1LDI5LjE0MDUzNTEgNTcuNjgyODcxNiwyOC40NTM3NTEzIDU3LjUzMTg0NjgsMjcuNjk3ODAyOCBDNTcuNDI5MTMwMiwyNy4xODM3MjQ4IDU3LjQwNjYyNDgsMjYuNjYzNDY0MSA1Ny40MzgxOTgyLDI2LjE0NDExMDEgQzU3LjUxMzI5ODUsMjQuOTEwMzU2IDU3Ljk0MDg5OTksMjMuODIxNjkxMiA1OC44MjY4NTE4LDIyLjkzNjcyODYgQzU5LjUxNzI2MjcsMjIuMjQ3MTQxOSA2MC4zNDQwMjQ4LDIxLjc4MzM1MDYgNjEuMjY3ODE1MywyMS40ODUxNzU1IEM2MS44MzAyMDE0LDIxLjMwMzczMTQgNjIuNDA1NTMwMiwyMS4xNzc2ODUgNjIuOTk0Mjk2MiwyMS4xMjg1NTI1IEM2My40NTYxMDksMjEuMDg5OTcxOSA2My45MTk3MzU0LDIxLjA1NDYwNjQgNjQuMzgyNzAyNCwyMS4wNTI4NzUyIEM2Ni41MDI4MjA2LDIxLjA0NDk2MTIgNjguNjIyOTM4OCwyMS4wNDkzMzA0IDcwLjc0MzA1NywyMS4wNDkzMzA0IEM3MC44OTA1MzcsMjEuMDQ5MzMwNCA3MC44OTA2MTk1LDIxLjA0OTQxMjggNzAuODkwNzAxOSwyMS4xOTI5MzU5IEM3MC44OTA3MDE5LDIxLjkzNDc4NzYgNzAuODg4NzIzNCwyMi42NzY3MjE4IDcwLjg5MjkyNzcsMjMuNDE4NTczNiBDNzAuODkzNTA0OCwyMy41MjA2MzA4IDcwLjg2MjI2MTEsMjMuNTQ1NDQ0NCA3MC43NjM2NjYzLDIzLjU0NTExNDYgQzY5LjgxMDc3NTQsMjMuNTQxNTY5OCA2OC44NTc4MDIyLDIzLjU0Mjg4ODggNjcuOTA0OTExNCwyMy41NDMzMDEgQzY3Ljg2NDAyMjUsMjMuNTQzMzAxIDY3LjgyMzA1MTMsMjMuNTQ3MjU4IDY3Ljc1NDYyODUsMjMuNTUwODAyOCBDNjcuODAxMTIzLDIzLjYwNzM1NDYgNjcuODI5MzE2NSwyMy42NDU2MDU1IDY3Ljg2MTU0OTQsMjMuNjgwMDY0MiBDNjguMjg4OTg2LDI0LjEzNjI3MTMgNjguNjg0OTMxNSwyNC42MTU4MDgxIDY4Ljk2MjAwMjcsMjUuMTgxNTc0MSBDNjkuMTc0NTI1NywyNS42MTU0NDA4IDY5LjI4ODYxODYsMjYuMDc2MTgxOSA2OS4zMjY3ODcsMjYuNTU3MTIwMiBDNjkuNDU4NDM5MSwyOC4yMTY0MTQ4IDY4LjgxMzUzMzQsMjkuNTYzNDM3NiA2Ny42NDcwNDgsMzAuNjkxNDI0OSBDNjcuMDc3OTg0NSwzMS4yNDE3NzUyIDY2LjM3NjQ0NDUsMzEuNTY2MzMwMiA2NS42MjU3NzE5LDMxLjc5MzE5NzEgQzY0LjkyMjAwNjEsMzIuMDA1ODAyNSA2NC4yMDM5Nzg3LDMyLjE1Mjg3MDQgNjMuNDc4ODYxNiwzMi4yNjg3NzcgQzYzLjA2NjUxMTEsMzIuMzM0NzI2NyA2Mi42NDgxNDI2LDMyLjM3OTQwNzYgNjIuMjU5NDUxNiwzMi41NDMyOTI2IEM2Mi4wODgwNjQ4LDMyLjYxNTU5IDYxLjkxNjU5NTUsMzIuNzAyMzEzOSA2MS43Njk0NDUyLDMyLjgxNDM0NTkgQzYxLjI5ODk3NjUsMzMuMTcyNjE3NyA2MS4yOTY1ODU4LDMzLjgwNzEzNjMgNjEuNzUyMTMzNCwzNC4xODYwOTk4IEM2Mi4wMTgyNDA1LDM0LjQwNzQ0MzUgNjIuMzMzODA5OSwzNC41MzIwMDYgNjIuNjU1MzE0NywzNC42NDMzNzg2IEM2My4zNDczNzQ0LDM0Ljg4MzE4ODIgNjQuMDYyNDM0MSwzNS4wMzQ2MjUyIDY0Ljc3NTI2OCwzNS4xOTUzNzc3IEM2NS44Mjg0MDI0LDM1LjQzMjc5NjYgNjYuODg3NTU0NywzNS42NTI0OTE2IDY3LjkwNzMwMiwzNi4wMTIyNDcyIEM2OC45NjkwMDk5LDM2LjM4NjY3NjcgNjkuODExNDM0OSwzNy4wNDg4MTE3IDcwLjM3ODEwNzgsMzguMDM0MTAwNCBDNzAuNjM1ODg4NywzOC40ODIyMjg2IDcwLjc3OTQ5NDIsMzguOTcwNzUxMSA3MC44MjkxMjE0LDM5LjQ4NTA3NjMgQzcwLjg0OTMxODUsMzkuNjk0MzAxOCA3MC44NzAzMzk5LDM5LjkwNTE3NiA3MC44NjU4ODgzLDQwLjExNDgxMzYgQzcwLjgzOTkyMDYsNDEuMzQyMzAyNSA3MC4zNzYyOTQyLDQyLjM3MjYwMTggNjkuNDUyMDkxNSw0My4xODcwODA3IEM2OC41ODYwODk0LDQzLjk1MDI4MzcgNjcuNTYyMzg1MSw0NC4zOTkwNzE0IDY2LjQ1MzM1ODMsNDQuNjcyOTI3NiBDNjUuOTM1MzIzNCw0NC44MDA4NyA2NS40MDkyOTIsNDQuODc4MzYwOSA2NC44Nzg1NjE3LDQ0LjkzNDMzNTggQzY0LjE3ODUwNTYsNDUuMDA4MDM0NiA2My40NzYzODg1LDQ1LjAxMTkwOTEgNjIuNzc2MzMyNCw0NC45ODM5NjI5IEM2MS41NDk5OTc2LDQ0LjkzNTE2MDEgNjAuMzQ3ODk5Myw0NC43NDAxOTYzIDU5LjIwNjU1NzIsNDQuMjYxNDAxNCBDNTguNDMyNzE5OCw0My45MzY3NjQgNTcuNzI4NDU5NCw0My41MDQyOTg4IDU3LjE0NjA0MSw0Mi44OTI1MzI4IEM1Ni41NTY2MTU1LDQyLjI3MzUxMjQgNTYuMTg4ODYzNSw0MS41NDI2MjQ4IDU2LjA2ODE3NTUsNDAuNjkyOTQ1MiBDNTYuMDQ4ODAyOCw0MC41NTY0MjkzIDU2LjA0MjA0MjksNDAuNDE4MjY0NyA1Ni4wMjY4NzQ1LDQwLjI4MTA4OTMgQzU2LjAyMzQ5NDYsNDAuMjUwNTg3NiA1Ni4wMDkyMzMsNDAuMjIxMjM5OSA1Niw0MC4xOTEzOTc3IEw1NiwzOS44MTU0ODQ0IFogTTgwLjc5MDQ3ODQsMjEgQzgwLjgyNzMyNzgsMjEuMDA5MDY4MSA4MC44NjQwOTQ3LDIxLjAyNTIyNTggODAuOTAxMTkxNCwyMS4wMjYyMTUgQzgxLjk4MTQ0NzYsMjEuMDUzNTg0MSA4My4wMjQ2MDcxLDIxLjI2MDAwNjcgODQuMDI0MjM5OCwyMS42NzQ2NjU1IEM4NS4wNDY2MjUxLDIyLjA5ODgwNDYgODUuOTMzNzMxMSwyMi43MjEzNjk4IDg2LjcwNTE3NzgsMjMuNTEyMTA2OCBDODcuMjg1MDQwNiwyNC4xMDY0Nzg1IDg3Ljc2NzA1MDYsMjQuNzcxMDg2NyA4OC4xMzMxNTM5LDI1LjUxNzMwNzYgQzg4LjUwNjA5OTUsMjYuMjc3Mzc4IDg4Ljc0OTI4OSwyNy4wNzc5MjUgODguODUzNzM2OSwyNy45MTgyMDY3IEM4OC44OTIxNTI2LDI4LjIyNzc1ODEgODguOTE5MzU2OCwyOC41Mzk3MDAyIDg4LjkzMTU1NzUsMjguODUxMzEyNiBDODguOTQ0MzM1MywyOS4xNzYyNzk4IDg4Ljk1MDM1MzIsMjkuNTAzMzkwMyA4OC45Mjg4MzcxLDI5LjgyNzUzMzIgQzg4LjgzNjE3NzcsMzEuMjI2ODIxMSA4OC40MzU4NjMsMzIuNTI4MjU2MSA4Ny42MTI3MjgyLDMzLjY3NDI5NzEgQzg2LjMxNzk3MDYsMzUuNDc3MTE0OCA4NC41NzE2MjI0LDM2LjU5MjA3NyA4Mi4zOTE3MzczLDM3LjAxNDQwMjUgQzgxLjk3Njc0ODcsMzcuMDk0ODYxMSA4MS41NTI0NDQ4LDM3LjEzMDU1NjQgODEuMTMxMTkxLDM3LjE3NDMzMDUgQzgwLjg4Mjg5MDQsMzcuMjAwMjE1OCA4MC42MzE4NjkzLDM3LjIxNDU1OTggODAuMzgyNDk3LDM3LjIxMDM1NTUgQzgwLjA2MDY2MjQsMzcuMjA0OTE0NyA3OS43Mzg5MTAzLDM3LjE3OTY4ODkgNzkuNDE3NjUyOCwzNy4xNTYwMjk1IEM3OC44OTc3MjE4LDM3LjExNzg2MTEgNzguMzg4MDEzLDM3LjAxOTg0MzMgNzcuODg1MzExMywzNi44ODI4MzI4IEM3Ni42ODEzMTcsMzYuNTU0NjUwNiA3NS42MTU0MDQ5LDM1Ljk3MTY1NTIgNzQuNjgxNzIxOSwzNS4xNDU2MzUxIEM3My45MDgwNDk0LDM0LjQ2MTE1OTYgNzMuMjcyMjExOCwzMy42NjgzNjE3IDcyLjgxMjg3MjEsMzIuNzM5OTU0NyBDNzIuNDU2NjYxMiwzMi4wMTk5NDg3IDcyLjIyODE0NTUsMzEuMjYwMTI1NyA3Mi4xMTIyMzg5LDMwLjQ2NTI2NjggQzcyLjAzNDE3MDksMjkuOTI5NTkwMyA3MS45OTg0NzU2LDI5LjM5MTExMSA3Mi4wMTc2MDEsMjguODUwOTgyOSBDNzIuMDg1NTI5MiwyNi45Mjk2MjA2IDcyLjcwNDA1NSwyNS4yMjI2NzczIDc0LjAwNzc5ODMsMjMuNzg1Mzg1OSBDNzUuMjI3MjA4NCwyMi40NDEwODM1IDc2LjcyMjEyMzQsMjEuNTc1MjQ2MyA3OC41MDE1Mjg5LDIxLjIxNDk5NiBDNzguOTA5NDI3OCwyMS4xMzIzOTQgNzkuMzI3NTQ5LDIxLjA5OTA4OTQgNzkuNzQxNzEzMSwyMS4wNDkxMzI1IEM3OS44ODE3NzM4LDIxLjAzMjE1MDUgODAuMDI0MTQyOCwyMS4wMzUxMTgyIDgwLjE2NTI3NTEsMjEuMDI1OTY3NyBDODAuMTk2MTA2NiwyMS4wMjM5ODkyIDgwLjIyNTk0ODksMjEuMDA4OTg1NiA4MC4yNTYyODU3LDIxIEw4MC43OTA0Nzg0LDIxIFogTTc1LjIzOTI0NDIsMjkuMTgzNzgxNiBDNzUuMjI2OTYxMSwyOS40OTAyODI4IDc1LjI2NTg3MTQsMjkuODc5MzAzNyA3NS4zNDA3MjQzLDMwLjI2NDY5NzMgQzc1LjU4MTc3MDUsMzEuNTA1NTQxIDc2LjIyMTMxNzgsMzIuNDk1MzYzNyA3Ny4yMzI5ODYzLDMzLjI0NTk1MzggQzc4LjA5MTk4MTIsMzMuODgzMjc1MyA3OS4wNzQzMDIxLDM0LjE2NzM1MzYgODAuMTI4ODM3OSwzNC4yMjE2Nzk3IEM4MC42MzIyODE1LDM0LjI0NzU2NSA4MS4xMzQ5MDA3LDM0LjIyMjE3NDMgODEuNjMzMzk4MSwzNC4xMzAwMDk2IEM4My4wNTE1NjQxLDMzLjg2Nzk0MiA4NC4xNTM0MTg4LDMzLjEzMDQ1OTQgODQuOTQxMTg4LDMxLjkyNzI4OTQgQzg1LjQzMTM1OTIsMzEuMTc4NTk1MyA4NS42NTQ2ODE0LDMwLjM0MDI5MjEgODUuNzAyNzQyMywyOS40NTUyNDcxIEM4NS43MzA5MzU4LDI4LjkzNTQ4MDkgODUuNzE2OTIxNSwyOC40MTM0ODkgODUuNTk4ODcxNSwyNy45MDI4NzM0IEM4NS4xNzM3NDMyLDI2LjA2NDE5NTYgODQuMDQyMTI4NywyNC44NDc1MDU5IDgyLjI5MDc1MTgsMjQuMTk2MjUyNSBDODEuNjA4MzM3MiwyMy45NDI0Mjg2IDgwLjg5MjM3MDcsMjMuODYwOTgwNyA4MC4xNjU0NCwyMy44OTk5NzM1IEM3OS44ODM1ODc1LDIzLjkxNTA1OTUgNzkuNTk5MzQ0MiwyMy45MzAwNjMgNzkuMzIyMTA4MSwyMy45Nzg0NTM2IEM3Ny43NTM3NDE3LDI0LjI1MTk4MDEgNzYuNjAyMTc3MywyNS4xMTQ5MzIgNzUuODQwMDQ2LDI2LjQ5OTA1MTQgQzc1LjM5NjUzNDMsMjcuMzA0NTQ0NyA3NS4yMzI0MDE5LDI4LjE4MjkxMjMgNzUuMjM5MjQ0MiwyOS4xODM3ODE2IFoiIGlkPSJsb2dvIj48L3BhdGg+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=) no-repeat;background-position: 0 5px;line-height:30px;padding:0 0 0 40px;text-decoration:none;color:#808080;font:13px/30px "Droid Sans",Arial,sans-serif;font-weight:700;text-transform:uppercase}',
            '#HeaderABC #abcmenu', '{float:right;position:relative;cursor:pointer;padding:28px 20px 0;margin:-20px 0 0;background-color:#fff;height:37px;border-left:1px solid #fff;border-right:1px solid #ddd;}',
            '#HeaderABC #abcmenu.active', '{box-shadow:0px -1px 10px -2px rgba(0,0,0,.5);}',
            '#HeaderABC #abcmenu.active .list-wrapper', '{display:block;}',
            '#HeaderABC #abcmenu .icon', '{display:block;width:16px;height:16px;background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQwLjMgKDMzODM5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5wbGl0a2E8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iUmlnaHQtTGlzdCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNzQuMDAwMDAwLCAtMjIuMDAwMDAwKSIgZmlsbD0iIzgwODA4MCI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMTc0LDIyIEwxMTc4LDIyIEwxMTc4LDI2IEwxMTc0LDI2IEwxMTc0LDIyIFogTTExNzQsMjggTDExNzgsMjggTDExNzgsMzIgTDExNzQsMzIgTDExNzQsMjggWiBNMTE3NCwzNCBMMTE3OCwzNCBMMTE3OCwzOCBMMTE3NCwzOCBMMTE3NCwzNCBaIE0xMTgwLDIyIEwxMTg0LDIyIEwxMTg0LDI2IEwxMTgwLDI2IEwxMTgwLDIyIFogTTExODAsMjggTDExODQsMjggTDExODQsMzIgTDExODAsMzIgTDExODAsMjggWiBNMTE4MCwzNCBMMTE4NCwzNCBMMTE4NCwzOCBMMTE4MCwzOCBMMTE4MCwzNCBaIE0xMTg2LDIyIEwxMTkwLDIyIEwxMTkwLDI2IEwxMTg2LDI2IEwxMTg2LDIyIFogTTExODYsMjggTDExOTAsMjggTDExOTAsMzIgTDExODYsMzIgTDExODYsMjggWiBNMTE4NiwzNCBMMTE5MCwzNCBMMTE5MCwzOCBMMTE4NiwzOCBMMTE4NiwzNCBaIiBpZD0icGxpdGthIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=) no-repeat;}',
            '#HeaderABC #abcmenu .list-wrapper', '{display:none;position:absolute;right:0;top:100%;width:200px;background-color:#fff;box-shadow:0px 1px 10px -2px rgba(0,0,0,.5);}',
            '#HeaderABC #abcmenu .list-wrapper .list', '{background-color:#fff;margin:-2px 0 0;}',
            '#HeaderABC #abcmenu .list-wrapper .list a', '{display:block;text-decoration: none;color: #808080;font:13px/54px "Droid Sans",Arial,sans-serif;font-weight:700;padding:0 20px;}',
            '#HeaderABC #abcmenu .list-wrapper .list a:hover', '{background-color:#f3f4f3;}',
            '#HeaderABC #abcmenu .list-wrapper .error-message', '{color:#3f545f;text-align:center;font:13px/22px "Droid Sans",Arial,sans-serif;padding:53px 0 0;margin:10px;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMzkuMSAoMzE3MjApIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPjRERDJGRkI4LTY1RTEtNDhCQy1CRjZCLTA5RTY1QTEzQ0M3NzwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iSGFtYnVyZ2VyLU1lbnUtRXJyb3IiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTYuMDAwMDAwLCAtMzQwLjAwMDAwMCkiIGZpbGw9IiMwMEIxQjAiPgogICAgICAgICAgICA8cGF0aCBkPSJNMTM2LDM4MCBDMTI0LjkzNjE3LDM4MCAxMTYsMzcxLjA2MzgzIDExNiwzNjAgQzExNiwzNDguOTM2MTcgMTI0LjkzNjE3LDM0MCAxMzYsMzQwIEMxNDcuMDYzODMsMzQwIDE1NiwzNDguOTM2MTcgMTU2LDM2MCBDMTU2LDM3MS4wNjM4MyAxNDcuMDYzODMsMzgwIDEzNiwzODAgTDEzNiwzODAgWiBNMTE3Ljg5MzYxNywzNjAgQzExNy44OTM2MTcsMzY5Ljk3Njk4NyAxMjYuMDIzMDEzLDM3OC4xMDYzODMgMTM2LDM3OC4xMDYzODMgQzE0NS45NzY5ODcsMzc4LjEwNjM4MyAxNTQuMTA2MzgzLDM2OS45NzY5ODcgMTU0LjEwNjM4MywzNjAgQzE1NC4xMDYzODMsMzUwLjAyMzAxMyAxNDUuOTc2OTg3LDM0MS44OTM2MTcgMTM2LDM0MS44OTM2MTcgQzEyNi4wMjMwMTMsMzQxLjg5MzYxNyAxMTcuODkzNjE3LDM1MC4wMjMwMTMgMTE3Ljg5MzYxNywzNjAgWiBNMTM2LDM3MC4xNDU5MzYgQzEzNS4yOTc4NzIsMzcwLjE0NTkzNiAxMzQuNzIzNDA0LDM2OS41NjExNzQgMTM0LjcyMzQwNCwzNjguODQ2NDY1IEwxMzQuNzIzNDA0LDM1OC4zMjA3NDggQzEzNC43MjM0MDQsMzU3LjYwNjAzOSAxMzUuMjk3ODcyLDM1Ny4wMjEyNzcgMTM2LDM1Ny4wMjEyNzcgQzEzNi43MDIxMjgsMzU3LjAyMTI3NyAxMzcuMjc2NTk2LDM1Ny42MDYwMzkgMTM3LjI3NjU5NiwzNTguMzIwNzQ4IEwxMzcuMjc2NTk2LDM2OC45MTE0MzkgQzEzNy4yNzY1OTYsMzY5LjU2MTE3NCAxMzYuNzAyMTI4LDM3MC4xNDU5MzYgMTM2LDM3MC4xNDU5MzYgWiBNMTM0LjcyMzQwNCwzNTMuMzE0MSBMMTM0LjcyMzQwNCwzNTIuMjE3ODE1IEMxMzQuNzIzNDA0LDM1MS41ODMxMjMgMTM1LjI5Nzg3MiwzNTEuMDYzODMgMTM2LDM1MS4wNjM4MyBDMTM2LjcwMjEyOCwzNTEuMDYzODMgMTM3LjI3NjU5NiwzNTEuNTgzMTIzIDEzNy4yNzY1OTYsMzUyLjIxNzgxNSBMMTM3LjI3NjU5NiwzNTMuMzE0MSBDMTM3LjIxMjc2NiwzNTMuOTQ4NzkyIDEzNi43MDIxMjgsMzU0LjQ2ODA4NSAxMzYsMzU0LjQ2ODA4NSBDMTM1LjI5Nzg3MiwzNTQuNDY4MDg1IDEzNC43MjM0MDQsMzUzLjk0ODc5MiAxMzQuNzIzNDA0LDM1My4zMTQxIFoiIGlkPSJpX25vcmVzdWx0Ij48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=) no-repeat 50% 0;}',
            '#HeaderABC .hamburger-menu', '{text-decoration:none;float:right;margin:10px 20px 0 0;width:16px;height:12px;position:relative;-webkit-transform:rotate(0);-moz-transform:rotate(0);-o-transform:rotate(0);transform:rotate(0);-webkit-transition:.5s ease-in-out;-moz-transition:.5s ease-in-out;-o-transition:.5s ease-in-out;transition:.5s ease-in-out;cursor:pointer}',

            '#HeaderABC #abcprofile', '{float:right;position:relative;padding:0 10px 0 0;}',
            '#HeaderABC #abcavatar', '{height:30px;line-height:30px;display:block;padding:0 0 0 20px;cursor:pointer;color:#808080;font:13px/30px "Droid Sans",Arial,sans-serif}',
            '#HeaderABC #abcavatar .img-wrapper', '{width:30px;height:30px;float:left;border-radius: 50%;overflow: hidden;position:relative;}',
            '#HeaderABC #abcavatar .img-wrapper img', '{display: block;max-width:none;width: auto;height: auto;min-height: 100%;min-width: 100%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-webkit-transform: translate(-50%, -50%);}',
            '#HeaderABC #abcavatar .no-pic', '{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIzMHB4IiBoZWlnaHQ9IjMwcHgiIHZpZXdCb3g9IjAgMCAzMCAzMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5DNjk0NTlGNi0wRjM4LTRBNzktQjQ3Ny0yRTJFOUY5Mzg3NDQ8L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+ICAgIDxkZWZzPiAgICAgICAgPGNpcmNsZSBpZD0icGF0aC0xIiBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiPjwvY2lyY2xlPiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0id2hpdGUiPiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+ICAgICAgICA8L21hc2s+ICAgICAgICA8cGF0aCBkPSJNMjMuOTk2OTIyNCwyNy4wMDA4MTg1IEMyMS41MTE1ODYsMjguODgwNzQ2OSAxOC4zODk5NDA0LDMwIDE1LDMwIEMxMS42MTAwNTk2LDMwIDguNDg4NDE0MDQsMjguODgwNzQ2OSA2LjAwMzA3NzU2LDI3LjAwMDgxODUgQzYuMDAxMDMwMDYsMjYuOTIzODY1MiA2LDI2Ljg0NjY2NTIgNiwyNi43NjkyMzA4IEM2LDIxLjkyNjExODMgMTAuMDI5NDM3MywxOCAxNSwxOCBDMTkuOTcwNTYyNywxOCAyNCwyMS45MjYxMTgzIDI0LDI2Ljc2OTIzMDggQzI0LDI2Ljg0NjY2NTIgMjMuOTk4OTY5OSwyNi45MjM4NjUyIDIzLjk5NjkyMjQsMjcuMDAwODE4NSBaIiBpZD0icGF0aC0zIj48L3BhdGg+ICAgICAgICA8bWFzayBpZD0ibWFzay00IiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjEyIiBmaWxsPSJ3aGl0ZSI+ICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0zIj48L3VzZT4gICAgICAgIDwvbWFzaz4gICAgICAgIDxlbGxpcHNlIGlkPSJwYXRoLTUiIGN4PSIxNSIgY3k9IjEzLjgiIHJ4PSI1LjQiIHJ5PSI1LjQiPjwvZWxsaXBzZT4gICAgICAgIDxtYXNrIGlkPSJtYXNrLTYiIG1hc2tDb250ZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBtYXNrVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAuOCIgaGVpZ2h0PSIxMC44IiBmaWxsPSJ3aGl0ZSI+ICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC01Ij48L3VzZT4gICAgICAgIDwvbWFzaz4gICAgPC9kZWZzPiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJTdWJtaXR0ZWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMjAzLjAwMDAwMCwgLTE2LjAwMDAwMCkiIHN0cm9rZT0iIzk3OTc5NyIgc3Ryb2tlLXdpZHRoPSIzLjIyNTgwNjQ1Ij4gICAgICAgICAgICA8ZyBpZD0ibm9hdmF0YXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMDMuMDAwMDAwLCAxNi4wMDAwMDApIj4gICAgICAgICAgICAgICAgPHVzZSBpZD0iT3ZhbC0yMjAiIG1hc2s9InVybCgjbWFzay0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+ICAgICAgICAgICAgICAgIDx1c2UgaWQ9IkNvbWJpbmVkLVNoYXBlIiBtYXNrPSJ1cmwoI21hc2stNCkiIHhsaW5rOmhyZWY9IiNwYXRoLTMiPjwvdXNlPiAgICAgICAgICAgICAgICA8dXNlIGlkPSJPdmFsLTIyMC1Db3B5IiBtYXNrPSJ1cmwoI21hc2stNikiIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==) no-repeat;}',
            '#HeaderABC #abcavatar .user-name', '{padding:0 0 0 10px;line-height: 30px;color:#808080;font:13px/24px "Droid Sans",Arial,sans-serif;font-weight:700;}',

            '#HeaderABC #abcinfo', '{position:absolute;top:100%;right:0;margin:16px 0 0;width:100%;}',
            '#HeaderABC #abcinfo.has-delegates .drop-trigger', '{display:block;}',
            '#HeaderABC #abcinfo.open .drop-holder', '{display:block;}',
            '#HeaderABC #abcinfo .drop-trigger', '{display:none;width:100%;height:61px;margin:-61px 0 0;background-color:rgba(0,0,0,0);cursor:pointer;position:relative;}',
            '#HeaderABC #abcinfo .drop-trigger .arrow', '{width: 10px; height: 10px; display: block; position: absolute; right: -4px; top: 28px;width: 9px; height: 5px; background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOXB4IiBoZWlnaHQ9IjVweCIgdmlld0JveD0iMCAwIDkgNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBza2V0Y2h0b29sIDQwLjMgKDMzODM5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT45QTNBMTg4Ni1COUE1LTQ1NkItODFEQS1FMUNDNjNEQ0RFOTY8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9Im5ldyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Imljb25zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzI1LjAwMDAwMCwgLTg5LjAwMDAwMCkiIGZpbGw9IiM4MDgwODAiPgogICAgICAgICAgICA8cGF0aCBkPSJNNzMzLjM5ODQ0OCw4OS43NDk5OTI1IEM3MzMuMzk4NDQ4LDg5LjY4NzQ5MjUgNzMzLjM2NzE5Nyw4OS42MTcxNzk5IDczMy4zMjAzMjIsODkuNTcwMzA0OCBMNzMyLjkyOTY5Nyw4OS4xNzk2Nzk0IEM3MzIuODgyODIyLDg5LjEzMjgwNDMgNzMyLjgxMjUwOSw4OS4xMDE1NTQzIDczMi43NTAwMDksODkuMTAxNTU0MyBDNzMyLjY4NzUwOSw4OS4xMDE1NTQzIDczMi42MTcxOTcsODkuMTMyODA0MyA3MzIuNTcwMzIyLDg5LjE3OTY3OTQgTDcyOS41MDAwMDUsOTIuMjQ5OTk1NSBMNzI2LjQyOTY4OSw4OS4xNzk2Nzk0IEM3MjYuMzgyODE0LDg5LjEzMjgwNDMgNzI2LjMxMjUwMiw4OS4xMDE1NTQzIDcyNi4yNTAwMDEsODkuMTAxNTU0MyBDNzI2LjE3OTY4OSw4OS4xMDE1NTQzIDcyNi4xMTcxODksODkuMTMyODA0MyA3MjYuMDcwMzE0LDg5LjE3OTY3OTQgTDcyNS42Nzk2ODgsODkuNTcwMzA0OCBDNzI1LjYzMjgxMyw4OS42MTcxNzk5IDcyNS42MDE1NjMsODkuNjg3NDkyNSA3MjUuNjAxNTYzLDg5Ljc0OTk5MjUgQzcyNS42MDE1NjMsODkuODEyNDkyNiA3MjUuNjMyODEzLDg5Ljg4MjgwNTIgNzI1LjY3OTY4OCw4OS45Mjk2ODAzIEw3MjkuMzIwMzE4LDkzLjU3MDMwOTYgQzcyOS4zNjcxOTMsOTMuNjE3MTg0NyA3MjkuNDM3NTA1LDkzLjY0ODQzNDcgNzI5LjUwMDAwNSw5My42NDg0MzQ3IEM3MjkuNTYyNTA1LDkzLjY0ODQzNDcgNzI5LjYzMjgxOCw5My42MTcxODQ3IDcyOS42Nzk2OTMsOTMuNTcwMzA5NiBMNzMzLjMyMDMyMiw4OS45Mjk2ODAzIEM3MzMuMzY3MTk3LDg5Ljg4MjgwNTIgNzMzLjM5ODQ0OCw4OS44MTI0OTI2IDczMy4zOTg0NDgsODkuNzQ5OTkyNSBMNzMzLjM5ODQ0OCw4OS43NDk5OTI1IFoiIGlkPSJpX2Fycm93X2Rvd24iPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) no-repeat;}',
            '#HeaderABC #abcinfo.open .drop-trigger .arrow', '{width: 9px; height: 5px; background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOXB4IiBoZWlnaHQ9IjVweCIgdmlld0JveD0iMCAwIDkgNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBza2V0Y2h0b29sIDQwLjMgKDMzODM5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5GMTk5OUQzNy1CQzJCLTQyNjktQUU2Qi02OEIxRTJFMUQ0RkI8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9Im5ldyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Imljb25zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzQyLjAwMDAwMCwgLTg5LjAwMDAwMCkiIGZpbGw9IiM4MDgwODAiPgogICAgICAgICAgICA8cGF0aCBkPSJNNzUwLjM5ODQ0OCw5My4yNDk5OTY3IEM3NTAuMzk4NDQ4LDkzLjE4NzQ5NjYgNzUwLjM2NzE5Nyw5My4xMTcxODQxIDc1MC4zMjAzMjIsOTMuMDcwMzA5IEw3NDYuNjc5NjkzLDg5LjQyOTY3OTcgQzc0Ni42MzI4MTgsODkuMzgyODA0NiA3NDYuNTYyNTA1LDg5LjM1MTU1NDYgNzQ2LjUwMDAwNSw4OS4zNTE1NTQ2IEM3NDYuNDM3NTA1LDg5LjM1MTU1NDYgNzQ2LjM2NzE5Myw4OS4zODI4MDQ2IDc0Ni4zMjAzMTgsODkuNDI5Njc5NyBMNzQyLjY3OTY4OCw5My4wNzAzMDkgQzc0Mi42MzI4MTMsOTMuMTE3MTg0MSA3NDIuNjAxNTYzLDkzLjE4NzQ5NjYgNzQyLjYwMTU2Myw5My4yNDk5OTY3IEM3NDIuNjAxNTYzLDkzLjMxMjQ5NjggNzQyLjYzMjgxMyw5My4zODI4MDk0IDc0Mi42Nzk2ODgsOTMuNDI5Njg0NCBMNzQzLjA3MDMxNCw5My44MjAzMDk5IEM3NDMuMTE3MTg5LDkzLjg2NzE4NSA3NDMuMTg3NTAxLDkzLjg5ODQzNSA3NDMuMjUwMDAxLDkzLjg5ODQzNSBDNzQzLjMxMjUwMiw5My44OTg0MzUgNzQzLjM4MjgxNCw5My44NjcxODUgNzQzLjQyOTY4OSw5My44MjAzMDk5IEw3NDYuNTAwMDA1LDkwLjc0OTk5MzcgTDc0OS41NzAzMjIsOTMuODIwMzA5OSBDNzQ5LjYxNzE5Nyw5My44NjcxODUgNzQ5LjY4NzUwOSw5My44OTg0MzUgNzQ5Ljc1MDAwOSw5My44OTg0MzUgQzc0OS44MjAzMjIsOTMuODk4NDM1IDc0OS44ODI4MjIsOTMuODY3MTg1IDc0OS45Mjk2OTcsOTMuODIwMzA5OSBMNzUwLjMyMDMyMiw5My40Mjk2ODQ0IEM3NTAuMzY3MTk3LDkzLjM4MjgwOTQgNzUwLjM5ODQ0OCw5My4zMTI0OTY4IDc1MC4zOTg0NDgsOTMuMjQ5OTk2NyBMNzUwLjM5ODQ0OCw5My4yNDk5OTY3IFoiIGlkPSJpX2Fycm93X3VwIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=) no-repeat;}',

            '#HeaderABC #abcinfo .drop-holder', '{display:none;width:230px;float:right;background-color:#ccc;margin-right:-10px;box-shadow: 0px 1px 10px -2px rgba(0,0,0,.5);}',
            '#HeaderABC #abcinfo .drop-holder .profile-link', '{display:block;background-color:rgb(247, 247, 247);line-height:40px;color:#00b1b0;overflow:hidden;cursor:pointer;padding:0 20px;}',
            '#HeaderABC #abcinfo .drop-holder .profile-link .profile-link-icon', '{float:left;width:15px;height:15px;margin:12px 10px 0 0;background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxNXB4IiB2aWV3Qm94PSIwIDAgMTUgMTUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQxICgzNTMyNikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aV91c2VyX2FjdGl2ZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxjaXJjbGUgaWQ9InBhdGgtMSIgY3g9IjcuNSIgY3k9IjcuNSIgcj0iNy41Ij48L2NpcmNsZT4KICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgPC9tYXNrPgogICAgICAgIDxwYXRoIGQ9Ik0xMS45OTg0NjEyLDEzLjUwMDQwOTMgQzEwLjc1NTc5MywxNC40NDAzNzM0IDkuMTk0OTcwMjIsMTUgNy41LDE1IEM1LjgwNTAyOTc4LDE1IDQuMjQ0MjA3MDIsMTQuNDQwMzczNCAzLjAwMTUzODc4LDEzLjUwMDQwOTMgQzMuMDAwNTE1MDMsMTMuNDYxOTMyNiAzLDEzLjQyMzMzMjYgMywxMy4zODQ2MTU0IEMzLDEwLjk2MzA1OTIgNS4wMTQ3MTg2Myw5IDcuNSw5IEM5Ljk4NTI4MTM3LDkgMTIsMTAuOTYzMDU5MiAxMiwxMy4zODQ2MTU0IEMxMiwxMy40MjMzMzI2IDExLjk5OTQ4NSwxMy40NjE5MzI2IDExLjk5ODQ2MTIsMTMuNTAwNDA5MyBaIiBpZD0icGF0aC0zIj48L3BhdGg+CiAgICAgICAgPG1hc2sgaWQ9Im1hc2stNCIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSI5IiBoZWlnaHQ9IjYiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0zIj48L3VzZT4KICAgICAgICA8L21hc2s+CiAgICAgICAgPGNpcmNsZSBpZD0icGF0aC01IiBjeD0iNy41IiBjeT0iNi45IiByPSIyLjciPjwvY2lyY2xlPgogICAgICAgIDxtYXNrIGlkPSJtYXNrLTYiIG1hc2tDb250ZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBtYXNrVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiB4PSIwIiB5PSIwIiB3aWR0aD0iNS40IiBoZWlnaHQ9IjUuNCIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPgogICAgICAgIDwvbWFzaz4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJuZXciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJHcm91cC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTguMDAwMDAwLCAtNzYuMDAwMDAwKSIgc3Ryb2tlPSIjMDBCMUIwIiBzdHJva2Utd2lkdGg9IjEuOTM1NDgzODciPgogICAgICAgICAgICA8ZyBpZD0iaV91c2VyX2FjdGl2ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTguMDAwMDAwLCA3Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDx1c2UgaWQ9Ik92YWwtMjIwIiBtYXNrPSJ1cmwoI21hc2stMikiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPHVzZSBpZD0iQ29tYmluZWQtU2hhcGUiIG1hc2s9InVybCgjbWFzay00KSIgeGxpbms6aHJlZj0iI3BhdGgtMyI+PC91c2U+CiAgICAgICAgICAgICAgICA8dXNlIGlkPSJPdmFsLTIyMC1Db3B5IiBtYXNrPSJ1cmwoI21hc2stNikiIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=) no-repeat;}',
            '#HeaderABC #abcinfo .drop-holder .profile-link .profile-link-label', '{float:left;}',

            '#HeaderABC #abcinfo .drop-holder .profile-link-return', '{display:none;background-color:#fff;color:#808080;overflow:hidden;padding:8px 20px;line-height:30px;cursor:pointer;}',
            '#HeaderABC #abcinfo .drop-holder .profile-link-return .profile-link-icon', '{float:left;width:20px;height:20px;margin:8px 10px 0 0;background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTUgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQxICgzNTMyNikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aV9yZXR1cm48L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iR3JvdXAtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwLjAwMDAwMCwgLTEyMi4wMDAwMDApIiBmaWxsPSIjODA4MDgwIj4KICAgICAgICAgICAgPGcgaWQ9ImlfcmV0dXJuIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMC4wMDAwMDAsIDEyMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cCI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IkNvbWJpbmVkLVNoYXBlIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTcuNDIyODk0MTQsNS4zODE3NDM3NCBDNy45MDY4MzgyMiw0LjgxNTA2MDgzIDguMjAzNDQ5MTEsNC4wODY0Njg1MiA4LjIwMzQ0OTExLDMuMjc2OTIxNTEgQzguMjAzNDQ5MTEsMS41MjgyOTk5NyA2LjgyOTY3MjM2LDAuMTAzNDk3MjI4IDUuMTQzNjczNjMsMC4xMDM0OTcyMjggQzMuNDU3Njc0ODksMC4xMDM0OTcyMjggMi4wNjgyODcwNSwxLjUxMjEwOTAzIDIuMDY4Mjg3MDUsMy4yNzY5MjE1MSBDMi4wNjgyODcwNSw0LjA4NjQ2ODUyIDIuMzY0ODk3OTQsNC44MTUwNjA4MyAyLjg0ODg0MjAyLDUuMzgxNzQzNzQgQzEuNjE1NTY1MTcsNS45MzIyMzU3MSAwLjc0MTM0MzU5OSw3LjIxMTMxOTk5IDAuNzQxMzQzNTk5LDguNjg0Njk1NTUgTDAuNzQxMzQzNTk5LDEwLjU5NTIyNjUgQzAuNzQxMzQzNTk5LDEwLjgyMTg5OTcgMC45MTMwNjU2OTMsMTEgMS4xMzE2MjEwOCwxMSBMOS4xNDAxMTUwNywxMSBDOS4zNTg2NzA0NiwxMSA5LjUzMDM5MjU2LDEwLjgyMTg5OTcgOS41MzAzOTI1NiwxMC41OTUyMjY1IEw5LjUzMDM5MjU2LDguNjg0Njk1NTUgQzkuNTMwMzkyNTYsNy4xOTUxMjkwNSA4LjY1NjE3MDk5LDUuOTE2MDQ0NzcgNy40MjI4OTQxNCw1LjM4MTc0Mzc0IEw3LjQyMjg5NDE0LDUuMzgxNzQzNzQgWiBNOC43NDk4Mzc1OSwxMC4xOTA0NTMgTDEuNTIxODk4NTcsMTAuMTkwNDUzIEwxLjUyMTg5ODU3LDguNjg0Njk1NTUgQzEuNTIxODk4NTcsNy4zODk0MjAzMyAyLjM4MDUwOTA0LDYuMjg4NDM2MzkgMy41NTEzNDE0OSw1Ljk5Njk5OTQ3IEM0LjAxOTY3NDQ3LDYuMjg4NDM2MzkgNC41NTA0NTE4NSw2LjQ2NjUzNjc0IDUuMTI4MDYyNTMsNi40NjY1MzY3NCBDNS43MDU2NzMyMSw2LjQ2NjUzNjc0IDYuMjUyMDYxNjgsNi4yODg0MzYzOSA2LjcwNDc4MzU3LDUuOTk2OTk5NDcgQzcuODc1NjE2MDIsNi4zMDQ2MjczMyA4LjczNDIyNjQ5LDcuMzg5NDIwMzMgOC43MzQyMjY0OSw4LjY4NDY5NTU1IEw4LjczNDIyNjQ5LDEwLjE5MDQ1MyBMOC43NDk4Mzc1OSwxMC4xOTA0NTMgWiBNMi44NDg4NDIwMiwzLjI3NjkyMTUxIEMyLjg0ODg0MjAyLDEuOTY1NDU1MzUgMy44NzkxNzQ1OCwwLjkxMzA0NDIzOSA1LjEyODA2MjUzLDAuOTEzMDQ0MjM5IEM2LjM5MjU2MTU4LDAuODk2ODUzMjk5IDcuNDIyODk0MTQsMS45NjU0NTUzNSA3LjQyMjg5NDE0LDMuMjc2OTIxNTEgQzcuNDIyODk0MTQsNC41ODgzODc2NyA2LjM5MjU2MTU4LDUuNjQwNzk4NzkgNS4xNDM2NzM2Myw1LjY0MDc5ODc5IEMzLjg3OTE3NDU4LDUuNjQwNzk4NzkgMi44NDg4NDIwMiw0LjU3MjE5NjczIDIuODQ4ODQyMDIsMy4yNzY5MjE1MSBaIE0xNC40MTY2NjY3LDMuMDM0MDU3NDEgTDE0LjQxNjY2NjcsMi45NTMxMDI3MSBDMTQuNDE2NjY2NywyLjkzNjkxMTc3IDE0LjQxNjY2NjcsMi45MzY5MTE3NyAxNC40MDEwNTU2LDIuOTIwNzIwODMgQzE0LjQwMTA1NTYsMi45MDQ1Mjk4OSAxNC40MDEwNTU2LDIuODg4MzM4OTUgMTQuMzg1NDQ0NSwyLjg3MjE0ODAxIEMxNC4zODU0NDQ1LDIuODU1OTU3MDcgMTQuMzY5ODMzNCwyLjgzOTc2NjEzIDE0LjM2OTgzMzQsMi44Mzk3NjYxMyBDMTQuMzY5ODMzNCwyLjgyMzU3NTE5IDE0LjM1NDIyMjMsMi44MjM1NzUxOSAxNC4zNTQyMjIzLDIuODA3Mzg0MjUgQzE0LjMzODYxMTIsMi43OTExOTMzMSAxNC4zMjMwMDAxLDIuNzU4ODExNDIgMTQuMzA3Mzg5LDIuNzQyNjIwNDggTDEzLjE4MzM4OTgsMS41NzY4NzI3OSBDMTMuMDI3Mjc4OCwxLjQxNDk2MzM5IDEyLjc3NzUwMTIsMS40MTQ5NjMzOSAxMi42MzcwMDEzLDEuNTc2ODcyNzkgQzEyLjQ4MDg5MDMsMS43Mzg3ODIxOSAxMi40ODA4OTAzLDEuOTk3ODM3MjMgMTIuNjM3MDAxMywyLjE0MzU1NTcgTDEzLjEwNTMzNDMsMi42MjkyODM5IEw5LjU5MjgzNjk1LDIuNjI5MjgzOSBDOS4zNzQyODE1NiwyLjYyOTI4MzkgOS4yMDI1NTk0NywyLjgwNzM4NDI1IDkuMjAyNTU5NDcsMy4wMzQwNTc0MSBMOS4yMDI1NTk0Nyw0LjY4NTUzMzMxIEM5LjIwMjU1OTQ3LDQuOTEyMjA2NDcgOS4zNzQyODE1Niw1LjA5MDMwNjgyIDkuNTkyODM2OTUsNS4wOTAzMDY4MiBDOS44MTEzOTIzNSw1LjA5MDMwNjgyIDkuOTgzMTE0NDQsNC45MTIyMDY0NyA5Ljk4MzExNDQ0LDQuNjg1NTMzMzEgTDkuOTgzMTE0NDQsMy40Mzg4MzA5MSBMMTMuMDc0MTEyMSwzLjQzODgzMDkxIEwxMi42MDU3NzkxLDMuOTI0NTU5MTIgQzEyLjQ0OTY2ODEsNC4wODY0Njg1MiAxMi40NDk2NjgxLDQuMzQ1NTIzNTcgMTIuNjA1Nzc5MSw0LjQ5MTI0MjAzIEMxMi42ODM4MzQ2LDQuNTcyMTk2NzMgMTIuNzc3NTAxMiw0LjYwNDU3ODYxIDEyLjg4Njc3ODksNC42MDQ1Nzg2MSBDMTIuOTk2MDU2Niw0LjYwNDU3ODYxIDEzLjA4OTcyMzIsNC41NzIxOTY3MyAxMy4xNjc3Nzg3LDQuNDkxMjQyMDMgTDE0LjI5MTc3NzksMy4zMjU0OTQzMyBDMTQuMzA3Mzg5LDMuMzA5MzAzMzkgMTQuMzIzMDAwMSwzLjI5MzExMjQ1IDE0LjMzODYxMTIsMy4yNjA3MzA1NyBDMTQuMzM4NjExMiwzLjI0NDUzOTYzIDE0LjM1NDIyMjMsMy4yNDQ1Mzk2MyAxNC4zNTQyMjIzLDMuMjI4MzQ4NjkgQzE0LjM1NDIyMjMsMy4yMTIxNTc3NSAxNC4zNjk4MzM0LDMuMTk1OTY2ODEgMTQuMzY5ODMzNCwzLjE5NTk2NjgxIEMxNC4zNjk4MzM0LDMuMTc5Nzc1ODcgMTQuMzY5ODMzNCwzLjE2MzU4NDkzIDE0LjM4NTQ0NDUsMy4xNjM1ODQ5MyBDMTQuMzg1NDQ0NSwzLjE0NzM5Mzk5IDE0LjM4NTQ0NDUsMy4xNDczOTM5OSAxNC40MDEwNTU2LDMuMTMxMjAzMDUgQzE0LjQwMTA1NTYsMy4wODI2MzAyMyAxNC40MTY2NjY3LDMuMDY2NDM5MjkgMTQuNDE2NjY2NywzLjAzNDA1NzQxIFoiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) no-repeat;}',
            '#HeaderABC #abcinfo .drop-holder .profile-link-return .profile-link-return-label', '{float:left;}',
            '#HeaderABC #abcinfo .drop-holder.under-other-user .profile-link-return', '{display:block;}',
            '#HeaderABC #abcinfo .drop-holder.under-other-user .profile-roles', '{display:none;}',
            '#HeaderABC #abcinfo .drop-holder.under-other-user .profile-search', '{display:none;}',

            '#HeaderABC #abcinfo .drop-holder .profile-delegates', '{background-color:#fff;}',
            '#HeaderABC #abcinfo .drop-holder .profile-delegates > div', '{display:block;overflow:hidden;padding:8px 20px;line-height:30px;cursor:pointer;}',
            '#HeaderABC #abcinfo .drop-holder .profile-delegates > div:hover', '{background-color:#f3f4f3;}',
            '#HeaderABC #abcinfo .img-wrapper', '{width:30px;height:30px;float:left;border-radius: 50%;overflow: hidden;position:relative;}',
            '#HeaderABC #abcinfo .no-pic', '{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIzMHB4IiBoZWlnaHQ9IjMwcHgiIHZpZXdCb3g9IjAgMCAzMCAzMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5DNjk0NTlGNi0wRjM4LTRBNzktQjQ3Ny0yRTJFOUY5Mzg3NDQ8L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+ICAgIDxkZWZzPiAgICAgICAgPGNpcmNsZSBpZD0icGF0aC0xIiBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiPjwvY2lyY2xlPiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0id2hpdGUiPiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+ICAgICAgICA8L21hc2s+ICAgICAgICA8cGF0aCBkPSJNMjMuOTk2OTIyNCwyNy4wMDA4MTg1IEMyMS41MTE1ODYsMjguODgwNzQ2OSAxOC4zODk5NDA0LDMwIDE1LDMwIEMxMS42MTAwNTk2LDMwIDguNDg4NDE0MDQsMjguODgwNzQ2OSA2LjAwMzA3NzU2LDI3LjAwMDgxODUgQzYuMDAxMDMwMDYsMjYuOTIzODY1MiA2LDI2Ljg0NjY2NTIgNiwyNi43NjkyMzA4IEM2LDIxLjkyNjExODMgMTAuMDI5NDM3MywxOCAxNSwxOCBDMTkuOTcwNTYyNywxOCAyNCwyMS45MjYxMTgzIDI0LDI2Ljc2OTIzMDggQzI0LDI2Ljg0NjY2NTIgMjMuOTk4OTY5OSwyNi45MjM4NjUyIDIzLjk5NjkyMjQsMjcuMDAwODE4NSBaIiBpZD0icGF0aC0zIj48L3BhdGg+ICAgICAgICA8bWFzayBpZD0ibWFzay00IiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjEyIiBmaWxsPSJ3aGl0ZSI+ICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0zIj48L3VzZT4gICAgICAgIDwvbWFzaz4gICAgICAgIDxlbGxpcHNlIGlkPSJwYXRoLTUiIGN4PSIxNSIgY3k9IjEzLjgiIHJ4PSI1LjQiIHJ5PSI1LjQiPjwvZWxsaXBzZT4gICAgICAgIDxtYXNrIGlkPSJtYXNrLTYiIG1hc2tDb250ZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBtYXNrVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAuOCIgaGVpZ2h0PSIxMC44IiBmaWxsPSJ3aGl0ZSI+ICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC01Ij48L3VzZT4gICAgICAgIDwvbWFzaz4gICAgPC9kZWZzPiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJTdWJtaXR0ZWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMjAzLjAwMDAwMCwgLTE2LjAwMDAwMCkiIHN0cm9rZT0iIzk3OTc5NyIgc3Ryb2tlLXdpZHRoPSIzLjIyNTgwNjQ1Ij4gICAgICAgICAgICA8ZyBpZD0ibm9hdmF0YXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMDMuMDAwMDAwLCAxNi4wMDAwMDApIj4gICAgICAgICAgICAgICAgPHVzZSBpZD0iT3ZhbC0yMjAiIG1hc2s9InVybCgjbWFzay0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+ICAgICAgICAgICAgICAgIDx1c2UgaWQ9IkNvbWJpbmVkLVNoYXBlIiBtYXNrPSJ1cmwoI21hc2stNCkiIHhsaW5rOmhyZWY9IiNwYXRoLTMiPjwvdXNlPiAgICAgICAgICAgICAgICA8dXNlIGlkPSJPdmFsLTIyMC1Db3B5IiBtYXNrPSJ1cmwoI21hc2stNikiIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==) no-repeat;}',
            '#HeaderABC #abcinfo .user-name', '{padding:0 0 0 10px;line-height: 30px;color:#808080;font:13px/24px "Droid Sans",Arial,sans-serif;}',

            '#HeaderABC #abcinfo .drop-holder .profile-roles', '{background-color:#fff;color:#808080;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder', '{overflow:hidden;font:13px/40px "Droid Sans",Arial,sans-serif;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .heading', '{font-weight:700;overflow:hidden;padding: 0 13px 0 23px; white-space: nowrap;display: block; height: 40px;text-transform:uppercase;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role', '{cursor:pointer;display:block; height: 40px; padding: 0 13px 0 23px; white-space: nowrap;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role em', '{display:none;font-style:normal;margin:0 10px 0 0;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role span', '{}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role.active', '{overflow:hidden;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role.active em', '{display:inline-block;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role.active span', '{font-weight:700;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role:hover', '{background-color: #00b1b0;color: #fff;}',

            '#HeaderABC #abcinfo .drop-holder .profile-search', '{background-color: #f9f9f9;color:#808080;border-top:1px solid #d4d0d4;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder', '{font:13px/40px "Droid Sans",Arial,sans-serif;padding:0 20px 20px 20px;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .heading', '{font-weight:700;overflow:hidden;white-space: nowrap;display: block; height: 40px;text-transform:uppercase;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box ', '{width: auto; background: #fff; padding: 0 30px 0 0px;-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; position: relative; width: 190px; height: 25px; border: 1px solid #d4d0d4; padding: 4px 30px 4px 8px; box-sizing: border-box;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box input ', '{float:left;width: 100%; height: 16px; padding: 0 5px 0 7px; border: 0; padding: 0; width: 100%; font:13px/16px "Droid Sans",Arial,sans-serif;color:#808080;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box input:focus', '{outline: none;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box button ', '{float: right; text-decoration: none; width: 25px; height: 23px; text-align: center; outline: none; position: absolute; right: 5px; top: 1px; z-index: 2; border: 0; padding: 0; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box button.search ', '{text-indent: -9999px; overflow: hidden; text-decoration: none; display: block; text-align: left; background: #fff url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEycHgiIGhlaWdodD0iMTJweCIgdmlld0JveD0iMCAwIDEyIDEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMzkuMSAoMzE3MjApIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPkYwQjM3NTE2LTU0RkUtNEU1RS04NTYxLTBGMUMyMERCREY2OTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iVXNlci1yb2xlLWRyb3Bkb3duIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAxNC4wMDAwMDAsIC00MDQuMDAwMDAwKSIgZmlsbD0iIzNGNTQ1RiI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0xMS1Db3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4MzIuMDAwMDAwLCA1OS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOTAuMTY0MzY2LDM1My44NzE0NzMgQzE4OS4zMDI0MzEsMzU0LjU3NjgxNyAxODguMjAwNjM1LDM1NSAxODcsMzU1IEMxODQuMjM4NTc2LDM1NSAxODIsMzUyLjc2MTQyNCAxODIsMzUwIEMxODIsMzQ3LjIzODU3NiAxODQuMjM4NTc2LDM0NSAxODcsMzQ1IEMxODkuNzYxNDI0LDM0NSAxOTIsMzQ3LjIzODU3NiAxOTIsMzUwIEMxOTIsMzUxLjIwMDYzNSAxOTEuNTc2ODE3LDM1Mi4zMDI0MzEgMTkwLjg3MTQ3MywzNTMuMTY0MzY2IEwxOTMuNjIxMzIsMzU1LjkxNDIxNCBMMTkyLjkxNDIxNCwzNTYuNjIxMzIgTDE5MC4xNjQzNjYsMzUzLjg3MTQ3MyBaIE0xODkuNDUyODIyLDM1My4xNTk5MjkgQzE4OC43NzU0OCwzNTMuNjg2NDU5IDE4Ny45MjQzNTYsMzU0IDE4NywzNTQgQzE4NC43OTA4NjEsMzU0IDE4MywzNTIuMjA5MTM5IDE4MywzNTAgQzE4MywzNDcuNzkwODYxIDE4NC43OTA4NjEsMzQ2IDE4NywzNDYgQzE4OS4yMDkxMzksMzQ2IDE5MSwzNDcuNzkwODYxIDE5MSwzNTAgQzE5MSwzNTAuOTI0MzU2IDE5MC42ODY0NTksMzUxLjc3NTQ4IDE5MC4xNTk5MjksMzUyLjQ1MjgyMiBMMTkwLjA4NTc4NiwzNTIuMzc4NjggTDE4OS4zNzg2OCwzNTMuMDg1Nzg2IEwxODkuNDUyODIyLDM1My4xNTk5MjkgWiIgaWQ9Imlfc2VhcmNoIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) no-repeat 50% 50%; width: 20px; height: 20px; position: absolute; top: 1px; right: 2px; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .no-match ', '{display: none;cursor: default;padding:14px 0 0;font:13px/16px "Droid Sans",Arial,sans-serif;color: #b2b4b2;}',

            '#HeaderABC #abcinfo .drop-holder .profile-search.has-others .profile-search-holder .dropdown-menu ', '{display:block;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search.no-others .profile-search-holder .no-match ', '{display:block;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu ', '{display:none;font:12px/13px "Droid Sans",Arial,sans-serif; position: static; border: none; box-shadow: none; border-radius: 0; background-color: #f9f9f9; padding: 0; max-height: none !important; margin: 10px 0 0px -21px; width: 230px;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li ', '{cursor: pointer; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .role ', '{display: block; height: 40px; padding: 5px 13px 5px 23px; box-sizing: border-box; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .role:hover ', '{background-color: #00b1b0; color: #fff; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .role:hover .user-name', '{color: #fff; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .role .user-name ', '{padding:0;font: 700 13px/16px "Droid Sans",Arial,sans-serif; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; height: 15px; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li.typeahead-no-matches ', '{cursor: default; padding: 0 20px 10px 20px; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .search-user-info ', '{float: left; width: 190px; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .search-user-info .name ', '{font:12px/18px "Droid Sans",Arial,sans-serif; font-weight:700; display: block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .search-user-info .role ', '{font:11px "Droid Sans",Arial,sans-serif; display: block; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li.active ', '{background-color: #00b2b0; color: #fff; }',

            '#HeaderABC .clearfix:after', '{content:" ";display:table}',
            '#HeaderABC .clearfix:before', '{content:" ";display:table}',
            '#HeaderABC .hide-text', '{text-indent:-9999px;font-size:0}',
            '#HeaderABC .clearfix:after', '{clear:both}',
            '#HeaderABC-overlay', '{display:none;background-color:#fff;opacity:0;z-index:9;position:fixed;top:0;right:0;bottom:0;left:0;outline:none;}',
            '#HeaderABC-overlay.outer-opened', '{display:block;z-index:11}',
            '#HeaderABC-overlay.opened', '{display:block}',
            '#ABCouter-wrapper', '{-webkit-transition: height .2s, margin-top .2s;-moz-transition: height .2s, margin-top .2s;-ms-transition: height .2s, margin-top .2s;-o-transition: height .2s, margin-top .2s;transition:height .2s, margin-top .2s;transition-timing-function: ease-in;}',
            '#ABCouter-wrapper', '{position: fixed;width: 640px;height: 300px;top:62px;left:calc(50% - 320px);z-index: 5000;display:none;margin: 0;box-sizing: border-box;}',
            '#ABCouter-wrapper .content', '{position: relative;width: 100%;height: 100%;background: #fff;box-sizing: border-box;background: #fff;box-shadow: 0 10px 30px 0 rgba(39, 49, 55, 0.6);}',
            '#ABCouter-wrapper .content .loading-animation', '{position: absolute; left: 0; top: 0; z-index: 10; width: 640px; height: 300px; background-color: rgba(255, 255, 255, .7);}',
            '#ABCouter-wrapper .content .loading-animation .spinner', '{position: relative; display: block; left: 50%; top: 50%;}',
            '#ABCouter-wrapper .content .loading-animation .spinner span', '{display: block; height: 4px; width: 4px; background: #3f545f; border-radius: 50%; position: absolute; top: 0px; padding: 0;}',
            '#ABCouter-wrapper .content .loading-animation .spinner span:nth-child(1)', '{left: -8px; -webkit-animation: bounce 0.8s ease-in-out infinite; -moz-animation: bounce 0.8s ease-in-out infinite; animation: bounce 0.8s ease-in-out infinite;}',
            '#ABCouter-wrapper .content .loading-animation .spinner span:nth-child(2)', '{-webkit-animation: bounce 0.8s ease-in-out 0.26s infinite; -moz-animation: bounce 0.8s ease-in-out 0.26s infinite; animation: bounce 0.8s ease-in-out 0.26s infinite;}',
            '#ABCouter-wrapper .content .loading-animation .spinner span:nth-child(3)', '{left: 8px; -webkit-animation: bounce 0.8s ease-in-out 0.52s infinite; -moz-animation: bounce 0.8s ease-in-out 0.52s infinite; animation: bounce 0.8s ease-in-out 0.52s infinite;}',
            '#ABCouter-wrapper .content iframe', '{position:relative;width:100%;height:100%;}',
            '#ABCouter-wrapper.opened', '{display:block}',
            '#ABCouter-wrapper.agreement', '{width:640px;height:310px;margin:0 !important;top:62px;left:calc(50% - 320px);}',
            '#ABCouter-wrapper.profile', '{width:960px;height:530px!important;margin:0 !important;top:62px;left:calc(50% - 480px);}',
            '#ABCouter-wrapper.agreement .loading-animation, #ABCouter-wrapper.profile .loading-animation', '{display: none}'
        ];
    }

    function getMainTemplate() {
        return '<div class="header-wrapper clearfix" tabindex="-1">' +
                    '<a href="#" class="logo"></a>' +
                    '<div id="abcprofile">' +
                        '<div id="abcavatar"></div>' +
                        '<div id="abcinfo"></div>' +
                    '</div>' +
                    '<div id="abcmenu"></div>' +
                '</div>' +
                '<div id="ABCouter-wrapper" tabindex="-1"><div class="content"></div></div>' +
                '<div id="HeaderABC-overlay" tabindex="-1"></div>';
    }

    function intializeExpenseNow() {
        if (!!window.angular && !HeaderABC.ExpenseNowInitialized) {
            triggerScope(['header:init']);
            HeaderABC.element.find('.logo').html('Expenses');
            HeaderABC.ExpenseNowInitialized = true;
        }
    }

    function triggerScope(events, assignments) {
        if (!!window.angular) {
            var injector = angular.element(document.body).injector();
            var F = function ($rootScope) {
                for (var key in assignments) {
                    if (assignments.hasOwnProperty(key)) {
                        $rootScope[key] = assignments[key];
                    }
                }
                events.forEach(function (event) {
                    $rootScope.$broadcast(event);
                });
            };
            F.$inject = ['$rootScope'];
            injector.invoke(F, null, null);
        }
    }

    function ABC(element) {
        if (!element) {
            return;
        }
        return new ABC.init(element);
    }

    function Component(settings){
        var required = ['element', 'model', 'events', 'template', 'render'];
        var keys = Object.keys(settings);

        if (!settings.hasOwnProperty.apply(settings, required)) {
            return;
        }

        this.element = settings.element;
        this.model = settings.model;
        this.events = settings.events;
        this.template = settings.template;
        this.render = settings.render;

        for (var key in settings) {
            if(settings.hasOwnProperty(key) && !~required.indexOf(key)){
                this[key] = settings[key];
            }
        }
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
    };

    ABC.init = function (element) {
        this.element = ABC.Element(element);
    };

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
        closest: function (selector) {
            var regEx = {
                byClassName: /\.[A-Za-z0-9]+/,
                byId: /\#[A-Za-z0-9]+/,
                byTag: /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/
            };
            var attrs = {
                byClassName: 'className',
                byId: 'id',
                byTag: 'tagName'
            };

            var attr = bySelector(selector);

            function bySelector(selector) {
                for (var key in regEx) {
                    if (regEx[key].test(selector)) {
                        return attrs[key];
                    }
                }
            }


            selector = attr !== 'tagName' ? selector.substr(1) : selector;

            while (this.element) {
                if (this.element[attr].toLowerCase() === selector) {
                    break;
                }
                this.element = this.element.parentElement;
            }
            return this.element;
        },
        delegate: function (element, event, handler) {
            var _this = this;
            this.element['on' + event] = function (e) {
                var node = ABC(e.target).closest(element);
                if (node) {
                    handler(e, node, node.dataset);
                }
            };
        },
        on: function (event, handler) {
            if (!event) {
                return;
            }
            this.element.addEventListener(event, function (e) {
                handler(e);
            });
        },
        off: function (event) {
            if (!event) {
                return;
            }
            this.element.removeEventListener(event);
        },
        find: function (selector) {
            var element = ABC.Element(selector, this.element);
            return element === null ? this.element : (!!element.length) ? ABC(element[0]) : ABC(element);
        },
        addClass: function (className) {
            if (this.element.classList) {
                this.element.classList.add(className);
            } else if (!this.hasClass(className)) {
                this.element.className += ' ' + className;
            }
            return this;
        },
        removeClass: function (className) {
            if (this.element.classList) {
                this.element.classList.remove(className);
            } else if (this.hasClass(className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                this.element.className = this.element.className.replace(reg, ' ');
            }
            return this;
        },
        hasClass: function (className) {
            if (this.element.classList) {
                return this.element.classList.contains(className);
            } else {
                return !!this.element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
            }
        },
        html: function (html) {
            this.element.innerHTML = html;
            return this;
        },
        get: function () {
            return this.element;
        },
        val: function (value) {
            if (value === '' || !!value) {
                this.element.value = value;
            }
            return this.element.value;
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

    ABC.returnNull = function () {
        return null;
    };

    ABC.Component = (function () {
        var cache = {};

        function update(instance, settings){
            var required = ['model', 'template'];

            if (!settings.hasOwnProperty.apply(settings, required)) {
                return;
            }

            instance.model = settings.model;
            instance.template = settings.template;
        }

        function init(settings) {
            if(settings.hasOwnProperty('name')){
                if(!cache.hasOwnProperty(settings.name)){
                    cache[settings.name] = new Component(settings);
                } else {
                    update(cache[settings.name], settings);
                    if (!cache[settings.name].hasOwnProperty('_render')) {
                        cache[settings.name]._render = cache[settings.name].render;
                    }
                    cache[settings.name].render = cache[settings.name].hasOwnProperty('update') ? cache[settings.name].update : cache[settings.name]._render;
                }

                return cache[settings.name];
            }
        }

        return function (settings) {
            return init(settings);
        };
    })();

    ABC.Events = (function () {
        var channels = {};
        var hop = channels.hasOwnProperty;

        return {
            subscribe: function (name, handler) {
                if (!hop.call(channels, name)) {
                    channels[name] = [];
                }
                channels[name].push(handler);
            },
            publish: function (name, extra) {
                if (!hop.call(channels, name)) {
                    return;
                }
                channels[name].forEach(function (handler) {
                    handler(extra);
                });
            }
        };
    })();

    ABC.Template = function (html) {
        return function (obj) {
            var key, text = '';
            if (ABC.isArray(obj)) {
                obj.forEach(function (item) {
                    text += html.replace(/\|([a-z]+)*\|/gim, function (match, key) {
                        return item[key];
                    });
                });
                return text;
            } else if (ABC.isObject(obj)) {
                return html.replace(/\|([a-z]+)*\|/gim, function (match, key) {
                    return obj[key];
                });
            }
        };
    };

    ABC.Element = function (selector, parentNode) {
        if (!ABC.isQuerySelector(selector)) {
            return selector;
        }
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
        };

        function checkSelector(selector) {
            for (var key in regEx) {
                if (regEx[key].test(selector)) {
                    return api[key](selector, parentNode);
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

        return checkSelector(selector, parentNode);
    };

    ABC.isNodeElement = function (element) {
        return !!~[1, 2, 3, 8].indexOf(element.nodeType);
    };

    ABC.isQuerySelector = function (element) {
        return !ABC.isNodeElement(element) && !~['number', 'boolean'].indexOf(typeof element) && !(ABC.isArray(element) || ABC.isObject(element) || ABC.isFunction(element));
    };

    ABC.isJson = function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    ABC.regExpList = {
        rvalidchars: /^[\],:{}\s]*$/,
        rvalidbraces: /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape: /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens: /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g
    };

    ABC.defer = function () {
        return new Promise();
    };

    ABC.ajax = function (settings) {
        var request = {
            send: function () {
                var invocation = new XMLHttpRequest();
                var params = [(!!settings.method ? settings.method : 'get'), settings.url, true];
                var body = settings.data || '';

                invocation.open.apply(invocation, params);
                invocation.onreadystatechange = function () {
                    if (invocation.readyState !== 4) {
                        return;
                    }
                    if (invocation.status !== 200) {
                        if (ABC.isFunction(settings.error)) {
                            settings.error({ status: invocation.status, statusText: invocation.statusText, headers: invocation.getAllResponseHeaders() });
                        }
                        return;
                    }
                    processResult();
                };
                invocation.withCredentials = true;
                if (settings.contentType && settings.contentType.toLocaleLowerCase() === 'json') {
                    invocation.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                }
                invocation.send(body);

                function processResult() {
                    if (ABC.isFunction(settings.success)) {
                        settings.success(invocation.responseText);
                    }
                }
            }
        };
        request.send();
    };

    ABC.localpath = function () {
        return window.location.hostname + window.location.pathname;
    };

    ABC.clearSlashes = function (path) {
        return path.replace(/\//g, '');
    };

    ABC.capitalize = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    ABC.ready = function (callback) {
        window.document.addEventListener('DOMContentLoaded', function (event) {
            if (!!callback && typeof callback === 'function') {
                callback(event);
            }
        });
    };

    ABC.windowOnLoad = function (callback) {
        window.addEventListener('load', function (event) {
            if (!!callback && typeof callback === 'function') {
                callback(event);
            }
        });
    };

    ABC.windowOnResize = function (callback) {
        window.addEventListener('resize', function (event) {
            if (!!callback && typeof callback === 'function') {
                callback(event);
            }
        });
    };

    ABC.ready(function () {
        HeaderABC.initialize();
    });

    window.addEventListener('message', receiveMessage, false);

    window.HeaderABC = HeaderABC;

})(window);