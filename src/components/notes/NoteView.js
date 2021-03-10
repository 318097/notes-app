/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { Tag } from "antd";
import _ from "lodash";
import colors, { Card, Icon } from "@codedrops/react-ui";
import Controls from "./Controls";
import { getNoteById, setModalMeta } from "../../store/actions";
import { md, copyToClipboard } from "../../utils";
import { fadeInDownAnimation } from "../../animations";
import queryString from "query-string";

const Wrapper = styled.div`
  padding-top: 20px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 8px;
  .controls.left {
    grid-column: 3/4;
  }
  .card {
    overflow: hidden;
    animation: 0.2s ${fadeInDownAnimation};
    height: 78vh;
    width: 100%;
    padding: 30px 0;
    grid-column: 4/10;
    display: flex;
    background: white;
    border-radius: 15px;
    flex-direction: column;
    border: 1px solid ${colors.bg};
    box-shadow: ${colors.bg} 3px 3px 3px;
    .card-content {
      overflow-y: auto;
      overflow-x: hidden;
    }
    .title {
      text-align: center;
      font-size: 2rem;
      padding: 0 20px 20px;
      color: ${colors.steel};
    }
    .content {
      flex: 1 1 auto;
      overflow: auto;
      padding: 0 20px 20px;
    }
    .chain-wrapper {
      padding: 0 20px;
      .chain-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;
        .chain-item-id {
          background: ${colors.strokeOne};
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          min-width: 22px;
          height: 22px;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.4s;
          margin-right: 10px;
          position: relative;
          top: 3px;
        }
        .chain-item-title {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        .chain-item-subtext {
          font-size: 0.8rem;
          color: ${colors.bar};
        }
      }
    }
    .tags {
      padding: 0 20px;
    }
    .quiz-solution {
      background: ${colors.bg};
      border: 1px solid ${colors.strokeTwo};
      margin: 0 20px 20px;
      padding: 10px;
      border-radius: 4px;
      p {
        margin: 0;
      }
    }
    .url {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      font-size: 1rem;
      padding: 0 20px;
      a {
        color: ${colors.steel};
      }
      a:hover {
        text-decoration: underline;
      }
    }
    .back-icon {
      position: absolute;
      top: 2px;
      left: 3px;
      z-index: 10;
    }
    .edit-icon {
      position: absolute;
      right: 8px;
      bottom: 6px;
    }
    .copy-icon {
      position: absolute;
      top: 4px;
      left: -10px;
      transition: 0.3s;
      &.url-copy-icon {
        top: -8px;
      }
      &:hover {
        left: -4px;
      }
    }
    .index {
      position: absolute;
      top: 8px;
      right: 16px;
      color: ${colors.strokeTwo};
      font-size: 1rem;
    }
    .canonical-url {
      position: absolute;
      bottom: 8px;
      left: 20px;
      font-size: 0.9rem;
      max-width: 80%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
      transition: all 0.4s;
      &:hover {
        color: ${colors.orchid};
      }
    }
  }
  .controls.right {
    grid-column: 10/11;
  }
  .previous-icon {
    grid-column: 2;
    position: relative;
    .prev {
      right: 9px;
    }
  }
  .next-icon {
    grid-column: 11;
    position: relative;
    .next {
      transform: rotate(180deg);
      left: 9px;
    }
  }
  .prev,
  .next {
    color: ${colors.strokeTwo};
    top: 220px;
    position: absolute;
  }
  @media (max-width: 1024px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    height: 100%;
    padding: 20px 28px;
    overflow: auto;
    .card {
      order: -1;
      margin-bottom: 8px;
    }
    .controls.left,
    .controls.right {
      flex: 0 0 46%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 4px;
    }
    .previous-icon,
    .next-icon {
      display: none;
    }
  }
`;

const NoteView = ({
  dispatch,
  match,
  viewNote,
  history,
  chains,
  location,
  appLoading,
  viewNoteMeta,
}) => {
  const { nextNote, previousNote } = viewNoteMeta || {};

  useEffect(() => {
    return () => {
      const codeblocks = document.querySelectorAll(".content pre");
      codeblocks.forEach((block) => {
        block.removeEventListener("click", copyCodeToClipboard, false);
      });
    };
  }, []);

  useEffect(() => {
    dispatch(getNoteById(match.params.id));
  }, [match.params.id]);

  useEffect(() => {
    if (_.isEmpty(viewNote)) return;

    const codeblocks = document.querySelectorAll(".content pre");
    codeblocks.forEach((block) => {
      block.addEventListener("click", copyCodeToClipboard, false);
    });
  }, [viewNote]);

  const copyCodeToClipboard = (e) => {
    e.stopPropagation();
    const code = e.target.textContent;
    if (!code) return;
    copyToClipboard(code);
  };

  const handleEdit = () =>
    dispatch(
      setModalMeta({
        selectedNote: viewNote,
        mode: "edit",
        visibility: true,
      })
    );

  const goBack = () => {
    const parsed = queryString.parse(location.search);
    history.push(parsed.src ? `/note/${parsed.src}` : "/home");
  };

  const navigateNote = (newPosition) => {
    const newNoteId = newPosition > 0 ? nextNote : previousNote;
    if (newNoteId) history.push(`/note/${newNoteId}`);
  };

  const goToPost = (id, src) => history.push(`/note/${id}?src=${src}`);

  if (_.isEmpty(viewNote)) return null;

  const {
    title,
    content = "",
    tags,
    index,
    type,
    solution,
    slug,
    status,
    chainedPosts = [],
    _id,
    url,
  } = viewNote || {};

  const canonicalURL = `https://www.codedrops.tech/posts/${slug}`;
  return (
    <Wrapper>
      {previousNote && (
        <div className="previous-icon">
          <Icon
            size={40}
            className="prev icon-bg"
            onClick={() => (appLoading ? null : navigateNote(-1))}
            type="caret-left"
          />
        </div>
      )}
      <Controls
        note={viewNote}
        view="left"
        chains={chains}
        goToPost={goToPost}
      />
      <Card>
        <div className="card-content">
          <div className="relative">
            <h3
              className="title"
              dangerouslySetInnerHTML={{ __html: md.renderInline(title) }}
            />
            {title && (
              <Icon
                className="copy-icon icon icon-bg"
                type="copy"
                onClick={() => copyToClipboard(title)}
              />
            )}
          </div>
          {type === "CHAIN" && (
            <div className="chain-wrapper">
              {chainedPosts.map((post, index) => (
                <div className="chain-item" key={post._id}>
                  <div className="chain-item-id">{index + 1}</div>
                  <div className="flex column">
                    <h4
                      className="chain-item-title"
                      onClick={() => goToPost(post._id, _id)}
                    >
                      {post.title}
                    </h4>
                    <div className="chain-item-subtext">
                      {`Index: ${post.index}`}
                      {post.liveId && ` | Live Id: ${post.liveId}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!!content && (
            <div style={{ flex: "1" }} className="relative">
              <div
                className="content"
                dangerouslySetInnerHTML={{
                  __html: md.render(content),
                }}
              ></div>
              <Icon
                type="copy"
                className="copy-icon icon icon-bg"
                onClick={() => copyToClipboard(content)}
              />
            </div>
          )}

          {type === "QUIZ" && solution && (
            <div
              className="quiz-solution"
              dangerouslySetInnerHTML={{
                __html: md.render(solution),
              }}
            />
          )}

          {url && (
            <div className="relative" style={{ marginBottom: "20px" }}>
              <div className="url">
                <span style={{ color: colors.orange }}>URL: </span>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </div>
              <Icon
                className="copy-icon url-copy-icon icon icon-bg"
                type="copy"
                onClick={() => copyToClipboard(url)}
              />
            </div>
          )}

          <div className="tags">
            {tags.map((tag, index) => (
              <Tag key={index}>{tag.toUpperCase()}</Tag>
            ))}
          </div>
        </div>

        <Icon
          className="back-icon icon icon-bg"
          onClick={goBack}
          type="caret-left"
        />
        <Icon
          size={12}
          onClick={handleEdit}
          className="edit-icon icon icon-bg"
          type="edit"
        />
        {!!index && <span className="index">{`#${index}`}</span>}
        {status === "POSTED" && (
          <div
            className="canonical-url"
            onClick={() => copyToClipboard(canonicalURL)}
          >
            {canonicalURL}
          </div>
        )}
      </Card>
      <Controls
        note={viewNote}
        view="right"
        chains={chains}
        goToPost={goToPost}
      />
      {nextNote && (
        <div className="next-icon">
          <Icon
            size={40}
            className="next icon-bg"
            onClick={() => (appLoading ? null : navigateNote(1))}
            type="caret-left"
          />
        </div>
      )}
    </Wrapper>
  );
};

const mapStateToProps = ({ viewNote, chains, appLoading, viewNoteMeta }) => ({
  viewNote,
  chains,
  appLoading,
  viewNoteMeta,
});

export default withRouter(connect(mapStateToProps)(NoteView));
