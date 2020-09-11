import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import { Spin, Icon as AntIcon } from "antd";
import "./App.scss";

import { setSession } from "./store/actions";

import ProtectedRoute from "./ProtectedRoute";

import Header from "./components/Header";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import NotFound from "./components/NotFound";
import Notes from "./components/notes/Notes";
import NoteView from "./components/notes/NoteView";
import UploadContent from "./components/notes/UploadContent";
import Settings from "./components/Settings";
import AddNote from "./components/notes/AddNote";
import Stats from "./components/Stats";
import { getToken, hasToken } from "./authService";

const antIcon = <AntIcon type="loading" spin />;

// axios.defaults.baseURL = "https://bubblegum-server.herokuapp.com/api/";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL
  ? process.env.REACT_APP_SERVER_URL
  : "http://localhost:7000/api";
axios.defaults.headers.common["authorization"] = getToken();
axios.defaults.headers.common["external-source"] = "NOTES_APP";

const App = ({ setSession, session, appLoading }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAccountActive = async () => {
      if (hasToken()) {
        try {
          const token = getToken();
          const { data } = await axios.post(`/auth/account-status`, { token });
          setSession({ loggedIn: true, info: "ON_LOAD", ...data });
        } catch (err) {
        } finally {
          setTimeout(() => setLoading(false), 300);
        }
      } else setLoading(false);
    };
    isAccountActive();
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="content">
        {!loading && (
          <Switch>
            <Route path="/signup" exact component={Signup} />
            <Route path="/signin" exact component={Signin} />
            <ProtectedRoute
              session={session}
              path="/home"
              exact
              component={Notes}
            />
            <ProtectedRoute
              session={session}
              path="/note/:id"
              exact
              component={NoteView}
            />
            <ProtectedRoute
              session={session}
              path="/upload"
              exact
              component={UploadContent}
            />
            <Route path="/" exact render={() => <Redirect to="/home" />} />
            <Route component={NotFound} />
          </Switch>
        )}
      </div>
      {session && session.loggedIn && (
        <Fragment>
          <AddNote />
          <Stats />
          <Settings />
        </Fragment>
      )}
      {(appLoading || loading) && (
        <div className="spinner">
          <Spin indicator={antIcon} size="large" />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ session, settings, appLoading }) => ({
  session,
  settings,
  appLoading,
});

const mapActionToProps = {
  setSession,
};

export default withRouter(connect(mapStateToProps, mapActionToProps)(App));
