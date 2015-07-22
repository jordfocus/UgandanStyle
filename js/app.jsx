AppView = React.createClass({
    getInitialState: function(){
        return {
            view: "quiz",
            quiz: Quizzes.testquiz
        }
    },
    render: function(){
        var viewMap = {
             quiz: <QuizView quiz={this.state.quiz}/>
        };
        return (<div>{viewMap[this.state.view]}</div>);
    }
});
