import React, { Component } from "react";
import styled from "styled-components";
import Emoji from "documents/Render/Elements/Vocabulary/Types/Gender";

const border = "1px solid #dedede;";
const radius = "3px";
export const Table = styled.table`
  border-spacing: 0;
  margin: auto;
  margin-bottom: 10px;
  margin-right: 10px;
  text-align: center;
  margin: auto;
  font-size: 15px;
  th {
    text-align: center;
    label {
      font-size: 12px;
      font-weight: normal;
      b {
        font-weight: 500;
        text-align: left;
        padding: 0;
      }
    }
  }
  th:not(:empty):not(.checkbox) {
    background: #e7e7e7;
  }
  td {
    font-size: 14px;
    background: #f2f2f2;
    color: #323232;
    padding: 7px 12px;
    min-width: 80px;
    white-space: nowrap;
    small {
      font-size: inherit;
      font-weight: 400;
      color: #525252;
      padding-right: 1px;
    }
    b {
      ${"" /* font-weight: 800; */}
      font-weight: inherit;
      border-bottom: 1px solid #bababa;
    }
    &.main {
      position: relative;
      box-shadow: 0 0 0 3px #1e8ed5, inset 0 0 0 1px #1e8ed5;
      border: none !important;
      background: white;
      top: 1px;
      left: 1px;
      z-index: 100;
      border-radius: 3px;
      font-size: 19px;
      font-weight: 500;
      padding: 10px 22px;
      color: black;
    }
  }
  + h3 {
    clear: left;
    padding-top: 20px;
  }
  + hr {
    clear: left;
  }

  td,
  th:not(:empty) {
    border-top: ${border};
    border-left: ${border};
    &:last-child {
      border-right: ${border};
    }
    &.first-top {
      border-top: ${border};
      border-top-left-radius: ${radius};
    }
    &.first-left {
      border-left: ${border};
      border-top-left-radius: ${radius};
    }
  }
  tbody:first-child {
    tr:first-child {
      th,
      td {
        &:not(:empty) {
          &:first-child {
            border-top-left-radius: ${radius};
          }
          &:last-child {
            border-top-right-radius: ${radius};
          }
        }
      }
    }
  }
  tbody:last-child {
    tr:last-child {
      th,
      td {
        &:not(:empty) {
          border-bottom: ${border};
          &:first-child {
            border-bottom-left-radius: ${radius};
          }
          &:last-child {
            border-bottom-right-radius: ${radius};
          }
        }
      }
    }
  }
  .helper {
    font-size: 12px;
    color: #5b5b5b;
    font-weight: normal;
  }
`;
const Cell = styled.td`
  ${(p) =>
    (p.importance === 1 || p.importance === 2) &&
    `
    font-weight: 700;
    box-shadow: inset 0 0 0 3px #6c8de3;
    background: white;
  `}
  ${(p) =>
    !p.importance &&
    `
    font-weight: 500;
  `}
  ${(p) =>
    p.importance === -1 &&
    `
    span {
      opacity: 0.7;
    }
    background: #ededed;
  `}
`;

class Element extends Component {
  render() {
    const { table } = this.props;
    // console.log(table)
    return (
      <Table>
        <tbody>
          {table.map((row, a) => (
            <tr key={a}>
              {row.map((cell, b) => {
                if (cell === null) return <th key={b} />;

                let className;
                if (table[a - 1] && table[a - 1][b] === null) {
                  className = "first-top";
                }
                if (table[a][b - 1] === null) {
                  className = "first-left";
                }

                if (cell.type && cell.type === "emoji") {
                  // console.log(cell)
                  return (
                    <th
                      key={b}
                      className={className}
                      colSpan={cell.colspan || 1}
                      rowSpan={cell.rowspan || 1}
                    >
                      <Emoji {...cell} smaller />
                    </th>
                  );
                }
                return (
                  <Cell
                    key={b}
                    importance={cell.importance}
                    className={className}
                    colSpan={cell.colspan || 1}
                    rowSpan={cell.rowspan || 1}
                  >
                    <span>{checkForBrackets(cell.value)}</span>
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
export default Element;

/*
  Checks for "[hér er] kötturinn [minn]"
*/
const checkForBrackets = (input) => {
  // const match = input.match(/\[(.*?)\] (.*)/)
  // if(match) {
  //   return (
  //     <span>
  //       <span className="helper">{match[1]}</span> {match[2]}
  //     </span>
  //   )
  // }
  // console.log(input)
  if (!input) return null;
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: input
          // .trim()
          .replace(/\[(.*?)\]/g, '<span className="helper">$1</span>')
          // .replace(/^að /g, '<span className="helper">að</span> ')
          // TEMP
          .replace("hann/hún/það", "hann")
          .replace("þeir/þær/þau", "þeir")
          .replace("hann/hana/það", "hann")
          .replace("þá/þær/þau", "þá")
          .replace("honum/henni/því", "honum")
          .replace("he/she/it", "he"),
      }}
    />
  );
};
