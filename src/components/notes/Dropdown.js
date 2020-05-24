import React from "react";
import styled from "styled-components";
import { Icon } from "@codedrops/react-ui";
import { Popconfirm } from "antd";

const DropdownWrapper = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  .dropdown {
    display: flex;
    flex-direction: column;
    position: absolute;
    padding: 2px;
    right: 0px;
    top: 24px;
    border-radius: 15px;
    & > * {
      margin: 2px 0;
    }
  }
`;

const Dropdown = ({ showDropdown, setShowDropdown, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit();
    setShowDropdown(false);
  };

  const handleDelete = () => {
    onDelete();
    setShowDropdown(false);
  };

  const handleDropdownClick = (event) => {
    event.stopPropagation();
    setShowDropdown((prevState) => !prevState);
  };

  return (
    <DropdownWrapper className="dropdown-wrapper">
      <Icon
        className="dropdown-icon"
        type="menu-2"
        onClick={handleDropdownClick}
      />
      {showDropdown && (
        <div className="dropdown" onClick={(event) => event.stopPropagation()}>
          {/* <Icon onClick={handleFavorite} type="heart" /> */}
          <Icon onClick={handleEdit} type="edit" />
          <Popconfirm
            title="Delete?"
            onConfirm={handleDelete}
            placement="right"
            okText="Yes"
            cancelText="No"
          >
            <Icon type="delete" />
          </Popconfirm>
        </div>
      )}
    </DropdownWrapper>
  );
};

export default Dropdown;
