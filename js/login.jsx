var LoginView = React.createClass({
    render: function(){
        return  <div className="login">
                    <h2>APP NAME</h2>
                    <img onClick={this.props.done_login} src="img/fb-login.png"/>
                    <button  onClick={this.props.done_login}>Skip Login</button>
                </div>;
    }
});
