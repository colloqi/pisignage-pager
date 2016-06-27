import React from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SendIcon from 'material-ui/svg-icons/content/send';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import Divider from 'material-ui/Divider';


let players = [
	{name: "first", ip: "10.50.15.67", key: 1 },
	{name: "second" , ip: "10.50.15.77", key: 2 },
	{name: "three" , ip: "10.50.15.87", key: 3 },
	{name: "four", ip: "10.50.15.97", key: 4 },
	{name: "five" , ip: "10.50.15.107", key: 5 },
	{name: "six" , ip: "10.50.15.117", key: 6 },
	{name: "seven", ip: "10.50.15.127", key: 7 },
	{name: "eight" , ip: "10.50.15.137", key: 8 },
	{name: "nine" , ip: "10.50.15.147", key: 9 }
]


let PlayerAdd = React.createClass ({
	search: function(e){
		console.log(e);
	},
	render : function(){
		let style = {width: "92%"};
		return (
			<div>
				<TextField  style={style}  type="text" hintText="Enter IP " />
				<RaisedButton  primary={true} onMouseUp={this.search} label="Add"/>
			</div>
		)
	}
})

let PlayerList = React.createClass ({
	getInitialState: function(){
		players = this.props.players
		return ({players: players});
	},
	getPlayerDetail: function(e){
		console.log('touch event')
	},
	render : function(){ // onTouchTap can be removed 
		let playerList = [];
		
		for (let player of players){
			playerList.push(
				
				<div key={player.key}>
					<ListItem key={player.key} primaryText={player.name+" - " + ( player.ip)} onTouchTap={this.getPlayerDetail} rightIconButton={<SendIcon/>}/>
					<Divider/>
				</div>
			)
		}
		return (
			<List>
				<Subheader>Connected Players </Subheader>
				{playerList}
			</List>
		)
	}
})

export default React.createClass({
	refreshList: function(){
		console.log('refreshList pressed');
	},
	render: function(){
		return (
			<div>
				<PlayerAdd />
				<PlayerList players={players} />
				
			</div>
		)
	}
})


