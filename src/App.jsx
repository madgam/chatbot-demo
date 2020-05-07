import React from 'react';
import defaultDataset from './dataset';
import './assets/styles/styles.css';
import { AnswersList, Chats } from './components/index';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      chats: [],
      currentId: 'init',
      dataset: defaultDataset,
      open: false,
    };
    this.selectAnswer = this.selectAnswer.bind(this);
  }

  /**
   * 次の質問を表示する
   */
  displayNextQuestion = (nextQuestionId) => {
    const chats = this.state.chats;
    chats.push({
      text: this.state.dataset[nextQuestionId].question,
      type: 'question',
    });

    this.setState({
      answers: this.state.dataset[nextQuestionId].answers,
      chats: chats,
      currentId: nextQuestionId,
    });
  };

  /**
   * 回答を選択する
   * 子コンポーネントでも実行する
   */
  selectAnswer = (seletedAnswer, nextQuestionId) => {
    switch (true) {
      // 初期表示
      case nextQuestionId === 'init':
        setTimeout(() => this.displayNextQuestion(nextQuestionId), 500);
        break;
      // 外部リンク
      case /^https:*/.test(nextQuestionId):
        const a = document.createElement('a');
        a.href = nextQuestionId;
        a.target = '_brank';
        a.click();
        break;
      // 初期表示以降のアクション
      default:
        const chats = this.state.chats;
        chats.push({
          text: seletedAnswer,
          type: 'answer',
        });

        this.setState({ chats: chats });
        setTimeout(() => this.displayNextQuestion(nextQuestionId), 500);
        break;
    }
  };

  /**
   * マウント時に実行されるライフサイクル
   */
  componentDidMount() {
    const initAnswer = '';
    this.selectAnswer(initAnswer, this.state.currentId);
  }

  /**
   * 更新時に実行されるライフサイクル
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }

  render() {
    return (
      <section className='c-section'>
        <div className='c-box'>
          <Chats chats={this.state.chats} />
          <AnswersList
            answers={this.state.answers}
            select={this.selectAnswer}
          />
        </div>
      </section>
    );
  }
}
