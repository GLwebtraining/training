(function (window) {
    'use strict';

    var document = window.document;
    var appState = null;

    var HeaderABC = {
        define: function () {
            this.isHtmlGenerated = false;
            this.isCssGenerated = false;
            this.progressDone = this.generated();
            this.ready();
        },
        settings: {
            userName: 'User',
            isExpenseNow: false,
            url: {
                menu: null,
                upm: null
            },
            path: {
                info: 'api/user/info',
                auth: 'auth/hidden',
                setRole: 'api/user/setCurrentUserRole'
            },
            suggestion: {
                path: 'api/suggestion/delegate',
                count: 10
            },
            avatar: {
                path: 'api/picture/get/useravatar/small/',
                id: null
            }
        },
        component: {
            rootNode: '#HeaderABC',
            menu: function (element, data) {
                return ABC.Component({
                    name: 'globalMenu',
                    element: element,
                    model: data,
                    template: '<li><a href="|url|">|name|</a></li>',
                    events: {
                        'click': 'toggleMenu'
                    },
                    render: function () {
                        this.$el.innerHtml('<span class="icon"></span><div class="list-wrapper"><ul class="list">' + ABC.Template(this.template)(this.model) + '</ul></div>');
                    },
                    toggleMenu: function (e) {
                        if (!this.model.fallback) {
                            ABC.Events.publish('user-drop:hide');
                        }
                        ABC.Events.publish('menu:' + (ABC(e.currentTarget).hasClass('active') ? 'hide' : 'show'));
                    }
                });
            },
            userDelegates: function (element, data) {
                data.forEach(function (item) {
                    if (item.avatarId !== null) {
                        item.src = HeaderABC.settings.url.upm + '/' + HeaderABC.settings.avatar.path + item.avatarId;
                    } else {
                        item.src = '#';
                    }
                });

                return ABC.Component({
                    name: 'userDelegates',
                    element: element,
                    model: data,
                    template: '<div class="avatar-holder" data-role="|roleName|" data-id="|externalId|" data-model-name="|userName|"><div class="img-wrapper"><img src="|src|" /></div><span class="user-name">|userName|</span></div>',
                    events: {
                        'load img': 'showDelegateImg',
                        'error img': 'hideDelegateImg',
                        'click .avatar-holder': 'applyDelegate'
                    },
                    render: function () {
                        this.$el.innerHtml(ABC.Template(this.template)(this.model));
                    },
                    showDelegateImg: function (e) {
                        ABC(e.target.parentNode).removeClass('no-pic');
                    },
                    hideDelegateImg: function (e) {
                        if (e.target.parentNode) {
                            ABC(e.target.parentNode).addClass('no-pic');
                            e.target.parentNode.removeChild(e.target);
                        }
                    },
                    applyDelegate: function (event, node, dataset) {
                        ABC.Events.publish('user-drop:hide');
                        ABC.Events.publish('delegate:apply', { roleName: dataset.role, name: dataset.role, externalId: dataset.id });
                    }
                });
            },
            avatar: function (element, data) {
                var template = '<div class="avatar-holder"><div class="img-wrapper"><img src="|src|" /></div><div class="user-holder"><span class="user-name"><em>|username|</em></span>' + (!!data[0].category ? '<span class="category"><em>|category|</em></span>' : '') + '</div></div>';
                return ABC.Component({
                    name: 'userPrimaryInfo',
                    element: element,
                    model: data,
                    template: template,
                    events: {
                        'load img': 'showImg',
                        'error img': 'hideImg',
                        'click': 'showProfile'
                    },
                    render: function () {
                        this.$el.innerHtml(ABC.Template(this.template)(this.model));
                    },
                    showImg: function (e) {
                        ABC(e.target.parentNode).removeClass('no-pic');
                    },
                    hideImg: function (e) {
                        if (e.target.parentNode) {
                            ABC(e.target.parentNode).addClass('no-pic');
                            e.target.parentNode.removeChild(e.target);
                        }
                    },
                    showProfile: function () {
                        ABC.Events.publish('menu:hide');
                        ABC.Events.publish('profile:show');
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
                    events: {
                        'click .drop-trigger': 'toggleDrop'
                    },
                    render: function () {
                        this.$el.innerHtml(ABC.Template(this.template)(this.model));
                        this.update();
                        if (this.model.dropAllow) {
                            this.$el.addClass('has-delegates');
                        }
                    },
                    update: function () {
                        var underUser = !!HeaderABC.settings.onBehalfOf;
                        if (!appState.isDeactivated) {
                            if (underUser) {
                                if (this.model.hasAdminRole) {
                                    HeaderABC.component.profile('.profile-link', { label: (HeaderABC.settings.onBehalfOf.split(' ')[0] + '\'s User profile') }).render();
                                }
                                ABC.Events.publish('returnLink:show');
                            } else {
                                HeaderABC.component.profile('.profile-link', { label: 'User profile' }).render();
                                ABC.Events.publish('returnLink:hide');
                            }
                        } else if (appState.isDeactivated && underUser) {
                            ABC.Events.publish('returnLink:show');
                        }

                        if (!underUser && !!this.model.hasDelagates) {
                            HeaderABC.component.userDelegates('.profile-delegates', this.model.delegatedUsers).render();
                        } else {
                            this.$el.find('.profile-delegates').html('');
                        }
                        if (!underUser && !!this.model.hasRoles) {
                            HeaderABC.component.rolesList('.profile-roles', this.model.roles).render();
                        }
                        if (!underUser && !!this.model.searchAllow) {
                            HeaderABC.component.userSearch('.profile-search', {}).render();
                        }

                        HeaderABC.component.returnUser('.profile-link-return', { label: 'Return to my user' }).render();

                        ABC.Events.publish('otherUsersNoMatch:hide');
                        ABC.Events.publish('otherUsersDrop:hide');
                    },
                    toggleDrop: function () {
                        ABC.Events.publish('menu:hide');
                        ABC.Events.publish('user-drop:' + (this.$el.hasClass('open') ? 'hide' : 'show'));
                    }
                });
            },
            returnUser: function (element, data) {
                return ABC.Component({
                    name: 'returnUser',
                    element: element,
                    model: data,
                    template: '<span class="profile-link-icon"></span><span class="profile-link-return-label">|label|</span>',
                    events: {
                        'click': 'returnBack'
                    },
                    render: function () {
                        this.$el.innerHtml(ABC.Template(this.template)(this.model));
                    },
                    returnBack: function () {
                        var current = appState.loggedUser;
                        ABC.Events.publish('returnLink:hide');
                        ABC.Events.publish('user-drop:hide');
                        ABC.Events.publish('delegate:apply', { roleName: current.role, name: current.role, displayName: current.roleDisplayName, externalId: current.externalId });
                    }
                });
            },
            profile: function (element, data) {
                return ABC.Component({
                    name: 'profileLink',
                    element: element,
                    model: data,
                    template: '<span class="profile-link-icon"></span><span class="profile-link-label">|label|</span>',
                    events: {
                        'click .profile-link': 'openProfile'
                    },
                    render: function () {
                        this.$el.innerHtml(ABC.Template(this.template)(this.model));
                    },
                    openProfile: function () {
                        ABC.Events.publish('user-drop:hide');
                        ABC.Events.publish('profile:show');
                    }
                });
            },
            rolesList: function (element, data) {
                return ABC.Component({
                    name: 'roles',
                    element: element,
                    model: data,
                    template: '<div class="role" data-model-name="|name|" data-model-displayName="|displayName|"><em></em><span>|displayName|</span></div>',
                    events: {
                        'click .role': 'changeRole'
                    },
                    render: function () {
                        this.$el.innerHtml('<div class="profile-roles-holder"><strong class="heading">change role</strong>' + ABC.Template(this.template)(this.model) + '</div>');
                        this.setActive(this.element, appState.loggedUser.role);
                    },
                    changeRole: function (event, element, dataset) {
                        this.setActive(this.element, dataset.modelName);
                        ABC.Events.publish('user-drop:hide');
                        ABC.Events.publish('role:apply', { name: dataset.modelName, displayName: dataset.modelDisplayname });
                    },
                    setActive: function (rootEl, currentRole) {
                        var children = rootEl.children[0].children;
                        for (var i = 0; i < children.length; i++) {
                            var modelName = !!children[i].dataset ? children[i].dataset.modelName : children[i].getAttribute('data-model-name');
                            if (modelName === currentRole) {
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
                    events: {
                        'keyup input': 'autoSuggest',
                        'keyup': 'navigate'
                    },
                    render: function () {
                        this.$el.innerHtml(ABC.Template(this.template)(this.model));
                    },
                    navigationKeys: function (event) {
                        return event.keyCode === 38 || event.keyCode === 40;
                    },
                    validKeys: function (event) {
                        var disallowedKeyCodes = [9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145];

                        return disallowedKeyCodes.filter(function (code) {
                            return code === event.keyCode;
                        }).length === 0;
                    },
                    autoSuggest: ABC.throttle(function (event, element) {
                        if (!this.validKeys(event)) {
                            return;
                        }

                        var drop = HeaderABC.component.userSearch.drop;
                        var val = ABC(element).val();

                        if (!!val && val.length >= 3) {
                            HeaderABC.searchUser(val).then(function (usersObject) {
                                if (!!usersObject.items.length) {
                                    ABC.Events.publish('otherUsersNoMatch:hide');
                                    HeaderABC.component.userSearch.drop = HeaderABC.component.userSearchDrop('.dropdown-menu', usersObject);
                                    HeaderABC.component.userSearch.drop.render();
                                } else {
                                    ABC.Events.publish('otherUsersDrop:hide');
                                    ABC.Events.publish('otherUsersNoMatch:show');
                                }
                            });
                        } else if (!!val) {
                            hideDrops();
                        } else {
                            hideDrops();
                        }

                        function hideDrops() {
                            ABC.Events.publish('otherUsersNoMatch:hide');
                            ABC.Events.publish('otherUsersDrop:hide');
                            if (!!drop) {
                                drop.resetActive();
                            }
                        }
                    }, 300, { trailing: false }),
                    navigate: function (event, element) {
                        var drop = HeaderABC.component.userSearch.drop;
                        var select = event.keyCode === 13;
                        var up = event.keyCode === 38;
                        var down = event.keyCode === 40;

                        if (!(this.navigationKeys(event) || select) || !drop) {
                            return;
                        }

                        var dropElement = drop.element;
                        var roles = dropElement.children;
                        var active = drop.active;

                        if (!!roles && !!roles.length) {
                            if (select) {
                                drop.selectActive();
                            } else {
                                if (up) {
                                    active--;

                                    if (active < 0) {
                                        active = roles.length - 1;
                                    }
                                }

                                if (down) {
                                    active++;

                                    if (active >= roles.length) {
                                        active = 0;
                                    }
                                }

                                drop.active = active;
                                drop.setActive();
                            }
                        }
                    }
                });
            },
            userSearchDrop: function (element, data) {
                return ABC.Component({
                    name: 'searchResult',
                    element: element,
                    model: data.items,
                    template: '<li data-role="|role|" data-id="|externalId|" data-model-name="|userName|" data-model-displayName="|roleDisplayName|"><div class="role"><div class="user-name">|userName|</div><div class="user-role">|roleDisplayName|</div></div></li>',
                    events: {
                        'click li': 'applyDelegate',
                        'mouseover li': 'hovered'
                    },
                    render: function () {
                        this.$el.innerHtml(ABC.Template(this.template)(this.model));
                        ABC.Events.publish('otherUsersDrop:' + (!!this.model.length ? 'show' : 'hide'));
                    },
                    active: -1,
                    applyDelegate: function (event, element, dataset) {
                        ABC.Events.publish('otherUsersDrop:hide');
                        ABC.Events.publish('user-drop:hide');
                        ABC.Events.publish('delegate:apply', { roleName: dataset.role, name: dataset.role, displayName: dataset.modelDisplayname, externalId: dataset.id });
                    },
                    hovered: function (event, element) {
                        this.removeActive();
                        this.active = Array.prototype.slice.call(this.element.children).indexOf(element);
                        this.setActive();
                    },
                    removeActive: function () {
                        var lis = this.element.children;
                        for (var i = 0; i < lis.length; i++) {
                            ABC(lis[i]).removeClass('active');
                        }
                    },
                    resetActive: function () {
                        this.active = -1;
                    },
                    setActive: function () {
                        this.removeActive();
                        ABC(this.element.children[this.active]).addClass('active');
                    },
                    selectActive: function () {
                        if (~this.active) {
                            this.element.children[this.active].click();
                            this.resetActive();
                        }
                    }
                });
            }
        },
        config: function (settings) {
            if (settings) {
                for (var key in settings) {
                    if (settings.hasOwnProperty(key)) {
                        if (key.toLowerCase() !== 'menuurl' && key.toLowerCase() !== 'upmurl') {
                            this.settings[key] = settings[key];
                        } else {
                            this.settings.url[key.toLowerCase() === 'menuurl' ? 'menu' : (key.toLowerCase() === 'upmurl' ? 'upm' : key)] = settings[key];
                        }
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
                var jsonMenu = [
                    {
                        'name': 'Travel',
                        'url': 'https://go.advisory.com/upm/auth/nutravelsso'
                    },
                    {
                        'name': 'Expense',
                        'url': 'https://go.advisory.com/expense'
                    },
                    {
                        'name': 'Rewards',
                        'url': 'http://go.advisory.com/rewards'
                    },
                    {
                        'name': 'Help',
                        'url': 'https://advisoryboardtravel.zendesk.com/hc/en-us'
                    }
                ];
                jsonMenu.fallback = true;
                setTimeout(function () {
                    if (!!HeaderABC.settings.url.menu) {
                        getFile(HeaderABC.settings.url.menu).then(getMenuCallback, function (error) {
                            getMenuCallback(jsonMenu);
                        });
                    } else {
                        getMenuCallback(jsonMenu);
                    }
                }, 500);

                function getMenuCallback(data) {
                    HeaderABC.menuConfig = ABC.isJson(data) ? JSON.parse(data) : (!!data.fallback ? data : []);
                    HeaderABC.component.menu('#abcmenu', HeaderABC.menuConfig).render();
                }
            }
        },
        searchUser: function (val) {
            var search = ABC.defer();
            ABC.ajax({
                url: HeaderABC.settings.url.upm + '/' + HeaderABC.settings.suggestion.path + '?count=' + HeaderABC.settings.suggestion.count + '&key=' + val + '&hostName=' + ABC.localpath(),
                success: function (response) {
                    if (ABC.isJson(response)) {
                        search.resolve(JSON.parse(response));
                    }
                },
                error: function () {
                    search.reject();
                }
            });
            return search.promise;
        },
        setUserRoleUPM: function (roleSettings) {
            var changeRole = ABC.defer();
            ABC.ajax({
                url: HeaderABC.settings.url.upm + '/' + HeaderABC.settings.path.setRole + '?externalId=' + roleSettings.externalId + '&roleName=' + roleSettings.name,
                method: 'post',
                success: function () {
                    changeRole.resolve();
                },
                error: function () {
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
        setUserPrimaryInfo: function () {
            var name = HeaderABC.settings.userName,
                onBehalfOf = HeaderABC.settings.onBehalfOf;
            HeaderABC.component.avatar('#abcavatar', [{
                src: HeaderABC.settings.url.upm + '/' + HeaderABC.settings.avatar.path + HeaderABC.settings.avatar.id,
                username: (onBehalfOf ? onBehalfOf : name),
                category: HeaderABC.settings.travelerCategory || null
            }]).render();
        },
        applyMarkup: function () {
            var deferred = ABC.defer(), _this = this;
            if (!!_this.isHtmlGenerated && !!_this.isCssGenerated) {
                document.head.appendChild(HeaderABC.styleSheet);

                setTimeout(function () {
                    ABC(document.body).addClass('header-abc').get().appendChild(HeaderABC.element.get());
                    deferred.resolve();
                }, 10);
            }
            return deferred.promise;
        },
        closeOuter: function () {
            if (!appState || (!!appState && appState.forceProfile === false)) {
                ABC('#ABCouter-wrapper').removeClass('opened').removeClass('profile').removeClass('agreement').attrs({ style: '' });
                ABC('#HeaderABC-overlay').removeClass('outer-opened');
                ABC(document.body).removeClass('upm-abc-opened');
                HeaderABC.outerOpened = false;
                ABC('#user-profile').attrs({
                    src: HeaderABC.settings.url.upm
                });
            }
        },
        applyEvents: function () {
            var menu = ABC('#abcmenu');
            var info = ABC('#abcinfo');
            var overlay = ABC('#HeaderABC-overlay');
            ABC.Events.subscribe('menu:hide', function () {
                overlay.removeClass('opened');
                menu.removeClass('active');
            });
            ABC.Events.subscribe('menu:show', function () {
                menu.addClass('active');
                overlay.addClass('opened');
            });
            ABC.Events.subscribe('profile:refresh', function () {
                if (ABC('#user-profile').get()) {
                    ABC('#user-profile').attrs({
                        src: HeaderABC.settings.url.upm
                    });
                }
            });
            ABC.Events.subscribe('profile:show', function () {
                var iframe;

                if (HeaderABC.outerOpened) {
                    HeaderABC.closeOuter();
                } else {
                    ABC(document.body).addClass('upm-abc-opened');
                    ABC('#ABCouter-wrapper').addClass('opened');
                    overlay.addClass('outer-opened');
                    HeaderABC.outerOpened = true;

                    if (!ABC('#user-profile').get()) {
                        iframe = ABC('<iframe></iframe>').attrs({
                            id: 'user-profile',
                            src: HeaderABC.settings.url.upm,
                            name: 'wprofile'
                        });

                        ABC('#ABCouter-wrapper').find('.content').get().appendChild(iframe.get());
                    } else {
                        window.frames.wprofile.window.postMessage({
                            type: 'openWindow'
                        }, '*');
                    }
                }
            });
            ABC.Events.subscribe('user-drop:show', function () {
                info.addClass('open');
                overlay.addClass('opened');
            });
            ABC.Events.subscribe('user-drop:hide', function () {
                info.removeClass('open');
                overlay.removeClass('opened');
                if (ABC('#HeaderABC').find('.profile-search').hasOwnProperty('get')) {
                    HeaderABC.component.userSearch('.profile-search', {}).render();
                }
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
                    ABC.Events.publish('profile:refresh');
                });
            });
            ABC.Events.subscribe('otherUsersDrop:show', function () {
                info.find('.profile-search').addClass('has-others');
            });
            ABC.Events.subscribe('otherUsersDrop:hide', function () {
                info.find('.profile-search').removeClass('has-others');
            });
            ABC.Events.subscribe('otherUsersNoMatch:show', function () {
                info.find('.profile-search').addClass('no-others');
            });
            ABC.Events.subscribe('otherUsersNoMatch:hide', function () {
                info.find('.profile-search').removeClass('no-others');
            });
            ABC.Events.subscribe('returnLink:show', function () {
                info.find('.drop-holder').addClass('under-other-user');
            });
            ABC.Events.subscribe('returnLink:hide', function () {
                info.find('.drop-holder').removeClass('under-other-user');
            });
            overlay.on('click', function () {
                ABC.Events.publish('menu:hide');
                ABC.Events.publish('user-drop:hide');
            });
            ABC('#HeaderABC').on('click', function (e) {
                var el = e.target, parent;
                while (el) {
                    parent = el.parentElement;
                    if (parent && (el.id === 'HeaderABC' || parent.id === 'HeaderABC')) {
                        ABC.Events.publish('menu:hide');
                        ABC.Events.publish('user-drop:hide');
                        break;
                    } else if (el.id === 'abcprofile' || el.id === 'abcmenu') {
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
        },
        ready: function () {
            this.loaded = ABC.defer();
            this.loaded.promise.then(function () {
                HeaderABC.applyMarkup().then(function () {
                    HeaderABC.generate.menu();
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
                src: HeaderABC.settings.url.upm + '/' + HeaderABC.settings.path.auth,
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
                    isItTravel: appState.isItTravel,
                    onBehalfOfUser: !!appState.onBehalfOfUser
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
                HeaderABC.settings.avatar.id = event.data.avatarId;
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

    function getAppState() {
        if (!!HeaderABC.settings.url.upm && !appState) {
            ABC.ajax({
                url: HeaderABC.settings.url.upm + '/' + HeaderABC.settings.path.info + '/' + ABC.localpath(),
                success: function (response) {
                    if (ABC.isJson(response)) {
                        var currentUser = {};
                        appState = JSON.parse(response);

                        if (appState.loggedUser.hasOwnProperty('userName')) {
                            currentUser.externalId = appState.loggedUser.externalId;
                            currentUser.roleName = appState.loggedUser.role;

                            HeaderABC.settings.userName = appState.loggedUser.userName;
                            HeaderABC.settings.avatar.id = appState.avatarId;
                            HeaderABC.settings.travelerCategory = appState.travelerCategory;
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
                            HeaderABC.element.addClass('en');
                            HeaderABC.element.find('.logo').html('Expense');
                        }

                        // set predefined titles
                        if (appState.isItTravel) {
                            HeaderABC.element.find('.logo').html('Travel');
                        } else if (appState.isItZendesk) {
                            HeaderABC.element.find('.logo').html('Help');
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
                ABC.Events.publish('profile:show');
            }
            HeaderABC.setUserPrimaryInfo();
            buildComponents(data);
        });
    }

    function buildComponents(data) {
        var isEn = data.isItEn;
        var approvers = ['GlobalApprover', 'BudgetApprover', 'CrossBudgetApprover'];
        var hasDelagates = !!data.delegatedUsers && !!data.delegatedUsers.length;
        var hasRoles = !!data.roles && !!data.roles.length;
        var hasAdminRole = data.roles.some(function (role) {
            return role.name.toLowerCase() === 'administrator';
        });
        var hasJustFolioRole = data.roles.some(function (role) {
            return role.name.toLowerCase() === 'folioeditor';
        }) && !hasAdminRole;
        var hasApprovesRole = data.roles.some(function (role) {
            return approvers.indexOf(role.name) > -1;
        });
        var hasJustOneRole = !!data.roles && data.roles.length === 1;
        data.hasAdminRole = hasAdminRole;
        data.hasDelagates = isEn && hasDelagates && !hasAdminRole;
        data.hasRoles = isEn ? hasRoles && !hasJustOneRole : false;
        data.searchAllow = isEn ? (hasAdminRole || hasApprovesRole) : hasAdminRole;
        data.dropAllow = isEn ? !hasJustFolioRole && (data.searchAllow || data.hasDelagates || data.hasRoles) : hasAdminRole;
        HeaderABC.component.info('#abcinfo', data).render();
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
            'body.header-abc .TRX_CH_HIDDEN', '{z-index:1000; /* unhardcode nutravel */}',
            'body.sidebar-abc-opened', '{overflow:hidden}',
            'body.upm-abc-opened', '{overflow:hidden}',
            '#HeaderABC.en', '{z-index:2050;}',
            '#HeaderABC', '{width:100%;font:13px/14px "Droid Sans",Arial,sans-serif;position:fixed;z-index:12050;/* hardcode because of nutravel menu has zIndex 12K */left:0;top:0;border-bottom:1px solid #ddd;min-width:320px;display:block !important;}',
            '#HeaderABC ul', '{margin:0;padding:0;list-style:none}',
            '#HeaderABC .header-wrapper', '{width:100%;height:61px;box-sizing:border-box;padding:16px 20px;position:relative;z-index:11;background:#fff;outline:none;}',
            '#HeaderABC .header-wrapper .logo', '{float:left;height:30px;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzNweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMzMgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA0MS4yICgzNTM5NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+QTVENEQxNkQtNDUwNy00MUYyLThBRDctN0U3RUY3OEE3OEQ2PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBza2V0Y2h0b29sLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJuZXciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJJbml0aWFsLXN0YWdlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAuMDAwMDAwLCAtMjEuMDAwMDAwKSIgZmlsbD0iIzNDNEM1NyI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0zMC40NDQ3MDI0LDI2LjY4ODQ0MjUgQzMwLjQzNTcxNjgsMjYuNTYzOTYyNCAzMC40MjkyMDQyLDI2LjQzOTIzNTEgMzAuNDE3MTY4NCwyNi4zMTUwMDIzIEMzMC4zNzM5NzEzLDI1Ljg2OTQyOTYgMzAuMjI2OTg1OSwyNS40NTg5NzUxIDI5Ljk2MDcxNCwyNS4xMDA0NTYgQzI5LjE4Njk1OTEsMjQuMDU4NzgwNCAyOC4xMjQwMTQ3LDIzLjcxMjc5MTcgMjYuODcyOTQ4NywyMy44NTIyNzU0IEMyNi4zMjY4ODUxLDIzLjkxMzExNCAyNS44Mzg1Mjc2LDI0LjEyODAyNzYgMjUuNDExOTE1NCwyNC40NzU3NDc0IEMyNC40ODI3NjY1LDI1LjIzMzE3OTggMjQuMTI3MzgsMjYuMjA2MTg1MyAyNC4zNzM4NjcsMjcuMzc2MTMzMSBDMjQuNTQ3NDc5NiwyOC4xOTk4NDQ5IDI1LjA2NjU4NjIsMjguNzc5NDYwNCAyNS44MDE4NDMsMjkuMTU5MDgzNCBDMjYuNTc0NTI2MywyOS41NTc5MTQzIDI3LjM5NjgzNjcsMjkuNjA2NzE3IDI4LjIzMzMyNjMsMjkuNDE0OTY4MyBDMjkuNDAwMTQxNSwyOS4xNDc0NTk4IDMwLjQ3NTEyMTcsMjguMTA0MzAwMyAzMC40NDQ3MDI0LDI2LjY4ODQ0MjUgTTI3LjUwNTQwNjQsNDIuNDYwOTc0NCBDMjcuNjkyMzczOCw0Mi40NTA4MzQ3IDI3Ljk5NTkwNzMsNDIuNDQ4Mjc5MSAyOC4yOTYwNjEsNDIuNDE0NzI3MiBDMjguNzEzNDQwMiw0Mi4zNjgwNjc4IDI5LjEzMjU1MDUsNDIuMzE5MjY1IDI5LjU0Mjg0MDIsNDIuMjMzMzY1NSBDMzAuMTIxNjMxMyw0Mi4xMTIxMDA1IDMwLjY2MjMzNjQsNDEuODkxOTkzMyAzMS4xMjQzOTY2LDQxLjUwNTY5MjkgQzMxLjg4MzA2NTUsNDAuODcxNDIxNiAzMi4wMDgxMjI2LDM5LjY1MjAxMTUgMzEuMTgxNjkwNCwzOC45MjUzMjgyIEMzMC44NjA4NDUxLDM4LjY0MzIyODMgMzAuNDk2ODAyNywzOC40MzQ4MjczIDMwLjEwNzUzNDUsMzguMjY4MDU2OSBDMjkuMTIzODEyMiwzNy44NDY0NzM0IDI4LjA4MjU0ODgsMzcuNzEzOTk3IDI3LjAyNTUzOTgsMzcuNjczNzY3NiBDMjYuNzMzMzAwMiwzNy42NjI2Mzg2IDI2LjQzOTc0MTYsMzcuNjc5MjkwOSAyNi4xNDcwMDczLDM3LjY4OTEwMDkgQzI1LjcwMzU3OCwzNy43MDQwMjIxIDI1LjI3MTUyNSwzNy43ODcwMzYzIDI0Ljg1MjI0OTcsMzcuOTMwMTQ3MSBDMjQuMzc4ODEzMiwzOC4wOTE3MjM5IDIzLjk0NzI1NDgsMzguMzI5MDYwNCAyMy41OTE3MDM1LDM4LjY4NTc2NTkgQzIzLjE3NTgwODEsMzkuMTAyODk3OCAyMi45OTMzNzQ4LDM5LjYwNjAxMTYgMjMuMDMzNzY5LDQwLjE5ODg5OTUgQzIzLjA3MzU4NjEsNDAuNzgzMDQ5IDIzLjMxMTQ5OTcsNDEuMjU0MDk0OCAyMy43Njg1MzExLDQxLjYxNjQ4ODQgQzI0LjExODIyOTUsNDEuODkzODA3IDI0LjUyMjA4OSw0Mi4wNTkxNzU4IDI0Ljk0Njk3LDQyLjE3NzgwMjkgQzI1Ljc0NjExNTUsNDIuNDAwODc3OCAyNi41NjYyMDAxLDQyLjQ0NDA3NDggMjcuNTA1NDA2NCw0Mi40NjA5NzQ0IE0yMCwzOS44MTU0ODQ0IEMyMC4wMDkzMTU0LDM5Ljc4MjA5NzMgMjAuMDI1MjI1OCwzOS43NDkwNCAyMC4wMjY5NTY5LDM5LjcxNTMyMzMgQzIwLjA4NzQ2NTgsMzguNTM2ODg0NCAyMC41ODM5ODQ3LDM3LjU5MTAwMDggMjEuNTM0MzE5OSwzNi44ODczOTk4IEMyMi4xNDQyNzIzLDM2LjQzNTcyNjggMjIuODMzNzc2NSwzNi4xNTQxMjE1IDIzLjU1NzU3NDUsMzUuOTQ2OTU3IEMyMy42NzMzMTYyLDM1LjkxMzgxNzMgMjMuNzg5NzE3NSwzNS44ODMxNTA3IDIzLjkzMjc0NTksMzUuODQzOTkzIEMyMy44ODYyNTE0LDM1LjgwNzQ3MzQgMjMuODYxMTA4LDM1Ljc4NTQ2MjcgMjMuODMzODIxMywzNS43NjY1ODQ2IEMyMy40NjQxNzMyLDM1LjUxMDM2OTkgMjMuMTExNjcyLDM1LjIzNDYxNzcgMjIuODI2ODUxOCwzNC44ODIxMTY1IEMyMi41NjI3MjMyLDM0LjU1NTI1MzMgMjIuMzg0MjQ2OCwzNC4xOTE3ODggMjIuNDA2NzUyMSwzMy43NjEyMTg4IEMyMi40Mjg2ODA0LDMzLjM0MTM2NjUgMjIuNjAxMzg2MiwzMi45Nzg4MDggMjIuODc5Nzc2NCwzMi42NjY2MTg2IEMyMy4zMzkzNjM0LDMyLjE1MTMwNDEgMjMuOTI2OTc1MywzMS44NDQ3MjA0IDI0LjU3Mjg3MDIsMzEuNjM0MzQwOCBDMjQuNjU0OTc3NiwzMS42MDc1NDg3IDI0LjczNzQ5NzIsMzEuNTgxOTEwOCAyNC44MTk4NTE5LDMxLjU1NTc3ODIgQzI0LjgxODk0NTEsMzEuNTQ3MTIyMyAyNC44MTc5NTU4LDMxLjUzODU0ODggMjQuODE2OTY2NiwzMS41Mjk5NzU0IEMyNC42NTk4NDE0LDMxLjQ0OTM1MTkgMjQuNTAxMjMyNCwzMS4zNzEzNjYzIDI0LjM0NTc1NTksMzEuMjg3NjkyNiBDMjMuNjE4MjQ4MiwzMC44OTYwMzM4IDIyLjk3MTQ0NjUsMzAuNDA1MTIwNyAyMi40NTkwMTczLDI5Ljc0OTI1MDkgQzIxLjk4MzM1NSwyOS4xNDA1MzUxIDIxLjY4Mjg3MTYsMjguNDUzNzUxMyAyMS41MzE4NDY4LDI3LjY5NzgwMjggQzIxLjQyOTEzMDIsMjcuMTgzNzI0OCAyMS40MDY2MjQ4LDI2LjY2MzQ2NDEgMjEuNDM4MTk4MiwyNi4xNDQxMTAxIEMyMS41MTMyOTg1LDI0LjkxMDM1NiAyMS45NDA4OTk5LDIzLjgyMTY5MTIgMjIuODI2ODUxOCwyMi45MzY3Mjg2IEMyMy41MTcyNjI3LDIyLjI0NzE0MTkgMjQuMzQ0MDI0OCwyMS43ODMzNTA2IDI1LjI2NzgxNTMsMjEuNDg1MTc1NSBDMjUuODMwMjAxNCwyMS4zMDM3MzE0IDI2LjQwNTUzMDIsMjEuMTc3Njg1IDI2Ljk5NDI5NjIsMjEuMTI4NTUyNSBDMjcuNDU2MTA5LDIxLjA4OTk3MTkgMjcuOTE5NzM1NCwyMS4wNTQ2MDY0IDI4LjM4MjcwMjQsMjEuMDUyODc1MiBDMzAuNTAyODIwNiwyMS4wNDQ5NjEyIDMyLjYyMjkzODgsMjEuMDQ5MzMwNCAzNC43NDMwNTcsMjEuMDQ5MzMwNCBDMzQuODkwNTM3LDIxLjA0OTMzMDQgMzQuODkwNjE5NSwyMS4wNDk0MTI4IDM0Ljg5MDcwMTksMjEuMTkyOTM1OSBDMzQuODkwNzAxOSwyMS45MzQ3ODc2IDM0Ljg4ODcyMzQsMjIuNjc2NzIxOCAzNC44OTI5Mjc3LDIzLjQxODU3MzYgQzM0Ljg5MzUwNDgsMjMuNTIwNjMwOCAzNC44NjIyNjExLDIzLjU0NTQ0NDQgMzQuNzYzNjY2MywyMy41NDUxMTQ2IEMzMy44MTA3NzU0LDIzLjU0MTU2OTggMzIuODU3ODAyMiwyMy41NDI4ODg4IDMxLjkwNDkxMTQsMjMuNTQzMzAxIEMzMS44NjQwMjI1LDIzLjU0MzMwMSAzMS44MjMwNTEzLDIzLjU0NzI1OCAzMS43NTQ2Mjg1LDIzLjU1MDgwMjggQzMxLjgwMTEyMywyMy42MDczNTQ2IDMxLjgyOTMxNjUsMjMuNjQ1NjA1NSAzMS44NjE1NDk0LDIzLjY4MDA2NDIgQzMyLjI4ODk4NiwyNC4xMzYyNzEzIDMyLjY4NDkzMTUsMjQuNjE1ODA4MSAzMi45NjIwMDI3LDI1LjE4MTU3NDEgQzMzLjE3NDUyNTcsMjUuNjE1NDQwOCAzMy4yODg2MTg2LDI2LjA3NjE4MTkgMzMuMzI2Nzg3LDI2LjU1NzEyMDIgQzMzLjQ1ODQzOTEsMjguMjE2NDE0OCAzMi44MTM1MzM0LDI5LjU2MzQzNzYgMzEuNjQ3MDQ4LDMwLjY5MTQyNDkgQzMxLjA3Nzk4NDUsMzEuMjQxNzc1MiAzMC4zNzY0NDQ1LDMxLjU2NjMzMDIgMjkuNjI1NzcxOSwzMS43OTMxOTcxIEMyOC45MjIwMDYxLDMyLjAwNTgwMjUgMjguMjAzOTc4NywzMi4xNTI4NzA0IDI3LjQ3ODg2MTYsMzIuMjY4Nzc3IEMyNy4wNjY1MTExLDMyLjMzNDcyNjcgMjYuNjQ4MTQyNiwzMi4zNzk0MDc2IDI2LjI1OTQ1MTYsMzIuNTQzMjkyNiBDMjYuMDg4MDY0OCwzMi42MTU1OSAyNS45MTY1OTU1LDMyLjcwMjMxMzkgMjUuNzY5NDQ1MiwzMi44MTQzNDU5IEMyNS4yOTg5NzY1LDMzLjE3MjYxNzcgMjUuMjk2NTg1OCwzMy44MDcxMzYzIDI1Ljc1MjEzMzQsMzQuMTg2MDk5OCBDMjYuMDE4MjQwNSwzNC40MDc0NDM1IDI2LjMzMzgwOTksMzQuNTMyMDA2IDI2LjY1NTMxNDcsMzQuNjQzMzc4NiBDMjcuMzQ3Mzc0NCwzNC44ODMxODgyIDI4LjA2MjQzNDEsMzUuMDM0NjI1MiAyOC43NzUyNjgsMzUuMTk1Mzc3NyBDMjkuODI4NDAyNCwzNS40MzI3OTY2IDMwLjg4NzU1NDcsMzUuNjUyNDkxNiAzMS45MDczMDIsMzYuMDEyMjQ3MiBDMzIuOTY5MDA5OSwzNi4zODY2NzY3IDMzLjgxMTQzNDksMzcuMDQ4ODExNyAzNC4zNzgxMDc4LDM4LjAzNDEwMDQgQzM0LjYzNTg4ODcsMzguNDgyMjI4NiAzNC43Nzk0OTQyLDM4Ljk3MDc1MTEgMzQuODI5MTIxNCwzOS40ODUwNzYzIEMzNC44NDkzMTg1LDM5LjY5NDMwMTggMzQuODcwMzM5OSwzOS45MDUxNzYgMzQuODY1ODg4Myw0MC4xMTQ4MTM2IEMzNC44Mzk5MjA2LDQxLjM0MjMwMjUgMzQuMzc2Mjk0Miw0Mi4zNzI2MDE4IDMzLjQ1MjA5MTUsNDMuMTg3MDgwNyBDMzIuNTg2MDg5NCw0My45NTAyODM3IDMxLjU2MjM4NTEsNDQuMzk5MDcxNCAzMC40NTMzNTgzLDQ0LjY3MjkyNzYgQzI5LjkzNTMyMzQsNDQuODAwODcgMjkuNDA5MjkyLDQ0Ljg3ODM2MDkgMjguODc4NTYxNyw0NC45MzQzMzU4IEMyOC4xNzg1MDU2LDQ1LjAwODAzNDYgMjcuNDc2Mzg4NSw0NS4wMTE5MDkxIDI2Ljc3NjMzMjQsNDQuOTgzOTYyOSBDMjUuNTQ5OTk3Niw0NC45MzUxNjAxIDI0LjM0Nzg5OTMsNDQuNzQwMTk2MyAyMy4yMDY1NTcyLDQ0LjI2MTQwMTQgQzIyLjQzMjcxOTgsNDMuOTM2NzY0IDIxLjcyODQ1OTQsNDMuNTA0Mjk4OCAyMS4xNDYwNDEsNDIuODkyNTMyOCBDMjAuNTU2NjE1NSw0Mi4yNzM1MTI0IDIwLjE4ODg2MzUsNDEuNTQyNjI0OCAyMC4wNjgxNzU1LDQwLjY5Mjk0NTIgQzIwLjA0ODgwMjgsNDAuNTU2NDI5MyAyMC4wNDIwNDI5LDQwLjQxODI2NDcgMjAuMDI2ODc0NSw0MC4yODEwODkzIEMyMC4wMjM0OTQ2LDQwLjI1MDU4NzYgMjAuMDA5MjMzLDQwLjIyMTIzOTkgMjAsNDAuMTkxMzk3NyBMMjAsMzkuODE1NDg0NCBaIE00NC43OTA0Nzg0LDIxIEM0NC44MjczMjc4LDIxLjAwOTA2ODEgNDQuODY0MDk0NywyMS4wMjUyMjU4IDQ0LjkwMTE5MTQsMjEuMDI2MjE1IEM0NS45ODE0NDc2LDIxLjA1MzU4NDEgNDcuMDI0NjA3MSwyMS4yNjAwMDY3IDQ4LjAyNDIzOTgsMjEuNjc0NjY1NSBDNDkuMDQ2NjI1MSwyMi4wOTg4MDQ2IDQ5LjkzMzczMTEsMjIuNzIxMzY5OCA1MC43MDUxNzc4LDIzLjUxMjEwNjggQzUxLjI4NTA0MDYsMjQuMTA2NDc4NSA1MS43NjcwNTA2LDI0Ljc3MTA4NjcgNTIuMTMzMTUzOSwyNS41MTczMDc2IEM1Mi41MDYwOTk1LDI2LjI3NzM3OCA1Mi43NDkyODksMjcuMDc3OTI1IDUyLjg1MzczNjksMjcuOTE4MjA2NyBDNTIuODkyMTUyNiwyOC4yMjc3NTgxIDUyLjkxOTM1NjgsMjguNTM5NzAwMiA1Mi45MzE1NTc1LDI4Ljg1MTMxMjYgQzUyLjk0NDMzNTMsMjkuMTc2Mjc5OCA1Mi45NTAzNTMyLDI5LjUwMzM5MDMgNTIuOTI4ODM3MSwyOS44Mjc1MzMyIEM1Mi44MzYxNzc3LDMxLjIyNjgyMTEgNTIuNDM1ODYzLDMyLjUyODI1NjEgNTEuNjEyNzI4MiwzMy42NzQyOTcxIEM1MC4zMTc5NzA2LDM1LjQ3NzExNDggNDguNTcxNjIyNCwzNi41OTIwNzcgNDYuMzkxNzM3MywzNy4wMTQ0MDI1IEM0NS45NzY3NDg3LDM3LjA5NDg2MTEgNDUuNTUyNDQ0OCwzNy4xMzA1NTY0IDQ1LjEzMTE5MSwzNy4xNzQzMzA1IEM0NC44ODI4OTA0LDM3LjIwMDIxNTggNDQuNjMxODY5MywzNy4yMTQ1NTk4IDQ0LjM4MjQ5NywzNy4yMTAzNTU1IEM0NC4wNjA2NjI0LDM3LjIwNDkxNDcgNDMuNzM4OTEwMywzNy4xNzk2ODg5IDQzLjQxNzY1MjgsMzcuMTU2MDI5NSBDNDIuODk3NzIxOCwzNy4xMTc4NjExIDQyLjM4ODAxMywzNy4wMTk4NDMzIDQxLjg4NTMxMTMsMzYuODgyODMyOCBDNDAuNjgxMzE3LDM2LjU1NDY1MDYgMzkuNjE1NDA0OSwzNS45NzE2NTUyIDM4LjY4MTcyMTksMzUuMTQ1NjM1MSBDMzcuOTA4MDQ5NCwzNC40NjExNTk2IDM3LjI3MjIxMTgsMzMuNjY4MzYxNyAzNi44MTI4NzIxLDMyLjczOTk1NDcgQzM2LjQ1NjY2MTIsMzIuMDE5OTQ4NyAzNi4yMjgxNDU1LDMxLjI2MDEyNTcgMzYuMTEyMjM4OSwzMC40NjUyNjY4IEMzNi4wMzQxNzA5LDI5LjkyOTU5MDMgMzUuOTk4NDc1NiwyOS4zOTExMTEgMzYuMDE3NjAxLDI4Ljg1MDk4MjkgQzM2LjA4NTUyOTIsMjYuOTI5NjIwNiAzNi43MDQwNTUsMjUuMjIyNjc3MyAzOC4wMDc3OTgzLDIzLjc4NTM4NTkgQzM5LjIyNzIwODQsMjIuNDQxMDgzNSA0MC43MjIxMjM0LDIxLjU3NTI0NjMgNDIuNTAxNTI4OSwyMS4yMTQ5OTYgQzQyLjkwOTQyNzgsMjEuMTMyMzk0IDQzLjMyNzU0OSwyMS4wOTkwODk0IDQzLjc0MTcxMzEsMjEuMDQ5MTMyNSBDNDMuODgxNzczOCwyMS4wMzIxNTA1IDQ0LjAyNDE0MjgsMjEuMDM1MTE4MiA0NC4xNjUyNzUxLDIxLjAyNTk2NzcgQzQ0LjE5NjEwNjYsMjEuMDIzOTg5MiA0NC4yMjU5NDg5LDIxLjAwODk4NTYgNDQuMjU2Mjg1NywyMSBMNDQuNzkwNDc4NCwyMSBaIE0zOS4yMzkyNDQyLDI5LjE4Mzc4MTYgQzM5LjIyNjk2MTEsMjkuNDkwMjgyOCAzOS4yNjU4NzE0LDI5Ljg3OTMwMzcgMzkuMzQwNzI0MywzMC4yNjQ2OTczIEMzOS41ODE3NzA1LDMxLjUwNTU0MSA0MC4yMjEzMTc4LDMyLjQ5NTM2MzcgNDEuMjMyOTg2MywzMy4yNDU5NTM4IEM0Mi4wOTE5ODEyLDMzLjg4MzI3NTMgNDMuMDc0MzAyMSwzNC4xNjczNTM2IDQ0LjEyODgzNzksMzQuMjIxNjc5NyBDNDQuNjMyMjgxNSwzNC4yNDc1NjUgNDUuMTM0OTAwNywzNC4yMjIxNzQzIDQ1LjYzMzM5ODEsMzQuMTMwMDA5NiBDNDcuMDUxNTY0MSwzMy44Njc5NDIgNDguMTUzNDE4OCwzMy4xMzA0NTk0IDQ4Ljk0MTE4OCwzMS45MjcyODk0IEM0OS40MzEzNTkyLDMxLjE3ODU5NTMgNDkuNjU0NjgxNCwzMC4zNDAyOTIxIDQ5LjcwMjc0MjMsMjkuNDU1MjQ3MSBDNDkuNzMwOTM1OCwyOC45MzU0ODA5IDQ5LjcxNjkyMTUsMjguNDEzNDg5IDQ5LjU5ODg3MTUsMjcuOTAyODczNCBDNDkuMTczNzQzMiwyNi4wNjQxOTU2IDQ4LjA0MjEyODcsMjQuODQ3NTA1OSA0Ni4yOTA3NTE4LDI0LjE5NjI1MjUgQzQ1LjYwODMzNzIsMjMuOTQyNDI4NiA0NC44OTIzNzA3LDIzLjg2MDk4MDcgNDQuMTY1NDQsMjMuODk5OTczNSBDNDMuODgzNTg3NSwyMy45MTUwNTk1IDQzLjU5OTM0NDIsMjMuOTMwMDYzIDQzLjMyMjEwODEsMjMuOTc4NDUzNiBDNDEuNzUzNzQxNywyNC4yNTE5ODAxIDQwLjYwMjE3NzMsMjUuMTE0OTMyIDM5Ljg0MDA0NiwyNi40OTkwNTE0IEMzOS4zOTY1MzQzLDI3LjMwNDU0NDcgMzkuMjMyNDAxOSwyOC4xODI5MTIzIDM5LjIzOTI0NDIsMjkuMTgzNzgxNiBaIiBpZD0ibG9nbyI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+) no-repeat;background-position: 0 5px;padding:0 0 0 40px;text-decoration:none;color:#3c4c57;font:14px/26px Arial,sans-serif;font-weight:bold;text-transform:uppercase}',
            '#HeaderABC #abcmenu', '{box-sizing: border-box;float:right;position:relative;cursor:pointer;padding:28px 20px 0;margin:-20px 0 0;background-color:#fff;height:65px;border-left:1px solid #fff;border-right:1px solid #ddd;}',
            '#HeaderABC #abcmenu.active', '{box-shadow:0px -1px 10px -2px rgba(0,0,0,.5);}',
            '#HeaderABC #abcmenu.active .list-wrapper', '{display:block;}',
            '#HeaderABC #abcmenu .icon', '{display:block;width:16px;height:16px;background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA0MS4yICgzNTM5NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+MkQ1Qjk1NDQtM0Q3Ni00OEI1LTgwMjItMDYzRTIyNTAzMTIxPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBza2V0Y2h0b29sLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJuZXciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJJbml0aWFsLXN0YWdlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTA4Mi4wMDAwMDAsIC0yMi4wMDAwMDApIiBmaWxsPSIjM0M0QzU3Ij4KICAgICAgICAgICAgPHBhdGggZD0iTTEwODIsMjIgTDEwODYsMjIgTDEwODYsMjYgTDEwODIsMjYgTDEwODIsMjIgWiBNMTA4MiwyOCBMMTA4NiwyOCBMMTA4NiwzMiBMMTA4MiwzMiBMMTA4MiwyOCBaIE0xMDgyLDM0IEwxMDg2LDM0IEwxMDg2LDM4IEwxMDgyLDM4IEwxMDgyLDM0IFogTTEwODgsMjIgTDEwOTIsMjIgTDEwOTIsMjYgTDEwODgsMjYgTDEwODgsMjIgWiBNMTA4OCwyOCBMMTA5MiwyOCBMMTA5MiwzMiBMMTA4OCwzMiBMMTA4OCwyOCBaIE0xMDg4LDM0IEwxMDkyLDM0IEwxMDkyLDM4IEwxMDg4LDM4IEwxMDg4LDM0IFogTTEwOTQsMjIgTDEwOTgsMjIgTDEwOTgsMjYgTDEwOTQsMjYgTDEwOTQsMjIgWiBNMTA5NCwyOCBMMTA5OCwyOCBMMTA5OCwzMiBMMTA5NCwzMiBMMTA5NCwyOCBaIE0xMDk0LDM0IEwxMDk4LDM0IEwxMDk4LDM4IEwxMDk0LDM4IEwxMDk0LDM0IFoiIGlkPSJwbGl0a2EiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) no-repeat;}',
            '#HeaderABC #abcmenu .list-wrapper', '{display:none;position:absolute;right:0;top:100%;width:200px;background-color:#fff;box-shadow:0px 1px 10px -2px rgba(0,0,0,.5);}',
            '#HeaderABC #abcmenu .list-wrapper .list', '{background-color:#fff;margin:-2px 0 0;}',
            '#HeaderABC #abcmenu .list-wrapper .list a', '{display:block;text-decoration: none;color: #3c4c57;font:13px/54px "Droid Sans",Arial,sans-serif;font-weight:700;padding:0 20px;}',
            '#HeaderABC #abcmenu .list-wrapper .list a:hover', '{background-color:#f3f4f3;}',
            '#HeaderABC #abcmenu .list-wrapper .error-message', '{color:#3f545f;text-align:center;font:13px/22px "Droid Sans",Arial,sans-serif;padding:53px 0 0;margin:10px;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMzkuMSAoMzE3MjApIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPjRERDJGRkI4LTY1RTEtNDhCQy1CRjZCLTA5RTY1QTEzQ0M3NzwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iSGFtYnVyZ2VyLU1lbnUtRXJyb3IiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTYuMDAwMDAwLCAtMzQwLjAwMDAwMCkiIGZpbGw9IiMwMEIxQjAiPgogICAgICAgICAgICA8cGF0aCBkPSJNMTM2LDM4MCBDMTI0LjkzNjE3LDM4MCAxMTYsMzcxLjA2MzgzIDExNiwzNjAgQzExNiwzNDguOTM2MTcgMTI0LjkzNjE3LDM0MCAxMzYsMzQwIEMxNDcuMDYzODMsMzQwIDE1NiwzNDguOTM2MTcgMTU2LDM2MCBDMTU2LDM3MS4wNjM4MyAxNDcuMDYzODMsMzgwIDEzNiwzODAgTDEzNiwzODAgWiBNMTE3Ljg5MzYxNywzNjAgQzExNy44OTM2MTcsMzY5Ljk3Njk4NyAxMjYuMDIzMDEzLDM3OC4xMDYzODMgMTM2LDM3OC4xMDYzODMgQzE0NS45NzY5ODcsMzc4LjEwNjM4MyAxNTQuMTA2MzgzLDM2OS45NzY5ODcgMTU0LjEwNjM4MywzNjAgQzE1NC4xMDYzODMsMzUwLjAyMzAxMyAxNDUuOTc2OTg3LDM0MS44OTM2MTcgMTM2LDM0MS44OTM2MTcgQzEyNi4wMjMwMTMsMzQxLjg5MzYxNyAxMTcuODkzNjE3LDM1MC4wMjMwMTMgMTE3Ljg5MzYxNywzNjAgWiBNMTM2LDM3MC4xNDU5MzYgQzEzNS4yOTc4NzIsMzcwLjE0NTkzNiAxMzQuNzIzNDA0LDM2OS41NjExNzQgMTM0LjcyMzQwNCwzNjguODQ2NDY1IEwxMzQuNzIzNDA0LDM1OC4zMjA3NDggQzEzNC43MjM0MDQsMzU3LjYwNjAzOSAxMzUuMjk3ODcyLDM1Ny4wMjEyNzcgMTM2LDM1Ny4wMjEyNzcgQzEzNi43MDIxMjgsMzU3LjAyMTI3NyAxMzcuMjc2NTk2LDM1Ny42MDYwMzkgMTM3LjI3NjU5NiwzNTguMzIwNzQ4IEwxMzcuMjc2NTk2LDM2OC45MTE0MzkgQzEzNy4yNzY1OTYsMzY5LjU2MTE3NCAxMzYuNzAyMTI4LDM3MC4xNDU5MzYgMTM2LDM3MC4xNDU5MzYgWiBNMTM0LjcyMzQwNCwzNTMuMzE0MSBMMTM0LjcyMzQwNCwzNTIuMjE3ODE1IEMxMzQuNzIzNDA0LDM1MS41ODMxMjMgMTM1LjI5Nzg3MiwzNTEuMDYzODMgMTM2LDM1MS4wNjM4MyBDMTM2LjcwMjEyOCwzNTEuMDYzODMgMTM3LjI3NjU5NiwzNTEuNTgzMTIzIDEzNy4yNzY1OTYsMzUyLjIxNzgxNSBMMTM3LjI3NjU5NiwzNTMuMzE0MSBDMTM3LjIxMjc2NiwzNTMuOTQ4NzkyIDEzNi43MDIxMjgsMzU0LjQ2ODA4NSAxMzYsMzU0LjQ2ODA4NSBDMTM1LjI5Nzg3MiwzNTQuNDY4MDg1IDEzNC43MjM0MDQsMzUzLjk0ODc5MiAxMzQuNzIzNDA0LDM1My4zMTQxIFoiIGlkPSJpX25vcmVzdWx0Ij48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=) no-repeat 50% 0;}',
            '#HeaderABC .hamburger-menu', '{text-decoration:none;float:right;margin:10px 20px 0 0;width:16px;height:12px;position:relative;-webkit-transform:rotate(0);-moz-transform:rotate(0);-o-transform:rotate(0);transform:rotate(0);-webkit-transition:.5s ease-in-out;-moz-transition:.5s ease-in-out;-o-transition:.5s ease-in-out;transition:.5s ease-in-out;cursor:pointer}',

            '#HeaderABC #abcprofile', '{float:right;position:relative;padding:0 10px 0 0;}',
            '#HeaderABC #abcavatar', '{height:30px;line-height:30px;display:block;padding:0 0 0 20px;cursor:pointer;color:#3c4c57;font:13px/30px "Droid Sans",Arial,sans-serif}',
            '#HeaderABC #abcavatar .avatar-holder', '{min-width: 190px;}',
            '#HeaderABC #abcavatar .img-wrapper', '{width:30px;height:30px;float:left;border-radius: 50%;overflow: hidden;position:relative;}',
            '#HeaderABC #abcavatar .img-wrapper img', '{display: block;max-width:none;width: auto;height: auto;min-height: 100%;min-width: 100%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-webkit-transform: translate(-50%, -50%);}',
            '#HeaderABC #abcavatar .avatar-holder .user-holder', '{float: left;padding: 0 0 0 10px;height:30px;display:table;}',
            '#HeaderABC #abcavatar .avatar-holder .user-holder > span', '{display:table-row;}',
            '#HeaderABC #abcavatar .avatar-holder .user-holder > span > em', '{display:table-cell;line-height:16px;vertical-align:middle;font-style:normal;}',

            '#HeaderABC #abcavatar .no-pic', '{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIzMHB4IiBoZWlnaHQ9IjMwcHgiIHZpZXdCb3g9IjAgMCAzMCAzMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5DNjk0NTlGNi0wRjM4LTRBNzktQjQ3Ny0yRTJFOUY5Mzg3NDQ8L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+ICAgIDxkZWZzPiAgICAgICAgPGNpcmNsZSBpZD0icGF0aC0xIiBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiPjwvY2lyY2xlPiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0id2hpdGUiPiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+ICAgICAgICA8L21hc2s+ICAgICAgICA8cGF0aCBkPSJNMjMuOTk2OTIyNCwyNy4wMDA4MTg1IEMyMS41MTE1ODYsMjguODgwNzQ2OSAxOC4zODk5NDA0LDMwIDE1LDMwIEMxMS42MTAwNTk2LDMwIDguNDg4NDE0MDQsMjguODgwNzQ2OSA2LjAwMzA3NzU2LDI3LjAwMDgxODUgQzYuMDAxMDMwMDYsMjYuOTIzODY1MiA2LDI2Ljg0NjY2NTIgNiwyNi43NjkyMzA4IEM2LDIxLjkyNjExODMgMTAuMDI5NDM3MywxOCAxNSwxOCBDMTkuOTcwNTYyNywxOCAyNCwyMS45MjYxMTgzIDI0LDI2Ljc2OTIzMDggQzI0LDI2Ljg0NjY2NTIgMjMuOTk4OTY5OSwyNi45MjM4NjUyIDIzLjk5NjkyMjQsMjcuMDAwODE4NSBaIiBpZD0icGF0aC0zIj48L3BhdGg+ICAgICAgICA8bWFzayBpZD0ibWFzay00IiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjEyIiBmaWxsPSJ3aGl0ZSI+ICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0zIj48L3VzZT4gICAgICAgIDwvbWFzaz4gICAgICAgIDxlbGxpcHNlIGlkPSJwYXRoLTUiIGN4PSIxNSIgY3k9IjEzLjgiIHJ4PSI1LjQiIHJ5PSI1LjQiPjwvZWxsaXBzZT4gICAgICAgIDxtYXNrIGlkPSJtYXNrLTYiIG1hc2tDb250ZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBtYXNrVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAuOCIgaGVpZ2h0PSIxMC44IiBmaWxsPSJ3aGl0ZSI+ICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC01Ij48L3VzZT4gICAgICAgIDwvbWFzaz4gICAgPC9kZWZzPiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJTdWJtaXR0ZWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMjAzLjAwMDAwMCwgLTE2LjAwMDAwMCkiIHN0cm9rZT0iIzk3OTc5NyIgc3Ryb2tlLXdpZHRoPSIzLjIyNTgwNjQ1Ij4gICAgICAgICAgICA8ZyBpZD0ibm9hdmF0YXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMDMuMDAwMDAwLCAxNi4wMDAwMDApIj4gICAgICAgICAgICAgICAgPHVzZSBpZD0iT3ZhbC0yMjAiIG1hc2s9InVybCgjbWFzay0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+ICAgICAgICAgICAgICAgIDx1c2UgaWQ9IkNvbWJpbmVkLVNoYXBlIiBtYXNrPSJ1cmwoI21hc2stNCkiIHhsaW5rOmhyZWY9IiNwYXRoLTMiPjwvdXNlPiAgICAgICAgICAgICAgICA8dXNlIGlkPSJPdmFsLTIyMC1Db3B5IiBtYXNrPSJ1cmwoI21hc2stNikiIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==) no-repeat;}',
            '#HeaderABC #abcavatar .user-name', '{padding:0 0 0 10px;line-height: 30px;color:#3c4c57;font:13px/24px "Droid Sans",Arial,sans-serif;font-weight:700;}',
            '#HeaderABC #abcavatar .category', '{color:#b2b4b2;font:11px/13px "Droid Sans",Arial,sans-serif;}',

            '#HeaderABC #abcinfo', '{position:absolute;top:100%;right:0;margin:16px 0 0;width:100%;}',
            '#HeaderABC #abcinfo.has-delegates .drop-trigger', '{display:block;}',
            '#HeaderABC #abcinfo.open .drop-holder', '{display:block;}',
            '#HeaderABC #abcinfo .drop-trigger', '{display:none;width:100%;height:61px;margin:-61px 0 0;background-color:rgba(0,0,0,0);cursor:pointer;position:relative;}',
            '#HeaderABC #abcinfo .drop-trigger .arrow', '{width: 10px; height: 10px; display: block; position: absolute; right: -4px; top: 28px;width: 9px; height: 5px; background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOXB4IiBoZWlnaHQ9IjVweCIgdmlld0JveD0iMCAwIDkgNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBza2V0Y2h0b29sIDQwLjMgKDMzODM5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT45QTNBMTg4Ni1COUE1LTQ1NkItODFEQS1FMUNDNjNEQ0RFOTY8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9Im5ldyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Imljb25zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzI1LjAwMDAwMCwgLTg5LjAwMDAwMCkiIGZpbGw9IiM4MDgwODAiPgogICAgICAgICAgICA8cGF0aCBkPSJNNzMzLjM5ODQ0OCw4OS43NDk5OTI1IEM3MzMuMzk4NDQ4LDg5LjY4NzQ5MjUgNzMzLjM2NzE5Nyw4OS42MTcxNzk5IDczMy4zMjAzMjIsODkuNTcwMzA0OCBMNzMyLjkyOTY5Nyw4OS4xNzk2Nzk0IEM3MzIuODgyODIyLDg5LjEzMjgwNDMgNzMyLjgxMjUwOSw4OS4xMDE1NTQzIDczMi43NTAwMDksODkuMTAxNTU0MyBDNzMyLjY4NzUwOSw4OS4xMDE1NTQzIDczMi42MTcxOTcsODkuMTMyODA0MyA3MzIuNTcwMzIyLDg5LjE3OTY3OTQgTDcyOS41MDAwMDUsOTIuMjQ5OTk1NSBMNzI2LjQyOTY4OSw4OS4xNzk2Nzk0IEM3MjYuMzgyODE0LDg5LjEzMjgwNDMgNzI2LjMxMjUwMiw4OS4xMDE1NTQzIDcyNi4yNTAwMDEsODkuMTAxNTU0MyBDNzI2LjE3OTY4OSw4OS4xMDE1NTQzIDcyNi4xMTcxODksODkuMTMyODA0MyA3MjYuMDcwMzE0LDg5LjE3OTY3OTQgTDcyNS42Nzk2ODgsODkuNTcwMzA0OCBDNzI1LjYzMjgxMyw4OS42MTcxNzk5IDcyNS42MDE1NjMsODkuNjg3NDkyNSA3MjUuNjAxNTYzLDg5Ljc0OTk5MjUgQzcyNS42MDE1NjMsODkuODEyNDkyNiA3MjUuNjMyODEzLDg5Ljg4MjgwNTIgNzI1LjY3OTY4OCw4OS45Mjk2ODAzIEw3MjkuMzIwMzE4LDkzLjU3MDMwOTYgQzcyOS4zNjcxOTMsOTMuNjE3MTg0NyA3MjkuNDM3NTA1LDkzLjY0ODQzNDcgNzI5LjUwMDAwNSw5My42NDg0MzQ3IEM3MjkuNTYyNTA1LDkzLjY0ODQzNDcgNzI5LjYzMjgxOCw5My42MTcxODQ3IDcyOS42Nzk2OTMsOTMuNTcwMzA5NiBMNzMzLjMyMDMyMiw4OS45Mjk2ODAzIEM3MzMuMzY3MTk3LDg5Ljg4MjgwNTIgNzMzLjM5ODQ0OCw4OS44MTI0OTI2IDczMy4zOTg0NDgsODkuNzQ5OTkyNSBMNzMzLjM5ODQ0OCw4OS43NDk5OTI1IFoiIGlkPSJpX2Fycm93X2Rvd24iPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) no-repeat;}',
            '#HeaderABC #abcinfo.open .drop-trigger .arrow', '{width: 9px; height: 5px; background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOXB4IiBoZWlnaHQ9IjVweCIgdmlld0JveD0iMCAwIDkgNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBza2V0Y2h0b29sIDQwLjMgKDMzODM5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5GMTk5OUQzNy1CQzJCLTQyNjktQUU2Qi02OEIxRTJFMUQ0RkI8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9Im5ldyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Imljb25zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzQyLjAwMDAwMCwgLTg5LjAwMDAwMCkiIGZpbGw9IiM4MDgwODAiPgogICAgICAgICAgICA8cGF0aCBkPSJNNzUwLjM5ODQ0OCw5My4yNDk5OTY3IEM3NTAuMzk4NDQ4LDkzLjE4NzQ5NjYgNzUwLjM2NzE5Nyw5My4xMTcxODQxIDc1MC4zMjAzMjIsOTMuMDcwMzA5IEw3NDYuNjc5NjkzLDg5LjQyOTY3OTcgQzc0Ni42MzI4MTgsODkuMzgyODA0NiA3NDYuNTYyNTA1LDg5LjM1MTU1NDYgNzQ2LjUwMDAwNSw4OS4zNTE1NTQ2IEM3NDYuNDM3NTA1LDg5LjM1MTU1NDYgNzQ2LjM2NzE5Myw4OS4zODI4MDQ2IDc0Ni4zMjAzMTgsODkuNDI5Njc5NyBMNzQyLjY3OTY4OCw5My4wNzAzMDkgQzc0Mi42MzI4MTMsOTMuMTE3MTg0MSA3NDIuNjAxNTYzLDkzLjE4NzQ5NjYgNzQyLjYwMTU2Myw5My4yNDk5OTY3IEM3NDIuNjAxNTYzLDkzLjMxMjQ5NjggNzQyLjYzMjgxMyw5My4zODI4MDk0IDc0Mi42Nzk2ODgsOTMuNDI5Njg0NCBMNzQzLjA3MDMxNCw5My44MjAzMDk5IEM3NDMuMTE3MTg5LDkzLjg2NzE4NSA3NDMuMTg3NTAxLDkzLjg5ODQzNSA3NDMuMjUwMDAxLDkzLjg5ODQzNSBDNzQzLjMxMjUwMiw5My44OTg0MzUgNzQzLjM4MjgxNCw5My44NjcxODUgNzQzLjQyOTY4OSw5My44MjAzMDk5IEw3NDYuNTAwMDA1LDkwLjc0OTk5MzcgTDc0OS41NzAzMjIsOTMuODIwMzA5OSBDNzQ5LjYxNzE5Nyw5My44NjcxODUgNzQ5LjY4NzUwOSw5My44OTg0MzUgNzQ5Ljc1MDAwOSw5My44OTg0MzUgQzc0OS44MjAzMjIsOTMuODk4NDM1IDc0OS44ODI4MjIsOTMuODY3MTg1IDc0OS45Mjk2OTcsOTMuODIwMzA5OSBMNzUwLjMyMDMyMiw5My40Mjk2ODQ0IEM3NTAuMzY3MTk3LDkzLjM4MjgwOTQgNzUwLjM5ODQ0OCw5My4zMTI0OTY4IDc1MC4zOTg0NDgsOTMuMjQ5OTk2NyBMNzUwLjM5ODQ0OCw5My4yNDk5OTY3IFoiIGlkPSJpX2Fycm93X3VwIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=) no-repeat;}',

            '#HeaderABC #abcinfo .drop-holder', '{display:none;min-width:220px;background-color:#ccc;margin-right:-20px;margin-top:-1px;box-shadow: 0px 3px 10px -2px rgba(0,0,0,.5);}',
            '#HeaderABC #abcinfo .drop-holder .profile-link', '{display:block;background-color:rgb(247, 247, 247);line-height:40px;color:#00b1b0;overflow:hidden;cursor:pointer;padding:0 20px;}',
            '#HeaderABC #abcinfo .drop-holder .profile-link .profile-link-icon', '{float:left;width:15px;height:15px;margin:12px 10px 0 0;background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxNXB4IiB2aWV3Qm94PSIwIDAgMTUgMTUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQxICgzNTMyNikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aV91c2VyX2FjdGl2ZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxjaXJjbGUgaWQ9InBhdGgtMSIgY3g9IjcuNSIgY3k9IjcuNSIgcj0iNy41Ij48L2NpcmNsZT4KICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgPC9tYXNrPgogICAgICAgIDxwYXRoIGQ9Ik0xMS45OTg0NjEyLDEzLjUwMDQwOTMgQzEwLjc1NTc5MywxNC40NDAzNzM0IDkuMTk0OTcwMjIsMTUgNy41LDE1IEM1LjgwNTAyOTc4LDE1IDQuMjQ0MjA3MDIsMTQuNDQwMzczNCAzLjAwMTUzODc4LDEzLjUwMDQwOTMgQzMuMDAwNTE1MDMsMTMuNDYxOTMyNiAzLDEzLjQyMzMzMjYgMywxMy4zODQ2MTU0IEMzLDEwLjk2MzA1OTIgNS4wMTQ3MTg2Myw5IDcuNSw5IEM5Ljk4NTI4MTM3LDkgMTIsMTAuOTYzMDU5MiAxMiwxMy4zODQ2MTU0IEMxMiwxMy40MjMzMzI2IDExLjk5OTQ4NSwxMy40NjE5MzI2IDExLjk5ODQ2MTIsMTMuNTAwNDA5MyBaIiBpZD0icGF0aC0zIj48L3BhdGg+CiAgICAgICAgPG1hc2sgaWQ9Im1hc2stNCIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSI5IiBoZWlnaHQ9IjYiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0zIj48L3VzZT4KICAgICAgICA8L21hc2s+CiAgICAgICAgPGNpcmNsZSBpZD0icGF0aC01IiBjeD0iNy41IiBjeT0iNi45IiByPSIyLjciPjwvY2lyY2xlPgogICAgICAgIDxtYXNrIGlkPSJtYXNrLTYiIG1hc2tDb250ZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBtYXNrVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiB4PSIwIiB5PSIwIiB3aWR0aD0iNS40IiBoZWlnaHQ9IjUuNCIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPgogICAgICAgIDwvbWFzaz4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJuZXciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJHcm91cC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTguMDAwMDAwLCAtNzYuMDAwMDAwKSIgc3Ryb2tlPSIjMDBCMUIwIiBzdHJva2Utd2lkdGg9IjEuOTM1NDgzODciPgogICAgICAgICAgICA8ZyBpZD0iaV91c2VyX2FjdGl2ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTguMDAwMDAwLCA3Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDx1c2UgaWQ9Ik92YWwtMjIwIiBtYXNrPSJ1cmwoI21hc2stMikiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPHVzZSBpZD0iQ29tYmluZWQtU2hhcGUiIG1hc2s9InVybCgjbWFzay00KSIgeGxpbms6aHJlZj0iI3BhdGgtMyI+PC91c2U+CiAgICAgICAgICAgICAgICA8dXNlIGlkPSJPdmFsLTIyMC1Db3B5IiBtYXNrPSJ1cmwoI21hc2stNikiIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=) no-repeat;}',
            '#HeaderABC #abcinfo .drop-holder .profile-link .profile-link-label', '{float:left;}',

            '#HeaderABC #abcinfo .drop-holder .profile-link-return', '{display:none;background-color:#fff;color:#3c4c57;overflow:hidden;padding:8px 20px;line-height:30px;cursor:pointer;}',
            '#HeaderABC #abcinfo .drop-holder .profile-link-return .profile-link-icon', '{float:left;width:20px;height:20px;margin:8px 10px 0 0;background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTUgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQxICgzNTMyNikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aV9yZXR1cm48L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iR3JvdXAtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwLjAwMDAwMCwgLTEyMi4wMDAwMDApIiBmaWxsPSIjODA4MDgwIj4KICAgICAgICAgICAgPGcgaWQ9ImlfcmV0dXJuIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMC4wMDAwMDAsIDEyMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cCI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IkNvbWJpbmVkLVNoYXBlIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTcuNDIyODk0MTQsNS4zODE3NDM3NCBDNy45MDY4MzgyMiw0LjgxNTA2MDgzIDguMjAzNDQ5MTEsNC4wODY0Njg1MiA4LjIwMzQ0OTExLDMuMjc2OTIxNTEgQzguMjAzNDQ5MTEsMS41MjgyOTk5NyA2LjgyOTY3MjM2LDAuMTAzNDk3MjI4IDUuMTQzNjczNjMsMC4xMDM0OTcyMjggQzMuNDU3Njc0ODksMC4xMDM0OTcyMjggMi4wNjgyODcwNSwxLjUxMjEwOTAzIDIuMDY4Mjg3MDUsMy4yNzY5MjE1MSBDMi4wNjgyODcwNSw0LjA4NjQ2ODUyIDIuMzY0ODk3OTQsNC44MTUwNjA4MyAyLjg0ODg0MjAyLDUuMzgxNzQzNzQgQzEuNjE1NTY1MTcsNS45MzIyMzU3MSAwLjc0MTM0MzU5OSw3LjIxMTMxOTk5IDAuNzQxMzQzNTk5LDguNjg0Njk1NTUgTDAuNzQxMzQzNTk5LDEwLjU5NTIyNjUgQzAuNzQxMzQzNTk5LDEwLjgyMTg5OTcgMC45MTMwNjU2OTMsMTEgMS4xMzE2MjEwOCwxMSBMOS4xNDAxMTUwNywxMSBDOS4zNTg2NzA0NiwxMSA5LjUzMDM5MjU2LDEwLjgyMTg5OTcgOS41MzAzOTI1NiwxMC41OTUyMjY1IEw5LjUzMDM5MjU2LDguNjg0Njk1NTUgQzkuNTMwMzkyNTYsNy4xOTUxMjkwNSA4LjY1NjE3MDk5LDUuOTE2MDQ0NzcgNy40MjI4OTQxNCw1LjM4MTc0Mzc0IEw3LjQyMjg5NDE0LDUuMzgxNzQzNzQgWiBNOC43NDk4Mzc1OSwxMC4xOTA0NTMgTDEuNTIxODk4NTcsMTAuMTkwNDUzIEwxLjUyMTg5ODU3LDguNjg0Njk1NTUgQzEuNTIxODk4NTcsNy4zODk0MjAzMyAyLjM4MDUwOTA0LDYuMjg4NDM2MzkgMy41NTEzNDE0OSw1Ljk5Njk5OTQ3IEM0LjAxOTY3NDQ3LDYuMjg4NDM2MzkgNC41NTA0NTE4NSw2LjQ2NjUzNjc0IDUuMTI4MDYyNTMsNi40NjY1MzY3NCBDNS43MDU2NzMyMSw2LjQ2NjUzNjc0IDYuMjUyMDYxNjgsNi4yODg0MzYzOSA2LjcwNDc4MzU3LDUuOTk2OTk5NDcgQzcuODc1NjE2MDIsNi4zMDQ2MjczMyA4LjczNDIyNjQ5LDcuMzg5NDIwMzMgOC43MzQyMjY0OSw4LjY4NDY5NTU1IEw4LjczNDIyNjQ5LDEwLjE5MDQ1MyBMOC43NDk4Mzc1OSwxMC4xOTA0NTMgWiBNMi44NDg4NDIwMiwzLjI3NjkyMTUxIEMyLjg0ODg0MjAyLDEuOTY1NDU1MzUgMy44NzkxNzQ1OCwwLjkxMzA0NDIzOSA1LjEyODA2MjUzLDAuOTEzMDQ0MjM5IEM2LjM5MjU2MTU4LDAuODk2ODUzMjk5IDcuNDIyODk0MTQsMS45NjU0NTUzNSA3LjQyMjg5NDE0LDMuMjc2OTIxNTEgQzcuNDIyODk0MTQsNC41ODgzODc2NyA2LjM5MjU2MTU4LDUuNjQwNzk4NzkgNS4xNDM2NzM2Myw1LjY0MDc5ODc5IEMzLjg3OTE3NDU4LDUuNjQwNzk4NzkgMi44NDg4NDIwMiw0LjU3MjE5NjczIDIuODQ4ODQyMDIsMy4yNzY5MjE1MSBaIE0xNC40MTY2NjY3LDMuMDM0MDU3NDEgTDE0LjQxNjY2NjcsMi45NTMxMDI3MSBDMTQuNDE2NjY2NywyLjkzNjkxMTc3IDE0LjQxNjY2NjcsMi45MzY5MTE3NyAxNC40MDEwNTU2LDIuOTIwNzIwODMgQzE0LjQwMTA1NTYsMi45MDQ1Mjk4OSAxNC40MDEwNTU2LDIuODg4MzM4OTUgMTQuMzg1NDQ0NSwyLjg3MjE0ODAxIEMxNC4zODU0NDQ1LDIuODU1OTU3MDcgMTQuMzY5ODMzNCwyLjgzOTc2NjEzIDE0LjM2OTgzMzQsMi44Mzk3NjYxMyBDMTQuMzY5ODMzNCwyLjgyMzU3NTE5IDE0LjM1NDIyMjMsMi44MjM1NzUxOSAxNC4zNTQyMjIzLDIuODA3Mzg0MjUgQzE0LjMzODYxMTIsMi43OTExOTMzMSAxNC4zMjMwMDAxLDIuNzU4ODExNDIgMTQuMzA3Mzg5LDIuNzQyNjIwNDggTDEzLjE4MzM4OTgsMS41NzY4NzI3OSBDMTMuMDI3Mjc4OCwxLjQxNDk2MzM5IDEyLjc3NzUwMTIsMS40MTQ5NjMzOSAxMi42MzcwMDEzLDEuNTc2ODcyNzkgQzEyLjQ4MDg5MDMsMS43Mzg3ODIxOSAxMi40ODA4OTAzLDEuOTk3ODM3MjMgMTIuNjM3MDAxMywyLjE0MzU1NTcgTDEzLjEwNTMzNDMsMi42MjkyODM5IEw5LjU5MjgzNjk1LDIuNjI5MjgzOSBDOS4zNzQyODE1NiwyLjYyOTI4MzkgOS4yMDI1NTk0NywyLjgwNzM4NDI1IDkuMjAyNTU5NDcsMy4wMzQwNTc0MSBMOS4yMDI1NTk0Nyw0LjY4NTUzMzMxIEM5LjIwMjU1OTQ3LDQuOTEyMjA2NDcgOS4zNzQyODE1Niw1LjA5MDMwNjgyIDkuNTkyODM2OTUsNS4wOTAzMDY4MiBDOS44MTEzOTIzNSw1LjA5MDMwNjgyIDkuOTgzMTE0NDQsNC45MTIyMDY0NyA5Ljk4MzExNDQ0LDQuNjg1NTMzMzEgTDkuOTgzMTE0NDQsMy40Mzg4MzA5MSBMMTMuMDc0MTEyMSwzLjQzODgzMDkxIEwxMi42MDU3NzkxLDMuOTI0NTU5MTIgQzEyLjQ0OTY2ODEsNC4wODY0Njg1MiAxMi40NDk2NjgxLDQuMzQ1NTIzNTcgMTIuNjA1Nzc5MSw0LjQ5MTI0MjAzIEMxMi42ODM4MzQ2LDQuNTcyMTk2NzMgMTIuNzc3NTAxMiw0LjYwNDU3ODYxIDEyLjg4Njc3ODksNC42MDQ1Nzg2MSBDMTIuOTk2MDU2Niw0LjYwNDU3ODYxIDEzLjA4OTcyMzIsNC41NzIxOTY3MyAxMy4xNjc3Nzg3LDQuNDkxMjQyMDMgTDE0LjI5MTc3NzksMy4zMjU0OTQzMyBDMTQuMzA3Mzg5LDMuMzA5MzAzMzkgMTQuMzIzMDAwMSwzLjI5MzExMjQ1IDE0LjMzODYxMTIsMy4yNjA3MzA1NyBDMTQuMzM4NjExMiwzLjI0NDUzOTYzIDE0LjM1NDIyMjMsMy4yNDQ1Mzk2MyAxNC4zNTQyMjIzLDMuMjI4MzQ4NjkgQzE0LjM1NDIyMjMsMy4yMTIxNTc3NSAxNC4zNjk4MzM0LDMuMTk1OTY2ODEgMTQuMzY5ODMzNCwzLjE5NTk2NjgxIEMxNC4zNjk4MzM0LDMuMTc5Nzc1ODcgMTQuMzY5ODMzNCwzLjE2MzU4NDkzIDE0LjM4NTQ0NDUsMy4xNjM1ODQ5MyBDMTQuMzg1NDQ0NSwzLjE0NzM5Mzk5IDE0LjM4NTQ0NDUsMy4xNDczOTM5OSAxNC40MDEwNTU2LDMuMTMxMjAzMDUgQzE0LjQwMTA1NTYsMy4wODI2MzAyMyAxNC40MTY2NjY3LDMuMDY2NDM5MjkgMTQuNDE2NjY2NywzLjAzNDA1NzQxIFoiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) no-repeat;}',
            '#HeaderABC #abcinfo .drop-holder .profile-link-return .profile-link-return-label', '{float:left;}',
            '#HeaderABC #abcinfo .drop-holder.under-other-user .profile-link-return', '{display:block;}',
            '#HeaderABC #abcinfo .drop-holder.under-other-user .profile-roles', '{display:none;}',
            '#HeaderABC #abcinfo .drop-holder.under-other-user .profile-search', '{display:none;}',

            '#HeaderABC #abcinfo .drop-holder .profile-delegates', '{background-color:#fff;}',
            '#HeaderABC #abcinfo .drop-holder .profile-delegates > div', '{display:block;overflow:hidden;padding:8px 20px;line-height:30px;cursor:pointer;}',
            '#HeaderABC #abcinfo .drop-holder .profile-delegates > div:hover', '{background-color:#f3f4f3;}',
            '#HeaderABC #abcinfo .img-wrapper', '{width:30px;height:30px;float:left;border-radius: 50%;overflow: hidden;position:relative;}',
            '#HeaderABC #abcinfo .img-wrapper img', '{display: block;max-width:none;width: auto;height: auto;min-height: 100%;min-width: 100%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-webkit-transform: translate(-50%, -50%);}',
            '#HeaderABC #abcinfo .no-pic', '{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIzMHB4IiBoZWlnaHQ9IjMwcHgiIHZpZXdCb3g9IjAgMCAzMCAzMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5DNjk0NTlGNi0wRjM4LTRBNzktQjQ3Ny0yRTJFOUY5Mzg3NDQ8L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+ICAgIDxkZWZzPiAgICAgICAgPGNpcmNsZSBpZD0icGF0aC0xIiBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiPjwvY2lyY2xlPiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0id2hpdGUiPiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+ICAgICAgICA8L21hc2s+ICAgICAgICA8cGF0aCBkPSJNMjMuOTk2OTIyNCwyNy4wMDA4MTg1IEMyMS41MTE1ODYsMjguODgwNzQ2OSAxOC4zODk5NDA0LDMwIDE1LDMwIEMxMS42MTAwNTk2LDMwIDguNDg4NDE0MDQsMjguODgwNzQ2OSA2LjAwMzA3NzU2LDI3LjAwMDgxODUgQzYuMDAxMDMwMDYsMjYuOTIzODY1MiA2LDI2Ljg0NjY2NTIgNiwyNi43NjkyMzA4IEM2LDIxLjkyNjExODMgMTAuMDI5NDM3MywxOCAxNSwxOCBDMTkuOTcwNTYyNywxOCAyNCwyMS45MjYxMTgzIDI0LDI2Ljc2OTIzMDggQzI0LDI2Ljg0NjY2NTIgMjMuOTk4OTY5OSwyNi45MjM4NjUyIDIzLjk5NjkyMjQsMjcuMDAwODE4NSBaIiBpZD0icGF0aC0zIj48L3BhdGg+ICAgICAgICA8bWFzayBpZD0ibWFzay00IiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjEyIiBmaWxsPSJ3aGl0ZSI+ICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0zIj48L3VzZT4gICAgICAgIDwvbWFzaz4gICAgICAgIDxlbGxpcHNlIGlkPSJwYXRoLTUiIGN4PSIxNSIgY3k9IjEzLjgiIHJ4PSI1LjQiIHJ5PSI1LjQiPjwvZWxsaXBzZT4gICAgICAgIDxtYXNrIGlkPSJtYXNrLTYiIG1hc2tDb250ZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBtYXNrVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAuOCIgaGVpZ2h0PSIxMC44IiBmaWxsPSJ3aGl0ZSI+ICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC01Ij48L3VzZT4gICAgICAgIDwvbWFzaz4gICAgPC9kZWZzPiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJTdWJtaXR0ZWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMjAzLjAwMDAwMCwgLTE2LjAwMDAwMCkiIHN0cm9rZT0iIzk3OTc5NyIgc3Ryb2tlLXdpZHRoPSIzLjIyNTgwNjQ1Ij4gICAgICAgICAgICA8ZyBpZD0ibm9hdmF0YXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMDMuMDAwMDAwLCAxNi4wMDAwMDApIj4gICAgICAgICAgICAgICAgPHVzZSBpZD0iT3ZhbC0yMjAiIG1hc2s9InVybCgjbWFzay0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+ICAgICAgICAgICAgICAgIDx1c2UgaWQ9IkNvbWJpbmVkLVNoYXBlIiBtYXNrPSJ1cmwoI21hc2stNCkiIHhsaW5rOmhyZWY9IiNwYXRoLTMiPjwvdXNlPiAgICAgICAgICAgICAgICA8dXNlIGlkPSJPdmFsLTIyMC1Db3B5IiBtYXNrPSJ1cmwoI21hc2stNikiIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==) no-repeat;}',
            '#HeaderABC .no-pic img', '{display:none !important;}',
            '#HeaderABC #abcinfo .user-name', '{padding:0 0 0 10px;line-height: 30px;color:#3c4c57;font:13px/24px "Droid Sans",Arial,sans-serif;}',

            '#HeaderABC #abcinfo .drop-holder .profile-roles', '{background-color:#fff;color:#3c4c57;border-top:1px solid #f1f1f1;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder', '{overflow:hidden;font:13px/40px "Droid Sans",Arial,sans-serif;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .heading', '{font-weight:700;overflow:hidden;padding: 0 13px 0 23px; white-space: nowrap;display: block; height: 40px;text-transform:uppercase;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role', '{cursor:pointer;display:block; height: 30px;line-height: 30px; padding: 0 13px 0 23px; white-space: nowrap;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role em', '{display:none;font-style:normal;margin:0 10px 0 0;width:4px;height:8px;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role span', '{}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role.active', '{overflow:hidden;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role.active em', '{display:inline-block;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNXB4IiBoZWlnaHQ9IjhweCIgdmlld0JveD0iMCAwIDUgOCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNDEuMiAoMzUzOTcpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPu+EhTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJuZXciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxwYXRoIGQ9Ik00LjMxNjQwNjI1LDMuODIxNDI4NTcgQzQuMzE2NDA2MjUsMy44ODQzMDA5MSA0LjI5MjIyNDk0LDMuOTM5OTE3OTEgNC4yNDM4NjE2MSwzLjk4ODI4MTI1IEwwLjg2MzI4MTI1LDcuMzY4ODYxNjEgQzAuODE0OTE3OTEzLDcuNDE3MjI0OTQgMC43NTkzMDA5MSw3LjQ0MTQwNjI1IDAuNjk2NDI4NTcxLDcuNDQxNDA2MjUgQzAuNjMzNTU2MjMzLDcuNDQxNDA2MjUgMC41Nzc5MzkyMyw3LjQxNzIyNDk0IDAuNTI5NTc1ODkzLDcuMzY4ODYxNjEgTDAuMTY2ODUyNjc5LDcuMDA2MTM4MzkgQzAuMTE4NDg5MzQyLDYuOTU3Nzc1MDYgMC4wOTQzMDgwMzU3LDYuOTAyMTU4MDUgMC4wOTQzMDgwMzU3LDYuODM5Mjg1NzEgQzAuMDk0MzA4MDM1Nyw2Ljc3NjQxMzM4IDAuMTE4NDg5MzQyLDYuNzIwNzk2MzcgMC4xNjY4NTI2NzksNi42NzI0MzMwNCBMMy4wMTc4NTcxNCwzLjgyMTQyODU3IEwwLjE2Njg1MjY3OSwwLjk3MDQyNDEwNyBDMC4xMTg0ODkzNDIsMC45MjIwNjA3NyAwLjA5NDMwODAzNTcsMC44NjY0NDM3NjcgMC4wOTQzMDgwMzU3LDAuODAzNTcxNDI5IEMwLjA5NDMwODAzNTcsMC43NDA2OTkwOSAwLjExODQ4OTM0MiwwLjY4NTA4MjA4NyAwLjE2Njg1MjY3OSwwLjYzNjcxODc1IEwwLjUyOTU3NTg5MywwLjI3Mzk5NTUzNiBDMC41Nzc5MzkyMywwLjIyNTYzMjE5OSAwLjYzMzU1NjIzMywwLjIwMTQ1MDg5MyAwLjY5NjQyODU3MSwwLjIwMTQ1MDg5MyBDMC43NTkzMDA5MSwwLjIwMTQ1MDg5MyAwLjgxNDkxNzkxMywwLjIyNTYzMjE5OSAwLjg2MzI4MTI1LDAuMjczOTk1NTM2IEw0LjI0Mzg2MTYxLDMuNjU0NTc1ODkgQzQuMjkyMjI0OTQsMy43MDI5MzkyMyA0LjMxNjQwNjI1LDMuNzU4NTU2MjMgNC4zMTY0MDYyNSwzLjgyMTQyODU3IFoiIGlkPSLvhIUiIGZpbGw9IiMzQzRDNTciPjwvcGF0aD4KICAgIDwvZz4KPC9zdmc+) no-repeat;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role.active span', '{font-weight:700;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role:hover', '{background-color: #00b1b0;color: #fff;}',
            '#HeaderABC #abcinfo .drop-holder .profile-roles .profile-roles-holder .role:hover em', '{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNXB4IiBoZWlnaHQ9IjhweCIgdmlld0JveD0iMCAwIDUgOCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNDEuMiAoMzUzOTcpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPu+EhTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJuZXciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxwYXRoIGQ9Ik00LjMxNjQwNjI1LDMuODIxNDI4NTcgQzQuMzE2NDA2MjUsMy44ODQzMDA5MSA0LjI5MjIyNDk0LDMuOTM5OTE3OTEgNC4yNDM4NjE2MSwzLjk4ODI4MTI1IEwwLjg2MzI4MTI1LDcuMzY4ODYxNjEgQzAuODE0OTE3OTEzLDcuNDE3MjI0OTQgMC43NTkzMDA5MSw3LjQ0MTQwNjI1IDAuNjk2NDI4NTcxLDcuNDQxNDA2MjUgQzAuNjMzNTU2MjMzLDcuNDQxNDA2MjUgMC41Nzc5MzkyMyw3LjQxNzIyNDk0IDAuNTI5NTc1ODkzLDcuMzY4ODYxNjEgTDAuMTY2ODUyNjc5LDcuMDA2MTM4MzkgQzAuMTE4NDg5MzQyLDYuOTU3Nzc1MDYgMC4wOTQzMDgwMzU3LDYuOTAyMTU4MDUgMC4wOTQzMDgwMzU3LDYuODM5Mjg1NzEgQzAuMDk0MzA4MDM1Nyw2Ljc3NjQxMzM4IDAuMTE4NDg5MzQyLDYuNzIwNzk2MzcgMC4xNjY4NTI2NzksNi42NzI0MzMwNCBMMy4wMTc4NTcxNCwzLjgyMTQyODU3IEwwLjE2Njg1MjY3OSwwLjk3MDQyNDEwNyBDMC4xMTg0ODkzNDIsMC45MjIwNjA3NyAwLjA5NDMwODAzNTcsMC44NjY0NDM3NjcgMC4wOTQzMDgwMzU3LDAuODAzNTcxNDI5IEMwLjA5NDMwODAzNTcsMC43NDA2OTkwOSAwLjExODQ4OTM0MiwwLjY4NTA4MjA4NyAwLjE2Njg1MjY3OSwwLjYzNjcxODc1IEwwLjUyOTU3NTg5MywwLjI3Mzk5NTUzNiBDMC41Nzc5MzkyMywwLjIyNTYzMjE5OSAwLjYzMzU1NjIzMywwLjIwMTQ1MDg5MyAwLjY5NjQyODU3MSwwLjIwMTQ1MDg5MyBDMC43NTkzMDA5MSwwLjIwMTQ1MDg5MyAwLjgxNDkxNzkxMywwLjIyNTYzMjE5OSAwLjg2MzI4MTI1LDAuMjczOTk1NTM2IEw0LjI0Mzg2MTYxLDMuNjU0NTc1ODkgQzQuMjkyMjI0OTQsMy43MDI5MzkyMyA0LjMxNjQwNjI1LDMuNzU4NTU2MjMgNC4zMTY0MDYyNSwzLjgyMTQyODU3IFoiIGlkPSLvhIUiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgIDwvZz4KPC9zdmc+) no-repeat;}',

            '#HeaderABC #abcinfo .drop-holder .profile-search', '{background-color: #f9f9f9;color:#3c4c57;border-top:1px solid #f1f1f1;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder', '{font:13px/40px "Droid Sans",Arial,sans-serif;padding:0 20px 20px 20px;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .heading', '{font-weight:700;overflow:hidden;white-space: nowrap;display: block; height: 40px;text-transform:uppercase;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box:before', '{display:none;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box ', '{float:none;outline:none;width: auto; background: #fff; padding: 0 30px 0 0px;-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; position: relative;height: 25px; border: 1px solid #d4d0d4; padding: 4px 30px 4px 8px; box-sizing: border-box;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box input ', '{box-shadow:none;float:left;width: 100%; height: 16px; padding: 0 5px 0 7px; border: 0; padding: 0; width: 100%; font:13px/16px "Droid Sans",Arial,sans-serif;color:#3c4c57;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box input:focus', '{outline: none;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box button ', '{float: right; text-decoration: none; width: 25px; height: 23px; text-align: center; outline: none; position: absolute; right: 5px; top: 1px; z-index: 2; border: 0; padding: 0; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .search-box button.search ', '{text-indent: -9999px; overflow: hidden; text-decoration: none; display: block; text-align: left; background: #fff url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEycHgiIGhlaWdodD0iMTJweCIgdmlld0JveD0iMCAwIDEyIDEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMzkuMSAoMzE3MjApIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPkYwQjM3NTE2LTU0RkUtNEU1RS04NTYxLTBGMUMyMERCREY2OTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iVXNlci1yb2xlLWRyb3Bkb3duIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAxNC4wMDAwMDAsIC00MDQuMDAwMDAwKSIgZmlsbD0iIzNGNTQ1RiI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0xMS1Db3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4MzIuMDAwMDAwLCA1OS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOTAuMTY0MzY2LDM1My44NzE0NzMgQzE4OS4zMDI0MzEsMzU0LjU3NjgxNyAxODguMjAwNjM1LDM1NSAxODcsMzU1IEMxODQuMjM4NTc2LDM1NSAxODIsMzUyLjc2MTQyNCAxODIsMzUwIEMxODIsMzQ3LjIzODU3NiAxODQuMjM4NTc2LDM0NSAxODcsMzQ1IEMxODkuNzYxNDI0LDM0NSAxOTIsMzQ3LjIzODU3NiAxOTIsMzUwIEMxOTIsMzUxLjIwMDYzNSAxOTEuNTc2ODE3LDM1Mi4zMDI0MzEgMTkwLjg3MTQ3MywzNTMuMTY0MzY2IEwxOTMuNjIxMzIsMzU1LjkxNDIxNCBMMTkyLjkxNDIxNCwzNTYuNjIxMzIgTDE5MC4xNjQzNjYsMzUzLjg3MTQ3MyBaIE0xODkuNDUyODIyLDM1My4xNTk5MjkgQzE4OC43NzU0OCwzNTMuNjg2NDU5IDE4Ny45MjQzNTYsMzU0IDE4NywzNTQgQzE4NC43OTA4NjEsMzU0IDE4MywzNTIuMjA5MTM5IDE4MywzNTAgQzE4MywzNDcuNzkwODYxIDE4NC43OTA4NjEsMzQ2IDE4NywzNDYgQzE4OS4yMDkxMzksMzQ2IDE5MSwzNDcuNzkwODYxIDE5MSwzNTAgQzE5MSwzNTAuOTI0MzU2IDE5MC42ODY0NTksMzUxLjc3NTQ4IDE5MC4xNTk5MjksMzUyLjQ1MjgyMiBMMTkwLjA4NTc4NiwzNTIuMzc4NjggTDE4OS4zNzg2OCwzNTMuMDg1Nzg2IEwxODkuNDUyODIyLDM1My4xNTk5MjkgWiIgaWQ9Imlfc2VhcmNoIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) no-repeat 50% 50%; width: 20px; height: 20px; position: absolute; top: 1px; right: 2px; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .no-match ', '{display: none;cursor: default;padding:14px 0 0;font:13px/16px "Droid Sans",Arial,sans-serif;color: #b2b4b2;}',

            '#HeaderABC #abcinfo .drop-holder .profile-search.has-others .profile-search-holder .dropdown-menu ', '{display:block;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search.no-others .profile-search-holder .no-match ', '{display:block;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu ', '{display:none;font:12px/13px "Droid Sans",Arial,sans-serif; position: static; border: none; box-shadow: none; border-radius: 0; background-color: #f9f9f9; padding: 0; max-height: none !important; margin: 10px 0 0px -20px; width: 240px;}',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li ', '{cursor: pointer; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .role ', '{display: block; height: 40px; padding: 5px 13px 5px 23px; box-sizing: border-box; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li.active .role ', '{background-color: #00b1b0; color: #fff; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li.active .role .user-name', '{color: #fff; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .role .user-name ', '{padding:0;font: 700 13px/15px "Droid Sans",Arial,sans-serif; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; height: 15px; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li.typeahead-no-matches ', '{cursor: default; padding: 0 20px 10px 20px; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .search-user-info ', '{float: left; width: 190px; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .search-user-info .name ', '{font:12px/18px "Droid Sans",Arial,sans-serif; font-weight:700; display: block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
            '#HeaderABC #abcinfo .drop-holder .profile-search .profile-search-holder .dropdown-menu li .search-user-info .role ', '{font:11px "Droid Sans",Arial,sans-serif; display: block; }',

            '#HeaderABC .clearfix:after', '{content:" ";display:table}',
            '#HeaderABC .clearfix:before', '{content:" ";display:table}',
            '#HeaderABC .hide-text', '{text-indent:-9999px;font-size:0}',
            '#HeaderABC .clearfix:after', '{clear:both}',
            '#HeaderABC-overlay', '{display:none;background-color:#fff;opacity:0;z-index:9;position:fixed;top:0;right:0;bottom:0;left:0;outline:none;}',
            '#HeaderABC-overlay.outer-opened', '{display:block;z-index:11;background-color:rgba(0,0,0,0.5);opacity:1;}',
            '#HeaderABC-overlay.opened', '{display:block}',
            '#ABCouter-wrapper', '{-webkit-transition: height .2s, margin-top .2s;-moz-transition: height .2s, margin-top .2s;-ms-transition: height .2s, margin-top .2s;-o-transition: height .2s, margin-top .2s;transition:height .2s, margin-top .2s;transition-timing-function: ease-in;}',
            '#ABCouter-wrapper', '{position: fixed;width: 640px;height: 480px;top:62px;left:calc(50% - 320px);z-index: 5000;display:none;margin: 0;box-sizing: border-box;}',
            '#ABCouter-wrapper .content', '{position: relative;width: 100%;height: 100%;background: #fff;box-sizing: border-box;background: #fff;box-shadow: 0 10px 30px 0 rgba(39, 49, 55, 0.6);}',
            '#ABCouter-wrapper .content .loading-animation', '{position: absolute; left: 0; top: 0; z-index: 10; width: 640px; height: 480px; background-color: rgba(255, 255, 255, .7);}',
            '#ABCouter-wrapper .content .loading-animation .spinner', '{position: relative; display: block; left: 50%; top: 50%;}',
            '#ABCouter-wrapper .content .loading-animation .spinner span', '{display: block; height: 4px; width: 4px; background: #3f545f; border-radius: 50%; position: absolute; top: 0px; padding: 0;}',
            '#ABCouter-wrapper .content .loading-animation .spinner span:nth-child(1)', '{left: -8px; -webkit-animation: bounce 0.8s ease-in-out infinite; -moz-animation: bounce 0.8s ease-in-out infinite; animation: bounce 0.8s ease-in-out infinite;}',
            '#ABCouter-wrapper .content .loading-animation .spinner span:nth-child(2)', '{-webkit-animation: bounce 0.8s ease-in-out 0.26s infinite; -moz-animation: bounce 0.8s ease-in-out 0.26s infinite; animation: bounce 0.8s ease-in-out 0.26s infinite;}',
            '#ABCouter-wrapper .content .loading-animation .spinner span:nth-child(3)', '{left: 8px; -webkit-animation: bounce 0.8s ease-in-out 0.52s infinite; -moz-animation: bounce 0.8s ease-in-out 0.52s infinite; animation: bounce 0.8s ease-in-out 0.52s infinite;}',
            '#ABCouter-wrapper .content iframe', '{border: none;position:relative;width:100%;height:100%;}',
            '#ABCouter-wrapper.opened', '{display:block}',
            '#ABCouter-wrapper.agreement', '{width:640px;height:480px;margin:0 !important;top:62px;left:calc(50% - 320px);}',
            '#ABCouter-wrapper.profile', '{width:960px;height:530px!important;margin:0 !important;top:62px;left:calc(50% - 480px);}',
            '#ABCouter-wrapper.agreement .loading-animation, #ABCouter-wrapper.profile .loading-animation', '{display: none}'
        ];
    }

    function getMainTemplate() {
        return '<div class="header-wrapper clearfix" tabindex="-1">' +
                    '<span class="logo"></span>' +
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

    function getDataset(element) {
        element = element instanceof ABC.init ? element.get() : element;
        var attributes = element.attributes,
            i = attributes.length, dataset = {}, key = '';

        for (; i--;) {
            if (/^data-.*/.test(attributes[i].name)) {
                key = attributes[i].name.replace('data-', '').split('-');
                for (var y = 1; y < key.length; y++) {
                    key[y] = ABC.capitalize(key[y]);
                }
                key = key.join('');
                dataset[key] = element.getAttribute(attributes[i].name);
            }
        }

        return dataset;
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

                if (!!computedStyle) {
                    computedStyle = ~computedStyle.indexOf('px') ? computedStyle.split('px')[0] * 1 : computedStyle;
                }
            }
            return computedStyle;
        },
        has: function (key) {
            return this.element.hasOwnProperty(key);
        },
        closest: function (selector) {
            var attr = ABC.selectorAccess(selector);
            selector = attr !== 'tagName' ? selector.substr(1) : selector;

            while (this.element) {
                if (this.element[attr].toLowerCase() === selector) {
                    break;
                }
                this.element = this.element.parentElement;
            }
            return this.element;
        },
        deleg: function (event, element, handler, capture) {
            var elem = ABC(this.element), node = null, attr = ABC.selectorAccess(element);
            elem.on(event, function (e) {
                if (!capture) {
                    node = !!element ? ABC(e.target).closest(element) : ABC(e.target);
                } else {
                    node = e.target[attr].toLowerCase() === element.toLowerCase() ? e.target : null;
                }
                if (!!node) {
                    handler(e, node, node.dataset || getDataset(node));
                }
            }, capture);

            return {
                remove: function () {
                    elem.off('**', capture);
                }
            };
        },
        on: function (event, handler, capture) {
            var elem = this.element;
            elem.events = elem.events || {};
            if (!elem[event + 'handle'] && typeof elem[event + 'handle'] !== 'function') {
                elem[event + 'handle'] = function (e) {
                    var handlers = elem.events[event];
                    for (var i = 0; i < handlers.length; i++) {
                        handlers[i].call(elem, e);
                    }
                };
            }
            if (!elem.events[event]) {
                elem.events[event] = [];
                elem.addEventListener(event, elem[event + 'handle'], !!capture);
            }
            elem.events[event].push(handler);
        },
        off: function (event, handler, capture) {
            var elem = this.element;
            var handlers = elem.events[event] || elem.events;
            var i;

            if (ABC.isObject(handlers)) {
                for (var key in handlers) {
                    if (handlers.hasOwnProperty(key)) {
                        for (i = handlers[key].length - 1; i >= 0; i--) {
                            handlers[key].splice(i, 1);
                        }
                        if (!handlers[key].length) {
                            delete elem.events[key];
                            elem.removeEventListener(event, elem[key + 'handle'], !!capture);
                        }
                    }
                }
            } else if (ABC.isArray(handlers)) {
                for (i = handlers.length - 1; i >= 0; i--) {
                    handlers.splice(i, 1);
                }
                if (!handlers.length) {
                    delete elem.events[event];
                    elem.removeEventListener(event, elem[event + 'handle'], !!capture);
                }
            }
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
        innerHtml: function (html) {
            while (this.element.firstChild) {
                this.element.removeChild(this.element.firstChild);
            }
            this.element.insertAdjacentHTML('afterbegin', html);
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

    ABC.selectorAccess = function (selector) {
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

        return bySelector(selector);

        function bySelector(selector) {
            for (var key in regEx) {
                if (regEx[key].test(selector)) {
                    return attrs[key];
                }
            }
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

        function attachElement(settings) {
            if (!!this.api) {
                this.api.remove();
                this.api = null;
            }
            this.$el = ABC(HeaderABC.component.rootNode).find(settings.element);
            this.element = this.$el.get() || null;
        }

        function attachEvents() {
            var eventAttrs, o = this;
            if ('events' in o && !!o.element) {
                for (var key in o.events) {
                    if (o.events.hasOwnProperty(key)) {
                        eventAttrs = key.split(' ');
                        o.api = o.$el.deleg(eventAttrs[0], eventAttrs[1], (function (key) {
                            return function () {
                                o[o.events[key]].apply(o, Array.prototype.slice.call(arguments));
                            };
                        })(key), eventAttrs[1] && eventAttrs[1].toLowerCase() === 'img');
                    }
                }
            }
        }

        function init(settings) {
            if (settings.hasOwnProperty('name')) {
                if (!cache.hasOwnProperty(settings.name)) {
                    cache[settings.name] = new Component(settings);
                    cache[settings.name].$render = cache[settings.name].render;
                } else {
                    cache[settings.name].template = settings.template;
                    cache[settings.name].model = settings.model;
                    if (!cache[settings.name].updated) {
                        cache[settings.name].render = function () {
                            attachElement.call(cache[settings.name], settings);
                            cache[settings.name].$render();
                            attachEvents.call(cache[settings.name]);
                        };
                        cache[settings.name].updated = true;
                    }
                }

                return cache[settings.name];
            }
        }

        function prepareObject() {
            var o = this;
            attachElement.call(o, this);
            attachEvents.call(o);
            return o;
        }

        function Component(settings) {
            for (var key in settings) {
                if (settings.hasOwnProperty(key)) {
                    this[key] = settings[key];
                }
            }
            prepareObject.apply(this);
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

    ABC.throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options = options || {};
        var later = function () {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        };
        return function () {
            var now = Date.now();
            if (!previous && options.leading === false) {
                previous = now;
            }
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    ABC.debounce = function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function () {
            var last = Date.now() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) {
                        context = args = null;
                    }
                }
            }
        };

        return function () {
            context = this;
            args = arguments;
            timestamp = Date.now();
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
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

    Object.defineProperty(HeaderABC, '_ut', { value: {} });
    Object.defineProperty(HeaderABC._ut, 'utils', { value: ABC });
    Object.defineProperty(HeaderABC._ut, 'state', { value: appState });
    Object.defineProperty(HeaderABC._ut, 'promise', { value: Promise });

    window.addEventListener('message', receiveMessage, false);

    window.HeaderABC = HeaderABC;

})(window);