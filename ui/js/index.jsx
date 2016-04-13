/*
===================================
		HOME/NAV
===================================
*/

let LeftNav = React.createClass({
	propTypes: {
	    handle: React.PropTypes.string
	},
	renderAuth(handle) {
		if (_.isEmpty(handle)) {
			return '';
		}
		return (
			<div className="supp-nav">
				<div className="cta nav-sect compose">
					<button className="btn waves-effect waves-light">Compose</button>
				</div>
				<div className="nav nav-sect">
					<ul>
						<li><a className="waves-effect waves-teal btn-flat">Inbox</a></li>
						<li><a className="waves-effect waves-teal btn-flat">Sent</a></li>
						<li><a className="waves-effect waves-teal btn-flat">Favorited</a></li>
					</ul>
				</div>
			</div>
		);
	},
	render() {
		let { handle } = this.props,
			additionalNav = !_.isEmpty(handle) ? this.renderAuth() : '';
		return (
			<div className="LeftNav">
				<div className="brand nav-sect">
					<h5>tMail.com</h5>
				</div>
				<div className="cta nav-sect login">
					<AccountComp handle={ handle } />
				</div>
				{ this.renderAuth(handle) }
			</div>
		);
	}
});

let AccountComp = React.createClass({
	propTypes: {
	    handle: React.PropTypes.string
	},
	getInitialState() {
	    return {
	        exp: false,
	        handle: undefined
	    };
	},
	handleLogin(e) {
		let newHandle = $('#twitterHandle').val();
		if (!_.isEmpty(newHandle)) {
			$('body').trigger('twitter:onHandleChange', {
				oldHandle: this.props.handle,
				newHandle
			});
			this.setState({
				exp: false
			});
		}
	},
	renderAuthForm(handle) {
		return (
			<div className="input-field">
				<input placeholder="dhh" id="twitterHandle" type="text" className="validate" defaultValue={ handle } />
				<label className="active" for="twitterHandle">Twitter Handle</label>
				<button className="btn waves-effect" onClick={ this.handleLogin }>Login</button>
			</div>
		);
	},
	renderUsername(handle) {
		return (
				<div className="auth">
					<span className="text-muted">Logged in as:</span> <a href="#login" onClick={ () => this.setState({ exp: true }) }>{ handle }</a>
				</div>
			);
	},
	renderAnon() {
		return (
			<div className="auth-anon">
				<button className="btn red accent-4" onClick={ () => this.setState({ exp: true }) }>Please Log In</button>
			</div>
		);
	},
	render() {
		let { exp } = this.state,
			{ handle } = this.props,
			content;
		if (exp) {
			content = this.renderAuthForm(handle);
		} else if (!_.isEmpty(handle)) {
			content = this.renderUsername(handle);
		} else {
			content = this.renderAnon();
		}
		return (
			<div className="AccountComp">
				{ content }
			</div>
		);
	}
});


let ApplicationContainer = React.createClass({
	getInitialState() {
	    return {
	        handle: undefined,
	        view: ''
	    };
	},
	updateHandle(e, data) {
		console.log("Changing auth: " + data.oldHandle + " => " + data.newHandle);
		this.setState({
			handle: data.newHandle,
			view: <InboxContainer handle={ data.newHandle } />
		});
	},
	componentWillMount() {
		$('body').on('twitter:onHandleChange', this.updateHandle);
	},
	componentDidMount() {
		setTimeout(() => {
			this.updateHandle(null, { newHandle: 'dhh' });
		}, 1000);
	},
	render() {
		return (
			<div className="ApplicationContainer">
				<div className="container">
					<div className="row">
						<div className="col s3">
							<LeftNav handle={ this.state.handle } />
						</div>
						<div className="col s9">
							{ this.state.view }
						</div>
					</div>
				</div>
				
			</div>
		);
	}
});

ReactDOM.render(
        <ApplicationContainer />,
        document.getElementById('app-container')
      );


/*
===================================
		INBOX
===================================
*/

let InboxContainer = React.createClass({
	propTypes: {
		handle: React.PropTypes.string.isRequired
	},
	getInitialState() {
		return {
			view: 'all'
		};
	},
	componentDidMount() {
	    $('ul.tabs').tabs();
	},	
	render() {
		let content;
		switch (this.state.view) {
			case 'all':
				content = <InboxAllContainer handle={ this.props.handle } />;
				break;
			default:
				content = <div className="loading">Loading...</div>;
		}
		return (
			<div className="InboxContainer">
				<div className="cta-row">
					<button className="waves-effect"><i className="fa fa-refresh"></i></button>
				</div>
				{ content }
			</div>
		);
	}
});

let InboxAllContainer = React.createClass({
	propTypes: {
		handle: React.PropTypes.string.isRequired
	},
	getInitialState() {
	    return { };
	},
	componentDidMount() {
		let self = this;
	    setTimeout(() => {
			self.setState({
				tweets: [
					{
						"favorited": false,
						"created_at": "Wed Aug 29 17:12:58 +0000 2012",
						"text": "Introducing the Twitter Certified Products Program: https://t.co/MjJ8xAnT",
						"retweet_count": 121,
						"id": 240859602684612608,
						"retweeted": false,
						"in_reply_to_user_id": null,
						"user": {
							"name": "Twitter API",
							"profile_image_url": "https://pbs.twimg.com/profile_images/2556368541/alng5gtlmjhrdlr3qxqv_400x400.jpeg",
							"id": 6253282,
							"screen_name": "twitterapi"    
						},
						"in_reply_to_screen_name": null,
						"in_reply_to_status_id": null  
					}, {
						"favorited": false,
						"created_at": "Sat Aug 25 17:26:51 +0000 2012",
						"contributors": null,
						"text": "We are working to resolve issues with application management & logging in to the dev portal: https://t.co/p5bOzH0k ^TS",
						"retweet_count": 105,
						"id": 239413543487819778,
						"retweeted": false,
						"in_reply_to_user_id": null,
						"user": {
							"name": "Twitter API",
							"profile_image_url": "https://pbs.twimg.com/profile_images/2556368541/alng5gtlmjhrdlr3qxqv_400x400.jpeg",
							"id": 6253282,
							"screen_name": "twitterapi"    
						},
						"in_reply_to_screen_name": null,
						"in_reply_to_status_id": null  
					}
				]
			});
		}, 500);  
	},
	render() {
		let { tweets } = this.state;
		if (_.isUndefined(tweets)) {
			return <div className="loading">Loading...</div>
		}
		return (
			<div className="InboxAllList">
				{ tweets.map((t) => <InboxRow tweet={ t } />) }
			</div>
		);
	}
});

let InboxRow = React.createClass({
	propTypes: {
		tweet: React.PropTypes.object.isRequired
	},
	render() {
		let { tweet: t } = this.props;
		console.log(t.text);
		return (
			<div className="InboxRow">
				<div className="tr-item">
					<i className={ "fa fa-heart" + (t.favorited ? 'active' : '') }></i>
				</div>
				<div className="tr-item">
					<div className="chip">{ moment(new Date(t.created_at)).fromNow() }</div>
				</div>
				<div className="tr-item">
					<img src={ t.user.profile_image_url } className="circle"/>
				</div>
				<div className="tr-item">
					<div className="text-muted">{ t.text }</div>
				</div>
			</div>
		);
	}
});
