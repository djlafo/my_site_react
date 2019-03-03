import React, { Component } from 'react';
import './post-editor.css'

import Card from '../card/card';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageResize } from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize);

class PostEditor extends Component {

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            ['link', 'image', 'video'],
        ],
        imageResize: true
    }
    
    render() {
        return <div className="post-editor">
            <Card>
                <div>
                    <div className="header">
                        New Post
                    </div>
                    <div className="info">
                        <span>
                            Title: &nbsp;
                            <input />
                        </span>
                    </div>
                    <div className="body">
                        <ReactQuill modules={this.modules}/>
                    </div>
                    <button>
                        Submit
                    </button>
                </div>
            </Card>
        </div>
    }
}

export default PostEditor;