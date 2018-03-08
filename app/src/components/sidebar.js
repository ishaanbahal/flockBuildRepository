import React, { Component } from 'react';

export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = this._initState();
        this._initState = this._initState.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._createBuild = this._createBuild.bind(this);
        this._validateData = this._validateData.bind(this);
        this._showError = this._showError.bind(this);
        this._renderButton = this._renderButton.bind(this);
        this._showSuccess = this._showSuccess.bind(this);
        this._getTheme = this._getTheme.bind(this);
    }

    _initState() {
        return { build_name: "", description: "", app_version: "", url: "", error: "", buttonDisabled: false, successState: false };
    }

    _handleChange(event) {
        let target = event.target;
        switch (target.id) {
            case "build_name": return this.setState({ build_name: target.value });
            case "description": return this.setState({ description: target.value });
            case "app_version": return this.setState({ app_version: target.value });
            case "url": return this.setState({ url: target.value });
            default: return;
        }
    }

    _createBuild() {
        this.setState({ buttonDisabled: true, successState: false, error: false });
        let path = "/create/" + this.props.env;
        if (!this._validateData()) {
            this.setState({ buttonDisabled: false });
            return
        }
        let data = {
            build_name: this.state.build_name,
            description: this.state.description,
            app_version: this.state.app_version,
            url: this.state.url
        }
        fetch(path, {
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrer: 'no-referrer',
        }).then((data) => {
            let initState = this._initState();
            initState.successState=true;
            if (this.props.createCallback){
                this.props.createCallback("");
            }
            this.setState(initState);
        }, (err) => {
            this.setState({ buttonDisabled: false });
            this.setState({ error: err });
        })
    }

    _validateData() {
        if (this.state.build_name.trim() === "") {
            this.setState({ "error": "Build name cannot be empty" });
            return false;
        }
        if (this.state.url.trim() === "") {
            this.setState({ "error": "URL cannot be empty" });
            return false;
        }
        return true;
    }

    _showError() {
        if (this.state.error !== "") {
            return <div className="alert alert-danger" style={{ marginTop: 20 }} role="alert">{this.state.error}</div>
        }
        return null;
    }

    _getTheme(){
        switch(this.props.themeType){
            default: return "btn btn-primary btn-md btn-block";
            case "red": return "btn btn-danger btn-md btn-block";
            case "blue": return "btn btn-info btn-md btn-block";
            case "black": return "btn btn-dark btn-md btn-block";
        }
    }
    _renderButton() {
        if (this.state.buttonDisabled) {
            return <button type="button" className={this._getTheme()} disabled ><i className="fa fa-spinner fa-spin"></i> Create new build</button>;
        } else {
            return <button type="button" className={this._getTheme()} onClick={this._createBuild}>Create new build</button>;
        }
    }
    _showSuccess() {
        if (this.state.successState) {
            return <div className="alert alert-success" style={{ marginTop: 20 }} role="alert">Build create successful</div>
        }
        return null;
    }
    render() {
        return (
            <div className="form-group text-left">
                <input className="form-control" type="text" value={this.state.build_name} placeholder="Build name" id="build_name" onChange={this._handleChange} required />
                <small className="form-text text-muted" style={{ marginBottom: 10 }}>Provide a meaningful name</small>

                <input className="form-control" type="text" value={this.state.description} placeholder="Description" id="description" onChange={this._handleChange} />
                <small className="form-text text-muted" style={{ marginBottom: 10 }}>Describe what the feature does (optional)</small>

                <input className="form-control" type="text" value={this.state.app_version} placeholder="App Version" id="app_version" onChange={this._handleChange} />
                <small className="form-text text-muted" style={{ marginBottom: 10 }}>Provide the current app version (optional)</small>

                <input className="form-control" type="text" value={this.state.url} placeholder="Download URL" id="url" onChange={this._handleChange} required />
                <small className="form-text text-muted" style={{ marginBottom: 10 }}>Public URL to download builds</small>
                <hr />
                {this._renderButton()}
                {this._showError()}
                {this._showSuccess()}
            </div>
        );
    }
}