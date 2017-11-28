import React, { Component } from 'react';
import _ from 'underscore';

import ReactProjectionGrid, { getPagination, getSelection } from 'ReactProjectionGrid'; // eslint-disable-line

import people from './people.json';

const config = {
  tableClasses: ['table', 'table-bordered'],
  dataSource: {
    type: 'memory',
    data: people.value,
    primaryKey: 'UserName',
  },
};

export default class App extends Component {
  constructor(props) {
    super(props);

    const pageSize = 3;

    this.state = {
      columns: [
        { name: 'UserName', sortable: true },
        { name: 'FirstName', title: 'first name', head: <h1>first name</h1> },
        { name: 'LastName', title: 'last name' },
        {
          name: 'AddressInfo',
          title: 'Address',
          Component: ({ record }) => {
            const { AddressInfo: addressInfo } = record;

            if (_.isEmpty(addressInfo)) {
              return <span>No address information</span>;
            }

            return _.map(addressInfo, addressInfoItem => (
              <ul key={_.uniqueId()} >
                <li key={_.uniqueId()}>{addressInfoItem.Address}</li>
                <li key={_.uniqueId()}>{JSON.stringify(addressInfoItem.City)}</li>
              </ul>
            ));
          },
        },
      ],
      pageNumber: 0,
      pageSize,
      pageCount: Math.ceil(_.size(config.dataSource.data) / pageSize),
      selectedKeys: [],
    };
  }

  render() {
    return (
      <div className="demo">
        <h3>This is the basic demo</h3>
        <button
          onClick={(e) => {
            e.preventDefault();

            this.setState({
              columns: _.uniq([...this.state.columns, { name: 'Emails' }]),
            });
          }}
        > Add emails column </button>
        <button
          onClick={(e) => {
            e.preventDefault();

            this.setState((preState) => {
              if (preState.pageNumber > 0) {
                return {
                  pageNumber: preState.pageNumber - 1,
                };
              }
              return {
                pageNumber: preState.pageNumber,
              };
            });
          }
          }
        > Previous page </button>
        <button
          onClick={(e) => {
            e.preventDefault();

            this.setState((preState) => {
              if (preState.pageNumber < preState.pageCount - 1) {
                return {
                  pageNumber: preState.pageNumber + 1,
                };
              }
              return {
                pageNumber: preState.pageNumber,
              };
            });
          }
          }
        > Next page </button>
        <div>selected items is: {JSON.stringify(this.state.selectedKeys)}</div>
        <ReactProjectionGrid
          config={{
            records: people.value,
            columns: this.state.columns,
            primaryKey: 'UserName',
          }}
          projections={[getPagination({
            pageNumber: this.state.pageNumber,
            pageSize: this.state.pageSize,
          }), getSelection({
            onSelectChanged: selectedKeys => this.setState({ selectedKeys }),
            selected: this.state.selectedKeys,
          }),
          ]}
        />
      </div>
    );
  }
}
