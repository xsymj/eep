! function($) {
	Function.prototype.ligerExtend = function(e, t) {
		if("function" != typeof e) return this;
		this.base = e.prototype;
		this.base.constructor = e;
		var i = function() {};
		i.prototype = e.prototype;
		this.prototype = new i;
		this.prototype.constructor = this;
		t && $.extend(this.prototype, t)
	};
	Function.prototype.ligerDefer = function(e, t, i) {
		var r = this;
		return setTimeout(function() {
			r.apply(e, i || [])
		}, t)
	};
	window.liger = $.ligerui = {
		version: "V1.2.0",
		managerCount: 0,
		managers: {},
		managerIdPrev: "ligerui",
		autoNewId: !0,
		error: {
			managerIsExist: "管理器id已经存在"
		},
		pluginPrev: "liger",
		getId: function(e) {
			e = e || this.managerIdPrev;
			var t = e + (1e3 + this.managerCount);
			this.managerCount++;
			return t
		},
		add: function(e) {
			if(2 != arguments.length) {
				e.id || (e.id = this.getId(e.__idPrev()));
				this.managers[e.id] && (e.id = this.getId(e.__idPrev()));
				if(this.managers[e.id]) throw new Error(this.error.managerIsExist);
				this.managers[e.id] = e
			} else {
				var t = arguments[1];
				t.id = t.id || t.options.id || arguments[0].id;
				this.addManager(t)
			}
		},
		remove: function(e) {
			if("string" == typeof e || "number" == typeof e) delete liger.managers[e];
			else if("object" == typeof e)
				if(e instanceof liger.core.Component) delete liger.managers[e.id];
				else {
					if(!$(e).attr(this.idAttrName)) return !1;
					delete liger.managers[$(e).attr(this.idAttrName)]
				}
		},
		get: function(e, t) {
			t = t || "ligeruiid";
			if("string" == typeof e || "number" == typeof e) return liger.managers[e];
			if("object" == typeof e) {
				var i = e.length ? e[0] : e,
					r = i[t] || $(i).attr(t);
				return r ? liger.managers[r] : null
			}
			return null
		},
		find: function(e) {
			var t = [];
			for(var i in this.managers) {
				var r = this.managers[i];
				e instanceof Function ? r instanceof e && t.push(r) : e instanceof Array ? -1 != $.inArray(r.__getType(), e) && t.push(r) : r.__getType() == e && t.push(r)
			}
			return t
		},
		run: function(e, t, i) {
			if(e) {
				i = $.extend({
					defaultsNamespace: "ligerDefaults",
					methodsNamespace: "ligerMethods",
					controlNamespace: "controls",
					idAttrName: "ligeruiid",
					isStatic: !1,
					hasElement: !0,
					propertyToElemnt: null
				}, i || {});
				e = e.replace(/^ligerGet/, "");
				e = e.replace(/^liger/, "");
				if(null == this || this == window || i.isStatic) {
					liger.plugins[e] || (liger.plugins[e] = {
						fn: $[liger.pluginPrev + e],
						isStatic: !0
					});
					return new $.ligerui[i.controlNamespace][e]($.extend({}, $[i.defaultsNamespace][e] || {}, $[i.defaultsNamespace][e + "String"] || {}, t.length > 0 ? t[0] : {}))
				}
				liger.plugins[e] || (liger.plugins[e] = {
					fn: $.fn[liger.pluginPrev + e],
					isStatic: !1
				});
				if(/Manager$/.test(e)) return liger.get(this, i.idAttrName);
				this.each(function() {
					if(this[i.idAttrName] || $(this).attr(i.idAttrName)) {
						var r = liger.get(this[i.idAttrName] || $(this).attr(i.idAttrName));
						r && t.length > 0 && r.set(t[0])
					} else if(!(t.length >= 1 && "string" == typeof t[0])) {
						var a = t.length > 0 ? t[0] : null,
							s = $.extend({}, $[i.defaultsNamespace][e], $[i.defaultsNamespace][e + "String"], a);
						i.propertyToElemnt && (s[i.propertyToElemnt] = this);
						i.hasElement ? new $.ligerui[i.controlNamespace][e](this, s) : new $.ligerui[i.controlNamespace][e](s)
					}
				});
				if(0 == this.length) return null;
				if(0 == t.length) return liger.get(this, i.idAttrName);
				if("object" == typeof t[0]) return liger.get(this, i.idAttrName);
				if("string" == typeof t[0]) {
					var r = liger.get(this, i.idAttrName);
					if(null == r) return;
					if("option" != t[0]) {
						var a = t[0];
						if(!r[a]) return;
						var s = Array.apply(null, t);
						s.shift();
						return r[a].apply(r, s)
					}
					if(2 == t.length) return r.get(t[1]);
					if(t.length >= 3) return r.set(t[1], t[2])
				}
				return null
			}
		},
		defaults: {},
		methods: {},
		core: {},
		controls: {},
		plugins: {}
	};
	$.ligerDefaults = {};
	$.ligerMethos = {};
	liger.defaults = $.ligerDefaults;
	liger.methods = $.ligerMethos;
	$.fn.liger = function(e) {
		return e ? liger.run.call(this, e, arguments) : liger.get(this)
	};
	liger.core.Component = function(e) {
		this.events = this.events || {};
		this.options = e || {};
		this.children = {}
	};
	$.extend(liger.core.Component.prototype, {
		__getType: function() {
			return "liger.core.Component"
		},
		__idPrev: function() {
			return "ligerui"
		},
		set: function(e, t) {
			if(e)
				if("object" != typeof e) {
					var i = e;
					if(0 != i.indexOf("on")) {
						this.options || (this.options = {});
						if(0 != this.trigger("propertychange", [e, t])) {
							this.options[i] = t;
							var r = "_set" + i.substr(0, 1).toUpperCase() + i.substr(1);
							this[r] && this[r].call(this, t);
							this.trigger("propertychanged", [e, t])
						}
					} else "function" == typeof t && this.bind(i.substr(2), t)
				} else {
					var a;
					if(this.options != e) {
						$.extend(this.options, e);
						a = e
					} else a = $.extend({}, e);
					if(void 0 == t || 1 == t)
						for(var s in a) 0 == s.indexOf("on") && this.set(s, a[s]);
					if(void 0 == t || 0 == t)
						for(var s in a) 0 != s.indexOf("on") && this.set(s, a[s])
				}
		},
		get: function(e) {
			var t = "_get" + e.substr(0, 1).toUpperCase() + e.substr(1);
			return this[t] ? this[t].call(this, e) : this.options[e]
		},
		hasBind: function(e) {
			var t = e.toLowerCase(),
				i = this.events[t];
			return i && i.length ? !0 : !1
		},
		trigger: function(e, t) {
			if(e) {
				var i = e.toLowerCase(),
					r = this.events[i];
				if(r) {
					t = t || [];
					t instanceof Array == 0 && (t = [t]);
					for(var a = 0; a < r.length; a++) {
						var s = r[a];
						if(0 == s.handler.apply(s.context, t)) return !1
					}
				}
			}
		},
		bind: function(e, t, i) {
			if("object" != typeof e) {
				if("function" != typeof t) return !1;
				var r = e.toLowerCase(),
					a = this.events[r] || [];
				i = i || this;
				a.push({
					handler: t,
					context: i
				});
				this.events[r] = a
			} else
				for(var s in e) this.bind(s, e[s])
		},
		unbind: function(e, t) {
			if(e) {
				var i = e.toLowerCase(),
					r = this.events[i];
				if(r && r.length)
					if(t) {
						for(var a = 0, s = r.length; s > a; a++)
							if(r[a].handler == t) {
								r.splice(a, 1);
								break
							}
					} else delete this.events[i]
			} else this.events = {}
		},
		destroy: function() {
			liger.remove(this)
		}
	});
	liger.core.UIComponent = function(e, t) {
		liger.core.UIComponent.base.constructor.call(this, t);
		var i = this._extendMethods();
		i && $.extend(this, i);
		this.element = e;
		this._init();
		this._preRender();
		this.trigger("render");
		this._render();
		this.trigger("rendered");
		this._rendered()
	};
	liger.core.UIComponent.ligerExtend(liger.core.Component, {
		__getType: function() {
			return "liger.core.UIComponent"
		},
		_extendMethods: function() {},
		_init: function() {
			this.type = this.__getType();
			this.id = this.element ? this.options.id || this.element.id || liger.getId(this.__idPrev()) : this.options.id || liger.getId(this.__idPrev());
			liger.add(this);
			if(this.element) {
				var attributes = this.attr();
				if(attributes && attributes instanceof Array)
					for(var i = 0; i < attributes.length; i++) {
						var name = attributes[i];
						this.options[name] = $(this.element).attr(name)
					}
				var p = this.options;
				if($(this.element).attr("ligerui")) try {
					var attroptions = $(this.element).attr("ligerui");
					0 != attroptions.indexOf("{") && (attroptions = "{" + attroptions + "}");
					eval("attroptions = " + attroptions + ";");
					attroptions && $.extend(p, attroptions)
				} catch(e) {}
			}
		},
		_preRender: function() {},
		_render: function() {},
		_rendered: function() {
			this.element && $(this.element).attr("ligeruiid", this.id)
		},
		attr: function() {
			return []
		},
		destroy: function() {
			this.element && $(this.element).remove();
			this.options = null;
			liger.remove(this)
		}
	});
	liger.controls.Input = function(e, t) {
		liger.controls.Input.base.constructor.call(this, e, t)
	};
	liger.controls.Input.ligerExtend(liger.core.UIComponent, {
		__getType: function() {
			return "liger.controls.Input"
		},
		attr: function() {
			return ["nullText"]
		},
		setValue: function(e) {
			return this.set("value", e)
		},
		getValue: function() {
			return this.get("value")
		},
		_setReadonly: function(e) {
			var t = this.wrapper || this.text;
			if(t && t.hasClass("l-text")) {
				var i = this.inputText;
				if(e) {
					i && i.attr("readonly", "readonly");
					t.addClass("l-text-readonly")
				} else {
					i && i.removeAttr("readonly");
					t.removeClass("l-text-readonly")
				}
			}
		},
		setEnabled: function() {
			return this.set("disabled", !1)
		},
		setDisabled: function() {
			return this.set("disabled", !0)
		},
		updateStyle: function() {},
		resize: function(e, t) {
			this.set({
				width: e,
				height: t
			})
		}
	});
	liger.win = {
		top: !1,
		mask: function() {
			function e() {
				if(liger.win.windowMask) {
					var e = $(window).height() + $(window).scrollTop();
					liger.win.windowMask.height(e)
				}
			}
			if(!this.windowMask) {
				this.windowMask = $("<div class='l-window-mask' style='display: block;'></div>").appendTo("body");
				$(window).bind("resize.ligeruiwin", e);
				$(window).bind("scroll", e)
			}
			this.windowMask.show();
			e();
			this.masking = !0
		},
		unmask: function(e) {
			for(var t = $("body > .l-dialog:visible,body > .l-window:visible"), i = 0, r = t.length; r > i; i++) {
				var a = t.eq(i).attr("ligeruiid");
				if(!e || e.id != a) {
					var s = liger.get(a);
					if(s) {
						var o = s.get("modal");
						if(o) return
					}
				}
			}
			this.windowMask && this.windowMask.hide();
			this.masking = !1
		},
		createTaskbar: function() {
			if(!this.taskbar) {
				this.taskbar = $('<div class="l-taskbar"><div class="l-taskbar-tasks"></div><div class="l-clear"></div></div>').appendTo("body");
				this.top && this.taskbar.addClass("l-taskbar-top");
				this.taskbar.tasks = $(".l-taskbar-tasks:first", this.taskbar);
				this.tasks = {}
			}
			this.taskbar.show();
			this.taskbar.animate({
				bottom: 0
			});
			return this.taskbar
		},
		removeTaskbar: function() {
			var e = this;
			e.taskbar.animate({
				bottom: -32
			}, function() {
				e.taskbar.remove();
				e.taskbar = null
			})
		},
		activeTask: function(e) {
			for(var t in this.tasks) {
				var i = this.tasks[t];
				t == e.id ? i.addClass("l-taskbar-task-active") : i.removeClass("l-taskbar-task-active")
			}
		},
		getTask: function(e) {
			var t = this;
			return t.taskbar ? t.tasks[e.id] ? t.tasks[e.id] : null : void 0
		},
		addTask: function(e) {
			var t = this;
			t.taskbar || t.createTaskbar();
			if(t.tasks[e.id]) return t.tasks[e.id];
			var i = e.get("title"),
				r = t.tasks[e.id] = $('<div class="l-taskbar-task"><div class="l-taskbar-task-icon"></div><div class="l-taskbar-task-content">' + i + "</div></div>");
			t.taskbar.tasks.append(r);
			t.activeTask(e);
			r.bind("click", function() {
				t.activeTask(e);
				e.actived ? e.min() : e.active()
			}).hover(function() {
				$(this).addClass("l-taskbar-task-over")
			}, function() {
				$(this).removeClass("l-taskbar-task-over")
			});
			return r
		},
		hasTask: function() {
			for(var e in this.tasks)
				if(this.tasks[e]) return !0;
			return !1
		},
		removeTask: function(e) {
			var t = this;
			if(t.taskbar) {
				if(t.tasks[e.id]) {
					t.tasks[e.id].unbind();
					t.tasks[e.id].remove();
					delete t.tasks[e.id]
				}
				t.hasTask() || t.removeTaskbar()
			}
		},
		setFront: function(e) {
			var t = liger.find(liger.core.Win);
			for(var i in t) {
				var r = t[i];
				if(r == e) {
					$(r.element).css("z-index", "9200");
					this.activeTask(r)
				} else $(r.element).css("z-index", "9100")
			}
		}
	};
	liger.core.Win = function(e, t) {
		liger.core.Win.base.constructor.call(this, e, t)
	};
	liger.core.Win.ligerExtend(liger.core.UIComponent, {
		__getType: function() {
			return "liger.controls.Win"
		},
		mask: function() {
			this.options.modal && liger.win.mask(this)
		},
		unmask: function() {
			this.options.modal && liger.win.unmask(this)
		},
		min: function() {},
		max: function() {},
		active: function() {}
	});
	liger.draggable = {
		dragging: !1
	};
	liger.resizable = {
		reszing: !1
	};
	liger.toJSON = "object" == typeof JSON && JSON.stringify ? JSON.stringify : function(e) {
		var t = function(e) {
				return 10 > e ? "0" + e : e
			},
			i = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			r = function(e) {
				i.lastIndex = 0;
				return i.test(e) ? '"' + e.replace(i, function(e) {
					var t = meta[e];
					return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
				}) + '"' : '"' + e + '"'
			};
		if(null === e) return "null";
		var a = typeof e;
		if("undefined" === a) return void 0;
		if("string" === a) return r(e);
		if("number" === a || "boolean" === a) return "" + e;
		if("object" === a) {
			if("function" == typeof e.toJSON) return liger.toJSON(e.toJSON());
			if(e.constructor === Date) return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + t(this.getUTCMonth() + 1) + "-" + t(this.getUTCDate()) + "T" + t(this.getUTCHours()) + ":" + t(this.getUTCMinutes()) + ":" + t(this.getUTCSeconds()) + "Z" : null;
			var s = [];
			if(e.constructor === Array) {
				for(var o = 0, n = e.length; n > o; o++) s.push(liger.toJSON(e[o]) || "null");
				return "[" + s.join(",") + "]"
			}
			var l, d;
			for(var c in e) {
				a = typeof c;
				if("number" === a) l = '"' + c + '"';
				else {
					if("string" !== a) continue;
					l = r(c)
				}
				a = typeof e[c];
				if("function" !== a && "undefined" !== a) {
					d = liger.toJSON(e[c]);
					s.push(l + ":" + d)
				}
			}
			return "{" + s.join(",") + "}"
		}
	}
}(jQuery);
! function(e) {
	e.fn.ligerTab = function() {
		return e.ligerui.run.call(this, "ligerTab", arguments)
	};
	e.fn.ligerGetTabManager = function() {
		return e.ligerui.run.call(this, "ligerGetTabManager", arguments)
	};
	e.ligerDefaults.Tab = {
		height: null,
		heightDiff: 0,
		changeHeightOnResize: !1,
		contextmenu: !0,
		dblClickToClose: !1,
		dragToMove: !0,
		onBeforeOverrideTabItem: null,
		onAfterOverrideTabItem: null,
		onBeforeRemoveTabItem: null,
		onAfterRemoveTabItem: null,
		onBeforeAddTabItem: null,
		onAfterAddTabItem: null,
		onBeforeSelectTabItem: null,
		onAfterSelectTabItem: null,
		onAfterLeaveTabItem: null
	};
	e.ligerDefaults.TabString = {
		closeMessage: "关闭当前页",
		closeOtherMessage: "关闭其他",
		closeAllMessage: "关闭所有",
		reloadMessage: "刷新"
	};
	e.ligerMethos.Tab = {};
	e.ligerui.controls.Tab = function(t, i) {
		e.ligerui.controls.Tab.base.constructor.call(this, t, i)
	};
	e.ligerui.controls.Tab.ligerExtend(e.ligerui.core.UIComponent, {
		__getType: function() {
			return "Tab"
		},
		__idPrev: function() {
			return "Tab"
		},
		_extendMethods: function() {
			return e.ligerMethos.Tab
		},
		_render: function() {
			var t = this,
				i = this.options;
			i.height && (t.makeFullHeight = !0);
			t.tab = e(this.element);
			t.tab.addClass("l-tab");
			i.contextmenu && e.ligerMenu && (t.tab.menu = e.ligerMenu({
				width: 100,
				items: [{
					text: i.closeMessage,
					id: "close",
					click: function() {
						t._menuItemClick.apply(t, arguments)
					}
				}, {
					text: i.closeOtherMessage,
					id: "closeother",
					click: function() {
						t._menuItemClick.apply(t, arguments)
					}
				}, {
					text: i.closeAllMessage,
					id: "closeall",
					click: function() {
						t._menuItemClick.apply(t, arguments)
					}
				}, {
					text: i.reloadMessage,
					id: "reload",
					click: function() {
						t._menuItemClick.apply(t, arguments)
					}
				}]
			}));
			t.tab.content = e('<div class="l-tab-content"></div>');
			e("> div", t.tab).appendTo(t.tab.content);
			t.tab.content.appendTo(t.tab);
			t.tab.links = e('<div class="l-tab-links"><ul style="left: 0px; "></ul></div>');
			t.tab.links.prependTo(t.tab);
			t.tab.links.ul = e("ul", t.tab.links);
			var r = e("> div[lselected=true]", t.tab.content),
				a = r.length > 0;
			t.selectedTabId = r.attr("tabid");
			e("> div", t.tab.content).each(function(i) {
				var r = e('<li class=""><a></a><div class="l-tab-links-item-left"></div><div class="l-tab-links-item-right"></div></li>'),
					s = e(this);
				if(s.attr("title")) {
					e("> a", r).html(s.attr("title"));
					s.attr("title", "")
				}
				var o = s.attr("tabid");
				if(void 0 == o) {
					o = t.getNewTabid();
					s.attr("tabid", o);
					s.attr("lselected") && (t.selectedTabId = o)
				}
				r.attr("tabid", o);
				a || 0 != i || (t.selectedTabId = o);
				var n = s.attr("showClose");
				n && r.append("<div class='l-tab-links-item-close'></div>");
				e("> ul", t.tab.links).append(r);
				s.hasClass("l-tab-content-item") || s.addClass("l-tab-content-item");
				if(s.find("iframe").length > 0) {
					var l = e("iframe:first", s);
					if("complete" != l[0].readyState) {
						0 == s.find(".l-tab-loading:first").length && s.prepend("<div class='l-tab-loading' style='display:block;'></div>");
						var d = e(".l-tab-loading:first", s);
						l.bind("load.tab", function() {
							d.hide()
						})
					}
				}
			});
			t.selectTabItem(t.selectedTabId);
			if(i.height)
				if("string" == typeof i.height && i.height.indexOf("%") > 0) {
					t.onResize();
					i.changeHeightOnResize && e(window).resize(function() {
						t.onResize.call(t)
					})
				} else t.setHeight(i.height);
			t.makeFullHeight && t.setContentHeight();
			e("li", t.tab.links).each(function() {
				t._addTabItemEvent(e(this))
			});
			t.tab.bind("dblclick.tab", function(r) {
				if(i.dblClickToClose) {
					t.dblclicking = !0;
					var a = r.target || r.srcElement,
						s = a.tagName.toLowerCase();
					if("a" == s) {
						var o = e(a).parent().attr("tabid"),
							n = e(a).parent().find("div.l-tab-links-item-close").length ? !0 : !1;
						n && t.removeTabItem(o)
					}
					t.dblclicking = !1
				}
			});
			t.set(i)
		},
		_applyDrag: function(t) {
			{
				var i = this;
				this.options
			}
			i.droptip = i.droptip || e("<div class='l-tab-drag-droptip' style='display:none'><div class='l-drop-move-up'></div><div class='l-drop-move-down'></div></div>").appendTo("body");
			var r = e(t).ligerDrag({
				revert: !0,
				animate: !1,
				proxy: function() {
					var t = e(this).find("a").html();
					i.dragproxy = e("<div class='l-tab-drag-proxy' style='display:none'><div class='l-drop-icon l-drop-no'></div></div>").appendTo("body");
					i.dragproxy.append(t);
					return i.dragproxy
				},
				onRendered: function() {
					this.set("cursor", "pointer")
				},
				onStartDrag: function(i, r) {
					if(!e(t).hasClass("l-selected")) return !1;
					if(2 == r.button) return !1;
					var a = r.srcElement || r.target;
					return e(a).hasClass("l-tab-links-item-close") ? !1 : void 0
				},
				onDrag: function(t, r) {
					null == i.dropIn && (i.dropIn = -1);
					var a = i.tab.links.ul.find(">li"),
						s = a.index(t.target);
					a.each(function(t) {
						if(s != t) {
							var a = t > s;
							if(-1 == i.dropIn || i.dropIn == t) {
								var o = e(this).offset(),
									n = {
										top: o.top,
										bottom: o.top + e(this).height(),
										left: o.left - 10,
										right: o.left + 10
									};
								if(a) {
									n.left += e(this).width();
									n.right += e(this).width()
								}
								var l = r.pageX || r.screenX,
									d = r.pageY || r.screenY;
								if(l > n.left && l < n.right && d > n.top && d < n.bottom) {
									i.droptip.css({
										left: n.left + 5,
										top: n.top - 9
									}).show();
									i.dropIn = t;
									i.dragproxy.find(".l-drop-icon").removeClass("l-drop-no").addClass("l-drop-yes")
								} else {
									i.dropIn = -1;
									i.droptip.hide();
									i.dragproxy.find(".l-drop-icon").removeClass("l-drop-yes").addClass("l-drop-no")
								}
							}
						}
					})
				},
				onStopDrag: function(t) {
					if(i.dropIn > -1) {
						var r = i.tab.links.ul.find(">li:eq(" + i.dropIn + ")").attr("tabid"),
							a = e(t.target).attr("tabid");
						setTimeout(function() {
							i.moveTabItem(a, r)
						}, 0);
						i.dropIn = -1;
						i.dragproxy.remove()
					}
					i.droptip.hide();
					this.set("cursor", "default")
				}
			});
			return r
		},
		_setDragToMove: function(t) {
			if(e.fn.ligerDrag) {
				{
					var i = this;
					this.options
				}
				if(t) {
					if(i.drags) return;
					i.drags = i.drags || [];
					i.tab.links.ul.find(">li").each(function() {
						i.drags.push(i._applyDrag(this))
					})
				}
			}
		},
		moveTabItem: function(e, t) {
			var i = this,
				r = i.tab.links.ul.find(">li[tabid=" + e + "]"),
				a = i.tab.links.ul.find(">li[tabid=" + t + "]"),
				s = i.tab.links.ul.find(">li").index(r),
				o = i.tab.links.ul.find(">li").index(a);
			o > s ? a.after(r) : a.before(r)
		},
		setTabManageEven: function() {
			{
				var t = this;
				this.options
			}
			e("#tabManage").click(function() {
				var i = e(this).offset();
				if(0 === e(".l-tab-menu").length) {
					var r = '<div class="l-tab-menu"><p id="tabCloseAll" data-opt="closeall"><b></b>关闭全部</p><p id="tabCloseCur" data-opt="closecur"><b></b>关闭当前页</p><p id="tabRefCur" data-opt="reloadcur"><b></b>刷新当前页</p>';
					e("#page-tab").append(r);
					e(".l-tab-menu").css({
						top: i.top + 30 + "px",
						left: i.left - e(".l-tab-menu").outerWidth() + e("#tabManage").outerWidth() + "px"
					});
					e(".l-tab-menu p").each(function() {
						e(this).click(function() {
							t._menuItemClick({
								id: e(this).data("opt")
							});
							e(".l-tab-menu").hide()
						})
					})
				} else e(".l-tab-menu").css({
					top: i.top + 30 + "px",
					left: i.left - e(".l-tab-menu").outerWidth() + e("#tabManage").outerWidth() + "px"
				}).show()
			});
			e(document).click(function(t) {
//				e(t.target).isChildAndSelfOf(".l-tab-menu") || e(t.target).isChildAndSelfOf("#tabManage") || e(".l-tab-menu").hide()
				if(e(t.target).is("#tabManage")){
				}
				else{  
					$(".l-tab-menu").hide();
				}
			})
		},
		setTabButton: function() {
			var t = this,
				i = (this.options, 0);
			e("li", t.tab.links.ul).each(function() {
				i += e(this).width() + 2
			});
			var r = t.tab.width();
			if(i > r) {
				t.tab.links.append('<div class="l-tab-links-left"><i></i></div><div class="l-tab-links-right"><i></i></div>');
				t.setTabButtonEven();
				return !0
			}
			t.tab.links.ul.animate({
				left: 0
			});
			e(".l-tab-links-left,.l-tab-links-right", t.tab.links).remove();
			return !1
		},
		setTabButtonEven: function() {
			{
				var t = this;
				this.options
			}
			e(".l-tab-links-left", t.tab.links).hover(function() {
				e(this).addClass("l-tab-links-left-over")
			}, function() {
				e(this).removeClass("l-tab-links-left-over")
			}).click(function() {
				t.moveToPrevTabItem()
			});
			e(".l-tab-links-right", t.tab.links).hover(function() {
				e(this).addClass("l-tab-links-right-over")
			}, function() {
				e(this).removeClass("l-tab-links-right-over")
			}).click(function() {
				t.moveToNextTabItem()
			})
		},
		moveToPrevTabItem: function() {
			var t = this,
				i = (this.options, e(".l-tab-links-left", t.tab.links).width()),
				r = new Array;
			e("li", t.tab.links).each(function(t) {
				var a = -1 * i;
				t > 0 && (a = parseInt(r[t - 1]) + e(this).prev().width() + 2);
				r.push(a)
			});
			for(var a = -1 * parseInt(t.tab.links.ul.css("left")), s = 0; s < r.length - 1; s++)
				if(r[s] < a && r[s + 1] >= a) {
					t.tab.links.ul.animate({
						left: -1 * parseInt(r[s])
					});
					return
				}
		},
		moveToNextTabItem: function() {
			var t = this,
				i = (this.options, e(".l-tab-links-right", t.tab).width()),
				r = 0,
				a = e("li", t.tab.links.ul);
			a.each(function() {
				r += e(this).width() + 2
			});
			for(var s = t.tab.width(), o = new Array, n = a.length - 1; n >= 0; n--) {
				var l = r - s + i + 2;
				n != a.length - 1 && (l = parseInt(o[a.length - 2 - n]) - e(a[n + 1]).width() - 2);
				o.push(l)
			}
			for(var d = -1 * parseInt(t.tab.links.ul.css("left")), c = 1; c < o.length; c++)
				if(o[c] <= d && o[c - 1] > d) {
					t.tab.links.ul.animate({
						left: -1 * parseInt(o[c - 1])
					});
					return
				}
		},
		getTabItemCount: function() {
			{
				var t = this;
				this.options
			}
			return e("li", t.tab.links.ul).length
		},
		getSelectedTabItemID: function() {
			{
				var t = this;
				this.options
			}
			return e("li.l-selected", t.tab.links.ul).attr("tabid")
		},
		removeSelectedTabItem: function() {
			{
				var e = this;
				this.options
			}
			e.removeTabItem(e.getSelectedTabItemID())
		},
		overrideSelectedTabItem: function(e) {
			{
				var t = this;
				this.options
			}
			t.overrideTabItem(t.getSelectedTabItemID(), e)
		},
		overrideTabItem: function(t, i) {
			{
				var r = this;
				this.options
			}
			if(0 == r.trigger("beforeOverrideTabItem", [t])) return !1;
			var a = i.tabid;
			void 0 == a && (a = r.getNewTabid());
			var s = i.url,
				o = i.content,
				n = (i.target, i.text),
				l = i.showClose,
				d = i.height,
				c = e("li[tabid=" + t + "]", r.tab.links.ul),
				u = e(".l-tab-content-item[tabid=" + t + "]", r.tab.content),
				p = e("div:first", u).show();
			if(c && u) {
				c.attr("tabid", a);
				u.attr("tabid", a);
				0 == e("iframe", u).length && s ? u.html("<iframe frameborder='0'></iframe>") : o && u.html(o);
				e("iframe", u).attr("name", a);
				void 0 == l && (l = !0);
				0 == l ? e(".l-tab-links-item-close", c).remove() : 0 == e(".l-tab-links-item-close", c).length && c.append("<div class='l-tab-links-item-close'></div>");
				void 0 == n && (n = a);
				d && u.height(d);
				e("a", c).text(n);
				e("iframe", u).attr("src", s).bind("load.tab", function() {
					p.hide();
					i.callback && i.callback()
				});
				r.trigger("afterOverrideTabItem", [t])
			}
		},
		setHeader: function(t, i) {
			e("li[tabid=" + t + "] a", this.tab.links.ul).text(i)
		},
		selectTabItem: function(t) {
			{
				var i = this;
				this.options
			}
			if(0 == i.trigger("beforeSelectTabItem", [t])) return !1;
			i.trigger("afterLeaveTabItem", [i.selectedTabId]);
			i.selectedTabId = t;
			e("> .l-tab-content-item[tabid=" + t + "]", i.tab.content).show().siblings().hide();
			e("li[tabid=" + t + "]", i.tab.links.ul).addClass("l-selected").siblings().removeClass("l-selected");
			i.trigger("afterSelectTabItem", [t])
		},
		moveToLastTabItem: function() {
			var t = this,
				i = (this.options, 0);
			e("li", t.tab.links.ul).each(function() {
				i += e(this).width() + 2
			});
			var r = t.tab.width();
			if(i > r) {
				var a = e(".l-tab-links-right", t.tab.links).width();
				t.tab.links.ul.animate({
					left: -1 * (i - r + a + 2)
				})
			}
		},
		isTabItemExist: function(t) {
			{
				var i = this;
				this.options
			}
			return e("li[tabid=" + t + "]", i.tab.links.ul).length > 0
		},
		addTabItem: function(t) {
			var i = this,
				r = this.options;
			if(0 == i.trigger("beforeAddTabItem", [a])) return !1;
			var a = t.tabid;
			void 0 == a && (a = i.getNewTabid());
			var s = t.url,
				o = t.content,
				n = t.text,
				l = t.showClose,
				d = t.height;
			if(i.isTabItemExist(a)) {
				var c = e(".l-tab-content-item[tabid=" + a + "]").find("iframe").attr("src");
				i.selectTabItem(a);
				if(c != s) {
					i.overrideTabItem(a, t);
					return
				}
			} else {
				var u = e("<li><a></a><div class='l-tab-links-item-left'></div><div class='l-tab-links-item-right'></div><div class='l-tab-links-item-close'></div></li>"),
					p = e("<div class='l-tab-content-item'><div class='l-tab-loading' style='display:block;'></div><iframe frameborder='0'></iframe></div>"),
					h = e("div:first", p),
					f = e("iframe:first", p);
				if(i.makeFullHeight) {
					var g = i.tab.height() - i.tab.links.height();
					p.height(g)
				}
				u.attr("tabid", a);
				p.attr("tabid", a);
				if(s) f.attr("name", a).attr("id", a).attr("src", s).bind("load.tab", function() {
					h.hide();
					t.callback && t.callback()
				});
				else {
					f.remove();
					h.remove()
				}
				o ? p.html(o) : t.target && p.append(t.target);
				void 0 == l && (l = !0);
				0 == l && e(".l-tab-links-item-close", u).remove();
				void 0 == n && (n = a);
				d && p.height(d);
				e("a", u).text(n);
				if(0 === e("#tabManage").length) {
					i.tab.links.ul.append(u);
					i.tab.links.ul.append('<li id="tabManage"><i></i></li>');
					i.setTabManageEven()
				} else u.insertBefore("#tabManage");
				i.tab.content.append(p);
				i.selectTabItem(a);
				i.setTabButton() && i.moveToLastTabItem();
				i._addTabItemEvent(u);
				if(r.dragToMove && e.fn.ligerDrag) {
					i.drags = i.drags || [];
					u.each(function() {
						i.drags.push(i._applyDrag(this))
					})
				}
				i.trigger("afterAddTabItem", [a])
			}
		},
		_addTabItemEvent: function(t) {
			{
				var i = this;
				this.options
			}
			t.click(function() {
				var t = e(this).attr("tabid");
				i.selectTabItem(t)
			});
			i.tab.menu && i._addTabItemContextMenuEven(t);
			e(".l-tab-links-item-close", t).hover(function() {
				e(this).addClass("l-tab-links-item-close-over")
			}, function() {
				e(this).removeClass("l-tab-links-item-close-over")
			}).click(function() {
				var t = e(this).parent().attr("tabid");
				i.removeTabItem(t)
			})
		},
		removeTabItem: function(t) {
			{
				var i = this;
				this.options
			}
			if(0 == i.trigger("beforeRemoveTabItem", [t])) return !1;
			var r = e("li[tabid=" + t + "]", i.tab.links.ul).hasClass("l-selected");
			if(r) {
				var a = e(".l-tab-content-item[tabid=" + t + "]", i.tab.content).prev().attr("tabid");
				i.selectTabItem(a)
			}
			var s = e(".l-tab-content-item[tabid=" + t + "]", i.tab.content),
				o = e("iframe", s);
			if(o.length) {
				var n = o[0];
				n.src = "about:blank";
				try {
					n.contentWindow.document.write("")
				} catch(l) {}
				"Microsoft Internet Explorer" === navigator.appName && CollectGarbage();
				o.remove()
			}
			s.remove();
			e("li[tabid=" + t + "]", i.tab.links.ul).remove();
			i.setTabButton();
			i.trigger("afterRemoveTabItem", [t])
		},
		addHeight: function(e) {
			var t = this,
				i = (this.options, t.tab.height() + e);
			t.setHeight(i)
		},
		setHeight: function(e) {
			{
				var t = this;
				this.options
			}
			t.tab.height(e);
			t.setContentHeight()
		},
		setContentHeight: function() {
			var t = this,
				i = (this.options, t.tab.height() - t.tab.links.height());
			t.tab.content.height(i);
			e("> .l-tab-content-item", t.tab.content).height(i)
		},
		getNewTabid: function() {
			{
				var e = this;
				this.options
			}
			e.getnewidcount = e.getnewidcount || 0;
			return "tabitem" + ++e.getnewidcount
		},
		getTabidList: function(t, i) {
			var r = this,
				a = (this.options, []);
			e("> li", r.tab.links.ul).each(function() {
				e(this).attr("tabid") && e(this).attr("tabid") != t && (!i || e(".l-tab-links-item-close", this).length > 0) && a.push(e(this).attr("tabid"))
			});
			return a
		},
		removeOther: function(t) {
			var i = this,
				r = (this.options, i.getTabidList(t, !0));
			e(r).each(function() {
				i.removeTabItem(this)
			})
		},
		reload: function(t) {
			var i = (this.options, e(".l-tab-content-item[tabid=" + t + "]")),
				r = e(".l-tab-loading:first", i),
				a = e("iframe:first", i),
				s = e(a).attr("src");
			r.show();
			a.attr("src", s).unbind("load.tab").bind("load.tab", function() {
				r.hide()
			})
		},
		removeAll: function() {
			var t = this,
				i = (this.options, t.getTabidList(null, !0));
			e(i).each(function() {
				t.removeTabItem(this)
			})
		},
		onResize: function() {
			var t = this,
				i = this.options;
			if(!i.height || "string" != typeof i.height || -1 == i.height.indexOf("%")) return !1;
			if("body" == t.tab.parent()[0].tagName.toLowerCase()) {
				var r = e(window).height();
				r -= parseInt(t.tab.parent().css("paddingTop"));
				r -= parseInt(t.tab.parent().css("paddingBottom"));
				t.height = i.heightDiff + r * parseFloat(t.height) * .01
			} else t.height = i.heightDiff + t.tab.parent().height() * parseFloat(i.height) * .01;
			t.tab.height(t.height);
			t.setContentHeight()
		},
		_menuItemClick: function(t) {
			{
				var i = this;
				this.options
			}
			i.actionTabid = i.actionTabid || i.getSelectedTabItemID();
			if(t.id && i.actionTabid) switch(t.id) {
				case "close":
					i.removeTabItem(i.actionTabid);
					i.actionTabid = null;
					break;
				case "closecur":
					if("index" === i.getSelectedTabItemID()) break;
					i.removeTabItem(i.getSelectedTabItemID());
					break;
				case "closeother":
					i.removeOther(i.actionTabid);
					break;
				case "closeall":
					i.removeAll();
					i.actionTabid = null;
					break;
				case "reload":
					i.selectTabItem(i.actionTabid);
					i.reload(i.actionTabid);
					break;
				case "reloadcur":
					i.reload(i.getSelectedTabItemID());
					break;
				case "reloadall":
					var r = i.getTabidList(null, !1);
					e(r).each(function() {
						i.reload(this)
					})
			}
		},
		_addTabItemContextMenuEven: function(t) {
			{
				var i = this;
				this.options
			}
			t.bind("contextmenu", function(r) {
				if(i.tab.menu) {
					i.actionTabid = t.attr("tabid");
					i.tab.menu.show({
						top: r.pageY,
						left: r.pageX
					});
					0 == e(".l-tab-links-item-close", this).length ? i.tab.menu.setDisabled("close") : i.tab.menu.setEnabled("close");
					return !1
				}
			})
		}
	})
}(jQuery);
! function(e) {
	e.ligerMenu = function() {
		return e.ligerui.run.call(null, "ligerMenu", arguments)
	};
	e.ligerDefaults.Menu = {
		width: 120,
		top: 0,
		left: 0,
		items: null,
		shadow: !0
	};
	e.ligerMethos.Menu = {};
	e.ligerui.controls.Menu = function(t) {
		e.ligerui.controls.Menu.base.constructor.call(this, null, t)
	};
	e.ligerui.controls.Menu.ligerExtend(e.ligerui.core.UIComponent, {
		__getType: function() {
			return "Menu"
		},
		__idPrev: function() {
			return "Menu"
		},
		_extendMethods: function() {
			return e.ligerMethos.Menu
		},
		_render: function() {
			var t = this,
				i = this.options;
			t.menuItemCount = 0;
			t.menus = {};
			t.menu = t.createMenu();
			t.element = t.menu[0];
			t.menu.css({
				top: i.top,
				left: i.left,
				width: i.width
			});
			i.items && e(i.items).each(function(e, i) {
				t.addItem(i)
			});
			e(document).bind("click.menu", function() {
				for(var e in t.menus) {
					var i = t.menus[e];
					if(!i) return;
					i.hide();
					i.shadow && i.shadow.hide()
				}
			});
			t.set(i)
		},
		show: function(e, t) {
			{
				var i = this;
				this.options
			}
			void 0 == t && (t = i.menu);
			e && void 0 != e.left && t.css({
				left: e.left
			});
			e && void 0 != e.top && t.css({
				top: e.top
			});
			t.show();
			i.updateShadow(t)
		},
		updateShadow: function(e) {
			var t = this.options;
			if(t.shadow) {
				e.shadow.css({
					left: e.css("left"),
					top: e.css("top"),
					width: e.outerWidth(),
					height: e.outerHeight()
				});
				e.is(":visible") ? e.shadow.show() : e.shadow.hide()
			}
		},
		hide: function(e) {
			{
				var t = this;
				this.options
			}
			void 0 == e && (e = t.menu);
			t.hideAllSubMenu(e);
			e.hide();
			t.updateShadow(e)
		},
		toggle: function() {
			{
				var e = this;
				this.options
			}
			e.menu.toggle();
			e.updateShadow(e.menu)
		},
		removeItem: function(t) {
			{
				var i = this;
				this.options
			}
			e("> .l-menu-item[menuitemid=" + t + "]", i.menu.items).remove()
		},
		setEnabled: function(t) {
			{
				var i = this;
				this.options
			}
			e("> .l-menu-item[menuitemid=" + t + "]", i.menu.items).removeClass("l-menu-item-disable")
		},
		setDisabled: function(t) {
			{
				var i = this;
				this.options
			}
			e("> .l-menu-item[menuitemid=" + t + "]", i.menu.items).addClass("l-menu-item-disable")
		},
		isEnable: function(t) {
			{
				var i = this;
				this.options
			}
			return !e("> .l-menu-item[menuitemid=" + t + "]", i.menu.items).hasClass("l-menu-item-disable")
		},
		getItemCount: function() {
			{
				var t = this;
				this.options
			}
			return e("> .l-menu-item", t.menu.items).length
		},
		addItem: function(t, i) {
			var r = this,
				a = this.options;
			if(t) {
				void 0 == i && (i = r.menu);
				if(t.line) i.items.append('<div class="l-menu-item-line"></div>');
				else {
					var s = e('<div class="l-menu-item"><div class="l-menu-item-text"></div> </div>'),
						n = e("> .l-menu-item", i.items).length;
					i.items.append(s);
					s.attr("ligeruimenutemid", ++r.menuItemCount);
					t.id && s.attr("menuitemid", t.id);
					t.text && e(">.l-menu-item-text:first", s).html(t.text);
					t.icon && s.prepend('<div class="l-menu-item-icon l-icon-' + t.icon + '"></div>');
					(t.disable || t.disabled) && s.addClass("l-menu-item-disable");
					if(t.children) {
						s.append('<div class="l-menu-item-arrow"></div>');
						var o = r.createMenu(s.attr("ligeruimenutemid"));
						r.menus[s.attr("ligeruimenutemid")] = o;
						o.width(a.width);
						o.hover(null, function() {
							o.showedSubMenu || r.hide(o)
						});
						e(t.children).each(function() {
							r.addItem(this, o)
						})
					}
					t.click && s.click(function() {
						e(this).hasClass("l-menu-item-disable") || t.click(t, n)
					});
					t.dblclick && s.dblclick(function() {
						e(this).hasClass("l-menu-item-disable") || t.dblclick(t, n)
					});
					var l = e("> .l-menu-over:first", i);
					s.hover(function() {
						if(!e(this).hasClass("l-menu-item-disable")) {
							var a = e(this).offset().top,
								s = a - i.offset().top;
							l.css({
								top: s
							});
							r.hideAllSubMenu(i);
							if(t.children) {
								var n = e(this).attr("ligeruimenutemid");
								if(!n) return;
								if(r.menus[n]) {
									r.show({
										top: a,
										left: e(this).offset().left + e(this).width() - 5
									}, r.menus[n]);
									i.showedSubMenu = !0
								}
							}
						}
					}, function() {
						if(!e(this).hasClass("l-menu-item-disable")) {
							var i = e(this).attr("ligeruimenutemid");
							if(t.children) {
								var i = e(this).attr("ligeruimenutemid");
								if(!i) return
							}
						}
					})
				}
			}
		},
		hideAllSubMenu: function(t) {
			{
				var i = this;
				this.options
			}
			void 0 == t && (t = i.menu);
			e("> .l-menu-item", t.items).each(function() {
				if(e("> .l-menu-item-arrow", this).length > 0) {
					var t = e(this).attr("ligeruimenutemid");
					if(!t) return;
					i.menus[t] && i.hide(i.menus[t])
				}
			});
			t.showedSubMenu = !1
		},
		createMenu: function(t) {
			var i = this,
				r = this.options,
				a = e('<div class="l-menu" style="display:none"><div class="l-menu-yline"></div><div class="l-menu-over"><div class="l-menu-over-l"></div> <div class="l-menu-over-r"></div></div><div class="l-menu-inner"></div></div>');
			t && a.attr("ligeruiparentmenuitemid", t);
			a.items = e("> .l-menu-inner:first", a);
			a.appendTo("body");
			if(r.shadow) {
				a.shadow = e('<div class="l-menu-shadow"></div>').insertAfter(a);
				i.updateShadow(a)
			}
			a.hover(null, function() {
				a.showedSubMenu || e("> .l-menu-over:first", a).css({
					top: -24
				})
			});
			t ? i.menus[t] = a : i.menus[0] = a;
			return a
		}
	});
	e.ligerui.controls.Menu.prototype.setEnable = e.ligerui.controls.Menu.prototype.setEnabled;
	e.ligerui.controls.Menu.prototype.setDisable = e.ligerui.controls.Menu.prototype.setDisabled
}(jQuery);