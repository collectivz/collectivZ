import React from 'react';
import classNames                       from 'classnames';

export default class AvatarRow extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {

    let avatars = this.props.avatars;
    let numberOfUsers = this.props.avatars.length;
    let hasToMuchUsers = false;
    if (numberOfUsers >= 4) {
      avatars = avatars.slice(0, 2);
      numberOfUsers -= 3;
      hasToMuchUsers = true;
    }

    return (
      <div className={classNames("user-list", {"large": this.props.isLarge})}>
        {
          avatars.map((avatar, index) => {
            return (<div className="user-tag only-circle" key={index}><img src={avatar}/></div>);
          })
        }
        {
          hasToMuchUsers ? <div className="user-tag only-circle"><span>{numberOfUsers}</span></div> : ""
        }
      </div>
    );
  }
}