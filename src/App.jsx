import React from 'react';
import './assets/styles/styles.css';
import { AnswersList, Chats } from './components/index';
import { FormDialog } from './components/Forms/index';
import { db } from './firebase/index';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      chats: [],
      currentId: 'init',
      dataset: {},
      open: false,
    };

    this.selectAnswer = this.selectAnswer.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
      case nextQuestionId === 'contact':
        this.handleClickOpen();
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
   * モーダル画面を表示する
   */
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  /**
   * モーダル画面を非表示にする
   */
  handleClose = () => {
    this.setState({ open: false });
  };

  /**
   * firebaseから取得したデータをsetStateする
   */
  initDataset = (dataset) => {
    this.setState({ dataset: dataset });
  };

  /**
   * マウント時に実行されるライフサイクル
   */
  componentDidMount() {
    (async () => {
      const dataset = this.state.dataset;
      await db
        .collection('questions')
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            dataset[doc.id] = doc.data();
          });
        });
      this.initDataset(dataset);
      const initAnswer = '';
      this.selectAnswer(initAnswer, this.state.currentId);
    })();
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
          <FormDialog open={this.state.open} handleClose={this.handleClose} />
        </div>
      </section>
    );
  }
}
