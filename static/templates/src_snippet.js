!function(){var n=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a.src_snippet=n({1:function(n,a,l,e,s,t,p){var i;return'    <br><span class="expand_spans small_button"></span>\n    <span class="div_spans">\n'+(null!=(i=l.each.call(null!=a?a:{},null!=a?a.spans:a,{name:"each",hash:{},fn:n.program(2,s,0,t,p),inverse:n.noop,data:s}))?i:"")+"    </span>\n"},2:function(n,a,l,e,s,t,p){var i,u,r=null!=a?a:{},c=l.helperMissing,d="function",_=n.escapeExpression;return'        <span class="div_span">\n            <span class="span_loc" link="'+_((u=null!=(u=l.file_name||(null!=a?a.file_name:a))?u:c,typeof u===d?u.call(r,{name:"file_name",hash:{},data:s}):u))+":"+_((u=null!=(u=l.line_start||(null!=a?a.line_start:a))?u:c,typeof u===d?u.call(r,{name:"line_start",hash:{},data:s}):u))+":"+_((u=null!=(u=l.line_end||(null!=a?a.line_end:a))?u:c,typeof u===d?u.call(r,{name:"line_end",hash:{},data:s}):u))+'" snippet="'+_((u=null!=(u=l.plain_text||(null!=a?a.plain_text:a))?u:c,typeof u===d?u.call(r,{name:"plain_text",hash:{},data:s}):u))+'">'+_((u=null!=(u=l.file_name||(null!=a?a.file_name:a))?u:c,typeof u===d?u.call(r,{name:"file_name",hash:{},data:s}):u))+":"+_((u=null!=(u=l.line_start||(null!=a?a.line_start:a))?u:c,typeof u===d?u.call(r,{name:"line_start",hash:{},data:s}):u))+":"+_((u=null!=(u=l.column_start||(null!=a?a.column_start:a))?u:c,typeof u===d?u.call(r,{name:"column_start",hash:{},data:s}):u))+": "+_((u=null!=(u=l.line_end||(null!=a?a.line_end:a))?u:c,typeof u===d?u.call(r,{name:"line_end",hash:{},data:s}):u))+":"+_((u=null!=(u=l.column_end||(null!=a?a.column_end:a))?u:c,typeof u===d?u.call(r,{name:"column_end",hash:{},data:s}):u))+'</span>\n            <div class="div_all_span_src">\n                <span class="div_span_src_number">\n'+(null!=(i=l.each.call(r,null!=a?a.text:a,{name:"each",hash:{},fn:n.program(3,s,0,t,p),inverse:n.noop,data:s}))?i:"")+'                </span><span class="div_span_src">\n'+(null!=(i=l.each.call(r,null!=a?a.text:a,{name:"each",hash:{},fn:n.program(5,s,0,t,p),inverse:n.noop,data:s}))?i:"")+"                </span>\n            </div>\n        </span>\n"},3:function(n,a,l,e,s,t,p){return'                        <div class="span_src_number">'+n.escapeExpression((l.add||a&&a.add||l.helperMissing).call(null!=a?a:{},s&&s.index,null!=p[1]?p[1].line_start:p[1],{name:"add",hash:{},data:s}))+"</div>\n"},5:function(n,a,l,e,s){var t;return'                        <div class="span_src">'+(null!=(t=n.lambda(a,a))?t:"")+"</div>\n"},compiler:[7,">= 4.0.0"],main:function(n,a,l,e,s,t,p){var i;return null!=(i=l["if"].call(null!=a?a:{},null!=a?a.spans:a,{name:"if",hash:{},fn:n.program(1,s,0,t,p),inverse:n.noop,data:s}))?i:""},useData:!0,useDepths:!0})}();