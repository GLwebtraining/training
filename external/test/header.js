(function(window){'use strict';var
location=window.location,document=window.document,docElem=document.documentElement;var HeaderABC={define:function(){this.head=document.head||ABC('head')[0];this.body=ABC(document.body);this.firstBodyElement=this.body.get().children[0];this.isHtmlGenerated=false;this.isCssGenerated=false;this.sidebarOpened=false;this.progressDone=this.generated();this.ready();},settings:{userName:'User',isExpenseNow:false,menuUrl:null},config:function(settings){if(settings){for(var key in settings){this.settings[key]=settings[key];}}
if(this.settings.isExpenseNow&&!!HeaderABC.initialized){HeaderABC.expenseNow();}},generate:{html:function(){if(!HeaderABC.isHtmlGenerated){HeaderABC.element=ABC('<div></div>').attrs({id:'HeaderABC',className:'clearfix',style:'display: none'});HeaderABC.element.html(HeaderABC.template);HeaderABC.isHtmlGenerated=true;HeaderABC.progressDone('html');}},css:function(){if(!HeaderABC.isCssGenerated){HeaderABC.styleSheet=ABC('<style>').attrs({type:'text/css'}).get();HeaderABC.css=HeaderABC.cssArray.join('');if(HeaderABC.styleSheet.styleSheet){HeaderABC.styleSheet.styleSheet.cssText=HeaderABC.css;}else{HeaderABC.styleSheet.appendChild(document.createTextNode(HeaderABC.css));}
HeaderABC.isCssGenerated=true;HeaderABC.progressDone('css');}},menu:function(){if(!!HeaderABC.settings.menuUrl){getFile(HeaderABC.settings.menuUrl).then(getMenuCallback,function(error){getMenuCallback('');});}else{getMenuCallback('');}
function getMenuCallback(data){HeaderABC.menuConfig=ABC.isJson(data)?JSON.parse(data):HeaderABC.fallback.menu;HeaderABC.menu=generateItems(HeaderABC.menuConfig);HeaderABC.element.find('.sidebar-wrapper').html(HeaderABC.menu);HeaderABC.element.find('.logo').attrs({href:location.protocol+'//'+location.host+'/#/'}).html(HeaderABC.getTitle());}
function generateItems(json){var listHtml='<ul class="list">';var listHtmlEnd='</ul>';if(!!json.length){for(var i=0;i<json.length;i++){listHtml+='<li><a href="'+json[i].url+'" tabindex="'+(i+2)+'">'+json[i].name+'</a></li>';}}else{listHtmlEnd='';listHtml='<div class="error-message">Something went wrong with menu, please try again later</div>'}
listHtml+=listHtmlEnd;return listHtml;}}},getTitle:function(){if(HeaderABC.settings.isExpenseNow===true){return'Expenses';}
var host=location.hostname;for(var i=0;i<HeaderABC.menuConfig.length;i++){if(HeaderABC.menuConfig[i].url.indexOf(host)!==-1){return ABC.capitalize(HeaderABC.menuConfig[i].name.toLowerCase());}}
return'';},setUserName:function(){var userNameHtml='',name=HeaderABC.settings.userName,onBehalfOf=HeaderABC.settings.onBehalfOf;function breakWords(input){return input?'<em>'+input.split(' ').join('</em><em>')+'</em>':'';}
userNameHtml+=breakWords(name);if(onBehalfOf){userNameHtml+=' on behalf of'+breakWords(onBehalfOf);}
HeaderABC.element.find('.avatar').html(userNameHtml);},render:{userName:function(){HeaderABC.setUserName();}},applyMarkup:function(){var deferred=ABC.defer();var _this=this;if(!!_this.isHtmlGenerated&&!!_this.isCssGenerated){_this.head.appendChild(HeaderABC.styleSheet);setTimeout(function(){_this.body.addClass('header-abc');_this.body.get().insertBefore(HeaderABC.element.get(),_this.body.get().children[0]);HeaderABC.setUserName();deferred.resolve();},10);}
return deferred.promise;},closeMenu:function(){ABC('#HeaderABC-SidebarMenu').removeClass('opened');ABC('#HeaderABC-overlay').removeClass('opened');HeaderABC.body.removeClass('sidebar-abc-opened');HeaderABC.sidebarOpened=false;},closeOuter:function(){ABC('#ABCouter-wrapper').removeClass('opened');ABC('#HeaderABC-overlay').removeClass('outer-opened');HeaderABC.body.removeClass('upm-abc-opened');HeaderABC.outerOpened=false;},applyEvents:function(){ABC('#HeaderABC').find('.hamburger-menu').on('click',toggleSidebar);ABC('#HeaderABC-overlay').on('click',closeAll);ABC('#HeaderABC').on('click',function(e){var el=e.target;while(el){parent=el.parentElement;if(parent&&(el.id==='HeaderABC-SidebarMenu'||parent.id==='HeaderABC-SidebarMenu')){break;}
if(parent&&(el.id==='HeaderABC'||parent.id==='HeaderABC')){HeaderABC.closeMenu();break;}
el=parent;}});focusGuard();function toggleSidebar(e){e.stopPropagation();e.preventDefault();if(HeaderABC.sidebarOpened){HeaderABC.closeMenu();}else{ABC('#HeaderABC-SidebarMenu').addClass('opened');ABC('#HeaderABC-overlay').addClass('opened');HeaderABC.body.addClass('sidebar-abc-opened');HeaderABC.sidebarOpened=true;ABC('#HeaderABC-SidebarMenu').get().focus();if(ABC('#HeaderABC-SidebarMenu').find('.list')&&ABC('#HeaderABC-SidebarMenu').find('.list').hasOwnProperty('get')){ABC('#HeaderABC-SidebarMenu').find('.list').find('li').get().focus();}}}
function toggleOuter(){var iframe;if(HeaderABC.outerOpened){HeaderABC.closeOuter();}else{HeaderABC.body.addClass('upm-abc-opened');ABC('#ABCouter-wrapper').addClass('opened');ABC('#HeaderABC-overlay').addClass('outer-opened');HeaderABC.outerOpened=true;if(!ABC('#user-profile').get()){iframe=ABC('<iframe></iframe>').attrs({id:'user-profile',src:'https://upm.local.synapse.com'});ABC('#ABCouter-wrapper').find('.content').get().appendChild(iframe.get());}}}
function closeAll(){HeaderABC.closeMenu();HeaderABC.closeOuter();}},fallback:{menu:[]},generated:function(){var triggers=(function(){var obj={};for(var key in HeaderABC.generate){if(key!=='menu'){obj[key]=false;}}
return obj;})();return function(trigger){var done=true;if(trigger in triggers){triggers[trigger]=true;}
for(var key in triggers){if(!triggers[key]){done=false;break;}}
if(done){HeaderABC.initialized=true;HeaderABC.loaded.resolve();}}},template:getMainTemplate(),cssArray:getCssArray(),initialize:function(){this.define();this.generate.html();this.generate.css();this.generate.menu();},ready:function(){this.loaded=ABC.defer();this.loaded.promise.then(function(){HeaderABC.applyMarkup().then(function(){HeaderABC.applyEvents();HeaderABC.expenseNow();});});},expenseNow:function(){if(HeaderABC.settings.isExpenseNow===true){intializeExpenseNow();}}};function getFile(fileName){var deferred=ABC.defer();ABC.ajax({url:fileName,success:function(response){deferred.resolve(response);},error:function(error){deferred.reject(error);}});return deferred.promise;}
function focusGuard(){if(!ABC('#HeaderABC-SidebarMenu').find('.list')||!ABC('#HeaderABC-SidebarMenu').find('.list').hasOwnProperty('get')){return;}
var menuParent=ABC('#HeaderABC-SidebarMenu').get();var element=ABC('#HeaderABC-SidebarMenu').find('.list').get();var firstLink=ABC('#HeaderABC-SidebarMenu').find('.list').find('a').get();var links=ABC.Element('a',menuParent);var focusGuardLinkStart=ABC('<a></a>').attrs({focusguard:true,href:'#',tabindex:1});var focusGuardLinkEnd=ABC('<a></a>').attrs({focusguard:true,href:'#',tabindex:99});element.insertBefore(focusGuardLinkStart.get(),firstLink.parentNode);element.appendChild(focusGuardLinkEnd.get());for(var i=0;i<links.length;i++){links[i].onfocus=(function(index){return function(){if(links[index].getAttribute('focusguard')==='true'){if(links[index].tabIndex===1){firstLink.focus();}
if(links[index].tabIndex===99){links[links.length-2].focus();}}}})(i);}}
function getCssArray(){return['@import url(https://fonts.googleapis.com/css?family=Droid+Sans:400,700);','@media only screen and (max-width: 640px){','#HeaderABC .predefine-actions li .avatar em:not(:first-child)','{display:none}','}','body.header-abc','{margin-top:0;margin-left:0;margin-right:0;padding:61px 0 0}','body.sidebar-abc-opened','{overflow:hidden}','body.upm-abc-opened','{overflow:hidden}','#HeaderABC','{width:100%;font:12px/14px "Droid Sans",Arial,sans-serif;position:absolute;z-index:2147483644;left:0;top:0;border-bottom:1px solid #ddd;min-width:320px;display:block !important;}','#HeaderABC ul','{margin:0;padding:0;list-style:none}','#HeaderABC .header-wrapper','{width:100%;box-sizing:border-box;padding:18px 20px;position:relative;z-index:11;background:#fff;outline:none;}','#HeaderABC .header-wrapper .logo','{float:left;height:24px;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjMwcHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDMwIDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMy44LjIgKDI5NzUzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5FMUNENEM5Ny00MUQwLTQ5OUUtODExRi0zNTVCQTU3RjlBRTg8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9Im5ldyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkhlYWRlci1zdWJsaW5rcyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU2LjAwMDAwMCwgLTE4LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMi1Db3B5LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU2LjAwMDAwMCwgMTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlBhdGgtMTAzOCIgZmlsbD0iIzMwM0U0OCIgcG9pbnRzPSI3Ljk4NTUxOTI2IDAuMDgzNDAwOTc0IDE1LjEwMjk4MyAxMS41MzY5MzE4IDIyLjM1MTgyOTggMTEuNTM2OTMxOCAxNS4yMDU3Njg2IDAuMDgxNTc0Njc1MyI+PC9wb2x5bGluZT4KICAgICAgICAgICAgICAgIDxwb2x5bGluZSBpZD0iUGF0aC0xMDM4LUNvcHkiIGZpbGw9IiNCREMwQzQiIHBvaW50cz0iMTUuNTYxMjc2OCAxMi40NDcwMzczIDIyLjY3ODc0MDUgMjMuOTAwNTY4MiAyOS45Mjc1ODczIDIzLjkwMDU2ODIgMjIuNzgxNTI2MiAxMi40NDUyMTEiPjwvcG9seWxpbmU+CiAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlBhdGgtMTAzOC1Db3B5LTIiIGZpbGw9IiNCREMwQzQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuMTg4ODc3LCAxOC4xNzI4OTApIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTcuMTg4ODc3LCAtMTguMTcyODkwKSAiIHBvaW50cz0iMC4wMDU3MjEyNzUyNSAxMi40NDcwMzczIDcuMTIzMTg0OTcgMjMuOTAwNTY4MiAxNC4zNzIwMzE4IDIzLjkwMDU2ODIgNy4yMjU5NzA2NCAxMi40NDUyMTEiPjwvcG9seWxpbmU+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==) no-repeat;line-height:24px;padding:0 0 0 35px;text-decoration:none;color:#3f545f;font:13px/24px "Droid Sans",Arial,sans-serif;font-weight:700;text-transform:uppercase}','#HeaderABC .hamburger-menu','{text-decoration:none;float:left;margin:7px 20px 0 0;width:16px;height:12px;position:relative;-webkit-transform:rotate(0);-moz-transform:rotate(0);-o-transform:rotate(0);transform:rotate(0);-webkit-transition:.5s ease-in-out;-moz-transition:.5s ease-in-out;-o-transition:.5s ease-in-out;transition:.5s ease-in-out;cursor:pointer}','#HeaderABC .hamburger-menu:hover span','{background-color:#3f545f}','#HeaderABC .hamburger-menu span','{display:block;position:absolute;height:2px;width:100%;background:#b2b2b2;opacity:1;left:0;-webkit-transform:rotate(0);-moz-transform:rotate(0);-o-transform:rotate(0);transform:rotate(0);-webkit-transition:.25s ease-in-out;-moz-transition:.25s ease-in-out;-o-transition:.25s ease-in-out;transition:.25s ease-in-out}','#HeaderABC .hamburger-menu span:nth-child(1)','{top:0}','#HeaderABC .hamburger-menu span:nth-child(2)','{top:4px}','#HeaderABC .hamburger-menu span:nth-child(3)','{top:4px}','#HeaderABC .hamburger-menu span:nth-child(4)','{top:8px}','.sidebar-abc-opened #HeaderABC .hamburger-menu span:nth-child(1)','{top:4px;width:0;left:50%}','.sidebar-abc-opened #HeaderABC .hamburger-menu span:nth-child(4)','{top:4px;width:0;left:50%}','.sidebar-abc-opened #HeaderABC .hamburger-menu span:nth-child(2)','{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}','.sidebar-abc-opened #HeaderABC .hamburger-menu span:nth-child(3)','{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}','#HeaderABC-SidebarMenu,#HeaderABC-overlay','{position:fixed;top:0;right:0;bottom:0;left:0;outline:none;}','#HeaderABC .predefine-actions','{float:right}','#HeaderABC .predefine-actions li','{float:left;margin:0 0 0 20px}','#HeaderABC .predefine-actions li .avatar','{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI1cHgiIGhlaWdodD0iMjVweCIgdmlld0JveD0iMCAwIDI1IDI1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjguMiAoMjk3NTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPkNvbWJpbmVkIFNoYXBlPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9Im5ldyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ikdyb3VwIiBmaWxsPSIjOTc5Nzk3Ij4KICAgICAgICAgICAgPHBhdGggZD0iTTguNjU3NTgyMDMsMTMuODQzNDI2NyBDNi4zMzAxMzkyNywxNS4wNjYxMTU5IDQuODU4NjU5MTcsMTcuNDUwODU5MSA0LjM0MjE4NTM2LDE5LjcwOTgzNDEgQzIuNjQzNzgyMzMsMTcuNzg5NTY3NiAxLjYxMjkwMzIzLDE1LjI2NTE3MTIgMS42MTI5MDMyMywxMi41IEMxLjYxMjkwMzIzLDYuNDg3MjIyNDggNi40ODcyMjI0OCwxLjYxMjkwMzIzIDEyLjUsMS42MTI5MDMyMyBDMTguNTEyNzc3NSwxLjYxMjkwMzIzIDIzLjM4NzA5NjgsNi40ODcyMjI0OCAyMy4zODcwOTY4LDEyLjUgQzIzLjM4NzA5NjgsMTUuMjYxNTQxMSAyMi4zNTg5MjI1LDE3Ljc4MjkzOTIgMjAuNjY0NSwxOS43MDIyNjg0IEMyMC4xNzcwNzU4LDE3LjQ3NjY1NjMgMTguNjc1NDkxNywxNS4xMTU2OTU3IDE2LjMxOTkyMDksMTMuODc5ODQ1MSBDMTYuNzUwOTM0MiwxMy4xODk0ODEzIDE3LDEyLjM3MzgyNjkgMTcsMTEuNSBDMTcsOS4wMTQ3MTg2MyAxNC45ODUyODE0LDcgMTIuNSw3IEMxMC4wMTQ3MTg2LDcgOCw5LjAxNDcxODYzIDgsMTEuNSBDOCwxMi4zNTg1MDk5IDguMjQwNDEwNzgsMTMuMTYwODY4OSA4LjY1NzU4MjAzLDEzLjg0MzQyNjcgWiBNOS44NjgwNjc0OCwxNS4xNTA0Njc0IEM3LjI5Njc4MjA4LDE2LjI0MzU5OTYgNS44MzQ2MTkxNCwxOS4yNjQ1OTcyIDUuODM0NjE5MTQsMjEuNDY2MDY0NSBMNS41MzY2NzYxMiwyMC44MTk3NDE3IEM1LjYxMjg2ODUyLDIwLjg4NDgyMTUgNS43NzMwNjgyNywyMS4wMTA3Njk4IDYuMDA3MzY1MTcsMjEuMTc3MzA3IEM2LjQwNTIzMzgxLDIxLjQ2MDExMDIgNi44NTgxMzIwOCwyMS43NDM5MjE3IDcuMzU1NjU0NTYsMjIuMDA4Njg1OCBDOS4wMDg3NTE4NiwyMi44ODg0MDY0IDEwLjcyOTU1MTcsMjMuMzQzNjk4MSAxMi4zOTQ5OTg3LDIzLjE2MzcwOTggQzE2LjMxNzg1MjIsMjIuNzM5NzU5IDE4LjYwNjA3NTcsMjEuOTE5NzM3OSAxOS4yNTM5MzkzLDIwLjgwOTc5NSBMMTkuMTM4MDM3MSwyMS4yMzgyODEzIEMxOS4xMzgwMzcxLDE5LjExODk0NjQgMTcuNjU0MTQ2OSwxNi4yNzMyMjA2IDE1LjA5MTg4NTMsMTUuMTc5MDYwNiBDMTUuMDYwMjIyOCwxNS4yMDE0MDc3IDE1LjAyODI1ODksMTUuMjIzMzU2MyAxNC45OTYwMDEsMTUuMjQ0ODk5MiBDMTQuNTg1NTQ2MSwxNS45MjY3OTI5IDEzLjc3MjU0NTYsMTYuMjYwODg4NyAxMi40ODYzMjgxLDE2LjI2MDg4ODcgQzExLjIxMTk0MjYsMTYuMjYwODg4NyAxMC4zOTMyNDYxLDE1Ljk0NDg4MjkgOS45MDQ0NjY2OSwxNS4zMTg2NyBDOS44MzE1NDY1NywxNS4yMjUyNDY1IDkuNzY5NTA3ODEsMTUuMTI5NDc2NSA5LjcxNjIxODA4LDE1LjAzNTg1MTcgQzkuNzY1OTk2NDcsMTUuMDc1MDk2MyA5LjgxNjYyMzYyLDE1LjExMzMxMjIgOS44NjgwNjc0OCwxNS4xNTA0Njc0IFogTTkuOTc0NTMyMjUsMjQuNzQ0NzU3MyBDMTAuNzkwMTk3NiwyNC45MTIxMDUgMTEuNjM0ODM0MywyNSAxMi41LDI1IEMxNC41NTM0MTM0LDI1IDE2LjQ5MTE4MzMsMjQuNTA0ODcwOCAxOC4yMDA0MzQyLDIzLjYyNzQ4NzUgQzE5LjA1NTA3OTEsMjMuMjcxMzQ2MiAxOS43MjQyMjE0LDIyLjg0NTQzMDEgMjAuMjEwNzU5NywyMi4zMzkwODk3IEMyMy4xMjY2OTI5LDIwLjA1MDcxNDggMjUsMTYuNDk0MTI0NiAyNSwxMi41IEMyNSw1LjU5NjQ0MDYzIDE5LjQwMzU1OTQsMCAxMi41LDAgQzUuNTk2NDQwNjMsMCAwLDUuNTk2NDQwNjMgMCwxMi41IEMwLDE2LjE4NjU5MzkgMS41OTU5MzkyOSwxOS41MDA0MzYyIDQuMTM0NjE5MTQsMjEuNzg4MzI4MSBMNC4xMzQ2MTkxNCwyMS44NTc4OTkgTDQuNDMyNTYyMTYsMjIuMTEyMzg3MiBDNC44NTQ2MjM5MywyMi40NzI4OTE1IDUuNTg1NTUyMjksMjIuOTkyNDMyMSA2LjU1NzAxOTksMjMuNTA5NDEzMiBDNy42NjU0NzY4NSwyNC4wOTkyOTUyIDguODExMDkyMzMsMjQuNTI4NTE0IDkuOTc0NTMyMjUsMjQuNzQ0NzU3MyBaIE0xNS4zODcwOTY4LDExLjUgQzE1LjM4NzA5NjgsOS45MDU1MDA0OCAxNC4wOTQ0OTk1LDguNjEyOTAzMjMgMTIuNSw4LjYxMjkwMzIzIEMxMC45MDU1MDA1LDguNjEyOTAzMjMgOS42MTI5MDMyMyw5LjkwNTUwMDQ4IDkuNjEyOTAzMjMsMTEuNSBDOS42MTI5MDMyMywxMy4wOTQ0OTk1IDEwLjkwNTUwMDUsMTQuMzg3MDk2OCAxMi41LDE0LjM4NzA5NjggQzE0LjA5NDQ5OTUsMTQuMzg3MDk2OCAxNS4zODcwOTY4LDEzLjA5NDQ5OTUgMTUuMzg3MDk2OCwxMS41IFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+) no-repeat;height:25px;line-height:26px;display:block;padding:0 0 0 35px;cursor:pointer;color:#3f545f;font:13px/24px "Droid Sans",Arial,sans-serif}','#HeaderABC .predefine-actions li .avatar em','{font:13px/24px "Droid Sans",Arial,sans-serif;font-weight:700;}','#HeaderABC .predefine-actions li .avatar em:not(:first-child)','{padding:0 0 0 5px}','#HeaderABC .clearfix:after','{content:" ";display:table}','#HeaderABC .clearfix:before','{content:" ";display:table}','#HeaderABC .predefine-actions li a','{text-decoration:none}','#HeaderABC .hide-text','{text-indent:-9999px;font-size:0}','#HeaderABC .clearfix:after','{clear:both}','#HeaderABC-SidebarMenu','{display:none;width:270px;background:#fff;z-index:10}','#HeaderABC-SidebarMenu.opened','{display:block}','#HeaderABC-SidebarMenu .sidebar-wrapper','{width:100%;overflow:hidden;padding:61px 0 0}','#HeaderABC-SidebarMenu .sidebar-wrapper .list','{margin:0;padding:12px 0 0;list-style:none;border-top:1px solid #ddd}','#HeaderABC-SidebarMenu .sidebar-wrapper .list li a{','text-decoration:none;display:block;padding:0 0 0 56px;color:#3f545f;font:13px/60px "Droid Sans",Arial,sans-serif;font-weight:700;text-transform:uppercase;text-align:left}','#HeaderABC-SidebarMenu .sidebar-wrapper .list li a:hover','{background-color:#f3f4f3}','#HeaderABC-SidebarMenu .sidebar-wrapper .list li a:focus','{background-color:#f3f4f3}','#HeaderABC-SidebarMenu .sidebar-wrapper .error-message','{color:#3f545f;text-align:center;font:12px/22px "Droid Sans",Arial,sans-serif;padding:53px 0 0;position:absolute;left:36px;top:50%;width:200px;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMzkuMSAoMzE3MjApIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPjRERDJGRkI4LTY1RTEtNDhCQy1CRjZCLTA5RTY1QTEzQ0M3NzwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0ibmV3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iSGFtYnVyZ2VyLU1lbnUtRXJyb3IiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTYuMDAwMDAwLCAtMzQwLjAwMDAwMCkiIGZpbGw9IiMwMEIxQjAiPgogICAgICAgICAgICA8cGF0aCBkPSJNMTM2LDM4MCBDMTI0LjkzNjE3LDM4MCAxMTYsMzcxLjA2MzgzIDExNiwzNjAgQzExNiwzNDguOTM2MTcgMTI0LjkzNjE3LDM0MCAxMzYsMzQwIEMxNDcuMDYzODMsMzQwIDE1NiwzNDguOTM2MTcgMTU2LDM2MCBDMTU2LDM3MS4wNjM4MyAxNDcuMDYzODMsMzgwIDEzNiwzODAgTDEzNiwzODAgWiBNMTE3Ljg5MzYxNywzNjAgQzExNy44OTM2MTcsMzY5Ljk3Njk4NyAxMjYuMDIzMDEzLDM3OC4xMDYzODMgMTM2LDM3OC4xMDYzODMgQzE0NS45NzY5ODcsMzc4LjEwNjM4MyAxNTQuMTA2MzgzLDM2OS45NzY5ODcgMTU0LjEwNjM4MywzNjAgQzE1NC4xMDYzODMsMzUwLjAyMzAxMyAxNDUuOTc2OTg3LDM0MS44OTM2MTcgMTM2LDM0MS44OTM2MTcgQzEyNi4wMjMwMTMsMzQxLjg5MzYxNyAxMTcuODkzNjE3LDM1MC4wMjMwMTMgMTE3Ljg5MzYxNywzNjAgWiBNMTM2LDM3MC4xNDU5MzYgQzEzNS4yOTc4NzIsMzcwLjE0NTkzNiAxMzQuNzIzNDA0LDM2OS41NjExNzQgMTM0LjcyMzQwNCwzNjguODQ2NDY1IEwxMzQuNzIzNDA0LDM1OC4zMjA3NDggQzEzNC43MjM0MDQsMzU3LjYwNjAzOSAxMzUuMjk3ODcyLDM1Ny4wMjEyNzcgMTM2LDM1Ny4wMjEyNzcgQzEzNi43MDIxMjgsMzU3LjAyMTI3NyAxMzcuMjc2NTk2LDM1Ny42MDYwMzkgMTM3LjI3NjU5NiwzNTguMzIwNzQ4IEwxMzcuMjc2NTk2LDM2OC45MTE0MzkgQzEzNy4yNzY1OTYsMzY5LjU2MTE3NCAxMzYuNzAyMTI4LDM3MC4xNDU5MzYgMTM2LDM3MC4xNDU5MzYgWiBNMTM0LjcyMzQwNCwzNTMuMzE0MSBMMTM0LjcyMzQwNCwzNTIuMjE3ODE1IEMxMzQuNzIzNDA0LDM1MS41ODMxMjMgMTM1LjI5Nzg3MiwzNTEuMDYzODMgMTM2LDM1MS4wNjM4MyBDMTM2LjcwMjEyOCwzNTEuMDYzODMgMTM3LjI3NjU5NiwzNTEuNTgzMTIzIDEzNy4yNzY1OTYsMzUyLjIxNzgxNSBMMTM3LjI3NjU5NiwzNTMuMzE0MSBDMTM3LjIxMjc2NiwzNTMuOTQ4NzkyIDEzNi43MDIxMjgsMzU0LjQ2ODA4NSAxMzYsMzU0LjQ2ODA4NSBDMTM1LjI5Nzg3MiwzNTQuNDY4MDg1IDEzNC43MjM0MDQsMzUzLjk0ODc5MiAxMzQuNzIzNDA0LDM1My4zMTQxIFoiIGlkPSJpX25vcmVzdWx0Ij48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=) no-repeat 50% 0;}','#HeaderABC-overlay','{display:none;background-color:#000;opacity:.5;z-index:9}','#HeaderABC-overlay.outer-opened','{display:block;z-index:11}','#HeaderABC-overlay.opened','{display:block}','#ABCouter-wrapper','{position: fixed;width: calc(100% - 150px);height: calc(100% - 150px);top: 0;left: 0;z-index: 5000;display:none;margin: 75px;box-sizing: border-box;}','#ABCouter-wrapper .content','{position: relative;width: 100%;height: 100%;background: #fff;box-sizing: border-box;background: #fff;}','#ABCouter-wrapper .content iframe','{position: relative;width: 100%;height: 100%;}','#ABCouter-wrapper.opened','{display:block}'];}
function getMainTemplate(){return'<div class="header-wrapper clearfix" tabindex="-1">'+'<a href="#" class="hamburger-menu">'+'<span></span><span></span><span></span><span></span>'+'</a>'+'<a href="#" class="logo"></a>'+'<ul class="predefine-actions">'+'<li id="user"><span class="avatar">UserName</span></li>'+'</ul>'+'</div>'+'<div id="ABCouter-wrapper" tabindex="-1"><div class="content"></div></div>'+'<div id="HeaderABC-SidebarMenu" tabindex="-1">'+'<div class="sidebar-wrapper"></div>'+'</div>'+'<div id="HeaderABC-overlay" tabindex="-1"></div>';}
function intializeExpenseNow(){if(!!window.angular&&!HeaderABC.ExpenseNowInitialized){var injector=angular.element(document.body).injector();getRootScope.$inject=['$rootScope'];return injector.invoke(getRootScope,null,null);}}
function getRootScope($rootScope){$rootScope.$broadcast('header:init');HeaderABC.element.find('.logo').html('Expenses');HeaderABC.ExpenseNowInitialized=true;}
function ABC(element){if(!element){return;}
return new ABC.init(element);}
function Promise(){this.promise={callbacks:[],then:function(){this.callbacks=Array.prototype.slice.call(arguments);},resolved:false,rejected:false};}
Promise.prototype={resolve:function(){if(!!this.promise.callbacks.length&&!!this.promise.callbacks[0]&&typeof this.promise.callbacks[0]==='function'){this.promise.callbacks[0].apply(this,arguments);this.promise.resolved=true;}},reject:function(){if(!!this.promise.callbacks.length&&!!this.promise.callbacks[0]&&typeof this.promise.callbacks[1]==='function'){this.promise.callbacks[1].apply(this,arguments);this.promise.rejected=true;}}}
ABC.init=function(element){this.element=ABC.Element(element);}
ABC.init.prototype={attrs:function(obj){var element=this.element;if(ABC.isExists(element)&&ABC.isObject(obj)){for(var key in obj){if(ABC(obj).has(key)){element.setAttribute(key,obj[key]);}}}
return this;},css:function(obj){var element=this.element;if(ABC.isExists(element)&&ABC.isObject(obj)){for(var key in obj){if(ABC(obj).has(key)){element.style[key]=obj[key];}}}
return this;},getStyle:function(style){var computedStyle=null;if(!!style){computedStyle=window.getComputedStyle(this.element)[style];if(!!computedStyle&&computedStyle.indexOf('px')){computedStyle=computedStyle.split('px')[0]*1;}}
return computedStyle;},has:function(key){return this.element.hasOwnProperty(key);},on:function(event,handler){if(!event){return;}
this.element.addEventListener(event,function(e){handler(e);});},find:function(selector){var element=ABC.Element(selector,this.element);return element===null?this.element:(!!element.length)?ABC(element[0]):ABC(element);},addClass:function(className){if(this.element.classList){this.element.classList.add(className);}else if(!this.hasClass(className)){this.element.className+=" "+className;}
return this;},removeClass:function(className){if(this.element.classList){this.element.classList.remove(className);}else if(this.hasClass(className)){var reg=new RegExp('(\\s|^)'+className+'(\\s|$)');this.element.className=this.element.className.replace(reg,' ');}
return this;},hasClass:function(className){if(this.element.classList){return this.element.classList.contains(className);}else{return!!this.element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))}
return this;},html:function(html){this.element.innerHTML=html;return this;},get:function(){return this.element;}};ABC.isArray=function(item){if(ABC.isExists(item)){if(item instanceof Array){return true;}else{return false;}}else{return false;}};ABC.isObject=function(item){if(ABC.isExists(item)){if(!ABC.isArray(item)&&item instanceof Object){return true;}else{return false;}}else{return false;}};ABC.isFunction=function(f){return typeof f==='function';};ABC.isExists=function(item){return!!item;};ABC.returnNull=function(){return null;}
ABC.Element=function(selector,parentNode){if(!ABC.isQuerySelector(selector)){return selector;}
var delay,count=0;var regEx={byClassName:/\.[A-Za-z0-9]+/,byId:/\#[A-Za-z0-9]+/,byCreation:/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,byTag:/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/};var api={byTag:getByTag,byClassName:getByClassName,byId:getById,byCreation:getByCreation}
function checkSelector(selector){for(var key in regEx){if(regEx[key].test(selector)){return api[key](selector,parentNode);}}}
function getByTag(selector,parentNode){return(!!parentNode?parentNode:document).getElementsByTagName(selector)||null;}
function getById(selector){return document.getElementById(selector.substr(1))||null;}
function getByClassName(selector,parentNode){var matched=(!!parentNode?parentNode:document).querySelectorAll(selector);return matched.length>0?matched:null;}
function getByCreation(selector){var tag=selector.match(/([\w:-]+)/g,'')[0];return document.createElement(tag);}
return checkSelector(selector,parentNode);}
ABC.isNodeElement=function(element){return!!~[1,2,3,8].indexOf(element.nodeType);}
ABC.isQuerySelector=function(element){return!ABC.isNodeElement(element)&&!~['number','boolean'].indexOf(typeof element)&&!(ABC.isArray(element)||ABC.isObject(element)||ABC.isFunction(element));}
ABC.isJson=function(str){try{JSON.parse(str);}catch(e){return false;}
return true;}
ABC.defer=function(){return new Promise;}
ABC.ajax=function(settings){var _this=this;var request={isXdr:function(){return window.XDomainRequest?true:false;},createCrossDomainRequest:function(){return this.isXdr()?new XDomainRequest():new XMLHttpRequest();},send:function(){var invocation=this.createCrossDomainRequest();var params=[(!!settings.method?settings.method:'get'),settings.url,true];var body=settings.data||'';if(this.isXdr()){invocation.onload=processResult;invocation.open.apply(invocation,params);invocation.send(body);}else{invocation.open.apply(invocation,params);invocation.onreadystatechange=function(){if(invocation.readyState!=4)return;if(invocation.status!=200){if(_this.isFunction(settings.error)){settings.error({status:invocation.status,statusText:invocation.statusText,headers:invocation.getAllResponseHeaders()});}
return;}
processResult();};invocation.send(body);};function processResult(){if(_this.isFunction(settings.success)){settings.success(invocation.responseText);}}}};request.send();}
ABC.capitalize=function(string){return string.charAt(0).toUpperCase()+string.slice(1);}
ABC.ready=function(callback){window.document.addEventListener('DOMContentLoaded',function(event){if(!!callback&&typeof callback==='function'){callback(event);}});}
ABC.windowOnLoad=function(callback){window.addEventListener('load',function(event){if(!!callback&&typeof callback==='function'){callback(event);}});}
ABC.windowOnResize=function(callback){window.addEventListener('resize',function(event){if(!!callback&&typeof callback==='function'){callback(event);}});}
ABC.ready(function(){HeaderABC.initialize();});window.HeaderABC=HeaderABC;})(window);