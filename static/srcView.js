// Copyright 2017 The Rustw Project Developers.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import React from 'react';
import ReactDOM from 'react-dom';

const rustw = require('./rustw');
const utils = require('./utils');
const { BreadCrumbs } = require('./breadCrumbs');
const { MenuHost, Menu } = require('./menus');
const search = require('./search');
const summary = require('./summary');


function load_doc_or_src_link() {
    // TODO special case links to the same file
    var docUrl = this.dataset['doc-url'];

    if (!docUrl) {
        return rustw.load_link.call(this);
    }

    window.open(docUrl, '_blank');
}

// Menus, highlighting on mouseover.
function add_ref_functionality(self) {
    for (const el of $("#div_src_view").find(".class_id")) {
        const element = $(el);
        const classes = el.className.split(' ');
        for (const c of classes) {
            if (c.startsWith('class_id_')) {
                element.hover(function() {
                    $("." + c).css("background-color", "#d5f3b5");
                }, function() {
                    $("." + c).css("background-color", "");
                });

                const id = c.slice('class_id_'.length);
                const showRefMenu = (ev) => {
                    self.setState({ refMenu: { "top": ev.pageY, "left": ev.pageX, target: ev.target, id }});
                    ev.preventDefault();
                };
                element.on("contextmenu", showRefMenu);
                element.addClass("hand_cursor");

                break;
            }
        }
    }
}

// props: location, onClose, target
// location: { "top": event.pageY, "left": event.pageX }
function LineNumberMenu(props) {
    let items = [
        { id: "line_number_menu_edit", label: "edit", fn: edit, unstable: true }
    ];
    if (CONFIG.vcs_link) {
        items.push({ id: "line_number_vcs", label: "view in VCS", fn: view_in_vcs });
    }
    return <Menu id={"div_line_number_menu"} items={items} location={props.location} onClose={props.onClose} target={props.target} />;
}

// props: location, onClose, target, id
// location: { "top": event.pageY, "left": event.pageX }
function RefMenu(props) {
    let items = [{ id: "ref_menu_view_summary", label: "view summary", fn: () => summary.pullSummary(props.id) }];

    const docUrl = props.target.dataset['doc-url'];
    if (docUrl) {
        items.push({ id: "ref_menu_view_docs", label: "view docs", fn: () => window.open(docUrl, '_blank') });
    }
    const srcUrl = props.target.dataset['src-url'];
    if (srcUrl) {
        items.push({ id: "ref_menu_view_source", label: "view source", fn: window.open(srcUrl, '_blank') });
    }

    items.push({ id: "ref_menu_find_uses", label: "find all uses", fn: () => search.findUses(props.id) });

    let impls = props.target.dataset.impls;
    if (impls && impls != "0") {
        items.push({ id: "ref_menu_find_impls", label: "find impls (" + impls + ")", fn: () => search.findImpls(props.id) });
    }

    return <Menu id={"div_ref_menu"} items={items} location={props.location} onClose={props.onClose} target={props.target} />;
}

function view_in_vcs(target) {
    const file_name = history.state.file;
    const line_id = target.getAttribute("id");
    const line_number = parseInt(line_id.slice("src_line_number_".length));
    window.open(CONFIG.vcs_link.replace("$file", file_name).replace("$line", line_number), '_blank');
}

function edit(target) {
    $.ajax({
        url: utils.make_url('edit?file=' + target.dataset.link),
        type: 'POST',
        dataType: 'JSON',
        cache: false
    })
    .done(function (json) {
        console.log("edit - success");
    })
    .fail(function (xhr, status, errorThrown) {
        console.log("Error with edit request");
        console.log("error: " + errorThrown + "; status: " + status);
    });
}

class SourceView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { refMenu: null };
    }

    componentDidMount() {
        utils.highlight_spans(this.props.highlight, "src_line_number_", "src_line_", "selected");

        // Make source links active.
        var linkables = $("#div_src_view").find(".src_link");
        linkables.click(load_doc_or_src_link);

        add_ref_functionality(this);
    }

    render() {
        const self = this;
        const path = this.props.path.join('/');
        let numbers = [];
        let lines = []
        let count = 0;

        for (const l of this.props.lines) {
            count += 1;
            numbers.push(<LineNumber count={count} path={path} key={"num-" + count} />);
            lines.push(<Line count={count} line={l} key={"line-" + count} />);
        }

        let refMenu = null;
        if (!!this.state.refMenu) {
            const onClose = () => self.setState({ refMenu: null });
            refMenu = <RefMenu location={this.state.refMenu} onClose={onClose} target={this.state.refMenu.target} id={this.state.refMenu.id} />;
        }

        return <div id="div_src_view">
            <BreadCrumbs path={this.props.path} />
            <br />
            <div id="div_src_contents">
                <span className="div_src_line_numbers">
                    {numbers}
                </span>
                <span className="div_src_lines">
                    {lines}
                </span>
            </div>
            {refMenu}
        </div>;
    }
}

class LineNumber extends MenuHost {
    constructor(props) {
        super(props);
        this.menuFn = LineNumberMenu;
    }

    renderInner() {
        const numId = "src_line_number_" + this.props.count;
        const link = this.props.path + ":" + this.props.count;
        return <div className="div_src_line_number hand_cursor" id={numId} data-link={link}>
            {this.props.count}
        </div>;
    }
}

function Line(props) {
    let line;
    if (!props.line) {
        line = "&nbsp;"
    } else {
        line = props.line;
    }
    const lineId = "src_line_" + props.count;
    return <div className="div_src_line" id={lineId} dangerouslySetInnerHTML={{__html: line}} />;
}

function jumpToLine(line) {
    // Jump to the start line. 100 is a fudge so that the start line is not
    // right at the top of the window, which makes it easier to see.
    var y = line * $("#src_line_number_1").height() - 100;
    window.scroll(0, y);
}

module.exports = {
    renderSourceView: function(path, lines, highlight, line_start, container) {
        ReactDOM.render(<SourceView path={path} lines={lines} highlight={highlight} />, container);
        jumpToLine(line_start);
    }
}
