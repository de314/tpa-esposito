/*
I debated how to implement the UI for the assessment. I decided to go with a demo-esque structure
so that it is easier to follow and analyze.

All client side application logic is contained in this file. It can be broken up into sections
which are responsible for different parts of the app.
*/



/*
=================================
		General Utils
=================================
*/
let Loading = React.createClass({
	render() {
		return (
			<div className="Loading">
				Loading...
			</div>
		);
	}
});



/*
=================================
		Tweet Filter Form
=================================
Given more time I would implement this using Redux or more simple jQuery event driven logic.
This maintains the state for Timeline and Search filter states as well as notifies the 
application container when the filter has changed. This is done via a call back function.
I believe that this is not a bad approach for smaller applications, POCs, and 1-offs but it
woould not be a scalable solution for a larget application; especially for one that require
multiple actions/tasks for a change of application state.
*/
let FilterForm = React.createClass({
	propTypes: {
	    onUpdateFilter: React.PropTypes.func.isRequired
	},
	componentDidMount() {
		// Given more time, I would have use react refs, but this is simple materialize example code for initializin dynamically loaded tabs
	    $('ul.tabs').tabs();  
	},
	// ideally, this would be pull out into an action/reducer in redux
	handleNewScreenName(e) {
		e.preventDefault();
		let screenName = $('#screenName').val();
		this.props.onUpdateFilter({
			screenName
		});
	},
	// ideally, this would be pull out into an action/reducer in redux
	handleNewSearchTerms(e) {
		e.preventDefault();
		let q = $('#q').val();
		this.props.onUpdateFilter({
			q
		});
	},
	render() {
		let { filter } = this.props;
		return (
			<div className="FilterForm">
				<div className="row">
					<div className="col s12">
						{/* ideally, tabs would be abstracted into a separate react component */}
						<ul className="tabs">
							<li className="tab col s6"><a href="#timeline-filter">User Timeline</a></li>
							<li className="tab col s6"><a href="#search-filter">Tweet Search</a></li>
						</ul>
					</div>
					{/* each of the following filter forms could/probably should be pulled out into a separate component */}
					<div id="timeline-filter" className="col s12">
						<p>
							View a users timeline by providing their twitter screen name below. You do not need to prepend the screen name with an "@".
						</p>
						{/* form required for Submit on [ENTER] */}
						<form onSubmit={ this.handleNewScreenName }>
							<div className="input-field">
								<input placeholder="TBSInc" id="screenName" type="text" defaultValue={ filter.screenName } />
								<label className="active" for="screenName">Screen Name</label>
							</div>
							<div className="right">
								<button className="btn waves-effect waves-light" type="submit">Submit</button>
							</div>
						</form>
					</div>
					<div id="search-filter" className="col s12">
						<p>
							Search tweets by entering a query below. You can search for mentions of a user with their screen name e.g. @TBSInc.
						</p>
						<form onSubmit={ this.handleNewSearchTerms }>
							<div className="input-field">
								<input placeholder="Turner Broadcasting" id="q" type="text" defaultValue={ filter.q } />
								<label className="active" for="q">Search Terms</label>
							</div>
							<div className="right">
								<button className="btn waves-effect waves-light" type="submit">Submit</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
});


// This should probably be converted to a container that passes appropriate state to
// sub-components to implement the multiple view types.
let TweetList = React.createClass({
	propTypes: {
		tweets: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
	},
	getInitialState() {
		return {
			view: 'rows'
		};
	},
	// put in another component
	renderRows(tweets) {
		return (
			<div className="tweet-rows">
				{ tweets.map((t) => <TweetRow tweet={t} />) }
			</div>
		);
	},
	// put in another component
	renderTiles(tweets) {
		return (
			<div className="tweet-tiles">
				<div className="row">
					{ tweets.map((t) => <TweetTile tweet={ t } />) }
				</div>
			</div>
		);
	},
	render() {
		let self = this,
			{ tweets } = this.props;
		if (!tweets) {
			return <Loading />;
		}
		console.log('render', this.state.view);
		let renderCb;
		switch (this.state.view) {
			case 'tiles':
				renderCb = this.renderTiles;
				break;
			case 'rows':
			default:
				renderCb = this.renderRows;
		}
		return (
			<div className="TweetList">
				<div className="row">
					<div className="col s12">
						<div className="right">
							{/* the on click handlers should be moved to redux action/reducers */}
							<button className="btn waves-effect grey lighten-3 black-text"><i className="fa fa-list" onClick={ () => self.setState({ view: 'rows' }) }></i></button>
							<button className="btn waves-effect grey lighten-3 black-text"><i className="fa fa-th" onClick={ () => self.setState({ view: 'tiles' }) }></i></button>
						</div>
					</div>
				</div>
				{ renderCb(tweets) }
			</div>
		);
	}
});

// simple component to display model state
let TweetRow = React.createClass({
	propTypes: {
	    tweet: React.PropTypes.object.isRequired
	},
	render() {
		let { tweet: t } = this.props,
			profileUrl = "https://twitter.com/" + t.user.screen_name;
		return (
			<div className="TweetRow">
				<div className="card-panel">
					<div className="row">
						{/* responsive row layout */}
						<div className="col s6 offset-s3 m4 l3">
							<a href={ profileUrl }>
								<img src={ t.user.profile_image_url } className="responsive-img circle"/>
							</a>
						</div>
						{/* responsive row layout */}
						<div className="col s12 m8 l9">
							<div className="user-row row">
								<div className="user-profile">
									<a href={ profileUrl }>
										<span className="username-header">{ t.user.name } (@{ t.user.screen_name })</span>
										<span className="text-muted"><i className="fa fa-users"></i> { t.user.followers_count }</span>
									</a>
								</div>
								<div className="user-info">
									{/* this moment pattern is used multiple times and should probably be pulled out into a util lib class (DRY) */}
									<div className="text-muted">Registered: { moment(new Date(t.user.created_at)).fromNow() }</div>
								</div>
							</div>
							<div className="tweet-row">
								<div className="body">
									<blockquote>
										{/* entities from the twitter responses are not replaced with links/media. This is an improvement that could
											potentially be implemented using UI libs from Twitter/Embely. */}
										{ t.text }
									</blockquote>
								</div>
								<div className="stats right">
									<div className="chip">{ moment(new Date(t.created_at)).fromNow() }</div>
									<div className="chip"><i className="fa fa-retweet"></i> { t.retweet_count }</div>
									<div className="chip"><i className="fa fa-heart"></i> { t.favorite_count }</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

// simple component to display model state
let TweetTile = React.createClass({
	propTypes: {
	    tweet: React.PropTypes.object.isRequired,
	    tileWidthClass: React.PropTypes.string
	},
	getDefaultProps() {
	    return {
	    	// customizable reactive layout based on screen width. These are the defaults.
	    	// Ideally, more break points would be implemented (bootstrap has an extra xs size).
	        tileWidthClass: 'col s12 m10 offset-m1 l6'
	    };
	},
	// very similar render function as TweetRow with a different layout.
	render() {
		let { tweet: t } = this.props,
			profileUrl = "https://twitter.com/" + t.user.screen_name,
			tileWidthClass = "TweetTile " + this.props.tileWidthClass;
		return (
			<div className={ tileWidthClass }>
				<div className="card-panel">
					<div className="row">
						<div className="col s6">
							<a href={ profileUrl }>
								<img src={ t.user.profile_image_url } className="responsive-img circle"/>
							</a>
						</div>
						<div className="col s6 valign-wrapper">
							<div className="user-row row valign">
								<div className="user-profile">
									<a href={ profileUrl }>
										<span className="username-header">{ t.user.name } (@{ t.user.screen_name })</span>
										<span className="text-muted"><i className="fa fa-users"></i> { t.user.followers_count }</span>
									</a>
								</div>
								<div className="user-info">
									<div className="text-muted">Registered: { moment(new Date(t.user.created_at)).fromNow() }</div>
								</div>
							</div>
						</div>
						<div className="col s12">
							<div className="tweet-row">
								<div className="body">
									<blockquote>
										{ t.text }
									</blockquote>
								</div>
								<div className="stats right">
									<div className="chip">{ moment(new Date(t.created_at)).fromNow() }</div>
									<div className="chip"><i className="fa fa-retweet"></i> { t.retweet_count }</div>
									<div className="chip"><i className="fa fa-heart"></i> { t.favorite_count }</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});




// Top level component and application entry point. This contains/manages the toplevel 
// state for filters and the tweet list.
// There is no pagination, but infinite scroll would not be terrible to add. You would have to maintain the
// page state along with the 'tweets' list and modify the endpoints to take an extra query param specifying
// page number.
let ApplicationContainer = React.createClass({
	getInitialState() {
	    return {
	    	filter: {
	    		// default to turner, maybe store the default in a cookie or require OAuth for use.
	    		screenName: 'TBSInc'
	    	}
	    };
	},
	// ideally, this would be moved into redux
	_updateSearchResults(filter) {
		let self = this;
		// the api call should probably be moved into a simplified client library that could be
		// opensourced should the need arise.
		$.get("/api/twitter/search?q=" + filter.q)
			.done((data) => {
				console.log(data);
				self.setState({
					tweets: data.statuses
				});
			});
	},
	// ideally, this would be moved into redux
	_updateTimelineResults(filter) {
		let self = this;
		// the api call should probably be moved into a simplified client library that could be
		// opensourced should the need arise.
		$.get("/api/twitter/timeline?screen_name=" + filter.screenName)
			.done((data) => {
				console.log(data);
				self.setState({
					tweets: data
				});
			});
	},
	// ideally, this would be moved into redux
	_updateFilter(filter = this.state.filter) {
		this.setState({
			filter,
			tweets: undefined
		});
		// this conditional logic could be removed by replacing it with events driven logic.
		if (!!filter.screenName) {
			this._updateTimelineResults(filter);
		} else if (!!filter.q) {
			this._updateSearchResults(filter);
		}
	},
	// leverage react lifestyles to pre-populate the app state with default data
	componentWillMount() {
	    this._updateFilter();
	},
	// depending on the size of the app and nav structure, this could potentially be moved into a main-layout.jsx file.
	render() {
		return (
			<div className="ApplicationContainer">
				<div className="container">
					<div className="row">
						<div className="col s12 section">
							<FilterForm filter={ this.state.filter } onUpdateFilter={ this._updateFilter } />
						</div>
						<div className="col m10 offset-m1 section">
							<TweetList tweets={ this.state.tweets } />
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
