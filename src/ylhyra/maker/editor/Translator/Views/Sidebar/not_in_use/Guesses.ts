// const classes = {}
//
// const Guesses = styled.div `
//   .beyging {
//     .version {
//       text-align: center;
//       margin-bottom: 4px;
//       margin-top: 4px;
//       font-size: 17px;
//       line-height: 1em;
//       small {
//         font-size: 12px;
//         color: #7e7e7e;
//       }
//     }
//     .possibility {
//       cursor: pointer;
//       margin: 0;
//       padding: 0;
//       .grammar {
//         display: inline-block;
//         padding: 1px 6px;
//         margin-left: 1px;
//         margin-bottom: 2px;
//         border: 1px solid #b5b5b5;
//         background: #dadada;
//         font-size: 12px;
//         border-radius: 10px;
//         &:nth-child(2) {
//           font-weight: bold;
//         }
//       }
//       &:hover .grammar {
//         background: #79b9e2;
//         border: 1px solid #458bb8;
//       }
//       &:active .grammar {
//         background: #6aa7cf!important;
//       }
//       input:checked ~ .grammar {
//         background: #79b9e2;
//         border: 1px solid #458bb8;
//       }
//       .okay_match ~ .grammar {
//         border: 1px solid #254355!important;
//       }
//     }
//   }
//   .engin_beyging {
//     text-align: center;
//     font-weight: bold;
//     font-size: 11px;
//     margin-top: 12px;
//     cursor: pointer;
//     text-decoration: underline;
//   }
//   input {
//     display: none;
//   }
// `
//
// const printGrammarNames = (input) => (
//   input.split('-').map((part, index) => (
//     <span className="grammar" key={index}>
//       {[1].map(x=> {
//         for(const name in classes) {
//           if(classes[name] === part)
//           return name
//         }
//         return part}
//       )}
//     </span>
//   ))
// )
//
//
// /*
//   Loops through the Parsed Tree and finds the selected words
// */
// const findSelectedWords = (input, selected) => {
//   if (Array.isArray(input)) {
//     return input.map(i => {
//       switch (i.type) {
//         case 'sentence':
//         case 'tag':
//           return findSelectedWords(i.data, selected)
//         case 'word':
//           if (_.contains(selected, i.id))  {
//             return i.data
//             // return {
//             //   id: i.id,
//             //   word: i.data,
//             // }
//           }
//           return null
//         default:
//           return null
//       }
//     }).filter(item => item !== undefined && item !== null).reduce(
//       (prev, cur) => prev.concat(cur), [] // Merge the results
//     );
//   }
// }
