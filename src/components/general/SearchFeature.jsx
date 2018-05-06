import React, { Component } from 'react'

class SearchFeature extends Component {
  constructor () {
    super()
    this.state = {
      search: ''
    }
  }

  handleSearch = (e) => {
    this.setState({
      search: e.target.value
    })
  }
  handleSubmit = (e) => {
    this.props.submit(e, this.state.search)
  }

  render() {
    return (
      <div>
        <form>
          <input 
            type="text" 
            onChange ={this.handleSearch} 
            value= {this.search} 
            style = {{
              width: '40%',
              margin: '0px 10px',
            }}/>
            <button type="button" onClick = { this.handleSubmit }> Search </button>
        </form>
      </div>
    );
  }
}

export default SearchFeature