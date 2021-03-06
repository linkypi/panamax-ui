(function($) {

  $.PMX.addedAnimation = function($element) {
    var $indicateNew = $('<div class="indicate-new"></div>');

    $element.append($indicateNew);
    $indicateNew.fadeOut(2000);
  };

  $.PMX.destroyLink = function(el, options){
    var base = this;

    base.$el = $(el);
    base.xhr = null;

    base.defaultOptions = {
      removeAt: 'li',
      linkSelector: '.actions a.delete-action'
    };

    base.init = function(){
      base.options = $.extend({}, base.defaultOptions, options);
      base.bindEvents();
    };

    base.bindEvents = function() {
      base.$el.on('click', base.options.linkSelector, base.handleDelete);
    };

    base.disable = function($target) {
      if (base.options.disableWith) {
        $target.html(base.options.disableWith);
        $target.addClass('disabled');
      }
    };

    base.done = function() {
       if (base.options.success) { base.options.success(); }
    };

    base.fail = function(response, $target) {
      if (base.options.fail) {
        base.options.fail(response, $target, base);
      } else {
        alert("Unable to complete delete operation");
      }
    };

    base.remove = function($target) {
      var $remove = $target.closest(base.options.removeAt);
      $remove.css('opacity', '0.5')
        .delay(1000)
        .fadeOut('slow', base.done)
        .find('a').css('cursor', 'not-allowed');
    };

    base.handleDelete = function(event) {
      var $target = $(event.currentTarget);
      event.preventDefault();
      event.stopPropagation();

      base.disable($target);

      $.ajax({
        url: $target.attr('href'),
        headers: {
          'Accept': 'application/json'
        },
        type: 'DELETE'
      })
      .done(function() {
        base.remove($target);
      })
      .fail(function(response){
        base.fail(response, $target);
      });
    };
  };

  $.PMX.ConfirmDelete = function(el, options) {
    var base = this;

    base.$el = $(el);

    base.defaultOptions = {
      message: 'Delete this item?',
      buttonText: 'Yes, Delete!',
      confirmSelector: '.confirm-delete button.yes',
      cancelSelector: '.confirm-delete button.no'
    };

    base.init = function() {
      base.options = $.extend({}, base.defaultOptions, options);
      base.injectMarkup();
      base.bindEvents();
    };

    base.injectMarkup = function() {
      var markup = '<section class="confirm-delete">' + base.options.message +
                   '<span><button class="no">Cancel</button><button class="yes">' +
                   base.options.buttonText + '</button></span></section>',
          $hideaway, $confirm;

      base.wrapElements();
      base.$el.append(markup);
      $confirm = base.$el.find('section.confirm-delete');
      $confirm.css(
        {
          'position': 'absolute'
        });
    };

    base.bindEvents = function() {
      base.$el.unbind('click');
      base.$el.on('click', base.options.confirmSelector, base.handleConfirm);
      base.$el.on('click', base.options.cancelSelector, base.handleCancel);
    };

    base.wrapElements = function() {
      base.$el.wrapInner('<div class="hideaway"></div>');
      base.$el.find('.hideaway').css('display', 'none');
    };

    base.unWrapElements = function($target) {
      var $parent = $target.closest('.confirm-delete').parent();

      $parent.find('.confirm-delete').remove();
      $parent.find('.hideaway').children().first().unwrap();
    };

    base.handleConfirm = function(e) {
      if (base.options.confirm) { base.options.confirm(); }
    };

    base.handleCancel = function(e) {
      base.unWrapElements($(e.currentTarget));
      if (base.options.cancel) { base.options.cancel(); }
    };
  };
})(jQuery);
