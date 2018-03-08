import React, { Component } from 'react';

export default class ContainerTable extends Component {
    constructor(props){
        super(props);
        this._getRows.bind(this);
    }

    _browseInNewTab(url){
        let win = window.open(url, '_blank');
        win.focus();
    }

    _getRows(){
        if (this.props.rows && this.props.rows.length>0){
            return this.props.rows.map((dataObj, index)=>{
                return(<tr key={dataObj._id}>
                    <td>{dataObj.build_name}</td>
                    <td>{dataObj.description}</td>
                    <td>{dataObj.app_version}</td>
                    <td>{(new Date(parseInt(dataObj.timestamp,10))).toLocaleString()}</td>
                    <td><a href={dataObj.url} target="_blank" class="btn btn-success btn-block btn-sm" style={{color:"#fff"}} role="button">Download</a></td>
                </tr>)
            });
        }
        return <tr><td>Loading...</td></tr>
    }

    render() {
        return (
            <table className="table table-hover ">
            <thead>
              <tr>
                <th scope="col">Build Name</th>
                <th scope="col">Feature Description</th>
                <th scope="col">App Version</th>
                <th scope="col">Date Created</th>
                <th scope="col">Download URL</th>
              </tr>
            </thead>
            <tbody>
              {this._getRows()}
            </tbody>
          </table> 
        );
    }
}