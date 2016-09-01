/// <reference path='./Search.d.ts' />

import * as React from 'react';

import Background from './background/Background';
import Input from './input/Input';
import Popup from './popup/Popup';
import {tokenize, prepareConfig} from './utils/';
import getAdapter from './modifiers/getAdapter';

import './Search.less';

interface SearchProps {
  config: SearchConfig;
}

interface SearchState {
  inputValue?: string;
  cursorLocation?: number;
}

export default class Search extends React.Component<SearchProps, SearchState> {

  state = {
    inputValue: '',
    cursorLocation: -1,
  };

  inputNode: HTMLInputElement = null;
  backgroundNode: HTMLDivElement = null;

  componentDidUpdate = () => {
    this.scrollBackground();
  };

  onBlur = () => {
    this.setCursorLocation(-1);
  };

  onClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLInputElement;

    this.setCursorLocation(target.selectionStart);
  };

  onCut = (e: React.ClipboardEvent) => {
    const target = e.target as HTMLInputElement;

    this.setCursorLocation(target.selectionStart);
    this.setState({
      inputValue: target.value,
    });
  };

  onPaste = (e: React.ClipboardEvent) => {
    const target = e.target as HTMLInputElement;

    this.setCursorLocation(target.selectionStart);
    this.setState({
      inputValue: target.value,
    });
  };

  onKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLInputElement;

    this.setCursorLocation(target.selectionStart);
    if (target.value !== this.state.inputValue) {
      this.setState({
        inputValue: target.value,
      });
    }
  }

  onKeyUp = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLInputElement;

    this.setCursorLocation(target.selectionStart);
    if (target.value !== this.state.inputValue) {
      this.setState({
        inputValue: target.value,
      });
    }
  };

  setCursorLocation(location: number) {
    this.scrollBackground();
    this.setState({
      cursorLocation: location,
    });
  }

  scrollBackground() {
    if (this.backgroundNode
        && this.backgroundNode.scrollLeft !== this.inputNode.scrollLeft) {
      this.backgroundNode.scrollLeft = this.inputNode.scrollLeft;
    }
  }

  isLastTokenSelected() {
    const tokensCount = this.getTokens().length;
    return tokensCount && (tokensCount - 1) === this.getActiveTokenIndex();
  }

  getActiveTokenIndex() {
    const { cursorLocation } = this.state;
    const tokens = this.getTokens();

    let token: Token;
    let prev = 0;
    let start: number;
    let end: number;

    for (var i = 0; i < tokens.length; i++) {
      token = tokens[i];

      start = prev;
      end = token.length + start;
      prev = end;

      if (start < cursorLocation && cursorLocation <= end) {
        return i;
      }
    }
    return -1;
  }

  getActiveToken() {
    const tokens = this.getTokens();
    return tokens[this.getActiveTokenIndex()];
  }

  getTokens() {
    const { config } = this.props;
    const { inputValue } = this.state;

    const tokenConfig = prepareConfig(config);

    return tokenize(inputValue, tokenConfig);
  }

  render() {
    const { config } = this.props;

    const tokens = this.getTokens();
    const isLastTokenSelected = this.isLastTokenSelected();
    const activeToken = this.getActiveToken();

    return (
      <div className='Search'>
        <Input
          nodeRef={node => this.inputNode = node}
          onBlur={this.onBlur}
          onClick={this.onClick}
          onCut={this.onCut}
          onPaste={this.onPaste}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        />
        <Background
          nodeRef={node => this.backgroundNode = node}
          tokens={tokens}
          getAdapter={getAdapter(config)}
          isLastTokenSelected={isLastTokenSelected}
          activeToken={activeToken}
        />
        <Popup
          activeToken={activeToken}
        />
      </div>
    );
  }

}
