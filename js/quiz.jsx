QuizView = React.createClass({
    getInitialState: function(){
        return {
            question_idx: 0
        };
    },
    next_question: function(){
        if (this.state.question_idx == this.props.quiz.questions.length - 1) {
            this.props.done_quiz(); // w/ score...
            return;
        }

        this.setState({
            question_idx: this.state.question_idx + 1
        });
    },
    render: function(){
        var question = this.props.quiz.questions[this.state.question_idx];
        return (<div className="question">
                    <QuestionView question={question} next_question={this.next_question}/>
                    <div className="status">
                        {this.props.quiz.questions.length - this.state.question_idx} to go!
                    </div>
                </div>);
    }
});

QuestionView = React.createClass({
    getInitialState: function(){
        return {
            correct: false,
            incorrect: false
        };
    },
    componentDidMount: function(){
        this.randomize_answers();
    },
    componentWillReceiveProps: function(props) {
        this.randomize_answers(props);
    },
    randomize_answers: function(props){
        props = props || this.props;
        this.setState({
            randomized_answers: _.shuffle(props.question.answers),
            correct: false,
            incorrect: false,
            show_details: false
        });
    },
    select_answer: function(idx) {
        if (this.state.correct || this.state.incorrect) return;
        var correct = this.props.question.answers.indexOf(this.state.randomized_answers[idx]) === 0;

        if (correct) {
            this.setState({
                correct: true
            });
            setTimeout(function(){
                this.props.next_question();
            }.bind(this), 1000);
        } else {
            this.setState({
                incorrect: true
            });
            // Show them what they got wrong...?
            setTimeout(function(){
                this.props.next_question();
            }.bind(this), 5000);
        }
    },
    render: function(){
        var options = _.map(this.state.randomized_answers, function(answer, idx){
            var is_correct = this.props.question.answers.indexOf(this.state.randomized_answers[idx]) === 0;
            var a_classes = classNames({
                answer: true,
                show_correct: (this.state.correct || this.state.incorrect) && is_correct,
                show_incorrect: this.state.incorrect && !is_correct
            })
            return (<div className={a_classes} key={idx} onClick={this.select_answer.bind(this, idx)}>{answer}</div>);
        }.bind(this));

        var q_classes = classNames({
            show_correct: this.state.correct,
            show_incorrect: this.state.incorrect
        })

        var details_content;
        if (!this.state.show_details) {
            details_content = "(tap for more)"
        } else {
            details_content = this.props.question.details;
        }

        return (<div className={q_classes}><h1 onClick={this.setState.bind(this, {show_details: true})}>{this.props.question.stem}<div className="details">{details_content}</div></h1>{options}</div>);
    }
});
