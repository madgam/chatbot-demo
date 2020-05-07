import React from 'react';
import List from '@material-ui/core/List';
import { Chat } from './index';

const Chats = (props) => {
  return (
    <List>
      {props.chats.map((chat, index) => {
        return (
          <Chat text={chat.text} type={chat.type} key={index.toString()} />
        );
      })}
    </List>
  );
};

export default Chats;
