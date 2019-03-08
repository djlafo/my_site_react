import React, { Component } from 'react';
import { connect } from 'react-redux';
import './file-list.css';
import Ajax from '../../classes/ajax';
import TrashIcon from '../../images/trash_icon.png'

class FileList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            newFile: '',
            newFileName: ''
        };
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.openFile = this.openFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }

    readFiles() {
        Ajax.read(`${this.props.apiURL}/files`, {
            auth: this.props.userUser.token
        }, (res) => {          
            this.setState({files: res.files});
        });  
    }

    componentDidMount() {
        this.readFiles();
    }

    handleFormChange(e) {
        this.setState({
            newFileName: e.target.value,
            newFile: e.target.files[0]
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let data = new FormData();
        data.append('file', this.state.newFile, this.state.newFileName);
        Ajax.post(`${this.props.apiURL}/files/upload`, {
            data: data,
            auth: this.props.userUser.token,
            json: false
        }, (res) => {
            this.readFiles();
        });
    }

    // openFile(e) {
    //     Ajax.read(`${this.props.apiURL}/files/${e.target.dataset.url}`, {
    //         auth: this.props.userUser.token
    //     }, (res) => {
    //         if(res.url) {
    //             window.open(res.url);  
    //         }
    //     });
    // }

    deleteFile(e) {
        Ajax.post(`${this.props.apiURL}/files/delete`, {
            auth: this.props.userUser.token,
            file: e.target.dataset.url
        }, (res) => {
            this.readFiles();
        });
    }

    render() {
        return (
            <div className="file-list">
                <div className="header"> 
                    Files
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input name="file"
                        type="file" 
                        required
                        onChange={this.handleFormChange}
                        value={this.state.newFileName} />
                    <input type="submit" value="upload file" />
                </form>
                <div className="list">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    Date
                                </th>
                                <th>
                                    Name
                                </th>
                                <th>
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.files.map(file => {
                                    return <tr key={file.name}>
                                        <td>
                                            {file.date}
                                        </td>
                                        <td>
                                            <a href={`${this.props.apiURL}/files/${file.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                {file.name}
                                            </a>
                                        </td>
                                        <td>
                                            <img src={TrashIcon} 
                                                data-url={file.path}
                                                onClick={this.deleteFile}
                                                className="trash-icon" />
                                        </td>
                                    </tr>;
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        apiURL: state.apiURL,
        userUser: state.user
    }
}

export default connect(mapStateToProps)(FileList);