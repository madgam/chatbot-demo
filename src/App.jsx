import React, { useState, useEffect, useCallback } from 'react';
import './assets/styles/styles.css';
import { AnswersList, Chats } from './components/index';
import { FormDialog } from './components/Forms/index';
import { db } from './firebase/index';

const App = () => {
  const [answers, setAnswers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState('init');
  const [dataset, setDataset] = useState({});
  const [open, setOpen] = useState(false);

  /**
   * 次の質問を表示する
   */
  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    addChats({
      text: nextDataset.question,
      type: 'question',
    });

    setAnswers(nextDataset.answers);
    setCurrentId(nextQuestionId);
  };

  /**
   * 回答を選択する
   * 子コンポーネントでも実行する
   */
  const selectAnswer = (seletedAnswer, nextQuestionId) => {
    switch (true) {
      // 問い合わせフォーム
      case nextQuestionId === 'contact':
        handleClickOpen();
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
        addChats({
          text: seletedAnswer,
          type: 'answer',
        });

        setTimeout(
          () => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]),
          500
        );
        break;
    }
  };

  const addChats = (chat) => {
    setChats((prevChats) => {
      return [...prevChats, chat];
    });
  };

  /**
   * モーダル画面を表示する
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * モーダル画面を非表示にする
   */
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  /**
   * マウント時に実行されるライフサイクル
   */
  useEffect(() => {
    (async () => {
      const initDataset = {};
      await db
        .collection('questions')
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            initDataset[doc.id] = doc.data();
          });
        });

      setDataset(initDataset);
      displayNextQuestion(currentId, initDataset[currentId]);
    })();
  }, []);

  /**
   * 更新時に実行されるライフサイクル
   */
  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  });

  return (
    <section className='c-section'>
      <div className='c-box'>
        <Chats chats={chats} />
        <AnswersList answers={answers} select={selectAnswer} />
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  );
};

export default App;
