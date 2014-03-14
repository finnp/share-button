class ShareUtils
  extend: (to, from, overwrite) ->
    for prop of from
      hasProp = to[prop] isnt `undefined`
      if hasProp and typeof(from[prop]) is "object"
        @extend(to[prop], from[prop], overwrite)
      else
        to[prop] = from[prop] if overwrite or not hasProp
    return

  hide: (el) ->
    el.style.display = "none"
    return

  show: (el) ->
    el.style.display = "block"
    return

  has_class: (el, class_name) ->
    el.classList.contains(class_name)

  add_class: (el, class_name) ->
    el.classList.add(class_name)
    return

  remove_class: (el, class_name) ->
    el.classList.remove(class_name)
    return

  is_encoded: (str) ->
    decodeURIComponent(str) isnt str

  popup: (url) ->
    popup =
      width:  500
      height: 350

    popup.top  = (screen.height/2) - (popup.height/2)
    popup.left = (screen.width/2)  - (popup.width/2)

    window.open(url, 'targetWindow', "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left=#{popup.left},top=#{popup.top},width=#{popup.width},height=#{popup.height}")

    return

#####

class (exports ? this).Share extends ShareUtils
  constructor: (element, options) ->
    @el =
      head: document.getElementsByTagName('head')[0]
      body: document.getElementsByTagName('body')[0]

    @config =
      protocol: if ['http', 'https'].indexOf(window.location.href.split(':')[0]) is -1 then 'https://' else '//'
      url: window.location.href
      caption: null

      text: if content = (document.querySelector('meta[property="og:description"]') || document.querySelector('meta[name="twitter:description"]') ||  document.querySelector('meta[name="description"]'))
        content.getAttribute('content')
      else
        ''

      title: if content = (document.querySelector('meta[property="og:title"]') || document.querySelector('meta[name="twitter:title"]'))
        content.getAttribute('content')
      else
        null

      image: if content = (document.querySelector('meta[property="og:image"]') || document.querySelector('meta[name="twitter:image"]'))
        content.getAttribute('content')
      else
        null

      ui:
        flyout: 'top center'
        button_font: true
        button_color: '#333333'
        button_background: '#a29baa'
        button_icon: 'export'
        button_text: 'Share'

      network:
        google_plus:
          enabled: true
          url: null
        twitter:
          enabled: true
          url: null
          text: null
        facebook:
          enabled: true
          url: null
          app_id: null
          title: null
          caption: null
          text: null
          image: null

    @setup(element, options)

    return @

  setup: (element, opts) ->
    ## Record all instances
    instances = document.querySelectorAll(element) # TODO: Use more efficient method.

    ## Extend config object
    @extend(@config, opts, true)

    ## Apply missing network-specific configurations
    @set_global_configuration()
    @normalize_network_configuration()

    ## Inject Icon Fontset
    @inject_icons()

    ## Inject Google's Lato Fontset (if enabled)
    @inject_fonts() if @config.ui.button_font

    ## Inject Facebook JS SDK (if Facebook is enabled)
    @inject_facebook_sdk() if @config.network.facebook.enabled

    ## Loop through and initialize each instance
    @setup_instance(element, index) for instance, index in instances

    return


  setup_instance: (element, index) ->
    ## Get instance - (Note: Reload Element. gS/qSA doesn't support live NodeLists)
    instance = document.querySelectorAll(element)[index] # TODO: Use more efficient method.

    ## Hide instance
    @hide(instance)

    ## Add necessary classes to instance (Note: FF doesn't support adding multiple classes in a single call)
    @add_class(instance, "sharer-#{index}")

    ## Get instance - (Note: Reload Element. gS/qSA doesn't support live NodeLists)
    instance = document.querySelectorAll(element)[index] # TODO: Use more efficient method.

    ## Inject HTML and CSS
    @inject_css(instance)
    @inject_html(instance)

    ## Show instance
    @show(instance)

    label    = instance.getElementsByTagName("label")[0]
    button   = instance.getElementsByClassName("social")[0]
    networks = instance.getElementsByTagName('li')
    
    ## Add listener to activate buttons
    label.addEventListener "click", => @event_toggle(button)

    ## Add listener to activate networks and close button
    _this = @
    for network, index in networks
      network.addEventListener "click", ->
        _this.event_network(instance, @)
        _this.event_close(button)


  ##########
  # EVENTS #
  ##########


  event_toggle: (button) ->
    if @has_class(button, "active")
      @event_close(button)
    else
      @event_open(button)

    return

  event_open: (button) ->
    @add_class(button, "active")
    return

  event_close: (button) ->
    @remove_class(button, "active")
    return

  event_network: (instance, network) ->
    name = network.getAttribute("data-network")
    @filter("before", name)
    @["network_#{name}"]()
    @filter("after", name)


  ############################
  # NETWORK-SPECIFIC METHODS #
  ############################


  network_facebook: ->
    unless window.FB
      return console.error "The Facebook JS SDK hasn't loaded yet."

    FB.ui
      method:       'feed',
      name:         @config.network.facebook.title
      link:         @config.network.facebook.url
      picture:      @config.network.facebook.image
      caption:      @config.network.facebook.caption
      description:  @config.network.facebook.description

  network_twitter: ->
    @popup("https://twitter.com/intent/tweet?text=#{@config.network.twitter.text}&url=#{@config.network.twitter.url}")

  network_google_plus: ->
    @popup("https://plus.google.com/share?url=#{@config.network.google_plus.url}")


  #############
  # INJECTORS #
  #############


  inject_icons: ->
    # Notes
    # - Must be https:// due to CDN CORS caching issues
    # - To include the full entypo set, change URL to: https://www.sharebutton.co/fonts/entypo.css
    unless @el.head.querySelector('link[href="https://www.sharebutton.co/fonts/v2/entypo.min.css"]')
      link = document.createElement("link")
      link.setAttribute("rel", "stylesheet")
      link.setAttribute("href", "https://www.sharebutton.co/fonts/v2/entypo.min.css")
      @el.head.appendChild(link)

  inject_fonts: ->
    unless @el.head.querySelector("link[href=\"http://fonts.googleapis.com/css?family=Lato:900&text=#{@config.ui.button_text}\"]")
      link = document.createElement("link")
      link.setAttribute("rel", "stylesheet")
      link.setAttribute("href", "http://fonts.googleapis.com/css?family=Lato:900&text=#{@config.ui.button_text}")
      @el.head.appendChild(link)
  
  inject_css: (instance) ->
    selector = ".#{instance.getAttribute('class').split(" ").join(".")}"

    unless @el.head.querySelector("meta[name='sharer#{selector}']")
      @config.selector = selector # TODO: Temporary
      @el.head.innerHTML += getStyles(@config)
      delete @config.selector # TODO: Temporary

      meta = document.createElement("meta")
      meta.setAttribute("name", "sharer#{selector}")
      @el.head.appendChild(meta)

  inject_html: (instance) ->
    instance.innerHTML = "<label class='entypo-#{@config.ui.button_icon}'><span>#{@config.ui.button_text}</span></label><div class='social #{@config.ui.flyout}'><ul><li class='entypo-twitter' data-network='twitter'></li><li class='entypo-facebook' data-network='facebook'></li><li class='entypo-gplus' data-network='google_plus'></li></ul></div>"

  inject_facebook_sdk: ->
    if !window.FB && @config.network.facebook.app_id && !@el.body.querySelector('#fb-root')
      script      = document.createElement("script")
      script.text = "window.fbAsyncInit=function(){FB.init({appId:'#{@config.network.facebook.app_id}',status:true,xfbml:true})};(function(e,t,n){var r,i=e.getElementsByTagName(t)[0];if(e.getElementById(n)){return}r=e.createElement(t);r.id=n;r.src='#{@config.protocol}connect.facebook.net/en_US/all.js';i.parentNode.insertBefore(r,i)})(document,'script','facebook-jssdk')"

      @el.body.innerHTML += "<div id='fb-root'></div>"
      @el.body.appendChild(script)


  ###########
  # HELPERS #
  ###########

  filter: (type, network) ->
    fn = @config.network[network][type]

    if typeof(fn) is "function"
      opts = fn.call(@config)
      opts = @normalize_filter_config_updates(opts)

      @extend(@config.network[network], opts, true)
      @normalize_network_configuration()

    return

  set_global_configuration: ->
    ## Update network-specific configuration with global configurations
    for network, options of @config.network
      for option of options
        if @config.network[network][option] is null
          @config.network[network][option] = @config[option]

  normalize_network_configuration: ->
    ## Encode Twitter text for URL
    unless @is_encoded(@config.network.twitter.text)
      @config.network.twitter.text = encodeURIComponent(@config.network.twitter.text)

    ## Typecast Facebook app_id to a String
    if typeof(@config.network.facebook.app_id) is 'integer'
      @config.network.facebook.app_id = @config.network.facebook.app_id.toString()

  normalize_filter_config_updates: (opts) ->
    if @config.network.facebook.app_id isnt opts.app_id
      console.warn "You are unable to change the Facebook app_id after the button has been initialized. Please update your Facebook filters accordingly."
      delete opts.app_id

    return opts
