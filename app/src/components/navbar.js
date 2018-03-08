import React, { Component } from 'react';
import Logo from '../styles/logo.svg';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = { search: "", themeClass:"navbar navbar-expand-lg navbar-dark bg-primary" }
        this._getChildLinks = this._getChildLinks.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._doSearch = this._doSearch.bind(this);
        this._changeTheme = this._changeTheme.bind(this);
    }
    _getChildLinks() {
        if (this.props.listItems) {
            return this.props.listItems.map((dataObj, index) => {
                if (dataObj.active) {
                    return (
                        <li className="nav-item active" key={index}>
                            <a className="nav-link" href={dataObj.uri}>{dataObj.name}<span className="sr-only">(current)</span></a>
                        </li>);
                }
                else {
                    return (
                        <li className="nav-item" key={index}>
                            <a className="nav-link" href={dataObj.uri}>{dataObj.name}</a>
                        </li>
                    );
                }
            });
        }
        return [];
    }
    _doSearch(event) {
        this.props.searchCallback(this.state.search);
    }

    _handleChange(event) {
        let target = event.target;
        this.setState({ search: target.value })
    }

    _changeTheme(event){
        switch(event.target.id){
            case "red":
                this.props.updateTheme("red");
                return this.setState({themeClass:"navbar navbar-expand-lg navbar-dark bg-danger"});
            case "blue":
                this.props.updateTheme("blue");
                return this.setState({themeClass:"navbar navbar-expand-lg navbar-dark bg-info"});
            case "black":
                this.props.updateTheme("black");
                return this.setState({themeClass:"navbar navbar-expand-lg navbar-dark bg-dark"});
            default : 
                this.props.updateTheme("");
                return this.setState({themeClass:"navbar navbar-expand-lg navbar-dark bg-primary"});
        }
    }
    render() {
        return (
            <nav className={this.state.themeClass}>
                <a className="navbar-brand" href="/"><img src={Logo} height="30" width="30" className="d-inline-block align-top" alt="" /> {this.props.title}</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        {this._getChildLinks()}
                    </ul>
                </div>
                <div className="form-inline my-4 my-lg-0">
                    <input className="form-control mr-sm-2" type="search" placeholder="Search for build" aria-label="Search" onChange={this._handleChange} />
                    <button className="btn btn-outline-warning my-2 my-sm-0" type="button" onClick={this._doSearch}>Search</button>
                    <div className="btn btn-danger" id="red" title="Red Theme" onClick={this._changeTheme} style={{ marginLeft:10, width:20, height:20, borderRadius:20, padding:0}}></div>
                    <div className="btn btn-info" id="blue" title="Blue Theme" onClick={this._changeTheme} style={{ marginLeft:10, width:20, height:20, borderRadius:20, padding:0}}></div>
                    <div className="btn btn-dark" id="black" title="Black Theme" onClick={this._changeTheme} style={{ marginLeft:10, width:20, height:20, borderRadius:20, padding:0}}></div>
                </div>
            </nav>
        );
    }
}