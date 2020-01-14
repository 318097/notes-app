import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Spin, Divider, Switch } from "antd";
import { withRouter, Link } from "react-router-dom";

import { auth } from "../firebase";
import {
  setSession,
  toggleSettingsDrawer,
  setSettings,
  setModalMeta
} from "../store/actions";

import { ProfileIcon } from "../styled";
import Icon from "./Icon";

const antIcon = <Icon type="loading" spin />;

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 10;
  h3 {
    flex: 1 1 auto;
    margin: 0;
    margin-left: 10px;
    text-transform: uppercase;
    transition: 2s;
    font-weight: bold;
    a {
      font-family: LuckiestGuy;
      color: #424242;
      & > span {
        font-family: LuckiestGuy;
        text-decoration: underline;
        font-size: 150%;
        color: #2b2b2b;
      }
    }
  }
  .controls {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }
`;

const UserInfo = styled.div`
  display: flex;
  height: 24px;
  background: #dcdcdc;
  padding: 0px 10px;
  margin: 0;
  margin-right: 6px;
  border-radius: 20px;
  position: relative;
  .username {
    margin: 0;
    margin-right: 9px;
    padding: 0 2px;
    position: relative;
    top: 2px;
    font-size: 13px;
    font-weight: bold;
    font-family: Saira;
  }
`;

const Header = ({ history, dispatch, appLoading, session, settings }) => {
  const signOut = async () => {
    await auth.signOut();
    dispatch(setSession(null));
    return history.push("/signin");
  };

  return (
    <Container>
      <h3>
        <Link to="/home">
          <span>N</span>otes {appLoading && <Spin indicator={antIcon} />}
        </Link>
      </h3>
      {session && (
        <div className="controls">
          <Icon
            label="Home"
            type="home"
            onClick={() => history.push("/home")}
          />
          <Icon
            label="Add Note"
            type="plus"
            onClick={() => dispatch(setModalMeta({ visibility: true }))}
          />
          <Icon
            label="Upload"
            type="upload"
            onClick={() => history.push("/upload")}
          />
          <Divider type="vertical" />
          <div>
            Server{" "}
            <Switch
              loading={!Object.keys(settings).length}
              checked={settings.server === "server"}
              onChange={() =>
                dispatch(
                  setSettings({
                    server:
                      settings.server === "server" ? "localhost" : "server"
                  })
                )
              }
            />
          </div>
          <Divider type="vertical" />
          <UserInfo>
            <div className="username">{session.name}</div>
            <ProfileIcon>
              {session.photoURL ? (
                <img src={session.photoURL} alt="Profile pic" />
              ) : (
                <Icon type="user" />
              )}
            </ProfileIcon>
          </UserInfo>
          <Icon
            label="Settings"
            type="setting"
            onClick={() => dispatch(toggleSettingsDrawer(true))}
          />
          <Icon label="Logout" type="logout" onClick={signOut} />
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = ({ appLoading, session, settings }) => ({
  appLoading,
  session,
  settings
});

export default withRouter(connect(mapStateToProps)(Header));
