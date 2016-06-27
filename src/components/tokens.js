import React from 'react';

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List'
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';

let dummyTokens = [
{ title: 1 , key: 1},
{ title: 2 , key: 2},
{ title: 3 , key: 3}
];

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
	getInitialState: function(){
		return {totalEntry: dummyTokens};
	},
	render: function(){	
		let tokens = [];

		for(let entry of this.state.totalEntry){
			console.log(entry)
			tokens.push(
					<li key={entry.key}>{entry.title}</li>
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


export default React.createClass({
	render : function(){
		return (
			<div>
				<AddToken />
				<TokenList />
				
			</div>
		)
	}
})