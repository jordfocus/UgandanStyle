QuizView = React.createClass({
    getInitialState: function(){
        return {
            question_idx: 0,
            total_correct: 0,
        };
    },
    componentWillReceiveProps: function(props){
        if (props.quiz != this.props.quiz) {
            this.reset_quiz();
        }
    },
    reset_quiz: function() {
        this.setState({
            question_idx: 0,
            total_correct: 0
        });
    },
    next_question: function(answered_correct){
        if (this.state.question_idx == this.props.quiz.questions.length - 1) {
            this.refs.done_view.reset();
        }
        this.setState({
            question_idx: this.state.question_idx + 1,
            total_correct: this.state.total_correct + (answered_correct ? 1 : 0)
        });

    },
    bail: function(){
        this.props.bail();
    },
    render: function(){
        if (!this.props.quiz) return null;
        var question = this.props.quiz.questions[this.state.question_idx];
        var question_blocks = _.map(this.props.quiz.questions, function(question, idx) {
            return (<div className={"top-slide-block " + (idx == this.state.question_idx ? "visible" : "")} key={idx}>
                        <QuestionView question={question} next_question={this.next_question}/>
                        <div className="status">
                            {this.props.quiz.questions.length - this.state.question_idx} to go!
                        </div>
                    </div>);
        }.bind(this));
        return (<div>
                    <div className="questions">{question_blocks}</div>
                    <div className={"top-slide-block done " + (!question ? "visible" : "")} ><DoneQuizView quiz={this.props.quiz} score={this.state.total_correct} retry={this.reset_quiz} bail={this.bail} ref="done_view"/></div>
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
        } else {
            this.setState({
                incorrect: true
            });
        }
    },
    render: function(){
        var options = _.map(this.state.randomized_answers, function(answer, idx){
            var is_correct = this.props.question.answers.indexOf(this.state.randomized_answers[idx]) === 0;
            var a_classes = classNames({
                answer: true,
                show_correct: (this.state.correct || this.state.incorrect) && is_correct,
                show_incorrect: this.state.incorrect && !is_correct
            });
            var show_explanation = is_correct && (this.state.correct || this.state.incorrect);
            var explanation;
            if (show_explanation) {
                explanation = <div className="explanation">{this.props.question.explanation}<div className="next-button" onClick={this.props.next_question.bind(this.props, this.state.correct)}><button>Next</button></div></div>;
            }
            return (<div><div className={a_classes} key={idx} onClick={this.select_answer.bind(this, idx)}>{answer}</div>{explanation}</div>);
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
        if (!this.props.question.details) details_content = null;

        return (<div className={q_classes}><h1 onClick={this.setState.bind(this, {show_details: true}, null)}>{this.props.question.stem}<div className="details">{details_content}</div></h1>{options}</div>);
    }
});

DoneQuizView = React.createClass({
    getInitialState: function(){
        return {};
    },
    allow_continue: function(){
        this.setState({allow_continue: true});
    },
    show_prize: function(){
        this.setState({
            prize: Prizes[Math.floor(Math.random() * Prizes.length)]
        });
        setTimeout(this.allow_continue.bind(this), 1000);
    },
    win_prize: function(){
        // Start wheel spinning or w/e
        setTimeout(this.show_prize.bind(this), 1000)
    },
    reset: function(){
        this.setState({
            prize: null,
            allow_continue: false
        });
    },
    render: function(){
        var pctage = this.props.score / this.props.quiz.questions.length;
        var cutoff_pctage = 0.8;
        var can_win = pctage >= cutoff_pctage;
        var status_block;

        var prize_block;
        if (this.state.prize) {
            prize_block = <div className="prize">{this.state.prize}</div>;
        }

        if (can_win) {
            status_block =  <div onClick={this.win_prize} className="wheel">I AM A ROULETTE WHEEL OR OTHER SOCIALLY ACCEPTABLE GAMBLING DEVICE ASSUMING SUCH A THING EXISTS WHICH IS NOT A SAFE ASSUMPTION WORDS WORDS WORDS {prize_block} <button onClick={this.props.bail} className={"dismiss " + (this.state.allow_continue ? "visible" : "") }>Play Again!</button></div>;
        } else {
            status_block = <div><div className="sad-face">:(</div><div>You need to get at least {Math.ceil(this.props.quiz.questions.length * cutoff_pctage)} questions right to win!<div><button onClick={this.props.retry}>Play again!</button></div></div></div>
        }

        
        return <div><h1>You got {this.props.score}/{this.props.quiz.questions.length}!</h1><div className="status-block">{status_block}</div></div>;
    }
});