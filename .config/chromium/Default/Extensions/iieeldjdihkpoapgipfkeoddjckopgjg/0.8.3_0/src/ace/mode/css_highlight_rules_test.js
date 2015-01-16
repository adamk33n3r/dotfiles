/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var CssMode = require("./css").Mode;
var assert = require("../test/assertions");

module.exports = {
    
    name: "CSS Tokenizer",
    
    setUp : function() {
        this.tokenizer = new CssMode().getTokenizer();
    },

    "test: tokenize pixel number" : function() {
        var line = "-12px";
        var tokens = this.tokenizer.getLineTokens(line, "ruleset").tokens;

        assert.equal(2, tokens.length);
        assert.equal("constant.numeric", tokens[0].type);
    },

    "test: tokenize hex3 color" : function() {
        var tokens = this.tokenizer.getLineTokens("#abc", "ruleset").tokens;

        assert.equal(1, tokens.length);
        assert.equal("constant.numeric", tokens[0].type);
    },

    "test: tokenize hex6 color" : function() {
        var tokens = this.tokenizer.getLineTokens("#abc012", "ruleset").tokens;

        assert.equal(1, tokens.length);
        assert.equal("constant.numeric", tokens[0].type);
    },

    "test: tokenize parens" : function() {
        var tokens = this.tokenizer.getLineTokens("{()}", "start").tokens;

        assert.equal(3, tokens.length);
        assert.equal("paren.lparen", tokens[0].type);
        assert.equal("text", tokens[1].type);
        assert.equal("paren.rparen", tokens[2].type);
    },
    
    "test for last rule in ruleset to catch capturing group bugs" : function() {
        var tokens = this.tokenizer.getLineTokens("top", "ruleset").tokens;
        
        assert.equal(1, tokens.length);
        assert.equal("support.type", tokens[0].type);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
