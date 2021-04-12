
function setParams (obj, redirect = false) {
    // Construct URLSearchParams object instance from current URL querystring.
    var queryParams = new URLSearchParams(window.location.search);
    // Set new or modify existing parameter value. 
  
    Object.keys(obj).forEach (function (key) {
      queryParams.set(key, obj[key]);
    })
  
    if (redirect) {
      if (window.location.search != '?'+queryParams.toString())
        window.location.href = '?'+queryParams.toString();
    } else {
      // Replace current querystring with the new one.
      history.replaceState(null, null, "?"+queryParams.toString());
    }
  
  }