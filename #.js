/*
	%23 v 0.10 by C.c (c) 2011

	DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
	Version 2, December 2004

	Copyright (C) 2004 Sam Hocevar
	14 rue de Plaisance, 75014 Paris, France
	Everyone is permitted to copy and distribute verbatim
	or modified copies of this license document, and changing
	it is allowed as long as the name is changed.
	
	DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
	TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

	0. You just DO WHAT THE FUCK YOU WANT TO.
*/

({
	extendArrayPrototype: function () {
		var proto = Array.prototype;
		var THIS = this;
		
		proto.forEach = function (l) {
			l=THIS.func(l);
			for (var i = 0; i < this.length; i++) l(this[i], i);
		};
		
		proto.select = function (s) {
			var r = [];
			s=THIS.func(s);
			this.forEach(function (e, i) { r.push(s(e, i)); });
			
			return r;
		};
		
		proto.where = function (p) {
			var r = [];
			p=THIS.func(p);
			this.forEach(function (e, i) { if (p(e, i)) r.push(e); });
			
			return r;
		};
		
		proto.firstOrDefault = function (p) {
			p=THIS.func(p);
			for (var i = 0; i < this.length; i++) if (p(this[i], i)) return this[i];
			return undefined;
		};
		
		proto.first = function (p) {
			p=THIS.func(p);
			var r = this.firstOrDefault(p);
			if (r) return r;
			
			throw "Sequence contains no matching element";
		};
		
		proto.max = function (p) {
			p=THIS.func(p);
			if (this.length==0) return null;
			if (!p) p = function (e, i) { return e;};
			
			maxi=0;
			maxe=this[maxi];
			this.forEach(function (e, i) {
				if (p(maxe,i)<p(e,i)){ 
					maxe=e;
					maxi=i;
				}
			});
			
			return this[maxi];
		};
		
		proto.min = function (p) {
			p=THIS.func(p);
			if (this.length==0) return null;
			if (!p) p = function (e, i) { return e;};
			
			mini=0;
			mine=this[mini];
			this.forEach(function (e, i) {
				if (p(mine,i)>p(e,i)){ 
					mine=e;
					mini=i;
				}
			});
			
			return this[mini];
		};
		
	},
	
	extendString: function () {
		var proto = String.prototype;
	
		/* doesn't work =) */
		String.format = proto.format = function() {
			var params = arguments.toArray();
			var f = params.splice(0,1)[0];
			var r = "";
			var i=0;
			
			while (f[i]) {
				if (f[i]=='{') {
					if (f[++i]=='{') r+='{';
					else {
						var index= "";
						while (f[i]!='}') index+=f[i++]; i++;
						index=parseInt(index);
						r+=params[index];
					}
				}
				else r+=f[i++];
			}
		
			return r;
		};
		
		proto.startsWith = function (str){
			return this.indexOf(str) == 0;
		};
		
		proto.endsWith = function (s) {
			return this.lastIndexOf(s) == (this.length-s.length);
		};
	},
	
	extendObject: function () {
		var proto = Object.prototype;
		
		proto.toArray = function () {
			var THIS = this;
			var r = [];
			var cn = ["length", "childElementCount"]; /* TODO: extend it */
			var c = cn.firstOrDefault(function (e) {return THIS[e];});
			
			if (!c) for (var l in this) r.push(this[l]);
			else for (var i=0;i<this[c];i++) r.push(this[i]);
			
			return r;
		};
	},
	
	compileLambda: function (lambda) {
		lambda=lambda.split('=>').select(function (e) {return e.trim();});
		if (lambda.length!=2) throw "Lambda compilation error";
		params = lambda[0];
		expression = lambda[1];
		if (!(params.startsWith('(') && params.endsWith(')'))) params = '('+params+')';
		if (!(expression.startsWith('{') && expression.endsWith('}'))) expression = '{ return '+expression+' }';
		
		return eval('(function '+params+' '+expression+');');
	},
	
	func: function (o) {
		if (typeof o == 'function') return o;
		return this.compileLambda(o);
	},
	
	init: function () {
		this.extendArrayPrototype();
		this.extendString();
		this.extendObject();
		
		_ = this.compileLambda;
	}
}).init();

