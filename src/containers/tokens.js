import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List'
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';

let formValue = 10;
let AddToken = React.createClass({
	getInitialState: function(){
		return ({formValue: formValue})
	},
	addNewToken: function(e){
		console.log('add new token', this.state);
	},
	render: function(){

		let style = {width: "92%"};
		return (
			<div>
				<TextField style={style}  type="text" hintText="Enter Token" value={this.state.formValue}/>
				<RaisedButton  primary={true} onMouseUp={this.addNewToken} icon={<AddIcon />} />
			</div>
		)
	}
})

let TokenList = React.createClass({
	render: function(){
		let tokens = [];

		for(let entry of this.props.tokens){
			console.log(entry)
			tokens.push(
					<li key={entry}>{entry}</li>
			)
		};

		return (
			<List>
				<ul>
					{tokens}
				</ul>
			</List>
		)
	}
})


let Tokens = React.createClass({
	render : function(){
		return (
			<div>
				<TokenList tokens={this.props.tokens} />
				
			</div>
		)
	}
})

Tokens.propTypes = {
    counters: PropTypes.array.isRequired,
    tokens: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    console.log("tokens getting ")
    console.log(state.token)
    return {
        counters: state.token.counters,
        tokens: state.token.tokens,
    };
}

export default connect(mapStateToProps)(Tokens);
