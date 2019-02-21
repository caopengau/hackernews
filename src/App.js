import React, { Component } from 'react';

import axios from 'axios'; 
import './App.css';

const DEFAULT_QUERY = '';
const PATH_BASE = 'https://hn.algolia.com/api/v1'; 
// // error API page
// const PATH_BASE = 'https://hn.foo.bar.com/api/v1';
const PATH_SEARCH = '/search'; 
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const DEFAULT_HPP = '100'
const PARAM_HPP = 'hitsPerPage=';




const list = [
  { title: 'React', 
    url: 'https://facebook.github.io/react/', 
    author: 'Jordan Walke', 
    num_comments: 3, 
    points: 4, 
    objectID: 0, 
  }, 
  { 
    title: 'Redux', 
    url: 'https://github.com/reactjs/redux', 
    author: 'Dan Abramov, Andrew Clark', 
    num_comments: 2, 
    points: 5, 
    objectID: 1, 
  }, 
  ];
  
// function isSearched(searchTerm) { 
//   return function(item) {
//      return item.title.toLowerCase().includes(searchTerm.toLowerCase()); 
//   } 
// }

class App extends Component { 
  
  constructor(props){
    super(props);
    this.state = {
      searchTerm: DEFAULT_QUERY, 
      list: list,
      result: null,
      error: null, 
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this); 
    this.onSearchSubmit = this.onSearchSubmit.bind(this); 
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  fetchSearchTopStories(searchTerm, page = 0) { 
    // fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`) 
    // .then(response => response.json()) 
    // .then(result => this.setSearchTopStories(result))
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(result => this.setSearchTopStories(result.data))
    .catch(error => this.setState({ error }));
  }

  onSearchSubmit(event) { 
    const { searchTerm } = this.state; 
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  componentDidMount() { 
    const { searchTerm } = this.state; 
    this.fetchSearchTopStories(searchTerm); 
  }

  setSearchTopStories(result) { 
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [ ...oldHits, ...hits ];
    this.setState({ result: { hits: updatedHits, page } });
  }
  

  onSearchChange(event) { 
    this.setState({ searchTerm: event.target.value }); 
    console.log(this.state.searchTerm)
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id; 
    const updatedHits = this.state.result.hits.filter(isNotId); 
    // this.setState({ result: Object.assign({}, this.state.result, { hits: updatedHits }) })
    this.setState({ result: { ...this.state.result, hits: updatedHits } });

  }



  render() {

    const { searchTerm, result, error } = this.state;
    const page = (result && result.page) || 0; 

    if (error) { return <p>Something went wrong.</p>; }


    return (
      <div className="page">
        <div className="interactions">
        <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        { result && <Table list={result.hits} onDismiss={this.onDismiss} />}
        <div className="interactions"> 
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>More </Button> 
        </div>

      </div>
      
    ); 
  } 
}

// lightweight functional stateless component
// const Search = ({value,onChange,children})=>
//     <form>
//       {children}
//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//       >
//       </input>
//     </form>
const Search = ({ value, onChange, onSubmit, children }) => 
  <form onSubmit={onSubmit}> 
    <input type="text" value={value} onChange={onChange} /> 
    <button type="submit"> {children} </button> 
  </form>


// lightweight functional stateless component with block body
// function Search(props){
//   const{value,onChange,children} = props;
//   return(
//     <form>
//       {children}
//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//       >
//       </input>
//     </form>
//   )
// }

// class Search extends Component{
//   render(){
//     const {value, onChange, children} = this.props;
//     return (
//       <form>
//         {children}
//         <input 
//           type="text"
//           value={value}
//           onChange={onChange}
//         />
//       </form>
//     )
//   }
// }

function Table(props){
  const {list, onDismiss} = props;
  return(
    <div className="table">
      {list.map(item=>
       <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}> <a href={item.url}>{item.title}</a> </span> 
          <span style={{ width: '30%' }}> {item.author} </span> 
          <span style={{ width: '10%' }}> {item.num_comments} </span> 
          <span style={{ width: '10%' }}> {item.points} </span> 
          <span style={{ width: '10%' }}> <Button onClick={() => onDismiss(item.objectID)} className="button-inline" > Dismiss </Button></span>
       </div>
        )}
    </div>
  )
}

// class Table extends Component{
//   render(){
//     const {list, pattern, onDismiss} = this.props;
//     return(
//       <div>
//         {list.filter(isSearched(pattern)).map(item=>
//          <div key={item.objectID}>
//           <span><a href={item.url}>{item.title}</a></span>
//           <span>{item.author}</span>
//           <span>{item.num_comments}</span>
//           <span>{item.points}</span>
//           <span>
//             <Button
//               onClick={()=>onDismiss(item.objectID)}
//             >
//               Dismiss
//             </Button>
//           </span>
//          </div>
//           )}
//       </div>
//     )
//   }
// }
// function Button(props){
//   const {onClick,className,children} = props;
//   return(
//     <button
//       onClick={onClick}
//       className={className}
//       type="button"
//     >{children}</button>
//   )
// }
class Button extends Component{
  render(){
    const{
      onClick,
      className="",
      children,
    } = this.props;

    return(
      <button
        onClick={onClick}
        className={className}
        type="button"
      >{children}</button>
    )
  }
}
export default App;