import axios from "axios"
import React, { Component } from "react"
import { Redirect } from "react-router"
import styles from "./login-styles.css"

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      redirectToDashboard: false,
      username: "",
      tableId: "",
    }

    this.joinTable = this.joinTable.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSubmitToTables = this.handleSubmitToTables.bind(this)
  }

  handleSubmit() {
    // axios.all([`http://localhost:8000/api/users/login/${this.state.username}/`,
    //     `http://localhost:8000/api/table/${this.state.tableId}/join/${this.state.username}/`])
    //     .then(response => {
    //         this.setState({redirect: true});
    //     });
    axios
      .get(`http://localhost:8000/api/users/login/${this.state.username}/`)
      .then((response) => {
        this.joinTable()
      })
      .catch(console.log)
  }

  handleSubmitToTables() {
    axios
      .get(`http://localhost:8000/api/users/login/${this.state.username}/`)
      .then((response) => {
        this.setState({ redirectToDashboard: true })
      })
      .catch(console.log)
  }

  joinTable() {
    axios
      .get(
        `http://localhost:5000/api/table/${this.state.tableId}/join/${this.state.username}/`
      )
      .then((response) => {
        // if (response.data.status === 'ok') {
        setTimeout(() => this.setState({ redirect: true }), 2000)
        // }
      })
      .catch(console.log)
  }

  handleChange(event) {
    const value = event.target.value
    this.setState({
      ...this.state,
      [event.target.name]: value,
    })
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: `/table:${this.state.tableId}`,
            state: {
              username: this.state.username,
              tableId: this.state.tableId,
            },
          }}
        />
      )
    } else if (this.state.redirectToDashboard) {
      return (
        <Redirect
          to={{
            pathname: `/tables`,
            state: {
              username: this.state.username,
            },
          }}
        />
      )
    }
    return (
      <div className={styles.wrapper}>
        <div className={styles.loginWrap}>
          <div className={styles.loginHtml}>
            <div className={styles.signIn}>
              <label className={styles.tab}>Sign In</label>
            </div>
            <div className={styles.loginForm}>
              <div className={styles.signInHtm}>
                <div className={styles.group}>
                  <label className={styles.label}>Username</label>
                  <input
                    type="text"
                    name="username"
                    className={styles.input}
                    value={this.state.username}
                    onChange={this.handleChange}
                  />
                  <button
                    className={styles.button}
                    onClick={this.handleSubmitToTables}
                  >
                    Select Table
                  </button>
                </div>
                <div className={styles.hr}></div>
                <div className={styles.footLnk}>Know Table ID?</div>
                <div className={styles.group}>
                  <label className={styles.label}>Table ID</label>
                  <input
                    type="text"
                    name="tableId"
                    className={styles.input}
                    value={this.state.tableId}
                    onChange={this.handleChange}
                  />

                  <button className={styles.button} onClick={this.handleSubmit}>
                    Join Table
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
