import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies : [],
      dropdownOpen1 : false,
      dropdownOpen2 : false,
      value1 : 'MYR',
      value2 : 'MYR',
      amount : 0,
      history : [],
      name1 : '',
      name2 : '',
      result : ''
    };
    this.toggle1 = this.toggle1.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.select1 = this.select1.bind(this);
    this.select2 = this.select2.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);
    axios.get('/getCurrencyList').then(res=>{
      this.state.currencies = res.data
    })
    this.getCurencyHistory();
  }

  deleteRecord(id){
    // console.log('to delete: ', id);
    const query = `/deleteOne?id=${id}`;
    axios
      .get(query)
      .then(result => {
        this.getCurencyHistory();
      })
      .catch(error => {
        alert('Error: ', error);
      });
  };

  toggle1() {
      this.setState({
        dropdownOpen1: !this.state.dropdownOpen1,
      });
  }
  toggle2() {
    this.setState({
      dropdownOpen2: !this.state.dropdownOpen2,
    });
  }

  select1(event1,var1){
    this.setState({
      dropdownOpen1: !this.state.dropdownOpen1,
      value1 : event1.target.innerText,
      name1: var1
    })
  }

  select2(event2,var2){
    this.setState({
      dropdownOpen2: !this.state.dropdownOpen2,
      value2 : event2.target.innerText,
      name2: var2
    })
  }

  // getAllData (){
  //    axios.get('/getAll',(req,res)=>{
  //     // console.log(res.data)
  //     this.state.history = res.data;
  //     this.setState({history:this.state.history})
  //   })
  // }
  async handleTransfer(e){
    e.preventDefault();
    await this.setState({
      amount : this.numberInput.value
    })
    axios
      .get(`/ConvertCurrency?to=${this.state.value2}&from=${this.state.value1}&amount=${this.state.amount}`)
      .then(result => {
        // console.log("result " , result.data);
        this.state.result = result.data.result;
        this.setState({result:this.state.result})
        var len = this.state.history.length
        this.state.history[len]= result.data

        this.setState(this.state.history)
        console.log(this.state.history[len])

      })
      .catch(error => {
        console.log(error);
      });
  }

  getCurencyHistory(){
    axios.get('/getCurrencyHistory').then(res=>{
      this.state.history= res.data
      this.setState({history:this.state.history})
    })

  }

  render() {
    return ( 
      <div className="App">
          <div className="jumbotron text-center header">
          <h1>Currency Converter</h1>
          <p>Please Input Currency You Wish To Change</p>
          </div>
          <div className="container search">
          <div className="col-sm-4">
            <p />
                <label>From : {this.state.name1}</label>
              <Dropdown isOpen={this.state.dropdownOpen1} toggle={this.toggle1}>
                <DropdownToggle caret>
                  {this.state.value1}
                </DropdownToggle>
                <DropdownMenu>
                  {this.state.currencies.map((currency, index) => 
                  {
                   return <DropdownItem value="Select Currency">
                    <div onClick = {(e)=>this.select1(e,currency.CurrencyName)}>
                      {currency.basedCurrencyCode}
                    </div>
                    </DropdownItem>
                  })}
                </DropdownMenu>
              </Dropdown>
            <p/>
          </div>
          <div className="col-sm-4">
            <p />
            <label>To : {this.state.name2}</label>
            <Dropdown isOpen={this.state.dropdownOpen2} toggle={this.toggle2}>
                <DropdownToggle caret id="toID">
                  {this.state.value2}
                </DropdownToggle>
                <DropdownMenu>
                  {this.state.currencies.map((currency) => 
                  {
                   return <DropdownItem value="Select Currency">
                    <div onClick = {(e)=>this.select2(e,currency.CurrencyName)}>
                      {currency.basedCurrencyCode}
                    </div>
                    </DropdownItem>
                  })}
                </DropdownMenu>
              </Dropdown>
            <p />
          </div>
          <form class="form-inline">
          <div className="input-group">
            <p />
              <input
                type="number"
                className="form-control"
                placeholder ='Amount'
                ref={input => (this.numberInput = input)}
              />
            <p />
            <button onClick = {this.handleTransfer} >Transfer !</button>
          </div>
          </form>
        </div>

        <div className ="container">
        <label>{this.state.amount} {this.state.value1} = {this.state.result} {this.state.value2}</label>

        </div>
            <div className="container">
              <div className="col-sm-12">
            <p />
            <ReactTable
              data={this.state.history.reverse()}
              columns={[
                {
                  Header: 'Delete',
                  Cell: row => (
                    <button
                      onClick={() => {
                        this.deleteRecord(row.original._id);
                      }}
                    >
                      Delete
                    </button>
                  )
                },
                {
                  Header: 'Convert From',
                  accessor: 'from'
                },
                {
                  Header: 'To',
                  accessor: 'to'
                },
                {
                  Header: 'Rates',
                  accessor: 'rates',
                  
                },
                {
                  Header: 'Result',
                  accessor: 'result',
                },
                { 
                  Header: 'Status',
                  accessor: 'status',

                },
                {
                  Header: 'Updated Date',
                  accessor: 'updated_date',
                },
                
              ]}
              defaultPageSize={5}
              className="-striped -highlight"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
