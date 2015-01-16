// Generated by CoffeeScript 1.3.3
(function() {
  var BackgroundCompleter, Vomnibar, VomnibarUI, initializeOnDomReady, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Vomnibar = {
    vomnibarUI: null,
    completers: {},
    getCompleter: function(name) {
      if (!(name in this.completers)) {
        this.completers[name] = new BackgroundCompleter(name);
      }
      return this.completers[name];
    },
    activateWithCompleter: function(options) {
      var completer, _ref;
      completer = this.getCompleter(options.completer);
      if ((_ref = this.vomnibarUI) == null) {
        this.vomnibarUI = new VomnibarUI();
      }
      completer.refresh();
      this.vomnibarUI.setInitialSelectionValue(options.selectFirst ? 0 : -1);
      this.vomnibarUI.setCompleter(completer);
      this.vomnibarUI.setRefreshInterval(options.refreshInterval);
      this.vomnibarUI.setForceNewTab(options.newTab);
      this.vomnibarUI.setFrameId(options.frameId);
      this.vomnibarUI.show();
      if (options.query) {
        this.vomnibarUI.setQuery(options.query);
        return this.vomnibarUI.update();
      }
    },
    activate: function() {
      return this.activateWithCompleter({
        completer: "omni"
      });
    },
    activateInNewTab: function() {
      return this.activateWithCompleter({
        completer: "omni",
        selectFirst: false,
        newTab: true
      });
    },
    activateTabSelection: function() {
      return this.activateWithCompleter({
        completer: "tabs",
        selectFirst: true
      });
    },
    activateBookmarks: function() {
      return this.activateWithCompleter({
        completer: "bookmarks",
        selectFirst: true
      });
    },
    activateBookmarksInNewTab: function() {
      return this.activateWithCompleter({
        completer: "bookmarks",
        selectFirst: true,
        newTab: true
      });
    },
    getUI: function() {
      return this.vomnibarUI;
    }
  };

  VomnibarUI = (function() {

    function VomnibarUI() {
      this.onKeydown = __bind(this.onKeydown, this);
      this.refreshInterval = 0;
      this.initDom();
    }

    VomnibarUI.prototype.setQuery = function(query) {
      return this.input.value = query;
    };

    VomnibarUI.prototype.setInitialSelectionValue = function(initialSelectionValue) {
      return this.initialSelectionValue = initialSelectionValue;
    };

    VomnibarUI.prototype.setCompleter = function(completer) {
      this.completer = completer;
      return this.reset();
    };

    VomnibarUI.prototype.setRefreshInterval = function(refreshInterval) {
      return this.refreshInterval = refreshInterval;
    };

    VomnibarUI.prototype.setForceNewTab = function(forceNewTab) {
      return this.forceNewTab = forceNewTab;
    };

    VomnibarUI.prototype.setFrameId = function(frameId) {
      return this.frameId = frameId;
    };

    VomnibarUI.prototype.show = function() {
      this.box.style.display = "block";
      this.input.focus();
      return this.input.addEventListener("keydown", this.onKeydown);
    };

    VomnibarUI.prototype.hide = function() {
      this.box.style.display = "none";
      this.completionList.style.display = "none";
      this.input.blur();
      this.input.removeEventListener("keydown", this.onKeydown);
      window.parent.focus();
      return chrome.runtime.sendMessage({
        handler: "echo",
        name: "vomnibarClose",
        frameId: this.frameId
      });
    };

    VomnibarUI.prototype.reset = function() {
      this.input.value = "";
      this.updateTimer = null;
      this.completions = [];
      this.selection = this.initialSelectionValue;
      return this.update(true);
    };

    VomnibarUI.prototype.updateSize = function() {
      var height;
      if (document.readyState === "complete") {
        try {
          height = Math.max(this.box.getClientRects()[0].height, 55);
          return chrome.runtime.sendMessage({
            handler: "echo",
            name: "vomnibarResize",
            frameId: this.frameId,
            height: height
          });
        } catch (_error) {}
      }
    };

    VomnibarUI.prototype.updateSelection = function() {
      var i, _i, _ref;
      if (this.completions[0]) {
        if (this.previousCompletionType !== "search" && this.completions[0].type === "search") {
          this.selection = 0;
        } else if (this.previousCompletionType === "search" && this.completions[0].type !== "search") {
          this.selection = -1;
        }
      }
      for (i = _i = 0, _ref = this.completionList.children.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.completionList.children[i].className = (i === this.selection ? "vomnibarSelected" : "");
      }
      if (this.completions[0]) {
        return this.previousCompletionType = this.completions[0].type;
      }
    };

    VomnibarUI.prototype.actionFromKeyEvent = function(event) {
      var key;
      key = KeyboardUtils.getKeyChar(event);
      if (KeyboardUtils.isEscape(event)) {
        return "dismiss";
      } else if (key === "up" || (event.shiftKey && event.keyCode === keyCodes.tab) || (event.ctrlKey && (key === "k" || key === "p"))) {
        return "up";
      } else if (key === "down" || (event.keyCode === keyCodes.tab && !event.shiftKey) || (event.ctrlKey && (key === "j" || key === "n"))) {
        return "down";
      } else if (event.keyCode === keyCodes.enter) {
        return "enter";
      }
    };

    VomnibarUI.prototype.onKeydown = function(event) {
      var action, openInNewTab, query,
        _this = this;
      action = this.actionFromKeyEvent(event);
      if (!action) {
        return true;
      }
      openInNewTab = this.forceNewTab || (event.shiftKey || event.ctrlKey || KeyboardUtils.isPrimaryModifierKey(event));
      if (action === "dismiss") {
        this.hide();
      } else if (action === "up") {
        this.selection -= 1;
        if (this.selection < this.initialSelectionValue) {
          this.selection = this.completions.length - 1;
        }
        this.input.value = this.completions[this.selection].url;
        this.updateSelection();
      } else if (action === "down") {
        this.selection += 1;
        if (this.selection === this.completions.length) {
          this.selection = this.initialSelectionValue;
        }
        this.input.value = this.completions[this.selection].url;
        this.updateSelection();
      } else if (action === "enter") {
        if (this.selection === -1) {
          query = this.input.value.trim();
          if (!(0 < query.length)) {
            return;
          }
          this.hide();
          chrome.runtime.sendMessage({
            handler: openInNewTab ? "openUrlInNewTab" : "openUrlInCurrentTab",
            url: query
          });
        } else {
          this.update(true, function() {
            _this.completions[_this.selection].performAction(openInNewTab);
            return _this.hide();
          });
        }
      }
      event.stopPropagation();
      event.preventDefault();
      return true;
    };

    VomnibarUI.prototype.updateCompletions = function(callback) {
      var query,
        _this = this;
      query = this.input.value.trim();
      return this.completer.filter(query, function(completions) {
        _this.completions = completions;
        _this.populateUiWithCompletions(completions);
        if (callback) {
          return callback();
        }
      });
    };

    VomnibarUI.prototype.populateUiWithCompletions = function(completions) {
      this.completionList.innerHTML = completions.map(function(completion) {
        return "<li>" + completion.html + "</li>";
      }).join("");
      this.completionList.style.display = completions.length > 0 ? "block" : "none";
      this.selection = Math.min(Math.max(this.initialSelectionValue, this.selection), this.completions.length - 1);
      this.updateSelection();
      return this.updateSize();
    };

    VomnibarUI.prototype.update = function(updateSynchronously, callback) {
      var _this = this;
      if (updateSynchronously) {
        if (this.updateTimer !== null) {
          window.clearTimeout(this.updateTimer);
        }
        return this.updateCompletions(callback);
      } else if (this.updateTimer !== null) {

      } else {
        return this.updateTimer = setTimeout(function() {
          _this.updateCompletions(callback);
          return _this.updateTimer = null;
        }, this.refreshInterval);
      }
    };

    VomnibarUI.prototype.initDom = function() {
      var _this = this;
      this.box = document.getElementById("vomnibar");
      this.input = this.box.querySelector("input");
      this.input.addEventListener("input", function() {
        return _this.update();
      });
      this.completionList = this.box.querySelector("ul");
      this.completionList.style.display = "none";
      window.addEventListener("focus", function() {
        return _this.input.focus();
      });
      return window.addEventListener("load", function() {
        return _this.updateSize();
      });
    };

    return VomnibarUI;

  })();

  BackgroundCompleter = (function() {

    function BackgroundCompleter(name) {
      this.name = name;
      this.filterPort = chrome.runtime.connect({
        name: "filterCompleter"
      });
    }

    BackgroundCompleter.prototype.refresh = function() {
      return chrome.runtime.sendMessage({
        handler: "refreshCompleter",
        name: this.name
      });
    };

    BackgroundCompleter.prototype.filter = function(query, callback) {
      var id,
        _this = this;
      id = Utils.createUniqueId();
      this.filterPort.onMessage.addListener(function(msg) {
        var results;
        _this.filterPort.onMessage.removeListener(arguments.callee);
        results = msg.results.map(function(result) {
          var functionToCall;
          functionToCall = result.type === "tab" ? BackgroundCompleter.completionActions.switchToTab.curry(result.tabId) : BackgroundCompleter.completionActions.navigateToUrl.curry(result.url);
          result.performAction = functionToCall;
          return result;
        });
        return callback(results);
      });
      return this.filterPort.postMessage({
        id: id,
        name: this.name,
        query: query
      });
    };

    return BackgroundCompleter;

  })();

  extend(BackgroundCompleter, {
    completionActions: {
      navigateToUrl: function(url, openInNewTab) {
        if (url.startsWith("javascript:")) {
          openInNewTab = false;
        }
        return chrome.runtime.sendMessage({
          handler: openInNewTab ? "openUrlInNewTab" : "openUrlInCurrentTab",
          url: url,
          selected: openInNewTab
        });
      },
      switchToTab: function(tabId) {
        return chrome.runtime.sendMessage({
          handler: "selectSpecificTab",
          id: tabId
        });
      }
    }
  });

  initializeOnDomReady = function() {
    var booleanOptions, option, options, _i, _len;
    options = {
      completer: "omni",
      query: null,
      frameId: -1
    };
    booleanOptions = ["selectFirst", "newTab"];
    document.location.search.split(/[\?&]/).map(function(option) {
      var name, value, _ref;
      _ref = option.split("="), name = _ref[0], value = _ref[1];
      return options[name] = value;
    });
    for (_i = 0, _len = booleanOptions.length; _i < _len; _i++) {
      option = booleanOptions[_i];
      options[option] = option in options && options[option] !== "false";
    }
    options.refreshInterval = (function() {
      switch (options.completer) {
        case "omni":
          return 100;
        default:
          return 0;
      }
    })();
    return Vomnibar.activateWithCompleter(options);
  };

  window.addEventListener("DOMContentLoaded", initializeOnDomReady);

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.Vomnibar = Vomnibar;

}).call(this);
