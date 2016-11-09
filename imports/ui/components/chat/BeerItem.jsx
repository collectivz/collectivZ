import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import BeerEdit         from './BeerEdit';
import DropDownBottom         from '../DropDownBottom';
import AvatarRowContainer from '../../containers/AvatarRowContainer';
import { Toast }         from '../../helpers/Toast';
import { openModal }         from '../../helpers/Modal';

export default class BeerItem extends React.Component {

  constructor(props) {
    super(props);

    this.joinBeer = this.joinBeer.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.deleteBeer = this.deleteBeer.bind(this);
  }

  joinBeer() {
    Meteor.call('beers.join', this.props.beer._id, (err, res) => {
      if (err) {
        Toast(err.reason, "danger")
      } else {
        Toast("Vous avez rejoins l'événement.", "success");
      }
    });
  }

  openEdit() {
    const {
      beer
    } = this.props;
    const component = <BeerEdit beer={beer}/>;
    openModal(component, "Modifier l'événement.");
  }

  deleteBeer() {
    const {
      beer
    } = this.props;

    Meteor.call('beers.delete', beer._id);
  }

  showMembers() {
    const { members } = this.props;
    const membersNodes = members.map(function(member) {
      return (
        <div key={member._id}>
          {member.username}
        </div>
      );
    }, this);
    return membersNodes;
  }

  participate () {

    const { beer } = this.props;

    if (beer && _.contains(beer.members, Meteor.userId())) {
      return (
        <div className="beer-participate">
          <div className="success-box">
            <h4><i className="icon icon-check"/>Vous participez !</h4>
            <AvatarRowContainer userIds={beer.members} />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="beer-participate">
          <div className="button-box">
            <button onClick={this.joinBeer}>Participer {beer.members.length}</button>
            <AvatarRowContainer userIds={beer.members} />
          </div>
        </div>
      );
    }
  }

  render() {

    const {
      beer,
      user
    } = this.props;

    return (
      <div className="chat-special-bubble chat-special-bubble-beer">
          <div className="bubble-content">
              <div className="bubble-header">
                <p>{user.username} à lancé un événement :</p>
                <h4><i className="icon icon-event-color icon-event2"/> {beer.occasion}</h4>
                {
                  (beer.author === user._id || user.isAdmin) ?
                    <DropDownBottom>
                      <ul>
                        <li><a className="drop-down-menu-link" onClick={this.deleteBeer}> Supprimer l'événement </a></li>
                        <li><a className="drop-down-menu-link" onClick={this.openEdit}> Modifier l'événement </a></li>
                      </ul>
                    </DropDownBottom>
                  : ''
                }
              </div>
              <div className="bubble-content-text">
                <h4><i className="icon icon-earth"/><span>Lieu</span> {beer.place}</h4>
                <h4><i className="icon icon-calendar-full"/><span>Date</span> {beer.date}</h4>
                {this.participate()}
              </div>
          </div>
      </div>
    );
  }
}
