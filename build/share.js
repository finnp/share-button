!function(){function getStyles(config){ return "<style>"+config.selector+"{width:90px;height:20px}"+config.selector+" [class*=entypo-]:before{font-family:entypo,sans-serif}"+config.selector+" label{font-size:16px;cursor:pointer;margin:0;padding:5px 10px;border-radius:5px;background:"+config.ui.button_background+";color:"+config.ui.button_color+";-webkit-transition:all .3s ease;transition:all .3s ease}"+config.selector+" label:hover{opacity:.8}"+config.selector+" label span{text-transform:uppercase;font-size:.9em;font-family:Lato,sans-serif;font-weight:700;-webkit-font-smoothing:antialiased;padding-left:6px}"+config.selector+" .social{-webkit-transform-origin:50% 0;-ms-transform-origin:50% 0;transform-origin:50% 0;-webkit-transform:scale(0) translateY(-190px);-ms-transform:scale(0) translateY(-190px);transform:scale(0) translateY(-190px);opacity:0;-webkit-transition:all .4s ease;transition:all .4s ease;margin-left:-15px}"+config.selector+" .social.active{opacity:1;-webkit-transition:all .4s ease;transition:all .4s ease}"+config.selector+" .social.active.center{margin-left:-45px}"+config.selector+" .social.active.left{margin-left:-115px}"+config.selector+" .social.active.right{margin-left:10px}"+config.selector+" .social.active.top{-webkit-transform:scale(1) translateY(-90px);-ms-transform:scale(1) translateY(-90px);transform:scale(1) translateY(-90px)}"+config.selector+" .social.active.top.center ul:after{margin:35px auto;border-top:20px solid #3b5998}"+config.selector+" .social.active.top.left ul:after{margin:35px 0 0 129px;border-top:20px solid #e34429}"+config.selector+" .social.active.top.right ul:after{margin:35px 0 0 10px;border-top:20px solid #6cdfea}"+config.selector+" .social.active.bottom{-webkit-transform:scale(1) translateY(45px);-ms-transform:scale(1) translateY(45px);transform:scale(1) translateY(45px);margin-top:-14px}"+config.selector+" .social.active.bottom.center ul:after{margin:-10px auto;border-bottom:20px solid #3b5998}"+config.selector+" .social.active.bottom.left ul:after{margin:-10px 0 0 129px;border-bottom:20px solid #e34429}"+config.selector+" .social.active.bottom.right ul:after{margin:-10px 0 0 10px;border-bottom:20px solid #6cdfea}"+config.selector+" .social ul{position:relative;left:0;right:0;width:180px;height:46px;color:#fff;background:#3b5998;margin:auto;padding:0;list-style:none}"+config.selector+" .social ul li{font-size:20px;cursor:pointer;width:60px;margin:0;padding:12px 0;text-align:center;float:left;display:block;height:22px;position:relative;z-index:2;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;-webkit-transition:all .3s ease;transition:all .3s ease}"+config.selector+" .social ul li:hover{color:rgba(0,0,0,.5)}"+config.selector+" .social ul:after{content:'';display:block;width:0;height:0;position:absolute;left:0;right:0;border-left:20px solid transparent;border-right:20px solid transparent}"+config.selector+" .social li[class*=twitter]{background:#6cdfea;padding:12px 0}"+config.selector+" .social li[class*=gplus]{background:#e34429;padding:12px 0}</style>"};var Share, ShareUtils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ShareUtils = (function() {
  function ShareUtils() {}

  ShareUtils.prototype.extend = function(to, from, overwrite) {
    var hasProp, prop;
    for (prop in from) {
      hasProp = to[prop] !== undefined;
      if (hasProp && typeof from[prop] === "object") {
        this.extend(to[prop], from[prop], overwrite);
      } else {
        if (overwrite || !hasProp) {
          to[prop] = from[prop];
        }
      }
    }
  };

  ShareUtils.prototype.hide = function(el) {
    el.style.display = "none";
  };

  ShareUtils.prototype.show = function(el) {
    el.style.display = "block";
  };

  ShareUtils.prototype.has_class = function(el, class_name) {
    return el.classList.contains(class_name);
  };

  ShareUtils.prototype.add_class = function(el, class_name) {
    el.classList.add(class_name);
  };

  ShareUtils.prototype.remove_class = function(el, class_name) {
    el.classList.remove(class_name);
  };

  ShareUtils.prototype.is_encoded = function(str) {
    return decodeURIComponent(str) !== str;
  };

  ShareUtils.prototype.popup = function(url) {
    var popup;
    popup = {
      width: 500,
      height: 350
    };
    popup.top = (screen.height / 2) - (popup.height / 2);
    popup.left = (screen.width / 2) - (popup.width / 2);
    window.open(url, 'targetWindow', "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left=" + popup.left + ",top=" + popup.top + ",width=" + popup.width + ",height=" + popup.height);
  };

  return ShareUtils;

})();

Share = (function(_super) {
  __extends(Share, _super);

  function Share(element, options) {
    var content;
    this.el = {
      head: document.getElementsByTagName('head')[0],
      body: document.getElementsByTagName('body')[0]
    };
    this.config = {
      protocol: ['http', 'https'].indexOf(window.location.href.split(':')[0]) === -1 ? 'https://' : '//',
      url: window.location.href,
      caption: null,
      text: (content = document.querySelector('meta[property="og:description"]') || document.querySelector('meta[name="twitter:description"]') || document.querySelector('meta[name="description"]')) ? content.getAttribute('content') : '',
      title: (content = document.querySelector('meta[property="og:title"]') || document.querySelector('meta[name="twitter:title"]')) ? content.getAttribute('content') : null,
      image: (content = document.querySelector('meta[property="og:image"]') || document.querySelector('meta[name="twitter:image"]')) ? content.getAttribute('content') : null,
      ui: {
        flyout: 'top center',
        button_font: true,
        button_color: '#333333',
        button_background: '#a29baa',
        button_icon: 'export',
        button_text: 'Share'
      },
      network: {
        google_plus: {
          enabled: true,
          url: null
        },
        twitter: {
          enabled: true,
          url: null,
          text: null
        },
        facebook: {
          enabled: true,
          url: null,
          app_id: null,
          title: null,
          caption: null,
          text: null,
          image: null
        }
      }
    };
    this.setup(element, options);
    return this;
  }

  Share.prototype.setup = function(element, opts) {
    var index, instance, instances, _i, _len;
    instances = document.querySelectorAll(element);
    this.extend(this.config, opts, true);
    this.set_global_configuration();
    this.normalize_network_configuration();
    this.inject_icons();
    if (this.config.ui.button_font) {
      this.inject_fonts();
    }
    if (this.config.network.facebook.enabled) {
      this.inject_facebook_sdk();
    }
    for (index = _i = 0, _len = instances.length; _i < _len; index = ++_i) {
      instance = instances[index];
      this.setup_instance(element, index);
    }
  };

  Share.prototype.setup_instance = function(element, index) {
    var button, instance, label, network, networks, _i, _len, _results,
      _this = this;
    instance = document.querySelectorAll(element)[index];
    this.hide(instance);
    this.add_class(instance, "sharer-" + index);
    instance = document.querySelectorAll(element)[index];
    this.inject_css(instance);
    this.inject_html(instance);
    this.show(instance);
    label = instance.getElementsByTagName("label")[0];
    button = instance.getElementsByClassName("social")[0];
    networks = instance.getElementsByTagName('li');
    label.addEventListener("click", function() {
      return _this.event_toggle(button);
    });
    _this = this;
    _results = [];
    for (index = _i = 0, _len = networks.length; _i < _len; index = ++_i) {
      network = networks[index];
      _results.push(network.addEventListener("click", function() {
        _this.event_network(instance, this);
        return _this.event_close(button);
      }));
    }
    return _results;
  };

  Share.prototype.event_toggle = function(button) {
    if (this.has_class(button, "active")) {
      this.event_close(button);
    } else {
      this.event_open(button);
    }
  };

  Share.prototype.event_open = function(button) {
    this.add_class(button, "active");
  };

  Share.prototype.event_close = function(button) {
    this.remove_class(button, "active");
  };

  Share.prototype.event_network = function(instance, network) {
    var name;
    name = network.getAttribute("data-network");
    this.filter("before", name);
    this["network_" + name]();
    return this.filter("after", name);
  };

  Share.prototype.network_facebook = function() {
    if (!window.FB) {
      return console.error("The Facebook JS SDK hasn't loaded yet.");
    }
    return FB.ui({
      method: 'feed',
      name: this.config.network.facebook.title,
      link: this.config.network.facebook.url,
      picture: this.config.network.facebook.image,
      caption: this.config.network.facebook.caption,
      description: this.config.network.facebook.description
    });
  };

  Share.prototype.network_twitter = function() {
    return this.popup("https://twitter.com/intent/tweet?text=" + this.config.network.twitter.text + "&url=" + this.config.network.twitter.url);
  };

  Share.prototype.network_google_plus = function() {
    return this.popup("https://plus.google.com/share?url=" + this.config.network.google_plus.url);
  };

  Share.prototype.inject_icons = function() {
    var link;
    if (!this.el.head.querySelector('link[href="https://www.sharebutton.co/fonts/v2/entypo.min.css"]')) {
      link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", "https://www.sharebutton.co/fonts/v2/entypo.min.css");
      return this.el.head.appendChild(link);
    }
  };

  Share.prototype.inject_fonts = function() {
    var link;
    if (!this.el.head.querySelector("link[href=\"http://fonts.googleapis.com/css?family=Lato:900&text=" + this.config.ui.button_text + "\"]")) {
      link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", "http://fonts.googleapis.com/css?family=Lato:900&text=" + this.config.ui.button_text);
      return this.el.head.appendChild(link);
    }
  };

  Share.prototype.inject_css = function(instance) {
    var meta, selector;
    selector = "." + (instance.getAttribute('class').split(" ").join("."));
    if (!this.el.head.querySelector("meta[name='sharer" + selector + "']")) {
      this.config.selector = selector;
      this.el.head.innerHTML += getStyles(this.config);
      delete this.config.selector;
      meta = document.createElement("meta");
      meta.setAttribute("name", "sharer" + selector);
      return this.el.head.appendChild(meta);
    }
  };

  Share.prototype.inject_html = function(instance) {
    return instance.innerHTML = "<label class='entypo-" + this.config.ui.button_icon + "'><span>" + this.config.ui.button_text + "</span></label><div class='social " + this.config.ui.flyout + "'><ul><li class='entypo-twitter' data-network='twitter'></li><li class='entypo-facebook' data-network='facebook'></li><li class='entypo-gplus' data-network='google_plus'></li></ul></div>";
  };

  Share.prototype.inject_facebook_sdk = function() {
    var script;
    if (!window.FB && this.config.network.facebook.app_id && !this.el.body.querySelector('#fb-root')) {
      script = document.createElement("script");
      script.text = "window.fbAsyncInit=function(){FB.init({appId:'" + this.config.network.facebook.app_id + "',status:true,xfbml:true})};(function(e,t,n){var r,i=e.getElementsByTagName(t)[0];if(e.getElementById(n)){return}r=e.createElement(t);r.id=n;r.src='" + this.config.protocol + "connect.facebook.net/en_US/all.js';i.parentNode.insertBefore(r,i)})(document,'script','facebook-jssdk')";
      this.el.body.innerHTML += "<div id='fb-root'></div>";
      return this.el.body.appendChild(script);
    }
  };

  Share.prototype.filter = function(type, network) {
    var fn, opts;
    fn = this.config.network[network][type];
    if (typeof fn === "function") {
      opts = fn.call(this.config);
      opts = this.normalize_filter_config_updates(opts);
      this.extend(this.config.network[network], opts, true);
      this.normalize_network_configuration();
    }
  };

  Share.prototype.set_global_configuration = function() {
    var network, option, options, _ref, _results;
    _ref = this.config.network;
    _results = [];
    for (network in _ref) {
      options = _ref[network];
      _results.push((function() {
        var _results1;
        _results1 = [];
        for (option in options) {
          if (this.config.network[network][option] === null) {
            _results1.push(this.config.network[network][option] = this.config[option]);
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Share.prototype.normalize_network_configuration = function() {
    if (!this.is_encoded(this.config.network.twitter.text)) {
      this.config.network.twitter.text = encodeURIComponent(this.config.network.twitter.text);
    }
    if (typeof this.config.network.facebook.app_id === 'integer') {
      return this.config.network.facebook.app_id = this.config.network.facebook.app_id.toString();
    }
  };

  Share.prototype.normalize_filter_config_updates = function(opts) {
    if (this.config.network.facebook.app_id !== opts.app_id) {
      console.warn("You are unable to change the Facebook app_id after the button has been initialized. Please update your Facebook filters accordingly.");
      delete opts.app_id;
    }
    return opts;
  };

  return Share;

})(ShareUtils);
}.call(this)