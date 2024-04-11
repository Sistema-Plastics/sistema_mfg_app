import styled from "styled-components";

export const MyScrollableLane = styled.div`
  flex: 1;
  overflow-y: auto;
  width: 200px;
  overflow-x: hidden;
  align-self: center;
  ${"" /* max-height: 100%; */}
  margin-top: 10px;
  flex-direction: column;
  justify-content: flex-start;
`;
export const MyDBScrollableLane = styled.div`
  flex: 1;
  overflow-y: auto;
  width: 300px;
  overflow-x: hidden;
  align-self: center;
  ${"" /* max-height: 100%; */}
  margin-top: 10px;
  flex-direction: column;
  justify-content: flex-start;
`;
export const loaderStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
};
