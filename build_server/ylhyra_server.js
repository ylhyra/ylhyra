/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app/Analytics/TextInteractions.js":
/*!***********************************************!*\
  !*** ./src/app/Analytics/TextInteractions.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_App_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/axios */ "./src/app/App/axios.js");
/*
  Analytics on which terms are most clicked on.
*/
// const TESTING = true;
 // axios.defaults.withCredentials = true;

let mode = "mouse";
let currentId = null;
let startTime = null;
let seen = [];
let timer = null;

const reset = () => {
  close();
};

const show = ({
  type,
  id
}) => {
  close();
  currentId = id;
  startTime = new Date().getTime();
};

const close = () => {
  // if(mw.config.get('wgUserGroups').includes('sysop') || mw.config.get('wgUserGroups').includes('editor')) return;
  if (!currentId) return;
  const endTime = new Date().getTime();
  const timeDiff = endTime - startTime;
  if (timeDiff < 1000) return; // Discard if item was only seen for <1 second

  seen.push({
    id: currentId,
    seenAt: startTime,
    timeSeen: Math.round(timeDiff / 100) * 100
  });
  currentId = null;
  startTime = null;
  timer && clearTimeout(timer);
  timer = setTimeout(send, 5 * 1000);
};

const setTouchMode = () => {
  mode = "touch";
};

const send = () => {
  if (window.developmentMode) return; // axios.post(`/api/a`, {
  //   pageName: mw.config.get('wgPageName'),
  //   seen,
  //   mode,
  // })

  seen = [];
};

/* harmony default export */ __webpack_exports__["default"] = ({
  reset,
  show,
  close,
  setTouchMode
});

/***/ }),

/***/ "./src/app/App/Error/index.js":
/*!************************************!*\
  !*** ./src/app/App/Error/index.js ***!
  \************************************/
/*! exports provided: default, notify */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "notify", function() { return notify; });
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _messages__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./messages */ "./src/app/App/Error/messages.js");





const Notification = props => {
  if (!props.error) return null;
  let message = props.error.message;

  if (message in _messages__WEBPACK_IMPORTED_MODULE_3__["default"]) {
    message = _messages__WEBPACK_IMPORTED_MODULE_3__["default"][message];
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "notification"
  }, message);
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(state => ({
  error: state.error
}))(Notification));
const notify = message => {
  app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].dispatch({
    type: "ERROR",
    content: {
      message: message
    }
  });
};

/***/ }),

/***/ "./src/app/App/Error/messages.js":
/*!***************************************!*\
  !*** ./src/app/App/Error/messages.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  /* Sign up */
  ERROR_INVALID_EMAIL: "That is not a valid email",
  ERROR_INVALID_TOKEN: "This is not a correct token",
  ERROR_EXPIRED_TOKEN: "Your token has expired. Please reload this page and start over.",
  ERROR_USER_ALREADY_EXIST: "It appears that you have already signed up. Please log in instead.",
  ERROR_EMAIL_COULD_NOT_BE_SENT: "ERROR_EMAIL_COULD_NOT_BE_SENT",
  ERROR_INCOMPLETE_FIELD: "ERROR_INCOMPLETE_FIELD",
  ERROR_USER_DOESNT_EXIST: "ERROR_USER_DOESNT_EXIST",

  /* Saving data */
  ERROR_NOT_LOGGED_IN: `You aren't logged in`
});

/***/ }),

/***/ "./src/app/App/Error/reducers.js":
/*!***************************************!*\
  !*** ./src/app/App/Error/reducers.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ((state = null, action) => {
  switch (action.type) {
    case "ERROR":
      return action.content;

    default:
      return state;
  }
});

/***/ }),

/***/ "./src/app/App/axios.js":
/*!******************************!*\
  !*** ./src/app/App/axios.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_App_Error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/Error */ "./src/app/App/Error/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);


axios__WEBPACK_IMPORTED_MODULE_1___default.a.defaults.timeout = 3000;
axios__WEBPACK_IMPORTED_MODULE_1___default.a.interceptors.response.use(function (success) {
  return success;
}, function (error) {
  let message;
  const response = error.response && error.response.data;
  const status = error.response && error.response.status;

  if (typeof response === "object") {
    message = response.message || response.error;
  }

  if (typeof message !== "string") {
    message = "Server returned an error";
  }

  if (status !== 404) {
    Object(app_App_Error__WEBPACK_IMPORTED_MODULE_0__["notify"])(message, "error");
  }

  return Promise.reject(error);
});
/* harmony default export */ __webpack_exports__["default"] = (axios__WEBPACK_IMPORTED_MODULE_1___default.a);

/***/ }),

/***/ "./src/app/App/functions/RemoveUnwantedCharacters.js":
/*!***********************************************************!*\
  !*** ./src/app/App/functions/RemoveUnwantedCharacters.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (input => {
  if (!input) return input;
  return input.replace(/\u160/g, " ") // NBSP
  .replace(/\u8206/g, "") // LTR mark
  .replace(/\u00AD/g, ""); // Soft hhyphen
});

/***/ }),

/***/ "./src/app/App/functions/array-foreach-async.js":
/*!******************************************************!*\
  !*** ./src/app/App/functions/array-foreach-async.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* eslint-disable */

/*

  https://github.com/mingchen/node-array-foreach-async#readme
  Placed here so Babel can compile it.
  (This problem was resolved in react-scripts 2.0, could be removed)

*/
if (!Array.prototype.forEachAsync) {
  Array.prototype.forEachAsync = async function (callback) {
    for (let index = 0; index < this.length; index++) {
      await callback(this[index], index, this);
    }
  };
}

/***/ }),

/***/ "./src/app/App/functions/cookie.js":
/*!*****************************************!*\
  !*** ./src/app/App/functions/cookie.js ***!
  \*****************************************/
/*! exports provided: setCookie, getCookie */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCookie", function() { return setCookie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCookie", function() { return getCookie; });
function setCookie(name, value, days, options) {
  var expires = "";

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + (value || "") + expires + `;${options || ""} path=/`;
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) === " ") c = c.substring(1, c.length);

    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999;";
}

/***/ }),

/***/ "./src/app/App/functions/exists.js":
/*!*****************************************!*\
  !*** ./src/app/App/functions/exists.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var is_empty_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-empty-object */ "is-empty-object");
/* harmony import */ var is_empty_object__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(is_empty_object__WEBPACK_IMPORTED_MODULE_0__);


const exists = input => {
  return input !== null && input && !is_empty_object__WEBPACK_IMPORTED_MODULE_0___default()(input);
};

/* harmony default export */ __webpack_exports__["default"] = (exists);

/***/ }),

/***/ "./src/app/App/functions/flattenArray.js":
/*!***********************************************!*\
  !*** ./src/app/App/functions/flattenArray.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const flattenArray = data => {
  var r = [];
  data.forEach(e => Array.isArray(e) ? r = r.concat(flattenArray(e)) : r.push(e));
  return r;
};

/* harmony default export */ __webpack_exports__["default"] = (flattenArray);

/***/ }),

/***/ "./src/app/App/functions/hash.js":
/*!***************************************!*\
  !*** ./src/app/App/functions/hash.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var string_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! string-hash */ "string-hash");
/* harmony import */ var string_hash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(string_hash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var json_stable_stringify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! json-stable-stringify */ "json-stable-stringify");
/* harmony import */ var json_stable_stringify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(json_stable_stringify__WEBPACK_IMPORTED_MODULE_1__);


/* harmony default export */ __webpack_exports__["default"] = (function (input) {
  if (typeof input === "object") {
    input = json_stable_stringify__WEBPACK_IMPORTED_MODULE_1___default()(input);
  } else if (typeof input !== "string") {
    input = JSON.stringify(input);
  }

  return string_hash__WEBPACK_IMPORTED_MODULE_0___default()(input).toString(36);
});

/***/ }),

/***/ "./src/app/App/functions/html2json/index.js":
/*!**************************************************!*\
  !*** ./src/app/App/functions/html2json/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/html2json */ "./src/app/App/functions/html2json/src/html2json.js");

/***/ }),

/***/ "./src/app/App/functions/html2json/lib/Pure-JavaScript-HTML5-Parser/htmlparser.js":
/*!****************************************************************************************!*\
  !*** ./src/app/App/functions/html2json/lib/Pure-JavaScript-HTML5-Parser/htmlparser.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*eslint-disable */

/*
 * HTML5 Parser By Sam Blowes
 *
 * Designed for HTML5 documents
 *
 * Original code by John Resig (ejohn.org)
 * http://ejohn.org/blog/pure-javascript-html-parser/
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * ----------------------------------------------------------------------------
 * License
 * ----------------------------------------------------------------------------
 *
 * This code is triple licensed using Apache Software License 2.0,
 * Mozilla Public License or GNU Public License
 *
 * ////////////////////////////////////////////////////////////////////////////
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * ////////////////////////////////////////////////////////////////////////////
 *
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is Simple HTML Parser.
 *
 * The Initial Developer of the Original Code is Erik Arvidsson.
 * Portions created by Erik Arvidssson are Copyright (C) 2004. All Rights
 * Reserved.
 *
 * ////////////////////////////////////////////////////////////////////////////
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * ----------------------------------------------------------------------------
 * Usage
 * ----------------------------------------------------------------------------
 *
 * // Use like so:
 * HTMLParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * // or to get an XML string:
 * HTMLtoXML(htmlString);
 *
 * // or to get an XML DOM Document
 * HTMLtoDOM(htmlString);
 *
 * // or to inject into an existing document/DOM node
 * HTMLtoDOM(htmlString, document);
 * HTMLtoDOM(htmlString, document.body);
 *
 */
(function () {
  // Regular Expressions for parsing tags and attributes
  var startTag = /^<([-A-Za-z0-9_:]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
      endTag = /^<\/([-A-Za-z0-9_:]+)[^>]*>/,
      attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g; // Empty Elements - HTML 5

  var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"); // Block Elements - HTML 5

  var block = makeMap("a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,videoabbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"); // Inline Elements - HTML 5

  var inline = makeMap(""); // Elements that you can, intentionally, leave open
  // (and which close themselves)

  var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"); // Attributes that have their values filled in disabled="disabled"

  var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"); // Special Elements (can contain anything)

  var special = makeMap("script,style");

  var HTMLParser = this.HTMLParser = function (html, handler) {
    var index,
        chars,
        match,
        stack = [],
        last = html;

    while (html) {
      chars = true; // Make sure we're not in a script or style element

      if (!stack[stack.length - 1] || !special[stack[stack.length - 1]]) {
        // Comment
        if (html.indexOf("<!--") == 0) {
          index = html.indexOf("-->");

          if (index >= 0) {
            if (handler.comment) handler.comment(html.substring(4, index));
            html = html.substring(index + 3);
            chars = false;
          } // end tag

        } else if (html.indexOf("</") == 0) {
          match = html.match(endTag);

          if (match) {
            html = html.substring(match[0].length);
            match[0].replace(endTag, parseEndTag);
            chars = false;
          } // start tag

        } else if (html.indexOf("<") == 0) {
          match = html.match(startTag);

          if (match) {
            html = html.substring(match[0].length);
            match[0].replace(startTag, parseStartTag);
            chars = false;
          }
        }

        if (chars) {
          index = html.indexOf("<");
          var text = index < 0 ? html : html.substring(0, index);
          html = index < 0 ? "" : html.substring(index);
          if (handler.chars) handler.chars(text);
        }
      } else {
        html = html.replace(new RegExp("([\\s\\S]*?)</" + stack[stack.length - 1] + "[^>]*>"), function (all, text) {
          text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2");
          if (handler.chars) handler.chars(text);
          return "";
        });
        parseEndTag("", stack[stack.length - 1]);
      }

      if (html == last) throw "html2json Parse Error: " + html.slice(0, 120);
      last = html;
    } // Clean up any remaining tags


    parseEndTag();

    function parseStartTag(tag, tagName, rest, unary) {
      tagName = tagName; //.toLowerCase();

      if (block[tagName]) {
        while (stack[stack.length - 1] && inline[stack[stack.length - 1]]) {
          parseEndTag("", stack[stack.length - 1]);
        }
      }

      if (closeSelf[tagName] && stack[stack.length - 1] == tagName) {
        parseEndTag("", tagName);
      }

      unary = empty[tagName] || !!unary;
      if (!unary) stack.push(tagName);

      if (handler.start) {
        var attrs = [];
        rest.replace(attr, function (match, name) {
          var value = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[name] ? name : "";
          attrs.push({
            name: name,
            value: value,
            escaped: value.replace(/(^|[^\\])"/g, '$1\\"') //"

          });
        });
        if (handler.start) handler.start(tagName, attrs, unary);
      }
    }

    function parseEndTag(tag, tagName) {
      // If no tag name is provided, clean shop
      if (!tagName) var pos = 0; // Find the closest opened tag of the same type
      else for (var pos = stack.length - 1; pos >= 0; pos--) if (stack[pos] == tagName) break;

      if (pos >= 0) {
        // Close all the open elements, up the stack
        for (var i = stack.length - 1; i >= pos; i--) if (handler.end) handler.end(stack[i]); // Remove the open elements from the stack


        stack.length = pos;
      }
    }
  };

  this.HTMLtoXML = function (html) {
    var results = "";
    HTMLParser(html, {
      start: function (tag, attrs, unary) {
        results += "<" + tag;

        for (var i = 0; i < attrs.length; i++) results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';

        results += ">";
      },
      end: function (tag) {
        results += "</" + tag + ">";
      },
      chars: function (text) {
        results += text;
      },
      comment: function (text) {
        results += "<!--" + text + "-->";
      }
    });
    return results;
  };

  this.HTMLtoDOM = function (html, doc) {
    // There can be only one of these elements
    var one = makeMap("html,head,body,title"); // Enforce a structure for the document

    var structure = {
      link: "head",
      base: "head"
    };

    if (!doc) {
      if (typeof DOMDocument != "undefined") doc = new DOMDocument();else if (typeof document != "undefined" && document.implementation && document.implementation.createDocument) doc = document.implementation.createDocument("", "", null);else if (typeof ActiveX != "undefined") doc = new ActiveXObject("Msxml.DOMDocument");
    } else doc = doc.ownerDocument || doc.getOwnerDocument && doc.getOwnerDocument() || doc;

    var elems = [],
        documentElement = doc.documentElement || doc.getDocumentElement && doc.getDocumentElement(); // If we're dealing with an empty document then we
    // need to pre-populate it with the HTML document structure

    if (!documentElement && doc.createElement) (function () {
      var html = doc.createElement("html");
      var head = doc.createElement("head");
      head.appendChild(doc.createElement("title"));
      html.appendChild(head);
      html.appendChild(doc.createElement("body"));
      doc.appendChild(html);
    })(); // Find all the unique elements

    if (doc.getElementsByTagName) for (var i in one) one[i] = doc.getElementsByTagName(i)[0]; // If we're working with a document, inject contents into
    // the body element

    var curParentNode = one.body;
    HTMLParser(html, {
      start: function (tagName, attrs, unary) {
        // If it's a pre-built element, then we can ignore
        // its construction
        if (one[tagName]) {
          curParentNode = one[tagName];

          if (!unary) {
            elems.push(curParentNode);
          }

          return;
        }

        var elem = doc.createElement(tagName);

        for (var attr in attrs) elem.setAttribute(attrs[attr].name, attrs[attr].value);

        if (structure[tagName] && typeof one[structure[tagName]] != "boolean") one[structure[tagName]].appendChild(elem);else if (curParentNode && curParentNode.appendChild) curParentNode.appendChild(elem);

        if (!unary) {
          elems.push(elem);
          curParentNode = elem;
        }
      },
      end: function (tag) {
        elems.length -= 1; // Init the new parentNode

        curParentNode = elems[elems.length - 1];
      },
      chars: function (text) {
        curParentNode.appendChild(doc.createTextNode(text));
      },
      comment: function (text) {// create comment node
      }
    });
    return doc;
  };

  function makeMap(str) {
    var obj = {},
        items = str.split(",");

    for (var i = 0; i < items.length; i++) obj[items[i]] = true;

    return obj;
  }
})();

/***/ }),

/***/ "./src/app/App/functions/html2json/src/html2json.js":
/*!**********************************************************!*\
  !*** ./src/app/App/functions/html2json/src/html2json.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-disable */
(function (global) {
  DEBUG = false;
  var debug = DEBUG ? console.log.bind(console) : function () {};

  if ( true && typeof module.exports === "object") {
    __webpack_require__(/*! ../lib/Pure-JavaScript-HTML5-Parser/htmlparser.js */ "./src/app/App/functions/html2json/lib/Pure-JavaScript-HTML5-Parser/htmlparser.js");
  }

  function q(v) {
    return '"' + v + '"';
  }

  function removeDOCTYPE(html) {
    return html.replace(/<\?xml.*\?>\n/, "").replace(/<!doctype.*>\n/, "").replace(/<!DOCTYPE.*>\n/, "");
  }

  global.html2json = function html2json(html) {
    html = removeDOCTYPE(html);
    var bufArray = [];
    var results = {
      node: "root",
      child: []
    };
    HTMLParser(html, {
      start: function (tag, attrs, unary) {
        debug(tag, attrs, unary); // node for this element

        var node = {
          node: "element",
          tag: tag
        };

        if (attrs.length !== 0) {
          node.attr = attrs.reduce(function (pre, attr) {
            var name = attr.name;
            var value = attr.value; // // has multi attibutes
            // // make it array of attribute
            // if (value.match(/ /)) {
            //   value = value.split(' ');
            // }
            // if attr already exists
            // merge it

            if (pre[name]) {
              if (Array.isArray(pre[name])) {
                // already array, push to last
                pre[name].push(value);
              } else {
                // single value, make it array
                pre[name] = [pre[name], value];
              }
            } else {
              // not exist, put it
              pre[name] = value;
            }

            return pre;
          }, {});
        }

        if (unary) {
          // if this tag dosen't have end tag
          // like <img src="hoge.png"/>
          // add to parents
          var parent = bufArray[0] || results;

          if (parent.child === undefined) {
            parent.child = [];
          }

          parent.child.push(node);
        } else {
          bufArray.unshift(node);
        }
      },
      end: function (tag) {
        debug(tag); // merge into parent tag

        var node = bufArray.shift();
        if (node.tag !== tag) error("invalid state: mismatch end tag");

        if (bufArray.length === 0) {
          results.child.push(node);
        } else {
          var parent = bufArray[0];

          if (parent.child === undefined) {
            parent.child = [];
          }

          parent.child.push(node);
        }
      },
      chars: function (text) {
        debug(text);
        var node = {
          node: "text",
          text: text
        };

        if (bufArray.length === 0) {
          results.child.push(node);
        } else {
          var parent = bufArray[0];

          if (parent.child === undefined) {
            parent.child = [];
          }

          parent.child.push(node);
        }
      },
      comment: function (text) {
        return; // debug(text);
        // var node = {
        //   node: 'comment',
        //   text: text,
        // };
        // var parent = bufArray[0];
        // if (parent.child === undefined) {
        //   parent.child = [];
        // }
        // parent.child.push(node);
      }
    });
    return results;
  };

  global.json2html = function json2html(json) {
    // Empty Elements - HTML 4.01
    var empty = ["area", "base", "basefont", "br", "col", "frame", "hr", "img", "input", "isindex", "link", "meta", "param", "embed"];
    var child = "";

    if (json.child) {
      child = json.child.map(function (c) {
        return json2html(c);
      }).join("");
    }

    var attr = "";

    if (json.attr) {
      attr = Object.keys(json.attr).map(function (key) {
        var value = json.attr[key];
        if (Array.isArray(value)) value = value.join(" ");
        return key + "=" + q(value);
      }).join(" ");
      if (attr !== "") attr = " " + attr;
    }

    if (json.node === "element") {
      var tag = json.tag;

      if (empty.indexOf(tag) > -1) {
        // empty element
        return "<" + json.tag + attr + "/>";
      } // non empty element


      var open = "<" + json.tag + attr + ">";
      var close = "</" + json.tag + ">";
      return open + child + close;
    }

    if (json.node === "text") {
      return json.text;
    }

    if (json.node === "comment") {
      return ""; // return '<!--' + json.text + '-->';
    }

    if (json.node === "root") {
      return child;
    }
  };
})(this);

/***/ }),

/***/ "./src/app/App/functions/inline-style-2-json/index.js":
/*!************************************************************!*\
  !*** ./src/app/App/functions/inline-style-2-json/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function addDash(attr) {
  while (attr.indexOf("-") > 0) {
    // - is in the attribute name, but is not the first character either
    var afterDash = attr.substring(attr.indexOf("-") + 1);
    afterDash = afterDash.substring(0, 1).toUpperCase() + afterDash.substring(1);
    attr = attr.substring(0, attr.indexOf("-")) + afterDash;
  }

  return attr;
}

module.exports = function (str, opts) {
  if (typeof str !== "string") {
    throw new TypeError("Expected a string");
  }

  opts = opts || {};
  var obj = {};
  str.split(";").forEach(function (string) {
    if (string !== "") {
      var attr = string.split(":");
      var attrName;

      if (attr.length > 2) {
        attrName = attr.shift();
        attrName = addDash(attrName).trim();
        obj[attrName] = attr.join(":");
      } else {
        attrName = addDash(attr[0]).trim();
        obj[attrName] = attr[1];
      }
    }
  });

  if (opts.stringify) {
    return JSON.stringify(obj);
  } else {
    return obj;
  }
};

/***/ }),

/***/ "./src/app/App/functions/isBrowser.js":
/*!********************************************!*\
  !*** ./src/app/App/functions/isBrowser.js ***!
  \********************************************/
/*! exports provided: isBrowser, hasLocalStorage, supportsTouch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBrowser", function() { return isBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasLocalStorage", function() { return hasLocalStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supportsTouch", function() { return supportsTouch; });
const isBrowser = typeof window !== "undefined";
const hasLocalStorage = isBrowser && typeof localStorage !== "undefined";
const supportsTouch = isBrowser && ("ontouchstart" in window || navigator.msMaxTouchPoints);

/***/ }),

/***/ "./src/app/App/functions/localStorage.js":
/*!***********************************************!*\
  !*** ./src/app/App/functions/localStorage.js ***!
  \***********************************************/
/*! exports provided: saveInLocalStorage, getFromLocalStorage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveInLocalStorage", function() { return saveInLocalStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFromLocalStorage", function() { return getFromLocalStorage; });
/* Helper functions to stringify in local storage */
const saveInLocalStorage = (name, obj) => {
  localStorage.setItem(name, JSON.stringify(obj));
};
const getFromLocalStorage = name => {
  const x = localStorage.getItem(name);
  if (!x) return null;
  return JSON.parse(x);
};

/***/ }),

/***/ "./src/app/App/functions/math.js":
/*!***************************************!*\
  !*** ./src/app/App/functions/math.js ***!
  \***************************************/
/*! exports provided: average, clamp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "average", function() { return average; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clamp", function() { return clamp; });
const average = (arr = []) => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};
const clamp = function (input, min, max) {
  return Math.min(Math.max(input, min), max);
};

/***/ }),

/***/ "./src/app/App/functions/time.js":
/*!***************************************!*\
  !*** ./src/app/App/functions/time.js ***!
  \***************************************/
/*! exports provided: day, hour, round, daysToMs, msToS, roundMsToHour */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "day", function() { return day; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hour", function() { return hour; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "round", function() { return round; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "daysToMs", function() { return daysToMs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "msToS", function() { return msToS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "roundMsToHour", function() { return roundMsToHour; });
// const roundMsToHours = (input) => {
//   return round(
//     input,
//     (1000 /* ms */ * 60 /* s */ * 60 /* m */ * 60 /* hours */ ).toFixed(0).length
//   )
// }
//
const msInHour = 1000 * 60 * 60;
const msInDay = msInHour * 24;
const day = msInDay;
const hour = msInHour;
const round = (input, zeroes) => {
  const i = 10 ** zeroes;
  return Math.round(input / i) * i;
};
const daysToMs = input => input * msInDay;
const msToS = input => Math.round(input / 1000);
const roundMsToHour = input => Math.round(input / msInHour) * msInHour;

/***/ }),

/***/ "./src/app/App/store.js":
/*!******************************!*\
  !*** ./src/app/App/store.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "redux");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! redux-thunk */ "redux-thunk");
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(redux_thunk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var redux_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! redux-logger */ "redux-logger");
/* harmony import */ var redux_logger__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(redux_logger__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var app_App_functions_isBrowser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/App/functions/isBrowser */ "./src/app/App/functions/isBrowser.js");
/* harmony import */ var documents_Render_Audio_reducers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! documents/Render/Audio/reducers */ "./src/documents/Render/Audio/reducers.js");
/* harmony import */ var app_Vocabulary_reducers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/Vocabulary/reducers */ "./src/app/Vocabulary/reducers.js");
/* harmony import */ var app_User_reducers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/User/reducers */ "./src/app/User/reducers.js");
/* harmony import */ var app_App_Error_reducers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/App/Error/reducers */ "./src/app/App/Error/reducers.js");
/* harmony import */ var app_Router_reducers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/Router/reducers */ "./src/app/Router/reducers.js");
// import { createBrowserHistory, createHashHistory } from 'history'



 // import { data } from 'documents/Render/reducers'

 // import { speed_reader } from 'documents/Render/Elements/Speed_reading/reducers'





/*
  Logger
*/

const extraMiddlewares = [];

if (true) {
  const {
    createLogger
  } = __webpack_require__(/*! redux-logger */ "redux-logger");

  extraMiddlewares.push(createLogger({
    collapsed: true
  }));
}

const store = Object(redux__WEBPACK_IMPORTED_MODULE_0__["createStore"])(Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])({
  // /* Data storage for the renderer */
  // data,
  // /* Reader */
  audio: documents_Render_Audio_reducers__WEBPACK_IMPORTED_MODULE_4__["audio"],
  // inflection,
  // speed_reader,
  vocabulary: app_Vocabulary_reducers__WEBPACK_IMPORTED_MODULE_5__["vocabulary"],
  user: app_User_reducers__WEBPACK_IMPORTED_MODULE_6__["user"],
  error: app_App_Error_reducers__WEBPACK_IMPORTED_MODULE_7__["default"],
  route: app_Router_reducers__WEBPACK_IMPORTED_MODULE_8__["route"]
}), Object(redux__WEBPACK_IMPORTED_MODULE_0__["applyMiddleware"])( // routerMiddleware(history),
redux_thunk__WEBPACK_IMPORTED_MODULE_1___default.a, ...extraMiddlewares));
/* harmony default export */ __webpack_exports__["default"] = (store); //temp

if (app_App_functions_isBrowser__WEBPACK_IMPORTED_MODULE_3__["isBrowser"]) {
  window.store = store;
}

/***/ }),

/***/ "./src/app/Elements/Frontpage.js":
/*!***************************************!*\
  !*** ./src/app/Elements/Frontpage.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");
/* harmony import */ var app_Vocabulary_actions_functions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/Vocabulary/actions/_functions.js */ "./src/app/Vocabulary/actions/_functions.js");





const Screen = props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, !props.user ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "VOCABULARY_PLAY",
  className: "button"
}, "Start learning")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "LOG_IN"
}, "Already have an account?")) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "VOCABULARY_PLAY",
  className: "button"
}, "Play"), Object(app_Vocabulary_actions_functions_js__WEBPACK_IMPORTED_MODULE_3__["PercentageKnownOverall"])(), "% known")));

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(state => ({
  user: state.user
}))(Screen));

/***/ }),

/***/ "./src/app/Elements/Layout/Footer.js":
/*!*******************************************!*\
  !*** ./src/app/Elements/Layout/Footer.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_User_LoginButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/User/LoginButton */ "./src/app/User/LoginButton.js");
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");



/* harmony default export */ __webpack_exports__["default"] = (props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
  id: "footer"
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
  id: "footer-info"
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
  className: "footer-gray"
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  id: "footer-logo",
  title: "Kennitala: 480520-0170",
  href: "/Project:About"
}, "Ylh\xFDra")), "\u2022", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
  className: "anonymous-show"
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
  className: "footer-gray"
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
  href: "http://inflections.ylhyra.is/"
}, "Look up inflections")), "\u2022", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
  className: "footer-gray"
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
  href: "mailto:ylhyra@ylhyra.is"
}, "Report errors")), "\u2022", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
  className: "footer-gray"
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "/Project:Become_a_collaborator"
}, "Collaborate"))))));

/***/ }),

/***/ "./src/app/Elements/Layout/Header.js":
/*!*******************************************!*\
  !*** ./src/app/Elements/Layout/Header.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_User_LoginButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/User/LoginButton */ "./src/app/User/LoginButton.js");
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");



/* harmony default export */ __webpack_exports__["default"] = (props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("header", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "MAIN",
  id: "logo"
}), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "/Sp\xE6nska"
}, "Sp\xE6nska")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "/Texts"
}, "Texts")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "/Vocabulary"
}, "Vocabulary")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "/Course"
}, "Course")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "/Explanations"
}, "Explanations")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "/About"
}, "About"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_User_LoginButton__WEBPACK_IMPORTED_MODULE_1__["default"], null))))));

/***/ }),

/***/ "./src/app/Elements/Layout/Layout.js":
/*!*******************************************!*\
  !*** ./src/app/Elements/Layout/Layout.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var app_User_LoginButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/User/LoginButton */ "./src/app/User/LoginButton.js");
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");
/* harmony import */ var app_App_Error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/App/Error */ "./src/app/App/Error/index.js");
/* harmony import */ var app_Elements_Layout_Header__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/Elements/Layout/Header */ "./src/app/Elements/Layout/Header.js");
/* harmony import */ var app_Elements_Layout_Footer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/Elements/Layout/Footer */ "./src/app/Elements/Layout/Footer.js");
/* harmony import */ var app_Vocabulary_Elements_Session__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/Vocabulary/Elements/Session */ "./src/app/Vocabulary/Elements/Session.js");









class Layout extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  render() {
    const is_fullscreen = ["/vocabulary/play"].includes(this.props.route.pathname);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      id: "container"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_App_Error__WEBPACK_IMPORTED_MODULE_4__["default"], null), !is_fullscreen && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Elements_Layout_Header__WEBPACK_IMPORTED_MODULE_5__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      id: "content"
    }, !is_fullscreen && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Vocabulary_Elements_Session__WEBPACK_IMPORTED_MODULE_7__["default"], null), this.props.children), !is_fullscreen && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Elements_Layout_Footer__WEBPACK_IMPORTED_MODULE_6__["default"], null));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(state => ({
  route: state.route
}))(Layout));

/***/ }),

/***/ "./src/app/Router/Link.js":
/*!********************************!*\
  !*** ./src/app/Router/Link.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var app_Router_paths__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/Router/paths */ "./src/app/Router/paths.js");
/* harmony import */ var paths_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! paths.js */ "./src/paths.js");
/* harmony import */ var app_Router_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/Router/actions */ "./src/app/Router/actions.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








class Link extends react__WEBPACK_IMPORTED_MODULE_1___default.a.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "fn", (e, url) => {
      if (e.altKey || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_5__["updateURL"])(url);
    });
  }

  render() {
    let {
      route,
      href,
      children,
      className,
      id,
      to
    } = this.props;
    href = href || to;

    if (!href) {
      console.warn("Missing href:");
      console.log(children);
      return "";
    }

    if (href in app_Router_paths__WEBPACK_IMPORTED_MODULE_3__["urls"]) {
      href = app_Router_paths__WEBPACK_IMPORTED_MODULE_3__["urls"][href].url;
    }

    if (href.startsWith("/")) {
      href = Object(paths_js__WEBPACK_IMPORTED_MODULE_4__["URL_title"])(href);
    }
    /* Todo: Hvað með section linka? */


    if (route.pathname === href && !route.section || !href) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
        className,
        id
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("b", null, children));
    }

    if (href.startsWith("/")) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("a", {
        href: href,
        className,
        id,
        onClick: e => this.fn(e, href)
      }, children);
    } // if (!/%/.test(href)) {
    //   href = encodeURI(href);
    // }


    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("a", {
      href: href,
      className,
      id
    }, children);
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(state => ({
  route: state.route
}))(Link));

/***/ }),

/***/ "./src/app/Router/LoadContent.js":
/*!***************************************!*\
  !*** ./src/app/Router/LoadContent.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_App_axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/axios */ "./src/app/App/axios.js");
/* harmony import */ var documents_Templates_404__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! documents/Templates/404 */ "./src/documents/Templates/404.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var app_Router_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/Router/actions */ "./src/app/Router/actions.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/App/functions/html2json */ "./src/app/App/functions/html2json/index.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var documents_Parse__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! documents/Parse */ "./src/documents/Parse/index.js");
/* harmony import */ var documents_Render__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! documents/Render */ "./src/documents/Render/index.js");
/* harmony import */ var app_Vocabulary_Elements_VocabularyHeader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/Vocabulary/Elements/VocabularyHeader */ "./src/app/Vocabulary/Elements/VocabularyHeader.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










 // import markdown_to_html from 'documents/Compile/markdown_to_html'

let cache = {};

class Content extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {});
  }

  async componentDidMount() {
    if (!this.props.prerender) {
      this.get();
    }
  }

  get() {
    let url = Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_4__["getURL"])();

    if (url in cache) {
      this.set(url, cache[url]);
    } else {
      app_App_axios__WEBPACK_IMPORTED_MODULE_1__["default"].get("/api/content", {
        params: {
          title: url
        }
      }).then(async ({
        data
      }) => {
        this.set(url, data);
        cache[url] = data;
      }).catch(error => {
        if (error.response && error.response.status === 404) {
          this.setState({
            error: 404
          });
        }
      });
    }
  }

  set(url, data) {
    this.setState({
      data
    }); // TODO: Go to section, highlight

    url = data.redirect_to || url;
    Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_4__["updateURL"])(url, data.title, true);
  }

  render() {
    // if (this.state.error) return <NotFound />;
    // if (!this.state.data) return <div>Loading...</div>;
    // // console.log(Parse({ html: this.state.data.content }))
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, !this.props.prerender && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Vocabulary_Elements_VocabularyHeader__WEBPACK_IMPORTED_MODULE_8__["default"], {
      header_data: this.state.data && this.state.data.header
    }), Object(documents_Render__WEBPACK_IMPORTED_MODULE_7__["default"])({
      // json: Parse({
      //   html: /*markdown_to_html*/ this.state.data.content,
      // }).parsed,
      json: this.props.prerender
    }));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["connect"])(state => ({
  route: state.route
}))(Content));

/***/ }),

/***/ "./src/app/Router/actions.js":
/*!***********************************!*\
  !*** ./src/app/Router/actions.js ***!
  \***********************************/
/*! exports provided: InitializeRouter, updateURL, getURL */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitializeRouter", function() { return InitializeRouter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateURL", function() { return updateURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getURL", function() { return getURL; });
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var app_Router_paths__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/Router/paths */ "./src/app/Router/paths.js");
/* harmony import */ var app_App_functions_isBrowser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/App/functions/isBrowser */ "./src/app/App/functions/isBrowser.js");




app_App_functions_isBrowser__WEBPACK_IMPORTED_MODULE_2__["isBrowser"] && window.addEventListener("popstate", event => {
  updateURL(window.location.pathname);
});
const InitializeRouter = () => {
  updateURL(window.location.pathname + window.location.hash);
};
const updateURL = (url, title, replace) => {
  if (url in app_Router_paths__WEBPACK_IMPORTED_MODULE_1__["urls"]) {
    url = app_Router_paths__WEBPACK_IMPORTED_MODULE_1__["urls"][url].url;
  }

  if (!url.startsWith("/")) {
    url = "/" + url;
  }

  url = decodeURI(url);
  const [pathname, section] = url.split("#");

  if (!title && pathname in app_Router_paths__WEBPACK_IMPORTED_MODULE_1__["url_to_info"]) {
    title = app_Router_paths__WEBPACK_IMPORTED_MODULE_1__["url_to_info"][pathname].title;
  }

  window.document.title = (title ? title + "\u2006•\u200A" : "") + "Ylhýra";
  /*
    Force vocabulary game to keep the URL of the article it is started on
  */

  if (url === "/vocabulary/play") {
    app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].dispatch({
      type: "ROUTE",
      content: {
        pathname: url
      }
    });
    /* ?? */

    window.history.pushState(null, "", window.location.pathname);
    return;
  }

  if (url !== window.location.pathname) {
    if (replace) {
      window.history.replaceState(null, "", url);
    } else {
      window.history.pushState(null, "", url);
    }
  }

  if (!replace) {
    app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].dispatch({
      type: "ROUTE",
      content: {
        pathname: pathname,
        section: section
      }
    });
  }
};
const getURL = () => {
  return decodeURI(window.location.pathname).replace(/^\//, "");
};

/***/ }),

/***/ "./src/app/Router/index.js":
/*!*********************************!*\
  !*** ./src/app/Router/index.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_Elements_Layout_Layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/Elements/Layout/Layout */ "./src/app/Elements/Layout/Layout.js");
/* harmony import */ var app_User_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/User/actions */ "./src/app/User/actions.js");
/* harmony import */ var _LoadContent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LoadContent */ "./src/app/Router/LoadContent.js");
/* harmony import */ var app_Elements_Frontpage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/Elements/Frontpage */ "./src/app/Elements/Frontpage.js");
/* harmony import */ var app_Router_paths__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/Router/paths */ "./src/app/Router/paths.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_6__);








class App extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  render() {
    let Element = () => null;

    const url = this.props.route.pathname;

    if (url in app_Router_paths__WEBPACK_IMPORTED_MODULE_5__["default"] && !this.props.prerender) {
      Element = app_Router_paths__WEBPACK_IMPORTED_MODULE_5__["default"][url];
    } else {
      Element = _LoadContent__WEBPACK_IMPORTED_MODULE_3__["default"];
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Elements_Layout_Layout__WEBPACK_IMPORTED_MODULE_1__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Element, {
      key: url,
      prerender: this.props.prerender
    }));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_6__["connect"])(state => ({
  route: state.route
}))(App));

/***/ }),

/***/ "./src/app/Router/paths.js":
/*!*********************************!*\
  !*** ./src/app/Router/paths.js ***!
  \*********************************/
/*! exports provided: urls, url_to_info, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "urls", function() { return urls; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "url_to_info", function() { return url_to_info; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_Elements_Layout_Layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/Elements/Layout/Layout */ "./src/app/Elements/Layout/Layout.js");
/* harmony import */ var app_User_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/User/actions */ "./src/app/User/actions.js");
/* harmony import */ var _LoadContent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LoadContent */ "./src/app/Router/LoadContent.js");
/* harmony import */ var app_Elements_Frontpage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/Elements/Frontpage */ "./src/app/Elements/Frontpage.js");
/* harmony import */ var app_Vocabulary_screens_overview__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/Vocabulary/screens/overview */ "./src/app/Vocabulary/screens/overview.js");
/* harmony import */ var app_Vocabulary_screens_running__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/Vocabulary/screens/running */ "./src/app/Vocabulary/screens/running.js");
/* harmony import */ var app_Vocabulary_screens_setup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/Vocabulary/screens/setup */ "./src/app/Vocabulary/screens/setup.js");
/* harmony import */ var app_User_screens_Login__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/User/screens/Login */ "./src/app/User/screens/Login.js");
/* harmony import */ var app_User_screens_Signup__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/User/screens/Signup */ "./src/app/User/screens/Signup.js");
/* harmony import */ var app_User_screens_Settings__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/User/screens/Settings */ "./src/app/User/screens/Settings.js");
/* harmony import */ var app_User_screens_Pay__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! app/User/screens/Pay */ "./src/app/User/screens/Pay.js");












const urls = {
  MAIN: {
    url: "/",
    component: app_Elements_Frontpage__WEBPACK_IMPORTED_MODULE_4__["default"]
  },
  VOCABULARY: {
    title: "Vocabulary",
    url: "/vocabulary",
    component: app_Vocabulary_screens_overview__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  VOCABULARY_SETUP: {
    title: "Vocabulary",
    url: "/vocabulary/setup",
    component: app_Vocabulary_screens_setup__WEBPACK_IMPORTED_MODULE_7__["default"]
  },
  VOCABULARY_PLAY: {
    title: "Vocabulary",
    url: "/vocabulary/play",
    component: app_Vocabulary_screens_running__WEBPACK_IMPORTED_MODULE_6__["default"]
  },
  // /vocabulary/tutorial: {
  //   title: 'Vocabulary',
  //   url: '/vocabulary/tutorial',
  //   component: VocabularyTutorial
  // },
  LOG_IN: {
    title: "Log in",
    url: "/login",
    component: app_User_screens_Login__WEBPACK_IMPORTED_MODULE_8__["default"]
  },
  SIGN_UP: {
    title: "Sign up",
    url: "/signup",
    component: app_User_screens_Signup__WEBPACK_IMPORTED_MODULE_9__["default"]
  },
  PAY: {
    url: "/signup/pwyw",
    component: app_User_screens_Pay__WEBPACK_IMPORTED_MODULE_11__["default"]
  },
  USER_PAGE: {
    url: "/settings",
    component: app_User_screens_Settings__WEBPACK_IMPORTED_MODULE_10__["default"]
  }
};
const components = {};
const url_to_info_ = {};

for (const name in urls) {
  components[urls[name].url] = urls[name].component;
  url_to_info_[urls[name].url] = { ...urls[name],
    name
  };
}

const url_to_info = url_to_info_;
/* harmony default export */ __webpack_exports__["default"] = (components);

/***/ }),

/***/ "./src/app/Router/reducers.js":
/*!************************************!*\
  !*** ./src/app/Router/reducers.js ***!
  \************************************/
/*! exports provided: route */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "route", function() { return route; });
const route = (state = {
  pathname: "/"
}, action) => {
  switch (action.type) {
    case "ROUTE":
      return action.content;

    default:
      return state;
  }
};

/***/ }),

/***/ "./src/app/User/Login/index.js":
/*!*************************************!*\
  !*** ./src/app/User/Login/index.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_Router_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/Router/actions */ "./src/app/Router/actions.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");
/* harmony import */ var app_User_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/User/actions */ "./src/app/User/actions.js");
/* harmony import */ var _hcaptcha_react_hcaptcha__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @hcaptcha/react-hcaptcha */ "@hcaptcha/react-hcaptcha");
/* harmony import */ var _hcaptcha_react_hcaptcha__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_hcaptcha_react_hcaptcha__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var app_App_axios__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/App/axios */ "./src/app/App/axios.js");
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! formik */ "formik");
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(formik__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var app_App_Error_messages__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/App/Error/messages */ "./src/app/App/Error/messages.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }












class Form2 extends react__WEBPACK_IMPORTED_MODULE_2___default.a.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "submit", async (values, setSubmitting) => {
      this.setState({ ...values
      });
      /* Execute invisible captcha */

      if (!this.state.captcha_token && process.env.REACT_APP_HCAPTCHA_SITEKEY) {
        this.setState({
          message: "Verifying...",
          awaitingCaptcha: true
        });
        this.captcha_element.current.execute();
        setSubmitting && setSubmitting(false);
        return;
      }

      const response = (await app_App_axios__WEBPACK_IMPORTED_MODULE_6__["default"].post("/api/user", { ...this.state,
        ...values
      })).data;
      console.log(response);
      setSubmitting && setSubmitting(false);

      if (response.error) {
        this.setState({
          error: app_App_Error_messages__WEBPACK_IMPORTED_MODULE_9__["default"][response.error] || response.error
        });
        return;
      }

      const {
        user_id,
        username,
        did_user_exist
      } = response;
      Object(app_User_actions__WEBPACK_IMPORTED_MODULE_4__["login"])({
        username,
        user_id
      });

      if (!did_user_exist) {
        Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_0__["updateURL"])("PAY");
      } else {
        Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_0__["updateURL"])("MAIN");
      }
    });

    this.captcha_element = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createRef();
    this.state = {
      step: 1,
      type: this.props.type // Either "signup" or "login"

    };
  }

  render() {
    const submit = this.submit;
    const error = this.state.error && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
      className: "error"
    }, this.state.error);
    const message = this.state.message && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
      className: ""
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("b", null, this.state.message));
    const parent = this;
    const isSignup = this.props.type === "signup";
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, this.props.above, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_7__["Formik"], {
      initialValues: {
        username: "",
        email: "",
        password: ""
      },
      validate: values => {
        const errors = {};

        if (!values.username.trim()) {
          errors.username = "Required";
        }

        if (values.email && !/@/.test(values.email)) {
          errors.email = "Invalid email address";
        }

        if (!values.password) {
          errors.password = "Required";
        }

        return errors;
      },
      onSubmit: (values, {
        setSubmitting
      }) => {
        submit(values, setSubmitting);
      }
    }, ({
      isSubmitting
    }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_7__["Form"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, isSignup ? "Choose a username" : "Username or email:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_7__["ErrorMessage"], {
      name: "username",
      component: "div"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_7__["Field"], {
      type: "text",
      name: "username"
    })), isSignup && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Email:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_7__["ErrorMessage"], {
      name: "email",
      component: "div"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_7__["Field"], {
      type: "email",
      name: "email"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, isSignup ? "Choose a password" : "Password:"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_7__["ErrorMessage"], {
      name: "password",
      component: "div"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_7__["Field"], {
      type: "password",
      name: "password"
    })), error, message, process.env.REACT_APP_HCAPTCHA_SITEKEY && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_hcaptcha_react_hcaptcha__WEBPACK_IMPORTED_MODULE_5___default.a, {
      size: "invisible",
      ref: parent.captcha_element,
      sitekey: process.env.REACT_APP_HCAPTCHA_SITEKEY,
      onVerify: value => {
        parent.setState({
          captcha_token: value
        });

        if (parent.state.awaitingCaptcha) {
          parent.submit({});
        }
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("button", {
      type: "submit",
      disabled: isSubmitting
    }, "Submit"))));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(state => ({
  route: state.route
}))(Form2));

/***/ }),

/***/ "./src/app/User/LoginButton.js":
/*!*************************************!*\
  !*** ./src/app/User/LoginButton.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");




const Button = props => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, props.user ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
    href: "USER_PAGE"
  }, props.user.username)) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
    href: "LOG_IN"
  }, "Log\xA0in"));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(state => ({
  user: state.user
}))(Button));

/***/ }),

/***/ "./src/app/User/actions.js":
/*!*********************************!*\
  !*** ./src/app/User/actions.js ***!
  \*********************************/
/*! exports provided: InitializeUser, getUserFromCookie, updateUser, login, logout, pay */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitializeUser", function() { return InitializeUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUserFromCookie", function() { return getUserFromCookie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateUser", function() { return updateUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "login", function() { return login; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logout", function() { return logout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pay", function() { return pay; });
/* harmony import */ var app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/localStorage */ "./src/app/App/functions/localStorage.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var app_Router_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/Router/actions */ "./src/app/Router/actions.js");
/* harmony import */ var app_App_axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/App/axios */ "./src/app/App/axios.js");
/* harmony import */ var app_Vocabulary_actions_init__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/Vocabulary/actions/init */ "./src/app/Vocabulary/actions/init.js");
/* harmony import */ var app_App_functions_cookie__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/App/functions/cookie */ "./src/app/App/functions/cookie.js");







const InitializeUser = () => {
  updateUser();
};
const getUserFromCookie = () => {
  let cookie = Object(app_App_functions_cookie__WEBPACK_IMPORTED_MODULE_6__["getCookie"])("y");

  if (cookie) {
    cookie = JSON.parse(atob(cookie));
    const {
      user_id,
      username
    } = cookie;

    if (user_id) {
      return {
        user_id,
        username
      };
    }
  }

  return null;
};
/* Called on route changes */

const updateUser = () => {
  const x = getUserFromCookie();

  if ((app_App_store__WEBPACK_IMPORTED_MODULE_2__["default"].getState().user && app_App_store__WEBPACK_IMPORTED_MODULE_2__["default"].getState().user.user_id) !== (x && x.user_id)) {
    app_App_store__WEBPACK_IMPORTED_MODULE_2__["default"].dispatch({
      type: "LOAD_USER",
      content: x
    });
  }
};
const login = async ({
  username,
  user_id
}) => {
  app_App_store__WEBPACK_IMPORTED_MODULE_2__["default"].dispatch({
    type: "LOAD_USER",
    content: {
      username,
      user_id
    }
  });
  /* TODO!!! Save logged-out schedule if new user */

  Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_0__["saveInLocalStorage"])("vocabulary-schedule", null);
  Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_0__["saveInLocalStorage"])("vocabulary-session", null);
  Object(app_Vocabulary_actions_init__WEBPACK_IMPORTED_MODULE_5__["InitializeVocabulary"])();
};
const logout = async () => {
  const response = (await app_App_axios__WEBPACK_IMPORTED_MODULE_4__["default"].post(`/api/user/logout`)).data;
  app_App_store__WEBPACK_IMPORTED_MODULE_2__["default"].dispatch({
    type: "LOAD_USER",
    content: null
  });
  app_App_store__WEBPACK_IMPORTED_MODULE_2__["default"].dispatch({
    type: "LOAD_SESSION",
    content: null
  });
  Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_0__["saveInLocalStorage"])("vocabulary-schedule", null);
  Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_0__["saveInLocalStorage"])("vocabulary-session", null);
  Object(app_Vocabulary_actions_init__WEBPACK_IMPORTED_MODULE_5__["InitializeVocabulary"])();
  Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_3__["updateURL"])("MAIN");
}; // todo: minimum

const MAX = 80;
const MIN = 2;
const pay = ({
  price
}) => {
  price = price.replace(/,/, ".");
  Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_3__["updateURL"])("MAIN");
};

/***/ }),

/***/ "./src/app/User/reducers.js":
/*!**********************************!*\
  !*** ./src/app/User/reducers.js ***!
  \**********************************/
/*! exports provided: user */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "user", function() { return user; });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "redux");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions */ "./src/app/User/actions.js");


const user = (state = null, action) => {
  switch (action.type) {
    case "LOAD_USER":
      return action.content;

    default:
      return state;
  }
};

/***/ }),

/***/ "./src/app/User/screens/Login.js":
/*!***************************************!*\
  !*** ./src/app/User/screens/Login.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");
/* harmony import */ var app_User_Login__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/User/Login */ "./src/app/User/Login/index.js");



/* harmony default export */ __webpack_exports__["default"] = (() => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_User_Login__WEBPACK_IMPORTED_MODULE_2__["default"], {
  type: "login",
  above: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_1__["default"], {
    href: "SIGN_UP"
  }, "Sign up"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Log in"))
}));

/***/ }),

/***/ "./src/app/User/screens/Pay.js":
/*!*************************************!*\
  !*** ./src/app/User/screens/Pay.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");
/* harmony import */ var app_Router_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/Router/actions */ "./src/app/Router/actions.js");
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! formik */ "formik");
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(formik__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var app_User_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/User/actions */ "./src/app/User/actions.js");







class Form2 extends react__WEBPACK_IMPORTED_MODULE_1___default.a.Component {
  componentDidMount() {
    if (!this.props.user) {
      Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_3__["updateURL"])("SIGN_UP");
    }
  }

  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, "An Ylh\xFDra account is available on a ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("b", null, "pay-what-you-want"), " basis. If you want to pay nothing, just write \"0\".", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_4__["Formik"], {
      initialValues: {
        price: ""
      },
      validate: values => {
        const errors = {}; // if (!values.price.trim()) {
        //   errors.price = 'Required';
        // } else if (
        //   !/[0-9]{4}$/.test(values.price.replace(/([^0-9])/g,'').trim())
        // ) {
        //   errors.price = `A price should be four digits`;
        // }

        return errors;
      },
      onSubmit: (values, {
        setSubmitting
      }) => {
        Object(app_User_actions__WEBPACK_IMPORTED_MODULE_5__["pay"])(values);
      }
    }, ({
      isSubmitting
    }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_4__["Form"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("label", null, "Price:", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_4__["ErrorMessage"], {
      name: "price",
      component: "div"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_4__["Field"], {
      type: "text",
      name: "price"
    }), " U.S. dollars"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("button", {
      type: "submit",
      disabled: isSubmitting
    }, "Continue"))));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(state => ({
  user: state.user
}))(Form2));

/***/ }),

/***/ "./src/app/User/screens/Settings.js":
/*!******************************************!*\
  !*** ./src/app/User/screens/Settings.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_User_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/User/actions */ "./src/app/User/actions.js");

/* harmony default export */ __webpack_exports__["default"] = (() => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
  onClick: app_User_actions__WEBPACK_IMPORTED_MODULE_0__["logout"]
}, "Log out")));

/***/ }),

/***/ "./src/app/User/screens/Signup.js":
/*!****************************************!*\
  !*** ./src/app/User/screens/Signup.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");
/* harmony import */ var app_User_Login__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/User/Login */ "./src/app/User/Login/index.js");



/* harmony default export */ __webpack_exports__["default"] = (() => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_User_Login__WEBPACK_IMPORTED_MODULE_2__["default"], {
  type: "signup",
  above: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_1__["default"], {
    href: "LOG_IN"
  }, "Already have an account?"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Step 1: Create an account", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), "Step 2: Pay what you want"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Create an account"), "An account allows you to save your vocabulary progress and continue the game on other devices.")
}));

/***/ }),

/***/ "./src/app/Vocabulary/Elements/Card.js":
/*!*********************************************!*\
  !*** ./src/app/Vocabulary/Elements/Card.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Vocabulary/actions/card */ "./src/app/Vocabulary/actions/card.js");
/* harmony import */ var app_Vocabulary_actions_session__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/Vocabulary/actions/session */ "./src/app/Vocabulary/actions/session.js");
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







class Card extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {});

    _defineProperty(this, "keyUp", () => {
      this.isKeyDown = false;
    });

    _defineProperty(this, "checkKey", e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (this.isKeyDown) return;
      const {
        answered
      } = this.props.vocabulary.card; // console.log(e.keyCode)

      this.isKeyDown = true;

      if (e.keyCode === 32
      /* Space */
      || e.keyCode === 13
      /* Enter */
      ) {
          if (answered) {
            this.answer(app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__["GOOD"]);
          } else {
            this.show();
          }

          e.preventDefault();
        } else if ([49
      /* One */
      , 74
      /* J */
      , 65
      /* A */
      , 37
      /* Left */
      ].includes(e.keyCode)) {
        if (answered) {
          this.answer(app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__["BAD"]);
        } else {
          this.show();
        }

        e.preventDefault();
      } else if ([50
      /* Two */
      , 75
      /* K */
      , 83
      /* S */
      , 40
      /* Down */
      ].includes(e.keyCode)) {
        if (answered) {
          this.answer(app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__["GOOD"]);
        } else {
          this.show();
        }

        e.preventDefault();
      } else if ([51
      /* Three */
      , 76
      /* L */
      , 68
      /* D */
      , 39
      /* Right */
      ].includes(e.keyCode)) {
        if (answered) {
          this.answer(app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__["EASY"]);
        } else {
          this.show();
        }

        e.preventDefault();
      } // console.log(e.keyCode)

    });

    _defineProperty(this, "answer", (i, timeout) => {
      if (this.state.answer) return;

      if (timeout === false) {
        Object(app_Vocabulary_actions_session__WEBPACK_IMPORTED_MODULE_3__["answer"])(i);
      } else {
        this.setState({
          answer: i
        });
        setTimeout(() => {
          Object(app_Vocabulary_actions_session__WEBPACK_IMPORTED_MODULE_3__["answer"])(i);
        }, 100);
      }
    });

    _defineProperty(this, "show", timeout => {
      if (this.props.vocabulary.card.answered) return;

      if (timeout === false) {
        app_App_store__WEBPACK_IMPORTED_MODULE_4__["default"].dispatch({
          type: "ANSWER_CARD"
        });
      } else {
        this.setState({
          clickingOnShowButton: true
        });
        setTimeout(() => {
          app_App_store__WEBPACK_IMPORTED_MODULE_4__["default"].dispatch({
            type: "ANSWER_CARD"
          });
        }, 50);
      }
    });
  }

  componentDidMount() {
    this.componentDidUpdate();
    window.addEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }

  componentDidUpdate(prevProps) {
    const {
      card,
      status
    } = this.props.vocabulary;

    if (!prevProps || card.counter !== prevProps.vocabulary.card.counter) {
      this.setState({
        answer: null,
        clickingOnShowButton: null // hint: hide(from !== 'is' ? card.is : card.en)

      });
    }
  }

  render() {
    const {
      card,
      status
    } = this.props.vocabulary;
    const answered = card.answered; // console.log(card)
    // console.log({card,answer})

    if (!card || !card.is) return null;
    let {
      from,
      basic_form,
      note_bfr_show,
      note_after_show,
      literally
    } = card;
    let Type = null;
    const is = card.is;
    const en = card.en;
    let note_above = null;
    let note_below = null;
    literally = literally && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "Literally:"), " ", styleCommas(literally), " ");
    basic_form = basic_form && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "Basic form:"), " ", styleCommas(basic_form), " ");
    note_after_show = styleCommas(note_after_show);
    note_bfr_show = styleCommas(note_bfr_show);

    if (from === "is") {
      note_above = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "note"
      }, basic_form);
      note_below = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "note",
        key: 2
      }, literally, (note_after_show || note_bfr_show) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "Note:"), " ", note_after_show || note_bfr_show, " "));
    } else {
      note_above = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "note"
      }, note_bfr_show && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "Note:"), " ", note_bfr_show, " "), literally);
      note_below = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "note",
        key: 2
      }, note_after_show && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, "Note:"), " ", note_after_show, " "), basic_form);
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: `
          vocabulary-card
          flashcard
          ${answered ? "answered" : "not-answered"}
        `,
      key: status.counter,
      onClick: () => this.show(false)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: `
          flashcard-top
          flashcard-prompt-${from === "is" ? "icelandic" : "english"}
        `
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, styleCommas(from === "is" ? is : en)), note_above), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: `
          flashcard-bottom
          flashcard-prompt-${from !== "is" ? "icelandic" : "english"}
        `
    }, answered ? [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      key: 1
    }, styleCommas(from !== "is" ? is : en)), note_below] : card.showHint && this.state.hint), !answered ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: `
              not-answered
              ${this.state.clickingOnShowButton ? "selected" : ""}
            `
    }, "Click to show answer")) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: this.state.answer === app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__["BAD"] ? "selected" : "",
      onClick: () => this.answer(app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__["BAD"], false)
    }, "Bad"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: this.state.answer === app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__["GOOD"] ? "selected" : "",
      onClick: () => this.answer(app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__["GOOD"], false)
    }, "Good"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: this.state.answer === app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__["EASY"] ? "selected" : "",
      onClick: () => this.answer(app_Vocabulary_actions_card__WEBPACK_IMPORTED_MODULE_2__["EASY"], false)
    }, "Easy")));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(state => ({
  vocabulary: state.vocabulary
}))(Card));

const hide = input => {
  if (!input) return null;
  if (input.split(" ").length > 2) return null; // Temp

  const output = input.split(/([,;/ ])/g).map(i => {
    if (i.match(/[,;/ ]/)) return i;
    let hintsToShow = Math.min(Math.ceil(Math.random() * 3), i.length - 2); // if(i.length <= 2) hintsToShow = 0;

    return i.split("").map((j, index) => {
      if (index >= hintsToShow && !/[.?!:;,]/.test(j)) return `<span class="occulted"><span>${j}</span></span>`;
      return j;
    }).join("");
  }).join(""); //.replace(/\(/g, '<span className="parentheses">(').replace(/\)/g, ')</span>')

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: output
    }
  });
};

const styleCommas = text => {
  if (!text) return null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, text.replace(/"([^"]*)"/g, "“$1”")
  /* Curly quotes */
  .replace(/\\,/g, "\u0044")
  /* Escaped commas */
  .replace(/ \+ /g, "\u2006+\u2006")
  /* Spacing around plusses */
  .split(/(, )/g).map((j, index) => {
    if (index % 2 === 0) {
      /* Style semicolons */
      return j.split(/(; )/g).map((u, index2) => {
        if (index2 % 2 === 0) {
          return u;
        }

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "semicolon",
          key: index2
        }, ";", " ");
      });
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "comma",
      key: index
    }, ",", " ");
  }));
};

/***/ }),

/***/ "./src/app/Vocabulary/Elements/GameContainer.js":
/*!******************************************************!*\
  !*** ./src/app/Vocabulary/Elements/GameContainer.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Card */ "./src/app/Vocabulary/Elements/Card.js");
/* harmony import */ var _Progress__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Progress */ "./src/app/Vocabulary/Elements/Progress.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var documents_Read_Touch___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! documents/Read/Touch/ */ "./src/documents/Read/Touch/index.js");
/* harmony import */ var app_App_functions_isBrowser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/App/functions/isBrowser */ "./src/app/App/functions/isBrowser.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








class GameContainer extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "componentDidMount", () => {
      this.componentDidUpdate();
    });

    _defineProperty(this, "componentDidUpdate", () => {
      const {
        deck,
        session
      } = this.props.vocabulary;

      if (deck && !session) {
        deck.generateSession();
      }
    });
  }

  render() {
    const {
      status,
      session
    } = this.props.vocabulary;
    if (!session) return null;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      id: "game-container"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "vocabulary-card-outer-container"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Card__WEBPACK_IMPORTED_MODULE_1__["default"], null)), session.printTimeRemaining(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Progress__WEBPACK_IMPORTED_MODULE_2__["default"], null));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["connect"])(state => ({
  vocabulary: state.vocabulary
}))(GameContainer));

/***/ }),

/***/ "./src/app/Vocabulary/Elements/Progress.js":
/*!*************************************************!*\
  !*** ./src/app/Vocabulary/Elements/Progress.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);



class Progress extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render() {
    const {
      bad,
      good,
      easy
    } = this.props.vocabulary.status;
    const percentageDone = this.props.vocabulary.session.getAdjustedPercentageDone();
    const seen = bad + good + easy + Number.EPSILON;

    const _bad = bad / seen * percentageDone;

    const _good = good / seen * percentageDone;

    const _easy = easy / seen * percentageDone; // console.log({ bad, good, easy, percentageDone })


    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "vocabulary-progress"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "name"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "remaining"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "bar"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "part easy",
      style: {
        flex: _easy
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "part good",
      style: {
        flex: _good
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "part bad",
      style: {
        flex: _bad
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "part remaining",
      style: {
        flex: 100 - percentageDone
      }
    })));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(state => ({
  vocabulary: state.vocabulary
}))(Progress));

/***/ }),

/***/ "./src/app/Vocabulary/Elements/Session.js":
/*!************************************************!*\
  !*** ./src/app/Vocabulary/Elements/Session.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");
/* harmony import */ var documents_Templates_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! documents/Templates/Button */ "./src/documents/Templates/Button.js");





class Session extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render() {
    const {
      session
    } = this.props.vocabulary;
    if (!session || session.remainingTime === session.totalTime || session.done) return null;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      id: ""
    }, session ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(documents_Templates_Button__WEBPACK_IMPORTED_MODULE_3__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
      href: "VOCABULARY_PLAY"
    }, "Session ", session.printTimeRemaining(), " remaining. CONTINUE!"))) : "");
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(state => ({
  vocabulary: state.vocabulary
}))(Session));

/***/ }),

/***/ "./src/app/Vocabulary/Elements/VocabularyHeader.js":
/*!*********************************************************!*\
  !*** ./src/app/Vocabulary/Elements/VocabularyHeader.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");
/* harmony import */ var documents_Templates_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! documents/Templates/Button */ "./src/documents/Templates/Button.js");
/* harmony import */ var app_Vocabulary_actions_session__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/Vocabulary/actions/session */ "./src/app/Vocabulary/actions/session.js");
/* harmony import */ var app_Router_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/Router/actions */ "./src/app/Router/actions.js");
/* harmony import */ var app_Vocabulary_actions_functions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/Vocabulary/actions/_functions */ "./src/app/Vocabulary/actions/_functions.js");
/* harmony import */ var app_Vocabulary_actions_createCards__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/Vocabulary/actions/createCards */ "./src/app/Vocabulary/actions/createCards.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










class X extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "getCards", () => {
      const vocabulary_list = this.props.header_data.vocabulary;
      if (!vocabulary_list) return null;
      return Object(app_Vocabulary_actions_functions__WEBPACK_IMPORTED_MODULE_6__["getCardIdsFromWords"])(vocabulary_list);
    });

    _defineProperty(this, "run", () => {
      const {
        deck
      } = this.props.vocabulary;
      const cards = Object(app_Vocabulary_actions_createCards__WEBPACK_IMPORTED_MODULE_7__["default"])({
        allowed_card_ids: this.getCards()
      }, deck); //.map(id => deck.cards[id])

      Object(app_Vocabulary_actions_session__WEBPACK_IMPORTED_MODULE_4__["InitializeSession"])(cards, deck);
      Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_5__["updateURL"])("/vocabulary/play");
    });
  }

  render() {
    const vocabulary_list = this.props.header_data.vocabulary;
    const {
      deck
    } = this.props.vocabulary;
    if (!vocabulary_list || !deck) return null;
    const cards = this.getCards();
    if (cards.length === 0) return null;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, Object(app_Vocabulary_actions_functions__WEBPACK_IMPORTED_MODULE_6__["PercentageKnown"])(cards, deck), "% known"), this.props.button !== false && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      onClick: this.run
    }, "Study ", cards.length, " cards"));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(state => ({
  vocabulary: state.vocabulary
}))(X));

/***/ }),

/***/ "./src/app/Vocabulary/actions/_functions.js":
/*!**************************************************!*\
  !*** ./src/app/Vocabulary/actions/_functions.js ***!
  \**************************************************/
/*! exports provided: getDeck, MakeSummaryOfCardStatuses, PercentageKnown, PercentageKnownOverall, getWordFromId, getWordFromTerm, getRelatedCardIds, getCardIdsFromWords, withDependencies */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDeck", function() { return getDeck; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MakeSummaryOfCardStatuses", function() { return MakeSummaryOfCardStatuses; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PercentageKnown", function() { return PercentageKnown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PercentageKnownOverall", function() { return PercentageKnownOverall; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWordFromId", function() { return getWordFromId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWordFromTerm", function() { return getWordFromTerm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRelatedCardIds", function() { return getRelatedCardIds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCardIdsFromWords", function() { return getCardIdsFromWords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withDependencies", function() { return withDependencies; });
/* harmony import */ var server_vocabulary_setup_functions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/vocabulary/setup/functions.js */ "./src/server/vocabulary/setup/functions.js");
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./card */ "./src/app/Vocabulary/actions/card.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _session__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./session */ "./src/app/Vocabulary/actions/session.js");


/**
 * Various helper functions
 */




const getDeck = () => {
  return app_App_store__WEBPACK_IMPORTED_MODULE_1__["default"].getState().vocabulary.deck;
};
const MakeSummaryOfCardStatuses = card_ids => {
  const deck = getDeck();
  let not_seen = 0;
  let bad = 0;
  let good = 0;
  let easy = 0;
  card_ids.forEach(id => {
    if (id in deck.schedule) {
      if (deck.schedule[id].score < _card__WEBPACK_IMPORTED_MODULE_2__["GOOD"]) {
        bad++;
      } else if (deck.schedule[id].score < _card__WEBPACK_IMPORTED_MODULE_2__["EASY"]) {
        good++;
      } else {
        easy++;
      }
    } else {
      not_seen++;
    }
  });
  return {
    not_seen,
    bad,
    good,
    easy
  };
};
const PercentageKnown = card_ids => {
  const summary = MakeSummaryOfCardStatuses(card_ids);
  let done_count = summary.good + summary.easy * 1 + summary.bad * 1;
  let remaining_count = summary.not_seen * 1 + summary.bad * 2;
  let percentage = Math.ceil(done_count / (remaining_count + done_count) * 100);
  if (percentage === 100 && done_count !== remaining_count) percentage = 99;
  return percentage;
};
const PercentageKnownOverall = () => {
  const deck = getDeck();
  if (!deck) return null;
  const card_ids = Object.keys(deck.cards);
  return PercentageKnown(card_ids);
};
const getWordFromId = id => {
  const card = getDeck().cards[id];
  return card[card.from];
};
const getWordFromTerm = term => {
  if (getDeck().terms[term]) {
    return getWordFromId(getDeck().terms[term].cards[0]);
  } else {
    console.log(`No term ${term}`);
  }
};
const getRelatedCardIds = id => {
  if (typeof id === "undefined") throw new Error("Nothing passed to getRelatedCardIds");
  const deck = getDeck();
  let out = [];
  deck.cards[id].terms.forEach(term => {
    deck.terms[term].cards.forEach(sibling_card_id => {
      out.push(sibling_card_id);
    });
  });
  return out;
}; // export const filterOnlyCardsThatExist = (card_ids) => {
//   const deck = getDeck()
//   return card_ids.filter(id => id in deck.cards)
// }

const getCardIdsFromWords = words => {
  const deck = getDeck();
  let card_ids = [];
  words.forEach(word => {
    const hash = Object(server_vocabulary_setup_functions_js__WEBPACK_IMPORTED_MODULE_0__["getHash"])(word);

    if (hash in deck.terms) {
      card_ids = card_ids.concat(deck.terms[hash].cards);
    } else if (hash in deck.alternative_ids) {
      deck.alternative_ids[hash].forEach(j => {
        card_ids = card_ids.concat(deck.terms[j].cards);
      });
    } else {
      console.log(`"${word}" not in database`);
    }
  });
  return withDependencies(underscore__WEBPACK_IMPORTED_MODULE_3___default.a.uniq(card_ids));
};
const withDependencies = card_ids => {
  const deck = getDeck();
  let returns = [];
  let terms = [];
  card_ids.forEach(card_id => terms = terms.concat(deck.cards[card_id].terms));
  terms = underscore__WEBPACK_IMPORTED_MODULE_3___default.a.uniq(terms);
  terms.forEach(term => {
    let terms = [{
      term,
      sortKey: -1
    }];
    const chain = CreateDependencyChain(term, deck);
    Object.keys(chain).forEach(k => {
      terms.push({
        term: k,
        sortKey: chain[k]
      });
    });
    terms = terms.sort((a, b) => b.sortKey - a.sortKey).map(i => i.term);
    terms.forEach(term => {
      if (term in deck.terms) {
        returns = returns.concat(deck.terms[term].cards);
      }
    });
  });
  return underscore__WEBPACK_IMPORTED_MODULE_3___default.a.uniq(returns);
};
/**
 * Returns an object on the form { [key]: [depth] }
 */

const CreateDependencyChain = (from_term, deck, _alreadySeen = [], output = [], depth = 0) => {
  if (from_term in deck.dependencies) {
    deck.dependencies[from_term].forEach(term => {
      const alreadySeen = [..._alreadySeen];
      /* Deep copy in order to only watch direct parents */

      if (alreadySeen.includes(term)) return;
      alreadySeen.push(term);
      output[term] = Math.max(output[term] || 0, depth);
      alreadySeen.push(term);

      if (deck.dependencies[term]) {
        CreateDependencyChain(term, deck, alreadySeen, output, depth + 1);
      }
    });
  }

  return output;
};

/***/ }),

/***/ "./src/app/Vocabulary/actions/card.js":
/*!********************************************!*\
  !*** ./src/app/Vocabulary/actions/card.js ***!
  \********************************************/
/*! exports provided: BAD, GOOD, EASY, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BAD", function() { return BAD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GOOD", function() { return GOOD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EASY", function() { return EASY; });
/* harmony import */ var app_App_functions_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/math */ "./src/app/App/functions/math.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_functions */ "./src/app/Vocabulary/actions/_functions.js");


const BAD = 1;
const GOOD = 2;
const EASY = 3;

class Card {
  constructor(data, index, session) {
    this.session = session;
    this.progress = 0;
    this.history = [];
    this.goodRepetitions = 0;
    this.absoluteQueuePosition = index;
    Object.assign(this, data);
  }

  rate(rating) {
    this.history.unshift(rating);
    this.lastSeen = this.session.counter;
    /* Score */

    const lastTwoAverage = Object(app_App_functions_math__WEBPACK_IMPORTED_MODULE_0__["average"])(this.history.slice(0, 2));
    this.score = Math.floor(lastTwoAverage);

    if (rating !== BAD) {
      this.goodRepetitions++;
    }
    /* Schedule */


    let interval;

    if (rating === BAD) {
      interval = 3;
      this.done = false;
      /* User is getting annoyed */

      if (this.history.length > 10) {
        // TODO improve
        interval = 10;
      }
    } else if (rating === GOOD) {
      interval = 200;
      this.done = true;

      if (this.score && this.score < GOOD) {
        interval = 15;
      }

      if (this.history[1] >= GOOD) {
        interval = 200;
      } else if (this.history[1] === BAD) {
        interval = 8;
        this.done = false;
      } else if (this.history[2] === BAD) {
        interval = 15;
      }
    } else if (rating === EASY) {
      interval = 800;
      this.done = true;
    }

    this.absoluteQueuePosition = this.session.counter + interval;
    this.lastInterval = interval;
    this.status = Math.round(lastTwoAverage); // if (this.history.length >= 6) {
    //   this.done = true
    // }

    /* Postpone related cards */

    const card = this;
    card.terms.forEach(term => {
      card.session.cards.forEach(_card => {
        if (_card.id === card.id) return;

        if (_card.terms.includes(term)) {
          let max = 300;

          if (_card.score && _card.score < GOOD || card.history.includes(BAD) || _card.history.includes(BAD)) {
            max = 10;
          }

          const newPosition = _card.session.counter + Math.min(interval, max);

          if (newPosition > _card.absoluteQueuePosition) {
            _card.absoluteQueuePosition = newPosition;
          }
        }
      });
    });
    /* Add related cards (in case they're missing) */

    if (rating === BAD) {// getRelatedCardIds(card.id)
      //   .filter(sibling_id => !card.session.cards.some(j => j.id === sibling_id))
      //   .forEach(sibling_id => {
      //     /* TODO */
      //   })
    }

    this.session.cardTypeLog.unshift(this.from);
  }

  getRanking() {
    let q = this.getQueuePosition();
    /* New terms are not relevant unless there are no overdue cards */

    if (!this.terms.some(term => term in this.session.lastSeenTerms)) {
      q = this.absoluteQueuePosition + 1000;
    } else {
      /* Seen cards */

      /* Seen cards are not relevant if they are not overdue */
      if (q > 0) {
        q += 2000;
      }
    }
    /* A bad card that is due exactly now has priority */


    if (this.history[0] === BAD && q === 0 && this.session.counter % 2 === 0
    /* (But not always, to prevent staleness) */
    ) {
        q -= 50;
      } // /* Bad cards first */
    // if (
    //   this.history.length > 0 &&
    //   this.history[0] >= GOOD &&
    //   this.session.counter % 3 < 2 /* (But not always, to prevent staleness) */
    // ) {
    //   q += 20
    // }


    if (this.ticksSinceTermWasSeen() < 2) {
      q += 5000 - this.ticksSinceTermWasSeen();
    }

    if (this.done) {
      q += 700;
    }
    /* Prevent rows of the same card type from appearing right next to each other */


    if (this.session.cardTypeLog[0] === this.from && (this.history.length > 0 || this.sessions_seen > 0)
    /* TODO verify sessions_seen is set */
    ) {
        q += 0.4;

        if (this.session.cardTypeLog[1] === this.from) {
          q += 5; // if (this.session.cardTypeLog[2] === this.from) {
          //   q += 2000
          // }
        }
      }

    return q;
  }

}

Card.prototype.getQueuePosition = function () {
  return this.absoluteQueuePosition - this.session.counter;
};

Card.prototype.ticksSinceTermWasSeen = function () {
  let last_seen = null;
  this.terms.forEach(term => {
    if (this.session.lastSeenTerms[term] && (last_seen === null || last_seen > this.session.lastSeenTerms[term])) {
      last_seen = this.session.lastSeenTerms[term];
    }
  });

  if (last_seen) {
    return this.session.counter - last_seen;
  } else {
    return this.session.cards.length;
  }
};

Card.prototype.getStatus = function () {
  if (!this.lastSeen) return null;
  return this.status;
};

Card.prototype.shouldShowHint = function () {
  const lastTwoAverage = Object(app_App_functions_math__WEBPACK_IMPORTED_MODULE_0__["average"])(this.history.slice(0, 2));
  return !(this.history[0] === EASY || this.history.length >= 2 && lastTwoAverage >= GOOD);
};

/* harmony default export */ __webpack_exports__["default"] = (Card);

/***/ }),

/***/ "./src/app/Vocabulary/actions/createCards.js":
/*!***************************************************!*\
  !*** ./src/app/Vocabulary/actions/createCards.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createCards; });
/* harmony import */ var app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/time.js */ "./src/app/App/functions/time.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./card */ "./src/app/Vocabulary/actions/card.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_functions */ "./src/app/Vocabulary/actions/_functions.js");




let CARDS_TO_CREATE = 100;
/**
 * @memberof Deck
 */

function createCards(options, deck_) {
  const deck = deck_ || this;
  const now = new Date().getTime();
  const forbidden_ids = options && options.forbidden_ids || [];
  const allowed_card_ids = options && options.allowed_card_ids || null;
  /* Previously seen cards */

  let overdue_good_ids = [];
  let overdue_bad_ids = [];
  let not_overdue_bad_cards_ids = [];
  let scheduled = Object.keys(deck.schedule).filter(id => !forbidden_ids.includes(id)).filter(id => !allowed_card_ids || allowed_card_ids.includes(id)).filter(id => id in deck.cards).map(id => ({
    id,
    ...deck.schedule[id]
  })).sort((a, b) => a.due - b.due).forEach(i => {
    if (i.due < now + 0.5 * app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_0__["day"]) {
      if (i.score < _card__WEBPACK_IMPORTED_MODULE_2__["GOOD"]) {
        overdue_bad_ids.push(i.id);
      } else {
        overdue_good_ids.push(i.id);
      }
    } else if (i.score <= 1.2) {
      not_overdue_bad_cards_ids.push(i.id);
    }
  });
  /* New cards */

  let new_card_ids = [];

  for (let i = 0; i < deck.cards_sorted.length; i++) {
    const id = deck.cards_sorted[i].id;
    if (forbidden_ids.includes(id)) continue;
    if (allowed_card_ids && !allowed_card_ids.includes(id)) continue;

    if (new_card_ids.length < 50) {
      if (!(id in deck.schedule)) {
        new_card_ids.push(id);
      }
    } else {
      break;
    }
  }
  /* TODO: Not very efficient */


  overdue_good_ids = underscore__WEBPACK_IMPORTED_MODULE_1___default.a.shuffle(overdue_good_ids);
  overdue_bad_ids = underscore__WEBPACK_IMPORTED_MODULE_1___default.a.shuffle(overdue_bad_ids);
  not_overdue_bad_cards_ids = underscore__WEBPACK_IMPORTED_MODULE_1___default.a.shuffle(not_overdue_bad_cards_ids);
  let total_options = overdue_bad_ids.length + overdue_good_ids.length + not_overdue_bad_cards_ids.length + new_card_ids.length;
  let chosen_ids = [];

  for (let i = 0; chosen_ids.length < total_options; i++) {
    if (i % 9 === 0 && new_card_ids.length > 0) {
      chosen_ids.push(new_card_ids.shift());
    }

    if (i % 1 === 0 && overdue_good_ids.length > 0) {
      chosen_ids.push(overdue_good_ids.shift());
    }

    if (i % 1 === 0 && overdue_bad_ids.length > 0) {
      chosen_ids.push(overdue_bad_ids.shift());
    }

    if (i % 8 === 0 && not_overdue_bad_cards_ids.length > 0) {
      chosen_ids.push(not_overdue_bad_cards_ids.shift());
    }
  }

  chosen_ids = SortIdsByWhetherTermWasRecentlySeen(chosen_ids, deck);
  chosen_ids = chosen_ids.slice(0, CARDS_TO_CREATE);
  /* TODO: Related cards */

  /* Depends on cards */

  chosen_ids = underscore__WEBPACK_IMPORTED_MODULE_1___default.a.flatten(chosen_ids.map(id => {
    let output = [id];
    Object(_functions__WEBPACK_IMPORTED_MODULE_3__["getRelatedCardIds"])(id).filter(sibling_card_id => sibling_card_id !== id).forEach(sibling_card_id => {
      if (
      /* Not seen */
      !(sibling_card_id in deck.schedule) || deck.schedule[sibling_card_id].score < _card__WEBPACK_IMPORTED_MODULE_2__["GOOD"]) {
        output.push(sibling_card_id);
      }
    });
    /* Show Icelandic card before English */

    output = output.sort((a, b) => {
      if (a.endsWith("is")) return -1;
      return 1;
    });
    return output;
  }));

  let chosen = underscore__WEBPACK_IMPORTED_MODULE_1___default.a.uniq(chosen_ids).map(id => {
    return {
      id,
      ...deck.cards[id]
    };
  }).filter(Boolean);

  return chosen;
}

const ScoreByTimeSinceTermWasSeen = (id, deck, now) => {
  let latest = null;
  Object(_functions__WEBPACK_IMPORTED_MODULE_3__["getRelatedCardIds"])(id).forEach(sibling_card_id => {
    if (deck.schedule[sibling_card_id]) {
      if (deck.schedule[sibling_card_id].last_seen > latest) {
        latest = deck.schedule[sibling_card_id].last_seen;
      }
    }
  });
  let hoursSinceSeen = (now - latest) / app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_0__["hour"];

  if (hoursSinceSeen < 0.3) {
    return 3;
  } else if (hoursSinceSeen < 2) {
    return 2;
  } else if (hoursSinceSeen < 12) {
    return 1;
  } else {
    return 0;
  } // return hoursSinceSeen

};

const SortIdsByWhetherTermWasRecentlySeen = (input, deck) => {
  const now = new Date().getTime();
  return input.map(id => ({
    id,
    hours_since_seen_score: ScoreByTimeSinceTermWasSeen(id, deck, now)
  })).sort((a, b) => a.hours_since_seen_score - b.hours_since_seen_score).map(i => i.id);
};

/***/ }),

/***/ "./src/app/Vocabulary/actions/createSchedule.js":
/*!******************************************************!*\
  !*** ./src/app/Vocabulary/actions/createSchedule.js ***!
  \******************************************************/
/*! exports provided: createSchedule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSchedule", function() { return createSchedule; });
/* harmony import */ var app_App_functions_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/math */ "./src/app/App/functions/math.js");
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./card */ "./src/app/Vocabulary/actions/card.js");
/* harmony import */ var app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/App/functions/time.js */ "./src/app/App/functions/time.js");




/**
 * Long-term scheduling
 */

const createSchedule = () => {
  const {
    deck,
    session
  } = app_App_store__WEBPACK_IMPORTED_MODULE_1__["default"].getState().vocabulary;

  if (!session) {
    console.error("createSchedule called without an active session!");
    return;
  }

  const cards = session.cards;
  cards.forEach(card => {
    let due_in_days;
    let score;
    if (card.history.length === 0) return;

    if (card.score) {
      score = Object(app_App_functions_math__WEBPACK_IMPORTED_MODULE_0__["average"])([card.score, Object(app_App_functions_math__WEBPACK_IMPORTED_MODULE_0__["average"])(card.history)]);
    } else {
      score = Object(app_App_functions_math__WEBPACK_IMPORTED_MODULE_0__["average"])(card.history);
    }

    const anyBad = card.history.some(i => i === _card__WEBPACK_IMPORTED_MODULE_2__["BAD"]);

    if (anyBad) {
      due_in_days = 1;
    } else {
      due_in_days = (card.last_interval_in_days || 1) * score;
    }
    /* New cards */


    if (!card.sessions_seen) {
      if (score > 2.8) {
        due_in_days = 20;
      }
    } // return {
    //   id: card.id,
    //   due_in_days,
    //   score,
    // }


    deck.schedule[card.id] = {
      due: new Date().getTime() + Object(app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_3__["daysToMs"])(due_in_days),
      last_interval_in_days: due_in_days,
      score,
      last_seen: new Date().getTime(),
      sessions_seen: (deck.schedule[card.id] && deck.schedule[card.id].sessions_seen || 0) + 1
    };
  });
  deck.syncSchedule();
};

/***/ }),

/***/ "./src/app/Vocabulary/actions/deck.js":
/*!********************************************!*\
  !*** ./src/app/Vocabulary/actions/deck.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var app_App_Error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/Error */ "./src/app/App/Error/index.js");
/* harmony import */ var app_App_axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/App/axios */ "./src/app/App/axios.js");
/* harmony import */ var _createSchedule__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createSchedule */ "./src/app/Vocabulary/actions/createSchedule.js");
/* harmony import */ var app_Vocabulary_actions_session__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/Vocabulary/actions/session */ "./src/app/Vocabulary/actions/session.js");
/* harmony import */ var app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/App/functions/localStorage */ "./src/app/App/functions/localStorage.js");
/* harmony import */ var _createCards__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./createCards */ "./src/app/Vocabulary/actions/createCards.js");
/* harmony import */ var _sync__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./sync */ "./src/app/Vocabulary/actions/sync.js");
/* harmony import */ var app_Router_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/Router/actions */ "./src/app/Router/actions.js");
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./card */ "./src/app/Vocabulary/actions/card.js");
/**
 * The deck contains *all* terms
 */











class Deck {
  constructor(database, schedule, session) {
    const deck = this;
    const {
      cards,
      terms,
      alternative_ids,
      dependencies
    } = database;
    this.cards = cards;
    this.terms = terms;
    this.alternative_ids = alternative_ids;
    this.dependencies = dependencies;
    this.cards_sorted = Object.keys(cards).map(key => {
      // if(typeof cards[key] === 'function') return null;
      return cards[key];
    }).filter(Boolean).sort((a, b) => a.sort - b.sort);
    this.schedule = schedule || {};
    /* TEMPORARY */

    if (true) {
      window.addEventListener("keydown", e => {
        if (e.keyCode === 27
        /* ESC */
        ) {
            deck.sessionDone();
          }
      });
    }

    this.loadSessionFromLocalStorage();
  }

  generateSession() {
    Object(app_Vocabulary_actions_session__WEBPACK_IMPORTED_MODULE_4__["InitializeSession"])(this.createCards(), this);
  }

  sessionDone() {
    Object(_createSchedule__WEBPACK_IMPORTED_MODULE_3__["createSchedule"])();
    this.saveSession(null, true);
    Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_8__["updateURL"])(window.location.pathname);
    app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].dispatch({
      type: "LOAD_SESSION",
      content: null
    });
  }

  continueStudying() {
    Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_8__["updateURL"])("VOCABULARY_PLAY");
    this.generateSession();
  }

  saveSession(session, done) {
    if (!done) {
      let to_save = session.cards.map(({
        session,
        ...rest
      }) => rest);

      if (!to_save.some(i => i.history.length > 0)) {
        to_save = null;
      }

      Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_5__["saveInLocalStorage"])("vocabulary-session", to_save);
      Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_5__["saveInLocalStorage"])("vocabulary-session-saved-at", new Date().getTime());
    } else {
      Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_5__["saveInLocalStorage"])("vocabulary-session", null);
    }
  }

  loadSessionFromLocalStorage() {
    /* TODO: Clear after a day */
    if (Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_5__["getFromLocalStorage"])("vocabulary-session")) {
      Object(app_Vocabulary_actions_session__WEBPACK_IMPORTED_MODULE_4__["InitializeSession"])(Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_5__["getFromLocalStorage"])("vocabulary-session"), this);
    }
  }

}

Deck.prototype.createCards = _createCards__WEBPACK_IMPORTED_MODULE_6__["default"];
Deck.prototype.syncSchedule = _sync__WEBPACK_IMPORTED_MODULE_7__["syncSchedule"];
/* harmony default export */ __webpack_exports__["default"] = (Deck);

/***/ }),

/***/ "./src/app/Vocabulary/actions/init.js":
/*!********************************************!*\
  !*** ./src/app/Vocabulary/actions/init.js ***!
  \********************************************/
/*! exports provided: InitializeVocabulary */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitializeVocabulary", function() { return InitializeVocabulary; });
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var app_App_Error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/Error */ "./src/app/App/Error/index.js");
/* harmony import */ var app_App_axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/App/axios */ "./src/app/App/axios.js");
/* harmony import */ var _deck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deck */ "./src/app/Vocabulary/actions/deck.js");
/* harmony import */ var app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/App/functions/localStorage */ "./src/app/App/functions/localStorage.js");
/* harmony import */ var app_User_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/User/actions */ "./src/app/User/actions.js");
/* harmony import */ var app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/App/functions/time.js */ "./src/app/App/functions/time.js");







const InitializeVocabulary = async () => {
  const now = new Date().getTime();
  let database = Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__["getFromLocalStorage"])("vocabulary-database");
  let should_update = false;

  if (database && Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__["getFromLocalStorage"])("vocabulary-database-last-updated") < now - app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_6__["day"]) {
    // const database_last_updated = (await axios.get(`/api/vocabulary/database_last_updated`)).data
    should_update = true;
  }

  if (!database || should_update) {
    console.log("Downloading database");
    database = (await app_App_axios__WEBPACK_IMPORTED_MODULE_2__["default"].get(`/api/vocabulary/vocabulary_database.json`)).data;
    Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__["saveInLocalStorage"])("vocabulary-database", database);
    Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__["saveInLocalStorage"])("vocabulary-database-last-updated", new Date().getTime());
    Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__["saveInLocalStorage"])("vocabulary-session", null);
  }

  let schedule = Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__["getFromLocalStorage"])("vocabulary-schedule");

  if (!schedule) {
    schedule = {};

    if (Object(app_User_actions__WEBPACK_IMPORTED_MODULE_5__["getUserFromCookie"])()) {
      const r = (await app_App_axios__WEBPACK_IMPORTED_MODULE_2__["default"].post(`/api/vocabulary/schedule`)).data;
      r && r.forEach(i => {
        schedule[i.card_id] = { ...i,
          id: i.card_id
        };
      });
      Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__["saveInLocalStorage"])("vocabulary-schedule", schedule);
      Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__["saveInLocalStorage"])("vocabulary-schedule-last-updated", new Date().getTime());
    }
  }

  const deck = new _deck__WEBPACK_IMPORTED_MODULE_3__["default"](database, schedule);
  app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].dispatch({
    type: "LOAD_DECK",
    content: deck
  });
  /* For testing */

  window.deck = deck;
};

/***/ }),

/***/ "./src/app/Vocabulary/actions/session.js":
/*!***********************************************!*\
  !*** ./src/app/Vocabulary/actions/session.js ***!
  \***********************************************/
/*! exports provided: MINUTES, MAX_SECONDS_TO_COUNT_PER_ITEM, updateRemainingTime, getAdjustedPercentageDone, printTimeRemaining, getCard, checkIfCardsRemaining, createMoreCards, getStatus, loadCard, answer, InitializeSession */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MINUTES", function() { return MINUTES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_SECONDS_TO_COUNT_PER_ITEM", function() { return MAX_SECONDS_TO_COUNT_PER_ITEM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateRemainingTime", function() { return updateRemainingTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAdjustedPercentageDone", function() { return getAdjustedPercentageDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printTimeRemaining", function() { return printTimeRemaining; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCard", function() { return getCard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkIfCardsRemaining", function() { return checkIfCardsRemaining; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createMoreCards", function() { return createMoreCards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStatus", function() { return getStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadCard", function() { return loadCard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "answer", function() { return answer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InitializeSession", function() { return InitializeSession; });
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./card */ "./src/app/Vocabulary/actions/card.js");
/**
 * A single study session.
 */



const MINUTES = 5;
const MAX_SECONDS_TO_COUNT_PER_ITEM = 15;
const LOGGING = false;

class Session {
  constructor(cards, deck) {
    this.history = [];
    this.cards = {};
    this.counter = 0;
    this.lastSeenTerms = {};
    this.cardTypeLog = [];
    this.currentCard = null;
    this.cards = cards.map((card, index) => new _card__WEBPACK_IMPORTED_MODULE_2__["default"](card, index, this));
    this.deck = deck;
    this.timeStarted = new Date().getTime();
    this.totalTime = MINUTES * 60 * 1000;
    this.remainingTime = this.totalTime;
    this.lastTimestamp = new Date().getTime();
    this.checkIfCardsRemaining();
  }

  next(depth = 0) {
    this.counter++;
    this.updateRemainingTime();

    if (this.cards.length === 0) {
      console.error("No cards");
      this.createMoreCards();
      /* Prevent infinite calls */

      if (depth === 0) {
        this.next(1);
      } else {
        throw new Error("Failed to generate cards"); // TODO User-facing error?
      }

      return;
    }

    let ranked = this.cards.slice().sort((a, b) => a.getRanking() - b.getRanking());
    this.currentCard = ranked[0];
    /* Logging */

    if ((LOGGING || window.logging) && "development" === "development") {
      const deck = this.deck;
      console.log(ranked.map(i => `${i.getQueuePosition()}\t${Math.round(i.getRanking())}\t${i.from === "is" ? i.is : i.en}\t${deck.schedule[i.id] ? new Date(deck.schedule[i.id].last_seen) : ""}\t${i.history.length > 0 ? "SEEN" : "NEW"}`).join("\n"));
    }
    /* Store when this term was last seen */


    this.currentCard.terms.forEach(id => {
      this.lastSeenTerms[id] = this.counter;
    });
    this.deck.saveSession(this);
    this.checkIfCardsRemaining();
  }

}
/**
 * @extends Session
 */


const updateRemainingTime = function () {
  const newTimestamp = new Date().getTime();
  const diff = Math.min(MAX_SECONDS_TO_COUNT_PER_ITEM * 1000, newTimestamp - this.lastTimestamp);
  this.remainingTime = Math.max(0, this.remainingTime - diff);
  this.lastTimestamp = newTimestamp;

  if (this.remainingTime <= 0) {
    this.deck.sessionDone();
    this.done = true;
  }
};
/**
 * @extends Session
 */

const getAdjustedPercentageDone = function () {
  return (this.totalTime - this.remainingTime) / this.totalTime * 100;
};
/**
 * @extends Session
 */

const printTimeRemaining = function () {
  const time = Math.floor(this.remainingTime / 1000) || 1;
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${("0" + seconds).slice(-2)}`; // return `${minutes} minute${minutes===1?'':''}, ${('0'+seconds).slice(-2)} second${seconds===1?'s':''}`
};
/**
 * @extends Session
 */

const getCard = function () {
  return this.currentCard;
};
/**
 * @extends Session
 */

const checkIfCardsRemaining = function () {
  const areThereNewCardsRemaining = this.cards.some(i => i.history.length === 0);

  if (!areThereNewCardsRemaining) {
    this.createMoreCards();
  }
};
/**
 * @extends Session
 */

const createMoreCards = function () {
  const newCards = this.deck.createCards({
    forbidden_ids: this.cards.map(i => i.id)
  });
  this.cards = this.cards.concat(newCards.map((card, index) => new _card__WEBPACK_IMPORTED_MODULE_2__["default"](card, index, this)));
  console.log("New cards generated");
};
/**
 * @extends Session
 */

const getStatus = function () {
  return {
    bad: this.cards.filter(card => card.getStatus() === _card__WEBPACK_IMPORTED_MODULE_2__["BAD"]).length,
    good: this.cards.filter(card => card.getStatus() === _card__WEBPACK_IMPORTED_MODULE_2__["GOOD"]).length,
    easy: this.cards.filter(card => card.getStatus() === _card__WEBPACK_IMPORTED_MODULE_2__["EASY"]).length,
    total: this.cards.length,
    wordsTotal: underscore__WEBPACK_IMPORTED_MODULE_1___default.a.uniq(underscore__WEBPACK_IMPORTED_MODULE_1___default.a.flatten(this.cards.map(i => i.terms))).length,
    counter: this.counter
  };
};
Session.prototype.updateRemainingTime = updateRemainingTime;
Session.prototype.getAdjustedPercentageDone = getAdjustedPercentageDone;
Session.prototype.printTimeRemaining = printTimeRemaining;
Session.prototype.getCard = getCard;
Session.prototype.checkIfCardsRemaining = checkIfCardsRemaining;
Session.prototype.createMoreCards = createMoreCards;
Session.prototype.getStatus = getStatus;
const loadCard = () => {
  const session = app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].getState().vocabulary.session;
  if (!session || !session.currentCard) return console.error("no cards");
  app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].dispatch({
    type: "LOAD_CARD",
    content: { ...session.getCard(),
      counter: session.counter,
      status: session.getStatus()
    }
  });
};
const answer = rating => {
  const session = app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].getState().vocabulary.session;
  session.currentCard.rate(rating);
  session.next();

  if (!session.done) {
    loadCard();
  }
};
const InitializeSession = (input, deck) => {
  if (!deck) throw new Error("Deck misssing");

  if (Array.isArray(input)) {
    const session = new Session(input, deck);
    session.next();
    app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].dispatch({
      type: "LOAD_SESSION",
      content: session
    });
    loadCard();
  } else {// ERROR
  }
};

/***/ }),

/***/ "./src/app/Vocabulary/actions/sync.js":
/*!********************************************!*\
  !*** ./src/app/Vocabulary/actions/sync.js ***!
  \********************************************/
/*! exports provided: syncSchedule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "syncSchedule", function() { return syncSchedule; });
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var app_App_Error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/Error */ "./src/app/App/Error/index.js");
/* harmony import */ var app_App_axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/App/axios */ "./src/app/App/axios.js");
/* harmony import */ var _createSchedule__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createSchedule */ "./src/app/Vocabulary/actions/createSchedule.js");
/* harmony import */ var app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/App/functions/localStorage */ "./src/app/App/functions/localStorage.js");



 // import { InitializeSession } from 'app/Vocabulary/actions/session'


async function syncSchedule() {
  const deck = this;
  Object(app_App_functions_localStorage__WEBPACK_IMPORTED_MODULE_4__["saveInLocalStorage"])("vocabulary-schedule", deck.schedule);
  /* TODO selective sync */

  await app_App_axios__WEBPACK_IMPORTED_MODULE_2__["default"].post(`/api/vocabulary/save`, {
    schedule: deck.schedule,
    user: app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].getState().user
  });
}

/***/ }),

/***/ "./src/app/Vocabulary/reducers.js":
/*!****************************************!*\
  !*** ./src/app/Vocabulary/reducers.js ***!
  \****************************************/
/*! exports provided: vocabulary */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vocabulary", function() { return vocabulary; });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "redux");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);


const deck = (state = null, action) => {
  switch (action.type) {
    case "LOAD_DECK":
      return action.content;

    default:
      return state;
  }
};
/*
  - started_at
  - data
*/


const session = (state = null, action) => {
  switch (action.type) {
    case "LOAD_SESSION":
      return action.content;

    case "SCREEN_DONE":
      return null;

    default:
      return state;
  }
};

const card = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_CARD":
      return { ...action.content,
        answered: false
      };

    case "ANSWER_CARD":
      return { ...state,
        answered: true
      };

    default:
      return state;
  }
};

const status = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_CARD":
      return action.content.status || state;
    // return flattenData(action.data)

    default:
      return state;
  }
};

const screen = (state = {}, action) => {
  switch (action.type) {
    case "VOCABULARY_SCREEN":
      return action.content || state;
    // return flattenData(action.data)

    default:
      return state;
  }
};

const vocabulary = Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])({
  deck,
  session,
  card,
  status,
  screen
});

/***/ }),

/***/ "./src/app/Vocabulary/screens/overview.js":
/*!************************************************!*\
  !*** ./src/app/Vocabulary/screens/overview.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_Vocabulary_Elements_GameContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/Vocabulary/Elements/GameContainer */ "./src/app/Vocabulary/Elements/GameContainer.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var app_Vocabulary_actions_session__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/Vocabulary/actions/session */ "./src/app/Vocabulary/actions/session.js");
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");







class Overview extends react__WEBPACK_IMPORTED_MODULE_1__["Component"] {
  render() {
    const {
      status,
      session
    } = this.props.vocabulary;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h1", null, "Vocabulary"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_5__["default"], {
      href: "VOCABULARY_PLAY"
    }, session ? "Continue" : "Start"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Overview2, null));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(state => ({
  vocabulary: state.vocabulary
}))(Overview));

class Overview3 extends react__WEBPACK_IMPORTED_MODULE_1__["Component"] {
  render() {
    const {
      deck
    } = this.props.vocabulary;
    if (!deck) return null;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, Object.keys(deck.schedule).length, " seen out of total", " ", Object.keys(deck.cards).length, " cards");
  }

}

const Overview2 = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(state => ({
  vocabulary: state.vocabulary
}))(Overview3);

/***/ }),

/***/ "./src/app/Vocabulary/screens/running.js":
/*!***********************************************!*\
  !*** ./src/app/Vocabulary/screens/running.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_Vocabulary_Elements_GameContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/Vocabulary/Elements/GameContainer */ "./src/app/Vocabulary/Elements/GameContainer.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var app_Vocabulary_actions_session__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/Vocabulary/actions/session */ "./src/app/Vocabulary/actions/session.js");
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");
/* harmony import */ var app_Router_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/Router/actions */ "./src/app/Router/actions.js");







/* harmony default export */ __webpack_exports__["default"] = (() => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
  id: "vocabulary"
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("button", {
  onClick: () => {
    if (app_App_store__WEBPACK_IMPORTED_MODULE_3__["default"].getState().route.pathname !== window.location.pathname) {
      Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_6__["updateURL"])(window.location.pathname);
    } else {
      Object(app_Router_actions__WEBPACK_IMPORTED_MODULE_6__["updateURL"])("VOCABULARY_PLAY");
    }
  }
}, "Exit"), " • ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_5__["default"], {
  href: "/vocabulary/tutorial"
}, "Tutorial")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(app_Vocabulary_Elements_GameContainer__WEBPACK_IMPORTED_MODULE_0__["default"], null)));

/***/ }),

/***/ "./src/app/Vocabulary/screens/setup.js":
/*!*********************************************!*\
  !*** ./src/app/Vocabulary/screens/setup.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");




const Screen = props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Are you a beginner?", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", null, "Yes, I'm a beginner"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", null, "No, I already speak some Icelandic")), !props.user && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_2__["default"], {
  href: "LOG_IN"
}, "Already have an account?"));

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(state => ({
  user: state.user
}))(Screen));

/***/ }),

/***/ "./src/documents/Compile/images.js":
/*!*****************************************!*\
  !*** ./src/documents/Compile/images.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var paths_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! paths.js */ "./src/paths.js");
/* harmony import */ var server_content__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! server/content */ "./src/server/content/index.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _transclude__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./transclude */ "./src/documents/Compile/transclude.js");






let links = __webpack_require__(/*! src/output/links.js */ "./src/output/links.js");

__webpack_require__(/*! app/App/functions/array-foreach-async */ "./src/app/App/functions/array-foreach-async.js");

var fs = __webpack_require__(/*! fs */ "fs");

const {
  exec
} = __webpack_require__(/*! child_process */ "child_process");

const Images = data => {
  return new Promise(async (resolve, reject) => {
    let input = [];
    let output = [];
    let r = /<Image (.+)?\/>/g;
    /* Collect params */

    data = data.replace(r, params => {
      input.push(params);
      return params;
    });
    /* Run */

    await input.forEachAsync(async (z, index) => {
      await new Promise(async (resolve2, reject2) => {
        let [o, filename_, rest] = z.match(/src="(.+?)"(.+)?\/>/); // console.log(rest)

        if (!(Object(paths_js__WEBPACK_IMPORTED_MODULE_0__["URL_title"])("File:" + filename_) in links)) {
          throw new Error("No file named: " + filename_ + ". Is it from Commons?");
          reject2();
          return;
        }

        const file = links[Object(paths_js__WEBPACK_IMPORTED_MODULE_0__["URL_title"])("File:" + filename_)].file.replace(/\.md$/, "");
        const filename = links[Object(paths_js__WEBPACK_IMPORTED_MODULE_0__["URL_title"])("File:" + filename_)].filename;
        const [k, name, ending] = filename.match(/(.+)\.(.+?)$/);
        exec(`identify ${file}`, async (error, stdout, stderr) => {
          if (error) return console.error(`exec error: ${error}`);
          const [j, original_width, original_height] = stdout.match(/^[^ ]+ [^ ]+ ([0-9]+)x([0-9]+)/);
          let string_sizes = [];
          let boxes = [800, 600, 400, 200].map(i => {
            // i = Math.max
            if (original_width > original_height) {
              return [i, Math.round(i * original_height / original_width), i * 2, Math.round(i * 2 * original_height / original_width)];
            } else {
              return [Math.round(i * original_width / original_height), i, Math.round(i * 2 * original_width / original_height), i * 2];
            }
          });
          boxes.forEach(i => {
            string_sizes.push(`${i[0]}x${i[1]}`);
            string_sizes.push(`${i[2]}x${i[3]}`);
          });
          string_sizes = underscore__WEBPACK_IMPORTED_MODULE_2___default.a.uniq(string_sizes); // ${rest}

          let params = {};
          rest && rest.replace(/([a-z]+)="(.+?)"/g, (v, key, val) => {
            params[key] = val;
          });
          let transcluded = (await Object(_transclude__WEBPACK_IMPORTED_MODULE_3__["default"])("File:" + filename_)).output;
          const big_to_small = [...boxes];
          const small_to_big = [...boxes].reverse();
          output.push(`<Image position="${params.position || ""}">
            <div class="image-and-metadata">
              <picture>
                ${small_to_big.map((i, index) => `
                  <source
                    ${i[0] !== 800 ? `media="(max-width: ${i[0]}px)"` : ""}
                    srcset="
                      ${paths_js__WEBPACK_IMPORTED_MODULE_0__["processed_image_url"]}/${name}-${i[0]}x${i[1]}.${ending} 1x,
                      ${paths_js__WEBPACK_IMPORTED_MODULE_0__["processed_image_url"]}/${name}-${i[2]}x${i[3]}.${ending} 2x"
                  />
                `).join("")}
                <img
                  src="${paths_js__WEBPACK_IMPORTED_MODULE_0__["processed_image_url"]}/${name}-${big_to_small[0][0]}x${big_to_small[0][1]}.${ending}"
                  width="${original_width}"
                  height="${original_height}"
                />
              </picture>
              ${transcluded ? `<div class="metadata">${transcluded}</div>` : ""}
            </div>
            ${params.caption ? `<div class="caption">${params.caption}</div>` : ""}
          </Image>
          `.replace(/^ +/gm, "").replace(/\n/g, " "));
          fs.stat(`${paths_js__WEBPACK_IMPORTED_MODULE_0__["image_output_folder"]}/${name}-${boxes[0][2]}x${boxes[0][3]}.${ending}`, function (err, stat) {
            if (err == null) {
              // File exists
              return resolve2();
            } else if (err.code === "ENOENT") {
              // File does not exist
              exec(string_sizes.map(size => `
                  convert ${file} -resize ${size} -quality 80 ${paths_js__WEBPACK_IMPORTED_MODULE_0__["image_output_folder"]}/${name}-${size}.${ending}
                `).join(""), (error2, stdout2, stderr2) => {
                if (error2) return console.error(`exec error: ${error2}`);
                return resolve2();
              });
            } else {
              console.log(err.code);
              reject2();
            }
          });
        });
      });
    }); // console.log(output)

    /* Insert */

    let u = 0;
    data = data.replace(r, params => {
      // input.push(params)
      // return `<Image src="/api/images/${output[u++]}"/>`
      return output[u++];
    });
    resolve(data);
  });
};

/* harmony default export */ __webpack_exports__["default"] = (Images);

/***/ }),

/***/ "./src/documents/Compile/index.js":
/*!****************************************!*\
  !*** ./src/documents/Compile/index.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _markdown_to_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./markdown_to_html */ "./src/documents/Compile/markdown_to_html.js");
/* harmony import */ var _transclude__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transclude */ "./src/documents/Compile/transclude.js");
/* harmony import */ var _images__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./images */ "./src/documents/Compile/images.js");




var tidy = __webpack_require__(/*! htmltidy2 */ "htmltidy2").tidy;

/* harmony default export */ __webpack_exports__["default"] = (async title => {
  // console.log(title)
  let {
    output,
    header
  } = await Object(_transclude__WEBPACK_IMPORTED_MODULE_1__["default"])(title); // console.log(output)

  if (!output) {
    throw new Error("No output from transclude, possibly files have been changed since last link compilation ");
  } // await new Promise((resolve) => {
  //   tidy(output, function (err, html) {
  //     output = html
  //     console.log(html)
  //     resolve()
  //   });
  // })


  output = await Object(_images__WEBPACK_IMPORTED_MODULE_2__["default"])(output);
  output = Object(_markdown_to_html__WEBPACK_IMPORTED_MODULE_0__["default"])(output); // console.log(output)

  return {
    content: output,
    header
  };
}); // new Promise((resolve, reject) => {

/***/ }),

/***/ "./src/documents/Compile/markdown_to_html.js":
/*!***************************************************!*\
  !*** ./src/documents/Compile/markdown_to_html.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var typeset__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typeset */ "typeset");
/* harmony import */ var typeset__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typeset__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var paths_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! paths.js */ "./src/paths.js");
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! marked */ "marked");
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(marked__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var app_App_functions_RemoveUnwantedCharacters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/App/functions/RemoveUnwantedCharacters */ "./src/app/App/functions/RemoveUnwantedCharacters.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/App/functions/html2json */ "./src/app/App/functions/html2json/index.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_4__);






let links = __webpack_require__(/*! src/output/links.js */ "./src/output/links.js");
/**
 * Here we convert markdown textblocks to HTML.
 * Each HTML element in the original text is processed seperately to preserve HTML structure.
 */


/* harmony default export */ __webpack_exports__["default"] = (input => {
  input = Object(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_4__["json2html"])(Traverse(Object(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_4__["html2json"])(input)));
  input = typeset__WEBPACK_IMPORTED_MODULE_0___default()(input, {
    disable: ["hyphenate", "hangingPunctuation", "ligatures", "smallCaps"]
  });
  return input;
});

const Traverse = json => {
  if (!json) return null;
  const {
    node,
    tag,
    attr,
    child,
    text
  } = json;

  if (node === "element" || node === "root") {
    return { ...json,
      child: child && ProcessArray(child)
    };
  } else if (node === "text") {
    /* TODO Is this necessary? */
    return { ...json,
      text: processText(text)
    };
  }
};
/**
 * Converts markdown text to HTML.
 * Elements are temporarily substituted, the text is processed,
 * and then the elements are re-inserted.
 */


const ProcessArray = arr => {
  const substituted = arr.map((j, i) => {
    if (j.node === "text") {
      return j.text;
    }

    return `SUBSTITUTION${i}`;
  }).join("");
  return processText(substituted).split(/(SUBSTITUTION[0-9]+)/g).map((j, i) => {
    if (j.startsWith("SUBSTITUTION")) {
      const x = j.match(/SUBSTITUTION([0-9]+)/)[1];
      const element = arr[parseInt(x)];
      return Traverse(element);
    }

    return {
      node: "text",
      text: j
    };
  });
};

const processText = input => {
  input = Object(app_App_functions_RemoveUnwantedCharacters__WEBPACK_IMPORTED_MODULE_3__["default"])(input)
  /* Internal links */
  .replace(/\[\[(.+?)\]\]/g, (x, match) => {
    let [link, target] = match.split("|");
    link = link.trim();
    target = (target || link).trim();

    if (/^:?w:/i.test(link)) {
      link = `http://en.wikipedia.org/wiki/${encodeURIComponent(link.replace(/^w:/i, ""))}`;
    } else {
      link = Object(paths_js__WEBPACK_IMPORTED_MODULE_1__["URL_title"])(link);

      if (!(link in links)) {
        return target;
      }

      if (links[link].redirect_to) {
        link = links[link].redirect_to + (links[link].section ? "#" + links[link].section : "");
      }

      link = "/" + link;
    }

    return `<a href="${encodeURI(link)}">${target}</a>`;
  })
  /* External links */
  .replace(/\[((?:http|mailto)[^ ]+?) (.+?)\]/g, (x, url, text) => {
    return `<a href="${url}">${text}</a>`;
  }).replace(/\[((?:http|mailto)[^ ]+?)\]/g, (x, url) => {
    return `[<a href="${url}">link</a>]`;
  }).replace(/^\*\*\*\n/gm, "\n<hr/>\n")
  /* Lists */
  .replace(/^(\*+) ?/gm, (x, bullets) => {
    return `${"  ".repeat(bullets.length - 1)}- `;
  }) // .replace(/^(#+) ?/gm, (x, bullets) => {
  //   return `${'  '.repeat(bullets.length-1)}1. `
  // })

  /* Headings */
  .replace(/^(=+) ?(.+)\1/gm, (x, equals, title) => {
    return `${"#".repeat(equals.length)} ${title}`; // return `<h${equals.length} id="${section_id(title)}">${title}</h${equals.length}>`
  })
  /* Bold */
  .replace(/'''/g, "**").replace(/''/g, "*")
  /* Tags */
  .replace(/<([^> ]+)( [^>]+)?\/>/g, "<$1$2></$1>"); // /* Remove? */
  // .replace(/<\/Image>\n\n/g, '</Image>\n')

  /* References */
  // input = input.split(/<ref[> ][\s\S]+<\/ref>/g)
  // console.log(input.slice(0, 200))

  /* Markdown */

  if (!input.trim()) return input;
  const [f, pre, middle, post] = input.match(/^([\s]+)?([\s\S]+)( +)?$/);
  let m = marked__WEBPACK_IMPORTED_MODULE_2___default()(middle);

  if (!/\n\n/.test(middle)) {
    m = m.replace(/<p>(.+)<\/p>/, "$1");
  }

  input = (pre || "") + m + (post || "");
  input = input.replace(/(<h[0-9] id=")/g, "$1s-"); // console.log(input.slice(0,200))
  // console.log(input)

  return input;
};

/***/ }),

/***/ "./src/documents/Compile/transclude.js":
/*!*********************************************!*\
  !*** ./src/documents/Compile/transclude.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var paths_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! paths.js */ "./src/paths.js");
/* harmony import */ var server_content__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! server/content */ "./src/server/content/index.js");



let links = __webpack_require__(/*! src/output/links.js */ "./src/output/links.js");

__webpack_require__(/*! app/App/functions/array-foreach-async */ "./src/app/App/functions/array-foreach-async.js");

var fs = __webpack_require__(/*! fs */ "fs");

var btoa = __webpack_require__(/*! btoa */ "btoa");

const Transclude = (title, depth = 0, shouldGetData = true) => {
  return new Promise((resolve, reject) => {
    let url = Object(paths_js__WEBPACK_IMPORTED_MODULE_0__["URL_title"])("Template:" + title);

    if (!(url in links)) {
      url = Object(paths_js__WEBPACK_IMPORTED_MODULE_0__["URL_title"])(title);

      if (!(url in links)) {
        return resolve(`\nNo template named "${title}"\n`);
      }
    }

    fs.readFile(links[url].file, "utf8", async (err, data) => {
      if (err) {
        console.log(err);
        return resolve(`\nFailed to read file for ${title}\n`);
      }

      let {
        header,
        body
      } = Object(server_content__WEBPACK_IMPORTED_MODULE_1__["ParseHeaderAndBody"])(data);
      let output = body;
      /* Strip comments */

      output = output.replace(/<!--([\s\S]+?)-->\n?/g, ""); // TODO

      if (depth < 1) {
        output = "";
        await body.split(/{{([^{}]+)}}/g).forEachAsync(async (q, index) => {
          await new Promise(async (resolve2, reject2) => {
            if (index % 2 === 0) {
              output += q;
              return resolve2();
            }
            /* TODO: Find better syntax to get header info */


            if (/(>>>)/.test(q)) {
              const [title_, param_] = q.split(">>>");
              const transclusion = await Transclude(title_, depth + 1);
              output += btoa(JSON.stringify(transclusion.header[param_]));
              /* TODO encodeURIComponent instead */
              // .replace(/"/g,'\\"')
            } else {
              const transclusion = await Transclude(q, depth + 1);
              output += transclusion.output || "";
            }

            return resolve2();
          });
        });
      }

      if (shouldGetData) {
        const data2 = await getData(header);
        output = `<span data-document-start="${(data2 || header).title}" data-data="${data2 ? btoa(encodeURIComponent(data2.output)) : ""}"></span>\n` + output + `<span data-document-end="${(data2 || header).title}"></span>`;
      }

      resolve({
        output,
        header
      });
    });
  });
};

const getData = async header => {
  const data_title = [header.title, ...(header.redirects || [])].find(t => Object(paths_js__WEBPACK_IMPORTED_MODULE_0__["URL_title"])("Data:" + t) in links);
  if (!data_title) return;
  const output = (await Transclude("Data:" + data_title, 0, false)).output; // console.log(output.slice(0, 100))
  // return;

  return {
    output: JSON.stringify(JSON.parse(output)),
    title: data_title
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Transclude);

/***/ }),

/***/ "./src/documents/Parse/Compiler/1_Precompile/MergePunctuation.js":
/*!***********************************************************************!*\
  !*** ./src/documents/Parse/Compiler/1_Precompile/MergePunctuation.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*
  Step 1:
  Merge phrases into a single word
*/
let translation;
let removedIDs;

const init = (tree, _translation) => {
  translation = _translation;
  removedIDs = [];
  return Traverse(tree);
};

const Traverse = (input, siblings = []) => {
  if (!input) return input;
  const {
    node,
    tag,
    attr,
    child,
    text
  } = input;
  const id = attr && attr.id || null;

  if (node === "element" || node === "root") {
    if (tag === "word") {
      if (removedIDs.includes(id)) return null;
      const definition = translation.definitions[translation.words[id]];
      return { ...input,
        attr: { ...input.attr,
          definition,
          appendText: findTextSiblings(siblings, id)
        }
      };
    } else {
      return { ...input,
        child: child && child.map(e => Traverse(e, child))
      };
    }
  } else if (node === "text") {
    if (removedIDs.includes(id)) return null;
    return input;
  }

  return input;
};

const findTextSiblings = (siblings, startId) => {
  let listening = false;
  let returnString = "";
  siblings.forEach((element, index) => {
    if (!element) return;
    if (removedIDs.includes(element.attr.id)) return;

    if (element.attr.id === startId) {
      listening = true;
    } else if (listening) {
      if (element.node === "text" && !element.text.startsWith(" ")) {
        returnString += element.text;
        removedIDs.push(element.attr.id);
      } else {
        listening = false;
      }
    }
  });
  return returnString;
};

/* harmony default export */ __webpack_exports__["default"] = (init);

/***/ }),

/***/ "./src/documents/Parse/Compiler/1_Precompile/MergeWords.js":
/*!*****************************************************************!*\
  !*** ./src/documents/Parse/Compiler/1_Precompile/MergeWords.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var documents_Parse_Compiler_1_Precompile_UpdateID__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Parse/Compiler/1_Precompile/UpdateID */ "./src/documents/Parse/Compiler/1_Precompile/UpdateID.js");

/*
  Step 1:
  Merge phrases into a single word
*/

let translation;
let removedIDs;

const init = (tree, _translation) => {
  translation = _translation;
  removedIDs = [];
  return Traverse(tree);
};

const Traverse = (input, siblings = []) => {
  if (!input) return input;
  const {
    node,
    tag,
    attr,
    child,
    text
  } = input;
  const id = attr && attr.id || null;

  if (node === "element" || node === "root") {
    if (tag === "word") {
      if (removedIDs.includes(id)) return null;
      const definition = translation.definitions[translation.words[id]]; // console.log(translation.words[id])
      // console.log(translation.definitions['175uoye'])
      // console.log(definition)

      let addSiblings = [];

      if (definition && definition.contains.length > 1) {
        addSiblings = readSiblings(siblings, id, definition.contains);
      }

      return { ...input,
        attr: { ...input.attr,
          definition
        },
        child: [...(child && child.map(e => Traverse(e, child)) || []), ...addSiblings]
      };
    } else if (tag === "sentence") {
      return { ...input,
        attr: { ...input.attr,
          definition: translation.sentences[attr.id]
        },
        child: child && child.map(e => Traverse(e, child))
      };
    } else {
      return { ...input,
        child: child && child.map(e => Traverse(e, child))
      };
    }
  } else if (node === "text") {
    if (removedIDs.includes(id)) return null;
    return input;
  }

  return input;
};
/*
  Loops over next siblings, checks if they belong to the same definition, and merges them
*/


const readSiblings = (siblings, startId, wordGroupContents) => {
  let listening = false;
  let returns = [];
  /*
    When looping over spaces and punctuation,
    we temporarily store them here until we
    know if they should be added
  */

  let maybeReturn = [];
  let maybeRemove = [];
  siblings.forEach((element, index) => {
    if (removedIDs.includes(element.attr.id)) return;

    if (element.attr.id === startId) {
      listening = true; // returns = []
    } else if (listening) {
      // console.log(element)
      if (element.tag === "word") {
        if (wordGroupContents.includes(element.attr.id)) {
          returns = [...returns, ...maybeReturn, ...element.child];
          removedIDs.push(element.attr.id);
          removedIDs = removedIDs.concat(maybeRemove);
          maybeReturn = [];
          maybeRemove = [];
          /*
            Used by Audio Synchronization to update its ids
            (since the merged IDs have been lost)
          */

          Object(documents_Parse_Compiler_1_Precompile_UpdateID__WEBPACK_IMPORTED_MODULE_0__["updateID"])(element.attr.id, startId);
        } else {
          listening = false;
        }
      } else if (element.node === "text") {
        maybeReturn.push(element);
        maybeRemove.push(element.attr.id);
      }
    }
  });
  return returns;
};

/* harmony default export */ __webpack_exports__["default"] = (init);

/***/ }),

/***/ "./src/documents/Parse/Compiler/1_Precompile/NiceIDs.js":
/*!**************************************************************!*\
  !*** ./src/documents/Parse/Compiler/1_Precompile/NiceIDs.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return init; });
/* harmony import */ var documents_Parse_Compiler_1_Precompile_UpdateID__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Parse/Compiler/1_Precompile/UpdateID */ "./src/documents/Parse/Compiler/1_Precompile/UpdateID.js");

/*

  The IDs were long random strings, but are here converted into:
  "[documentID]_[serial]"

  TODO!!!
  "DEFINITION.CONTAINS" must also be updated!

*/

let serial;
let document_id;
function init(input, id) {
  document_id = id;
  serial = 0;
  input = NiceIDs(input);
  input = UpdateReferencedIDs(input);
  return input;
}

const NiceIDs = input => {
  if (!input) return input;
  const {
    node,
    tag,
    attr,
    child,
    text
  } = input;
  const id = attr && attr.id || null;

  if (tag === "sentence" || tag === "word") {
    return { ...input,
      child: child && child.map(e => NiceIDs(e)),
      attr: { ...attr,
        id: id && Object(documents_Parse_Compiler_1_Precompile_UpdateID__WEBPACK_IMPORTED_MODULE_0__["updateID"])(id, `${document_id}_${serial++}`)
      }
    };
  }

  return { ...input,
    child: child && child.map(e => NiceIDs(e))
  };
};
/*
  Here we update the IDs in "definition.contains"
*/


const UpdateReferencedIDs = (input, idsToOutput) => {
  if (!input) return input;
  const {
    node,
    tag,
    attr,
    child,
    text
  } = input;
  const id = attr && attr.id || null;
  const definition = attr && attr.definition || null;

  if (tag === "sentence" || tag === "word") {
    return { ...input,
      child: child && child.map(e => UpdateReferencedIDs(e, idsToOutput)),
      attr: { ...attr,
        definition: definition && { ...definition,
          contains: definition.contains && definition.contains.map(documents_Parse_Compiler_1_Precompile_UpdateID__WEBPACK_IMPORTED_MODULE_0__["getUpdatedID"])
        }
      }
    };
  }

  return { ...input,
    child: child && child.map(e => UpdateReferencedIDs(e, idsToOutput))
  };
};

/***/ }),

/***/ "./src/documents/Parse/Compiler/1_Precompile/TempIDs.js":
/*!**************************************************************!*\
  !*** ./src/documents/Parse/Compiler/1_Precompile/TempIDs.js ***!
  \**************************************************************/
/*! exports provided: TempIDs, RemoveTempIDs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TempIDs", function() { return TempIDs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RemoveTempIDs", function() { return RemoveTempIDs; });
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! shortid */ "shortid");
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(shortid__WEBPACK_IMPORTED_MODULE_0__);

const seed = shortid__WEBPACK_IMPORTED_MODULE_0___default.a.generate();
let i = 0;
const TempIDs = input => {
  if (!input) return input;
  const {
    node,
    tag,
    attr,
    child,
    text
  } = input;
  const id = attr && attr.id || null;
  return { ...input,
    child: child && child.map(e => TempIDs(e)),
    attr: { ...attr,
      id: id || `temp__${seed}${i++}`
    }
  };
};
const RemoveTempIDs = input => {
  if (!input) return input;
  const {
    node,
    tag,
    attr,
    child,
    text
  } = input;
  let id = attr && attr.id || "";

  if (id.match(/^temp__/)) {
    id = null;
  }

  return { ...input,
    child: child && child.map(e => RemoveTempIDs(e)),
    attr: { ...attr,
      id
    }
  };
};

/***/ }),

/***/ "./src/documents/Parse/Compiler/1_Precompile/UpdateID.js":
/*!***************************************************************!*\
  !*** ./src/documents/Parse/Compiler/1_Precompile/UpdateID.js ***!
  \***************************************************************/
/*! exports provided: updateID, getUpdatedID, getPreviousID, reset */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateID", function() { return updateID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUpdatedID", function() { return getUpdatedID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPreviousID", function() { return getPreviousID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reset", function() { return reset; });
/*
  Keeps track of updated IDs.
  Is used to update the Audio Synchronization map.
*/
let updatedIDs = {};
let previousIDs = {};
const updateID = (from, to) => {
  updatedIDs[from] = to;
  previousIDs[to] = from;
  return to;
}; // Recursive lookup

const getUpdatedID = (id, depth = 0) => {
  if (updatedIDs[id] && depth < 10) {
    return getUpdatedID(updatedIDs[id], depth + 1);
  }

  return id;
};
const getPreviousID = id => {
  return previousIDs[id];
};
const reset = () => {
  updatedIDs = {};
};

/***/ }),

/***/ "./src/documents/Parse/Compiler/1_Precompile/index.js":
/*!************************************************************!*\
  !*** ./src/documents/Parse/Compiler/1_Precompile/index.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MergeWords__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MergeWords */ "./src/documents/Parse/Compiler/1_Precompile/MergeWords.js");
/* harmony import */ var _MergePunctuation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MergePunctuation */ "./src/documents/Parse/Compiler/1_Precompile/MergePunctuation.js");
/* harmony import */ var _NiceIDs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NiceIDs */ "./src/documents/Parse/Compiler/1_Precompile/NiceIDs.js");
/* harmony import */ var _TempIDs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TempIDs */ "./src/documents/Parse/Compiler/1_Precompile/TempIDs.js");



 // import PronunciationAndSound from './PronunciationAndSound'
// import WrapInTags from 'Editor/2-Parse/2.3-WrapInTags'

const Compile = ({
  json,
  data
}) => {
  let output = json;
  output = Object(_TempIDs__WEBPACK_IMPORTED_MODULE_3__["TempIDs"])(output);
  output = Object(_MergeWords__WEBPACK_IMPORTED_MODULE_0__["default"])(output, data.translation);
  output = Object(_MergePunctuation__WEBPACK_IMPORTED_MODULE_1__["default"])(output, data.translation);
  output = Object(_TempIDs__WEBPACK_IMPORTED_MODULE_3__["RemoveTempIDs"])(output); // output = NiceIDs(output, data.id)
  // console.log(output)
  // console.log(JSON.stringify(output, null, 2))

  return output;
};

/* harmony default export */ __webpack_exports__["default"] = (Compile);

/***/ }),

/***/ "./src/documents/Parse/Compiler/index.js":
/*!***********************************************!*\
  !*** ./src/documents/Parse/Compiler/index.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _1_Precompile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./1_Precompile */ "./src/documents/Parse/Compiler/1_Precompile/index.js");
/* harmony import */ var _1_Precompile_UpdateID__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./1_Precompile/UpdateID */ "./src/documents/Parse/Compiler/1_Precompile/UpdateID.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/App/functions/html2json */ "./src/app/App/functions/html2json/index.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! html-entities */ "html-entities");
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(html_entities__WEBPACK_IMPORTED_MODULE_3__);
 // import CompileToHTML from './2_CompileToHTML'




const entities = new html_entities__WEBPACK_IMPORTED_MODULE_3__["AllHtmlEntities"]();

const TextCompiler = ({
  json,
  data
}) => {
  Object(_1_Precompile_UpdateID__WEBPACK_IMPORTED_MODULE_1__["reset"])(); // TEMP

  let output; // console.log(json2html(json))

  output = data ? Object(_1_Precompile__WEBPACK_IMPORTED_MODULE_0__["default"])({
    json,
    data
  }) : json; // console.log((data))
  // output = CompileToHTML({ json: output, data })
  // console.log((output))
  // output = entities.decode(output)

  return output;
};

/* harmony default export */ __webpack_exports__["default"] = (TextCompiler);

/***/ }),

/***/ "./src/documents/Parse/ExtractText/ExtractText.js":
/*!********************************************************!*\
  !*** ./src/documents/Parse/ExtractText/ExtractText.js ***!
  \********************************************************/
/*! exports provided: default, getText */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getText", function() { return getText; });
/* harmony import */ var _Paragraphs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Paragraphs */ "./src/documents/Parse/ExtractText/Paragraphs.js");
/* harmony import */ var app_App_functions_hash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/functions/hash */ "./src/app/App/functions/hash.js");
/* harmony import */ var emoji_strip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! emoji-strip */ "emoji-strip");
/* harmony import */ var emoji_strip__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(emoji_strip__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var documents_Parse_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! documents/Parse/index.js */ "./src/documents/Parse/index.js");
/*
   ____                    _            _
  |  _ \ __ ___      __   | |_ _____  _| |_
  | |_) / _` \ \ /\ / /   | __/ _ \ \/ / __|
  |  _ < (_| |\ V  V /    | ||  __/>  <| |_
  |_| \_\__,_| \_/\_/      \__\___/_/\_\\__|

  1. Parses input
  2. Splits into paragraphs
  3. Gets raw text
  4. Returns a list of paragraphs (text & hash)

*/




/*
  Convert document into raw text
*/

/* harmony default export */ __webpack_exports__["default"] = (function (json
/*onlyRetrieveEntireDocuments*/
) {
  let paragraphs = [];
  let index = 0;
  Object(_Paragraphs__WEBPACK_IMPORTED_MODULE_0__["default"])({
    input: json,
    getNewTitle: new documents_Parse_index_js__WEBPACK_IMPORTED_MODULE_3__["newTitle"](),
    paragraphFunction: (paragraph, documentTitle) => {
      const text = getText(paragraph, true, true); // console.log(text)
      // console.log(documentTitle)

      if (documentTitle === undefined) {
        /* TODO!! */
        console.log(`Missing {{start}} for document which includes the text ${text}`);
        return;
      }

      if (text) {
        paragraphs.push({
          index: index++,
          documentTitle: documentTitle || "untitled",
          hash: Object(app_App_functions_hash__WEBPACK_IMPORTED_MODULE_1__["default"])(text),
          text: text
        }); // console.log(index)
      }
    } // onlyRetrieveEntireDocuments

  });
  let documents = {};
  paragraphs.forEach(({
    documentTitle,
    ...paragraph
  }) => {
    if (!documents[documentTitle]) {
      documents[documentTitle] = [];
    }

    documents[documentTitle].push(paragraph);
  });
  return documents;
});
/*
  Turns a JSON representation of HTML into raw text
*/

const getText = (data, clean = false, trim = false) => {
  // console.log(data)
  const getTextFromJson = input => {
    if (typeof input === "string") {
      return input;
    }

    if (input.node === "text") {
      return input.text;
    }

    if (input.child) {
      return input.child.map(i => {
        if (shouldIgnore(i)) return " ";
        return getTextFromJson(i);
      }).join("");
    }

    if (Array.isArray(input)) {
      return input.map(i => {
        if (shouldIgnore(i)) return " ";
        return getTextFromJson(i);
      }).join("");
    }

    return "";
  };

  const cleanText = input => {
    return input.replace(IgnoredCharacters, "").replace(/[\s]+/gm, " ");
  };

  let returns = getTextFromJson(data);

  if (clean) {
    returns = emoji_strip__WEBPACK_IMPORTED_MODULE_2___default()(cleanText(returns));
  }

  if (trim) {
    returns = returns.replace(/{+.+?}+/g, "") // Removes text in brackets, like "{kvk}"
    .replace(/[\s]+/gm, " ").trim();
  }

  return returns;
};
/*
  1. soft hyphen
*/

const IgnoredCharacters = /\u00AD/g;

const shouldIgnore = i => {
  if (i.tag === "sup") return true;
  return i.attr && (i.attr["data-not-text"] || i.attr["data-children"]);
};

/***/ }),

/***/ "./src/documents/Parse/ExtractText/Paragraphs.js":
/*!*******************************************************!*\
  !*** ./src/documents/Parse/ExtractText/Paragraphs.js ***!
  \*******************************************************/
/*! exports provided: shouldTranslate_, isInlineElement, shouldSkip, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shouldTranslate_", function() { return shouldTranslate_; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isInlineElement", function() { return isInlineElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shouldSkip", function() { return shouldSkip; });
/*
  ____                                       _
 |  _ \ __ _ _ __ __ _  __ _ _ __ __ _ _ __ | |__  ___
 | |_) / _` | '__/ _` |/ _` | '__/ _` | '_ \| '_ \/ __|
 |  __/ (_| | | | (_| | (_| | | | (_| | |_) | | | \__ \
 |_|   \__,_|_|  \__,_|\__, |_|  \__,_| .__/|_| |_|___/
                       |___/          |_|

- Groups paragraphs together
- Then sends these grouped paragraphs to the inputted "paragraphFunction".
- Returns a JSON tree of the entire document.

*/
__webpack_require__(/*! array-sugar */ "array-sugar");

let documents = [];
/*
  - Finds paragraphs of text.
  - Groups sequences of text and inline elements together.
  - This allows us to split sentences without giving a thought about how HTML tags affect it.
  - Block elements make us switch to a new paragraph.
*/

const GroupParagraphs = ({
  input,
  paragraphFunction,
  isTranslating,
  getNewTitle
}) => {
  // console.log(JSON.stringify(input))
  if (!input || shouldSkip(input)) return input;

  if (input.child) {
    /*
      Look for inline elements & text.
      We group together inline elements before splitting into
      sentences so that "Blah <i>blah</i> blah." will be assesed together.
    */
    let returns = [];
    let group = [];

    for (let i = 0; i < input.child.length; i++) {
      let isNewDocument = false;
      const element = input.child[i];

      if (shouldSkip(element)) {
        returns.push(element);
        continue;
      }

      const shouldTranslate = shouldTranslate_(element, isTranslating);

      if (element.attr) {
        if (element.attr["data-document-start"]) {
          // console.error('HAHHAAHA'+element.attr['data-document-start'])
          documents.push(getNewTitle.get(element.attr["data-document-start"]));
          isNewDocument = true;
        } else if (element.attr["data-document-end"] && documents.length > 0) {
          documents.pop();
          isNewDocument = true;
        }
      }
      /*
        If we see an inline element or text, we group
        it together before sending to sentence()
      */
      // console.log({isTranslating, shouldTranslate, element})


      if (
      /*isTranslating === shouldTranslate &&*/
      isTranslating && shouldTranslate && (isInlineElement(element.tag) || element.node === "text") && !isNewDocument) {
        group.push(element);
      } else {
        /*
          Else, our grouping is finished
        */
        // console.log(documents.last)
        returns = [...returns, ...(isTranslating ? paragraphFunction(group, documents.last) || [] : group), GroupParagraphs({
          input: element,
          paragraphFunction,
          isTranslating: shouldTranslate,
          getNewTitle
        }) || {}];
        group = [];
      }
    } // console.error(JSON.stringify([
    //   ...returns,
    //   ...isTranslating ? (paragraphFunction(group, documents.last) || []) : group,
    // ]))


    return { ...input,
      child: [...returns, ...(isTranslating ? paragraphFunction(group, documents.last) || [] : group)]
    };
  }

  return input;
};

const shouldTranslate_ = ({
  tag,
  attr
}, isTranslating) => {
  if (tag && ["translate", "book"].includes(tag.toLowerCase())) {
    return true;
  }

  if (attr && (attr["data-translate"] === "no" || attr["data-translate"] === "false")) {
    return false;
  }

  if (attr && attr["data-children"] === "string") {
    return false;
  }

  if (attr && "data-translate" in attr) {
    return true;
  }

  if (attr && ("no-translate" in attr || "data-no-translate" in attr || "ignore" in attr)) {
    return false;
  }

  return isTranslating;
};
const isInlineElement = tag => {
  if (!tag || typeof tag !== "string") {
    return false;
  }

  return ["span", "b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong", "samp", "var", "a", "bdo", "map", "object", "q", "sub", "sup"].includes(tag.toLowerCase());
};
/* Block elements to skip */

const shouldSkip = ({
  tag,
  attr
}) => {
  if (!tag || typeof tag !== "string") {
    return false;
  }

  if (attr && attr.class === "instructions" || tag === "answers") {
    return true;
  }

  return ["script", "style", "head"
  /* 'sup'*/
  ].includes(tag.toLowerCase());
};
/* harmony default export */ __webpack_exports__["default"] = (GroupParagraphs);

/***/ }),

/***/ "./src/documents/Parse/RequestData/index.js":
/*!**************************************************!*\
  !*** ./src/documents/Parse/RequestData/index.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var documents_Parse_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Parse/index.js */ "./src/documents/Parse/index.js");
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! html-entities */ "html-entities");
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(html_entities__WEBPACK_IMPORTED_MODULE_1__);


const entities = new html_entities__WEBPACK_IMPORTED_MODULE_1__["AllHtmlEntities"]();
/*
  Returns an object containing:
    DocumentTitle => Data
*/

const ExtractData = input => {
  let output = {};
  const getNewTitle = new documents_Parse_index_js__WEBPACK_IMPORTED_MODULE_0__["newTitle"]();
  let temp = [];
  Traverse(input, ({
    documentTitle,
    data
  }) => {
    const title = getNewTitle.get(documentTitle); // console.log(data)

    output[title] = updateIDs(data, title);
  });
  return output;
};

const Traverse = (input, callback) => {
  const {
    node,
    tag,
    attr,
    child,
    text
  } = input;
  if (typeof input === "string") return;
  if (node === "text") return;

  if (Array.isArray(input)) {
    return input.map(i => Traverse(i, callback));
  }

  if (input.child) {
    input.child.map(i => Traverse(i, callback));
  }

  if (attr && attr["data-document-start"] && attr["data-data"]) {
    try {
      let data = attr["data-data"]; // console.log((decodeURIComponent(atob(data))))

      data = data && JSON.parse(
      /*entities.decode*/
      decodeURIComponent(atob(data)));
      data && callback({
        documentTitle: attr["data-document-start"],
        data
      });
    } catch (e) {
      // console.error(child[0].text + ' is not parseable JSON')
      console.error(e);
    }
  }
};

/* harmony default export */ __webpack_exports__["default"] = (ExtractData);
/*
  //TODO!
  Prepend title to all IDs to prevent clashing
*/

const updateIDs = (data, title) => {
  // console.log(data)
  return data;
};

/***/ }),

/***/ "./src/documents/Parse/Tokenize/IDs/CreateIDs.js":
/*!*******************************************************!*\
  !*** ./src/documents/Parse/Tokenize/IDs/CreateIDs.js ***!
  \*******************************************************/
/*! exports provided: wordRegex, default, getTextFromTokenized */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wordRegex", function() { return wordRegex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTextFromTokenized", function() { return getTextFromTokenized; });
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! shortid */ "shortid");
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(shortid__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_App_functions_hash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/functions/hash */ "./src/app/App/functions/hash.js");



__webpack_require__(/*! array-sugar */ "array-sugar");
/*
  TODO
  Only tests for Latin text
*/


const wordRegex = /[A-zÀ-ÿ0-9]/;

const CreateIDs = (documentTitle, paragraphs) => {
  const seed = Object(app_App_functions_hash__WEBPACK_IMPORTED_MODULE_1__["default"])(shortid__WEBPACK_IMPORTED_MODULE_0___default.a.generate() + "" + documentTitle).slice(0, 4);
  let i = 0;

  const makeID = () => {
    return `${seed}${i++}`;
  };

  return paragraphs.map(paragraph => {
    /*
      Paragraph
    */
    return {
      index: paragraph.index,
      hash: paragraph.hash,
      sentences: paragraph.sentences.map(sentence => {
        /*
          Sentence
        */
        const sentenceText = getTextFromTokenized(sentence).trim();
        const sentenceId = makeID();
        const words = sentence.words || sentence; // Sentence can either be an object or just an array of strings

        return {
          id: "s_" + sentenceId,
          text: sentenceText,
          words: words.map(word => {
            /*
            Word
            */
            const wordText = getTextFromTokenized(word).trim();
            if (!wordRegex.test(wordText)) return word;
            const wordId = makeID();
            return {
              id: "w_" + wordId,
              text: wordText // ...word,

            };
          }) // Filter out empty ends
          .filter((word, index) => !((index === 0 || index === sentence.length - 1) && !(word.text && word.text.trim()) && !word.trim()))
        };
      })
    };
  });
};

/* harmony default export */ __webpack_exports__["default"] = (CreateIDs);
/*
  Gets text from tokenized output
*/

const getTextFromTokenized = t => {
  if (Array.isArray(t)) {
    return t.map(getTextFromTokenized).join("");
  }

  if (typeof t === "object") {
    return t.text;
  }

  return t;
};

/***/ }),

/***/ "./src/documents/Parse/Tokenize/IDs/PreserveIDs.js":
/*!*********************************************************!*\
  !*** ./src/documents/Parse/Tokenize/IDs/PreserveIDs.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var diff__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! diff */ "diff");
/* harmony import */ var diff__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(diff__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_App_functions_flattenArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/functions/flattenArray */ "./src/app/App/functions/flattenArray.js");
/* harmony import */ var string_similarity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! string-similarity */ "string-similarity");
/* harmony import */ var string_similarity__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(string_similarity__WEBPACK_IMPORTED_MODULE_2__);
/*

  - Compares old and new tokenization and attempts to preserve IDs.
  - This is done to prevent loss of translations when editing the input text.

  Input:
    1. Old tokenized text
    2. New tokenised text
  Output:
    1. New tokenized text with preserved IDs when possible

*/




const Preserve = (first, second) => {
  /* Map from new IDs to preserved IDs */
  const PreservedIDs = {
    /* Compares old and new sentences */
    ...DiffAndPreserveIDs(SentencesArray(first), SentencesArray(second)),

    /* Compares old and new words */
    ...DiffAndPreserveIDs(WordsArray(first), WordsArray(second))
  };
  /* Return with preserved IDs */

  return second.map(paragraph => ({ ...paragraph,
    sentences: paragraph.sentences.map(sentence => ({ ...sentence,
      id: PreservedIDs[sentence.id] || sentence.id,
      words: sentence.words.map(word => {
        if (!word.id) return word;
        return { ...word,
          id: PreservedIDs[word.id] || word.id
        };
      })
    }))
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Preserve);
/*
  Input: Two arrays of only IDs & text.
  Ouput: Map of new IDs to preserved IDs
*/

const DiffAndPreserveIDs = (first, second) => {
  let ids = {};
  let first_index = 0;
  let second_index = 0;
  const diff = Object(diff__WEBPACK_IMPORTED_MODULE_0__["diffArrays"])(first.map(i => i.text), second.map(i => i.text));
  /* Keeps track of removed and added parts */

  let unmatched_ids = {};
  /* Find perfect matches */

  diff.forEach((part, part_index) => {
    part.value.forEach((value, value_index) => {
      if (part.removed) {
        /* Save id in `diff` to find closest match later */
        unmatched_ids[`${part_index}_${value_index}`] = first[first_index].id;
        first_index++;
      } else if (part.added) {
        /* Save id in `diff` to find closest match later */
        unmatched_ids[`${part_index}_${value_index}`] = second[second_index].id;
        second_index++;
      } else {
        /* Map new ID to preserved ID */
        ids[second[second_index].id] = first[first_index].id;
        first_index++;
        second_index++;
      }
    });
  });
  /* Attempt to find the closest match */

  diff.forEach((part, part_index) => {
    if (diff[part_index + 1] && diff[part_index].removed && diff[part_index + 1].added // || (diff[index].added && diff[index + 1].removed)
    ) {
        const removed = diff[part_index];
        const added = diff[part_index + 1];
        let remaining_possible_added_values = added.value;
        removed.value.forEach((removed_value, removed_index) => {
          if (remaining_possible_added_values.length < 1) return;
          const {
            bestMatch,
            bestMatchIndex
          } = Object(string_similarity__WEBPACK_IMPORTED_MODULE_2__["findBestMatch"])(removed_value, remaining_possible_added_values);
          if (bestMatch.rating < 0.3) return;
          const removed_id = unmatched_ids[`${part_index}_${removed_index}`];
          const added_id = unmatched_ids[`${part_index + 1}_${bestMatchIndex}`];
          ids[added_id] = removed_id;
          remaining_possible_added_values.splice(bestMatchIndex, 1);
        });
      }
  });
  return ids;
};
/*
  Create flat arrays of words and sentences.

  Input:
    - Tokenized data
  Output:
    - Simplified array on the form: [{ id, text }, { id, text }].
    - All punctuation is removed to make diff simpler.
*/


const SentencesArray = paragraphs => {
  return Object(app_App_functions_flattenArray__WEBPACK_IMPORTED_MODULE_1__["default"])(paragraphs.map(paragraph => {
    return paragraph.sentences.map(sentence => {
      return {
        id: sentence.id,
        text: sentence.words.map(word => {
          return word.text;
        }).filter(Boolean).join(" ").toLowerCase()
      };
    });
  }));
};

const WordsArray = paragraphs => {
  return Object(app_App_functions_flattenArray__WEBPACK_IMPORTED_MODULE_1__["default"])(paragraphs.map(paragraph => {
    return paragraph.sentences.map(sentence => {
      return sentence.words.map(word => {
        if (!word.id) return null;
        return {
          id: word.id,
          text: word.text.toLowerCase()
        };
      }).filter(Boolean);
    });
  }));
}; //
// const ONE = [{
//     "id": "w__Eiríkur",
//     "text": "Eiríkur"
//   },
//   {
//     "id": "w__dansar",
//     "text": "dansar"
//   },
//   {
//     "id": "w__svo",
//     "text": "svo"
//   },
//   {
//     "id": "w__vel",
//     "text": "vel"
//   }, {
//     "id": "w__Hann",
//     "text": "Hann"
//   }, {
//     "id": "w__dansar",
//     "text": "dansar"
//   }, {
//     "id": "w__betur",
//     "text": "betur"
//   }, {
//     "id": "w__en",
//     "text": "en"
//   }, {
//     "id": "w__ég",
//     "text": "ég"
//   }
// ]
// const TWO = [{
//   "id": "NEW_w__Test",
//   "text": "Test"
// }, {
//   "id": "NEW_w__test",
//   "text": "test"
// }, {
//   "id": "NEW_w__test",
//   "text": "test"
// }, {
//   "id": "NEW_w__Haha",
//   "text": "Haha"
// }, {
//   "id": "NEW_w__Haha",
//   "text": "Haha"
// }, {
//   "id": "NEW_w__Eiríkur",
//   "text": "Eiríkur"
// }, {
//   "id": "NEW_w__dansar",
//   "text": "dansar"
// }, {
//   "id": "NEW_w__svo",
//   "text": "svo"
// }, {
//   "id": "NEW_w__vel",
//   "text": "vel"
// }, {
//   "id": "NEW_w__Hann",
//   "text": "Hann"
// }, {
//   "id": "NEW_w__dansar",
//   "text": "dansar"
// }, {
//   "id": "NEW_w_0_betur",
//   "text": "betur"
// }, {
//   "id": "NEW_w_7_en",
//   "text": "en"
// }, {
//   "id": "NEW_w_O_ég",
//   "text": "ég"
// }]
//
// console.log({ DiffAndPreserveIDs: DiffAndPreserveIDs(ONE, TWO) })

/***/ }),

/***/ "./src/documents/Parse/Tokenize/Tokenizer/index.js":
/*!*********************************************************!*\
  !*** ./src/documents/Parse/Tokenize/Tokenizer/index.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sentence_tokenizer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sentence-tokenizer */ "./src/documents/Parse/Tokenize/Tokenizer/sentence-tokenizer.js");
/* harmony import */ var _word_tokenizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./word-tokenizer */ "./src/documents/Parse/Tokenize/Tokenizer/word-tokenizer.js");



const Tokenize = ({
  paragraphs
}) => {
  return paragraphs.map(({
    hash,
    text
  }) => {
    return {
      hash,
      sentences: Object(_sentence_tokenizer__WEBPACK_IMPORTED_MODULE_0__["default"])(text).map(sentence => {
        return Object(_word_tokenizer__WEBPACK_IMPORTED_MODULE_1__["default"])(sentence);
      })
    };
  });
};

/* harmony default export */ __webpack_exports__["default"] = (Tokenize);

/***/ }),

/***/ "./src/documents/Parse/Tokenize/Tokenizer/sentence-tokenizer.js":
/*!**********************************************************************!*\
  !*** ./src/documents/Parse/Tokenize/Tokenizer/sentence-tokenizer.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var xregexp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xregexp */ "xregexp");
/* harmony import */ var xregexp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(xregexp__WEBPACK_IMPORTED_MODULE_0__);
/**

  Attempts to split Latin-script paragraphs into
  sentences of roughly 50 characters.

  It is preferable to do this with natural language processing.

  @returns An array of sentences


  // TODO! NOT DONE! Should be done through spans instead of Unicode whitespaces!
  To prevent an inter-sentence break, add &#8203; (zero width space)
  To force an inter-sentence break, add &#8232; (line seperator) // TODO! NOT DONE

*/

const startOfSentence = '(?:\\p{Uppercase letter}|[„"¿(])';
const endOfSentence = '[.!?;]+?(?:[“")])? ';
/* harmony default export */ __webpack_exports__["default"] = (input => {
  return input // Split on new sentences
  .replace(xregexp__WEBPACK_IMPORTED_MODULE_0___default()(`(${endOfSentence})(${startOfSentence})`, "g"), "$1\n\n$2") // Remove splits inside parantheses
  .replace(xregexp__WEBPACK_IMPORTED_MODULE_0___default()(`(\\(.*?)\n\n(.*?\\))`, "g"), "$1$2") // // (I actually don't know why this is here, can probably be removed?)
  // .replace(r(`(\\(.{20,}\\)[.,;:?!"”] ?)`, 'g'), '\n\n$1\n\n')
  // Split in the middle of sentences (if preceded by at least 20 characters)
  .replace(xregexp__WEBPACK_IMPORTED_MODULE_0___default()(`([^.,;:?!"”]{20,}[,:] )([^.,;:?!"”]{20,})`, "g"), "$1\n\n$2") // // Split spaces
  // .replace(/ \n\n/g, '\n\n \n\n')
  .split(/\n\n+/g).filter(Boolean);
});

/***/ }),

/***/ "./src/documents/Parse/Tokenize/Tokenizer/word-tokenizer.js":
/*!******************************************************************!*\
  !*** ./src/documents/Parse/Tokenize/Tokenizer/word-tokenizer.js ***!
  \******************************************************************/
/*! exports provided: wordRegex, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wordRegex", function() { return wordRegex; });
/* harmony import */ var xregexp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xregexp */ "xregexp");
/* harmony import */ var xregexp__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(xregexp__WEBPACK_IMPORTED_MODULE_0__);
/**

  Attempts to split Latin-script sentences into words.

  It is preferable to do this with natural language processing.

  @returns An array of words

*/

const startOfWord = "[A-zÀ-ÿ·-]";
const middleOfWord = "[A-zÀ-ÿ·\\-'’.,:0-9]";
const endOfWord = "[A-zÀ-ÿ·\\-']";
const wordRegex = xregexp__WEBPACK_IMPORTED_MODULE_0___default()(`((?:${startOfWord}(?:(?:${middleOfWord}+)?${endOfWord})?)|[0-9]+)`, "g");
/* harmony default export */ __webpack_exports__["default"] = (input => {
  return input.split(wordRegex).filter(Boolean);
});

/***/ }),

/***/ "./src/documents/Parse/Tokenize/index.js":
/*!***********************************************!*\
  !*** ./src/documents/Parse/Tokenize/index.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _IDs_CreateIDs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IDs/CreateIDs */ "./src/documents/Parse/Tokenize/IDs/CreateIDs.js");
/* harmony import */ var app_App_functions_hash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/App/functions/hash */ "./src/app/App/functions/hash.js");
/* harmony import */ var _IDs_PreserveIDs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IDs/PreserveIDs */ "./src/documents/Parse/Tokenize/IDs/PreserveIDs.js");
/* harmony import */ var _Tokenizer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Tokenizer */ "./src/documents/Parse/Tokenize/Tokenizer/index.js");
/*
  _____     _              _
 |_   _|__ | | _____ _ __ (_)_______
   | |/ _ \| |/ / _ \ '_ \| |_  / _ \
   | | (_) |   <  __/ | | | |/ /  __/
   |_|\___/|_|\_\___|_| |_|_/___\___|

  1. Extracts raw text from input
  2. Sends text to server for tokenization
*/





/* harmony default export */ __webpack_exports__["default"] = (function (documents, data) {
  let tokenized = {};

  for (const documentTitle of Object.keys(documents)) {
    tokenized[documentTitle] = tokenize({
      documentTitle,
      paragraphs: documents[documentTitle],
      previousData: data[documentTitle] || {}
    });
  }

  return tokenized;
});

const tokenize = ({
  documentTitle,
  paragraphs,
  previousData
}) => {
  var _previousData$tokeniz;

  const oldHashes = ((_previousData$tokeniz = previousData.tokenized) === null || _previousData$tokeniz === void 0 ? void 0 : _previousData$tokeniz.map(p => p.hash)) || [];
  /*
    We do not want to unnecessarily recalculate tokenization.
  */

  const paragraphsMissingTokenization = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.uniq(paragraphs.filter(p => !oldHashes.includes(p.hash)));

  let tokenized = Object(_Tokenizer__WEBPACK_IMPORTED_MODULE_4__["default"])({
    paragraphs: paragraphsMissingTokenization
  });
  /*
    Since we only calculated tokenization for things that have changed,
    here we merge the output with previously calculated tokenizations.
  */

  const arrayOfNewAndOldTokenizations = [...(previousData.tokenized || []), // Previous tokenization
  ...tokenized // New tokenization
  ];
  tokenized = paragraphs.map(p => {
    return { ...arrayOfNewAndOldTokenizations.find(i => i.hash === p.hash),
      index: p.index
    };
  }); // console.log(tokenized)

  tokenized = Object(_IDs_CreateIDs__WEBPACK_IMPORTED_MODULE_1__["default"])(documentTitle, tokenized);

  if (previousData.tokenized) {
    tokenized = Object(_IDs_PreserveIDs__WEBPACK_IMPORTED_MODULE_3__["default"])(previousData.tokenized, tokenized);
  }
  /*
    "Paragraph" currently only contains a hash of the text.
    Here we add a hash of the IDs
  */


  tokenized = tokenized.map(paragraph => ({ ...paragraph,
    hashOfIds: hashOfIds(paragraph)
  }));
  return tokenized;
};

const hashOfIds = paragraph => {
  let ids = [];
  paragraph.sentences.forEach(sentence => {
    ids.push(sentence.id);
    sentence.words.forEach(word => {
      ids.push(word.id);
    });
  });
  return Object(app_App_functions_hash__WEBPACK_IMPORTED_MODULE_2__["default"])(ids);
};

/***/ }),

/***/ "./src/documents/Parse/WrapInTags/1-InsertSplit.js":
/*!*********************************************************!*\
  !*** ./src/documents/Parse/WrapInTags/1-InsertSplit.js ***!
  \*********************************************************/
/*! exports provided: default, getTextFromTokenized */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTextFromTokenized", function() { return getTextFromTokenized; });
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/html2json */ "./src/app/App/functions/html2json/index.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__);
 // import SplitIntoUnicodeCharacters from './helpers/runes'
// import { getTextFromTokenized } from 'server/api/translate/tokenizer/create-ids'

/*
  STEP 1:

  Adds "{{SPLIT HERE}}" in the tree
*/

/* harmony default export */ __webpack_exports__["default"] = (function (input, tokenizedSplit) {
  // Turn tokenized data into an array of text
  const array = tokenizedSplit.map(getTextFromTokenized); // console.warn(split)

  let currentIndex = 0;
  let locationInString = 0;

  const InsertSPLIT = i => {
    if (Array.isArray(i)) {
      return i.map(x => InsertSPLIT(x));
    } else {
      const {
        node,
        tag,
        attr,
        child,
        text
      } = i;

      if (node === "element" || node === "root") {
        return { ...i,
          child: child && child.map(x => InsertSPLIT(x))
        };
      } else if (node === "text") {
        /*
          Split text into individual characters
        */
        return { ...i,
          text: text.split("").map(character => {
            /*
              Surrounding spaces and characters like soft hyphens
              may have been stripped away.
              Here we just return characters until we see the one we are looking for.
            */
            if (character !== array[currentIndex][locationInString]) {
              return character;
            }
            /*
              When we have finished looping through each character in the current array string
              we insert a delimeter, here the text "{{SPLIT HERE}}".
              (Assumes empty strings have been filtered out)
            */


            if (locationInString + character.length === array[currentIndex].length && currentIndex + 1 < array.length) {
              locationInString = 0;
              currentIndex++;
              return character + "{{SPLIT HERE}}";
            } else {
              locationInString += character.length;
              return character;
            }
          }).join("")
        };
      }

      return i;
    }
  };
  /*
    Turns the JSON into a HTML string
    (which includes "{{SPLIT HERE}}" in the correct places)
  */


  const html = Object(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__["json2html"])({
    node: "root",
    child: InsertSPLIT(input)
  });
  return html;
});
const getTextFromTokenized = t => {
  if (Array.isArray(t)) {
    return t.map(getTextFromTokenized).join("");
  }

  if (typeof t === "object") {
    return t.text;
  }

  return t;
};

/***/ }),

/***/ "./src/documents/Parse/WrapInTags/2-SplitAndWrap.js":
/*!**********************************************************!*\
  !*** ./src/documents/Parse/WrapInTags/2-SplitAndWrap.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/html2json */ "./src/app/App/functions/html2json/index.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__);

/*
  STEP 2:

  Then we split on the "{{SPLIT HERE}}"
  and then we open and close HTML tags as necessary.
*/

/* harmony default export */ __webpack_exports__["default"] = (function (html, tokenizedSplit, elementName, innerFunction, temp_attribute_name) {
  let count = 0;
  let openTags = [];
  html = html.split(/{{SPLIT HERE}}/g).map((part, index) => {
    let returns = "";
    /*
      Reopen all open tags since we're starting a new string
    */

    openTags.forEach(e => {
      returns += e;
    });
    /*
      Go look for tags
    */

    returns += part.split(/(<[^>]*>)/g).map(b => {
      if (/(<[^>]*>)/g.test(b)) {
        /*
          Tag opens
        */
        if (!b.startsWith("</") && !b.endsWith("/>")) {
          const tagWithId = b.replace(/>$/, ` ${temp_attribute_name}="${count++}">`);
          openTags.push(tagWithId);
          return tagWithId;
        } else if (b.startsWith("</")) {
          /*
            Tag closes
          */
          openTags = openTags.slice(0, openTags.length - 1);
          return b;
        }
      }

      return b;
    }).join("");
    /*
      Close all open tags
    */

    openTags.slice().reverse().forEach(e => {
      returns += `</${e.match(/<([^ ]+)/)[1]}>`;
    });
    const id = tokenizedSplit[index].id;
    /*
      Empty data, punctuation, or empty tags
    */
    // if (!/[A-zÀ-ÿ0-9]/.test(returns.replace(/(<[^>]*>)/g, ''))) {
    //   return returns;
    // }

    if (!id) {
      return returns;
    }
    /*
      Do we send this data deeper?
      [This is done by sentences() to send its children into words()]
    */


    if (innerFunction) {
      returns = Object(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__["json2html"])(innerFunction(Object(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__["html2json"])(returns).child, id));
    }
    /*
      Surrounding spaces will not be inside the tag
    */


    if (!returns) {
      returns = "";
    }

    const r = returns.match(/^( +)?(.*?)( +)?$/); // Takes the surrounding spaces
    // console.log({returns,r})

    const space_at_beginning = r[1] || "";
    const content = r[2] || "";
    const space_at_end = r[3] || "";
    /*
      Wrap in <sentence/> and <word/> tags
    */

    return space_at_beginning + `<${elementName} id="${id}" data-${elementName}-id="${id}">` + content + `</${elementName}>` + space_at_end;
  }); // console.log('\n\n~~~~~~~~~~~~~~~~~~~~~~~~\n')
  // console.log(html.join(''))
  // let json = html2json(html.join(''))

  return Object(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__["html2json"])(html.join(""));
});

/***/ }),

/***/ "./src/documents/Parse/WrapInTags/3-Invert.js":
/*!****************************************************!*\
  !*** ./src/documents/Parse/WrapInTags/3-Invert.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*
  STEP 3:

  Turns this:
      <word><b>blabla</b></word>
  into:
      <b><word>blabla</word></b>
*/
const InvertElementsThatOnlyContainOneThing = i => {
  if (!i) return;

  if (Array.isArray(i)) {
    return i.map(x => InvertElementsThatOnlyContainOneThing(x));
  } else {
    const {
      node,
      tag,
      attr,
      child,
      text
    } = i;

    if (child && child.length > 0) {
      /*
        If element only wraps around one child,
        switch them around
      */
      if ((tag === "word" || tag === "sentence") && child.length === 1 && child[0].node === "element" && child[0].tag !== "word") {
        return {
          node: child[0].node,
          tag: child[0].tag,
          attr: child[0].attr,
          child: [{
            node,
            tag,
            attr,
            child: child[0].child.map(x => InvertElementsThatOnlyContainOneThing(x))
          }]
        };
      } else {
        return { ...i,
          child: child && child.map(x => InvertElementsThatOnlyContainOneThing(x))
        };
      }
    }

    return i;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (InvertElementsThatOnlyContainOneThing);

/***/ }),

/***/ "./src/documents/Parse/WrapInTags/4-Merge.js":
/*!***************************************************!*\
  !*** ./src/documents/Parse/WrapInTags/4-Merge.js ***!
  \***************************************************/
/*! exports provided: default, flattenArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flattenArray", function() { return flattenArray; });
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/html2json */ "./src/app/App/functions/html2json/index.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__);

/*
  STEP 4:

  The previous function was too aggressive in splitting things up.

  Turns this:
      <b></b><b><word>blabla</word></b>
  into:
      <b><word>blabla</word></b>
*/

const MergeElementsThatHaveBeenSplitUnnecessarily = (i, temp_attribute_name) => {
  if (!i) return;

  if (Array.isArray(i)) {
    return i.map(x => MergeElementsThatHaveBeenSplitUnnecessarily(x));
  } else {
    const {
      node,
      tag,
      attr,
      child,
      text
    } = i;

    if (child && child.length > 0) {
      let newChildren = [];
      let tempElement = {};
      let lastId = null;

      for (let x = 0; x < child.length; x++) {
        const _id = child[x].attr && child[x].attr[temp_attribute_name];

        if (_id) {
          if (_id === lastId) {
            tempElement.child = [...(tempElement.child || []), ...(child[x].child || [])];
          } else {
            newChildren = newChildren.concat(tempElement);
            tempElement = child[x];
            lastId = _id;
          }
        } else {
          newChildren = newChildren.concat(tempElement);
          newChildren.push(child[x]);
          tempElement = {};
          lastId = null;
        }
      }

      newChildren = newChildren.concat(tempElement);
      return { ...i,
        child: flattenArray(newChildren).map(x => MergeElementsThatHaveBeenSplitUnnecessarily(x, temp_attribute_name))
      };
    }

    return i;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (MergeElementsThatHaveBeenSplitUnnecessarily); // todo: import from App/functions instead

const flattenArray = data => {
  var r = [];
  data.forEach(e => Array.isArray(e) ? r = r.concat(flattenArray(e)) : r.push(e));
  return r;
};

/***/ }),

/***/ "./src/documents/Parse/WrapInTags/index.js":
/*!*************************************************!*\
  !*** ./src/documents/Parse/WrapInTags/index.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/html2json */ "./src/app/App/functions/html2json/index.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var documents_Parse_ExtractText_ExtractText__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Parse/ExtractText/ExtractText */ "./src/documents/Parse/ExtractText/ExtractText.js");
/* harmony import */ var _1_InsertSplit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./1-InsertSplit */ "./src/documents/Parse/WrapInTags/1-InsertSplit.js");
/* harmony import */ var _2_SplitAndWrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./2-SplitAndWrap */ "./src/documents/Parse/WrapInTags/2-SplitAndWrap.js");
/* harmony import */ var _3_Invert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./3-Invert */ "./src/documents/Parse/WrapInTags/3-Invert.js");
/* harmony import */ var _4_Merge__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./4-Merge */ "./src/documents/Parse/WrapInTags/4-Merge.js");
/* harmony import */ var documents_Parse_ExtractText_Paragraphs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! documents/Parse/ExtractText/Paragraphs */ "./src/documents/Parse/ExtractText/Paragraphs.js");
/* harmony import */ var documents_Parse_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! documents/Parse/index.js */ "./src/documents/Parse/index.js");
/*

 __        __                  _          _
 \ \      / / __ __ _ _ __    (_)_ __    | |_ __ _  __ _ ___
  \ \ /\ / / '__/ _` | '_ \   | | '_ \   | __/ _` |/ _` / __|
   \ V  V /| | | (_| | |_) |  | | | | |  | || (_| | (_| \__ \
    \_/\_/ |_|  \__,_| .__/   |_|_| |_|   \__\__,_|\__, |___/
                     |_|                           |___/

 1. Parses input
 2. Loops over tokenization
 3. Merges tokenization and HTML to produce <sentence/> and <word/> tags

---

  We split up Words and Sentences based on raw text, not based on HTML structure.

  The purpose of these functions is to turn this HTML:
      <b>Blabla bla! <i>Bla</i></b> bla bla.
  Into:
      <sentence>
        <b>Blabla bla!</b>
      </sentence>
      <sentence>
        <b><i>Bla</i></b> bla bla.
      </sentence>

  That is to say, it breaks out of HTML tags at the correct spots in
  order to encapsulate the text into <sentence/> tags.

*/








/*
  Parse input and split paragraphs
*/

/* harmony default export */ __webpack_exports__["default"] = (function ({
  json,
  tokenized
}) {
  // console.log(json2html(json))

  /*
    Flatten tokenized
  */
  let tokenizedFlattened = [];

  for (const documentTitle of Object.keys(tokenized)) {
    for (const i in tokenized[documentTitle]) {
      tokenizedFlattened.push({
        documentTitle,
        ...tokenized[documentTitle][i]
      });
    }
  }

  tokenizedFlattened = tokenizedFlattened.sort((a, b) => a.index - b.index); // console.log(tokenized)
  // console.warn(JSON.stringify(json))

  let index = 0;
  let wrapped = Object(documents_Parse_ExtractText_Paragraphs__WEBPACK_IMPORTED_MODULE_6__["default"])({
    input: json,
    getNewTitle: new documents_Parse_index_js__WEBPACK_IMPORTED_MODULE_7__["newTitle"](),
    paragraphFunction: (paragraph, documentTitle) => {
      const text = Object(documents_Parse_ExtractText_ExtractText__WEBPACK_IMPORTED_MODULE_1__["getText"])(paragraph, true, true); // console.log(JSON.stringify(paragraph))
      // console.log(text)

      if (documentTitle === undefined) {
        // console.log(JSON.stringify(paragraph))
        return paragraph;
      } // console.log(JSON.stringify(paragraph))
      // console.error('HAHA')
      // console.log(JSON.stringify(paragraph))


      if (text) {
        return Sentences(paragraph, tokenizedFlattened[index++].sentences);
      }

      return paragraph;
    }
  }); // console.log(JSON.stringify(wrapped))

  wrapped = RemoveData(wrapped); // console.log(wrapped)
  // wrapped = html2json(json2html(wrapped))

  return wrapped;
});
/*
  Extract sentences from paragraph
*/

const Sentences = (paragraph_HTML, sentences) => {
  // console.warn('HAHA2')
  // console.log(JSON.stringify(paragraph_HTML))

  /*
    Extract words from sentence
    (Creates a function that will be called in "WrapInTags.js")
  */
  let i = 0;

  function Words(sentence_HTML) {
    const words = sentences[i++].words;
    return WrapInTags(sentence_HTML, words, "word");
  }

  return WrapInTags(paragraph_HTML, sentences, "sentence", Words).child;
};

const WrapInTags = (input, tokenizedSplit, elementName, innerFunction) => {
  let html, json;
  const temp_attribute_name = innerFunction ? `data-temp-id` : `data-temp-id2`;
  if (tokenizedSplit.length === 0) return input; // console.log(JSON.stringify(input))

  html = Object(_1_InsertSplit__WEBPACK_IMPORTED_MODULE_2__["default"])(input, tokenizedSplit);
  json = Object(_2_SplitAndWrap__WEBPACK_IMPORTED_MODULE_3__["default"])(html, tokenizedSplit, elementName, innerFunction, temp_attribute_name); // console.log(json2html(json))

  json = Object(_3_Invert__WEBPACK_IMPORTED_MODULE_4__["default"])(json);
  json = Object(_4_Merge__WEBPACK_IMPORTED_MODULE_5__["default"])(json, temp_attribute_name);
  return json;
};
/*
  Removes the inline data printed in [[Template:Start]]
*/


const RemoveData = input => {
  if (!input) return input;

  if (Array.isArray(input)) {
    return input.map(RemoveData);
  }

  const {
    node,
    tag,
    attr,
    child,
    text
  } = input;

  if (node === "element" || node === "root") {
    if (attr && (attr["data-document-start"] || attr["data-document-end"])) {
      return {
        node: "text",
        text: ""
      }; // Hlýtur að vera betri leið til að henda út greinum...
    }

    if (child) {
      return { ...input,
        child: child.map((e, i) => RemoveData(e, i))
      };
    }

    return input;
  }

  return input;
};

/***/ }),

/***/ "./src/documents/Parse/index.js":
/*!**************************************!*\
  !*** ./src/documents/Parse/index.js ***!
  \**************************************/
/*! exports provided: default, newTitle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "newTitle", function() { return newTitle; });
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/html2json */ "./src/app/App/functions/html2json/index.js");
/* harmony import */ var app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! marked */ "marked");
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(marked__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! html-entities */ "html-entities");
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(html_entities__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _RequestData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RequestData */ "./src/documents/Parse/RequestData/index.js");
/* harmony import */ var _ExtractText_ExtractText__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ExtractText/ExtractText */ "./src/documents/Parse/ExtractText/ExtractText.js");
/* harmony import */ var _Tokenize__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Tokenize */ "./src/documents/Parse/Tokenize/index.js");
/* harmony import */ var _WrapInTags__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./WrapInTags */ "./src/documents/Parse/WrapInTags/index.js");
/* harmony import */ var _Compiler__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Compiler */ "./src/documents/Parse/Compiler/index.js");
/* harmony import */ var app_App_Error__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/App/Error */ "./src/app/App/Error/index.js");
/* harmony import */ var is_empty_object__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! is-empty-object */ "is-empty-object");
/* harmony import */ var is_empty_object__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(is_empty_object__WEBPACK_IMPORTED_MODULE_9__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











const entities = new html_entities__WEBPACK_IMPORTED_MODULE_2__["AllHtmlEntities"]();

var now = __webpack_require__(/*! performance-now */ "performance-now");
/*
  Parser
*/


/* harmony default export */ __webpack_exports__["default"] = (({
  html,
  title
}) => {
  if (!html) return null; // console.log(html)

  try {
    // var t0 = now()
    html = entities.decode(html);
    html = html.replace(/[\s\n\r]+/g, " ") // Ef þetta er fjarlægt virkar WrapInTags/SplitAndWrap ekki
    .replace(/\u00AD/g, " ") // Soft-hyphens
    .replace(/\u00A0/g, " "); // Non-breaking spaces

    let json = Object(app_App_functions_html2json__WEBPACK_IMPORTED_MODULE_0__["html2json"])(html); // console.log(html)
    // var t1 = now()
    // console.log(`html2json took ${Math.round(t1 - t0)} ms`)

    /*
      Is data already saved?
    */

    let data = Object(_RequestData__WEBPACK_IMPORTED_MODULE_3__["default"])(json); // console.log(data)

    /*
      Extract text, group by documents
    */

    const text = Object(_ExtractText_ExtractText__WEBPACK_IMPORTED_MODULE_4__["default"])(json); // console.log({text})
    // var t3 = now()
    // console.log(`Extracting text took ${Math.round(t3 - t2)} ms`)

    if (is_empty_object__WEBPACK_IMPORTED_MODULE_9___default()(text)) {
      // console.warn('No text to tokenize.')
      // json = html2json(entities.decode(json2html(json)))
      return {
        parsed: Object(_Compiler__WEBPACK_IMPORTED_MODULE_7__["default"])({
          json
        })
      }; // return html2json(Compiler({ json: wrapped, data: data, }))
    }

    const tokenized = Object(_Tokenize__WEBPACK_IMPORTED_MODULE_5__["default"])(text, data); // console.log({text,tokenized})
    // var t4 = now()
    // console.log(`Tokenization took ${Math.round(t4 - t3)} ms`)

    const flattenedData = flattenData(data);
    /*
      Merge tokenization and HTML (does not include data).
      Returns wrapped HTML without data
    */
    // console.log(json2html(json))

    const wrapped = Object(_WrapInTags__WEBPACK_IMPORTED_MODULE_6__["default"])({
      json,
      tokenized
    }); // console.log({wrapped})
    // var t5 = now()
    // console.log(`Wrapping took ${Math.round(t5 - t4)} ms`)
    // console.log(json2html(wrapped))

    let compiled = Object(_Compiler__WEBPACK_IMPORTED_MODULE_7__["default"])({
      json: wrapped,
      data: flattenedData
    }); // var t6 = now()
    // console.log(`Compilation took ${Math.round(t6 - t5)} ms`)
    // console.log(`total ${Math.round(t6 - t0)} ms`)
    // compiled = entities.decode(compiled)
    // console.log(JSON.stringify(compiled,null,2))

    return {
      parsed: compiled,
      // JSON object
      // parsed: html2json(compiled),
      tokenized,
      data,
      flattenedData
    }; // return compiled
  } catch (e) {
    console.error(e);

    if (typeof mw !== "undefined") {
      Object(app_App_Error__WEBPACK_IMPORTED_MODULE_8__["notify"])("Error in parse step");
    }
  }
});

const flattenData = input => {
  let output = {
    translation: {
      definitions: {},
      sentences: {},
      words: {}
    },
    list: {
      arrayOfAllItemIDs: [],
      arrayOfAllWordIDs: [],
      items: {},
      sentences: {},
      words: {}
    },
    short_audio: {
      soundList: [],
      sounds: {},
      wordID_to_text: {}
    },
    long_audio: {}
  };

  for (const documentTitle of Object.keys(input)) {
    // console.log(input[documentTitle])
    output = merge(output, input[documentTitle]);
  } // console.log(output)


  return output;
};

const merge = (first, second) => {
  if (Array.isArray(first)) {
    return [...first, ...second];
  } else if (typeof first === "object") {
    let output = first;

    if (second && typeof second === "object") {
      for (const key of Object.keys(second)) {
        if (output[key]) {
          output[key] = merge(output[key], second[key]);
        } else {
          output[key] = second[key];
        }
      }
    }

    return output;
  }
};
/*
  Prevent clashes if the same document is transcluded twice
*/


class newTitle {
  constructor() {
    _defineProperty(this, "index", 0);

    _defineProperty(this, "array", []);
  }

  get(title) {
    if (this.array.includes(title)) {
      title = this.get(title + "1");
    }

    this.array.push(title);
    return title;
  }

}

/***/ }),

/***/ "./src/documents/Read/Touch/Mouse.js":
/*!*******************************************!*\
  !*** ./src/documents/Read/Touch/Mouse.js ***!
  \*******************************************/
/*! exports provided: MouseEventListenerOn, MouseEventListenerOff */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MouseEventListenerOn", function() { return MouseEventListenerOn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MouseEventListenerOff", function() { return MouseEventListenerOff; });
/* harmony import */ var documents_Read_actions_ShowWord__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Read/actions/ShowWord */ "./src/documents/Read/actions/ShowWord.js");
/* harmony import */ var documents_Read_actions_Reset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Read/actions/Reset */ "./src/documents/Read/actions/Reset.js");
/* harmony import */ var documents_Read_actions_HighlightSentence__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! documents/Read/actions/HighlightSentence */ "./src/documents/Read/actions/HighlightSentence.js");
/* harmony import */ var documents_Read_actions_ShowSentence__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! documents/Read/actions/ShowSentence */ "./src/documents/Read/actions/ShowSentence.js");
/* harmony import */ var documents_Render_Frontpage_demo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! documents/Render/Frontpage/demo */ "./src/documents/Render/Frontpage/demo.js");
/*  __  __
   |  \/  | ___  _   _ ___  ___
   | |\/| |/ _ \| | | / __|/ _ \
   | |  | | (_) | |_| \__ \  __/
   |_|  |_|\___/ \__,_|___/\___| */





let lastId = null;
let isSentenceBeingShown = false;
const MouseEventListenerOn = () => {
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mousedown", mousedown);
};
const MouseEventListenerOff = () => {
  document.removeEventListener("mousemove", mousemove);
  document.removeEventListener("mousedown", mousedown);
};
let lastX_seen;
let lastY_seen;
let lastX_processed;
let lastY_processed;
let lastTime_seen = 0;
let lastTime_processed = 0;
let lastTime_quick_movement_seen = 0;
const SAMPLE_EVERY_X_MILLISECONDS = 30;
const MAX_SPEED = 300;
/* Pixels per second */

const TIMOUT_UNTIL_DISAPPEARS = 100;
let timer;

const mousemove = e => {
  if (window.listenerCount > 0) {
    let x = (e === null || e === void 0 ? void 0 : e.clientX) || lastX_seen;
    let y = (e === null || e === void 0 ? void 0 : e.clientY) || lastY_seen;
    if (!x || !y) return;
    /* Prevents "The provided double value is non-finite" */

    lastX_seen = x;
    lastY_seen = y;
    let time = new Date().getTime();
    lastTime_seen = time;
    /* Limit sampling rate */

    if (lastTime_processed && time - lastTime_processed < SAMPLE_EVERY_X_MILLISECONDS) {
      if (!timer) {
        timer = setTimeout(() => {
          mousemove();
        }, SAMPLE_EVERY_X_MILLISECONDS - (time - lastTime_seen));
      }

      return;
    }
    /* Ignore if mouse movement is fast */


    let speed;

    if (lastX_processed) {
      let distance = Math.sqrt((x - lastX_processed) ** 2 + (y - lastY_processed) ** 2);
      /* Pixels per second */

      speed = distance / ((time - lastTime_processed) / 1000);
    }

    lastX_processed = x;
    lastY_processed = y;
    lastTime_processed = time;

    if (speed && speed > MAX_SPEED) {
      lastTime_quick_movement_seen = time;
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        mousemove();
      }, SAMPLE_EVERY_X_MILLISECONDS);
      return;
    }

    timer = null;
    if (!document) return;
    const target = document.elementFromPoint(x, y);
    const target_10px_below = document.elementFromPoint(x, y
    /*- 10*/
    );
    if (!target) return;
    const ignore = target.closest("[data-ignore]");
    if (ignore) return;

    if (isSentenceBeingShown) {
      const element = (target_10px_below === null || target_10px_below === void 0 ? void 0 : target_10px_below.closest("[data-sentence-has-definition]")) || target.closest("[data-sentence-has-definition]");

      if (element && lastId === element.getAttribute("id")) {
        return;
      }
    }

    isSentenceBeingShown = false;
    const word = (target_10px_below === null || target_10px_below === void 0 ? void 0 : target_10px_below.closest("[data-word-has-definition]")) || target.closest("[data-word-has-definition]");
    const sentence = (target_10px_below === null || target_10px_below === void 0 ? void 0 : target_10px_below.closest("[data-sentence-has-definition]")) || target.closest("[data-sentence-has-definition]");

    if (!word && !sentence) {
      /* Ignore if user might still be moving in short fits */
      if (time - lastTime_quick_movement_seen < TIMOUT_UNTIL_DISAPPEARS) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          mousemove();
        }, time - lastTime_quick_movement_seen);
        return;
      }

      if (lastId !== null) {
        Object(documents_Read_actions_Reset__WEBPACK_IMPORTED_MODULE_1__["default"])();
        lastId = null;
      }

      return;
    } // e && e.preventDefault()


    Object(documents_Render_Frontpage_demo__WEBPACK_IMPORTED_MODULE_4__["turnOffDemonstration"])();

    if (word) {
      const id = word.getAttribute("id");

      if (lastId !== id) {
        const sentenceId = sentence ? sentence.getAttribute("id") : null;
        Object(documents_Read_actions_Reset__WEBPACK_IMPORTED_MODULE_1__["default"])();
        Object(documents_Read_actions_ShowWord__WEBPACK_IMPORTED_MODULE_0__["default"])(id);
        Object(documents_Read_actions_HighlightSentence__WEBPACK_IMPORTED_MODULE_2__["highlightSentence"])(sentenceId);
      }

      lastId = id;
    } else if (sentence) {
      // No translatable word, instead just highlight sentence
      const sentenceId = sentence.getAttribute("id");
      Object(documents_Read_actions_Reset__WEBPACK_IMPORTED_MODULE_1__["default"])();
      Object(documents_Read_actions_HighlightSentence__WEBPACK_IMPORTED_MODULE_2__["highlightSentence"])(sentenceId);
      lastId = 0;
    }
  }
};

const mousedown = e => {
  if (window.listenerCount > 0) {
    if (isSentenceBeingShown) {
      isSentenceBeingShown = false; // mousemove(e)

      Object(documents_Read_actions_Reset__WEBPACK_IMPORTED_MODULE_1__["default"])();
      return;
    }

    if (e.button === 2
    /*Right click*/
    || e.button === 16
    /*Shift*/
    || e.metaKey || e.altKey || e.ctrlKey) {
      lastId = 0;
      return;
    }

    let x = e.clientX;
    let y = e.clientY - 5;
    const target = document.elementFromPoint(x, y);
    const target_10px_below = document.elementFromPoint(x, y - 10);
    if (!target) return;
    const ignore = target.closest("[data-ignore]");
    if (ignore) return;
    const element = (target_10px_below === null || target_10px_below === void 0 ? void 0 : target_10px_below.closest("[data-sentence-has-definition]")) || target.closest("[data-sentence-has-definition]");
    if (!element) return;
    e.preventDefault();
    isSentenceBeingShown = true;
    const id = element.getAttribute("id");
    Object(documents_Read_actions_Reset__WEBPACK_IMPORTED_MODULE_1__["default"])();
    Object(documents_Read_actions_ShowSentence__WEBPACK_IMPORTED_MODULE_3__["showSentence"])(id);
    lastId = id;
  }
};
/*
  Thought:
  Might be used if "elementFromPoint" doesn't work on old devices.
  https://github.com/moll/js-element-from-point
*/

/***/ }),

/***/ "./src/documents/Read/Touch/Touch.js":
/*!*******************************************!*\
  !*** ./src/documents/Read/Touch/Touch.js ***!
  \*******************************************/
/*! exports provided: TouchEventListenerOn, TouchEventListenerOff */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TouchEventListenerOn", function() { return TouchEventListenerOn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TouchEventListenerOff", function() { return TouchEventListenerOff; });
/* harmony import */ var documents_Read_actions_ShowWord__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Read/actions/ShowWord */ "./src/documents/Read/actions/ShowWord.js");
/* harmony import */ var documents_Read_actions_Reset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Read/actions/Reset */ "./src/documents/Read/actions/Reset.js");
/* harmony import */ var documents_Read_actions_HighlightSentence__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! documents/Read/actions/HighlightSentence */ "./src/documents/Read/actions/HighlightSentence.js");
/* harmony import */ var documents_Read_actions_ShowSentence__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! documents/Read/actions/ShowSentence */ "./src/documents/Read/actions/ShowSentence.js");
/* harmony import */ var documents_Render_Frontpage_demo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! documents/Render/Frontpage/demo */ "./src/documents/Render/Frontpage/demo.js");
/*  _____                _
   |_   _|__  _   _  ___| |__
     | |/ _ \| | | |/ __| '_ \
     | | (_) | |_| | (__| | | |
     |_|\___/ \__,_|\___|_| |_| */





let startClickTime = null;
let lastClickTime = null;
let lastMoveTime = null;
let startLocation = null;
let lastKnownLocation = null;
let detectScrollTimer = null;
let lastEvent = null;
let lastId = null;
let isShowingSomething = false;

const reset = () => {
  lastId = null;
  isShowingSomething = false;
  Object(documents_Read_actions_Reset__WEBPACK_IMPORTED_MODULE_1__["default"])();
};

const TouchEventListenerOn = () => {
  document.addEventListener("touchstart", touchstart, {
    passive: false
  });
  document.addEventListener("touchend", touchend, {
    passive: false
  });
  document.addEventListener("touchcancel", touchend, {
    passive: false
  });
  document.addEventListener("touchmove", touchmove, {
    passive: false
  });
};
const TouchEventListenerOff = () => {
  document.removeEventListener("touchstart", touchstart, {
    passive: false
  });
  document.removeEventListener("touchend", touchend, {
    passive: false
  });
  document.removeEventListener("touchcancel", touchend, {
    passive: false
  });
  document.removeEventListener("touchmove", touchmove, {
    passive: false
  });
};
/*
  TOUCH START
*/

const touchstart = e => {
  if (!window.listenerCount) return;
  lastEvent = e;
  startClickTime = time();
  startLocation = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  };
  FindElements(e);
  detectScrollTimer = setTimeout(() => {
    detectScrollTimer = null;
    /*
      If user has been holding finger in, we prevent
      scrolling and allow him to drag over words.
    */

    e.cancelable && e.preventDefault();
  }, 300);
};
/*
  TOUCH MOVE
*/


const touchmove = e => {
  if (!window.listenerCount) return;
  lastEvent = e;
  lastKnownLocation = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  };
  /* User is scrolling */

  if (detectScrollTimer && (Math.abs(lastKnownLocation.x - startLocation.x) > 100 * window.devicePixelRatio || Math.abs(lastKnownLocation.y - startLocation.y) > 100 * window.devicePixelRatio)) {
    clearTimeout(detectScrollTimer);
    return;
  }

  FindElements(e, null, true);
};
/*
  TOUCH END
*/


const touchend = e => {
  /*
    User has been dragging finger around.
    Allow tooltip to remain.
  */
  if (time() - startClickTime > 800 && lastKnownLocation !== null) {
    return;
  }

  if (!lastKnownLocation) {
    lastKnownLocation = startLocation;
  }
};
/*
  Find element from position.
  Show words or sentences.
*/


const FindElements = (e, doubleClick = false, moving = false) => {
  const touches = e.touches;
  const fingers = touches.length;
  let x, y;
  let kind = "word";

  if (fingers === 1) {
    x = touches[0].clientX;
    y = touches[0].clientY;
    kind = "word";
  } else if (fingers === 2) {
    x = Math.round((touches[0].clientX + touches[1].clientX) / 2);
    y = Math.round((touches[0].clientY + touches[1].clientY) / 2);
    kind = "sentence";
  } else {
    return reset();
  }

  if (!x || !y) return;
  /* Prevents "The provided double value is non-finite" */

  const target = document.elementFromPoint(x, y); // console.log({x,y})

  if (!target) {
    return reset();
  }

  const ignore = target.closest("[data-ignore]");
  if (ignore) return;
  let element = target.closest(`[data-${kind}-has-definition]`);

  if (!element) {
    kind = "word"; // console.log('Finding closest')

    element = findClosestElement(x, y); // Find elements in a 20 pixel radius (TODO Needs optimizing)
  }

  if (!element) {
    return reset();
  }

  const id = element.getAttribute("id");

  if (id !== lastId) {
    if (kind === "word") {
      reset();
      Object(documents_Read_actions_ShowWord__WEBPACK_IMPORTED_MODULE_0__["default"])(id);
      const sentence = element.closest(`[data-sentence-has-definition]`);

      if (sentence) {
        const sentenceId = sentence.getAttribute("id");
        Object(documents_Read_actions_HighlightSentence__WEBPACK_IMPORTED_MODULE_2__["highlightSentence"])(sentenceId);
      }
    } else {
      reset();
      Object(documents_Read_actions_ShowSentence__WEBPACK_IMPORTED_MODULE_3__["showSentence"])(id);
    }

    isShowingSomething = kind;
    lastId = id;
    Object(documents_Render_Frontpage_demo__WEBPACK_IMPORTED_MODULE_4__["turnOffDemonstration"])();
  } else if (isShowingSomething === "word" && !moving) {
    const sentence = element.closest(`[data-sentence-has-definition]`);

    if (!sentence) {
      return reset();
    }

    const sentenceId = sentence.getAttribute("id");
    reset();
    isShowingSomething = true;
    Object(documents_Read_actions_ShowSentence__WEBPACK_IMPORTED_MODULE_3__["showSentence"])(sentenceId);
    lastId = id;
  } else if (isShowingSomething && !moving) {
    reset();
  }
};

const time = () => {
  return new Date().getTime();
};
/*
  No overlapping element; find closest element.
  TODO: Optimize!!! Save last results and reset on scroll!
*/


const limit = 20; // Minimum pixel distance

const findClosestElement = (x, y) => {
  var _distances$;

  const els = document.querySelectorAll(`[data-word-has-definition]`);
  let distances = [];
  els.forEach(el => {
    const rects = Array.from(el.getClientRects());
    rects.forEach(rect => {
      const distance_x = x < rect.x ? rect.x - x : Math.max(0, x - (rect.x + rect.width));
      const distance_y = y < rect.y ? rect.y - y : Math.max(0, y - (rect.y + rect.height));
      if (distance_x > limit || distance_y > limit) return;
      const distance = Math.sqrt(distance_x ** 2 + distance_y ** 2);
      if (distance > limit) return; // console.log({ rect, /*x, y,*/ distance_x, distance_y, distance, el })

      distances.push({
        distance,
        el
      });
    });
  });
  distances.sort((a, b) => a.distance - b.distance); // console.log(distances[0]?.el)

  return (_distances$ = distances[0]) === null || _distances$ === void 0 ? void 0 : _distances$.el;
};

/***/ }),

/***/ "./src/documents/Read/Touch/index.js":
/*!*******************************************!*\
  !*** ./src/documents/Read/Touch/index.js ***!
  \*******************************************/
/*! exports provided: TextEventListenersOn, TextEventListenersOff */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextEventListenersOn", function() { return TextEventListenersOn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextEventListenersOff", function() { return TextEventListenersOff; });
/* harmony import */ var documents_Read_Touch_Touch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Read/Touch/Touch */ "./src/documents/Read/Touch/Touch.js");
/* harmony import */ var documents_Read_Touch_Mouse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Read/Touch/Mouse */ "./src/documents/Read/Touch/Mouse.js");
/* harmony import */ var app_Analytics_TextInteractions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Analytics/TextInteractions */ "./src/app/Analytics/TextInteractions.js");
/* harmony import */ var app_App_functions_isBrowser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/App/functions/isBrowser */ "./src/app/App/functions/isBrowser.js");




const TextEventListenersOn = () => {
  try {
    window.listenerCount = 1;

    if (app_App_functions_isBrowser__WEBPACK_IMPORTED_MODULE_3__["supportsTouch"]) {
      Object(documents_Read_Touch_Touch__WEBPACK_IMPORTED_MODULE_0__["TouchEventListenerOn"])();
      app_Analytics_TextInteractions__WEBPACK_IMPORTED_MODULE_2__["default"].setTouchMode();
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList && document.body.classList.add("supports-touch");
      });
    } else {
      Object(documents_Read_Touch_Mouse__WEBPACK_IMPORTED_MODULE_1__["MouseEventListenerOn"])();
    }
  } catch (e) {
    console.error(e);
  }
};
const TextEventListenersOff = () => {
  if (app_App_functions_isBrowser__WEBPACK_IMPORTED_MODULE_3__["supportsTouch"]) {
    Object(documents_Read_Touch_Touch__WEBPACK_IMPORTED_MODULE_0__["TouchEventListenerOff"])();
  } else {
    Object(documents_Read_Touch_Mouse__WEBPACK_IMPORTED_MODULE_1__["MouseEventListenerOff"])();
  }
};

/***/ }),

/***/ "./src/documents/Read/actions/HighlightSentence.js":
/*!*********************************************************!*\
  !*** ./src/documents/Read/actions/HighlightSentence.js ***!
  \*********************************************************/
/*! exports provided: highlightSentence */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "highlightSentence", function() { return highlightSentence; });
/* harmony import */ var _Reset__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Reset */ "./src/documents/Read/actions/Reset.js");

/*
  Hightlight sentence
*/

const highlightSentence = id => {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.add("highlighted");
  Object(_Reset__WEBPACK_IMPORTED_MODULE_0__["logShown"])(id);
};

/***/ }),

/***/ "./src/documents/Read/actions/Reset.js":
/*!*********************************************!*\
  !*** ./src/documents/Read/actions/Reset.js ***!
  \*********************************************/
/*! exports provided: logShown, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logShown", function() { return logShown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return reset; });
/* harmony import */ var documents_Render_Audio_AudioClip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Render/Audio/AudioClip */ "./src/documents/Render/Audio/AudioClip.js");
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var app_Analytics_TextInteractions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/Analytics/TextInteractions */ "./src/app/Analytics/TextInteractions.js");



var shownElements = [];
const logShown = id => {
  shownElements.push(id);
};
/*
  Reset
*/

function reset() {
  documents_Render_Audio_AudioClip__WEBPACK_IMPORTED_MODULE_0__["default"].pause();
  app_Analytics_TextInteractions__WEBPACK_IMPORTED_MODULE_2__["default"].reset();
  shownElements.forEach(id => {
    // console.log(id)
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("shown");
    el.classList.remove("highlighted");
    el.classList.remove("hover");
  });
  shownElements = [];

  if (Array.from(document.body.classList).includes("sentence-shown")) {
    app_App_store__WEBPACK_IMPORTED_MODULE_1__["default"].dispatch({
      type: "CLEAR_SENTENCE"
    });
    document.body.classList.remove("sentence-shown");
  }
}

/***/ }),

/***/ "./src/documents/Read/actions/ShowSentence.js":
/*!****************************************************!*\
  !*** ./src/documents/Read/actions/ShowSentence.js ***!
  \****************************************************/
/*! exports provided: showSentence */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showSentence", function() { return showSentence; });
/* harmony import */ var documents_Render_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Render/helpers.js */ "./src/documents/Render/helpers.js");
/* harmony import */ var documents_Render_Audio_ReadAlong__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Render/Audio/ReadAlong */ "./src/documents/Render/Audio/ReadAlong.js");
/* harmony import */ var _Reset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Reset */ "./src/documents/Read/actions/Reset.js");
/* harmony import */ var app_Analytics_TextInteractions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/Analytics/TextInteractions */ "./src/app/Analytics/TextInteractions.js");




/*
  Show sentence
*/

const showSentence = id => {
  document.body.classList && document.body.classList.add("sentence-shown");
  const relative = document.getElementById("content").getBoundingClientRect();
  Object(documents_Render_Audio_ReadAlong__WEBPACK_IMPORTED_MODULE_1__["ReadAlongSingleSentence"])(id);
  /*
    SENTENCE
  */

  const sentence = document.getElementById(id);
  if (!sentence) return;
  sentence.classList.add("shown");
  Object(_Reset__WEBPACK_IMPORTED_MODULE_2__["logShown"])(id);
  const sentenceRect = sentence.getBoundingClientRect();
  /*
    SENTENCE OVERLAY
  */

  const sentenceOverlay = document.getElementById(`${id}-sentence-overlay`);
  sentenceOverlay.classList.add("shown");
  Object(_Reset__WEBPACK_IMPORTED_MODULE_2__["logShown"])(`${id}-sentence-overlay`);
  const paddingTop = 8;
  const paddingLeft = 12;
  let sentenceOverlayDimensions = {
    top: sentenceRect.top - relative.top - paddingTop,
    height: sentenceRect.height + paddingTop * 2,
    left: sentenceRect.left - relative.left - paddingLeft,
    width: sentenceRect.width + paddingLeft * 2
  };
  /*
    BOX
  */

  const box = document.getElementById(`${id}-box`);
  box.classList.add("shown");
  Object(_Reset__WEBPACK_IMPORTED_MODULE_2__["logShown"])(`${id}-box`);
  box.style.cssText = `
    left: ${sentenceOverlayDimensions.left}px;
    width: ${sentenceOverlayDimensions.width}px;
  `;
  let boxRect = box.getBoundingClientRect();
  box.style.cssText += `
    top: ${sentenceOverlayDimensions.top - boxRect.height}px;
    height: ${boxRect.height}px;
  `;
  /*
    Do we need to scroll to element?
  */

  boxRect = box.getBoundingClientRect(); // Recalculate after style change

  if (boxRect.y < 0) {
    Object(documents_Render_helpers_js__WEBPACK_IMPORTED_MODULE_0__["getScrollingElement"])().scrollBy({
      top: boxRect.y,
      behavior: "smooth"
    });
  }

  sentenceOverlay.style.cssText = `
    top: ${sentenceOverlayDimensions.top}px;
    height: ${sentenceOverlayDimensions.height}px;
    left: ${sentenceOverlayDimensions.left}px;
    width: ${sentenceOverlayDimensions.width}px;
  `;
  app_Analytics_TextInteractions__WEBPACK_IMPORTED_MODULE_3__["default"].show({
    type: "sentence",
    id
  });
};

/***/ }),

/***/ "./src/documents/Read/actions/ShowWord.js":
/*!************************************************!*\
  !*** ./src/documents/Read/actions/ShowWord.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return showWord; });
/* harmony import */ var documents_Read_actions_TooltipPosition__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Read/actions/TooltipPosition */ "./src/documents/Read/actions/TooltipPosition.js");
/* harmony import */ var documents_Render_Audio_AudioClip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Render/Audio/AudioClip */ "./src/documents/Render/Audio/AudioClip.js");
/* harmony import */ var _Reset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Reset */ "./src/documents/Read/actions/Reset.js");
/* harmony import */ var app_Analytics_TextInteractions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/Analytics/TextInteractions */ "./src/app/Analytics/TextInteractions.js");
/* harmony import */ var documents_Render_Elements_Inflection_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! documents/Render/Elements/Inflection/actions */ "./src/documents/Render/Elements/Inflection/actions.js");





/*
  Keep track of which ID is currently shown.
  If the user is moving his curser too rapidly,
  main funciton may still be working on an old word.
*/

let currentId;
/*
  Show word
*/

function showWord(id) {
  currentId = id; // console.log(id)

  const tooltip = document.getElementById(`${id}-tooltip`);
  if (!tooltip) return;
  tooltip.classList.add("shown");
  Object(_Reset__WEBPACK_IMPORTED_MODULE_2__["logShown"])(`${id}-tooltip`);
  if (id !== currentId) return;
  /* Exit if we're behind schedule */

  const element = document.getElementById(id);
  if (!element) return;
  element.classList.add("hover");
  Object(_Reset__WEBPACK_IMPORTED_MODULE_2__["logShown"])(id);
  if (id !== currentId) return;
  /* Exit if we're behind schedule */

  let sound_files = element.getAttribute("data-sound");

  if (sound_files) {
    documents_Render_Audio_AudioClip__WEBPACK_IMPORTED_MODULE_1__["default"].play(sound_files.split(","));
  }

  if (id !== currentId) return;
  /* Exit if we're behind schedule */

  const connected = element.getAttribute("data-connected-words");

  if (connected) {
    connected.split(",").forEach(i => {
      addClass(i, "hover");
      Object(_Reset__WEBPACK_IMPORTED_MODULE_2__["logShown"])(i);
    });
  }
  /*
    Temporary: Inflection tables. Need to be moved into the compilation step.
  */


  const BIN_id = element.getAttribute("data-analysis");

  if (BIN_id) {
    Object(documents_Render_Elements_Inflection_actions__WEBPACK_IMPORTED_MODULE_4__["ShowInflectionTable"])(BIN_id);
  }

  if (id !== currentId) return;
  /* Exit if we're behind schedule */

  const {
    top,
    left
  } = Object(documents_Read_actions_TooltipPosition__WEBPACK_IMPORTED_MODULE_0__["default"])({
    relative: document.getElementById("content").getBoundingClientRect(),
    // The text container will have "position:relative"
    tooltip: tooltip.getBoundingClientRect(),
    sentence: element.getBoundingClientRect() // sentence_multiple_lines: this.props.clientRects || null

  });
  tooltip.style.top = Math.round(top) + "px";
  tooltip.style.left = Math.round(left) + "px";
  addClass(`${id}-box`, "shown");
  Object(_Reset__WEBPACK_IMPORTED_MODULE_2__["logShown"])(`${id}-box`);
  app_Analytics_TextInteractions__WEBPACK_IMPORTED_MODULE_3__["default"].show({
    type: "word",
    id
  });
}

const addClass = (id, css) => {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.add(css);
};

/***/ }),

/***/ "./src/documents/Read/actions/TooltipPosition.js":
/*!*******************************************************!*\
  !*** ./src/documents/Read/actions/TooltipPosition.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FindAGoodPositionForTooltip; });
const padding = {
  left: 2,
  top: 2
};
function FindAGoodPositionForTooltip({
  relative,
  tooltip,
  sentence,
  sentence_multiple_lines
}) {
  if (!tooltip) return {
    top: undefined,
    left: undefined,
    arrow: undefined
  }; // let possibilities = []

  const addition = window.location.pathname.startsWith("/tweets") ? -20 : 0;
  const ofan = {
    top: sentence.top - tooltip.height - padding.top - relative.top + addition,
    left: Math.min(window.innerWidth - tooltip.width, Math.max(window.pageXOffset, sentence.left + sentence.width / 2 - tooltip.width / 2 - relative.left + addition)),
    scoreMultiplier: 2,
    arrow: "down"
  };
  return ofan; // if(ofan.top >= window.pageYOffset ) {
  //   return ofan
  // } else {
  //   return {
  //     ...ofan,
  //     top: sentence.top + sentence.height + padding.top - relative.top + addition,
  //   }
  // }
  // Neðan
  // possibilities.push({
  //   top: sentence.top + sentence.height + padding.top,
  //   left: sentence.left + sentence.width / 2 - tooltip.width / 2,
  //   scoreMultiplier: 1,
  //   arrow: 'up'
  // })
  // console.log(sentence.top)
  // console.log(tooltip.height)
  // Ofan
  // possibilities.push({
  //   top: sentence.top - tooltip.height - padding.top,
  //   left: Math.max(window.pageXOffset, sentence.left + sentence.width / 2 - tooltip.width / 2),
  //   scoreMultiplier: 2,
  //   arrow: 'down'
  // })
  // // Neðan
  // possibilities.push({
  //   top: sentence.top + sentence.height + padding.top,
  //   left: sentence.left + sentence.width / 2 - tooltip.width / 2,
  //   scoreMultiplier: 1,
  //   arrow: 'up'
  // })
  // // Vinstri
  // possibilities.push({
  //   top: sentence.top + sentence.height / 2 - tooltip.height / 2,
  //   left: sentence.left - tooltip.width - padding.left,
  //   scoreMultiplier: 1,
  //   arrow: 'right'
  // })
  //
  // // Hægri
  // possibilities.push({
  //   top: sentence.top + sentence.height / 2 - tooltip.height / 2,
  //   left: sentence.left + sentence.width + padding.left,
  //   scoreMultiplier: 1,
  //   arrow: 'left'
  // })
  //
  // // Multiline
  // if (sentence_multiple_lines && sentence_multiple_lines.length > 1) {
  //   const firstInline = sentence_multiple_lines[0]
  //   const lastInline = sentence_multiple_lines[sentence_multiple_lines.length - 1]
  //
  //   // Ofan fyrstu
  //   possibilities.push({
  //     top: firstInline.top - tooltip.height - padding.top,
  //     left: firstInline.left + firstInline.width / 2 - tooltip.width / 2,
  //     scoreMultiplier: 4,
  //     arrow: 'down'
  //   })
  //
  //   // Hægri fyrstu
  //   possibilities.push({
  //     top: firstInline.top + firstInline.height / 2 - tooltip.height / 2,
  //     left: firstInline.left + firstInline.width + padding.left,
  //     scoreMultiplier: 1,
  //     arrow: 'left'
  //   })
  //
  //   // Vinstri fyrstu
  //   possibilities.push({
  //     top: firstInline.top + firstInline.height - tooltip.height,
  //     left: firstInline.left - tooltip.width - padding.left,
  //     scoreMultiplier: 10,
  //     arrow: 'bottomright'
  //   })
  //
  //
  //   // Neðan síðustu
  //   possibilities.push({
  //     top: lastInline.top + lastInline.height + padding.top,
  //     left: lastInline.left + lastInline.width / 2 - tooltip.width / 2,
  //     scoreMultiplier: 1,
  //     arrow: 'up'
  //   })
  //
  //   // Hægri síðustu
  //   possibilities.push({
  //     top: lastInline.top,
  //     left: lastInline.left + lastInline.width + padding.left,
  //     scoreMultiplier: 1,
  //     arrow: 'topleft'
  //   })
  //
  //   // Vinstri síðustu
  //   possibilities.push({
  //     top: lastInline.top + lastInline.height / 2 - tooltip.height / 2,
  //     left: lastInline.left - tooltip.width - padding.left,
  //     scoreMultiplier: 1,
  //     arrow: 'right'
  //   })
  // }
  // return possibilities.map(position => {
  //   let score = position.scoreMultiplier
  //
  //   if (
  //     position.top < relative.top || // Top
  //       position.left < relative.left || // Left
  //       position.top + tooltip.height > relative.top + relative.height || // Bottom
  //       position.left + tooltip.width > relative.left + relative.width // Right
  //   ) {
  //     score = 0
  //   }
  //
  //   // Hlutfall Y miðju frá gluggamiðju
  //   const Y_ratio = (position.top + tooltip.height / 2) /
  //       (relative.top + relative.height / 2)
  //
  //   // Hlutfall X miðju frá gluggamiðju
  //   const X_ratio = (position.left + tooltip.width / 2) /
  //       (relative.left + relative.width / 2)
  //
  //   score = score
  //       // Snúa hlutfalli við ef það er meira en 1
  //       * (X_ratio > 1 ? 1 / X_ratio : X_ratio)
  //       // Viljum frekar að það sé fyrir ofan, hlutfallið skekkist því aðeins
  //       * (Y_ratio > 1 ? 1.5 / Y_ratio : Y_ratio)
  //
  //   return {
  //     ...position,
  //     top: position.top - relative.top,
  //     left: position.left - relative.left,
  //     score
  //   }
  // })
  //   .reduce((prev, cur) => { return prev.score > cur.score ? prev : cur }) // Skila vinsælasta gæjanum
}

/***/ }),

/***/ "./src/documents/Render/Attribution.js":
/*!*********************************************!*\
  !*** ./src/documents/Render/Attribution.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// /*
//   Adds attribution notices to the footer of the site
// */
//
// export default () => {
//   $('#catlinks').before('<div id="license" class="license"></div>')
//
//   /* CC0 */
//   if(mw.config.get('wgCategories').includes('CC0')) {
//     $('#license').append('<div>You are free to republish this article. <a href="https://creativecommons.org/publicdomain/zero/1.0/" class="license-link" rel="noopener">CC0</a></div>')
//   }
//   /* CC BY */
//   if(mw.config.get('wgCategories').includes('CC BY')) {
//     $('#license').append('<div>You are free to republish this article. <a href="https://creativecommons.org/licenses/by/4.0/legalcode" class="license-link" rel="noopener">CC BY</a></div>')
//   }
//   /* CC BY-SA */
//   if(mw.config.get('wgCategories').includes('CC BY-SA')) {
//     $('#license').append('<div>You are free to republish this article. <a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode" class="license-link" rel="noopener">CC BY-SA</a></div>')
//   }
// }
//
//
// /*
//   Attribution for audio
// */
// let done = []
// export const soundAttribution = ({ filename }) => {
//   /* Attribution for ISLEX audio recordings */
//   if(filename && filename.match(/islex/) && !done.includes('islex')) {
//     $('#license').append('<div>Short audio recordings from the <a rel="noopener" href="http://malfong.is/?pg=islexrecordings&amp;lang=en">ISLEX project</a>. <a rel="noopener" href="https://creativecommons.org/licenses/by-nc-nd/4.0/" class="license-link">CC BY-NC-ND</a>')
//     done.push('islex')
//   }
// }

/***/ }),

/***/ "./src/documents/Render/Audio/AudioClip.js":
/*!*************************************************!*\
  !*** ./src/documents/Render/Audio/AudioClip.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var documents_Render_Attribution__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Render/Attribution */ "./src/documents/Render/Attribution.js");
/* harmony import */ var documents_Render_Attribution__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(documents_Render_Attribution__WEBPACK_IMPORTED_MODULE_1__);


/*
  Short audio clips, like words on hover, that do not require an audio player interface
*/

let audio;
const AudioClip = {
  play: sound_files => {
    if (app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].getState().speed_reader.started) return;
    audio && audio.pause();
    let file;

    if (Array.isArray(sound_files)) {
      file = sound_files[0];
    } else if (/, /.test(sound_files)) {
      file = sound_files.split(", ")[0];
    } else {
      file = sound_files;
    }

    Object(documents_Render_Attribution__WEBPACK_IMPORTED_MODULE_1__["soundAttribution"])({
      filename: file
    });
    /* If we need to attribute a third party */

    audio = new Audio(file);
    const promise = audio.play();

    if (promise) {
      promise.catch(e => {
        console.warn(e); // console.warn('Audio not played since user has not yet interacted with document')
      });
    }

    app_App_store__WEBPACK_IMPORTED_MODULE_0__["default"].dispatch({
      type: "CURRENTLY_PLAYING",
      content: file
    });
  },
  pause: () => {
    audio && audio.pause();
    audio = null;
  }
};
/* harmony default export */ __webpack_exports__["default"] = (AudioClip);

/***/ }),

/***/ "./src/documents/Render/Audio/KeyboardListener.js":
/*!********************************************************!*\
  !*** ./src/documents/Render/Audio/KeyboardListener.js ***!
  \********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ReadAlong__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ReadAlong */ "./src/documents/Render/Audio/ReadAlong.js");
 // import { getAudioElement, pausePlay, updateInterface } from './AudioPlayer'
// /*
//   KEYBOARD LISTENER
// */
// window.addEventListener('keydown', (e) => {
//   const audioElement = getAudioElement()
//   if (!audioElement) return;
//
//   // Space bar
//   if (e.keyCode === 32) {
//     pausePlay()
//     if (!document.querySelector(':focus,:active')) {
//       e.preventDefault()
//     }
//   }
//
//   /*
//     Skip 10 seconds ahead with Left/Right arrows.
//     TODO: This should ideally jump forwards to NEXT SENTENCE,
//           not just based on seconds. But this functionaily is
//           probably not necessary.
//   */
//   // Left
//   else if (e.keyCode === 37) {
//     audioElement.currentTime -= 10 // Skip 10 seconds backwards
//   }
//   // Right
//   else if (e.keyCode === 39) {
//     audioElement.currentTime += 10 // Skip 10 seconds ahead
//   }
//
//   // Escape|
//   else if (e.keyCode === 27) {
//     reset()
//   }
// })

/***/ }),

/***/ "./src/documents/Render/Audio/ReadAlong.js":
/*!*************************************************!*\
  !*** ./src/documents/Render/Audio/ReadAlong.js ***!
  \*************************************************/
/*! exports provided: ReadAlong, ReadAlongSetup, reset, ReadAlongSingleSentence, ReadAlongMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReadAlong", function() { return ReadAlong; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReadAlongSetup", function() { return ReadAlongSetup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reset", function() { return reset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReadAlongSingleSentence", function() { return ReadAlongSingleSentence; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReadAlongMessage", function() { return ReadAlongMessage; });
/* harmony import */ var documents_Render_Audio_Scroll_ScrollIntoView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Render/Audio/Scroll/ScrollIntoView */ "./src/documents/Render/Audio/Scroll/ScrollIntoView.js");
/* harmony import */ var documents_Render_helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Render/helpers.js */ "./src/documents/Render/helpers.js");
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_3__);




/*
  Hasten all times by X seconds. It may be better to be a little quick,
  to make the reader focus on the word before hearing the audio.

  (May not be necessary)
*/
// let time_shift = 0 // +0.050

/*

  List will be on this format, a list of timestamps
  and the elements that should be shown at that time:

  [{ begin: 0.000, end: 1.930, elements: [s0,w1] },
   { begin: 1.930, end: 2.315, elements: [s0,w2] }]

*/

let list = {};
let sentences = {};
let started = false;
let previous = {
  elements: []
};
let timer;
let currentAudioId;
/**
  ____  _____    _    ____       _    _     ___  _   _  ____
 |  _ \| ____|  / \  |  _ \     / \  | |   / _ \| \ | |/ ___|
 | |_) |  _|   / _ \ | | | |   / _ \ | |  | | | |  \| | |  _
 |  _ <| |___ / ___ \| |_| |  / ___ \| |__| |_| | |\  | |_| |
 |_| \_\_____/_/   \_\____/  /_/   \_\_____\___/|_| \_|\____|

  - audio: Will be the audio element
  - type: Can be [play, pause]
*/

const ReadAlong = (audio, type, filename) => {
  // console.log(filename)
  currentAudioId = filename;
  if (!list[currentAudioId]) return; // Play

  if (type === "play") {
    const time = audio.currentTime;

    if (!previous.begin || !(previous.begin <= time && (time < previous.end || previous.end === null))) {
      const auto = !audio.paused;
      /*&& type !== 'scrub'*/

      timer && clearTimeout(timer);
      Show(FindIndexFromTime(time), time, auto);
    }

    started = true;
  } // Pause
  else if (type === "pause") {
      timer && clearTimeout(timer);
    }
};
const ReadAlongSetup = () => {
  const {
    long_audio
  } = app_App_store__WEBPACK_IMPORTED_MODULE_2__["default"].getState().data;

  for (const filename in long_audio) {
    const synclist = long_audio[filename].sync.list;
    list[filename] = synclist;
    /* Temp solution, would be better to do this in the audio synchronization step */

    synclist.forEach(section => {
      section.elements.forEach(element => {
        if (!sentences[element]) {
          sentences[element] = {
            filename,
            begin: section.begin,
            end: section.end
          };
        } else {
          sentences[element]["end"] = section.end;
        }
      });
    });
  }
};
/*
  Find elements that should be shown at this timeout
*/

const FindIndexFromTime = time => {
  return list[currentAudioId].findIndex(({
    begin,
    end
  }) => {
    return begin <= time && (time < end || end === null);
  });
};

const FindIndexRangeFromID = id => {
  return {
    first: list[currentAudioId].findIndex(({
      elements
    }) => {
      return elements.includes(id);
    }),
    last: list[currentAudioId].length - 1 - list[currentAudioId].slice().reverse().findIndex(({
      elements
    }) => {
      return elements.includes(id);
    })
  };
};
/*
  Show the elements for this time.
  Set timer to repeat the process.
*/


const Show = (index, time, auto = true) => {
  const current = list[currentAudioId][index] || {
    elements: []
  };
  Object(documents_Render_Audio_Scroll_ScrollIntoView__WEBPACK_IMPORTED_MODULE_0__["default"])(current.elements.filter(i => previous.elements.indexOf(i) === -1));
  Object(documents_Render_helpers_js__WEBPACK_IMPORTED_MODULE_1__["addClass"])(current.elements.filter(i => previous.elements.indexOf(i) === -1), "audioPlaying");
  Object(documents_Render_helpers_js__WEBPACK_IMPORTED_MODULE_1__["removeClass"])(previous.elements.filter(i => current.elements.indexOf(i) === -1), "audioPlaying");

  if (auto && index < list[currentAudioId].length) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      Show(index + 1);
    }, (current.end - (time || current.begin)) * 1000);
  }

  previous = current;
};

const reset = () => {
  Object(documents_Render_helpers_js__WEBPACK_IMPORTED_MODULE_1__["removeClass"])(previous.elements);
  previous = {
    elements: []
  };
};
/*
  Play audio for a single sentence
*/

const ReadAlongSingleSentence = id => {
  // console.log(sentences[id])
  if (sentences[id]) {
    app_App_store__WEBPACK_IMPORTED_MODULE_2__["default"].dispatch({
      type: "PLAY_SENTENCE",
      filename: sentences[id].filename,
      begin: sentences[id].begin,
      end: sentences[id].end
    });
  }
};
/*
  TEMPORARY SOLUTION
  A very crude solution for finding which audio sections should be played
*/

const ReadAlongMessage = (message, audioId) => {
  if (!message) return;
  const ids = message.match(/ id=".+?"/g).map(i => i.match(/id="(.+?)"/)[1]); // console.log(message)
  // console.log(ids)

  let begins = [];
  let ends = [];
  ids.forEach(id => {
    if (sentences[id]) {
      begins.push(sentences[id].begin);
      ends.push(sentences[id].end);
    }
  }); // console.log({
  //   begins,ends,
  //   begin: begins.sort((a,b)=>a-b)[0],
  //   end: ends.sort((a,b)=>b-a)[0],
  // })
  // return

  app_App_store__WEBPACK_IMPORTED_MODULE_2__["default"].dispatch({
    type: "PLAY_SENTENCE",
    audioId,
    begin: begins.sort((a, b) => a - b)[0],
    end: ends.sort((a, b) => b - a)[0]
  });
};
/******** Stuff in development: ********/

/*
  // Highlight adjacent words
  // Might give the text reading a bit more flow.
  // (This has been temporarily removed since this style is not currently desireable)
  // To use this, add the following to the "Show()" function:
  //
  //      PreviewPrevious(index - 1)
  //      PreviewNext(index + 1)
  //

  let previous_PreviewNext = { elements: [] }
  const PreviewNext = (index, time, auto = true) => {
    const current = list[audioId][index] || { elements: [] }
    addClass(current.elements.filter(i => previous_PreviewNext.elements.indexOf(i) === -1), 'previewNext')
    removeClass(previous_PreviewNext.elements.filter(i => current.elements.indexOf(i) === -1), 'previewNext')
    previous_PreviewNext = current
  }

  let previous_PreviewPrevious = { elements: [] }
  const PreviewPrevious = (index, time, auto = true) => {
    const current = list[audioId][index] || { elements: [] }
    addClass(current.elements.filter(i => previous_PreviewPrevious.elements.indexOf(i) === -1), 'previewNext')
    removeClass(previous_PreviewPrevious.elements.filter(i => current.elements.indexOf(i) === -1), 'previewNext')
    previous_PreviewPrevious = current
  }
*/

/*
  // Dev testing for seeing events fired by audio

  setTimeout(() => {
   const myObj = document.querySelector('audio[data-id]')

   // myObj.addEventListener("pause", ()=>console.log('haha'));

   const myFunction = (event) => {
     console.log(event.type + " is fired")
   }
   for (var key in myObj) {
     if (key.search('on') === 0) {
       if (key === 'onmousemove') return
       if (key === 'onpointermove') return
       myObj.addEventListener(key.slice(2), myFunction)
     }
   }
  }, 300)
*/
//
// const myObj = document.querySelector('audio > source')
// for (var key in myObj) {
//   if (key.search('on') === 0) {
//     console.log(key)
//   }
// }

/***/ }),

/***/ "./src/documents/Render/Audio/Scroll/ScrollIntoView.js":
/*!*************************************************************!*\
  !*** ./src/documents/Render/Audio/Scroll/ScrollIntoView.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ScrollIntoView; });
/* harmony import */ var _SmoothScroll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SmoothScroll */ "./src/documents/Render/Audio/Scroll/SmoothScroll.js");
/* harmony import */ var documents_Render_helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Render/helpers.js */ "./src/documents/Render/helpers.js");


const ControlsHeight = 45;
/*
  Calculates ideal position for element.

  Note: Currently assumes document fills entire window, is okay as long as the window is always the scrollable element.
*/

function ScrollIntoView(ids) {
  if (!ids) return;
  ids = Array.isArray(ids) ? ids : [ids];
  ids.forEach(id => {// const element = document.getElementById(id)
    // if (!element) return;
    // element.classList.add(cssClass)
  });
  const id = ids[ids.length - 1];
  const element = document.getElementById(id);
  if (!element) return;
  const elementRect = element.getBoundingClientRect(); // const containerRect = getScrollingElement().getBoundingClientRect()
  // console.log(containerRect)
  // const topOfScreenOrContainer = Math.max(0, containerRect.y)
  // const topOfScreenOrContainerWithControls = topOfScreenOrContainer + ControlsHeight
  // const bottomOfScreenOrContainer = Math.min(window.innerHeight, topOfScreenOrContainer + containerRect.height)
  //
  // const isAbove = topOfScreenOrContainerWithControls >= elementRect.y - 100
  // const isBelow = bottomOfScreenOrContainer <= elementRect.y + elementRect.height + 100
  //
  // let idealPosition = 15 / 100 * (bottomOfScreenOrContainer - topOfScreenOrContainerWithControls)
  // idealPosition = Math.max(100, idealPosition)
  // const idealPositionChange = parseInt(elementRect.y - idealPosition)
  // console.log({isAbove, isBelow})

  const isAbove = ControlsHeight >= elementRect.y - 100;
  const isBelow = window.innerHeight <= elementRect.y + elementRect.height + 100;
  let idealPosition = 15 / 100 * (window.innerHeight - ControlsHeight);
  idealPosition = Math.max(100, idealPosition);
  const idealPositionChange = parseInt(elementRect.y - idealPosition);
  _SmoothScroll__WEBPACK_IMPORTED_MODULE_0__["default"].scroll(idealPositionChange, isAbove || isBelow);
} // function getScrollParent(node) {
//   if (node === null) {
//     return null;
//   }
//   // console.log(node.scrollHeight)
//   if (node.scrollHeight > node.clientHeight) {
//     return node;
//   } else {
//     return getScrollParent(node.parentNode);
//   }
// }

/***/ }),

/***/ "./src/documents/Render/Audio/Scroll/SmoothScroll.js":
/*!***********************************************************!*\
  !*** ./src/documents/Render/Audio/Scroll/SmoothScroll.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var documents_Render_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Render/helpers.js */ "./src/documents/Render/helpers.js");

let allowed = true;
let temporaryStop;
/*
  Scrolls to position, but only if the
  user hasn't recently been scrolling himself
*/

const SmoothScroll = {
  scroll: (change, isHidden) => {
    if (!isHidden) return;
    if (!allowed) return;
    Object(documents_Render_helpers_js__WEBPACK_IMPORTED_MODULE_0__["getScrollingElement"])().scrollBy({
      top: change,
      behavior: "smooth"
    });
  },
  allow: () => {
    allowed = true;
    temporaryStop && clearTimeout(temporaryStop);
  },
  stop: () => {
    allowed = false;
    temporaryStop && clearTimeout(temporaryStop);
    temporaryStop = setTimeout(() => {
      allowed = true;
    }, 3 * 1000);
  }
};
/*
  Listen for user's scroll.
  We don't want to interrupt it and so stop
  all auto-scrolling for a few seconds afterwards.
*/

typeof window !== "undefined" && window.addEventListener("mousewheel", () => SmoothScroll.stop(), false);
/* harmony default export */ __webpack_exports__["default"] = (SmoothScroll);
/**********************************
  Safari does not have built in smooth scrolling.
  This was an attempt at supporting it,
  but didn't always work.
  (Sometimes the timer became very very slow for some reason)
***********************************/
// let allowed = true
// let timer
// let temporaryStop
// let lastGoal = null
//
// window.addEventListener('mousewheel', () => { SmoothScroll.stop() }, false)
//
// const SmoothScroll = {
//   scroll: (change, isHidden) => {
//     console.warn('FIRED')
//     if (!isHidden) return;
//     if (!allowed) return;
//
//     let start = getScrollingElement().scrollTop
//     let currentTime = 0
//     let increment = 20
//     let duration = 500
//     let goal = start + change
//
//     if (Math.abs(change) < 10) return;
//     if (Math.abs(lastGoal - goal) < 100) return;
//     console.error({goal, lastGoal})
//
//     /*
//       Note:
//       All browsers except Safari support "scrollBy({behaviour:'smooth'})".
//       Therefore we write our own smooth scroll.
//     */
//     const animateScroll = () => {
//       if (!allowed) return;
//       currentTime += increment
//       // var delta = Math.easeInOutQuad(currentTime, 0, change, duration)
//       var delta = currentTime / duration * change
//
//       console.log({currentTime, duration, change, delta: delta.toFixed(0)})
//       getScrollingElement().scrollTop = start + delta
//       if (currentTime < duration) {
//         timer && clearTimeout(timer)
//         timer = setTimeout(animateScroll, increment)
//       } else {
//         lastGoal = null
//       }
//     }
//     animateScroll()
//     lastGoal = goal
//   },
//
//   allow: () => {
//     allowed = true
//     temporaryStop && clearTimeout(temporaryStop)
//   },
//
//   stop: () => {
//     // allowed = false
//     // timer && clearTimeout(timer)
//     // temporaryStop && clearTimeout(temporaryStop)
//     // temporaryStop = setTimeout(() => {
//     //   allowed = true
//     // }, 3 * 1000)
//   },
// }
//
// export default SmoothScroll
//
//
// /*
//   t = current time
//   b = start value
//   c = end value
//   d = duration
// */
// Math.easeInOutQuad = function(t, b, c, d) {
//   t /= d / 2;
//   if (t < 1) return c / 2 * t * t + b;
//   t--;
//   return -c / 2 * (t * (t - 2) - 1) + b;
// }

/***/ }),

/***/ "./src/documents/Render/Audio/index.js":
/*!*********************************************!*\
  !*** ./src/documents/Render/Audio/index.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ReadAlong__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ReadAlong */ "./src/documents/Render/Audio/ReadAlong.js");
/* harmony import */ var _Scroll_SmoothScroll__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Scroll/SmoothScroll */ "./src/documents/Render/Audio/Scroll/SmoothScroll.js");
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var documents_Render_Elements_parse__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! documents/Render/Elements/parse */ "./src/documents/Render/Elements/parse.js");
/* harmony import */ var react_tap_or_click__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-tap-or-click */ "react-tap-or-click");
/* harmony import */ var react_tap_or_click__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_tap_or_click__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var app_App_Error__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/App/Error */ "./src/app/App/Error/index.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











__webpack_require__(/*! ./KeyboardListener */ "./src/documents/Render/Audio/KeyboardListener.js");

__webpack_require__(/*! array-sugar */ "array-sugar");

let timer;

class Audio extends react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent {
  // Keep count on how often we have re-attempted reloading file
  constructor(props) {
    super(props);

    _defineProperty(this, "errorCount", 0);

    _defineProperty(this, "componentDidMount", () => {
      const {
        video
      } = this.state.data; // /* Autoplay video */
      // if(video) {
      //   this.pausePlayButton()
      // }
    });

    _defineProperty(this, "componentDidUpdate", prevProps => {
      const audio = this.audio.current;
      /* Pause if another audio element has taken over */

      if (this.props.audio.currentlyPlaying !== this.state.data.filename) {
        this.setState({
          playing: false
        });
        audio && audio.pause();
      } else if (this.props.audio.begin !== prevProps.audio.begin) {
        if (this.props.audio.end === null) {
          timer && clearTimeout(timer);
          this.setState({
            stopAt: null
          });
        } else {
          console.log(this.props.audio.begin);
          audio.currentTime = this.props.audio.begin;
          audio && audio.play();
          this.setState({
            stopAt: this.props.audio.end - 0.05
          });
        }
      }
    });

    _defineProperty(this, "pausePlayButton", () => {
      const audio = this.audio.current;

      if (audio.duration - audio.currentTime < 0.3) {
        audio.currentTime = 0;
      }

      if (audio.paused || audio.currentTime === 0) {
        audio && audio.play();
        this.setState({
          playing: true,
          stopAt: null
        });
        this.updateStore();
      } else {
        audio && audio.pause();
        this.setState({
          playing: false,
          stopAt: null
        });
      }
    });

    _defineProperty(this, "playing", event => {
      const audio = this.audio.current;
      event.persist();
      Object(_ReadAlong__WEBPACK_IMPORTED_MODULE_3__["ReadAlong"])(audio, "play", this.state.data.filename);

      if (audio.duration - audio.currentTime > 0.2) {
        // More than 0.1 seconds left
        this.setState({
          currentTimePercentage: audio.currentTime / audio.duration * 100
        });
      } else {
        this.setState({
          currentTimePercentage: 0
        });
      }

      this.updateStore();
      this.setState({
        playing: true
      });

      if (this.state.stopAt) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          audio.pause();
          this.setState({
            playing: false,
            stopAt: null
          });
        }, (this.state.stopAt - audio.currentTime) * 1000);
      }
    });

    _defineProperty(this, "loading", event => {
      const audio = this.audio.current;
      this.setState({
        loading: true
      });
    });

    _defineProperty(this, "canplay", event => {
      const audio = this.audio.current;
      this.setState({
        loading: false
      });
    });

    _defineProperty(this, "play", event => {
      event && event.persist();
      _Scroll_SmoothScroll__WEBPACK_IMPORTED_MODULE_4__["default"].allow();
      Object(_ReadAlong__WEBPACK_IMPORTED_MODULE_3__["ReadAlong"])(this.refs.audio, "play", this.state.data.filename);
      this.updateStore();
      this.setState({
        playing: true
      });
    });

    _defineProperty(this, "pause", event => {
      event.persist();
      _Scroll_SmoothScroll__WEBPACK_IMPORTED_MODULE_4__["default"].stop();
      Object(_ReadAlong__WEBPACK_IMPORTED_MODULE_3__["ReadAlong"])(this.refs.audio, "pause", this.state.data.filename);
      this.setState({
        playing: false
      });
    });

    _defineProperty(this, "ended", () => {
      // const { audio } = this.refs
      // audio.pause()
      this.setState({
        currentTimePercentage: 0,
        playing: false
      });
      this.setState({
        playing: false
      });
    });

    _defineProperty(this, "updateStore", () => {
      this.props.audio.currentlyPlaying !== this.state.data.filename && app_App_store__WEBPACK_IMPORTED_MODULE_5__["default"].dispatch({
        type: "CURRENTLY_PLAYING",
        content: this.state.data.filename
      });
    });

    _defineProperty(this, "error", e => {
      console.log(e);
      console.warn(`File missing: ${this.state.data.filepath}`);

      if (this.errorCount++ > 1) {
        return Object(app_App_Error__WEBPACK_IMPORTED_MODULE_8__["notify"])("Could not load file.", undefined, true);
      } else {
        this.setState({
          key: this.state.key + 1
        });
        console.warn(`Attempted to remount file: ${this.state.data.filepath}`);
      }
    });

    this.audio = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    let data;
    /* TODO: Cleanup */

    data = {
      filename: this.props.src,
      filepath: this.props.src
    };
    this.state = {
      data,
      playing: null,
      currentTimePercentage: 0,
      key: 0 // To force remounting if an error occurs

    };
  }

  render() {
    const {
      playing,
      loading,
      error,
      currentTimePercentage
    } = this.state;
    const {
      filepath,
      video,
      label
    } = this.state.data;
    const inline = this.props.inline;
    if (!filepath) return null;
    let ContainerTag = "div";

    if (inline) {
      ContainerTag = "span";
    }

    let Tag = video ? "video" : "audio";
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ContainerTag, {
      className: `audioPlayer ${playing ? playing : ""} ${error ? "error" : ""} ${inline ? "inline" : ""} ${video ? "video" : ""}`,
      "data-ignore": true,
      key: this.state.key
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Tag // controls
    , {
      ref: this.audio // preload="none" // TEMP
      ,
      loop: Boolean(video),
      onLoadStart: this.loading,
      onPlaying: this.playing,
      onTimeUpdate: this.playing,
      onPlay: this.play,
      onPause: this.pause,
      onCanPlay: this.canplay,
      onError: this.error,
      onEnded: this.ended,
      onStalled: this.error,
      onClick: video ? () => {} : this.pausePlayButton,
      controls: Boolean(video)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("source", {
      src: filepath,
      type: video ? "video/mp4" : "audio/mp3"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: `button small playButton ${playing ? playing : ""}`,
      onClick: this.pausePlayButton
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, playing ?
    /*'❚❚'*/
    "Pause" : label ? `▶  ${label}` : "▶ Play"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "percentage",
      style: {
        width: currentTimePercentage + "%"
      }
    })), this.state.loading && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "loader"
    }), !inline && this.state.error && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "error"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, "File missing.")));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(state => ({
  audio: state.audio
}))(Audio));

/***/ }),

/***/ "./src/documents/Render/Audio/reducers.js":
/*!************************************************!*\
  !*** ./src/documents/Render/Audio/reducers.js ***!
  \************************************************/
/*! exports provided: audio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "audio", function() { return audio; });
const audio = (state = {}, action) => {
  switch (action.type) {
    case "CURRENTLY_PLAYING":
      return { ...state,
        currentlyPlaying: action.content
      };

    case "PLAY_SENTENCE":
      return { ...state,
        currentlyPlaying: action.filename,
        begin: action.begin,
        end: action.end
      };

    case "CLEAR_SENTENCE":
      return { ...state,
        begin: null,
        end: null
      };

    default:
      return state;
  }
};

/***/ }),

/***/ "./src/documents/Render/Elements/Inflection/actions.js":
/*!*************************************************************!*\
  !*** ./src/documents/Render/Elements/Inflection/actions.js ***!
  \*************************************************************/
/*! exports provided: ShowInflectionTable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowInflectionTable", function() { return ShowInflectionTable; });
/* harmony import */ var app_App_axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/axios */ "./src/app/App/axios.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_4__);
 //process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''


 // import Inflection from 'documents/Render/Elements/Inflection'

 // import classify from 'server/inflection/tables/classification/BIN_classification.js'


const url = "";
let cache = {};
const ShowInflectionTable = async input => {// input = (typeof input === 'string') ? JSON.parse(input) : input
  // const { BIN_id, grammatical_tag } = input
  // if (!BIN_id) {
  //   return console.log('No BIN id')
  // }
  // let html = cache[JSON.stringify(input)]
  // if (!html) {
  //   const cats = classify({ grammatical_tag }).inflectional_form_categories.filter(i => typeof i !== 'number')
  //   html = (await axios.get(`/api/inflection?id=${BIN_id}&type=html&give_me=${cats.join(',')}`, {})).data
  //   cache[JSON.stringify(input)] = html
  // }
  // // console.log(html)
  // store.dispatch({
  //   type: 'LOAD_INFLECTION',
  //   content: html,
  // })
};

/***/ }),

/***/ "./src/documents/Render/Elements/parse.js":
/*!************************************************!*\
  !*** ./src/documents/Render/Elements/parse.js ***!
  \************************************************/
/*! exports provided: ParseHTMLtoObject, ParseHTMLtoArray, getTextFromReactElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParseHTMLtoObject", function() { return ParseHTMLtoObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParseHTMLtoArray", function() { return ParseHTMLtoArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTextFromReactElement", function() { return getTextFromReactElement; });
/*
  A poor man's parser that uses HTML data attr tags
  to convert HTML into an object.

  The attribute data-name becomes a key in the object.
*/
const ParseHTMLtoObject = children => {
  let output = {};

  const Traverse = input => {
    if (input === null) {
      return;
    } else if (Array.isArray(input)) {
      input.forEach(Traverse);
    } else if (typeof input === "object" || typeof input === "function") {
      const name = input.props["data-name"];
      const childrenType = input.props["data-children"];

      if (childrenType === "array") {
        output[name] = ParseHTMLtoArray(input.props.children);
      } else if (childrenType === "object") {
        output[name] = ParseHTMLtoObject(input.props.children);
      } else if (childrenType === "string") {
        output[name] = getTextFromReactElement(input.props.children);
      } else if (childrenType === "boolean") {
        output[name] = getTextFromReactElement(input.props.children);
      } else if (name) {
        output[name] = input.props.children;
      } else {
        Traverse(input.props.children);
      }
    }
  };

  Traverse(children);
  return output;
};
const ParseHTMLtoArray = children => {
  let output = [];

  const Traverse = input => {
    if (input === null) {
      return;
    } else if (Array.isArray(input)) {
      input.forEach(Traverse);
    } else if (typeof input === "object" || typeof input === "function") {
      const name = input.props["data-name"];
      const childrenType = input.props["data-children"];

      if (childrenType === "array") {
        output.push({
          name,
          children: ParseHTMLtoArray(input.props.children)
        });
      } else if (childrenType === "object") {
        output.push(ParseHTMLtoObject(input.props.children));
      } else if (childrenType === "string") {
        output[name] = getTextFromReactElement(input.props.children);
      } else if (childrenType === "boolean") {
        output[name] = getTextFromReactElement(input.props.children);
      } else if (name) {
        // output.push(input.props.children)
        output.push({
          name,
          children: input.props.children
        });
      } else {
        Traverse(input.props.children);
      }
    }
  };

  Traverse(children);
  return output;
};
const getTextFromReactElement = input => {
  let output = "";

  const Traverse = input => {
    if (Array.isArray(input)) {
      input.forEach(Traverse);
    } else if (input !== null && (typeof input === "object" || typeof input === "function")) {
      input.props && Traverse(input.props.children);
    } else if (input) {
      output += input;
    }
  };

  Traverse(input);
  return output.trim();
};

/***/ }),

/***/ "./src/documents/Render/Frontpage/demo.js":
/*!************************************************!*\
  !*** ./src/documents/Render/Frontpage/demo.js ***!
  \************************************************/
/*! exports provided: default, turnOffDemonstration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "turnOffDemonstration", function() { return turnOffDemonstration; });
/* harmony import */ var documents_Read_actions_ShowWord__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Read/actions/ShowWord */ "./src/documents/Read/actions/ShowWord.js");
/* harmony import */ var documents_Read_actions_Reset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Read/actions/Reset */ "./src/documents/Read/actions/Reset.js");


/*
  Front page demo
*/

let on = true;
let ids = [];
let currentIndex = 0;
/* harmony default export */ __webpack_exports__["default"] = (() => {// if (mw.config.get('wgPageName') === 'Ylhýra' || mw.config.get('wgPageName') === 'Text:Frontpage') {
  //
  //   ids = $('#frontpage-splash-screen-demo-text [data-word-has-definition]').map(function() {
  //     return $(this).attr('id')
  //   })
  //   next()
  // }
});

const next = () => {
  if (!on) return;
  Object(documents_Read_actions_Reset__WEBPACK_IMPORTED_MODULE_1__["default"])();
  Object(documents_Read_actions_ShowWord__WEBPACK_IMPORTED_MODULE_0__["default"])(ids[currentIndex]);
  currentIndex = (currentIndex + 1) % ids.length;
  setTimeout(next, 2400);
};

const turnOffDemonstration = () => {
  on = false;
};

/***/ }),

/***/ "./src/documents/Render/TextElements/Definition/Box/Sentence.js":
/*!**********************************************************************!*\
  !*** ./src/documents/Render/TextElements/Definition/Box/Sentence.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SentenceBox; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_App_functions_exists__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/functions/exists */ "./src/app/App/functions/exists.js");
/* harmony import */ var documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! documents/Render/TextElements/Definition/Tooltip */ "./src/documents/Render/TextElements/Definition/Tooltip.js");



class SentenceBox extends react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent {
  render() {
    const {
      definition
    } = this.props;
    if (!Object(app_App_functions_exists__WEBPACK_IMPORTED_MODULE_1__["default"])(definition) || !(definition.meaning || definition.direct || definition.note)) return null;
    return [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "box",
      id: `${this.props.id}-box`,
      "data-ignore": "true",
      "data-not-text": "true",
      key: 1,
      hidden: true
    }, definition.meaning && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "meaning"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: Object(documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__["ItalicsAndBold"])(definition.meaning)
      }
    })), definition.direct && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "direct"
    }, "\u201C", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: Object(documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__["ItalicsAndBold"])(definition.direct)
      }
    }), "\u201D"), definition.note && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "note small"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Note"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: Object(documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__["ItalicsAndBold"])(definition.note)
      }
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "sentence-overlay",
      id: `${this.props.id}-sentence-overlay`,
      "data-ignore": "true",
      key: 2
    })];
  }

}

/***/ }),

/***/ "./src/documents/Render/TextElements/Definition/Box/Word.js":
/*!******************************************************************!*\
  !*** ./src/documents/Render/TextElements/Definition/Box/Word.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WordBox; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_App_functions_exists__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/functions/exists */ "./src/app/App/functions/exists.js");
/* harmony import */ var documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! documents/Render/TextElements/Definition/Tooltip */ "./src/documents/Render/TextElements/Definition/Tooltip.js");



class WordBox extends react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent {
  render() {
    const {
      definition
    } = this.props;
    if (!Object(app_App_functions_exists__WEBPACK_IMPORTED_MODULE_1__["default"])(definition) || !definition.base && !definition.base_meaning && !definition.base_direct && !definition.note && !definition.direct) return null;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "word-box",
      id: `${this.props.id}-box`,
      "data-not-text": "true",
      hidden: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, definition.base && definition.base.trim() && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "base"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Base word"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: Object(documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__["ItalicsAndBold"])(definition.base)
      }
    })), definition.base_meaning && definition.base_meaning.trim() && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "base_meaning"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Meaning of base word"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: Object(documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__["ItalicsAndBold"])(definition.base_meaning)
      }
    })), definition.base_direct && definition.base_direct.trim() && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "base_direct"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Literal meaning of base word"), "\u201C", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: Object(documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__["ItalicsAndBold"])(definition.base_direct)
      }
    }), "\u201D"), definition.direct && definition.direct.trim() && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: ""
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Literal meaning of word"), "\u201C", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: Object(documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__["ItalicsAndBold"])(definition.direct)
      }
    }), "\u201D"), definition.note && definition.note.trim() && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "small"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Note"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: Object(documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__["ItalicsAndBold"])(definition.note)
      }
    })), definition.grammatical_analysis && definition.grammatical_analysis.trim() && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "small"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Note"), definition.grammatical_analysis)), definition.sound && definition.sound.length > 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, "\uD83D\uDD08"), definition.pronunciation && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "small"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Pronunciation"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "pronunciation",
      dangerouslySetInnerHTML: {
        __html: definition.pronunciation
      }
    })));
  }

}

/***/ }),

/***/ "./src/documents/Render/TextElements/Definition/InlineTranslation.js":
/*!***************************************************************************!*\
  !*** ./src/documents/Render/TextElements/Definition/InlineTranslation.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_App_functions_exists__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/functions/exists */ "./src/app/App/functions/exists.js");
/* harmony import */ var documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! documents/Render/TextElements/Definition/Tooltip */ "./src/documents/Render/TextElements/Definition/Tooltip.js");



/*
  Maybe TODO:
    Should we attempt to squish InlineTranslation into two lines when applicable?
    That would require finding width of single & double lines and selecting the best.
    Would be cool, but double lines hardly fit between spaces.
*/

class InlineTranslation extends react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent {
  render() {
    const {
      definition
    } = this.props;

    if (!Object(app_App_functions_exists__WEBPACK_IMPORTED_MODULE_1__["default"])(definition) || !definition.show_definition_above) {
      return null;
    }

    const text = definition.inline_translation || definition.meaning;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("sup", {
      className: "inline_translation",
      "data-not-text": "true",
      hidden: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: Object(documents_Render_TextElements_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_2__["ItalicsAndBold"])(text)
      }
    }));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (InlineTranslation);

/***/ }),

/***/ "./src/documents/Render/TextElements/Definition/Tooltip.js":
/*!*****************************************************************!*\
  !*** ./src/documents/Render/TextElements/Definition/Tooltip.js ***!
  \*****************************************************************/
/*! exports provided: default, ItalicsAndBold */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Definition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ItalicsAndBold", function() { return ItalicsAndBold; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_App_functions_exists__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/App/functions/exists */ "./src/app/App/functions/exists.js");


class Definition extends react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent {
  render() {
    const {
      definition,
      id
    } = this.props;

    if (!Object(app_App_functions_exists__WEBPACK_IMPORTED_MODULE_1__["default"])(definition) || !definition.meaning) {
      return null;
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", {
      className: "tooltip" // style={{display:'none'}}
      ,
      "data-not-text": "true",
      id: `${id}-tooltip`,
      hidden: true
    }, definition.meaning && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "meaning"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: ItalicsAndBold(definition.meaning)
      }
    })));
  }

}
const ItalicsAndBold = input => {
  return input.replace(/\*\*([^ ].+?[^ ])\*\*/g, "<b>$1</b>").replace(/\*([^ ].+?[^ ])\*/g, "<i>$1</i>").replace(/_([^ ].+?[^ ])_/g, "<i>$1</i>");
};

/***/ }),

/***/ "./src/documents/Render/TextElements/Sentence.js":
/*!*******************************************************!*\
  !*** ./src/documents/Render/TextElements/Sentence.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Definition_Box_Sentence__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Definition/Box/Sentence */ "./src/documents/Render/TextElements/Definition/Box/Sentence.js");
/* harmony import */ var app_App_functions_exists__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/App/functions/exists */ "./src/app/App/functions/exists.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }





class Sentence extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  render() {
    const {
      selected
    } = this.props;
    const {
      id,
      definition
    } = this.props;
    let attrs = {};
    let classes = [];

    if (Object(app_App_functions_exists__WEBPACK_IMPORTED_MODULE_2__["default"])(definition) && definition.meaning.trim()) {
      attrs = {
        "data-sentence-has-definition": true
      };
    } else {
      classes.push("missing");
    } // console.log(this.props.children)


    return [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Definition_Box_Sentence__WEBPACK_IMPORTED_MODULE_1__["default"], {
      id: id,
      definition: definition,
      sentence: true,
      key: 1,
      hidden: true
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", _extends({
      className: `sentence ${classes.join(" ")}`
    }, attrs, {
      id: id,
      "data-will-have-audio": "true",
      key: 2
    }), this.props.children)];
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Sentence);

/***/ }),

/***/ "./src/documents/Render/TextElements/Word.js":
/*!***************************************************!*\
  !*** ./src/documents/Render/TextElements/Word.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Definition_Tooltip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Definition/Tooltip */ "./src/documents/Render/TextElements/Definition/Tooltip.js");
/* harmony import */ var _Definition_InlineTranslation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Definition/InlineTranslation */ "./src/documents/Render/TextElements/Definition/InlineTranslation.js");
/* harmony import */ var app_App_functions_exists__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/App/functions/exists */ "./src/app/App/functions/exists.js");
/* harmony import */ var _Definition_Box_Word__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Definition/Box/Word */ "./src/documents/Render/TextElements/Definition/Box/Word.js");
/* harmony import */ var documents_Parse_Compiler_1_Precompile_UpdateID__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! documents/Parse/Compiler/1_Precompile/UpdateID */ "./src/documents/Parse/Compiler/1_Precompile/UpdateID.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var omit_empty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! omit-empty */ "omit-empty");
/* harmony import */ var omit_empty__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(omit_empty__WEBPACK_IMPORTED_MODULE_7__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }







 // import GetSound from 'documents/Render/TextElements/Sound'



class WordElement extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  render() {
    const {
      id,
      definition,
      appendText,
      editor
    } = this.props;
    const hasTooltip = Object(app_App_functions_exists__WEBPACK_IMPORTED_MODULE_3__["default"])(definition);
    let classes = [];
    let attrs = {};

    if (Object(app_App_functions_exists__WEBPACK_IMPORTED_MODULE_3__["default"])(definition)) {
      attrs = omit_empty__WEBPACK_IMPORTED_MODULE_7___default()({
        "data-word-has-definition": true // 'data-sound': GetSound(id, editor),
        // 'data-analysis': get_analysis(id, editor),

      });
      /*
        .difficult
        .has-inline-translation
      */

      classes = [definition.difficult ? "difficult" : null, definition.show_definition_above ? "has-inline-translation" : null];
      /*
        [data-connected-words]
      */

      if (definition.contains.length > 1) {
        attrs["data-connected-words"] = underscore__WEBPACK_IMPORTED_MODULE_6___default.a.uniq(definition.contains.map(id => Object(documents_Parse_Compiler_1_Precompile_UpdateID__WEBPACK_IMPORTED_MODULE_5__["getUpdatedID"])(id))).filter(i => i !== id).join(",");
      }
    } else {
      classes.push("missing");
    } // console.log(definition)


    return [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Definition_Box_Word__WEBPACK_IMPORTED_MODULE_4__["default"], {
      id: id,
      definition: definition,
      key: 1,
      hidden: true
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Definition_Tooltip__WEBPACK_IMPORTED_MODULE_1__["default"], {
      id: id,
      definition: definition,
      key: 2,
      hidden: true
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: `word-container ${classes.join(" ")}`,
      key: 3
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Definition_InlineTranslation__WEBPACK_IMPORTED_MODULE_2__["default"], {
      definition: definition
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", _extends({
      className: "word"
    }, attrs, {
      id: id,
      "data-will-have-audio": "true"
    }), this.props.children), appendText)];
  }

} // const get_analysis = (updatedID, editor) => {
//   const id = getPreviousID(updatedID) || updatedID
//   if (!editor.analysis) return null;
//   const analysis = editor.analysis[id]
//   if (!analysis) return null;
//   // console.log(analysis)
//   return JSON.stringify({
//     BIN_id: analysis.BIN_id,
//     word_class: analysis.word_class,
//     grammatical_tag: analysis.grammatical_tag,
//   })
// }


/* harmony default export */ __webpack_exports__["default"] = (WordElement);

/***/ }),

/***/ "./src/documents/Render/Traverse.js":
/*!******************************************!*\
  !*** ./src/documents/Render/Traverse.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var documents_Render_TextElements_Sentence__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Render/TextElements/Sentence */ "./src/documents/Render/TextElements/Sentence.js");
/* harmony import */ var documents_Render_TextElements_Word__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! documents/Render/TextElements/Word */ "./src/documents/Render/TextElements/Word.js");
/* harmony import */ var react_attr_converter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-attr-converter */ "react-attr-converter");
/* harmony import */ var react_attr_converter__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_attr_converter__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var app_App_functions_inline_style_2_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/App/functions/inline-style-2-json */ "./src/app/App/functions/inline-style-2-json/index.js");
/* harmony import */ var app_App_functions_inline_style_2_json__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(app_App_functions_inline_style_2_json__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var is_boolean_attribute__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! is-boolean-attribute */ "is-boolean-attribute");
/* harmony import */ var is_boolean_attribute__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(is_boolean_attribute__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var documents_Templates_list__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! documents/Templates/_list */ "./src/documents/Templates/_list.js");
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }






 // import Controls from './Controls/Controls'
// import AudioPlayer from './Controls/Audio'




const Traverse = ({
  json,
  data,
  index
}) => {
  if (!json) return null;
  const {
    node,
    tag,
    attr,
    child,
    text
  } = json;

  if (node === "element" || node === "root") {
    let Tag = tag || "span";

    if (node === "root") {
      return child.map((e, i) => Traverse({
        json: e,
        index: i,
        data
      }));
    }

    if (tag === "word") {
      Tag = documents_Render_TextElements_Word__WEBPACK_IMPORTED_MODULE_2__["default"];
    } else if (tag === "sentence") {
      Tag = documents_Render_TextElements_Sentence__WEBPACK_IMPORTED_MODULE_1__["default"];
    } else if (tag === "a") {
      Tag = app_Router_Link__WEBPACK_IMPORTED_MODULE_7__["default"];
    } else {
      Tag = Object(documents_Templates_list__WEBPACK_IMPORTED_MODULE_6__["default"])(tag) || Tag;
    }
    /*
      Attribute values can be arrays (from html2json).
      Here we merge them together with spaces
    */


    let attrs = {};

    for (const property in attr) {
      // Converts HTML attribute into React attribute
      if (property in attr && !property.startsWith("data-temp")) {
        const value = attr[property];

        if (property === "style") {
          attrs[react_attr_converter__WEBPACK_IMPORTED_MODULE_3___default()(property)] = app_App_functions_inline_style_2_json__WEBPACK_IMPORTED_MODULE_4___default()(value);
        } else {
          attrs[react_attr_converter__WEBPACK_IMPORTED_MODULE_3___default()(property)] = value;

          if (value === "true" || value === "false") {
            attrs[react_attr_converter__WEBPACK_IMPORTED_MODULE_3___default()(property)] = value === "true" ? true : false;
          }

          if (value === "" && (is_boolean_attribute__WEBPACK_IMPORTED_MODULE_5___default()(property) || ["autoplay", "loop"].includes(property))) {
            attrs[react_attr_converter__WEBPACK_IMPORTED_MODULE_3___default()(property)] = true;
          }
        }
      }
    }
    /* IMG and HR tags are void tags */


    if (voidElementTags.includes(Tag)) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Tag, _extends({}, attrs, {
        key: attr && attr.id || index
      }));
    }
    /*
      Convert custom elements to 'span' or 'div'
      and add their name as a className
    */


    if (typeof Tag === "string") {
      getCustomTag(Tag, attrs.className, output => {
        Tag = output.tag;
        attrs.className = output.className;
      });
    }
    /*
      Always open links in a new window
    */


    if (tag === "a" && attrs.href && attrs.href.startsWith("http")) {
      // attrs.target = "_blank"
      attrs.rel = "noopener";
    }

    let extraAttributes = {};

    if (tag === "word") {
      extraAttributes = {
        editor: data
      };
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Tag, _extends({}, attrs, {
      key: attr && attr.id || index
    }, extraAttributes), child && child.map((e, i) => Traverse({
      json: e,
      data,
      index: i
    })));
  } else if (node === "text") {
    return text;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Traverse);
/*
  Allow for specific custom elements.
*/

const customTags = {
  p: "div",
  center: "div",
  translate: "span",
  isl: "span",
  "small-box": "span"
};

const getCustomTag = (tag, className, callback) => {
  if (tag in customTags) {
    className = ((className || "") + " " + tag).trim();
    tag = customTags[tag];
  }

  callback({
    tag,
    className
  });
};

const voidElementTags = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];

/***/ }),

/***/ "./src/documents/Render/helpers.js":
/*!*****************************************!*\
  !*** ./src/documents/Render/helpers.js ***!
  \*****************************************/
/*! exports provided: addClass, removeClass, getScrollingElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addClass", function() { return addClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeClass", function() { return removeClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getScrollingElement", function() { return getScrollingElement; });
const addClass = (ids, cssClass = "audio") => {
  ids = Array.isArray(ids) ? ids : [ids];
  ids.forEach(id => {
    const element = document.getElementById(id);
    if (!element) return;
    element.classList.add(cssClass);
  });
};
const removeClass = (ids, cssClass = "audio") => {
  ids = Array.isArray(ids) ? ids : [ids];
  ids.forEach(id => {
    const element = document.getElementById(id);
    if (!element) return;
    element.classList.remove(cssClass);
  });
};
const getScrollingElement = () => {
  return document.scrollingElement || document.documentElement; // document.documentElement //|| document.body || document.body.parentNode || document.documentElement
};

/***/ }),

/***/ "./src/documents/Render/index.js":
/*!***************************************!*\
  !*** ./src/documents/Render/index.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom/server */ "react-dom/server");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Traverse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Traverse */ "./src/documents/Render/Traverse.js");


/* harmony default export */ __webpack_exports__["default"] = (({
  json,
  data
}) => {
  return Object(_Traverse__WEBPACK_IMPORTED_MODULE_1__["default"])({
    json,
    data,
    index: 0
  }) || null; // return ReactDOMServer.renderToStaticMarkup(Traverse({json, data, index: 0}) || null)
});

/***/ }),

/***/ "./src/documents/Templates/404.js":
/*!****************************************!*\
  !*** ./src/documents/Templates/404.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");


/* harmony default export */ __webpack_exports__["default"] = (() => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Page not found"));

/***/ }),

/***/ "./src/documents/Templates/Audio.js":
/*!******************************************!*\
  !*** ./src/documents/Templates/Audio.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var paths_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! paths.js */ "./src/paths.js");
/* harmony import */ var documents_Render_Audio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Render/Audio */ "./src/documents/Render/Audio/index.js");


/* harmony default export */ __webpack_exports__["default"] = (props => /*#__PURE__*/React.createElement(documents_Render_Audio__WEBPACK_IMPORTED_MODULE_1__["default"], {
  src: Object(paths_js__WEBPACK_IMPORTED_MODULE_0__["getDynamicFileUrl"])(props.src),
  inline: "inline" in props
}));

/***/ }),

/***/ "./src/documents/Templates/Blær.js":
/*!*****************************************!*\
  !*** ./src/documents/Templates/Blær.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* TODO: Temporarily turned off until server is configured */
// import "documents/Templates/Blær.scss";

/***/ }),

/***/ "./src/documents/Templates/Book.js":
/*!*****************************************!*\
  !*** ./src/documents/Templates/Book.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");

/* harmony default export */ __webpack_exports__["default"] = (props => {
  return /*#__PURE__*/React.createElement("div", {
    className: "book",
    "data-translate": "true"
  }, props.children);
});

/***/ }),

/***/ "./src/documents/Templates/Button.js":
/*!*******************************************!*\
  !*** ./src/documents/Templates/Button.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (props => /*#__PURE__*/React.createElement("div", {
  className: "button blue"
}, props.children));

/***/ }),

/***/ "./src/documents/Templates/Image.js":
/*!******************************************!*\
  !*** ./src/documents/Templates/Image.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");

/* harmony default export */ __webpack_exports__["default"] = (props => {
  return /*#__PURE__*/React.createElement("div", {
    className: `ylhyra_image ${props.position || ""}`
  }, props.children);
});

/***/ }),

/***/ "./src/documents/Templates/Level.js":
/*!******************************************!*\
  !*** ./src/documents/Templates/Level.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_Router_Link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/Router/Link */ "./src/app/Router/Link.js");

/* harmony default export */ __webpack_exports__["default"] = (props => {
  return /*#__PURE__*/React.createElement("span", {
    className: "level"
  }, "Level ", /*#__PURE__*/React.createElement(app_Router_Link__WEBPACK_IMPORTED_MODULE_0__["default"], {
    href: props.level
  }, props.level.toUpperCase()));
});

/***/ }),

/***/ "./src/documents/Templates/VocabularyStatus.js":
/*!*****************************************************!*\
  !*** ./src/documents/Templates/VocabularyStatus.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_Vocabulary_Elements_VocabularyHeader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/Vocabulary/Elements/VocabularyHeader */ "./src/app/Vocabulary/Elements/VocabularyHeader.js");

/* harmony default export */ __webpack_exports__["default"] = (props => {
  // console.log(JSON.parse(atob(props.header_data)))
  return /*#__PURE__*/React.createElement(app_Vocabulary_Elements_VocabularyHeader__WEBPACK_IMPORTED_MODULE_0__["default"], {
    header_data: {
      vocabulary: JSON.parse(atob(props.header_data))
    },
    button: false
  });
});

/***/ }),

/***/ "./src/documents/Templates/_list.js":
/*!******************************************!*\
  !*** ./src/documents/Templates/_list.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var documents_Templates_Level__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Templates/Level */ "./src/documents/Templates/Level.js");
/* harmony import */ var documents_Templates_Book__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! documents/Templates/Book */ "./src/documents/Templates/Book.js");
/* harmony import */ var documents_Templates_Bl_r__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! documents/Templates/Blær */ "./src/documents/Templates/Blær.js");
/* harmony import */ var documents_Templates_Bl_r__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(documents_Templates_Bl_r__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var documents_Templates_Image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! documents/Templates/Image */ "./src/documents/Templates/Image.js");
/* harmony import */ var documents_Templates_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! documents/Templates/Button */ "./src/documents/Templates/Button.js");
/* harmony import */ var documents_Templates_VocabularyStatus__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! documents/Templates/VocabularyStatus */ "./src/documents/Templates/VocabularyStatus.js");
/* harmony import */ var documents_Templates_Audio__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! documents/Templates/Audio */ "./src/documents/Templates/Audio.js");







/* harmony default export */ __webpack_exports__["default"] = (name => {
  switch (name) {
    case "Level":
      return documents_Templates_Level__WEBPACK_IMPORTED_MODULE_0__["default"];
      break;

    case "Book":
      return documents_Templates_Book__WEBPACK_IMPORTED_MODULE_1__["default"];
      break;

    case "Blær":
      return documents_Templates_Bl_r__WEBPACK_IMPORTED_MODULE_2___default.a;
      break;

    case "Image":
      return documents_Templates_Image__WEBPACK_IMPORTED_MODULE_3__["default"];
      break;

    case "Button":
      return documents_Templates_Button__WEBPACK_IMPORTED_MODULE_4__["default"];
      break;

    case "VocabularyStatus":
      return documents_Templates_VocabularyStatus__WEBPACK_IMPORTED_MODULE_5__["default"];
      break;

    case "Audio":
      return documents_Templates_Audio__WEBPACK_IMPORTED_MODULE_6__["default"];
      break;

    default:
      return null;
  }
});

/***/ }),

/***/ "./src/output/links.js":
/*!*****************************!*\
  !*** ./src/output/links.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  "data/bláa-lónið": {
    "title": "Data:Bláa lónið",
    "filename": "data_bláa-lónið",
    "file": "/Users/egill/ylhyra_content/data/Bláa_lónið.md"
  },
  "data/blær/egg-í-áskrift": {
    "title": "Data:Blær/Egg í áskrift",
    "filename": "data_blær_egg-í-áskrift",
    "file": "/Users/egill/ylhyra_content/data/Blær/Egg_í_áskrift.md"
  },
  "data/blær/fyrst-við-erum-hérna": {
    "title": "Data:Blær/Fyrst við erum hérna",
    "filename": "data_blær_fyrst-við-erum-hérna",
    "file": "/Users/egill/ylhyra_content/data/Blær/Fyrst_við_erum_hérna.md"
  },
  "data/blær/lunga": {
    "title": "Data:Blær/LungA",
    "filename": "data_blær_lunga",
    "file": "/Users/egill/ylhyra_content/data/Blær/LungA.md"
  },
  "data/blær/silfur-svanurinn/1": {
    "title": "Data:Blær/Silfur svanurinn/1",
    "filename": "data_blær_silfur-svanurinn_1",
    "file": "/Users/egill/ylhyra_content/data/Blær/Silfur_svanurinn/1.md"
  },
  "data/blær/silfur-svanurinn/2": {
    "title": "Data:Blær/Silfur svanurinn/2",
    "filename": "data_blær_silfur-svanurinn_2",
    "file": "/Users/egill/ylhyra_content/data/Blær/Silfur_svanurinn/2.md"
  },
  "data/blær/silfur-svanurinn/3": {
    "title": "Data:Blær/Silfur svanurinn/3",
    "filename": "data_blær_silfur-svanurinn_3",
    "file": "/Users/egill/ylhyra_content/data/Blær/Silfur_svanurinn/3.md"
  },
  "data/blær/silfur-svanurinn/4": {
    "title": "Data:Blær/Silfur svanurinn/4",
    "filename": "data_blær_silfur-svanurinn_4",
    "file": "/Users/egill/ylhyra_content/data/Blær/Silfur_svanurinn/4.md"
  },
  "data/blær/silfur-svanurinn/5": {
    "title": "Data:Blær/Silfur svanurinn/5",
    "filename": "data_blær_silfur-svanurinn_5",
    "file": "/Users/egill/ylhyra_content/data/Blær/Silfur_svanurinn/5.md"
  },
  "data/blær/silfur-svanurinn/6": {
    "title": "Data:Blær/Silfur svanurinn/6",
    "filename": "data_blær_silfur-svanurinn_6",
    "file": "/Users/egill/ylhyra_content/data/Blær/Silfur_svanurinn/6.md"
  },
  "data/blær/silfur-svanurinn/7": {
    "title": "Data:Blær/Silfur svanurinn/7",
    "filename": "data_blær_silfur-svanurinn_7",
    "file": "/Users/egill/ylhyra_content/data/Blær/Silfur_svanurinn/7.md"
  },
  "data/blær/silfur-svanurinn/8": {
    "title": "Data:Blær/Silfur svanurinn/8",
    "filename": "data_blær_silfur-svanurinn_8",
    "file": "/Users/egill/ylhyra_content/data/Blær/Silfur_svanurinn/8.md"
  },
  "data/blær/vinkonur-vors-og-blóma/1": {
    "title": "Data:Blær/Vinkonur vors og blóma/1",
    "filename": "data_blær_vinkonur-vors-og-blóma_1",
    "file": "/Users/egill/ylhyra_content/data/Blær/Vinkonur_vors_og_blóma/1.md"
  },
  "data/blær/vinkonur-vors-og-blóma/2": {
    "title": "Data:Blær/Vinkonur vors og blóma/2",
    "filename": "data_blær_vinkonur-vors-og-blóma_2",
    "file": "/Users/egill/ylhyra_content/data/Blær/Vinkonur_vors_og_blóma/2.md"
  },
  "data/blær/vinkonur-vors-og-blóma/3": {
    "title": "Data:Blær/Vinkonur vors og blóma/3",
    "filename": "data_blær_vinkonur-vors-og-blóma_3",
    "file": "/Users/egill/ylhyra_content/data/Blær/Vinkonur_vors_og_blóma/3.md"
  },
  "data/blær/vinkonur-vors-og-blóma/4": {
    "title": "Data:Blær/Vinkonur vors og blóma/4",
    "filename": "data_blær_vinkonur-vors-og-blóma_4",
    "file": "/Users/egill/ylhyra_content/data/Blær/Vinkonur_vors_og_blóma/4.md"
  },
  "data/blær/vinkonur-vors-og-blóma/5": {
    "title": "Data:Blær/Vinkonur vors og blóma/5",
    "filename": "data_blær_vinkonur-vors-og-blóma_5",
    "file": "/Users/egill/ylhyra_content/data/Blær/Vinkonur_vors_og_blóma/5.md"
  },
  "data/blær/vinkonur-vors-og-blóma/6": {
    "title": "Data:Blær/Vinkonur vors og blóma/6",
    "filename": "data_blær_vinkonur-vors-og-blóma_6",
    "file": "/Users/egill/ylhyra_content/data/Blær/Vinkonur_vors_og_blóma/6.md"
  },
  "data/brennu-njáls-saga/höskuldur-og-brennan/1": {
    "title": "Data:Brennu-Njáls saga/Höskuldur og brennan/1",
    "filename": "data_brennu-njáls-saga_höskuldur-og-brennan_1",
    "file": "/Users/egill/ylhyra_content/data/Brennu-Njáls_saga/Höskuldur_og_brennan/1.md"
  },
  "data/brennu-njáls-saga/höskuldur-og-brennan/10": {
    "title": "Data:Brennu-Njáls saga/Höskuldur og brennan/10",
    "filename": "data_brennu-njáls-saga_höskuldur-og-brennan_10",
    "file": "/Users/egill/ylhyra_content/data/Brennu-Njáls_saga/Höskuldur_og_brennan/10.md"
  },
  "data/brennu-njáls-saga/höskuldur-og-brennan/2": {
    "title": "Data:Brennu-Njáls saga/Höskuldur og brennan/2",
    "filename": "data_brennu-njáls-saga_höskuldur-og-brennan_2",
    "file": "/Users/egill/ylhyra_content/data/Brennu-Njáls_saga/Höskuldur_og_brennan/2.md"
  },
  "data/brennu-njáls-saga/höskuldur-og-brennan/3": {
    "title": "Data:Brennu-Njáls saga/Höskuldur og brennan/3",
    "filename": "data_brennu-njáls-saga_höskuldur-og-brennan_3",
    "file": "/Users/egill/ylhyra_content/data/Brennu-Njáls_saga/Höskuldur_og_brennan/3.md"
  },
  "data/brennu-njáls-saga/höskuldur-og-brennan/4": {
    "title": "Data:Brennu-Njáls saga/Höskuldur og brennan/4",
    "filename": "data_brennu-njáls-saga_höskuldur-og-brennan_4",
    "file": "/Users/egill/ylhyra_content/data/Brennu-Njáls_saga/Höskuldur_og_brennan/4.md"
  },
  "data/brennu-njáls-saga/höskuldur-og-brennan/5": {
    "title": "Data:Brennu-Njáls saga/Höskuldur og brennan/5",
    "filename": "data_brennu-njáls-saga_höskuldur-og-brennan_5",
    "file": "/Users/egill/ylhyra_content/data/Brennu-Njáls_saga/Höskuldur_og_brennan/5.md"
  },
  "data/brennu-njáls-saga/höskuldur-og-brennan/6": {
    "title": "Data:Brennu-Njáls saga/Höskuldur og brennan/6",
    "filename": "data_brennu-njáls-saga_höskuldur-og-brennan_6",
    "file": "/Users/egill/ylhyra_content/data/Brennu-Njáls_saga/Höskuldur_og_brennan/6.md"
  },
  "data/brennu-njáls-saga/höskuldur-og-brennan/7": {
    "title": "Data:Brennu-Njáls saga/Höskuldur og brennan/7",
    "filename": "data_brennu-njáls-saga_höskuldur-og-brennan_7",
    "file": "/Users/egill/ylhyra_content/data/Brennu-Njáls_saga/Höskuldur_og_brennan/7.md"
  },
  "data/brennu-njáls-saga/höskuldur-og-brennan/8": {
    "title": "Data:Brennu-Njáls saga/Höskuldur og brennan/8",
    "filename": "data_brennu-njáls-saga_höskuldur-og-brennan_8",
    "file": "/Users/egill/ylhyra_content/data/Brennu-Njáls_saga/Höskuldur_og_brennan/8.md"
  },
  "data/brennu-njáls-saga/höskuldur-og-brennan/9": {
    "title": "Data:Brennu-Njáls saga/Höskuldur og brennan/9",
    "filename": "data_brennu-njáls-saga_höskuldur-og-brennan_9",
    "file": "/Users/egill/ylhyra_content/data/Brennu-Njáls_saga/Höskuldur_og_brennan/9.md"
  },
  "data/conversations/eldamennska": {
    "title": "Data:Conversations/Eldamennska",
    "filename": "data_conversations_eldamennska",
    "file": "/Users/egill/ylhyra_content/data/Conversations/Eldamennska.md"
  },
  "data/conversations/prentari": {
    "title": "Data:Conversations/Prentari",
    "filename": "data_conversations_prentari",
    "file": "/Users/egill/ylhyra_content/data/Conversations/Prentari.md"
  },
  "data/devoicing": {
    "title": "Data:Devoicing",
    "filename": "data_devoicing",
    "file": "/Users/egill/ylhyra_content/data/Devoicing.md"
  },
  "data/egils-saga/veisla-hjá-afa": {
    "title": "Data:Egils saga/Veisla hjá afa",
    "filename": "data_egils-saga_veisla-hjá-afa",
    "file": "/Users/egill/ylhyra_content/data/Egils_saga/Veisla_hjá_afa.md"
  },
  "data/español/magnús-jochum-pálsson/ánamaðkar": {
    "title": "Data:Español/Magnús Jochum Pálsson/Ánamaðkar",
    "filename": "data_español_magnús-jochum-pálsson_ánamaðkar",
    "file": "/Users/egill/ylhyra_content/data/Español/Magnús_Jochum_Pálsson/Ánamaðkar.md"
  },
  "data/færeyjar": {
    "title": "Data:Færeyjar",
    "filename": "data_færeyjar",
    "file": "/Users/egill/ylhyra_content/data/Færeyjar.md"
  },
  "data/fóstbræður": {
    "title": "Data:Fóstbræður",
    "filename": "data_fóstbræður",
    "file": "/Users/egill/ylhyra_content/data/Fóstbræður.md"
  },
  "data/text/a1/garðvinna": {
    "title": "Data:Text:A1/Garðvinna",
    "filename": "data_text_a1_garðvinna",
    "file": "/Users/egill/ylhyra_content/data/Garðvinna.md"
  },
  "data/harðfiskur": {
    "title": "Data:Harðfiskur",
    "filename": "data_harðfiskur",
    "file": "/Users/egill/ylhyra_content/data/Harðfiskur.md"
  },
  "data/help/adding-material": {
    "title": "Data:Help:Adding material",
    "filename": "data_help_adding-material",
    "file": "/Users/egill/ylhyra_content/data/Help/Adding_material.md"
  },
  "data/help/getting-started": {
    "title": "Data:Help:Getting started",
    "filename": "data_help_getting-started",
    "file": "/Users/egill/ylhyra_content/data/Help/Getting_started.md"
  },
  "data/hérna": {
    "title": "Data:Hérna",
    "filename": "data_hérna",
    "file": "/Users/egill/ylhyra_content/data/Hérna.md"
  },
  "data/imba/afi": {
    "title": "Data:Imba/afi",
    "filename": "data_imba_afi",
    "file": "/Users/egill/ylhyra_content/data/Imba/afi.md"
  },
  "data/imba/current-mood": {
    "title": "Data:Imba/current mood",
    "filename": "data_imba_current-mood",
    "file": "/Users/egill/ylhyra_content/data/Imba/current_mood.md"
  },
  "data/imba/grip": {
    "title": "Data:Imba/grip",
    "filename": "data_imba_grip",
    "file": "/Users/egill/ylhyra_content/data/Imba/grip.md"
  },
  "data/imba/áferð-og-flug": {
    "title": "Data:Imba/áferð og flug",
    "filename": "data_imba_áferð-og-flug",
    "file": "/Users/egill/ylhyra_content/data/Imba/áferð_og_flug.md"
  },
  "data/imba/ég-veit": {
    "title": "Data:Imba/ég veit",
    "filename": "data_imba_ég-veit",
    "file": "/Users/egill/ylhyra_content/data/Imba/ég_veit.md"
  },
  "data/intonation": {
    "title": "Data:Intonation",
    "filename": "data_intonation",
    "file": "/Users/egill/ylhyra_content/data/Intonation.md"
  },
  "data/jónas-hallgrímsson/ásta/1": {
    "title": "Data:Jónas Hallgrímsson/Ásta/1",
    "filename": "data_jónas-hallgrímsson_ásta_1",
    "file": "/Users/egill/ylhyra_content/data/Jónas_Hallgrímsson/Ásta/1.md"
  },
  "data/kristnihald/fólk-ætti-að-faðmast-meira.-eitt-gott": {
    "title": "Data:Kristnihald/Fólk ætti að faðmast meira. Eitt gott",
    "filename": "data_kristnihald_fólk-ætti-að-faðmast-meira.-eitt-gott",
    "file": "/Users/egill/ylhyra_content/data/Kristnihald/Fólk_ætti_að_faðmast_meira._Eitt_gott.md"
  },
  "data/lopapeysa": {
    "title": "Data:Lopapeysa",
    "filename": "data_lopapeysa",
    "file": "/Users/egill/ylhyra_content/data/Lopapeysa.md"
  },
  "data/lúpína": {
    "title": "Data:Lúpína",
    "filename": "data_lúpína",
    "file": "/Users/egill/ylhyra_content/data/Lúpína.md"
  },
  "data/magnús-jochum-pálsson/pípulækningar": {
    "title": "Data:Magnús Jochum Pálsson/Pípulækningar",
    "filename": "data_magnús-jochum-pálsson_pípulækningar",
    "file": "/Users/egill/ylhyra_content/data/Magnús_Jochum_Pálsson/Pípulækningar.md"
  },
  "data/magnús-jochum-pálsson/ánamaðkar": {
    "title": "Data:Magnús Jochum Pálsson/Ánamaðkar",
    "filename": "data_magnús-jochum-pálsson_ánamaðkar",
    "file": "/Users/egill/ylhyra_content/data/Magnús_Jochum_Pálsson/Ánamaðkar.md"
  },
  "data/nafn-vestmannaeyja": {
    "title": "Data:Nafn Vestmannaeyja",
    "filename": "data_nafn-vestmannaeyja",
    "file": "/Users/egill/ylhyra_content/data/Nafn_Vestmannaeyja.md"
  },
  "data/njála/1": {
    "title": "Data:Njála/1",
    "filename": "data_njála_1",
    "file": "/Users/egill/ylhyra_content/data/Njála/1.md"
  },
  "data/project/name": {
    "title": "Data:Project:Name",
    "filename": "data_project_name",
    "file": "/Users/egill/ylhyra_content/data/Project/Name.md"
  },
  "data/r": {
    "title": "Data:R",
    "filename": "data_r",
    "file": "/Users/egill/ylhyra_content/data/R.md"
  },
  "data/text/a1/reykjavík": {
    "title": "Data:Text:A1/Reykjavík",
    "filename": "data_text_a1_reykjavík",
    "file": "/Users/egill/ylhyra_content/data/Reykjavík.md"
  },
  "data/sitji-guðs-englar": {
    "title": "Data:Sitji guðs englar",
    "filename": "data_sitji-guðs-englar",
    "file": "/Users/egill/ylhyra_content/data/Sitji_guðs_englar.md"
  },
  "data/snippet/eiríkur-dansar": {
    "title": "Data:Snippet:Eiríkur dansar",
    "filename": "data_snippet_eiríkur-dansar",
    "file": "/Users/egill/ylhyra_content/data/Snippet/Eiríkur_dansar.md"
  },
  "data/soft-in-the-middle": {
    "title": "Data:Soft in the middle",
    "filename": "data_soft-in-the-middle",
    "file": "/Users/egill/ylhyra_content/data/Soft_in_the_middle.md"
  },
  "data/strætó": {
    "title": "Data:Strætó",
    "filename": "data_strætó",
    "file": "/Users/egill/ylhyra_content/data/Strætó.md"
  },
  "data/sund": {
    "title": "Data:Sund",
    "filename": "data_sund",
    "file": "/Users/egill/ylhyra_content/data/Sund.md"
  },
  "data/sveinbjörn-egilsson/bí-bí-og-blaka": {
    "title": "Data:Sveinbjörn Egilsson/Bí bí og blaka",
    "filename": "data_sveinbjörn-egilsson_bí-bí-og-blaka",
    "file": "/Users/egill/ylhyra_content/data/Sveinbjörn_Egilsson/Bí_bí_og_blaka.md"
  },
  "data/test": {
    "title": "Data:Test",
    "filename": "data_test",
    "file": "/Users/egill/ylhyra_content/data/Test.md"
  },
  "data/text/blær/fyrst-við-erum-hérna/teaser": {
    "title": "Data:Text:Blær/Fyrst við erum hérna/Teaser",
    "filename": "data_text_blær_fyrst-við-erum-hérna_teaser",
    "file": "/Users/egill/ylhyra_content/data/Text/Blær/Fyrst_við_erum_hérna/Teaser.md"
  },
  "data/text/conversations/winter": {
    "title": "Data:Text:Conversations/Winter",
    "filename": "data_text_conversations_winter",
    "file": "/Users/egill/ylhyra_content/data/Text/Conversations/Winter.md"
  },
  "data/text/demo": {
    "title": "Data:Text:Demo",
    "filename": "data_text_demo",
    "file": "/Users/egill/ylhyra_content/data/Text/Demo.md"
  },
  "data/text/magnús-jochum-pálsson/leyfi": {
    "title": "Data:Text:Magnús Jochum Pálsson/Leyfi",
    "filename": "data_text_magnús-jochum-pálsson_leyfi",
    "file": "/Users/egill/ylhyra_content/data/Text/Magnús_Jochum_Pálsson/Leyfi.md"
  },
  "data/text/milk": {
    "title": "Data:Text/Milk",
    "filename": "data_text_milk",
    "file": "/Users/egill/ylhyra_content/data/Text/Milk.md"
  },
  "data/text/sofðu-unga-ástin-mín/1": {
    "title": "Data:Text:Sofðu unga ástin mín/1",
    "filename": "data_text_sofðu-unga-ástin-mín_1",
    "file": "/Users/egill/ylhyra_content/data/Text/Sofðu_unga_ástin_mín/1.md"
  },
  "data/text/ylhýra": {
    "title": "Data:Text:Ylhýra",
    "filename": "data_text_ylhýra",
    "file": "/Users/egill/ylhyra_content/data/Text/Ylhýra.md"
  },
  "data/tweets/benedikt/ber": {
    "title": "Data:Tweets/Benedikt/Ber",
    "filename": "data_tweets_benedikt_ber",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Benedikt/Ber.md"
  },
  "data/tweets/benedikt/blundur": {
    "title": "Data:Tweets/Benedikt/Blundur",
    "filename": "data_tweets_benedikt_blundur",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Benedikt/Blundur.md"
  },
  "data/tweets/benedikt/draumsýn": {
    "title": "Data:Tweets/Benedikt/Draumsýn",
    "filename": "data_tweets_benedikt_draumsýn",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Benedikt/Draumsýn.md"
  },
  "data/tweets/benedikt/hreimur": {
    "title": "Data:Tweets/Benedikt/Hreimur",
    "filename": "data_tweets_benedikt_hreimur",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Benedikt/Hreimur.md"
  },
  "data/tweets/benedikt/ingólfur": {
    "title": "Data:Tweets/Benedikt/Ingólfur",
    "filename": "data_tweets_benedikt_ingólfur",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Benedikt/Ingólfur.md"
  },
  "data/tweets/benedikt/slydda": {
    "title": "Data:Tweets/Benedikt/Slydda",
    "filename": "data_tweets_benedikt_slydda",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Benedikt/Slydda.md"
  },
  "data/tweets/benedikt/yfirmaður": {
    "title": "Data:Tweets/Benedikt/Yfirmaður",
    "filename": "data_tweets_benedikt_yfirmaður",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Benedikt/Yfirmaður.md"
  },
  "data/tweets/branddís/borðaraðir": {
    "title": "Data:Tweets/Branddís/Borðaraðir",
    "filename": "data_tweets_branddís_borðaraðir",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Branddís/Borðaraðir.md"
  },
  "data/tweets/branddís/crossfit": {
    "title": "Data:Tweets/Branddís/Crossfit",
    "filename": "data_tweets_branddís_crossfit",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Branddís/Crossfit.md"
  },
  "data/tweets/branddís/danmörk": {
    "title": "Data:Tweets/Branddís/Danmörk",
    "filename": "data_tweets_branddís_danmörk",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Branddís/Danmörk.md"
  },
  "data/tweets/branddís/köttur": {
    "title": "Data:Tweets/Branddís/Köttur",
    "filename": "data_tweets_branddís_köttur",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Branddís/Köttur.md"
  },
  "data/tweets/branddís/mössuð": {
    "title": "Data:Tweets/Branddís/Mössuð",
    "filename": "data_tweets_branddís_mössuð",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Branddís/Mössuð.md"
  },
  "data/tweets/imba/afgreiðslustörf": {
    "title": "Data:Tweets/Imba/Afgreiðslustörf",
    "filename": "data_tweets_imba_afgreiðslustörf",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Imba/Afgreiðslustörf.md"
  },
  "data/tweets/imba/ligeglad": {
    "title": "Data:Tweets/Imba/Ligeglad",
    "filename": "data_tweets_imba_ligeglad",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Imba/Ligeglad.md"
  },
  "data/tweets/imba/rok": {
    "title": "Data:Tweets/Imba/Rok",
    "filename": "data_tweets_imba_rok",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Imba/Rok.md"
  },
  "data/tweets/imba/þjóðverjar": {
    "title": "Data:Tweets/Imba/Þjóðverjar",
    "filename": "data_tweets_imba_þjóðverjar",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Imba/Þjóðverjar.md"
  },
  "data/tweets/kristín-ólafs/slúður": {
    "title": "Data:Tweets/Kristín Ólafs/Slúður",
    "filename": "data_tweets_kristín-ólafs_slúður",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Kristín_Ólafs/Slúður.md"
  },
  "data/tweets/kristín-ólafs/unglingar": {
    "title": "Data:Tweets/Kristín Ólafs/Unglingar",
    "filename": "data_tweets_kristín-ólafs_unglingar",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Kristín_Ólafs/Unglingar.md"
  },
  "data/tweets/rannveig-dóra/matur": {
    "title": "Data:Tweets/Rannveig Dóra/Matur",
    "filename": "data_tweets_rannveig-dóra_matur",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Rannveig_Dóra/Matur.md"
  },
  "data/tweets/ása/kettir": {
    "title": "Data:Tweets/Ása/Kettir",
    "filename": "data_tweets_ása_kettir",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Ása/Kettir.md"
  },
  "data/tweets/ása/ormurinn": {
    "title": "Data:Tweets/Ása/Ormurinn",
    "filename": "data_tweets_ása_ormurinn",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Ása/Ormurinn.md"
  },
  "data/tweets/ása/sjófánar": {
    "title": "Data:Tweets/Ása/Sjófánar",
    "filename": "data_tweets_ása_sjófánar",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Ása/Sjófánar.md"
  },
  "data/tweets/ása/stjörnur": {
    "title": "Data:Tweets/Ása/Stjörnur",
    "filename": "data_tweets_ása_stjörnur",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Ása/Stjörnur.md"
  },
  "data/tweets/ása/sund": {
    "title": "Data:Tweets/Ása/Sund",
    "filename": "data_tweets_ása_sund",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Ása/Sund.md"
  },
  "data/tweets/ása/íslenskar-bíómyndir": {
    "title": "Data:Tweets/Ása/Íslenskar bíómyndir",
    "filename": "data_tweets_ása_íslenskar-bíómyndir",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Ása/Íslenskar_bíómyndir.md"
  },
  "data/tweets/ólafur/ólæs": {
    "title": "Data:Tweets/Ólafur/Ólæs",
    "filename": "data_tweets_ólafur_ólæs",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Ólafur/Ólæs.md"
  },
  "data/tweets/þorsteinn/afi": {
    "title": "Data:Tweets/Þorsteinn/Afi",
    "filename": "data_tweets_þorsteinn_afi",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Þorsteinn/Afi.md"
  },
  "data/tweets/þorsteinn/alþingi": {
    "title": "Data:Tweets/Þorsteinn/Alþingi",
    "filename": "data_tweets_þorsteinn_alþingi",
    "file": "/Users/egill/ylhyra_content/data/Tweets/Þorsteinn/Alþingi.md"
  },
  "data/vestmannaeyjar": {
    "title": "Data:Vestmannaeyjar",
    "filename": "data_vestmannaeyjar",
    "file": "/Users/egill/ylhyra_content/data/Vestmannaeyjar.md"
  },
  "data/villi-neto/bubbi": {
    "title": "Data:Villi Neto/Bubbi",
    "filename": "data_villi-neto_bubbi",
    "file": "/Users/egill/ylhyra_content/data/Villi_Neto/Bubbi.md"
  },
  "data/villi-neto/finnland": {
    "title": "Data:Villi Neto/Finnland",
    "filename": "data_villi-neto_finnland",
    "file": "/Users/egill/ylhyra_content/data/Villi_Neto/Finnland.md"
  },
  "data/villi-neto/forníslenski-sjomlinn": {
    "title": "Data:Villi Neto/Forníslenski sjomlinn",
    "filename": "data_villi-neto_forníslenski-sjomlinn",
    "file": "/Users/egill/ylhyra_content/data/Villi_Neto/Forníslenski_sjomlinn.md"
  },
  "data/villi-neto/fullt-nafn": {
    "title": "Data:Villi Neto/Fullt nafn",
    "filename": "data_villi-neto_fullt-nafn",
    "file": "/Users/egill/ylhyra_content/data/Villi_Neto/Fullt_nafn.md"
  },
  "data/villi-neto/kaffi": {
    "title": "Data:Villi Neto/Kaffi",
    "filename": "data_villi-neto_kaffi",
    "file": "/Users/egill/ylhyra_content/data/Villi_Neto/Kaffi.md"
  },
  "data/villi-neto/lýsi": {
    "title": "Data:Villi Neto/Lýsi",
    "filename": "data_villi-neto_lýsi",
    "file": "/Users/egill/ylhyra_content/data/Villi_Neto/Lýsi.md"
  },
  "data/villi-neto/reiður-á-innsoginu": {
    "title": "Data:Villi Neto/Reiður á innsoginu",
    "filename": "data_villi-neto_reiður-á-innsoginu",
    "file": "/Users/egill/ylhyra_content/data/Villi_Neto/Reiður_á_innsoginu.md"
  },
  "data/villi-neto/skata": {
    "title": "Data:Villi Neto/Skata",
    "filename": "data_villi-neto_skata",
    "file": "/Users/egill/ylhyra_content/data/Villi_Neto/Skata.md"
  },
  "data/villi-neto/íslendingar-í-sólarlöndum": {
    "title": "Data:Villi Neto/Íslendingar í sólarlöndum",
    "filename": "data_villi-neto_íslendingar-í-sólarlöndum",
    "file": "/Users/egill/ylhyra_content/data/Villi_Neto/Íslendingar_í_sólarlöndum.md"
  },
  "data/villi-neto/íslenskar-myndir": {
    "title": "Data:Villi Neto/Íslenskar myndir",
    "filename": "data_villi-neto_íslenskar-myndir",
    "file": "/Users/egill/ylhyra_content/data/Villi_Neto/Íslenskar_myndir.md"
  },
  "data/vísur-vatnsenda-rósu": {
    "title": "Data:Vísur Vatnsenda-Rósu",
    "filename": "data_vísur-vatnsenda-rósu",
    "file": "/Users/egill/ylhyra_content/data/Vísur_Vatnsenda-Rósu.md"
  },
  "data/þorsteins-þáttur-stangarhöggs/1": {
    "title": "Data:Þorsteins þáttur stangarhöggs/1",
    "filename": "data_þorsteins-þáttur-stangarhöggs_1",
    "file": "/Users/egill/ylhyra_content/data/Þorsteins_þáttur_stangarhöggs/1.md"
  },
  "data/þorsteins-þáttur-stangarhöggs/2": {
    "title": "Data:Þorsteins þáttur stangarhöggs/2",
    "filename": "data_þorsteins-þáttur-stangarhöggs_2",
    "file": "/Users/egill/ylhyra_content/data/Þorsteins_þáttur_stangarhöggs/2.md"
  },
  "data/þorsteins-þáttur-stangarhöggs/3": {
    "title": "Data:Þorsteins þáttur stangarhöggs/3",
    "filename": "data_þorsteins-þáttur-stangarhöggs_3",
    "file": "/Users/egill/ylhyra_content/data/Þorsteins_þáttur_stangarhöggs/3.md"
  },
  "data/þúfa": {
    "title": "Data:Þúfa",
    "filename": "data_þúfa",
    "file": "/Users/egill/ylhyra_content/data/Þúfa.md"
  },
  "": {
    "title": "",
    "filename": "",
    "file": "/Users/egill/ylhyra_content/not_data/content/Frontpage.md"
  },
  "ylhýra": {
    "redirect_to": ""
  },
  "course": {
    "title": "Course",
    "filename": "course",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/Table_of_contents.md"
  },
  "course/a1/about-icelandic": {
    "title": "Course/A1/About Icelandic",
    "filename": "course_a1_about-icelandic",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/About_Icelandic.md"
  },
  "course/a1/at-the-supermarket": {
    "title": "Course/A1/At the supermarket",
    "filename": "course_a1_at-the-supermarket",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/At_the_supermarket.md"
  },
  "course/a1/að": {
    "title": "Course/A1/Að",
    "filename": "course_a1_að",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Að.md"
  },
  "text/að/intro": {
    "redirect_to": "course/a1/að"
  },
  "course/a1/conversation-–-búinn": {
    "title": "Course/A1/Conversation – Búinn",
    "filename": "course_a1_conversation-–-búinn",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Conversation_–_Búinn.md"
  },
  "course/a1/conversation-–-búinn-2": {
    "title": "Course/A1/Conversation – Búinn 2",
    "filename": "course_a1_conversation-–-búinn-2",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Conversation_–_Búinn_2.md"
  },
  "course/a1/double-l": {
    "title": "Course/A1/Double L",
    "filename": "course_a1_double-l",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Double_L.md"
  },
  "course/a1/good-day": {
    "title": "Course/A1/Good day",
    "filename": "course_a1_good-day",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Good_day.md"
  },
  "chapter-2/good-day": {
    "redirect_to": "course/a1/good-day"
  },
  "course/a1/hello": {
    "title": "Course/A1/Hello",
    "filename": "course_a1_hello",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Hello.md"
  },
  "chapter-1/hello": {
    "redirect_to": "course/a1/hello"
  },
  "course/a1/is": {
    "title": "Course/A1/Is",
    "filename": "course_a1_is",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Is.md"
  },
  "course/a1/listening-–-sæll": {
    "title": "Course/A1/Listening – sæll",
    "filename": "course_a1_listening-–-sæll",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Listening_–_sæll.md"
  },
  "course/a1/politeness": {
    "title": "Course/A1/Politeness",
    "filename": "course_a1_politeness",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Politeness.md"
  },
  "course/a1/questions": {
    "title": "Course/A1/Questions",
    "filename": "course_a1_questions",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Questions.md"
  },
  "chapter-2/questions": {
    "redirect_to": "course/a1/questions"
  },
  "course/a1/sæll": {
    "title": "Course/A1/Sæll",
    "filename": "course_a1_sæll",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Sæll.md"
  },
  "text/sæll/intro": {
    "redirect_to": "course/a1/sæll"
  },
  "course/a1/thanks": {
    "title": "Course/A1/Thanks",
    "filename": "course_a1_thanks",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Thanks.md"
  },
  "chapter-2/thanks": {
    "redirect_to": "course/a1/thanks"
  },
  "course/a1/this": {
    "title": "Course/A1/This",
    "filename": "course_a1_this",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/This.md"
  },
  "text/þetta/intro": {
    "redirect_to": "course/a1/this"
  },
  "course/a1/want": {
    "title": "Course/A1/Want",
    "filename": "course_a1_want",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/Want.md"
  },
  "course/a1/new-letters---þ,-ð": {
    "title": "Course/A1/New letters - Þ, Ð",
    "filename": "course_a1_new-letters---þ,-ð",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/A1/_Þ,_Ð.md"
  },
  "course/cases-of-vinur": {
    "title": "Course/Cases of vinur",
    "filename": "course_cases-of-vinur",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/Cases_of_vinur.md"
  },
  "chapter-1/er": {
    "title": "Chapter 1/Er",
    "filename": "chapter-1_er",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/Chapter_1/Er.md"
  },
  "chapter-1/vocabulary": {
    "title": "Chapter 1/Vocabulary",
    "filename": "chapter-1_vocabulary",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/Chapter_1/Vocabulary.md"
  },
  "chapter-1": {
    "title": "Chapter 1",
    "filename": "chapter-1",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/Chapter_1/index.md"
  },
  "chapter-2": {
    "title": "Chapter 2",
    "filename": "chapter-2",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/Chapter_2/index.md"
  },
  "chapter-3": {
    "title": "Chapter 3",
    "filename": "chapter-3",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/Chapter_3.md"
  },
  "chapter-4": {
    "title": "Chapter 4",
    "filename": "chapter-4",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/Chapter_4.md"
  },
  "chapter-6": {
    "title": "Chapter 6",
    "filename": "chapter-6",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/Chapter_6.md"
  },
  "course/to-watch": {
    "title": "Course/To watch",
    "filename": "course_to-watch",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/To_watch.md"
  },
  "conversations/prentari": {
    "title": "Conversations/Prentari",
    "filename": "conversations_prentari",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/conversations/Prentari.md"
  },
  "text/conversations/winter": {
    "title": "Text:Conversations/Winter",
    "filename": "text_conversations_winter",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/_drafts/conversations/Winter.md"
  },
  "conversations/winter": {
    "redirect_to": "text/conversations/winter"
  },
  "course/doing": {
    "title": "Course/Doing",
    "filename": "course_doing",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/Doing.md"
  },
  "course/going-to": {
    "title": "Course/Going to",
    "filename": "course_going-to",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/Going_to.md"
  },
  "course/greetings": {
    "title": "Course/Greetings",
    "filename": "course_greetings",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/Greetings.md"
  },
  "course/how": {
    "title": "Course/How?",
    "filename": "course_how",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/How?.md"
  },
  "course/how-are-you": {
    "title": "Course/How are you",
    "filename": "course_how-are-you",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/How_are_you.md"
  },
  "course/i-am": {
    "title": "Course/I am",
    "filename": "course_i-am",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/I_am.md"
  },
  "course/i-know": {
    "title": "Course/I know",
    "filename": "course_i-know",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/I_know.md"
  },
  "course/i-like": {
    "title": "Course/I like",
    "filename": "course_i-like",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/I_like.md"
  },
  "course/introduction-to-cases": {
    "title": "Course/Introduction to cases",
    "filename": "course_introduction-to-cases",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/Introduction_to_cases.md"
  },
  "course/live": {
    "title": "Course/Live",
    "filename": "course_live",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/Live.md"
  },
  "course/ordering-food": {
    "title": "Course/Ordering food",
    "filename": "course_ordering-food",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/Ordering_food.md"
  },
  "course/the": {
    "title": "Course/The",
    "filename": "course_the",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/The.md"
  },
  "course/to-own": {
    "title": "Course/To own",
    "filename": "course_to-own",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/To_own.md"
  },
  "course/want": {
    "title": "Course/Want",
    "filename": "course_want",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/Want.md"
  },
  "course/when": {
    "title": "Course/When?",
    "filename": "course_when",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/When?.md"
  },
  "course/why": {
    "title": "Course/Why?",
    "filename": "course_why",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/Why?.md"
  },
  "course/word-merging": {
    "title": "Course/Word merging",
    "filename": "course_word-merging",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/Word_merging.md"
  },
  "word-merging": {
    "redirect_to": "course/word-merging"
  },
  "course/yes": {
    "title": "Course/Yes",
    "filename": "course_yes",
    "file": "/Users/egill/ylhyra_content/not_data/content/course/a1/Yes.md"
  },
  "-ó-endings/less-common-words": {
    "title": "-ó endings/Less common words",
    "filename": "-ó-endings_less-common-words",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/-ó_endings/Less_common_words.md"
  },
  "-ó-endings": {
    "title": "-ó endings",
    "filename": "-ó-endings",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/-ó_endings/index.md"
  },
  "adjectives": {
    "title": "Adjectives",
    "filename": "adjectives",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Adjectives/Adjectives.md"
  },
  "adjective": {
    "redirect_to": "adjectives"
  },
  "lýsingarorð": {
    "redirect_to": "adjectives"
  },
  "adverbs": {
    "title": "Adverbs",
    "filename": "adverbs",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Adverbs/Adverbs.md"
  },
  "adverb": {
    "redirect_to": "adverbs"
  },
  "atviksorð": {
    "redirect_to": "adverbs"
  },
  "prepositions": {
    "title": "Prepositions",
    "filename": "prepositions",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Adverbs/Prepositions.md"
  },
  "preposition": {
    "redirect_to": "prepositions"
  },
  "prepositions-that-cause-cases": {
    "redirect_to": "prepositions"
  },
  "questions": {
    "title": "Questions",
    "filename": "questions",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Adverbs/Questions.md"
  },
  "question": {
    "redirect_to": "questions"
  },
  "a": {
    "title": "A",
    "filename": "a",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/A.md"
  },
  "alphabet-and-pronunciation": {
    "title": "Alphabet and pronunciation",
    "filename": "alphabet-and-pronunciation",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Alphabet_and_pronunciation.md"
  },
  "alphabet": {
    "redirect_to": "alphabet-and-pronunciation"
  },
  "icelandic-alphabet": {
    "redirect_to": "alphabet-and-pronunciation"
  },
  "pronunciation": {
    "redirect_to": "alphabet-and-pronunciation"
  },
  "spelling": {
    "redirect_to": "alphabet-and-pronunciation"
  },
  "au": {
    "title": "Au",
    "filename": "au",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Au.md"
  },
  "b": {
    "title": "B",
    "filename": "b",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/B.md"
  },
  "d": {
    "title": "D",
    "filename": "d",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/D.md"
  },
  "e": {
    "title": "E",
    "filename": "e",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/E.md"
  },
  "ei-and-ey": {
    "title": "Ei and ey",
    "filename": "ei-and-ey",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Ei_and_ey.md"
  },
  "ei": {
    "redirect_to": "ei-and-ey"
  },
  "ey": {
    "redirect_to": "ei-and-ey"
  },
  "f": {
    "title": "F",
    "filename": "f",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/F.md"
  },
  "g": {
    "title": "G",
    "filename": "g",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/G.md"
  },
  "g-in-the-roof-of-the-mouth": {
    "redirect_to": "g",
    "section": "g-in-the-roof-of-the-mouth"
  },
  "soft-g": {
    "redirect_to": "g",
    "section": "soft-g"
  },
  "soft-g-sound": {
    "redirect_to": "g",
    "section": "soft-g"
  },
  "soft-throaty-g": {
    "redirect_to": "g",
    "section": "soft-throaty-g"
  },
  "h": {
    "title": "H",
    "filename": "h",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/H.md"
  },
  "hv": {
    "redirect_to": "h",
    "section": "exceptions"
  },
  "i": {
    "title": "I",
    "filename": "i",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/I.md"
  },
  "j": {
    "title": "J",
    "filename": "j",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/J.md"
  },
  "k": {
    "title": "K",
    "filename": "k",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/K.md"
  },
  "l": {
    "title": "L",
    "filename": "l",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/L.md"
  },
  "breathy-l": {
    "redirect_to": "l",
    "section": "breathy-l"
  },
  "clicky-double-l": {
    "redirect_to": "l",
    "section": "clicky-double-l"
  },
  "double-l": {
    "redirect_to": "l",
    "section": "double-l"
  },
  "ll": {
    "redirect_to": "l",
    "section": "double-l"
  },
  "m": {
    "title": "M",
    "filename": "m",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/M.md"
  },
  "n": {
    "title": "N",
    "filename": "n",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/N.md"
  },
  "ng-and-nk-rule": {
    "title": "Ng and nk rule",
    "filename": "ng-and-nk-rule",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Ng_and_nk_rule.md"
  },
  "ng": {
    "redirect_to": "ng-and-nk-rule"
  },
  "nk": {
    "redirect_to": "ng-and-nk-rule"
  },
  "o": {
    "title": "O",
    "filename": "o",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/O.md"
  },
  "p": {
    "title": "P",
    "filename": "p",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/P.md"
  },
  "r": {
    "title": "R",
    "filename": "r",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/R.md"
  },
  "breathy-r": {
    "redirect_to": "r",
    "section": "breathy-r"
  },
  "s": {
    "title": "S",
    "filename": "s",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/S.md"
  },
  "t": {
    "title": "T",
    "filename": "t",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/T.md"
  },
  "u": {
    "title": "U",
    "filename": "u",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/U.md"
  },
  "v": {
    "title": "V",
    "filename": "v",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/V.md"
  },
  "x": {
    "title": "X",
    "filename": "x",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/X.md"
  },
  "y": {
    "title": "Y",
    "filename": "y",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Y.md"
  },
  "z": {
    "title": "Z",
    "filename": "z",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Z.md"
  },
  "á": {
    "title": "Á",
    "filename": "á",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Á.md"
  },
  "æ": {
    "title": "Æ",
    "filename": "æ",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Æ.md"
  },
  "é": {
    "title": "É",
    "filename": "é",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/É.md"
  },
  "í": {
    "title": "Í",
    "filename": "í",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Í.md"
  },
  "í-vs.-á": {
    "title": "Í vs. á",
    "filename": "í-vs.-á",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Í_vs._á.md"
  },
  "ð": {
    "title": "Ð",
    "filename": "ð",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Ð.md"
  },
  "ó": {
    "title": "Ó",
    "filename": "ó",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Ó.md"
  },
  "ö": {
    "title": "Ö",
    "filename": "ö",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Ö.md"
  },
  "ú": {
    "title": "Ú",
    "filename": "ú",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Ú.md"
  },
  "ý": {
    "title": "Ý",
    "filename": "ý",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Ý.md"
  },
  "þ": {
    "title": "Þ",
    "filename": "þ",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Alphabet/Þ.md"
  },
  "asking-for-things": {
    "title": "Asking for things",
    "filename": "asking-for-things",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Asking_for_things.md"
  },
  "course/a1/get-ég-fengið": {
    "redirect_to": "asking-for-things"
  },
  "búinn/a1/exercise-1": {
    "title": "Búinn/A1/Exercise 1",
    "filename": "búinn_a1_exercise-1",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Búinn/A1/Exercise_1.md"
  },
  "búinn": {
    "title": "Búinn",
    "filename": "búinn",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Búinn/Búinn.md"
  },
  "búin": {
    "redirect_to": "búinn"
  },
  "búið": {
    "redirect_to": "búinn"
  },
  "búinn-vs.-hef/exercise-1": {
    "title": "Búinn vs. hef/Exercise 1",
    "filename": "búinn-vs.-hef_exercise-1",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Búinn/Búinn_vs._hef/Exercise_1.md"
  },
  "búinn-vs.-hef": {
    "title": "Búinn vs. hef",
    "filename": "búinn-vs.-hef",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Búinn/Búinn_vs._hef/index.md"
  },
  "cases/a1/exercise-1": {
    "title": "Cases/A1/Exercise 1",
    "filename": "cases_a1_exercise-1",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/A1/Exercise_1.md"
  },
  "cases-caused-by-verbs": {
    "title": "Cases caused by verbs",
    "filename": "cases-caused-by-verbs",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/Cases_caused_by_verbs.md"
  },
  "cases/verbs-that-cause-cases": {
    "redirect_to": "cases-caused-by-verbs"
  },
  "verbs-that-cause-cases": {
    "redirect_to": "cases-caused-by-verbs"
  },
  "declension": {
    "title": "Declension",
    "filename": "declension",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/Declension.md"
  },
  "declension-table": {
    "redirect_to": "declension"
  },
  "decline": {
    "redirect_to": "declension"
  },
  "declined": {
    "redirect_to": "declension"
  },
  "guide-to-declension": {
    "redirect_to": "declension"
  },
  "helper-word": {
    "redirect_to": "declension"
  },
  "helper-words": {
    "redirect_to": "declension"
  },
  "helper-words-for-declension": {
    "redirect_to": "declension"
  },
  "first-case": {
    "title": "First case",
    "filename": "first-case",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/First_case.md"
  },
  "nefnifall": {
    "redirect_to": "first-case"
  },
  "nf": {
    "redirect_to": "first-case"
  },
  "nf.": {
    "redirect_to": "first-case"
  },
  "nom": {
    "redirect_to": "first-case"
  },
  "nominative": {
    "redirect_to": "first-case"
  },
  "nominative-case": {
    "redirect_to": "first-case"
  },
  "fourth-case": {
    "title": "Fourth case",
    "filename": "fourth-case",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/Fourth_case.md"
  },
  "ef.": {
    "redirect_to": "fourth-case"
  },
  "eignarfall": {
    "redirect_to": "fourth-case"
  },
  "gen": {
    "redirect_to": "fourth-case"
  },
  "genitive": {
    "redirect_to": "fourth-case"
  },
  "genitive-case": {
    "redirect_to": "fourth-case"
  },
  "inflection": {
    "title": "Inflection",
    "filename": "inflection",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/Inflection.md"
  },
  "beyging": {
    "redirect_to": "inflection"
  },
  "inflect": {
    "redirect_to": "inflection"
  },
  "inflections": {
    "redirect_to": "inflection"
  },
  "list-of-noun-declension-patterns": {
    "title": "List of noun declension patterns",
    "filename": "list-of-noun-declension-patterns",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/List_of_noun_declension_patterns.md"
  },
  "prepositions-that-cause-cases/í-–-exercise-1": {
    "title": "Prepositions that cause cases/Í – exercise 1",
    "filename": "prepositions-that-cause-cases_í-–-exercise-1",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/Prepositions_that_cause_cases/Í_–_exercise_1.md"
  },
  "prepositions-that-cause-cases/í-–-excercise-1": {
    "redirect_to": "prepositions-that-cause-cases/í-–-exercise-1"
  },
  "second-case": {
    "title": "Second case",
    "filename": "second-case",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/Second_case.md"
  },
  "accusative": {
    "redirect_to": "second-case"
  },
  "accusative-case": {
    "redirect_to": "second-case"
  },
  "þf": {
    "redirect_to": "second-case"
  },
  "þf.": {
    "redirect_to": "second-case"
  },
  "þolfall": {
    "redirect_to": "second-case"
  },
  "strong-and-weak-declension": {
    "title": "Strong and weak declension",
    "filename": "strong-and-weak-declension",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/Strong_and_weak_declension.md"
  },
  "sterk-beyging": {
    "redirect_to": "strong-and-weak-declension"
  },
  "strong": {
    "redirect_to": "strong-and-weak-declension"
  },
  "strong-declension": {
    "redirect_to": "strong-and-weak-declension"
  },
  "veik-beyging": {
    "redirect_to": "strong-and-weak-declension"
  },
  "weak": {
    "redirect_to": "strong-and-weak-declension"
  },
  "weak-declension": {
    "redirect_to": "strong-and-weak-declension"
  },
  "third-case": {
    "title": "Third case",
    "filename": "third-case",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/Third_case.md"
  },
  "dative": {
    "redirect_to": "third-case"
  },
  "dative-case": {
    "redirect_to": "third-case"
  },
  "þgf": {
    "redirect_to": "third-case"
  },
  "þágufall": {
    "redirect_to": "third-case"
  },
  "cases": {
    "title": "Cases",
    "filename": "cases",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Cases/index.md"
  },
  "case": {
    "redirect_to": "cases"
  },
  "cases/introduction": {
    "redirect_to": "cases"
  },
  "course/a1/introduction-to-cases": {
    "redirect_to": "cases"
  },
  "kennitala": {
    "title": "Kennitala",
    "filename": "kennitala",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Culture/Kennitala.md"
  },
  "kt": {
    "redirect_to": "kennitala"
  },
  "kt.": {
    "redirect_to": "kennitala"
  },
  "linguistic-purism": {
    "title": "Linguistic purism",
    "filename": "linguistic-purism",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Culture/Linguistic_purism.md"
  },
  "nicknames-in-icelandic": {
    "title": "Nicknames in Icelandic",
    "filename": "nicknames-in-icelandic",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Culture/Nicknames_in_Icelandic.md"
  },
  "nicknames": {
    "redirect_to": "nicknames-in-icelandic"
  },
  "íslensk-gælunöfn": {
    "redirect_to": "nicknames-in-icelandic"
  },
  "sletta": {
    "title": "Sletta",
    "filename": "sletta",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Culture/Sletta.md"
  },
  "foreign-words": {
    "redirect_to": "sletta"
  },
  "loan-word": {
    "redirect_to": "sletta"
  },
  "slettur": {
    "redirect_to": "sletta"
  },
  "style-of-icelandic-used-in-the-news": {
    "title": "Style of Icelandic used in the news",
    "filename": "style-of-icelandic-used-in-the-news",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Culture/Style_of_Icelandic_used_in_the_news.md"
  },
  "written-icelandic": {
    "title": "Written Icelandic",
    "filename": "written-icelandic",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Culture/Written_Icelandic.md"
  },
  "difficulty-scale": {
    "title": "Difficulty scale",
    "filename": "difficulty-scale",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Difficulty_scale.md"
  },
  "a1": {
    "redirect_to": "difficulty-scale",
    "section": "a1"
  },
  "a2": {
    "redirect_to": "difficulty-scale",
    "section": "a2"
  },
  "b1": {
    "redirect_to": "difficulty-scale",
    "section": "b1"
  },
  "b2": {
    "redirect_to": "difficulty-scale",
    "section": "b2"
  },
  "c1": {
    "redirect_to": "difficulty-scale",
    "section": "c1"
  },
  "c2": {
    "redirect_to": "difficulty-scale",
    "section": "c2"
  },
  "cefr": {
    "redirect_to": "difficulty-scale"
  },
  "levels": {
    "redirect_to": "difficulty-scale"
  },
  "explanations": {
    "title": "Explanations",
    "filename": "explanations",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Explanations.md"
  },
  "explanation": {
    "redirect_to": "explanations"
  },
  "gender": {
    "title": "Gender",
    "filename": "gender",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Gender/Gender.md"
  },
  "course/a1/introduction-to-gender": {
    "redirect_to": "gender"
  },
  "feminine": {
    "redirect_to": "gender"
  },
  "kyn": {
    "redirect_to": "gender"
  },
  "masculine": {
    "redirect_to": "gender"
  },
  "neuter": {
    "redirect_to": "gender"
  },
  "how-to-learn-a-language": {
    "title": "How to learn a language",
    "filename": "how-to-learn-a-language",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/How_to_learn_a_language.md"
  },
  "course/a1/how-to-learn-a-language": {
    "redirect_to": "how-to-learn-a-language"
  },
  "how-to-use-ylhýra": {
    "title": "How to use Ylhýra",
    "filename": "how-to-use-ylhýra",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/How_to_use_Ylhýra.md"
  },
  "introduction": {
    "title": "Introduction",
    "filename": "introduction",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Introduction.md"
  },
  "nouns": {
    "title": "Nouns",
    "filename": "nouns",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Nouns/Nouns.md"
  },
  "nafnorð": {
    "redirect_to": "nouns"
  },
  "noun": {
    "redirect_to": "nouns"
  },
  "the": {
    "title": "The",
    "filename": "the",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Nouns/The.md"
  },
  "course/a1/the": {
    "redirect_to": "the"
  },
  "definite-article": {
    "redirect_to": "the"
  },
  "definite-article/introduction": {
    "redirect_to": "the"
  },
  "with-article": {
    "redirect_to": "the"
  },
  "with-definite-article": {
    "redirect_to": "the"
  },
  "without-article": {
    "redirect_to": "the"
  },
  "age": {
    "title": "Age",
    "filename": "age",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Numbers/Age.md"
  },
  "módel": {
    "redirect_to": "age",
    "section": "módel"
  },
  "money": {
    "title": "Money",
    "filename": "money",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Numbers/Money.md"
  },
  "numbers": {
    "title": "Numbers",
    "filename": "numbers",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Numbers/Numbers.md"
  },
  "time": {
    "title": "Time",
    "filename": "time",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Numbers/Time.md"
  },
  "opinion": {
    "title": "Opinion",
    "filename": "opinion",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Opinion.md"
  },
  "passive-and-active-vocabulary": {
    "title": "Passive and active vocabulary",
    "filename": "passive-and-active-vocabulary",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Passive_and_active_vocabulary.md"
  },
  "active-vocabulary": {
    "redirect_to": "passive-and-active-vocabulary"
  },
  "passive-vocabulary": {
    "redirect_to": "passive-and-active-vocabulary"
  },
  "politeness": {
    "title": "Politeness",
    "filename": "politeness",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Politeness.md"
  },
  "positivity": {
    "title": "Positivity",
    "filename": "positivity",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Positivity.md"
  },
  "possessions": {
    "title": "Possessions",
    "filename": "possessions",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronouns/Possessions.md"
  },
  "my": {
    "redirect_to": "possessions"
  },
  "possession": {
    "redirect_to": "possessions"
  },
  "pronouns": {
    "title": "Pronouns",
    "filename": "pronouns",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronouns/Pronouns.md"
  },
  "sitt-hvor": {
    "title": "Sitt hvor",
    "filename": "sitt-hvor",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronouns/Sitt_hvor.md"
  },
  "text/þetta/full-explanation": {
    "title": "Text:Þetta/Full explanation",
    "filename": "text_þetta_full-explanation",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronouns/Þetta.md"
  },
  "disappearing-sounds": {
    "title": "Disappearing sounds",
    "filename": "disappearing-sounds",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronunciation/Disappearing_sounds.md"
  },
  "disappearing-vowel": {
    "redirect_to": "disappearing-sounds",
    "section": "vowels-that-merge-into-the-next-vowel-disappearing-vowels"
  },
  "slurring": {
    "redirect_to": "disappearing-sounds"
  },
  "ekki": {
    "title": "Ekki",
    "filename": "ekki",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronunciation/Ekki.md"
  },
  "exhaling-before-sounds": {
    "title": "Exhaling before sounds",
    "filename": "exhaling-before-sounds",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronunciation/Exhaling_before_sounds.md"
  },
  "aspiration": {
    "redirect_to": "exhaling-before-sounds"
  },
  "aspirations": {
    "redirect_to": "exhaling-before-sounds"
  },
  "blowing-out-air": {
    "redirect_to": "exhaling-before-sounds"
  },
  "breath-of-air": {
    "redirect_to": "exhaling-before-sounds"
  },
  "breathe-out": {
    "redirect_to": "exhaling-before-sounds"
  },
  "breathing-out": {
    "redirect_to": "exhaling-before-sounds"
  },
  "exhalation": {
    "redirect_to": "exhaling-before-sounds"
  },
  "preaspiration": {
    "redirect_to": "exhaling-before-sounds"
  },
  "preaspirations": {
    "redirect_to": "exhaling-before-sounds"
  },
  "short-breath": {
    "redirect_to": "exhaling-before-sounds"
  },
  "intonation": {
    "title": "Intonation",
    "filename": "intonation",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronunciation/Intonation.md"
  },
  "short-and-long-vowels": {
    "title": "Short and long vowels",
    "filename": "short-and-long-vowels",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronunciation/Short_and_long_vowels.md"
  },
  "long": {
    "redirect_to": "short-and-long-vowels"
  },
  "long-sound": {
    "redirect_to": "short-and-long-vowels"
  },
  "long-vowel": {
    "redirect_to": "short-and-long-vowels"
  },
  "long-vowels": {
    "redirect_to": "short-and-long-vowels"
  },
  "short": {
    "redirect_to": "short-and-long-vowels"
  },
  "short-sound": {
    "redirect_to": "short-and-long-vowels"
  },
  "short-vowel": {
    "redirect_to": "short-and-long-vowels"
  },
  "short-vowels": {
    "redirect_to": "short-and-long-vowels"
  },
  "stress": {
    "title": "Stress",
    "filename": "stress",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronunciation/Stress.md"
  },
  "emphasis": {
    "redirect_to": "stress"
  },
  "voiceless-at-the-end-of-sentences": {
    "title": "Voiceless at the end of sentences",
    "filename": "voiceless-at-the-end-of-sentences",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Pronunciation/Voiceless_at_the_end_of_sentences.md"
  },
  "devoicing": {
    "redirect_to": "voiceless-at-the-end-of-sentences"
  },
  "e-books-in-icelandic": {
    "title": "E-books in Icelandic",
    "filename": "e-books-in-icelandic",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Resources/E-books_in_Icelandic.md"
  },
  "resources": {
    "title": "Resources",
    "filename": "resources",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Resources/Resources.md"
  },
  "project/helpful-links": {
    "redirect_to": "resources"
  },
  "-st-verbs": {
    "title": "-st verbs",
    "filename": "-st-verbs",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/-st_verbs.md"
  },
  "mediopassive": {
    "redirect_to": "-st-verbs"
  },
  "mediopassive-voice": {
    "redirect_to": "-st-verbs"
  },
  "middle-voice": {
    "redirect_to": "-st-verbs"
  },
  "miðmynd": {
    "redirect_to": "-st-verbs"
  },
  "að-vera": {
    "title": "Að vera",
    "filename": "að-vera",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/Að_vera.md"
  },
  "future": {
    "title": "Future",
    "filename": "future",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/Future.md"
  },
  "giving-orders": {
    "title": "Giving orders",
    "filename": "giving-orders",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/Giving_orders.md"
  },
  "boðháttur": {
    "redirect_to": "giving-orders"
  },
  "imperative": {
    "redirect_to": "giving-orders"
  },
  "indicative": {
    "title": "Indicative",
    "filename": "indicative",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/Indicative.md"
  },
  "fh": {
    "redirect_to": "indicative"
  },
  "framsöguháttur": {
    "redirect_to": "indicative"
  },
  "indicative-mood": {
    "redirect_to": "indicative"
  },
  "realis": {
    "redirect_to": "indicative"
  },
  "realis-mood": {
    "redirect_to": "indicative"
  },
  "regular-verb-form": {
    "redirect_to": "indicative"
  },
  "infinitive": {
    "title": "Infinitive",
    "filename": "infinitive",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/Infinitive.md"
  },
  "nafnháttur": {
    "redirect_to": "infinitive"
  },
  "past-participle": {
    "title": "Past participle",
    "filename": "past-participle",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/Past_participle.md"
  },
  "lhþt": {
    "redirect_to": "past-participle"
  },
  "lýsingarháttur-þátíðar-sagnbót": {
    "redirect_to": "past-participle",
    "section": "sagnbót"
  },
  "supine": {
    "redirect_to": "past-participle",
    "section": "sagnbót"
  },
  "present-participle": {
    "title": "Present participle",
    "filename": "present-participle",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/Present_participle.md"
  },
  "subjunctive/exercise-1": {
    "title": "Subjunctive/Exercise 1",
    "filename": "subjunctive_exercise-1",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/Subjunctive/Exercise_1.md"
  },
  "viðtengingarháttur/exercise-1": {
    "redirect_to": "subjunctive/exercise-1"
  },
  "subjunctive": {
    "title": "Subjunctive",
    "filename": "subjunctive",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/Subjunctive/Subjunctive.md"
  },
  "hypothetical": {
    "redirect_to": "subjunctive"
  },
  "hypothetical-verb-form": {
    "redirect_to": "subjunctive"
  },
  "subjunctive-mood": {
    "redirect_to": "subjunctive"
  },
  "vh": {
    "redirect_to": "subjunctive"
  },
  "viðtengingarháttur": {
    "redirect_to": "subjunctive"
  },
  "verbs": {
    "title": "Verbs",
    "filename": "verbs",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Verbs/Verbs.md"
  },
  "sagnorð": {
    "redirect_to": "verbs"
  },
  "verb": {
    "redirect_to": "verbs"
  },
  "word-order": {
    "title": "Word order",
    "filename": "word-order",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_order.md"
  },
  "að": {
    "title": "Að",
    "filename": "að",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Að.md"
  },
  "ef": {
    "title": "Ef",
    "filename": "ef",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Ef.md"
  },
  "eiginlega": {
    "title": "Eiginlega",
    "filename": "eiginlega",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Eiginlega.md"
  },
  "filler-words": {
    "title": "Filler words",
    "filename": "filler-words",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Filler_words.md"
  },
  "hikorð": {
    "redirect_to": "filler-words"
  },
  "fíla": {
    "title": "Fíla",
    "filename": "fíla",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Fíla.md"
  },
  "gjörðu-svo-vel": {
    "title": "Gjörðu svo vel",
    "filename": "gjörðu-svo-vel",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Gjörðu_svo_vel.md"
  },
  "góðan-daginn": {
    "title": "Góðan daginn",
    "filename": "góðan-daginn",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Góðan_daginn.md"
  },
  "daginn": {
    "redirect_to": "góðan-daginn"
  },
  "ha": {
    "title": "Ha?",
    "filename": "ha",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Ha?.md"
  },
  "heyrðu": {
    "title": "Heyrðu",
    "filename": "heyrðu",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Heyrðu.md"
  },
  "hljóta": {
    "title": "Hljóta",
    "filename": "hljóta",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Hljóta.md"
  },
  "hérna": {
    "title": "Hérna",
    "filename": "hérna",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Hérna.md"
  },
  "kunna-vs.-þekkja-vs.-vita-vs.-geta": {
    "title": "Kunna vs. þekkja vs. vita vs. geta",
    "filename": "kunna-vs.-þekkja-vs.-vita-vs.-geta",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Kunna_vs._þekkja_vs._vita_vs._geta.md"
  },
  "kær": {
    "title": "Kær",
    "filename": "kær",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Kær.md"
  },
  "kæri": {
    "redirect_to": "kær"
  },
  "kærlega": {
    "redirect_to": "kær"
  },
  "need-to": {
    "title": "Need to",
    "filename": "need-to",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Need_to.md"
  },
  "náttúrulega": {
    "title": "Náttúrulega",
    "filename": "náttúrulega",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Náttúrulega.md"
  },
  "náttla": {
    "redirect_to": "náttúrulega"
  },
  "nú": {
    "title": "Nú",
    "filename": "nú",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Nú.md"
  },
  "skal": {
    "title": "Skal",
    "filename": "skal",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Skal.md"
  },
  "skulu": {
    "redirect_to": "skal"
  },
  "sko": {
    "title": "Sko",
    "filename": "sko",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Sko.md"
  },
  "sæll": {
    "title": "Sæll",
    "filename": "sæll",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Sæll.md"
  },
  "want": {
    "title": "Want",
    "filename": "want",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Want.md"
  },
  "yes": {
    "title": "Yes",
    "filename": "yes",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Yes.md"
  },
  "course/a1/yes": {
    "redirect_to": "yes"
  },
  "jú": {
    "redirect_to": "yes"
  },
  "ætli": {
    "title": "Ætli",
    "filename": "ætli",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Ætli.md"
  },
  "það": {
    "title": "Það",
    "filename": "það",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Það.md"
  },
  "þetta": {
    "title": "Þetta",
    "filename": "þetta",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Word_use/Þetta.md"
  },
  "þessi": {
    "redirect_to": "þetta"
  },
  "þú-merging": {
    "title": "Þú merging",
    "filename": "þú-merging",
    "file": "/Users/egill/ylhyra_content/not_data/content/explanations/Þú_merging.md"
  },
  "changes-produced-by-the-pronoun-þú-when-suffixed": {
    "redirect_to": "þú-merging"
  },
  "texts": {
    "title": "Texts",
    "filename": "texts",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/Texts.md"
  },
  "text": {
    "redirect_to": "texts"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/1": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/1",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_1",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/1.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/10": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/10",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_10",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/10.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/2": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/2",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_2",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/2.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/3": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/3",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_3",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/3.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/4": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/4",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_4",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/4.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/5": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/5",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_5",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/5.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/6": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/6",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_6",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/6.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/7": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/7",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_7",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/7.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/8": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/8",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_8",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/8.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/9": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/9",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_9",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/9.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/discussion": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan/Discussion",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan_discussion",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/Discussion.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan": {
    "title": "Brennu-Njáls saga/Höskuldur og brennan",
    "filename": "brennu-njáls-saga_höskuldur-og-brennan",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Brennu-Njáls_saga/Höskuldur_og_brennan/index.md"
  },
  "brennu-njáls-saga/höskuldur-og-brennan/0": {
    "redirect_to": "brennu-njáls-saga/höskuldur-og-brennan"
  },
  "njáls-saga": {
    "redirect_to": "brennu-njáls-saga/höskuldur-og-brennan"
  },
  "egils-saga/veisla-hjá-afa": {
    "title": "Egils saga/Veisla hjá afa",
    "filename": "egils-saga_veisla-hjá-afa",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Egils_saga/Veisla_hjá_afa.md"
  },
  "þorsteins-þáttur-stangarhöggs/1": {
    "title": "Þorsteins þáttur stangarhöggs/1",
    "filename": "þorsteins-þáttur-stangarhöggs_1",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/1.md"
  },
  "þorsteins-þáttur-stangarhöggs/10": {
    "title": "Þorsteins þáttur stangarhöggs/10",
    "filename": "þorsteins-þáttur-stangarhöggs_10",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/10.md"
  },
  "þorsteins-þáttur-stangarhöggs/11": {
    "title": "Þorsteins þáttur stangarhöggs/11",
    "filename": "þorsteins-þáttur-stangarhöggs_11",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/11.md"
  },
  "þorsteins-þáttur-stangarhöggs/12": {
    "title": "Þorsteins þáttur stangarhöggs/12",
    "filename": "þorsteins-þáttur-stangarhöggs_12",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/12.md"
  },
  "þorsteins-þáttur-stangarhöggs/13": {
    "title": "Þorsteins þáttur stangarhöggs/13",
    "filename": "þorsteins-þáttur-stangarhöggs_13",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/13.md"
  },
  "þorsteins-þáttur-stangarhöggs/14": {
    "title": "Þorsteins þáttur stangarhöggs/14",
    "filename": "þorsteins-þáttur-stangarhöggs_14",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/14.md"
  },
  "þorsteins-þáttur-stangarhöggs/15": {
    "title": "Þorsteins þáttur stangarhöggs/15",
    "filename": "þorsteins-þáttur-stangarhöggs_15",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/15.md"
  },
  "þorsteins-þáttur-stangarhöggs/16": {
    "title": "Þorsteins þáttur stangarhöggs/16",
    "filename": "þorsteins-þáttur-stangarhöggs_16",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/16.md"
  },
  "þorsteins-þáttur-stangarhöggs/2": {
    "title": "Þorsteins þáttur stangarhöggs/2",
    "filename": "þorsteins-þáttur-stangarhöggs_2",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/2.md"
  },
  "þorsteins-þáttur-stangarhöggs/3": {
    "title": "Þorsteins þáttur stangarhöggs/3",
    "filename": "þorsteins-þáttur-stangarhöggs_3",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/3.md"
  },
  "þorsteins-þáttur-stangarhöggs/4": {
    "title": "Þorsteins þáttur stangarhöggs/4",
    "filename": "þorsteins-þáttur-stangarhöggs_4",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/4.md"
  },
  "þorsteins-þáttur-stangarhöggs/5": {
    "title": "Þorsteins þáttur stangarhöggs/5",
    "filename": "þorsteins-þáttur-stangarhöggs_5",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/5.md"
  },
  "þorsteins-þáttur-stangarhöggs/6": {
    "title": "Þorsteins þáttur stangarhöggs/6",
    "filename": "þorsteins-þáttur-stangarhöggs_6",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/6.md"
  },
  "þorsteins-þáttur-stangarhöggs/7": {
    "title": "Þorsteins þáttur stangarhöggs/7",
    "filename": "þorsteins-þáttur-stangarhöggs_7",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/7.md"
  },
  "þorsteins-þáttur-stangarhöggs/8": {
    "title": "Þorsteins þáttur stangarhöggs/8",
    "filename": "þorsteins-þáttur-stangarhöggs_8",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/8.md"
  },
  "þorsteins-þáttur-stangarhöggs/9": {
    "title": "Þorsteins þáttur stangarhöggs/9",
    "filename": "þorsteins-þáttur-stangarhöggs_9",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/9.md"
  },
  "þorsteins-þáttur-stangarhöggs": {
    "title": "Þorsteins þáttur stangarhöggs",
    "filename": "þorsteins-þáttur-stangarhöggs",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/fornrit/Þorsteins_þáttur_stangarhöggs/index.md"
  },
  "sveinbjörn-egilsson/bí-bí-og-blaka": {
    "title": "Sveinbjörn Egilsson/Bí bí og blaka",
    "filename": "sveinbjörn-egilsson_bí-bí-og-blaka",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Bí_bí_og_blaka.md"
  },
  "template/imba": {
    "title": "Template:Imba",
    "filename": "template_imba",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Imba/_template.md"
  },
  "imba/afi": {
    "title": "Imba/afi",
    "filename": "imba_afi",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Imba/afi.md"
  },
  "imba/current-mood": {
    "title": "Imba/current mood",
    "filename": "imba_current-mood",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Imba/current_mood.md"
  },
  "imba/grip": {
    "title": "Imba/grip",
    "filename": "imba_grip",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Imba/grip.md"
  },
  "imba/áferð-og-flug": {
    "title": "Imba/áferð og flug",
    "filename": "imba_áferð-og-flug",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Imba/áferð_og_flug.md"
  },
  "imba/áferð-og-flugi": {
    "redirect_to": "imba/áferð-og-flug"
  },
  "imba/ég-veit": {
    "title": "Imba/ég veit",
    "filename": "imba_ég-veit",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Imba/ég_veit.md"
  },
  "jónas-hallgrímsson/ásta/1": {
    "title": "Jónas Hallgrímsson/Ásta/1",
    "filename": "jónas-hallgrímsson_ásta_1",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Jónas_Hallgrímsson-Ásta.md"
  },
  "sitji-guðs-englar": {
    "title": "Sitji guðs englar",
    "filename": "sitji-guðs-englar",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Sitji_guðs_englar.md"
  },
  "text/sitji-guðs-englar": {
    "redirect_to": "sitji-guðs-englar"
  },
  "sofðu-unga-ástin-mín": {
    "title": "Sofðu unga ástin mín",
    "filename": "sofðu-unga-ástin-mín",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Sofðu_unga_ástin_mín.md"
  },
  "text/sofðu-unga-ástin-mín/1": {
    "title": "Text:Sofðu unga ástin mín/1",
    "filename": "text_sofðu-unga-ástin-mín_1",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Sofðu_unga_ástin_mín_(text).md"
  },
  "vísur-vatnsenda-rósu": {
    "title": "Vísur Vatnsenda-Rósu",
    "filename": "vísur-vatnsenda-rósu",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/poems/Vísur_Vatnsenda-Rósu.md"
  },
  "text/blær/egg-í-áskrift/teaser": {
    "title": "Text:Blær/Egg í áskrift/Teaser",
    "filename": "text_blær_egg-í-áskrift_teaser",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Egg_í_áskrift/Teaser.md"
  },
  "blær/egg-í-áskrift": {
    "title": "Blær/Egg í áskrift",
    "filename": "blær_egg-í-áskrift",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Egg_í_áskrift.md"
  },
  "blær/fyrst-við-erum-hérna": {
    "title": "Blær/Fyrst við erum hérna",
    "filename": "blær_fyrst-við-erum-hérna",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Fyrst_við_erum_hérna/Fyrst_við_erum_hérna.md"
  },
  "blær/vestfirðir": {
    "redirect_to": "blær/fyrst-við-erum-hérna"
  },
  "fv": {
    "redirect_to": "blær/fyrst-við-erum-hérna"
  },
  "text/blær/fyrst-við-erum-hérna/teaser": {
    "title": "Text:Blær/Fyrst við erum hérna/Teaser",
    "filename": "text_blær_fyrst-við-erum-hérna_teaser",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Fyrst_við_erum_hérna/Teaser.md"
  },
  "blær/lunga": {
    "title": "Blær/LungA",
    "filename": "blær_lunga",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/LungA.md"
  },
  "blær/silfursvanurinn/1": {
    "title": "Blær/Silfursvanurinn/1",
    "filename": "blær_silfursvanurinn_1",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Silfursvanurinn/1.md"
  },
  "blær/silfur-svanurinn/1": {
    "redirect_to": "blær/silfursvanurinn/1"
  },
  "blær/silfursvanurinn/2": {
    "title": "Blær/Silfursvanurinn/2",
    "filename": "blær_silfursvanurinn_2",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Silfursvanurinn/2.md"
  },
  "blær/silfur-svanurinn/2": {
    "redirect_to": "blær/silfursvanurinn/2"
  },
  "blær/silfursvanurinn/3": {
    "title": "Blær/Silfursvanurinn/3",
    "filename": "blær_silfursvanurinn_3",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Silfursvanurinn/3.md"
  },
  "blær/silfur-svanurinn/3": {
    "redirect_to": "blær/silfursvanurinn/3"
  },
  "blær/silfursvanurinn/4": {
    "title": "Blær/Silfursvanurinn/4",
    "filename": "blær_silfursvanurinn_4",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Silfursvanurinn/4.md"
  },
  "blær/silfur-svanurinn/4": {
    "redirect_to": "blær/silfursvanurinn/4"
  },
  "blær/silfursvanurinn/5": {
    "title": "Blær/Silfursvanurinn/5",
    "filename": "blær_silfursvanurinn_5",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Silfursvanurinn/5.md"
  },
  "blær/silfur-svanurinn/5": {
    "redirect_to": "blær/silfursvanurinn/5"
  },
  "blær/silfursvanurinn/6": {
    "title": "Blær/Silfursvanurinn/6",
    "filename": "blær_silfursvanurinn_6",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Silfursvanurinn/6.md"
  },
  "blær/silfur-svanurinn/6": {
    "redirect_to": "blær/silfursvanurinn/6"
  },
  "blær/silfursvanurinn/7": {
    "title": "Blær/Silfursvanurinn/7",
    "filename": "blær_silfursvanurinn_7",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Silfursvanurinn/7.md"
  },
  "blær/silfur-svanurinn/7": {
    "redirect_to": "blær/silfursvanurinn/7"
  },
  "blær/silfursvanurinn/8": {
    "title": "Blær/Silfursvanurinn/8",
    "filename": "blær_silfursvanurinn_8",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Silfursvanurinn/8.md"
  },
  "blær/silfur-svanurinn/8": {
    "redirect_to": "blær/silfursvanurinn/8"
  },
  "text/blær/silfur-svanurinn/teaser": {
    "title": "Text:Blær/Silfur svanurinn/Teaser",
    "filename": "text_blær_silfur-svanurinn_teaser",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Silfursvanurinn/Teaser.md"
  },
  "blær/silfursvanurinn": {
    "title": "Blær/Silfursvanurinn",
    "filename": "blær_silfursvanurinn",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Silfursvanurinn/index.md"
  },
  "blær/silfur-svanurinn": {
    "redirect_to": "blær/silfursvanurinn"
  },
  "blær/vinkonur-vors-og-blóma/1": {
    "title": "Blær/Vinkonur vors og blóma/1",
    "filename": "blær_vinkonur-vors-og-blóma_1",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Vinkonur_vors_og_blóma/1.md"
  },
  "blær/vinkonur-vors-og-blóma/2": {
    "title": "Blær/Vinkonur vors og blóma/2",
    "filename": "blær_vinkonur-vors-og-blóma_2",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Vinkonur_vors_og_blóma/2.md"
  },
  "blær/vinkonur-vors-og-blóma/3": {
    "title": "Blær/Vinkonur vors og blóma/3",
    "filename": "blær_vinkonur-vors-og-blóma_3",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Vinkonur_vors_og_blóma/3.md"
  },
  "blær/vinkonur-vors-og-blóma/4": {
    "title": "Blær/Vinkonur vors og blóma/4",
    "filename": "blær_vinkonur-vors-og-blóma_4",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Vinkonur_vors_og_blóma/4.md"
  },
  "blær/vinkonur-vors-og-blóma/5": {
    "title": "Blær/Vinkonur vors og blóma/5",
    "filename": "blær_vinkonur-vors-og-blóma_5",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Vinkonur_vors_og_blóma/5.md"
  },
  "blær/vinkonur-vors-og-blóma/6": {
    "title": "Blær/Vinkonur vors og blóma/6",
    "filename": "blær_vinkonur-vors-og-blóma_6",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Vinkonur_vors_og_blóma/6.md"
  },
  "text/blær/vinkonur-vors-og-blóma/teaser": {
    "title": "Text:Blær/Vinkonur vors og blóma/Teaser",
    "filename": "text_blær_vinkonur-vors-og-blóma_teaser",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Vinkonur_vors_og_blóma/Teaser.md"
  },
  "blær/vinkonur-vors-og-blóma": {
    "title": "Blær/Vinkonur vors og blóma",
    "filename": "blær_vinkonur-vors-og-blóma",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/Vinkonur_vors_og_blóma/index.md"
  },
  "template/copyright/blær": {
    "title": "Template:Copyright/Blær",
    "filename": "template_copyright_blær",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/_templates/Blær_copyright.md"
  },
  "template/blær": {
    "title": "Template:Blær",
    "filename": "template_blær",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/_templates/Blær_header.md"
  },
  "template/blær-logo": {
    "title": "Template:Blær logo",
    "filename": "template_blær-logo",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Blær/_templates/Blær_logo.md"
  },
  "text/magnús-jochum-pálsson/leyfi": {
    "title": "Text:Magnús Jochum Pálsson/Leyfi",
    "filename": "text_magnús-jochum-pálsson_leyfi",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Magnús_Jochum/Leyfi.md"
  },
  "magnús-jochum-pálsson/pípulækningar": {
    "title": "Magnús Jochum Pálsson/Pípulækningar",
    "filename": "magnús-jochum-pálsson_pípulækningar",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Magnús_Jochum/Pípulækningar.md"
  },
  "magnús-jochum-pálsson": {
    "title": "Magnús Jochum Pálsson",
    "filename": "magnús-jochum-pálsson",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Magnús_Jochum/index.md"
  },
  "magnús-jochum-pálsson/ánamaðkar": {
    "title": "Magnús Jochum Pálsson/Ánamaðkar",
    "filename": "magnús-jochum-pálsson_ánamaðkar",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Magnús_Jochum/Ánamaðkar.md"
  },
  "magnús-jochum-pálsson/ánamaðkar/es": {
    "title": "Magnús Jochum Pálsson/Ánamaðkar/es",
    "filename": "magnús-jochum-pálsson_ánamaðkar_es",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Magnús_Jochum/Ánamaðkar_(español).md"
  },
  "español/magnús-jochum-pálsson/ánamaðkar": {
    "redirect_to": "magnús-jochum-pálsson/ánamaðkar/es"
  },
  "text/demo": {
    "title": "Text:Demo",
    "filename": "text_demo",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Magnús_Jochum/Ánamaðkar_(frontpage_demo).md"
  },
  "bláa-lónið": {
    "title": "Bláa lónið",
    "filename": "bláa-lónið",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Bláa_lónið.md"
  },
  "færeyjar": {
    "title": "Færeyjar",
    "filename": "færeyjar",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Færeyjar.md"
  },
  "fóstbræður": {
    "title": "Fóstbræður",
    "filename": "fóstbræður",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Fóstbræður.md"
  },
  "garðvinna": {
    "title": "Garðvinna",
    "filename": "garðvinna",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Garðvinna.md"
  },
  "text/a1/garðvinna": {
    "redirect_to": "garðvinna"
  },
  "harðfiskur": {
    "title": "Harðfiskur",
    "filename": "harðfiskur",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Harðfiskur.md"
  },
  "text/a1/harðfiskur": {
    "redirect_to": "harðfiskur"
  },
  "text/a2/harðfiskur": {
    "redirect_to": "harðfiskur"
  },
  "lopapeysa": {
    "title": "Lopapeysa",
    "filename": "lopapeysa",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Lopapeysa.md"
  },
  "lúpína": {
    "title": "Lúpína",
    "filename": "lúpína",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Lúpína.md"
  },
  "nafn-vestmannaeyja": {
    "title": "Nafn Vestmannaeyja",
    "filename": "nafn-vestmannaeyja",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Nafn_Vestmannaeyja.md"
  },
  "reykjavík": {
    "title": "Reykjavík",
    "filename": "reykjavík",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Reykjavík.md"
  },
  "text/a1/reykjavík": {
    "redirect_to": "reykjavík"
  },
  "strætó": {
    "title": "Strætó",
    "filename": "strætó",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Strætó.md"
  },
  "sund": {
    "title": "Sund",
    "filename": "sund",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Sund.md"
  },
  "text/a1/sund": {
    "redirect_to": "sund"
  },
  "vestmannaeyjar": {
    "title": "Vestmannaeyjar",
    "filename": "vestmannaeyjar",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Vestmannaeyjar.md"
  },
  "þúfa": {
    "title": "Þúfa",
    "filename": "þúfa",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/text/Ylhýra/Þúfa.md"
  },
  "þúfan": {
    "redirect_to": "þúfa"
  },
  "þúfur": {
    "redirect_to": "þúfa"
  },
  "tweets/benedikt/ber": {
    "title": "Tweets/Benedikt/Ber",
    "filename": "tweets_benedikt_ber",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Benedikt/Ber.md"
  },
  "forseti2k32/þegar-árið-2016-er-gert-upp-má-ekki": {
    "redirect_to": "tweets/benedikt/ber"
  },
  "tweets/benedikt/blundur": {
    "title": "Tweets/Benedikt/Blundur",
    "filename": "tweets_benedikt_blundur",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Benedikt/Blundur.md"
  },
  "forseti2k32/finnst-fólk-almennt-ekki-gera-sér": {
    "redirect_to": "tweets/benedikt/blundur"
  },
  "tweets/benedikt/draumsýn": {
    "title": "Tweets/Benedikt/Draumsýn",
    "filename": "tweets_benedikt_draumsýn",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Benedikt/Draumsýn.md"
  },
  "forseti2k32/draumsýn/-teikna-blóm-á-daginn,-veiða": {
    "redirect_to": "tweets/benedikt/draumsýn"
  },
  "tweets/benedikt/hreimur": {
    "title": "Tweets/Benedikt/Hreimur",
    "filename": "tweets_benedikt_hreimur",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Benedikt/Hreimur.md"
  },
  "forseti2k32/ákveðinn-sigur-þegar-innfæddir-halda": {
    "redirect_to": "tweets/benedikt/hreimur"
  },
  "tweets/benedikt/ingólfur": {
    "title": "Tweets/Benedikt/Ingólfur",
    "filename": "tweets_benedikt_ingólfur",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Benedikt/Ingólfur.md"
  },
  "forseti2k32/,,við-minnumst-ingólfs-arnarsonar": {
    "redirect_to": "tweets/benedikt/ingólfur"
  },
  "tweets/benedikt/slydda": {
    "title": "Tweets/Benedikt/Slydda",
    "filename": "tweets_benedikt_slydda",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Benedikt/Slydda.md"
  },
  "forseti2k32/hef-nokkuð-áreiðanlegar-heimildir": {
    "redirect_to": "tweets/benedikt/slydda"
  },
  "tweets/benedikt/yfirmaður": {
    "title": "Tweets/Benedikt/Yfirmaður",
    "filename": "tweets_benedikt_yfirmaður",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Benedikt/Yfirmaður.md"
  },
  "forseti2k32/verði-ég-yfirmaður-á-vinnustað-mun": {
    "redirect_to": "tweets/benedikt/yfirmaður"
  },
  "tweets/branddís/borðaraðir": {
    "title": "Tweets/Branddís/Borðaraðir",
    "filename": "tweets_branddís_borðaraðir",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Branddís/Borðaraðir.md"
  },
  "branddis-asrun/bjó-til-plan-þar-sem-borðaraðirnar": {
    "redirect_to": "tweets/branddís/borðaraðir"
  },
  "tweets/branddís/crossfit": {
    "title": "Tweets/Branddís/Crossfit",
    "filename": "tweets_branddís_crossfit",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Branddís/Crossfit.md"
  },
  "branddis-asrun/sá-stelpu-í-crossfit-nota-sandpappír": {
    "redirect_to": "tweets/branddís/crossfit"
  },
  "tweets/branddís/danmörk": {
    "title": "Tweets/Branddís/Danmörk",
    "filename": "tweets_branddís_danmörk",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Branddís/Danmörk.md"
  },
  "branddis-asrun/einföld-lausn-á-þessu-máli.-við-bjöllum": {
    "redirect_to": "tweets/branddís/danmörk"
  },
  "tweets/branddís/köttur": {
    "title": "Tweets/Branddís/Köttur",
    "filename": "tweets_branddís_köttur",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Branddís/Köttur.md"
  },
  "branddis-asrun/kötturinn-minn-er-alltaf-að-kúka-á": {
    "redirect_to": "tweets/branddís/köttur"
  },
  "tweets/branddís/mössuð": {
    "title": "Tweets/Branddís/Mössuð",
    "filename": "tweets_branddís_mössuð",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Branddís/Mössuð.md"
  },
  "branddis-asrun/á-þessu-ári-ætla-ég-að-verða-svo-ógeðslega": {
    "redirect_to": "tweets/branddís/mössuð"
  },
  "tweets/imba/afgreiðslustörf": {
    "title": "Tweets/Imba/Afgreiðslustörf",
    "filename": "tweets_imba_afgreiðslustörf",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Imba/Afgreiðslustörf.md"
  },
  "skvisumus/í-afgreiðslustörfum-sér-maður-það": {
    "redirect_to": "tweets/imba/afgreiðslustörf"
  },
  "tweets/imba/ligeglad": {
    "title": "Tweets/Imba/Ligeglad",
    "filename": "tweets_imba_ligeglad",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Imba/Ligeglad.md"
  },
  "skvisumus/lífið-snýst-um-að-vera-nógu-ligeglad": {
    "redirect_to": "tweets/imba/ligeglad"
  },
  "tweets/imba/rok": {
    "title": "Tweets/Imba/Rok",
    "filename": "tweets_imba_rok",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Imba/Rok.md"
  },
  "skvisumus/rok-er-svarti-sauðurinn-í-veðurfjölskyldunni.": {
    "redirect_to": "tweets/imba/rok"
  },
  "tweets/imba/þjóðverjar": {
    "title": "Tweets/Imba/Þjóðverjar",
    "filename": "tweets_imba_þjóðverjar",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Imba/Þjóðverjar.md"
  },
  "skvisumus/barnalegt-af-þjóðverjum-að-vera-ekki": {
    "redirect_to": "tweets/imba/þjóðverjar"
  },
  "tweets/kristín-ólafs/slúður": {
    "title": "Tweets/Kristín Ólafs/Slúður",
    "filename": "tweets_kristín-ólafs_slúður",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Kristín_Ólafs/Slúður.md"
  },
  "krolafs/þegar-þú-veist-að-það-eru-einhverjar": {
    "redirect_to": "tweets/kristín-ólafs/slúður"
  },
  "tweets/kristín-ólafs/unglingar": {
    "title": "Tweets/Kristín Ólafs/Unglingar",
    "filename": "tweets_kristín-ólafs_unglingar",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Kristín_Ólafs/Unglingar.md"
  },
  "krolafs/það-er-unglingur-hér-fyrir-utan-hagaskóla": {
    "redirect_to": "tweets/kristín-ólafs/unglingar"
  },
  "tweets/rannveig-dóra/matur": {
    "title": "Tweets/Rannveig Dóra/Matur",
    "filename": "tweets_rannveig-dóra_matur",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Rannveig_Dóra/Matur.md"
  },
  "rannveigdora/maturinn-er-tilbúinn": {
    "redirect_to": "tweets/rannveig-dóra/matur"
  },
  "tweets/ása/kettir": {
    "title": "Tweets/Ása/Kettir",
    "filename": "tweets_ása_kettir",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Ása/Kettir.md"
  },
  "asabergny/að-banna-lausagöngu-katta-er-fáránleg": {
    "redirect_to": "tweets/ása/kettir"
  },
  "tweets/ása/lykt": {
    "title": "Tweets/Ása/Lykt",
    "filename": "tweets_ása_lykt",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Ása/Lykt.md"
  },
  "asabergny/ég-lykta-svo-vel-í-dag-að-ég-vorkenni": {
    "redirect_to": "tweets/ása/lykt"
  },
  "tweets/ása/ormurinn": {
    "title": "Tweets/Ása/Ormurinn",
    "filename": "tweets_ása_ormurinn",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Ása/Ormurinn.md"
  },
  "asabergny/ég-er-með-harðsperrur-eftir-orminn.": {
    "redirect_to": "tweets/ása/ormurinn"
  },
  "tweets/ása/sjófánar": {
    "title": "Tweets/Ása/Sjófánar",
    "filename": "tweets_ása_sjófánar",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Ása/Sjófánar.md"
  },
  "asabergny/í-dag-dundaði-ég-mér-við-að-festa": {
    "redirect_to": "tweets/ása/sjófánar"
  },
  "tweets/ása/stjörnur": {
    "title": "Tweets/Ása/Stjörnur",
    "filename": "tweets_ása_stjörnur",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Ása/Stjörnur.md"
  },
  "asabergny/óska-eftir-félaga-til-að-horfa-með": {
    "redirect_to": "tweets/ása/stjörnur"
  },
  "tweets/ása/sund": {
    "title": "Tweets/Ása/Sund",
    "filename": "tweets_ása_sund",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Ása/Sund.md"
  },
  "asabergny/hver-sundferð-er-endurfæðing": {
    "redirect_to": "tweets/ása/sund"
  },
  "tweets/ása/íslenskar-bíómyndir": {
    "title": "Tweets/Ása/Íslenskar bíómyndir",
    "filename": "tweets_ása_íslenskar-bíómyndir",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Ása/Íslenskar_bíómyndir.md"
  },
  "asabergny/einhvern-veginn-finnst-mér-flestar": {
    "redirect_to": "tweets/ása/íslenskar-bíómyndir"
  },
  "tweets/ólafur/ólæs": {
    "title": "Tweets/Ólafur/Ólæs",
    "filename": "tweets_ólafur_ólæs",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Ólafur/Ólæs.md"
  },
  "kjamanden/fyrir-20-árum-var-ég-ólæs-og-kunni": {
    "redirect_to": "tweets/ólafur/ólæs"
  },
  "tweets/þorsteinn/afi": {
    "title": "Tweets/Þorsteinn/Afi",
    "filename": "tweets_þorsteinn_afi",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Þorsteinn/Afi.md"
  },
  "kristnihald/þú-þarft-virkilega-að-gera-eitthvað": {
    "redirect_to": "tweets/þorsteinn/afi"
  },
  "tweets/þorsteinn/alþingi": {
    "title": "Tweets/Þorsteinn/Alþingi",
    "filename": "tweets_þorsteinn_alþingi",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/tweets/Þorsteinn/Alþingi.md"
  },
  "kristnihald/það-þarf-engar-siðareglur-á-alþingi.": {
    "redirect_to": "tweets/þorsteinn/alþingi"
  },
  "villi-neto/bubbi": {
    "title": "Villi Neto/Bubbi",
    "filename": "villi-neto_bubbi",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/video/Villi_Neto/Bubbi.md"
  },
  "villi-neto/finnland": {
    "title": "Villi Neto/Finnland",
    "filename": "villi-neto_finnland",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/video/Villi_Neto/Finnland.md"
  },
  "villi-neto/forníslenski-sjomlinn": {
    "title": "Villi Neto/Forníslenski sjomlinn",
    "filename": "villi-neto_forníslenski-sjomlinn",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/video/Villi_Neto/Forníslenski_sjomlinn.md"
  },
  "villi-neto/fullt-nafn": {
    "title": "Villi Neto/Fullt nafn",
    "filename": "villi-neto_fullt-nafn",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/video/Villi_Neto/Fullt_nafn.md"
  },
  "villi-neto/kaffi": {
    "title": "Villi Neto/Kaffi",
    "filename": "villi-neto_kaffi",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/video/Villi_Neto/Kaffi.md"
  },
  "villi-neto/lýsi": {
    "title": "Villi Neto/Lýsi",
    "filename": "villi-neto_lýsi",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/video/Villi_Neto/Lýsi.md"
  },
  "villi-neto/reiður-á-innsoginu": {
    "title": "Villi Neto/Reiður á innsoginu",
    "filename": "villi-neto_reiður-á-innsoginu",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/video/Villi_Neto/Reiður_á_innsoginu.md"
  },
  "villi-neto/skata": {
    "title": "Villi Neto/Skata",
    "filename": "villi-neto_skata",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/video/Villi_Neto/Skata.md"
  },
  "villi-neto/íslendingar-í-sólarlöndum": {
    "title": "Villi Neto/Íslendingar í sólarlöndum",
    "filename": "villi-neto_íslendingar-í-sólarlöndum",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/video/Villi_Neto/Íslendingar_í_sólarlöndum.md"
  },
  "villi-neto/íslenskar-myndir": {
    "title": "Villi Neto/Íslenskar myndir",
    "filename": "villi-neto_íslenskar-myndir",
    "file": "/Users/egill/ylhyra_content/not_data/content/reading/video/Villi_Neto/Íslenskar_myndir.md"
  },
  "at-the-supermarket": {
    "title": "At the supermarket",
    "filename": "at-the-supermarket",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/At_the_supermarket.md"
  },
  "talk/búinn-vs.-hef": {
    "title": "Talk:Búinn vs. hef",
    "filename": "talk_búinn-vs.-hef",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Búinn_vs._hef.md"
  },
  "project/cognates": {
    "title": "Project:Cognates",
    "filename": "project_cognates",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Cognates.md"
  },
  "project/drafts/course": {
    "title": "Project:Drafts/Course",
    "filename": "project_drafts_course",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Course.md"
  },
  "project/drafts/course-wip": {
    "title": "Project:Drafts/Course WIP",
    "filename": "project_drafts_course-wip",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Course_WIP.md"
  },
  "project/course-work-in-progress": {
    "title": "Project:Course work in progress",
    "filename": "project_course-work-in-progress",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Course_work_in_progress.md"
  },
  "project/work-in-progress/culture": {
    "title": "Project:Work in progress/Culture",
    "filename": "project_work-in-progress_culture",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Culture.md"
  },
  "vocabulary/going-to": {
    "title": "Vocabulary:Going to",
    "filename": "vocabulary_going-to",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Going_to.md"
  },
  "text/gylfaginning": {
    "title": "Text:Gylfaginning",
    "filename": "text_gylfaginning",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Gylfaginning.md"
  },
  "project/drafts/hannes-hafstein/stormur": {
    "title": "Project:Drafts/Hannes Hafstein/Stormur",
    "filename": "project_drafts_hannes-hafstein_stormur",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Hannes_Hafstein/Stormur.md"
  },
  "talk/hypothetical-verb-form": {
    "title": "Talk:Hypothetical verb form",
    "filename": "talk_hypothetical-verb-form",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Hypothetical_verb_form.md"
  },
  "talk/subjunctive": {
    "redirect_to": "talk/hypothetical-verb-form"
  },
  "talk/viðtengingarháttur": {
    "redirect_to": "talk/hypothetical-verb-form"
  },
  "project/ylhýra/kennsluefni-í-vinnslu": {
    "title": "Project:Ylhýra/Kennsluefni í vinnslu",
    "filename": "project_ylhýra_kennsluefni-í-vinnslu",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Kennsluefni_í_vinnslu.md"
  },
  "leoncie": {
    "title": "Leoncie",
    "filename": "leoncie",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Leoncie.md"
  },
  "megas": {
    "title": "Megas",
    "filename": "megas",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Megas.md"
  },
  "menntaskólalög": {
    "title": "Menntaskólalög",
    "filename": "menntaskólalög",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Menntaskólalög.md"
  },
  "text/milk": {
    "title": "Text/Milk",
    "filename": "text_milk",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Milk.md"
  },
  "project/ylhýra": {
    "title": "Project:Ylhýra",
    "filename": "project_ylhýra",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Overview.md"
  },
  "project": {
    "redirect_to": "project/ylhýra"
  },
  "phrases-for-waiters": {
    "title": "Phrases for waiters",
    "filename": "phrases-for-waiters",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Phrases_for_waiters.md"
  },
  "project/public-domain": {
    "title": "Project:Public domain",
    "filename": "project_public-domain",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Public_domain.md"
  },
  "project/schedule": {
    "title": "Project:Schedule",
    "filename": "project_schedule",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Schedule.md"
  },
  "snorri-sturluson": {
    "title": "Snorri Sturluson",
    "filename": "snorri-sturluson",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Snorri_Sturluson.md"
  },
  "talk/sofðu-unga-ástin-mín": {
    "title": "Talk:Sofðu unga ástin mín",
    "filename": "talk_sofðu-unga-ástin-mín",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Sofðu_unga_ástin_mín.md"
  },
  "project/sound-shift": {
    "title": "Project:Sound shift",
    "filename": "project_sound-shift",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Sound_shift.md"
  },
  "project/todo/1": {
    "title": "Project:Todo/1",
    "filename": "project_todo_1",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Todo/1.md"
  },
  "project/todo/2": {
    "title": "Project:Todo/2",
    "filename": "project_todo_2",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Todo/2.md"
  },
  "project/todo/3": {
    "title": "Project:Todo/3",
    "filename": "project_todo_3",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Todo/3.md"
  },
  "project/todo/bakarí": {
    "title": "Project:Todo/Bakarí",
    "filename": "project_todo_bakarí",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Todo/Bakarí.md"
  },
  "project/todo/short-texts": {
    "title": "Project:Todo/Short texts",
    "filename": "project_todo_short-texts",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Todo/Short_texts.md"
  },
  "project/todo": {
    "title": "Project:Todo",
    "filename": "project_todo",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Todo.md"
  },
  "project/translation-ideas": {
    "title": "Project:Translation ideas",
    "filename": "project_translation-ideas",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Translation_ideas.md"
  },
  "project/vocabulary": {
    "title": "Project:Vocabulary",
    "filename": "project_vocabulary",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Vocabulary.md"
  },
  "talk/word-order": {
    "title": "Talk:Word order",
    "filename": "talk_word-order",
    "file": "/Users/egill/ylhyra_content/not_data/drafts/Word_order.md"
  },
  "file/logo-serif.svg": {
    "title": "File:Logo_serif.svg",
    "filename": "file_logo-serif.svg",
    "file": "/Users/egill/ylhyra_content/not_data/files/assets/Logo_serif.svg.md"
  },
  "file/ylhyra-demo.gif": {
    "title": "File:Ylhyra_demo.gif",
    "filename": "file_ylhyra-demo.gif",
    "file": "/Users/egill/ylhyra_content/not_data/files/assets/Ylhyra_demo.gif.md"
  },
  "file/ylhyra-demo-magnus.gif": {
    "title": "File:Ylhyra_demo_Magnus.gif",
    "filename": "file_ylhyra-demo-magnus.gif",
    "file": "/Users/egill/ylhyra_content/not_data/files/assets/Ylhyra_demo_Magnus.gif.md"
  },
  "file/ylhyra-logo.svg": {
    "title": "File:Ylhyra_logo.svg",
    "filename": "file_ylhyra-logo.svg",
    "file": "/Users/egill/ylhyra_content/not_data/files/assets/Ylhyra_logo.svg.md"
  },
  "file/ylhyra-logo-dark.svg": {
    "title": "File:Ylhyra_logo_dark.svg",
    "filename": "file_ylhyra-logo-dark.svg",
    "file": "/Users/egill/ylhyra_content/not_data/files/assets/Ylhyra_logo_dark.svg.md"
  },
  "file/01-fornislenski.mp3": {
    "title": "File:01-fornislenski.mp3",
    "filename": "file_01-fornislenski.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/01-fornislenski.mp3.md"
  },
  "file/02-full-nafn.mp3": {
    "title": "File:02-full_nafn.mp3",
    "filename": "file_02-full-nafn.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/02-full_nafn.mp3.md"
  },
  "file/03-kaffi.mp3": {
    "title": "File:03-kaffi.mp3",
    "filename": "file_03-kaffi.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/03-kaffi.mp3.md"
  },
  "file/04-lýsi.mp3": {
    "title": "File:04-lýsi.mp3",
    "filename": "file_04-lýsi.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/04-lýsi.mp3.md"
  },
  "file/05-innsoginu.mp3": {
    "title": "File:05-innsoginu.mp3",
    "filename": "file_05-innsoginu.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/05-innsoginu.mp3.md"
  },
  "file/07-solarlond.mp3": {
    "title": "File:07-solarlond.mp3",
    "filename": "file_07-solarlond.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/07-solarlond.mp3.md"
  },
  "file/08-islenskarmyndir.mp3": {
    "title": "File:08-islenskarmyndir.mp3",
    "filename": "file_08-islenskarmyndir.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/08-islenskarmyndir.mp3.md"
  },
  "file/23-er-þetta-ekki-gott.mp3": {
    "title": "File:23-er_þetta_ekki_gott.mp3",
    "filename": "file_23-er-þetta-ekki-gott.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/23-er_þetta_ekki_gott.mp3.md"
  },
  "file/24-kemur-þú-í-sund.mp3": {
    "title": "File:24-kemur_þú_í_sund.mp3",
    "filename": "file_24-kemur-þú-í-sund.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/24-kemur_þú_í_sund.mp3.md"
  },
  "file/amma-egils.mp3": {
    "title": "File:Amma_egils.mp3",
    "filename": "file_amma-egils.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Amma_egils.mp3.md"
  },
  "file/bakaríið-samtal.mp3": {
    "title": "File:Bakaríið_samtal.mp3",
    "filename": "file_bakaríið-samtal.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Bakaríið_samtal.mp3.md"
  },
  "file/bananakaka-ofds.mp3": {
    "title": "File:Bananakaka_ofds.mp3",
    "filename": "file_bananakaka-ofds.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Bananakaka_ofds.mp3.md"
  },
  "file/bláa-lónið.mp3": {
    "title": "File:Bláa_lónið.mp3",
    "filename": "file_bláa-lónið.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Bláa_lónið.mp3.md"
  },
  "file/egg-í-áskrift.mp3": {
    "title": "File:Egg_í_áskrift.mp3",
    "filename": "file_egg-í-áskrift.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Egg_í_áskrift.mp3.md"
  },
  "file/egils-saga.mp3": {
    "title": "File:Egils_saga.mp3",
    "filename": "file_egils-saga.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Egils_saga.mp3.md"
  },
  "file/eiríkur-dansar-svo-vel.mp3": {
    "title": "File:Eiríkur_dansar_svo_vel.mp3",
    "filename": "file_eiríkur-dansar-svo-vel.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Eiríkur_dansar_svo_vel.mp3.md"
  },
  "file/fyrst-við-erum-hérna.mp3": {
    "title": "File:Fyrst_við_erum_hérna.mp3",
    "filename": "file_fyrst-við-erum-hérna.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Fyrst_við_erum_hérna.mp3.md"
  },
  "file/færeyska.mp3": {
    "title": "File:Færeyska.mp3",
    "filename": "file_færeyska.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Færeyska.mp3.md"
  },
  "file/færeyska-demo-fo.mp3": {
    "title": "File:Færeyska_demo_fo.mp3",
    "filename": "file_færeyska-demo-fo.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Færeyska_demo_fo.mp3.md"
  },
  "file/færeyska-demo-is.mp3": {
    "title": "File:Færeyska_demo_is.mp3",
    "filename": "file_færeyska-demo-is.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Færeyska_demo_is.mp3.md"
  },
  "file/fóstbræður.mp3": {
    "title": "File:Fóstbræður.mp3",
    "filename": "file_fóstbræður.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Fóstbræður.mp3.md"
  },
  "file/fóstbræður2.mp3": {
    "title": "File:Fóstbræður2.mp3",
    "filename": "file_fóstbræður2.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Fóstbræður2.mp3.md"
  },
  "file/garðvinna.mp3": {
    "title": "File:Garðvinna.mp3",
    "filename": "file_garðvinna.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Garðvinna.mp3.md"
  },
  "file/hann-er-svo-góður-hundur.mp3": {
    "title": "File:Hann_er_svo_góður_hundur.mp3",
    "filename": "file_hann-er-svo-góður-hundur.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Hann_er_svo_góður_hundur.mp3.md"
  },
  "file/harðfiskur.mp3": {
    "title": "File:Harðfiskur.mp3",
    "filename": "file_harðfiskur.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Harðfiskur.mp3.md"
  },
  "file/harðsperrur.mp3": {
    "title": "File:Harðsperrur.mp3",
    "filename": "file_harðsperrur.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Harðsperrur.mp3.md"
  },
  "file/hefur-kpv0.mp3": {
    "title": "File:Hefur_KpV0.mp3",
    "filename": "file_hefur-kpv0.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Hefur_KpV0.mp3.md"
  },
  "file/imba-afi.mp3": {
    "title": "File:Imba_Afi.mp3",
    "filename": "file_imba-afi.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Imba_Afi.mp3.md"
  },
  "file/imba-eg-veit.mp3": {
    "title": "File:Imba_eg_veit.mp3",
    "filename": "file_imba-eg-veit.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Imba_eg_veit.mp3.md"
  },
  "file/já-á-innsoginu-x-2.mp3": {
    "title": "File:Já_á_innsoginu_x_2.mp3",
    "filename": "file_já-á-innsoginu-x-2.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Já_á_innsoginu_x_2.mp3.md"
  },
  "file/köttur.mp3": {
    "title": "File:Köttur.mp3",
    "filename": "file_köttur.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Köttur.mp3.md"
  },
  "file/lausaganga.mp3": {
    "title": "File:Lausaganga.mp3",
    "filename": "file_lausaganga.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Lausaganga.mp3.md"
  },
  "file/lopapeysa.mp3": {
    "title": "File:Lopapeysa.mp3",
    "filename": "file_lopapeysa.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Lopapeysa.mp3.md"
  },
  "file/lúpína.mp3": {
    "title": "File:Lúpína.mp3",
    "filename": "file_lúpína.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Lúpína.mp3.md"
  },
  "file/mamma-þyrstur.mp3": {
    "title": "File:Mamma-þyrstur.mp3",
    "filename": "file_mamma-þyrstur.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Mamma-þyrstur.mp3.md"
  },
  "file/mjólk.mp3": {
    "title": "File:Mjólk.mp3",
    "filename": "file_mjólk.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Mjólk.mp3.md"
  },
  "file/nafn-vestmannaeyja2.mp3": {
    "title": "File:Nafn_vestmannaeyja2.mp3",
    "filename": "file_nafn-vestmannaeyja2.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Nafn_vestmannaeyja2.mp3.md"
  },
  "file/nafn-vestmannaeyja.mp3": {
    "redirect_to": "file/nafn-vestmannaeyja2.mp3"
  },
  "file/njáls-saga-hluti-1.mp3": {
    "title": "File:Njáls_saga_hluti_1.mp3",
    "filename": "file_njáls-saga-hluti-1.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Njáls_saga_hluti_1.mp3.md"
  },
  "file/njáls-saga-hluti-10.mp3": {
    "title": "File:Njáls_saga_hluti_10.mp3",
    "filename": "file_njáls-saga-hluti-10.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Njáls_saga_hluti_10.mp3.md"
  },
  "file/njáls-saga-hluti-2.mp3": {
    "title": "File:Njáls_saga_hluti_2.mp3",
    "filename": "file_njáls-saga-hluti-2.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Njáls_saga_hluti_2.mp3.md"
  },
  "file/njáls-saga-hluti-3.mp3": {
    "title": "File:Njáls_saga_hluti_3.mp3",
    "filename": "file_njáls-saga-hluti-3.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Njáls_saga_hluti_3.mp3.md"
  },
  "file/njáls-saga-hluti-4.mp3": {
    "title": "File:Njáls_saga_hluti_4.mp3",
    "filename": "file_njáls-saga-hluti-4.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Njáls_saga_hluti_4.mp3.md"
  },
  "file/njáls-saga-hluti-5.mp3": {
    "title": "File:Njáls_saga_hluti_5.mp3",
    "filename": "file_njáls-saga-hluti-5.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Njáls_saga_hluti_5.mp3.md"
  },
  "file/njáls-saga-hluti-6.mp3": {
    "title": "File:Njáls_saga_hluti_6.mp3",
    "filename": "file_njáls-saga-hluti-6.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Njáls_saga_hluti_6.mp3.md"
  },
  "file/njáls-saga-hluti-7.mp3": {
    "title": "File:Njáls_saga_hluti_7.mp3",
    "filename": "file_njáls-saga-hluti-7.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Njáls_saga_hluti_7.mp3.md"
  },
  "file/njáls-saga-hluti-8.mp3": {
    "title": "File:Njáls_saga_hluti_8.mp3",
    "filename": "file_njáls-saga-hluti-8.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Njáls_saga_hluti_8.mp3.md"
  },
  "file/njáls-saga-hluti-9.mp3": {
    "title": "File:Njáls_saga_hluti_9.mp3",
    "filename": "file_njáls-saga-hluti-9.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Njáls_saga_hluti_9.mp3.md"
  },
  "file/prentari.mp3": {
    "title": "File:Prentari.mp3",
    "filename": "file_prentari.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Prentari.mp3.md"
  },
  "file/pípulækningar.mp3": {
    "title": "File:Pípulækningar.mp3",
    "filename": "file_pípulækningar.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Pípulækningar.mp3.md"
  },
  "file/reykjavik.mp3": {
    "title": "File:Reykjavik.mp3",
    "filename": "file_reykjavik.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Reykjavik.mp3.md"
  },
  "file/rok.mp3": {
    "title": "File:Rok.mp3",
    "filename": "file_rok.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Rok.mp3.md"
  },
  "file/silfur-svanurinn-01-1.mp3": {
    "title": "File:Silfur_svanurinn_01-1.mp3",
    "filename": "file_silfur-svanurinn-01-1.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Silfur_svanurinn_01-1.mp3.md"
  },
  "file/silfur-svanurinn-02-2.mp3": {
    "title": "File:Silfur_svanurinn_02-2.mp3",
    "filename": "file_silfur-svanurinn-02-2.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Silfur_svanurinn_02-2.mp3.md"
  },
  "file/silfur-svanurinn-03-3.mp3": {
    "title": "File:Silfur_svanurinn_03-3.mp3",
    "filename": "file_silfur-svanurinn-03-3.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Silfur_svanurinn_03-3.mp3.md"
  },
  "file/silfur-svanurinn-04-4.mp3": {
    "title": "File:Silfur_svanurinn_04-4.mp3",
    "filename": "file_silfur-svanurinn-04-4.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Silfur_svanurinn_04-4.mp3.md"
  },
  "file/silfur-svanurinn-05-5.mp3": {
    "title": "File:Silfur_svanurinn_05-5.mp3",
    "filename": "file_silfur-svanurinn-05-5.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Silfur_svanurinn_05-5.mp3.md"
  },
  "file/silfur-svanurinn-06-6.mp3": {
    "title": "File:Silfur_svanurinn_06-6.mp3",
    "filename": "file_silfur-svanurinn-06-6.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Silfur_svanurinn_06-6.mp3.md"
  },
  "file/silfur-svanurinn-07-7.mp3": {
    "title": "File:Silfur_svanurinn_07-7.mp3",
    "filename": "file_silfur-svanurinn-07-7.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Silfur_svanurinn_07-7.mp3.md"
  },
  "file/silfur-svanurinn-08-8.mp3": {
    "title": "File:Silfur_svanurinn_08-8.mp3",
    "filename": "file_silfur-svanurinn-08-8.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Silfur_svanurinn_08-8.mp3.md"
  },
  "file/siðareglur.mp3": {
    "title": "File:Siðareglur.mp3",
    "filename": "file_siðareglur.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Siðareglur.mp3.md"
  },
  "file/skyrtu-fyrir-kvöldið.mp3": {
    "title": "File:Skyrtu_fyrir_kvöldið.mp3",
    "filename": "file_skyrtu-fyrir-kvöldið.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Skyrtu_fyrir_kvöldið.mp3.md"
  },
  "file/sofðu-unga.mp3": {
    "title": "File:Sofðu_unga.mp3",
    "filename": "file_sofðu-unga.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Sofðu_unga.mp3.md"
  },
  "file/strætó.mp3": {
    "title": "File:Strætó.mp3",
    "filename": "file_strætó.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Strætó.mp3.md"
  },
  "file/vestmannaeyjar.mp3": {
    "title": "File:Vestmannaeyjar.mp3",
    "filename": "file_vestmannaeyjar.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Vestmannaeyjar.mp3.md"
  },
  "file/vinkonurvorsogbloma-01-1.mp3": {
    "title": "File:Vinkonurvorsogbloma-01-1.mp3",
    "filename": "file_vinkonurvorsogbloma-01-1.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Vinkonurvorsogbloma-01-1.mp3.md"
  },
  "file/vinkonurvorsogbloma-02-2.mp3": {
    "title": "File:Vinkonurvorsogbloma-02-2.mp3",
    "filename": "file_vinkonurvorsogbloma-02-2.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Vinkonurvorsogbloma-02-2.mp3.md"
  },
  "file/vinkonurvorsogbloma-03-3.mp3": {
    "title": "File:Vinkonurvorsogbloma-03-3.mp3",
    "filename": "file_vinkonurvorsogbloma-03-3.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Vinkonurvorsogbloma-03-3.mp3.md"
  },
  "file/vinkonurvorsogbloma-04-4.mp3": {
    "title": "File:Vinkonurvorsogbloma-04-4.mp3",
    "filename": "file_vinkonurvorsogbloma-04-4.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Vinkonurvorsogbloma-04-4.mp3.md"
  },
  "file/vinkonurvorsogbloma-05-5.mp3": {
    "title": "File:Vinkonurvorsogbloma-05-5.mp3",
    "filename": "file_vinkonurvorsogbloma-05-5.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Vinkonurvorsogbloma-05-5.mp3.md"
  },
  "file/vinkonurvorsogbloma-06-6.mp3": {
    "title": "File:Vinkonurvorsogbloma-06-6.mp3",
    "filename": "file_vinkonurvorsogbloma-06-6.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Vinkonurvorsogbloma-06-6.mp3.md"
  },
  "file/-h8g.mp3": {
    "title": "File:-H8G.mp3",
    "filename": "file_-h8g.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/-H8G.mp3.md"
  },
  "file/0tzf.mp3": {
    "title": "File:0TZf.mp3",
    "filename": "file_0tzf.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/0TZf.mp3.md"
  },
  "file/0lfb.mp3": {
    "title": "File:0lfb.mp3",
    "filename": "file_0lfb.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/0lfb.mp3.md"
  },
  "file/1in-.mp3": {
    "title": "File:1In-.mp3",
    "filename": "file_1in-.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/1In-.mp3.md"
  },
  "file/1har.mp3": {
    "title": "File:1hAr.mp3",
    "filename": "file_1har.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/1hAr.mp3.md"
  },
  "file/1oyb.mp3": {
    "title": "File:1oyb.mp3",
    "filename": "file_1oyb.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/1oyb.mp3.md"
  },
  "file/2hy8.mp3": {
    "title": "File:2HY8.mp3",
    "filename": "file_2hy8.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/2HY8.mp3.md"
  },
  "file/2-et.mp3": {
    "title": "File:2_et.mp3",
    "filename": "file_2-et.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/2_et.mp3.md"
  },
  "file/3af6.mp3": {
    "title": "File:3AF6.mp3",
    "filename": "file_3af6.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/3AF6.mp3.md"
  },
  "file/3fkh.mp3": {
    "title": "File:3FKh.mp3",
    "filename": "file_3fkh.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/3FKh.mp3.md"
  },
  "file/3qmx.mp3": {
    "title": "File:3qmX.mp3",
    "filename": "file_3qmx.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/3qmX.mp3.md"
  },
  "file/4gr2.mp3": {
    "title": "File:4Gr2.mp3",
    "filename": "file_4gr2.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/4Gr2.mp3.md"
  },
  "file/581w.mp3": {
    "title": "File:581W.mp3",
    "filename": "file_581w.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/581W.mp3.md"
  },
  "file/66b9.mp3": {
    "title": "File:66B9.mp3",
    "filename": "file_66b9.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/66B9.mp3.md"
  },
  "file/6qln.mp3": {
    "title": "File:6QlN.mp3",
    "filename": "file_6qln.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/6QlN.mp3.md"
  },
  "file/6hye.mp3": {
    "title": "File:6hyE.mp3",
    "filename": "file_6hye.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/6hyE.mp3.md"
  },
  "file/6jjt.mp3": {
    "title": "File:6jJT.mp3",
    "filename": "file_6jjt.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/6jJT.mp3.md"
  },
  "file/6mpz.mp3": {
    "title": "File:6mpZ.mp3",
    "filename": "file_6mpz.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/6mpZ.mp3.md"
  },
  "file/7jxb.mp3": {
    "title": "File:7Jxb.mp3",
    "filename": "file_7jxb.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/7Jxb.mp3.md"
  },
  "file/7m7w.mp3": {
    "title": "File:7M7w.mp3",
    "filename": "file_7m7w.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/7M7w.mp3.md"
  },
  "file/7s3y.mp3": {
    "title": "File:7s3y.mp3",
    "filename": "file_7s3y.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/7s3y.mp3.md"
  },
  "file/7tsf.mp3": {
    "title": "File:7tsF.mp3",
    "filename": "file_7tsf.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/7tsF.mp3.md"
  },
  "file/8uee.mp3": {
    "title": "File:8UEE.mp3",
    "filename": "file_8uee.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/8UEE.mp3.md"
  },
  "file/8anv.mp3": {
    "title": "File:8aNv.mp3",
    "filename": "file_8anv.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/8aNv.mp3.md"
  },
  "file/8dpu.mp3": {
    "title": "File:8dpU.mp3",
    "filename": "file_8dpu.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/8dpU.mp3.md"
  },
  "file/969t.mp3": {
    "title": "File:969t.mp3",
    "filename": "file_969t.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/969t.mp3.md"
  },
  "file/9kyn.mp3": {
    "title": "File:9kYn.mp3",
    "filename": "file_9kyn.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/9kYn.mp3.md"
  },
  "file/a6o3.mp3": {
    "title": "File:A6O3.mp3",
    "filename": "file_a6o3.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/A6O3.mp3.md"
  },
  "file/adj5.mp3": {
    "title": "File:ADj5.mp3",
    "filename": "file_adj5.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/ADj5.mp3.md"
  },
  "file/ao7p.mp3": {
    "title": "File:Ao7p.mp3",
    "filename": "file_ao7p.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Ao7p.mp3.md"
  },
  "file/api-k7ev.mp3": {
    "title": "File:Api_k7eV.mp3",
    "filename": "file_api-k7ev.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Api_k7eV.mp3.md"
  },
  "file/b2ky.mp3": {
    "title": "File:B2kY.mp3",
    "filename": "file_b2ky.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/B2kY.mp3.md"
  },
  "file/b5vm.mp3": {
    "title": "File:B5vM.mp3",
    "filename": "file_b5vm.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/B5vM.mp3.md"
  },
  "file/b9n1.mp3": {
    "title": "File:B9N1.mp3",
    "filename": "file_b9n1.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/B9N1.mp3.md"
  },
  "file/br-j.mp3": {
    "title": "File:BR_j.mp3",
    "filename": "file_br-j.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/BR_j.mp3.md"
  },
  "file/cgbk.mp3": {
    "title": "File:CGBK.mp3",
    "filename": "file_cgbk.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/CGBK.mp3.md"
  },
  "file/cuuo.mp3": {
    "title": "File:CUUo.mp3",
    "filename": "file_cuuo.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/CUUo.mp3.md"
  },
  "file/cymi.mp3": {
    "title": "File:CYmI.mp3",
    "filename": "file_cymi.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/CYmI.mp3.md"
  },
  "file/czmr.mp3": {
    "title": "File:CZmR.mp3",
    "filename": "file_czmr.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/CZmR.mp3.md"
  },
  "file/c-j.mp3": {
    "title": "File:C_j.mp3",
    "filename": "file_c-j.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/C_j.mp3.md"
  },
  "file/cgfz.mp3": {
    "title": "File:Cgfz.mp3",
    "filename": "file_cgfz.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Cgfz.mp3.md"
  },
  "file/dtzy.mp3": {
    "title": "File:DTzY.mp3",
    "filename": "file_dtzy.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/DTzY.mp3.md"
  },
  "file/dksj.mp3": {
    "title": "File:DkSJ.mp3",
    "filename": "file_dksj.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/DkSJ.mp3.md"
  },
  "file/dnew.mp3": {
    "title": "File:DneW.mp3",
    "filename": "file_dnew.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/DneW.mp3.md"
  },
  "file/dzer.mp3": {
    "title": "File:DzeR.mp3",
    "filename": "file_dzer.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/DzeR.mp3.md"
  },
  "file/en8z.mp3": {
    "title": "File:EN8z.mp3",
    "filename": "file_en8z.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/EN8z.mp3.md"
  },
  "file/eb20.mp3": {
    "title": "File:Eb20.mp3",
    "filename": "file_eb20.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Eb20.mp3.md"
  },
  "file/etsi.mp3": {
    "title": "File:EtSi.mp3",
    "filename": "file_etsi.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/EtSi.mp3.md"
  },
  "file/fdpc.mp3": {
    "title": "File:FDpc.mp3",
    "filename": "file_fdpc.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/FDpc.mp3.md"
  },
  "file/feed.mp3": {
    "title": "File:FEED.mp3",
    "filename": "file_feed.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/FEED.mp3.md"
  },
  "file/fjk1.mp3": {
    "title": "File:FJk1.mp3",
    "filename": "file_fjk1.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/FJk1.mp3.md"
  },
  "file/fsc2.mp3": {
    "title": "File:FSC2.mp3",
    "filename": "file_fsc2.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/FSC2.mp3.md"
  },
  "file/fntv.mp3": {
    "title": "File:FntV.mp3",
    "filename": "file_fntv.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/FntV.mp3.md"
  },
  "file/fore.mp3": {
    "title": "File:FoRe.mp3",
    "filename": "file_fore.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/FoRe.mp3.md"
  },
  "file/fxwp.mp3": {
    "title": "File:FxWp.mp3",
    "filename": "file_fxwp.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/FxWp.mp3.md"
  },
  "file/gnxf.mp3": {
    "title": "File:GNxf.mp3",
    "filename": "file_gnxf.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/GNxf.mp3.md"
  },
  "file/grof.mp3": {
    "title": "File:GRof.mp3",
    "filename": "file_grof.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/GRof.mp3.md"
  },
  "file/gu6m.mp3": {
    "title": "File:GU6M.mp3",
    "filename": "file_gu6m.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/GU6M.mp3.md"
  },
  "file/gx83.mp3": {
    "title": "File:GX83.mp3",
    "filename": "file_gx83.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/GX83.mp3.md"
  },
  "file/h-cm.mp3": {
    "title": "File:H-cm.mp3",
    "filename": "file_h-cm.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/H-cm.mp3.md"
  },
  "file/h88d.mp3": {
    "title": "File:H88d.mp3",
    "filename": "file_h88d.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/H88d.mp3.md"
  },
  "file/hrki.mp3": {
    "title": "File:HRki.mp3",
    "filename": "file_hrki.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/HRki.mp3.md"
  },
  "file/i3il.mp3": {
    "title": "File:I3Il.mp3",
    "filename": "file_i3il.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/I3Il.mp3.md"
  },
  "file/id48.mp3": {
    "title": "File:ID48.mp3",
    "filename": "file_id48.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/ID48.mp3.md"
  },
  "file/ih5c.mp3": {
    "title": "File:IH5c.mp3",
    "filename": "file_ih5c.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/IH5c.mp3.md"
  },
  "file/ioum.mp3": {
    "title": "File:IOUM.mp3",
    "filename": "file_ioum.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/IOUM.mp3.md"
  },
  "file/izyo.mp3": {
    "title": "File:IZyO.mp3",
    "filename": "file_izyo.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/IZyO.mp3.md"
  },
  "file/jsiq.mp3": {
    "title": "File:JSiQ.mp3",
    "filename": "file_jsiq.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/JSiQ.mp3.md"
  },
  "file/j-6g.mp3": {
    "title": "File:J_6G.mp3",
    "filename": "file_j-6g.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/J_6G.mp3.md"
  },
  "file/jap5.mp3": {
    "title": "File:Jap5.mp3",
    "filename": "file_jap5.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Jap5.mp3.md"
  },
  "file/jrpx.mp3": {
    "title": "File:JrpX.mp3",
    "filename": "file_jrpx.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/JrpX.mp3.md"
  },
  "file/k9bd.mp3": {
    "title": "File:K9bD.mp3",
    "filename": "file_k9bd.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/K9bD.mp3.md"
  },
  "file/ka89.mp3": {
    "title": "File:KA89.mp3",
    "filename": "file_ka89.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/KA89.mp3.md"
  },
  "file/krfc.mp3": {
    "title": "File:KRFC.mp3",
    "filename": "file_krfc.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/KRFC.mp3.md"
  },
  "file/kxlk.mp3": {
    "title": "File:KXlK.mp3",
    "filename": "file_kxlk.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/KXlK.mp3.md"
  },
  "file/kalt-sc6k.mp3": {
    "title": "File:Kalt_Sc6K.mp3",
    "filename": "file_kalt-sc6k.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Kalt_Sc6K.mp3.md"
  },
  "file/kbif.mp3": {
    "title": "File:KbIf.mp3",
    "filename": "file_kbif.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/KbIf.mp3.md"
  },
  "file/le6l.mp3": {
    "title": "File:LE6l.mp3",
    "filename": "file_le6l.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/LE6l.mp3.md"
  },
  "file/lkei.mp3": {
    "title": "File:LKEi.mp3",
    "filename": "file_lkei.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/LKEi.mp3.md"
  },
  "file/ldup.mp3": {
    "title": "File:LdUP.mp3",
    "filename": "file_ldup.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/LdUP.mp3.md"
  },
  "file/loet.mp3": {
    "title": "File:LoeT.mp3",
    "filename": "file_loet.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/LoeT.mp3.md"
  },
  "file/momz.mp3": {
    "title": "File:MoMZ.mp3",
    "filename": "file_momz.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/MoMZ.mp3.md"
  },
  "file/nhto.mp3": {
    "title": "File:NHTo.mp3",
    "filename": "file_nhto.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/NHTo.mp3.md"
  },
  "file/nhks.mp3": {
    "title": "File:NHkS.mp3",
    "filename": "file_nhks.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/NHkS.mp3.md"
  },
  "file/ny7w.mp3": {
    "title": "File:NY7W.mp3",
    "filename": "file_ny7w.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/NY7W.mp3.md"
  },
  "file/o2js.mp3": {
    "title": "File:O2Js.mp3",
    "filename": "file_o2js.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/O2Js.mp3.md"
  },
  "file/oat2.mp3": {
    "title": "File:OAt2.mp3",
    "filename": "file_oat2.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/OAt2.mp3.md"
  },
  "file/p1en.mp3": {
    "title": "File:P1EN.mp3",
    "filename": "file_p1en.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/P1EN.mp3.md"
  },
  "file/pgvg.mp3": {
    "title": "File:PGvG.mp3",
    "filename": "file_pgvg.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/PGvG.mp3.md"
  },
  "file/pg9i.mp3": {
    "title": "File:Pg9I.mp3",
    "filename": "file_pg9i.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pg9I.mp3.md"
  },
  "file/pron-jz-p.mp3": {
    "title": "File:Pron-jz-p.mp3",
    "filename": "file_pron-jz-p.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron-jz-p.mp3.md"
  },
  "file/pron-l2xp.mp3": {
    "title": "File:Pron-l2xp.mp3",
    "filename": "file_pron-l2xp.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron-l2xp.mp3.md"
  },
  "file/pron-8xt6.mp3": {
    "title": "File:Pron_8XT6.mp3",
    "filename": "file_pron-8xt6.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_8XT6.mp3.md"
  },
  "file/pron-9rmi.mp3": {
    "title": "File:Pron_9RmI.mp3",
    "filename": "file_pron-9rmi.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_9RmI.mp3.md"
  },
  "file/pron-npph.mp3": {
    "title": "File:Pron_NPPH.mp3",
    "filename": "file_pron-npph.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_NPPH.mp3.md"
  },
  "file/pron-v-qm.mp3": {
    "title": "File:Pron_V-Qm.mp3",
    "filename": "file_pron-v-qm.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_V-Qm.mp3.md"
  },
  "file/pron-bróðir-qagk.mp3": {
    "title": "File:Pron_bróðir_Qagk.mp3",
    "filename": "file_pron-bróðir-qagk.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_bróðir_Qagk.mp3.md"
  },
  "file/pron-ekkert-2thp.mp3": {
    "title": "File:Pron_ekkert_2thp.mp3",
    "filename": "file_pron-ekkert-2thp.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_ekkert_2thp.mp3.md"
  },
  "file/pron-erfitt-eof7.mp3": {
    "title": "File:Pron_erfitt_EOf7.mp3",
    "filename": "file_pron-erfitt-eof7.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_erfitt_EOf7.mp3.md"
  },
  "file/pron-ertu-4yrj.mp3": {
    "title": "File:Pron_ertu_4Yrj.mp3",
    "filename": "file_pron-ertu-4yrj.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_ertu_4Yrj.mp3.md"
  },
  "file/pron-f4fn.mp3": {
    "title": "File:Pron_f4FN.mp3",
    "filename": "file_pron-f4fn.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_f4FN.mp3.md"
  },
  "file/pron-hart-livh.mp3": {
    "title": "File:Pron_hart_LIVH.mp3",
    "filename": "file_pron-hart-livh.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_hart_LIVH.mp3.md"
  },
  "file/pron-heyra-igi.mp3": {
    "title": "File:Pron_heyra_Igi.mp3",
    "filename": "file_pron-heyra-igi.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_heyra_Igi.mp3.md"
  },
  "file/pron-horfa-db3y.mp3": {
    "title": "File:Pron_horfa_db3y.mp3",
    "filename": "file_pron-horfa-db3y.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_horfa_db3y.mp3.md"
  },
  "file/pron-hrafn-q2jm.mp3": {
    "title": "File:Pron_hrafn_q2jM.mp3",
    "filename": "file_pron-hrafn-q2jm.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_hrafn_q2jM.mp3.md"
  },
  "file/pron-hreyfa-nm6n.mp3": {
    "title": "File:Pron_hreyfa_nm6n.mp3",
    "filename": "file_pron-hreyfa-nm6n.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_hreyfa_nm6n.mp3.md"
  },
  "file/pron-hringja-kdnt.mp3": {
    "title": "File:Pron_hringja_kDNt.mp3",
    "filename": "file_pron-hringja-kdnt.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_hringja_kDNt.mp3.md"
  },
  "file/pron-hræddur-upzd.mp3": {
    "title": "File:Pron_hræddur_uPzd.mp3",
    "filename": "file_pron-hræddur-upzd.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_hræddur_uPzd.mp3.md"
  },
  "file/pron-hrútur-jds9.mp3": {
    "title": "File:Pron_hrútur_Jds9.mp3",
    "filename": "file_pron-hrútur-jds9.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_hrútur_Jds9.mp3.md"
  },
  "file/pron-króna--qoa.mp3": {
    "title": "File:Pron_króna_-qOa.mp3",
    "filename": "file_pron-króna--qoa.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_króna_-qOa.mp3.md"
  },
  "file/pron-morfín-ywzg.mp3": {
    "title": "File:Pron_morfín_YWZg.mp3",
    "filename": "file_pron-morfín-ywzg.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_morfín_YWZg.mp3.md"
  },
  "file/pron-rauður-r5cm.mp3": {
    "title": "File:Pron_rauður_r5cM.mp3",
    "filename": "file_pron-rauður-r5cm.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_rauður_r5cM.mp3.md"
  },
  "file/pron-sterkur-9vk-.mp3": {
    "title": "File:Pron_sterkur_9VK_.mp3",
    "filename": "file_pron-sterkur-9vk-.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_sterkur_9VK_.mp3.md"
  },
  "file/pron-svar-2ylz.mp3": {
    "title": "File:Pron_svar_2yLZ.mp3",
    "filename": "file_pron-svar-2ylz.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_svar_2yLZ.mp3.md"
  },
  "file/pron-svara-y1lt.mp3": {
    "title": "File:Pron_svara_Y1LT.mp3",
    "filename": "file_pron-svara-y1lt.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_svara_Y1LT.mp3.md"
  },
  "file/pron-vera-742k.mp3": {
    "title": "File:Pron_vera_742K.mp3",
    "filename": "file_pron-vera-742k.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_vera_742K.mp3.md"
  },
  "file/pron-vera-b6ez.mp3": {
    "title": "File:Pron_vera_b6ez.mp3",
    "filename": "file_pron-vera-b6ez.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_vera_b6ez.mp3.md"
  },
  "file/pron-vera-o-jv.mp3": {
    "title": "File:Pron_vera_o-jV.mp3",
    "filename": "file_pron-vera-o-jv.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_vera_o-jV.mp3.md"
  },
  "file/pron-wd2h.mp3": {
    "title": "File:Pron_wd2h.mp3",
    "filename": "file_pron-wd2h.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pron_wd2h.mp3.md"
  },
  "file/pronunciation-0a5.mp3": {
    "title": "File:Pronunciation_0a5.mp3",
    "filename": "file_pronunciation-0a5.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_0a5.mp3.md"
  },
  "file/pronunciation-3ypn.mp3": {
    "title": "File:Pronunciation_3Ypn.mp3",
    "filename": "file_pronunciation-3ypn.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_3Ypn.mp3.md"
  },
  "file/pronunciation-7lfr.mp3": {
    "title": "File:Pronunciation_7LFr.mp3",
    "filename": "file_pronunciation-7lfr.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_7LFr.mp3.md"
  },
  "file/pronunciation-ad-flyja-kn8y.mp3": {
    "title": "File:Pronunciation_ad-flyja_kn8Y.mp3",
    "filename": "file_pronunciation-ad-flyja-kn8y.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_ad-flyja_kn8Y.mp3.md"
  },
  "file/pronunciation-alla-7d-b.mp3": {
    "title": "File:Pronunciation_alla_7d-B.mp3",
    "filename": "file_pronunciation-alla-7d-b.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_alla_7d-B.mp3.md"
  },
  "file/pronunciation-anamadkar-nghw.mp3": {
    "title": "File:Pronunciation_anamadkar_NGhW.mp3",
    "filename": "file_pronunciation-anamadkar-nghw.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_anamadkar_NGhW.mp3.md"
  },
  "file/pronunciation-anamadkarnir-tqte.mp3": {
    "title": "File:Pronunciation_anamadkarnir_tqtE.mp3",
    "filename": "file_pronunciation-anamadkarnir-tqte.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_anamadkarnir_tqtE.mp3.md"
  },
  "file/pronunciation-barnaputtar-5nje.mp3": {
    "title": "File:Pronunciation_barnaputtar_5Nje.mp3",
    "filename": "file_pronunciation-barnaputtar-5nje.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_barnaputtar_5Nje.mp3.md"
  },
  "file/pronunciation-bornin-0fth.mp3": {
    "title": "File:Pronunciation_bornin_0fTH.mp3",
    "filename": "file_pronunciation-bornin-0fth.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_bornin_0fTH.mp3.md"
  },
  "file/pronunciation-einhverjir-hdh3.mp3": {
    "title": "File:Pronunciation_einhverjir_Hdh3.mp3",
    "filename": "file_pronunciation-einhverjir-hdh3.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_einhverjir_Hdh3.mp3.md"
  },
  "file/pronunciation-enga-gwnz.mp3": {
    "title": "File:Pronunciation_enga_gwnZ.mp3",
    "filename": "file_pronunciation-enga-gwnz.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_enga_gwnZ.mp3.md"
  },
  "file/pronunciation-ert-thu-heima-2njb.mp3": {
    "title": "File:Pronunciation_ert-thu-heima_2nJB.mp3",
    "filename": "file_pronunciation-ert-thu-heima-2njb.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_ert-thu-heima_2nJB.mp3.md"
  },
  "file/pronunciation-ert-thu-heima-dete.mp3": {
    "title": "File:Pronunciation_ert-thu-heima_DeTe.mp3",
    "filename": "file_pronunciation-ert-thu-heima-dete.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_ert-thu-heima_DeTe.mp3.md"
  },
  "file/pronunciation-felogum-v9t2.mp3": {
    "title": "File:Pronunciation_felogum_V9T2.mp3",
    "filename": "file_pronunciation-felogum-v9t2.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_felogum_V9T2.mp3.md"
  },
  "file/pronunciation-goturnar-7swj.mp3": {
    "title": "File:Pronunciation_goturnar_7sWJ.mp3",
    "filename": "file_pronunciation-goturnar-7swj.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_goturnar_7sWJ.mp3.md"
  },
  "file/pronunciation-hamfaranna-suit.mp3": {
    "title": "File:Pronunciation_hamfaranna_suIT.mp3",
    "filename": "file_pronunciation-hamfaranna-suit.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_hamfaranna_suIT.mp3.md"
  },
  "file/pronunciation-hefur-vppq.mp3": {
    "title": "File:Pronunciation_hefur_vPpQ.mp3",
    "filename": "file_pronunciation-hefur-vppq.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_hefur_vPpQ.mp3.md"
  },
  "file/pronunciation-hraedilegri-eesw.mp3": {
    "title": "File:Pronunciation_hraedilegri_eesw.mp3",
    "filename": "file_pronunciation-hraedilegri-eesw.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_hraedilegri_eesw.mp3.md"
  },
  "file/pronunciation-klukkustundum-saman-qrbx.mp3": {
    "title": "File:Pronunciation_klukkustundum-saman_QrBx.mp3",
    "filename": "file_pronunciation-klukkustundum-saman-qrbx.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_klukkustundum-saman_QrBx.mp3.md"
  },
  "file/pronunciation-komast-2vmd.mp3": {
    "title": "File:Pronunciation_komast_2VmD.mp3",
    "filename": "file_pronunciation-komast-2vmd.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_komast_2VmD.mp3.md"
  },
  "file/pronunciation-kuldaskonna-eyo9.mp3": {
    "title": "File:Pronunciation_kuldaskonna_EYO9.mp3",
    "filename": "file_pronunciation-kuldaskonna-eyo9.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_kuldaskonna_EYO9.mp3.md"
  },
  "file/pronunciation-lqvu.mp3": {
    "title": "File:Pronunciation_lQVu.mp3",
    "filename": "file_pronunciation-lqvu.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_lQVu.mp3.md"
  },
  "file/pronunciation-leidinni-wciz.mp3": {
    "title": "File:Pronunciation_leidinni_wCiZ.mp3",
    "filename": "file_pronunciation-leidinni-wciz.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_leidinni_wCiZ.mp3.md"
  },
  "file/pronunciation-litlir-fjb9.mp3": {
    "title": "File:Pronunciation_litlir_fJb9.mp3",
    "filename": "file_pronunciation-litlir-fjb9.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_litlir_fJb9.mp3.md"
  },
  "file/pronunciation-madkana-y-e5.mp3": {
    "title": "File:Pronunciation_madkana_y_E5.mp3",
    "filename": "file_pronunciation-madkana-y-e5.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_madkana_y_E5.mp3.md"
  },
  "file/pronunciation-moldin-1vfr.mp3": {
    "title": "File:Pronunciation_moldin_1vFR.mp3",
    "filename": "file_pronunciation-moldin-1vfr.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_moldin_1vFR.mp3.md"
  },
  "file/pronunciation-mun-oepn.mp3": {
    "title": "File:Pronunciation_mun_OEPN.mp3",
    "filename": "file_pronunciation-mun-oepn.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_mun_OEPN.mp3.md"
  },
  "file/pronunciation-pji-.mp3": {
    "title": "File:Pronunciation_pJi-.mp3",
    "filename": "file_pronunciation-pji-.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_pJi-.mp3.md"
  },
  "file/pronunciation-pollar-mtsy.mp3": {
    "title": "File:Pronunciation_pollar_mTSY.mp3",
    "filename": "file_pronunciation-pollar-mtsy.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_pollar_mTSY.mp3.md"
  },
  "file/pronunciation-rignt-kjf-.mp3": {
    "title": "File:Pronunciation_rignt_KJf_.mp3",
    "filename": "file_pronunciation-rignt-kjf-.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_rignt_KJf_.mp3.md"
  },
  "file/pronunciation-sinum-br8w.mp3": {
    "title": "File:Pronunciation_sinum_BR8w.mp3",
    "filename": "file_pronunciation-sinum-br8w.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_sinum_BR8w.mp3.md"
  },
  "file/pronunciation-slepjulegum-feo.mp3": {
    "title": "File:Pronunciation_slepjulegum_Feo.mp3",
    "filename": "file_pronunciation-slepjulegum-feo.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_slepjulegum_Feo.mp3.md"
  },
  "file/pronunciation-solum-fm9-.mp3": {
    "title": "File:Pronunciation_solum_FM9_.mp3",
    "filename": "file_pronunciation-solum-fm9-.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_solum_FM9_.mp3.md"
  },
  "file/pronunciation-storir-vf0j.mp3": {
    "title": "File:Pronunciation_storir_VF0j.mp3",
    "filename": "file_pronunciation-storir-vf0j.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_storir_VF0j.mp3.md"
  },
  "file/pronunciation-taka-a-moti-cqd9.mp3": {
    "title": "File:Pronunciation_taka-a-moti_cqD9.mp3",
    "filename": "file_pronunciation-taka-a-moti-cqd9.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_taka-a-moti_cqD9.mp3.md"
  },
  "file/pronunciation-vatni-vqwf.mp3": {
    "title": "File:Pronunciation_vatni_vQWF.mp3",
    "filename": "file_pronunciation-vatni-vqwf.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_vatni_vQWF.mp3.md"
  },
  "file/pronunciation-vid-tekur-gleb.mp3": {
    "title": "File:Pronunciation_vid-tekur_Gleb.mp3",
    "filename": "file_pronunciation-vid-tekur-gleb.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_vid-tekur_Gleb.mp3.md"
  },
  "file/pronunciation-yfirbordid-adqv.mp3": {
    "title": "File:Pronunciation_yfirbordid_ADQV.mp3",
    "filename": "file_pronunciation-yfirbordid-adqv.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_yfirbordid_ADQV.mp3.md"
  },
  "file/pronunciation-yfirbordinu-yooc.mp3": {
    "title": "File:Pronunciation_yfirbordinu_YOoc.mp3",
    "filename": "file_pronunciation-yfirbordinu-yooc.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Pronunciation_yfirbordinu_YOoc.mp3.md"
  },
  "file/qiq3.mp3": {
    "title": "File:QiQ3.mp3",
    "filename": "file_qiq3.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/QiQ3.mp3.md"
  },
  "file/racc.mp3": {
    "title": "File:Racc.mp3",
    "filename": "file_racc.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Racc.mp3.md"
  },
  "file/rignt-zft-.mp3": {
    "title": "File:Rignt_ZFt-.mp3",
    "filename": "file_rignt-zft-.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Rignt_ZFt-.mp3.md"
  },
  "file/rignt-sqc1.mp3": {
    "title": "File:Rignt_sQc1.mp3",
    "filename": "file_rignt-sqc1.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Rignt_sQc1.mp3.md"
  },
  "file/rignt-xnm.mp3": {
    "title": "File:Rignt_xNM.mp3",
    "filename": "file_rignt-xnm.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Rignt_xNM.mp3.md"
  },
  "file/rjkt.mp3": {
    "title": "File:RjKt.mp3",
    "filename": "file_rjkt.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/RjKt.mp3.md"
  },
  "file/rqb4.mp3": {
    "title": "File:Rqb4.mp3",
    "filename": "file_rqb4.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Rqb4.mp3.md"
  },
  "file/ru-r.mp3": {
    "title": "File:Ru-r.mp3",
    "filename": "file_ru-r.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Ru-r.mp3.md"
  },
  "file/svks.mp3": {
    "title": "File:SVkS.mp3",
    "filename": "file_svks.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/SVkS.mp3.md"
  },
  "file/sagði-5jhr.mp3": {
    "title": "File:Sagði_5jHr.mp3",
    "filename": "file_sagði-5jhr.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Sagði_5jHr.mp3.md"
  },
  "file/sgck.mp3": {
    "title": "File:SgCk.mp3",
    "filename": "file_sgck.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/SgCk.mp3.md"
  },
  "file/snmh.mp3": {
    "title": "File:SnmH.mp3",
    "filename": "file_snmh.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/SnmH.mp3.md"
  },
  "file/somc.mp3": {
    "title": "File:SomC.mp3",
    "filename": "file_somc.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/SomC.mp3.md"
  },
  "file/spbl.mp3": {
    "title": "File:SpBL.mp3",
    "filename": "file_spbl.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/SpBL.mp3.md"
  },
  "file/spjm.mp3": {
    "title": "File:SpJM.mp3",
    "filename": "file_spjm.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/SpJM.mp3.md"
  },
  "file/ssb-.mp3": {
    "title": "File:Ssb_.mp3",
    "filename": "file_ssb-.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Ssb_.mp3.md"
  },
  "file/sund.mp3": {
    "title": "File:Sund.mp3",
    "filename": "file_sund.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Sund.mp3.md"
  },
  "file/tdnq.mp3": {
    "title": "File:TDNq.mp3",
    "filename": "file_tdnq.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/TDNq.mp3.md"
  },
  "file/tdje.mp3": {
    "title": "File:Tdje.mp3",
    "filename": "file_tdje.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Tdje.mp3.md"
  },
  "file/tzz5.mp3": {
    "title": "File:TzZ5.mp3",
    "filename": "file_tzz5.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/TzZ5.mp3.md"
  },
  "file/uke9.mp3": {
    "title": "File:UKe9.mp3",
    "filename": "file_uke9.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/UKe9.mp3.md"
  },
  "file/ugqb.mp3": {
    "title": "File:Ugqb.mp3",
    "filename": "file_ugqb.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Ugqb.mp3.md"
  },
  "file/v3ec.mp3": {
    "title": "File:V3Ec.mp3",
    "filename": "file_v3ec.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/V3Ec.mp3.md"
  },
  "file/vssx.mp3": {
    "title": "File:VSSx.mp3",
    "filename": "file_vssx.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/VSSx.mp3.md"
  },
  "file/vzvf.mp3": {
    "title": "File:VZvF.mp3",
    "filename": "file_vzvf.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/VZvF.mp3.md"
  },
  "file/vlcc.mp3": {
    "title": "File:Vlcc.mp3",
    "filename": "file_vlcc.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Vlcc.mp3.md"
  },
  "file/vlmk.mp3": {
    "title": "File:VlmK.mp3",
    "filename": "file_vlmk.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/VlmK.mp3.md"
  },
  "file/wvze.mp3": {
    "title": "File:WVze.mp3",
    "filename": "file_wvze.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/WVze.mp3.md"
  },
  "file/wp1s.mp3": {
    "title": "File:Wp1s.mp3",
    "filename": "file_wp1s.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Wp1s.mp3.md"
  },
  "file/xfdm.mp3": {
    "title": "File:XFdm.mp3",
    "filename": "file_xfdm.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/XFdm.mp3.md"
  },
  "file/xwho.mp3": {
    "title": "File:XWho.mp3",
    "filename": "file_xwho.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/XWho.mp3.md"
  },
  "file/xblk.mp3": {
    "title": "File:XbLk.mp3",
    "filename": "file_xblk.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/XbLk.mp3.md"
  },
  "file/y3ff.mp3": {
    "title": "File:Y3fF.mp3",
    "filename": "file_y3ff.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Y3fF.mp3.md"
  },
  "file/yjew.mp3": {
    "title": "File:YJEW.mp3",
    "filename": "file_yjew.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/YJEW.mp3.md"
  },
  "file/ym0v.mp3": {
    "title": "File:YM0v.mp3",
    "filename": "file_ym0v.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/YM0v.mp3.md"
  },
  "file/ypwc.mp3": {
    "title": "File:YpWC.mp3",
    "filename": "file_ypwc.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/YpWC.mp3.md"
  },
  "file/zm8a.mp3": {
    "title": "File:ZM8a.mp3",
    "filename": "file_zm8a.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/ZM8a.mp3.md"
  },
  "file/zzt1.mp3": {
    "title": "File:ZZt1.mp3",
    "filename": "file_zzt1.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/ZZt1.mp3.md"
  },
  "file/þúfa.mp3": {
    "title": "File:Þúfa.mp3",
    "filename": "file_þúfa.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/Þúfa.mp3.md"
  },
  "file/ákveðinn.mp3": {
    "title": "File:Ákveðinn.mp3",
    "filename": "file_ákveðinn.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Ákveðinn.mp3.md"
  },
  "file/ánamaðkar.mp3": {
    "title": "File:Ánamaðkar.mp3",
    "filename": "file_ánamaðkar.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Ánamaðkar.mp3.md"
  },
  "file/ástkæra.mp3": {
    "title": "File:Ástkæra.mp3",
    "filename": "file_ástkæra.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Ástkæra.mp3.md"
  },
  "file/ég-hélt-framhjá-elvari.mp3": {
    "title": "File:Ég_hélt_framhjá_Elvari.mp3",
    "filename": "file_ég-hélt-framhjá-elvari.mp3",
    "file": "/Users/egill/ylhyra_content/not_data/files/audio/Ég_hélt_framhjá_Elvari.mp3.md"
  },
  "file/eliza-reid.jpg": {
    "title": "File:Eliza_Reid.jpg",
    "filename": "file_eliza-reid.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Eliza_Reid.jpg.md"
  },
  "file/eliza-og-ylhýra.jpg": {
    "title": "File:Eliza_og_Ylhýra.jpg",
    "filename": "file_eliza-og-ylhýra.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Eliza_og_Ylhýra.jpg.md"
  },
  "file/friðrika-með-hund.jpg": {
    "title": "File:Friðrika_með_hund.jpg",
    "filename": "file_friðrika-með-hund.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Friðrika_með_hund.jpg.md"
  },
  "file/fósbræður.jpg": {
    "title": "File:Fósbræður.jpg",
    "filename": "file_fósbræður.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Fósbræður.jpg.md"
  },
  "file/hundur-í-garði2.jpg": {
    "title": "File:Hundur_í_garði2.jpg",
    "filename": "file_hundur-í-garði2.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Hundur_í_garði2.jpg.md"
  },
  "file/iceland-nootka-lupin-flower-fields.jpg": {
    "title": "File:Iceland_Nootka_Lupin_Flower_Fields.jpg",
    "filename": "file_iceland-nootka-lupin-flower-fields.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Iceland_Nootka_Lupin_Flower_Fields.jpg.md"
  },
  "file/imba.jpg": {
    "title": "File:Imba.jpg",
    "filename": "file_imba.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Imba.jpg.md"
  },
  "file/kindur-á-beit.jpg": {
    "title": "File:Kindur_á_beit.jpg",
    "filename": "file_kindur-á-beit.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Kindur_á_beit.jpg.md"
  },
  "file/kirkja.jpg": {
    "title": "File:Kirkja.jpg",
    "filename": "file_kirkja.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Kirkja.jpg.md"
  },
  "file/landmannalaugar2.jpg": {
    "title": "File:Landmannalaugar2.jpg",
    "filename": "file_landmannalaugar2.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Landmannalaugar2.jpg.md"
  },
  "file/loftmynd.jpeg": {
    "title": "File:Loftmynd.jpeg",
    "filename": "file_loftmynd.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Loftmynd.jpeg.md"
  },
  "file/loftmynd-2.jpg": {
    "title": "File:Loftmynd_2.jpg",
    "filename": "file_loftmynd-2.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Loftmynd_2.jpg.md"
  },
  "file/lopapeysa-–-alan-levine.jpg": {
    "title": "File:Lopapeysa_–_Alan_Levine.jpg",
    "filename": "file_lopapeysa-–-alan-levine.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Lopapeysa_–_Alan_Levine.jpg.md"
  },
  "file/lopapeysa-–-john-shortland.jpg": {
    "title": "File:Lopapeysa_–_John_Shortland.jpg",
    "filename": "file_lopapeysa-–-john-shortland.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Lopapeysa_–_John_Shortland.jpg.md"
  },
  "file/snorri-meme.png": {
    "title": "File:Snorri_meme.png",
    "filename": "file_snorri-meme.png",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Snorri_meme.png.md"
  },
  "file/sundlaug.jpg": {
    "title": "File:Sundlaug.jpg",
    "filename": "file_sundlaug.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Sundlaug.jpg.md"
  },
  "file/villineto.jpg": {
    "title": "File:VilliNeto.jpg",
    "filename": "file_villineto.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/VilliNeto.jpg.md"
  },
  "file/villi-neto-finnland-thumbnail.jpg": {
    "title": "File:Villi_neto_finnland_thumbnail.jpg",
    "filename": "file_villi-neto-finnland-thumbnail.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Villi_neto_finnland_thumbnail.jpg.md"
  },
  "file/villi-neto-fullt-nafn-thumbnail.jpg": {
    "title": "File:Villi_neto_fullt_nafn_thumbnail.jpg",
    "filename": "file_villi-neto-fullt-nafn-thumbnail.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Villi_neto_fullt_nafn_thumbnail.jpg.md"
  },
  "file/villi-neto-lýsi-thumbnail.jpg": {
    "title": "File:Villi_neto_lýsi_thumbnail.jpg",
    "filename": "file_villi-neto-lýsi-thumbnail.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Villi_neto_lýsi_thumbnail.jpg.md"
  },
  "file/blaer-fyrst-vid-erum-herna.jpg": {
    "title": "File:Blaer_fyrst_vid_erum_herna.jpg",
    "filename": "file_blaer-fyrst-vid-erum-herna.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blaer_fyrst_vid_erum_herna.jpg.md"
  },
  "file/blær-–-lunga-11274.jpeg": {
    "title": "File:Blær_–_Lunga_11274.jpeg",
    "filename": "file_blær-–-lunga-11274.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_11274.jpeg.md"
  },
  "file/blær-–-lunga-15382.jpeg": {
    "title": "File:Blær_–_Lunga_15382.jpeg",
    "filename": "file_blær-–-lunga-15382.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_15382.jpeg.md"
  },
  "file/blær-–-lunga-17669.jpeg": {
    "title": "File:Blær_–_Lunga_17669.jpeg",
    "filename": "file_blær-–-lunga-17669.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_17669.jpeg.md"
  },
  "file/blær-–-lunga-19176.jpeg": {
    "title": "File:Blær_–_Lunga_19176.jpeg",
    "filename": "file_blær-–-lunga-19176.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_19176.jpeg.md"
  },
  "file/blær-–-lunga-20465.jpeg": {
    "title": "File:Blær_–_Lunga_20465.jpeg",
    "filename": "file_blær-–-lunga-20465.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_20465.jpeg.md"
  },
  "file/blær-–-lunga-22042.jpeg": {
    "title": "File:Blær_–_Lunga_22042.jpeg",
    "filename": "file_blær-–-lunga-22042.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_22042.jpeg.md"
  },
  "file/blær-–-lunga-23199.jpeg": {
    "title": "File:Blær_–_Lunga_23199.jpeg",
    "filename": "file_blær-–-lunga-23199.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_23199.jpeg.md"
  },
  "file/blær-–-lunga-24797.jpeg": {
    "title": "File:Blær_–_Lunga_24797.jpeg",
    "filename": "file_blær-–-lunga-24797.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_24797.jpeg.md"
  },
  "file/blær-–-lunga-25211.jpeg": {
    "title": "File:Blær_–_Lunga_25211.jpeg",
    "filename": "file_blær-–-lunga-25211.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_25211.jpeg.md"
  },
  "file/blær-–-lunga-25943.jpeg": {
    "title": "File:Blær_–_Lunga_25943.jpeg",
    "filename": "file_blær-–-lunga-25943.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_25943.jpeg.md"
  },
  "file/blær-–-lunga-26290.jpeg": {
    "title": "File:Blær_–_Lunga_26290.jpeg",
    "filename": "file_blær-–-lunga-26290.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_26290.jpeg.md"
  },
  "file/blær-–-lunga-26295.jpeg": {
    "title": "File:Blær_–_Lunga_26295.jpeg",
    "filename": "file_blær-–-lunga-26295.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_26295.jpeg.md"
  },
  "file/blær-–-lunga-27594.jpeg": {
    "title": "File:Blær_–_Lunga_27594.jpeg",
    "filename": "file_blær-–-lunga-27594.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_27594.jpeg.md"
  },
  "file/blær-–-lunga-29594.jpeg": {
    "title": "File:Blær_–_Lunga_29594.jpeg",
    "filename": "file_blær-–-lunga-29594.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_29594.jpeg.md"
  },
  "file/blær-–-lunga-30304.jpeg": {
    "title": "File:Blær_–_Lunga_30304.jpeg",
    "filename": "file_blær-–-lunga-30304.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_30304.jpeg.md"
  },
  "file/blær-–-lunga-33215.jpeg": {
    "title": "File:Blær_–_Lunga_33215.jpeg",
    "filename": "file_blær-–-lunga-33215.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_33215.jpeg.md"
  },
  "file/blær-–-lunga-34407.jpeg": {
    "title": "File:Blær_–_Lunga_34407.jpeg",
    "filename": "file_blær-–-lunga-34407.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_34407.jpeg.md"
  },
  "file/blær-–-lunga-34482.jpeg": {
    "title": "File:Blær_–_Lunga_34482.jpeg",
    "filename": "file_blær-–-lunga-34482.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_34482.jpeg.md"
  },
  "file/blær-–-lunga-35177.jpeg": {
    "title": "File:Blær_–_Lunga_35177.jpeg",
    "filename": "file_blær-–-lunga-35177.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_35177.jpeg.md"
  },
  "file/blær-–-lunga-37573.jpeg": {
    "title": "File:Blær_–_Lunga_37573.jpeg",
    "filename": "file_blær-–-lunga-37573.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_37573.jpeg.md"
  },
  "file/blær-–-lunga-37872.jpeg": {
    "title": "File:Blær_–_Lunga_37872.jpeg",
    "filename": "file_blær-–-lunga-37872.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_37872.jpeg.md"
  },
  "file/blær-–-lunga-38825.jpeg": {
    "title": "File:Blær_–_Lunga_38825.jpeg",
    "filename": "file_blær-–-lunga-38825.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_38825.jpeg.md"
  },
  "file/blær-–-lunga-41579.jpeg": {
    "title": "File:Blær_–_Lunga_41579.jpeg",
    "filename": "file_blær-–-lunga-41579.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_41579.jpeg.md"
  },
  "file/blær-–-lunga-42883.jpeg": {
    "title": "File:Blær_–_Lunga_42883.jpeg",
    "filename": "file_blær-–-lunga-42883.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_42883.jpeg.md"
  },
  "file/blær-–-lunga-4432.jpeg": {
    "title": "File:Blær_–_Lunga_4432.jpeg",
    "filename": "file_blær-–-lunga-4432.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_4432.jpeg.md"
  },
  "file/blær-–-lunga-45176.jpeg": {
    "title": "File:Blær_–_Lunga_45176.jpeg",
    "filename": "file_blær-–-lunga-45176.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_45176.jpeg.md"
  },
  "file/blær-–-lunga-46117.jpeg": {
    "title": "File:Blær_–_Lunga_46117.jpeg",
    "filename": "file_blær-–-lunga-46117.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_46117.jpeg.md"
  },
  "file/blær-–-lunga-48353.jpeg": {
    "title": "File:Blær_–_Lunga_48353.jpeg",
    "filename": "file_blær-–-lunga-48353.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_48353.jpeg.md"
  },
  "file/blær-–-lunga-48757.jpeg": {
    "title": "File:Blær_–_Lunga_48757.jpeg",
    "filename": "file_blær-–-lunga-48757.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_48757.jpeg.md"
  },
  "file/blær-–-lunga-50546.jpeg": {
    "title": "File:Blær_–_Lunga_50546.jpeg",
    "filename": "file_blær-–-lunga-50546.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_50546.jpeg.md"
  },
  "file/blær-–-lunga-51648.jpeg": {
    "title": "File:Blær_–_Lunga_51648.jpeg",
    "filename": "file_blær-–-lunga-51648.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_51648.jpeg.md"
  },
  "file/blær-–-lunga-58446.jpeg": {
    "title": "File:Blær_–_Lunga_58446.jpeg",
    "filename": "file_blær-–-lunga-58446.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_58446.jpeg.md"
  },
  "file/blær-–-lunga-59603.jpeg": {
    "title": "File:Blær_–_Lunga_59603.jpeg",
    "filename": "file_blær-–-lunga-59603.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_59603.jpeg.md"
  },
  "file/blær-–-lunga-63307.jpeg": {
    "title": "File:Blær_–_Lunga_63307.jpeg",
    "filename": "file_blær-–-lunga-63307.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_63307.jpeg.md"
  },
  "file/blær-–-lunga-64949.jpeg": {
    "title": "File:Blær_–_Lunga_64949.jpeg",
    "filename": "file_blær-–-lunga-64949.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_64949.jpeg.md"
  },
  "file/blær-–-lunga-65019.jpeg": {
    "title": "File:Blær_–_Lunga_65019.jpeg",
    "filename": "file_blær-–-lunga-65019.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_65019.jpeg.md"
  },
  "file/blær-–-lunga-67549.jpeg": {
    "title": "File:Blær_–_Lunga_67549.jpeg",
    "filename": "file_blær-–-lunga-67549.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_67549.jpeg.md"
  },
  "file/blær-–-lunga-68860.jpeg": {
    "title": "File:Blær_–_Lunga_68860.jpeg",
    "filename": "file_blær-–-lunga-68860.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_68860.jpeg.md"
  },
  "file/blær-–-lunga-70494.jpeg": {
    "title": "File:Blær_–_Lunga_70494.jpeg",
    "filename": "file_blær-–-lunga-70494.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_70494.jpeg.md"
  },
  "file/blær-–-lunga-72077.jpeg": {
    "title": "File:Blær_–_Lunga_72077.jpeg",
    "filename": "file_blær-–-lunga-72077.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_72077.jpeg.md"
  },
  "file/blær-–-lunga-74277.jpeg": {
    "title": "File:Blær_–_Lunga_74277.jpeg",
    "filename": "file_blær-–-lunga-74277.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_74277.jpeg.md"
  },
  "file/blær-–-lunga-74298.jpeg": {
    "title": "File:Blær_–_Lunga_74298.jpeg",
    "filename": "file_blær-–-lunga-74298.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_74298.jpeg.md"
  },
  "file/blær-–-lunga-76634.jpeg": {
    "title": "File:Blær_–_Lunga_76634.jpeg",
    "filename": "file_blær-–-lunga-76634.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_76634.jpeg.md"
  },
  "file/blær-–-lunga-77931.jpeg": {
    "title": "File:Blær_–_Lunga_77931.jpeg",
    "filename": "file_blær-–-lunga-77931.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_77931.jpeg.md"
  },
  "file/blær-–-lunga-79436.jpeg": {
    "title": "File:Blær_–_Lunga_79436.jpeg",
    "filename": "file_blær-–-lunga-79436.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_79436.jpeg.md"
  },
  "file/blær-–-lunga-81409.jpeg": {
    "title": "File:Blær_–_Lunga_81409.jpeg",
    "filename": "file_blær-–-lunga-81409.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_81409.jpeg.md"
  },
  "file/blær-–-lunga-82330.jpeg": {
    "title": "File:Blær_–_Lunga_82330.jpeg",
    "filename": "file_blær-–-lunga-82330.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_82330.jpeg.md"
  },
  "file/blær-–-lunga-86234.jpeg": {
    "title": "File:Blær_–_Lunga_86234.jpeg",
    "filename": "file_blær-–-lunga-86234.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_86234.jpeg.md"
  },
  "file/blær-–-lunga-86325.jpeg": {
    "title": "File:Blær_–_Lunga_86325.jpeg",
    "filename": "file_blær-–-lunga-86325.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_86325.jpeg.md"
  },
  "file/blær-–-lunga-88840.jpeg": {
    "title": "File:Blær_–_Lunga_88840.jpeg",
    "filename": "file_blær-–-lunga-88840.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_88840.jpeg.md"
  },
  "file/blær-–-lunga-89954.jpeg": {
    "title": "File:Blær_–_Lunga_89954.jpeg",
    "filename": "file_blær-–-lunga-89954.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_89954.jpeg.md"
  },
  "file/blær-–-lunga-91168.jpeg": {
    "title": "File:Blær_–_Lunga_91168.jpeg",
    "filename": "file_blær-–-lunga-91168.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_91168.jpeg.md"
  },
  "file/blær-–-lunga-91491.jpeg": {
    "title": "File:Blær_–_Lunga_91491.jpeg",
    "filename": "file_blær-–-lunga-91491.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_91491.jpeg.md"
  },
  "file/blær-–-lunga-92168.jpeg": {
    "title": "File:Blær_–_Lunga_92168.jpeg",
    "filename": "file_blær-–-lunga-92168.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_92168.jpeg.md"
  },
  "file/blær-–-lunga-92785.jpeg": {
    "title": "File:Blær_–_Lunga_92785.jpeg",
    "filename": "file_blær-–-lunga-92785.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_92785.jpeg.md"
  },
  "file/blær-–-lunga-92937.jpeg": {
    "title": "File:Blær_–_Lunga_92937.jpeg",
    "filename": "file_blær-–-lunga-92937.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_92937.jpeg.md"
  },
  "file/blær-–-lunga-96597.jpeg": {
    "title": "File:Blær_–_Lunga_96597.jpeg",
    "filename": "file_blær-–-lunga-96597.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Lunga_96597.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-10928.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_10928.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-10928.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_10928.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-116.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_116.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-116.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_116.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-13555.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_13555.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-13555.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_13555.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-27258.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_27258.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-27258.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_27258.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-2956.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_2956.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-2956.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_2956.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-32742.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_32742.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-32742.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_32742.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-35643.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_35643.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-35643.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_35643.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-49962.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_49962.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-49962.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_49962.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-58842.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_58842.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-58842.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_58842.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-62248.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_62248.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-62248.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_62248.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-73456.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_73456.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-73456.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_73456.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-80282.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_80282.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-80282.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_80282.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-82960.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_82960.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-82960.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_82960.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-89517.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_89517.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-89517.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_89517.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-92246.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_92246.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-92246.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_92246.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-93777.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_93777.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-93777.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_93777.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-94116.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_94116.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-94116.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_94116.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-94829.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_94829.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-94829.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_94829.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-97731.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_97731.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-97731.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_97731.jpeg.md"
  },
  "file/blær-–-silfur-svanurinn-98743.jpeg": {
    "title": "File:Blær_–_Silfur_svanurinn_98743.jpeg",
    "filename": "file_blær-–-silfur-svanurinn-98743.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Silfur_svanurinn_98743.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-11878.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_11878.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-11878.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_11878.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-15134.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_15134.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-15134.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_15134.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-16596.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_16596.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-16596.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_16596.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-26849.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_26849.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-26849.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_26849.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-30783.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_30783.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-30783.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_30783.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-32036.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_32036.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-32036.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_32036.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-3244.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_3244.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-3244.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_3244.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-35290.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_35290.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-35290.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_35290.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-40364.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_40364.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-40364.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_40364.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-4044.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_4044.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-4044.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_4044.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-41536.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_41536.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-41536.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_41536.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-43410.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_43410.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-43410.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_43410.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-46075.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_46075.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-46075.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_46075.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-49175.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_49175.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-49175.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_49175.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-51592.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_51592.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-51592.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_51592.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-51943.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_51943.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-51943.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_51943.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-53544.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_53544.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-53544.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_53544.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-56218.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_56218.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-56218.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_56218.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-57284.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_57284.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-57284.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_57284.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-57629.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_57629.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-57629.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_57629.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-58299.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_58299.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-58299.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_58299.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-66729.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_66729.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-66729.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_66729.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-67195.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_67195.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-67195.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_67195.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-68828.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_68828.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-68828.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_68828.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-79010.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_79010.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-79010.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_79010.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-85125.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_85125.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-85125.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_85125.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-92109.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_92109.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-92109.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_92109.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-96397.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_96397.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-96397.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_96397.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-9768.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_9768.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-9768.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_9768.jpeg.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-99870.jpeg": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_99870.jpeg",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-99870.jpeg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Blær_–_Vinkonur_vors_og_blóma_99870.jpeg.md"
  },
  "file/júlíus-bóndi.jpg": {
    "title": "File:Júlíus_bóndi.jpg",
    "filename": "file_júlíus-bóndi.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/blær/Júlíus_bóndi.jpg.md"
  },
  "file/tweet-branddis-asrun-15lvw3g.jpg": {
    "title": "File:Tweet-Branddis_Asrun-15lvw3g.jpg",
    "filename": "file_tweet-branddis-asrun-15lvw3g.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-15lvw3g.jpg.md"
  },
  "file/tweet-branddis-asrun-18f9mb0.jpg": {
    "title": "File:Tweet-Branddis_Asrun-18f9mb0.jpg",
    "filename": "file_tweet-branddis-asrun-18f9mb0.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-18f9mb0.jpg.md"
  },
  "file/tweet-branddis-asrun-1b2u3k5.jpg": {
    "title": "File:Tweet-Branddis_Asrun-1b2u3k5.jpg",
    "filename": "file_tweet-branddis-asrun-1b2u3k5.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-1b2u3k5.jpg.md"
  },
  "file/tweet-branddis-asrun-1b4pht1.jpg": {
    "title": "File:Tweet-Branddis_Asrun-1b4pht1.jpg",
    "filename": "file_tweet-branddis-asrun-1b4pht1.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-1b4pht1.jpg.md"
  },
  "file/tweet-branddis-asrun-1hw0itu.jpg": {
    "title": "File:Tweet-Branddis_Asrun-1hw0itu.jpg",
    "filename": "file_tweet-branddis-asrun-1hw0itu.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-1hw0itu.jpg.md"
  },
  "file/tweet-branddis-asrun-1j9rdcq.jpg": {
    "title": "File:Tweet-Branddis_Asrun-1j9rdcq.jpg",
    "filename": "file_tweet-branddis-asrun-1j9rdcq.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-1j9rdcq.jpg.md"
  },
  "file/tweet-branddis-asrun-aqt7ek.jpg": {
    "title": "File:Tweet-Branddis_Asrun-aqt7ek.jpg",
    "filename": "file_tweet-branddis-asrun-aqt7ek.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-aqt7ek.jpg.md"
  },
  "file/tweet-branddis-asrun-o4k3t5.jpg": {
    "title": "File:Tweet-Branddis_Asrun-o4k3t5.jpg",
    "filename": "file_tweet-branddis-asrun-o4k3t5.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-o4k3t5.jpg.md"
  },
  "file/tweet-branddis-asrun-twg7jc.jpg": {
    "title": "File:Tweet-Branddis_Asrun-twg7jc.jpg",
    "filename": "file_tweet-branddis-asrun-twg7jc.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-twg7jc.jpg.md"
  },
  "file/tweet-branddis-asrun-vfvk14.jpg": {
    "title": "File:Tweet-Branddis_Asrun-vfvk14.jpg",
    "filename": "file_tweet-branddis-asrun-vfvk14.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-vfvk14.jpg.md"
  },
  "file/tweet-branddis-asrun-xqst5c.jpg": {
    "title": "File:Tweet-Branddis_Asrun-xqst5c.jpg",
    "filename": "file_tweet-branddis-asrun-xqst5c.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-Branddis_Asrun-xqst5c.jpg.md"
  },
  "file/tweet-asabergny-17t0ze8.jpg": {
    "title": "File:Tweet-asabergny-17t0ze8.jpg",
    "filename": "file_tweet-asabergny-17t0ze8.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-asabergny-17t0ze8.jpg.md"
  },
  "file/tweet-asabergny-1btm0k9.jpg": {
    "title": "File:Tweet-asabergny-1btm0k9.jpg",
    "filename": "file_tweet-asabergny-1btm0k9.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-asabergny-1btm0k9.jpg.md"
  },
  "file/tweet-asabergny-cuu5kk.jpg": {
    "title": "File:Tweet-asabergny-cuu5kk.jpg",
    "filename": "file_tweet-asabergny-cuu5kk.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-asabergny-cuu5kk.jpg.md"
  },
  "file/tweet-asabergny-jkfrbo.jpg": {
    "title": "File:Tweet-asabergny-jkfrbo.jpg",
    "filename": "file_tweet-asabergny-jkfrbo.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-asabergny-jkfrbo.jpg.md"
  },
  "file/tweet-asabergny-pxfb2m.jpg": {
    "title": "File:Tweet-asabergny-pxfb2m.jpg",
    "filename": "file_tweet-asabergny-pxfb2m.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-asabergny-pxfb2m.jpg.md"
  },
  "file/tweet-asabergny-z4m6gb.jpg": {
    "title": "File:Tweet-asabergny-z4m6gb.jpg",
    "filename": "file_tweet-asabergny-z4m6gb.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-asabergny-z4m6gb.jpg.md"
  },
  "file/tweet-ergblind-iuaoz9.jpg": {
    "title": "File:Tweet-ergblind-iuaoz9.jpg",
    "filename": "file_tweet-ergblind-iuaoz9.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-ergblind-iuaoz9.jpg.md"
  },
  "file/tweet-forseti2k32-10kxdi5.jpg": {
    "title": "File:Tweet-forseti2k32-10kxdi5.jpg",
    "filename": "file_tweet-forseti2k32-10kxdi5.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-forseti2k32-10kxdi5.jpg.md"
  },
  "file/tweet-forseti2k32-13e7n6f.jpg": {
    "title": "File:Tweet-forseti2k32-13e7n6f.jpg",
    "filename": "file_tweet-forseti2k32-13e7n6f.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-forseti2k32-13e7n6f.jpg.md"
  },
  "file/tweet-forseti2k32-15dbwo9.jpg": {
    "title": "File:Tweet-forseti2k32-15dbwo9.jpg",
    "filename": "file_tweet-forseti2k32-15dbwo9.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-forseti2k32-15dbwo9.jpg.md"
  },
  "file/tweet-forseti2k32-16pta00.jpg": {
    "title": "File:Tweet-forseti2k32-16pta00.jpg",
    "filename": "file_tweet-forseti2k32-16pta00.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-forseti2k32-16pta00.jpg.md"
  },
  "file/tweet-forseti2k32-1lavjxo.jpg": {
    "title": "File:Tweet-forseti2k32-1lavjxo.jpg",
    "filename": "file_tweet-forseti2k32-1lavjxo.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-forseti2k32-1lavjxo.jpg.md"
  },
  "file/tweet-forseti2k32-1nswadf.jpg": {
    "title": "File:Tweet-forseti2k32-1nswadf.jpg",
    "filename": "file_tweet-forseti2k32-1nswadf.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-forseti2k32-1nswadf.jpg.md"
  },
  "file/tweet-forseti2k32-1rhck2j.jpg": {
    "title": "File:Tweet-forseti2k32-1rhck2j.jpg",
    "filename": "file_tweet-forseti2k32-1rhck2j.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-forseti2k32-1rhck2j.jpg.md"
  },
  "file/tweet-forseti2k32-gvu44k.jpg": {
    "title": "File:Tweet-forseti2k32-gvu44k.jpg",
    "filename": "file_tweet-forseti2k32-gvu44k.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-forseti2k32-gvu44k.jpg.md"
  },
  "file/tweet-forseti2k32-ulgig.jpg": {
    "title": "File:Tweet-forseti2k32-ulgig.jpg",
    "filename": "file_tweet-forseti2k32-ulgig.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-forseti2k32-ulgig.jpg.md"
  },
  "file/tweet-kjamanden-eksufw.jpg": {
    "title": "File:Tweet-kjamanden-eksufw.jpg",
    "filename": "file_tweet-kjamanden-eksufw.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-kjamanden-eksufw.jpg.md"
  },
  "file/tweet-kristnihald-1dgxkmm.jpg": {
    "title": "File:Tweet-kristnihald-1dgxkmm.jpg",
    "filename": "file_tweet-kristnihald-1dgxkmm.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-kristnihald-1dgxkmm.jpg.md"
  },
  "file/tweet-kristnihald-1f4drub.jpg": {
    "title": "File:Tweet-kristnihald-1f4drub.jpg",
    "filename": "file_tweet-kristnihald-1f4drub.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-kristnihald-1f4drub.jpg.md"
  },
  "file/tweet-kristnihald-1qz4vo8.jpg": {
    "title": "File:Tweet-kristnihald-1qz4vo8.jpg",
    "filename": "file_tweet-kristnihald-1qz4vo8.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-kristnihald-1qz4vo8.jpg.md"
  },
  "file/tweet-krolafs-1g6gtyg.jpg": {
    "title": "File:Tweet-krolafs-1g6gtyg.jpg",
    "filename": "file_tweet-krolafs-1g6gtyg.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-krolafs-1g6gtyg.jpg.md"
  },
  "file/tweet-krolafs-1uzoc2j.jpg": {
    "title": "File:Tweet-krolafs-1uzoc2j.jpg",
    "filename": "file_tweet-krolafs-1uzoc2j.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-krolafs-1uzoc2j.jpg.md"
  },
  "file/tweet-krolafs-1v8hi11.jpg": {
    "title": "File:Tweet-krolafs-1v8hi11.jpg",
    "filename": "file_tweet-krolafs-1v8hi11.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-krolafs-1v8hi11.jpg.md"
  },
  "file/tweet-krolafs-8b1yj6.jpg": {
    "title": "File:Tweet-krolafs-8b1yj6.jpg",
    "filename": "file_tweet-krolafs-8b1yj6.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-krolafs-8b1yj6.jpg.md"
  },
  "file/tweet-krolafs-qvk4l4.jpg": {
    "title": "File:Tweet-krolafs-qvk4l4.jpg",
    "filename": "file_tweet-krolafs-qvk4l4.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-krolafs-qvk4l4.jpg.md"
  },
  "file/tweet-krolafs-rffuii.jpg": {
    "title": "File:Tweet-krolafs-rffuii.jpg",
    "filename": "file_tweet-krolafs-rffuii.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-krolafs-rffuii.jpg.md"
  },
  "file/tweet-krolafs-wlyfer.jpg": {
    "title": "File:Tweet-krolafs-wlyfer.jpg",
    "filename": "file_tweet-krolafs-wlyfer.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-krolafs-wlyfer.jpg.md"
  },
  "file/tweet-rannveigdora-1117o9p.jpg": {
    "title": "File:Tweet-rannveigdora-1117o9p.jpg",
    "filename": "file_tweet-rannveigdora-1117o9p.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-rannveigdora-1117o9p.jpg.md"
  },
  "file/tweet-rannveigdora-1iniw6b.jpg": {
    "title": "File:Tweet-rannveigdora-1iniw6b.jpg",
    "filename": "file_tweet-rannveigdora-1iniw6b.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-rannveigdora-1iniw6b.jpg.md"
  },
  "file/tweet-rannveigdora-1jbr676.jpg": {
    "title": "File:Tweet-rannveigdora-1jbr676.jpg",
    "filename": "file_tweet-rannveigdora-1jbr676.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-rannveigdora-1jbr676.jpg.md"
  },
  "file/tweet-skvisumus-14rupeh.png": {
    "title": "File:Tweet-skvisumus-14rupeh.png",
    "filename": "file_tweet-skvisumus-14rupeh.png",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/twitter/Tweet-skvisumus-14rupeh.png.md"
  },
  "file/anders-nord-t8jbijqx4ee-unsplash.jpg": {
    "title": "File:Anders-nord-t8jBiJQx4eE-unsplash.jpg",
    "filename": "file_anders-nord-t8jbijqx4ee-unsplash.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/unsplash/Anders-nord-t8jBiJQx4eE-unsplash.jpg.md"
  },
  "file/andrew-maranta-b4pqbeechjc-unsplash.jpg": {
    "title": "File:Andrew-maranta-b4PQbeEChjc-unsplash.jpg",
    "filename": "file_andrew-maranta-b4pqbeechjc-unsplash.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/unsplash/Andrew-maranta-b4PQbeEChjc-unsplash.jpg.md"
  },
  "file/artyom-kabajev-gof5rru1epu-unsplash.jpg": {
    "title": "File:Artyom-kabajev-gOF5rrU1EpU-unsplash.jpg",
    "filename": "file_artyom-kabajev-gof5rru1epu-unsplash.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/unsplash/Artyom-kabajev-gOF5rrU1EpU-unsplash.jpg.md"
  },
  "file/bláa-lónið.jpg": {
    "title": "File:Bláa_lónið.jpg",
    "filename": "file_bláa-lónið.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/unsplash/Bláa_lónið.jpg.md"
  },
  "file/börn-svarthvít.jpg": {
    "title": "File:Börn_svarthvít.jpg",
    "filename": "file_börn-svarthvít.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/unsplash/Börn_svarthvít.jpg.md"
  },
  "file/fezbot2000-9ps66aoqerk-unsplash.jpg": {
    "title": "File:Fezbot2000-9ps66aOQERk-unsplash.jpg",
    "filename": "file_fezbot2000-9ps66aoqerk-unsplash.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/unsplash/Fezbot2000-9ps66aOQERk-unsplash.jpg.md"
  },
  "file/jonatan-pie-oagayc1eh10-unsplash.jpg": {
    "title": "File:Jonatan-pie-OagAyc1Eh10-unsplash.jpg",
    "filename": "file_jonatan-pie-oagayc1eh10-unsplash.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/unsplash/Jonatan-pie-OagAyc1Eh10-unsplash.jpg.md"
  },
  "file/khamkeo-vilaysing-tahzkepgkl4-unsplash.jpg": {
    "title": "File:Khamkeo-vilaysing-TahzKepGKL4-unsplash.jpg",
    "filename": "file_khamkeo-vilaysing-tahzkepgkl4-unsplash.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/unsplash/Khamkeo-vilaysing-TahzKepGKL4-unsplash.jpg.md"
  },
  "file/reykjavík-um-vetur.jpg": {
    "title": "File:Reykjavík_um_vetur.jpg",
    "filename": "file_reykjavík-um-vetur.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/unsplash/Reykjavík_um_vetur.jpg.md"
  },
  "file/ursula-drake-1ovcneq6zhq-unsplash.jpg": {
    "title": "File:Ursula-drake-1OVcNeq6ZHQ-unsplash.jpg",
    "filename": "file_ursula-drake-1ovcneq6zhq-unsplash.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/unsplash/Ursula-drake-1OVcNeq6ZHQ-unsplash.jpg.md"
  },
  "file/þreyttur-hundur.jpg": {
    "title": "File:Þreyttur_hundur.jpg",
    "filename": "file_þreyttur-hundur.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Þreyttur_hundur.jpg.md"
  },
  "file/þúfa---ólöf.jpg": {
    "title": "File:Þúfa_-_Ólöf.jpg",
    "filename": "file_þúfa---ólöf.jpg",
    "file": "/Users/egill/ylhyra_content/not_data/files/images/Þúfa_-_Ólöf.jpg.md"
  },
  "file/blær-–-lunga-14897.webm": {
    "title": "File:Blær_–_Lunga_14897.webm",
    "filename": "file_blær-–-lunga-14897.webm",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Blær_–_Lunga_14897.webm.md"
  },
  "file/blær-–-lunga-24685.mp4": {
    "title": "File:Blær_–_Lunga_24685.mp4",
    "filename": "file_blær-–-lunga-24685.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Blær_–_Lunga_24685.mp4.md"
  },
  "file/blær-–-lunga-42799.mp4": {
    "title": "File:Blær_–_Lunga_42799.mp4",
    "filename": "file_blær-–-lunga-42799.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Blær_–_Lunga_42799.mp4.md"
  },
  "file/blær-–-lunga-85026.mp4": {
    "title": "File:Blær_–_Lunga_85026.mp4",
    "filename": "file_blær-–-lunga-85026.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Blær_–_Lunga_85026.mp4.md"
  },
  "file/blær-–-lunga-86080.webm": {
    "title": "File:Blær_–_Lunga_86080.webm",
    "filename": "file_blær-–-lunga-86080.webm",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Blær_–_Lunga_86080.webm.md"
  },
  "file/blær-–-lunga-94064.webm": {
    "title": "File:Blær_–_Lunga_94064.webm",
    "filename": "file_blær-–-lunga-94064.webm",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Blær_–_Lunga_94064.webm.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-21753.mp4": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_21753.mp4",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-21753.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Blær_–_Vinkonur_vors_og_blóma_21753.mp4.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-28901.webm": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_28901.webm",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-28901.webm",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Blær_–_Vinkonur_vors_og_blóma_28901.webm.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-33535.mp4": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_33535.mp4",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-33535.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Blær_–_Vinkonur_vors_og_blóma_33535.mp4.md"
  },
  "file/blær-–-vinkonur-vors-og-blóma-4933.webm": {
    "title": "File:Blær_–_Vinkonur_vors_og_blóma_4933.webm",
    "filename": "file_blær-–-vinkonur-vors-og-blóma-4933.webm",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Blær_–_Vinkonur_vors_og_blóma_4933.webm.md"
  },
  "file/video-by-villineto-bm1qnh2jnci.mp4": {
    "title": "File:Video_by_villineto-Bm1QnH2jnci.mp4",
    "filename": "file_video-by-villineto-bm1qnh2jnci.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Video_by_villineto-Bm1QnH2jnci.mp4.md"
  },
  "file/video-by-villineto-bm510y-hudd.mp4": {
    "title": "File:Video_by_villineto-Bm510Y-HUDD.mp4",
    "filename": "file_video-by-villineto-bm510y-hudd.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Video_by_villineto-Bm510Y-HUDD.mp4.md"
  },
  "file/video-by-villineto-bmmcduvffq-.mp4": {
    "title": "File:Video_by_villineto-BmMCdUVFfQ_.mp4",
    "filename": "file_video-by-villineto-bmmcduvffq-.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Video_by_villineto-BmMCdUVFfQ_.mp4.md"
  },
  "file/video-by-villineto-boubrxviuaq.mp4": {
    "title": "File:Video_by_villineto-BoUBRXViuAQ.mp4",
    "filename": "file_video-by-villineto-boubrxviuaq.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Video_by_villineto-BoUBRXViuAQ.mp4.md"
  },
  "file/video-by-villineto-bru4gz7gsy7.mp4": {
    "title": "File:Video_by_villineto-Bru4gz7gSY7.mp4",
    "filename": "file_video-by-villineto-bru4gz7gsy7.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Video_by_villineto-Bru4gz7gSY7.mp4.md"
  },
  "file/video-by-villineto-btg9s6mg3mc.mp4": {
    "title": "File:Video_by_villineto-BtG9s6mg3Mc.mp4",
    "filename": "file_video-by-villineto-btg9s6mg3mc.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Video_by_villineto-BtG9s6mg3Mc.mp4.md"
  },
  "file/villi-neto-–-forníslenski-sjomlinn.mp4": {
    "title": "File:Villi_Neto_–_Forníslenski_sjomlinn.mp4",
    "filename": "file_villi-neto-–-forníslenski-sjomlinn.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Villi_Neto_–_Forníslenski_sjomlinn.mp4.md"
  },
  "file/villi-neto-–-kaffi.mp4": {
    "title": "File:Villi_Neto_–_Kaffi.mp4",
    "filename": "file_villi-neto-–-kaffi.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Villi_Neto_–_Kaffi.mp4.md"
  },
  "file/villi-neto-–-lýsi.mp4": {
    "title": "File:Villi_Neto_–_Lýsi.mp4",
    "filename": "file_villi-neto-–-lýsi.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Villi_Neto_–_Lýsi.mp4.md"
  },
  "file/villinetolýsi.mp4": {
    "redirect_to": "file/villi-neto-–-lýsi.mp4"
  },
  "file/villi-neto-–-reiður-á-innsoginu.mp4": {
    "title": "File:Villi_Neto_–_Reiður_á_innsoginu.mp4",
    "filename": "file_villi-neto-–-reiður-á-innsoginu.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Villi_Neto_–_Reiður_á_innsoginu.mp4.md"
  },
  "file/villi-neto-–-íslendingar-í-sólarlöndum.mp4": {
    "title": "File:Villi_Neto_–_Íslendingar_í_sólarlöndum.mp4",
    "filename": "file_villi-neto-–-íslendingar-í-sólarlöndum.mp4",
    "file": "/Users/egill/ylhyra_content/not_data/files/video/Villi_Neto_–_Íslendingar_í_sólarlöndum.mp4.md"
  },
  "about": {
    "title": "About",
    "filename": "about",
    "file": "/Users/egill/ylhyra_content/not_data/project/About.md"
  },
  "project/about": {
    "redirect_to": "about"
  },
  "project/collaborate": {
    "title": "Project:Collaborate",
    "filename": "project_collaborate",
    "file": "/Users/egill/ylhyra_content/not_data/project/Collaborate.md"
  },
  "project/become-a-collaborator": {
    "redirect_to": "project/collaborate"
  },
  "project/eliza-reid": {
    "title": "Project:Eliza Reid",
    "filename": "project_eliza-reid",
    "file": "/Users/egill/ylhyra_content/not_data/project/Eliza_Reid.md"
  },
  "project/inflections": {
    "title": "Project:Inflections",
    "filename": "project_inflections",
    "file": "/Users/egill/ylhyra_content/not_data/project/Legal/BÍN.md"
  },
  "project/license": {
    "title": "Project:License",
    "filename": "project_license",
    "file": "/Users/egill/ylhyra_content/not_data/project/Legal/License.md"
  },
  "project/copyrights": {
    "redirect_to": "project/license"
  },
  "project/licence": {
    "redirect_to": "project/license"
  },
  "project/licensing": {
    "redirect_to": "project/license"
  },
  "privacy-policy": {
    "title": "Privacy policy",
    "filename": "privacy-policy",
    "file": "/Users/egill/ylhyra_content/not_data/project/Legal/Privacy_policy.md"
  },
  "project/manual-of-style": {
    "title": "Project:Manual of style",
    "filename": "project_manual-of-style",
    "file": "/Users/egill/ylhyra_content/not_data/project/Manual_of_style.md"
  },
  "project/name": {
    "title": "Project:Name",
    "filename": "project_name",
    "file": "/Users/egill/ylhyra_content/not_data/project/Name.md"
  },
  "project/newest": {
    "title": "Project:Newest",
    "filename": "project_newest",
    "file": "/Users/egill/ylhyra_content/not_data/project/Newest_articles.md"
  },
  "project/newsletter/1": {
    "title": "Project:Newsletter/1",
    "filename": "project_newsletter_1",
    "file": "/Users/egill/ylhyra_content/not_data/project/Newsletter/1.md"
  },
  "project/newsletter/2": {
    "title": "Project:Newsletter/2",
    "filename": "project_newsletter_2",
    "file": "/Users/egill/ylhyra_content/not_data/project/Newsletter/2.md"
  },
  "project/newsletter/3": {
    "title": "Project:Newsletter/3",
    "filename": "project_newsletter_3",
    "file": "/Users/egill/ylhyra_content/not_data/project/Newsletter/3.md"
  },
  "project/newsletter/4": {
    "title": "Project:Newsletter/4",
    "filename": "project_newsletter_4",
    "file": "/Users/egill/ylhyra_content/not_data/project/Newsletter/4.md"
  },
  "project/newsletter": {
    "title": "Project:Newsletter",
    "filename": "project_newsletter",
    "file": "/Users/egill/ylhyra_content/not_data/project/Newsletter/Newsletter.md"
  },
  "project/subscribe": {
    "title": "Project:Subscribe",
    "filename": "project_subscribe",
    "file": "/Users/egill/ylhyra_content/not_data/project/Newsletter/Subscribe.md"
  },
  "project/poster": {
    "title": "Project:Poster",
    "filename": "project_poster",
    "file": "/Users/egill/ylhyra_content/not_data/project/Poster.md"
  },
  "project/software-work-in-progess": {
    "title": "Project:Software work in progess",
    "filename": "project_software-work-in-progess",
    "file": "/Users/egill/ylhyra_content/not_data/project/Software/Software_work_in_progess.md"
  },
  "project/software-work-in-progess/útlit": {
    "title": "Project:Software work in progess/Útlit",
    "filename": "project_software-work-in-progess_útlit",
    "file": "/Users/egill/ylhyra_content/not_data/project/Software/Útlit.md"
  },
  "vocabulary/tutorial": {
    "title": "Vocabulary/Tutorial",
    "filename": "vocabulary_tutorial",
    "file": "/Users/egill/ylhyra_content/not_data/project/Vocabulary/Tutorial.md"
  },
  "template/anchor": {
    "title": "Template:Anchor",
    "filename": "template_anchor",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Anchor.md"
  },
  "template/audio": {
    "title": "Template:Audio",
    "filename": "template_audio",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Audio.md"
  },
  "template/back": {
    "title": "Template:Back",
    "filename": "template_back",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Back.md"
  },
  "template/box": {
    "title": "Template:Box",
    "filename": "template_box",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Box.md"
  },
  "template/bulleted-list": {
    "title": "Template:Bulleted list",
    "filename": "template_bulleted-list",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Bulleted_list.md"
  },
  "template/button": {
    "title": "Template:Button",
    "filename": "template_button",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Button.md"
  },
  "template/c": {
    "title": "Template:C",
    "filename": "template_c",
    "file": "/Users/egill/ylhyra_content/not_data/templates/C.md"
  },
  "template/center": {
    "title": "Template:Center",
    "filename": "template_center",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Center.md"
  },
  "template/chapter-item": {
    "title": "Template:Chapter item",
    "filename": "template_chapter-item",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Chapter_item.md"
  },
  "template/clear": {
    "title": "Template:Clear",
    "filename": "template_clear",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Clear.md"
  },
  "template/-": {
    "redirect_to": "template/clear"
  },
  "template/code": {
    "title": "Template:Code",
    "filename": "template_code",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Code.md"
  },
  "template/conversation": {
    "title": "Template:Conversation",
    "filename": "template_conversation",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Conversation.md"
  },
  "template/declension-singular": {
    "title": "Template:Declension-singular",
    "filename": "template_declension-singular",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Declension-singular.md"
  },
  "template/declension": {
    "title": "Template:Declension",
    "filename": "template_declension",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Declension.md"
  },
  "template/declension-adjective-singular-all-genders": {
    "title": "Template:Declension adjective singular all genders",
    "filename": "template_declension-adjective-singular-all-genders",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Declension_adjective_singular_all_genders.md"
  },
  "template/declension-adjective-singular-all-genders-nominative": {
    "title": "Template:Declension adjective singular all genders nominative",
    "filename": "template_declension-adjective-singular-all-genders-nominative",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Declension_adjective_singular_all_genders_nominative.md"
  },
  "template/declension-singular-and-plural": {
    "title": "Template:Declension singular and plural",
    "filename": "template_declension-singular-and-plural",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Declension_singular_and_plural.md"
  },
  "template/declension-singular-with-and-without-article": {
    "title": "Template:Declension singular with and without article",
    "filename": "template_declension-singular-with-and-without-article",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Declension_singular_with_and_without_article.md"
  },
  "template/done": {
    "title": "Template:Done",
    "filename": "template_done",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Done.md"
  },
  "template/dot": {
    "title": "Template:Dot",
    "filename": "template_dot",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Dot.md"
  },
  "template/,": {
    "redirect_to": "template/dot"
  },
  "template/drag": {
    "title": "Template:Drag",
    "filename": "template_drag",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Drag.md"
  },
  "template/ef": {
    "title": "Template:Ef",
    "filename": "template_ef",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Ef.md"
  },
  "template/efn": {
    "title": "Template:Efn",
    "filename": "template_efn",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Efn.md"
  },
  "template/end": {
    "title": "Template:End",
    "filename": "template_end",
    "file": "/Users/egill/ylhyra_content/not_data/templates/End.md"
  },
  "template/et": {
    "title": "Template:Et",
    "filename": "template_et",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Et.md"
  },
  "template/front-page-item": {
    "title": "Template:Front page item",
    "filename": "template_front-page-item",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Front_page_item.md"
  },
  "template/frontpage-box": {
    "title": "Template:Frontpage box",
    "filename": "template_frontpage-box",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Frontpage_box.md"
  },
  "template/ft": {
    "title": "Template:Ft",
    "filename": "template_ft",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Ft.md"
  },
  "template/gap": {
    "title": "Template:Gap",
    "filename": "template_gap",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Gap.md"
  },
  "template/gender": {
    "title": "Template:Gender",
    "filename": "template_gender",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Gender.md"
  },
  "template/gray": {
    "title": "Template:Gray",
    "filename": "template_gray",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Gray.md"
  },
  "template/g": {
    "redirect_to": "template/gray"
  },
  "template/h": {
    "title": "Template:H",
    "filename": "template_h",
    "file": "/Users/egill/ylhyra_content/not_data/templates/H.md"
  },
  "template/hvk": {
    "title": "Template:Hvk",
    "filename": "template_hvk",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Hvk.md"
  },
  "template/hk": {
    "redirect_to": "template/hvk"
  },
  "template/ipa": {
    "title": "Template:IPA",
    "filename": "template_ipa",
    "file": "/Users/egill/ylhyra_content/not_data/templates/IPA.md"
  },
  "template/in-progress": {
    "title": "Template:In progress",
    "filename": "template_in-progress",
    "file": "/Users/egill/ylhyra_content/not_data/templates/In_progress.md"
  },
  "template/inflection": {
    "title": "Template:Inflection",
    "filename": "template_inflection",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Inflection.md"
  },
  "template/instagram": {
    "title": "Template:Instagram",
    "filename": "template_instagram",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Instagram.md"
  },
  "template/instructions": {
    "title": "Template:Instructions",
    "filename": "template_instructions",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Instructions.md"
  },
  "template/kk": {
    "title": "Template:Kk",
    "filename": "template_kk",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Kk.md"
  },
  "template/kvk": {
    "title": "Template:Kvk",
    "filename": "template_kvk",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Kvk.md"
  },
  "template/latest-article": {
    "title": "Template:Latest article",
    "filename": "template_latest-article",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Latest_article.md"
  },
  "template/lh-þt": {
    "title": "Template:Lh-þt",
    "filename": "template_lh-þt",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Lh-þt.md"
  },
  "template/line": {
    "title": "Template:Line",
    "filename": "template_line",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Line.md"
  },
  "template/listen": {
    "title": "Template:Listen",
    "filename": "template_listen",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Listen.md"
  },
  "template/mailchimp": {
    "title": "Template:Mailchimp",
    "filename": "template_mailchimp",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Mailchimp.md"
  },
  "template/me": {
    "title": "Template:Me",
    "filename": "template_me",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Me.md"
  },
  "template/2": {
    "redirect_to": "template/me"
  },
  "template/message": {
    "title": "Template:Message",
    "filename": "template_message",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Message.md"
  },
  "text/ylhýra": {
    "title": "Text:Ylhýra",
    "filename": "text_ylhýra",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Nafnið_„Ylhýra“_með_þýðingu.md"
  },
  "template/needs-audio": {
    "title": "Template:Needs audio",
    "filename": "template_needs-audio",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Needs_audio.md"
  },
  "template/newsletter-footer": {
    "title": "Template:Newsletter footer",
    "filename": "template_newsletter-footer",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Newsletter_footer.md"
  },
  "template/newsletter-header": {
    "title": "Template:Newsletter header",
    "filename": "template_newsletter-header",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Newsletter_header.md"
  },
  "template/newsletter-unsubscribe": {
    "title": "Template:Newsletter unsubscribe",
    "filename": "template_newsletter-unsubscribe",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Newsletter_unsubscribe.md"
  },
  "template/next": {
    "title": "Template:Next",
    "filename": "template_next",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Next.md"
  },
  "template/next-simple": {
    "title": "Template:Next simple",
    "filename": "template_next-simple",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Next_simple.md"
  },
  "template/nf": {
    "title": "Template:Nf",
    "filename": "template_nf",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Nf.md"
  },
  "template/nh": {
    "title": "Template:Nh",
    "filename": "template_nh",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Nh.md"
  },
  "template/no-audio": {
    "title": "Template:No audio",
    "filename": "template_no-audio",
    "file": "/Users/egill/ylhyra_content/not_data/templates/No_audio.md"
  },
  "template/nobold": {
    "title": "Template:Nobold",
    "filename": "template_nobold",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Nobold.md"
  },
  "template/not-done": {
    "title": "Template:Not done",
    "filename": "template_not-done",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Not_done.md"
  },
  "template/notelist": {
    "title": "Template:Notelist",
    "filename": "template_notelist",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Notelist.md"
  },
  "template/notes": {
    "title": "Template:Notes",
    "filename": "template_notes",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Notes.md"
  },
  "template/notranslate": {
    "title": "Template:Notranslate",
    "filename": "template_notranslate",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Notranslate.md"
  },
  "template/no-translate": {
    "redirect_to": "template/notranslate"
  },
  "template/noun-declension-patterns": {
    "title": "Template:Noun declension patterns",
    "filename": "template_noun-declension-patterns",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Noun_declension_patterns.md"
  },
  "template/nowrap": {
    "title": "Template:Nowrap",
    "filename": "template_nowrap",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Nowrap.md"
  },
  "template/nt": {
    "title": "Template:Nt",
    "filename": "template_nt",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Nt.md"
  },
  "template/option": {
    "title": "Template:Option",
    "filename": "template_option",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Option.md"
  },
  "template/parts-of-speech": {
    "title": "Template:Parts of speech",
    "filename": "template_parts-of-speech",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Parts_of_speech.md"
  },
  "template/poem": {
    "title": "Template:Poem",
    "filename": "template_poem",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Poem.md"
  },
  "template/random-image": {
    "title": "Template:Random image",
    "filename": "template_random-image",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Random_image.md"
  },
  "template/reading-of": {
    "title": "Template:Reading of",
    "filename": "template_reading-of",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Reading_of.md"
  },
  "template/recommendations/read": {
    "title": "Template:Recommendations/Read",
    "filename": "template_recommendations_read",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Recommendations/Read.md"
  },
  "template/recommendations/study-vocabulary": {
    "title": "Template:Recommendations/Study vocabulary",
    "filename": "template_recommendations_study-vocabulary",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Recommendations/Study_vocabulary.md"
  },
  "template/reflist": {
    "title": "Template:Reflist",
    "filename": "template_reflist",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Reflist.md"
  },
  "template/refn": {
    "title": "Template:Refn",
    "filename": "template_refn",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Refn.md"
  },
  "template/show-code": {
    "title": "Template:Show code",
    "filename": "template_show-code",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Show_code.md"
  },
  "template/small": {
    "title": "Template:Small",
    "filename": "template_small",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Small.md"
  },
  "template/small-hr": {
    "title": "Template:Small hr",
    "filename": "template_small-hr",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Small_hr.md"
  },
  "template/spoken": {
    "title": "Template:Spoken",
    "filename": "template_spoken",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Spoken.md"
  },
  "template/start": {
    "title": "Template:Start",
    "filename": "template_start",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Start.md"
  },
  "template/text-snippet": {
    "title": "Template:Text snippet",
    "filename": "template_text-snippet",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Text_snippet.md"
  },
  "template/snippet": {
    "redirect_to": "template/text-snippet"
  },
  "template/them": {
    "title": "Template:Them",
    "filename": "template_them",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Them.md"
  },
  "template/1": {
    "redirect_to": "template/them"
  },
  "template/tweet": {
    "title": "Template:Tweet",
    "filename": "template_tweet",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Tweet.md"
  },
  "template/verse": {
    "title": "Template:Verse",
    "filename": "template_verse",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Verse.md"
  },
  "template/video": {
    "title": "Template:Video",
    "filename": "template_video",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Video.md"
  },
  "template/video-header": {
    "title": "Template:Video header",
    "filename": "template_video-header",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Video_header.md"
  },
  "template/þf": {
    "title": "Template:Þf",
    "filename": "template_þf",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Þf.md"
  },
  "template/þgf": {
    "title": "Template:Þgf",
    "filename": "template_þgf",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Þgf.md"
  },
  "template/þt": {
    "title": "Template:Þt",
    "filename": "template_þt",
    "file": "/Users/egill/ylhyra_content/not_data/templates/Þt.md"
  },
  "fotografía": {
    "title": "Fotografía",
    "filename": "fotografía",
    "file": "/Users/egill/ylhyra_content/not_data/test/fotografia.md"
  },
  "spænska": {
    "title": "Spænska",
    "filename": "spænska",
    "file": "/Users/egill/ylhyra_content/not_data/test/spænska.md"
  }
};

/***/ }),

/***/ "./src/paths.js":
/*!**********************!*\
  !*** ./src/paths.js ***!
  \**********************/
/*! exports provided: content_folder, output_folder, image_output_folder, contentUrl, processed_image_url, unprocessed_image_url, getDynamicFileUrl, get_processed_image_url, ylhyra_content_files, get_unprocessed_image_url, URL_title, section_id */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "content_folder", function() { return content_folder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "output_folder", function() { return output_folder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "image_output_folder", function() { return image_output_folder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "contentUrl", function() { return contentUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processed_image_url", function() { return processed_image_url; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unprocessed_image_url", function() { return unprocessed_image_url; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDynamicFileUrl", function() { return getDynamicFileUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_processed_image_url", function() { return get_processed_image_url; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ylhyra_content_files", function() { return ylhyra_content_files; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_unprocessed_image_url", function() { return get_unprocessed_image_url; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "URL_title", function() { return URL_title; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "section_id", function() { return section_id; });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);

global.__basedir = path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(__dirname + "/../");
/* Folders */

const content_folder = path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(__basedir, "./../ylhyra_content");
const output_folder = path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(__basedir, "./src/output");
const image_output_folder = path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(output_folder, "./images");
/* File URLs */

const contentUrl = "/api/content";
const processed_image_url = `/api/images`;
const unprocessed_image_url = `/api/images2`;
const getDynamicFileUrl = file => `/api/content?title=file/${encodeURIComponent(file)}`;
const get_processed_image_url = file => `${processed_image_url}/${encodeURIComponent(file)}`;
const ylhyra_content_files = path__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(content_folder, "./not_data/files");
const get_unprocessed_image_url = file => `${unprocessed_image_url}/${encodeURIComponent(file)}`;
/* URL slugs */

const URL_title = title => {
  if (!title) return title;
  return title.toLowerCase().trim().replace(/([_ ])/g, "-") // .replace(/( )/g, '_')
  // .replace(/(#)/g, '_')
  .replace(/(\?)/g, "").replace(/:/g, "/");
  return title;
};
const section_id = title => {
  if (!title) return title;
  return "s-" + URL_title(title).replace(/([^a-z0-9])/g, "-");
};
/* WEBPACK VAR INJECTION */}.call(this, "src"))

/***/ }),

/***/ "./src/server/analytics/index.js":
/*!***************************************!*\
  !*** ./src/server/analytics/index.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var server_database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/database */ "./src/server/database/index.js");
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! shortid */ "shortid");
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(shortid__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! server/database/functions/SQL-template-literal */ "./src/server/database/functions/SQL-template-literal.js");




const router = __webpack_require__(/*! express */ "express").Router(); // var cors = require('cors')
// app.use(cors({
//   origin: 'https://ylhyra.is',
// }))
// app.options('/products/:id', cors()) // enable pre-flight request for DELETE request


router.post("/a", (req, res) => {
  if (!req.session.session_id) {
    req.session.session_id = shortid__WEBPACK_IMPORTED_MODULE_1___default.a.generate();
  }
  /*
    Text interactions
  */


  if (req.body.seen) {
    req.body.seen.forEach(item => {
      Object(server_database__WEBPACK_IMPORTED_MODULE_0__["default"])(`INSERT INTO interactions SET
        user_session = ?,
        page_name = ?,
        item_id = ?,
        item_seen_at = FROM_UNIXTIME(?),
        item_time_seen = ?,
        type = "text"
        `, [req.session.session_id, req.body.pageName, item.id, Math.round(item.seenAt / 1000), // To UNIX time
      item.timeSeen], (err, results) => {
        if (err) {
          console.error(err);
        } else {}
      });
    });
  } else {
    /*
      Page views
    */
    Object(server_database__WEBPACK_IMPORTED_MODULE_0__["default"])(`INSERT INTO interactions SET
      ip = ?,
      browser = ?,
      version = ?,
      os = ?,
      platform = ?,
      is_mobile = ?,
      user_session = ?,
      page_name = ?,
      type = "view",
      country = ?
      `, [req.clientIp, req.useragent.browser, req.useragent.version.split(".")[0], req.useragent.os, req.useragent.platform, req.useragent.isMobile, req.session.session_id, req.body.pageName, req.get("CF-IPCountry")], (err, results) => {
      if (err) {
        console.error(err);
      } else {}
    });
  }

  res.sendStatus(200);
});
/*
  List most popular pages by unique visitors
*/

router.get("/a", (req, res) => {// query(sql`
  //   SELECT
  //     page_name,
  //     SUM(total_views) as total_views,
  //     COUNT(user_session) AS unique_views
  //   FROM interactions AS table1
  //   JOIN  (
  //     SELECT
  //       id,
  //       COUNT(user_session) AS total_views
  //     FROM interactions
  //     WHERE type = "view"
  //     GROUP BY user_session
  //   ) AS table2
  //   ON table1.id = table2.id
  //   WHERE type = "view"
  //   GROUP BY page_name
  //   ORDER BY unique_views DESC
  //   LIMIT 20;
  // `, (err, results) => {
  //   if (err) {
  //     console.error(err)
  //     res.sendStatus(500)
  //   } else {
  //     res.send(results)
  //   }
  // })
});
/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./src/server/compiler/generate_links.js":
/*!***********************************************!*\
  !*** ./src/server/compiler/generate_links.js ***!
  \***********************************************/
/*! exports provided: FileSafeTitle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileSafeTitle", function() { return FileSafeTitle; });
/* harmony import */ var app_App_functions_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/hash */ "./src/app/App/functions/hash.js");
/* harmony import */ var server_content__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! server/content */ "./src/server/content/index.js");
/* harmony import */ var app_App_functions_RemoveUnwantedCharacters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/App/functions/RemoveUnwantedCharacters */ "./src/app/App/functions/RemoveUnwantedCharacters.js");
/* harmony import */ var paths_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! paths.js */ "./src/paths.js");
/*
node build/ylhyra_server.js --compile-content
*/
// import urlSlug from 'src/app/App/functions/url-slug'





var fs = __webpack_require__(/*! fs */ "fs");

const path = __webpack_require__(/*! path */ "path");

let files = [];
const links = {}; // fs.mkdirSync(output_folder)

const run = () => {
  getFilesRecursively(paths_js__WEBPACK_IMPORTED_MODULE_3__["content_folder"]);

  for (const file in files) {
    if (typeof files[file] !== "string") continue;
    let data = fs.readFileSync(files[file], "utf8");
    data = Object(app_App_functions_RemoveUnwantedCharacters__WEBPACK_IMPORTED_MODULE_2__["default"])(data);
    let {
      header,
      body
    } = Object(server_content__WEBPACK_IMPORTED_MODULE_1__["ParseHeaderAndBody"])(data);
    const filename = FileSafeTitle(header.title); //+ '_' + string_hash(body)

    if (Object(paths_js__WEBPACK_IMPORTED_MODULE_3__["URL_title"])(header.title) in links) {
      throw new Error(`"${header.title}" already exists`);
    }

    links[Object(paths_js__WEBPACK_IMPORTED_MODULE_3__["URL_title"])(header.title)] = {
      title: header.title,
      filename,
      file: files[file]
    };
    header.redirects && header.redirects.forEach(r => {
      if (!r) {
        console.log(files[file]);
      }

      const [r_title, r_section] = r.split("#");
      if (links[Object(paths_js__WEBPACK_IMPORTED_MODULE_3__["URL_title"])(r_title)]) return; // console.log({r_title})

      links[Object(paths_js__WEBPACK_IMPORTED_MODULE_3__["URL_title"])(r_title)] = {
        redirect_to: Object(paths_js__WEBPACK_IMPORTED_MODULE_3__["URL_title"])(header.title),
        section: r_section && Object(paths_js__WEBPACK_IMPORTED_MODULE_3__["URL_title"])(r_section)
      };
    }); // // console.log(data)
    // fs.writeFileSync(output_folder + `${filename}.html`, body)
    // break;
  } // console.log(done);

  /* Write links */


  fs.writeFileSync("src/output/links.js", `module.exports = ` + JSON.stringify(links, null, 2));
  process.exit();
};

const FileSafeTitle = title => {
  return Object(paths_js__WEBPACK_IMPORTED_MODULE_3__["URL_title"])(title).replace(/(\/)/g, "_").replace(/(:)/g, "_");
}; // https://stackoverflow.com/a/66187152 CC BY-SA 4.0

const getFilesRecursively = directory => {
  const filesInDirectory = fs.readdirSync(directory);

  for (const file of filesInDirectory) {
    if (file.startsWith(".")) continue;
    const absolute = path.join(directory, file);

    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute);
    } else {
      if (!file.endsWith(".md")) continue;
      files.push(absolute);
    }
  }
};

run();

/***/ }),

/***/ "./src/server/content/index.js":
/*!*************************************!*\
  !*** ./src/server/content/index.js ***!
  \*************************************/
/*! exports provided: default, ParseHeaderAndBody */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParseHeaderAndBody", function() { return ParseHeaderAndBody; });
/* harmony import */ var documents_Compile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! documents/Compile */ "./src/documents/Compile/index.js");
/* harmony import */ var paths_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! paths.js */ "./src/paths.js");



const router = __webpack_require__(/*! express */ "express").Router();

var fs = __webpack_require__(/*! fs */ "fs");

let links = __webpack_require__(/*! src/output/links.js */ "./src/output/links.js");

const yaml = __webpack_require__(/*! js-yaml */ "js-yaml");

router.get("/content", async (req, res) => {
  let url = Object(paths_js__WEBPACK_IMPORTED_MODULE_1__["URL_title"])(req.query.title);
  let values = links[url];

  if (values) {
    let output = {};
    let title = values.title;
    let file = values.file;

    if (values.redirect_to) {
      url = values.redirect_to;
      file = values.file;
      title = links[values.redirect_to].title;
      output.redirect_to = values.redirect_to;
      output.section = values.section;
    } else if (req.query.title !== url) {
      output.redirect_to = url;
    }

    title = title.split(/[/:]/g).reverse().join("\u2006•\u200A");

    if (url.startsWith("file/")) {
      res.sendfile(file.replace(/(\.[a-z]+)$/i, "")); // res.sendfile(file)
    } else {
      // console.log(info)
      const {
        content,
        header
      } = await Object(documents_Compile__WEBPACK_IMPORTED_MODULE_0__["default"])(url);

      if ("html" in req.query) {
        return res.send(content);
      }

      res.send({ ...output,
        content,
        title,
        header
      });
    }
  } else {
    return res.sendStatus(404);
  }
});
/* harmony default export */ __webpack_exports__["default"] = (router);
const ParseHeaderAndBody = data => {
  const match = data.trim().match(/^---\n([\s\S]+?)\n---([\s\S]+)?/);

  if (!match) {
    throw new Error("Failed to parse\n\n" + data);
    return;
  }

  let [j, header, body] = match;
  let output = {}; // header = header.replace(/: (.+):/g, ': $1\\:')

  header = yaml.load(header);
  body = (body || "").trim();

  if (!header.title && header.title !== "") {
    throw new Error("Missing title\n\n" + data);
    return;
  }

  return {
    header,
    body
  };
};

/***/ }),

/***/ "./src/server/content/prerender.js":
/*!*****************************************!*\
  !*** ./src/server/content/prerender.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/server */ "react-dom/server");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var paths_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! paths.js */ "./src/paths.js");
/* harmony import */ var documents_Compile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! documents/Compile */ "./src/documents/Compile/index.js");
/* harmony import */ var documents_Parse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! documents/Parse */ "./src/documents/Parse/index.js");
/* harmony import */ var app_Router_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/Router/actions */ "./src/app/Router/actions.js");
/* harmony import */ var documents_Render__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! documents/Render */ "./src/documents/Render/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var app_App_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/App/store */ "./src/app/App/store.js");
/* harmony import */ var app_Router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/Router */ "./src/app/Router/index.js");
 // import Render from 'frontend/Render'











const router = __webpack_require__(/*! express */ "express").Router();

var now = __webpack_require__(/*! performance-now */ "performance-now");

var fs = __webpack_require__(/*! fs */ "fs");

const path = __webpack_require__(/*! path */ "path");

const critical = __webpack_require__(/*! critical */ "critical");

const header_links = `
  <link href="/main.css" rel="stylesheet" />
  <script src="/ylhyra.js"></script>
`;
const css = fs.readFileSync(path.resolve(paths_js__WEBPACK_IMPORTED_MODULE_2__["output_folder"], `./css.css`), "utf8");
const html = fs.readFileSync(path.resolve(__basedir, `./public/index.html`), "utf8");

const render = async title => {
  const {
    content,
    header
  } = await Object(documents_Compile__WEBPACK_IMPORTED_MODULE_3__["default"])(title);
  const out = await Object(documents_Parse__WEBPACK_IMPORTED_MODULE_4__["default"])({
    html: content
  });
  const {
    parsed,
    tokenized,
    data,
    flattenedData
  } = out; // let output = ReactDOMServer.renderToStaticMarkup(Render({ json: parsed }));

  let output = react_dom_server__WEBPACK_IMPORTED_MODULE_1___default.a.renderToStaticMarkup( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_redux__WEBPACK_IMPORTED_MODULE_7__["Provider"], {
    store: app_App_store__WEBPACK_IMPORTED_MODULE_8__["default"]
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(app_Router__WEBPACK_IMPORTED_MODULE_9__["default"], {
    prerender: parsed
  })));
  output += `<script type="text/javascript">window.ylhyra_data=${JSON.stringify({
    parsedHTML: react_dom_server__WEBPACK_IMPORTED_MODULE_1___default.a.renderToStaticMarkup(parsed),
    tokenized,
    data,
    flattenedData
  })}</script>`;
  output = html.replace("<!-- Title -->", header.title ? header.title + " - " : "").replace("<!-- Header items -->", header_links).replace("<!-- Content -->", output);
  fs.writeFileSync(path.resolve(paths_js__WEBPACK_IMPORTED_MODULE_2__["output_folder"], `./${title}.html`), output);
  /* Inline CSS */

  critical.generate({
    base: paths_js__WEBPACK_IMPORTED_MODULE_2__["output_folder"],
    src: `${title}.html`,
    width: 1300,
    height: 9000,
    inline: true
  }, (err, cr_output
  /* Includes {css, html, uncritical} */
  ) => {
    if (err) console.log(err);
    fs.writeFileSync(path.resolve(paths_js__WEBPACK_IMPORTED_MODULE_2__["output_folder"], `./${title}2.html`), cr_output.html);
    process.exit();
  });
};

render("lúpína");

/***/ }),

/***/ "./src/server/database/functions/SQL-template-literal.js":
/*!***************************************************************!*\
  !*** ./src/server/database/functions/SQL-template-literal.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sqlstring__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sqlstring */ "sqlstring");
/* harmony import */ var sqlstring__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sqlstring__WEBPACK_IMPORTED_MODULE_0__);

/*
  Uses tagged template literals to escape strings for SQL.
  > sql`SELECT ${X} FROM ${Y}` becomes `SELECT ${escape(X)} FROM ${escape(Y)}`
  See: https://mxstbr.blog/2016/11/styled-components-magic-explained/
*/

/* harmony default export */ __webpack_exports__["default"] = ((strings, ...values) => strings.map((string, index) => {
  let value = values[index];

  if (value === "") {} else if (values[index] === null) {
    value = null;
  } else if (value === false) {
    value = 0;
  } else if (!value) {
    value = ""; // ?
  }

  if (index !== strings.length - 1) {
    value = Object(sqlstring__WEBPACK_IMPORTED_MODULE_0__["escape"])(value);
  }

  return string.replace(/--.+?\n/g, "\n")
  /*Removing comments*/
  + value;
}).join("")); // export default (strings, ...values) => {
//   return strings
//     .map((string, index) => {
//       const value = values[index] || ''
//       // const shouldEscape = value.dontEscape || false
//       return string + escape(values[index] || '')
//     })
//     .join('')
// }
//
// // export const dontEscape = (input) => {
// //   return {
// //     dontEscape: true,
// //     input: input,
// //   }
// // }

/***/ }),

/***/ "./src/server/database/functions/connection.js":
/*!*****************************************************!*\
  !*** ./src/server/database/functions/connection.js ***!
  \*****************************************************/
/*! exports provided: Pool, Query */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pool", function() { return Pool; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Query", function() { return Query; });
/* harmony import */ var mysql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mysql */ "mysql");
/* harmony import */ var mysql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mysql__WEBPACK_IMPORTED_MODULE_0__);

const Pool = ({
  database,
  user,
  password
}) => mysql__WEBPACK_IMPORTED_MODULE_0___default.a.createPool({
  database,
  user,
  password,
  connectionLimit: 10,
  host: "localhost",
  debug: false,
  multipleStatements: true,
  charset: "utf8mb4_general_ci"
});
const Query = (query, secondParameter, thirdParameter, pool) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);

      if (Array.isArray(secondParameter)) {
        thirdParameter(err);
      } else {
        secondParameter(err);
      }

      return;
    }

    let callback;

    if (Array.isArray(secondParameter)) {
      callback = thirdParameter;
      connection.query(query, secondParameter, returns);
    } else {
      callback = secondParameter;
      connection.query(query, returns);
    }

    function returns(err, results) {
      connection.release();

      if (!err) {
        callback(false, results);
      } else {
        console.error(err);
        callback(err);
      }
    }
  });
};

/***/ }),

/***/ "./src/server/database/index.js":
/*!**************************************!*\
  !*** ./src/server/database/index.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var server_database_functions_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/database/functions/connection */ "./src/server/database/functions/connection.js");


__webpack_require__(/*! dotenv */ "dotenv").config();

const pool = Object(server_database_functions_connection__WEBPACK_IMPORTED_MODULE_0__["Pool"])({
  database: "ylhyra",
  user: process.env.YLHYRA_DATABASE_USER || "example_user",
  password: process.env.YLHYRA_DATABASE_PASSWORD || "example_password"
});
/* harmony default export */ __webpack_exports__["default"] = ((query, secondParameter, thirdParameter) => Object(server_database_functions_connection__WEBPACK_IMPORTED_MODULE_0__["Query"])(query, secondParameter, thirdParameter, pool));

/***/ }),

/***/ "./src/server/index.js":
/*!*****************************!*\
  !*** ./src/server/index.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var core_js_stable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/stable */ "core-js/stable");
/* harmony import */ var core_js_stable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_stable__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! regenerator-runtime/runtime */ "regenerator-runtime/runtime");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logger */ "./src/server/logger.js");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var minimist__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! minimist */ "minimist");
/* harmony import */ var minimist__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(minimist__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./database */ "./src/server/database/index.js");
/* harmony import */ var request_ip__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! request-ip */ "request-ip");
/* harmony import */ var request_ip__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(request_ip__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var paths_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! paths.js */ "./src/paths.js");
// import 'source-map-support/register'











__webpack_require__(/*! source-map-support */ "source-map-support").install();

__webpack_require__(/*! dotenv */ "dotenv").config({
  path: "./../.env"
});

const argv = minimist__WEBPACK_IMPORTED_MODULE_5___default()(process.argv.slice(2));
const app = express__WEBPACK_IMPORTED_MODULE_2___default()();

__webpack_require__(/*! express-ws */ "express-ws")(app); // export const upload_path = path.resolve(__dirname, './../../uploads')
// export const image_path = path.resolve(__dirname, './../output/images')


var cors = __webpack_require__(/*! cors */ "cors");

app.use(body_parser__WEBPACK_IMPORTED_MODULE_4___default.a.json({
  limit: "5mb"
}));
app.use(body_parser__WEBPACK_IMPORTED_MODULE_4___default.a.urlencoded({
  limit: "5mb",
  extended: true
}));
app.use(request_ip__WEBPACK_IMPORTED_MODULE_7___default.a.mw());
app.use(__webpack_require__(/*! express-useragent */ "express-useragent").express());
app.use(__webpack_require__(/*! cookie-session */ "cookie-session")({
  name: "y",
  keys: [process.env.COOKIE_SECRET || "secret"],
  // secure: true,
  secure: false,
  httpOnly: false,
  maxAge: 5 * 365 * 24 * 60 * 60 * 1000 // 5 years

}));

if (!process.env.COOKIE_SECRET) {
  console.warn("Missing COOKIE_SECRET");
}
/* Set Unicode header on all responses */


app.use(function (req, res, next) {
  res.setHeader("charset", "utf-8");
  next();
}); // TODO Þetta er til bráðabirgða og á að gerast í gagnagrunninum sjálfum, t.d. með "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));"

Object(_database__WEBPACK_IMPORTED_MODULE_6__["default"])(`SET sql_mode = ''`, () => {});
setTimeout(() => {
  Object(_database__WEBPACK_IMPORTED_MODULE_6__["default"])(`SET sql_mode = ''`, () => {});
}, 10000);
/*
  Private APIs
*/

app.use(cors({
  origin: "https://ylhyra.is"
})); // app.use('/api', require('server/web-socket').default)
// app.use('/api', require('server/server-side-rendering').default)
// app.use('/api', require('server/audio/recorder').default)
// app.use('/api', require('server/audio/GetOneAudioFile').default)
// app.use('/api', require('server/audio/Synchronize').default)
// app.use('/api', require('server/translator/save').default)

app.use("/api", __webpack_require__(/*! server/analytics */ "./src/server/analytics/index.js").default);
app.use("/api", __webpack_require__(/*! server/user */ "./src/server/user/index.js").default);
app.use("/api", __webpack_require__(/*! server/content */ "./src/server/content/index.js").default);
app.use("/api", __webpack_require__(/*! server/vocabulary/get */ "./src/server/vocabulary/get.js").default);
app.use("/api", __webpack_require__(/*! server/vocabulary/save */ "./src/server/vocabulary/save.js").default); // // app.use('/api', require('server/tweets').default)
// // app.use('/api', require('server/audio').default)
// // app.use('/api', require('server/translator/Google').default)
// // app.use('/api', require('server/api/audio/Upload').default)
// app.use('/api/temp_files/', express.static(upload_path))

app.use(paths_js__WEBPACK_IMPORTED_MODULE_9__["processed_image_url"], express__WEBPACK_IMPORTED_MODULE_2___default.a.static(paths_js__WEBPACK_IMPORTED_MODULE_9__["image_output_folder"]));
app.use(paths_js__WEBPACK_IMPORTED_MODULE_9__["unprocessed_image_url"], express__WEBPACK_IMPORTED_MODULE_2___default.a.static(paths_js__WEBPACK_IMPORTED_MODULE_9__["ylhyra_content_files"]));
/*
  Public APIs
*/

app.use(cors({
  origin: "*"
}));
app.set("json spaces", 2);

const router = __webpack_require__(/*! express */ "express").Router();

router.get(["/robots.txt", "/favicon.ico", "/sitemap.xml"], (req, res) => {
  res.send("");
});
app.use("/", router);
/*
  When running on subdomains,
  serve up inflections.
  If other services are needed later, go by "request.headers.host"
*/

app.use("/inflection_styles", express__WEBPACK_IMPORTED_MODULE_2___default.a.static(path__WEBPACK_IMPORTED_MODULE_8___default.a.join(__dirname, "/inflection/styles")));
app.use("/", __webpack_require__(/*! server/inflection/server/server-with-database/route_loader */ "./src/server/inflection/server/server-with-database/route_loader.js").default); // get the intended host and port number, use localhost and port 3000 if not provided

const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host

const prettyHost = customHost || "localhost";
const port = argv.port || 9123;
/* Import steps */

if (process.argv[2] === "--compile-content") {
  __webpack_require__(/*! server/compiler/generate_links.js */ "./src/server/compiler/generate_links.js");
} else if (process.argv[2] === "--prerender") {
  __webpack_require__(/*! server/content/prerender.js */ "./src/server/content/prerender.js");
} else if (process.argv[2] === "--import-inflections") {
  __webpack_require__(/*! server/inflection/server/server-with-database/database/ImportToDatabase.js */ "./src/server/inflection/server/server-with-database/database/ImportToDatabase.js");
} else if (process.argv[2] === "--generate-search-index") {
  __webpack_require__(/*! server/inflection/server/server-with-database/database/generateSearchIndex.js */ "./src/server/inflection/server/server-with-database/database/generateSearchIndex.js");
} else if (process.argv[2] === "--import-vocabulary") {
  __webpack_require__(/*! server/vocabulary/setup/setup */ "./src/server/vocabulary/setup/setup.js");
} else {
  /* Or, start the app */
  app.listen(port, host, err => {
    if (err) {
      return _logger__WEBPACK_IMPORTED_MODULE_3__["default"].error(err.message);
    }

    if (true) {
      console.log(`Running on port ${port}`);
    }

    _logger__WEBPACK_IMPORTED_MODULE_3__["default"].appStarted(port, prettyHost);
  });
}

process.on("SIGINT", function () {
  process.exit(0); // db.stop(function(err) {
  //   process.exit(err ? 1 : 0);
  // });
});
process.on("uncaughtException", err => {
  console.error(err);
});
/* WEBPACK VAR INJECTION */}.call(this, "src/server"))

/***/ }),

/***/ "./src/server/inflection/server/routes.js":
/*!************************************************!*\
  !*** ./src/server/inflection/server/routes.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tables__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../tables */ "./src/server/inflection/tables/index.js");
/* harmony import */ var _tables_tree__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../tables/tree */ "./src/server/inflection/tables/tree.js");
/* harmony import */ var _server_with_database_license__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./server-with-database/license */ "./src/server/inflection/server/server-with-database/license.js");
/* harmony import */ var _views_layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/layout */ "./src/server/inflection/server/views/layout.js");
/*

  This file contains the routes for both the inflection site and the API.
  It both supports sending requests to the database or the database-less backends.
  For that reason, the "Search" and "Get_by_id" functions are passed as parameters.

*/

const router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();





/**
 * @param {boolean} use_database
 */

/* harmony default export */ __webpack_exports__["default"] = ((Search, Get_by_id) => {
  /*
    API
  */
  router.get("/api/inflections?", cors__WEBPACK_IMPORTED_MODULE_1___default()(), (req, res) => {
    res.setHeader("X-Robots-Tag", "noindex");
    let {
      id,
      type,
      search,
      fuzzy,
      return_rows_if_only_one_match
    } = req.query;

    if (search) {
      return Search({
        word: search,
        fuzzy,
        return_rows_if_only_one_match
      }, results => {
        res.json({
          results
        });
      });
    } else if (id) {
      Get_by_id(id, rows => {
        try {
          /* Flat */
          if (type === "flat") {
            return res.json(Object(_server_with_database_license__WEBPACK_IMPORTED_MODULE_4__["default"])(rows, id));
          } else if (type === "html") {
            /* HTML */
            return res.send(Object(_tables__WEBPACK_IMPORTED_MODULE_2__["default"])(rows, req.query));
          } else {
            /* Nested */
            return res.send(Object(_server_with_database_license__WEBPACK_IMPORTED_MODULE_4__["default"])(Object(_tables_tree__WEBPACK_IMPORTED_MODULE_3__["default"])(rows), id));
          }
        } catch (e) {
          if (type === "html") {
            res.status(400).send(`There was an error. <br><small>The message was ${e.message}</small>`);
          } else {
            res.status(400).send({
              error: `There was an error. The message was ${e.message}`
            });
          }
        }
      });
    } else {
      return res.status(400).send({
        error: "Parameters needed"
      }); // return res.sendFile(path.resolve(__dirname, `./../docs/README.md`))
    }
  });
  /*
    Website
  */

  router.get(["/robots.txt", "/favicon.ico", "/sitemap.xml"], (req, res) => {
    res.send("");
  });
  router.get(["/", "/:id(\\d+)/", "/:word?/:id(\\d+)?"], cors__WEBPACK_IMPORTED_MODULE_1___default()(), (req, res) => {
    const id = req.query.id || req.params.id;
    const word = req.query.q || req.params.word;
    const embed = ("embed" in req.query);

    const sendError = e => {
      console.error(e);
      return res.send(Object(_views_layout__WEBPACK_IMPORTED_MODULE_5__["default"])({
        title: word,
        string: word,
        results: 'There was an error. Please <a href="mailto:ylhyra@ylhyra.is">click here</a> to report this error.' + `<br><br><small class=gray>Error message: ${e.message}</small>`
      }));
    };

    try {
      if (id) {
        Get_by_id(id, rows => {
          if (!rows || rows.length === 0) {
            return res.send(Object(_views_layout__WEBPACK_IMPORTED_MODULE_5__["default"])({
              title: word,
              string: word,
              results: rows === null ? "Internal network error. Try reloading." : "No matches"
            }));
          }

          try {
            // console.log(rows)
            res.send(Object(_views_layout__WEBPACK_IMPORTED_MODULE_5__["default"])({
              title: rows[0].base_word || "",
              string: word,
              results: Object(_tables__WEBPACK_IMPORTED_MODULE_2__["default"])(rows, req.query, {
                input_string: word
              }),
              id,
              embed
            }));
          } catch (e) {
            sendError(e);
          }
        });
      } else if (word) {
        Search({
          word: word,
          fuzzy: true,
          return_rows_if_only_one_match: true
        }, results => {
          try {
            /*
              No results
            */
            if (!results || results === "Error") {
              return res.send(Object(_views_layout__WEBPACK_IMPORTED_MODULE_5__["default"])({
                title: word,
                string: word,
                embed,
                results: results === "Error" ? "Error, try reloading" : "No matches"
              }));
            } // console.log(results)


            const {
              perfect_matches,
              did_you_mean
            } = results;
            let output = "";
            let did_you_mean_string = "";

            if (perfect_matches.length > 0) {
              output += `<ul class="results">
                  ${perfect_matches.map(renderItemOnSearchPage).join("")}
                </ul>`;
            }

            if (did_you_mean.length > 0) {
              did_you_mean_string += `
                <h4 class="did-you-mean">
                  ${perfect_matches.length > 0 ? perfect_matches.length === 1 ? "You may also be looking for:" : "Or did you mean:" : "Did you mean:"}</h4>
                <ul class="results">
                  ${did_you_mean.map(renderItemOnSearchPage).join("")}
                </ul>`;
            }
            /*
              One result
            */


            if (perfect_matches.length === 1) {
              const {
                rows
              } = perfect_matches[0];
              res.send(Object(_views_layout__WEBPACK_IMPORTED_MODULE_5__["default"])({
                title: rows[0].base_word || "",
                string: word,
                results: Object(_tables__WEBPACK_IMPORTED_MODULE_2__["default"])(rows, req.query, {
                  input_string: word
                }),
                did_you_mean_in_footer: did_you_mean_string,
                id: rows[0].BIN_id,
                embed
              }));
            } else {
              /*
                Many results
              */
              res.send(Object(_views_layout__WEBPACK_IMPORTED_MODULE_5__["default"])({
                title: word,
                string: word,
                results: output + did_you_mean_string,
                embed
              }));
            }
          } catch (e) {
            sendError(e);
          }
        });
      } else {
        res.send(Object(_views_layout__WEBPACK_IMPORTED_MODULE_5__["default"])({}));
      }
    } catch (e) {
      res.status(400).send(`There was an error. <br><small>The message was ${e.message}</small>`);
    }
  });
  return router;
});

const renderItemOnSearchPage = i => `
  <li>
    <a href="/${i.matched_term ? encodeURIComponent(i.matched_term) + "/" : ""}${i.BIN_id}">
      ${i.snippet ? `<div class="snippet">${i.snippet}</div>` : `<div><strong>${i.base_word}</strong></div>`}
      <div class="description">${i.description}</div>
    </a>
  </li>`;

/***/ }),

/***/ "./src/server/inflection/server/server-with-database/database/ImportToDatabase.js":
/*!****************************************************************************************!*\
  !*** ./src/server/inflection/server/server-with-database/database/ImportToDatabase.js ***!
  \****************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var server_database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/database */ "./src/server/database/index.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! server/database/functions/SQL-template-literal */ "./src/server/database/functions/SQL-template-literal.js");
/*
  To run:
  node build/ylhyra_server.js --import-inflections
*/
var LineByLineReader = __webpack_require__(/*! line-by-line */ "line-by-line"); // var inflections = require('./inflections.js')



let count = 0;


const CSV_FILE_NAME = "KRISTINsnid.csv";
const CSV_FILE_LINES = 6334181; // Number of lines, calculated with "wc -l"

var lr = new LineByLineReader(path__WEBPACK_IMPORTED_MODULE_1___default.a.resolve(__dirname, `./${CSV_FILE_NAME}`));
lr.on("error", err => {
  console.error(err);
});
lr.on("line", line => {
  lr.pause();

  if (line.trim() == "") {
    lr.resume();
  } else {
    /*
        See https://bin.arnastofnun.is/DMII/LTdata/k-format/
      */
    let [base_word, // 1
    BIN_id, // 2
    word_categories, // 3
    BIN_domain, // 4  https://bin.arnastofnun.is/ordafordi/hlutiBIN/
    correctness_grade_of_word, // 5
    word_register, // 6
    grammar_group, // 7
    cross_reference, // 8
    should_be_taught, // 9 - K = Core, V = other
    inflectional_form, // 10
    grammatical_tag, // 11
    correctness_grade_of_inflectional_form, // 12
    register_of_inflectional_form, // 13
    various_feature_markers, // 14
    alternative_entry // 15
    ] = line.split(";"); // if(BIN_id != 433568) {
    //   return  lr.resume()
    // }

    /* Only the words marked with "K" (meaning "Core") are prescriptive and should be taught */

    should_be_taught = should_be_taught === "K" ? true : false;
    Object(server_database__WEBPACK_IMPORTED_MODULE_0__["default"])(server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__["default"]`
        SET sql_mode="TRADITIONAL";
        INSERT INTO inflection SET
          base_word = ${base_word},
          base_word_lowercase = ${base_word.toLowerCase()},
          BIN_id = ${BIN_id},
          word_categories = ${word_categories},
          correctness_grade_of_word = ${correctness_grade_of_word || null},
          BIN_domain = ${BIN_domain},
          word_register = ${word_register},
          grammar_group = ${grammar_group},
          cross_reference = ${cross_reference || null},
          should_be_taught = ${should_be_taught},
          inflectional_form = ${inflectional_form},
          inflectional_form_lowercase = ${inflectional_form.toLowerCase()},
          grammatical_tag = ${grammatical_tag},
          correctness_grade_of_inflectional_form = ${correctness_grade_of_inflectional_form || null},
          register_of_inflectional_form = ${register_of_inflectional_form},
          various_feature_markers = ${various_feature_markers},
          alternative_entry = ${alternative_entry}
      `, (error, results, fields) => {
      if (error) {
        console.error(error);
      }

      lr.resume();
    });
    count++;

    if (count % 1000 === 1) {
      process.stdout.write(`\x1Bc\r${(count / CSV_FILE_LINES * 100).toFixed(1)}% ${base_word}`);
    } // inflections(line, (entry) => {
    //
    //   // console.log(JSON.stringify(entry.entry.content, null, 2).slice(0,1000))
    //   // process.exit()
    //
    //   if (count % 1000 === 0) {
    //     console.log(`${(count / 278704 * 100).toFixed(1)}% ${entry.base}`)
    //   }
    //   count++
    //
    //   if (entry.base !== null) {
    //     const hash = string_hash(line).toString(36)
    //
    //     let beygjanleg_query = ''
    //     let beyginleg_input = []
    //     for (let i of entry.forms) {
    //       beygjanleg_query += `INSERT INTO words_to_inflection SET lowercase = ?, word = ?, classification = ?, inflection_hash = ?;`
    //       beyginleg_input.push(i.value.toLowerCase(), i.value, i.flokkun, hash)
    //     }
    //
    //     query(beygjanleg_query +
    //       `INSERT INTO inflection SET hash = ?, base = ?, entry = ?;`, [...beyginleg_input, hash, entry.base, JSON.stringify(entry.entry)],
    //       (error, results, fields) => {
    //         if (error) {
    //           console.error(error)
    //         }
    //         lr.resume()
    //       });
    //   } else {
    //     lr.resume()
    //   }
    // })

  }
});
lr.on("end", () => {
  process.exit();
});
/* WEBPACK VAR INJECTION */}.call(this, "src/server/inflection/server/server-with-database/database"))

/***/ }),

/***/ "./src/server/inflection/server/server-with-database/database/generateSearchIndex.js":
/*!*******************************************************************************************!*\
  !*** ./src/server/inflection/server/server-with-database/database/generateSearchIndex.js ***!
  \*******************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var server_database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/database */ "./src/server/database/index.js");
/* harmony import */ var server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! server/database/functions/SQL-template-literal */ "./src/server/database/functions/SQL-template-literal.js");
/* harmony import */ var sqlstring__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sqlstring */ "sqlstring");
/* harmony import */ var sqlstring__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(sqlstring__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fuzzy_search__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../fuzzy_search */ "./src/server/inflection/server/server-with-database/fuzzy_search.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! underscore */ "underscore");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var src_app_App_functions_flattenArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/App/functions/flattenArray */ "./src/app/App/functions/flattenArray.js");
/*

  Generates an index for fuzzy search

  Setup:
  Fetch KRISTINsnid.csv from BÍN.
  Then generate a simple list of unique lowercase words with:
  > awk -F ';' '{print $10}' KRISTINsnid.csv | tr '[:upper:]' '[:lower:]' | sort -u > ordalisti.csv
  Then run:
  > node build/ylhyra_server.js --generate-search-index



  Scoring:

  * 5 - original word
  * 4 - original word is capitalized
  * 3 - without special characters
  * 2 - major spelling errors
  * 1 - phonetic

*/








var LineByLineReader = __webpack_require__(/*! line-by-line */ "line-by-line");

const CSV_FILE_NAME = "ordalisti.csv";
const CSV_FILE_LINES = 3071707; // Number of lines, calculated with "wc -l"

let count = 0; // import { compareTwoStrings } from 'string-similarity'

var lr = new LineByLineReader(path__WEBPACK_IMPORTED_MODULE_4___default.a.resolve(__dirname, `./${CSV_FILE_NAME}`));
lr.on("error", err => {
  console.error(err);
});
lr.on("line", line => {
  lr.pause();

  if (line.trim() == "") {
    lr.resume();
  } else {
    const word = line;
    let inputs;
    inputs = [{
      text: Object(_fuzzy_search__WEBPACK_IMPORTED_MODULE_3__["cleanInput"])(word),
      score: word === Object(_fuzzy_search__WEBPACK_IMPORTED_MODULE_3__["cleanInput"])(word) ? 5 : 4
    }];
    inputs = UniqueByMaxScore(addPhoneticAndSpellingErrors(inputs)); // inputs = inputs.filter(input => input.score >= 3)

    const values = Object(src_app_App_functions_flattenArray__WEBPACK_IMPORTED_MODULE_6__["default"])(inputs.map(input => [input.text, word, input.score]));
    Object(server_database__WEBPACK_IMPORTED_MODULE_0__["default"])(`DELETE FROM autocomplete WHERE output = ${Object(sqlstring__WEBPACK_IMPORTED_MODULE_2__["escape"])(word)};` + `INSERT INTO autocomplete SET input = ?, output = ?, score = ?;`.repeat(inputs.length), values, (err, results) => {
      if (err) {
        console.error(err);
        throw err;
      } else {
        count++;

        if (count % 100 === 1) {
          process.stdout.write(`\x1Bc\r${(count / CSV_FILE_LINES * 100).toFixed(1)}% ${word}`);
        }

        lr.resume();
      }
    });
  }
});
lr.on("end", () => {
  process.exit();
});

const clean = words => words.map(word => ({
  text: Object(_fuzzy_search__WEBPACK_IMPORTED_MODULE_3__["cleanInput"])(word.text),
  score: word.score
}));

const addPhoneticAndSpellingErrors = inputs => {
  let additions = [];
  inputs.forEach(({
    text,
    score
  }) => {
    additions.push({
      text: Object(_fuzzy_search__WEBPACK_IMPORTED_MODULE_3__["without_special_characters"])(text),
      score: 3
    });
    additions.push({
      text: Object(_fuzzy_search__WEBPACK_IMPORTED_MODULE_3__["with_spelling_errors"])(text),
      score: 2
    });
    additions.push({
      text: Object(_fuzzy_search__WEBPACK_IMPORTED_MODULE_3__["phonetic"])(text),
      score: 1
    });
  });
  return [...inputs, ...additions];
};

const UniqueByMaxScore = inputs => {
  const sorted = inputs.sort((a, b) => b.score - a.score);
  /* Store array of texts so that we can filter out already-seen ones in the next step */

  const texts = sorted.map(word => Object(_fuzzy_search__WEBPACK_IMPORTED_MODULE_3__["removeTemporaryMarkers"])(word.text));
  return sorted.filter((word, index) => index === texts.indexOf(Object(_fuzzy_search__WEBPACK_IMPORTED_MODULE_3__["removeTemporaryMarkers"])(word.text))).map(word => ({
    text: word.text,
    score: Math.round(word.score)
  }));
}; // const demo = async () => {
//   const word = 'Þórsmörk'
//   let inputs = [{
//     text: cleanInput(word),
//     score: word === cleanInput(word) ? 100 : 90,
//   }]
//   inputs = UniqueByMaxScore(autocomplete(inputs))
//   inputs = UniqueByMaxScore(addPhoneticAndSpellingErrors(inputs))
//   inputs = inputs.filter(input => input.score >= 3)
//
//   console.log(inputs)
//   process.exit()
// }
// demo()
/* WEBPACK VAR INJECTION */}.call(this, "src/server/inflection/server/server-with-database/database"))

/***/ }),

/***/ "./src/server/inflection/server/server-with-database/fuzzy_search.js":
/*!***************************************************************************!*\
  !*** ./src/server/inflection/server/server-with-database/fuzzy_search.js ***!
  \***************************************************************************/
/*! exports provided: WITHOUT_SPECIAL_CHARACTERS_MARKER, WITH_SPELLING_ERROR_MARKER, PHONETIC_MARKER, default, cleanInput, without_special_characters, with_spelling_errors, phonetic, removeTemporaryMarkers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WITHOUT_SPECIAL_CHARACTERS_MARKER", function() { return WITHOUT_SPECIAL_CHARACTERS_MARKER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WITH_SPELLING_ERROR_MARKER", function() { return WITH_SPELLING_ERROR_MARKER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PHONETIC_MARKER", function() { return PHONETIC_MARKER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cleanInput", function() { return cleanInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "without_special_characters", function() { return without_special_characters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "with_spelling_errors", function() { return with_spelling_errors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "phonetic", function() { return phonetic; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeTemporaryMarkers", function() { return removeTemporaryMarkers; });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var server_database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! server/database */ "./src/server/database/index.js");
/* harmony import */ var server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! server/database/functions/SQL-template-literal */ "./src/server/database/functions/SQL-template-literal.js");
/* harmony import */ var cologne_phonetic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cologne-phonetic */ "cologne-phonetic");
/* harmony import */ var cologne_phonetic__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(cologne_phonetic__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var diacritics__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! diacritics */ "diacritics");
/* harmony import */ var diacritics__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(diacritics__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _tables_word__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../tables/word */ "./src/server/inflection/tables/word.js");
/* harmony import */ var _phoneticHash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./phoneticHash */ "./src/server/inflection/server/server-with-database/phoneticHash.js");
/* harmony import */ var _tables_link__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../tables/link */ "./src/server/inflection/tables/link.js");
/* harmony import */ var server_inflection_tables_classification_BIN_classification__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! server/inflection/tables/classification/BIN_classification */ "./src/server/inflection/tables/classification/BIN_classification.js");
/* harmony import */ var server_inflection_tables_classification_sort_by_classification__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! server/inflection/tables/classification/sort_by_classification */ "./src/server/inflection/tables/classification/sort_by_classification.js");
/*
  Fuzzy search. Finds items with typos and auto-completes.

  Note: This file currently relies on being a submodule of Ylhýra.
*/

const router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();



__webpack_require__(/*! array-sugar */ "array-sugar");






const WITHOUT_SPECIAL_CHARACTERS_MARKER = "@";
const WITH_SPELLING_ERROR_MARKER = "^";
const PHONETIC_MARKER = "~";


/* harmony default export */ __webpack_exports__["default"] = (({
  word,
  return_rows_if_only_one_match
}, callback) => {
  Object(server_database__WEBPACK_IMPORTED_MODULE_1__["default"])(server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__["default"]`
    SELECT
        score,
        i2.BIN_id,
        i2.BIN_domain,
        i2.grammatical_tag,
        i2.inflectional_form,
        i2.word_categories,
        i2.base_word,
        i2.correctness_grade_of_word,
        i2.word_register,
        i2.grammar_group,
        i2.cross_reference,
        i2.should_be_taught,
        i2.grammatical_tag,
        i2.correctness_grade_of_inflectional_form,
        i2.register_of_inflectional_form,
        i2.various_feature_markers,
        i2.alternative_entry,
        inner_table.inflectional_form as matched_term,
        (output = i2.inflectional_form_lowercase) as variant_matched,
        (CASE WHEN inner_table.score >= 4 THEN 1 ELSE 0 END) as word_has_perfect_match,
        (output = i2.base_word) as base_word_matched
      FROM
      (
       SELECT score, i1.inflectional_form, i1.BIN_id, output FROM (
         SELECT score, output FROM autocomplete
           WHERE input = ${word}
           OR input = ${without_special_characters(word)}
           OR input = ${with_spelling_errors(word)}
           -- OR input = ${phonetic(word)}
           ORDER BY
           autocomplete.score DESC
           LIMIT 20 -- Necessary?
       ) a
       LEFT JOIN inflection i1
         ON a.output = i1.inflectional_form_lowercase
         GROUP BY BIN_id
       ORDER BY
         a.score DESC,
         i1.should_be_taught DESC,
         i1.correctness_grade_of_inflectional_form ASC,
         i1.correctness_grade_of_word ASC,
         i1.inflectional_form ASC
         -- ,
         -- i1.BIN_id ASC
       ) as inner_table
     LEFT JOIN inflection i2
       ON inner_table.BIN_id = i2.BIN_id
       ORDER BY
         base_word_matched DESC
  `, (err, rows) => {
    if (err) {
      console.error(err);
      callback(null);
    } else if (rows.length === 0) {
      callback(null);
    } else {
      // console.log(rows.map(row => row.base_word).join(', '))
      // console.log(rows.slice(0,2))
      try {
        let words = [];
        let BIN_ids = [];
        rows.forEach(row => {
          let index = BIN_ids.findIndex(i => i === row.BIN_id);

          if (index < 0) {
            BIN_ids.push(row.BIN_id);
            words.push([]);
            index = words.length - 1;
          }

          words[index].push(Object(server_inflection_tables_classification_BIN_classification__WEBPACK_IMPORTED_MODULE_8__["default"])(row));
        });
        let output = [];
        words.forEach(rows1 => {
          const word = new _tables_word__WEBPACK_IMPORTED_MODULE_5__["default"](rows1.sort(server_inflection_tables_classification_sort_by_classification__WEBPACK_IMPORTED_MODULE_9__["sort_by_classification"]));
          /* Prevent "null" from appearing during index creation, which causes Word() to fail */

          if (word.getId()) {
            output.push({
              perfect_match: rows1[0].word_has_perfect_match,
              BIN_id: word.getId(),
              base_word: word.getBaseWord(),
              description: Object(_tables_link__WEBPACK_IMPORTED_MODULE_7__["removeLinks"])(word.getWordDescription()),
              snippet: Object(_tables_link__WEBPACK_IMPORTED_MODULE_7__["removeLinks"])(word.getSnippet()),
              matched_term: rows1[0].matched_term,
              rows: rows1
            });
          }
        });
        let perfect_matches = [];
        let did_you_mean = [];
        output.forEach(item => {
          if (item.perfect_match) {
            perfect_matches.push(item);
          } else {
            did_you_mean.push(item);
          }
        });
        let returns = {
          perfect_matches,
          did_you_mean
        }; // /*
        //   Only one match, return rows so that a table may be printed immediately
        // */
        // if (perfect_matches.length === 1 && return_rows_if_only_one_match) {
        //   returns.rows = perfect_matches[0].rows
        // }

        callback(returns);
      } catch (e) {
        console.error(e);
        callback("Error");
      }
    }
  });
});
const cleanInput = input => {
  return input && input.toLowerCase().replace(/[^a-zA-ZÀ-ÿ0-9]/g, "");
};
const without_special_characters = string => {
  string = WITHOUT_SPECIAL_CHARACTERS_MARKER + string.replace(/þ/g, "th").replace(/ð/g, "d").replace(/ö/g, "o");
  return Object(diacritics__WEBPACK_IMPORTED_MODULE_4__["remove"])(string);
};
const with_spelling_errors = string => {
  return WITH_SPELLING_ERROR_MARKER + removeTemporaryMarkers(without_special_characters(string)).replace(/y/g, "i").replace(/([^\w\s])|(.)(?=\2)/g, ""); // Remove two in a row
};
const phonetic = string => {
  return PHONETIC_MARKER + Object(_phoneticHash__WEBPACK_IMPORTED_MODULE_6__["default"])(removeTemporaryMarkers(without_special_characters(string)));
};
const removeTemporaryMarkers = input => {
  return input.replace(WITHOUT_SPECIAL_CHARACTERS_MARKER, "").replace(WITH_SPELLING_ERROR_MARKER, "").replace(PHONETIC_MARKER, "");
};

/***/ }),

/***/ "./src/server/inflection/server/server-with-database/get_by_id.js":
/*!************************************************************************!*\
  !*** ./src/server/inflection/server/server-with-database/get_by_id.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var server_database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/database */ "./src/server/database/index.js");
/* harmony import */ var server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! server/database/functions/SQL-template-literal */ "./src/server/database/functions/SQL-template-literal.js");
/* harmony import */ var server_inflection_tables_classification_BIN_classification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! server/inflection/tables/classification/BIN_classification */ "./src/server/inflection/tables/classification/BIN_classification.js");
/* harmony import */ var server_inflection_tables_classification_sort_by_classification__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! server/inflection/tables/classification/sort_by_classification */ "./src/server/inflection/tables/classification/sort_by_classification.js");
/*
  Note: This file currently relies on being a submodule of Ylhýra.
*/




/*
  Full table for id
*/

/* harmony default export */ __webpack_exports__["default"] = ((id, callback) => {
  Object(server_database__WEBPACK_IMPORTED_MODULE_0__["default"])(server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_1__["default"]`
    SELECT
      inflection.BIN_id,
      base_word,
      inflectional_form,
      word_categories,
      BIN_domain,
      correctness_grade_of_word,
      word_register,
      grammar_group,
      cross_reference,
      should_be_taught,
      grammatical_tag,
      correctness_grade_of_inflectional_form,
      register_of_inflectional_form,
      various_feature_markers,
      alternative_entry
    FROM inflection
    WHERE inflection.BIN_id = ${id};
    -- AND correctness_grade_of_inflectional_form = 1
    -- AND should_be_taught = 1

    SELECT *
    FROM vocabulary_input
    -- LEFT JOIN vocabulary_input
    --   ON inflection.BIN_id = vocabulary_input.BIN_ID
    LEFT JOIN vocabulary_fields
      ON vocabulary_fields.id = vocabulary_input.vocabulary_id
    WHERE vocabulary_input.BIN_id = ${id};

  `, (err, results) => {
    if (err) {
      callback(null);
    } else {
      try {
        const rows = results[0].map(i => Object(server_inflection_tables_classification_BIN_classification__WEBPACK_IMPORTED_MODULE_2__["default"])(i)).sort(server_inflection_tables_classification_sort_by_classification__WEBPACK_IMPORTED_MODULE_3__["sort_by_classification"]); // console.log(results[1][1])
        // console.log(output)

        callback(rows);
      } catch (e) {
        console.error(e);
        callback("Error");
      }
    }
  });
});

/***/ }),

/***/ "./src/server/inflection/server/server-with-database/license.js":
/*!**********************************************************************!*\
  !*** ./src/server/inflection/server/server-with-database/license.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ((input, id) => {
  return {
    // urls: {
    //   nested: `https://ylhyra.is/api/inflection?id=${id}`,
    //   flat: `https://ylhyra.is/api/inflection?id=${id}&type=flat`,
    //   html: `https://ylhyra.is/api/inflection?id=${id}&type=html`,
    // },
    results: input,
    license: "CC BY-SA 4.0; https://ylhyra.is/Project:Inflections; © Árni Magnússon Institute for Icelandic Studies"
  };
});

/***/ }),

/***/ "./src/server/inflection/server/server-with-database/phoneticHash.js":
/*!***************************************************************************!*\
  !*** ./src/server/inflection/server/server-with-database/phoneticHash.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*

  Phonetic algorithm for Icelandic, similar to Cologne phonetics

*/
/* harmony default export */ __webpack_exports__["default"] = (string => {
  return string.replace(/y/g, "i").replace(/au/g, "o").replace(/sg/g, "sk").replace(/hv/g, "kv").replace(/fnd/g, "md").replace(/fnt/g, "mt").replace(/rl/g, "tl").replace(/x/g, "ks").replace(/(dn|rn|rdn)/g, "n").replace(/mb/g, "m").replace(/[aeiouyj]/g, "a").replace(/(th|dh|d|t|h)/g, "d").replace(/[fvw]/g, "v").replace(/[pb]/g, "p").replace(/[gkqc]/g, "k").replace(/(l|dl)/g, "l").replace(/[mn]/g, "n").replace(/[rs]/g, "s").replace(/([^\w\s])|(.)(?=\2)/g, ""); // Remove two in a row
});

/***/ }),

/***/ "./src/server/inflection/server/server-with-database/route_loader.js":
/*!***************************************************************************!*\
  !*** ./src/server/inflection/server/server-with-database/route_loader.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../routes */ "./src/server/inflection/server/routes.js");
/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./search */ "./src/server/inflection/server/server-with-database/search.js");
/* harmony import */ var _get_by_id__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./get_by_id */ "./src/server/inflection/server/server-with-database/get_by_id.js");



/* harmony default export */ __webpack_exports__["default"] = (Object(_routes__WEBPACK_IMPORTED_MODULE_0__["default"])(_search__WEBPACK_IMPORTED_MODULE_1__["default"], _get_by_id__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./src/server/inflection/server/server-with-database/search.js":
/*!*********************************************************************!*\
  !*** ./src/server/inflection/server/server-with-database/search.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var server_database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/database */ "./src/server/database/index.js");
/* harmony import */ var server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! server/database/functions/SQL-template-literal */ "./src/server/database/functions/SQL-template-literal.js");
/* harmony import */ var server_inflection_tables_classification_BIN_classification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! server/inflection/tables/classification/BIN_classification */ "./src/server/inflection/tables/classification/BIN_classification.js");
/* harmony import */ var _fuzzy_search__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fuzzy_search */ "./src/server/inflection/server/server-with-database/fuzzy_search.js");
/*
  Finds exact matches.
  For fuzzy matches, see ./autocomplete.js

  Note: This file currently relies on being a submodule of Ylhýra.
*/



 // import { IcelandicCharacters } from 'server/inflection/tables/functions'

const IcelandicCharacters = /^[a-záéíóúýðþæö ]+$/i;
/*
  Find possible base words and tags for a given word
*/

/* harmony default export */ __webpack_exports__["default"] = ((options, callback) => {
  let {
    word,
    fuzzy,
    return_rows_if_only_one_match
  } = options;

  if (!word || word.length > 100 || !IcelandicCharacters.test(word)) {
    return callback(null); // return res.status(400).send({ error: 'Invalid string' })
  }

  word = word.trim().toLowerCase().replace(/\s+/g, " ");

  if (fuzzy) {
    return Object(_fuzzy_search__WEBPACK_IMPORTED_MODULE_3__["default"])({
      word,
      return_rows_if_only_one_match
    }, callback);
  } else {
    Object(server_database__WEBPACK_IMPORTED_MODULE_0__["default"])(server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_1__["default"]`
      SELECT BIN_id, base_word, inflectional_form, word_categories, grammatical_tag, should_be_taught FROM inflection
      WHERE inflectional_form_lowercase = ${word}
      ORDER BY
      should_be_taught DESC,
      correctness_grade_of_inflectional_form DESC
      LIMIT 100
    `, (err, results) => {
      if (err) {
        callback("Error");
      } else {
        let grouped = [];
        results.forEach(row => {
          let index = grouped.findIndex(i => i.BIN_id === row.BIN_id);

          if (index < 0) {
            grouped.push({
              BIN_id: row.BIN_id,
              urls: {
                nested: `https://ylhyra.is/api/inflection?id=${row.BIN_id}`,
                flat: `https://ylhyra.is/api/inflection?id=${row.BIN_id}&type=flat`,
                html: `https://ylhyra.is/api/inflection?id=${row.BIN_id}&type=html`
              },
              base_word: row.base_word,
              word_categories: Object(server_inflection_tables_classification_BIN_classification__WEBPACK_IMPORTED_MODULE_2__["default"])(row).word_categories,
              matches: []
            });
            index = grouped.length - 1;
          }

          grouped[index].matches.push({
            inflectional_form: row.inflectional_form,
            inflectional_form_categories: Object(server_inflection_tables_classification_BIN_classification__WEBPACK_IMPORTED_MODULE_2__["default"])(row).inflectional_form_categories,
            should_be_taught: row.should_be_taught
          });
        });
        callback(grouped);
      }
    });
  }
});

/***/ }),

/***/ "./src/server/inflection/server/views/layout.js":
/*!******************************************************!*\
  !*** ./src/server/inflection/server/views/layout.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (({
  title,
  string,
  results,
  id,
  embed,
  did_you_mean_in_footer
  /* For when one main variant is shown */

}) => `
<!DOCTYPE html>
<html>
<title>${title && title + " – " || ""} Icelandic inflections</title>
<meta charset="utf-8"/>
<!-- <base href="/"/> -->
<link href="/inflection_styles/build.css?build=000000" rel="stylesheet" type="text/css"/>
<!-- <meta name="description" content=""/> -->
<meta name="google" content="notranslate" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<!-- <link rel="shortcut icon" href="/~/favicon.png"> -->

<script type="text/javascript">
if (/[?&](q|id)=/.test(location.search)) {
  var word = location.search.match(/[?&]q=([A-zÀ-ÿ%0-9+]+)/);
  if (word) word = word[1];
  var id = location.search.match(/[?&]id=([A-zÀ-ÿ%0-9+]+)/);
  if (id) id = id[1];
  if ((word || id) && window.history.replaceState) {
    var unused_parameters = location.search.replace(/[?&](q|id)=([A-zÀ-ÿ%0-9+]+)/,'').replace('?','')
    var url = '/' + (word ? word + (id ? '/':'') : '') + (id || '') + (unused_parameters ? '?'+unused_parameters:'')
    window.history.replaceState(null, null, url);
  }
}
</script>
<body>

${!embed ? `
<h1>
  ${title ? `<a href="/">Icelandic inflections</a>` : "Icelandic inflections"}
</h1>
<form method="get" action="/">
  <input name="q" id="s" placeholder="Search" type="search" value="${string || ""}" spellcheck="false" autocomplete="off"/>
</form>` : ""}
<main id="${id ? "content" : ""}">
  ${results || ""}
</main>
<footer>

${
/*did_you_mean_in_footer ? `
<ul class="results small">
${did_you_mean_in_footer}
</ul>
`:*/
""}

${id ? `<a href="https://bin.arnastofnun.is/beyging/${id}" target="_blank"><b>View this word on BÍN</b></a>` : ""}

<div class="license">

Data is from the <em><a href="https://bin.arnastofnun.is/DMII/LTdata/k-format/" rel="nofollow">Database of Modern Icelandic Inflection</a></em> (DMII),
or <em>Beygingarlýsing íslensks nútímamáls</em> (BÍN), by the Árni Magnússon Institute for Icelandic Studies. The author and editor of the DMII is <a href="https://www.arnastofnun.is/is/stofnunin/starfsfolk/kristin-bjarnadottir" rel="nofollow">Kristín Bjarnadóttir</a>. <small><a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow">CC BY-SA 4.0</a></small></div>


${did_you_mean_in_footer ? did_you_mean_in_footer : ""}

<div class="contact">
<a href="https://ylhyra.is/Project:Inflections" class="gray name"><b>Ylhýra</b></a> •
<a href="mailto:ylhyra@ylhyra.is">Report errors</a> •
<a href="https://github.com/ylhyra/icelandic-inflections#readme">API</a>
</div>

</footer>

<script type="text/javascript">
document.getElementById("s").select();
</script>

${id ? `
<script type="text/javascript">
var el = document.getElementById("content");
el & el.scrollIntoView();
</script>` : `
`}

${
/*Only list on main page */
""}
${!title ? `
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "url": "https://inflections.ylhyra.is/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://inflections.ylhyra.is/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>` : ""}
</body>
</html>
`);
/* <link rel="canonical" href="https://example.com/dresses/green-dresses" /> */

/***/ }),

/***/ "./src/server/inflection/tables/classification/BIN_classification.js":
/*!***************************************************************************!*\
  !*** ./src/server/inflection/tables/classification/BIN_classification.js ***!
  \***************************************************************************/
/*! exports provided: default, get_label_for_BIN_word, get_label_for_BIN_inflection_form, relevant_BIN_domains */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_label_for_BIN_word", function() { return get_label_for_BIN_word; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_label_for_BIN_inflection_form", function() { return get_label_for_BIN_inflection_form; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "relevant_BIN_domains", function() { return relevant_BIN_domains; });
/* harmony import */ var tables_tree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/tree */ "./src/server/inflection/tables/tree.js");
/* harmony import */ var tables_classification_classification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tables/classification/classification */ "./src/server/inflection/tables/classification/classification.js");


/**
 *  Turns BÍN's classifications into English
 *
 * @param {object} input
 *   Input is a raw row from the database with
 *   original values from the KRISTINsnid.csv file.
 *   The parameter mapping from the original file is
 *   shown in "server/server-with-database/database/ImportToDatabase.js".
 *   The following attributes of the input object are taken into consideration:
 *   - word_categories
 *   - grammatical_tag
 *   - BIN_domain
 *
 * @returns {object|array}
 *   Returns the inputted object with the following keys removed:
 *   - word_categories
 *   - grammatical_tag
 *   - BIN_domain
 *   And the following keys added:
 *   - word_categories - An array of values that
 *     apply to all the forms of the word (a noun, adjective...)
 *   - inflectional_form_categories - An array of
 *     values that only apply to certain forms of the word (plurality, case...)
 */

const classify = input => {
  let {
    word_categories,
    grammatical_tag,
    BIN_domain,
    ...rest
  } = input;
  if (!word_categories && !grammatical_tag) return input;
  /* Word categories */

  word_categories = word_categories && word_categories.toLowerCase() || "";
  let word_categories_output = get_label_for_BIN_word(word_categories).split(", ");

  if (relevant_BIN_domains[BIN_domain]) {
    word_categories_output.push(relevant_BIN_domains[BIN_domain]);
  }

  let inflectional_form_categories = [];
  let original_grammatical_tag = grammatical_tag;
  grammatical_tag = grammatical_tag && grammatical_tag.toLowerCase() || "";
  /* Adjectives: Arrange plurality before gender */

  grammatical_tag = grammatical_tag.replace(/(KK|KVK|HK)-(NF|ÞF|ÞGF|EF)(ET|FT)/i, "$3-$1-$2");
  /* Nouns: Arrange plurality before case */

  grammatical_tag = grammatical_tag.replace(/(NF|ÞF|ÞGF|EF)(ET|FT)/i, "$2-$1");
  grammatical_tag.split(new RegExp(`(${tagRegex})`, "g")).filter(Boolean).forEach(tag => {
    if (tag === "-") return;

    if (Object(tables_tree__WEBPACK_IMPORTED_MODULE_0__["isNumber"])(tag)) {// inflectional_form_categories.push(tag)
    } else if (get_label_for_BIN_inflection_form(tag)) {
      inflectional_form_categories.push(get_label_for_BIN_inflection_form(tag));
    } else {
      if (true) {
        console.error(`Unknown tag in BIN_classification.js: ${tag}. Full tag is ${grammatical_tag}`);
      }
    }
  });
  inflectional_form_categories = inflectional_form_categories.join(", ").split(", ");
  /* Add "without definite article" to nouns */

  if (word_categories_output.includes("noun") && !inflectional_form_categories.includes("with definite article")) {
    inflectional_form_categories.push("without definite article");
  } // /* Add "personal use" to verbs */
  // if (word_categories_output.includes('verb') &&
  //   !inflectional_form_categories.find(i => i.startsWith('impersonal') &&
  //     !inflectional_form_categories.includes('question form')
  //   )) {
  //   inflectional_form_categories = ['personal', ...inflectional_form_categories]
  // }

  /* If it ends in a number it is an alternative version */


  const variantNumber = (grammatical_tag.match(/(\d)$/) ? grammatical_tag.match(/(\d)$/)[0] : 1).toString();
  inflectional_form_categories.push(parseInt(variantNumber));
  return {
    word_categories: word_categories_output,
    inflectional_form_categories,
    original_grammatical_tag,
    BIN_domain,
    ...rest // ...input,

  };
};

/* harmony default export */ __webpack_exports__["default"] = (classify);
/*
  Overrides the tags in "classification.js" during the BIN initialization step
*/

const BIN_overrides = {
  word_overrides: {
    kk: "noun, masculine",
    kvk: "noun, feminine",
    hk: "noun, neuter"
  },
  inflection_form_overrides: {
    fsb: "positive degree, strong declension",
    fvb: "positive degree, weak declension",
    evb: "superlative degree, weak declension",
    esb: "superlative degree, strong declension",
    gr: "with definite article",
    st: "clipped imperative"
  }
};
const get_label_for_BIN_word = tag => {
  return BIN_overrides.word_overrides[tag] || Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_1__["normalizeTag"])(tag) || "";
};
const get_label_for_BIN_inflection_form = tag => {
  return BIN_overrides.inflection_form_overrides[tag] || Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_1__["normalizeTag"])(tag) || "";
};

const tagRegex = (() => {
  let tags = [...Object.keys(tables_classification_classification__WEBPACK_IMPORTED_MODULE_1__["shortcuts_used_in_BIN"]), ...Object.keys(BIN_overrides.word_overrides), ...Object.keys(BIN_overrides.inflection_form_overrides)];
  return tags.filter(Boolean).sort((a, b) => b.length - a.length).join("|");
})();
/*
  We are only interested in knowing wether a word is a name or not
  See https://bin.arnastofnun.is/ordafordi/hlutiBIN/
*/


const relevant_BIN_domains = {
  ism: "human name",
  erm: "human name",
  // Foreign human name
  föð: "patronymic",
  móð: "matronymic",
  gæl: "human nickname",
  ætt: "surname",
  hetja: "name",
  bær: "place name",
  göt: "place name",
  lönd: "place name",
  þor: "place name",
  örn: "place name",
  erl: "place name"
}; // export const BIN_domains = Object.keys(relevant_BIN_domains).map(key => relevant_BIN_domains[key])

/***/ }),

/***/ "./src/server/inflection/tables/classification/classification.js":
/*!***********************************************************************!*\
  !*** ./src/server/inflection/tables/classification/classification.js ***!
  \***********************************************************************/
/*! exports provided: normalizeTag, getTagInfo, shortcuts, sorted_tags, types, shortcuts_used_in_BIN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeTag", function() { return normalizeTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTagInfo", function() { return getTagInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shortcuts", function() { return shortcuts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sorted_tags", function() { return sorted_tags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "types", function() { return types; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shortcuts_used_in_BIN", function() { return shortcuts_used_in_BIN; });
/**
 * Descriptions derived from:
 *  - https://bin.arnastofnun.is/gogn/k-snid and
 *  - https://bin.arnastofnun.is/gogn/greiningarstrengir/
 * By Árni Magnússon Institute for Icelandic Studies
 */
const labels_array = [
/* Person */
{
  title: "1st person",
  icelandic_title: "1. persóna",
  type: "person",
  shortcuts: ["1p"],
  has_article_on_ylhyra: false
}, {
  title: "2nd person",
  icelandic_title: "2. persóna",
  type: "person",
  shortcuts: ["2p"],
  has_article_on_ylhyra: false
}, {
  title: "3rd person",
  icelandic_title: "3. persóna",
  type: "person",
  shortcuts: ["3p"],
  has_article_on_ylhyra: false
},
/* Case */
{
  title: "nominative",
  icelandic_title: "nefnifall",
  type: "case",
  shortcuts: ["nf", "nom"],
  has_article_on_ylhyra: true
}, {
  title: "accusative",
  icelandic_title: "þolfall",
  type: "case",
  shortcuts: ["þf", "acc"],
  has_article_on_ylhyra: true
}, {
  title: "dative",
  icelandic_title: "þágufall",
  type: "case",
  shortcuts: ["þgf", "dat"],
  has_article_on_ylhyra: true
}, {
  title: "genitive",
  icelandic_title: "eignarfall",
  type: "case",
  shortcuts: ["ef", "gen"],
  has_article_on_ylhyra: true
},
/* Plurality */
{
  title: "singular",
  icelandic_title: "eintala",
  type: "plurality",
  shortcuts: ["et", "sing", "sg", "s"],
  has_article_on_ylhyra: false
}, {
  title: "plural",
  icelandic_title: "fleirtala",
  type: "plurality",
  shortcuts: ["ft", "plur", "pl", "p"],
  has_article_on_ylhyra: false
},
/* Gender */
{
  title: "masculine",
  icelandic_title: "karlkyn",
  type: "gender",
  shortcuts: ["kk", "masc"],
  has_article_on_ylhyra: true
}, {
  title: "feminine",
  icelandic_title: "kvenkyn",
  type: "gender",
  shortcuts: ["kvk", "fem"],
  has_article_on_ylhyra: true
}, {
  title: "neuter",
  icelandic_title: "hvorugkyn",
  type: "gender",
  shortcuts: ["hk", "hvk", "neut"],
  has_article_on_ylhyra: true
},
/* Article */
{
  title: "without definite article",
  icelandic_title: "án greinis",
  type: "article",
  shortcuts: ["ángr", "no article"],
  has_article_on_ylhyra: true
}, {
  title: "with definite article",
  icelandic_title: "með greini",
  type: "article",
  shortcuts: ["meðgr", "with article"],
  has_article_on_ylhyra: true
},
/* Tense */
{
  title: "present tense",
  icelandic_title: "nútíð",
  type: "tense",
  shortcuts: ["nt", "present", "pres", "prs"],
  has_article_on_ylhyra: false
}, {
  title: "past tense",
  icelandic_title: "þátíð",
  type: "tense",
  shortcuts: ["þt", "past", "pst"],
  has_article_on_ylhyra: false
},
/* Degree */
{
  title: "positive degree",
  icelandic_title: "frumstig",
  type: "degree",
  shortcuts: ["fst", "positive"],
  has_article_on_ylhyra: false
}, {
  title: "comparative degree",
  icelandic_title: "miðstig",
  type: "degree",
  shortcuts: ["mst", "comparative"],
  has_article_on_ylhyra: false
}, {
  title: "superlative degree",
  icelandic_title: "efsta stig",
  type: "degree",
  shortcuts: ["est", "superlative"],
  has_article_on_ylhyra: false
},
/* Strong or weak */
{
  title: "strong declension",
  icelandic_title: "sterk beyging",
  type: "strong or weak",
  shortcuts: ["sb", "sterk", "strong"],
  has_article_on_ylhyra: false
}, {
  title: "weak declension",
  icelandic_title: "veik beyging",
  type: "strong or weak",
  shortcuts: ["vb", "veik", "weak"],
  has_article_on_ylhyra: false
}, {
  title: "infinitive",
  icelandic_title: "nafnháttur",
  type: "",
  shortcuts: ["nh", "inf"],
  has_article_on_ylhyra: true
}, {
  title: "indicative",
  icelandic_title: "framsöguháttur",
  type: "",
  shortcuts: ["fh", "ind", "real", "realis", "realis mood", "indicative mood"],
  has_article_on_ylhyra: true
}, {
  title: "subjunctive",
  icelandic_title: "viðtengingarháttur",
  type: "",
  shortcuts: ["vh", "subj"],
  has_article_on_ylhyra: true
}, {
  title: "active voice",
  icelandic_title: "germynd",
  type: "",
  shortcuts: ["gm", "active"],
  has_article_on_ylhyra: false
}, {
  title: "middle voice",
  icelandic_title: "miðmynd",
  type: "",
  shortcuts: ["mm", "med", "mediopassive", "mid"],
  has_article_on_ylhyra: true
}, {
  title: "imperative",
  icelandic_title: "boðháttur",
  type: "",
  shortcuts: ["bh", "imp"],
  has_article_on_ylhyra: true
}, {
  title: "clipped imperative",
  icelandic_title: "stýfður boðháttur",
  type: "",
  shortcuts: ["stýfður", "styfdur", "clipped"],
  has_article_on_ylhyra: false
}, {
  title: "present participle",
  icelandic_title: "lýsingarháttur nútíðar",
  type: "",
  shortcuts: ["lhnt"],
  has_article_on_ylhyra: false
}, {
  title: "supine",
  icelandic_title: "sagnbót",
  type: "",
  shortcuts: ["sagnb", "sup"],
  has_article_on_ylhyra: false
}, {
  title: "past participle",
  icelandic_title: "lýsingarháttur þátíðar",
  type: "",
  shortcuts: ["lhþt"],
  has_article_on_ylhyra: false
}, {
  title: "question form",
  icelandic_title: "spurnarmynd",
  type: "",
  shortcuts: ["sp"],
  has_article_on_ylhyra: false
}, {
  title: "optative",
  icelandic_title: "óskháttur",
  type: "",
  shortcuts: ["oskh"],
  has_article_on_ylhyra: false
}, {
  title: "not used in a noun phrase",
  icelandic_title: "sérstætt",
  type: "",
  shortcuts: ["serst"],
  has_article_on_ylhyra: false
}, {
  title: "personal",
  icelandic_title: "persónuleg beyging",
  type: "",
  shortcuts: ["persónuleg", "pers"],
  has_article_on_ylhyra: false
}, {
  title: "impersonal",
  icelandic_title: "ópersónuleg beyging",
  type: "",
  shortcuts: ["op"],
  has_article_on_ylhyra: false
}, {
  title: "impersonal with accusative subject",
  icelandic_title: "ópersónuleg beyging með frumlag í þolfalli",
  type: "",
  shortcuts: ["op-þf"],
  has_article_on_ylhyra: false
}, {
  title: "impersonal with dative subject",
  icelandic_title: "ópersónuleg beyging með frumlag í þágufalli",
  type: "",
  shortcuts: ["op-þgf"],
  has_article_on_ylhyra: false
}, {
  title: "impersonal with genitive subject",
  icelandic_title: "ópersónuleg beyging með frumlag í eignarfalli",
  type: "",
  shortcuts: ["op-ef"],
  has_article_on_ylhyra: false
}, {
  title: "impersonal with dummy subject",
  icelandic_title: "ópersónuleg beyging með gervifrumlag",
  type: "",
  shortcuts: ["op-það"],
  has_article_on_ylhyra: false
}, {
  title: "indeclinable",
  icelandic_title: "óbeygjanlegt",
  type: "",
  shortcuts: ["obeygjanlegt"],
  has_article_on_ylhyra: false
},
/* Word classes */
{
  title: "noun",
  icelandic_title: "nafnorð",
  type: "class",
  shortcuts: ["no", "n"],
  has_article_on_ylhyra: true
}, {
  title: "preposition",
  icelandic_title: "forsetning",
  type: "class",
  shortcuts: ["fs", "pre", "prep"],
  has_article_on_ylhyra: false
}, {
  title: "adverb",
  icelandic_title: "atviksorð",
  type: "class",
  shortcuts: ["ao", "adv"],
  has_article_on_ylhyra: false
}, {
  title: "article",
  icelandic_title: "greinir",
  type: "class",
  shortcuts: ["gr"],
  has_article_on_ylhyra: false
}, {
  title: "adjective",
  icelandic_title: "lýsingarorð",
  type: "class",
  shortcuts: ["lo", "adj", "a"],
  has_article_on_ylhyra: true
}, {
  title: "infinitive particle",
  icelandic_title: "nafnháttarmerki",
  type: "class",
  shortcuts: ["nhm"],
  has_article_on_ylhyra: false
}, {
  title: "verb",
  icelandic_title: "sagnorð",
  type: "class",
  shortcuts: ["so", "v"],
  has_article_on_ylhyra: true
}, {
  title: "conjunction",
  icelandic_title: "samtenging",
  type: "class",
  shortcuts: ["st", "conj"],
  has_article_on_ylhyra: false
}, {
  title: "interjection",
  icelandic_title: "upphrópun",
  type: "class",
  shortcuts: ["uh", "int"],
  has_article_on_ylhyra: false
}, {
  title: "numeral",
  icelandic_title: "töluorð",
  type: "class",
  shortcuts: ["to"],
  has_article_on_ylhyra: false
}, {
  title: "ordinal number",
  icelandic_title: "raðtala",
  type: "class",
  shortcuts: ["rt", "ordinal"],
  has_article_on_ylhyra: false
}, {
  title: "pronoun",
  icelandic_title: "fornafn",
  type: "class",
  shortcuts: ["fn"],
  has_article_on_ylhyra: true
}, {
  title: "reflexive pronoun",
  icelandic_title: "afturbeygt fornafn",
  type: "class",
  shortcuts: ["afn"],
  has_article_on_ylhyra: false
}, {
  title: "personal pronoun",
  icelandic_title: "persónufornafn",
  type: "class",
  shortcuts: ["pfn"],
  has_article_on_ylhyra: false
}];
/**
 * Object containing "name => array of tags", used for getting arrays later on, such as types['gender']
 */

let types = {};
/**
 * Abbreviations
 * Object on form {'nf': 'nominative'}
 */

let shortcuts = {};
/* Only for BÍN */

let shortcuts_used_in_BIN = {};
/**
 * Sorted single-level array of tags, used for sorting rows when constructing the tree
 */

let sorted_tags = [];
/**
 * Reverses `label` to turn it into a searchable object
 */

let title_to_label = {};
labels_array.forEach(label => {
  /* Types */
  if (label.type) {
    if (!types[label.type]) {
      types[label.type] = [];
    }

    types[label.type].push(label.title);
  }
  /* Shortcuts */


  let s = label.shortcuts;
  s.push(label.title);
  s.push(label.icelandic_title);
  s.forEach((shortcut, index) => {
    if (shortcuts[shortcut]) {
      throw `SHORTCUT ALREADY EXISTS ${shortcut}`;
    }

    shortcuts[shortcut] = label.title;

    if (index === 0) {
      shortcuts_used_in_BIN[shortcut] = label.title;
    }
  });
  /* Sorted tags */

  sorted_tags.push(label.title);
  /* Reverse lookup */

  title_to_label[label.title] = label;
});
const type_aliases = {
  article: ["articles"],
  plurality: ["number"],
  case: ["cases"],
  gender: ["genders"],
  person: ["persons"]
};
Object.keys(type_aliases).forEach(key => {
  type_aliases[key].forEach(type => {
    types[type] = types[key];
  });
});
const normalizeTag = (tag, strict) => {
  if (!tag) return null;
  if (typeof tag === "number") return tag;
  if (/^\d+?$/.test(tag)) return parseInt(tag);
  /* Number on the form of a string */

  if (typeof tag !== "string") throw new Error(`normalizeTag received type ${typeof tag}`);
  let output = shortcuts[tag] || shortcuts[tag.toLowerCase().trim()];
  if (!output && strict !== false) throw new Error(`Value not recognized: ${tag}`);
  return output;
};
const getTagInfo = (tag, strict) => {
  tag = normalizeTag(tag, strict);
  return tag && title_to_label[tag];
};





/***/ }),

/***/ "./src/server/inflection/tables/classification/sort_by_classification.js":
/*!*******************************************************************************!*\
  !*** ./src/server/inflection/tables/classification/sort_by_classification.js ***!
  \*******************************************************************************/
/*! exports provided: sort_by_classification */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sort_by_classification", function() { return sort_by_classification; });
/* harmony import */ var tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/classification/classification */ "./src/server/inflection/tables/classification/classification.js");

const sort_by_classification = (a, b) => {
  /* Sort by single tag */
  if (a.tag) {
    return tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__["sorted_tags"].indexOf(a.tag) - tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__["sorted_tags"].indexOf(b.tag);
  } // console.log({a,b})


  if (!a.inflectional_form_categories || !b.inflectional_form_categories) {
    console.error(`sort_by_classification received an object which does not contain "inflectional_form_categories"`);
    return false;
  }
  /* Sort by full array of classification */


  for (let i = 0; i < a.inflectional_form_categories.length; i++) {
    if (!b.inflectional_form_categories[i]) break;
    if (a.inflectional_form_categories[i] === b.inflectional_form_categories[i]) continue;
    return tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__["sorted_tags"].indexOf(a.inflectional_form_categories[i]) - tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__["sorted_tags"].indexOf(b.inflectional_form_categories[i]);
  }
  /* Sort by variant number */


  return a.variant_number - b.variant_number;
};

/***/ }),

/***/ "./src/server/inflection/tables/functions/discard.js":
/*!***********************************************************!*\
  !*** ./src/server/inflection/tables/functions/discard.js ***!
  \***********************************************************/
/*! exports provided: discardUnnecessaryForms, discardObscureForms, removeIncorrectVariants */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "discardUnnecessaryForms", function() { return discardUnnecessaryForms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "discardObscureForms", function() { return discardObscureForms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeIncorrectVariants", function() { return removeIncorrectVariants; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Here we remove variants which are not of any relevance to a second language student.
 * We remove:
 *   - Extremely obscure forms
 *   - Incorrect variants
 */

const discardUnnecessaryForms = rows => {
  return discardObscureForms(removeIncorrectVariants(rows));
};
/**
 * Discard extremely obscure forms which are not relevant for a student
 * Removed are:
 *   - Infinitive past tense („Hún sagðist hefðu“). See https://bin.arnastofnun.is/korn/23
 */

const discardObscureForms = rows => {
  return rows.filter(row => !["infinitive", "past tense"].every(i => row.inflectional_form_categories.includes(i)));
};
/**
 * Remove variants which are marked as being "incorrect" in standard Icelandic
 */

const removeIncorrectVariants = rows => {
  return rows.filter(row => {
    // console.log(row)
    // /* Note: Commented out as "hendi" is marked with this */
    // if (row.should_be_taught) {
    //   return true
    // }

    /* Leave the first item */
    if (Object(lodash__WEBPACK_IMPORTED_MODULE_0__["last"])(row.inflectional_form_categories) === 1 || Object(lodash__WEBPACK_IMPORTED_MODULE_0__["last"])(row.inflectional_form_categories) === "1") {
      return true;
    }
    /* Leave subsequent items if they are correct */


    if (row.correctness_grade_of_inflectional_form === 1 || row.correctness_grade_of_inflectional_form === "1") {
      return true;
    }

    return false;
  });
};

/***/ }),

/***/ "./src/server/inflection/tables/functions/helperWords.js":
/*!***************************************************************!*\
  !*** ./src/server/inflection/tables/functions/helperWords.js ***!
  \***************************************************************/
/*! exports provided: getHelperWordsBefore, getHelperWordsAfter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHelperWordsBefore", function() { return getHelperWordsBefore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHelperWordsAfter", function() { return getHelperWordsAfter; });
/* harmony import */ var tables_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/link */ "./src/server/inflection/tables/link.js");

/**
 * Before
 * @memberof Word
 * @return {string} HTML as string
 */

function getHelperWordsBefore() {
  let text = "";
  /* Nouns et al. */

  if (this.is("noun") || this.is("adjective") || this.is("past participle") || this.is("pronoun") || this.is("personal pronoun") || this.is("article") || this.is("reflexive pronoun")) {
    if (this.is("nominative", "singular")) {
      text = "hér er";

      if (this.getBaseWord() === "þú") {
        text = "hér ert";
      }
    }

    if (this.is("nominative", "plural")) {
      text = "hér eru";

      if (this.getBaseWord() === "ég") {
        text = "hér erum";
      }

      if (this.getBaseWord() === "þú" || this.getBaseWord() === "þér") {
        text = "hér eruð";
      }
    }

    if (this.is("accusative")) {
      text = "um";
    }

    if (this.is("dative")) {
      text = "frá";
    }

    if (this.is("genitive")) {
      text = "til";
    }

    text = Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])("helper words for declension", text);
  } else if (this.is("verb") && !this.is("question form")) {
    /* Verbs */
    if (this.is("infinitive")) {
      text = "að";
    }

    if (this.is("supine")) {
      text = "ég hef";
    }

    if (this.is("present participle")) {
      text = "hann er";
    }

    if (this.is("subjunctive")) {
      if (this.is("present tense")) {
        text = "ég held að ";
      }

      if (this.is("past tense")) {
        text = "ég hélt að ";
      }
    }

    if (this.is("singular")) {
      if (this.is("1st person")) {
        text += this.dependingOnSubject("ég", "mig", "mér", "mín", "það");
      }

      if (this.is("2nd person")) {
        text += this.dependingOnSubject("þú", "þig", "þér", "þín", "það");
      }

      if (this.is("3rd person")) {
        text += this.dependingOnSubject("hún", "hana", "henni", "hennar", "það");
      }
    }

    if (this.is("plural")) {
      if (this.is("1st person")) {
        text += this.dependingOnSubject("við", "okkur", "okkur", "okkur", "það");
      }

      if (this.is("2nd person")) {
        text += this.dependingOnSubject("þið", "ykkur", "ykkur", "ykkur", "það");
      }

      if (this.is("3rd person")) {
        text += this.dependingOnSubject("þær", "þær", "þeim", "þeirra", "það");
      }
    }
  }

  return text;
}
/**
 * After
 * @memberof Word
 * @return {string} HTML string
 */

function getHelperWordsAfter() {
  let text = "";
  let addSpace = true;
  /* Nouns */

  if (this.is("noun", "with definite article")) {
    if (this.is("singular")) {
      if (this.is("nominative")) {
        text = this.dependingOnGender("minn", "mín", "mitt");
      }

      if (this.is("accusative")) {
        text = this.dependingOnGender("minn", "mína", "mitt");
      }

      if (this.is("dative")) {
        text = this.dependingOnGender("mínum", "minni", "mínu");
      }

      if (this.is("genitive")) {
        text = this.dependingOnGender("minns", "minnar", "míns");
      }
    } else if (this.is("plural")) {
      if (this.is("nominative")) {
        text = this.dependingOnGender("mínir", "mínar", "mín");
      }

      if (this.is("accusative")) {
        text = this.dependingOnGender("mína", "mínar", "mín");
      }

      if (this.is("dative")) {
        text = this.dependingOnGender("mínum", "mínum", "mínum");
      }

      if (this.is("genitive")) {
        text = this.dependingOnGender("minna", "minna", "minna");
      }
    }

    text = Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])("helper words for the article", text);
  } else if (this.isAny("adjective", "past participle", "article")) {
    /* Adjectives & past participle */
    if (!this.is("weak declension")
    /*&& !this.is('article')*/
    ) {
        if (this.is("singular")) {
          if (this.is("nominative")) {
            text = this.dependingOnGender("maður", "kona", "barn");
          }

          if (this.is("accusative")) {
            text = this.dependingOnGender("mann", "konu", "barn");
          }

          if (this.is("dative")) {
            text = this.dependingOnGender("manni", "konu", "barni");
          }

          if (this.is("genitive")) {
            text = this.dependingOnGender("manns", "konu", "barns");
          }
        } else if (this.is("plural")) {
          if (this.is("nominative")) {
            text = this.dependingOnGender("menn", "konur", "börn");
          }

          if (this.is("accusative")) {
            text = this.dependingOnGender("menn", "konur", "börn");
          }

          if (this.is("dative")) {
            text = this.dependingOnGender("mönnum", "konum", "börnum");
          }

          if (this.is("genitive")) {
            text = this.dependingOnGender("manna", "kvenna", "barna");
          }
        }
      } else {
      if (this.is("singular")) {
        if (this.is("nominative")) {
          text = this.dependingOnGender("maðurinn", "konan", "barnið");
        }

        if (this.is("accusative")) {
          text = this.dependingOnGender("manninn", "konuna", "barnið");
        }

        if (this.is("dative")) {
          text = this.dependingOnGender("manninum", "konunni", "barninu");
        }

        if (this.is("genitive")) {
          text = this.dependingOnGender("mannsins", "konunnar", "barnsins");
        }
      } else if (this.is("plural")) {
        if (this.is("nominative")) {
          text = this.dependingOnGender("mennirnir", "konurnar", "börnin");
        }

        if (this.is("accusative")) {
          text = this.dependingOnGender("mennina", "konurnar", "börnin");
        }

        if (this.is("dative")) {
          text = this.dependingOnGender("mönnunum", "konunum", "börnunum");
        }

        if (this.is("genitive")) {
          text = this.dependingOnGender("mannanna", "kvennanna", "barnanna");
        }
      }
    }
  } else if (this.is("verb")) {
    /* Verbs */
    if (this.is("present tense")) {
      text = "(í dag)";
    }

    if (this.is("past tense")) {
      text = "(í gær)";
    }

    if (this.is("clipped imperative")) {
      text = "þú!";
    } else if (this.is("imperative")) {
      text = "!";
      addSpace = false;
    }

    if (this.is("question form")) {
      text = "?";
      addSpace = false;
    }
  }
  /* Add space between word, except for exclamation marks */


  if (addSpace && text) {
    return " " + text; // return '\u202F\u202F' + text
  } else {
    return text;
  }
}

/***/ }),

/***/ "./src/server/inflection/tables/functions/irregularities.js":
/*!******************************************************************!*\
  !*** ./src/server/inflection/tables/functions/irregularities.js ***!
  \******************************************************************/
/*! exports provided: FindIrregularities */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FindIrregularities", function() { return FindIrregularities; });
/* harmony import */ var tables_functions_vowels__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/functions/vowels */ "./src/server/inflection/tables/functions/vowels.js");
/* harmony import */ var tables_functions_patterns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tables/functions/patterns */ "./src/server/inflection/tables/functions/patterns.js");
/* harmony import */ var tables_word__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tables/word */ "./src/server/inflection/tables/word.js");



/**
 * @memberof Word
 */

function FindIrregularities() {
  let word = this;
  let wordHasUmlaut, wordIsIrregular, wordIsHighlyIrregular;
  /* Skip highlighting for certain word classes */

  if (word.isAny("indeclinable", "article", "pronoun", "personal pronoun", "reflexive pronoun", "preposition", "infinitive particle", "interjection", "adverb")) return;
  let stem = word.getStem({
    masculinizeAdjectiveStem: true,
    trimExtra: true
  });

  if (!stem) {
    // console.log(stem)
    if (true) {
      throw new Error("Stem not found for " + word.getBaseWord());
    }

    return;
  }
  /* Extreme irregularity (kýr, bróðir) */


  if (Object(tables_functions_patterns__WEBPACK_IMPORTED_MODULE_1__["isHighlyIrregular"])(word)) {
    wordIsIrregular = true;
    wordIsHighlyIrregular = true;
  }

  word.rows.forEach(row => {
    const form = row.inflectional_form;
    const form_without_ending = Object(tables_functions_patterns__WEBPACK_IMPORTED_MODULE_1__["removeInflectionalPattern"])(form, new tables_word__WEBPACK_IMPORTED_MODULE_2__["default"]([row], word));
    const consonants_in_stem = Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_0__["removeVowellikeClusters"])(stem);
    const consonants_in_form_without_ending = Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_0__["removeVowellikeClusters"])(form_without_ending);
    let output = form;
    let hasAnElision;
    /*
     * Test umlaut
     * TODO: Should we ignore umlauts in "maður -> menn"?
     */

    if (!form.startsWith(stem)) {
      let letters = Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_0__["splitOnVowels"])(form);
      const vowels_in_stem = Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_0__["getVowelClusters"])(stem) || [];
      const vowels_in_form_without_ending = Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_0__["getVowelClusters"])(form_without_ending) || [];
      /* Check two last vowels of stem */

      const vowel_indexes_to_check = [vowels_in_stem.length - 1, vowels_in_stem.length - 2].filter(i => i >= 0);
      vowel_indexes_to_check.forEach(vowel_index => {
        if (vowels_in_form_without_ending[vowel_index]) {
          /* There is an umlaut */
          if (vowels_in_stem[vowel_index] !== vowels_in_form_without_ending[vowel_index]) {
            const letter_index = (vowel_index + 1) * 2 - 1;
            letters[letter_index] = `<span class="umlaut">${letters[letter_index]}</span>`;
            wordHasUmlaut = true;
          }
        } else {
          /* Elision of "hamar -> hamri"*/
          // console.log({
          //   form,
          //   vowels_in_stem,
          //   vowels_in_form_without_ending
          // })
          hasAnElision = true;
        }
      });
      output = letters.join("");
    }

    if (hasAnElision) {
      output = `<span class="elision">${output}</span>`;
    }
    /* Test consonant change irregularity */


    if (!consonants_in_form_without_ending.startsWith(consonants_in_stem) &&
    /* Silly hack for "systir" */
    !consonants_in_stem.startsWith(consonants_in_form_without_ending) || wordIsHighlyIrregular) {
      output = `<em class="irregular">${output}</em>`;
      wordIsIrregular = true;
    }

    row.formattedOutput = output;
  });
  /* Save output into the original Word class */

  word.wordHasUmlaut = wordHasUmlaut || false;
  word.wordIsIrregular = wordIsIrregular || false;
} // /*
//
// todo: single vowel words
//
// */
// const findLeftoverAfterStem = (form, stem) => {
//   /**
//    * To find the difference from the stem we start by only looking at the consonants of the word
//    */
//   let consonants_in_stem = removeVowellikeClusters(stem)
//   let consonants_in_form = removeVowellikeClusters(form)
//
//   /**
//    * We then remove common inflectional endings if they come *after* the consonants of the stem.
//    * This prevents the "s" from being removed from "til pils"
//    */
//   if (consonants_in_form.startsWith(consonants_in_stem)) {
//     let stem_region_of_form = ''
//     let remaining_after_stem_part = ''
//     let current_consonant_index = 0
//     let done = false
//     splitOnAll(form).forEach(letter => {
//       if (!done) {
//         if (!isVowellikeCluster(letter)) {
//           current_consonant_index++
//           if (current_consonant_index >= consonants_in_stem.length) {
//             done = true
//           }
//         }
//         stem_region_of_form += letter
//       } else {
//         remaining_after_stem_part += letter
//       }
//       // console.log({letter,done,current_consonant_index,remaining_after_stem_part})
//     })
//     console.log({ form, consonants_in_stem, remaining_after_stem_part })
//   } else {
//     /**
//      * TODO:
//      * When inflection is highly irregular, check other siblings to see where vowel change is
//      * Or *dont't* highlight vowel change
//      */
//     if (process.env.NODE_ENV === 'development') {
//       // throw new Error('')
//     }
//   }
// }

/***/ }),

/***/ "./src/server/inflection/tables/functions/patterns.js":
/*!************************************************************!*\
  !*** ./src/server/inflection/tables/functions/patterns.js ***!
  \************************************************************/
/*! exports provided: removeInflectionalPattern, isHighlyIrregular */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeInflectionalPattern", function() { return removeInflectionalPattern; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isHighlyIrregular", function() { return isHighlyIrregular; });
/* harmony import */ var tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/classification/classification */ "./src/server/inflection/tables/classification/classification.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);



const splittableRegexEndingsFromArray = string => {
  return new RegExp(`(${string.sort((a, b) => b.length - a.length).join("|")})$`);
};
/**
 * Removes inflectional pattern and returns the rest
 * @param {string} input
 * @param {word} Word
 * @return {?string}
 */


const removeInflectionalPattern = (input, word) => {
  if (!input) return;
  let stripped = input;

  if (word.isAny("adjective", "past participle")
  /*|| word.is('with definite article')*/
  ) {
      stripped = input.replace(adjectiveEndings, "");
    } else if (word.is("verb")) {
    stripped = input.replace(verbEndings, "");
  } else if (word.is("noun")) {
    let possible_endings_for_gender = noun_endings[word.getType("gender")];
    /*[word.getType('plurality')][word.getType('article')]*/

    const sibling_classification = Object(lodash__WEBPACK_IMPORTED_MODULE_1__["without"])(word.getFirstClassification(), ...tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__["types"]["cases"]);
    const siblings = word.getOriginal().get(...sibling_classification).get(1);
    const word_case_index = tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__["types"]["cases"].indexOf(word.getType("case"));
    let ending = "";
    /* Find exact pattern matches for primary variants */

    if (word.is(1)) {
      const result = possible_endings_for_gender.find(pattern => {
        return pattern.every((ending, index) => {
          const case_ = tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__["types"]["cases"][index];
          const value = siblings.get(case_).getFirstValue();

          if (value) {
            return new RegExp(`${ending}$`).test(siblings.get(case_).getFirstValue());
          } else {
            if (true) {
              throw new Error(`Sure that there is no ${case_} for ${input}?`);
            }

            return true;
          }
        });
      });

      if (result) {
        ending = result[word_case_index]; // console.log('Found ending for ' + input)
        // console.log(result)
      } else {
        if (true) {
          throw new Error("!!!!!!! Did not find ending for " + input);
        }
      }
    } else {
      /* Secondary variants get just a quick check */
      const result = possible_endings_for_gender.map(pattern => pattern[word_case_index]).sort((a, b) => b.length - a.length).find(ending => {
        return new RegExp(`${ending}$`).test(input);
      });

      if (result) {
        ending = result;
      } else {// throw new Error('!!!!!!! Did not find ending for ' + input)
      }
    }

    stripped = input.replace(new RegExp(`(${ending})$`), "");
  }

  return stripped;
};
/*
  Helper function for above noun arrays
*/

const sortLongest = arrays => {
  return arrays.sort((a, b) => b.join("").length - a.join("").length);
};

const noun_endings = {
  masculine: sortLongest([// EINTALA
  // "bróðir"
  ["(ir)", "(ur)", "(ur)", "(ur)"], ["(ir)inn", "(ur)inn", "(ur)num", "(ur)ins"], // "plástur"
  ["(ur)", "(ur)", "(r)i", "(ur)s"], ["(ur)inn", "(ur)inn", "(ur)inum", "(ur)sins"], // "bátur"
  ["ur", "", "i", "s"], ["urinn", "inn", "num", "sins"], // "gangur"
  ["urinn", "inn", "inum", "sins"], // "hamar"
  ["inn", "inn", "inum", "sins"], // "hringur"
  ["ur", "", "", "s"], // "Egill"
  ["", "", "i", "s"], // "sjár"
  ["r", "", "", "var"], ["rinn", "inn", "num", "varins"], // "vinur"
  ["ur", "", "i", "ar"], ["urinn", "inn", "inum", "arins"], // "lækur"
  ["ur", "", "", "jar"], ["urinn", "inn", "num", "jarins"], // "matur"
  ["ur", "", "", "ar"], ["urinn", "inn", "num", "arins"], // "skjár"
  ["r", "", "", "s"], ["rinn", "inn", "num", "sins"], // "pabbi"
  ["i", "a", "a", "a"], ["inn", "ann", "anum", "ans"], // "ofn"
  ["", "", "i", "s"], ["inn", "inn", "inum", "sins"], // "bíll"
  ["", "", "", "s"], ["inn", "inn", "num", "sins"], // "morgunn"
  ["unn", "un", "ni", "uns"], ["unninn", "uninn", "ninum", "unsins"], // "bær"
  ["r", "", "", "jar"], ["rinn", "inn", "num", "jarins"], // FLEIRTALA
  // bátar" / "strákar"
  ["ar", "a", "um", "a"], ["arnir", "ana", "unum", "anna"], // "feður"
  ["ur", "ur", "rum", "ra"], ["urnir", "urna", "runum", "ranna"], // "hringur"
  ["ir", "i", "jum", "ja"], ["irnir", "ina", "junum", "janna"], // "vinir"
  ["ir", "i", "um", "a"], ["irnir", "ina", "unum", "anna"], // "morgunn"
  ["nar", "na", "num", "na"], ["narnir", "nana", "nunum", "nanna"], // "bændur"
  ["ur", "ur", "um", "a"], ["urnir", "urna", "unum", "anna"], // "menn"
  ["", "", "um", "a"], // "bæir"
  ["ir", "i", "jum", "ja"], ["irnir", "ina", "junum", "janna"]]),
  // Kvenkyn
  feminine: sortLongest([// EINTALA
  // systir
  ["ir", "ur", "ur", "ur"], ["irin", "urina", "urinni", "urinnar"], // "búð"
  ["", "", "", "ar"], ["in", "ina", "inni", "arinnar"], //  "kona"
  ["a", "u", "u", "u"], ["an", "una", "unni", "unnar"], // "elding"
  ["", "u", "u", "ar"], ["in", "una", "unni", "arinnar"], // "mjólk"
  ["", "", "", "ur"], ["in", "ina", "inni", "urinnar"], // "keppni"
  ["i", "i", "i", "i"], ["in", "ina", "inni", "innar"], // "á"
  ["", "", "", "r"], ["in", "na", "nni", "rinnar"], // FLEIRTALA
  // "systur"
  ["ur", "ur", "rum", "ra"], ["urnar", "urnar", "runum", "ranna"], // "stúlkur"
  ["ur", "ur", "um", "na"], ["urnar", "urnar", "unum", "nanna"], // "keppnir"
  ["nir", "nir", "num", "na"], ["nirnar", "nirnar", "nunum", "nanna"], // "búðir"
  ["ir", "ir", "um", "a"], ["irnar", "irnar", "unum", "anna"], // "persónur"
  ["ur", "ur", "um", "a"], ["urnar", "urnar", "unum", "anna"], // "vélar"
  ["ar", "ar", "um", "a"], ["arnar", "arnar", "unum", "anna"], // "bækur"
  ["ur", "ur", "um", "a"], ["urnar", "urnar", "unum", "anna"], // "dyr"
  ["", "", "um", "a"], ["nar", "nar", "unum", "anna"], // "ár"
  ["", "", "m", "a"], ["nar", "nar", "num", "nna"]]),
  // Hvorugkyn
  neuter: sortLongest([// EINTALA
  // "ríki"
  ["i", "i", "i", "s"], // "jójó"
  ["", "", "", "s"], // "barn"
  ["", "", "i", "s"], ["ið", "ið", "inu", "sins"], // "hjarta"
  ["a", "a", "a", "a"], ["að", "að", "anu", "ans"], // FLEIRTALA
  // "augu"
  ["u", "u", "um", "na"], ["un", "un", "unum", "nanna"], // "epli"
  ["i", "i", "um", "a"], ["in", "in", "unum", "anna"], // "börn"
  ["", "", "um", "a"], ["in", "in", "unum", "anna"], // "hjörtu"
  ["u", "u", "um", "a"], ["un", "un", "unum", "anna"]]) // masculine: {
  //   singular: {
  //     'with definite article': sortLongest([
  //       // "bróðir"
  //       ['(ir)', '(ur)', '(ur)', '(ur)'],
  //     ]),
  //     'without definite article': sortLongest([]),
  //   },
  //   plural: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  // },
  // feminine: {
  //   singular: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  //   plural: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  // },
  // neuter: {
  //   singular: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  //   plural: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  // },

};
const nounEndings = splittableRegexEndingsFromArray(["ri", "rið", "rinu", "rinum", "rum"]);
const adjectiveEndings = splittableRegexEndingsFromArray(["an", "anna", "ið", "in", "inn", "inna", "innar", "inni", "ins", "inu", "inum", "na", "nar", "ni", "nir", "nu", "num", "una", "unnar", "unni", "unum"]);
const verbEndings = splittableRegexEndingsFromArray(["ðu", "ið", "iði", "ir", "ist", "ju", "juð", "jum", "jumst", "just", "st", "uði", "um", "umst", "uð", "u", "i", "irðu", "juði", "usti", "justi", "istu", "andi", // Mediopassive
"isti", "usti"]);
const isHighlyIrregular = word => {
  if (word.is("noun")) {
    return isHighlyIrregularNouns.some(i => i.endsWith(word.getBaseWord()));
  }
};
const isHighlyIrregularNouns = [
/* Masculine */
"bróðir", "faðir", "fingur", "fótur", "maður", "vetur",
/* Feminine */
"ær", "dóttir", "hönd", "kýr", "lús", "mær", "móðir", "mús", "sýr", "systir"];

/***/ }),

/***/ "./src/server/inflection/tables/functions/principalParts.js":
/*!******************************************************************!*\
  !*** ./src/server/inflection/tables/functions/principalParts.js ***!
  \******************************************************************/
/*! exports provided: getPrincipalParts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPrincipalParts", function() { return getPrincipalParts; });
/**
 * Principal parts (kennimyndir)
 * @memberof Word
 * @return {?boolean}
 */
function getPrincipalParts() {
  if (this.is("verb")) {
    /* TODO: Support generation for miðmynd */
    const word = this.getOriginal(); // .without(
    //   'impersonal with accusative subject',
    //   'impersonal with dative subject',
    //   'impersonal with genitive subject',
    //   'impersonal with dummy subject'
    // ).get('active voice')

    let principalParts = [word.get("infinitive"), word.get(
    /*'indicative', */
    "past tense", "1st person", "singular"), word.isStrong() && word.get(
    /*'indicative',*/
    "past tense", "1st person", "plural"), word.get("supine")]; // console.log(this.getFirst().render())
    // console.log(this.get('past tense').rows.length/*.getFirst()/*.render()*/)

    return principalParts.filter(Boolean).map(i => i.getFirstAndItsVariants().render()).join(", ");
  }

  return "";
}

/***/ }),

/***/ "./src/server/inflection/tables/functions/stem.js":
/*!********************************************************!*\
  !*** ./src/server/inflection/tables/functions/stem.js ***!
  \********************************************************/
/*! exports provided: getStem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStem", function() { return getStem; });
/* harmony import */ var tables_functions_patterns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/functions/patterns */ "./src/server/inflection/tables/functions/patterns.js");
/* harmony import */ var tables_word__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tables/word */ "./src/server/inflection/tables/word.js");
/* harmony import */ var tables_functions_vowels__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tables/functions/vowels */ "./src/server/inflection/tables/functions/vowels.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);




/**
 * Gets the stem of a word. See: https://is.wikipedia.org/wiki/Stofn_(málfræði)
 *
 * @memberof Word
 * @param {object} options
 *   - masculinizeAdjectiveStem {boolean}
 *   - trimExtra {boolean}
 * @return {?string}
 */

function getStem(options) {
  let word = this;
  let selection;
  let output;

  if (this.is("noun")) {
    if (this.isStrong()) {
      selection = this.getOriginal().get("accusative"
      /*'without definite article', 'singular' */
      );
    } else {
      output = this.getOriginal().get("nominative"
      /*'without definite article', 'singular' */
      ).getFirstValue();
      output = Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_2__["removeLastVowelCluster"])(output);
    }
  }

  if (this.is("adjective")) {
    output = this.getOriginal().get("feminine"
    /* 'nominative', 'singular', 'positive degree', 'strong declension'*/
    ).getFirstValue(); // if (!output) return;

    /*
      For the purpose of highlighting umlauts,
      we want to get the stem with the vowel that's
      used in the masculine gender
    */

    if (output && options.masculinizeAdjectiveStem) {
      const stemLength = Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_2__["splitOnVowelRegions"])(output).filter(Boolean).length;
      let masculine = this.getOriginal().get("masculine", "nominative", "singular",
      /*'positive degree',*/
      "strong declension").getFirstValue();

      if (masculine) {
        return Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_2__["splitOnVowelRegions"])(masculine).filter(Boolean).slice(0, stemLength).join("");
      } else {
        // console.log(output)
        return output;
      }
    } else {// return output
    }
  } // if (this.is('numeral')) {
  //   output = this.getOriginal().get('feminine', 'nominative', 'singular').getFirstValue()
  // }


  if (this.is("verb")) {
    output = this.getOriginal().get("clipped imperative"
    /*'active voice'*/
    ).getFirstValue();
    /* Remove last vowel */

    if (this.isWeak()) {
      output = Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_2__["removeLastVowelCluster"])(output);
    } else {// return output
    }
  }

  if (this.isAny("numeral", "personal pronoun")) {
    output = this.getOriginal().getFirstValue();
  }

  if (selection) {
    output = selection.getFirstValue();
  }

  if (!output) {
    output = attemptToGenerateStem(word);
  }
  /* Trim even further */


  if (options && options.trimExtra && selection) {
    output = Object(tables_functions_patterns__WEBPACK_IMPORTED_MODULE_0__["removeInflectionalPattern"])(output, selection);
  }

  return output;
}
/*
  If no stem can be found, attempt to generate it by finding the most common region of unchanged consonants.
  Todo: May not work with singe letter words
*/

const attemptToGenerateStem = word => {
  let y = word.getOriginal().rows.map(row => Object(tables_functions_patterns__WEBPACK_IMPORTED_MODULE_0__["removeInflectionalPattern"])(row.inflectional_form, new tables_word__WEBPACK_IMPORTED_MODULE_1__["default"]([row], word)));
  let x = y.map(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_2__["removeVowellikeClusters"]);
  let shortest = Math.min(...x.map(i => i.length));
  let cut = x.map(i => i.slice(0, shortest));

  var mostCommonConsonantBeginning = lodash__WEBPACK_IMPORTED_MODULE_3___default.a.head(lodash__WEBPACK_IMPORTED_MODULE_3___default()(cut).countBy().entries().maxBy(lodash__WEBPACK_IMPORTED_MODULE_3___default.a.last));

  var firstVariantMatching = y.find(i => Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_2__["removeVowellikeClusters"])(i).slice(0, shortest));
  /* Find match based on consonants */

  let output = "";
  let current_consonant_index = 0;
  let done = false;
  firstVariantMatching && firstVariantMatching.split("").forEach(letter => {
    if (!done) {
      if (!Object(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_2__["isVowellikeCluster"])(letter)) {
        current_consonant_index++;

        if (current_consonant_index >= mostCommonConsonantBeginning.length) {
          done = true;
        }
      }

      output += letter;
    }
  });
  /* If the above failed, try to find match using vowels as well */

  if (!output) {
    let shortest2 = Math.min(...y.map(i => i.length));
    let cut2 = y.map(i => i.slice(0, shortest2));

    var mostCommonBeginning2 = lodash__WEBPACK_IMPORTED_MODULE_3___default.a.head(lodash__WEBPACK_IMPORTED_MODULE_3___default()(cut2).countBy().entries().maxBy(lodash__WEBPACK_IMPORTED_MODULE_3___default.a.last));

    return mostCommonBeginning2;
  } // if (word.isStrong()) {
  //
  // }


  return output;
};

/***/ }),

/***/ "./src/server/inflection/tables/functions/strong.js":
/*!**********************************************************!*\
  !*** ./src/server/inflection/tables/functions/strong.js ***!
  \**********************************************************/
/*! exports provided: isStrong, isWeak */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isStrong", function() { return isStrong; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWeak", function() { return isWeak; });
/* harmony import */ var tables_functions_vowels__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/functions/vowels */ "./src/server/inflection/tables/functions/vowels.js");

/**
 * Strong or weak inflection
 * TODO: Pronouns
 *
 * @memberof Word
 * @return {?boolean}
 */

function isStrong() {
  let results;

  if ("isStrong_saved" in this) {
    return this.isStrong_saved;
  }
  /* Noun */


  if (this.is("noun")) {
    const table_to_check = this.getOriginal().get("singular", "without definite article", 1).getForms();
    if (table_to_check.length === 0) return;
    results = table_to_check.some(tables_functions_vowels__WEBPACK_IMPORTED_MODULE_0__["endsInConsonant"]);
  } else if (this.is("verb")) {
    /* Verb */
    // const word = this.getOriginal().without(
    //   'impersonal with accusative subject',
    //   'impersonal with dative subject',
    //   'impersonal with genitive subject',
    //   'impersonal with dummy subject'
    // ).get('active voice')
    const past_tense = this.get(
    /*'indicative', */
    "past tense"
    /*'1st person', 'singular'*/
    ).getFirstValue();
    /* Does not end in "-i" */

    results = !/i$/.test(past_tense);
  }

  this.isStrong_saved = results;
  return results;
}
/**
 * Opposite of the above
 *
 * @memberof Word
 * @return {?boolean}
 */

function isWeak() {
  const strong = this.isStrong();

  if (strong !== undefined) {
    return !strong;
  }
}

/***/ }),

/***/ "./src/server/inflection/tables/functions/vowels.js":
/*!**********************************************************!*\
  !*** ./src/server/inflection/tables/functions/vowels.js ***!
  \**********************************************************/
/*! exports provided: characters, vowels, dipthongs, vowellike_clusters, endsInVowel, endsInConsonant, splitOnVowels, splitOnVowelRegions, getVowelClusters, splitOnAll, isVowellikeCluster, removeLastVowelCluster, removeVowellikeClusters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "characters", function() { return characters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vowels", function() { return vowels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dipthongs", function() { return dipthongs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vowellike_clusters", function() { return vowellike_clusters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "endsInVowel", function() { return endsInVowel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "endsInConsonant", function() { return endsInConsonant; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "splitOnVowels", function() { return splitOnVowels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "splitOnVowelRegions", function() { return splitOnVowelRegions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVowelClusters", function() { return getVowelClusters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "splitOnAll", function() { return splitOnAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isVowellikeCluster", function() { return isVowellikeCluster; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeLastVowelCluster", function() { return removeLastVowelCluster; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeVowellikeClusters", function() { return removeVowellikeClusters; });
/* harmony import */ var tables_word__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/word */ "./src/server/inflection/tables/word.js");
/*
  Various helper functions
*/

const characters = "a-záéíóúýðþæö";
const vowels = "aeiouyáéíóúýæö";
const dipthongs = "au|e[yi]";
const vowellike_clusters = `au|e[yi]|j[auúóöyi]`; // Umlaut (hljóðvarp) and Germanic a-mutation (klofning)

const endsInVowel = input => {
  let string;

  if (input instanceof tables_word__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    string = input.getFirstValue();
  } else {
    string = input;
  } // if (typeof string !== 'string') throw new Error('endsInVowel expected string');


  return string && new RegExp(`[${vowels}]$`, "i").test(string);
};
const endsInConsonant = string => {
  // if (typeof string !== 'string') throw new Error('endsInConsonant expected string');
  return !endsInVowel(string);
};
const splitOnVowels = string => {
  // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
  return string && string.split(new RegExp(`(${vowellike_clusters}|[${vowels}])`, "ig"));
};
const splitOnVowelRegions = string => {
  // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
  return string && string.split(new RegExp(`(${vowellike_clusters}|[${vowels}]+)`, "ig"));
};
const getVowelClusters = string => {
  // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
  return string && string.match(new RegExp(`(${vowellike_clusters}|[${vowels}])`, "ig"));
};
const splitOnAll = string => {
  // if (typeof string !== 'string') throw new Error('splitOnAll expected string');
  return string && string.split(new RegExp(`(${vowellike_clusters}|[${characters}])`, "i")).filter(Boolean);
};
const isVowellikeCluster = string => {
  // if (typeof string !== 'string') throw new Error('splitOnAll expected string');
  return new RegExp(`(${vowellike_clusters}|[${vowels}]+)`, "i").test(string);
};
const removeLastVowelCluster = string => {
  // if (typeof string !== 'string') throw new Error('removeLastVowelCluster expected string');
  return string && string.replace(new RegExp(`(${vowellike_clusters}|[${vowels}]+)$`, "i"), "");
};
const removeVowellikeClusters = string => {
  return string && string.replace(new RegExp(`(${vowellike_clusters}|[${vowels}]+)`, "ig"), "");
};

/***/ }),

/***/ "./src/server/inflection/tables/functions/wordDescription.js":
/*!*******************************************************************!*\
  !*** ./src/server/inflection/tables/functions/wordDescription.js ***!
  \*******************************************************************/
/*! exports provided: getWordDescription */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWordDescription", function() { return getWordDescription; });
/* harmony import */ var tables_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/link */ "./src/server/inflection/tables/link.js");

/**
 * @memberof Word
 * @return {?string}
 */

function getWordDescription() {
  let output = [];
  output.push(this.getDomain());
  output.push(
  /* Gender for nouns */
  (this.is("noun") ? Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])(this.getType("gender")) + " " : "") +
  /* Word class */
  Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])(this.getType("class")));
  const isStrong = this.isStrong();

  if (isStrong === true) {
    output.push(Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])("strongly conjugated"));
  } else if (isStrong === false) {
    output.push(Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])("weakly conjugated"));
  }

  if (this.getIsWordIrregular()) {
    output.push(Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])("irregular inflection"));
  }

  if (this.getWordHasUmlaut()) {
    output.push(Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])("includes a sound change"));
  }

  if (!this.is("indeclinable") && this.getIsWordIrregular() === false && this.getWordHasUmlaut() === false) {
    output.push(Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])("regular inflection"));
  }

  output = output.filter(Boolean).join(", ");
  return output;
}

/***/ }),

/***/ "./src/server/inflection/tables/functions/wordNotes.js":
/*!*************************************************************!*\
  !*** ./src/server/inflection/tables/functions/wordNotes.js ***!
  \*************************************************************/
/*! exports provided: getWordNotes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWordNotes", function() { return getWordNotes; });
/**
 * @memberof Word
 * @return {?string}
 */
function getWordNotes() {
  let notes = [];

  switch (this.original.rows[0].correctness_grade_of_word) {
    case "0":
      notes.push(`This word is not used in modern Icelandic`);
      break;

    case "2":
      notes.push(`This word is not considered to be proper standard Icelandic`);
      break;

    case "3":
      notes.push(`Don't use this word, it considered to be incorrect`);
      break;

    case "4":
      notes.push(`Never use this word, it considered to be incorrect`);
      break;
  }

  if (notes.length > 0) {
    return '<div class="note"><b>Note:</b> ' + notes.join("<br/>") + "</div>";
  }

  return "";
}

/***/ }),

/***/ "./src/server/inflection/tables/index.js":
/*!***********************************************!*\
  !*** ./src/server/inflection/tables/index.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tables_word__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/word */ "./src/server/inflection/tables/word.js");
/* harmony import */ var tables_classification_classification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tables/classification/classification */ "./src/server/inflection/tables/classification/classification.js");
/* harmony import */ var tables_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tables/link */ "./src/server/inflection/tables/link.js");
/* harmony import */ var server_inflection_tables_classification_sort_by_classification__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! server/inflection/tables/classification/sort_by_classification */ "./src/server/inflection/tables/classification/sort_by_classification.js");




/* harmony default export */ __webpack_exports__["default"] = ((rows, options, more_options
/* todo: merge */
) => {
  let give_me = options && options.give_me;
  let column_names = options && (options.columns || options.column_names);
  let row_names = options && (options.rows || options.row_names);
  let input_string = more_options && more_options.input_string; // console.log(rows.slice(0,10))
  // rows = rows.filter(row => row.correctness_grade_of_inflectional_form == 1

  let word = new tables_word__WEBPACK_IMPORTED_MODULE_0__["default"](rows.sort(server_inflection_tables_classification_sort_by_classification__WEBPACK_IMPORTED_MODULE_3__["sort_by_classification"])); // .highlight(input_string) // temp
  // console.log('hah')
  // const word = (new Word()).importTree(rows)
  // console.log(word)

  let table;

  if (give_me || column_names || row_names) {
    give_me = clean__temporary(give_me);
    column_names = cleanRowOrColum__temporary(column_names);
    row_names = cleanRowOrColum__temporary(row_names);
    word = word.get(...give_me);

    if (word.rows.length > 0) {
      table = word.getSingleTable({
        give_me,
        column_names,
        row_names
      });
    } else {
      table = `<b>Error:</b> No rows found with the requested values`;
    }
  } else {
    table = word.getTables();
  }

  return `
    <div class="inflection">
      <div class="main">
        <h4 class="base_word">
          ${// TODO: Generate base word instead of this
  word.is("verb") ? `<span class=gray>að</span>` : ""}
          ${word.getBaseWord()}
        </h4>
        <div class="word_description">${word.getWordDescription()}</div>
        <div>${word.getWordNotes()}</div>
        <div class="principal_parts">${word.getPrincipalParts() ? `
            <span hidden>${Object(tables_link__WEBPACK_IMPORTED_MODULE_2__["default"])("Principal parts")}:</span>
            ${word.getPrincipalParts()}
          ` : ""}</div>

        ${table}
      </div>
      <div class="license">
        <a href="https://bin.arnastofnun.is/beyging/${word.getId()}" target="_blank">View on BÍN</a> •
        <a href="https://ylhyra.is/Project:Inflections" class="info" target="_blank">About</a> •
        <a href="https://github.com/ylhyra/icelandic-inflections#readme" target="_blank">API</a>
        <hr/>
        <div>Data from the <em><a href="https://bin.arnastofnun.is/DMII/LTdata/k-format/" rel="nofollow">Database of Modern Icelandic Inflection</a></em> (DMII), or <em>Beygingarlýsing íslensks nútímamáls</em> (BÍN), by the Árni Magnússon Institute for Icelandic Studies. The author and editor of DMII is <a href="https://www.arnastofnun.is/is/stofnunin/starfsfolk/kristin-bjarnadottir" rel="nofollow">Kristín Bjarnadóttir</a>. (<a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow">CC BY-SA 4.0</a>)</div>
      </div>
    </div>
  `;
});
/*
  Temporary helper functions, need to be moved elsewhere
  returns array
*/

const cleanRowOrColum__temporary = string => {
  if (!string) return;
  /* If someone enters "cases" the rest is filled out */

  if (string in tables_classification_classification__WEBPACK_IMPORTED_MODULE_1__["types"]) return tables_classification_classification__WEBPACK_IMPORTED_MODULE_1__["types"][string]; // /* Should be made to work in the future */

  return string.split(";").map(clean__temporary);
};

const clean__temporary = string => {
  if (!string) return [];
  return string.replace(/_/g, " ").split(",").map(tables_classification_classification__WEBPACK_IMPORTED_MODULE_1__["normalizeTag"]).filter(Boolean);
};

/***/ }),

/***/ "./src/server/inflection/tables/link.js":
/*!**********************************************!*\
  !*** ./src/server/inflection/tables/link.js ***!
  \**********************************************/
/*! exports provided: default, removeLinks, stripHTML, ucfirst, ucfirst_link */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeLinks", function() { return removeLinks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stripHTML", function() { return stripHTML; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ucfirst", function() { return ucfirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ucfirst_link", function() { return ucfirst_link; });
/* harmony import */ var tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/classification/classification */ "./src/server/inflection/tables/classification/classification.js");

/*
  Creates a link from our labels to relevant Ylhýra pages
*/

/* harmony default export */ __webpack_exports__["default"] = ((link, label) => {
  if (!link || typeof link !== "string") return "";

  if (label === undefined) {
    label = link;
  } else if (!label) {
    return "";
  }
  /* Retrieve additional info from "classification.js" file */


  const info = Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_0__["getTagInfo"])(link, false);

  if (info) {
    if (info.has_article_on_ylhyra) {
      link = info.title;
    } else {
      /* Link does not exist */
      return label;
    }
  }
  /* Link does not exist */


  if (missing_links.includes(link)) {
    return label;
  }

  const url = "https://ylhyra.is/" + encodeURIComponent(ucfirst(link.trim().replace(/( )/g, "_")));
  return `<a class="plainlink" target="_blank" href="${url}">${label}</a>`;
});
const removeLinks = string => {
  return string && string.replace(/<\/a>/g, "").replace(/<a .+?>/g, "");
};
const stripHTML = string => {
  return string && string.replace(/<\/[a-z]+>/g, "").replace(/<[a-z]+ ?([^>]+)?>/g, "").replace(/\s+/g, " ").trim();
};
const ucfirst = input => input && input.charAt(0).toUpperCase() + input.slice(1);
const ucfirst_link = input => input = input.replace(/^(?:<a .+?>)?(.)/, part => {
  let split = part.split("");
  split[split.length - 1] = ucfirst(split[split.length - 1]);
  return split.join("");
});
let missing_links = ["irregular inflection", "includes a sound change", "regular inflection", "strongly conjugated", "weakly conjugated", "helper words for the article"];

/***/ }),

/***/ "./src/server/inflection/tables/render_table.js":
/*!******************************************************!*\
  !*** ./src/server/inflection/tables/render_table.js ***!
  \******************************************************/
/*! exports provided: default, renderCell */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderCell", function() { return renderCell; });
/* harmony import */ var tables_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/link */ "./src/server/inflection/tables/link.js");
/* harmony import */ var tables_word__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tables/word */ "./src/server/inflection/tables/word.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);



/*
  Wrapper for "RenderTable", creates two alternative versions of the input,
  one original and one by splitting each column into its own table
  to make them fit on small screens
*/

const AlsoMakeTablesThatFitOnSmallScreens = (input, original_word, structure, highlight) => {
  let {
    column_names,
    row_names
  } = structure;
  column_names = column_names || [null];
  row_names = row_names || [null];
  let output = "";
  let differentOnSmallerScreens = column_names.length > 1;
  output += `<div class="${differentOnSmallerScreens ? "for_large_screens" : ""}">` + RenderTable(input, original_word, {
    column_names,
    row_names
  }, highlight) + "</div>";

  if (differentOnSmallerScreens) {
    output += `<div class="for_small_screens" hidden>` + column_names.map(column_name => {
      return RenderTable(input, original_word, {
        column_names: [column_name],
        row_names
      }, highlight);
    }).join("") + "</div>";
  }

  return output;
};

/* harmony default export */ __webpack_exports__["default"] = (AlsoMakeTablesThatFitOnSmallScreens);
/**
 * RenderTable - Converts description of table structure into a table
 *
 * @param {object|Word} input
 *   Can either be:
 *   - a leaf from ./tree.js on the form { tag: 'nominative', values: [] }
 *   - a Word
 * @param {Word} original_word
 *   If the first parameter is a leaf, we need to pass the original word
 *   as well so that we have all the information needed
 * @param {object} structure
 *   An object with the keys `column_names` and `row_names`,
 *   which are arrays describing what  they should contain:
 *   {
 *     column_names: types['plurality'],
 *     row_names: types['person']
 *   }
 * @returns {string} HTML string
 */

const RenderTable = (input, original_word, structure, highlight) => {
  const {
    column_names,
    row_names
  } = structure;
  let word;

  if (input instanceof tables_word__WEBPACK_IMPORTED_MODULE_1__["default"]) {
    word = input;
  } else {
    word = Object(tables_word__WEBPACK_IMPORTED_MODULE_1__["WordFromTree"])(input, original_word);
  }

  let table = [];
  row_names.forEach((row_name, row_index) => {
    /* Add column names */
    if (row_index === 0 && column_names[0] !== null) {
      let column = [];
      column.push(null);
      column_names.forEach(column_name => {
        column.push(column_name);
      });
      table.push(column);
    }
    /* Loop over data */


    let column = [];
    column_names.forEach((column_name, column_index) => {
      /* Add row names */
      if (column_index === 0) {
        column.push(row_name);
      }

      column.push(word.get(column_name, row_name).getFirstAndItsVariants());
    });
    table.push(column);
  });
  return TableHTML(table, highlight);
};

const TableHTML = (rows, highlight = []) => {
  return `
    <table class="table">
      <tbody>
        ${rows.map((row, row_index) => `
          <tr>
            ${row.map((cell, column_index) => {
    if (cell instanceof tables_word__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      const shouldHighlight = highlight && highlight.length > 0 ? cell.is(...highlight) : true;
      return renderCell(cell, shouldHighlight);
    } else {
      let isCellToTheLeftEmpty = rows[row_index][column_index - 1] === null;
      let isCellAboveEmpty = rows[row_index - 1] && rows[row_index - 1][column_index] === null;
      let css_class = isCellAboveEmpty || isCellToTheLeftEmpty ? "first-top" : "";
      /* Flatten to support multiple at once */

      let i = Object(lodash__WEBPACK_IMPORTED_MODULE_2__["flatten"])([cell]);
      i[0] = Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["ucfirst"])(i[0]);
      i = i.map(u => Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])(u)).join(", ");
      return `<th colSpan="2" class="${css_class}">${i || ""}</th>`;
    }
  }).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
};

const renderCell = (word, shouldHighlight) => {
  /* No value */
  if (word.rows.length === 0) {
    return '<td colSpan="2">–</td>';
  }
  /*
   * Make sure only variants of the same are passed on, in case multiple were accidentally passed on
   */


  if (word.rows.length > 1) {
    word = word.getFirstAndItsVariants();
  }

  const value = word.rows.map((row, index) => {
    return `<span>` + (row.formattedOutput || row.inflectional_form) + (index + 1 < word.rows.length ? `<span class="light-gray"> / </span>` : "") + `</span>`;
  }).join("");
  return `
    <td class="right ${shouldHighlight ? "highlight" : ""}"><span class="gray">${word.getHelperWordsBefore()}</span></td>
    <td class="left ${shouldHighlight ? "highlight" : ""}">
      <b>${value}</b><span class="gray">${word.getHelperWordsAfter()}</span>
    </td>
  `;
};

/***/ }),

/***/ "./src/server/inflection/tables/tables_all.js":
/*!****************************************************!*\
  !*** ./src/server/inflection/tables/tables_all.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return getTables; });
/* harmony import */ var tables_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/link */ "./src/server/inflection/tables/link.js");
/* harmony import */ var tables_word__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tables/word */ "./src/server/inflection/tables/word.js");
/* harmony import */ var tables_render_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tables/render_table */ "./src/server/inflection/tables/render_table.js");
/* harmony import */ var tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tables/classification/classification */ "./src/server/inflection/tables/classification/classification.js");
/* harmony import */ var tables_tree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tables/tree */ "./src/server/inflection/tables/tree.js");





/**
 * getTables - Prints all tables for a given word
 *
 * @memberof Word
 * @return {string} HTML as string
 */

function getTables() {
  return TraverseTree(this.getTree(), this);
}
/**
 * TraverseTree - Recursively goes through the tree from ./tree.js and prints all tables
 *
 * @param {object} leaf - Leaf from ./tree.js on the form { tag: 'nominative', values: [] }
 * @param {Word} original_word
 * @return {string} HTML as string
 */

const TraverseTree = (leaf, original_word) => {
  let table = null;
  const word = Object(tables_word__WEBPACK_IMPORTED_MODULE_1__["WordFromTree"])(leaf, original_word);
  /* Nouns */

  if (word.is("noun") && tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["plurality"].includes(leaf.tag)) {
    table = Object(tables_render_table__WEBPACK_IMPORTED_MODULE_2__["default"])(leaf.values, original_word, {
      column_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["article"],
      row_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["cases"]
    });
  } else if (
  /* Pronouns */
  (word.is("pronoun") || word.is("article")) && tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["plurality"].includes(leaf.tag)) {
    table = Object(tables_render_table__WEBPACK_IMPORTED_MODULE_2__["default"])(leaf.values, original_word, {
      column_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["gender"],
      row_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["cases"]
    });
  } else if (word.is("personal pronoun")) {
    /* Personal pronouns */
    table = Object(tables_render_table__WEBPACK_IMPORTED_MODULE_2__["default"])(leaf.values, original_word, {
      column_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["plurality"],
      row_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["cases"]
    });
  } else if (word.is("reflexive pronoun")) {
    /* Reflexive pronouns */
    table = Object(tables_render_table__WEBPACK_IMPORTED_MODULE_2__["default"])(leaf.values, original_word, {
      column_names: [null],
      row_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["cases"]
    });
  } else if (
  /* Adjectives */
  (word.is("adjective") || word.is("past participle") || word.is("ordinal number") || word.is("numeral")) && tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["plurality"].includes(leaf.tag)) {
    table = Object(tables_render_table__WEBPACK_IMPORTED_MODULE_2__["default"])(leaf.values, original_word, {
      column_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["gender"],
      row_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["cases"]
    });
  } else if (
  /* Verbs */
  word.is("verb") && tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["tense"].includes(leaf.tag) && !word.is("question form") && !word.is("infinitive")) {
    /* Dummy subjects */
    if (word.is("impersonal with dummy subject")) {
      table = Object(tables_render_table__WEBPACK_IMPORTED_MODULE_2__["default"])(leaf.values, original_word, {
        column_names: ["singular"],
        row_names: ["3rd person"]
      });
    } else {
      /* Regular table */
      table = Object(tables_render_table__WEBPACK_IMPORTED_MODULE_2__["default"])(leaf.values, original_word, {
        column_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["plurality"],
        row_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["person"]
      });
    }
  } else if (leaf.tag === "imperative") {
    /* Imperative */
    table = Object(tables_render_table__WEBPACK_IMPORTED_MODULE_2__["default"])(leaf.values, original_word, {
      column_names: [null],
      row_names: ["singular", "plural", "clipped imperative"]
    });
  } else if (word.is("question form") && tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["tense"].includes(leaf.tag)) {
    table = Object(tables_render_table__WEBPACK_IMPORTED_MODULE_2__["default"])(leaf.values, original_word, {
      column_names: tables_classification_classification__WEBPACK_IMPORTED_MODULE_3__["types"]["plurality"],
      row_names: ["2nd person"]
    });
  }

  let output = table;

  if (!output) {
    /*
      Go deeper
    */
    if (leaf.values && !LeafOnlyContainsVariants(leaf.values)) {
      output = leaf.values.map(i => TraverseTree(i, original_word)).join("");
    } else {
      /*
        No table was created above,
        generate a simple field
      */
      let rows = leaf.values || [leaf];
      /* For supine of "geta" */

      output = `<table class="table not-center"><tbody><tr>${Object(tables_render_table__WEBPACK_IMPORTED_MODULE_2__["renderCell"])(new tables_word__WEBPACK_IMPORTED_MODULE_1__["default"](rows, original_word))}</tr></tbody></table>`;
    }
  }

  if (leaf.tag) {
    return `<dl class="indent">
      <dt>${Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(tables_link__WEBPACK_IMPORTED_MODULE_0__["ucfirst"])(leaf.tag))}</dt>
      <dd>${output}</dd>
    </dl>`;
  } else {
    return output;
  }
};
/**
 * If a leaf only contains a single form and its variants,
 * we want to be able to group them together.
 * Created to handle the supine of "geta".
 */


const LeafOnlyContainsVariants = array => {
  let first = array[0];
  if (!first || !first.inflectional_form_categories) return;
  let match = first.inflectional_form_categories.filter(i => !Object(tables_tree__WEBPACK_IMPORTED_MODULE_4__["isNumber"])(i));
  return array.slice(1).every(row => row.inflectional_form_categories && match.length === row.inflectional_form_categories.length - 1 && // -1 to remove number
  match.every((value, index) => value === row.inflectional_form_categories[index]));
};

/***/ }),

/***/ "./src/server/inflection/tables/tables_single.js":
/*!*******************************************************!*\
  !*** ./src/server/inflection/tables/tables_single.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return getSingleTable; });
/* harmony import */ var tables_render_table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/render_table */ "./src/server/inflection/tables/render_table.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tables_classification_classification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tables/classification/classification */ "./src/server/inflection/tables/classification/classification.js");
/* harmony import */ var tables_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tables/link */ "./src/server/inflection/tables/link.js");
/* harmony import */ var tables_tree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tables/tree */ "./src/server/inflection/tables/tree.js");





/**
 * Finds a single relevant table
 *
 * @memberof Word
 * @return {string} HTML as string
 */

function getSingleTable({
  returnAsString,
  give_me,
  column_names,
  row_names
}) {
  let word = this;
  let description = "";
  let table = "";

  if (give_me && give_me.length > 0) {
    word = word.get(...give_me);
  }

  if (!column_names && !row_names) {
    /* Nouns */
    if (word.is("noun")) {
      row_names = tables_classification_classification__WEBPACK_IMPORTED_MODULE_2__["types"]["cases"];
    } else if (word.is("adjective")) {
      if (word.getFirst().is("nominative")) {
        if (word.getType("degree") === "positive degree") {
          row_names = tables_classification_classification__WEBPACK_IMPORTED_MODULE_2__["types"]["genders"];
        } else {
          row_names = tables_classification_classification__WEBPACK_IMPORTED_MODULE_2__["types"]["degree"];
        }
      } else {
        row_names = tables_classification_classification__WEBPACK_IMPORTED_MODULE_2__["types"]["cases"];
      }
    } else if (word.is("adverb") && word.getType("degree")) {
      row_names = tables_classification_classification__WEBPACK_IMPORTED_MODULE_2__["types"]["degree"];
    } else if (word.is("verb")) {
      /* Temp: Needs to be merged with the principalParts file */

      /* TODO: Support generation for miðmynd */
      const word2 = this.getOriginal();
      let principalParts = [word2.get("infinitive").getFirstClassification(), word2.get(
      /*'indicative', */
      "past tense", "1st person", "singular").getFirstClassification(), word2.isStrong() && word2.get(
      /*'indicative',*/
      "past tense", "1st person", "plural").getFirstClassification(), word2.get("supine").getFirstClassification()].filter(Boolean);
      row_names = principalParts;

      if (give_me && give_me.length > 0) {
        /* The matched part is in the principal parts */
        if (principalParts.find(principalPart => give_me.every((giveMeItem, index) => giveMeItem === principalPart[index]))) {
          /* */
        } else {
          // let row_names = ['infinitive']
          // ['infinitive', relevant_word.getType('voice')].filter(Boolean),
          if (word.getFirst().getType("person")) {
            row_names = ["infinitive", ...tables_classification_classification__WEBPACK_IMPORTED_MODULE_2__["types"]["persons"]];
          } else {
            /* Nothing but infinitive and word */
            row_names = ["infinitive", give_me];
          } // if (relevant_word.getType('person')) {
          //   row_names = [
          //     ['infinitive', relevant_word.getType('voice')].filter(Boolean),
          //     ...types['persons'],
          //   ]
          // }

        }
      }
    }
  }

  column_names = column_names || [null];
  row_names = row_names || [null];

  if (give_me && give_me.length > 0) {
    word = word.get(...give_me);
  } else {
    word = word.getMeetingAny(...row_names, ...column_names);
  } // const sibling_classification = without(word.getFirstClassification(), ...flatten(row_names), ...flatten(column_names))
  // const siblings = word.getOriginal().get(sibling_classification)

  /* As string */


  if (returnAsString) {
    return row_names.map(c => word.getMostRelevantSibling(c)).map(i => i.getFirstAndItsVariants().render()).filter(Boolean).join(", ");
  } else {
    /* As table */

    /* TEMPORARY; MERGE WITH ABOVE */
    const sibling_classification = Object(lodash__WEBPACK_IMPORTED_MODULE_1__["without"])(word.getFirstClassification(), ...Object(lodash__WEBPACK_IMPORTED_MODULE_1__["flatten"])(row_names), ...Object(lodash__WEBPACK_IMPORTED_MODULE_1__["flatten"])(column_names));
    const siblings = word.getOriginal().get(sibling_classification);
    table = Object(tables_render_table__WEBPACK_IMPORTED_MODULE_0__["default"])(siblings, word.getOriginal(), {
      column_names,
      row_names
    }, give_me);
    description = Object(tables_link__WEBPACK_IMPORTED_MODULE_3__["ucfirst_link"])(sibling_classification.map(i => Object(tables_link__WEBPACK_IMPORTED_MODULE_3__["default"])(i)).join(", "));
    let output;

    if (description) {
      output = `<dl class="indent">
        <dt>${description}</dt>
        <dd>${table}</dd>
      </dl>`;
    } else {
      output = table;
    }

    return output + `<a href="https://inflections.ylhyra.is/${encodeURIComponent(word.getBaseWord())}/${word.getId()}"><b>Show all tables</b></a>`;
  }
}

/***/ }),

/***/ "./src/server/inflection/tables/tree.js":
/*!**********************************************!*\
  !*** ./src/server/inflection/tables/tree.js ***!
  \**********************************************/
/*! exports provided: isNumber, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNumber", function() { return isNumber; });
/* harmony import */ var tables_classification_sort_by_classification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/classification/sort_by_classification */ "./src/server/inflection/tables/classification/sort_by_classification.js");

/**
 * Turns rows into nested tree, with each leaf containing
 * a collection of items that have the same classification
 *
 * @param {array} rows - Raw list of rows with classifications from ./classification/BIN_classification.js
 * @returns {object}
 * The tree is on the form:
 *   {
 *     values: [{
 *       tag: 'singular',
 *       values: [{
 *         tag: 'nominative',
 *         values: []
 *       }]
 *     }]
 *   }
 *
 */

const tree = rows => {
  let output = {
    BIN_id: rows[0] && rows[0].BIN_id,
    base_word: rows[0] && rows[0].base_word,
    correctness_grade_of_word: rows[0] && rows[0].correctness_grade_of_word,
    word_register: rows[0] && rows[0].word_register,
    word_categories: rows[0] && rows[0].word_categories,
    values: []
  }; // console.log(rows.slice(0,3))

  rows.forEach(row => {
    let currentArray = output.values;
    row.inflectional_form_categories.forEach(tag => {
      const alreadyExists = currentArray.find(i => i.tag === tag);

      if (alreadyExists) {
        currentArray = alreadyExists.values;
      } else if (!isNumber(tag)) {
        currentArray.push({
          tag,
          values: []
        });
        currentArray = currentArray[currentArray.length - 1].values;
      } else {
        /* Tag is number, indicating variant */
        currentArray.push({
          inflectional_form_categories: row.inflectional_form_categories,
          word_categories: row.word_categories,
          variant_number: parseInt(tag),
          inflectional_form: row.inflectional_form,
          should_be_taught: row.should_be_taught,
          correctness_grade_of_inflectional_form: row.correctness_grade_of_inflectional_form,
          register_of_inflectional_form: row.register_of_inflectional_form,
          formattedOutput: row.formattedOutput // various_feature_markers: row.various_feature_markers,

        });
      }
    });
  });
  output = TraverseAndSort(output);
  return output;
};
/**
 * Sort tree based on the list `sorted_tags` array in ./classification/BIN_classification.js
 */


const TraverseAndSort = input => {
  if (Array.isArray(input)) {
    return input.sort(tables_classification_sort_by_classification__WEBPACK_IMPORTED_MODULE_0__["sort_by_classification"]).map(TraverseAndSort);
  } else if (input.values) {
    // console.log(input.values.slice(0,3))
    return { ...input,
      values: input.values.sort(tables_classification_sort_by_classification__WEBPACK_IMPORTED_MODULE_0__["sort_by_classification"]).map(TraverseAndSort)
    };
  } else {
    return input;
  }
};

const isNumber = string => {
  return typeof string === "number" || /^\d+$/.test(string + "");
};
/* harmony default export */ __webpack_exports__["default"] = (tree);

/***/ }),

/***/ "./src/server/inflection/tables/word.js":
/*!**********************************************!*\
  !*** ./src/server/inflection/tables/word.js ***!
  \**********************************************/
/*! exports provided: WordFromTree, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WordFromTree", function() { return WordFromTree; });
/* harmony import */ var tables_tables_all__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tables/tables_all */ "./src/server/inflection/tables/tables_all.js");
/* harmony import */ var tables_tables_single__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tables/tables_single */ "./src/server/inflection/tables/tables_single.js");
/* harmony import */ var tables_tree__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tables/tree */ "./src/server/inflection/tables/tree.js");
/* harmony import */ var tables_functions_helperWords__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tables/functions/helperWords */ "./src/server/inflection/tables/functions/helperWords.js");
/* harmony import */ var tables_functions_principalParts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tables/functions/principalParts */ "./src/server/inflection/tables/functions/principalParts.js");
/* harmony import */ var tables_functions_wordDescription__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tables/functions/wordDescription */ "./src/server/inflection/tables/functions/wordDescription.js");
/* harmony import */ var tables_functions_wordNotes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tables/functions/wordNotes */ "./src/server/inflection/tables/functions/wordNotes.js");
/* harmony import */ var tables_functions_stem__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! tables/functions/stem */ "./src/server/inflection/tables/functions/stem.js");
/* harmony import */ var tables_functions_strong__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! tables/functions/strong */ "./src/server/inflection/tables/functions/strong.js");
/* harmony import */ var tables_functions_discard__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! tables/functions/discard */ "./src/server/inflection/tables/functions/discard.js");
/* harmony import */ var tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! tables/classification/classification */ "./src/server/inflection/tables/classification/classification.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var tables_functions_irregularities__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! tables/functions/irregularities */ "./src/server/inflection/tables/functions/irregularities.js");
/* harmony import */ var tables_classification_BIN_classification__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! tables/classification/BIN_classification */ "./src/server/inflection/tables/classification/BIN_classification.js");















class Word {
  /**
   * @param {array} rows
   * @param {?Word} original
   */
  constructor(rows, original) {
    if (!Array.isArray(rows) && rows !== undefined) {
      // console.log(rows)
      throw new Error(`Class "Word" expected parameter "rows" to be an array or undefined, got ${typeof rows}`);
    }

    rows = rows || [];
    /* Test for broken input */

    if (!original) {
      if (!rows.every(row => {
        return typeof row === "object" && "inflectional_form_categories" in row;
      })) throw new Error("Malformed input to Word");
    }

    rows = Object(tables_functions_discard__WEBPACK_IMPORTED_MODULE_9__["discardUnnecessaryForms"])(rows);
    this.rows = rows;

    if (original instanceof Word) {
      this.original = original.original;
    } else if (original) {
      // console.log(original)
      throw new Error("Expected original to be a Word");
    } else {
      this.original = this;
    }

    if (rows && !original) {
      if (this.rows.length === 0) {
        if (true) {
          throw new Error("Word created with empty rows");
        }
      }

      this.setup(); // console.log(this.rows.map(r => r.formattedOutput))
    }
  }

  setup() {
    // console.log(this.rows[0])
    if ("alreadySetup" in this) {
      throw new Error("Has already been set up");
    }

    this.FindIrregularities();
    this.alreadySetup = true;
  }
  /* temp */


  highlight(input_string) {
    if (!input_string) return this;
  }

  getId() {
    return this.original.rows.length > 0 && this.original.rows[0].BIN_id;
  }

  getBaseWord() {
    return this.original.rows.length > 0 && this.original.rows[0].base_word || "";
  }

  getIsWordIrregular() {
    return this.original.wordIsIrregular;
  }

  getWordHasUmlaut() {
    return this.original.wordHasUmlaut;
  }
  /**
   * @param  {array|...string} values
   */


  is(...values) {
    values = Object(lodash__WEBPACK_IMPORTED_MODULE_11__["flatten"])(values);
    return values.every(value => {
      /* Test word_categories */
      if (this.getWordCategories().includes(Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["normalizeTag"])(value))) {
        return true;
      }
      /* Test inflectional_form_categories */


      return this.rows.length > 0 && this.rows.every(row => row.inflectional_form_categories.includes(Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["normalizeTag"])(value)));
    });
  }
  /**
   * @param  {array|...string} values
   */


  isAny(...values) {
    values = Object(lodash__WEBPACK_IMPORTED_MODULE_11__["flatten"])(values);
    return values.some(value => {
      /* Test word_categories */
      if (this.getWordCategories().includes(Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["normalizeTag"])(value))) {
        return true;
      }
      /* Test inflectional_form_categories */


      return this.rows.length > 0 && this.rows.every(row => row.inflectional_form_categories.includes(Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["normalizeTag"])(value)));
    });
  }
  /**
   * @param  {array|...string} values
   */


  get(...values) {
    if (!values) return this;
    values = Object(lodash__WEBPACK_IMPORTED_MODULE_11__["flatten"])(values);
    return new Word(this.rows.filter(row => values.filter(Boolean).every(value => row.inflectional_form_categories.includes(Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["normalizeTag"])(value)) // || row.word_categories.includes(value) // Should not be needed
    )), this);
  }
  /**
   * Used in string table generation
   */


  getMostRelevantSibling(...values) {
    if (!values) return this;
    values = Object(lodash__WEBPACK_IMPORTED_MODULE_11__["flatten"])(values);
    let values_types = values.map(v => Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["getTagInfo"])(v) && Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["getTagInfo"])(v).type);
    let try_to_match_as_many_as_possible = [];
    this.getFirstClassification().forEach(c => {
      let relevant_type_index = values_types.findIndex(v => v === Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["getTagInfo"])(c).type);

      if (relevant_type_index >= 0) {
        try_to_match_as_many_as_possible.push(values[relevant_type_index]);
      } else {
        try_to_match_as_many_as_possible.push(c);
      }
    });
    let possible_rows = this.getOriginal().rows.map(row => {
      if (!values.every(j => row.inflectional_form_categories.includes(j))) {
        // console.log({values,in:row.inflectional_form_categories})
        return null;
      }

      let match_score = 0;
      row.inflectional_form_categories.forEach(cat => {
        if (try_to_match_as_many_as_possible.includes(cat)) {
          match_score++;
        }
      });
      return {
        inflectional_form_categories: row.inflectional_form_categories,
        match_score
      };
    }).filter(Boolean);

    if (possible_rows.length > 0) {
      let best_match = possible_rows.sort((a, b) => b.match_score - a.match_score)[0].inflectional_form_categories.filter(i => !Object(tables_tree__WEBPACK_IMPORTED_MODULE_2__["isNumber"])(i)); // console.log({best_match,values})

      return this.getOriginal().get(best_match);
    } else {
      // console.log({values,try_to_match_as_many_as_possible})
      return this.returnEmptyWord();
    }
  }

  returnEmptyWord() {
    return new Word([], this);
  }
  /**
   * Returns all that meet *any* of the input values
   * @param  {array|...string} values
   */


  getMeetingAny(...values) {
    if (!values) return this;
    values = Object(lodash__WEBPACK_IMPORTED_MODULE_11__["flatten"])(values);
    if (values.filter(Boolean).length === 0) return this;
    return new Word(this.rows.filter(row => values.filter(Boolean).some(value => row.inflectional_form_categories.includes(Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["normalizeTag"])(value)))), this);
  }

  getOriginal() {
    if (this.original.rows.length === 0) throw new Error("Empty original");
    return this.original;
  }

  getFirst() {
    return new Word(this.rows.slice(0, 1), this);
  }

  getFirstAndItsVariants() {
    /* We make sure the categories are completely equal to prevent
     * verbs (which come in various deep nestings) from matching */
    let match = this.getFirstClassification();
    return new Word(this.rows.filter(row => match.length === row.inflectional_form_categories.length - 1 && // -1 to remove number
    match.every((value, index) => value === row.inflectional_form_categories[index])), this);
  }

  getFirstValue() {
    return this.rows.length > 0 && this.rows[0].inflectional_form || undefined;
  }

  getFirstValueRendered() {
    return this.rows.length > 0 && this.rows[0].formattedOutput || undefined;
  }

  getForms() {
    return this.rows.map(row => row.inflectional_form);
  }

  getForms_describe_as_string__temp() {
    return this.rows.map(row => `${row.inflectional_form} ${row.inflectional_form_categories.join(",")}`).join("\n");
  }

  getWordCategories() {
    return this.original.rows[0] && this.original.rows[0].word_categories || [];
  }

  getFirstClassification() {
    return this.rows.length > 0 && this.rows[0].inflectional_form_categories.filter(i => !Object(tables_tree__WEBPACK_IMPORTED_MODULE_2__["isNumber"])(i)) || [];
  }
  /**
   * @param  {array|...string} values
   */


  without(...values) {
    values = Object(lodash__WEBPACK_IMPORTED_MODULE_11__["flatten"])(values);
    return new Word(this.rows.filter(row => values.filter(Boolean).every(value => !row.inflectional_form_categories.includes(Object(tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["normalizeTag"])(value)))), this);
  }
  /**
   * Used to ask "which case does this word have?"
   * E.g. getType('case') returns 'nominative'
   *
   * @param  {string} type
   * @return {?string}
   */


  getType(type) {
    const classification = [...this.getWordCategories(), // TODO: Should we get first class or that which applies to all?
    ...this.getFirstClassification()];
    let relevantTypes = tables_classification_classification__WEBPACK_IMPORTED_MODULE_10__["types"][type];
    if (!relevantTypes) return;
    return classification.find(i => relevantTypes.includes(i));
  }

  getDomain() {
    return this.rows.length > 0 && tables_classification_BIN_classification__WEBPACK_IMPORTED_MODULE_13__["relevant_BIN_domains"][this.rows[0].BIN_domain]; // console.log(this.getFirst())
  }
  /**
   * Three values are inputted, a value is returned
   * based on the gender of the word.
   * Used when generating helper words
   * @param  {...*} values
   */


  dependingOnGender(...values) {
    return values[["masculine", "feminine", "neuter"].indexOf(this.getType("gender"))];
  }
  /**
   * Five values are inputted, a value is returned
   * based on the subject type of the verb
   * Used when generating helper words
   * @param  {...*} values
   */


  dependingOnSubject(...values) {
    if (this.is("impersonal with accusative subject")) {
      return values[1];
    } else if (this.is("impersonal with dative subject")) {
      return values[2];
    } else if (this.is("impersonal with genitive subject")) {
      return values[3];
    } else if (this.is("impersonal with dummy subject")) {
      return values[4];
    } else {
      return values[0];
    }
  }

  getRows() {
    return this.rows;
  }

  getTree() {
    return Object(tables_tree__WEBPACK_IMPORTED_MODULE_2__["default"])(this.rows);
  }
  /* Returns array */


  renderForms() {
    let word = this;
    return this.rows.map(row => {
      /* formattedOutput contains umlaut higlights */
      let out = row.formattedOutput || row.inflectional_form;

      if (row.matched_term === row.inflectional_form) {
        out = `<span class="highlight">${out}</span>`;
      }

      return out;
    });
  }
  /* Returns string with helper words */


  render(options) {
    let output = this.getHelperWordsBefore() + " " + this.renderForms().map(i => `<b>${i}</b>`).join(" / ") + this.getHelperWordsAfter();
    output = output.trim(); // const highlight = options && options.highlight
    // if (highlight && this.is(highlight)) {
    //   output = `<span class="highlight">${output}</span>`
    // }

    return output;
  }
  /**
    A snippet is a short example of a conjugation to display in search results
  */


  getSnippet() {
    // if (this.is('verb')) {
    //   return this.getPrincipalParts()
    // }

    /* Which variant to highlight? */
    let chosen_variant_to_show = [];
    let variants_matched = [];
    this.rows.forEach(row => {
      if (row.variant_matched) {
        variants_matched.push(row);
      }
    });
    variants_matched = variants_matched.sort((a, b) => {
      return b.should_be_taught + b.correctness_grade_of_inflectional_form + b.correctness_grade_of_word - (a.should_be_taught + a.correctness_grade_of_inflectional_form + a.correctness_grade_of_word);
    });

    if (variants_matched.length > 0) {
      chosen_variant_to_show = variants_matched[0].inflectional_form_categories.filter(i => !Object(tables_tree__WEBPACK_IMPORTED_MODULE_2__["isNumber"])(i));
    }

    return this.getSingleTable({
      returnAsString: true,
      give_me: chosen_variant_to_show
    });
  }

}

const WordFromTree = (input, original) => {
  let rows = [];

  const traverse = x => {
    if (Array.isArray(x)) {
      x.map(traverse);
    } else if (x.values) {
      x.values.map(traverse);
    } else {
      rows.push(x);
    }
  };

  traverse(input);
  return new Word(rows, original);
};
Word.prototype.getHelperWordsBefore = tables_functions_helperWords__WEBPACK_IMPORTED_MODULE_3__["getHelperWordsBefore"];
Word.prototype.getHelperWordsAfter = tables_functions_helperWords__WEBPACK_IMPORTED_MODULE_3__["getHelperWordsAfter"];
Word.prototype.getPrincipalParts = tables_functions_principalParts__WEBPACK_IMPORTED_MODULE_4__["getPrincipalParts"];
Word.prototype.getStem = tables_functions_stem__WEBPACK_IMPORTED_MODULE_7__["getStem"];
Word.prototype.isStrong = tables_functions_strong__WEBPACK_IMPORTED_MODULE_8__["isStrong"];
Word.prototype.isWeak = tables_functions_strong__WEBPACK_IMPORTED_MODULE_8__["isWeak"];
Word.prototype.getTables = tables_tables_all__WEBPACK_IMPORTED_MODULE_0__["default"];
Word.prototype.getSingleTable = tables_tables_single__WEBPACK_IMPORTED_MODULE_1__["default"];
Word.prototype.getWordDescription = tables_functions_wordDescription__WEBPACK_IMPORTED_MODULE_5__["getWordDescription"];
Word.prototype.getWordNotes = tables_functions_wordNotes__WEBPACK_IMPORTED_MODULE_6__["getWordNotes"];
Word.prototype.FindIrregularities = tables_functions_irregularities__WEBPACK_IMPORTED_MODULE_12__["FindIrregularities"];
/* harmony default export */ __webpack_exports__["default"] = (Word);

/***/ }),

/***/ "./src/server/logger.js":
/*!******************************!*\
  !*** ./src/server/logger.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chalk */ "chalk");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_0__);
/* eslint-disable no-console */
 // import ip from 'ip'

const divider = chalk__WEBPACK_IMPORTED_MODULE_0___default.a.gray("\n-----------------------------------");
/**
 * Logger middleware, you can customize it to make messages more personal
 */

const logger = {
  // Called whenever there's an error on the server we want to print
  error: err => {
    console.error(chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red(err));
  },
  // Called when express.js app starts on given port w/o errors
  appStarted: (port, host, tunnelStarted) => {//     console.log(`Server started ! ${chalk.green('✓')}`)
    //
    //     // If the tunnel started, log that and the URL it's available at
    //     if (tunnelStarted) {
    //       console.log(`Tunnel initialised ${chalk.green('✓')}`)
    //     }
    //
    //     console.log(`
    // ${chalk.bold('Access URLs:')}${divider}
    // Localhost: ${chalk.magenta(`http://${host}:${port}`)}
    //       LAN: ${chalk.magenta(`http://${ip.address()}:${port}`) +
    // (tunnelStarted ? `\n    Proxy: ${chalk.magenta(tunnelStarted)}` : '')}${divider}
    // ${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    //     `)
  }
};
/* harmony default export */ __webpack_exports__["default"] = (logger);

/***/ }),

/***/ "./src/server/user/index.js":
/*!**********************************!*\
  !*** ./src/server/user/index.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var server_database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/database */ "./src/server/database/index.js");
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! shortid */ "shortid");
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(shortid__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! server/database/functions/SQL-template-literal */ "./src/server/database/functions/SQL-template-literal.js");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var json_stable_stringify__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! json-stable-stringify */ "json-stable-stringify");
/* harmony import */ var json_stable_stringify__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(json_stable_stringify__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var server_user_send_email__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! server/user/send_email */ "./src/server/user/send_email.js");
/* harmony import */ var js_sha256__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! js-sha256 */ "js-sha256");
/* harmony import */ var js_sha256__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(js_sha256__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! request */ "request");
/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(request__WEBPACK_IMPORTED_MODULE_7__);







 // import { hash as argon_hash, verify as argon_verify } from 'argon2'

const argon2 = __webpack_require__(/*! argon2 */ "argon2");

const argon_hash = argon2.hash;
const argon_verify = argon2.verify;

const router = __webpack_require__(/*! express */ "express").Router();

const key = process.env.COOKIE_SECRET || "secret";

var crypto = __webpack_require__(/*! crypto */ "crypto");

router.post("/user", async (req, res) => {
  let username = req.body.username && req.body.username.trim().replace(/\s+/g, " ");
  const email = req.body.email && req.body.email.trim();
  const {
    password,
    captcha_token,
    type
  } = req.body; // if (!email || email.length > 255 || !/@/.test(email)) {
  //   return res.send({ error: 'ERROR_INVALID_EMAIL' })
  // }

  if (!username) {
    return res.send({
      error: "ERROR_USERNAME_REQUIRED"
    });
  }

  if (!password) {
    return res.send({
      error: "ERROR_PASSWORD_REQUIRED"
    });
  }

  captcha(captcha_token, res, async () => {
    let user_id, user, did_user_exist;

    if (type === "login") {
      user = await get_user({
        username,
        password,
        res
      });
      username = user.username;
      user_id = user.id;
      did_user_exist = true;
    } else if (type === "signup") {
      /* Check if username is valid */
      if (/@/.test(username)) {
        return res.send({
          error: "ERROR_INVALID_USERNAME"
        });
      }
      /* Check if username or email already exists */


      const error = await check_if_user_exists({
        email,
        username
      });
      if (error) return res.send({
        error
      });
      user_id = await create_user({
        email,
        username,
        password,
        res
      });
    }

    req.session.user_id = user_id;
    req.session.username = username;
    return res.send({
      user_id,
      username,
      did_user_exist
    });
  });
});

const get_user = async ({
  username,
  password,
  res
}) => {
  return new Promise(resolve => {
    Object(server_database__WEBPACK_IMPORTED_MODULE_0__["default"])(server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__["default"]`SELECT * FROM users WHERE
      username = ${username} OR
      email = ${username}
    `, (err, results) => {
      if (results.length > 0) {
        const row = results[0];

        if (!argon_verify(row.password, password)) {
          return res.send({
            error: "ERROR_INCORRECT_PASSWORD"
          });
        }

        resolve(row);
      } else {
        return res.send({
          error: "ERROR_USERNAME_DOES_NOT_EXIST"
        });
      }
    });
  });
};
/*
  Returns "ERROR_USERNAME_EXISTS" or "ERROR_EMAIL_ALREADY_IN_USE"
*/


const check_if_user_exists = async ({
  email,
  username
}) => {
  return new Promise(resolve => {
    let q;

    if (email) {
      q = server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__["default"]`SELECT * FROM users WHERE email = ${email} OR username = ${username}`;
    } else {
      q = server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__["default"]`SELECT * FROM users WHERE username = ${username}`;
    }

    Object(server_database__WEBPACK_IMPORTED_MODULE_0__["default"])(q, (err, results) => {
      if (results.length > 0) {
        if (email && results[0].email === email) {
          return resolve("ERROR_EMAIL_ALREADY_IN_USE");
        } else if (results[0].username === username) {
          return resolve("ERROR_USERNAME_EXISTS");
        }
      }

      return resolve(null);
    });
  });
};

const create_user = ({
  username,
  email,
  password,
  res
}) => {
  return new Promise(async resolve => {
    const hash = await argon_hash(password);
    Object(server_database__WEBPACK_IMPORTED_MODULE_0__["default"])(server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__["default"]`INSERT INTO users SET
      username = ${username},
      email = ${email || null},
      password = ${hash}
      `, (err, results2) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(500).send({
            error: "ERROR_USER_ALREADY_EXIST"
          });
        }

        return res.sendStatus(500);
      } else {
        resolve(results2.insertId);
      }
    });
  });
};

const captcha = (captcha_token, res, callback) => {
  if (!process.env.REACT_APP_HCAPTCHA_SITEKEY) {
    return callback();
  }

  if (!captcha_token) {
    return res.send({
      error: "ERROR_INCORRECT_CAPTCHA"
    });
  }

  request__WEBPACK_IMPORTED_MODULE_7___default.a.post({
    url: "https://hcaptcha.com/siteverify",
    form: {
      response: captcha_token,
      secret: process.env.HCAPTCHA_SECRET
    }
  }, (error, response, body) => {
    if (error) {
      console.error(error);
      return res.sendStatus(500);
    } else if (JSON.parse(body).success !== true) {
      return res.send({
        error: "ERROR_INCORRECT_CAPTCHA"
      });
    }

    callback();
  });
}; // const GetDerivedKey = (x, y) => {
//   return sha256.hmac(key, x + '' + y)
// }

/* TODO: CSRF */


router.post("/user/logout", async (req, res) => {
  req.session.user_id = null;
  req.session.username = null;
  return res.sendStatus(200);
});
/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./src/server/user/send_email.js":
/*!***************************************!*\
  !*** ./src/server/user/send_email.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const nodemailer = __webpack_require__(/*! nodemailer */ "nodemailer");

/* harmony default export */ __webpack_exports__["default"] = (async () => {
  return;
  if (!process.env.EMAIL_PASSWORD || !process.env.EMAIL_SMTP_HOST) return console.warn("Missing details");
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  let info = await transporter.sendMail({
    from: '"Ylhýra" <ylhyra@ylhyra.is>',
    to: "egillsigurdur@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>"
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});

/***/ }),

/***/ "./src/server/vocabulary/get.js":
/*!**************************************!*\
  !*** ./src/server/vocabulary/get.js ***!
  \**************************************/
/*! exports provided: vocabulary_json, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vocabulary_json", function() { return vocabulary_json; });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var server_database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! server/database */ "./src/server/database/index.js");
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! shortid */ "shortid");
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(shortid__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! server/database/functions/SQL-template-literal */ "./src/server/database/functions/SQL-template-literal.js");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_4__);






const router = __webpack_require__(/*! express */ "express").Router();

const fs = __webpack_require__(/*! fs */ "fs");

const vocabulary_json = __basedir + "/src/output/vocabulary_database.json";
router.all("/vocabulary/get",
/* cors({ origin: 'https://ylhyra.is', credentials: true }),*/
(req, res) => {
  /* Temp */
  // let user_id = req.body.user_id || shortid.generate()
  // res.setHeader('user_id', user_id) /* Temp */
  Object(server_database__WEBPACK_IMPORTED_MODULE_1__["default"])(server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_3__["default"]`
    SELECT * FROM vocabulary_cards
    ORDER BY level, sort
    LIMIT 200
  `, (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});
router.use("/vocabulary/vocabulary_database.json", express__WEBPACK_IMPORTED_MODULE_0___default.a.static(vocabulary_json));
router.get("/vocabulary/database_last_updated", (req, res) => {
  fs.stat(vocabulary_json, (err, stats) => {
    if (err) {
      throw err;
    }

    res.send(new Date(stats.mtime).getTime().toString());
  });
});
/* Get schedule */

router.post("/vocabulary/schedule", (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).send({
      error: "ERROR_NOT_LOGGED_IN"
    });
  }

  Object(server_database__WEBPACK_IMPORTED_MODULE_1__["default"])(server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_3__["default"]`
    SELECT *,
      UNIX_TIMESTAMP(due) * 1000 as due,
      UNIX_TIMESTAMP(last_seen) * 1000 as last_seen
      FROM vocabulary_schedule
    WHERE user_id = ${req.session.user_id}
  `, (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  });
});
/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./src/server/vocabulary/save.js":
/*!***************************************!*\
  !*** ./src/server/vocabulary/save.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var server_database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! server/database */ "./src/server/database/index.js");
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! shortid */ "shortid");
/* harmony import */ var shortid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(shortid__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! server/database/functions/SQL-template-literal */ "./src/server/database/functions/SQL-template-literal.js");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var src_app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/App/functions/time.js */ "./src/app/App/functions/time.js");
/**
 * Saves session and updates schedule
 */






const router = __webpack_require__(/*! express */ "express").Router();

router.post("/vocabulary/save", cors__WEBPACK_IMPORTED_MODULE_3___default()(), (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) return res.status(400).send("Not logged in");
  const schedule = req.body.schedule;

  if (Object.keys(schedule).length > 10000) {
    return res.status(400).send("Too long");
  }

  const queries = Object.keys(schedule).map(id => {
    const item = schedule[id];
    if (!item.due) return ""; // const due_milliseconds = (new Date()).getTime() + daysToMs(card.due_in_days)

    return server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__["default"]`
      DELETE FROM vocabulary_schedule
        WHERE card_id = ${id}
        AND user_id = ${user_id}
        ;
      INSERT INTO vocabulary_schedule SET
        card_id = ${id},
        due = FROM_UNIXTIME(${Object(src_app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_4__["msToS"])(Object(src_app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_4__["roundMsToHour"])(item.due))}),
        last_seen = FROM_UNIXTIME(${Object(src_app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_4__["msToS"])(Object(src_app_App_functions_time_js__WEBPACK_IMPORTED_MODULE_4__["roundMsToHour"])(item.last_seen))}),
        last_interval_in_days = ${item.last_interval_in_days},
        user_id = ${user_id},
        score = ${item.score},
        sessions_seen = ${item.sessions_seen}
        ;
    `;
  });
  Object(server_database__WEBPACK_IMPORTED_MODULE_0__["default"])(queries.join(""), (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send("GOOD");
    }
  });
});
/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./src/server/vocabulary/setup/functions.js":
/*!**************************************************!*\
  !*** ./src/server/vocabulary/setup/functions.js ***!
  \**************************************************/
/*! exports provided: clean_string, getHash, getHashesFromCommaSeperated */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clean_string", function() { return clean_string; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHash", function() { return getHash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHashesFromCommaSeperated", function() { return getHashesFromCommaSeperated; });
/* harmony import */ var app_App_functions_hash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/App/functions/hash */ "./src/app/App/functions/hash.js");

const clean_string = i => {
  if (!i) return null;
  return i.replace(/\*/g, "").replace(/\\,/g, ",").replace(/'{2,}/g, "").replace(/\s+/g, " ").trim();
};
const getHash = i => {
  if (Array.isArray(i)) {
    return getHash(i.map(clean_string).join(";"));
  }

  const string = clean_string(i).replace(/[.!]+$/, "").toLowerCase();
  if (!string) return null; // return (string)

  return Object(app_App_functions_hash__WEBPACK_IMPORTED_MODULE_0__["default"])(string);
};
const getHashesFromCommaSeperated = i => {
  if (!i) return [];
  return i.split(",").map(getHash).filter(Boolean);
};

/***/ }),

/***/ "./src/server/vocabulary/setup/setup.js":
/*!**********************************************!*\
  !*** ./src/server/vocabulary/setup/setup.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var server_database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! server/database */ "./src/server/database/index.js");
/* harmony import */ var server_database_functions_SQL_template_literal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! server/database/functions/SQL-template-literal */ "./src/server/database/functions/SQL-template-literal.js");
/* harmony import */ var json_stable_stringify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! json-stable-stringify */ "json-stable-stringify");
/* harmony import */ var json_stable_stringify__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(json_stable_stringify__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./functions */ "./src/server/vocabulary/setup/functions.js");
/*
  To run:
  node build/ylhyra_server.js --import-vocabulary
*/






const path = __webpack_require__(/*! path */ "path");

const fs = __webpack_require__(/*! fs */ "fs");

__webpack_require__(/*! src/app/App/functions/array-foreach-async */ "./src/app/App/functions/array-foreach-async.js");

let google_docs_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQNFtYReGKVwCT6GshjOJKF-OmTt3ZU_9QHJcpL7UpNVMIZ18T0P1PaSXpqv4rvd76z5qAQ1hui9Vy6/pub?output=tsv&random=${Math.random()}`;
let TESTING = false;

if (process.argv[3] === "--testing") {
  /* Spænska */
  google_docs_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vT_pzDyG0wMUZbPK9yf_i4AYrKjbKs6nFmexJMK5s6IsdIRQk96uP77GDqyiR-FvSCgjBaUFMh3DlYw/pub?output=tsv&random=${Math.random()}`;
  TESTING = true;
}
/*
  Convert vocabulary data into a JavaScrip object
*/


const run = async () => {
  let terms = {};
  let cards = {};
  let dependencies = {};
  let alternative_ids = {};

  const TermsToCardId = (_terms, id) => {
    _terms.forEach(term => {
      if (!terms[term]) {
        terms[term] = {
          level: null,
          cards: []
        };
      }

      terms[term].cards.push(id);
    });
  };

  const AddToDependencyGraph = (first, second, type) => {
    if (!second || second.length === 0) return;
    let obj = dependencies;

    if (type === "alt_ids") {
      obj = alternative_ids;
    }

    first.forEach(id => {
      obj[id] = [...(obj[id] || []), ...second];
    });
  };

  const {
    data
  } = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(google_docs_url); // console.log(data.split('\n')[0].split('\t'))
  // return;

  /* Read the table header to get the names of columns */

  let column_indexes_to_name = {};
  data.split("\n")[0].split("\t").forEach((name, index) => {
    if (!name.trim()) return;
    column_indexes_to_name[index] = name.trim();
  });
  data.split("\n").slice(1) // .slice(0, 100) // TEMP!!!
  .forEach((line, line_number) => {
    let to_add = [];
    /* Assing names to columns */

    let columns = {};
    line.split("\t").forEach((string, index) => {
      if (!column_indexes_to_name[index]) return;
      columns[column_indexes_to_name[index]] = string.trim() || null;
    }); // console.log(columns)
    // process.exit()

    const english = Object(_functions__WEBPACK_IMPORTED_MODULE_4__["clean_string"])(columns.english);
    if (!columns.icelandic) return;
    if (!english) return;
    if (columns.should_teach === "no") return;
    if (!columns.level && !TESTING) return;
    /* Can have multiple */

    let icelandic_strings = [];
    columns.icelandic.split(/(.+?[^\\])([,;])/g).forEach(i => {
      i = i.trim();
      if (!i) return;
      if (i === "," || i === ";") return;
      i = Object(_functions__WEBPACK_IMPORTED_MODULE_4__["clean_string"])(i);
      icelandic_strings.push(i);
    });
    const terms_in_this_line = icelandic_strings.map(_functions__WEBPACK_IMPORTED_MODULE_4__["getHash"]);
    const alternative_ids = Object(_functions__WEBPACK_IMPORTED_MODULE_4__["getHashesFromCommaSeperated"])(columns.alternative_id);
    const depends_on = [...Object(_functions__WEBPACK_IMPORTED_MODULE_4__["getHashesFromCommaSeperated"])(columns.depends_on), ...Object(_functions__WEBPACK_IMPORTED_MODULE_4__["getHashesFromCommaSeperated"])(columns.basic_form)];
    AddToDependencyGraph(terms_in_this_line, depends_on);
    AddToDependencyGraph(alternative_ids, terms_in_this_line, "alt_ids");
    let card_skeleton = {
      en: english,
      terms: terms_in_this_line,
      level: columns.level,
      sort: line_number,
      basic_form: columns.basic_form,
      note_bfr_show: columns.note_bfr_show,
      note_after_show: columns.note_after_show,
      literally: columns.literally
    };

    if (columns.direction && columns.direction !== "<-" && columns.direction !== "->") {
      throw new Error(`Unknown direction ${columns.direction}`);
    }
    /* Icelandic to English */


    if (columns.direction !== "<-") {
      icelandic_strings.forEach(i => {
        to_add.push({
          is: i,
          from: "is",
          id: Object(_functions__WEBPACK_IMPORTED_MODULE_4__["getHash"])(i) + "_is",
          ...card_skeleton
        });
      });
    }
    /* English to Icelandic */


    if (columns.direction !== "->") {
      to_add.push({
        is: Object(_functions__WEBPACK_IMPORTED_MODULE_4__["clean_string"])(columns.icelandic),
        from: "en",
        id: Object(_functions__WEBPACK_IMPORTED_MODULE_4__["getHash"])(columns.icelandic) + "_en",
        ...card_skeleton
      });
    }

    to_add.forEach(({
      id,
      ...card
    }) => {
      if (cards[id]) return console.log(`"${columns.icelandic}" already exists`); // [...terms_in_this_line, ...alternative_ids].forEach(j => {
      //   termsToCardIds[j] = [
      //     ...(termsToCardIds[j] || []),
      //     card.id
      //   ]
      // })
      // termDependsOnTerms[card.id] = terms_in_this_line

      TermsToCardId(terms_in_this_line, id);
      cards[id] = {
        id,
        ...card
      };
    });
  }); // /* Process dependency graph */
  // let dependencyGraphProcessed = {}
  // for (let from_term in cardIdsSeen) {
  //   if (typeof (cardIdsSeen[from_term]) == "function") continue;
  //   dependencyGraphProcessed[from_term] = CreateDependencyChain(from_term)
  // }
  // cards = cards.sort((a, b) => {
  //   if (a.level !== b.level) {
  //     return a.level - b.level
  //   }
  //   // if(dependencyGraphProcessed[a.])
  //   return a.sort - b.sort
  // }).map((card, index) => ({
  //   ...card,
  //   sort: index,
  // }))

  console.log(`${Object.keys(cards).length} cards`); // await cards.forEachAsync(async({
  //   is,
  //   en,
  //   id,
  //   from,
  //   level,
  //   word_ids,
  //   sort,
  //   terms,
  // }) => {
  //   await new Promise((resolve) => {
  //     query(sql `INSERT INTO vocabulary_cards SET
  //       id = ${id},
  //       level = ${Math.floor(level) || null},
  //       sort = ${sort},
  //       data = ${stable_stringify({
  //         is,
  //         en,
  //         from,
  //         word_ids,
  //       })}
  //       ;
  //       `, (err) => {
  //       if (err) {
  //         console.error(err)
  //         process.exit()
  //       } else {
  //         resolve()
  //       }
  //     })
  //     // let queries = []
  //     // terms.forEach(term => {
  //     //   queries.push(sql `INSERT INTO vocabulary_card_relations SET
  //     //     from_id = ${id},
  //     //     to_id = ${term},
  //     //     relation_type = "belongs_to"
  //     //     ;
  //     //   `)
  //     // })
  //     // if (dependencyGraphProcessed[id]) {
  //     //   for (let to_term in dependencyGraphProcessed[id]) {
  //     //     if (typeof (dependencyGraphProcessed[id][to_term]) == "function") continue;
  //     //     queries.push(sql `INSERT INTO vocabulary_card_relations SET
  //     //       from_id = ${id},
  //     //       to_id = ${to_term},
  //     //       relation_depth = ${dependencyGraphProcessed[id][to_term]},
  //     //       relation_type = "depends_on"
  //     //       ;
  //     //     `)
  //     //   }
  //     // }
  //     // query(queries.join(''), (err) => {
  //     //   if (err) {
  //     //     console.error(err)
  //     //     process.exit()
  //     //   }
  //     // })
  //   })
  // })
  // fs.writeFileSync(path.resolve(__dirname, `terms.json`), JSON.stringify(termDependsOnTerms, null, 2), function () {})

  fs.writeFileSync(__basedir + "/src/output/vocabulary_database.json", JSON.stringify({
    cards,
    terms,
    dependencies,
    alternative_ids
  }, null, 2), function () {});
  console.log("Done 1");
  process.exit();
}; // const format_string = (i) => i
// .replace(/\\,/g, ',')
// .replace(/'''(.+)'''/g, '<strong>$1</strong>')
// .replace(/''(.+)''/g, '<em>$1</em>')
// .trim()

/**
 * Returns an object on the form { [key]: [depth] }
 */


const CreateDependencyChain = (from_term, _alreadySeen = [], output = [], depth = 0) => {// termDependsOnTerms[from_term].forEach(term => {
  //   const alreadySeen = [..._alreadySeen] /* Deep copy in order to only watch direct parents */
  //   if (alreadySeen.includes(term)) return;
  //   alreadySeen.push(term)
  //   const card_ids = termsToCardIds[term] || []
  //   if (card_ids.some(id => alreadySeen.includes(id))) return;
  //   card_ids.forEach(card_id => {
  //     if (depth > 0) {
  //       output[card_id] = Math.max(output[card_id] || 0, depth)
  //     }
  //     alreadySeen.push(card_id)
  //   })
  //   if (termDependsOnTerms[term]) {
  //     CreateDependencyChain(term, alreadySeen, output, card_ids.length > 1 ? depth + 1 : depth)
  //   }
  // })
  // if (depth === 0) {
  //   return output
  // }
}; // query(sql `
//   TRUNCATE TABLE vocabulary_cards;
//   TRUNCATE TABLE vocabulary_card_relations;
// `, (err) => {
//   if (err) {
//     console.error(err)
//   } else {
//     run()
//   }
// })


run();

/***/ }),

/***/ 0:
/*!***********************************!*\
  !*** multi ./src/server/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/egill/ylhyra/src/server/index.js */"./src/server/index.js");


/***/ }),

/***/ "@hcaptcha/react-hcaptcha":
/*!*******************************************!*\
  !*** external "@hcaptcha/react-hcaptcha" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@hcaptcha/react-hcaptcha");

/***/ }),

/***/ "argon2":
/*!*************************!*\
  !*** external "argon2" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("argon2");

/***/ }),

/***/ "array-sugar":
/*!******************************!*\
  !*** external "array-sugar" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("array-sugar");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "btoa":
/*!***********************!*\
  !*** external "btoa" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("btoa");

/***/ }),

/***/ "chalk":
/*!************************!*\
  !*** external "chalk" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "cologne-phonetic":
/*!***********************************!*\
  !*** external "cologne-phonetic" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cologne-phonetic");

/***/ }),

/***/ "cookie-session":
/*!*********************************!*\
  !*** external "cookie-session" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cookie-session");

/***/ }),

/***/ "core-js/stable":
/*!*********************************!*\
  !*** external "core-js/stable" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("core-js/stable");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "critical":
/*!***************************!*\
  !*** external "critical" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("critical");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "diacritics":
/*!*****************************!*\
  !*** external "diacritics" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("diacritics");

/***/ }),

/***/ "diff":
/*!***********************!*\
  !*** external "diff" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("diff");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "emoji-strip":
/*!******************************!*\
  !*** external "emoji-strip" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("emoji-strip");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-useragent":
/*!************************************!*\
  !*** external "express-useragent" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-useragent");

/***/ }),

/***/ "express-ws":
/*!*****************************!*\
  !*** external "express-ws" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-ws");

/***/ }),

/***/ "formik":
/*!*************************!*\
  !*** external "formik" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("formik");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "html-entities":
/*!********************************!*\
  !*** external "html-entities" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("html-entities");

/***/ }),

/***/ "htmltidy2":
/*!****************************!*\
  !*** external "htmltidy2" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("htmltidy2");

/***/ }),

/***/ "is-boolean-attribute":
/*!***************************************!*\
  !*** external "is-boolean-attribute" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("is-boolean-attribute");

/***/ }),

/***/ "is-empty-object":
/*!**********************************!*\
  !*** external "is-empty-object" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("is-empty-object");

/***/ }),

/***/ "js-sha256":
/*!****************************!*\
  !*** external "js-sha256" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("js-sha256");

/***/ }),

/***/ "js-yaml":
/*!**************************!*\
  !*** external "js-yaml" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("js-yaml");

/***/ }),

/***/ "json-stable-stringify":
/*!****************************************!*\
  !*** external "json-stable-stringify" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("json-stable-stringify");

/***/ }),

/***/ "line-by-line":
/*!*******************************!*\
  !*** external "line-by-line" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("line-by-line");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "marked":
/*!*************************!*\
  !*** external "marked" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("marked");

/***/ }),

/***/ "minimist":
/*!***************************!*\
  !*** external "minimist" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("minimist");

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mysql");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nodemailer");

/***/ }),

/***/ "omit-empty":
/*!*****************************!*\
  !*** external "omit-empty" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("omit-empty");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "performance-now":
/*!**********************************!*\
  !*** external "performance-now" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("performance-now");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-attr-converter":
/*!***************************************!*\
  !*** external "react-attr-converter" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-attr-converter");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-redux":
/*!******************************!*\
  !*** external "react-redux" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),

/***/ "react-tap-or-click":
/*!*************************************!*\
  !*** external "react-tap-or-click" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-tap-or-click");

/***/ }),

/***/ "redux":
/*!************************!*\
  !*** external "redux" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),

/***/ "redux-logger":
/*!*******************************!*\
  !*** external "redux-logger" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux-logger");

/***/ }),

/***/ "redux-thunk":
/*!******************************!*\
  !*** external "redux-thunk" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ }),

/***/ "regenerator-runtime/runtime":
/*!**********************************************!*\
  !*** external "regenerator-runtime/runtime" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime/runtime");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),

/***/ "request-ip":
/*!*****************************!*\
  !*** external "request-ip" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request-ip");

/***/ }),

/***/ "shortid":
/*!**************************!*\
  !*** external "shortid" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("shortid");

/***/ }),

/***/ "source-map-support":
/*!*************************************!*\
  !*** external "source-map-support" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("source-map-support");

/***/ }),

/***/ "sqlstring":
/*!****************************!*\
  !*** external "sqlstring" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sqlstring");

/***/ }),

/***/ "string-hash":
/*!******************************!*\
  !*** external "string-hash" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("string-hash");

/***/ }),

/***/ "string-similarity":
/*!************************************!*\
  !*** external "string-similarity" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("string-similarity");

/***/ }),

/***/ "typeset":
/*!**************************!*\
  !*** external "typeset" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("typeset");

/***/ }),

/***/ "underscore":
/*!*****************************!*\
  !*** external "underscore" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("underscore");

/***/ }),

/***/ "xregexp":
/*!**************************!*\
  !*** external "xregexp" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("xregexp");

/***/ })

/******/ });
//# sourceMappingURL=ylhyra_server.js.map