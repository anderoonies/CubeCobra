import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import FilterCollapse from './components/FilterCollapse';
import SortableTable from './components/SortableTable';

class TopCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: [],
      data: this.props.defaultData || [],
    };

    this.setFilter = this.setFilter.bind(this);
  }

  componentDidMount() {
    /* global */ autocard_init('autocard');
  }

  componentDidUpdate() {
    /* global */ autocard_init('autocard');
  }

  setFilter(filter, filterInput) {
    const params = new URLSearchParams([['f', filterInput]]);
    this.setState({ filter });
    fetch('/tool/api/topcards?' + params.toString()).then(response => response.json()).then(json => {
      this.setState({ data: json.data });
    }).catch(err => console.error(err));
  }

  render() {
    const rowF = ([name, img, img_flip, rating, picks]) => rating === null ? [] :
      <tr key={name}>
        <td className="autocard" card={img} card_flip={img_flip || undefined}>{name}</td>
        <td>{rating === null ? 'None' : ((1 - rating) * 100).toFixed(0)}</td>
        <td>{picks}</td>
      </tr>;

    return <>
      <div className="usercontrols pt-3">
        <h4 className="mx-3 mb-3">Top Cards</h4>
        <FilterCollapse
          isOpen={true}
          filter={this.state.filter}
          setFilter={this.setFilter}
          numCards={this.state.data.length}
          useQuery
        />
      </div>
      <SortableTable
        sorts={{ Rating: row => row[3], 'Total Picks': row => -row[4] }}
        defaultSort="Rating"
        headers={{ Name: {}, Rating: { style: { width: '10rem' } }, 'Total Picks': { style: { width: '10rem' } } }}
        data={this.state.data}
        rowF={rowF}
      />
    </>;
  }
}

const data = JSON.parse(document.getElementById('topcards').value);
const wrapper = document.getElementById('react-root');
const element = <TopCards defaultData={data} />;
wrapper ? ReactDOM.render(element, wrapper) : false;
