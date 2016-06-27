import React from 'react';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';


let ManualItem = React.createClass({
	getInitialState: function(){
		return {manual: this.props.manual};
	},
	togglePress: function(e){
		this.setState({manual: ! this.state.manual})
		console.log('manual button Toggle',this.state)
	},
	render: function(){

		return(
			<div>
				<ListItem >
					<Toggle label="Manual" labelPosition="left"  defaultToggled={this.state.manual} onToggle={this.togglePress} /> 
				</ListItem>
				<TextField floatingLabelText="Start From ..." disabled={ !this.state.manual} />
				<TextField floatingLabelText="End To..." disabled={!this.state.manual} />
			</div>
		)
	}
})


export default React.createClass({
	render: function(){
		return (
			<List>
				<Subheader>Generate</Subheader>
				<ManualItem manual={false}/>
				<ListItem primaryText="ClearAll" />
			</List>
		)
	}
})