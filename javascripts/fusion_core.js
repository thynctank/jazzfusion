var JazzFusion = {
  each: function(collection, iterator, bind) {
    switch(this.getType(collection)) {
      case "array": 
        for(var i = 0, l = collection.length; i < l; i++)
          iterator.call(bind, collection[i], i);
        break;
      case "object":
        for(var property in collection) {
          if(collection.hasOwnProperty(property))
            iterator.call(bind, collection[property], property);
        }
        break;
    }
  },

  isDefined: function(obj) {
    return !(typeof obj === "undefined" || obj === null);
  },

  // only needs to know basic types and differentiate arrays from other objects
  getType: function(obj) {
    if(typeof obj === "undefined" || obj === null || (typeof obj === "number" && isNaN(obj)))
      return false;
    else if(obj.constructor === Array)
      return "array";
    else
      return typeof obj;
  },

  debug: false,
  //firebug/air debug function, kill by setting this.debug = false
  puts: function(obj) {
    if(this.debug === false)
      return;
    if(typeof console !== "undefined" && console.log) {
      switch(this.getType(obj)) {
        case "object":
          if(console.dir) {
            console.dir(obj);
            break;
          }
        default:
          console.log(obj);
      }
    }
    if(typeof air !== "undefined") {
      if (air.Introspector && air.Introspector.Console) {
        switch(this.getType(obj)) {
          case "string":
            air.Introspector.Console.log(obj);
            break;
          case "object":
            air.Introspector.Console.dump(obj);
            break;
        }
      }
      else
        air.trace(obj);
    }
  },

  merge: function() {
    var mergedObject = {};
    for(var i = 0, l = arguments.length; i < l; i++) {
      var object = arguments[i];
      if(this.getType(object) !== "object")
        continue;
      for(var prop in object) {
        var objectProp = object[prop], mergedProp = mergedObject[prop];
        if(mergedProp && this.getType(objectProp) === "object" && this.getType(mergedProp) === "object")
          mergedObject[prop] = this.merge(mergedProp, objectProp);
        else
          mergedObject[prop] = objectProp;
      }
    }
    return mergedObject;
  },

  shallowMerge: function(origObj, mergeObj) {
    for(var prop in mergeObj)
      origObj[prop] = mergeObj[prop];
    return origObj;
  },

  // call with call or apply, so this is NOT JazzFusion
  setOptions: function(options, defaults) {
    if(!options)
      options = {};
    if(!this.options)
      this.options = {};
    mergedOptions = JazzFusion.merge(defaults, options);
    for(var opt in defaults) {
      this.options[opt] = mergedOptions[opt];
    }
  },

  // mimic's MooTools' String.substitute() followed by String.clean()
  replaceAndClean: function(str, options) {
    for(opt in options) {
      str = str.replace("{" + opt + "}", options[opt]);
    }    
    str = str.replace(/{\w+}/g, "");
    return str.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
  },

  extend: function(baseClass, options) {
    if(!this.options)
      this.options = {};
    this.parent = new baseClass(options);
    for(var prop in this.parent) {
      this[prop] = this[prop] || this.parent[prop];
    }
    // copy base options over
    for(var opt in this.parent.options) {
      this.options[opt] = this.options[opt] || this.parent.options[opt];
    }
  },

  indexOf: function(arr, val) {
    var index = -1;
    if(arr.indexOf)
      index = arr.indexOf(val);
    else {
      for(var i = 0, l = arr.length; i < l; i++) {
        if(arr[i] === val) {
          index = i;
          break;
        }
      }
    }
    return index;
  },

  // check arr for an instance of val
  arrayContainsVal: function(arr, val) {
    if(this.indexOf(arr, val) > -1)
      return true;
    else
      return false;
  },

  removeFromArray: function(arr, val) {
    var index = this.indexOf(arr, val);
    arr.splice(index, 1);
  }
};

JazzFusion.Hash = function(obj) {
  this.data = obj || {};
};

JazzFusion.Hash.prototype = {
  has: function(key) {
    if(this.data.hasOwnProperty(key))
      return true;
    else
      return false;
  },
  set: function(key, value) {
    this.data[key] = value;
  },
  get: function(key) {
    return this.data[key];
  },
  getLength: function() {
    var length = 0;
    for(var i in this.data) {
       if(this.data.hasOwnProperty(i))
        length++;
    }
    return length;
  },
  each: function(iterator, bind) {
    JazzFusion.each(this.data, iterator, bind);
  },
  getValues: function() {
    var keys = [];
    this.each(function(val) {
      keys.push(val);
    });
    return keys;
  },
  getKeys: function() {
    var values = [];
    this.each(function(val, key) {
      values.push(key);
    });
    return values;
  }
};

JazzFusion.controllers = new JazzFusion.Hash();

// This is an adapter for various parsers. must implement newView() and render() methods, must deal with html and source properties
// Abstract into various parsers for simple templates, markdown, etc
JazzFusion.View = function() {
  this.source = "";
  this.hasRendered = false;
};

JazzFusion.View.prototype = {
  render: function(options) {
    if(this.hasRendered === true)
      return;

    this.hasRendered = true;
    JazzFusion.puts("Rendering");
    var html = JazzFusion.replaceAndClean(this.source, options);
    this.stripAndRunScripts(html);
  },
  // mimic's something or other in jQuery
  stripAndRunScripts: function(html) {
    var scriptsRx = /<script.+<\/script>/g;
    var scripts = html.match(scriptsRx);
    html = html.replace(scriptsRx, "");
    document.getElementById(JazzFusion.viewId).innerHTML = html;
    
    var scriptRemovalRx = /<\/?script(\s*\S*=\S*)*>/g;
    JazzFusion.each(scripts, function(s) {
      // remove open/close script tags
      s = JazzFusion.replaceAndClean(s.replace(scriptRemovalRx, ""));
      debugger;
      // insertBefore to head
      // removeChild from head
    });
  }
};