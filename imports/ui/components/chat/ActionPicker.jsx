import React, { Component, PropTypes } from "react";
import $ from "jquery";

import TouchEvent from "../TouchEvent";

export default class ActionPicker extends Component {
  handleClick(newMode) {
    this.props.changeInputMode(newMode);

    $(".chat-sub-container").stop().animate(
      {
        scrollTop: 10000
      },
      500
    );
  }

  render() {
    return (
      <div className="chat-input-action-picker">
        <TouchEvent
          onClick={this.handleClick.bind(this, "newChannel")}
          class="chat-input-action-picker-item touch-event"
        >
          <i className="icon icon-2x icon-action action-color" />
          <span>Action</span>
        </TouchEvent>
        <TouchEvent
          onClick={this.handleClick.bind(this, "newBuddie")}
          class="chat-input-action-picker-item touch-event"
        >
          <i className="icon icon-2x icon-user people-color" />
          <span>People</span>
        </TouchEvent>
        <TouchEvent
          onClick={this.handleClick.bind(this, "newBeer")}
          class="chat-input-action-picker-item touch-event"
        >
          <i className="icon icon-2x icon-event2 event-color" />
          <span>Event</span>
        </TouchEvent>
        {/*
            <TouchEvent onClick={this.handleClick.bind(this, 'newCoin')} class="chat-input-action-picker-item touch-event">
            <i className="icon icon-2x icon-euro money-color"/>
            <span>Money</span>
            </TouchEvent>
          */
        }
        <TouchEvent
          onClick={this.handleClick.bind(this, "newFeedback")}
          class="chat-input-action-picker-item touch-event"
        >
          <i className="icon icon-2x icon-star feedback-color" />
          <span>Feedback</span>
        </TouchEvent>
        <TouchEvent
          onClick={this.handleClick.bind(this, "newPoll")}
          class="chat-input-action-picker-item touch-event"
        >
          <i className="icon icon-2x icon-pie-chart pollz-color" />
          <span>Poll</span>
        </TouchEvent>
      </div>
    );
  }
}
