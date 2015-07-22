AppView = React.createClass({
    getInitialState: function(){
        return {
            view: "dashboard"
        }
    },
    start_quiz: function(quiz_obj){
        this.setState({
            view: "quiz",
            quiz: quiz_obj
        });
        this.refs.quiz_view.reset_quiz();
    },
    render: function(){
        var viewMap = {
             quiz: <QuizView quiz={this.state.quiz} bail={this.setState.bind(this, {view: "dashboard"}, null)} ref="quiz_view"/>,
             dashboard: <DashboardView start_quiz={this.start_quiz}/>
        };
        var all_views = _.map(viewMap, function(item, k) {
            var wrapper = <div key={k} className={"view-wrapper " + (k == this.state.view ? "active" : "")}>{item}</div>;
            return wrapper;
        }.bind(this));
        return (<div>{all_views}</div>);
    }
});
