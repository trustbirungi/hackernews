import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './index.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

class App extends Component {
  constructor(props) {
    super(props);

      this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      hits: [],
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
  }

  onDismiss(id) {
    function isNotId(item) {
      return item.objectID !== id;
    }

    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({
      result: Object.assign({}, this.state.result, {hits: updatedList})
    });
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  setSearchTopStories(result) {
    this.setState({result});
  }

  componentDidMount() {
    const {searchTerm} = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  render() {
    const siteName = "HackerNews";
    const tagLine = "We'll stop writing it when you stop reading it!";
    const helloWorld = "Welcome To HackerNews!";

    const {searchTerm, result} = this.state;

    if(!result) {
      return null;
    }

    let user = {
      firstName: 'Trust',
      lastName: 'Birungi',
    };

    return (
      <div className="page">
        <h1>{siteName}</h1>
        <h1>||</h1>
        <h2>{tagLine}</h2>
        <h2>{user.firstName + ' ' + user.lastName}, {helloWorld}</h2>
        <br /><br />
        <ErrorBoundary>
          <div className="interactions">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange}
            >
              Search
            </Search>
          </div>

          <br /><br />
          <div className="Table">
            <Table
              list={result.hits}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />
          </div>
        </ErrorBoundary>
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const {value, onChange, children} = this.props;
    return(
      <form>
        {children} <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>
    );
  }
}

class Table extends Component {
  render() {
    const {list, pattern, onDismiss} = this.props;
    return(
      <div className="table">
        {list.filter(isSearched(pattern)).map(item =>
          <div key={item.objectID} className="table-row">
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{' ' + item.author}</span>
              <span>{' ' + item.num_comments}</span>
              <span>{' ' + item.points}</span>
              <span>
                <Button
                  onClick = {() => onDismiss(item.objectID)}
                  type = "Button"
                  className=""
                >
                  Dismiss
                </Button>
              </span>
            </div>
        )}
      </div>
    );
  }
}

class Button extends Component {
  render() {
    const {
      onClick,
      className = "",
      children,
    } = this.props;

    return(
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    );
  }
}

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

//An error boundary to provide a fallback UI in case a component fails instead of crashing the entire app
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true});
  }

  render(){
    if(this.state.hasError) {
      return <h1>Oops! Something went wrong. We are working relentlessly to fix it!</h1>
    }
    return this.props.children;
  }
}

export default App;
