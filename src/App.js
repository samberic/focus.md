import React, {Component} from 'react';
import './App.css';
import MarkdownIt from 'markdown-it'
import {configure, GlobalHotKeys} from 'react-hotkeys'
import * as Mousetrap from 'mousetrap';
import classNames from 'classnames'
import {saveAs} from 'file-saver';

const keyMap = {
    PREVIEW: "ctrl+shift+p",
    SAVE: "ctrl+s",
    BOLD: "ctrl+b",
    ITALIC: "ctrl+i",
    CODE: "ctrl+shift+b"
};


Mousetrap.stopCallback = function (e, element, combo) {
    // stop for input, select, and textarea
    return element.tagName == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true');
};

configure({
    ignoreTags: []
})

class App extends Component {

    handlers = {
        PREVIEW: event => this.setState((state) => {
            return {
                ...state,
                preview: !state.preview
            }
        }),

        BOLD: event => {
            let bold = "**";
            this.wrapAction(bold);
        },
        ITALIC: event => {
            let bold = "__";
            this.wrapAction(bold);
        },
        CODE: event => {
            let bold = "```";
            this.wrapAction(bold);
        },
        SAVE: event => {
            var FileSaver = require('file-saver');
            var blob = new Blob([this.state.txt], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "hello world.txt");
        }

    };

    wrapAction(bold) {
        let textArea = this.refs.myTextArea;
        const {selectionStart, selectionEnd} = textArea;
        let diff = selectionEnd - selectionStart;

        const newValue =
            this.state.txt.substring(0, selectionStart) +
            bold + this.state.txt.substring(selectionStart, selectionEnd) +
            bold + this.state.txt.substring(selectionEnd);

        this.setText(newValue, () => {

            textArea.selectionStart = selectionStart + 2;
            console.log(textArea.selectionStart+  " and " +textArea.selectionEnd)
            textArea.selectionEnd = textArea.selectionStart + diff;
        });
    }

    md = new MarkdownIt();

    constructor(props, context) {
        super(props, context);
        this.state = {
            txt: localStorage.getItem("doco") || "Text here...",
            rendered: this.md.render(localStorage.getItem("doco") || "Text here..."),
            preview: false
        }
    }

    rerender = (event) => {
        let text = event.target.value;
        this.setText(text);
    }

    setText(text, callback) {
        localStorage.setItem("doco", text)

        console.log("rendering: " + text)
        this.setState(state => { return {...state, txt: text, rendered: this.md.render(text)}}, callback);
    }

    render() {
        const previewClass = classNames({
            'column': true,
            'hidden': !this.state.preview,
            'show': this.state.preview
        });

        return (
            <div className="App">
                <GlobalHotKeys keyMap={keyMap} handlers={this.handlers}/>

                <header className="App-header">
                </header>
                <div className="wrapper">
                    <div className='row'>
                        <div className='column'>
                            <textarea id="txt" onChange={this.rerender} ref="myTextArea" value={this.state.txt}></textarea>
                        </div>
                        <div className={previewClass}>
                            <div dangerouslySetInnerHTML={{__html: this.state.rendered}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
