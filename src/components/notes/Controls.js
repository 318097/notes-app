import React, { useState, useEffect, Fragment } from "react";
import { Radio, Switch, Input } from "antd";
import styled from "styled-components";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import colors, { Icon } from "@codedrops/react-ui";

import { updateNote } from "../../store/actions";
import { copyToClipboard } from "../../utils";

const ControlsWrapper = styled.div`
  background: white;
  margin-bottom: 8px;
  width: 218px;
  padding: 16px 12px;
  border-radius: 12px;
  border: 1px solid ${colors.shade2};
  box-shadow: 3px 3px 3px ${colors.shade2};
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .hashtag {
    font-size: 1.1rem;
  }
  .slug {
    background: ${colors.primary};
    width: 100%;
    color: white;
    padding: 4px 4px;
    text-align: center;
    border-radius: 4px;
    font-size: 1rem;
    transition: 0.4s;
    cursor: pointer;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      background: ${colors.orchid};
    }
  }
  .empty {
    opacity: 0.8;
    text-align: center;
    font-size: 1rem;
  }
  .resource-id {
    background: ${colors.strokeOne};
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 1rem;
    margin-bottom: 2px;
    cursor: pointer;
    transition: 0.4s;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &:hover {
      background: ${colors.strokeTwo};
    }
  }
  .ant-radio-wrapper {
    font-size: 12px;
  }
`;

const Controls = ({ note, dispatch }) => {
  const [hashtags, setHashtags] = useState("");
  const [liveIdEditor, setLiveIdEditor] = useState(false);

  useEffect(() => {
    if (!note) return;
    const tags = note.tags.map((tag) => `#${tag}`).join(" ");
    setHashtags(`${tags}`);
  }, [note]);

  const updateProperties = async (key, value) =>
    await dispatch(
      updateNote({ _id: note._id, liveId: note.liveId, [key]: value })
    );

  const slugWithUnderscore = note.slug.replace(/-/g, "_");
  const slug = `RDY${note.index}-${slugWithUnderscore}`;
  const slugWithLiveId = `${note.liveId}-${slugWithUnderscore}`;
  const addedDays = moment().diff(moment(note.createdAt), "days");

  const copy = (text) => () => {
    copyToClipboard(text);
  };

  const updateLiveId = (e) => {
    const { value: id } = e.target;
    if (!/^\d+$/.test(id)) return;
    updateProperties("liveId", id);
    setLiveIdEditor(false);
  };

  return (
    <div className="controls">
      <ControlsWrapper>
        <div className="slug" onClick={copy(slug)}>
          {slug}
        </div>
        {!!note.liveId && (
          <div className="slug" onClick={copy(slugWithLiveId)}>
            {slugWithLiveId}
          </div>
        )}
        <div className="header">
          <h4>Resources</h4>
          <Icon
            type="plus"
            size={10}
            onClick={() => dispatch(updateNote(note, "CREATE_RESOURCE"))}
          />
        </div>

        {_.get(note, "resources", []).map((resource) => (
          <div key={resource} className="resource-id" onClick={copy(resource)}>
            {resource}
          </div>
        ))}

        <div className="divider"></div>

        <div className="header">
          <h4>Hashtags</h4>
          <Icon
            type="copy"
            onClick={() => copyToClipboard(hashtags.join(" "))}
          />
        </div>
        <div>
          {hashtags ? (
            <div className="hashtag">{hashtags}</div>
          ) : (
            <div className="empty">No Tags</div>
          )}
        </div>
        <div className="divider"></div>
        <div className="flex align-center">
          <span style={{ marginRight: "4px" }}>Visible</span>
          <Switch
            checked={note && note.visible}
            onChange={(value) => updateProperties("visible", value)}
          />
        </div>
      </ControlsWrapper>
      <ControlsWrapper>
        <div>
          <div className="header">
            <h4>Status</h4>
            {note.liveId && (
              <Fragment>
                {liveIdEditor ? (
                  <Input
                    style={{ width: "30px", height: "18px", fontSize: "1rem" }}
                    size="small"
                    defaultValue={note.liveId}
                    onBlur={updateLiveId}
                  />
                ) : (
                  <span
                    style={{ cursor: "pointer" }}
                    onDoubleClick={() => setLiveIdEditor(true)}
                    className="state"
                  >{`Live Id: ${note.liveId}`}</span>
                )}
              </Fragment>
            )}
          </div>
          <Radio.Group
            onChange={({ target: { value } }) =>
              updateProperties("status", value)
            }
            value={note && note.status}
          >
            {["DRAFT", "READY", "POSTED"].map((state) => (
              <Radio className="radio-box" key={state} value={state}>
                {state}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </ControlsWrapper>
      <ControlsWrapper>
        <div>
          <div className="header">
            <h4>Social status</h4>
          </div>
          <Radio.Group
            onChange={({ target: { value } }) =>
              updateProperties("socialStatus", value)
            }
            value={(note && note.socialStatus) || "NONE"}
          >
            {["NONE", "READY", "POSTED"].map((state) => (
              <Radio className="radio-box" key={state} value={state}>
                {state}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </ControlsWrapper>
      <ControlsWrapper>
        <div>Added: {addedDays ? `${addedDays} days ago` : "Today"}</div>
      </ControlsWrapper>
    </div>
  );
};

export default connect()(Controls);
