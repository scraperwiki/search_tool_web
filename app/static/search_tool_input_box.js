// :todo(drj): move to scraperwiki.js
var smartAlert = function(message, technicalDetails) {
  var reportButton = '<span id="report_btn">Click the big red <strong>Help</strong> button for assistance</span>'
  var detailButton = '<a id="detail_btn">click here to show technical details</a>'
  scraperwiki.alert(message, '<p class="actions">' + reportButton + ' or ' +
    detailButton + '</p><pre>' + technicalDetails + '\n\n' +
    obtainStack() + '</pre>', true)
}

var obtainStack = function() {
  return "Origin:\n\n" + printStackTrace().slice(4).join("\n");
}


// :todo(drj): this function is pretty generic and should be
// in scraperwiki.js
function saveSettings(callback) {
  // Save all elements that have class "sw-persist".
  // :todo(drj): doesn't work for type="checkbox"; fix that.
  var toSave = {}
  $('.sw-persist').each(function(i, element) {
    var $element = $(element)
    toSave[element.id] = $element.val().split(",")
  });
  localStorage.setItem('search-tool-web_'+window.location.pathname, JSON.stringify(toSave, null, 4))
  callback()
}

// :todo(drj): this function is pretty generic and should be
// in scraperwiki.js
function loadSettings(callback) {
  // after the exec (below), we call this function to fill in
  // all elements that have the "sw-persist" class.
  var populateElements = function() {
    $('.sw-persist').each(function(i, element) {
      var $element = $(element)
      $element.val(swSettings[element.id])
    });
  }

  var swSettings = {}
  content = localStorage.getItem('search-tool-web_'+window.location.pathname)
  if(content) {
    try {
      swSettings = JSON.parse(content)
        } catch(e) {
      smartAlert("Failed to parse settings.",
        String(e), "\n\n" + content)
        }
      }
  populateElements()
}

var do_search = function(query) {
  var options;
  options = {
    url: window.location.href + 'search',
    data: { q: query, },
    type: "GET"
  };
  return $.ajax(options);
};

// From datatables-view-tool.
var handle_ajax_error = function(jqXHR, textStatus, errorThrown) {
  $('#content > .dataTables_processing').remove()
  if (jqXHR.responseText.match(/database file does not exist/) != null) {
    $('#table-sidebar-loading').text('No tables')
    $('#content').html('<div class="problem"><h4>This dataset is empty.</h4>' +
                       '<p>Once your dataset contains data,<br/>' +
                       'it will show up in a table here.</p></div>')

  } else if (jqXHR.responseText.match(/Gateway Time-out/) != null) {
    $('#content').html('<div class="problem"><h4>Well this is embarassing.</h4>' +
                       '<p>Your dataset is too big to display.</br>' +
                       'Try downloading it as a spreadsheet.</p></div>')

  } else {
    scraperwiki.alert(errorThrown, jqXHR.responseText, "error")
  }
}


var redirectToDatatables = function() {
    // datatables-web may not be present; find the URL it would have if
    // present, and then check if it's available.
    var tableUrl = '../datatables';

    var options;
    options = {
        url: tableUrl,
        type: "GET"
    };

    $.ajax(options).done(function() {
        window.location.href = tableUrl;
    }).fail(function() {
        smartAlert("No datatables tool found; can't redirect to show you the results.");
    })
  };

$(function() {
    loadSettings()
    // Setup the "submit" button.
    // :todo(drj): make generic and put in scraperwiki.js
    var execSuccess = function(execOutput) {
      // Note: "success" here means that the command executed,
      // but says nothing about what it did.
      if(execOutput != '') {
        smartAlert("An error occurred", execOutput)
        return
      }
      $('#search-go').removeClass('loading').html('Get Results');
      redirectToDatatables();
    }
    $('#search-go').on('click', function() {
      $(this).addClass('loading').html('Fetching…')
      saveSettings(function() {
        var q = $('#search-terms').val()
        do_search(q).done(execSuccess).fail(function(jqXHR, textStatus, errorThrown) {
          handle_ajax_error(jqXHR, textStatus, errorThrown)
        });
        //TODO: add naming, but not sure how to go about this.
        //scraperwiki.dataset.name("Bing search results for " + name_from_url(q))
      })
    })

    setup_behaviour()
})

// :todo(drj): should be generic (in scraperwiki.js?).
var name_from_url = function(url) {
  var bits = url.split("/")
  if (bits.length > 2) {
    var ret = bits[2] 
    ret = ret.replace("www.", "")
    return ret
  }
  return url
}

// Setup various minor bits of user-interface:
//   Pressing return should have same effect as button click;
//   Hovering over the example opens popup;
//   Clicking on popup populates the box.
var setup_behaviour = function() {
  // :todo(drj): should be in scraperwiki.js
  $("#search-terms").attr('disabled', false).on('keyup', function(e){
    if(e.which == 13){  // carriage return
      e.preventDefault()
      $('#search-go').trigger('click')
    }
  })

  // :todo(drj): should be in scraperwiki.js
  $('#show-examples').popover({
    content: function(){
      return $('#examples').html()
    },
    placement: "bottom",
    html: true
  })
  $(document).on('click', '#message .popover a', function(e){
    if (!e.metaKey) {
      e.preventDefault()
      $('body').animate({scrollTop: 0}, 200)
      $('#show-examples').popover('hide')
      $("#search-terms").val( $(this).attr('href') )
      $('#error, .alert-error').hide()
    }
  })
  $(document).on('click', function(e){
    // Close the "examples" popover when you click anywhere outside it
    var $a = $('#show-examples')
    if( ! $a.is(e.target) && $a.has(e.target).length === 0 && $('.popover').has(e.target).length === 0 ){
      $a.popover('hide')
    }
  })

  // Make the "show technical details" thing work.
  $(document).on('click', '.alert #detail_btn', function(){
    $(this).parents('.alert').find('pre').slideToggle(250)
  })
}
