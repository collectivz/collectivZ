import React from "react";

import EULAModal from "../components/EULAModal.jsx";
import { Toast } from "../helpers/Toast";
import { openModal } from "../helpers/Modal";
import ToastrStack from "../components/ToastrStack.jsx";
import ModalContainer from "../containers/ModalContainer.jsx";

export default class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.openEULA = this.openEULA.bind(this);
  }

  componentDidUpdate() {
    const {
      errors
    } = this.state;

    if (errors.length > 0) {
      errors.forEach(error => {
        Toast(error, "danger");
      });
      this.setState({
        errors: []
      });
    }
  }

  openEULA(e) {
    e.preventDefault();
    openModal(<EULAModal />, "Contrat de License Utilisateur Final");
  }

  handleSubmit(e) {
    const errors = [];
    const mailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const username = this.refs.username.value;
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const passwordAgain = this.refs.passwordAgain.value;

    e.preventDefault();

    if (!username) {
      errors.push("Entrez un nom d'utilisateur.");
    }
    if (!email) {
      errors.push("Entrez un email.");
    }
    if (!mailRegex.test(email)) {
      errors.push("Entrez un email valide.");
    }
    if (!password || !passwordAgain) {
      errors.push("Entrez et confirmez votre mot de passe.");
    }
    if (password.length < 6) {
      errors.push("Votre mot de passe est trop court.");
    }
    if (password !== passwordAgain) {
      errors.push("Le mot de passe ne correspond pas à la confirmation.");
    }

    if (errors.length) {
      this.setState({
        errors
      });
    } else {
      Accounts.createUser({ email, username, password }, err => {
        if (err) {
          console.log(err);
          this.setState({
            errors: [err.reason]
          });
        } else {
          Meteor.loginWithPassword(username, password, err => {
            if (!err) {
              this.context.router.push("/my-groups");
            }
          });
        }
      });
    }
  }

  render() {
    return (
      <div className="login screen-box center register">
        <div className="center-wrapper">
          <form id="box" onSubmit={this.handleSubmit}>
            <img src="/img/login_logo.svg" width="64" height="64" />
            <h2>CollectivZ</h2>
            <h5>Refaire le monde est donné à tout le monde</h5>
            <fieldset className="large has-icon">
              <i className="icon icon-user" />
              <input
                className="large"
                type="text"
                placeholder="Nom d'utilisateur"
                ref="username"
              />
            </fieldset>
            <fieldset className="large has-icon">
              <i className="icon icon-envelope" />
              <input
                className="large"
                type="text"
                placeholder="Email"
                ref="email"
              />
            </fieldset>
            <fieldset className="large has-icon">
              <i className="icon icon-phone" />
              <input
                className="large"
                type="tel"
                placeholder="Téléphone (optionnel)"
                ref="phone"
                pattern="^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$"
              />
            </fieldset>
            <fieldset className="large has-icon">
              <i className="icon icon-lock" />
              <input
                className="large"
                type="password"
                placeholder="Mot de passe"
                ref="password"
              />
            </fieldset>
            <fieldset className="large has-icon">
              <i className="icon icon-lock" />
              <input
                className="large"
                type="password"
                placeholder="Confirmation mot de passe"
                ref="passwordAgain"
              />
              <h5>
                En cliquant sur "S'enregistrez", vous déclarez avoir lu et accepté les
                {" "}
                <a onClick={this.openEULA}>
                  conditions d'utilisation suivantes.
                </a>
              </h5>
              <input
                type="submit"
                value="S'enregister"
                className="large big success button"
              />
            </fieldset>
          </form>
          <div className="extra-content">
            <a className="lost-password" href="/login"> Déjà inscrit ? </a>
          </div>
        </div>
        <ToastrStack />
        <ModalContainer />

      </div>
    );
  }
}

RegisterPage.contextTypes = {
  router: React.PropTypes.object
};
