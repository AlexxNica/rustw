// Copyright 2017 The Rustw Project Developers.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import React from 'react';
import ReactDOM from 'react-dom';

module.exports = {
    pullSummary: function(id) {
        pullSummaryInternal(id);
    },
    loadSummary: function(state) {
        loadSummaryInternal(state);
    },
};

const rustw = require('./rustw');
const { RefMenu } = require('./menus');
const utils = require('./utils');
const topbar = require('./topbar');

class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showDocs: false, refMenu: null };
    }

    componentDidMount() {
        const self = this;
        const showRefMenu = (ev, id) => {
            self.setState({ refMenu: { "top": ev.pageY, "left": ev.pageX, target: ev.target, id }});
            ev.preventDefault();
        };

        const loadLink = (e) => {
            rustw.load_link.call(e.target);
            e.preventDefault();
        };

        // Make link and menus for idents on the page.
        let idents = $(".summary_ident");
        idents.click(loadLink);
        idents.on("contextmenu", (ev) => {
            return showRefMenu(ev, ev.target.id.substring("def_".length));
        });

        // Add links and menus for breadcrumbs.
        let breadcrumbs = $(".link_breadcrumb");
        breadcrumbs.click(loadLink);
        breadcrumbs.on("contextmenu", (ev) => {
            return showRefMenu(ev, ev.target.id.substring("breadcrumb_".length));
        });
    }

    render() {
        const loadLink = (e) => {
            rustw.load_link.call(e.target);
            e.preventDefault();
        };
        let breadCrumbs = [];
        for (const bc in this.props.breadCrumbs) {
            breadCrumbs.push(<span>{bc} :: </span>);
        }
        let parent = null;
        if (this.props.parent) {
            parent = <span className="small_button" id="jump_up" data-link={'summary:' + this.props.parent} onClick={loadLink}>&#x2191;</span>;
        }

        let docExpandButton = null;
        let docsRest = null;
        if (this.props.doc_rest) {
            const self = this;
            if (this.state.showDocs) {
                docExpandButton = <span className="small_button" id="expand_docs" onClick={() => self.setState({ showDocs: false })}>-</span>;
                docsRest = <div id="div_summary_doc_more" dangerouslySetInnerHTML={{__html: this.props.doc_rest}} />;
            } else {
                docExpandButton = <span className="small_button" id="expand_docs" onClick={() => self.setState({ showDocs: true })}>+</span>;
            }
        }

        let children = [];
        for (const c of this.props.children) {
            children.push(<div className="div_summary_sub" id={"div_summary_sub_" + c.id} key={c.id}>
                            <span className="jump_children small_button" data-link={"summary:" + c.id} onClick={loadLink}>&#x2192;</span>
                            <span className="summary_sig_sub div_all_span_src" dangerouslySetInnerHTML={{__html: c.signature}} />
                            <p className="div_summary_doc_sub" dangerouslySetInnerHTML={{__html: c.doc_summary}} />
                        </div>);
        }

        let refMenu = null;
        if (!!this.state.refMenu) {
            const self = this;
            const onClose = () => self.setState({ refMenu: null });
            refMenu = <RefMenu location={this.state.refMenu} onClose={onClose} target={this.state.refMenu.target} id={this.state.refMenu.id} />;            
        }

        return <div id="div_summary">
            <div id="div_mod_path">
                {breadCrumbs}
            </div>
            <div id="div_summary_main">
                <div id="div_summary_title">
                    {parent}
                    <span className="summary_sig_main div_all_span_src" dangerouslySetInnerHTML={{__html: this.props.signature}} />
                </div>
                <div className="div_summary_doc">
                    {docExpandButton}<span id="div_summary_doc_summary" dangerouslySetInnerHTML={{__html: this.props.doc_summary}} />
                    {docsRest}
                </div>
                <div className="div_summary_children">
                    {children}
                </div>
            </div>
            {refMenu}
        </div>;
    }
}

function pullSummaryInternal(id) {
    $.ajax({
        url: utils.make_url('summary?id=' + id),
        type: 'POST',
        dataType: 'JSON',
        cache: false
    })
    .done(function (json) {
        var state = {
            "page": "summary",
            "data": json,
            "id": id,
        };
        loadSummaryInternal(state);
        history.pushState(state, "", utils.make_url("#summary=" + id));
    })
    .fail(function (xhr, status, errorThrown) {
        console.log("Error with summary request for " + id);
        console.log("error: " + errorThrown + "; status: " + status);

        rustw.load_error();
        history.pushState({}, "", utils.make_url("#summary=" + id));
    });

    $("#div_main").text("Loading...");
}

function loadSummaryInternal(state) {
    topbar.renderTopBar("builtAndNavigating");
    renderSummary(state.data, $("#div_main").get(0));
    window.scroll(0, 0);
}

function renderSummary(data, container) {
    ReactDOM.render(
        <Summary breadCrumbs={data.breadCrumbs} parent={data.parent} signature={data.signature} doc_summary={data.doc_summary} doc_rest={data.doc_rest} children={data.children} />,
        container
    );
}
