import React, { Component } from 'react';
import NavBar from './components/navbar';
import ContainerTable from './components/containerTable';
import Sidebar from './components/sidebar';
import './App.css';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {obj:[], env:"android", themeType:""};
    this._updateComponentList = this._updateComponentList.bind(this);
    this._updateTheme = this._updateTheme.bind(this);
  }

  _updateComponentList(searchString){
    this._fetchList(searchString);
  }

  _fetchList(searchString){
    let url = "/list/android/?name="+searchString
    fetch(url).then((data)=>{
      data.json().then((responseJson)=>{
        this.setState({obj:responseJson});
      }, (err)=>{
        console.log(err);
      })
    }, (err)=>{
      console.log(err);
    })
  }

  _updateTheme(themeType){
    this.setState({themeType:themeType});
  }

  componentDidMount(){
    this._fetchList("")
  }
  render() {
    return (
      <div className="App">
        <NavBar listItems={[{name:"Android",uri:"/", active:true},{name:"iOS (coming soon)",uri:"/ios"}]} searchCallback={this._updateComponentList} updateTheme={this._updateTheme} title="FlockBuild"></NavBar>
        <div className="container-fluid">
          <div className="row" style={{}}>
            <div className="col-sm-2 text-center sidebar">
              <h5>Create new build Tag</h5>
              <hr />
              <Sidebar env={this.state.env} createCallback={this._updateComponentList} themeType={this.state.themeType}/>
            </div>
            <div className="col-sm-10 content-container">
              <ContainerTable rows={this.state.obj} themeType={this.state.themeType}></ContainerTable>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
