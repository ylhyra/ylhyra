# 🎙 Audio

## Audio upload

We currently only support uploading a single audio file. In the future, more files (different speakers, different speed) ought to be supported.

## Audio synchronization

We use [Aeneas](https://github.com/readbeyond/aeneas/) to synchronize audio and text.

### Input

- **Aeneas** requires text to match audio. We strip out elements with the `[data-no-audio]` attribute.
- We strip out IDs except for <word/> and <sentence/>.
- We are using the **`munparsed`** option of Aeneas and will send it the XML.
- Aeneas expects <word/> IDs to start with a `w`, and <sentence/> IDs to start with a `s`. (This can be altered).
- Synchronization can take several minutes.

### Output

The output from Aeneas will be on this format:

```js
{
    fragments: [{
       id: "root",
       children: [{
               id: "s0",
               begin: "0.000",
               end: "4.400",
               children: [{
                       id: "w1",
                       begin: "0.000",
                       end: "1.930",
                   }, {
                       id: "w2",
                       begin: "1.930",
                       end: "2.315",
                   }
               ]
           }
       ]
   }]
}
```

To prevent highlighting very short short words (results in distracting bursts of highlighting), words under 0.3 seconds are merged into their sibling.

The synchronization map is then flattened onto this format to be more manageable:

```js
[
 { begin: 0.000, end: 4.400, id: "s0", },
   { begin: 0.000, end: 1.930, id: "w1",   },
   { begin: 1.930, end: 2.315, id: "w2",   },
]
```

We then merge overlapping time spans:

```js
[
 { begin: 0.000, end: 1.930, elements: ["s0","w1"] },
 { begin: 1.930, end: 2.315, elements: ["s0","w2"] },
 { begin: 2.315, end: 4.400, elements: ["s0"] },
]
```

The reasons for making this merged list:

- The list can be easily accessed without having to loop through it to check if more elements are shown.
- We now know exactly how long until the next event has to be fired.
